import React, { memo, useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../../utils/colors';
import { t } from '../../utils/i18n';

interface Props {
  comboCount: number;
  onComplete?: () => void;
}

export const ComboText = memo(function ComboText({ comboCount, onComplete }: Props) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotation = useSharedValue(-10);

  useEffect(() => {
    scale.value = 0;
    opacity.value = 1;
    rotation.value = -10;

    scale.value = withSpring(1, { damping: 6, stiffness: 300, mass: 0.8 });
    rotation.value = withSpring(0, { damping: 8, stiffness: 200 });
    opacity.value = withDelay(1200, withTiming(0, { duration: 300 }));

    const timer = setTimeout(() => onComplete?.(), 1500);
    return () => clearTimeout(timer);
  }, [comboCount]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  const getText = () => {
    if (comboCount >= 4) return t('perfect');
    if (comboCount >= 3) return t('triple');
    return t('double');
  };

  const getColor = () => {
    if (comboCount >= 4) return '#FF6B35';
    if (comboCount >= 3) return Colors.gold;
    return Colors.accent;
  };

  return (
    <Animated.View style={[styles.container, style]} pointerEvents="none">
      <Text style={[styles.text, { color: getColor() }]}>{getText()}</Text>
      <Text style={[styles.count, { color: getColor() }]}>x{comboCount}</Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignSelf: 'center',
    top: '35%',
    alignItems: 'center',
    zIndex: 100,
  },
  text: {
    fontSize: 42,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },
  count: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: -6,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
});
