import { Redirect } from "expo-router";
import { useSession } from "~/lib/store";

export default function Index() {
  const user = useSession((s) => s.user);
  const hydrating = useSession((s) => s.isHydrating);
  if (hydrating) return null;
  return <Redirect href={user ? "/(tabs)" : "/(auth)/onboarding"} />;
}
