export type PlanetId = 'projects' | 'about' | 'work' | 'xp';
export type FocusId = 'overview' | 'sun' | PlanetId;
export type Phase = 'loading' | 'intro' | 'idle' | 'flying';
export type ModelKey = 'sun' | 'computer';

/** sun.glb is roughly a sphere of radius 10 centered at the origin. */
export const SUN_RADIUS = 10;
/** Outermost orbit + planet + margin; used to fit the whole system in view. */
export const SYSTEM_RADIUS = 104;
/** Shared by the layout gate and the XP panel so a phone can never be routed into a gated page. */
export const DESKTOP_GATE_QUERY = '(max-width: 1024px)';

export const MODEL_URLS: Record<ModelKey, string> = {
  sun: '/sun.glb',
  computer: '/computer.glb',
};

export interface PlanetConfig {
  id: PlanetId;
  label: string;
  /** Short name for the bottom nav tile. */
  nav: string;
  /** Tiny HAL-style code line shown above tile names. */
  code: string;
  /** Tile / header color for this body's UI. */
  tone: string;
  color: string;
  /** World units. */
  radius: number;
  orbitRadius: number;
  /** Radians per second at timeScale 1. */
  orbitSpeed: number;
  /** Initial angle in radians so planets start spread out. */
  phase0: number;
  /** Self-rotation, radians per second. */
  spin?: number;
  /** Orbit inclination in radians (keep small). */
  tilt?: number;
  /** Ring sizes are multiples of `radius`. */
  ring?: { inner: number; outer: number; color: string; tilt: number };
  atmosphere?: string;
  model?: Exclude<ModelKey, 'sun'>;
  desktopOnly?: boolean;
}

export const PLANETS: PlanetConfig[] = [
  {
    id: 'projects',
    label: 'Projects',
    nav: 'Projects',
    code: 'PRJ 038',
    tone: '#123a6b',
    color: '#b8161c',
    radius: 3.2,
    orbitRadius: 38,
    orbitSpeed: 0.1,
    phase0: 0.4,
    spin: 0.3,
    ring: { inner: 1.5, outer: 2.2, color: '#d6d6d6', tilt: 0.35 },
  },
  {
    id: 'about',
    label: 'About',
    nav: 'About',
    code: 'ABT 056',
    tone: '#1e5fe0',
    color: '#2a6be0',
    radius: 3.6,
    orbitRadius: 56,
    orbitSpeed: 0.075,
    phase0: 2.3,
    spin: 0.15,
    atmosphere: '#4d8dff',
  },
  {
    id: 'work',
    label: 'Work',
    nav: 'Work',
    code: 'WRK 076',
    tone: '#4a4a4a',
    color: '#8a8a8a',
    radius: 4.0,
    orbitRadius: 76,
    orbitSpeed: 0.055,
    phase0: 4.1,
    spin: 0.2,
    tilt: 0.08,
  },
  {
    id: 'xp',
    label: 'Portfolio 2025',
    nav: '2025',
    code: 'P25 098',
    tone: '#7a1116',
    color: '#3a6ea5',
    radius: 3.6,
    orbitRadius: 98,
    orbitSpeed: 0.04,
    phase0: 5.6,
    spin: 0.25,
    atmosphere: '#5aa0ff',
    model: 'computer',
    desktopOnly: true,
  },
];

export const PLANET_BY_ID: Record<PlanetId, PlanetConfig> = Object.fromEntries(
  PLANETS.map((p) => [p.id, p])
) as Record<PlanetId, PlanetConfig>;
