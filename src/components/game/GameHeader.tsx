import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../utils/colors';
import { HEADER_HEIGHT } from '../../utils/dimensions';
import { t } from '../../utils/i18n';
import type { GameMode, LevelConfig } from '../../types';

interface Props {
  mode: GameMode;
  levelConfig?: LevelConfig | null;
  moveCount?: number;
  linesCleared?: number;
  onPause: () => void;
  onHome: () => void;
}

export const GameHeader = memo(function GameHeader({
  mode,
  levelConfig,
  moveCount,
  linesCleared,
  onPause,
  onHome,
}: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onHome} style={styles.button}>
        <Text style={styles.buttonText}>{'\u2190'}</Text>
      </TouchableOpacity>

      <View style={styles.center}>
        {mode === 'level' && levelConfig && (
          <>
            <Text style={styles.levelText}>
              {t('level_label')} {levelConfig.id}
            </Text>
            {levelConfig.clearCondition.type === 'moves' && (
              <Text style={styles.infoText}>
                {t('moves')}: {moveCount ?? 0}/{levelConfig.clearCondition.target}
              </Text>
            )}
            {levelConfig.clearCondition.type === 'lines' && (
              <Text style={styles.infoText}>
                {t('target')}: {linesCleared ?? 0}/{levelConfig.clearCondition.target}
              </Text>
            )}
          </>
        )}
        {mode === 'classic' && (
          <Text style={styles.levelText}>{t('classic')}</Text>
        )}
        {mode === 'daily' && (
          <Text style={styles.levelText}>{t('dailyChallenge')}</Text>
        )}
      </View>

      <TouchableOpacity onPress={onPause} style={styles.button}>
        <Text style={styles.buttonText}>{'\u2016'}</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: HEADER_HEIGHT,
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.woodFrame,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  center: {
    alignItems: 'center',
  },
  levelText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  infoText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
