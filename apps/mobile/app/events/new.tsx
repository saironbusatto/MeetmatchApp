import { Link, Stack } from "expo-router";
import { Pressable, SafeAreaView } from "react-native";
import { StampCard } from "~/components/StampCard";
import { Text, View } from "~/components/Themed";

export default function NewEventPicker() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FAFAF7" }}>
      <Stack.Screen options={{ title: "Novo evento", headerShown: true }} />
      <View className="flex-1 px-6 pt-6">
        <Text className="font-display text-3xl text-ink-900">
          Que tipo de evento?
        </Text>
        <Text className="mt-2 font-body text-base text-ink-500">
          Privado escolhe a data com IA. Público é data fixa com inscrição.
        </Text>

        <View className="mt-8 gap-4">
          <Link href="/events/new-private" asChild>
            <Pressable>
              <StampCard>
                <Text className="font-body text-[11px] uppercase tracking-wider text-ink-500">
                  privado · com IA
                </Text>
                <Text className="mt-2 font-display text-xl text-ink-900">
                  Agendar com a galera
                </Text>
                <Text className="mt-2 font-body text-sm text-ink-500">
                  Janela de datas + key person → IA escolhe.
                </Text>
              </StampCard>
            </Pressable>
          </Link>

          <Link href="/events/new-public" asChild>
            <Pressable>
              <StampCard>
                <Text className="font-body text-[11px] uppercase tracking-wider text-ink-500">
                  público · sem IA
                </Text>
                <Text className="mt-2 font-display text-xl text-ink-900">
                  Abrir vagas para qualquer pessoa
                </Text>
                <Text className="mt-2 font-body text-sm text-ink-500">
                  Data e local fixos, lotação máxima.
                </Text>
              </StampCard>
            </Pressable>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
