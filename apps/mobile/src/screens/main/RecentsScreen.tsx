import React, {useMemo} from 'react';
import {View, Text, SectionList, TouchableOpacity, StyleSheet} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Avatar} from '../../components/Avatar';
import {EmptyState} from '../../components/EmptyState';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing} from '../../theme/spacing';
import type {MainTabScreenProps} from '../../navigation/types';

type CallDirection = 'outgoing' | 'incoming' | 'missed';

type RecentCall = {
  id: string;
  contactName: string;
  contactId: string;
  direction: CallDirection;
  duration: number; // seconds
  timestamp: Date;
};

const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const yesterday = new Date(today.getTime() - 86400000);

const MOCK_RECENTS: RecentCall[] = [
  {id: '1', contactName: 'Alice Chen', contactId: '1', direction: 'outgoing', duration: 342, timestamp: new Date(today.getTime() + 3600000 * 14)},
  {id: '2', contactName: 'Marcus Wright', contactId: '7', direction: 'missed', duration: 0, timestamp: new Date(today.getTime() + 3600000 * 11)},
  {id: '3', contactName: 'Priya Sharma', contactId: '8', direction: 'incoming', duration: 1205, timestamp: new Date(yesterday.getTime() + 3600000 * 20)},
  {id: '4', contactName: 'James Ko', contactId: '6', direction: 'outgoing', duration: 67, timestamp: new Date(yesterday.getTime() + 3600000 * 15)},
  {id: '5', contactName: 'Alice Chen', contactId: '1', direction: 'incoming', duration: 890, timestamp: new Date(yesterday.getTime() + 3600000 * 10)},
];

function formatDuration(seconds: number): string {
  if (seconds === 0) {
    return 'No answer';
  }
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'});
}

function getDateLabel(date: Date): string {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  if (d.getTime() === today.getTime()) {
    return 'Today';
  }
  if (d.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  }
  return d.toLocaleDateString([], {weekday: 'long', month: 'short', day: 'numeric'});
}

function DirectionIcon({direction}: {direction: CallDirection}) {
  if (direction === 'missed') {
    return (
      <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
        <Path
          d="M2.25 6.75l9 9 3-3 7.5 7.5M15.75 21h5.25v-5.25"
          stroke={colors.missed}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }
  const isOutgoing = direction === 'outgoing';
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path
        d={isOutgoing ? 'M4.5 19.5l15-15M8.25 4.5h11.25v11.25' : 'M19.5 4.5l-15 15M15.75 19.5H4.5V8.25'}
        stroke={colors.callGreen}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ClockIcon() {
  return (
    <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
        stroke={colors.textMuted}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

type Section = {
  title: string;
  data: RecentCall[];
};

function groupByDay(calls: RecentCall[]): Section[] {
  const map = new Map<string, RecentCall[]>();
  for (const call of calls) {
    const label = getDateLabel(call.timestamp);
    const group = map.get(label) ?? [];
    group.push(call);
    map.set(label, group);
  }
  return Array.from(map.entries()).map(([title, data]) => ({title, data}));
}

export function RecentsScreen({navigation}: MainTabScreenProps<'Recents'>) {
  const insets = useSafeAreaInsets();
  const sections = useMemo(() => groupByDay(MOCK_RECENTS), []);

  if (MOCK_RECENTS.length === 0) {
    return (
      <EmptyState
        icon={<ClockIcon />}
        title="No recent calls"
        message="Your call history will appear here."
      />
    );
  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        contentContainerStyle={{paddingBottom: insets.bottom + spacing.base}}
        stickySectionHeadersEnabled
        renderSectionHeader={({section}) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
        )}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() =>
              navigation.navigate('ContactDetail', {
                contactId: item.contactId,
                name: item.contactName,
              })
            }
            activeOpacity={0.7}>
            <Avatar name={item.contactName} size={40} />
            <View style={styles.info}>
              <Text
                style={[
                  styles.name,
                  item.direction === 'missed' && styles.missedName,
                ]}
                numberOfLines={1}>
                {item.contactName}
              </Text>
              <View style={styles.meta}>
                <DirectionIcon direction={item.direction} />
                <Text style={styles.detail}>
                  {formatDuration(item.duration)}
                </Text>
              </View>
            </View>
            <Text style={styles.time}>{formatTime(item.timestamp)}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  sectionHeader: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  sectionTitle: {
    ...typography.footnote,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  row: {
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
  missedName: {
    color: colors.missed,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  detail: {
    ...typography.footnote,
    color: colors.textSecondary,
  },
  time: {
    ...typography.footnote,
    color: colors.textMuted,
  },
});
