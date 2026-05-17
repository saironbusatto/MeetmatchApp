import { Stack } from "expo-router";
import { SafeAreaView } from "react-native";
import { Text, View } from "~/components/Themed";

export default function NewPublic() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAF7" }}>
      <Stack.Screen options={{ title: "Novo evento público", headerShown: true }} />
      <View className="flex-1 items-center justify-center px-6">
        <Text className="font-display text-2xl text-ink-900">
          [Form de evento público]
        </Text>
        <Text className="mt-2 text-center font-body text-sm text-ink-500">
          Nome · local · categoria · data e hora · lotação · descrição.
          Implementado em Task #6 (mobile backlog).
        </Text>
      </View>
    </SafeAreaView>
  );
}
