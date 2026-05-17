import { Stack } from "expo-router";
import { SafeAreaView } from "react-native";
import { Text, View } from "~/components/Themed";

export default function Confirmed() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAF7" }}>
      <Stack.Screen options={{ title: "Confirmado", headerShown: true }} />
      <View className="flex-1 px-6 pt-12">
        <Text className="font-body text-sm text-success-500">🎉 Locked in</Text>
        <Text className="mt-2 font-display text-[42px] leading-tight text-ink-900">
          Q3 planning lunch
        </Text>
        <Text className="mt-2 font-mono text-lg text-ink-900">
          Ter · Jun 04 · 14:00
        </Text>
        <Text className="mt-2 font-body text-base text-ink-500">
          In 14 days · ¡vamos!
        </Text>
      </View>
    </SafeAreaView>
  );
}
