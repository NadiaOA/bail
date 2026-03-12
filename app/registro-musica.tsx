// ── ARCHIVO: app/registro-musica.tsx ─────────────────────────
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useUser } from "./UserContext";

const GENEROS = [
  { id: "danzon", emoji: "💃", nombre: "Danzón" },
  { id: "salsa", emoji: "🎺", nombre: "Salsa" },
  { id: "cumbia", emoji: "🪗", nombre: "Cumbia" },
  { id: "mambo", emoji: "🎷", nombre: "Mambo" },
];

export default function RegistroMusica() {
  const router = useRouter();
  const [seleccion, setSeleccion] = useState<string[]>([]);
  const { updateProfile } = useUser();

  const toggle = (id: string) => {
    setSeleccion((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  function handleNext() {
    if (seleccion.length === 0) return;
    const generosSeleccionados = GENEROS.filter((g) =>
      seleccion.includes(g.id)
    ).map((g) => g.nombre);
    updateProfile({ musica: generosSeleccionados });
    router.push("/inicio" as any);
  }

  return (
    <View style={s.screen}>
      <View style={s.header}>
        <Text style={s.step}>Paso 3 de 3</Text>
        <Text style={s.title}>¿Qué música le gusta bailar?</Text>
        <View style={s.progress}>
          <View style={[s.dot, s.dotDone]} />
          <View style={[s.dot, s.dotDone]} />
          <View style={[s.dot, s.dotActive]} />
        </View>
      </View>

      <View style={s.body}>
        <View style={s.top}>
          {GENEROS.map((g) => (
            <TouchableOpacity
              key={g.id}
              style={[s.option, seleccion.includes(g.id) && s.optionSelected]}
              onPress={() => toggle(g.id)}
            >
              <Text style={s.emoji}>{g.emoji}</Text>
              <Text
                style={[s.nombre, seleccion.includes(g.id) && s.nombreSelected]}
              >
                {g.nombre}
              </Text>
              {seleccion.includes(g.id) && <Text style={s.check}>✓</Text>}
            </TouchableOpacity>
          ))}
          <Text style={s.hint}>Puede elegir más de uno</Text>
        </View>

        <TouchableOpacity
          style={[s.btn, seleccion.length === 0 && s.btnDisabled]}
          onPress={handleNext}
        >
          <Text style={s.btnText}>¡Listo! Entrar 🍄</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5EDE0" },
  header: {
    backgroundColor: "#8B1A1A",
    paddingTop: 60,
    paddingHorizontal: 26,
    paddingBottom: 32,
  },
  step: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "rgba(245,237,224,0.5)",
    marginBottom: 8,
  },
  title: { fontSize: 34, color: "#F5EDE0", lineHeight: 42 },
  progress: { flexDirection: "row", gap: 8, marginTop: 16 },
  dot: { height: 5, borderRadius: 3, flex: 1, maxWidth: 56 },
  dotDone: { backgroundColor: "rgba(245,237,224,0.9)" },
  dotActive: { backgroundColor: "#F5EDE0" },
  body: { flex: 1, padding: 24, justifyContent: "space-between" },
  top: { gap: 12 },
  option: {
    backgroundColor: "#FFFDF9",
    borderRadius: 18,
    borderWidth: 2.5,
    borderColor: "#E8D5BC",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  optionSelected: { borderColor: "#8B1A1A", backgroundColor: "#F5EAEA" },
  emoji: { fontSize: 30 },
  nombre: { fontSize: 24, fontWeight: "700", color: "#2A1A1A", flex: 1 },
  nombreSelected: { color: "#8B1A1A" },
  check: { fontSize: 22, color: "#8B1A1A", fontWeight: "800" },
  hint: {
    fontSize: 17,
    color: "#7A5050",
    textAlign: "center",
    lineHeight: 26,
    fontWeight: "500",
  },
  btn: {
    backgroundColor: "#4E8963",
    borderRadius: 18,
    paddingVertical: 22,
    alignItems: "center",
  },
  btnDisabled: { opacity: 0.4 },
  btnText: { fontSize: 24, fontWeight: "800", color: "white" },
});
