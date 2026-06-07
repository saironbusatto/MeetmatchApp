import { useRouter, Stack } from "expo-router";
import { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import { AppHeader } from "~/components/ui/AppHeader";
import { PrimaryButton } from "~/components/ui/Button";
import { T } from "~/components/ui/tokens";
import { useCreatePrivateEvent } from "~/lib/queries";

const DURATIONS = ["30m", "1h", "1.5h", "2h", "½ dia"];

export default function NewPrivate() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [windowStart, setWindowStart] = useState("");
  const [windowEnd, setWindowEnd] = useState("");
  const [duration, setDuration] = useState("1h");
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync, isPending } = useCreatePrivateEvent();

  async function handleCreate() {
    if (!title.trim()) { setError("Dá um nome pro evento."); return; }
    if (!windowStart || !windowEnd) { setError("Define a janela de datas."); return; }
    setError(null);
    try {
      const { event } = await mutateAsync({
        title: title.trim(),
        dateWindowStart: windowStart,
        dateWindowEnd: windowEnd,
      });
      router.replace(`/events/${event.id}/invite` as any);
    } catch (e: any) {
      setError(e?.message ?? "Erro ao criar evento.");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.paper }}>
      <Stack.Screen options={{ headerShown: false }} />
      <AppHeader title="Novo evento" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={{ padding: 20, gap: 24 }}>
        <View style={{ gap: 6 }}>
          <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 12, color: T.ink500, letterSpacing: 0.5, textTransform: "uppercase" }}>
            Sobre o quê?
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Q3 planning lunch…"
            placeholderTextColor={T.ink400}
            style={{ fontFamily: T.fontDisplay, fontSize: 22, color: T.ink, paddingVertical: 14, paddingHorizontal: 16, borderWidth: 1.5, borderColor: T.ink100, borderRadius: 14, backgroundColor: T.white }}
          />
        </View>

        <View style={{ gap: 6 }}>
          <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 12, color: T.ink500, letterSpacing: 0.5, textTransform: "uppercase" }}>
            Janela de datas
          </Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TextInput value={windowStart} onChangeText={setWindowStart} placeholder="2026-06-03" placeholderTextColor={T.ink400}
              style={{ flex: 1, fontFamily: T.fontMono, fontSize: 15, color: T.ink, paddingVertical: 14, paddingHorizontal: 16, borderWidth: 1.5, borderColor: T.ink100, borderRadius: 14, backgroundColor: T.white }} />
            <TextInput value={windowEnd} onChangeText={setWindowEnd} placeholder="2026-06-14" placeholderTextColor={T.ink400}
              style={{ flex: 1, fontFamily: T.fontMono, fontSize: 15, color: T.ink, paddingVertical: 14, paddingHorizontal: 16, borderWidth: 1.5, borderColor: T.ink100, borderRadius: 14, backgroundColor: T.white }} />
          </View>
          <Text style={{ fontFamily: T.fontBody, fontSize: 12, color: T.ink500 }}>A IA vai sugerir datas dentro dessa janela.</Text>
        </View>

        <View style={{ gap: 6 }}>
          <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 12, color: T.ink500, letterSpacing: 0.5, textTransform: "uppercase" }}>Duração</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {DURATIONS.map((d) => (
              <Pressable key={d} onPress={() => setDuration(d)}
                style={{ paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999, backgroundColor: duration === d ? T.ink : T.white, borderWidth: 1.5, borderColor: duration === d ? T.ink : T.ink100 }}>
                <Text style={{ fontFamily: T.fontBodyMedium, fontSize: 13, color: duration === d ? T.white : T.ink700 }}>{d}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {error && (
          <View style={{ backgroundColor: T.vermillionSoft, borderRadius: 10, padding: 12 }}>
            <Text style={{ fontFamily: T.fontBody, fontSize: 14, color: T.vermillion }}>{error}</Text>
          </View>
        )}
      </ScrollView>

      <View style={{ padding: 20, paddingBottom: 32, borderTopWidth: 1, borderTopColor: T.ink100 }}>
        <PrimaryButton size="lg" onPress={handleCreate} disabled={isPending}>
          {isPending ? "Criando…" : "Próximo: convidar pessoas →"}
        </PrimaryButton>
      </View>
    </SafeAreaView>
  );
}
