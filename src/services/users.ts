import { buildApiUrl } from '@/config/api';
import { ArtistProfile } from '@/types/music';

type UsersResponse = {
  users: ArtistProfile[];
  source?: string;
  message?: string;
};

export async function fetchFeaturedUsers(): Promise<ArtistProfile[]> {
  const endpoint = buildApiUrl('/api/discover/users');

  if (!endpoint) {
    return [];
  }

  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(`Users request failed with status ${response.status}`);
  }

  const data = (await response.json()) as UsersResponse;
  return data.users;
}

export async function searchUsers(query: string): Promise<ArtistProfile[]> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [];
  }

  const endpoint = buildApiUrl(`/api/users/search?q=${encodeURIComponent(normalizedQuery)}`);

  if (!endpoint) {
    return [];
  }

  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(`User search failed with status ${response.status}`);
  }

  const data = (await response.json()) as UsersResponse;
  return data.users;
}
