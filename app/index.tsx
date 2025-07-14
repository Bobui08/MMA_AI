import { generateAPIUrl } from "@/utils/api";
import { useChat } from "@ai-sdk/react";
import { Link } from "expo-router";
import { fetch as expoFetch } from "expo/fetch";
import {
  Button,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
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
    }
  };

  if (error) {
    return (
      <SafeAreaView style={{ height: "100%", padding: 16 }}>
        <Text style={{ color: "red", fontSize: 16, fontWeight: "bold" }}>
          Connection Error:
        </Text>
        <Text style={{ marginTop: 8 }}>{error.message}</Text>
        <Text style={{ marginTop: 8, fontSize: 12, color: "gray" }}>
          Please check your network connection and try again.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ height: "100%" }}>
      <Link href="/ask" asChild>
        <Button title="Ask"></Button>
      </Link>
      <Link href="/images" asChild>
        <Button title="Images"></Button>
      </Link>
      <View
        style={{
          height: "95%",
          display: "flex",
          flexDirection: "column",
          paddingHorizontal: 8,
        }}
      >
        <ScrollView style={{ flex: 1 }}>
          {messages.map((m) => (
            <View key={m.id} style={{ marginVertical: 8 }}>
              <View>
                <Text
                  style={{
                    fontWeight: "bold",
                    color: m.role === "user" ? "#007AFF" : "#34C759",
                  }}
                >
                  {m.role === "user" ? "You" : "AI"}
                </Text>
                <Text style={{ marginTop: 4 }}>{m.content}</Text>
              </View>
            </View>
          ))}
          {isGenerating && (
            <View style={{ marginVertical: 8 }}>
              <Text style={{ fontStyle: "italic", color: "#666" }}>
                AI is typing...
              </Text>
            </View>
          )}
        </ScrollView>

        <View style={{ marginTop: 8 }}>
          <TextInput
            style={{
              backgroundColor: "white",
              padding: 12,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#ddd",
            }}
            placeholder="Type your message..."
            value={input}
            onChangeText={(text) => {
              const event = {
                target: { value: text },
                nativeEvent: { text },
              };
              handleInputChange(event as any);
            }}
            onSubmitEditing={handleSendMessage}
            editable={!isGenerating}
            autoFocus={true}
            returnKeyType="send"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
