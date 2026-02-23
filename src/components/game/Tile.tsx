import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { CELL_RADIUS } from '../../utils/dimensions';
import { TilePatternRenderer } from '../tiles/TilePatternRenderer';
import type { WagaraType } from '../../types';

interface Props {
  wagaraType: WagaraType;
  size: number;
  opacity?: number;
}

export const Tile = memo(function Tile({ wagaraType, size, opacity = 1 }: Props) {
  return (
    <View
      style={[
        styles.tile,
        {
          width: size,
          height: size,
          borderRadius: CELL_RADIUS,
          opacity,
        },
      ]}
    >
      <TilePatternRenderer wagaraType={wagaraType} size={size} />
      <View style={[styles.innerShadow, { borderRadius: CELL_RADIUS }]} />
    </View>
  );
});

const styles = StyleSheet.create({
  tile: {
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.15)',
  },
  innerShadow: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
});
