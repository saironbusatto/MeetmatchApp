import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { ActivityIndicator, SafeAreaView, ScrollView, Share, Text, View } from "react-native";
import { AppHeader } from "~/components/ui/AppHeader";
import { PrimaryButton, SecondaryButton } from "~/components/ui/Button";
import { AvatarStack } from "~/components/ui/Avatar";
import { T } from "~/components/ui/tokens";
import { usePublicEvent, useRegisterPublicEvent } from "~/lib/queries";
import { useSession } from "~/lib/store";
import { useState } from "react";

function occupancyColor(pct: number) {
  if (pct < 50) return T.success;
  if (pct < 80) return T.warn;
  return T.vermillion;
}

export default function PublicEventDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const user = useSession((s) => s.user);
  const { data, isLoading } = usePublicEvent(id);
  const { mutateAsync, isPending } = useRegisterPublicEvent(id);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: T.paper, alignItems: "center", justifyContent: "center" }}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator color={T.vermillion} />
      </SafeAreaView>
    );
  }

  const event = (data as any)?.event;
  const settings = (data as any)?.settings;
  const regCount: number = (data as any)?.registrationCount ?? settings?.registrationCount ?? 0;
  const capacity: number = settings?.capacity ?? 0;
  const pct = capacity > 0 ? Math.min(100, Math.round((regCount / capacity) * 100)) : 0;
  const isFull = capacity > 0 && regCount >= capacity;
  const occColor = occupancyColor(pct);
  const isOwner = event?.ownerId === user?.id;

  async function handleRegister() {
    setError(null);
    try {
      await mutateAsync();
      setRegistered(true);
    } catch (e: any) {
      setError(e?.message ?? "Erro ao se inscrever.");
    }
  }

  async function handleShare() {
    await Share.share({
      message: `${event?.title ?? "Evento"} — farmei.app/public/${id}`,
      url: `https://farmei.app/public/${id}`,
    }).catch(() => undefined);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.paper }}>
      <Stack.Screen options={{ headerShown: false }} />
      <AppHeader onBack={() => router.back()} action={
        isOwner ? (
          <SecondaryButton onPress={() => router.push(`/events/${id}/host` as any)} size="sm" full={false}>
            Gerenciar
          </SecondaryButton>
        ) : undefined
      } />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32, gap: 16 }}>
        {/* Hero */}
        <View style={{ backgroundColor: T.white, borderWidth: 1, borderColor: T.ink100, borderRadius: 20, padding: 20, gap: 8 }}>
          {event?.locationText && (
            <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 11, color: T.vermillion, letterSpacing: 0.8, textTransform: "uppercase" }}>
              📍 {event.locationText}
            </Text>
          )}
          <Text style={{ fontFamily: T.fontDisplay, fontSize: 32, lineHeight: 34, letterSpacing: -0.8, color: T.ink }}>
            {event?.title ?? "Evento"}
          </Text>
          {settings?.eventDate && (
            <Text style={{ fontFamily: T.fontMonoBold, fontSize: 15, color: T.ink600 }}>
              {settings.eventDate}{settings.eventTime ? ` · ${settings.eventTime}` : ""}
            </Text>
          )}
        </View>

        {/* Occupancy */}
        <View style={{ backgroundColor: T.white, borderWidth: 1, borderColor: T.ink100, borderRadius: 16, padding: 18, gap: 10 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
            <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 11, color: T.ink500, letterSpacing: 0.6, textTransform: "uppercase" }}>
              Lotação
            </Text>
            <Text style={{ fontFamily: T.fontMonoBold, fontSize: 14, color: occColor }}>
              {pct}% · {regCount}/{capacity}
            </Text>
          </View>
          <View style={{ height: 8, backgroundColor: T.ink100, borderRadius: 4, overflow: "hidden" }}>
            <View style={{ height: "100%", width: `${pct}%`, backgroundColor: occColor }} />
          </View>
          {isFull ? (
            <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 13, color: T.vermillion }}>⚠️ Evento lotado</Text>
          ) : (
            <Text style={{ fontFamily: T.fontBody, fontSize: 13, color: T.ink600 }}>
              Ainda há {capacity - regCount} {capacity - regCount === 1 ? "vaga" : "vagas"}
            </Text>
          )}
        </View>

        {/* Description */}
        {event?.description && (
          <View style={{ backgroundColor: T.white, borderWidth: 1, borderColor: T.ink100, borderRadius: 16, padding: 18 }}>
            <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 11, color: T.ink500, letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 10 }}>
              Sobre
            </Text>
            <Text style={{ fontFamily: T.fontBody, fontSize: 14, color: T.ink700, lineHeight: 21 }}>
              {event.description}
            </Text>
          </View>
        )}

        {error && (
          <View style={{ backgroundColor: T.vermillionSoft, borderRadius: 10, padding: 12 }}>
            <Text style={{ fontFamily: T.fontBody, fontSize: 14, color: T.vermillion }}>{error}</Text>
          </View>
        )}
      </ScrollView>

      <View style={{ padding: 20, paddingBottom: 32, borderTopWidth: 1, borderTopColor: T.ink100, gap: 10 }}>
        {registered ? (
          <View style={{ backgroundColor: T.successSoft, borderRadius: 14, paddingVertical: 16, alignItems: "center", gap: 4 }}>
            <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 16, color: T.success }}>✓ Você está inscrito!</Text>
            <Text style={{ fontFamily: T.fontBody, fontSize: 13, color: T.success }}>¡Vamos!</Text>
          </View>
        ) : (
          <PrimaryButton size="lg" onPress={handleRegister} disabled={isPending || isFull}>
            {isPending ? "Inscrevendo…" : isFull ? "❌ Lotado" : "✓ Eu vou!"}
          </PrimaryButton>
        )}
        <SecondaryButton full onPress={handleShare}>
          Compartilhar
        </SecondaryButton>
      </View>
    </SafeAreaView>
  );
}
