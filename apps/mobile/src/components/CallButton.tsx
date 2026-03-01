import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {colors} from '../theme/colors';

type CallButtonProps = {
  size?: number;
  onPress: () => void;
  color?: string;
};

function VideoIcon({size, color}: {size: number; color: string}) {
  const iconSize = size * 0.5;
  return (
    <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function CallButton({size = 52, onPress, color}: CallButtonProps) {
  const bgColor = color ?? colors.callGreen;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bgColor,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}>
      <VideoIcon size={size} color={colors.white} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
