import React, { memo, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useAnimatedProps,
} from 'react-native-reanimated';
import { Colors } from '../../utils/colors';
import { t } from '../../utils/i18n';

interface Props {
  score: number;
  highScore?: number;
}

export const ScoreDisplay = memo(function ScoreDisplay({ score, highScore }: Props) {
  const animScale = useSharedValue(1);

  useEffect(() => {
    if (score > 0) {
      animScale.value = 1.15;
      animScale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
  }, [score]);

  const scoreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: animScale.value }],
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('score')}</Text>
      <Animated.View style={scoreStyle}>
        <Text style={styles.score}>{score.toLocaleString()}</Text>
      </Animated.View>
      {highScore !== undefined && (
        <Text style={styles.highScore}>
          {t('highScore')}: {highScore.toLocaleString()}
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  label: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  score: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  highScore: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
