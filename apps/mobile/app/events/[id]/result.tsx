import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { ActivityIndicator, SafeAreaView, ScrollView, Text, View } from "react-native";
import { AppHeader } from "~/components/ui/AppHeader";
import { PrimaryButton } from "~/components/ui/Button";
import { AvatarStack } from "~/components/ui/Avatar";
import { Sparkle } from "~/components/ui/Sparkle";
import { T } from "~/components/ui/tokens";
import { usePrivateEventSuggestion, useConfirmEvent, usePrivateEvent } from "~/lib/queries";

export default function ResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: eventData } = usePrivateEvent(id);
  const { data, isLoading, error } = usePrivateEventSuggestion(id, true);
  const { mutateAsync, isPending } = useConfirmEvent(id);
  const participants = (eventData as any)?.participants ?? [];

  async function handleConfirm() {
    if (!data?.date) return;
    await mutateAsync(data.date);
    router.replace(`/events/${id}/confirmed` as any);
  }

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: T.paper, alignItems: "center", justifyContent: "center" }}>
        <Stack.Screen options={{ headerShown: false }} />
        <Sparkle size={32} color={T.ink} />
        <Text style={{ fontFamily: T.fontBodyMedium, fontSize: 15, color: T.ink, marginTop: 16 }}>A IA está calculando…</Text>
      </SafeAreaView>
    );
  }

  if (error || !data) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: T.paper }}>
        <Stack.Screen options={{ headerShown: false }} />
        <AppHeader title="Resultado" onBack={() => router.back()} />
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 32, gap: 12 }}>
          <Text style={{ fontFamily: T.fontDisplay, fontSize: 22, color: T.ink, textAlign: "center" }}>Sem sugestão ainda</Text>
          <Text style={{ fontFamily: T.fontBody, fontSize: 15, color: T.ink500, textAlign: "center" }}>
            Precisa de pelo menos uma resposta de disponibilidade.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const confidence = Math.round((data.confidence ?? 0) * 100);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.paper }}>
      <Stack.Screen options={{ headerShown: false }} />
      <AppHeader title="Pick da IA" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <View style={{ backgroundColor: T.spark, borderWidth: 2, borderColor: T.ink, borderRadius: 24, padding: 22, ...T.stampAi }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <Sparkle size={14} color={T.ink} />
            <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 11, color: T.ink, letterSpacing: 1, textTransform: "uppercase" }}>
              Farmei AI · melhor data
            </Text>
          </View>
          <Text style={{ fontFamily: T.fontDisplay, fontSize: 44, lineHeight: 44, letterSpacing: -1.5, color: T.ink }}>{data.date}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 14, marginTop: 14, paddingTop: 14, borderTopWidth: 1.5, borderTopColor: T.ink }}>
            <AvatarStack people={participants.slice(0, 5).map((p: any, i: number) => ({ name: p.nameSnapshot ?? p.email ?? "?", colorIdx: i }))} size={30} max={5} />
            <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 14, color: T.ink }}>confiança {confidence}%</Text>
          </View>
        </View>
        {data.reasoning ? (
          <View style={{ backgroundColor: T.white, borderWidth: 1, borderColor: T.ink100, borderRadius: 16, padding: 16 }}>
            <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 11, color: T.ink500, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 8 }}>Por que essa data?</Text>
            <Text style={{ fontFamily: T.fontBody, fontSize: 14, color: T.ink700, lineHeight: 21 }}>{data.reasoning}</Text>
          </View>
        ) : null}
      </ScrollView>
      <View style={{ padding: 20, paddingBottom: 32, borderTopWidth: 1, borderTopColor: T.ink100 }}>
        <PrimaryButton size="lg" onPress={handleConfirm} disabled={isPending}>
          {isPending ? "Confirmando…" : `Confirmar ${data.date} ✓`}
        </PrimaryButton>
      </View>
    </SafeAreaView>
  );
}
