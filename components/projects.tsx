"use client";
import { useRef, useState, useEffect } from "react";

import styles from "./projects.module.css";
import Image from "next/image";
import { useZIndex } from "@/contexts/ZIndexContext";

export default function Projects() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
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

  return (
    <div>
      <div className={styles.icon} onClick={() => setVisible(true)}>
        <Image src={"/folder.png"} alt="Logo" width={45} height={45} />
        <h2>Projects</h2>
      </div>
      {visible && (
        <div ref={boxRef} onMouseDown={() => {
          // Bring this component to front
          const newZIndex = getNextZIndex();
          boxRef.current && (boxRef.current.style.zIndex = newZIndex.toString());
        }} className={styles.container}>
          <div
            onMouseDown={handleMouseDown}
            className={`${styles.nav} ${isDragging ? styles.grabbing : ""}`}
          >
            <Image src={"/folder.png"} alt="Logo" width={20} height={20} />
            <h2 className={styles.title}>Projects</h2>
            <div className={styles.close}
              onClick={(e) => {
                e.stopPropagation();
                setVisible(false);
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
            >
              <h2>X</h2>
            </div>
          </div>
          <div className={styles.canvas}>
            <div className={styles.projectsContainer}>
              <div className={styles.project}>
                <img src={"/bb.jpg"} alt="Brew Buzz" />
                <div className={styles.projectInfo}>
                  <h3>Brew Buzz Specialty Coffee</h3>
                  <p className={styles.myWork}>UI/UX Design, Mobile App Dev, Website Dev</p>
                  <p>Designed and developed a mobile app for Brew Buzz Specialty Coffee using React Native and Firebase, featuring ordering, loyalty, wallet, promo codes, and gift cards. Additionally, secured the domain and branded SMS sender ID to unify digital branding across channels, and built a responsive, SEO-friendly static landing page using React.js.</p>
                  <p className={styles.links}>
                    <span>Links:</span>
                    <a href="https://apps.apple.com/eg/app/brew-buzz/id6738006550" target="_blank" rel="noopener noreferrer">iOS</a>
                    <span> | </span>
                    <a href="https://play.google.com/store/apps/details?id=com.adhamshams.brewbuzzcoffee" target="_blank" rel="noopener noreferrer">Android</a>
                    <span> | </span>
                    <a href="https://brewbuzzcoffee.com" target="_blank" rel="noopener noreferrer">Website</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
