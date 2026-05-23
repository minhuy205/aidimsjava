package com.aidims.aidimsbackend.service;

import com.aidims.aidimsbackend.dto.DicomAnalysisResponse.DicomMetadata;
import org.dcm4che3.data.Attributes;
import org.dcm4che3.data.Tag;
import org.dcm4che3.data.UID;
import org.dcm4che3.io.DicomInputStream;
import org.springframework.stereotype.Service;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.Base64;
import java.util.Iterator;

@Service
public class DicomConverterService {

    /**
     * Đọc DICOM bytes, trả về:
     *  [0] base64 JPEG string (không prefix)
     *  [1] DicomMetadata object
     */
    public ConvertResult convert(byte[] dicomBytes) throws Exception {
        // ── 1. Đọc metadata bằng dcm4che3 DicomInputStream ──────────────
        DicomMetadata meta = new DicomMetadata();
        Attributes attrs;
        try (DicomInputStream dis = new DicomInputStream(
                new ByteArrayInputStream(dicomBytes))) {
            attrs = dis.readDataset();
        }

        meta.setPatientId(         safe(attrs, Tag.PatientID));
        meta.setPatientName(       safe(attrs, Tag.PatientName));
        meta.setPatientBirthDate(  safe(attrs, Tag.PatientBirthDate));
        meta.setPatientSex(        safe(attrs, Tag.PatientSex));
        meta.setModality(          safe(attrs, Tag.Modality));
        meta.setBodyPart(          safe(attrs, Tag.BodyPartExamined));
        meta.setStudyDescription(  safe(attrs, Tag.StudyDescription));
        meta.setSeriesDescription( safe(attrs, Tag.SeriesDescription));
        meta.setStudyDate(         safe(attrs, Tag.StudyDate));
        meta.setInstitutionName(   safe(attrs, Tag.InstitutionName));
        meta.setManufacturer(      safe(attrs, Tag.Manufacturer));
        meta.setBitsAllocated(     safe(attrs, Tag.BitsAllocated));
        meta.setKvp(               safe(attrs, Tag.KVP));
        meta.setExposureTime(      safe(attrs, Tag.ExposureTime));

        int rows    = attrs.getInt(Tag.Rows, 0);
        int cols    = attrs.getInt(Tag.Columns, 0);
        meta.setImageSize(rows + " x " + cols);

        // ── 2. Đọc pixel data bằng ImageIO (dcm4che-imageio SPI) ────────
        BufferedImage image;
        try (ByteArrayInputStream bais = new ByteArrayInputStream(dicomBytes)) {
            javax.imageio.stream.ImageInputStream iis = ImageIO.createImageInputStream(bais);
            Iterator<javax.imageio.ImageReader> readers = ImageIO.getImageReaders(iis);
            if (!readers.hasNext()) {
                throw new RuntimeException(
                    "Không tìm thấy DICOM ImageReader — kiểm tra dcm4che-imageio trong pom.xml");
            }
            javax.imageio.ImageReader reader = readers.next();
            reader.setInput(iis);
            image = reader.read(0);
            reader.dispose();
        }

        if (image == null) {
            throw new RuntimeException("Không thể giải mã hình ảnh từ tệp DICOM (Định dạng pixel không được hỗ trợ hoặc thiếu bộ giải mã)");
        }

        // ── 3. Normalize + convert sang RGB ─────────────────────────────
        image = normalizeToRgb(image);

        // ── 4. Encode JPEG quality 92% ───────────────────────────────────
        String base64 = encodeJpeg(image, 0.92f);

        return new ConvertResult(base64, meta);
    }

    // ── helpers ─────────────────────────────────────────────────────────

    private String safe(Attributes attrs, int tag) {
        try {
            String v = attrs.getString(tag);
            return (v != null && !v.isBlank()) ? v.trim() : "N/A";
        } catch (Exception e) {
            return "N/A";
        }
    }

    private BufferedImage normalizeToRgb(BufferedImage src) {
        int w = src.getWidth(), h = src.getHeight();

        // Lấy tất cả pixel (grayscale có 1 band, RGB có 3 bands)
        int numBands = src.getRaster().getNumBands();
        int[] pixels = src.getRaster().getPixels(0, 0, w, h, (int[]) null);

        // Auto-window: tìm min/max
        double min = Integer.MAX_VALUE, max = Integer.MIN_VALUE;
        for (int p : pixels) {
            if (p < min) min = p;
            if (p > max) max = p;
        }
        double range = (max - min) == 0 ? 1 : (max - min);

        // Tạo ảnh RGB output
        BufferedImage rgb = new BufferedImage(w, h, BufferedImage.TYPE_INT_RGB);
        for (int y = 0; y < h; y++) {
            for (int x = 0; x < w; x++) {
                int idx = (y * w + x) * numBands;
                // Lấy band đầu tiên (grayscale hoặc R)
                int raw = pixels[idx];
                int gray = (int) Math.max(0, Math.min(255,
                        (raw - min) / range * 255.0));
                // Đặt RGB cùng giá trị → ảnh xám nhưng format RGB
                rgb.setRGB(x, y, (gray << 16) | (gray << 8) | gray);
            }
        }
        return rgb;
    }

    private String encodeJpeg(BufferedImage image, float quality) throws Exception {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName("jpeg");
        if (!writers.hasNext()) throw new RuntimeException("Không tìm thấy JPEG writer");

        ImageWriter writer = writers.next();
        ImageWriteParam param = writer.getDefaultWriteParam();
        param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
        param.setCompressionQuality(quality);

        ImageOutputStream ios = ImageIO.createImageOutputStream(baos);
        writer.setOutput(ios);
        writer.write(null, new IIOImage(image, null, null), param);
        writer.dispose();
        ios.close();

        return Base64.getEncoder().encodeToString(baos.toByteArray());
    }

    // ── Result wrapper ───────────────────────────────────────────────────
    public static class ConvertResult {
        public final String base64Jpeg;
        public final DicomMetadata metadata;

        public ConvertResult(String base64Jpeg, DicomMetadata metadata) {
            this.base64Jpeg = base64Jpeg;
            this.metadata   = metadata;
        }
    }
}