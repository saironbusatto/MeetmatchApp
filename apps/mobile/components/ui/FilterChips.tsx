import { Pressable, ScrollView, Text } from "react-native";
import { T } from "./tokens";

interface FilterChipsProps {
  options: string[];
  active: string;
  onChange: (value: string) => void;
}

export function FilterChips({ options, active, onChange }: FilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 12 }}
    >
      {options.map((opt) => {
        const isActive = opt === active;
        return (
          <Pressable
            key={opt}
            onPress={() => onChange(opt)}
            style={{
              paddingVertical: 7,
              paddingHorizontal: 14,
              borderRadius: 999,
              backgroundColor: isActive ? T.ink : T.white,
              borderWidth: 1,
              borderColor: isActive ? T.ink : T.ink100,
              marginRight: 8,
            }}
          >
            <Text
              style={{
                fontFamily: T.fontBodyMedium,
                fontSize: 13,
                color: isActive ? T.white : T.ink700,
              }}
            >
              {opt}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
