"use client";
import { useRef, useState, useEffect } from "react";

import styles from "./note.module.css";
import { useZIndex } from "@/contexts/ZIndexContext";

export default function Note() {
    const boxRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
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
        
        // Bring this component to front
        const newZIndex = getNextZIndex();
        box.style.zIndex = newZIndex.toString();
        
        const rect = box.getBoundingClientRect();
        setOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
        setIsDragging(true);
    };

    return (
        <div
            ref={boxRef}
            onMouseDown={handleMouseDown}
            className={`${styles.container} ${isDragging ? styles.grabbing : ""}`}
        >
            <h4>TO DO LIST:</h4>
            <p>-finish my master&apos;s degree</p>
            <p className={styles.complete}>-find the best matcha in cairo</p>
            <p>-make this portfolio mobile responsive</p>
            <p>-learn 3D art</p>
            <p>-become president</p>
            <p>-travel a lot</p>
        </div>
    );
}
