import React, { useState, useRef, useEffect } from "react";
import DrawingCanvas from "./DrawingCanvas";
import "../css/ImageEditorModal.css";


const FloatingImageModal = ({ imageUrl, onClose, topOffset = 10, leftOffset = 10 }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [lines, setLines] = useState([]);
  const [scale, setScale] = useState(1);

  const zoomTarget = useRef(scale);

  useEffect(() => {
    const interval = setInterval(() => {
      setScale((prev) => {
        const delta = zoomTarget.current - prev;
        if (Math.abs(delta) < 0.01) return zoomTarget.current;
        return prev + delta * 0.1;
      });
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const handleZoom = (type) => {
    zoomTarget.current =
      type === "in"
        ? Math.min(zoomTarget.current + 0.2, 5)
        : Math.max(zoomTarget.current - 0.2, 1);
  };

  return (
    <div
      className="floating-modal-container fade-in-modal"
      style={{
        top: `${topOffset}vh`,
        left: `${leftOffset}vw`,
        zIndex: 10000 + topOffset // đảm bảo modal mới không bị che
      }}
    >
      <div className="modal-header">
        <button className="zoom-btn" onClick={() => handleZoom("in")}>🔍+</button>
        <button className="zoom-btn" onClick={() => handleZoom("out")}>🔍−</button>
        <button
          className={`draw-btn ${isDrawing ? "active" : ""}`}
          onClick={() => setIsDrawing(!isDrawing)}
        >
          ✏️ {isDrawing ? "Đang vẽ" : "Vẽ"}
        </button>
        <button className="clear-btn" onClick={() => setLines([])}>🧺 Xoá</button>
        <button className="close-btn" onClick={onClose}>❌</button>
      </div>

      <div className="modal-body">
        <DrawingCanvas
          imageUrl={imageUrl}
          lines={lines}
          setLines={setLines}
          isDrawing={isDrawing}
          stageScale={scale}
        />
      </div>
    </div>
  );
};

export default FloatingImageModal;
