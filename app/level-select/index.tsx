import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../src/utils/colors';
import { t } from '../../src/utils/i18n';
import { useUserStore } from '../../src/stores/userStore';
import { getMaxLevelId } from '../../src/engine/LevelLoader';

export default function LevelSelectScreen() {
  const router = useRouter();
  const levelProgress = useUserStore((s) => s.levelProgress);
  const totalStars = useUserStore((s) => s.totalStars);
  const maxLevel = getMaxLevelId();

  const isLevelUnlocked = (levelId: number): boolean => {
    if (levelId === 1) return true;
    // Unlock next level if previous has at least 1 star
    return (levelProgress[levelId - 1] ?? 0) >= 1;
  };

  const getStarsForLevel = (levelId: number): number => {
    return levelProgress[levelId] ?? 0;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>{'\u2190'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('selectLevel')}</Text>
        <Text style={styles.starCount}>
          {'\u2605'} {totalStars}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.grid}>
        {Array.from({ length: maxLevel }, (_, i) => i + 1).map((levelId) => {
          const unlocked = isLevelUnlocked(levelId);
          const stars = getStarsForLevel(levelId);

          return (
            <TouchableOpacity
              key={levelId}
              style={[
                styles.levelCell,
                unlocked ? styles.unlocked : styles.locked,
                stars === 3 && styles.perfect,
              ]}
              onPress={() => {
                if (unlocked) {
                  router.push({ pathname: '/game/level', params: { id: String(levelId) } });
                }
              }}
              disabled={!unlocked}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.levelNumber,
                  !unlocked && styles.lockedText,
                ]}
              >
                {unlocked ? levelId : '?'}
              </Text>
              {unlocked && stars > 0 && (
                <View style={styles.levelStars}>
                  {[1, 2, 3].map((s) => (
                    <Text
                      key={s}
                      style={[
                        styles.miniStar,
                        s <= stars ? styles.starActive : styles.starInactive,
                      ]}
                    >
                      {'\u2605'}
                    </Text>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Placeholder for levels 16-100 */}
        {Array.from({ length: 85 }, (_, i) => i + 16).map((levelId) => (
          <TouchableOpacity
            key={levelId}
            style={[styles.levelCell, styles.locked, styles.futureLevel]}
            disabled
          >
            <Text style={styles.lockedText}>{levelId}</Text>
            <Text style={styles.comingSoonText}>...</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.woodFrame,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  starCount: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.gold,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingBottom: 32,
    gap: 10,
  },
  levelCell: {
    width: 64,
    height: 72,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  unlocked: {
    backgroundColor: '#FFFFFF',
    borderColor: Colors.gridLine,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  locked: {
    backgroundColor: Colors.emptyCell,
    borderColor: Colors.gridLine,
    opacity: 0.5,
  },
  perfect: {
    borderColor: Colors.gold,
    borderWidth: 2,
  },
  futureLevel: {
    opacity: 0.3,
  },
  levelNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  lockedText: {
    color: Colors.disabled,
  },
  levelStars: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 2,
  },
  miniStar: {
    fontSize: 10,
  },
  starActive: {
    color: Colors.gold,
  },
  starInactive: {
    color: Colors.disabled,
  },
  comingSoonText: {
    fontSize: 10,
    color: Colors.disabled,
    marginTop: 2,
  },
});
