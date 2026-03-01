import React from 'react';
import {View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing} from '../../theme/spacing';

function ChevronRight() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8.25 4.5l7.5 7.5-7.5 7.5"
        stroke={colors.textMuted}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

type RowProps = {
  label: string;
  value?: string;
  onPress?: () => void;
  trailing?: React.ReactNode;
};

function SettingsRow({label, value, onPress, trailing}: RowProps) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowTrailing}>
        {value && <Text style={styles.rowValue}>{value}</Text>}
        {trailing}
        {onPress && !trailing && <ChevronRight />}
      </View>
    </TouchableOpacity>
  );
}

function SectionHeader({title}: {title: string}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

export function SettingsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{paddingBottom: insets.bottom + spacing.xxl}}>
      <SectionHeader title="Video" />
      <View style={styles.section}>
        <SettingsRow label="Video quality" value="Auto" onPress={() => {}} />
        <SettingsRow label="Mirror front camera" trailing={<Switch value={true} />} />
      </View>

      <SectionHeader title="Audio" />
      <View style={styles.section}>
        <SettingsRow label="Default to speaker" trailing={<Switch value={false} />} />
        <SettingsRow label="Noise suppression" trailing={<Switch value={true} />} />
      </View>

      <SectionHeader title="Notifications" />
      <View style={styles.section}>
        <SettingsRow label="Incoming calls" trailing={<Switch value={true} />} />
        <SettingsRow label="Ringtone" value="Default" onPress={() => {}} />
      </View>

      <SectionHeader title="Account" />
      <View style={styles.section}>
        <SettingsRow label="Display name" value="You" onPress={() => {}} />
        <SettingsRow label="Email" value="you@example.com" onPress={() => {}} />
        <SettingsRow label="Change password" onPress={() => {}} />
      </View>

      <SectionHeader title="About" />
      <View style={styles.section}>
        <SettingsRow label="Version" value="1.0.0" />
        <SettingsRow label="Privacy policy" onPress={() => {}} />
        <SettingsRow label="Source code" onPress={() => {}} />
      </View>

      <TouchableOpacity style={styles.signOutButton} activeOpacity={0.7}>
        <Text style={styles.signOutText}>Sign out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  sectionHeader: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.footnote,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginHorizontal: spacing.base,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: spacing.base,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowLabel: {
    ...typography.body,
    color: colors.text,
  },
  rowTrailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rowValue: {
    ...typography.body,
    color: colors.textMuted,
  },
  signOutButton: {
    marginTop: spacing.xxl,
    marginHorizontal: spacing.base,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  signOutText: {
    ...typography.body,
    color: colors.callRed,
    fontWeight: '600',
  },
});
