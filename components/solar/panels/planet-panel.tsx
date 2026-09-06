'use client';

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import styles from './planet-panel.module.css';

interface PlanetPanelProps {
  open: boolean;
  /** Header/tile color for the content inside (exposed as the --tone CSS variable). */
  tone?: string;
  onBack: () => void;
  children: ReactNode;
}

const FADE_MS = 500;

/** Side panel (desktop) / bottom sheet (portrait) that fades in when open and fades out before unmounting. */
export default function PlanetPanel({ open, tone, onBack, children }: PlanetPanelProps) {
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);

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

  if (!mounted) return null;

  return (
    <aside
      className={`${styles.panel} ${closing ? styles.fadeOut : styles.fadeIn}`}
      style={{ '--tone': tone ?? 'var(--hal-red-dark)' } as CSSProperties}
      aria-live="polite"
    >
      <button type="button" className={styles.back} onClick={onBack}>
        ◄ Back to system
      </button>
      <div className={styles.content}>{children}</div>
    </aside>
  );
}
