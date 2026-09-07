import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, SafeAreaView, Text, View } from "react-native";
import { FilterChips } from "~/components/ui/FilterChips";
import { PublicEventCard } from "~/components/ui/PublicEventCard";
import { T } from "~/components/ui/tokens";
import { usePublicEvents } from "~/lib/queries";

const FILTERS = ["All", "Sports", "Music", "Social", "Food"];

const CATEGORY_COLORS: Record<string, string> = {
  Sports: T.vermillion,
  Music: "#7A5BAA",
  Social: "#2A6F7A",
  Food: "#C99B00",
  Art: "#2EA862",
};

export default function PublicTab() {
  const router = useRouter();
  const [filter, setFilter] = useState("All");
  const { data, isLoading, error } = usePublicEvents(filter === "All" ? undefined : filter);

  const events = data?.data ?? [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.paper }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
        <View>
          <Text style={{ fontFamily: T.fontBodyMedium, fontSize: 13, color: T.ink500 }}>
            O que está rolando
          </Text>
          <Text style={{ fontFamily: T.fontDisplay, fontSize: 38, lineHeight: 38, letterSpacing: -1, color: T.ink, marginTop: 4 }}>
            Perto de você
          </Text>
        </View>
        <Pressable
          onPress={() => router.push("/events/new-public" as any)}
          style={{ paddingVertical: 9, paddingHorizontal: 14, borderRadius: 999, backgroundColor: T.ink }}
        >
          <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 13, color: T.white }}>+ Host</Text>
        </Pressable>
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
            Nada por aqui ainda
          </Text>
          <Text style={{ fontFamily: T.fontBody, fontSize: 15, color: T.ink500, textAlign: "center" }}>
            Seja o primeiro a hospedar algo.
          </Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.event.id}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 10, paddingBottom: 24 }}
          renderItem={({ item }) => {
            const settings = item.settings as any;
            return (
              <PublicEventCard
                title={item.event.title}
                when={settings?.eventDate ?? ""}
                location={item.event.locationText ?? ""}
                category={settings?.category ?? "Social"}
                categoryColor={CATEGORY_COLORS[settings?.category ?? "Social"] ?? T.ink500}
                current={settings?.registrationCount ?? 0}
                max={settings?.capacity ?? 100}
                people={[]}
                onPress={() => router.push(`/public/${item.event.id}` as any)}
              />
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
