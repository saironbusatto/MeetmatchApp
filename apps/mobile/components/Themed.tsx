import { Text as RNText, View as RNView, type TextProps, type ViewProps } from "react-native";

export function View(props: ViewProps & { className?: string }) {
  return <RNView {...props} />;
}

export function Text(props: TextProps & { className?: string }) {
  return <RNText {...props} />;
}
