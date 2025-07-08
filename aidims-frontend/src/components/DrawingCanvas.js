// DrawingCanvas.jsx
import React, { useRef, useEffect } from "react";
import { Stage, Layer, Image as KonvaImage, Line } from "react-konva";
import useImage from "use-image";

const DrawingCanvas = ({
  imageUrl,
  lines,
  setLines,
  isDrawing,
  stageScale,
  stageRef: externalStageRef = null, // fallback nếu không truyền từ ngoài
  onWheel
}) => {
  const [img] = useImage(imageUrl);
  const internalRef = useRef(); // dùng nếu không có externalRef
  const stageRef = externalStageRef || internalRef;

  const isDrawingRef = useRef(false);
  const stageWidth = 800;
  const stageHeight = 600;

  const imageX = img ? (stageWidth - img.width * stageScale) / 2 : 0;
  const imageY = img ? (stageHeight - img.height * stageScale) / 2 : 0;

  const getRelativePointerPosition = (stage) => {
    if (!stage || !stage.getAbsoluteTransform) return { x: 0, y: 0 };
    const transform = stage.getAbsoluteTransform().copy();
    transform.invert();
    const pos = stage.getPointerPosition();
    return transform.point(pos);
  };

  const handleMouseDown = () => {
    if (!isDrawing || !img || !stageRef.current) return;
    isDrawingRef.current = true;
    const pos = getRelativePointerPosition(stageRef.current);
    setLines((prev) => [...prev, { points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = () => {
    if (!isDrawingRef.current || !img || !stageRef.current) return;
    const pos = getRelativePointerPosition(stageRef.current);
    setLines((prev) => {
      const lastLine = prev[prev.length - 1];
      const updatedLine = {
        ...lastLine,
        points: [...lastLine.points, pos.x, pos.y]
      };
      return [...prev.slice(0, -1), updatedLine];
    });
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
  };

  return (
    <Stage
      ref={stageRef}
      width={stageWidth}
      height={stageHeight}
      scaleX={stageScale}
      scaleY={stageScale}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={onWheel}
      style={{ background: "#fff", margin: "0 auto" }}
    >
      <Layer>
        {img && (
          <KonvaImage
            image={img}
            x={imageX / stageScale}
            y={imageY / stageScale}
          />
        )}
        {lines.map((line, i) => (
          <Line
            key={i}
            points={line.points}
            stroke="#df4b26"
            strokeWidth={2 / stageScale}
            tension={0.5}
            lineCap="round"
            globalCompositeOperation="source-over"
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default DrawingCanvas;
