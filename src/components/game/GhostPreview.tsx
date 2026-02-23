import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../utils/colors';
import { CELL_RADIUS, CELL_GAP } from '../../utils/dimensions';
import type { BlockPiece, Position } from '../../types';

interface Props {
  piece: BlockPiece;
  position: Position;
  cellSize: number;
  isValid: boolean;
}

export const GhostPreview = memo(function GhostPreview({
  piece,
  position,
  cellSize,
  isValid,
}: Props) {
  return (
    <>
      {piece.shape.cells.map((cell, i) => {
        const row = position.row + cell.row;
        const col = position.col + cell.col;
        return (
          <View
            key={i}
            style={[
              styles.ghost,
              {
                position: 'absolute',
                left: col * cellSize + CELL_GAP,
                top: row * cellSize + CELL_GAP,
                width: cellSize - CELL_GAP * 2,
                height: cellSize - CELL_GAP * 2,
                borderRadius: CELL_RADIUS,
                backgroundColor: isValid
                  ? 'rgba(201, 168, 76, 0.35)'
                  : 'rgba(196, 30, 58, 0.25)',
                borderColor: isValid ? Colors.gold : Colors.error,
              },
            ]}
          />
        );
      })}
    </>
  );
});

const styles = StyleSheet.create({
  ghost: {
    borderWidth: 1,
  },
});
