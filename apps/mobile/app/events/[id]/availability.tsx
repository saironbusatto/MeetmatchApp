import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { AppHeader } from "~/components/ui/AppHeader";
import { AIButton } from "~/components/ui/Button";
import { Sparkle } from "~/components/ui/Sparkle";
import { T } from "~/components/ui/tokens";
import { useSubmitAvailability, usePrivateEvent } from "~/lib/queries";

type Choice = 0 | 1 | 2 | 3; // 0=unset, 1=yes, 2=maybe, 3=no

const CHOICE_STYLE: Record<Choice, { bg: string; fg: string; border: string; label: string }> = {
  0: { bg: T.white,     fg: T.ink500,    border: T.ink100,    label: "·" },
  1: { bg: T.success,   fg: T.white,     border: T.success,   label: "✓" },
  2: { bg: T.warnSoft,  fg: "#9D6B0C",   border: "#F5C66B",   label: "~" },
  3: { bg: T.ink,       fg: T.white,     border: T.ink,       label: "✕" },
};

const RESPONSE_MAP: Record<Choice, "YES" | "MAYBE" | "NO" | null> = {
  0: null, 1: "YES", 2: "MAYBE", 3: "NO",
};

function daysInWindow(start: string, end: string): Array<{ date: string; d: string; n: number }> {
  const days = [];
  const cur = new Date(start);
  const last = new Date(end);
  const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  while (cur <= last && days.length < 28) {
    days.push({ date: cur.toISOString().split("T")[0], d: DAYS[cur.getDay()], n: cur.getDate() });
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

export default function AvailabilityScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data } = usePrivateEvent(id);
  const settings = (data as any)?.settings;
  const days = settings?.dateWindowStart
    ? daysInWindow(settings.dateWindowStart, settings.dateWindowEnd)
    : [];

  const [state, setState] = useState<Record<string, Choice>>({});
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync, isPending } = useSubmitAvailability(id);

  const cycle = (date: string) =>
    setState((s) => ({ ...s, [date]: (((s[date] ?? 0) + 1) % 4) as Choice }));

  const answered = Object.values(state).filter((v) => v !== 0).length;

  async function handleSubmit() {
    const responses = Object.entries(state)
      .filter(([, v]) => v !== 0)
      .map(([date, v]) => ({ date, response: RESPONSE_MAP[v as Choice]! }));
    if (responses.length === 0) { setError("Marca pelo menos um dia."); return; }
    setError(null);
    try {
      await mutateAsync(responses);
      router.replace(`/events/${id}/result` as any);
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
        </Text>

        {/* Calendar grid */}
        <View style={{ backgroundColor: T.white, borderWidth: 1, borderColor: T.ink100, borderRadius: 20, padding: 14 }}>
          {settings?.dateWindowStart && (
            <Text style={{ fontFamily: T.fontMonoBold, fontSize: 11, color: T.ink500, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 12 }}>
              {settings.dateWindowStart} — {settings.dateWindowEnd}
            </Text>
          )}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {days.map((day) => {
              const choice = (state[day.date] ?? 0) as Choice;
              const st = CHOICE_STYLE[choice];
              return (
                <Pressable
                  key={day.date}
                  onPress={() => cycle(day.date)}
                  style={{ width: "22%", backgroundColor: st.bg, borderWidth: 1.5, borderColor: st.border, borderRadius: 14, paddingVertical: 10, alignItems: "center", gap: 2 }}
                >
                  <Text style={{ fontFamily: T.fontBody, fontSize: 11, color: st.fg, opacity: 0.85 }}>{day.d}</Text>
                  <Text style={{ fontFamily: T.fontMonoBold, fontSize: 18, color: st.fg, lineHeight: 22 }}>{day.n}</Text>
                  <Text style={{ fontSize: 12, fontFamily: T.fontBodySemiBold, color: st.fg, marginTop: 2 }}>{st.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Progress banner */}
        {answered > 0 && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: T.spark, borderWidth: 2, borderColor: T.ink, borderRadius: 16, padding: 14 }}>
            <Sparkle size={20} color={T.ink} />
            <Text style={{ flex: 1, fontFamily: T.fontBodyMedium, fontSize: 13, color: T.ink, lineHeight: 19 }}>
              {answered} de {days.length} dias marcados. Submete quando terminar.
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
