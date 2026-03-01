import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {Avatar} from './Avatar';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import {spacing} from '../theme/spacing';

type ContactCardProps = {
  name: string;
  imageUri?: string;
  online?: boolean;
  onPress: () => void;
};

export function ContactCard({name, imageUri, online, onPress}: ContactCardProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}>
      <Avatar name={name} imageUri={imageUri} size={56} online={online} />
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.base,
    backgroundColor: colors.surface,
    borderRadius: 14,
    gap: spacing.sm,
  },
  name: {
    ...typography.subhead,
    color: colors.text,
    textAlign: 'center',
  },
});
