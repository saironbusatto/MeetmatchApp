import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { ActivityIndicator, SafeAreaView, ScrollView, Share, Text, View } from "react-native";
import { AppHeader } from "~/components/ui/AppHeader";
import { PrimaryButton, SecondaryButton } from "~/components/ui/Button";
import { T } from "~/components/ui/tokens";
import { usePublicEvent, useRegisterPublicEvent, useUnregisterPublicEvent } from "~/lib/queries";
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
  const { mutateAsync: unregister, isPending: unregistering } = useUnregisterPublicEvent(id);
  const [myStatus, setMyStatus] = useState<{ registered: boolean; waitlisted: boolean; position?: number | null }>({ registered: false, waitlisted: false });
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
  const attendees = (data as any)?.attendees ?? [];
  const regCount: number = attendees.length ?? 0;
  const capacity: number = settings?.capacity ?? 0;
  const pct = capacity > 0 ? Math.min(100, Math.round((regCount / capacity) * 100)) : 0;
  const isFull = capacity > 0 && regCount >= capacity;
  const occColor = occupancyColor(pct);
  const isOwner = event?.ownerId === user?.id;
  const alreadyIn = myStatus.registered || myStatus.waitlisted ||
    attendees.some((a: any) => a.userId === user?.id);

  async function handleRegister() {
    setError(null);
    try {
      const res: any = await mutateAsync();
      const reg = res?.registration;
      setMyStatus({
        registered: reg?.status === "REGISTERED",
        waitlisted: reg?.status === "WAITLIST",
        position: reg?.position ?? null,
      });
    } catch (e: any) {
      setError(e?.message ?? "Erro ao se inscrever.");
    }
  }

  async function handleUnregister() {
    setError(null);
    try {
      await unregister();
      setMyStatus({ registered: false, waitlisted: false, position: null });
    } catch (e: any) {
      setError(e?.message ?? "Erro ao desistir.");
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
            <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 13, color: T.vermillion }}>⚠️ Lotado — mas tem fila de espera</Text>
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
        {alreadyIn ? (
          <View style={{ gap: 8 }}>
            <View style={{ backgroundColor: myStatus.waitlisted ? T.warnSoft : T.successSoft, borderRadius: 14, paddingVertical: 14, alignItems: "center", gap: 4 }}>
              {myStatus.waitlisted ? (
                <>
                  <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 16, color: "#9D6B0C" }}>
                    Você está na fila · {myStatus.position ?? "?"}ª posição
                  </Text>
                  <Text style={{ fontFamily: T.fontBody, fontSize: 13, color: "#7A5A10" }}>
                    Se alguém desistir, você entra automaticamente.
                  </Text>
                </>
              ) : (
                <>
                  <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 16, color: T.success }}>✓ Você está inscrito!</Text>
                  <Text style={{ fontFamily: T.fontBody, fontSize: 13, color: T.success }}>¡Vamos!</Text>
                </>
              )}
            </View>
            {!isOwner && myStatus.waitlisted && (
              <SecondaryButton full onPress={handleUnregister} disabled={unregistering}>
                {unregistering ? "Saindo da fila…" : "Sair da fila"}
              </SecondaryButton>
            )}
          </View>
        ) : (
          <PrimaryButton size="lg" onPress={handleRegister} disabled={isPending}>
            {isPending ? "Inscrevendo…" : isFull ? "Entrar na fila →" : "✓ Eu vou!"}
          </PrimaryButton>
        )}
        <SecondaryButton full onPress={handleShare}>
          Compartilhar
        </SecondaryButton>
      </View>
    </SafeAreaView>
  );
}
