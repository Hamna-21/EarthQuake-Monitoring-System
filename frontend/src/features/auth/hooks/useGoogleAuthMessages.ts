import { useEffect } from 'react';
import { googleSandboxRequest } from '@/features/auth/services/authService';

interface UseGoogleAuthMessagesProps {
  onSuccess: (email: string, token: string, name?: string) => void;
  setError: (error: string) => void;
  setIsLoading: (loading: boolean) => void;
  setSuccess: (success: boolean) => void;
  fallbackError: string;
}

type GoogleAuthMessage =
  | { type: 'GOOGLE_AUTH_SUCCESS_REAL'; email: string; token: string; name?: string }
  | { type: 'GOOGLE_AUTH_SUCCESS_MOCK'; email: string; name: string; country: string };

/** Checks whether google auth message for this frontend flow. */
function isGoogleAuthMessage(value: unknown): value is GoogleAuthMessage {
  if (!value || typeof value !== 'object' || !('type' in value)) return false;
  const message = value as { type?: unknown };
  return message.type === 'GOOGLE_AUTH_SUCCESS_REAL' || message.type === 'GOOGLE_AUTH_SUCCESS_MOCK';
}

/** Handles use google auth messages and keeps the related frontend state or data flow consistent. */
export function useGoogleAuthMessages(props: UseGoogleAuthMessagesProps) {
  // Listen only for same-origin OAuth completion messages and clean up the listener on unmount.
  useEffect(() => {
    const complete = (email: string, token: string, name?: string) => {
      props.setSuccess(true);
      window.setTimeout(() => {
        props.setIsLoading(false);
        props.onSuccess(email, token, name);
      }, 1500);
    };

    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (!isGoogleAuthMessage(event.data)) return;
      if (event.data.type === 'GOOGLE_AUTH_SUCCESS_REAL') {
        complete(event.data.email, event.data.token, event.data.name);
      }
      if (event.data.type === 'GOOGLE_AUTH_SUCCESS_MOCK') {
        try {
          props.setIsLoading(true);
          const data = await googleSandboxRequest(event.data);
          complete(data.user.email, data.token, data.user.name);
        } catch (err: unknown) {
          props.setError(err instanceof Error ? err.message : props.fallbackError);
          props.setIsLoading(false);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [props]);
}
