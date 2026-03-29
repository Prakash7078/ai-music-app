import Constants from 'expo-constants';
import { Platform } from 'react-native';

function getExpoHost() {
  const hostUri = (Constants.expoConfig as { hostUri?: string } | null)?.hostUri;

  if (!hostUri) {
    return null;
  }

  const [host] = hostUri.split(':');
  return host || null;
}

function getDefaultApiBaseUrl() {
  const expoHost = getExpoHost();

  if (expoHost) {
    return `http://${expoHost}:3000`;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }

  return 'http://localhost:3000';
}

const explicitApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();

export const API_BASE_URL =
  explicitApiBaseUrl || (__DEV__ ? getDefaultApiBaseUrl() : '');

export function buildApiUrl(path: string) {
  if (!API_BASE_URL) {
    return null;
  }

  return `${API_BASE_URL.replace(/\/$/, '')}${path}`;
}
