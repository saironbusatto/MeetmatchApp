import { Stack } from "expo-router";
import { SafeAreaView } from "react-native";
import { Text, View } from "~/components/Themed";

export default function NewPrivate() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAF7" }}>
      <Stack.Screen options={{ title: "Novo evento privado", headerShown: true }} />
      <View className="flex-1 items-center justify-center px-6">
        <Text className="font-display text-2xl text-ink-900">
          [Form de evento privado]
        </Text>
        <Text className="mt-2 text-center font-body text-sm text-ink-500">
          Título · key person · janela de datas · duração. Implementado em
          Task #5 (mobile backlog).
        </Text>
      </View>
    </SafeAreaView>
  );
}
