import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Svg, {Path, Circle as SvgCircle} from 'react-native-svg';
import {colors} from '../theme/colors';
import {spacing} from '../theme/spacing';

type ControlButtonProps = {
  icon: React.ReactNode;
  onPress: () => void;
  active?: boolean;
  destructive?: boolean;
};

function ControlButton({icon, onPress, active, destructive}: ControlButtonProps) {
  const bg = destructive
    ? colors.callRed
    : active
      ? colors.white
      : 'rgba(255,255,255,0.15)';

  return (
    <TouchableOpacity
      style={[styles.controlButton, {backgroundColor: bg}]}
      onPress={onPress}
      activeOpacity={0.7}>
      {icon}
    </TouchableOpacity>
  );
}

function MicIcon({muted}: {muted: boolean}) {
  const color = muted ? colors.black : colors.white;
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {muted && (
        <Path
          d="M1 1l22 22"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      )}
    </Svg>
  );
}

function CameraIcon({off}: {off: boolean}) {
  const color = off ? colors.black : colors.white;
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {off && (
        <Path
          d="M1 1l22 22"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      )}
    </Svg>
  );
}

function SpeakerIcon({active}: {active: boolean}) {
  const color = active ? colors.black : colors.white;
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11 5L6 9H2v6h4l5 4V5z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function HangupIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M16.5 12a4.5 4.5 0 00-9 0M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75"
        stroke={colors.white}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <SvgCircle
        cx="5.25"
        cy="15.75"
        r="2.25"
        stroke={colors.white}
        strokeWidth={1.5}
      />
      <SvgCircle
        cx="18.75"
        cy="15.75"
        r="2.25"
        stroke={colors.white}
        strokeWidth={1.5}
      />
    </Svg>
  );
}

type CallControlsProps = {
  muted: boolean;
  cameraOff: boolean;
  speakerOn: boolean;
  onToggleMute: () => void;
  onToggleCamera: () => void;
  onToggleSpeaker: () => void;
  onHangup: () => void;
};

export function CallControls({
  muted,
  cameraOff,
  speakerOn,
  onToggleMute,
  onToggleCamera,
  onToggleSpeaker,
  onHangup,
}: CallControlsProps) {
  return (
    <View style={styles.container}>
      <ControlButton
        icon={<MicIcon muted={muted} />}
        onPress={onToggleMute}
        active={muted}
      />
      <ControlButton
        icon={<CameraIcon off={cameraOff} />}
        onPress={onToggleCamera}
        active={cameraOff}
      />
      <ControlButton
        icon={<SpeakerIcon active={speakerOn} />}
        onPress={onToggleSpeaker}
        active={speakerOn}
      />
      <ControlButton
        icon={<HangupIcon />}
        onPress={onHangup}
        destructive
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
