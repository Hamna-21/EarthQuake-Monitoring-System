// Send JSON credentials to the backend and surface its normalized error message to the forms.
export async function postAuth(path: string, body: Record<string, unknown>) {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Authentication request failed');
  }

  return response.json();
}

/** Renders or coordinates login request for this frontend module. */
export function loginRequest(email: string, password: string) {
  return postAuth('/api/auth/login', { email, password });
}

/** Renders or coordinates register request for this frontend module. */
export function registerRequest(values: {
  email: string;
  password: string;
  name: string;
  country: string;
  organization: string;
}) {
  return postAuth('/api/auth/register', values);
}

/** Renders or coordinates google sandbox request for this frontend module. */
export function googleSandboxRequest(values: {
  email: string;
  name: string;
  country: string;
}) {
  return postAuth('/api/auth/google/sandbox-callback', values);
}
