import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../shared/design-system/theme/ThemeProvider';

interface QuantityStepperProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

function QuantityStepperInner({ quantity, onIncrement, onDecrement }: QuantityStepperProps) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { borderColor: theme.colors.border }]}>
      <TouchableOpacity
        onPress={onDecrement}
        style={styles.button}
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
      >
        <Text style={[styles.buttonText, { color: theme.colors.text }]}>−</Text>
      </TouchableOpacity>
      <Text style={[styles.quantity, { color: theme.colors.text }]} accessibilityLabel={`Quantity ${quantity}`}>
        {quantity}
      </Text>
      <TouchableOpacity
        onPress={onIncrement}
        style={styles.button}
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
      >
        <Text style={[styles.buttonText, { color: theme.colors.text }]}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

export const QuantityStepper = memo(QuantityStepperInner);

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 8 },
  button: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  buttonText: { fontSize: 18, fontWeight: '600' },
  quantity: { minWidth: 28, textAlign: 'center', fontSize: 15, fontWeight: '600' },
});