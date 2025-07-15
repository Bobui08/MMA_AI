import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';
import { MoodEntry } from '../types';

// Base selectors
const selectMoodEntries = (state: RootState) => state.mood.entries;
const selectFilters = (state: RootState) => state.mood.filters;

// Memoized selector for filtered entries
export const selectFilteredEntries = createSelector(
  [selectMoodEntries, selectFilters],
  (entries, filters) => {
    let filteredEntries = [...entries];

    // Filter by keyword (search in text and date)
    if (filters.keyword.trim()) {
      const keyword = filters.keyword.toLowerCase();
      filteredEntries = filteredEntries.filter(entry =>
        entry.text.toLowerCase().includes(keyword) ||
        entry.date.includes(keyword)
      );
    }

    // Filter by date range
    if (filters.dateFrom) {
      filteredEntries = filteredEntries.filter(entry =>
        entry.date >= filters.dateFrom
      );
    }

    if (filters.dateTo) {
      filteredEntries = filteredEntries.filter(entry =>
        entry.date <= filters.dateTo
      );
    }

    // Filter by mood
    if (filters.selectedMood) {
      filteredEntries = filteredEntries.filter(entry =>
        entry.mood === filters.selectedMood
      );
    }

    return filteredEntries;
  }
);

// Selector for mood statistics
export const selectMoodStats = createSelector(
  [selectFilteredEntries],
  (entries) => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Get entries from this week
    const thisWeekEntries = entries.filter(entry => 
      new Date(entry.date) >= oneWeekAgo
    );

    // Most common mood this week
    const moodCounts: { [key: string]: number } = {};
    thisWeekEntries.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });

    const mostCommonMood = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b, '😊'
    );

    // Calculate streak (consecutive days with entries)
    const sortedEntries = [...entries].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    let currentDate = today;

    for (const entry of sortedEntries) {
      if (entry.date === currentDate) {
        streak++;
        const date = new Date(currentDate);
        date.setDate(date.getDate() - 1);
        currentDate = date.toISOString().split('T')[0];
      } else {
        break;
      }
    }

    // Count highlighted entries
    const highlightedCount = entries.filter(entry => entry.highlighted).length;

    return {
      mostCommonMood,
      streak,
      highlightedCount,
      totalEntries: entries.length,
    };
  }
);

// Selector for unique moods (for filter dropdown)
export const selectUniqueMoods = createSelector(
  [selectMoodEntries],
  (entries) => {
    const moods = [...new Set(entries.map(entry => entry.mood))];
    return moods.sort();
  }
);
