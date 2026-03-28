export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL?.trim() ?? '';

export function buildApiUrl(path: string) {
  if (!API_BASE_URL) {
    return null;
  }

  return `${API_BASE_URL.replace(/\/$/, '')}${path}`;
}
