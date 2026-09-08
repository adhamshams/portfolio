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
          This one needs a desktop
        </h1>
        <div className={styles.box}>
          <p className={styles.paragraph}>
            2025 Portfolio is the Windows XP desktop: draggable windows, Paint, Minesweeper. Mouse-and-keyboard territory, so come back on a bigger screen to boot it up.
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
