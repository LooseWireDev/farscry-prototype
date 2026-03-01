import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ViewToken,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Svg, {Path} from 'react-native-svg';
import {colors} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing} from '../../theme/spacing';
import type {AuthScreenProps} from '../../navigation/types';

const {width} = Dimensions.get('window');

const slides = [
  {
    title: 'Private by design',
    body: 'End-to-end encrypted video calls. No servers see your video or audio — ever.',
    icon: 'shield',
  },
  {
    title: 'Peer to peer',
    body: 'Calls connect directly between devices. No middleman, no data collection, no ads.',
    icon: 'connection',
  },
  {
    title: 'Just calls',
    body: 'No stories, no feeds, no distractions. Farscry does one thing and does it well.',
    icon: 'video',
  },
] as const;

function ShieldIcon() {
  return (
    <Svg width={64} height={64} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        stroke={colors.accent}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ConnectionIcon() {
  return (
    <Svg width={64} height={64} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
        stroke={colors.accent}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function VideoIcon() {
  return (
    <Svg width={64} height={64} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
        stroke={colors.accent}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const icons: Record<string, React.ComponentType> = {
  shield: ShieldIcon,
  connection: ConnectionIcon,
  video: VideoIcon,
};

export function OnboardingScreen({navigation}: AuthScreenProps<'Onboarding'>) {
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(
    ({viewableItems}: {viewableItems: ViewToken[]}) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
  ).current;

  const isLastSlide = activeIndex === slides.length - 1;

  function handleNext() {
    if (isLastSlide) {
      navigation.navigate('Login');
    } else {
      listRef.current?.scrollToIndex({index: activeIndex + 1, animated: true});
    }
  }

  return (
    <View style={[styles.container, {paddingTop: insets.top, paddingBottom: insets.bottom}]}>
      <FlatList
        ref={listRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{viewAreaCoveragePercentThreshold: 50}}
        keyExtractor={(_, i) => String(i)}
        renderItem={({item}) => {
          const Icon = icons[item.icon];
          return (
            <View style={styles.slide}>
              <Icon />
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.body}>{item.body}</Text>
            </View>
          );
        }}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === activeIndex && styles.dotActive]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNext} activeOpacity={0.8}>
          <Text style={styles.buttonText}>
            {isLastSlide ? 'Get started' : 'Next'}
          </Text>
        </TouchableOpacity>

        {!isLastSlide && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.7}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    gap: spacing.base,
  },
  title: {
    ...typography.title,
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  body: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.base,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surfaceLight,
  },
  dotActive: {
    backgroundColor: colors.accent,
    width: 24,
  },
  button: {
    width: '100%',
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    ...typography.headline,
    color: colors.white,
  },
  skipButton: {
    paddingVertical: spacing.sm,
  },
  skipText: {
    ...typography.body,
    color: colors.textMuted,
  },
});
