"use client";
import { useRef, useState, useEffect } from "react";

import styles from "./about.module.css";
import Image from "next/image";

export default function About() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: { clientX: number; clientY: number }) => {
      if (isDragging && boxRef.current) {
        boxRef.current.style.left = `${e.clientX - offset.x}px`;
        boxRef.current.style.top = `${e.clientY - offset.y}px`;
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, offset]);

  const handleMouseDown = (e: { clientX: number; clientY: number }) => {
    const box = boxRef.current;
    if (!box) return;
    const rect = box.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDragging(true);
  };

  return (
    <div>
      <div className={styles.icon} onClick={() => setVisible(true)}>
        <Image src={"/word.png"} alt="Logo" width={45} height={45} />
        <h2>About Me</h2>
      </div>
      {visible && (
        <div ref={boxRef} className={styles.container}>
          <div
            onMouseDown={handleMouseDown}
            className={`${styles.nav} ${isDragging ? styles.grabbing : ""}`}
          >
            <Image src={"/word.png"} alt="Logo" width={20} height={20} />
            <h2 className={styles.title}>About Me - Microsoft Word</h2>
            <div className={styles.close} onClick={() => setVisible(false)}>
              <h2>X</h2>
            </div>
          </div>
          <div className={styles.canvas}>
            <Image
              src={"/wordart.png"}
              alt="Word Art"
              width={300}
              height={100}
              className={styles.wordart}
            />
          </div>
        </div>
      )}
    </div>
  );
}
