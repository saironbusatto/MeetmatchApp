import { Pressable, Text, View, type PressableProps } from "react-native";
import { Sparkle } from "./Sparkle";
import { T } from "./tokens";

interface ButtonProps extends PressableProps {
  children: React.ReactNode;
  full?: boolean;
  size?: "sm" | "md" | "lg";
}

const SIZE = {
  sm: { py: 10, px: 14, fontSize: 13, radius: 12 },
  md: { py: 15, px: 22, fontSize: 16, radius: 999 },
  lg: { py: 18, px: 24, fontSize: 17, radius: 999 },
};

export function PrimaryButton({ children, full = true, size = "md", disabled, style, ...props }: ButtonProps) {
  const s = SIZE[size];
  return (
    <Pressable
      {...props}
      disabled={disabled}
      style={[
        {
          paddingVertical: s.py,
          paddingHorizontal: s.px,
          borderRadius: s.radius,
          backgroundColor: T.vermillion,
          borderWidth: 2,
          borderColor: T.ink,
          alignItems: "center",
          justifyContent: "center",
          width: full ? "100%" : undefined,
          opacity: disabled ? 0.5 : 1,
          ...T.stamp,
        },
        style as any,
      ]}
    >
      <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: s.fontSize, color: T.white }}>
        {children}
      </Text>
    </Pressable>
  );
}

export function SecondaryButton({ children, full = false, size = "md", disabled, style, ...props }: ButtonProps) {
  const s = SIZE[size];
  return (
    <Pressable
      {...props}
      disabled={disabled}
      style={[
        {
          paddingVertical: s.py - 2,
          paddingHorizontal: s.px,
          borderRadius: s.radius,
          backgroundColor: T.white,
          borderWidth: 1.5,
          borderColor: T.ink,
          alignItems: "center",
          justifyContent: "center",
          width: full ? "100%" : undefined,
          opacity: disabled ? 0.5 : 1,
        },
        style as any,
      ]}
    >
      <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: s.fontSize, color: T.ink }}>
        {children}
      </Text>
    </Pressable>
  );
}

export function AIButton({ children, full = true, disabled, style, ...props }: ButtonProps) {
  return (
    <Pressable
      {...props}
      disabled={disabled}
      style={[
        {
          paddingVertical: 15,
          paddingHorizontal: 22,
          borderRadius: 999,
          backgroundColor: T.ink,
          borderWidth: 2,
          borderColor: T.ink,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          width: full ? "100%" : undefined,
          opacity: disabled ? 0.5 : 1,
          ...T.stampAi,
        },
        style as any,
      ]}
    >
      <Sparkle size={16} color={T.spark} />
      <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 16, color: T.spark }}>
        {children}
      </Text>
    </Pressable>
  );
}

export function GhostButton({ children, style, ...props }: ButtonProps) {
  return (
    <Pressable
      {...props}
      style={[{ paddingVertical: 12, paddingHorizontal: 16, alignItems: "center" }, style as any]}
    >
      <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 15, color: T.ink600 }}>
        {children}
      </Text>
    </Pressable>
  );
}

export function NewButton({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: 9,
        paddingHorizontal: 14,
        borderRadius: 999,
        backgroundColor: T.ink,
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
      }}
    >
      <Text style={{ fontFamily: T.fontBodySemiBold, fontSize: 13, color: T.white }}>+ New</Text>
    </Pressable>
  );
}
