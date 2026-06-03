'use client';
import SideNav from '@/components/SideNav';
import HomeScreen from '@/components/home/HomeScreen';
import LoginScreen from '@/components/onboarding/LoginScreen';
import FirstTimeHome from '@/components/onboarding/FirstTimeHome';
import { usePrototype } from '@/context/PrototypeContext';

export default function HomePage() {
  const { stage, setStage, profile, setProfile } = usePrototype();

  if (stage === 'login') {
    return <LoginScreen onLogin={() => {
      setProfile({ name: 'Arjun Mehta', email: 'arjun.mehta@fmc.edu', phone: '+91 98765 43210' });
      setStage('first-home');
    }} />;
  }

  if (stage === 'first-home' && profile) {
    return (
      <FirstTimeHome
        profile={profile}
        onTourDone={() => setStage('home')}
      />
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#FBF4EA' }}>
      <SideNav />
      <main style={{ flex: 1, height: '100vh', overflow: 'auto', background: '#F8F5F1' }}>
        <HomeScreen />
      </main>
    </div>
  );
}
