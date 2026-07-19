import { useEffect } from 'react';
import { googleSandboxRequest } from '../utils/authApi';

interface UseGoogleAuthMessagesProps {
  onSuccess: (email: string, token: string, name?: string) => void;
  setError: (error: string) => void;
  setIsLoading: (loading: boolean) => void;
  setSuccess: (success: boolean) => void;
  fallbackError: string;
}

export function useGoogleAuthMessages(props: UseGoogleAuthMessagesProps) {
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
      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS_REAL') {
        complete(event.data.email, event.data.token, event.data.name);
      }
      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS_MOCK') {
        try {
          props.setIsLoading(true);
          const data = await googleSandboxRequest(event.data);
          complete(data.user.email, data.token, data.user.name);
        } catch (err: any) {
          props.setError(err.message || props.fallbackError);
          props.setIsLoading(false);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [props]);
}
