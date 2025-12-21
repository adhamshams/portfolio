'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import Overlay from '@/components/overlay';

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const isSmallDevice = useMediaQuery('(max-width: 1024px)');

  if (isSmallDevice) {
    return <Overlay />;
  }

  return <>{children}</>;
}
