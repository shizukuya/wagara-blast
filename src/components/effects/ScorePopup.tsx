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
import { AnimationConfig } from '../../utils/animations';

interface Props {
  score: number;
  x: number;
  y: number;
  onComplete?: () => void;
}

export const ScorePopup = memo(function ScorePopup({
  score,
  x,
  y,
  onComplete,
}: Props) {
  const scale = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(1, AnimationConfig.scorePop);
    translateY.value = withTiming(-40, { duration: 800 });
    opacity.value = withDelay(500, withTiming(0, { duration: 300 }));

    const timer = setTimeout(() => onComplete?.(), 800);
    return () => clearTimeout(timer);
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        { left: x, top: y },
        style,
      ]}
      pointerEvents="none"
    >
      <Text style={styles.text}>+{score}</Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 150,
  },
  text: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.gold,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
