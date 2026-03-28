export const audioAssetMap = {
  'midnight-city-lights': require('@/assets/audio/midnight-city-lights.wav'),
  'ocean-memory': require('@/assets/audio/ocean-memory.wav'),
} as const;

export function resolveAudioSource(audioAssetKey: string) {
  return (
    audioAssetMap[audioAssetKey as keyof typeof audioAssetMap] ??
    audioAssetMap['midnight-city-lights']
  );
}
