import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { ActivityIndicator, SafeAreaView, ScrollView, Text, View } from "react-native";
import { AppHeader } from "~/components/ui/AppHeader";
import { AIButton } from "~/components/ui/Button";
import { Sparkle } from "~/components/ui/Sparkle";
import { T } from "~/components/ui/tokens";
import { usePrivateEventSuggestion, useConfirmEvent } from "~/lib/queries";
import { formatLongDate, formatSlot } from "~/lib/dates";
import type { SlotSuggestion } from "@farmei/types";

function pct(n: number) {
  return `${Math.round((n ?? 0) * 100)}%`;
}

function GateCard({ suggestion }: { suggestion: SlotSuggestion }) {
  const lines = [
    `${suggestion.yesCount} ${suggestion.yesCount === 1 ? "pessoa marcou" : "pessoas marcaram"} "sim"${
      suggestion.quorumMet ? " — quórum atingido ✓" : " — quórum ainda não foi atingido"
    }`,
    `Pessoa-chave: ${
      suggestion.keyPersonState === "YES" ? "já marcou ✓" :
      suggestion.keyPersonState === "MAYBE" ? `só marcou "talvez"` :
      suggestion.keyPersonState === "NO" ? 'marcou "não" nesse turno' :
      "ainda não respondeu"
    }`,
  ];
  return (
    <View style={{ backgroundColor: T.white, borderWidth: 1, borderColor: T.ink100, borderRadius: 20, padding: 16, gap: 8 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Sparkle size={18} color={T.vermillion} />
        <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 14, color: T.ink }}>
          {formatLongDate(suggestion.date)} · {formatSlot(suggestion.slot)}
        </Text>
      </View>
      {lines.map((l) => (
        <Text key={l} style={{ fontFamily: T.fontBody, fontSize: 13, color: T.ink600, lineHeight: 19 }}>• {l}</Text>
      ))}
      <Text style={{ fontFamily: T.fontMono, fontSize: 11, color: T.ink400 }}>
        confiança {pct(suggestion.confidence)} · score {suggestion.score.toFixed(2)}
      </Text>
    </View>
  );
}

export default function ResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading, error } = usePrivateEventSuggestion(id, true);
  const { mutateAsync, isPending } = useConfirmEvent(id);

  async function handleConfirm() {
    try {
      await mutateAsync();
      router.replace(`/events/${id}/confirmed` as any);
    } catch {
      // confirm devolve 409 quando não há votos — mantém na tela com aviso.
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.paper }}>
      <Stack.Screen options={{ headerShown: false }} />
      <AppHeader title="Sugestão da IA" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        {isLoading && (
          <View style={{ alignItems: "center", gap: 12, paddingVertical: 48 }}>
            <ActivityIndicator color={T.vermillion} />
            <Text style={{ fontFamily: T.fontBody, fontSize: 14, color: T.ink600, textAlign: "center" }}>
              Lendo os votos de todo mundo e escolhendo o melhor dia e turno…
            </Text>
          </View>
        )}

        {!isLoading && error && (
          <View style={{ backgroundColor: T.vermillionSoft, borderRadius: 16, padding: 16, gap: 6 }}>
            <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 14, color: T.vermillion }}>
              Sem sugestão ainda
            </Text>
            <Text style={{ fontFamily: T.fontBody, fontSize: 13, color: T.ink600, lineHeight: 19 }}>
              {error?.message ?? "Ainda não dá pra calcular."} Volta aqui depois de mais gente marcar disponibilidade.
            </Text>
          </View>
        )}

        {!isLoading && data && !data.suggestion && data.keyPersonBlocking !== false && (
          <View style={{ backgroundColor: T.warnSoft, borderWidth: 1.5, borderColor: "#F5C66B", borderRadius: 16, padding: 16, gap: 6 }}>
            <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 14, color: "#9D6B0C" }}>
              Esperando a pessoa-chave
            </Text>
            <Text style={{ fontFamily: T.fontBody, fontSize: 13, color: "#7A5A10", lineHeight: 19 }}>
              O algoritmo da Farmei prioriza a faixa da pessoa-chave do grupo. Ela ainda não respondeu com "sim" — pede pra ela marcar disponibilidade.
            </Text>
          </View>
        )}

        {!isLoading && data?.suggestion && (
          <>
            <Text style={{ fontFamily: T.fontBody, fontSize: 15, color: T.ink700, lineHeight: 22 }}>
              Melhor par <Text style={{ fontWeight: "800" }}>{formatLongDate(data.suggestion.date)}</Text> ·{" "}
              <Text style={{ fontWeight: "800" }}>{formatSlot(data.suggestion.slot)}</Text>, baseado em {pct(data.suggestion.confidence)} de confiança.
            </Text>

            <GateCard suggestion={data.suggestion} />

            <View style={{ backgroundColor: T.spark, borderWidth: 2, borderColor: T.ink, borderRadius: 16, padding: 14, flexDirection: "row", gap: 10 }}>
              <Sparkle size={20} color={T.ink} />
              <Text style={{ flex: 1, fontFamily: T.fontBodyMedium, fontSize: 13, color: T.ink, lineHeight: 19 }}>
                {data.suggestion.reasoning}
              </Text>
            </View>

            {data.ranked && data.ranked.length > 1 && (
              <View style={{ gap: 8 }}>
                <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 12, color: T.ink500, letterSpacing: 0.5, textTransform: "uppercase" }}>
                  Alternativas
                </Text>
                {data.ranked.slice(1, 4).map((r: SlotSuggestion) => (
                  <View key={`${r.date}|${r.slot}`} style={{ flexDirection: "row", justifyContent: "space-between", backgroundColor: T.white, borderWidth: 1, borderColor: T.ink100, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14 }}>
                    <Text style={{ fontFamily: T.fontBodyMedium, fontSize: 13, color: T.ink700 }}>
                      {formatLongDate(r.date)} · {formatSlot(r.slot)}
                    </Text>
                    <Text style={{ fontFamily: T.fontMono, fontSize: 11, color: T.ink400 }}>{pct(r.confidence)}</Text>
                  </View>
                ))}
              </View>
            )}
          </>
        )}

        {!data?.suggestion && !isLoading && data && (
          <View style={{ backgroundColor: T.white, borderWidth: 1, borderColor: T.ink100, borderRadius: 16, padding: 16 }}>
            <Text style={{ fontFamily: T.fontBody, fontSize: 13, color: T.ink600, lineHeight: 19 }}>
              Ainda não existe um dia e turno com quórum suficiente. Quando alguém marcar o mesmo dia e turno com "sim", aparece o par aqui.
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={{ padding: 20, paddingBottom: 32, borderTopWidth: 1, borderTopColor: T.ink100 }}>
        <AIButton onPress={handleConfirm} disabled={!data?.suggestion || isPending}>
          {isPending ? "Confirmando…" : "Confirmar esse dia e turno"}
        </AIButton>
      </View>
    </SafeAreaView>
  );
}