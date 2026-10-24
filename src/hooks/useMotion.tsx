import { createContext, useContext, type ReactNode } from 'react';

interface MotionState {
  reduced: boolean;
}

const MotionContext = createContext<MotionState>({ reduced: false });

export function MotionProvider({ reduced, children }: { reduced: boolean; children: ReactNode }) {
  return <MotionContext.Provider value={{ reduced }}>{children}</MotionContext.Provider>;
}

export function useMotion(): MotionState {
  return useContext(MotionContext);
}
