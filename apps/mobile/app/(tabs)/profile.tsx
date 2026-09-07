import { SafeAreaView, Text, View } from "react-native";
import { Avatar } from "~/components/ui/Avatar";
import { SecondaryButton } from "~/components/ui/Button";
import { T } from "~/components/ui/tokens";
import { signOut } from "~/lib/auth";
import { useSession } from "~/lib/store";

export default function Profile() {
  const user = useSession((s) => s.user);
  const setUser = useSession((s) => s.setUser);

  const initColorIdx = user?.name
    ? user.name.charCodeAt(0) % 7
    : 0;

  async function handleLogout() {
    await signOut();
    setUser(null);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.paper }}>
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 48, paddingBottom: 32 }}>
        {/* Avatar + name */}
        <View style={{ alignItems: "center", gap: 16, marginBottom: 32 }}>
          <Avatar name={user?.name ?? "?"} size={80} colorIdx={initColorIdx} />
          <View style={{ alignItems: "center", gap: 4 }}>
            <Text style={{ fontFamily: T.fontDisplay, fontSize: 28, letterSpacing: -0.5, color: T.ink }}>
              {user?.name ?? "—"}
            </Text>
            <Text style={{ fontFamily: T.fontBody, fontSize: 15, color: T.ink500 }}>
              {user?.email ?? ""}
            </Text>
          </View>
        </View>

        {/* Info card */}
        <View style={{
          backgroundColor: T.white,
          borderWidth: 1, borderColor: T.ink100,
          borderRadius: 20, overflow: "hidden",
          ...T.stamp,
        }}>
          <View style={{ padding: 18, borderBottomWidth: 1, borderBottomColor: T.ink100 }}>
            <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 11, color: T.ink500, letterSpacing: 0.6, textTransform: "uppercase" }}>
              Conta
            </Text>
            <Text style={{ fontFamily: T.fontDisplay, fontSize: 20, color: T.ink, marginTop: 4 }}>
              {user?.name ?? "—"}
            </Text>
          </View>
          <View style={{ padding: 18 }}>
            <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 11, color: T.ink500, letterSpacing: 0.6, textTransform: "uppercase" }}>
              Email
            </Text>
            <Text style={{ fontFamily: T.fontBody, fontSize: 15, color: T.ink, marginTop: 4 }}>
              {user?.email ?? "—"}
            </Text>
          </View>
        </View>

        <View style={{ flex: 1 }} />

        <SecondaryButton full size="lg" onPress={handleLogout}>
          Sair
        </SecondaryButton>
      </View>
    </SafeAreaView>
  );
}
