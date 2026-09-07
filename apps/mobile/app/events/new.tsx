import { Link, Stack } from "expo-router";
import { SafeAreaView, Text, View } from "react-native";
import { AppHeader } from "~/components/ui/AppHeader";
import { T } from "~/components/ui/tokens";
import { Sparkle } from "~/components/ui/Sparkle";

interface EventTypeCardProps {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  isAi?: boolean;
}

function EventTypeCard({ href, eyebrow, title, description, isAi }: EventTypeCardProps) {
  return (
    <Link href={href as any} asChild>
      <View
        style={{
          backgroundColor: isAi ? T.ink : T.white,
          borderWidth: isAi ? 2 : 1,
          borderColor: T.ink,
          borderRadius: 20,
          padding: 22,
          gap: 10,
          ...(isAi ? T.stampAi : T.stamp),
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          {isAi && <Sparkle size={14} color={T.spark} />}
          <Text style={{
            fontFamily: T.fontBodySemiBold,
            fontSize: 11,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: isAi ? T.spark : T.ink500,
          }}>
            {eyebrow}
          </Text>
        </View>
        <Text style={{
          fontFamily: T.fontDisplay,
          fontSize: 24,
          letterSpacing: -0.5,
          color: isAi ? T.white : T.ink,
          lineHeight: 28,
        }}>
          {title}
        </Text>
        <Text style={{
          fontFamily: T.fontBody,
          fontSize: 14,
          color: isAi ? T.ink300 : T.ink500,
          lineHeight: 20,
        }}>
          {description}
        </Text>
      </View>
    </Link>
  );
}

export default function NewEventPicker() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.paper }}>
      <Stack.Screen options={{ headerShown: false }} />
      <AppHeader title="Novo evento" />

      <View style={{ flex: 1, padding: 20, gap: 14, justifyContent: "center" }}>
        <Text style={{ fontFamily: T.fontDisplay, fontSize: 32, letterSpacing: -1, color: T.ink, marginBottom: 8 }}>
          Que tipo de evento?
        </Text>

        <EventTypeCard
          href="/events/new-private"
          eyebrow="privado · com IA"
          title="Agendar com a galera"
          description="Você define uma janela e a IA escolhe a melhor data cruzando a disponibilidade de todo mundo."
          isAi
        />

        <EventTypeCard
          href="/events/new-public"
          eyebrow="público · data fixa"
          title="Abrir vagas"
          description="Data e local fixos, lotação máxima. Qualquer pessoa pode se inscrever."
        />
      </View>
    </SafeAreaView>
  );
}
