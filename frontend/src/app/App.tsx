import { useState } from "react";
import Login from "@/features/auth/Login";
import Register from "@/features/auth/Register";
import Home from "@/features/home/Home";
import Dashboard from "@/features/dashboard/Dashboard";
import { useAuthSession } from "@/features/auth/hooks/useAuthSession";
import { useEarthquakes } from "@/features/earthquakes/hooks/useEarthquakes";
import { DEFAULT_APP_VIEW, type AppView } from '@/app/router';

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
      <Dashboard 
        userEmail={userEmail}
        userName={userName}
        onLogout={handleLogout}
        earthquakes={earthquakes}
        onOpenWarningHub={() => setIsWarningHubOpen(true)}
        isLoading={isSearching}
        dataError={dataError}
        lastUpdated={lastUpdated}
        onRefresh={() => loadSeismicData(filters)}
      />
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
