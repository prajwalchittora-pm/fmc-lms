'use client';
import { PrototypeProvider } from '@/context/PrototypeContext';
import PrototypeControls from '@/components/PrototypeControls';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrototypeProvider>
      <PrototypeControls />
      {children}
    </PrototypeProvider>
  );
}
