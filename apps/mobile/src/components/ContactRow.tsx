import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import {Avatar} from './Avatar';
import {CallButton} from './CallButton';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';
import {spacing} from '../theme/spacing';

type ContactRowProps = {
  name: string;
  username?: string;
  imageUri?: string;
  online?: boolean;
  onPress: () => void;
  onCall?: () => void;
  showCallButton?: boolean;
};

export function ContactRow({
  name,
  username,
  imageUri,
  online,
  onPress,
  onCall,
  showCallButton = true,
}: ContactRowProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}>
      <Avatar name={name} imageUri={imageUri} size={44} online={online} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        {username && (
          <Text style={styles.username} numberOfLines={1}>
            @{username}
          </Text>
        )}
      </View>
      {showCallButton && onCall && <CallButton size={36} onPress={onCall} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    gap: spacing.md,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...typography.body,
    color: colors.text,
  },
  username: {
    ...typography.footnote,
    color: colors.textSecondary,
  },
});
