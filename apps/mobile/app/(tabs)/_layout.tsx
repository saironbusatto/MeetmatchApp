import { Redirect, Tabs } from "expo-router";
import { useSession } from "~/lib/store";

export default function TabsLayout() {
  const user = useSession((s) => s.user);
  const hydrating = useSession((s) => s.isHydrating);
  if (hydrating) return null;
  if (!user) return <Redirect href="/(auth)/onboarding" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FF3B2E",
        tabBarInactiveTintColor: "#8C8A82",
        tabBarStyle: {
          backgroundColor: "rgba(250,250,247,0.92)",
          borderTopColor: "#E8E6E0",
          borderTopWidth: 1
        },
        tabBarLabelStyle: {
          fontFamily: "Geist-Medium",
          fontSize: 11,
          letterSpacing: 0.08
        }
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Eventos" }} />
      <Tabs.Screen name="public" options={{ title: "Público" }} />
      <Tabs.Screen name="profile" options={{ title: "Perfil" }} />
    </Tabs>
  );
}
