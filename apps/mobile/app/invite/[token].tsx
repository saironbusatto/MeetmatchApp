import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, SafeAreaView } from "react-native";
import { StampCard } from "~/components/StampCard";
import { Text, View } from "~/components/Themed";
import { createApiClient } from "~/lib/api";
import { rememberInviteToken } from "~/lib/auth";

export default function Invite() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    if (token) rememberInviteToken(token).catch(() => undefined);
  }, [token]);

  async function handleAccept() {
    if (!token) return;
    setAccepting(true);
    setError(null);
    try {
      const api = createApiClient();
      const result = await api.invites.accept(token);
      router.replace(`/events/${result.eventId}/availability`);
    } catch (err: unknown) {
      setError((err as Error).message ?? "Não conseguimos abrir esse convite.");
    } finally {
      setAccepting(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAF7" }}>
      <Stack.Screen options={{ title: "Convite", headerShown: true }} />
      <View className="flex-1 px-6 pt-8">
        <StampCard>
          <Text className="font-body text-[11px] uppercase tracking-wider text-ink-500">
            convite recebido
          </Text>
          <Text className="mt-2 font-display text-2xl text-ink-900">
            Te chamaram pra um Farmei
          </Text>
          <Text className="mt-2 font-body text-sm text-ink-500">
            Toca abaixo para aceitar e marcar quando você pode.
          </Text>
        </StampCard>

        {error ? (
          <Text className="mt-4 font-body text-sm text-vermillion-500">{error}</Text>
        ) : null}

        <Pressable
          disabled={accepting}
          onPress={handleAccept}
          className="mt-8 items-center rounded-full border-2 border-ink-900 bg-vermillion-500 py-4"
          style={{
            shadowColor: "#0A0A0A",
            shadowOffset: { width: 3, height: 3 },
            shadowOpacity: 1,
            shadowRadius: 0,
            opacity: accepting ? 0.7 : 1
          }}
        >
          <Text className="font-body text-base font-semibold text-ink-0">
            {accepting ? "Abrindo…" : "Aceitar convite"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
