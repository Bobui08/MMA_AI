import { styles } from "@/styles/images";
import { useCompletion } from "@ai-sdk/react";
import { useRouter } from "expo-router";
import { fetch as expoFetch } from "expo/fetch";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { generateAPIUrl } from "../utils/api";

export default function ImagesPage() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [revisedPrompt, setRevisedPrompt] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const generateImage = async (prompt: string) => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setImageUrl(null);
    setRevisedPrompt(null);

    try {
      const response = await expoFetch(generateAPIUrl("/api/generate-image"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate image");
      }

      // Check if response is JSON or data URI
      const contentType = response.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        // Handle JSON response (URL format)
        const result = await response.json();
        if (result.url) {
          setImageUrl(result.url);
          setRevisedPrompt(result.revised_prompt || null);
        } else if (result.error) {
          setError(result.error);
        }
      } else {
        // Handle data URI response
        const dataUri = await response.text();
        if (dataUri.startsWith("data:")) {
          setImageUrl(dataUri);
          setRevisedPrompt(null);
        } else {
          throw new Error("Invalid response format");
        }
      }
    } catch (e) {
      console.error("Failed to generate image:", e);
      setError(e instanceof Error ? e.message : "Failed to generate image");
    } finally {
      setIsLoading(false);
    }
  };

  const { input, handleInputChange } = useCompletion({
    api: generateAPIUrl("/api/completion"), // Dummy API, we won't use this
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    onError: (error) => {
      console.error("Image generation error:", error);
      setError("Failed to generate image");
      setImageUrl(null);
      Alert.alert("Error", "Failed to generate image");
    },
  });

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (!input.trim()) {
      Alert.alert("Error", "Please enter a description for the image");
      return;
    }
    generateImage(input);
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
          <Text style={styles.title}>AI Image Generator</Text>
          <Text style={styles.subtitle}>
            Describe the image you want to create
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Describe the image you want to generate..."
            placeholderTextColor="#999"
            value={input}
            onChangeText={(text) =>
              handleInputChange({ target: { value: text } } as any)
            }
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.imageContainer}>
          {isLoading ? (
            <Text style={styles.loadingText}>Generating image...</Text>
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : imageUrl ? (
            <>
              <Image source={{ uri: imageUrl }} style={styles.generatedImage} />
              {revisedPrompt && (
                <Text style={styles.revisedPromptText}>
                  AI refined your prompt: "{revisedPrompt}"
                </Text>
              )}
            </>
          ) : (
            <Text style={styles.placeholderText}>
              Generated image will appear here
            </Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.generateButton,
              (!input.trim() || isLoading) && styles.generateButtonDisabled,
            ]}
            onPress={onSubmit}
            disabled={!input.trim() || isLoading}
          >
            <Text style={styles.generateButtonText}>
              {isLoading ? "Generating..." : "Generate Image"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
