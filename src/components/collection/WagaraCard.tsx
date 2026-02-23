import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TilePatternRenderer } from '../tiles/TilePatternRenderer';
import { Colors } from '../../utils/colors';
import { t, getLocale } from '../../utils/i18n';
import type { WagaraType } from '../../types';

interface Props {
  wagaraType: WagaraType;
  nameJa: string;
  nameEn: string;
  isDiscovered: boolean;
  onPress: () => void;
}

export const WagaraCard = memo(function WagaraCard({
  wagaraType,
  nameJa,
  nameEn,
  isDiscovered,
  onPress,
}: Props) {
  const locale = getLocale();
  const name = locale === 'ja' ? nameJa : nameEn;

  return (
    <TouchableOpacity
      style={[styles.card, !isDiscovered && styles.locked]}
      onPress={onPress}
      disabled={!isDiscovered}
      activeOpacity={0.7}
    >
      <View style={styles.preview}>
        {isDiscovered ? (
          <TilePatternRenderer wagaraType={wagaraType} size={80} />
        ) : (
          <View style={styles.lockedPreview}>
            <Text style={styles.lockIcon}>?</Text>
          </View>
        )}
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {isDiscovered ? name : t('locked')}
      </Text>
      {isDiscovered && (
        <Text style={styles.badge}>{t('discovered')}</Text>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    width: '45%',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    margin: 8,
    borderWidth: 1,
    borderColor: Colors.gridLine,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  locked: {
    opacity: 0.5,
  },
  preview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  lockedPreview: {
    width: 80,
    height: 80,
    backgroundColor: Colors.disabled,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIcon: {
    fontSize: 32,
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  badge: {
    fontSize: 10,
    color: Colors.success,
    fontWeight: '600',
    marginTop: 4,
  },
});
