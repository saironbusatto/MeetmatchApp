import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { AppHeader } from "~/components/ui/AppHeader";
import { PrimaryButton, SecondaryButton } from "~/components/ui/Button";
import { Avatar } from "~/components/ui/Avatar";
import { T } from "~/components/ui/tokens";
import { usePrivateEvent, useUpdatePrivateEvent } from "~/lib/queries";
import { useSession } from "~/lib/store";
import { formatLongDate, SLOT_LABELS } from "~/lib/dates";
import type { Event } from "@farmei/types";

function statusLabel(status: Event["status"]) {
  if (status === "CONFIRMED") return { text: "taca o bolo", bg: T.successSoft, color: T.success };
  if (status === "CANCELLED") return { text: "cancelado", bg: T.vermillionSoft, color: T.vermillion };
  if (status === "NO_DATE") return { text: "sem data ainda", bg: T.warnSoft, color: "#9D6B0C" };
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
  const { mutateAsync: updateConfig, isPending: savingConfig } = useUpdatePrivateEvent(id);
  const quorum = settings?.quorumMin ?? 1;
  const keyPersonId = settings?.keyPersonUserId ?? null;
  const candidates = (participants as any[]).filter((p) => p.inviteStatus === "ACCEPTED" && p.userId);

  async function setQuorum(q: number) {
    try { await updateConfig({ quorumMin: q }); } catch {
      /* ignora — invalidate na próxima leitura */
    }
  }

  async function setKeyPerson(userId: string | null) {
    try { await updateConfig({ keyPersonUserId: userId }); } catch {
      /* ignora */
    }
  }

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
          <View style={{ marginTop: 14, gap: 4 }}>
            <Text style={{ fontFamily: T.fontMonoBold, fontSize: 18, color: T.ink }}>
              {formatLongDate(event.confirmedDate)}
              {event.confirmedSlot ? ` · ${SLOT_LABELS[event.confirmedSlot as keyof typeof SLOT_LABELS]}` : ""}
            </Text>
            {event.confirmationWindowEndsAt && (
              <Text style={{ fontFamily: T.fontBody, fontSize: 13, color: event.status === "NO_DATE" ? T.ink400 : T.ink500 }}>
                {event.status === "NO_DATE" ? "todo mundo pode re-marcar" : "par confirmado — bora!"}
              </Text>
            )}
          </View>
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

        {/* Config da IA (owner) */}
        {isOwner && !isConfirmed && (
          <View style={{ marginTop: 16, backgroundColor: T.spark, borderWidth: 2, borderColor: T.ink, borderRadius: 18, padding: 16, gap: 14 }}>
            <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 11, color: T.ink, letterSpacing: 0.5, textTransform: "uppercase" }}>
              ✦ IA da Farmei
            </Text>

            <View style={{ gap: 6 }}>
              <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 13, color: T.ink }}>Quórum mínimo</Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {[1, 2, 3, 4, 5].map((q) => (
                  <Pressable key={q} disabled={savingConfig} onPress={() => setQuorum(q)}
                    style={{ width: 44, paddingVertical: 8, borderRadius: 12, alignItems: "center", backgroundColor: quorum === q ? T.ink : T.white, borderWidth: 1.5, borderColor: quorum === q ? T.ink : T.ink100 }}>
                    <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 14, color: quorum === q ? T.white : T.ink700 }}>{q}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={{ gap: 6 }}>
              <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 13, color: T.ink }}>Pessoa-chave</Text>
              {candidates.length === 0 ? (
                <Text style={{ fontFamily: T.fontBody, fontSize: 12, color: T.ink700, lineHeight: 18 }}>
                  A IA ainda não tem quem priorizar. Convida e espera alguém aceitar — aí escolhe aqui.
                </Text>
              ) : (
                <>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                    <Pressable disabled={savingConfig} onPress={() => setKeyPerson(null)}
                      style={{ paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999, backgroundColor: keyPersonId === null || !keyPersonId ? T.ink : T.white, borderWidth: 1.5, borderColor: T.ink }}>
                      <Text style={{ fontFamily: T.fontBodyMedium, fontSize: 12, color: keyPersonId === null || !keyPersonId ? T.white : T.ink700 }}>
                        ninguém
                      </Text>
                    </Pressable>
                    {candidates.map((p: any) => {
                      const active = keyPersonId === p.userId;
                      return (
                        <Pressable key={p.id} disabled={savingConfig} onPress={() => setKeyPerson(p.userId)}
                          style={{ paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999, backgroundColor: active ? T.vermillion : T.white, borderWidth: 1.5, borderColor: active ? T.vermillion : T.ink }}>
                          <Text style={{ fontFamily: T.fontBodyMedium, fontSize: 12, color: active ? T.white : T.ink700 }}>
                            {p.nameSnapshot ?? p.email}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                  <Text style={{ fontFamily: T.fontBody, fontSize: 12, color: T.ink700, lineHeight: 18 }}>
                    A IA prioriza o par no melhor turno pra essa pessoa estar.
                  </Text>
                </>
              )}
            </View>
          </View>
        )}

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
                  {p.role === "KEY_PERSON" ? <Text style={{ color: T.vermillion }}> · chave</Text> : null}
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
