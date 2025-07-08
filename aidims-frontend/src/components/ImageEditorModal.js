// ImageEditorModal.jsx
import React, { useState, useRef, useEffect } from "react";
import Modal from "react-modal";
import DrawingCanvas from "./DrawingCanvas";
import "../css/ImageEditorModal.css";

const ImageEditorModal = ({ isOpen, onRequestClose, imageUrl, isFloating = false }) => {
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [stageScale, setStageScale] = useState(1);
  const stageRef = useRef(null);
  const zoomTarget = useRef(stageScale);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageScale((prev) => {
        const delta = zoomTarget.current - prev;
        if (Math.abs(delta) < 0.01) return zoomTarget.current;
        return prev + delta * 0.1;
      });
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const handleZoom = (type) => {
    zoomTarget.current = type === "in"
      ? Math.min(zoomTarget.current + 0.2, 5)
      : Math.max(zoomTarget.current - 0.2, 1);
  };

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const direction = e.evt.deltaY > 0 ? 1 / scaleBy : scaleBy;
    zoomTarget.current = Math.max(1, Math.min(stageScale * direction, 5));
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Xem ảnh DICOM"
      className={isFloating ? "floating-modal" : "custom-modal"}
      overlayClassName={isFloating ? "floating-overlay" : "modal-overlay"}
      parentSelector={isFloating ? () => document.body : undefined}
      ariaHideApp={false}
      shouldCloseOnOverlayClick={!isFloating}
    >
      <div className="modal-header">
        <button className="zoom-btn" onClick={() => handleZoom("in")}>🔍 Zoom In</button>
        <button className="zoom-btn" onClick={() => handleZoom("out")}>🔎 Zoom Out</button>
        <button
          className={`draw-btn ${isDrawing ? "active" : ""}`}
          onClick={() => setIsDrawing(!isDrawing)}
        >
          ✏️ {isDrawing ? "Đang vẽ..." : "Bắt đầu vẽ"}
        </button>
        <button className="clear-btn" onClick={() => setLines([])}>🧺 Xoá nét vẽ</button>
        <button className="close-btn" onClick={onRequestClose}>❌</button>
      </div>
      <div className="modal-body">
        <DrawingCanvas
          imageUrl={imageUrl}
          lines={lines}
          setLines={setLines}
          isDrawing={isDrawing}
          stageScale={stageScale}
          stageRef={stageRef}
          onWheel={handleWheel}
        />
      </div>
    </Modal>
  );
};

export default ImageEditorModal;