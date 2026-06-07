import { Text, TextInput, View, type TextInputProps } from "react-native";
import { T } from "./tokens";

interface FieldProps extends TextInputProps {
  label: string;
  hint?: string;
  displayFont?: boolean;
}

export function Field({ label, hint, displayFont, style, ...props }: FieldProps) {
  return (
    <View style={{ gap: 6 }}>
      <Text
        style={{
          fontFamily: T.fontBodySemiBold,
          fontSize: 12,
          color: T.ink500,
          letterSpacing: 0.5,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Text>
      <TextInput
        {...props}
        placeholderTextColor={T.ink400}
        style={[
          {
            fontFamily: displayFont ? T.fontDisplay : T.fontBody,
            fontSize: displayFont ? 22 : 16,
            color: T.ink,
            paddingVertical: 14,
            paddingHorizontal: 16,
            borderWidth: 1.5,
            borderColor: T.ink100,
            borderRadius: 14,
            backgroundColor: T.white,
          },
          style,
        ]}
      />
      {hint && (
        <Text style={{ fontFamily: T.fontBody, fontSize: 12, color: T.ink500 }}>{hint}</Text>
      )}
    </View>
  );
}
