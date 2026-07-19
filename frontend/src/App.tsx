import { useState } from "react";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import { useAuthSession } from "./hooks/useAuthSession";
import { useEarthquakes } from "./hooks/useEarthquakes";

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'register'>('home');
  const { userEmail, userName, handleAuthSuccess, handleLogout } = useAuthSession();

  const {
    earthquakes,
    isSearching,
    dataError,
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
