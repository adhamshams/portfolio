'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import { DESKTOP_GATE_QUERY } from '@/data/planets';
import { xpTexts } from '@/data/intro';
import PanelText from './panel-text';
import styles from './panels.module.css';

interface XpPanelProps {
  /** Powers the computer on: the camera pans to its screen, where the old portfolio runs. */
  onBoot: () => void;
}

export default function XpPanel({ onBoot }: XpPanelProps) {
  const isSmall = useMediaQuery(DESKTOP_GATE_QUERY);

  if (isSmall) {
    return (
      <>
        <h1 className={styles.title}>
          <span className={styles.code}>P25 098</span>
          Open on a computer
        </h1>
        <div className={styles.box}>
          <p className={styles.paragraph}>
            My 2025 portfolio is a Windows XP style desktop with windows you drag around with a mouse. It doesn&apos;t work on phones or tablets.
          </p>
          <p className={styles.paragraph}>
            To try it, visit this site on a laptop or desktop computer.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <PanelText lines={xpTexts} code="P25 098" />
      <button type="button" className={styles.button} onClick={onBoot}>
        Boot ►
      </button>
    </>
  );
}
