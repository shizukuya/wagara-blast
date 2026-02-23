import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../src/components/ui/Button';
import { Colors } from '../../src/utils/colors';
import { t } from '../../src/utils/i18n';

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    score: string;
    stars: string;
    mode: string;
    levelId: string;
  }>();

  const score = parseInt(params.score || '0', 10);
  const stars = parseInt(params.stars || '0', 10);
  const mode = params.mode || 'classic';
  const levelId = parseInt(params.levelId || '0', 10);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
          {stars > 0 ? t('levelClear') : t('gameOver')}
        </Text>

        {stars > 0 && (
          <View style={styles.stars}>
            {[1, 2, 3].map((i) => (
              <Text
                key={i}
                style={[
                  styles.star,
                  i <= stars ? styles.starActive : styles.starInactive,
                ]}
              >
                {'\u2605'}
              </Text>
            ))}
          </View>
        )}

        <Text style={styles.scoreLabel}>{t('score')}</Text>
        <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>

        <View style={styles.buttons}>
          <Button
            title={t('retry')}
            onPress={() => router.back()}
            variant="primary"
          />
          <Button
            title={t('home')}
            onPress={() => router.replace('/(tabs)/play')}
            variant="secondary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.overlayDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: '80%',
    maxWidth: 340,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  stars: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  star: {
    fontSize: 40,
  },
  starActive: {
    color: Colors.gold,
  },
  starInactive: {
    color: Colors.disabled,
  },
  scoreLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  scoreValue: {
    fontSize: 40,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 4,
  },
  buttons: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 28,
  },
});
