import { Link, Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, SafeAreaView, Text, TextInput, View } from "react-native";
import { PrimaryButton, GhostButton } from "~/components/ui/Button";
import { T } from "~/components/ui/tokens";
import { signIn } from "~/lib/auth";
import { useSession } from "~/lib/store";

export default function Login() {
  const router = useRouter();
  const setUser = useSession((s) => s.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleLogin() {
    setSubmitting(true);
    setError(null);
    const { user, error: err } = await signIn(email, password);
    setSubmitting(false);
    if (err || !user) {
      setError(err ?? "Erro ao entrar");
      return;
    }
    setUser({ ...user, avatarUrl: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    router.replace("/(tabs)");
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.paper }}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flex: 1, paddingHorizontal: 28, paddingTop: 60, paddingBottom: 32 }}>
        <Text style={{ fontFamily: T.fontDisplay, fontSize: 48, lineHeight: 48, letterSpacing: -1.5, color: T.ink }}>
          Buenas{"\n"}de novo.
        </Text>
        <Text style={{ marginTop: 10, fontFamily: T.fontBody, fontSize: 16, color: T.ink500, lineHeight: 24 }}>
          Entra com sua conta para continuar.
        </Text>

        <View style={{ marginTop: 32, gap: 16 }}>
          <View style={{ gap: 6 }}>
            <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 12, color: T.ink500, letterSpacing: 0.5, textTransform: "uppercase" }}>
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="email@exemplo.com"
              placeholderTextColor={T.ink400}
              autoCapitalize="none"
              keyboardType="email-address"
              style={{ fontFamily: T.fontBody, fontSize: 16, color: T.ink, paddingVertical: 14, paddingHorizontal: 16, borderWidth: 1.5, borderColor: T.ink100, borderRadius: 14, backgroundColor: T.white }}
            />
          </View>

          <View style={{ gap: 6 }}>
            <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 12, color: T.ink500, letterSpacing: 0.5, textTransform: "uppercase" }}>
              Senha
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="sua senha"
              placeholderTextColor={T.ink400}
              secureTextEntry
              style={{ fontFamily: T.fontBody, fontSize: 16, color: T.ink, paddingVertical: 14, paddingHorizontal: 16, borderWidth: 1.5, borderColor: T.ink100, borderRadius: 14, backgroundColor: T.white }}
            />
          </View>

          {error ? (
            <View style={{ backgroundColor: T.vermillionSoft, borderRadius: 10, padding: 12 }}>
              <Text style={{ fontFamily: T.fontBody, fontSize: 14, color: T.vermillion }}>{error}</Text>
            </View>
          ) : null}
        </View>

        <View style={{ flex: 1 }} />

        <PrimaryButton size="lg" onPress={handleLogin} disabled={submitting}>
          {submitting ? "Entrando…" : "Entrar"}
        </PrimaryButton>

        <Link href="/(auth)/signup" asChild>
          <Pressable>
            <Text style={{ fontFamily: T.fontBody, fontSize: 14, color: T.ink500, textAlign: "center", marginTop: 16 }}>
              Não tem conta?{" "}
              <Text style={{ fontFamily: T.fontBodySemiBold, color: T.ink, textDecorationLine: "underline" }}>
                Criar
              </Text>
            </Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}
