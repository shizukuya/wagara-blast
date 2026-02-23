// =============================================================================
// 亀甲 (Kikkou) - Tortoise Shell Pattern
// Regular hexagonal grid, symbolizing longevity (tortoise shell).
// =============================================================================
import React from 'react';
import Svg, { Polygon, Rect, ClipPath, Defs, G } from 'react-native-svg';

interface Props {
  size: number;
  primaryColor: string;
  secondaryColor: string;
}

/**
 * Renders a hexagonal grid (tortoise shell). Each hexagon is outlined
 * against the primary background, creating the characteristic kikkou motif.
 */
export const KikkouPattern: React.FC<Props> = ({
  size,
  primaryColor,
  secondaryColor,
}) => {
  const hexR = size / 5; // "Radius" (center to vertex) of each hexagon
  const hexW = hexR * Math.sqrt(3); // Width of a flat-top hexagon
  const hexH = hexR * 2;
  const strokeW = size * 0.03;
  const elements: React.ReactElement[] = [];

  /** Return the 6 vertices of a flat-top hexagon centered at (cx, cy). */
  const hexPoints = (cx: number, cy: number): string => {
    const pts: string[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const px = cx + hexR * Math.cos(angle);
      const py = cy + hexR * Math.sin(angle);
      pts.push(`${px},${py}`);
    }
    return pts.join(' ');
  };

  // Layout hexagons in an offset grid
  const rowHeight = hexH * 0.75;
  const rows = Math.ceil(size / rowHeight) + 2;
  const cols = Math.ceil(size / hexW) + 2;

  for (let row = -1; row < rows; row++) {
    for (let col = -1; col < cols; col++) {
      const offsetX = row % 2 === 0 ? 0 : hexW / 2;
      const cx = col * hexW + offsetX;
      const cy = row * rowHeight;
      const isCenterish =
        (row + col) % 3 === 0; // Every 3rd hex gets a subtle fill

      elements.push(
        <Polygon
          key={`hex-${row}-${col}`}
          points={hexPoints(cx, cy)}
          fill={isCenterish ? secondaryColor : primaryColor}
          fillOpacity={isCenterish ? 0.25 : 0}
          stroke={secondaryColor}
          strokeWidth={strokeW}
        />,
      );
    }
  }

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Defs>
        <ClipPath id="kikkou-clip">
          <Rect x={0} y={0} width={size} height={size} />
        </ClipPath>
      </Defs>
      <Rect x={0} y={0} width={size} height={size} fill={primaryColor} />
      <G clipPath="url(#kikkou-clip)">{elements}</G>
    </Svg>
  );
};
