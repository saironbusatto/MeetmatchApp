import { Redirect, Stack } from "expo-router";
import { useSession } from "~/lib/store";

export default function AuthLayout() {
  const user = useSession((s) => s.user);
  if (user) return <Redirect href="/(tabs)" />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#FAFAF7" }
      }}
    />
  );
}
