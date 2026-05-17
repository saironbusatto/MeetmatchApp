import { Link } from "expo-router";
import { Pressable, SafeAreaView, ScrollView, View as RNView } from "react-native";
import { StampCard } from "~/components/StampCard";
import { Text, View } from "~/components/Themed";

const mockEvents = [
  { id: "1", title: "Futebol na quadra de salão", when: "Sex · Jun 07 · 20:00", filled: 8, capacity: 12, category: "Sports" },
  { id: "2", title: "Volley de praia", when: "Sáb · Jun 08 · 16:00", filled: 6, capacity: 10, category: "Sports" },
  { id: "3", title: "Show de Rock — Caverna Pub", when: "Sex · Jun 14 · 22:00", filled: 24, capacity: 80, category: "Music" }
];

function fillColor(ratio: number) {
  if (ratio >= 0.8) return "#FF3B2E";
  if (ratio >= 0.5) return "#E89E18";
  return "#2EA862";
}

export default function PublicFeed() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAF7" }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 96 }}>
        <Text className="font-body text-sm text-ink-500">O que está rolando</Text>
        <Text className="mt-1 font-display text-[38px] leading-[1.1] text-ink-900">
          Perto de você
        </Text>

        <View className="mt-6 flex-row gap-2">
          {["All", "Sports", "Music", "Social", "Food"].map((label, i) => (
            <Pressable
              accessibilityLabel={`Filtrar por ${label}`}
              key={label}
              className={
                i === 0
                  ? "rounded-full bg-ink-900 px-4 py-2"
                  : "rounded-full border border-ink-100 bg-ink-0 px-4 py-2"
              }
            >
              <Text
                className={
                  i === 0
                    ? "font-body text-xs text-ink-0"
                    : "font-body text-xs text-ink-700"
                }
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View className="mt-6 gap-4">
          {mockEvents.map((e) => {
            const ratio = e.filled / e.capacity;
            return (
              <Link key={e.id} href={`/public/${e.id}`} asChild>
                <Pressable>
                  <StampCard>
                    <Text className="font-mono text-[11px] uppercase tracking-wider text-ink-500">
                      {e.when}
                    </Text>
                    <Text className="mt-2 font-display text-2xl text-ink-900">
                      {e.title}
                    </Text>
                    <View className="mt-3 flex-row items-center gap-3">
                      <RNView
                        style={{
                          flex: 1,
                          height: 6,
                          backgroundColor: "#E8E6E0",
                          borderRadius: 3,
                          overflow: "hidden"
                        }}
                      >
                        <RNView
                          style={{
                            width: `${Math.min(ratio * 100, 100)}%`,
                            height: "100%",
                            backgroundColor: fillColor(ratio)
                          }}
                        />
                      </RNView>
                      <Text className="font-mono text-xs text-ink-700">
                        {e.filled}/{e.capacity}
                      </Text>
                    </View>
                  </StampCard>
                </Pressable>
              </Link>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
