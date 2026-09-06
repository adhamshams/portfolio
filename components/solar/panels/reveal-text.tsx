'use client';

import { useEffect, useRef, useState } from 'react';
import type { TextLine } from '@/data/intro';
import styles from './panels.module.css';

interface RevealTextProps {
  lines: TextLine[];
  /** Tiny code line printed above the title tile. */
  code?: string;
  /** Milliseconds between lines. */
  delay?: number;
  /** Called shortly after the last line has appeared. */
  onDone?: () => void;
}

/** Reveals lines one after another: title lines as tiles, paragraphs inside one bordered box. */
export default function RevealText({ lines, code, delay = 900, onDone }: RevealTextProps) {
  const [shown, setShown] = useState(1);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    setShown(1);
    const timers = lines.slice(1).map((_, i) => setTimeout(() => setShown(i + 2), (i + 1) * delay));
    const done = setTimeout(() => onDoneRef.current?.(), (lines.length - 1) * delay + 800);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(done);
    };
  }, [lines, delay]);

  const lineClass = (index: number) => `${styles.line} ${index < shown ? styles.lineIn : ''}`;
  const titles = lines.map((line, index) => ({ line, index })).filter(({ line }) => line.type === 'title');
  const paragraphs = lines.map((line, index) => ({ line, index })).filter(({ line }) => line.type === 'paragraph');

  return (
    <>
      {titles.map(({ line, index }) => (
        <div key={index} className={lineClass(index)}>
          <h1 className={styles.title}>
            {code && <span className={styles.code}>{code}</span>}
            {line.content}
          </h1>
        </div>
      ))}
      {paragraphs.length > 0 && (
        <div className={styles.box}>
          {paragraphs.map(({ line, index }) => (
            <div key={index} className={lineClass(index)}>
              <p className={styles.paragraph}>{line.content}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
