import { mmkvStorage } from '../../shared/storage/mmkv';
import { logger } from '../../shared/logging/logger';

export interface FeatureFlags {
  enableWishlist: boolean;
  enableBiometricAuth: boolean;
  enableDarkModeToggle: boolean;
  enablePushNotifications: boolean;
}

const DEFAULT_FLAGS: FeatureFlags = {
  enableWishlist: true,
  enableBiometricAuth: true,
  enableDarkModeToggle: true,
  enablePushNotifications: false,
};

const FLAGS_KEY = 'feature_flags';

/**
 * In production this would fetch from a remote config service
 * (Firebase Remote Config / LaunchDarkly). Falls back to sane
 * defaults and caches the last-known-good config for offline use.
 */
export async function initFlags(): Promise<FeatureFlags> {
  try {
    const cached = mmkvStorage.getObject<FeatureFlags>(FLAGS_KEY);
    if (cached) return cached;

    mmkvStorage.setObject(FLAGS_KEY, DEFAULT_FLAGS);
    return DEFAULT_FLAGS;
  } catch (error) {
    logger.warn('Failed to load feature flags, using defaults', error);
    return DEFAULT_FLAGS;
  }
}

export function getFlags(): FeatureFlags {
  return mmkvStorage.getObject<FeatureFlags>(FLAGS_KEY) ?? DEFAULT_FLAGS;
}