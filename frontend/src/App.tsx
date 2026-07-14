import React, { useState, useEffect } from "react";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import { useEarthquakes } from "./hooks/useEarthquakes";

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'register'>('home');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

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

  // Restore user session from JWT token on mount
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('geopulse_token');
      if (!token) return;

      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserEmail(data.user.email);
          setUserName(data.user.name);
        } else {
          localStorage.removeItem('geopulse_token');
        }
      } catch (err) {
        console.error('Failed to auto-verify session:', err);
      }
    };

    restoreSession();
  }, []);

  const handleAuthSuccess = async (email: string, token: string, name?: string) => {
    localStorage.setItem('geopulse_token', token);
    setUserEmail(email);
    if (name) {
      setUserName(name);
    }
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUserName(data.user.name);
      }
    } catch (err) {
      console.error("Failed to fetch profile during login success:", err);
    }
    setCurrentView('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('geopulse_token');
    setUserEmail(null);
    setUserName(null);
  };

  if (currentView === 'login' && !userEmail) {
    return (
      <Login 
        onSuccess={handleAuthSuccess}
        onNavigateToRegister={() => setCurrentView('register')}
        onBackToHome={() => setCurrentView('home')}
      />
    );
  }

  if (currentView === 'register' && !userEmail) {
    return (
      <Register 
        onSuccess={handleAuthSuccess}
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
