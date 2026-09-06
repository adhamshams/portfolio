'use client';

import { sunTexts } from '@/data/intro';
import RevealText from './reveal-text';

export default function SunIntro() {
  return <RevealText lines={sunTexts} code="SOL 001" />;
}
