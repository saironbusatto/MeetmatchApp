import { Link, Stack } from "expo-router";
import { Text, View } from "~/components/Themed";

export default function NotFound() {
  return (
    <>
      <Stack.Screen options={{ title: "Página não encontrada" }} />
      <View className="flex-1 items-center justify-center bg-ink-25 px-6">
        <Text className="font-display text-3xl text-ink-900">
          Essa página não existe.
        </Text>
        <Link href="/" className="mt-6 text-vermillion-500">
          Voltar para o início
        </Link>
      </View>
    </>
  );
}
