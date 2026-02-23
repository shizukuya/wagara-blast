import React, { memo, useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../../utils/colors';

interface Particle {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  rotation: number;
  color: string;
  size: number;
  delay: number;
}

interface Props {
  originX: number;
  originY: number;
  count?: number;
  type?: 'confetti' | 'washi'; // Japanese paper fragments
  duration?: number;
  onComplete?: () => void;
}

const PARTICLE_COLORS = [
  Colors.wagara.ichimatsu.primary,
  Colors.wagara.asanoha.primary,
  Colors.wagara.seigaiha.primary,
  Colors.wagara.shippou.primary,
  Colors.wagara.yagasuri.primary,
  Colors.wagara.kikkou.primary,
  Colors.wagara.uroko.primary,
  Colors.gold,
];

function ParticleView({ particle, duration }: { particle: Particle; duration: number }) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    translateX.value = withDelay(
      particle.delay,
      withTiming(particle.targetX - particle.x, {
        duration,
        easing: Easing.out(Easing.quad),
      })
    );
    translateY.value = withDelay(
      particle.delay,
      withTiming(particle.targetY - particle.y, {
        duration,
        easing: Easing.in(Easing.quad),
      })
    );
    rotate.value = withDelay(
      particle.delay,
      withTiming(particle.rotation, { duration })
    );
    opacity.value = withDelay(
      particle.delay + duration * 0.6,
      withTiming(0, { duration: duration * 0.4 })
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: particle.x,
          top: particle.y,
          width: particle.size,
          height: particle.size * 0.6,
          backgroundColor: particle.color,
          borderRadius: 1,
        },
        style,
      ]}
    />
  );
}

export const ParticleSystem = memo(function ParticleSystem({
  originX,
  originY,
  count = 20,
  type = 'washi',
  duration = 800,
  onComplete,
}: Props) {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const distance = 40 + Math.random() * 120;
      return {
        id: i,
        x: originX,
        y: originY,
        targetX: originX + Math.cos(angle) * distance,
        targetY: originY + Math.sin(angle) * distance + 60, // gravity pull
        rotation: Math.random() * 720 - 360,
        color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
        size: type === 'washi' ? 4 + Math.random() * 8 : 3 + Math.random() * 5,
        delay: Math.random() * 100,
      };
    });
  }, [originX, originY, count, type]);

  useEffect(() => {
    const timer = setTimeout(() => onComplete?.(), duration + 200);
    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p) => (
        <ParticleView key={p.id} particle={p} duration={duration} />
      ))}
    </View>
  );
});
