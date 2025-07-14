import { Link } from "expo-router";
import { SafeAreaView, Text, TouchableOpacity } from "react-native";

export default function App() {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Home page</Text>
      <Link href="/toolAI" asChild>
        <TouchableOpacity>
          <Text style={{ fontSize: 18, color: "blue", marginTop: 10 }}>
            Go to AI tools
          </Text>
        </TouchableOpacity>
      </Link>
    </SafeAreaView>
  );
}
