import { useCallback, useEffect, useRef, useState } from 'react';
import { useUserStore } from '../stores/userStore';
import { useBoosterStore } from '../stores/boosterStore';
import { useCollectionStore } from '../stores/collectionStore';
import { useGridAnimation } from './useGridAnimation';
import { useSound } from './useSound';
import { useHaptics } from './useHaptics';
import * as Engine from '../engine/GameEngine';
import { canPlaceBlock } from '../engine/GridLogic';
import type {
  GameMode,
  LevelConfig,
  GameState,
  Position,
  BoosterType,
  FeedbackEvent,
  BlockPiece,
} from '../types';

export function useGame(mode: GameMode, levelConfig?: LevelConfig) {
  const [gameState, setGameState] = useState<GameState>(() =>
    Engine.initGame(mode, levelConfig)
  );

  const userStore = useUserStore();
  const boosterStore = useBoosterStore();
  const collectionStore = useCollectionStore();
  const gridAnimation = useGridAnimation();
  const { playSound, playBGM, stopBGM } = useSound();
  const haptics = useHaptics();
  const initialized = useRef(false);

  // Start BGM on mount
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      playBGM('BGM02');
    }
    return () => {
      stopBGM();
    };
  }, []);

  // Process feedback events from engine
  const processFeedback = useCallback(
    (events: FeedbackEvent[]) => {
      for (const event of events) {
        switch (event.type) {
          case 'place':
            playSound('SE03');
            haptics.place();
            break;
          case 'invalidDrop':
            playSound('SE04');
            haptics.invalidDrop();
            break;
          case 'lineClear':
            playSound('SE05');
            haptics.lineClear();
            gridAnimation.triggerLineClear(
              event.clearedRows ?? [],
              event.clearedCols ?? []
            );
            break;
          case 'combo':
            playSound('SE06');
            haptics.combo(event.comboCount ?? 2);
            gridAnimation.triggerShake('medium');
            gridAnimation.triggerComboText(event.comboCount ?? 2);
            break;
          case 'superCombo':
            playSound('SE07');
            haptics.superCombo();
            gridAnimation.triggerShake('heavy');
            gridAnimation.triggerComboText(event.comboCount ?? 3);
            break;
          case 'chain':
            playSound('SE08');
            break;
          case 'levelClear':
            playSound('SE10');
            haptics.levelClear();
            break;
          case 'gameOver':
            playSound('SE11');
            haptics.gameOver();
            stopBGM();
            break;
        }
      }
    },
    [playSound, haptics, gridAnimation, stopBGM]
  );

  // Place a piece on the grid
  const placePiece = useCallback(
    (pieceIndex: number, position: Position) => {
      const result = Engine.placePiece(gameState, pieceIndex, position);
      setGameState(result.newState);
      processFeedback(result.events);

      // Update user store for game over / level clear
      if (result.events.some((e) => e.type === 'gameOver')) {
        if (mode === 'classic') {
          userStore.updateHighScore(result.newState.score);
        }
      }
      if (result.events.some((e) => e.type === 'levelClear') && levelConfig) {
        userStore.updateLevelProgress(
          levelConfig.id,
          result.newState.starsEarned
        );
      }

      // Discover new wagara patterns
      const piece = gameState.currentPieces[pieceIndex];
      if (piece && !gameState.discoveredWagara.has(piece.wagaraType)) {
        userStore.discoverWagara(piece.wagaraType);
        collectionStore.discoverPattern(piece.wagaraType);
      }

      return {
        events: result.events,
        newDiscoveries: piece
          ? gameState.discoveredWagara.has(piece.wagaraType)
            ? undefined
            : [piece.wagaraType]
          : undefined,
        stars: result.newState.starsEarned,
      };
    },
    [gameState, mode, levelConfig, userStore, collectionStore, processFeedback]
  );

  // Use a booster
  const useBooster = useCallback(
    (type: BoosterType, target?: Position | number) => {
      const count = boosterStore.getCount(type);
      if (count <= 0) return null;

      const result = Engine.useBooster(gameState, type, target);
      setGameState(result.newState);
      boosterStore.useBooster(type);
      playSound('SE14');
      haptics.place();
      processFeedback(result.events);

      return { events: result.events };
    },
    [gameState, boosterStore, playSound, haptics, processFeedback]
  );

  // Drag feedback
  const onDragStart = useCallback(() => {
    playSound('SE01');
    haptics.pickup();
  }, [playSound, haptics]);

  const onHoverCell = useCallback(() => {
    playSound('SE02');
    haptics.hoverTick();
  }, [playSound, haptics]);

  // Toggle pause
  const togglePause = useCallback(() => {
    // Pause is UI-only, not part of engine state
  }, []);

  // Reset game
  const reset = useCallback(() => {
    const newState = Engine.initGame(mode, levelConfig);
    setGameState(newState);
    playBGM('BGM02');
  }, [mode, levelConfig, playBGM]);

  return {
    // State from engine
    grid: gameState.grid,
    gridSize: gameState.gridSize,
    score: gameState.score,
    currentPieces: gameState.currentPieces,
    combo: gameState.combo,
    moveCount: gameState.moveCount,
    linesCleared: gameState.linesCleared,
    isGameOver: gameState.isGameOver,
    isLevelCleared: gameState.isLevelCleared,
    isPaused: false,
    levelConfig,

    // Actions
    placePiece,
    useBooster,
    onDragStart,
    onHoverCell,
    togglePause,
    reset,

    // Animations
    ...gridAnimation,
  };
}
