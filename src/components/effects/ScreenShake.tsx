import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, SharedValue } from 'react-native-reanimated';

interface Props {
  shakeX: SharedValue<number>;
  shakeY: SharedValue<number>;
  children: React.ReactNode;
}

export const ScreenShake = memo(function ScreenShake({
  shakeX,
  shakeY,
  children,
}: Props) {
  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: shakeX.value },
      { translateY: shakeY.value },
    ],
  }));

  return (
    <Animated.View style={[styles.container, animStyle]}>
      {children}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
