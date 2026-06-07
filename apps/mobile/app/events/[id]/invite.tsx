import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, SafeAreaView, Text, TextInput, View } from "react-native";
import { AppHeader } from "~/components/ui/AppHeader";
import { PrimaryButton, GhostButton } from "~/components/ui/Button";
import { Avatar } from "~/components/ui/Avatar";
import { T } from "~/components/ui/tokens";
import { useInviteParticipant } from "~/lib/queries";

export default function InviteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [invited, setInvited] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync, isPending } = useInviteParticipant(id);

  async function handleAdd() {
    if (!email.trim() || !email.includes("@")) { setError("Email inválido."); return; }
    if (invited.includes(email.trim())) { setError("Já adicionado."); return; }
    setError(null);
    try {
      await mutateAsync({ email: email.trim() });
      setInvited((prev) => [...prev, email.trim()]);
      setEmail("");
    } catch (e: any) {
      setError(e?.message ?? "Erro ao convidar.");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.paper }}>
      <Stack.Screen options={{ headerShown: false }} />
      <AppHeader title="Convidar pessoas" onBack={() => router.back()} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          <Text style={{ fontFamily: T.fontBody, fontSize: 14, color: T.ink600, marginBottom: 16, lineHeight: 21 }}>
            Adiciona a galera pelo email. Cada pessoa recebe um link de convite.
          </Text>

          {/* Search input */}
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="email@exemplo.com"
              placeholderTextColor={T.ink400}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="done"
              onSubmitEditing={handleAdd}
              style={{ flex: 1, fontFamily: T.fontBody, fontSize: 15, color: T.ink, paddingVertical: 12, paddingHorizontal: 16, borderWidth: 1.5, borderColor: T.ink100, borderRadius: 14, backgroundColor: T.white }}
            />
            <PrimaryButton onPress={handleAdd} disabled={isPending} full={false} size="sm">
              + Add
            </PrimaryButton>
          </View>

          {error && (
            <View style={{ backgroundColor: T.vermillionSoft, borderRadius: 10, padding: 10, marginBottom: 12 }}>
              <Text style={{ fontFamily: T.fontBody, fontSize: 13, color: T.vermillion }}>{error}</Text>
            </View>
          )}

          {/* Invited list */}
          {invited.length > 0 && (
            <View style={{ gap: 6 }}>
              <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 11, color: T.ink500, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 4 }}>
                {invited.length} convidados
              </Text>
              {invited.map((em, i) => (
                <View key={em} style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 12, backgroundColor: T.white, borderWidth: 1, borderColor: T.ink100, borderRadius: 12 }}>
                  <Avatar name={em} size={32} colorIdx={i} />
                  <Text style={{ flex: 1, fontFamily: T.fontBodyMedium, fontSize: 14, color: T.ink }}>{em}</Text>
                  <View style={{ paddingVertical: 2, paddingHorizontal: 8, backgroundColor: T.successSoft, borderRadius: 6 }}>
                    <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 11, color: T.success }}>enviado</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={{ padding: 20, paddingBottom: 32, borderTopWidth: 1, borderTopColor: T.ink100, gap: 10 }}>
          <PrimaryButton size="lg" onPress={() => router.push(`/events/${id}/availability` as any)}>
            Próximo: minha disponibilidade →
          </PrimaryButton>
          <GhostButton onPress={() => router.push(`/events/${id}/availability` as any)}>
            Pular por agora
          </GhostButton>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
