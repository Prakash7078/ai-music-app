import React from 'react';
import { SafeAreaView, ScrollView, ScrollViewProps, StyleSheet, View } from 'react-native';

import { AppTheme, Radius, Spacing } from '@/constants/theme';

type ScreenContainerProps = ScrollViewProps & {
  padded?: boolean;
};

export function ScreenContainer({
  children,
  contentContainerStyle,
  padded = true,
  ...props
}: ScreenContainerProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        {...props}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          padded && styles.paddedContent,
          contentContainerStyle,
        ]}>
        <View>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  scrollView: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  contentContainer: {
    paddingBottom: Spacing.xxxl,
  },
  paddedContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    gap: Spacing.lg,
    maxWidth: 920,
    width: '100%',
    alignSelf: 'center',
    borderRadius: Radius.xl,
  },
});
