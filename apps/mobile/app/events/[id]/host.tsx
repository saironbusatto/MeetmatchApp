import { Stack } from "expo-router";
import { SafeAreaView } from "react-native";
import { Text, View } from "~/components/Themed";

export default function HostPanel() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAF7" }}>
      <Stack.Screen options={{ title: "Painel do host", headerShown: true }} />
      <View className="flex-1 items-center justify-center px-6">
        <Text className="font-display text-2xl text-ink-900">
          [Painel do host]
        </Text>
        <Text className="mt-2 text-center font-body text-sm text-ink-500">
          Lista de inscritos, check-in e export CSV via share sheet.
          Implementado em Task #6 (mobile backlog).
        </Text>
      </View>
    </SafeAreaView>
  );
}
