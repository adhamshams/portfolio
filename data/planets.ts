export type PlanetId = 'projects' | 'about' | 'experience' | 'xp';
/** `screen` is the close-up of the computer's CRT, where the 2025 portfolio runs. */
export type FocusId = 'overview' | 'sun' | PlanetId | 'screen';
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

/**
 * Where the CRT glass sits inside a planet's GLB, in the model's own (unscaled, uncentered)
 * frame. The embedded page is drawn on this rectangle and the camera frames it head-on.
 */
export interface ScreenConfig {
  /** Center of the glass. */
  position: [number, number, number];
  /** Rotation about Y (radians) so the anchor's +Z is the glass normal. */
  yaw: number;
  /** Glass extents in model units. */
  width: number;
  height: number;
  /** Fraction of the glass the picture fills; the rest reads as bezel and rounded CRT corners. */
  inset: number;
  /** CSS pixel size of the embedded page. Width must clear DESKTOP_GATE_QUERY. */
  viewport: [number, number];
  url: string;
}

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
  screen?: ScreenConfig;
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
    id: 'experience',
    label: 'Experience',
    nav: 'Experience',
    code: 'EXP 076',
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
    label: '2025 Portfolio',
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
    // Fitted to the Old_Computer_Glass_0 mesh in computer.glb: a flat plane turned ~10° about Y.
    screen: {
      position: [-2.622, 4.217, 1.984],
      yaw: 0.1743,
      width: 9.948,
      height: 7.838,
      inset: 0.94,
      viewport: [1280, 1009],
      url: '/user',
    },
    desktopOnly: true,
  },
];

export const PLANET_BY_ID: Record<PlanetId, PlanetConfig> = Object.fromEntries(
  PLANETS.map((p) => [p.id, p])
) as Record<PlanetId, PlanetConfig>;

/** The planet a focus belongs to (`screen` lives on the computer), or null for the overview/sun. */
export function planetOfFocus(focus: FocusId): PlanetId | null {
  if (focus === 'screen') return 'xp';
  return focus in PLANET_BY_ID ? (focus as PlanetId) : null;
}
