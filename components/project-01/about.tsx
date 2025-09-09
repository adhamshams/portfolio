"use client";
import { useRef, useState, useEffect } from "react";

import styles from "./about.module.css";
import Image from "next/image";
import { useZIndex } from "@/contexts/ZIndexContext";

export default function About({ onClose }: { onClose: () => void }) {
    const boxRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
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
        if (boxRef.current) {
            const newZIndex = getNextZIndex();
            boxRef.current.style.zIndex = newZIndex.toString();
        }
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose?.();
            setIsClosing(false);
        }, 200); // Match the animation duration
    };

    return (
        <div ref={boxRef} onMouseDown={() => {
            // Bring this component to front
            const newZIndex = getNextZIndex();
            boxRef.current && (boxRef.current.style.zIndex = newZIndex.toString());
        }} className={`${styles.container} ${isClosing ? styles.closing : ''}`}>
            <div
                onMouseDown={handleMouseDown}
                className={`${styles.nav} ${isDragging ? styles.grabbing : ""}`}
            >
                <Image src={"/txt.webp"} alt="Logo" width={20} height={20} />
                <h2 className={styles.title}>about.txt</h2>
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
                    <h2>Brew Buzz Specialty Coffee</h2>
                    <p className={styles.role}>roles: ui/ux design, mobile dev, web dev</p>
                    <p>Brew Buzz is a specialty coffee shop in cairo with a name thats as lively as the space itself. Buzzing, bright, and irresistibly cute. From the very beginning, I wanted the digital experience to be full of personality and feel just like stepping into Brew Buzz in real life. That meant approaching the design not just as a developer, but as a storyteller translating a physical space into pixels.</p>
                    <p>The visual language was guided by the brands playful spirit. Rounded shapes, soft shadows, friendly typography, and a vibrant but cozy color palette were all key elements. Every button, screen, and transition was designed to feel fluid and intuitive, as if the app itself was "bouncing" with energy. Even small UI details like the animated loyalty card, the falling mascot after the app splash screen, and microinteractions on the website all added to that sense of delight.</p>
                    <p>I designed and developed a high-performance mobile app using React Native and Firebase. The app includes a full-featured ordering system, loyalty program, wallet integration, promo codes, and digital gift cards, all of which helped drive over 100K EGP in revenue serving over 500 users monthly.</p>
                    <p>Beyond functionality, I treated the branding as an ecosystem. I secured the brewbuzzcoffee.com domain and set up a custom SMS sender ID so even OTPs felt like they came from the Brew Buzz world. The landing page, built with Next.js, mirrors the in-store experience online.</p>
                    <p>This wasnt just a tech project, it was a full brand experience, designed to be as flavorful and inviting as the coffee itself.</p>
                </div>
            </div>
        </div>
    );
}
