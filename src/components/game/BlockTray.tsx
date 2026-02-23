import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { BlockPieceComponent } from './BlockPiece';
import { Colors } from '../../utils/colors';
import { BLOCK_TRAY_HEIGHT } from '../../utils/dimensions';
import type { BlockPiece, Position } from '../../types';

interface Props {
  pieces: (BlockPiece | null)[];
  gridSize: number;
  gridOriginX: number;
  gridOriginY: number;
  onDragStart: () => void;
  onHoverCell: () => void;
  onDrop: (pieceIndex: number, position: Position) => void;
  onInvalidDrop: () => void;
  canPlace: (pieceIndex: number, position: Position) => boolean;
  disabled?: boolean;
}

export const BlockTray = memo(function BlockTray({
  pieces,
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
  return (
    <View style={styles.container}>
      {pieces.map((piece, index) => (
        <View key={index} style={styles.slot}>
          {piece && (
            <BlockPieceComponent
              piece={piece}
              pieceIndex={index}
              gridSize={gridSize}
              gridOriginX={gridOriginX}
              gridOriginY={gridOriginY}
              onDragStart={onDragStart}
              onHoverCell={onHoverCell}
              onDrop={onDrop}
              onInvalidDrop={onInvalidDrop}
              canPlace={(pos) => canPlace(index, pos)}
              disabled={disabled}
            />
          )}
        </View>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: BLOCK_TRAY_HEIGHT,
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
  },
  slot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
});
