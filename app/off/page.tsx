'use client';

import { useEffect, useRef } from 'react';
import styles from './page.module.css';

export default function OffPage() {
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const velocityRef = useRef({ x: 3, y: 2 });
  const positionRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const image = imageRef.current;
    const container = containerRef.current;
    
    if (!image || !container) return;

    const imageWidth = 80; // Fixed size for the bouncing image
    const imageHeight = 80;

    // Initialize position
    positionRef.current = {
      x: Math.random() * (window.innerWidth - imageWidth),
      y: Math.random() * (window.innerHeight - imageHeight)
    };

    const animate = () => {
      const { x, y } = positionRef.current;
      const { x: vx, y: vy } = velocityRef.current;
      
      // Calculate new position
      let newX = x + vx;
      let newY = y + vy;
      
      // Bounce off edges
      if (newX <= 0 || newX >= window.innerWidth - imageWidth) {
        velocityRef.current.x = -vx;
        newX = Math.max(0, Math.min(newX, window.innerWidth - imageWidth));
      }
      
      if (newY <= 0 || newY >= window.innerHeight - imageHeight) {
        velocityRef.current.y = -vy;
        newY = Math.max(0, Math.min(newY, window.innerHeight - imageHeight));
      }
      
      // Update position
      positionRef.current = { x: newX, y: newY };
      
      // Apply to image
      if (image) {
        image.style.left = `${newX}px`;
        image.style.top = `${newY}px`;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Handle window resize
    const handleResize = () => {
      const { x, y } = positionRef.current;
      positionRef.current = {
        x: Math.min(x, window.innerWidth - imageWidth),
        y: Math.min(y, window.innerHeight - imageHeight)
      };
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.container}>
      <img
        ref={imageRef}
        src="/smiley.png"
        alt="Bouncing smiley"
        className={styles.bouncingImage}
        width={80}
        height={80}
      />
    </div>
  );
}
