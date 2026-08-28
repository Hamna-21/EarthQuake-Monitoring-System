import { useEffect, useState } from 'react';

/** Handles use auth session and keeps the related frontend state or data flow consistent. */
export function useAuthSession() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    // Revalidate the stored token on startup instead of trusting stale client-side session state.
    const restoreSession = async () => {
      const token = localStorage.getItem('geopulse_token');
      if (!token) {
        setIsRestoring(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          localStorage.removeItem('geopulse_token');
          setSessionExpired(true);
          setIsRestoring(false);
          return;
        }

        const data = await response.json();
        setUserEmail(data.user.email);
        setUserName(data.user.name);
      } catch (err) {
        console.error('Failed to auto-verify session:', err);
      } finally {
        setIsRestoring(false);
      }
    };

    restoreSession();
  }, []);

  const handleAuthSuccess = async (email: string, token: string, name?: string) => {
    // Save the token immediately, then refresh the profile so OAuth and local login share one session path.
    localStorage.setItem('geopulse_token', token);
    setUserEmail(email);
    if (name) setUserName(name);

    try {
      const response = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUserName(data.user.name);
      }
    } catch (err) {
      console.error('Failed to fetch profile during login success:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('geopulse_token');
    setUserEmail(null);
    setUserName(null);
    setSessionExpired(false);
  };

  return { userEmail, userName, isRestoring, sessionExpired, handleAuthSuccess, handleLogout };
}
