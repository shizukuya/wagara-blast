// =============================================================================
// 矢絣 (Yagasuri) - Arrow Feathers Pattern
// Arrow-like zigzag pattern with alternating direction, traditionally
// associated with a bride's kimono (arrows cannot return once shot).
// =============================================================================
import React from 'react';
import Svg, { Polygon, Rect, ClipPath, Defs, G } from 'react-native-svg';

interface Props {
  size: number;
  primaryColor: string;
  secondaryColor: string;
}

/**
 * Renders alternating arrow (chevron) columns. Each column contains
 * V-shaped arrow feather motifs pointing up or down.
 */
export const YagasuriPattern: React.FC<Props> = ({
  size,
  primaryColor,
  secondaryColor,
}) => {
  const cols = 4;
  const colWidth = size / cols;
  const arrowHeight = size / 4;
  const elements: React.ReactElement[] = [];

  for (let col = 0; col < cols; col++) {
    const x = col * colWidth;
    const pointsUp = col % 2 === 0;

    for (let row = 0; row < 5; row++) {
      const y = row * arrowHeight;

      if (pointsUp) {
        // Arrow pointing up: V shape
        // Left half
        elements.push(
          <Polygon
            key={`up-l-${col}-${row}`}
            points={`${x},${y + arrowHeight} ${x + colWidth / 2},${y} ${x + colWidth / 2},${y + arrowHeight}`}
            fill={secondaryColor}
          />,
        );
        // Right half (slightly lighter)
        elements.push(
          <Polygon
            key={`up-r-${col}-${row}`}
            points={`${x + colWidth / 2},${y} ${x + colWidth},${y + arrowHeight} ${x + colWidth / 2},${y + arrowHeight}`}
            fill={primaryColor}
          />,
        );
      } else {
        // Arrow pointing down: inverted V shape
        // Left half
        elements.push(
          <Polygon
            key={`down-l-${col}-${row}`}
            points={`${x},${y} ${x + colWidth / 2},${y + arrowHeight} ${x + colWidth / 2},${y}`}
            fill={primaryColor}
          />,
        );
        // Right half
        elements.push(
          <Polygon
            key={`down-r-${col}-${row}`}
            points={`${x + colWidth / 2},${y + arrowHeight} ${x + colWidth},${y} ${x + colWidth / 2},${y}`}
            fill={secondaryColor}
          />,
        );
      }
    }
  }

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Defs>
        <ClipPath id="yagasuri-clip">
          <Rect x={0} y={0} width={size} height={size} />
        </ClipPath>
      </Defs>
      {/* Background base */}
      <Rect x={0} y={0} width={size} height={size} fill={primaryColor} />
      <G clipPath="url(#yagasuri-clip)">{elements}</G>
    </Svg>
  );
};
