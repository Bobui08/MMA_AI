import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  // Header styles
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  headerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#007AFF",
    borderRadius: 20,
    minWidth: 80,
  },

  headerButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 14,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },

  // Chat container styles
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  // Messages styles
  messagesContainer: {
    flex: 1,
    paddingBottom: 8,
  },

  messageWrapper: {
    marginVertical: 6,
  },

  messageContainer: {
    maxWidth: "85%",
    padding: 12,
    borderRadius: 16,
    marginVertical: 2,
  },

  userMessage: {
    backgroundColor: "#007AFF",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },

  aiMessage: {
    backgroundColor: "#f1f3f4",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },

  messageHeader: {
    fontWeight: "600",
    fontSize: 12,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  userMessageHeader: {
    color: "#ffffff",
    opacity: 0.8,
  },

  aiMessageHeader: {
    color: "#34C759",
  },

  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },

  userMessageText: {
    color: "#ffffff",
  },

  aiMessageText: {
    color: "#1d1d1f",
  },

  typingIndicator: {
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f1f3f4",
    borderRadius: 16,
    alignSelf: "flex-start",
    maxWidth: "70%",
  },

  typingText: {
    fontStyle: "italic",
    color: "#8e8e93",
    fontSize: 14,
  },

  // Input area styles
  inputContainer: {
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 4,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#f8f9fa",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#e9ecef",
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 48,
  },

  textInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
    color: "#1d1d1f",
    maxHeight: 120,
    paddingVertical: 8,
    paddingRight: 12,
  },

  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  sendButtonDisabled: {
    backgroundColor: "#c7c7cc",
  },

  sendButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },

  // Error styles
  errorContainer: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },

  errorTitle: {
    color: "#ff3b30",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },

  errorMessage: {
    fontSize: 16,
    color: "#1d1d1f",
    marginBottom: 8,
    lineHeight: 22,
  },

  errorHint: {
    fontSize: 14,
    color: "#8e8e93",
    lineHeight: 20,
  },
});
