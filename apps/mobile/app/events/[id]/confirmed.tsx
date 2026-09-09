import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { AppHeader } from "~/components/ui/AppHeader";
import { SecondaryButton } from "~/components/ui/Button";
import { Avatar } from "~/components/ui/Avatar";
import { T } from "~/components/ui/tokens";
import { usePrivateEvent, useDiaDoBolo } from "~/lib/queries";
import { formatLongDate, SLOT_LABELS } from "~/lib/dates";

function remainingWindow(endsAt?: string | null): number {
  if (!endsAt) return 0;
  return Math.max(0, new Date(endsAt).getTime() - Date.now());
}

function useCountdown(target: number) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (target <= 0) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [target]);
  return Math.max(0, target - now);
}

function fmtClock(ms: number) {
  const s = Math.floor(ms / 1000);
  const h = String(Math.floor(s / 3600)).padStart(2, "0");
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return `${h}:${m}:${sec}`;
}

export default function ConfirmedScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading } = usePrivateEvent(id);
  const { mutateAsync: leave, isPending: leaving } = useDiaDoBolo(id);
  const [hop, setHop] = useState(false);

  const event = (data as any)?.event;
  const participants = (data as any)?.participants ?? [];
  const endsAt = event?.confirmationWindowEndsAt ?? null;
  const countdown = useCountdown(remainingWindow(endsAt));
  const windowOpen = countdown > 0;

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: T.paper, alignItems: "center", justifyContent: "center" }}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator color={T.vermillion} />
      </SafeAreaView>
    );
  }

  async function handleLeave() {
    try {
      const res = await leave("leave");
      setHop(Boolean(res.rematched));
    } catch {
      // janela fechada ou participante não autorizado
    }
  }

  const noDate = event?.status === "NO_DATE";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.paper }}>
      <Stack.Screen options={{ headerShown: false }} />
      <AppHeader onBack={() => router.push("/(tabs)" as any)} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}>
        {noDate ? (
          <>
            <View style={{ paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6, backgroundColor: T.warnSoft, alignSelf: "flex-start", marginBottom: 14 }}>
              <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.6, color: "#9D6B0C" }}>sem data ainda</Text>
            </View>
            <Text style={{ fontFamily: T.fontDisplay, fontSize: 36, lineHeight: 40, letterSpacing: -1.2, color: T.ink }}>{event?.title ?? "Sem data"}</Text>
            <Text style={{ fontFamily: T.fontBody, fontSize: 15, color: T.ink600, lineHeight: 22, marginTop: 14 }}>
              Alguém desmarcou o dia e as respostas mudaram. Bora todo mundo marcar de novo e a IA reinventa um par?
            </Text>
          </>
        ) : (
          <>
            <View style={{ paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6, backgroundColor: T.successSoft, alignSelf: "flex-start", marginBottom: 14 }}>
              <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.6, color: T.success }}>🎉 taca o bolo</Text>
            </View>

            {hop && (
              <View style={{ backgroundColor: T.spark, borderWidth: 2, borderColor: T.ink, borderRadius: 14, padding: 14, marginBottom: 14 }}>
                <Text style={{ fontFamily: T.fontBodyMedium, fontSize: 13, color: T.ink, lineHeight: 19 }}>
                  Tu desmarcou, mas o par ficou de pé com quem sobrou. 🎉
                </Text>
              </View>
            )}

            <Text style={{ fontFamily: T.fontDisplay, fontSize: 40, lineHeight: 40, letterSpacing: -1.2, color: T.ink }}>{event?.title ?? "Evento confirmado"}</Text>
            {event?.confirmedDate && (
              <Text style={{ fontFamily: T.fontMonoBold, fontSize: 16, color: T.vermillion, marginTop: 14 }}>
                {formatLongDate(event.confirmedDate)}
                {event?.confirmedSlot ? ` · ${SLOT_LABELS[event.confirmedSlot as keyof typeof SLOT_LABELS]}` : ""}
              </Text>
            )}

            {windowOpen ? (
              <Text style={{ fontFamily: T.fontBody, fontSize: 13, color: T.ink500, marginTop: 8 }}>
                Janela de 24h pra desmarcar sem drama — fecha em <Text style={{ fontFamily: T.fontMonoBold, color: T.ink }}>{fmtClock(countdown)}</Text>
              </Text>
            ) : (
              <Text style={{ fontFamily: T.fontBody, fontSize: 13, color: T.ink400, marginTop: 8 }}>
                Janela de 24h fechada — o par é oficial.
              </Text>
            )}

            <Text style={{ fontFamily: T.fontBody, fontSize: 14, color: T.ink500, marginTop: 6 }}>¡Vamos!</Text>
          </>
        )}

        <View style={{ marginTop: 22, backgroundColor: T.white, borderWidth: 1, borderColor: T.ink100, borderRadius: 18, padding: 16 }}>
          <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 11, color: T.ink500, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 14 }}>Participantes</Text>
          <View style={{ gap: 12 }}>
            {participants.map((p: any, i: number) => (
              <View key={p.id} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Avatar name={p.nameSnapshot ?? p.email ?? "?"} size={32} colorIdx={i} isKey={p.role === "KEY_PERSON"} />
                <Text style={{ flex: 1, fontFamily: T.fontBodyMedium, fontSize: 14, color: T.ink }}>{p.nameSnapshot ?? p.email ?? "Convidado"}</Text>
                {noDate ? (
                  <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: T.ink100, alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontSize: 13, color: T.ink500 }}>…</Text>
                  </View>
                ) : (
                  <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: T.success, alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontSize: 13, color: T.white }}>✓</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {noDate && (
          <Pressable
            onPress={() => router.push(`/events/${id}/availability` as any)}
            style={{ marginTop: 18, paddingVertical: 14, borderRadius: 16, backgroundColor: T.ink, alignItems: "center" }}
          >
            <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 15, color: T.white }}>Re-marcar minha disponibilidade</Text>
          </Pressable>
        )}
      </ScrollView>

      <View style={{ padding: 20, paddingBottom: 32, borderTopWidth: 1, borderTopColor: T.ink100, gap: 10 }}>
        {!noDate && windowOpen && (
          <SecondaryButton full onPress={handleLeave} disabled={leaving}>
            {leaving ? "Desmarcando…" : "Não vou mais!"}
          </SecondaryButton>
        )}
        <SecondaryButton full onPress={() => router.push("/(tabs)" as any)}>Voltar aos eventos</SecondaryButton>
      </View>
    </SafeAreaView>
  );
}