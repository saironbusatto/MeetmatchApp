import { Pressable, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { T } from "./tokens";

interface AppHeaderProps {
  title?: string;
  onBack?: () => void;
  action?: React.ReactNode;
}

export function AppHeader({ title, onBack, action }: AppHeaderProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 14,
        backgroundColor: T.paper,
      }}
    >
      <View style={{ width: 40 }}>
        {onBack && (
          <Pressable
            onPress={onBack}
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor: T.white,
              borderWidth: 1,
              borderColor: T.ink100,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path
                d="M15 18 L9 12 L15 6"
                stroke={T.ink}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Pressable>
        )}
      </View>

      {title ? (
        <Text
          style={{
            fontFamily: T.fontDisplay,
            fontSize: 18,
            letterSpacing: -0.2,
            color: T.ink,
            flex: 1,
            textAlign: "center",
          }}
        >
          {title}
        </Text>
      ) : (
        <View style={{ flex: 1 }} />
      )}

      <View style={{ width: 40, alignItems: "flex-end" }}>{action}</View>
    </View>
  );
}
