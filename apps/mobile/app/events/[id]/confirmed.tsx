import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { ActivityIndicator, SafeAreaView, ScrollView, Text, View } from "react-native";
import { AppHeader } from "~/components/ui/AppHeader";
import { SecondaryButton } from "~/components/ui/Button";
import { Avatar } from "~/components/ui/Avatar";
import { T } from "~/components/ui/tokens";
import { usePrivateEvent } from "~/lib/queries";

export default function ConfirmedScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading } = usePrivateEvent(id);

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: T.paper, alignItems: "center", justifyContent: "center" }}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator color={T.vermillion} />
      </SafeAreaView>
    );
  }

  const event = (data as any)?.event;
  const participants = (data as any)?.participants ?? [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.paper }}>
      <Stack.Screen options={{ headerShown: false }} />
      <AppHeader onBack={() => router.push("/(tabs)" as any)} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}>
        <View style={{ paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6, backgroundColor: T.successSoft, alignSelf: "flex-start", marginBottom: 14 }}>
          <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.6, color: T.success }}>🎉 locked in</Text>
        </View>
        <Text style={{ fontFamily: T.fontDisplay, fontSize: 40, lineHeight: 40, letterSpacing: -1.2, color: T.ink }}>{event?.title ?? "Evento confirmado"}</Text>
        {event?.confirmedDate && (
          <Text style={{ fontFamily: T.fontMonoBold, fontSize: 20, color: T.ink, marginTop: 14 }}>{event.confirmedDate}</Text>
        )}
        <Text style={{ fontFamily: T.fontBody, fontSize: 14, color: T.ink500, marginTop: 6 }}>¡Vamos!</Text>
        <View style={{ marginTop: 22, backgroundColor: T.white, borderWidth: 1, borderColor: T.ink100, borderRadius: 18, padding: 16 }}>
          <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 11, color: T.ink500, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 14 }}>Participantes</Text>
          <View style={{ gap: 12 }}>
            {participants.map((p: any, i: number) => (
              <View key={p.id} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Avatar name={p.nameSnapshot ?? p.email ?? "?"} size={32} colorIdx={i} isKey={p.role === "KEY_PERSON"} />
                <Text style={{ flex: 1, fontFamily: T.fontBodyMedium, fontSize: 14, color: T.ink }}>{p.nameSnapshot ?? p.email ?? "Convidado"}</Text>
                <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: T.success, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontSize: 13, color: T.white }}>✓</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <View style={{ padding: 20, paddingBottom: 32, borderTopWidth: 1, borderTopColor: T.ink100 }}>
        <SecondaryButton full onPress={() => router.push("/(tabs)" as any)}>Voltar aos eventos</SecondaryButton>
      </View>
    </SafeAreaView>
  );
}
