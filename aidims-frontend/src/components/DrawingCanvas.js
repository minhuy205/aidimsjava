// DrawingCanvas.jsx
import React, { useRef } from "react";
import { Stage, Layer, Image as KonvaImage, Line } from "react-konva";
import useImage from "use-image";

const DrawingCanvas = ({ imageUrl, lines, setLines, isDrawing, stageScale, stageRef, onWheel }) => {
  const [img] = useImage(imageUrl);
  const isDrawingRef = useRef(false);

  const stageWidth = 800;
  const stageHeight = 600;

  const imageX = img ? (stageWidth - img.width * stageScale) / 2 : 0;
  const imageY = img ? (stageHeight - img.height * stageScale) / 2 : 0;

  const getRelativePointerPosition = (stage) => {
    const transform = stage.getAbsoluteTransform().copy();
    transform.invert();
    const pos = stage.getPointerPosition();
    return transform.point(pos);
  };

  const handleMouseDown = (e) => {
    if (!isDrawing || !img) return;
    isDrawingRef.current = true;
    const pos = getRelativePointerPosition(stageRef.current);
    setLines([...lines, { points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawingRef.current || !img) return;
    const pos = getRelativePointerPosition(stageRef.current);
    const lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([pos.x, pos.y]);
    setLines([...lines.slice(0, -1), lastLine]);
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
      onWheel={onWheel} // ✅ nhận đúng prop
      style={{ background: "#fff", margin: "0 auto" }}
    >
      <Layer>
        {img && <KonvaImage image={img} x={imageX / stageScale} y={imageY / stageScale} />}
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