import React, { memo, useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { Colors } from '../../utils/colors';
import { t } from '../../utils/i18n';

interface Props {
  combo: number;
}

export const ComboCounter = memo(function ComboCounter({ combo }: Props) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (combo >= 2) {
      scale.value = 0;
      opacity.value = 1;
      scale.value = withSpring(1, { damping: 8, stiffness: 300 });
      opacity.value = withDelay(1000, withTiming(0, { duration: 300 }));
    } else {
      opacity.value = 0;
    }
  }, [combo]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (combo < 2) return null;

  const getText = () => {
    if (combo >= 4) return t('perfect');
    if (combo >= 3) return t('triple');
    return t('double');
  };

  const getColor = () => {
    if (combo >= 4) return '#FF6B35';
    if (combo >= 3) return Colors.gold;
    return Colors.accent;
  };

  return (
    <Animated.View style={[styles.container, animStyle]} pointerEvents="none">
      <Text style={[styles.comboText, { color: getColor() }]}>{getText()}</Text>
      <Text style={[styles.comboCount, { color: getColor() }]}>x{combo}</Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '30%',
    alignSelf: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  comboText: {
    fontSize: 36,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  comboCount: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: -4,
  },
});
