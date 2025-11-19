'use client';

import { useState, useEffect } from 'react';
import styles from './text-overlay.module.css';

export const sunTexts = [
    {
        type: 'title',
        content: 'Adham "Shams"'
    },
    {
        type: 'paragraph',
        content: 'In Arabic, "Shams" means sun, the first structure I learned to read. Radiant, complex, and endlessly recomposed. That origin became my lens: a way of looking past surfaces to uncover the patterns beneath.'
    },
    {
        type: 'paragraph',
        content: 'Design, for me, begins there, inside the architectures hidden in light, music, DNA, books, and movies. Each is a code of rhythms and repetitions waiting to be rearranged. Creation becomes an act of recomposition: taking familiar elements and shaping them into forms that didn\'t exist before.'
    },
    {
        type: 'paragraph',
        content: 'This is the core of my practice: to look deeper, dismantle the familiar, and build something new from its parts.'
    }
];

export const earthTexts = [
    {
        type: 'title',
        content: 'The World'
    },
    {
        type: 'paragraph',
        content: 'Design unfolds in time. Every scroll, every click, every pause is part of a choreography, a rhythm that shapes perception. My portfolio embraces this as both philosophy and form.'
    },
    {
        type: 'paragraph',
        content: 'The next world you enter is my portfolio. My portfolio is Windows XP themed, a system that once hummed on my family’s first computer. It was where I first learned to navigate, to experiment, to make things appear on a screen. Choosing it now isn’t nostalgia; it’s recognition that design lives in moments, interfaces, and experiences that linger in memory.'
    },
    {
        type: 'paragraph',
        content: 'Here, pixels are more than graphics; they are temporal markers of curiosity, discovery, and play. What begins as a desktop becomes a stage, and every interaction is a beat in the performance of design itself.'
    }
];

interface TextOverlayProps {
    stage: 'sun' | 'earth';
    onContinue: () => void;
}

export default function TextOverlay({ stage, onContinue }: TextOverlayProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayedTexts, setDisplayedTexts] = useState<number[]>([]);
    const [showButton, setShowButton] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);

    const texts = stage === 'sun' ? sunTexts : earthTexts;

    useEffect(() => {
        // Reset state when stage changes
        setCurrentIndex(0);
        setDisplayedTexts([]);
        setShowButton(false);
        setIsFadingOut(false);

        // Start showing first text immediately
        setDisplayedTexts([0]);

        // Automatically show subsequent texts with delays
        const timers: NodeJS.Timeout[] = [];

        texts.forEach((_, index) => {
            if (index === 0) return; // First text already shown

            const timer = setTimeout(() => {
                setCurrentIndex(index);
                setDisplayedTexts(prev => [...prev, index]);

                // Show button after last text appears
                if (index === texts.length - 1) {
                    setTimeout(() => {
                        setShowButton(true);
                    }, 800); // Wait 1 second after last text appears
                }
            }, index * 900); // 1.5 seconds between each text

            timers.push(timer);
        });

        return () => {
            timers.forEach(timer => clearTimeout(timer));
        };
    }, [stage, texts]);

    const handleContinue = () => {
        setIsFadingOut(true);
        setTimeout(() => {
            onContinue();
        }, 500); // Match CSS animation duration
    };

    return (
        <div className={styles.overlay}>
            {texts.map((text, index) => {
                const isVisible = displayedTexts.includes(index);
                const isCurrent = index === currentIndex;

                return (
                    <div
                        key={`${stage}-${index}`}
                        className={`${styles.text} 
                            ${isFadingOut ? styles.fadeOut : ''} 
                            ${isVisible && !isFadingOut ? (isCurrent ? styles.fadeIn : styles.visible) : ''} 
                            ${!isVisible ? styles.hidden : ''}`}
                    >
                        {text.type === 'title' ? (
                            <h1 className={styles.title}>{text.content}</h1>
                        ) : (
                            <p className={styles.paragraph}>{text.content}</p>
                        )}
                    </div>
                );
            })}
            <button
                className={`${styles.button} 
                    ${isFadingOut ? styles.fadeOut : ''}
                    ${showButton && !isFadingOut ? styles.fadeInButton : ''} 
                    ${!showButton ? styles.hidden : ''}`}
                onClick={handleContinue}
            >
                Continue
            </button>
        </div>
    );
}

