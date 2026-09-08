'use client';

import { sunTexts } from '@/data/intro';
import PanelText from './panel-text';

export default function SunIntro() {
  return <PanelText lines={sunTexts} code="SOL 001" />;
}
