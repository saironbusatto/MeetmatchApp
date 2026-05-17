import "../global.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Slot, SplashScreen, useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useSession } from "~/lib/store";
import { getSupabase } from "~/lib/auth";

SplashScreen.preventAutoHideAsync().catch(() => undefined);

const queryClient = new QueryClient();

export default function RootLayout() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    "BricolageGrotesque-Regular": require("../assets/fonts/BricolageGrotesque-Regular.ttf"),
    "BricolageGrotesque-Bold": require("../assets/fonts/BricolageGrotesque-Bold.ttf"),
    "Geist-Regular": require("../assets/fonts/Geist-Regular.ttf"),
    "Geist-Medium": require("../assets/fonts/Geist-Medium.ttf"),
    "Geist-SemiBold": require("../assets/fonts/Geist-SemiBold.ttf"),
    "JetBrainsMono-Regular": require("../assets/fonts/JetBrainsMono-Regular.ttf"),
    "JetBrainsMono-Bold": require("../assets/fonts/JetBrainsMono-Bold.ttf")
  });

  const setHydrating = useSession((state) => state.setHydrating);
  const setUser = useSession((state) => state.setUser);

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
    return () => {
      sub.remove();
    };
  }, [router]);

  useEffect(() => {
    const supabase = getSupabase();
    setHydrating(true);
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        const u = data.session.user;
        setUser({
          id: u.id,
          name: (u.user_metadata?.name as string) ?? u.email ?? "",
          email: u.email ?? "",
          avatarUrl: null,
          createdAt: u.created_at,
          updatedAt: u.updated_at ?? u.created_at
        });
      }
      setHydrating(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user;
        setUser({
          id: u.id,
          name: (u.user_metadata?.name as string) ?? u.email ?? "",
          email: u.email ?? "",
          avatarUrl: null,
          createdAt: u.created_at,
          updatedAt: u.updated_at ?? u.created_at
        });
      } else {
        setUser(null);
      }
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, [setHydrating, setUser]);

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Slot />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
