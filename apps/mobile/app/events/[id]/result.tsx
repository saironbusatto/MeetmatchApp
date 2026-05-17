import { Stack } from "expo-router";
import { SafeAreaView, ScrollView } from "react-native";
import { StampCard } from "~/components/StampCard";
import { Text, View } from "~/components/Themed";

export default function Result() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAF7" }}>
      <Stack.Screen options={{ title: "Sugestão", headerShown: true }} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 48 }}>
        <StampCard variant="ai">
          <Text className="font-body text-[11px] uppercase tracking-wider text-ink-900">
            ✦ Farmei AI · best fit
          </Text>
          <Text className="mt-3 font-display text-[44px] leading-[1] text-ink-900">
            Tuesday / Jun 4
          </Text>
          <Text className="mt-2 font-mono text-base text-ink-900">
            14:00 — 15:30
          </Text>
          <View className="mt-4 border-t border-dashed border-ink-900 pt-4">
            <Text className="font-body text-sm text-ink-900">
              5 of 6 in · Diego (key) ✓ · confidence 0.92
            </Text>
          </View>
        </StampCard>

        <View className="mt-6">
          <StampCard>
            <Text className="font-body text-[11px] uppercase tracking-wider text-ink-500">
              Why this date?
            </Text>
            <Text className="mt-2 font-body text-base text-ink-700">
              It's the earliest day inside your window where Diego is free, and
              only Felipe can't make it.
            </Text>
          </StampCard>
        </View>

        <View className="mt-4">
          <StampCard variant="conflict">
            <Text className="font-body text-sm text-vermillion-700">
              Heads up — Felipe can't make Tuesday. Tap to see alternatives.
            </Text>
          </StampCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
