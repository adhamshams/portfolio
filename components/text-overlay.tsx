'use client';

import { useState, useEffect } from 'react';
import styles from './text-overlay.module.css';

export const sunTexts = [
    {
        type: 'title',
        content: 'Adham Shams'
    },
    {
        type: 'paragraph',
        content: 'In Arabic, “Shams” means sun, the first structure I learned to read. It became my earliest lens, seeing beyond the surface to the patterns underneath.'
    },
    {
        type: 'paragraph',
        content: 'My practice began there, in the hidden architectures of light, music, DNA, books, and cinema. Each a system of rhythms waiting to be reshaped into something new.'
    },
    {
        type: 'paragraph',
        content: 'This is my approach: look deeper, break things open, rebuild them with intent.'
    }
];

export const earthTexts = [
    {
        type: 'title',
        content: 'The World'
    },
    {
        type: 'paragraph',
        content: 'Design unfolds in time. Every scroll and pause is part of a sequence that shapes how we perceive and feel.'
    },
    {
        type: 'paragraph',
        content: 'This world you enter is a journey through memory and discovery, where each interaction reveals something new.'
    },
    {
        type: 'paragraph',
        content: 'Here, the screen becomes a stage. Pixels become memories, markers of curiosity, discovery, and play.'
    }
];

export const desktopTexts = [
    {
        type: 'title',
        content: 'The Machine'
    },
    {
        type: 'paragraph',
        content: 'This Windows XP-themed portfolio interface is a return to the system on my family\'s first computer, where I first sensed what screens could do.'
    },
    {
        type: 'paragraph',
        content: 'The old desktop represents the spark, the place where I learned that ideas could be built, broken, and rebuilt.'
    },
    {
        type: 'paragraph',
        content: 'It taught me that design lives in behavior as much as form, and that code can be a creative material.'
    }
];


interface TextOverlayProps {
    stage: 'sun' | 'earth' | 'computer';
    onContinue: () => void;
}

export default function TextOverlay({ stage, onContinue }: TextOverlayProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayedTexts, setDisplayedTexts] = useState<number[]>([]);
    const [showButton, setShowButton] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);

    let texts = sunTexts;
    if (stage === 'earth') texts = earthTexts;
    if (stage === 'computer') texts = desktopTexts;

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
                [Continue]
            </button>
        </div>
    );
}

