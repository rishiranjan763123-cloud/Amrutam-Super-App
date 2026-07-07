import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { ToastType } from './useToast';

interface ToastProps {
  message: string;
  type: ToastType;
  onHide: () => void;
  duration: number;
}

const TYPE_COLORS: Record<ToastType, string> = {
  success: '#2E7D5B',
  error: '#D32F2F',
  info: '#2196F3',
  warning: '#F5A623',
};

export function Toast({ message, type, onHide, duration }: ToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    const timer = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(onHide);
    }, duration);
    return () => clearTimeout(timer);
  }, [opacity, duration, onHide]);

  return (
    <Animated.View
      style={[styles.container, { backgroundColor: TYPE_COLORS[type], opacity }]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    padding: 14,
    borderRadius: 8,
    elevation: 4,
  },
  text: { color: '#FFFFFF', fontSize: 14, textAlign: 'center' },
});