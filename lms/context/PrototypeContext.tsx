'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DEFAULT_PROGRAMME_ID } from '@/lib/mockData';

export type Scenario = 'first_visit' | 'in_progress' | 'completed';
export type Stage = 'login' | 'onboarding' | 'first-home' | 'home';
export type Profile = { name: string; email: string; phone: string };

interface PrototypeCtx {
  scenario: Scenario;
  setScenario: (s: Scenario) => void;
  stage: Stage;
  setStage: (s: Stage) => void;
  profile: Profile | null;
  setProfile: (p: Profile | null) => void;
  activeProgrammeId: string;
  setActiveProgrammeId: (id: string) => void;
  focusMode: boolean;
  setFocusMode: (v: boolean) => void;
}

const PrototypeContext = createContext<PrototypeCtx>({
  scenario: 'first_visit',
  setScenario: () => {},
  stage: 'login',
  setStage: () => {},
  profile: null,
  setProfile: () => {},
  activeProgrammeId: DEFAULT_PROGRAMME_ID,
  setActiveProgrammeId: () => {},
  focusMode: false,
  setFocusMode: () => {},
});

export function PrototypeProvider({ children }: { children: ReactNode }) {
  const [scenario, setScenarioState] = useState<Scenario>('first_visit');
  const [stage, setStage] = useState<Stage>('login');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeProgrammeId, setActiveProgrammeId] = useState<string>(DEFAULT_PROGRAMME_ID);
  const [focusMode, setFocusMode] = useState(false);

  const setScenario = (s: Scenario) => {
    setScenarioState(s);
    if (s === 'first_visit') {
      setStage('login');
      setProfile(null);
    } else {
      setStage('home');
    }
  };

  useEffect(() => {
    const handler = () => {
      setStage('login');
      setProfile(null);
      setScenarioState('first_visit');
    };
    window.addEventListener('restart-ftue', handler);
    return () => window.removeEventListener('restart-ftue', handler);
  }, []);

  return (
    <PrototypeContext.Provider value={{
      scenario, setScenario,
      stage, setStage,
      profile, setProfile,
      activeProgrammeId, setActiveProgrammeId,
      focusMode, setFocusMode,
    }}>
      {children}
    </PrototypeContext.Provider>
  );
}

export function usePrototype() {
  return useContext(PrototypeContext);
}
