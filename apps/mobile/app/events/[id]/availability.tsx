import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { AppHeader } from "~/components/ui/AppHeader";
import { AIButton } from "~/components/ui/Button";
import { Sparkle } from "~/components/ui/Sparkle";
import { T } from "~/components/ui/tokens";
import { useSubmitAvailability, usePrivateEvent, useAvailability } from "~/lib/queries";
import { useSession } from "~/lib/store";
import { daysInWindow, SLOTS } from "~/lib/dates";
import { AvailabilityChoice } from "@farmei/types";
import type { TimeSlot } from "@farmei/types";

type Choice = 0 | 1 | 2 | 3; // 0=unset, 1=yes, 2=maybe, 3=no

const CHOICE_STYLE: Record<Choice, { bg: string; fg: string; border: string; label: string }> = {
  0: { bg: T.white,     fg: T.ink500,    border: T.ink100,    label: "·" },
  1: { bg: T.success,   fg: T.white,     border: T.success,   label: "✓" },
  2: { bg: T.warnSoft,  fg: "#9D6B0C",   border: "#F5C66B",   label: "~" },
  3: { bg: T.ink,       fg: T.white,     border: T.ink,       label: "✕" },
};

const RESPONSE_MAP: Record<Choice, AvailabilityChoice | null> = {
  0: null, 1: AvailabilityChoice.YES, 2: AvailabilityChoice.MAYBE, 3: AvailabilityChoice.NO,
};

const SHORT_SLOT: Record<TimeSlot, string> = {
  MANHA: "Manhã",
  TARDE: "Tarde",
  NOITE: "Noite",
  ALTAS_HORAS: "Alta",
};

function cellKey(date: string, slot: TimeSlot) {
  return `${date}|${slot}`;
}

export default function AvailabilityScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const user = useSession((s) => s.user);
  const { data } = usePrivateEvent(id);
  const { data: availData } = useAvailability(id);
  const settings = (data as any)?.settings;
  const participants = (data as any)?.participants ?? [];
  const event = (data as any)?.event;
  const days = settings?.dateWindowStart
    ? daysInWindow(settings.dateWindowStart, settings.dateWindowEnd)
    : [];

  const [state, setState] = useState<Record<string, Choice>>({});
  const hydrated = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync, isPending } = useSubmitAvailability(id);

  useEffect(() => {
    if (hydrated.current || !availData || !user?.id) return;
    const mine = participants.find((p: any) => p.userId === user.id);
    if (!mine) return;
    const rows = (availData as any).availability ?? [];
    const next: Record<string, Choice> = {};
    for (const row of rows) {
      if (row.participantId !== mine.id) continue;
      const choice = row.response === "YES" ? 1 : row.response === "MAYBE" ? 2 : 3;
      next[cellKey(row.date, row.slot)] = choice;
    }
    hydrated.current = true;
    setState(next);
  }, [availData, user?.id, participants.length]);

  const cycle = (date: string, slot: TimeSlot) =>
    setState((s) => ({ ...s, [cellKey(date, slot)]: (((s[cellKey(date, slot)] ?? 0) + 1) % 4) as Choice }));

  const answered = Object.values(state).filter((v) => v !== 0).length;

  async function handleSubmit() {
    const responses = Object.entries(state)
      .filter(([, v]) => v !== 0)
      .map(([key, v]) => {
        const [date, slot] = key.split("|");
        return { date, slot: slot as TimeSlot, response: RESPONSE_MAP[v as Choice]! };
      });
    if (responses.length === 0) { setError("Marca pelo menos um dia e turno."); return; }
    setError(null);
    try {
      await mutateAsync({ responses });
      if (event?.ownerId && event.ownerId === user?.id) {
        router.replace(`/events/${id}/result` as any);
      } else {
        router.replace(`/events/${id}` as any);
      }
    } catch (e: any) {
      setError(e?.message ?? "Erro ao enviar.");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.paper }}>
      <Stack.Screen options={{ headerShown: false }} />
      <AppHeader title="Minha disponibilidade" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <Text style={{ fontFamily: T.fontBody, fontSize: 14, color: T.ink600, lineHeight: 21 }}>
          Toca pra ciclar:{" "}
          <Text style={{ color: T.success, fontFamily: T.fontBodySemiBold }}>✓ sim</Text>{"  "}
          <Text style={{ color: "#9D6B0C", fontFamily: T.fontBodySemiBold }}>~ talvez</Text>{"  "}
          <Text style={{ color: T.ink, fontFamily: T.fontBodySemiBold }}>✕ não</Text>
          {"  "}— pode marcar manhã E noite do mesmo dia.
        </Text>

        {/* Day × turno grid */}
        <View style={{ backgroundColor: T.white, borderWidth: 1, borderColor: T.ink100, borderRadius: 20, padding: 12 }}>
          {settings?.dateWindowStart && (
            <Text style={{ fontFamily: T.fontMonoBold, fontSize: 11, color: T.ink500, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 10 }}>
              {settings.dateWindowStart} — {settings.dateWindowEnd}
            </Text>
          )}

          {/* Header: turnos */}
          <View style={{ flexDirection: "row", marginBottom: 8 }}>
            <View style={{ width: 44 }} />
            {SLOTS.map((slot) => (
              <Text
                key={slot}
                style={{ flex: 1, textAlign: "center", fontFamily: T.fontBodySemiBold, fontSize: 10, color: T.ink500, letterSpacing: 0.4, textTransform: "uppercase" }}
              >
                {SHORT_SLOT[slot]}
              </Text>
            ))}
          </View>

          {/* Linhas: dias */}
          {days.map((day) => (
            <View key={day.date} style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
              <View style={{ width: 44, alignItems: "center" }}>
                <Text style={{ fontFamily: T.fontBody, fontSize: 10, color: T.ink500 }}>{day.weekday}</Text>
                <Text style={{ fontFamily: T.fontMonoBold, fontSize: 14, color: T.ink, lineHeight: 16 }}>{day.dayNumber}</Text>
              </View>
              {SLOTS.map((slot) => {
                const choice = (state[cellKey(day.date, slot)] ?? 0) as Choice;
                const st = CHOICE_STYLE[choice];
                return (
                  <Pressable
                    key={slot}
                    onPress={() => cycle(day.date, slot)}
                    style={{ flex: 1, marginHorizontal: 2, aspectRatio: 1.15, backgroundColor: st.bg, borderWidth: 1.5, borderColor: st.border, borderRadius: 10, alignItems: "center", justifyContent: "center" }}
                  >
                    <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 13, color: st.fg }}>{st.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>

        {/* Progress banner */}
        {answered > 0 && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: T.spark, borderWidth: 2, borderColor: T.ink, borderRadius: 16, padding: 14 }}>
            <Sparkle size={20} color={T.ink} />
            <Text style={{ flex: 1, fontFamily: T.fontBodyMedium, fontSize: 13, color: T.ink, lineHeight: 19 }}>
              {answered} {answered === 1 ? "turno marcado" : "turnos marcados"}. Submete quando terminar.
            </Text>
          </View>
        )}

        {error && (
          <View style={{ backgroundColor: T.vermillionSoft, borderRadius: 10, padding: 12 }}>
            <Text style={{ fontFamily: T.fontBody, fontSize: 14, color: T.vermillion }}>{error}</Text>
          </View>
        )}
      </ScrollView>

      <View style={{ padding: 20, paddingBottom: 32, borderTopWidth: 1, borderTopColor: T.ink100 }}>
        <AIButton onPress={handleSubmit} disabled={isPending}>
          {isPending ? "Enviando…" : "Submeter e deixar a IA escolher"}
        </AIButton>
      </View>
    </SafeAreaView>
  );
}