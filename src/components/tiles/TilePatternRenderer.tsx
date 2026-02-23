// =============================================================================
// Tile Pattern Renderer - Dispatches to the correct wagara SVG component
// =============================================================================
import React from 'react';
import type { WagaraType } from '../../types';
import { Colors } from '../../utils/colors';
import { IchimatsuPattern } from './IchimatsuPattern';
import { AsanohaPattern } from './AsanohaPattern';
import { SeigaihaPattern } from './SeigaihaPattern';
import { ShippouPattern } from './ShippouPattern';
import { YagasuriPattern } from './YagasuriPattern';
import { KikkouPattern } from './KikkouPattern';
import { UrokoPattern } from './UrokoPattern';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface Props {
  wagaraType: WagaraType;
  size: number;
}

// ---------------------------------------------------------------------------
// Pattern registry
// ---------------------------------------------------------------------------

const PATTERN_COMPONENTS: Record<
  WagaraType,
  React.FC<{ size: number; primaryColor: string; secondaryColor: string }>
> = {
  ichimatsu: IchimatsuPattern,
  asanoha: AsanohaPattern,
  seigaiha: SeigaihaPattern,
  shippou: ShippouPattern,
  yagasuri: YagasuriPattern,
  kikkou: KikkouPattern,
  uroko: UrokoPattern,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Renders the appropriate wagara pattern SVG at the requested size.
 * Automatically pulls the correct color pair from the global palette.
 */
export const TilePatternRenderer: React.FC<Props> = React.memo(
  ({ wagaraType, size }) => {
    const PatternComponent = PATTERN_COMPONENTS[wagaraType];
    const colorScheme = Colors.wagara[wagaraType];

    if (!PatternComponent || !colorScheme) {
      // Fallback: should never happen with a valid WagaraType
      return null;
    }

    return (
      <PatternComponent
        size={size}
        primaryColor={colorScheme.primary}
        secondaryColor={colorScheme.secondary}
      />
    );
  },
);

TilePatternRenderer.displayName = 'TilePatternRenderer';
