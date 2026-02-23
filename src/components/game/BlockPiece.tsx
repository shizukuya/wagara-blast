import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import { Tile } from './Tile';
import { BLOCK_PREVIEW_SCALE, getGridCellSize } from '../../utils/dimensions';
import { useDragBlock } from '../../hooks/useDragBlock';
import type { BlockPiece as BlockPieceType, Position } from '../../types';

interface Props {
  piece: BlockPieceType;
  pieceIndex: number;
  gridSize: number;
  gridOriginX: number;
  gridOriginY: number;
  onDragStart: () => void;
  onHoverCell: () => void;
  onDrop: (pieceIndex: number, position: Position) => void;
  onInvalidDrop: () => void;
  canPlace: (position: Position) => boolean;
  disabled?: boolean;
}

export const BlockPieceComponent = memo(function BlockPieceComponent({
  piece,
  pieceIndex,
  gridSize,
  gridOriginX,
  gridOriginY,
  onDragStart,
  onHoverCell,
  onDrop,
  onInvalidDrop,
  canPlace,
  disabled,
}: Props) {
  const cellSize = getGridCellSize(gridSize);
  const previewCellSize = Math.floor(cellSize * BLOCK_PREVIEW_SCALE);

  const { gesture, animatedStyle } = useDragBlock({
    pieceIndex,
    gridSize,
    gridOriginX,
    gridOriginY,
    onDragStart,
    onHoverCell,
    onDrop,
    onInvalidDrop,
    canPlace,
  });

  const { width: shapeWidth, height: shapeHeight } = piece.shape;

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          styles.container,
          animatedStyle,
          disabled && styles.disabled,
          {
            width: shapeWidth * previewCellSize,
            height: shapeHeight * previewCellSize,
          },
        ]}
      >
        {piece.shape.cells.map((cell, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: cell.col * previewCellSize,
              top: cell.row * previewCellSize,
            }}
          >
            <Tile wagaraType={piece.wagaraType} size={previewCellSize} />
          </View>
        ))}
      </Animated.View>
    </GestureDetector>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  disabled: {
    opacity: 0.3,
  },
});
