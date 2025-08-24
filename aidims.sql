-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th8 24, 2025 lúc 06:23 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `aidims`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `assignment`
--

CREATE TABLE `assignment` (
  `id` bigint(20) NOT NULL,
  `assigned_at` datetime(6) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `doctor_id` bigint(20) DEFAULT NULL,
  `patient_id` bigint(20) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `priority` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `assignment`
--

INSERT INTO `assignment` (`id`, `assigned_at`, `department`, `status`, `doctor_id`, `patient_id`, `notes`, `priority`) VALUES
(6, '2025-06-25 02:41:24.000000', 'Ngoại tổng hợp', 'Đang chờ', 10, 20, NULL, NULL),
(7, '2025-06-25 02:42:49.000000', 'Nhi khoa', 'Đang chờ', 12, 21, NULL, NULL),
(8, '2025-06-25 03:03:06.000000', 'Tim mạch', 'Đang chờ', 4, 20, NULL, NULL),
(9, '2025-06-25 03:23:59.000000', 'Hô hấp', 'Đang chờ', 5, 22, NULL, NULL),
(10, '2025-06-25 03:26:14.000000', 'Cơ xương khớp', 'Đang chờ', 8, 21, NULL, NULL),
(11, '2025-06-25 03:28:41.000000', 'Nội tổng hợp', 'Đang chờ', 9, 19, NULL, NULL),
(12, '2025-06-25 03:30:40.000000', 'Tiêu hóa', 'Đang chờ', 6, 22, NULL, NULL),
(13, '2025-06-25 03:38:32.000000', 'Tiêu hóa', 'Đang chờ', 6, 22, NULL, NULL),
(14, '2025-06-25 03:47:29.000000', 'Thần kinh', 'Đang chờ', 7, 21, 'đau đầu', 'Ưu tiên');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `diagnostic_reports`
--

CREATE TABLE `diagnostic_reports` (
  `report_id` int(11) NOT NULL,
  `result_id` int(11) NOT NULL,
  `report_code` varchar(20) NOT NULL,
  `findings` text NOT NULL,
  `impression` text NOT NULL,
  `recommendations` text DEFAULT NULL,
  `radiologist_id` int(11) NOT NULL,
  `referring_doctor_name` varchar(255) DEFAULT NULL COMMENT 'Tên bác sĩ giới thiệu',
  `referring_doctor_specialty` varchar(100) DEFAULT NULL COMMENT 'Chuyên khoa bác sĩ giới thiệu',
  `dictated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `finalized_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `report_type` enum('CapCuu','ChinhThuc','SoBo') NOT NULL,
  `status` enum('BanNhap','HoanThanh') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `diagnostic_reports`
--

INSERT INTO `diagnostic_reports` (`report_id`, `result_id`, `report_code`, `findings`, `impression`, `recommendations`, `radiologist_id`, `referring_doctor_name`, `referring_doctor_specialty`, `dictated_at`, `finalized_at`, `created_at`, `updated_at`, `report_type`, `status`) VALUES
(24, 1, 'BC20250624001', '12', 'Bệnh nhân: Nero\nNgày sinh: 2025-06-12\nGiới tính: Nam\nĐịa chỉ: Fortuna\nLịch sử lâm sàng: 12', '12', 4, 'Đoàn Xuân Kiếm', 'Bác sĩ ung thư', '2025-06-24 05:06:12', NULL, '2025-06-24 05:06:12', '2025-06-24 05:06:12', 'SoBo', 'BanNhap');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `dicom_imports`
--

CREATE TABLE `dicom_imports` (
  `id` bigint(20) NOT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `patient_code` varchar(255) DEFAULT NULL,
  `study_type` varchar(255) DEFAULT NULL,
  `body_part` varchar(255) DEFAULT NULL,
  `technical_params` text DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `file_size` bigint(20) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `import_date` datetime DEFAULT NULL,
  `performed_by` varchar(255) DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `patient_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `dicom_imports`
--

INSERT INTO `dicom_imports` (`id`, `file_name`, `patient_code`, `study_type`, `body_part`, `technical_params`, `notes`, `file_size`, `status`, `import_date`, `performed_by`, `file_path`, `patient_name`) VALUES
(11, 'images.jpg', 'BN110', 'MRI', 'abdomen', '{\"kVp\":\"120\",\"mAs\":\"12\",\"sliceThickness\":\"12\",\"contrast\":false}', '12', 12477, 'imported', '2025-07-02 18:48:21', '7', 'C:\\Users\\PC\\Downloads\\aidimsjava\\aidims-backend/aidims-backend/dicom_uploads/1751482101614_images.jpg', NULL),
(12, 'images.PNG', 'BN12', 'CT', 'chest', '{\"kVp\":\"120\",\"mAs\":\"12\",\"sliceThickness\":\"1.25\",\"contrast\":false}', '1', 12477, 'imported', '2025-07-02 18:49:34', '7', 'C:\\Users\\PC\\Downloads\\aidimsjava\\aidims-backend/aidims-backend/dicom_uploads/1751482174317_images.PNG', NULL),
(13, 'images.PNG', 'BN014', 'X-Quang', 'chest', '{\"kVp\":\"120\",\"mAs\":\"12\",\"sliceThickness\":\"1.25\",\"contrast\":false}', '1', 12477, 'imported', '2025-07-02 18:52:12', '7', 'C:\\Users\\PC\\Downloads\\aidimsjava\\aidims-backend/aidims-backend/dicom_uploads/1751482332655_images.PNG', NULL),
(14, '6.jpg', 'BN110', 'CT', 'chest', '{\"kVp\":\"120\",\"mAs\":\"12\",\"sliceThickness\":\"12\",\"contrast\":false}', '12', 94731, 'imported', '2025-07-02 18:56:43', '7', 'C:\\Users\\PC\\Downloads\\aidimsjava\\aidims-backend/aidims-backend/dicom_uploads/1751482603387_6.jpg', NULL),
(15, 'Thiên.jpg', 'BN12', 'PET-CT', 'Đầu', '{\"kVp\":\"\",\"mAs\":\"\",\"sliceThickness\":\"\",\"contrast\":\"\"}', '12', 11132, 'imported', '2025-07-07 18:23:42', '7', 'C:\\Users\\PC\\Downloads\\aidimsjava\\aidims-backend/aidims-backend/dicom_uploads/1751912622103_Thiên.jpg', 'Trần Hoàng Thiên');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `doctor`
--

CREATE TABLE `doctor` (
  `id` bigint(20) NOT NULL,
  `department` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `experience` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `doctor`
--

INSERT INTO `doctor` (`id`, `department`, `name`, `phone`, `email`, `experience`, `status`) VALUES
(3, 'Chẩn đoán hình ảnh', 'Nguyễn Văn An', '0902345678', 'an.cdha@hospital.com', '10 năm', 'Đang làm việc'),
(4, 'Tim mạch', 'Trần Thị Bình', '0903456789', 'binh.tm@hospital.com', '8 năm', 'Đang làm việc'),
(5, 'Hô hấp', 'Lê Văn Cường', '0904567890', 'cuong.hh@hospital.com', '12 năm', 'Đang làm việc'),
(6, 'Tiêu hóa', 'Phạm Thị Dung', '0905678901', 'dung.th@hospital.com', '6 năm', 'Đang làm việc'),
(7, 'Thần kinh', 'Hoàng Văn Em', '0906789012', 'em.tk@hospital.com', '15 năm', 'Đang làm việc'),
(8, 'Cơ xương khớp', 'Vũ Thị Hạnh', '0907890123', 'hanh.cxk@hospital.com', '7 năm', 'Đang làm việc'),
(9, 'Nội tổng hợp', 'Đỗ Văn Hùng', '0908901234', 'hung.nth@hospital.com', '9 năm', 'Đang làm việc'),
(10, 'Ngoại tổng hợp', 'Nguyễn Thị Lan', '0909012345', 'lan.ngh@hospital.com', '11 năm', 'Đang làm việc'),
(11, 'Sản phụ khoa', 'Trần Văn Minh', '0910123456', 'minh.spk@hospital.com', '13 năm', 'Đang làm việc'),
(12, 'Nhi khoa', 'Lê Thị Ngọc', '0911234567', 'ngoc.nk@hospital.com', '5 năm', 'Đang làm việc');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `imaging_requests`
--

CREATE TABLE `imaging_requests` (
  `request_id` int(11) NOT NULL,
  `request_code` varchar(20) NOT NULL,
  `record_id` int(11) NOT NULL,
  `imaging_type_id` int(11) NOT NULL,
  `body_part` varchar(100) DEFAULT NULL,
  `clinical_indication` text DEFAULT NULL,
  `priority_level` enum('Bình thường','Ưu tiên','Khẩn cấp') NOT NULL,
  `status` enum('Chờ chụp','Đang chụp','Chờ đọc','Hoàn thành') NOT NULL,
  `ordered_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `imaging_requests`
--

INSERT INTO `imaging_requests` (`request_id`, `request_code`, `record_id`, `imaging_type_id`, `body_part`, `clinical_indication`, `priority_level`, `status`, `ordered_by`, `created_at`, `updated_at`) VALUES
(1, 'YC001', 1, 1, 'Ngực', 'Đau ngực, nghi viêm phổi hoặc bệnh lý tim mạch', 'Bình thường', 'Chờ đọc', 4, '2024-12-15 03:00:00', '2025-06-11 07:39:34'),
(2, 'YC002', 2, 1, 'Ngực', 'Ho khan kéo dài, nghi viêm phổi', 'Bình thường', 'Chờ đọc', 5, '2024-12-16 04:00:00', '2025-06-11 07:39:34'),
(3, 'YC003', 3, 2, 'Não', 'Đau đầu dữ dội, nghi xuất huyết não', 'Khẩn cấp', 'Chờ đọc', 4, '2024-12-17 02:00:00', '2025-06-11 07:39:34'),
(4, 'YC004', 4, 4, 'Bụng dưới', 'Đau bụng dưới, nghi viêm ruột thừa hoặc sỏi thận', 'Bình thường', 'Chờ đọc', 5, '2024-12-18 05:00:00', '2025-06-11 07:39:34'),
(5, 'YC005', 5, 3, 'Cột sống lưng', 'Đau lưng, nghi thoát vị đĩa đệm', 'Bình thường', 'Chờ chụp', 4, '2024-12-19 06:00:00', '2025-06-11 07:39:34'),
(6, 'YC006', 6, 4, 'Thai nhi', 'Kiểm tra thai 32 tuần', 'Bình thường', 'Chờ chụp', 5, '2024-12-20 07:00:00', '2025-06-11 07:39:34'),
(7, 'YC007', 7, 1, 'Khớp gối', 'Đau khớp gối, nghi viêm khớp', 'Bình thường', 'Chờ chụp', 4, '2024-12-21 08:00:00', '2025-06-11 07:39:34'),
(8, 'YC008', 8, 4, 'Bụng trên', 'Đau bụng trên, nghi viêm dạ dày', 'Bình thường', 'Chờ chụp', 5, '2024-12-22 09:00:00', '2025-06-11 07:39:34');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `imaging_result`
--

CREATE TABLE `imaging_result` (
  `id` bigint(20) NOT NULL,
  `request_id` bigint(20) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `dicom_file_name` varchar(255) DEFAULT NULL,
  `performed_by` bigint(20) DEFAULT NULL,
  `uploaded_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `imaging_results`
--

CREATE TABLE `imaging_results` (
  `result_id` int(11) NOT NULL,
  `request_id` bigint(20) DEFAULT NULL,
  `dicom_file_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `thumbnail_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `performed_by` bigint(20) DEFAULT NULL,
  `performed_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `technical_parameters` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `image_quality` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `radiologist_id` bigint(20) DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `imaging_results`
--

INSERT INTO `imaging_results` (`result_id`, `request_id`, `dicom_file_path`, `thumbnail_path`, `performed_by`, `performed_at`, `technical_parameters`, `image_quality`, `radiologist_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, '/dicom/2024/12/15/YC001_chest_pa.dcm', '/thumbnails/YC001_chest_pa.jpg', 7, '2024-12-15 07:15:00', '{\"kVp\": 80, \"mAs\": 10, \"distance\": 180}', 'Tốt', 4, 'Chờ đọc', '2025-06-11 07:39:34', '2025-06-11 07:39:34'),
(2, 2, '/dicom/2024/12/16/YC002_chest_pa.dcm', '/thumbnails/YC002_chest_pa.jpg', 7, '2024-12-16 08:45:00', '{\"kVp\": 85, \"mAs\": 12, \"distance\": 180}', 'Tốt', 5, 'Chờ đọc', '2025-06-11 07:39:34', '2025-06-11 07:39:34'),
(3, 3, '/dicom/2024/12/17/YC003_brain_ct.dcm', '/thumbnails/YC003_brain_ct.jpg', 8, '2024-12-17 05:45:00', '{\"kVp\": 120, \"mAs\": 250, \"slice_thickness\": 5}', 'Xuất sắc', 4, 'Chờ đọc', '2025-06-11 07:39:34', '2025-06-11 07:39:34'),
(4, 4, '/dicom/2024/12/18/YC004_pelvis_us.dcm', '/thumbnails/YC004_pelvis_us.jpg', 8, '2024-12-18 09:20:00', '{\"frequency\": 3.5, \"gain\": 45, \"depth\": 12}', 'Tốt', 5, 'Chờ đọc', '2025-06-11 07:39:34', '2025-06-11 07:39:34');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `imaging_types`
--

CREATE TABLE `imaging_types` (
  `type_id` bigint(20) NOT NULL,
  `type_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type_code` varchar(255) DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `default_settings` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `imaging_types`
--

INSERT INTO `imaging_types` (`type_id`, `type_name`, `type_code`, `description`, `default_settings`, `created_at`) VALUES
(1, 'X-quang thường', 'XR', 'Chụp X-quang thông thường', '{\"kVp\": 80, \"mAs\": 10, \"filter\": \"Al\"}', '2025-06-11 07:39:34'),
(2, 'CT Scanner', 'CT', 'Chụp cắt lớp vi tính', '{\"slice_thickness\": 1.25, \"pitch\": 1.0, \"kVp\": 120}', '2025-06-11 07:39:34'),
(3, 'MRI', 'MRI', 'Cộng hưởng từ', '{\"field_strength\": \"1.5T\", \"sequence\": \"T1\", \"slice_thickness\": 5}', '2025-06-11 07:39:34'),
(4, 'Siêu âm', 'US', 'Siêu âm', '{\"frequency\": \"3.5MHz\", \"gain\": 50, \"depth\": 15}', '2025-06-11 07:39:34'),
(5, 'Mammography', 'MG', 'Chụp tuyến vú', '{\"kVp\": 28, \"mAs\": 63, \"compression\": \"medium\"}', '2025-06-11 07:39:34'),
(6, 'Fluoroscopy', 'FL', 'Chụp thấu quang', '{\"kVp\": 100, \"mAs\": 5, \"frame_rate\": 15}', '2025-06-11 07:39:34'),
(7, 'PET-CT', 'PET', 'Chụp PET-CT', '{\"tracer\": \"F18-FDG\", \"uptake_time\": 60, \"slice_thickness\": 2}', '2025-06-11 07:39:34'),
(8, 'SPECT', 'SP', 'Chụp SPECT', '{\"isotope\": \"Tc99m\", \"matrix\": \"128x128\", \"zoom\": 1.0}', '2025-06-11 07:39:34');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `medical_imaging_records`
--

CREATE TABLE `medical_imaging_records` (
  `record_id` bigint(20) NOT NULL,
  `body_part` varchar(255) NOT NULL,
  `clinical_indication` text DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `dicom_file_path` varchar(255) NOT NULL,
  `image_quality` varchar(255) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `technical_parameters` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`technical_parameters`)),
  `thumbnail_path` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `doctor_id` bigint(20) DEFAULT NULL,
  `imaging_type_id` bigint(20) NOT NULL,
  `patient_id` bigint(20) NOT NULL,
  `technician_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `medical_records`
--

CREATE TABLE `medical_records` (
  `record_id` int(11) NOT NULL,
  `record_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `patient_id` int(11) NOT NULL,
  `visit_date` date NOT NULL,
  `chief_complaint` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `symptoms_recorded` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vital_signs` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `specialty_id` int(11) NOT NULL,
  `assigned_doctor_id` int(11) NOT NULL,
  `status` enum('Chờ khám','Chờ chụp','Đang xử lý','Hoàn thành') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `priority_level` enum('Bình thường','Ưu tiên','Khẩn cấp') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `medical_records`
--

INSERT INTO `medical_records` (`record_id`, `record_code`, `patient_id`, `visit_date`, `chief_complaint`, `symptoms_recorded`, `vital_signs`, `specialty_id`, `assigned_doctor_id`, `status`, `priority_level`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'HS001', 1, '2024-12-15', 'Đau ngực, khó thở khi gắng sức', 'Bệnh nhân than phiền đau ngực từ 3 ngày nay, kèm khó thở khi đi bộ', '{\"temperature\": 36.5, \"blood_pressure\": \"140/90\", \"heart_rate\": 85, \"respiratory_rate\": 18, \"oxygen_saturation\": 97}', 2, 4, 'Chờ chụp', 'Bình thường', 6, '2025-06-11 07:39:34', '2025-06-11 07:39:34'),
(2, 'HS002', 2, '2024-12-16', 'Ho khan kéo dài, sốt nhẹ', 'Ho khan khoảng 2 tuần, sốt nhẹ buổi chiều', '{\"temperature\": 37.2, \"blood_pressure\": \"120/80\", \"heart_rate\": 78, \"respiratory_rate\": 20, \"oxygen_saturation\": 98}', 3, 5, 'Chờ chụp', 'Bình thường', 6, '2025-06-11 07:39:34', '2025-06-11 07:39:34'),
(3, 'HS003', 3, '2024-12-17', 'Đau đầu dữ dội, buồn nôn', 'Đau đầu từ sáng nay, kèm buồn nôn và chóng mặt', '{\"temperature\": 36.8, \"blood_pressure\": \"160/100\", \"heart_rate\": 92, \"respiratory_rate\": 16, \"oxygen_saturation\": 99}', 5, 4, 'Chờ chụp', 'Khẩn cấp', 6, '2025-06-11 07:39:34', '2025-06-11 07:39:34'),
(4, 'HS004', 4, '2024-12-18', 'Đau bụng dưới, đi tiểu buốt', 'Đau bụng dưới bên phải từ 2 ngày, đi tiểu có máu', '{\"temperature\": 37.8, \"blood_pressure\": \"110/70\", \"heart_rate\": 88, \"respiratory_rate\": 18, \"oxygen_saturation\": 98}', 7, 5, 'Chờ chụp', 'Bình thường', 6, '2025-06-11 07:39:34', '2025-06-11 07:39:34'),
(5, 'HS005', 5, '2024-12-19', 'Đau lưng, tê chân trái', 'Đau lưng từ 1 tuần nay, tê bì chân trái', '{\"temperature\": 36.3, \"blood_pressure\": \"130/85\", \"heart_rate\": 72, \"respiratory_rate\": 16, \"oxygen_saturation\": 99}', 6, 4, 'Chờ chụp', 'Bình thường', 6, '2025-06-11 07:39:34', '2025-06-11 07:39:34'),
(6, 'HS006', 6, '2024-12-20', 'Thai 32 tuần, kiểm tra định kỳ', 'Thai phụ 32 tuần tuổi, đến khám định kỳ', '{\"temperature\": 36.4, \"blood_pressure\": \"125/75\", \"heart_rate\": 82, \"respiratory_rate\": 18, \"oxygen_saturation\": 99}', 9, 5, 'Chờ chụp', 'Bình thường', 6, '2025-06-11 07:39:34', '2025-06-11 07:39:34'),
(7, 'HS007', 7, '2024-12-21', 'Đau khớp gối, sưng', 'Đau khớp gối phải từ 5 ngày, sưng và khó cử động', '{\"temperature\": 36.6, \"blood_pressure\": \"135/80\", \"heart_rate\": 75, \"respiratory_rate\": 16, \"oxygen_saturation\": 98}', 6, 4, 'Chờ chụp', 'Bình thường', 6, '2025-06-11 07:39:34', '2025-06-11 07:39:34'),
(8, 'HS008', 8, '2024-12-22', 'Đau bụng trên, ợ chua', 'Đau bụng trên sau ăn, ợ chua, đầy hơi', '{\"temperature\": 36.7, \"blood_pressure\": \"115/75\", \"heart_rate\": 80, \"respiratory_rate\": 17, \"oxygen_saturation\": 99}', 4, 5, 'Chờ chụp', 'Bình thường', 6, '2025-06-11 07:39:34', '2025-06-11 07:39:34');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `notification_type` enum('new_request','urgent_request','report_ready','system_maintenance') NOT NULL,
  `title` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `related_entity_type` enum('imaging_request','diagnostic_report','system') DEFAULT NULL,
  `related_entity_id` int(11) DEFAULT NULL,
  `priority` enum('Thông tin','Bình thường','Ưu tiên','Khẩn cấp') NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `notifications`
--

INSERT INTO `notifications` (`notification_id`, `user_id`, `notification_type`, `title`, `message`, `related_entity_type`, `related_entity_id`, `priority`, `is_read`, `created_at`) VALUES
(1, 4, 'new_request', 'Yêu cầu chụp mới', 'Có yêu cầu chụp X-quang ngực mới từ bệnh nhân Nguyễn Văn Nam', 'imaging_request', 1, 'Bình thường', 0, '2025-06-11 07:39:34'),
(2, 5, 'urgent_request', 'Yêu cầu chụp khẩn cấp', 'Yêu cầu CT não khẩn cấp cho bệnh nhân Lê Minh Tuấn', 'imaging_request', 3, 'Khẩn cấp', 0, '2025-06-11 07:39:34'),
(3, 4, 'report_ready', 'Báo cáo hoàn thành', 'Báo cáo X-quang ngực cho bệnh nhân Nguyễn Văn Nam đã hoàn thành', 'diagnostic_report', 1, 'Bình thường', 0, '2025-06-11 07:39:34'),
(4, 6, 'system_maintenance', 'Bảo trì hệ thống', 'Hệ thống sẽ bảo trì từ 2:00-4:00 sáng ngày mai', 'system', NULL, 'Thông tin', 0, '2025-06-11 07:39:34'),
(5, 5, 'new_request', 'Yêu cầu chụp mới', 'Có yêu cầu siêu âm bụng dưới từ bệnh nhân Phạm Thị Lan', 'imaging_request', 4, 'Bình thường', 0, '2025-06-11 07:39:34');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `patient`
--

CREATE TABLE `patient` (
  `patient_id` bigint(20) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `allergies` varchar(255) DEFAULT NULL,
  `blood_type` varchar(255) DEFAULT NULL,
  `date_of_birth` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `emergency_contact_name` varchar(255) DEFAULT NULL,
  `emergency_contact_phone` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `identity_number` varchar(255) DEFAULT NULL,
  `insurance_number` varchar(255) DEFAULT NULL,
  `medical_history` varchar(255) DEFAULT NULL,
  `patient_code` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `temperature` double DEFAULT NULL,
  `heart_rate` int(11) DEFAULT NULL,
  `blood_pressure` varchar(255) DEFAULT NULL,
  `respiratory_rate` int(11) DEFAULT NULL,
  `oxygen_saturation` int(11) DEFAULT NULL,
  `is_examined` tinyint(1) DEFAULT 0,
  `examined_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `patient`
--

INSERT INTO `patient` (`patient_id`, `address`, `age`, `allergies`, `blood_type`, `date_of_birth`, `email`, `emergency_contact_name`, `emergency_contact_phone`, `full_name`, `gender`, `identity_number`, `insurance_number`, `medical_history`, `patient_code`, `phone`, `temperature`, `heart_rate`, `blood_pressure`, `respiratory_rate`, `oxygen_saturation`, `is_examined`, `examined_at`) VALUES
(27, 'Ấp Nhàn Dân A , xã Tân Phong', 0, '', 'O+', '2025-07-04', 'admin123@gmail.com', 'Nguyễn Thành Công', '0912481241', 'Trần Hoàng Thiên', 'Nam', '09121298481', '12424351', 'Không', 'BN12', '0916282912', 12, 12, NULL, 12, 12, 0, NULL),
(28, 'Fortuna', 0, '12', 'AB-', '2025-07-10', 'trangianguyen123@gmail.com', '12', '12', 'Nero', 'Nam', '1212123', '12', '12', 'BN110', '0399491540', 12, 1, NULL, 12, 12, 0, NULL),
(29, 'Fortuna', 0, '12', 'A-', '2025-07-19', 'admin123@gmail.com', '12', '12', 'Dante', 'Nam', '09121298481', '12424351', '12', 'BN014', '0916282912', 12, 12, NULL, 1, 121, 0, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `request_photo`
--

CREATE TABLE `request_photo` (
  `request_id` bigint(20) NOT NULL,
  `request_code` varchar(20) NOT NULL,
  `patient_id` bigint(20) NOT NULL,
  `imaging_type` varchar(255) NOT NULL,
  `body_part` varchar(255) NOT NULL,
  `clinical_indication` text NOT NULL,
  `notes` text DEFAULT NULL,
  `priority_level` varchar(255) NOT NULL,
  `request_date` date NOT NULL,
  `status` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `request_photo`
--

INSERT INTO `request_photo` (`request_id`, `request_code`, `patient_id`, `imaging_type`, `body_part`, `clinical_indication`, `notes`, `priority_level`, `request_date`, `status`, `created_at`, `updated_at`) VALUES
(16, 'REQ20250625105814', 22, 'x-ray', 'spine', 'đau tay', 'k', 'normal', '2025-06-25', 'pending', '2025-06-24 20:58:14', '2025-06-24 20:58:14'),
(17, 'REQ20250625231352', 23, 'x-ray', 'chest', 'k', 'k', 'stat', '2025-06-25', 'pending', '2025-06-25 09:13:52', '2025-06-25 09:13:52'),
(18, 'REQ20250626150208', 20, 'PET-CT', 'chest', 'k', 'k', 'urgent', '2025-06-26', 'pending', '2025-06-26 01:02:08', '2025-06-26 01:02:08'),
(19, 'REQ20250708012300', 27, 'PET-CT', 'Đầu', '1', '12', 'normal', '2025-07-07', 'pending', '2025-07-07 11:23:00', '2025-07-07 11:23:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `roles`
--

CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL,
  `role_name` varchar(50) NOT NULL,
  `role_description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `roles`
--

INSERT INTO `roles` (`role_id`, `role_name`, `role_description`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'Quản trị viên hệ thống', '2025-06-11 07:39:34', '2025-06-11 07:39:34'),
(2, 'doctor', 'Bác sĩ', '2025-06-11 07:39:34', '2025-06-11 07:39:34'),
(3, 'receptionist', 'Nhân viên tiếp nhận', '2025-06-11 07:39:34', '2025-06-11 07:39:34'),
(4, 'technician', 'Kỹ thuật viên hình ảnh', '2025-06-11 07:39:34', '2025-06-11 07:39:34');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `specialties`
--

CREATE TABLE `specialties` (
  `specialty_id` int(11) NOT NULL,
  `specialty_name` varchar(100) NOT NULL,
  `specialty_code` varchar(10) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `specialties`
--

INSERT INTO `specialties` (`specialty_id`, `specialty_name`, `specialty_code`, `description`, `is_active`, `created_at`) VALUES
(1, 'Chẩn đoán hình ảnh', 'CDHA', 'Chuyên khoa chẩn đoán hình ảnh', 1, '2025-06-11 07:39:34'),
(2, 'Tim mạch', 'TM', 'Chuyên khoa tim mạch', 1, '2025-06-11 07:39:34'),
(3, 'Hô hấp', 'HH', 'Chuyên khoa hô hấp', 1, '2025-06-11 07:39:34'),
(4, 'Tiêu hóa', 'TH', 'Chuyên khoa tiêu hóa', 1, '2025-06-11 07:39:34'),
(5, 'Thần kinh', 'TK', 'Chuyên khoa thần kinh', 1, '2025-06-11 07:39:34'),
(6, 'Cơ xương khớp', 'CXK', 'Chuyên khoa cơ xương khớp', 1, '2025-06-11 07:39:34'),
(7, 'Nội tổng hợp', 'NTH', 'Chuyên khoa nội tổng hợp', 1, '2025-06-11 07:39:34'),
(8, 'Ngoại tổng hợp', 'NGH', 'Chuyên khoa ngoại tổng hợp', 1, '2025-06-11 07:39:34'),
(9, 'Sản phụ khoa', 'SPK', 'Chuyên khoa sản phụ khoa', 1, '2025-06-11 07:39:34'),
(10, 'Nhi khoa', 'NK', 'Chuyên khoa nhi', 1, '2025-06-11 07:39:34'),
(11, 'Da liễu', 'DL', 'Chuyên khoa da liễu', 1, '2025-06-11 07:39:34'),
(12, 'Mắt', 'M', 'Chuyên khoa mắt', 1, '2025-06-11 07:39:34'),
(13, 'Tai mũi họng', 'TMH', 'Chuyên khoa tai mũi họng', 1, '2025-06-11 07:39:34'),
(14, 'Răng hàm mặt', 'RHM', 'Chuyên khoa răng hàm mặt', 1, '2025-06-11 07:39:34');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `symptom`
--

CREATE TABLE `symptom` (
  `id` bigint(20) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `recorded_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `detailed_symptoms` text DEFAULT NULL,
  `main_symptom` varchar(255) NOT NULL,
  `other_symptoms` text DEFAULT NULL,
  `patient_id` bigint(20) NOT NULL,
  `selected_symptoms` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `symptom`
--

INSERT INTO `symptom` (`id`, `description`, `recorded_at`, `created_at`, `detailed_symptoms`, `main_symptom`, `other_symptoms`, `patient_id`, `selected_symptoms`) VALUES
(14, NULL, NULL, '2025-06-24 11:45:17.000000', 'Severity: Trung bình\nOnset: Từ từ\nDuration: 1\nPain Scale: 1', 'power', 'Priority: Bình thường\nAdditional Notes: 12\nRecorded By: Huy - Nhân viên tiếp nhận', 19, NULL),
(15, NULL, NULL, '2025-06-24 11:59:11.000000', 'Severity: Trung bình\nOnset: Từ từ\nDuration: 12\nPain Scale: 1', 'Cụt tay', 'Priority: Bình thường\nAdditional Notes: 12\nRecorded By: Huy - Nhân viên tiếp nhận', 20, NULL),
(16, NULL, NULL, '2025-06-25 02:25:41.000000', 'Severity: Trung bình\nOnset: Đột ngột\nDuration: 2 giờ\nPain Scale: 3', 'đau bụng, khó ăn', 'Priority: Ưu tiên\nAdditional Notes: k\nRecorded By: Huy - Nhân viên tiếp nhận', 21, NULL),
(17, NULL, NULL, '2025-06-25 02:37:07.000000', 'Severity: Nhẹ\nOnset: Từ từ\nDuration: 2 tuần\nPain Scale: 4', 'đauu lưng', 'Priority: Bình thường\nAdditional Notes: k\nRecorded By: Huy - Nhân viên tiếp nhận', 20, '[]'),
(18, NULL, NULL, '2025-06-25 02:38:00.000000', 'Severity: Nhẹ\nOnset: Từ từ\nDuration: 2 giờ\nPain Scale: 4', 'đau đầu', 'Priority: Ưu tiên\nAdditional Notes: bác sĩ khám\nRecorded By: Huy - Nhân viên tiếp nhận', 19, '[{\"code\":\"HH04\",\"name\":\"Thở gấp\",\"description\":\"Nhịp thở nhanh, khó thở\"},{\"code\":\"TM03\",\"name\":\"Hồi hộp\",\"description\":\"Tim đập nhanh, hồi hộp\"}]'),
(19, NULL, NULL, '2025-06-26 08:20:29.000000', 'Severity: Trung bình\nOnset: Đột ngột\nDuration: k\nPain Scale: Không rõ', 'k', 'Priority: Bình thường\nAdditional Notes: \nRecorded By: Huy - Nhân viên tiếp nhận', 24, '[{\"code\":\"TM02\",\"name\":\"Khó thở\",\"description\":\"Khó thở, thở gấp\"},{\"code\":\"TM01\",\"name\":\"Đau ngực\",\"description\":\"Cảm giác đau, tức ngực\"},{\"code\":\"TM04\",\"name\":\"Phù chân\",\"description\":\"Sưng phù vùng chân\"}]'),
(20, NULL, NULL, '2025-07-07 08:44:06.000000', 'Severity: Nặng\nOnset: Đột ngột\nDuration: 1 tuần\nPain Scale: 5', 'Sốt, hay mệt mỏi giảm sức ăn, tụt cân, ra mồ hôi (đặc biệt là mồ hôi đêm)', 'Priority: Ưu tiên\nAdditional Notes: \nRecorded By: Huy - Nhân viên tiếp nhận', 28, '[{\"code\":\"TM04\",\"name\":\"Phù chân\",\"description\":\"Sưng phù vùng chân\"}]');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role_id` bigint(20) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `user`
--

INSERT INTO `user` (`user_id`, `username`, `password`, `role_id`, `full_name`, `email`, `phone`, `is_active`, `created_at`, `updated_at`) VALUES
(1, '1', '1', 2, 'Trần Thị Bác Sĩ', 'doctor1@example.com', '0987654321', 1, '2025-06-19 13:20:52', '2025-06-23 16:16:16'),
(3, '2', '2', 3, 'Phạm Thị Tiếp Tân', 'reception1@example.com', '0369852147', 1, '2025-06-19 13:20:52', '2025-06-23 16:16:23'),
(2, 'doctor2', 'doctor456', 2, 'Lê Văn Bác Sĩ', 'doctor2@example.com', '0909123456', 1, '2025-06-19 13:20:52', '2025-06-19 13:20:52'),
(4, 'reception2', 'reception456', 3, 'Hoàng Văn Tiếp Tân', 'reception2@example.com', '0369852148', 1, '2025-06-19 13:20:52', '2025-06-19 13:20:52'),
(5, 'tech1', 'tech123', 4, 'Vũ Văn Kỹ Thuật', 'tech1@example.com', '0586321479', 1, '2025-06-19 13:20:52', '2025-06-19 13:20:52'),
(6, 'tech2', 'tech456', 4, 'Đặng Thị Kỹ Thuật', 'tech2@example.com', '0586321480', 1, '2025-06-19 13:20:52', '2025-06-19 13:20:52');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `role_id` int(11) NOT NULL,
  `specialty_id` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`user_id`, `username`, `password_hash`, `email`, `full_name`, `phone`, `role_id`, `specialty_id`, `is_active`, `last_login`, `created_at`, `updated_at`) VALUES
(1, 'admin', '$2b$10$N8P6E7/FJoTFR5GhJQxJfe5KjY5p7qJZ9h8VqQ8wZ3R3oNMQmF9Fi', 'admin@hospital.com', 'Quản trị viên chính', '0901234567', 1, NULL, 1, NULL, '2025-06-11 07:39:34', '2025-06-11 07:39:34'),
(2, 'kiet_admin', '$2b$10$N8P6E7/FJoTFR5GhJQxJfe5KjY5p7qJZ9h8VqQ8wZ3R3oNMQmF9Fi', 'kiet@hospital.com', 'Kiệt - Quản trị viên', '0901234568', 1, NULL, 1, NULL, '2025-06-11 07:39:34', '2025-06-11 07:39:34'),
(3, 'long_admin', '$2b$10$N8P6E7/FJoTFR5GhJQxJfe5KjY5p7qJZ9h8VqQ8wZ3R3oNMQmF9Fi', 'long@hospital.com', 'Long - Quản trị viên', '0901234569', 1, NULL, 1, NULL, '2025-06-11 07:39:34', '2025-06-11 07:39:34'),
(4, 'dr_nguyen', '$2b$10$K9Q2E6/FJoTFR5GhJQxJfe5KjY5p7qJZ9h8VqQ8wZ3R3oNMQmF8Gi', 'nguyen@hospital.com', 'BS. Nguyễn Văn A', '0902345678', 2, 1, 1, NULL, '2025-06-11 07:39:34', '2025-06-11 07:39:34'),
(5, 'dr_thoai', '$2b$10$K9Q2E6/FJoTFR5GhJQxJfe5KjY5p7qJZ9h8VqQ8wZ3R3oNMQmF8Gi', 'thoai@hospital.com', 'BS. Thoại Thanh B', '0902345679', 2, 3, 1, NULL, '2025-06-11 07:39:34', '2025-06-11 07:39:34'),
(6, 'nv_huy', '$2b$10$L7P1D5/FJoTFR5GhJQxJfe5KjY5p7qJZ9h8VqQ8wZ3R3oNMQmF7Hi', 'huy@hospital.com', 'Huy - Nhân viên tiếp nhận', '0903456789', 3, NULL, 1, NULL, '2025-06-11 07:39:34', '2025-06-11 07:39:34'),
(7, 'kv_duyen', '$2b$10$M6O8C4/FJoTFR5GhJQxJfe5KjY5p7qJZ9h8VqQ8wZ3R3oNMQmF6Ji', 'duyen@hospital.com', 'Duyên - Kỹ thuật viên', '0904567890', 4, 1, 1, NULL, '2025-06-11 07:39:34', '2025-06-11 07:39:34'),
(8, 'kv_cuong', '$2b$10$M6O8C4/FJoTFR5GhJQxJfe5KjY5p7qJZ9h8VqQ8wZ3R3oNMQmF6Ji', 'cuong@hospital.com', 'Cương - Kỹ thuật viên', '0904567891', 4, 1, 1, NULL, '2025-06-11 07:39:34', '2025-06-11 07:39:34');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `verify_image`
--

CREATE TABLE `verify_image` (
  `id` bigint(20) NOT NULL,
  `check_time` datetime(6) NOT NULL,
  `checked_by` bigint(20) NOT NULL,
  `image_id` bigint(20) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `result` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `verify_image`
--

INSERT INTO `verify_image` (`id`, `check_time`, `checked_by`, `image_id`, `note`, `result`) VALUES
(1, '2025-07-01 06:54:13.000000', 1, 1, 'Chất lượng: Kém', 'Chờ kiểm tra'),
(2, '2025-07-01 06:54:17.000000', 1, 1, 'Chất lượng: Kém', 'Cần chụp lại'),
(3, '2025-07-01 06:54:19.000000', 1, 1, 'Chất lượng: Kém', 'Chờ kiểm tra'),
(4, '2025-07-01 06:54:38.000000', 1, 3, 'Chất lượng: Tốt', 'Đã kiểm tra'),
(5, '2025-07-01 06:55:36.000000', 1, 10, 'Chất lượng: Tốt', 'Đã kiểm tra'),
(6, '2025-07-01 06:55:48.000000', 1, 9, 'Chất lượng: Kém', 'Cần chụp lại');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `work_schedules`
--

CREATE TABLE `work_schedules` (
  `schedule_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `shift_type` enum('Sáng','Chiều','Tối','Trực') NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `status` enum('Đã xếp','Đã hủy','Hoàn thành') NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `work_schedules`
--

INSERT INTO `work_schedules` (`schedule_id`, `user_id`, `date`, `shift_type`, `start_time`, `end_time`, `status`, `notes`, `created_at`, `updated_at`) VALUES
(1, 4, '2024-12-23', 'Sáng', '07:00:00', '15:00:00', 'Đã xếp', 'Ca sáng thường', '2025-06-11 07:39:34', '2025-06-11 07:39:34'),
(2, 5, '2024-12-23', 'Chiều', '15:00:00', '23:00:00', 'Đã xếp', 'Ca chiều thường', '2025-06-11 07:39:34', '2025-06-11 07:39:34'),
(3, 7, '2024-12-23', 'Sáng', '07:30:00', '15:30:00', 'Đã xếp', 'Kỹ thuật viên ca sáng', '2025-06-11 07:39:34', '2025-06-11 07:39:34'),
(4, 8, '2024-12-23', 'Chiều', '15:30:00', '23:30:00', 'Đã xếp', 'Kỹ thuật viên ca chiều', '2025-06-11 07:39:34', '2025-06-11 07:39:34'),
(5, 4, '2024-12-24', 'Trực', '07:00:00', '07:00:00', 'Đã xếp', 'Trực 24h', '2025-06-11 07:39:34', '2025-06-11 07:39:34'),
(6, 8, '2024-12-24', 'Sáng', '08:00:00', '16:00:00', 'Đã xếp', 'Siêu âm ca sáng', '2025-06-11 07:39:34', '2025-06-11 07:39:34');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `assignment`
--
ALTER TABLE `assignment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKma8m5y8pro1b0l5aaj3jlwik5` (`doctor_id`),
  ADD KEY `FKorxwwtlejrledfn6lsr0h5br4` (`patient_id`);

--
-- Chỉ mục cho bảng `diagnostic_reports`
--
ALTER TABLE `diagnostic_reports`
  ADD PRIMARY KEY (`report_id`),
  ADD UNIQUE KEY `report_code` (`report_code`),
  ADD KEY `radiologist_id` (`radiologist_id`),
  ADD KEY `idx_report_code` (`report_code`),
  ADD KEY `idx_result` (`result_id`);

--
-- Chỉ mục cho bảng `dicom_imports`
--
ALTER TABLE `dicom_imports`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `doctor`
--
ALTER TABLE `doctor`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `imaging_requests`
--
ALTER TABLE `imaging_requests`
  ADD PRIMARY KEY (`request_id`),
  ADD UNIQUE KEY `request_code` (`request_code`),
  ADD KEY `ordered_by` (`ordered_by`),
  ADD KEY `idx_request_code` (`request_code`),
  ADD KEY `idx_record` (`record_id`),
  ADD KEY `idx_imaging_type` (`imaging_type_id`);

--
-- Chỉ mục cho bảng `imaging_result`
--
ALTER TABLE `imaging_result`
  ADD PRIMARY KEY (`id`),
  ADD KEY `request_id` (`request_id`);

--
-- Chỉ mục cho bảng `imaging_results`
--
ALTER TABLE `imaging_results`
  ADD PRIMARY KEY (`result_id`),
  ADD KEY `radiologist_id` (`radiologist_id`),
  ADD KEY `idx_request` (`request_id`),
  ADD KEY `idx_performed_by` (`performed_by`);

--
-- Chỉ mục cho bảng `imaging_types`
--
ALTER TABLE `imaging_types`
  ADD PRIMARY KEY (`type_id`),
  ADD UNIQUE KEY `type_name` (`type_name`),
  ADD UNIQUE KEY `type_code` (`type_code`),
  ADD KEY `idx_type_code` (`type_code`);

--
-- Chỉ mục cho bảng `medical_imaging_records`
--
ALTER TABLE `medical_imaging_records`
  ADD PRIMARY KEY (`record_id`),
  ADD KEY `FKg9nqhswiwnm6j4soffpjdy5l9` (`doctor_id`),
  ADD KEY `FK9es7hi3unoxv7kyow1gw8pn96` (`patient_id`);

--
-- Chỉ mục cho bảng `medical_records`
--
ALTER TABLE `medical_records`
  ADD PRIMARY KEY (`record_id`),
  ADD UNIQUE KEY `record_code` (`record_code`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_record_code` (`record_code`),
  ADD KEY `idx_patient` (`patient_id`),
  ADD KEY `idx_specialty` (`specialty_id`),
  ADD KEY `idx_doctor` (`assigned_doctor_id`);

--
-- Chỉ mục cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_notification_type` (`notification_type`);

--
-- Chỉ mục cho bảng `patient`
--
ALTER TABLE `patient`
  ADD PRIMARY KEY (`patient_id`),
  ADD KEY `idx_patient_examined` (`is_examined`);

--
-- Chỉ mục cho bảng `request_photo`
--
ALTER TABLE `request_photo`
  ADD PRIMARY KEY (`request_id`),
  ADD UNIQUE KEY `request_code` (`request_code`),
  ADD KEY `idx_patient` (`patient_id`),
  ADD KEY `idx_request_date` (`request_date`),
  ADD KEY `idx_status` (`status`);

--
-- Chỉ mục cho bảng `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`),
  ADD UNIQUE KEY `role_name` (`role_name`),
  ADD KEY `idx_role_name` (`role_name`);

--
-- Chỉ mục cho bảng `specialties`
--
ALTER TABLE `specialties`
  ADD PRIMARY KEY (`specialty_id`),
  ADD UNIQUE KEY `specialty_name` (`specialty_name`),
  ADD UNIQUE KEY `specialty_code` (`specialty_code`),
  ADD KEY `idx_specialty_code` (`specialty_code`);

--
-- Chỉ mục cho bảng `symptom`
--
ALTER TABLE `symptom`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKj500xlsnix5otet7w3mhnkqfy` (`patient_id`);

--
-- Chỉ mục cho bảng `user`
--
ALTER TABLE `user`
  ADD UNIQUE KEY `uk_username` (`username`),
  ADD UNIQUE KEY `uk_email` (`email`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `specialty_id` (`specialty_id`),
  ADD KEY `idx_username` (`username`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_role` (`role_id`);

--
-- Chỉ mục cho bảng `verify_image`
--
ALTER TABLE `verify_image`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `work_schedules`
--
ALTER TABLE `work_schedules`
  ADD PRIMARY KEY (`schedule_id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_date` (`date`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `assignment`
--
ALTER TABLE `assignment`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT cho bảng `diagnostic_reports`
--
ALTER TABLE `diagnostic_reports`
  MODIFY `report_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT cho bảng `dicom_imports`
--
ALTER TABLE `dicom_imports`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `doctor`
--
ALTER TABLE `doctor`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `imaging_requests`
--
ALTER TABLE `imaging_requests`
  MODIFY `request_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `imaging_result`
--
ALTER TABLE `imaging_result`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `imaging_results`
--
ALTER TABLE `imaging_results`
  MODIFY `result_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `imaging_types`
--
ALTER TABLE `imaging_types`
  MODIFY `type_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `medical_imaging_records`
--
ALTER TABLE `medical_imaging_records`
  MODIFY `record_id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `medical_records`
--
ALTER TABLE `medical_records`
  MODIFY `record_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `patient`
--
ALTER TABLE `patient`
  MODIFY `patient_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT cho bảng `request_photo`
--
ALTER TABLE `request_photo`
  MODIFY `request_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT cho bảng `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `specialties`
--
ALTER TABLE `specialties`
  MODIFY `specialty_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT cho bảng `symptom`
--
ALTER TABLE `symptom`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `verify_image`
--
ALTER TABLE `verify_image`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `work_schedules`
--
ALTER TABLE `work_schedules`
  MODIFY `schedule_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `assignment`
--
ALTER TABLE `assignment`
  ADD CONSTRAINT `FKma8m5y8pro1b0l5aaj3jlwik5` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`id`);

--
-- Các ràng buộc cho bảng `diagnostic_reports`
--
ALTER TABLE `diagnostic_reports`
  ADD CONSTRAINT `diagnostic_reports_ibfk_1` FOREIGN KEY (`result_id`) REFERENCES `imaging_results` (`result_id`),
  ADD CONSTRAINT `diagnostic_reports_ibfk_2` FOREIGN KEY (`radiologist_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
