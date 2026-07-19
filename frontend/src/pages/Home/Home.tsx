import Navbar from '../../components/common/Navbar';
import WarningHub from '../../components/warnings/WarningHub';
import Footer from '../../components/common/Footer/Footer';
import { Earthquake } from '../../types';
import HomeHero from './components/HomeHero';
import LandingPageBody from './components/landing/LandingPageBody';

interface HomeProps {
  earthquakes: Earthquake[];
  currentView: 'home' | 'login' | 'register';
  userEmail: string | null;
  userName: string | null;
  onNavigate: (view: 'home' | 'login' | 'register') => void;
  onLogout: () => void;
  isWarningHubOpen: boolean;
  setIsWarningHubOpen: (open: boolean) => void;
  handleExecuteSearch: () => void;
}

export default function Home({
  earthquakes,
  currentView,
  userEmail,
  onNavigate,
  onLogout,
  isWarningHubOpen,
  setIsWarningHubOpen,
  handleExecuteSearch,
}: HomeProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050814] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.16),transparent_34%),radial-gradient(circle_at_90%_25%,rgba(239,68,68,0.15),transparent_30%)]" />
      <Navbar
        onOpenWarningHub={() => setIsWarningHubOpen(true)}
        onNavigate={onNavigate}
        currentView={currentView}
        userEmail={userEmail}
        onLogout={onLogout}
      />
      <HomeHero
        earthquakesCount={earthquakes.length}
        onExecuteSearch={handleExecuteSearch}
      />
      <LandingPageBody earthquakes={earthquakes} onLaunch={handleExecuteSearch} />
      <WarningHub
        isOpen={isWarningHubOpen}
        onClose={() => setIsWarningHubOpen(false)}
      />
      <Footer />
    </div>
  );
}
