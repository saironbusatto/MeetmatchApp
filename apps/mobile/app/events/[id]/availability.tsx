import { Stack, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native";
import { Text, View } from "~/components/Themed";

export default function Availability() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAF7" }}>
      <Stack.Screen options={{ title: "Disponibilidade", headerShown: true }} />
      <View className="flex-1 items-center justify-center px-6">
        <Text className="font-display text-2xl text-ink-900">
          [Grid de disponibilidade · {id}]
        </Text>
        <Text className="mt-2 text-center font-body text-sm text-ink-500">
          Yes / Maybe / No. Banner spark de progresso. AIButton "Submit & let AI pick".
        </Text>
      </View>
    </SafeAreaView>
  );
}
