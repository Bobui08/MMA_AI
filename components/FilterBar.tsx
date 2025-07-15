import DateTimePicker from "@react-native-community/datetimepicker";
import React, { memo, useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface FilterBarProps {
  keyword: string;
  dateFrom: string;
  dateTo: string;
  selectedMood: string;
  uniqueMoods: string[];
  onDateFromChange: (date: string) => void;
  onDateToChange: (date: string) => void;
  onMoodChange: (mood: string) => void;
  onClearFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = memo(
  ({
    keyword,
    dateFrom,
    dateTo,
    selectedMood,
    uniqueMoods,
    onDateFromChange,
    onDateToChange,
    onMoodChange,
    onClearFilters,
  }) => {
    const [showMoodPicker, setShowMoodPicker] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState<"from" | "to" | null>(
      null
    );

    const formatDateForDisplay = (dateString: string) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    };

    // Convert string dates to Date objects for DateTimePicker
    const getDateFromString = (dateString: string): Date => {
      return dateString ? new Date(dateString) : new Date();
    };

    const handleDateChange = (_event: any, selectedDate?: Date) => {
      const currentType = showDatePicker;
      setShowDatePicker(Platform.OS === "ios" ? currentType : null);

      if (selectedDate && currentType) {
        const dateString = selectedDate.toISOString().split("T")[0];
        if (currentType === "from") {
          onDateFromChange(dateString);
        } else {
          onDateToChange(dateString);
        }
      }
    };

    const hasActiveFilters = keyword || dateFrom || dateTo || selectedMood;

    return (
      <View style={styles.container}>
        {/* Filter Row */}
        <View style={styles.filterRow}>
          {/* Date From */}
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowDatePicker("from")}
          >
            <Text style={styles.filterButtonText}>
              {dateFrom ? formatDateForDisplay(dateFrom) : "From"}
            </Text>
          </TouchableOpacity>

          {/* Date To */}
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowDatePicker("to")}
          >
            <Text style={styles.filterButtonText}>
              {dateTo ? formatDateForDisplay(dateTo) : "To"}
            </Text>
          </TouchableOpacity>

          {/* Mood Filter */}
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedMood && styles.filterButtonActive,
            ]}
            onPress={() => setShowMoodPicker(true)}
          >
            <Text style={styles.filterButtonText}>
              {selectedMood || "Mood"}
            </Text>
          </TouchableOpacity>

          {/* Clear Filters */}
          {!!hasActiveFilters && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={onClearFilters}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* DateTimePicker */}
        {showDatePicker && (
          <DateTimePicker
            value={getDateFromString(
              showDatePicker === "from" ? dateFrom : dateTo
            )}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        {/* Mood Picker Modal */}
        <Modal
          visible={showMoodPicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowMoodPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Mood</Text>
              <ScrollView style={styles.moodGrid}>
                <View style={styles.moodRow}>
                  {uniqueMoods.map((mood) => (
                    <TouchableOpacity
                      key={mood}
                      style={[
                        styles.moodOption,
                        selectedMood === mood && styles.moodOptionSelected,
                      ]}
                      onPress={() => {
                        onMoodChange(mood);
                        setShowMoodPicker(false);
                      }}
                    >
                      <Text style={styles.moodEmoji}>{mood}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowMoodPicker(false)}
              >
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison to prevent unnecessary re-renders
    return (
      prevProps.keyword === nextProps.keyword &&
      prevProps.dateFrom === nextProps.dateFrom &&
      prevProps.dateTo === nextProps.dateTo &&
      prevProps.selectedMood === nextProps.selectedMood &&
      JSON.stringify(prevProps.uniqueMoods) ===
        JSON.stringify(nextProps.uniqueMoods)
    );
  }
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  filterButton: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    minWidth: 60,
  },
  filterButtonActive: {
    backgroundColor: "#007AFF",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  clearButton: {
    backgroundColor: "#ff4444",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  clearButtonText: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  moodGrid: {
    maxHeight: 200,
  },
  moodRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  moodOption: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    margin: 4,
  },
  moodOptionSelected: {
    backgroundColor: "#007AFF",
  },
  moodEmoji: {
    fontSize: 24,
  },
  modalCloseButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalCloseText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
