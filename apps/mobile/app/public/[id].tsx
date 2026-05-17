import { Stack, useLocalSearchParams } from "expo-router";
import { Pressable, SafeAreaView, ScrollView, View as RNView } from "react-native";
import { StampCard } from "~/components/StampCard";
import { Text, View } from "~/components/Themed";

export default function PublicDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const filled = 8;
  const capacity = 12;
  const ratio = filled / capacity;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAF7" }}>
      <Stack.Screen options={{ title: "Evento público", headerShown: true }} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 48 }}>
        <StampCard>
          <Text className="font-body text-[11px] uppercase tracking-wider text-ink-500">
            📍 Quadra Arena 5
          </Text>
          <Text className="mt-2 font-display text-[28px] leading-tight text-ink-900">
            Futebol na quadra de salão
          </Text>
          <Text className="mt-2 font-mono text-sm text-ink-700">
            Sex · Jun 07 · 20:00
          </Text>
        </StampCard>

        <View className="mt-6">
          <Text className="font-body text-[11px] uppercase tracking-wider text-ink-500">
            Lotação
          </Text>
          <View className="mt-2 flex-row items-center gap-3">
            <RNView style={{ flex: 1, height: 8, backgroundColor: "#E8E6E0", borderRadius: 4, overflow: "hidden" }}>
              <RNView
                style={{
                  width: `${Math.min(ratio * 100, 100)}%`,
                  height: "100%",
                  backgroundColor: ratio >= 0.8 ? "#FF3B2E" : ratio >= 0.5 ? "#E89E18" : "#2EA862"
                }}
              />
            </RNView>
            <Text className="font-mono text-xs text-ink-700">{filled}/{capacity}</Text>
          </View>
          <Text className="mt-2 font-body text-sm text-ink-500">
            Ainda há {capacity - filled} lugares
          </Text>
        </View>

        <View className="mt-8">
          <Pressable
            className="items-center rounded-full border-2 border-ink-900 bg-vermillion-500 py-4"
            style={{
              shadowColor: "#0A0A0A",
              shadowOffset: { width: 3, height: 3 },
              shadowOpacity: 1,
              shadowRadius: 0
            }}
          >
            <Text className="font-body text-base font-semibold text-ink-0">
              ✓ Eu vou!
            </Text>
          </Pressable>
        </View>

        <Text className="mt-6 text-center font-body text-xs text-ink-400">
          (Placeholder · id {id} — Task #6 mobile backlog)
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
