import React, { useCallback, useState, useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Grid } from '../../src/components/game/Grid';
import { BlockTray } from '../../src/components/game/BlockTray';
import { ScoreDisplay } from '../../src/components/game/ScoreDisplay';
import { GameHeader } from '../../src/components/game/GameHeader';
import { BoosterBar } from '../../src/components/game/BoosterBar';
import { GameOverOverlay } from '../../src/components/game/GameOverOverlay';
import { ComboCounter } from '../../src/components/game/ComboCounter';
import { Colors } from '../../src/utils/colors';
import { useGame } from '../../src/hooks/useGame';
import { useUserStore } from '../../src/stores/userStore';
import { useBoosterStore } from '../../src/stores/boosterStore';
import { generateDailyChallenge } from '../../src/engine/DailyChallenge';
import { canPlaceBlock } from '../../src/engine/GridLogic';
import { getTodayString } from '../../src/utils/random';
import { t } from '../../src/utils/i18n';
import type { Position, BoosterType } from '../../src/types';

export default function DailyGameScreen() {
  const router = useRouter();
  const dailyConfig = useMemo(() => generateDailyChallenge(), []);
  const game = useGame('daily', dailyConfig);
  const userStore = useUserStore();
  const boosterInventory = useBoosterStore((s) => s.inventory);
  const [gridOrigin, setGridOrigin] = useState({ x: 0, y: 0 });

  const todayStr = getTodayString();
  const alreadyCompleted = userStore.completedDailyDates.includes(todayStr);

  const handleGridLayout = useCallback((x: number, y: number) => {
    setGridOrigin({ x, y });
  }, []);

  const handleCanPlace = useCallback(
    (pieceIndex: number, position: Position) => {
      const piece = game.currentPieces[pieceIndex];
      if (!piece) return false;
      return canPlaceBlock(game.grid, piece, position);
    },
    [game.grid, game.currentPieces]
  );

  const boosters: { type: BoosterType; count: number }[] = [
    { type: 'stoneBreaker', count: boosterInventory.stoneBreaker ?? 0 },
    { type: 'shuffle', count: boosterInventory.shuffle ?? 0 },
    { type: 'guide', count: boosterInventory.guide ?? 0 },
  ];

  if (alreadyCompleted) {
    return (
      <SafeAreaView style={styles.container}>
        <GameHeader
          mode="daily"
          onPause={() => {}}
          onHome={() => router.back()}
        />
        <View style={styles.completedContainer}>
          <Text style={styles.completedText}>{t('todayCompleted')}</Text>
          <Text style={styles.streakText}>
            {t('streak')}: {userStore.dailyStreak}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <GameHeader
        mode="daily"
        levelConfig={dailyConfig}
        moveCount={game.moveCount}
        linesCleared={game.linesCleared}
        onPause={game.togglePause}
        onHome={() => router.back()}
      />

      <ScoreDisplay score={game.score} />

      <View style={styles.gridArea}>
        <Grid
          grid={game.grid}
          gridSize={game.gridSize}
          shakeX={game.shakeX}
          shakeY={game.shakeY}
          flashOpacity={game.flashOpacity}
          onLayout={handleGridLayout}
        />
        <ComboCounter combo={game.combo} />
      </View>

      <BlockTray
        pieces={game.currentPieces}
        gridSize={game.gridSize}
        gridOriginX={gridOrigin.x}
        gridOriginY={gridOrigin.y}
        onDragStart={game.onDragStart}
        onHoverCell={game.onHoverCell}
        onDrop={game.placePiece}
        onInvalidDrop={() => {}}
        canPlace={handleCanPlace}
        disabled={game.isGameOver || game.isLevelCleared || game.isPaused}
      />

      <BoosterBar
        boosters={boosters}
        onUse={(type) => game.useBooster(type)}
        disabled={game.isGameOver || game.isLevelCleared || game.isPaused}
      />

      {(game.isGameOver || game.isLevelCleared) && (
        <GameOverOverlay
          score={game.score}
          highScore={game.score}
          isNewHighScore={false}
          isLevelClear={game.isLevelCleared}
          stars={game.isLevelCleared ? 3 : 0}
          onRetry={game.reset}
          onHome={() => router.back()}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  gridArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  completedText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  streakText: {
    fontSize: 16,
    color: Colors.gold,
    fontWeight: '600',
  },
});
