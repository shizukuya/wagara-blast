import React, { memo } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { Colors } from '../../utils/colors';

interface Props {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export const SettingsRow = memo(function SettingsRow({
  label,
  value,
  onValueChange,
}: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: Colors.disabled, true: Colors.accent }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gridLine,
  },
  label: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
});
