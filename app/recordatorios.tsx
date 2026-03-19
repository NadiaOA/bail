import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const avisos = [
  {
    tipo: "nuevo",
    icono: "🍄",
    titulo: "¡Mañana es el danzón!",
    mensaje:
      "La esperamos en el Salón Los Ángeles a las 10 de la mañana. Ya van 42 personas.",
    tiempo: "Hace 10 minutos",
  },
  {
    tipo: "ok",
    icono: "✓",
    titulo: "¡Ya confirmó su asistencia!",
    mensaje: "Salón Los Ángeles el sábado.",
    tiempo: "Ayer",
  },
  {
    tipo: "normal",
    icono: "🎵",
    titulo: "Nuevo evento cerca de usted",
    mensaje: "Salón México, danzón el domingo a las 11.",
    tiempo: "Hace 2 días",
  },
];

export default function Recordatorios() {
  const router = useRouter();

  return (
    <View style={s.screen}>
      <View style={s.header}>
        <TouchableOpacity style={s.back} onPress={() => router.back()}>
          <Text style={s.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={s.eyebrow}>Sus avisos</Text>
        <Text style={s.title}>Recordatorios</Text>
      </View>

      <ScrollView style={s.body} contentContainerStyle={s.bodyContent}>
        {avisos.map((av, i) => (
          <View key={i} style={[s.card, av.tipo === "nuevo" && s.cardNew]}>
            <View
              style={[s.iconBox, av.tipo === "ok" ? s.iconSage : s.iconBlue]}
            >
              <Text style={s.iconText}>{av.icono}</Text>
            </View>
            <View style={s.cardBody}>
              <Text style={s.cardTitulo}>{av.titulo}</Text>
              <Text style={s.cardMsg}>{av.mensaje}</Text>
              <Text style={s.cardTime}>{av.tiempo}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5EDE0" },
  header: { backgroundColor: "#4A6C9B", padding: 28, paddingBottom: 32 },
  back: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 12,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  backText: { color: "#F5EDE0", fontSize: 36, lineHeight: 40 },
  eyebrow: {
    fontSize: 15,
    fontWeight: "700",
    color: "rgba(245,237,224,0.5)",
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: { fontSize: 32, color: "#F5EDE0", fontWeight: "400", lineHeight: 40 },
  body: { flex: 1 },
  bodyContent: { padding: 24, gap: 14 },
  card: {
    backgroundColor: "#FFFDF9",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",
    borderWidth: 1.5,
    borderColor: "#E8D5BC",
  },
  cardNew: { borderLeftWidth: 5, borderLeftColor: "#4A6C9B", borderWidth: 0 },
  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBlue: { backgroundColor: "#E8EFF5" },
  iconSage: { backgroundColor: "#EAF2ED" },
  iconText: { fontSize: 26 },
  cardBody: { flex: 1 },
  cardTitulo: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2A1A1A",
    marginBottom: 6,
    lineHeight: 26,
  },
  cardMsg: { fontSize: 18, color: "#5C6B7F", lineHeight: 26 },
  cardTime: { fontSize: 13, color: "#8A9CB3", fontWeight: "700", marginTop: 8 },
});
