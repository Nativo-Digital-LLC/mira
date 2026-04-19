export const API_EVENT_UNAUTHORIZED = 'api-unauthorized';

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('ups_token');
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };

  // Don't override Content-Type if it's already set (e.g. for FormData)
  if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(path, { ...options, headers });

  if (response.status === 401 || response.status === 403) {
    window.dispatchEvent(new CustomEvent(API_EVENT_UNAUTHORIZED));
  }

  return response;
}

export async function apiGet(path: string) {
  const res = await apiFetch(path);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiPost(path: string, body: unknown) {
  const res = await apiFetch(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiDelete(path: string) {
  const res = await apiFetch(path, { method: 'DELETE' });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
