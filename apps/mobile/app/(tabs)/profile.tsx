import { Pressable, SafeAreaView } from "react-native";
import { StampCard } from "~/components/StampCard";
import { Text, View } from "~/components/Themed";
import { getSupabase } from "~/lib/auth";
import { useSession } from "~/lib/store";

export default function Profile() {
  const user = useSession((s) => s.user);

  async function handleLogout() {
    await getSupabase().auth.signOut();
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAF7" }}>
      <View className="flex-1 px-6 pt-12">
        <Text className="font-display text-[34px] leading-tight text-ink-900">
          Perfil
        </Text>
        <Text className="mt-1 font-body text-base text-ink-500">
          {user?.email ?? ""}
        </Text>

        <View className="mt-8">
          <StampCard>
            <Text className="font-body text-[11px] uppercase tracking-wider text-ink-500">
              Conta
            </Text>
            <Text className="mt-2 font-display text-xl text-ink-900">
              {user?.name ?? "—"}
            </Text>
          </StampCard>
        </View>

        <Pressable
          onPress={handleLogout}
          className="mt-auto items-center rounded-full border-2 border-ink-900 bg-ink-0 py-4"
        >
          <Text className="font-body text-base font-semibold text-ink-900">
            Sair
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
