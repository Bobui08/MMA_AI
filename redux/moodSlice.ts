import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MoodEntry, MoodState } from "../types";
import { storageService } from "../utils/storage";

// Async thunk for loading persisted data
export const loadPersistedData = createAsyncThunk(
  "mood/loadPersisted",
  async () => {
    const [storedEntries, storedHighlights] = await Promise.all([
      storageService.loadMoodEntries(),
      storageService.loadHighlights(),
    ]);

    // Apply highlights to stored entries
    const entriesWithHighlights = storedEntries.map((entry) => ({
      ...entry,
      highlighted: storedHighlights[entry.id] || entry.highlighted,
    }));

    return entriesWithHighlights;
  }
);

// Async thunk for fetching mood data from API
export const fetchMoodEntries = createAsyncThunk(
  "mood/fetchEntries",
  async () => {
    const response = await fetch(
      "https://687319aac75558e273535336.mockapi.io/api/moods"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch mood entries");
    }
    const data = await response.json();
    return data as MoodEntry[];
  }
);

// Async thunk for adding new mood entry to API
export const addMoodEntryToAPI = createAsyncThunk(
  "mood/addEntryToAPI",
  async (newEntry: Omit<MoodEntry, "id">) => {
    const response = await fetch(
      "https://687319aac75558e273535336.mockapi.io/api/moods",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEntry),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to add mood entry");
    }
    const data = await response.json();
    return data as MoodEntry;
  }
);

// Initial state
const initialState: MoodState = {
  entries: [],
  loading: false,
  error: null,
  filters: {
    keyword: "",
    dateFrom: "",
    dateTo: "",
    selectedMood: "",
  },
};

// Mood slice
const moodSlice = createSlice({
  name: "mood",
  initialState,
  reducers: {
    addMoodEntry: (state, action: PayloadAction<Omit<MoodEntry, "id">>) => {
      const newEntry: MoodEntry = {
        ...action.payload,
        id: Math.max(...state.entries.map((e) => e.id), 0) + 1,
      };
      state.entries.unshift(newEntry); // Add to beginning for newest first

      // Persist to storage
      storageService.saveMoodEntries(state.entries);
    },
    toggleHighlight: (state, action: PayloadAction<number>) => {
      const entry = state.entries.find((e) => e.id === action.payload);
      if (entry) {
        entry.highlighted = !entry.highlighted;

        // Persist highlights
        const highlights: { [key: number]: boolean } = {};
        state.entries.forEach((e) => {
          if (e.highlighted) {
            highlights[e.id] = true;
          }
        });
        storageService.saveHighlights(highlights);
      }
    },
    setKeywordFilter: (state, action: PayloadAction<string>) => {
      state.filters.keyword = action.payload;
    },
    setDateFromFilter: (state, action: PayloadAction<string>) => {
      state.filters.dateFrom = action.payload;
    },
    setDateToFilter: (state, action: PayloadAction<string>) => {
      state.filters.dateTo = action.payload;
    },
    setMoodFilter: (state, action: PayloadAction<string>) => {
      state.filters.selectedMood = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        keyword: "",
        dateFrom: "",
        dateTo: "",
        selectedMood: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadPersistedData.fulfilled, (state, action) => {
        if (action.payload.length > 0) {
          const sortedEntries = [...action.payload].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          state.entries = sortedEntries;
        }
      })
      .addCase(fetchMoodEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMoodEntries.fulfilled, (state, action) => {
        state.loading = false;
        const sortedEntries = [...action.payload].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        state.entries = sortedEntries;

        // Persist fetched data
        storageService.saveMoodEntries(sortedEntries);
      })
      .addCase(fetchMoodEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch mood entries";
      })
      .addCase(addMoodEntryToAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMoodEntryToAPI.fulfilled, (state, action) => {
        state.loading = false;
        // Add the new entry from API response to the beginning
        state.entries.unshift(action.payload);

        // Persist updated data
        storageService.saveMoodEntries(state.entries);
      })
      .addCase(addMoodEntryToAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add mood entry";
      });
  },
});

export const {
  addMoodEntry,
  toggleHighlight,
  setKeywordFilter,
  setDateFromFilter,
  setDateToFilter,
  setMoodFilter,
  clearFilters,
} = moodSlice.actions;

export default moodSlice.reducer;
