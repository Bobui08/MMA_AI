import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { moodIcons } from "../constants/moodIcons";
import { addMoodEntryToAPI } from "../redux/moodSlice";
import { AppDispatch, RootState } from "../redux/store";
import { addMoodStyles } from "../styles/addMood";

export default function AddMoodScreen() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.mood);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedMood, setSelectedMood] = useState("");
  const [description, setDescription] = useState("");

  const handleDateChange = (_event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (date) {
      setSelectedDate(date);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSave = () => {
    // Validation
    if (!selectedMood.trim()) {
      Alert.alert("Validation Error", "Please select a mood");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Validation Error", "Please enter a description");
      return;
    }

    // Create new mood entry
    const newEntry = {
      date: selectedDate.toISOString().split("T")[0],
      mood: selectedMood,
      text: description.trim(),
      highlighted: false,
    };

    // Dispatch API call to add mood entry
    dispatch(addMoodEntryToAPI(newEntry))
      .unwrap()
      .then(() => {
        // Navigate back to home on success
        router.back();
      })
      .catch((error) => {
        Alert.alert("Error", "Failed to save mood entry. Please try again.");
        console.error("Failed to add mood entry:", error);
      });
  };

  const renderMoodSelector = () => (
    <View style={addMoodStyles.section}>
      <Text style={addMoodStyles.sectionTitle}>How are you feeling?</Text>
      <View style={addMoodStyles.moodGrid}>
        {moodIcons.map((mood) => (
          <TouchableOpacity
            key={mood}
            style={[
              addMoodStyles.moodOption,
              selectedMood === mood && addMoodStyles.moodOptionSelected,
            ]}
            onPress={() => setSelectedMood(mood)}
          >
            <Text style={addMoodStyles.moodEmoji}>{mood}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={addMoodStyles.validationHint}>
        Select an emoji that represents your current mood
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={addMoodStyles.container}>
      <ScrollView
        style={addMoodStyles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={addMoodStyles.header}>
          {/* <TouchableOpacity onPress={() => router.back()}>
            <Text style={addMoodStyles.backButton}>← Back</Text>
          </TouchableOpacity> */}
          <Text style={addMoodStyles.title}>New Mood Entry</Text>
          <View style={addMoodStyles.placeholder} />
        </View>

        {/* Date Picker */}
        <View style={addMoodStyles.section}>
          <Text style={addMoodStyles.sectionTitle}>Date</Text>
          <TouchableOpacity
            style={addMoodStyles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={addMoodStyles.dateButtonText}>
              {formatDate(selectedDate)}
            </Text>
            <Text style={addMoodStyles.dateButtonIcon}>📅</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}

          <Text style={addMoodStyles.validationHint}>
            Select the date for this mood entry
          </Text>
        </View>

        {/* Mood Selector */}
        {renderMoodSelector()}

        {/* Description Input */}
        <View style={addMoodStyles.section}>
          <Text style={addMoodStyles.sectionTitle}>How was your day?</Text>
          <TextInput
            style={addMoodStyles.descriptionInput}
            value={description}
            onChangeText={setDescription}
            placeholder="Tell us about your day, your thoughts, feelings..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
          <Text style={addMoodStyles.validationHint}>
            Share your thoughts, experiences, or anything on your mind
          </Text>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[
            addMoodStyles.saveButton,
            loading && addMoodStyles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={addMoodStyles.saveButtonText}>
            {loading ? "Saving..." : "Save Entry"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
