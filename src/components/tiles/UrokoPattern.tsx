// =============================================================================
// 鱗 (Uroko) - Scales Pattern
// Repeating triangle pattern in alternating colors, resembling fish or
// dragon scales. A traditional protective motif.
// =============================================================================
import React from 'react';
import Svg, { Polygon, Rect, ClipPath, Defs, G } from 'react-native-svg';

interface Props {
  size: number;
  primaryColor: string;
  secondaryColor: string;
}

/**
 * Renders a grid of alternating upward and downward triangles.
 * Odd triangles are filled with the secondary color for contrast.
 */
export const UrokoPattern: React.FC<Props> = ({
  size,
  primaryColor,
  secondaryColor,
}) => {
  const cols = 4;
  const rows = 4;
  const triWidth = size / cols;
  const triHeight = size / rows;
  const elements: React.ReactElement[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols * 2; col++) {
      const isUp = col % 2 === 0;
      const baseCol = Math.floor(col / 2);
      const x = baseCol * triWidth;
      const y = row * triHeight;

      let points: string;
      if (isUp) {
        // Upward-pointing triangle
        points = `${x},${y + triHeight} ${x + triWidth / 2},${y} ${x + triWidth},${y + triHeight}`;
      } else {
        // Downward-pointing triangle
        points = `${x},${y} ${x + triWidth},${y} ${x + triWidth / 2},${y + triHeight}`;
      }

      const useSecondary = (row + col) % 2 === 0;

      elements.push(
        <Polygon
          key={`tri-${row}-${col}`}
          points={points}
          fill={useSecondary ? secondaryColor : primaryColor}
          stroke={secondaryColor}
          strokeWidth={size * 0.015}
        />,
      );
    }
  }

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Defs>
        <ClipPath id="uroko-clip">
          <Rect x={0} y={0} width={size} height={size} />
        </ClipPath>
      </Defs>
      <Rect x={0} y={0} width={size} height={size} fill={primaryColor} />
      <G clipPath="url(#uroko-clip)">{elements}</G>
    </Svg>
  );
};
