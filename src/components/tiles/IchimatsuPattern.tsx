// =============================================================================
// 市松 (Ichimatsu) - Checker Pattern
// Alternating colored squares in a classic checkerboard arrangement.
// =============================================================================
import React from 'react';
import Svg, { Rect } from 'react-native-svg';

interface Props {
  size: number;
  primaryColor: string;
  secondaryColor: string;
}

/**
 * Renders a 4x4 checkerboard pattern scaled to fit `size`.
 * Each small square is size/4 on a side.
 */
export const IchimatsuPattern: React.FC<Props> = ({
  size,
  primaryColor,
  secondaryColor,
}) => {
  const cellSize = size / 4;
  const rects: React.ReactElement[] = [];

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const isEven = (row + col) % 2 === 0;
      rects.push(
        <Rect
          key={`${row}-${col}`}
          x={col * cellSize}
          y={row * cellSize}
          width={cellSize}
          height={cellSize}
          fill={isEven ? primaryColor : secondaryColor}
        />,
      );
    }
  }

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {rects}
    </Svg>
  );
};
