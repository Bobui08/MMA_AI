import AsyncStorage from '@react-native-async-storage/async-storage';
import { MoodEntry } from '../types';

const STORAGE_KEYS = {
  MOOD_ENTRIES: 'mood_entries',
  HIGHLIGHTS: 'mood_highlights',
};

export const storageService = {
  // Save mood entries to AsyncStorage
  async saveMoodEntries(entries: MoodEntry[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.MOOD_ENTRIES, JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving mood entries:', error);
    }
  },

  // Load mood entries from AsyncStorage
  async loadMoodEntries(): Promise<MoodEntry[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.MOOD_ENTRIES);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading mood entries:', error);
      return [];
    }
  },

  // Save highlights to AsyncStorage
  async saveHighlights(highlights: { [key: number]: boolean }): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(highlights));
    } catch (error) {
      console.error('Error saving highlights:', error);
    }
  },

  // Load highlights from AsyncStorage
  async loadHighlights(): Promise<{ [key: number]: boolean }> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.HIGHLIGHTS);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error loading highlights:', error);
      return {};
    }
  },

  // Clear all stored data
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.MOOD_ENTRIES, STORAGE_KEYS.HIGHLIGHTS]);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};
