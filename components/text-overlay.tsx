'use client';

import { useState, useEffect } from 'react';
import styles from './text-overlay.module.css';

const texts = [
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
        content: 'This is where everything started. And it\'s where every project begins.'
    }
];

export default function TextOverlay() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayedTexts, setDisplayedTexts] = useState<number[]>([]);
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
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
    }, []);

    const handleContinue = () => {
        // TODO: Implement camera pan to second model
        // For now route to /user page
        window.location.href = "/user";
    };

    return (
        <div className={styles.overlay}>
            {texts.map((text, index) => {
                const isVisible = displayedTexts.includes(index);
                const isCurrent = index === currentIndex;

                return (
                    <div
                        key={index}
                        className={`${styles.text} ${isVisible ? (isCurrent ? styles.fadeIn : styles.visible) : styles.hidden}`}
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
                className={`${styles.button} ${showButton ? styles.fadeInButton : styles.hidden}`}
                onClick={handleContinue}
            >
                Continue
            </button>
        </div>
    );
}

