"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ZIndexContextType {
  getNextZIndex: () => number;
  currentMaxZIndex: number;
}

const ZIndexContext = createContext<ZIndexContextType | undefined>(undefined);

export function ZIndexProvider({ children }: { children: ReactNode }) {
  const [maxZIndex, setMaxZIndex] = useState(1);

  const getNextZIndex = () => {
    const nextZ = maxZIndex + 1;
    setMaxZIndex(nextZ);
    return nextZ;
  };

  return (
    <ZIndexContext.Provider value={{ getNextZIndex, currentMaxZIndex: maxZIndex }}>
      {children}
    </ZIndexContext.Provider>
  );
}

export function useZIndex() {
  const context = useContext(ZIndexContext);
  if (context === undefined) {
    throw new Error('useZIndex must be used within a ZIndexProvider');
  }
  return context;
}
