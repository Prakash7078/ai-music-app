import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppTheme, Radius, Spacing, Typography } from '@/constants/theme';
import { ArtistProfile } from '@/types/music';
import { ThemedText } from '@/components/themed-text';

type ArtistCardProps = {
  artist: ArtistProfile;
};

export function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <View style={styles.card}>
      {artist.avatarUrl ? (
        <Image source={artist.avatarUrl} style={styles.avatarImage} contentFit="cover" />
      ) : (
        <View style={styles.avatar}>
          <ThemedText style={styles.avatarLabel}>
            {artist.name.slice(0, 1).toUpperCase()}
          </ThemedText>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <ThemedText style={styles.name}>{artist.name}</ThemedText>
          {artist.isVerified ? <ThemedText style={styles.verified}>Verified</ThemedText> : null}
        </View>
        <ThemedText style={styles.handle} themeColor="textSecondary">
          @{artist.handle}
        </ThemedText>
        <ThemedText style={styles.meta} themeColor="textMuted">
          {artist.followerCount} followers • {artist.trackCount} tracks
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    backgroundColor: AppTheme.colors.card,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: Radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22311A',
  },
  avatarImage: {
    width: 52,
    height: 52,
    borderRadius: Radius.round,
    backgroundColor: '#22311A',
  },
  avatarLabel: {
    color: AppTheme.colors.text,
    fontSize: Typography.h3,
    fontWeight: '800',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  name: {
    flex: 1,
    color: AppTheme.colors.text,
    fontSize: Typography.body,
    fontWeight: '700',
  },
  verified: {
    color: AppTheme.colors.primary,
    fontSize: Typography.caption,
    fontWeight: '700',
  },
  handle: {
    fontSize: Typography.caption,
  },
  meta: {
    fontSize: Typography.caption,
    lineHeight: 18,
  },
});
