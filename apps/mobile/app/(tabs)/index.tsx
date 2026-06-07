import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, SafeAreaView, Text, View } from "react-native";
import { EventCard } from "~/components/ui/EventCard";
import { FilterChips } from "~/components/ui/FilterChips";
import { NewButton } from "~/components/ui/Button";
import { T } from "~/components/ui/tokens";
import { useSession } from "~/lib/store";
import { usePrivateEvents } from "~/lib/queries";
import type { Event } from "@farmei/types";

const FILTERS = ["Upcoming", "Waiting", "Past", "All"];

function statusOf(event: Event): "locked" | "pending" {
  return event.status === "CONFIRMED" ? "locked" : "pending";
}

function whenLabel(event: Event): string {
  if (event.confirmedDate) return event.confirmedDate;
  return "Waiting for responses";
}

export default function HomeTab() {
  const router = useRouter();
  const user = useSession((s) => s.user);
  const [filter, setFilter] = useState("Upcoming");
  const firstName = user?.name?.split(" ")[0] ?? "você";
  const { data, isLoading, error } = usePrivateEvents();

  const events = data?.data ?? [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.paper }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
        <View>
          <Text style={{ fontFamily: T.fontBodyMedium, fontSize: 13, color: T.ink500 }}>
            Buenas, {firstName}
          </Text>
          <Text style={{ fontFamily: T.fontDisplay, fontSize: 38, lineHeight: 38, letterSpacing: -1, color: T.ink, marginTop: 4 }}>
            Your events
          </Text>
        </View>
        <NewButton onPress={() => router.push("/events/new" as any)} />
      </View>

      <FilterChips options={FILTERS} active={filter} onChange={setFilter} />

      {isLoading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={T.vermillion} />
        </View>
      ) : error ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>
          <Text style={{ fontFamily: T.fontBody, fontSize: 14, color: T.ink500, textAlign: "center" }}>
            Não foi possível carregar os eventos.
          </Text>
        </View>
      ) : events.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32, gap: 12 }}>
          <Text style={{ fontFamily: T.fontDisplay, fontSize: 24, color: T.ink, textAlign: "center" }}>
            Nenhum evento ainda
          </Text>
          <Text style={{ fontFamily: T.fontBody, fontSize: 15, color: T.ink500, textAlign: "center" }}>
            Cria o primeiro e convida a galera.
          </Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.event.id}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 10, paddingBottom: 24 }}
          renderItem={({ item }) => (
            <EventCard
              title={item.event.title}
              when={whenLabel(item.event)}
              status={statusOf(item.event)}
              people={(item.participants as any[]).slice(0, 6).map((p: any, i: number) => ({
                name: p.nameSnapshot ?? p.email ?? "Convidado",
                isKey: p.role === "KEY_PERSON",
                colorIdx: i,
              }))}
              onPress={() => router.push(`/events/${item.event.id}` as any)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}
