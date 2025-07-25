"use client";
import { useRef, useState, useEffect } from "react";

import styles from "./project-01.module.css";
import Image from "next/image";
import { useZIndex } from "@/contexts/ZIndexContext";

export default function BrewBuzz() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const { getNextZIndex } = useZIndex();

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

  useEffect(() => {
    if (visible && boxRef.current) {
      const newZIndex = getNextZIndex();
      boxRef.current.style.zIndex = newZIndex.toString();
    }
  }, [visible]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setVisible(false);
      setIsClosing(false);
    }, 200); // Match the animation duration
  };

  return (
    <div>
      <div className={styles.icon} onClick={() => setVisible(true)}>
        <Image src={"/folder.webp"} alt="Logo" width={45} height={45} />
        <h2>Project 01 - Brew Buzz</h2>
      </div>
      {visible && (
        <div ref={boxRef} onMouseDown={() => {
          // Bring this component to front
          const newZIndex = getNextZIndex();
          boxRef.current && (boxRef.current.style.zIndex = newZIndex.toString());
        }} className={`${styles.container} ${isClosing ? styles.closing : ''}`}>
          <div
            onMouseDown={handleMouseDown}
            className={`${styles.nav} ${isDragging ? styles.grabbing : ""}`}
          >
            <Image src={"/folder.webp"} alt="Logo" width={20} height={20} />
            <h2 className={styles.title}>Project 01 - Brew Buzz</h2>
            <div className={styles.close}
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
            >
              <Image src={"/exit.webp"} alt="Close" width={25} height={25} />
            </div>
          </div>
          <div className={styles.canvas}>
            <div className={styles.subIcon}>
              <Image src={"/image.webp"} alt="Logo" width={45} height={45} />
              <p>thumbnail.png</p>
            </div>
            <div className={styles.subIcon}>
              <Image src={"/txt.webp"} alt="Logo" width={45} height={45} />
              <p>about.txt</p>
            </div>
            <a href="https://brewbuzzcoffee.com" target="_blank" rel="noopener noreferrer" className={styles.subIcon}>
              <Image src={"/internet.webp"} alt="Logo" width={45} height={45} />
              <p>website</p>
            </a>
            <a href="https://apps.apple.com/eg/app/brew-buzz/id6738006550" target="_blank" rel="noopener noreferrer" className={styles.subIcon}>
              <Image src={"/phone.webp"} alt="Logo" width={45} height={45} />
              <p>ios app</p>
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.adhamshams.brewbuzzcoffee" target="_blank" rel="noopener noreferrer" className={styles.subIcon}>
              <Image src={"/phone.webp"} alt="Logo" width={45} height={45} />
              <p>android app</p>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
