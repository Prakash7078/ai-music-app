import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppTheme, Radius, Spacing, Typography } from '@/constants/theme';
import { ThemedText } from '@/components/themed-text';

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.inputShell}>
        <ThemedText style={styles.searchIcon}>Search</ThemedText>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder="Search songs or artists"
          placeholderTextColor={AppTheme.colors.textMuted}
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {value.trim() ? (
          <Pressable onPress={() => onChange('')} style={styles.clearButton}>
            <ThemedText style={styles.clearLabel}>Clear</ThemedText>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.sm,
  },
  inputShell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: '#0E1628',
    borderRadius: Radius.round,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
  },
  searchIcon: {
    color: AppTheme.colors.textMuted,
    fontSize: Typography.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  input: {
    flex: 1,
    color: AppTheme.colors.text,
    fontSize: Typography.body,
    paddingVertical: 0,
  },
  clearButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: Radius.round,
    backgroundColor: '#162338',
  },
  clearLabel: {
    color: AppTheme.colors.textSecondary,
    fontSize: Typography.caption,
    fontWeight: '700',
  },
});
