import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  // Header styles
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: "#f8f9fa",
  },

  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    marginRight: 12,
  },

  greetingContainer: {
    flex: 1,
  },

  greetingText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },

  nameText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },

  menuButton: {
    padding: 8,
  },

  menuIcon: {
    fontSize: 20,
    color: "#333",
  },

  // Main content styles
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
  },

  titleText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
    textAlign: "left",
  },

  searchContainer: {
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 30,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  searchIcon: {
    fontSize: 18,
    color: "#999",
    marginRight: 12,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },

  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },

  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  cardIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  askIcon: {
    backgroundColor: "#E8F4FD",
  },

  imageIcon: {
    backgroundColor: "#FFF0F5",
  },

  chatIcon: {
    backgroundColor: "#E8F8F5",
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },

  cardSubtitle: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
  },

  // Bottom section styles
  bottomSection: {
    backgroundColor: "#1C1C1E",
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 25,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },

  startChatIconButton: {
    backgroundColor: "#00D4AA",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#00D4AA",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },

  startChatIconText: {
    fontSize: 24,
  },

  startNewChatTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
  },

  startChatButton: {
    backgroundColor: "#00D4AA",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    width: "100%",
    alignItems: "center",
    shadowColor: "#00D4AA",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  startChatButtonText: {
    color: "#1C1C1E",
    fontSize: 16,
    fontWeight: "600",
  },
});
