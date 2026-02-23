import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../src/components/ui/Button';
import { Colors } from '../../src/utils/colors';
import { t } from '../../src/utils/i18n';
import { useUserStore } from '../../src/stores/userStore';

export default function PlayScreen() {
  const router = useRouter();
  const highScore = useUserStore((s) => s.classicHighScore);
  const dailyStreak = useUserStore((s) => s.dailyStreak);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Wagara Blast</Text>
        <Text style={styles.subtitle}>{'\u548C\u67C4\u30BF\u30A4\u30EB\u30D6\u30E9\u30B9\u30C8'}</Text>
      </View>

      <View style={styles.modes}>
        {/* Classic Mode */}
        <View style={styles.modeCard}>
          <Text style={styles.modeTitle}>{t('classic')}</Text>
          <Text style={styles.modeDesc}>8x8 Endless</Text>
          {highScore > 0 && (
            <Text style={styles.modeStat}>
              {t('highScore')}: {highScore.toLocaleString()}
            </Text>
          )}
          <Button
            title={t('play')}
            onPress={() => router.push('/game/classic')}
            variant="primary"
            size="large"
            style={styles.playButton}
          />
        </View>

        {/* Level Mode */}
        <View style={styles.modeCard}>
          <Text style={styles.modeTitle}>{t('level')}</Text>
          <Text style={styles.modeDesc}>100 Stages</Text>
          <Button
            title={t('play')}
            onPress={() => router.push('/level-select')}
            variant="secondary"
            size="large"
            style={styles.playButton}
          />
        </View>

        {/* Daily Challenge */}
        <View style={styles.modeCard}>
          <Text style={styles.modeTitle}>{t('dailyChallenge')}</Text>
          <Text style={styles.modeDesc}>
            {t('streak')}: {dailyStreak}
          </Text>
          <Button
            title={t('play')}
            onPress={() => router.push('/game/daily')}
            variant="outline"
            size="large"
            style={styles.playButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  modes: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 16,
  },
  modeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  modeTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  modeDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  modeStat: {
    fontSize: 12,
    color: Colors.gold,
    fontWeight: '600',
    marginTop: 4,
  },
  playButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
});
