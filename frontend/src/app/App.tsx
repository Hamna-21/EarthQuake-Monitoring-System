import { lazy, Suspense, useState } from "react";
import Login from "@/features/auth/Login";
import Register from "@/features/auth/Register";
import Home from "@/features/home/Home";
import { useAuthSession } from "@/features/auth/hooks/useAuthSession";
import { useEarthquakes } from "@/features/earthquakes/hooks/useEarthquakes";
import { DEFAULT_APP_VIEW, type AppView } from '@/app/router';

const Dashboard = lazy(() => import('@/features/dashboard/Dashboard'));

// Coordinate authentication, live data loading, and the lightweight public/private view switch.
export default function App() {
  const [currentView, setCurrentView] = useState<AppView>(DEFAULT_APP_VIEW);
  const { userEmail, userName, handleAuthSuccess, handleLogout } = useAuthSession();

  const {
    earthquakes,
    isSearching,
    dataError,
    lastUpdated,
    isWarningHubOpen,
    setIsWarningHubOpen,
    loadSeismicData,
    filters,
    handleExecuteSearch,
  } = useEarthquakes();

  const handleLoginSuccess = async (email: string, token: string, name?: string) => {
    await handleAuthSuccess(email, token, name);
    setCurrentView('home');
  };

  if (currentView === 'login' && !userEmail) {
    return (
      <Login 
        onSuccess={handleLoginSuccess}
        onNavigateToRegister={() => setCurrentView('register')}
        onBackToHome={() => setCurrentView('home')}
      />
    );
  }

  if (currentView === 'register' && !userEmail) {
    return (
      <Register 
        onSuccess={handleLoginSuccess}
        onNavigateToLogin={() => setCurrentView('login')}
        onBackToHome={() => setCurrentView('home')}
      />
    );
  }

  if (userEmail) {
    return (
      <Suspense fallback={null}>
        <Dashboard
          userEmail={userEmail}
          userName={userName}
          onLogout={handleLogout}
          earthquakes={earthquakes}
          onOpenWarningHub={() => setIsWarningHubOpen(true)}
          isWarningHubOpen={isWarningHubOpen}
          onCloseWarningHub={() => setIsWarningHubOpen(false)}
          isLoading={isSearching}
          dataError={dataError}
          lastUpdated={lastUpdated}
          onRefresh={() => loadSeismicData(filters)}
        />
      </Suspense>
    );
  }

  return (
    <Home
      earthquakes={earthquakes}
      currentView={currentView}
      userEmail={userEmail}
      userName={userName}
      onNavigate={(view) => setCurrentView(view)}
      onLogout={handleLogout}
      isWarningHubOpen={isWarningHubOpen}
      setIsWarningHubOpen={setIsWarningHubOpen}
      handleExecuteSearch={handleExecuteSearch}
    />
  );
}
