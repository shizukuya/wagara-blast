import { useCallback, useRef } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { AnimationConfig } from '../utils/animations';
import { getGridCellSize, CELL_GAP } from '../utils/dimensions';

interface UseDragBlockProps {
  pieceIndex: number;
  gridSize: number;
  gridOriginX: number;
  gridOriginY: number;
  onDragStart: () => void;
  onHoverCell: () => void;
  onDrop: (pieceIndex: number, position: { row: number; col: number }) => void;
  onInvalidDrop: () => void;
  canPlace: (position: { row: number; col: number }) => boolean;
}

export function useDragBlock({
  pieceIndex,
  gridSize,
  gridOriginX,
  gridOriginY,
  onDragStart,
  onHoverCell,
  onDrop,
  onInvalidDrop,
  canPlace,
}: UseDragBlockProps) {
  const cellSize = getGridCellSize(gridSize);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const isDragging = useSharedValue(false);
  const opacity = useSharedValue(1);

  // Track current hover cell to avoid repeated callbacks
  const lastHoverRow = useRef(-1);
  const lastHoverCol = useRef(-1);
  const startX = useRef(0);
  const startY = useRef(0);

  const gesture = Gesture.Pan()
    .onBegin((e) => {
      isDragging.value = true;
      scale.value = withTiming(AnimationConfig.pickup.scale, {
        duration: AnimationConfig.pickup.duration,
        easing: AnimationConfig.pickup.easing,
      });
      startX.current = e.absoluteX;
      startY.current = e.absoluteY;
      runOnJS(onDragStart)();
    })
    .onUpdate((e) => {
      // Offset upward so finger doesn't cover the piece
      translateX.value = e.translationX;
      translateY.value = e.translationY - 80;

      // Calculate grid position
      const absX = e.absoluteX;
      const absY = e.absoluteY - 80;
      const gridCol = Math.floor((absX - gridOriginX) / (cellSize + CELL_GAP));
      const gridRow = Math.floor((absY - gridOriginY) / (cellSize + CELL_GAP));

      // Fire hover tick when crossing cell boundaries
      if (gridRow !== lastHoverRow.current || gridCol !== lastHoverCol.current) {
        lastHoverRow.current = gridRow;
        lastHoverCol.current = gridCol;
        if (gridRow >= 0 && gridRow < gridSize && gridCol >= 0 && gridCol < gridSize) {
          runOnJS(onHoverCell)();
        }
      }
    })
    .onEnd((e) => {
      isDragging.value = false;

      // Calculate final grid position
      const absX = e.absoluteX;
      const absY = e.absoluteY - 80;
      const gridCol = Math.floor((absX - gridOriginX) / (cellSize + CELL_GAP));
      const gridRow = Math.floor((absY - gridOriginY) / (cellSize + CELL_GAP));

      const position = { row: gridRow, col: gridCol };

      if (
        gridRow >= 0 &&
        gridRow < gridSize &&
        gridCol >= 0 &&
        gridCol < gridSize
      ) {
        // Check validity on JS thread
        runOnJS((pos: { row: number; col: number }) => {
          if (canPlace(pos)) {
            onDrop(pieceIndex, pos);
            // Snap animation - the key "kachitto" feel
            scale.value = withTiming(0, { duration: 100 });
            opacity.value = withTiming(0, { duration: 100 });
          } else {
            onInvalidDrop();
            // Return to origin
            translateX.value = withSpring(0, AnimationConfig.returnToTray);
            translateY.value = withSpring(0, AnimationConfig.returnToTray);
            scale.value = withSpring(1, AnimationConfig.returnToTray);
          }
        })(position);
      } else {
        runOnJS(onInvalidDrop)();
        // Return to tray with spring
        translateX.value = withSpring(0, AnimationConfig.returnToTray);
        translateY.value = withSpring(0, AnimationConfig.returnToTray);
        scale.value = withSpring(1, AnimationConfig.returnToTray);
      }

      lastHoverRow.current = -1;
      lastHoverCol.current = -1;
    })
    .onFinalize(() => {
      isDragging.value = false;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
    zIndex: isDragging.value ? 1000 : 1,
  }));

  const resetAnimation = useCallback(() => {
    translateX.value = 0;
    translateY.value = 0;
    scale.value = 1;
    opacity.value = 1;
  }, [translateX, translateY, scale, opacity]);

  // Ghost preview position
  const ghostRow = useSharedValue(-1);
  const ghostCol = useSharedValue(-1);

  return {
    gesture,
    animatedStyle,
    isDragging,
    translateX,
    translateY,
    resetAnimation,
    ghostRow: lastHoverRow,
    ghostCol: lastHoverCol,
  };
}
