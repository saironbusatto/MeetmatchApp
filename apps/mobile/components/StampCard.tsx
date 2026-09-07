import { Platform, View, type ViewProps } from "react-native";
import { farmeiTokens } from "@farmei/design-tokens/tailwind";

type Variant = "default" | "ai" | "conflict";

export interface StampCardProps extends ViewProps {
  variant?: Variant;
  className?: string;
}

const VARIANT_BG: Record<Variant, string> = {
  default: farmeiTokens.colors.ink[0],
  ai: farmeiTokens.colors.spark[300],
  conflict: farmeiTokens.colors.vermillion[50]
};

const VARIANT_BORDER: Record<Variant, string> = {
  default: farmeiTokens.colors.ink[100],
  ai: farmeiTokens.colors.ink[900],
  conflict: farmeiTokens.colors.vermillion[200]
};

/**
 * Card com "stamp shadow" (sombra sólida sem blur) — a sombra-assinatura do Farmei.
 * iOS usa shadowOffset com radius 0; Android usa borderBottom/borderRight emulando o stamp.
 */
export function StampCard({ variant = "default", style, ...props }: StampCardProps) {
  const isAi = variant === "ai";
  const offset = isAi ? 4 : 2;

  const stamp =
    Platform.OS === "ios"
      ? {
          shadowColor: farmeiTokens.colors.ink[900],
          shadowOffset: { width: offset, height: offset },
          shadowOpacity: 1,
          shadowRadius: 0
        }
      : {
          // Android não suporta shadow sólido — emula com borders escuras
          borderBottomWidth: offset,
          borderRightWidth: offset
        };

  return (
    <View
      {...props}
      style={[
        {
          backgroundColor: VARIANT_BG[variant],
          borderWidth: isAi ? 2 : 1,
          borderColor: VARIANT_BORDER[variant],
          borderRadius: isAi ? 24 : 20,
          padding: 24
        },
        stamp,
        style
      ]}
    />
  );
}
