import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ImageBackground,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useUser } from "./UserContext";
import { NavBar } from "./inicio";

interface Evento {
  id: string;
  genero: string;
  nombre: string;
  fecha: string;
  hora: string;
  lugar: string;
  van: number;
  imagen: string;
}

export default function EventosCerca() {
  const router = useRouter();
  const { isEventSaved, toggleSaveEvent, allEvents, loadingEvents } = useUser();
  const [actual, setActual] = useState(0);
  const swipeRef = useRef(0);

  // Usamos los eventos del contexto central
  const ev = allEvents[actual];
  const yaGuardado = ev ? isEventSaved(ev.id) : false;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (_, g) => {
      swipeRef.current = g.x0;
    },
    onPanResponderRelease: (_, g) => {
      const diff = g.moveX - swipeRef.current;
      if (diff < -40 && actual < allEvents.length - 1) setActual(actual + 1);
      if (diff > 40 && actual > 0) setActual(actual - 1);
    },
  });

  function guardar() {
    if (ev) toggleSaveEvent(ev.id);
  }

  // Mostramos un indicador de carga si los eventos aún no están listos
  if (loadingEvents || !ev) {
    // Podemos mostrar un loader más elegante o simplemente una vista vacía
    return <View style={s.screen}><NavBar active="buscar" /></View>;
  }

  return (
    <View style={s.screen}>
      <View style={s.header}>
        <Text style={s.eyebrow}>Cerca de usted</Text>
        <Text style={s.title}>Eventos esta semana</Text>
        <View style={s.dotsRow}>
          {allEvents.map((_, i) => (
            <View key={i} style={[s.dot, i === actual && s.dotActive]} />
          ))}
          <Text style={s.counter}>
            {actual + 1} de {allEvents.length}
          </Text>
        </View>
      </View>

      <View style={s.body} {...panResponder.panHandlers}>
        <ImageBackground
          source={{ uri: ev.imagen }}
          style={[s.card, yaGuardado && s.cardGuardado]}
          imageStyle={s.cardImage}
        >
          <View style={s.cardOverlay}>
            <View style={s.cardTop}>
              <View style={s.tag}>
                <Text style={s.tagText}>{ev.genero}</Text>
              </View>
              {yaGuardado && (
                <View style={s.savedBadge}>
                  <Text style={s.savedText}>🔖 Guardado</Text>
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
        </ImageBackground>

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
            {actual < allEvents.length - 1 && (
              <Text style={s.swipeArrow}>👈</Text>
            )}
          </View>
        )}

        <TouchableOpacity
          style={[s.btn, yaGuardado && s.btnDone]}
          onPress={guardar}
        >
          <Text style={s.btnText}>
            {yaGuardado ? "✓ Guardado" : "🔖  Me interesa"}
          </Text>
        </TouchableOpacity>
      </View>

      <NavBar active="buscar" />
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5EDE0" },
  header: { backgroundColor: "#4A6C9B", padding: 28, paddingBottom: 20 },
  eyebrow: {
    fontSize: 17,
    fontWeight: "700",
    color: "rgba(245,237,224,0.5)",
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: { fontSize: 36, color: "#F5EDE0", fontWeight: "400", lineHeight: 44 },
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
    fontSize: 16,
    color: "rgba(245,237,224,0.45)",
    fontWeight: "700",
  },
  body: { flex: 1, padding: 20, gap: 12 },
  card: {
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "#E8D5BC",
    overflow: "hidden",
    flex: 1,
  },
  cardGuardado: { borderWidth: 2.5, borderColor: "#4E8963" },
  cardImage: {
    resizeMode: "cover",
  },
  cardOverlay: {
    flex: 1,
    backgroundColor: "rgba(42, 26, 26, 0.65)",
    padding: 22,
    gap: 14,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tag: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 30,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  tagText: { color: "#F5EDE0", fontSize: 17, fontWeight: "700" },
  savedBadge: {
    backgroundColor: "rgba(78, 137, 99, 0.8)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  savedText: { fontSize: 16, fontWeight: "800", color: "#EAF2ED" },
  nombre: { fontSize: 32, color: "#F5EDE0", fontWeight: "400", lineHeight: 40 },
  infoBlock: {
    backgroundColor: "rgba(0,0,0,0.2)",
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
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: { height: 1, backgroundColor: "rgba(255,255,255,0.15)", marginVertical: 6 },
  infoLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "rgba(245, 237, 224, 0.7)",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  infoVal: { fontSize: 22, fontWeight: "700", color: "#F5EDE0" },
  going: {
    backgroundColor: "rgba(78, 137, 99, 0.3)",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goingLabel: { fontSize: 21, fontWeight: "700", color: "#EAF2ED" },
  goingNum: { fontSize: 40, fontWeight: "600", color: "#FFFFFF" },
  confirmBox: {
    backgroundColor: "rgba(78, 137, 99, 0.8)",
    borderRadius: 14,
    padding: 16,
    gap: 4,
  },
  confirmTitle: { fontSize: 20, fontWeight: "800", color: "#EAF2ED" },
  confirmSub: { fontSize: 17, color: "#EAF2ED", opacity: 0.9 },
  swipeHint: {
    backgroundColor: "#4A6C9B",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  swipeHand: { fontSize: 36 },
  swipeTitle: { fontSize: 20, fontWeight: "800", color: "#F5EDE0" },
  swipeSub: { fontSize: 17, color: "rgba(245,237,224,0.6)", marginTop: 2 },
  swipeSmall: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(74, 108, 155, 0.08)",
    borderRadius: 14,
    padding: 12,
  },
  swipeArrow: { fontSize: 20 },
  swipeSmallText: { fontSize: 18, color: "#5C6B7F", fontWeight: "700" },
  btn: {
    backgroundColor: "#4E8963",
    borderRadius: 18,
    paddingVertical: 22,
    alignItems: "center",
  },
  btnDone: { backgroundColor: "#4A6C9B" },
  btnText: { color: "white", fontSize: 26, fontWeight: "800" },
});
