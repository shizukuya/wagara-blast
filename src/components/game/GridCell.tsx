import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSequence,
  FadeIn,
} from 'react-native-reanimated';
import { Colors } from '../../utils/colors';
import { CELL_RADIUS, CELL_GAP } from '../../utils/dimensions';
import { TilePatternRenderer } from '../tiles/TilePatternRenderer';
import type { GridCell as GridCellType } from '../../types';

interface Props {
  cell: GridCellType;
  size: number;
  isClearing?: boolean;
  isHighlighted?: boolean;
  isInvalid?: boolean;
}

export const GridCell = memo(function GridCell({
  cell,
  size,
  isClearing,
  isHighlighted,
  isInvalid,
}: Props) {
  const innerSize = size - CELL_GAP * 2;

  if (cell.state === 'obstacle' && cell.obstacleType === 'stone') {
    return (
      <View
        style={[
          styles.cell,
          {
            width: size,
            height: size,
            padding: CELL_GAP,
          },
        ]}
      >
        <View
          style={[
            styles.inner,
            styles.stone,
            { width: innerSize, height: innerSize, borderRadius: CELL_RADIUS },
          ]}
        />
      </View>
    );
  }

  if (cell.state === 'filled' && cell.wagaraType) {
    return (
      <View
        style={[
          styles.cell,
          {
            width: size,
            height: size,
            padding: CELL_GAP,
          },
        ]}
      >
        <Animated.View
          entering={FadeIn.duration(150)}
          style={[
            styles.inner,
            styles.filled,
            {
              width: innerSize,
              height: innerSize,
              borderRadius: CELL_RADIUS,
              overflow: 'hidden',
            },
            isClearing && styles.clearing,
            (cell.frozenTurns ?? 0) > 0 && styles.frozen,
            (cell.chainHP ?? 0) > 0 && styles.chained,
            cell.hasFog === true && styles.foggy,
          ]}
        >
          <TilePatternRenderer
            wagaraType={cell.wagaraType}
            size={innerSize}
          />
          {/* Inner shadow for "embedded" feel */}
          <View style={[styles.innerShadow, { borderRadius: CELL_RADIUS }]} />
          {/* Frozen overlay */}
          {cell.frozenTurns && cell.frozenTurns > 0 && (
            <View style={styles.frozenOverlay} />
          )}
          {/* Chain overlay */}
          {cell.chainHP && cell.chainHP > 0 && (
            <View style={styles.chainOverlay} />
          )}
        </Animated.View>
      </View>
    );
  }

  // Empty cell
  return (
    <View
      style={[
        styles.cell,
        {
          width: size,
          height: size,
          padding: CELL_GAP,
        },
      ]}
    >
      <View
        style={[
          styles.inner,
          styles.empty,
          {
            width: innerSize,
            height: innerSize,
            borderRadius: CELL_RADIUS,
          },
          isHighlighted && styles.highlighted,
          isInvalid && styles.invalid,
          cell.hasFog && styles.foggy,
        ]}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    backgroundColor: Colors.emptyCell,
    borderWidth: 0.5,
    borderColor: Colors.gridLine,
  },
  filled: {
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.15)',
  },
  stone: {
    backgroundColor: '#8B8680',
    borderWidth: 1,
    borderColor: '#6B6560',
  },
  clearing: {
    opacity: 0.8,
  },
  highlighted: {
    backgroundColor: 'rgba(201, 168, 76, 0.3)',
    borderColor: Colors.gold,
    borderWidth: 1,
  },
  invalid: {
    backgroundColor: 'rgba(196, 30, 58, 0.2)',
    borderColor: Colors.error,
    borderWidth: 1,
  },
  frozen: {
    borderColor: '#A0D8EF',
    borderWidth: 1.5,
  },
  chained: {
    borderColor: '#8B7355',
    borderWidth: 1.5,
  },
  foggy: {
    opacity: 0.4,
  },
  innerShadow: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  frozenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(160, 216, 239, 0.3)',
  },
  chainOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(139, 115, 85, 0.2)',
  },
});
