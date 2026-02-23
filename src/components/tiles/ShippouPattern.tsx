// =============================================================================
// 七宝 (Shippou) - Seven Treasures Pattern
// Overlapping circles that create petal / flower-like intersections,
// symbolizing the seven treasures of Buddhism and infinite connections.
// =============================================================================
import React from 'react';
import Svg, { Circle, Rect, ClipPath, Defs, G } from 'react-native-svg';

interface Props {
  size: number;
  primaryColor: string;
  secondaryColor: string;
}

/**
 * Renders overlapping circles on a grid. Where four circles overlap they
 * create the characteristic "petal" or lens shape of the shippou motif.
 */
export const ShippouPattern: React.FC<Props> = ({
  size,
  primaryColor,
  secondaryColor,
}) => {
  const r = size / 4; // Circle radius
  const spacing = r * 2; // Distance between circle centers
  const circles: React.ReactElement[] = [];
  const strokeW = size * 0.025;

  // Place circles on a regular grid; each circle overlaps neighbors
  for (let row = -1; row <= 3; row++) {
    for (let col = -1; col <= 3; col++) {
      const cx = col * spacing + r;
      const cy = row * spacing + r;
      circles.push(
        <Circle
          key={`${row}-${col}`}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={secondaryColor}
          strokeWidth={strokeW}
        />,
      );
    }
  }

  // Create small filled petal shapes at intersections
  const petals: React.ReactElement[] = [];
  for (let row = 0; row <= 2; row++) {
    for (let col = 0; col <= 2; col++) {
      const cx = col * spacing + r;
      const cy = row * spacing + r;
      // Small diamond/petal at center of four overlapping circles
      petals.push(
        <Circle
          key={`petal-${row}-${col}`}
          cx={cx}
          cy={cy}
          r={r * 0.2}
          fill={secondaryColor}
          opacity={0.4}
        />,
      );
    }
  }

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Defs>
        <ClipPath id="shippou-clip">
          <Rect x={0} y={0} width={size} height={size} />
        </ClipPath>
      </Defs>
      {/* Background */}
      <Rect x={0} y={0} width={size} height={size} fill={primaryColor} />
      <G clipPath="url(#shippou-clip)">
        {circles}
        {petals}
      </G>
    </Svg>
  );
};
