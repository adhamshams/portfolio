'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useProgress } from '@react-three/drei';
import Loader from '@/components/loader';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { DESKTOP_GATE_QUERY, PLANET_BY_ID, planetOfFocus, type FocusId, type ModelKey, type Phase } from '@/data/planets';
import SolarScene from './solar-scene';
import SystemNav from './system-nav';
import Hud from './hud';
import PlanetPanel from './panels/planet-panel';
import SunIntro from './panels/sun-intro';
import ProjectsPanel from './panels/projects-panel';
import AboutPanel from './panels/about-panel';
import WorkPanel from './panels/work-panel';
import XpPanel from './panels/xp-panel';
import type { ScreenPower } from './computer-screen';
import styles from './solar.module.css';

const TOTAL_MODELS = 2;
const MIN_LOADER_MS = 1200;
const LOADER_FADE_MS = 400;

function parseFocusHash(hash: string): FocusId | null {
  const id = hash.replace(/^#/, '');
  if (id === 'sun' || id === 'screen') return id;
  return id in PLANET_BY_ID ? (id as FocusId) : null;
}

const SUN_TONE = '#7a1116';

function panelTone(focus: FocusId): string {
  const planet = planetOfFocus(focus);
  return planet ? PLANET_BY_ID[planet].tone : SUN_TONE;
}

/**
 * The computer's CRT: dark but loading while its panel is read, still dark during the pan to
 * the screen, lit once the camera has settled on it, and off (with a collapse) everywhere else.
 * Phones never boot it, so they never load the page either.
 */
function screenPowerFor(focus: FocusId, phase: Phase, canBoot: boolean): ScreenPower {
  if (!canBoot) return 'off';
  if (focus === 'screen') return phase === 'idle' ? 'on' : 'warming';
  if (focus === 'xp' && phase === 'idle') return 'standby';
  return 'off';
}

function PanelContent({ focus, onBoot }: { focus: FocusId; onBoot: () => void }) {
  switch (focus) {
    case 'sun':
      return <SunIntro />;
    case 'projects':
      return <ProjectsPanel />;
    case 'about':
      return <AboutPanel />;
    case 'experience':
      return <WorkPanel />;
    case 'xp':
      return <XpPanel onBoot={onBoot} />;
    default:
      return null;
  }
}

export default function SolarViewer() {
  const [focus, setFocus] = useState<FocusId>('overview');
  const [phase, setPhase] = useState<Phase>('loading');
  const [lastIdleFocus, setLastIdleFocus] = useState<FocusId>('overview');
  const [loadedModels, setLoadedModels] = useState<ReadonlySet<ModelKey>>(() => new Set());
  const [showLoader, setShowLoader] = useState(true);
  const orbitTime = useRef(0);
  const mountedAt = useRef<number | null>(null);
  const pendingHashFocus = useRef<FocusId | null>(null);
  const { progress, active } = useProgress();
  const isSmall = useMediaQuery(DESKTOP_GATE_QUERY);

  useEffect(() => {
    mountedAt.current = performance.now();
    pendingHashFocus.current = parseFocusHash(window.location.hash);
  }, []);

  // Leave the loader once every model has reported in and the loading manager is quiet.
  // `active` (not `progress`) is the reliable signal: cached GLBs never move progress at all.
  const allLoaded = loadedModels.size >= TOTAL_MODELS && !active;

  useEffect(() => {
    if (phase !== 'loading' || !allLoaded) return;
    const elapsed = performance.now() - (mountedAt.current ?? performance.now());
    const timer = setTimeout(() => setPhase('intro'), Math.max(0, MIN_LOADER_MS - elapsed));
    return () => clearTimeout(timer);
  }, [phase, allLoaded]);

  useEffect(() => {
    if (phase === 'loading') return;
    const timer = setTimeout(() => setShowLoader(false), LOADER_FADE_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === 'idle') setLastIdleFocus(focus);
  }, [phase, focus]);

  const handleLoaded = useCallback((key: ModelKey) => {
    setLoadedModels((prev) => (prev.has(key) ? prev : new Set(prev).add(key)));
  }, []);

  const select = useCallback(
    (id: FocusId) => {
      // The XP desktop is mouse-and-keyboard only; a phone stops at the computer's panel.
      const target = id === 'screen' && isSmall ? 'xp' : id;
      if (phase !== 'idle' || target === focus) return;
      setFocus(target);
      setPhase('flying');
    },
    [phase, focus, isSmall]
  );

  const back = useCallback(() => select('overview'), [select]);
  const boot = useCallback(() => select('screen'), [select]);
  const powerOff = useCallback(() => select('xp'), [select]);
  const handleArrive = useCallback(() => setPhase('idle'), []);

  // Deep link (#projects, #about, ...): fly there once the intro has landed.
  useEffect(() => {
    if (phase !== 'idle') return;
    const target = pendingHashFocus.current;
    if (!target) return;
    pendingHashFocus.current = null;
    select(target);
  }, [phase, select]);

  // Keep the URL hash in sync so a focused planet can be shared or reloaded.
  useEffect(() => {
    if (phase === 'loading' || phase === 'intro') return;
    const url = focus === 'overview' ? window.location.pathname + window.location.search : `#${focus}`;
    window.history.replaceState(null, '', url);
  }, [focus, phase]);

  // Escape steps out one level: screen -> computer, anything else -> system.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (focus === 'screen') powerOff();
      else back();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [focus, back, powerOff]);

  const onScreen = focus === 'screen';
  const panelOpen = phase === 'idle' && focus !== 'overview' && !onScreen;
  // While the panel fades out (phase is already 'flying'), keep showing what was open.
  const panelFocus = phase === 'idle' ? focus : lastIdleFocus;
  const displayProgress = allLoaded ? 100 : Math.min(progress, 99);

  return (
    <div className={styles.viewer}>
      <SolarScene
        focus={focus}
        phase={phase}
        orbitTime={orbitTime}
        screenPower={screenPowerFor(focus, phase, !isSmall)}
        onSelect={select}
        onLoaded={handleLoaded}
        onArrive={handleArrive}
      />
      <div className={styles.vignette} aria-hidden="true" />
      <Hud visible={phase === 'idle' && focus === 'overview'} />
      <PlanetPanel open={panelOpen} tone={panelTone(panelFocus)}>
        {panelFocus !== 'overview' && <PanelContent key={panelFocus} focus={panelFocus} onBoot={boot} />}
      </PlanetPanel>
      <button
        type="button"
        className={`${styles.cornerButton} ${panelOpen ? styles.cornerButtonVisible : ''}`}
        tabIndex={panelOpen ? 0 : -1}
        onClick={back}
      >
        ◄ Back to system
      </button>
      <button
        type="button"
        className={`${styles.cornerButton} ${onScreen && phase === 'idle' ? styles.cornerButtonVisible : ''}`}
        tabIndex={onScreen && phase === 'idle' ? 0 : -1}
        onClick={powerOff}
      >
        ◄ Back
      </button>
      <SystemNav
        focus={focus}
        enabled={phase === 'idle'}
        visible={(phase === 'idle' || phase === 'flying') && !onScreen}
        onSelect={select}
      />
      {showLoader && <Loader loaded={loadedModels} progress={displayProgress} hiding={phase !== 'loading'} />}
    </div>
  );
}
