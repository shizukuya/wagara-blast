import React, { memo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '../../utils/colors';
import { getGridCellSize, CELL_GAP } from '../../utils/dimensions';

interface Props {
  rows: number[];
  cols: number[];
  gridSize: number;
  onComplete?: () => void;
}

export const LineClearEffect = memo(function LineClearEffect({
  rows,
  cols,
  gridSize,
  onComplete,
}: Props) {
  const cellSize = getGridCellSize(gridSize);
  const opacity = useSharedValue(1);
  const scaleY = useSharedValue(1);

  useEffect(() => {
    // Flash white then shrink and fade
    opacity.value = withSequence(
      withTiming(1, { duration: 80, easing: Easing.in(Easing.ease) }),
      withDelay(100, withTiming(0, { duration: 200, easing: Easing.in(Easing.quad) }))
    );
    scaleY.value = withDelay(
      80,
      withTiming(0, { duration: 200, easing: Easing.in(Easing.quad) })
    );

    const timer = setTimeout(() => onComplete?.(), 300);
    return () => clearTimeout(timer);
  }, []);

  const rowStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scaleY: scaleY.value }],
  }));

  const colStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scaleX: scaleY.value }],
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {rows.map((row) => (
        <Animated.View
          key={`row-${row}`}
          style={[
            styles.rowHighlight,
            rowStyle,
            {
              top: row * cellSize,
              height: cellSize,
              width: gridSize * cellSize,
            },
          ]}
        />
      ))}
      {cols.map((col) => (
        <Animated.View
          key={`col-${col}`}
          style={[
            styles.colHighlight,
            colStyle,
            {
              left: col * cellSize,
              width: cellSize,
              height: gridSize * cellSize,
            },
          ]}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  rowHighlight: {
    position: 'absolute',
    left: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  colHighlight: {
    position: 'absolute',
    top: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});
