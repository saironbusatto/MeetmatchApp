import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView, Text, TextInput, View } from "react-native";
import { PrimaryButton } from "~/components/ui/Button";
import { T } from "~/components/ui/tokens";
import { signUp } from "~/lib/auth";
import { registerDeviceForPush } from "~/lib/push";
import { useSession } from "~/lib/store";

export default function Signup() {
  const router = useRouter();
  const setUser = useSession((s) => s.setUser);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSignup() {
    setSubmitting(true);
    setError(null);
    const { user, error: err } = await signUp(email, password, name);
    setSubmitting(false);
    if (err || !user) {
      setError(err ?? "Erro ao criar conta");
      return;
    }
    setUser({ ...user, avatarUrl: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    await registerDeviceForPush().catch(() => undefined);
    router.replace("/(tabs)");
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.paper }}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flex: 1, paddingHorizontal: 28, paddingTop: 60, paddingBottom: 32 }}>
        <Text style={{ fontFamily: T.fontDisplay, fontSize: 48, lineHeight: 48, letterSpacing: -1.5, color: T.ink }}>
          ¡Vamos!
        </Text>
        <Text style={{ marginTop: 10, fontFamily: T.fontBody, fontSize: 16, color: T.ink500, lineHeight: 24 }}>
          Cria sua conta em menos de um minuto.
        </Text>

        <View style={{ marginTop: 32, gap: 16 }}>
          {[
            { label: "Nome", value: name, onChange: setName, placeholder: "seu nome", secure: false, keyboard: "default" as const },
            { label: "Email", value: email, onChange: setEmail, placeholder: "email@exemplo.com", secure: false, keyboard: "email-address" as const },
            { label: "Senha", value: password, onChange: setPassword, placeholder: "mínimo 8 caracteres", secure: true, keyboard: "default" as const },
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
                secureTextEntry={f.secure}
                autoCapitalize="none"
                keyboardType={f.keyboard}
                style={{
                  fontFamily: T.fontBody, fontSize: 16, color: T.ink,
                  paddingVertical: 14, paddingHorizontal: 16,
                  borderWidth: 1.5, borderColor: T.ink100,
                  borderRadius: 14, backgroundColor: T.white,
                }}
              />
            </View>
          ))}

          {error ? (
            <View style={{ backgroundColor: T.vermillionSoft, borderRadius: 10, padding: 12 }}>
              <Text style={{ fontFamily: T.fontBody, fontSize: 14, color: T.vermillion }}>{error}</Text>
            </View>
          ) : null}
        </View>

        <View style={{ flex: 1 }} />

        <PrimaryButton size="lg" onPress={handleSignup} disabled={submitting}>
          {submitting ? "Criando…" : "Criar conta"}
        </PrimaryButton>
      </View>
    </SafeAreaView>
  );
}
