"use client";
import { useRef, useState, useEffect } from "react";

import styles from "./about.module.css";
import Image from "next/image";
import Masonry from '@mui/lab/Masonry';

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
            <div className={styles.about}>
              <Image
                src={"/wordart.webp"}
                alt="Word Art"
                width={300}
                height={150}
                className={styles.wordart}
              />
              <p>
                Hello! My name is Adham Shams, and I am a <span>?????</span> who loves
                to play in product design, ui/ux, front-end dev, and ways to make the web
                a more fun place. Currently pursuing my master&apos;s in Human-Computer Interaction at the GUC.
                At my core, I&apos;ve always been curious about the world of
                design and driven by a passion for creating meaningful digital experiences.
                Once I discovered the limitless creative potential
                of code, I found myself thriving in that playful, ever-evolving space where
                technology and art collide.
              </p>
              <p>
                This portfolio is wrapped in a Windows XP theme which is nostalgic and deeply personal.
                It nods to the early 2000s, when I had unfiltered access to a family computer and endless time to explore.
                That playful curiosity still drives me today. This space is my way of keeping that spirit alive.
              </p>
              <p>
                As you scroll through this document, you&apos;ll see
                scattered moments (frames from films, glimpses of architecture, random images I stumbled upon online, or snapshots from my own life)
                that have inspired my work or shaped who I am today. Some are meaningful, some are aimless, but all are part of my journey.
              </p>
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
                  <img src={"/cup.webp"} alt="Cup" />
                </div>
                <div className={styles.masonryItem}>
                  <img src={"/hamster.jpg"} alt="Hamster" />
                </div>
                <div className={styles.masonryItem}>
                  <img src={"/images.jpeg"} alt="Stranded" />
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
                  <img src={"/chungking.jpg"} alt="Chungking" />
                </div>
                <div className={styles.masonryItem}>
                  <img src={"/quote.jpg"} alt="Quote" />
                </div>
                <div className={styles.masonryItem}>
                  <img src={"/zawya.jpg"} alt="Zawya" />
                </div>
                <div className={styles.masonryItem}>
                  <img src={"/berlin.png"} alt="Berlin" />
                </div>
                <div className={styles.masonryItem}>
                  <img src={"/blonde.jpg"} alt="Blonde" />
                </div>
                <div className={styles.masonryItem}>
                  <img src={"/jeddah.jpg"} alt="Jeddah" />
                </div>
              </Masonry>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
