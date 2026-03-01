import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import {spacing} from '../theme/spacing';

type EmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  message?: string;
  action?: React.ReactNode;
};

export function EmptyState({icon, title, message, action}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
      {action && <View style={styles.action}>{action}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    gap: spacing.sm,
  },
  icon: {
    marginBottom: spacing.sm,
    opacity: 0.5,
  },
  title: {
    ...typography.headline,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  message: {
    ...typography.subhead,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  action: {
    marginTop: spacing.base,
  },
});
