"use client";

import { useRef, useEffect, useState } from "react";
import styles from "./canvas.module.css";

export default function Canvas({ color }: { color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineCap = "round";
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        setContext(ctx);
      }
    }
  }, []);

  useEffect(() => {
    if (context) {
      context.strokeStyle = color;
    }
  }, [color, context]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const { offsetX, offsetY } = getCoordinates(e);
    context?.beginPath();
    context?.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !context) return;
    const { offsetX, offsetY } = getCoordinates(e);
    context.lineTo(offsetX, offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    context?.closePath();
    setIsDrawing(false);
  };

  const getCoordinates = (
    e: React.MouseEvent | React.TouchEvent
  ): { offsetX: number; offsetY: number } => {
    if ("touches" in e) {
      const rect = canvasRef.current!.getBoundingClientRect();
      const touch = e.touches[0];
      return {
        offsetX: touch.clientX - rect.left,
        offsetY: touch.clientY - rect.top,
      };
    } else {
      return {
        offsetX: e.nativeEvent.offsetX,
        offsetY: e.nativeEvent.offsetY,
      };
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onTouchStart={startDrawing}
      onMouseMove={draw}
      onTouchMove={draw}
      onMouseUp={stopDrawing}
      onTouchEnd={stopDrawing}
      onMouseLeave={stopDrawing}
      className={styles.drawingCanvas}
      style={{ touchAction: "none" }} // Prevent scrolling while drawing
    />
  );
}
