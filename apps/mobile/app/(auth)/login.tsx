import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, SafeAreaView, TextInput } from "react-native";
import { ErrorState } from "~/components/StateCard";
import { Text, View } from "~/components/Themed";
import { getSupabase } from "~/lib/auth";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleLogin() {
    setSubmitting(true);
    setError(null);
    const { error: err } = await getSupabase().auth.signInWithPassword({
      email,
      password
    });
    setSubmitting(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.replace("/(tabs)");
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAF7" }}>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 px-6 pt-12">
        <Text className="font-display text-4xl text-ink-900">Buenas de novo.</Text>
        <Text className="mt-2 font-body text-base text-ink-500">
          Entra com sua conta para continuar.
        </Text>

        <View className="mt-8 gap-4">
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="email@exemplo.com"
            placeholderTextColor="#8C8A82"
            autoCapitalize="none"
            keyboardType="email-address"
            className="rounded-xl border border-ink-100 bg-ink-0 px-4 py-3 font-body text-base text-ink-900"
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="senha"
            placeholderTextColor="#8C8A82"
            secureTextEntry
            className="rounded-xl border border-ink-100 bg-ink-0 px-4 py-3 font-body text-base text-ink-900"
          />
          {error ? <ErrorState message={error} /> : null}
        </View>

        <Pressable
          accessibilityLabel="Entrar no app"
          disabled={submitting}
          onPress={handleLogin}
          className="mt-6 items-center rounded-full border-2 border-ink-900 bg-vermillion-500 py-4"
          style={{
            shadowColor: "#0A0A0A",
            shadowOffset: { width: 3, height: 3 },
            shadowOpacity: 1,
            shadowRadius: 0,
            opacity: submitting ? 0.7 : 1
          }}
        >
          <Text className="font-body text-base font-semibold text-ink-0">
            {submitting ? "Entrando…" : "Entrar"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
