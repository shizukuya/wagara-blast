import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WagaraCard } from '../../src/components/collection/WagaraCard';
import { Colors } from '../../src/utils/colors';
import { t } from '../../src/utils/i18n';
import { useCollectionStore } from '../../src/stores/collectionStore';
import { WAGARA_ENCYCLOPEDIA } from '../../src/data/wagaraEncyclopedia';
import type { WagaraType, WagaraInfo } from '../../src/types';

export default function CollectionScreen() {
  const router = useRouter();
  const isDiscovered = useCollectionStore((s) => s.isDiscovered);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t('collection')}</Text>
      <ScrollView contentContainerStyle={styles.grid}>
        {(Object.values(WAGARA_ENCYCLOPEDIA) as WagaraInfo[]).map((info) => (
          <WagaraCard
            key={info.type}
            wagaraType={info.type}
            nameJa={info.nameJa}
            nameEn={info.nameEn}
            isDiscovered={isDiscovered(info.type)}
            onPress={() => router.push(`/wagara/${info.type}`)}
          />
        ))}
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingBottom: 24,
  },
});
