import { styles } from "@/styles/ask";
import { useCompletion } from "@ai-sdk/react";
import { useRouter } from "expo-router";
import { fetch as expoFetch } from "expo/fetch";
import React from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { generateAPIUrl } from "../utils/api";

export default function AskPage() {
  const router = useRouter();

  const {
    completion,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
  } = useCompletion({
    api: generateAPIUrl("/api/completion"),
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    onError: (error) => {
      console.error("Completion error:", error);
      Alert.alert("Error", "Failed to get AI response");
    },
    streamProtocol: "text",
  });

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (!input.trim()) {
      Alert.alert("Error", "Please enter a question");
      return;
    }
    handleSubmit(e);
    // Clear input after submitting
    const clearEvent = {
      target: { value: "" },
    };
    handleInputChange(clearEvent as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Ask AI</Text>
          <Text style={styles.subtitle}>What would you like to know?</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type your question here..."
            placeholderTextColor="#999"
            value={input}
            onChangeText={(text) =>
              handleInputChange({ target: { value: text } } as any)
            }
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {completion && (
          <View style={styles.responseContainer}>
            <Text style={styles.responseTitle}>AI Response:</Text>
            <ScrollView style={styles.responseScrollView}>
              <Text style={styles.responseText}>{completion}</Text>
            </ScrollView>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!input.trim() || isLoading) && styles.submitButtonDisabled,
            ]}
            onPress={onSubmit}
            disabled={!input.trim() || isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? "Getting AI Response..." : "Ask AI"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
