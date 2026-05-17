import { Text, View } from "~/components/Themed";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <View className="rounded-2xl border border-ink-100 bg-ink-0 p-4" accessibilityRole="summary">
      <Text className="font-display text-xl text-ink-900">{title}</Text>
      <Text className="mt-2 font-body text-sm text-ink-500">{description}</Text>
    </View>
  );
}

export function LoadingState({ message }: { message: string }) {
  return (
    <View className="rounded-2xl border border-ink-100 bg-ink-50 p-4" accessibilityRole="progressbar">
      <Text className="font-body text-sm text-ink-500">{message}</Text>
    </View>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <View className="rounded-2xl border border-vermillion-200 bg-vermillion-50 p-4" accessibilityRole="alert">
      <Text className="font-body text-sm text-vermillion-700">{message}</Text>
    </View>
  );
}
