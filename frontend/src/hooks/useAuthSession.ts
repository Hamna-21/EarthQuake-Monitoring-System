import { useEffect, useState } from 'react';

export function useAuthSession() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('geopulse_token');
      if (!token) return;

      try {
        const response = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          localStorage.removeItem('geopulse_token');
          return;
        }

        const data = await response.json();
        setUserEmail(data.user.email);
        setUserName(data.user.name);
      } catch (err) {
        console.error('Failed to auto-verify session:', err);
      }
    };

    restoreSession();
  }, []);

  const handleAuthSuccess = async (email: string, token: string, name?: string) => {
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
  };

  return { userEmail, userName, handleAuthSuccess, handleLogout };
}
