import React, { useCallback, useState, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
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
import { useBoosterStore } from '../../src/stores/boosterStore';
import { loadLevel } from '../../src/engine/LevelLoader';
import { canPlaceBlock } from '../../src/engine/GridLogic';
import type { Position, BoosterType } from '../../src/types';

export default function LevelGameScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const levelId = parseInt(params.id || '1', 10);

  const levelConfig = useMemo(() => loadLevel(levelId), [levelId]);
  const game = useGame('level', levelConfig);
  const boosterInventory = useBoosterStore((s) => s.inventory);
  const [gridOrigin, setGridOrigin] = useState({ x: 0, y: 0 });

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
    { type: 'lightning', count: boosterInventory.lightning ?? 0 },
    { type: 'wave', count: boosterInventory.wave ?? 0 },
  ];

  const handleNext = useCallback(() => {
    const nextId = levelId + 1;
    if (nextId <= 15) {
      router.replace({ pathname: '/game/level', params: { id: String(nextId) } });
    } else {
      router.back();
    }
  }, [levelId, router]);

  return (
    <SafeAreaView style={styles.container}>
      <GameHeader
        mode="level"
        levelConfig={levelConfig}
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
          stars={game.isLevelCleared ? 3 : 0} // Calculate properly from score
          onRetry={game.reset}
          onHome={() => router.back()}
          onNext={game.isLevelCleared ? handleNext : undefined}
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
});
