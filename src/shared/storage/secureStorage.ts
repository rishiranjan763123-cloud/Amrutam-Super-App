import * as Keychain from 'react-native-keychain';

export const secureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    await Keychain.setGenericPassword(key, value, { service: key });
  },

  async getItem(key: string): Promise<string | null> {
    try {
      const result = await Keychain.getGenericPassword({ service: key });
      if (result && result.password) {
        return result.password;
      }
      return null;
    } catch {
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    await Keychain.resetGenericPassword({ service: key });
  },
};