// =============================================================================
// 麻の葉 (Asanoha) - Hemp Leaf Pattern
// Geometric hexagonal star pattern composed of small triangles radiating
// from center points, creating a repeating six-pointed star motif.
// =============================================================================
import React from 'react';
import Svg, { Polygon, Rect, Line } from 'react-native-svg';

interface Props {
  size: number;
  primaryColor: string;
  secondaryColor: string;
}

/**
 * Renders a simplified asanoha (hemp leaf) pattern.
 * The pattern is built from diamond shapes that radiate from grid points,
 * creating the characteristic six-pointed star appearance.
 */
export const AsanohaPattern: React.FC<Props> = ({
  size,
  primaryColor,
  secondaryColor,
}) => {
  const half = size / 2;
  const quarter = size / 4;

  // Build lines radiating from center and quarter points to create the
  // hemp-leaf geometric star motif.
  const lines: React.ReactElement[] = [];
  const strokeW = size * 0.03;

  // Helper: add a line element
  const addLine = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    key: string,
  ) => {
    lines.push(
      <Line
        key={key}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={secondaryColor}
        strokeWidth={strokeW}
      />,
    );
  };

  // Outer diamonds making up the star at the center
  const cx = half;
  const cy = half;

  // Draw the main star from center
  // 6 radiating lines
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    const ex = cx + quarter * Math.cos(angle);
    const ey = cy + quarter * Math.sin(angle);
    addLine(cx, cy, ex, ey, `center-${i}`);
  }

  // Draw connecting diamond shapes between adjacent spoke endpoints
  for (let i = 0; i < 6; i++) {
    const angle1 = (Math.PI / 3) * i - Math.PI / 2;
    const angle2 = (Math.PI / 3) * ((i + 1) % 6) - Math.PI / 2;
    const x1 = cx + quarter * Math.cos(angle1);
    const y1 = cy + quarter * Math.sin(angle1);
    const x2 = cx + quarter * Math.cos(angle2);
    const y2 = cy + quarter * Math.sin(angle2);
    addLine(x1, y1, x2, y2, `hex-${i}`);
  }

  // Add secondary stars at corners for tiling continuity
  const corners = [
    [0, 0],
    [size, 0],
    [0, size],
    [size, size],
  ];
  corners.forEach(([ox, oy], ci) => {
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      const ex = ox + quarter * Math.cos(angle);
      const ey = oy + quarter * Math.sin(angle);
      addLine(ox, oy, ex, ey, `corner-${ci}-${i}`);
    }
    for (let i = 0; i < 6; i++) {
      const angle1 = (Math.PI / 3) * i - Math.PI / 2;
      const angle2 = (Math.PI / 3) * ((i + 1) % 6) - Math.PI / 2;
      const x1 = ox + quarter * Math.cos(angle1);
      const y1 = oy + quarter * Math.sin(angle1);
      const x2 = ox + quarter * Math.cos(angle2);
      const y2 = oy + quarter * Math.sin(angle2);
      addLine(x1, y1, x2, y2, `corner-hex-${ci}-${i}`);
    }
  });

  // Additional connecting lines from center star to edges
  const edgeMids = [
    [half, 0],
    [size, half],
    [half, size],
    [0, half],
  ];
  edgeMids.forEach(([ex, ey], ei) => {
    addLine(cx, cy, ex, ey, `edge-${ei}`);
  });

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background */}
      <Rect x={0} y={0} width={size} height={size} fill={primaryColor} />

      {/* Triangular fill regions (simplified as polygons) */}
      {/* Top diamond */}
      <Polygon
        points={`${cx},${cy} ${cx - quarter * 0.5},${cy - quarter * 0.87} ${cx + quarter * 0.5},${cy - quarter * 0.87}`}
        fill={secondaryColor}
        opacity={0.25}
      />
      {/* Bottom diamond */}
      <Polygon
        points={`${cx},${cy} ${cx - quarter * 0.5},${cy + quarter * 0.87} ${cx + quarter * 0.5},${cy + quarter * 0.87}`}
        fill={secondaryColor}
        opacity={0.25}
      />
      {/* Left diamond */}
      <Polygon
        points={`${cx},${cy} ${cx - quarter},${cy - quarter * 0.2} ${cx - quarter},${cy + quarter * 0.2}`}
        fill={secondaryColor}
        opacity={0.15}
      />
      {/* Right diamond */}
      <Polygon
        points={`${cx},${cy} ${cx + quarter},${cy - quarter * 0.2} ${cx + quarter},${cy + quarter * 0.2}`}
        fill={secondaryColor}
        opacity={0.15}
      />

      {/* All geometric lines */}
      {lines}
    </Svg>
  );
};
