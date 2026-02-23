import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../src/utils/colors';
import { t } from '../../src/utils/i18n';

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return (
    <View style={styles.iconContainer}>
      <Text
        style={[
          styles.iconText,
          { color: focused ? Colors.tabActive : Colors.tabInactive },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

// Simple text-based icons to avoid emoji usage per GDD rules
const TAB_ICONS: Record<string, string> = {
  play: '\u25B6',        // ▶
  collection: '\u25A3',  // ▣
  shop: '\u2605',        // ★
  settings: '\u2699',    // ⚙
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.tabActive,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="play"
        options={{
          title: t('play'),
          tabBarIcon: ({ focused }) => (
            <TabIcon label={TAB_ICONS.play} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: t('collection'),
          tabBarIcon: ({ focused }) => (
            <TabIcon label={TAB_ICONS.collection} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: t('shop'),
          tabBarIcon: ({ focused }) => (
            <TabIcon label={TAB_ICONS.shop} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings'),
          tabBarIcon: ({ focused }) => (
            <TabIcon label={TAB_ICONS.settings} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.tabBackground,
    borderTopColor: Colors.gridLine,
    borderTopWidth: 1,
    height: 56,
    paddingBottom: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
  },
  iconText: {
    fontSize: 20,
  },
});
