import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../src/utils/colors';
import { t, getLocale } from '../../src/utils/i18n';
import { IAP_PRODUCTS } from '../../src/data/iapProducts';

export default function ShopScreen() {
  const locale = getLocale();

  const handlePurchase = (productId: string) => {
    // TODO: Implement IAP purchase flow
    console.log(`[Shop] TODO: Purchase ${productId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{t('shop')}</Text>
      <ScrollView contentContainerStyle={styles.products}>
        {IAP_PRODUCTS.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={styles.productCard}
            onPress={() => handlePurchase(product.id)}
            activeOpacity={0.7}
          >
            <View style={styles.productInfo}>
              <Text style={styles.productName}>
                {locale === 'ja' ? product.nameJa : product.nameEn}
              </Text>
              <Text style={styles.productPrice}>
                {'\u00A5'}{product.priceJPY}
              </Text>
            </View>
            <View style={styles.buyButton}>
              <Text style={styles.buyText}>{t('comingSoon')}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.notice}>
        <Text style={styles.noticeText}>
          {locale === 'ja'
            ? '\u8CFC\u5165\u6A5F\u80FD\u306F\u6E96\u5099\u4E2D\u3067\u3059'
            : 'In-app purchases coming soon'}
        </Text>
      </View>
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
  products: {
    paddingHorizontal: 20,
    gap: 12,
    paddingBottom: 24,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  productPrice: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: '600',
    marginTop: 2,
  },
  buyButton: {
    backgroundColor: Colors.disabled,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  buyText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  notice: {
    padding: 16,
    alignItems: 'center',
  },
  noticeText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
