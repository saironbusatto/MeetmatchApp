import { Link } from "expo-router";
import { Pressable, SafeAreaView, View, Text } from "react-native";
import { GhostButton, PrimaryButton } from "~/components/ui/Button";
import { T } from "~/components/ui/tokens";

export default function Onboarding() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.paper }}>
      <View style={{ flex: 1, paddingHorizontal: 28, paddingTop: 60, paddingBottom: 32, overflow: "hidden" }}>
        {/* Decorative circles */}
        <View style={{
          position: "absolute", top: -40, right: -40,
          width: 200, height: 200, borderRadius: 100,
          backgroundColor: T.vermillion,
        }} />
        <View style={{
          position: "absolute", top: 40, right: 30,
          width: 28, height: 28, borderRadius: 14,
          backgroundColor: T.spark,
          borderWidth: 2, borderColor: T.ink,
        }} />

        <Text style={{
          marginTop: 40,
          fontFamily: T.fontBodySemiBold,
          fontSize: 14, color: T.ink600,
          letterSpacing: 1, textTransform: "uppercase",
        }}>
          👋 Hey
        </Text>

        <Text style={{
          marginTop: 10,
          fontFamily: T.fontDisplay,
          fontSize: 56, lineHeight: 54,
          letterSpacing: -2, color: T.ink,
        }}>
          {"Let's find\na time\nthat works."}
        </Text>

        <Text style={{
          marginTop: 24,
          fontFamily: T.fontBody,
          fontSize: 17, lineHeight: 26,
          color: T.ink600,
        }}>
          You pick the people and a window. The AI does the math so nobody has to argue about Tuesday.
        </Text>

        <View style={{ flex: 1 }} />

        <View style={{ gap: 12 }}>
          <Link href="/(auth)/signup" asChild>
            <PrimaryButton size="lg">Get started — it's free</PrimaryButton>
          </Link>
          <Link href="/(auth)/login" asChild>
            <GhostButton>I already have an account</GhostButton>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
