'use client';

import { useEffect, useState } from 'react';
import styles from './loader.module.css';
import type { ModelKey } from '@/data/planets';

const SERVICES: { key: ModelKey; label: string }[] = [
  { key: 'sun', label: 'THE SUN 23021' },
  { key: 'computer', label: 'COMPUTER 203021' },
];

interface LoaderProps {
  loaded?: ReadonlySet<ModelKey>;
  progress?: number;
  hiding?: boolean;
}

export default function Loader({ loaded, progress = 0, hiding = false }: LoaderProps) {
  const [date, setDate] = useState('');

  useEffect(() => {
    setDate(new Date().toDateString());
  }, []);

  const loadedCount = loaded?.size ?? 0;

  return (
    <div className={`${styles.container} ${hiding ? styles.hiding : ''}`}>
      <h5>ADHAMOS v5.0.3</h5>
      <p>ASBIOS (C) 2001 Adham Shams Inc.</p>
      <p className={styles.top}>Checking RAM: 16384K Detected</p>
      <p>Loading Kernel: shams_core.sys</p>
      <h5 className={styles.top}>[Boot sequence initiated]</h5>
      <div className={styles.hardwareInfo}>
        <p className={styles.settingHeader}>
          STARTING SERVICES ({loadedCount}/{SERVICES.length})... {Math.round(progress)}%
        </p>
        {SERVICES.map((service) => {
          const ok = loaded?.has(service.key) ?? false;
          return (
            <div key={service.key} className={styles.settingRow}>
              <p>{service.label}</p>
              {ok ? (
                <p className={styles.ok}>OK</p>
              ) : (
                <p className={styles.running}>... initializing</p>
              )}
            </div>
          );
        })}
      </div>
      <p className={styles.timestamp}>{date}</p>
    </div>
  );
}
