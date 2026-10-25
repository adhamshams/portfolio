'use client';

import { useEffect, useState } from 'react';
import styles from './hud.module.css';

/** Top-left readout cluster in the overview, after the HAL 9000 wall panels. */
export default function Hud({ visible }: { visible: boolean }) {
  const [clock, setClock] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      setClock(`${now.getMonth() + 1} ${pad(now.getDate())} ${pad(now.getFullYear() % 100)} ${pad(now.getHours())}`);
    };
    tick();
    const timer = setInterval(tick, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`${styles.hud} ${visible ? styles.visible : ''}`} aria-hidden="true">
      <div className={styles.row}>
        <span className={styles.code}>
          <span className={`${styles.marker} ${styles.red}`} />
          AS 9000
        </span>
        <span className={styles.name}>Adham Shams</span>
      </div>
      <div className={`${styles.row} ${styles.clock}`}>
        <span className={`${styles.marker} ${styles.blue}`} />
        {clock}
      </div>
    </div>
  );
}
