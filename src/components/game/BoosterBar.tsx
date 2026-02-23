import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../utils/colors';
import { BOOSTER_BAR_HEIGHT } from '../../utils/dimensions';
import { t } from '../../utils/i18n';
import type { BoosterType } from '../../types';

interface BoosterItem {
  type: BoosterType;
  count: number;
}

interface Props {
  boosters: BoosterItem[];
  onUse: (type: BoosterType) => void;
  disabled?: boolean;
}

const BOOSTER_ICONS: Record<BoosterType, string> = {
  stoneBreaker: '\u25C9', // ◉
  shuffle: '\u21C4',      // ⇄
  guide: '\u2606',        // ☆
  lightning: '\u26A1',    // ⚡ (fallback glyph)
  wave: '\u224B',         // ≋
};

export const BoosterBar = memo(function BoosterBar({
  boosters,
  onUse,
  disabled,
}: Props) {
  return (
    <View style={styles.container}>
      {boosters.map((booster) => (
        <TouchableOpacity
          key={booster.type}
          style={[
            styles.button,
            (booster.count <= 0 || disabled) && styles.buttonDisabled,
          ]}
          onPress={() => onUse(booster.type)}
          disabled={booster.count <= 0 || disabled}
          activeOpacity={0.7}
        >
          <Text style={styles.icon}>{BOOSTER_ICONS[booster.type]}</Text>
          <Text style={styles.count}>x{booster.count}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: BOOSTER_BAR_HEIGHT,
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.gridLine,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.woodFrame,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  icon: {
    fontSize: 18,
    color: Colors.gold,
  },
  count: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
