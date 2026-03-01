import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {colors} from '../theme/colors';
import {typography} from '../theme/typography';

const AVATAR_COLORS = [
  '#E17055',
  '#00B894',
  '#6C5CE7',
  '#FDCB6E',
  '#0984E3',
  '#D63031',
  '#00CEC9',
  '#E84393',
  '#55A3E8',
  '#FF7675',
];

function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

type AvatarProps = {
  name: string;
  imageUri?: string;
  size?: number;
  online?: boolean;
};

export function Avatar({name, imageUri, size = 44, online}: AvatarProps) {
  const bgColor = AVATAR_COLORS[hashName(name) % AVATAR_COLORS.length];
  const fontSize = size * 0.4;

  return (
    <View style={[styles.container, {width: size, height: size}]}>
      {imageUri ? (
        <Image
          source={{uri: imageUri}}
          style={[styles.image, {width: size, height: size, borderRadius: size / 2}]}
        />
      ) : (
        <View
          style={[
            styles.initialsContainer,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: bgColor,
            },
          ]}>
          <Text style={[styles.initials, {fontSize}]}>{getInitials(name)}</Text>
        </View>
      )}
      {online !== undefined && (
        <View
          style={[
            styles.statusDot,
            {
              backgroundColor: online ? colors.online : colors.textMuted,
              width: size * 0.27,
              height: size * 0.27,
              borderRadius: size * 0.135,
              borderWidth: size * 0.05,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    resizeMode: 'cover',
  },
  initialsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    ...typography.headline,
    color: colors.white,
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderColor: colors.background,
  },
});
