import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppTheme, Radius, Spacing, Typography } from '@/constants/theme';
import { SupportedLanguage } from '@/types/music';
import { ThemedText } from '@/components/themed-text';

const LANGUAGES: { label: string; value: SupportedLanguage }[] = [
  { label: 'EN', value: 'english' },
  { label: 'HI', value: 'hindi' },
  { label: 'TE', value: 'telugu' },
  { label: 'ES', value: 'spanish' },
];

type LanguageSelectorProps = {
  value: SupportedLanguage;
  onChange: (language: SupportedLanguage) => void;
};

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <View style={styles.container}>
      {LANGUAGES.map((language) => {
        const isActive = value === language.value;

        return (
          <Pressable
            key={language.value}
            onPress={() => onChange(language.value)}
            style={[
              styles.pill,
              {
                backgroundColor: isActive
                  ? AppTheme.colors.primary
                  : AppTheme.colors.card,
              },
            ]}>
            <ThemedText
              style={[
                styles.label,
                {
                  color: isActive ? AppTheme.colors.primaryText : AppTheme.colors.textSecondary,
                },
              ]}>
              {language.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  pill: {
    minWidth: 54,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: Radius.round,
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    alignItems: 'center',
  },
  label: {
    fontSize: Typography.caption,
    fontWeight: '800',
  },
});
