import { Link } from "expo-router";
import { Pressable, SafeAreaView, ScrollView } from "react-native";
import { EmptyState } from "~/components/StateCard";
import { StampCard } from "~/components/StampCard";
import { Text, View } from "~/components/Themed";
import { useSession } from "~/lib/store";

export default function PrivateHome() {
  const user = useSession((s) => s.user);
  const firstName = user?.name?.split(" ")[0] ?? "amigo";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAF7" }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 96 }}>
        <Text className="font-body text-sm text-ink-500">Buenas, {firstName}</Text>
        <Text className="mt-1 font-display text-[40px] leading-[1.1] text-ink-900">
          Your events
        </Text>

        <View className="mt-6 flex-row gap-2">
          {["Upcoming", "Waiting", "Past", "All"].map((label, i) => (
            <Pressable
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

        <View className="mt-8 gap-4">
          <StampCard>
            <Text className="font-mono text-[11px] uppercase tracking-wider text-ink-500">
              Ter · Jun 04 · 14:00
            </Text>
            <Text className="mt-2 font-display text-2xl text-ink-900">
              Q3 planning lunch
            </Text>
            <View className="mt-3 self-start rounded-full bg-success-100 px-2 py-1">
              <Text className="font-body text-[11px] font-semibold text-success-500">
                locked in
              </Text>
            </View>
          </StampCard>

          <StampCard>
            <Text className="font-mono text-[11px] uppercase tracking-wider text-ink-500">
              Aguardando 3/6 respostas
            </Text>
            <Text className="mt-2 font-display text-2xl text-ink-900">
              Aniversário do Diego
            </Text>
            <View className="mt-3 self-start rounded-full bg-warn-100 px-2 py-1">
              <Text className="font-body text-[11px] font-semibold text-warn-500">
                waiting
              </Text>
            </View>
          </StampCard>
        </View>
        <View className="mt-4">
          <EmptyState
            title="Sem novos conflitos por aqui"
            description="Quando alguém mudar a disponibilidade, você vê os alertas nesta seção."
          />
        </View>
      </ScrollView>

      <Link href="/events/new" asChild>
        <Pressable
          accessibilityLabel="Criar novo evento"
          className="absolute bottom-24 right-6 h-14 w-14 items-center justify-center rounded-full bg-ink-900"
          style={{
            shadowColor: "#0A0A0A",
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 0
          }}
        >
          <Text className="font-display text-2xl text-ink-0">+</Text>
        </Pressable>
      </Link>
    </SafeAreaView>
  );
}
