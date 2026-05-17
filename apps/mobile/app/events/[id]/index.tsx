import { Stack, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native";
import { StampCard } from "~/components/StampCard";
import { Text, View } from "~/components/Themed";

export default function EventDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAF7" }}>
      <Stack.Screen options={{ title: "Evento", headerShown: true }} />
      <View className="flex-1 px-6 pt-6">
        <StampCard>
          <Text className="font-body text-[11px] uppercase tracking-wider text-ink-500">
            placeholder
          </Text>
          <Text className="mt-2 font-display text-2xl text-ink-900">
            Evento {id}
          </Text>
          <Text className="mt-2 font-body text-sm text-ink-500">
            Conteúdo real entra na Task #5 (mobile backlog).
          </Text>
        </StampCard>
      </View>
    </SafeAreaView>
  );
}
