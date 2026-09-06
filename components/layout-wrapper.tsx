'use client';

import { usePathname } from 'next/navigation';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import Overlay from '@/components/overlay';
import { DESKTOP_GATE_QUERY } from '@/data/planets';

/** Routes that belong to the Windows XP portfolio, which is mouse-and-keyboard only. */
const DESKTOP_ONLY_ROUTES = ['/user', '/desktop', '/off'];

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSmallDevice = useMediaQuery(DESKTOP_GATE_QUERY);
  const gated = DESKTOP_ONLY_ROUTES.some((route) => pathname?.startsWith(route));

  if (gated && isSmallDevice) {
    return <Overlay />;
  }

  return <>{children}</>;
}
