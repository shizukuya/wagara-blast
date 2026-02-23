import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SettingsRow } from '../../src/components/ui/SettingsRow';
import { Colors } from '../../src/utils/colors';
import { t, getLocale, setLocale } from '../../src/utils/i18n';
import { useSettingsStore } from '../../src/stores/settingsStore';
import { useUserStore } from '../../src/stores/userStore';

export default function SettingsScreen() {
  const settings = useSettingsStore();
  const resetUser = useUserStore((s) => s.reset);
  const locale = getLocale();

  const handleResetProgress = () => {
    Alert.alert(t('resetProgress'), t('resetConfirm'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('confirm'),
        style: 'destructive',
        onPress: () => {
          resetUser();
        },
      },
    ]);
  };

  const toggleLocale = () => {
    const newLocale = locale === 'ja' ? 'en' : 'ja';
    setLocale(newLocale);
    settings.setLocale(newLocale);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t('settings')}</Text>
      <ScrollView>
        <View style={styles.section}>
          <SettingsRow
            label={t('sound')}
            value={settings.soundEnabled}
            onValueChange={settings.toggleSound}
          />
          <SettingsRow
            label={t('music')}
            value={settings.musicEnabled}
            onValueChange={settings.toggleMusic}
          />
          <SettingsRow
            label={t('haptics')}
            value={settings.hapticsEnabled}
            onValueChange={settings.toggleHaptics}
          />
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.row} onPress={toggleLocale}>
            <Text style={styles.rowLabel}>{t('language')}</Text>
            <Text style={styles.rowValue}>
              {locale === 'ja' ? '\u65E5\u672C\u8A9E' : 'English'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.dangerRow}
            onPress={handleResetProgress}
          >
            <Text style={styles.dangerText}>{t('resetProgress')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.about}>
          <Text style={styles.version}>Wagara Blast v1.0.0</Text>
          <Text style={styles.credits}>Shizukuya / Mio</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    paddingVertical: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  rowLabel: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  rowValue: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  dangerRow: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
  },
  dangerText: {
    fontSize: 16,
    color: Colors.error,
    fontWeight: '600',
  },
  about: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  version: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  credits: {
    fontSize: 12,
    color: Colors.disabled,
    marginTop: 4,
  },
});
