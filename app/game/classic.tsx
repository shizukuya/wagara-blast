import React, { useCallback, useState, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
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
import { useGameStore } from '../../src/stores/gameStore';
import { canPlaceBlock } from '../../src/engine/GridLogic';
import type { Position, BoosterType } from '../../src/types';

export default function ClassicGameScreen() {
  const router = useRouter();
  const game = useGame('classic');
  const highScore = useUserStore((s) => s.classicHighScore);
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

  const handleInvalidDrop = useCallback(() => {
    // Sound + haptic already handled in useGame hook's onDragStart
  }, []);

  const boosters: { type: BoosterType; count: number }[] = [
    { type: 'stoneBreaker', count: boosterInventory.stoneBreaker ?? 0 },
    { type: 'shuffle', count: boosterInventory.shuffle ?? 0 },
    { type: 'guide', count: boosterInventory.guide ?? 0 },
    { type: 'lightning', count: boosterInventory.lightning ?? 0 },
    { type: 'wave', count: boosterInventory.wave ?? 0 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <GameHeader
        mode="classic"
        onPause={game.togglePause}
        onHome={() => router.back()}
      />

      <ScoreDisplay score={game.score} highScore={highScore} />

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
        onInvalidDrop={handleInvalidDrop}
        canPlace={handleCanPlace}
        disabled={game.isGameOver || game.isPaused}
      />

      <BoosterBar
        boosters={boosters}
        onUse={(type) => game.useBooster(type)}
        disabled={game.isGameOver || game.isPaused}
      />

      {game.isGameOver && (
        <GameOverOverlay
          score={game.score}
          highScore={Math.max(highScore, game.score)}
          isNewHighScore={game.score > highScore}
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
});
