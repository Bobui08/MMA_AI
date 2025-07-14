import { styles } from "@/styles/index";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Link } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.avatar} />
            <View style={styles.greetingContainer}>
              <Text style={styles.greetingText}>Good Morning 👋</Text>
              <Text style={styles.nameText}>Quoc Khang</Text>
            </View>
            <TouchableOpacity style={styles.menuButton}>
              <Text style={styles.menuIcon}>☰</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main content */}
        <View style={styles.mainContent}>
          <Text style={styles.titleText}>How can i help{"\n"}you today?</Text>

          {/* Cards */}
          <View style={styles.cardsContainer}>
            <Link href="/ask" asChild>
              <TouchableOpacity style={styles.card}>
                <View style={[styles.cardIcon, styles.askIcon]}>
                  <Ionicons name="mic" size={28} color="#007AFF" />
                </View>
                <Text style={styles.cardTitle}>Speedy AI Question</Text>
                <Text style={styles.cardSubtitle}>
                  Ask and get instant AI answers
                </Text>
              </TouchableOpacity>
            </Link>

            <Link href="/images" asChild>
              <TouchableOpacity style={styles.card}>
                <View style={[styles.cardIcon, styles.imageIcon]}>
                  <MaterialIcons name="image" size={28} color="#FF6B9D" />
                </View>
                <Text style={styles.cardTitle}>Generate Image AI</Text>
                <Text style={styles.cardSubtitle}>
                  Create amazing{"\n"}artwork
                </Text>
              </TouchableOpacity>
            </Link>
          </View>

          {/* Cards Row 2 */}
          <View style={styles.cardsContainer}>
            <Link href="/chat" asChild>
              <TouchableOpacity style={styles.card}>
                <View style={[styles.cardIcon, styles.chatIcon]}>
                  <Ionicons
                    name="chatbubble-ellipses"
                    size={28}
                    color="#34C759"
                  />
                </View>
                <Text style={styles.cardTitle}>Chat AI Bot</Text>
                <Text style={styles.cardSubtitle}>
                  Smart conversation{"\n"}assistant
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Bottom section */}
        <View style={styles.bottomSection}>
          <TouchableOpacity style={styles.startChatIconButton}>
            <Text style={styles.startChatIconText}>
              <MaterialCommunityIcons
                name="chat-plus-outline"
                size={32}
                color="white"
              />
            </Text>
          </TouchableOpacity>
          <Text style={styles.startNewChatTitle}>Start New chat</Text>
          <Link href="/chat" asChild>
            <TouchableOpacity style={styles.startChatButton}>
              <Text style={styles.startChatButtonText}>Start New chat</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
