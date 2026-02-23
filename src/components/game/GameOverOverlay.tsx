import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { Colors } from '../../utils/colors';
import { t } from '../../utils/i18n';

interface Props {
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  isLevelClear?: boolean;
  stars?: number;
  onRetry: () => void;
  onHome: () => void;
  onNext?: () => void;
}

export const GameOverOverlay = memo(function GameOverOverlay({
  score,
  highScore,
  isNewHighScore,
  isLevelClear,
  stars,
  onRetry,
  onHome,
  onNext,
}: Props) {
  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      style={styles.overlay}
    >
      <Animated.View
        entering={SlideInDown.delay(200).springify().damping(15)}
        style={styles.card}
      >
        <Text style={styles.title}>
          {isLevelClear ? t('levelClear') : t('gameOver')}
        </Text>

        {isLevelClear && stars !== undefined && (
          <View style={styles.stars}>
            {[1, 2, 3].map((i) => (
              <Text
                key={i}
                style={[
                  styles.star,
                  i <= stars ? styles.starFilled : styles.starEmpty,
                ]}
              >
                {'\u2605'}
              </Text>
            ))}
          </View>
        )}

        <Text style={styles.scoreLabel}>{t('score')}</Text>
        <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>

        {isNewHighScore && (
          <Text style={styles.newHighScore}>NEW HIGH SCORE!</Text>
        )}

        {!isLevelClear && (
          <Text style={styles.highScoreText}>
            {t('highScore')}: {highScore.toLocaleString()}
          </Text>
        )}

        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.button, styles.retryButton]}
            onPress={onRetry}
            activeOpacity={0.7}
          >
            <Text style={styles.retryText}>{t('retry')}</Text>
          </TouchableOpacity>

          {isLevelClear && onNext && (
            <TouchableOpacity
              style={[styles.button, styles.nextButton]}
              onPress={onNext}
              activeOpacity={0.7}
            >
              <Text style={styles.nextText}>{t('next')}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.button, styles.homeButton]}
            onPress={onHome}
            activeOpacity={0.7}
          >
            <Text style={styles.homeText}>{t('home')}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlayDark,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    width: '80%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  stars: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  star: {
    fontSize: 36,
  },
  starFilled: {
    color: Colors.gold,
  },
  starEmpty: {
    color: Colors.disabled,
  },
  scoreLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  newHighScore: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.accent,
    marginTop: 4,
  },
  highScoreText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    minWidth: 80,
    alignItems: 'center',
  },
  retryButton: {
    backgroundColor: Colors.accent,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  nextButton: {
    backgroundColor: Colors.success,
  },
  nextText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  homeButton: {
    backgroundColor: Colors.woodFrame,
  },
  homeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
