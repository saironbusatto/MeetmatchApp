import { Pressable, Text, View } from "react-native";
import { AvatarStack } from "./Avatar";
import { T } from "./tokens";

interface Person {
  name: string;
  isKey?: boolean;
  colorIdx?: number;
}

interface EventCardProps {
  title: string;
  when: string;
  status: "locked" | "pending";
  people: Person[];
  onPress?: () => void;
}

export function EventCard({ title, when, status, people, onPress }: EventCardProps) {
  const isLocked = status === "locked";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: T.white,
        borderWidth: 1,
        borderColor: T.ink100,
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
        </View>
        <View
          style={{
            paddingVertical: 4,
            paddingHorizontal: 8,
            borderRadius: 6,
            backgroundColor: isLocked ? T.successSoft : T.warnSoft,
          }}
        >
          <Text
            style={{
              fontFamily: T.fontBodySemiBold,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 0.6,
              color: isLocked ? T.success : "#9D6B0C",
            }}
          >
            {isLocked ? "locked in" : "waiting"}
          </Text>
        </View>
      </View>
      <AvatarStack people={people} size={28} max={5} />
    </Pressable>
  );
}
