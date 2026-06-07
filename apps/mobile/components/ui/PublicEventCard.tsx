import { Pressable, Text, View } from "react-native";
import { AvatarStack } from "./Avatar";
import { T } from "./tokens";

interface Person {
  name: string;
  isKey?: boolean;
  colorIdx?: number;
}

interface PublicEventCardProps {
  title: string;
  when: string;
  location: string;
  category: string;
  categoryColor: string;
  current: number;
  max: number;
  people: Person[];
  onPress?: () => void;
}

function occupancyColor(pct: number) {
  if (pct < 50) return T.success;
  if (pct < 80) return T.warn;
  return T.vermillion;
}

export function PublicEventCard({
  title, when, location, category, categoryColor,
  current, max, people, onPress,
}: PublicEventCardProps) {
  const pct = Math.round((current / max) * 100);
  const occColor = occupancyColor(pct);
  const isFull = pct >= 100;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: T.white,
        borderWidth: isFull ? 2 : 1,
        borderColor: isFull ? T.vermillion : T.ink100,
        borderRadius: 20,
        padding: 16,
        gap: 12,
        opacity: pressed ? 0.92 : 1,
      })}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: T.fontMono, fontSize: 11, color: T.ink400, letterSpacing: 0.5, textTransform: "uppercase" }}>
            {when}
          </Text>
          <Text style={{ fontFamily: T.fontDisplay, fontSize: 19, color: T.ink, letterSpacing: -0.2, marginTop: 4, lineHeight: 23 }}>
            {title}
          </Text>
          <Text style={{ fontFamily: T.fontBody, fontSize: 12, color: T.ink500, marginTop: 4 }}>
            📍 {location}
          </Text>
        </View>
        <View
          style={{
            paddingVertical: 4,
            paddingHorizontal: 8,
            borderRadius: 6,
            backgroundColor: categoryColor + "20",
          }}
        >
          <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.6, color: categoryColor }}>
            {category}
          </Text>
        </View>
      </View>

      {/* Occupancy bar */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <View style={{ flex: 1, height: 6, backgroundColor: T.ink100, borderRadius: 3, overflow: "hidden" }}>
          <View style={{ height: "100%", backgroundColor: occColor, width: `${Math.min(pct, 100)}%` }} />
        </View>
        <Text style={{ fontFamily: T.fontMonoBold, fontSize: 11, color: occColor, minWidth: 36, textAlign: "right" }}>
          {current}/{max}
        </Text>
      </View>

      {isFull && (
        <View style={{ backgroundColor: T.vermillionSoft, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10 }}>
          <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 12, color: T.vermillion }}>⚠️ Lotado!</Text>
        </View>
      )}

      <AvatarStack people={people} size={28} max={5} />
    </Pressable>
  );
}
