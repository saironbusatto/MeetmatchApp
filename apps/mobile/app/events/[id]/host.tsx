import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { useState, useEffect } from "react";
import { ActivityIndicator, Alert, Pressable, SafeAreaView, ScrollView, Share, Text, View } from "react-native";
import { AppHeader } from "~/components/ui/AppHeader";
import { Avatar } from "~/components/ui/Avatar";
import { T } from "~/components/ui/tokens";
import { useApi } from "~/lib/useApi";
import { usePublicEvent } from "~/lib/queries";
import { formatSlot } from "~/lib/dates";

interface Attendee {
  id: string;
  name: string;
  email: string;
  arrivedAt: string | null;
  colorIdx: number;
}

export default function HostPanel() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const api = useApi();
  const { data: eventData, isLoading: loadingEvent } = usePublicEvent(id);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [waitlist, setWaitlist] = useState<{ id: string; position: number }[]>([]);
  const [loadingReg, setLoadingReg] = useState(true);

  const event = (eventData as any)?.event;
  const settings = (eventData as any)?.settings;
  const confirmed = attendees.length;
  const arrived = attendees.filter((a) => a.arrivedAt).length;

  useEffect(() => {
    api.publicEvents.getRegistrations(id)
      .then((res: any) => {
        const regs = res?.registrations ?? [];
        setAttendees(regs.map((r: any, i: number) => ({
          id: r.id,
          name: r.user?.name ?? r.nameSnapshot ?? "Inscrito",
          email: r.user?.email ?? "",
          arrivedAt: null,
          colorIdx: i % 7,
        })));
      })
      .catch(() => setAttendees([]));
    api.publicEvents.getWaitlist(id)
      .then((res: any) => setWaitlist(res?.waitlist ?? []))
      .catch(() => setWaitlist([]))
      .finally(() => setLoadingReg(false));
  }, [id]);

  function checkIn(attendeeId: string) {
    const time = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    setAttendees((prev) => prev.map((a) => a.id === attendeeId ? { ...a, arrivedAt: time } : a));
  }

  function remove(attendeeId: string) {
    Alert.alert("Remover inscrito", "Tem certeza?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Remover", style: "destructive", onPress: () => setAttendees((prev) => prev.filter((a) => a.id !== attendeeId)) },
    ]);
  }

  async function exportCSV() {
    const lines = ["Nome,Email,Chegou"].concat(
      attendees.map((a) => `${a.name},${a.email},${a.arrivedAt ?? "não"}`)
    );
    await Share.share({
      message: lines.join("\n"),
      title: `Lista — ${event?.title ?? "Evento"}`,
    }).catch(() => undefined);
  }

  if (loadingEvent || loadingReg) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: T.paper, alignItems: "center", justifyContent: "center" }}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator color={T.vermillion} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.paper }}>
      <Stack.Screen options={{ headerShown: false }} />
      <AppHeader title="Gerenciar" onBack={() => router.back()} />

      <ScrollView contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 32 }}>
        {/* Event recap */}
        <View style={{ backgroundColor: T.white, borderWidth: 1, borderColor: T.ink100, borderRadius: 16, padding: 18, gap: 6 }}>
          <Text style={{ fontFamily: T.fontDisplay, fontSize: 22, letterSpacing: -0.5, color: T.ink }}>
            {event?.title ?? "Evento"}
          </Text>
          {settings?.eventDate && (
            <Text style={{ fontFamily: T.fontMono, fontSize: 12, color: T.ink600 }}>
              {settings.eventDate}{settings.eventSlot ? ` · ${formatSlot(settings.eventSlot)}` : ""}
            </Text>
          )}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
            {[
              { v: confirmed, label: "inscritos", bg: T.ink50, fg: T.ink },
              { v: arrived, label: "chegaram", bg: T.successSoft, fg: T.success },
              { v: waitlist.length || "—", label: "na fila", bg: T.warnSoft, fg: "#9D6B0C" },
              { v: settings?.capacity ?? "—", label: "lotação", bg: T.vermillionSoft, fg: T.vermillion },
            ].map((s) => (
              <View key={s.label} style={{ width: "48%", backgroundColor: s.bg, borderRadius: 10, padding: 12, alignItems: "center" }}>
                <Text style={{ fontFamily: T.fontMonoBold, fontSize: 22, color: s.fg }}>{s.v}</Text>
                <Text style={{ fontFamily: T.fontBody, fontSize: 11, color: s.fg, marginTop: 2 }}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Attendee list */}
        {attendees.length === 0 ? (
          <View style={{ backgroundColor: T.white, borderWidth: 1, borderColor: T.ink100, borderRadius: 16, padding: 32, alignItems: "center" }}>
            <Text style={{ fontFamily: T.fontDisplay, fontSize: 18, color: T.ink, marginBottom: 6 }}>Nenhum inscrito ainda</Text>
            <Text style={{ fontFamily: T.fontBody, fontSize: 14, color: T.ink500, textAlign: "center" }}>
              Compartilha o evento para atrair participantes.
            </Text>
          </View>
        ) : (
          <View style={{ gap: 8 }}>
            <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 11, color: T.ink500, letterSpacing: 0.6, textTransform: "uppercase", paddingHorizontal: 4 }}>
              Inscritos ({attendees.length})
            </Text>
            {attendees.map((a) => (
              <View key={a.id} style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: T.white, borderWidth: 1, borderColor: T.ink100, borderRadius: 12, padding: 12 }}>
                <Avatar name={a.name} size={36} colorIdx={a.colorIdx} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 14, color: T.ink }}>{a.name}</Text>
                  <Text style={{ fontFamily: T.fontBody, fontSize: 11, color: T.ink500, marginTop: 2 }}>
                    {a.arrivedAt ? `Chegou ${a.arrivedAt}` : a.email || "Pendente"}
                  </Text>
                </View>
                {!a.arrivedAt && (
                  <Pressable onPress={() => checkIn(a.id)} style={{ backgroundColor: T.success, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10 }}>
                    <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 12, color: T.white }}>✓ Check-in</Text>
                  </Pressable>
                )}
                <Pressable onPress={() => remove(a.id)} style={{ backgroundColor: T.vermillionSoft, borderRadius: 6, width: 28, height: 28, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontSize: 14, color: T.vermillion }}>×</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {/* Waitlist */}
        {waitlist.length > 0 && (
          <View style={{ gap: 8 }}>
            <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 11, color: T.ink500, letterSpacing: 0.6, textTransform: "uppercase", paddingHorizontal: 4 }}>
              Fila de espera ({waitlist.length})
            </Text>
            {waitlist.map((w) => (
              <View key={w.id} style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: T.white, borderWidth: 1, borderColor: T.warnSoft, borderRadius: 12, padding: 12 }}>
                <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: T.warnSoft, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontFamily: T.fontMonoBold, fontSize: 13, color: "#9D6B0C" }}>{w.position}</Text>
                </View>
                <Text style={{ flex: 1, fontFamily: T.fontBodySemiBold, fontSize: 14, color: T.ink }}>Inscrito aguardando vaga</Text>
                <Text style={{ fontFamily: T.fontBody, fontSize: 11, color: T.ink400 }}>
                  {w.position === 1 ? "próximo" : "auto-entra"}
                </Text>
              </View>
            ))}
            <Text style={{ fontFamily: T.fontBody, fontSize: 12, color: T.ink500, paddingHorizontal: 4 }}>
              Quando alguém desistir, a primeira pessoa da fila entra automaticamente.
            </Text>
          </View>
        )}

        {/* Export */}
        <Pressable onPress={exportCSV} style={{ backgroundColor: T.ink, borderRadius: 14, paddingVertical: 14, alignItems: "center", ...T.stamp }}>
          <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 15, color: T.white }}>📥 Exportar lista</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
