import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
    PanResponder,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { NavBar } from "./inicio";

const eventos = [
  {
    genero: "🎵 Danzón",
    nombre: "Salón Los Ángeles",
    fecha: "Sábado 1 de marzo",
    hora: "10 de la mañana",
    lugar: "Tlatelolco, CDMX",
    van: 42,
  },
  {
    genero: "🎺 Salsa",
    nombre: "Casa de la Cultura",
    fecha: "Domingo 2 de marzo",
    hora: "6 de la tarde",
    lugar: "Coyoacán, CDMX",
    van: 28,
  },
  {
    genero: "💃 Danzón",
    nombre: "Salón México",
    fecha: "Lunes 3 de marzo",
    hora: "11 de la mañana",
    lugar: "Centro, CDMX",
    van: 19,
  },
  {
    genero: "🪗 Cumbia",
    nombre: "Foro Cultural Tepito",
    fecha: "Martes 4 de marzo",
    hora: "5 de la tarde",
    lugar: "Tepito, CDMX",
    van: 31,
  },
];

export default function EventosCerca() {
  const router = useRouter();
  const [actual, setActual] = useState(0);
  const [guardados, setGuardados] = useState<number[]>([]);
  const swipeRef = useRef(0);

  const ev = eventos[actual];
  const yaGuardado = guardados.includes(actual);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (_, g) => {
      swipeRef.current = g.x0;
    },
    onPanResponderRelease: (_, g) => {
      const diff = g.moveX - swipeRef.current;
      if (diff < -40 && actual < eventos.length - 1) setActual(actual + 1);
      if (diff > 40 && actual > 0) setActual(actual - 1);
    },
  });

  function guardar() {
    if (!yaGuardado) setGuardados([...guardados, actual]);
  }

  return (
    <View style={s.screen}>
      <View style={s.header}>
        <Text style={s.eyebrow}>Cerca de usted</Text>
        <Text style={s.title}>Eventos esta semana</Text>
        <View style={s.dotsRow}>
          {eventos.map((_, i) => (
            <View key={i} style={[s.dot, i === actual && s.dotActive]} />
          ))}
          <Text style={s.counter}>
            {actual + 1} de {eventos.length}
          </Text>
        </View>
      </View>

      <View style={s.body} {...panResponder.panHandlers}>
        <View style={[s.card, yaGuardado && s.cardGuardado]}>
          <View style={s.cardTop}>
            <View style={s.tag}>
              <Text style={s.tagText}>{ev.genero}</Text>
            </View>
            {yaGuardado && (
              <View style={s.savedBadge}>
                <Text style={s.savedText}>⭐ Guardado</Text>
              </View>
            )}
          </View>

          <Text style={s.nombre}>{ev.nombre}</Text>

          <View style={s.infoBlock}>
            <View style={s.infoRow}>
              <View style={s.icon}>
                <Text>📅</Text>
              </View>
              <View>
                <Text style={s.infoLabel}>Fecha</Text>
                <Text style={s.infoVal}>{ev.fecha}</Text>
              </View>
            </View>
            <View style={s.divider} />
            <View style={s.infoRow}>
              <View style={s.icon}>
                <Text>🕙</Text>
              </View>
              <View>
                <Text style={s.infoLabel}>Hora</Text>
                <Text style={s.infoVal}>{ev.hora}</Text>
              </View>
            </View>
            <View style={s.divider} />
            <View style={s.infoRow}>
              <View style={s.icon}>
                <Text>📍</Text>
              </View>
              <View>
                <Text style={s.infoLabel}>Lugar</Text>
                <Text style={s.infoVal}>{ev.lugar}</Text>
              </View>
            </View>
          </View>

          <View style={s.going}>
            <Text style={s.goingLabel}>Van a ir</Text>
            <Text style={s.goingNum}>{ev.van}</Text>
          </View>

          {yaGuardado && (
            <View style={s.confirmBox}>
              <Text style={s.confirmTitle}>✓ Lo guardamos para usted</Text>
              <Text style={s.confirmSub}>Le avisaremos el día anterior</Text>
            </View>
          )}
        </View>

        {actual === 0 && !yaGuardado ? (
          <View style={s.swipeHint}>
            <Text style={s.swipeHand}>👈</Text>
            <View>
              <Text style={s.swipeTitle}>Deslice hacia la izquierda</Text>
              <Text style={s.swipeSub}>para ver más eventos</Text>
            </View>
          </View>
        ) : (
          <View style={s.swipeSmall}>
            {actual > 0 && <Text style={s.swipeArrow}>👉</Text>}
            <Text style={s.swipeSmallText}>Deslice para ver más</Text>
            {actual < eventos.length - 1 && (
              <Text style={s.swipeArrow}>👈</Text>
            )}
          </View>
        )}

        <TouchableOpacity
          style={[s.btn, yaGuardado && s.btnDone]}
          onPress={guardar}
          disabled={yaGuardado}
        >
          <Text style={s.btnText}>
            {yaGuardado ? "⭐  Ya guardado" : "⭐  Me interesa"}
          </Text>
        </TouchableOpacity>
      </View>

      <NavBar active="buscar" />
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5EDE0" },
  header: { backgroundColor: "#8B1A1A", padding: 28, paddingBottom: 20 },
  eyebrow: {
    fontSize: 14,
    fontWeight: "700",
    color: "rgba(245,237,224,0.5)",
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: { fontSize: 30, color: "#F5EDE0", fontWeight: "400", lineHeight: 38 },
  dotsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(245,237,224,0.3)",
  },
  dotActive: { width: 24, backgroundColor: "#F5EDE0" },
  counter: {
    marginLeft: 4,
    fontSize: 13,
    color: "rgba(245,237,224,0.45)",
    fontWeight: "700",
  },
  body: { flex: 1, padding: 20, gap: 12 },
  card: {
    backgroundColor: "#FFFDF9",
    borderRadius: 22,
    padding: 22,
    gap: 14,
    borderWidth: 1.5,
    borderColor: "#E8D5BC",
  },
  cardGuardado: { borderWidth: 2.5, borderColor: "#4E8963" },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tag: {
    backgroundColor: "#F5EAEA",
    borderRadius: 30,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  tagText: { color: "#8B1A1A", fontSize: 14, fontWeight: "700" },
  savedBadge: {
    backgroundColor: "#EAF2ED",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  savedText: { fontSize: 13, fontWeight: "800", color: "#4E8963" },
  nombre: { fontSize: 26, color: "#2A1A1A", fontWeight: "400", lineHeight: 32 },
  infoBlock: {
    backgroundColor: "#F5EDE0",
    borderRadius: 16,
    padding: 16,
    gap: 0,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 4,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F5EAEA",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: { height: 1, backgroundColor: "#E8D5BC", marginVertical: 6 },
  infoLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#C4A882",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  infoVal: { fontSize: 18, fontWeight: "700", color: "#2A1A1A" },
  going: {
    backgroundColor: "#EAF2ED",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goingLabel: { fontSize: 17, fontWeight: "700", color: "#4E8963" },
  goingNum: { fontSize: 34, fontWeight: "600", color: "#4E8963" },
  confirmBox: {
    backgroundColor: "#EAF2ED",
    borderRadius: 14,
    padding: 16,
    gap: 4,
  },
  confirmTitle: { fontSize: 17, fontWeight: "800", color: "#4E8963" },
  confirmSub: { fontSize: 14, color: "#4E8963", opacity: 0.8 },
  swipeHint: {
    backgroundColor: "#8B1A1A",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  swipeHand: { fontSize: 32 },
  swipeTitle: { fontSize: 17, fontWeight: "800", color: "#F5EDE0" },
  swipeSub: { fontSize: 14, color: "rgba(245,237,224,0.6)", marginTop: 2 },
  swipeSmall: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(139,26,26,0.08)",
    borderRadius: 14,
    padding: 12,
  },
  swipeArrow: { fontSize: 20 },
  swipeSmallText: { fontSize: 15, color: "#7A5050", fontWeight: "700" },
  btn: {
    backgroundColor: "#4E8963",
    borderRadius: 18,
    paddingVertical: 22,
    alignItems: "center",
  },
  btnDone: { backgroundColor: "#8B1A1A", opacity: 0.45 },
  btnText: { color: "white", fontSize: 22, fontWeight: "800" },
});
