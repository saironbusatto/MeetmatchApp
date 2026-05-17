import { Link } from "expo-router";
import { Pressable, SafeAreaView } from "react-native";
import { registerDeviceForPush } from "~/lib/push";
import { Text, View } from "~/components/Themed";

export default function Onboarding() {
  async function enableNotifications() {
    await registerDeviceForPush().catch(() => undefined);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAF7" }}>
      <View className="flex-1 justify-between px-8 py-12">
        <View className="h-40 w-40 self-end rounded-full bg-vermillion-500" />

        <View>
          <Text className="font-display text-[56px] leading-[1.05] text-ink-900">
            Let's find a time that works.
          </Text>
          <Text className="mt-6 font-body text-base text-ink-500">
            You pick the people and a window. The AI does the math so nobody has
            to argue about Tuesday.
          </Text>
        </View>

        <View className="gap-3">
          <Link href="/(auth)/signup" asChild>
            <Pressable
              accessibilityLabel="Criar conta no Farmei"
              className="items-center rounded-full border-2 border-ink-900 bg-vermillion-500 py-4"
              style={{
                shadowColor: "#0A0A0A",
                shadowOffset: { width: 3, height: 3 },
                shadowOpacity: 1,
                shadowRadius: 0
              }}
            >
              <Text className="font-body text-base font-semibold text-ink-0">
                Get started — it's free
              </Text>
            </Pressable>
          </Link>
          <Link href="/(auth)/login" asChild>
            <Pressable accessibilityLabel="Entrar com conta existente" className="items-center py-3">
              <Text className="font-body text-base text-ink-500">
                I already have an account
              </Text>
            </Pressable>
          </Link>
          <Pressable accessibilityLabel="Ativar notificações" onPress={enableNotifications} className="items-center py-2">
            <Text className="font-body text-sm text-ink-400">Enable notifications</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
