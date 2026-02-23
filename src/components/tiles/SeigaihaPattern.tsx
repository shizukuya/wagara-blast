// =============================================================================
// 青海波 (Seigaiha) - Blue Ocean Waves Pattern
// Overlapping concentric arcs arranged in staggered rows, representing
// infinite ocean waves and a wish for peaceful seas.
// =============================================================================
import React from 'react';
import Svg, { Circle, Rect, ClipPath, Defs, G } from 'react-native-svg';

interface Props {
  size: number;
  primaryColor: string;
  secondaryColor: string;
}

/**
 * Renders overlapping concentric half-circles in a wave arrangement.
 * Each "wave unit" is a set of concentric arcs; units are staggered
 * across rows to create the characteristic seigaiha look.
 */
export const SeigaihaPattern: React.FC<Props> = ({
  size,
  primaryColor,
  secondaryColor,
}) => {
  const r = size / 4; // Radius of one wave unit
  const elements: React.ReactElement[] = [];

  // We render wave centers on a grid, offset every other row.
  // Each center produces 3 concentric circles (clipped to top half by row).
  const cols = 4;
  const rows = 5;

  for (let row = -1; row < rows; row++) {
    for (let col = -1; col < cols + 1; col++) {
      const offsetX = row % 2 === 0 ? 0 : r;
      const cx = col * r * 2 + offsetX;
      const cy = row * r * 0.85 + r;
      const key = `wave-${row}-${col}`;

      // 3 concentric arcs (outermost to innermost)
      const radii = [r, r * 0.7, r * 0.4];
      const fills = [secondaryColor, primaryColor, secondaryColor];
      const opacities = [1, 1, 0.7];

      elements.push(
        <G key={key}>
          {radii.map((radius, i) => (
            <Circle
              key={`${key}-${i}`}
              cx={cx}
              cy={cy}
              r={radius}
              fill={fills[i]}
              opacity={opacities[i]}
              stroke={secondaryColor}
              strokeWidth={size * 0.015}
            />
          ))}
        </G>,
      );
    }
  }

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Defs>
        <ClipPath id="seigaiha-clip">
          <Rect x={0} y={0} width={size} height={size} />
        </ClipPath>
      </Defs>
      {/* Background */}
      <Rect x={0} y={0} width={size} height={size} fill={primaryColor} />
      {/* Waves (clipped to tile boundary) */}
      <G clipPath="url(#seigaiha-clip)">{elements}</G>
    </Svg>
  );
};
