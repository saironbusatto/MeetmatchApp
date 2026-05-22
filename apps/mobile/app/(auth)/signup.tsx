// signup.tsx — OAuth-only: redireciona pro login (mesmo fluxo)
// Clerk não distingue sign-in e sign-up via OAuth — o provider cria a conta
// automaticamente na primeira vez. Esta tela existe só pra copy diferenciado.

import { useOAuth } from "@clerk/expo";
import { Stack } from "expo-router";
import { Pressable, SafeAreaView, View } from "react-native";
import { Text } from "~/components/Themed";

export default function Signup() {
  const { startOAuthFlow: googleFlow } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: appleFlow }  = useOAuth({ strategy: "oauth_apple" });

  async function handleOAuth(flow: () => ReturnType<ReturnType<typeof useOAuth>["startOAuthFlow"]>) {
    const { createdSessionId, setActive } = await flow();
    if (createdSessionId) await setActive?.({ session: createdSessionId });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAF7" }}>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 px-6 pt-12">
        <Text className="font-display text-4xl text-ink-900">Cria sua conta</Text>
        <Text className="mt-2 font-body text-base text-ink-500">
          Em 30s a gente já marca o primeiro rolê.
        </Text>

        <View className="mt-10 gap-3">
          <OAuthButton
            onPress={() => handleOAuth(googleFlow)}
            label="Criar com Google"
            icon={<GoogleIcon />}
            bg="#fff"
            fg="#0A0A0A"
          />
          <OAuthButton
            onPress={() => handleOAuth(appleFlow)}
            label="Criar com Apple"
            icon={<AppleIcon />}
            bg="#0A0A0A"
            fg="#FAFAF7"
          />
        </View>

        <Text className="mt-5 text-center font-body text-xs text-ink-400">
          Ao continuar você concorda com os{" "}
          <Text className="font-semibold text-ink-600">Termos</Text> e a{" "}
          <Text className="font-semibold text-ink-600">Privacidade</Text>.
        </Text>
      </View>
    </SafeAreaView>
  );
}

function OAuthButton({ onPress, label, icon, bg, fg }: {
  onPress: () => void;
  label: string;
  icon: React.ReactNode;
  bg: string;
  fg: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row", alignItems: "center", gap: 14,
        height: 54, paddingHorizontal: 22,
        borderRadius: 16, borderWidth: 2, borderColor: "#0A0A0A",
        backgroundColor: bg,
        shadowColor: "#0A0A0A",
        shadowOffset: { width: 2, height: 3 },
        shadowOpacity: 1, shadowRadius: 0,
        elevation: 3,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      {icon}
      <Text style={{ flex: 1, fontFamily: "Geist-SemiBold", fontSize: 15, color: fg }}>
        {label}
      </Text>
    </Pressable>
  );
}

function GoogleIcon() {
  const { Svg, Path } = require("react-native-svg");
  return (
    <Svg width={22} height={22} viewBox="0 0 18 18">
      <Path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"/>
      <Path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.32A9 9 0 0 0 9 18Z"/>
      <Path fill="#FBBC05" d="M3.97 10.71c-.18-.54-.28-1.11-.28-1.71s.1-1.17.28-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.04l3.01-2.33Z"/>
      <Path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.34l2.58-2.58A9 9 0 0 0 9 0 9 9 0 0 0 .96 4.96l3.01 2.33A5.36 5.36 0 0 1 9 3.58Z"/>
    </Svg>
  );
}

function AppleIcon() {
  const { Svg, Path } = require("react-native-svg");
  return (
    <Svg width={20} height={20} viewBox="0 0 384 512" fill="#FAFAF7">
      <Path d="M318.7 268c-.45-44.83 36.6-66.5 38.32-67.55-20.94-30.6-53.49-34.83-65-35.31-27.39-2.83-53.59 16.19-67.45 16.19-13.99 0-35.43-15.81-58.31-15.36-29.94.45-57.61 17.42-72.97 44.18-31.21 54-7.92 133.7 22.21 177.32 14.74 21.36 32.04 45.27 54.85 44.45 22.06-.91 30.39-14.21 57.04-14.21 26.65 0 34.13 14.21 57.43 13.78 23.78-.45 38.7-21.74 53.2-43.18 16.78-24.74 23.66-48.74 24.06-49.95-.53-.27-46.13-17.76-46.63-70.36zM275.07 90.05c12.05-14.72 20.21-34.93 17.99-55.18-17.32.73-39.06 11.84-51.53 26.47-11.05 12.85-20.85 33.79-18.27 53.55 19.39 1.5 39.31-9.85 51.81-24.84z"/>
    </Svg>
  );
}
