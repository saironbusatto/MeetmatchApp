import "../global.css";

import { ClerkProvider, useAuth } from "@clerk/expo";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Slot, SplashScreen, useRouter, useSegments } from "expo-router";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { clerkTokenCache } from "~/lib/auth";
import { env } from "~/lib/env";

SplashScreen.preventAutoHideAsync().catch(() => undefined);

const queryClient = new QueryClient();

function AuthGuard() {
  const { isSignedIn, isLoaded } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    const inAuth = segments[0] === "(auth)";
    if (isSignedIn && inAuth) {
      router.replace("/(tabs)");
    } else if (!isSignedIn && !inAuth) {
      router.replace("/(auth)/login");
    }
  }, [isSignedIn, isLoaded, segments]);

  return null;
}

function AppLayout() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    "BricolageGrotesque-Regular": require("../assets/fonts/BricolageGrotesque-Regular.ttf"),
    "BricolageGrotesque-Bold": require("../assets/fonts/BricolageGrotesque-Bold.ttf"),
    "Geist-Regular": require("../assets/fonts/Geist-Regular.ttf"),
    "Geist-Medium": require("../assets/fonts/Geist-Medium.ttf"),
    "Geist-SemiBold": require("../assets/fonts/Geist-SemiBold.ttf"),
    "JetBrainsMono-Regular": require("../assets/fonts/JetBrainsMono-Regular.ttf"),
    "JetBrainsMono-Bold": require("../assets/fonts/JetBrainsMono-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync().catch(() => undefined);
  }, [fontsLoaded]);

  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const targetPath = response.notification.request.content.data?.targetPath;
      if (typeof targetPath === "string" && targetPath.startsWith("/")) {
        router.push(targetPath as never);
      }
    });
    return () => sub.remove();
  }, [router]);

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <AuthGuard />
        <Slot />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={env.clerkPublishableKey} tokenCache={clerkTokenCache}>
      <AppLayout />
    </ClerkProvider>
  );
}
