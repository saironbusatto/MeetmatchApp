import { useRouter, Stack } from "expo-router";
import { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import { AppHeader } from "~/components/ui/AppHeader";
import { PrimaryButton } from "~/components/ui/Button";
import { T } from "~/components/ui/tokens";
import { useCreatePublicEvent } from "~/lib/queries";

const CATEGORIES = ["Sports", "Music", "Social", "Food", "Art"];

export default function NewPublic() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Social");
  const [eventDate, setEventDate] = useState("");
  const [capacity, setCapacity] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync, isPending } = useCreatePublicEvent();

  async function handleCreate() {
    if (!title.trim()) { setError("Dá um nome pro evento."); return; }
    if (!eventDate) { setError("Define a data do evento (YYYY-MM-DD)."); return; }
    if (!capacity || isNaN(Number(capacity))) { setError("Define a lotação máxima."); return; }
    setError(null);
    try {
      const { event } = await mutateAsync({
        title: title.trim(),
        locationText: location.trim() || undefined,
        category,
        eventDate,
        capacity: Number(capacity),
        description: description.trim() || undefined,
      });
      router.replace(`/public/${event.id}` as any);
    } catch (e: any) {
      setError(e?.message ?? "Erro ao criar evento.");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.paper }}>
      <Stack.Screen options={{ headerShown: false }} />
      <AppHeader title="Criar evento público" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
        {[
          { label: "Nome do evento", value: title, onChange: setTitle, placeholder: "Show de Rock…", display: true },
          { label: "Local", value: location, onChange: setLocation, placeholder: "Caverna Pub · Lapa", display: false },
          { label: "Data (YYYY-MM-DD)", value: eventDate, onChange: setEventDate, placeholder: "2026-07-04", display: false },
          { label: "Lotação máxima", value: capacity, onChange: setCapacity, placeholder: "80", display: false },
          { label: "Descrição", value: description, onChange: setDescription, placeholder: "Conta o que vai rolar…", display: false },
        ].map((f) => (
          <View key={f.label} style={{ gap: 6 }}>
            <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 12, color: T.ink500, letterSpacing: 0.5, textTransform: "uppercase" }}>
              {f.label}
            </Text>
            <TextInput
              value={f.value}
              onChangeText={f.onChange}
              placeholder={f.placeholder}
              placeholderTextColor={T.ink400}
              keyboardType={f.label.includes("Lotação") ? "number-pad" : "default"}
              multiline={f.label === "Descrição"}
              style={{
                fontFamily: f.display ? T.fontDisplay : T.fontBody,
                fontSize: f.display ? 22 : 16,
                color: T.ink,
                paddingVertical: 14, paddingHorizontal: 16,
                borderWidth: 1.5, borderColor: T.ink100,
                borderRadius: 14, backgroundColor: T.white,
                minHeight: f.label === "Descrição" ? 80 : undefined,
              }}
            />
          </View>
        ))}

        <View style={{ gap: 6 }}>
          <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 12, color: T.ink500, letterSpacing: 0.5, textTransform: "uppercase" }}>
            Categoria
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {CATEGORIES.map((c) => (
              <Pressable
                key={c}
                onPress={() => setCategory(c)}
                style={{
                  paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999,
                  backgroundColor: category === c ? T.ink : T.white,
                  borderWidth: 1.5, borderColor: category === c ? T.ink : T.ink100,
                }}
              >
                <Text style={{ fontFamily: T.fontBodyMedium, fontSize: 13, color: category === c ? T.white : T.ink700 }}>
                  {c}
                </Text>
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
          {isPending ? "Criando…" : "Criar e publicar →"}
        </PrimaryButton>
      </View>
    </SafeAreaView>
  );
}
