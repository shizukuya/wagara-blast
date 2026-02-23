import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../../utils/colors';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const variantStyles: Record<string, ViewStyle> = {
  primary: { backgroundColor: Colors.accent },
  secondary: { backgroundColor: Colors.woodFrame },
  outline: { backgroundColor: 'transparent', borderWidth: 2, borderColor: Colors.accent },
  ghost: { backgroundColor: 'transparent' },
};

const variantTextStyles: Record<string, TextStyle> = {
  primary: { color: '#FFFFFF' },
  secondary: { color: '#FFFFFF' },
  outline: { color: Colors.accent },
  ghost: { color: Colors.textPrimary },
};

const sizeStyles: Record<string, ViewStyle> = {
  small: { paddingHorizontal: 16, paddingVertical: 8 },
  medium: { paddingHorizontal: 24, paddingVertical: 12 },
  large: { paddingHorizontal: 32, paddingVertical: 16 },
};

const sizeTextStyles: Record<string, TextStyle> = {
  small: { fontSize: 13 },
  medium: { fontSize: 16 },
  large: { fontSize: 18 },
};

export const Button = memo(function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled,
  style,
  textStyle,
}: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.base,
        variantStyles[variant],
        sizeStyles[size],
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.text,
          variantTextStyles[variant],
          sizeTextStyles[size],
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '700',
  },
});
