'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import styles from './planet-panel.module.css';

interface PlanetPanelProps {
  open: boolean;
  /** Header/tile color for the content inside (exposed as the --tone CSS variable). */
  tone?: string;
  /** Reports the rendered height so the corner button can sit against the panel's top edge. */
  onHeight?: (height: number) => void;
  children: ReactNode;
}

const FADE_MS = 500;

/** Side panel (desktop) / bottom sheet (portrait) that fades in when open and fades out before unmounting. */
export default function PlanetPanel({ open, tone, onHeight, children }: PlanetPanelProps) {
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (open) {
      setMounted(true);
      setClosing(false);
      return;
    }
    setClosing(true);
    const timer = setTimeout(() => {
      setMounted(false);
      setClosing(false);
    }, FADE_MS);
    return () => clearTimeout(timer);
  }, [open]);

  // The sheet is as tall as its content, so only a measurement can place anything above it.
  useEffect(() => {
    const el = ref.current;
    if (!el || !onHeight) return;
    const report = () => onHeight(el.offsetHeight);
    report();
    const observer = new ResizeObserver(report);
    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted, onHeight]);

  if (!mounted) return null;

  return (
    <aside
      ref={ref}
      className={`${styles.panel} ${closing ? styles.fadeOut : styles.fadeIn}`}
      style={{ '--tone': tone ?? 'var(--hal-red-dark)' } as CSSProperties}
      aria-live="polite"
    >
      <div className={styles.content}>{children}</div>
    </aside>
  );
}
