import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TilePatternRenderer } from '../../src/components/tiles/TilePatternRenderer';
import { Colors } from '../../src/utils/colors';
import { t, getLocale } from '../../src/utils/i18n';
import { WAGARA_ENCYCLOPEDIA } from '../../src/data/wagaraEncyclopedia';
import { useCollectionStore } from '../../src/stores/collectionStore';
import type { WagaraType } from '../../src/types';

export default function WagaraDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const locale = getLocale();
  const markViewed = useCollectionStore((s) => s.markViewed);

  const wagaraInfo = id ? WAGARA_ENCYCLOPEDIA[id as WagaraType] : undefined;

  React.useEffect(() => {
    if (id) markViewed(id as WagaraType);
  }, [id]);

  if (!wagaraInfo) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.notFound}>Not found</Text>
      </SafeAreaView>
    );
  }

  const name = locale === 'ja' ? wagaraInfo.nameJa : wagaraInfo.nameEn;
  const meaning = locale === 'ja' ? wagaraInfo.meaningJa : wagaraInfo.meaningEn;
  const history = locale === 'ja' ? wagaraInfo.historyJa : wagaraInfo.historyEn;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>{'\u2190'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{name}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.patternContainer}>
          <TilePatternRenderer
            wagaraType={wagaraInfo.type as WagaraType}
            size={200}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('meaning')}</Text>
          <Text style={styles.sectionText}>{meaning}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('history')}</Text>
          <Text style={styles.sectionText}>{history}</Text>
        </View>

        {/* Show both languages */}
        {locale === 'en' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{wagaraInfo.nameJa}</Text>
            <Text style={styles.japaneseText}>{wagaraInfo.meaningJa}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.woodFrame,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  content: {
    padding: 24,
    alignItems: 'center',
    gap: 20,
  },
  patternContainer: {
    width: 200,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  section: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.accent,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionText: {
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  japaneseText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  notFound: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
  },
});
