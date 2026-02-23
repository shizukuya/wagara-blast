import React, { memo, useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View, LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, SharedValue } from 'react-native-reanimated';
import { GridCell } from './GridCell';
import { GhostPreview } from './GhostPreview';
import { Colors } from '../../utils/colors';
import { getGridCellSize, CELL_GAP } from '../../utils/dimensions';
import type { GridCell as GridCellType, BlockPiece, Position } from '../../types';

interface Props {
  grid: GridCellType[][];
  gridSize: number;
  shakeX: SharedValue<number>;
  shakeY: SharedValue<number>;
  flashOpacity: SharedValue<number>;
  ghostPosition?: Position | null;
  ghostPiece?: BlockPiece | null;
  canPlaceGhost?: boolean;
  clearingRows?: number[];
  clearingCols?: number[];
  onLayout?: (x: number, y: number) => void;
}

export const Grid = memo(function Grid({
  grid,
  gridSize,
  shakeX,
  shakeY,
  flashOpacity,
  ghostPosition,
  ghostPiece,
  canPlaceGhost,
  clearingRows = [],
  clearingCols = [],
  onLayout,
}: Props) {
  const cellSize = getGridCellSize(gridSize);
  const gridPixelSize = cellSize * gridSize;

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: shakeX.value },
      { translateY: shakeY.value },
    ],
  }));

  const flashStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
  }));

  // Ghost preview cells
  const ghostCells = useMemo(() => {
    if (!ghostPosition || !ghostPiece) return new Set<string>();
    const cells = new Set<string>();
    for (const cell of ghostPiece.shape.cells) {
      const r = ghostPosition.row + cell.row;
      const c = ghostPosition.col + cell.col;
      cells.add(`${r},${c}`);
    }
    return cells;
  }, [ghostPosition, ghostPiece]);

  // Clearing cells set
  const clearingSet = useMemo(() => {
    const set = new Set<string>();
    for (const row of clearingRows) {
      for (let c = 0; c < gridSize; c++) set.add(`${row},${c}`);
    }
    for (const col of clearingCols) {
      for (let r = 0; r < gridSize; r++) set.add(`${r},${col}`);
    }
    return set;
  }, [clearingRows, clearingCols, gridSize]);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      if (onLayout) {
        event.target.measure((_x, _y, _w, _h, pageX, pageY) => {
          onLayout(pageX, pageY);
        });
      }
    },
    [onLayout]
  );

  return (
    <View style={styles.container}>
      {/* Wood frame border */}
      <View style={[styles.frame, { width: gridPixelSize + 16, height: gridPixelSize + 16 }]}>
        <Animated.View
          style={[styles.gridContainer, shakeStyle]}
          onLayout={handleLayout}
        >
          {grid.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((cell, colIndex) => {
                const key = `${rowIndex},${colIndex}`;
                const isGhost = ghostCells.has(key);
                const isClearing = clearingSet.has(key);

                return (
                  <GridCell
                    key={key}
                    cell={cell}
                    size={cellSize}
                    isClearing={isClearing}
                    isHighlighted={isGhost && canPlaceGhost}
                    isInvalid={isGhost && !canPlaceGhost}
                  />
                );
              })}
            </View>
          ))}

          {/* Flash overlay for line clears */}
          <Animated.View
            style={[styles.flashOverlay, flashStyle]}
            pointerEvents="none"
          />
        </Animated.View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    backgroundColor: Colors.woodFrame,
    borderRadius: 8,
    padding: 8,
    // Subtle wood texture shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  gridContainer: {
    flexDirection: 'column',
    backgroundColor: Colors.gridLine,
  },
  row: {
    flexDirection: 'row',
  },
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.flash,
    borderRadius: 2,
  },
});
