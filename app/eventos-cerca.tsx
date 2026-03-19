import { useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
  ImageBackground,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../firebaseConfig";
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

// Estos datos servirán de "respaldo" mientras carga internet o si falla la conexión
const EVENTOS_INICIALES: Evento[] = [
  {
    id: "inicial-ciudade",
    genero: " Danzón",
    nombre: "Plaza de la Ciudadela",
    fecha: "Cada Domingo",
    hora: "11:00 de la mañana",
    lugar: "Balderas, Centro",
    van: 158,
    imagen:
      "https://interactivo.eluniversal.com.mx/mochilazo-tiempo/interiores/ciudadelaA.jpg",
  },
  {
    id: "inicial-venados",
    genero: " Danzón",
    nombre: "Parque de los Venados",
    fecha: "Cada Domingo",
    hora: "12:00 del día",
    lugar: "Benito Juárez",
    van: 94,
    imagen:
      "https://images.unsplash.com/photo-1589218149378-184954a33986?q=80&w=800",
  },
  {
    id: "inicial-alameda",
    genero: "🎩 Danzón",
    nombre: "Alameda del Sur",
    fecha: "Cada Domingo",
    hora: "4:00 de la tarde",
    lugar: "Coyoacán",
    van: 65,
    imagen:
      "https://images.unsplash.com/photo-1611928543823-39e7d683f549?q=80&w=800",
  },
  {
    id: "inicial-jardin",
    genero: "🎩 Danzón",
    nombre: "Jardín Adultos Mayores",
    fecha: "Cada Domingo",
    hora: "11:00 de la mañana",
    lugar: "Bosque de Chapultepec",
    van: 42,
    imagen:
      "https://images.unsplash.com/photo-1554422319-999511003734?q=80&w=800",
  },
];

export default function EventosCerca() {
  const router = useRouter();
  // 1. Convertimos los eventos en un estado para poder actualizarlos desde internet
  const [eventos, setEventos] = useState<Evento[]>(EVENTOS_INICIALES);
  const { isEventSaved, toggleSaveEvent } = useUser();
  const [actual, setActual] = useState(0);
  const swipeRef = useRef(0);

  const ev = eventos[actual];
  const yaGuardado = ev ? isEventSaved(ev.id) : false;

  // 2. Usamos useEffect para conectar al sitio web al iniciar la pantalla
  useEffect(() => {
    obtenerEventosWeb();
  }, []);

  async function obtenerEventosWeb() {
    try {
      console.log("Conectando a Firebase...");
      // Referencia a la colección 'eventos' en tu base de datos
      const querySnapshot = await getDocs(collection(db, "eventos"));

      // Convertimos los documentos de Firebase a un array con ID
      const eventosFirebase: Evento[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          genero: data.genero || "Baile",
          nombre: data.nombre || "Evento sin nombre",
          fecha: data.fecha || "Fecha no disponible",
          hora: data.hora || "Hora no disponible",
          lugar: data.lugar || "Lugar no disponible",
          van: data.van || 0,
          // Si no hay imagen en Firebase, usamos una por defecto para que no se vea vacío
          imagen: data.imagen || "https://images.unsplash.com/photo-1519225421980-715cb0215aED?q=80&w=800",
        };
      });

      if (eventosFirebase.length > 0) {
        // Para evitar duplicados, filtramos los eventos de ejemplo que ya podrían estar en Firebase (por nombre)
        const nombresFirebase = new Set(eventosFirebase.map(e => e.nombre));
        const eventosInicialesFiltrados = EVENTOS_INICIALES.filter(e => !nombresFirebase.has(e.nombre));
        // Combinamos los eventos de Firebase con los de respaldo para tener una lista más completa
        setEventos([...eventosFirebase, ...eventosInicialesFiltrados]);
      }
      
    } catch (error) {
      console.error("Error conectando al sitio web:", error);
      // Si falla, la app seguirá mostrando los EVENTOS_INICIALES sin romperse
    }
  }

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
    if (ev) toggleSaveEvent(ev.id);
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
            {actual < eventos.length - 1 && (
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
