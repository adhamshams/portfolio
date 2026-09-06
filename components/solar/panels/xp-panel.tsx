'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { DESKTOP_GATE_QUERY } from '@/data/planets';
import { xpTexts } from '@/data/intro';
import RevealText from './reveal-text';
import styles from './panels.module.css';

interface XpPanelProps {
  onBack: () => void;
}

export default function XpPanel({ onBack }: XpPanelProps) {
  const router = useRouter();
  const isSmall = useMediaQuery(DESKTOP_GATE_QUERY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isSmall) router.prefetch('/user');
  }, [isSmall, router]);

  if (isSmall) {
    return (
      <>
        <h1 className={styles.title}>
          <span className={styles.code}>P25 098</span>
          This one needs a desktop
        </h1>
        <div className={styles.box}>
          <p className={styles.paragraph}>
            Portfolio 2025 is the Windows XP desktop: draggable windows, Paint, Minesweeper. Mouse-and-keyboard territory, so come back on a bigger screen to boot it up.
          </p>
        </div>
        <button type="button" className={`${styles.button} ${styles.buttonIn}`} onClick={onBack}>
          ◄ Back to system
        </button>
      </>
    );
  }

  return (
    <>
      <RevealText lines={xpTexts} code="P25 098" onDone={() => setReady(true)} />
      <button
        type="button"
        className={`${styles.button} ${ready ? styles.buttonIn : ''}`}
        tabIndex={ready ? 0 : -1}
        onClick={() => router.push('/user')}
      >
        Boot ►
      </button>
    </>
  );
}
