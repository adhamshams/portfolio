"use client";
import { useRef, useState, useEffect } from "react";

import styles from "./gallery.module.css";
import Image from "next/image";
import Masonry from '@mui/lab/Masonry';
import { useZIndex } from "@/contexts/ZIndexContext";

export default function About() {
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
        <Image src={"/word.png"} alt="Logo" width={45} height={45} />
        <h2>gallery.doc</h2>
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
            <Image src={"/word.png"} alt="Logo" width={20} height={20} />
            <h2 className={styles.title}>gallery.doc</h2>
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
            <div className={styles.about}>
              <div className={styles.wordart}><h1>Gallery</h1></div>
              <Masonry columns={3} spacing={1}>
                <div className={styles.masonryItem}>
                  <img src={"/a.jpg"} alt="Letter A" />
                </div>
                <div className={styles.masonryItem}>
                  <img src={"/id.webp"} alt="GUC ID" />
                </div>
                <div className={styles.masonryItem}>
                  <img src={"/tag.jpg"} alt="Tag" />
                </div>
                <div className={styles.masonryItem}>
                  <img src={"/study.jpg"} alt="Study" />
                </div>
                <div className={styles.masonryItem}>
                  <img src={"/florida.jpg"} alt="Florida" />
                </div>
                <div className={styles.masonryItem}>
                  <img src={"/stitch.jpg"} alt="Stitch" />
                </div>
                <div className={styles.masonryItem}>
                  <img src={"/metro.webp"} alt="Metro" />
                </div>
                <div className={styles.masonryItem}>
                  <img src={"/hero.gif"} alt="Hero" />
                </div>
                <div className={styles.masonryItem}>
                  <img src={"/hamster.jpg"} alt="Hamster" />
                </div>
                <div className={styles.masonryItem}>
                  <img src={"/images.jpeg"} alt="Stranded" />
                </div>
                <div className={styles.masonryItem}>
                  <img src={"/jarir.jpg"} alt="Jeddah" />
                </div>
                <div className={styles.masonryItem}>
                  <img src={"/gunners.jpg"} alt="Gunners" />
                </div>
                <div className={styles.masonryItem}>
                  <img src={"/stranded.jpg"} alt="Stranded" />
                </div>
                <div className={styles.masonryItem}>
                  <img src={"/battlefield.jpg"} alt="Battlefield" />
                </div>
                <div className={styles.masonryItem}>
                  <img src={"https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdjZuNGJlOXIyZHVmbWdvN2JxMzhzb3NmNTRveXRqMzV5NXlldDNvcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/SupA7OgPcAI0g/giphy.gif"} alt="Chungking" />
                </div>
                <div className={styles.masonryItem}>
                  <img src={"/quote.jpg"} alt="Quote" />
                </div>
                <div className={styles.masonryItem}>
                  <img src={"https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExODc0dTFvZ3JmMGV4amVpNW9uZXM1aXplZXBpY3liNWxiMTQxYWQ1biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/iFqOpuQDLgzEiKiWTi/giphy.gif"} alt="Chungking" />
                </div>
                <div className={styles.masonryItem}>
                  <img src={"/zawya.jpg"} alt="Zawya" />
                </div>
                <div className={styles.masonryItem}>
                  <img src={"/berlin.png"} alt="Berlin" />
                </div>
                <div className={styles.masonryItem}>
                  <img src={"https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3drdnd2cXhyZngzcXJ5ZWJkY3J4N3B3aWJ0dHI4cHoxamFseXc4NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/M4QtKS06zmJ2g/giphy.gif"} alt="Chungking" />
                </div>
                <div className={styles.masonryItem}>
                  <img src={"/blonde.jpeg"} alt="Blonde" />
                </div>
                <div className={styles.masonryItem}>
                  <img src={"https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWVkNHg1ZWticWQxOTBnY21tdjUycDlubmt5dzVib25kMnNvem5reSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3fZPYrlEGoSLvq9O/giphy.gif"} alt="Chungking" />
                </div>
              </Masonry>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
