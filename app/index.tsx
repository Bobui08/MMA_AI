import { Link } from "expo-router";
import React, { useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { FilterBar } from "../components/FilterBar";
import { MoodCard } from "../components/MoodCard";
import { SearchInput } from "../components/SearchInput";
import { SummaryHeader } from "../components/SummaryHeader";
import {
  clearFilters,
  fetchMoodEntries,
  loadPersistedData,
  setDateFromFilter,
  setDateToFilter,
  setKeywordFilter,
  setMoodFilter,
  toggleHighlight,
} from "../redux/moodSlice";
import {
  selectFilteredEntries,
  selectMoodStats,
  selectUniqueMoods,
} from "../redux/selectors";
import { AppDispatch, RootState } from "../redux/store";
import { homeStyles } from "../styles/home";
import { MoodEntry } from "../types";

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, filters } = useSelector(
    (state: RootState) => state.mood
  );
  const filteredEntries = useSelector(selectFilteredEntries);
  const moodStats = useSelector(selectMoodStats);
  const uniqueMoods = useSelector(selectUniqueMoods);

  useEffect(() => {
    // Load persisted data first, then fetch from API
    dispatch(loadPersistedData()).then(() => {
      dispatch(fetchMoodEntries());
    });
  }, [dispatch]);

  const handleToggleHighlight = useCallback(
    (id: number) => {
      dispatch(toggleHighlight(id));
    },
    [dispatch]
  );

  const renderMoodEntry = useCallback(
    ({ item }: { item: MoodEntry }) => (
      <MoodCard entry={item} onToggleHighlight={handleToggleHighlight} />
    ),
    [handleToggleHighlight]
  );

  // Memoized filter handlers
  const handleKeywordChange = useCallback(
    (keyword: string) => {
      dispatch(setKeywordFilter(keyword));
    },
    [dispatch]
  );

  const handleDateFromChange = useCallback(
    (date: string) => {
      dispatch(setDateFromFilter(date));
    },
    [dispatch]
  );

  const handleDateToChange = useCallback(
    (date: string) => {
      dispatch(setDateToFilter(date));
    },
    [dispatch]
  );

  const handleMoodChange = useCallback(
    (mood: string) => {
      dispatch(setMoodFilter(mood));
    },
    [dispatch]
  );

  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  const renderHeader = () => (
    <>
      <SummaryHeader
        mostCommonMood={moodStats.mostCommonMood}
        streak={moodStats.streak}
        highlightedCount={moodStats.highlightedCount}
        totalEntries={moodStats.totalEntries}
      />
      <SearchInput
        keyword={filters.keyword}
        onKeywordChange={handleKeywordChange}
      />
      <FilterBar
        keyword={filters.keyword}
        dateFrom={filters.dateFrom}
        dateTo={filters.dateTo}
        selectedMood={filters.selectedMood}
        uniqueMoods={uniqueMoods}
        onDateFromChange={handleDateFromChange}
        onDateToChange={handleDateToChange}
        onMoodChange={handleMoodChange}
        onClearFilters={handleClearFilters}
      />
    </>
  );

  if (loading) {
    return (
      <SafeAreaView style={homeStyles.container}>
        <View style={homeStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={homeStyles.loadingText}>
            Loading your mood entries...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={homeStyles.container}>
        <View style={homeStyles.errorContainer}>
          <Text style={homeStyles.errorText}>Error: {error}</Text>
          <TouchableOpacity
            style={homeStyles.retryButton}
            onPress={() => dispatch(fetchMoodEntries())}
          >
            <Text style={homeStyles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderEmptyState = () => (
    <View style={homeStyles.emptyState}>
      <Text style={homeStyles.emptyStateEmoji}>📝</Text>
      <Text style={homeStyles.emptyStateTitle}>No mood entries yet</Text>
      <Text style={homeStyles.emptyStateText}>
        Start your wellness journey by adding your first mood entry!
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={homeStyles.container}>
      <FlatList
        data={filteredEntries}
        renderItem={renderMoodEntry}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={homeStyles.listContent}
      />

      {/* AI Tools Button */}
      <Link href="/toolAI" asChild>
        <TouchableOpacity style={homeStyles.aiToolsButton}>
          <Text style={homeStyles.aiToolsIcon}>🤖</Text>
          <Text style={homeStyles.aiToolsButtonText}>AI Tools</Text>
        </TouchableOpacity>
      </Link>

      {/* Add New Entry Button */}
      <Link href="/add-mood" asChild>
        <TouchableOpacity style={homeStyles.addButton}>
          <Text style={homeStyles.addButtonText}>➕</Text>
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}
