'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useProgress } from '@react-three/drei';
import Loader from '@/components/loader';
import { PLANET_BY_ID, type FocusId, type ModelKey, type Phase } from '@/data/planets';
import SolarScene from './solar-scene';
import SystemNav from './system-nav';
import Hud from './hud';
import PlanetPanel from './panels/planet-panel';
import SunIntro from './panels/sun-intro';
import ProjectsPanel from './panels/projects-panel';
import AboutPanel from './panels/about-panel';
import WorkPanel from './panels/work-panel';
import XpPanel from './panels/xp-panel';
import styles from './solar.module.css';

const TOTAL_MODELS = 2;
const MIN_LOADER_MS = 1200;
const LOADER_FADE_MS = 400;

function parseFocusHash(hash: string): FocusId | null {
  const id = hash.replace(/^#/, '');
  if (id === 'sun') return 'sun';
  return id in PLANET_BY_ID ? (id as FocusId) : null;
}

const SUN_TONE = '#7a1116';

function panelTone(focus: FocusId): string {
  if (focus === 'sun' || focus === 'overview') return SUN_TONE;
  return PLANET_BY_ID[focus].tone;
}

function PanelContent({ focus, onBack }: { focus: FocusId; onBack: () => void }) {
  switch (focus) {
    case 'sun':
      return <SunIntro />;
    case 'projects':
      return <ProjectsPanel />;
    case 'about':
      return <AboutPanel />;
    case 'work':
      return <WorkPanel />;
    case 'xp':
      return <XpPanel onBack={onBack} />;
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
      if (phase !== 'idle' || id === focus) return;
      setFocus(id);
      setPhase('flying');
    },
    [phase, focus]
  );

  const back = useCallback(() => select('overview'), [select]);
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

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') back();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [back]);

  const panelOpen = phase === 'idle' && focus !== 'overview';
  // While the panel fades out (phase is already 'flying'), keep showing what was open.
  const panelFocus = phase === 'idle' ? focus : lastIdleFocus;
  const displayProgress = allLoaded ? 100 : Math.min(progress, 99);

  return (
    <div className={styles.viewer}>
      <SolarScene
        focus={focus}
        phase={phase}
        orbitTime={orbitTime}
        onSelect={select}
        onLoaded={handleLoaded}
        onArrive={handleArrive}
      />
      <Hud visible={phase === 'idle' && focus === 'overview'} />
      <PlanetPanel open={panelOpen} tone={panelTone(panelFocus)} onBack={back}>
        {panelFocus !== 'overview' && <PanelContent key={panelFocus} focus={panelFocus} onBack={back} />}
      </PlanetPanel>
      <SystemNav focus={focus} enabled={phase === 'idle'} visible={phase === 'idle' || phase === 'flying'} onSelect={select} />
      {showLoader && <Loader loaded={loadedModels} progress={displayProgress} hiding={phase !== 'loading'} />}
    </div>
  );
}
