import { styles } from "@/styles/index";
import { generateAPIUrl } from "@/utils/api";
import { useChat } from "@ai-sdk/react";
import { Link } from "expo-router";
import { fetch as expoFetch } from "expo/fetch";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function App() {
  const {
    messages,
    error,
    handleInputChange,
    input,
    handleSubmit,
    isLoading: isGenerating,
  } = useChat({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: generateAPIUrl("/api/chat"),
  });

  const handleSendMessage = () => {
    if (!isGenerating && input.trim()) {
      const event = {
        preventDefault: () => {},
        target: { value: input },
      };
      handleSubmit(event as any);
      const clearEvent = {
        target: { value: "" },
        nativeEvent: { text: "" },
      };
      handleInputChange(clearEvent as any);
    }
  };

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Connection Error:</Text>
        <Text style={styles.errorMessage}>{error.message}</Text>
        <Text style={styles.errorHint}>
          Please check your network connection and try again.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Link href="/ask" asChild>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerButtonText}>ASK</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/images" asChild>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerButtonText}>IMAGES</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Chat container */}
      <View style={styles.chatContainer}>
        {/* Messages area */}
        <ScrollView
          style={styles.messagesContainer}
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((m) => (
            <View key={m.id} style={styles.messageWrapper}>
              <View
                style={[
                  styles.messageContainer,
                  m.role === "user" ? styles.userMessage : styles.aiMessage,
                ]}
              >
                <Text
                  style={[
                    styles.messageHeader,
                    m.role === "user"
                      ? styles.userMessageHeader
                      : styles.aiMessageHeader,
                  ]}
                >
                  {m.role === "user" ? "You" : "AI"}
                </Text>
                <Text
                  style={[
                    styles.messageText,
                    m.role === "user"
                      ? styles.userMessageText
                      : styles.aiMessageText,
                  ]}
                >
                  {m.content}
                </Text>
              </View>
            </View>
          ))}
          {isGenerating && (
            <View style={styles.typingIndicator}>
              <Text style={styles.typingText}>AI is typing...</Text>
            </View>
          )}
        </ScrollView>

        {/* Input area  */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Type your message..."
              value={input}
              onChangeText={(text) => {
                const event = {
                  target: { value: text },
                  nativeEvent: { text },
                };
                handleInputChange(event as any);
              }}
              editable={!isGenerating}
              multiline={true}
              textAlignVertical="top"
              placeholderTextColor="#8e8e93"
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!input.trim() || isGenerating) && styles.sendButtonDisabled,
              ]}
              onPress={handleSendMessage}
              disabled={!input.trim() || isGenerating}
            >
              <Text style={styles.sendButtonText}>➤</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
