'use client';

import type { CSSProperties } from 'react';
import { PLANETS, planetOfFocus, type FocusId } from '@/data/planets';
import styles from './system-nav.module.css';

interface SystemNavProps {
  focus: FocusId;
  enabled: boolean;
  visible: boolean;
  onSelect: (id: FocusId) => void;
}

const ITEMS: { id: FocusId; name: string; code: string; tile: string }[] = [
  { id: 'overview', name: 'System', code: 'SYS 000', tile: '#5b5b5b' },
  { id: 'sun', name: 'Sun', code: 'SOL 001', tile: '#b3121a' },
  ...PLANETS.map((planet) => ({ id: planet.id as FocusId, name: planet.nav, code: planet.code, tile: planet.tone })),
];

export default function SystemNav({ focus, enabled, visible, onSelect }: SystemNavProps) {
  // The screen close-up belongs to the computer's tile.
  const pressed: FocusId = planetOfFocus(focus) ?? focus;
  // Portrait hides the bar once a body is focused; the corner button is the way back.
  const focused = focus !== 'overview';
  return (
    <nav
      className={`${styles.nav} ${visible ? styles.visible : ''} ${focused ? styles.focused : ''}`}
      aria-label="Solar system"
    >
      {ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          className={styles.item}
          style={{ '--tile': item.tile } as CSSProperties}
          aria-pressed={pressed === item.id}
          disabled={!enabled}
          onClick={() => onSelect(item.id)}
        >
          <span className={styles.code} aria-hidden="true">
            {item.code}
          </span>
          <span className={styles.name}>{item.name}</span>
        </button>
      ))}
    </nav>
  );
}
