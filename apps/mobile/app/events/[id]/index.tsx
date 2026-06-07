import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { AppHeader } from "~/components/ui/AppHeader";
import { PrimaryButton, SecondaryButton } from "~/components/ui/Button";
import { Avatar, AvatarStack } from "~/components/ui/Avatar";
import { T } from "~/components/ui/tokens";
import { usePrivateEvent } from "~/lib/queries";
import { useSession } from "~/lib/store";
import type { Event } from "@farmei/types";

function statusLabel(status: Event["status"]) {
  if (status === "CONFIRMED") return { text: "locked in", bg: T.successSoft, color: T.success };
  if (status === "CANCELLED") return { text: "cancelado", bg: T.vermillionSoft, color: T.vermillion };
  return { text: "waiting", bg: T.warnSoft, color: "#9D6B0C" };
}

export default function EventDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const user = useSession((s) => s.user);
  const { data, isLoading, error } = usePrivateEvent(id);

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: T.paper, alignItems: "center", justifyContent: "center" }}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator color={T.vermillion} />
      </SafeAreaView>
    );
  }

  if (error || !data) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: T.paper }}>
        <Stack.Screen options={{ headerShown: false }} />
        <AppHeader onBack={() => router.back()} />
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 32 }}>
          <Text style={{ fontFamily: T.fontBody, fontSize: 15, color: T.ink500, textAlign: "center" }}>
            Evento não encontrado.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const { event, settings, participants } = data as any;
  const badge = statusLabel(event.status);
  const isOwner = event.ownerId === user?.id;
  const isConfirmed = event.status === "CONFIRMED";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.paper }}>
      <Stack.Screen options={{ headerShown: false }} />
      <AppHeader onBack={() => router.back()} />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}>
        {/* Badge */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 14 }}>
          <View style={{ paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6, backgroundColor: badge.bg }}>
            <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.6, color: badge.color }}>
              {badge.text}
            </Text>
          </View>
        </View>

        <Text style={{ fontFamily: T.fontDisplay, fontSize: 40, lineHeight: 40, letterSpacing: -1, color: T.ink }}>
          {event.title}
        </Text>

        {isConfirmed && event.confirmedDate ? (
          <Text style={{ fontFamily: T.fontMonoBold, fontSize: 18, color: T.ink, marginTop: 14 }}>
            {event.confirmedDate}
          </Text>
        ) : settings?.dateWindowStart ? (
          <Text style={{ fontFamily: T.fontMono, fontSize: 14, color: T.ink500, marginTop: 12 }}>
            {settings.dateWindowStart} → {settings.dateWindowEnd}
          </Text>
        ) : null}

        {/* Info rows */}
        <View style={{ marginTop: 22, backgroundColor: T.white, borderWidth: 1, borderColor: T.ink100, borderRadius: 18 }}>
          {[
            event.locationText && { label: "Onde", value: event.locationText },
            { label: "Participantes", value: `${(participants as any[]).length} pessoas` },
          ].filter(Boolean).map((row: any, i: number, arr) => (
            <View key={row.label} style={{ padding: 16, borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: T.ink100 }}>
              <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 11, color: T.ink500, letterSpacing: 0.5, textTransform: "uppercase" }}>
                {row.label}
              </Text>
              <Text style={{ fontFamily: T.fontBodyMedium, fontSize: 15, color: T.ink, marginTop: 3 }}>
                {row.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Participants */}
        <View style={{ marginTop: 16, backgroundColor: T.white, borderWidth: 1, borderColor: T.ink100, borderRadius: 18, padding: 16 }}>
          <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 11, color: T.ink500, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 14 }}>
            Quem vai
          </Text>
          <View style={{ gap: 12 }}>
            {(participants as any[]).map((p: any, i: number) => (
              <View key={p.id} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Avatar name={p.nameSnapshot ?? p.email ?? "?"} size={32} colorIdx={i} isKey={p.role === "KEY_PERSON"} />
                <Text style={{ flex: 1, fontFamily: T.fontBodyMedium, fontSize: 14, color: T.ink }}>
                  {p.nameSnapshot ?? p.email ?? "Convidado"}
                </Text>
                <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 12, color: p.inviteStatus === "ACCEPTED" ? T.success : T.ink400 }}>
                  {p.inviteStatus === "ACCEPTED" ? "✓" : p.inviteStatus === "PENDING" ? "pendente" : "recusou"}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Actions */}
      {isOwner && !isConfirmed && (
        <View style={{ padding: 20, paddingBottom: 32, borderTopWidth: 1, borderTopColor: T.ink100, gap: 10 }}>
          <PrimaryButton onPress={() => router.push(`/events/${id}/invite` as any)}>
            Convidar pessoas →
          </PrimaryButton>
          <SecondaryButton full onPress={() => router.push(`/events/${id}/availability` as any)}>
            Marcar minha disponibilidade
          </SecondaryButton>
        </View>
      )}
      {!isOwner && !isConfirmed && (
        <View style={{ padding: 20, paddingBottom: 32, borderTopWidth: 1, borderTopColor: T.ink100 }}>
          <PrimaryButton onPress={() => router.push(`/events/${id}/availability` as any)}>
            Marcar disponibilidade
          </PrimaryButton>
        </View>
      )}
    </SafeAreaView>
  );
}
