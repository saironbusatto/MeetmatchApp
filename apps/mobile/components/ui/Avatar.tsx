import { Text, View } from "react-native";
import { AV_COLORS, T } from "./tokens";

interface AvatarProps {
  name: string;
  size?: number;
  isKey?: boolean;
  colorIdx?: number;
}

export function Avatar({ name, size = 36, isKey = false, colorIdx = 0 }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const bg = AV_COLORS[colorIdx % AV_COLORS.length];

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bg,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: T.white,
        ...(isKey
          ? { outlineWidth: 2, outlineColor: T.vermillion, outlineStyle: "solid" }
          : {}),
      }}
    >
      <Text
        style={{
          fontFamily: T.fontBodySemiBold,
          fontSize: size * 0.36,
          color: T.white,
          lineHeight: size * 0.46,
        }}
      >
        {initials}
      </Text>
      {isKey && (
        <View
          style={{
            position: "absolute",
            bottom: -2,
            right: -2,
            width: size * 0.32,
            height: size * 0.32,
            borderRadius: 99,
            backgroundColor: T.vermillion,
            borderWidth: 1.5,
            borderColor: T.white,
          }}
        />
      )}
    </View>
  );
}

interface AvatarStackProps {
  people: Array<{ name: string; isKey?: boolean; colorIdx?: number }>;
  size?: number;
  max?: number;
}

export function AvatarStack({ people, size = 32, max = 4 }: AvatarStackProps) {
  const visible = people.slice(0, max);
  const overflow = people.length - max;

  return (
    <View style={{ flexDirection: "row" }}>
      {visible.map((p, i) => (
        <View key={i} style={{ marginLeft: i === 0 ? 0 : -(size * 0.3) }}>
          <Avatar name={p.name} size={size} isKey={p.isKey} colorIdx={p.colorIdx ?? i} />
        </View>
      ))}
      {overflow > 0 && (
        <View
          style={{
            marginLeft: -(size * 0.3),
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: T.ink100,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 2,
            borderColor: T.white,
          }}
        >
          <Text
            style={{
              fontFamily: T.fontBodySemiBold,
              fontSize: size * 0.3,
              color: T.ink700,
            }}
          >
            +{overflow}
          </Text>
        </View>
      )}
    </View>
  );
}
