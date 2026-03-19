import { useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../firebaseConfig";
import { useUser } from "./UserContext";

// --- CONFIG ---
const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const HEADER_HEIGHT = 140;
const NAV_BAR_HEIGHT = 100;

interface Evento {
  id: string;
  nombre: string;
  genero: string;
  fecha: string;
  hora: string;
  lugar: string;
  van: number;
  imagen: string;
}

const EVENTOS_INICIALES: Evento[] = [
  {
    id: "sla-1",
    nombre: "Salón Los Ángeles",
    genero: "Danzón",
    fecha: "Sábado 1 de marzo",
    hora: "10 de la mañana",
    lugar: "Tlatelolco, CDMX",
    van: 42,
    imagen:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/23/f3/ae/2d/caption.jpg?w=1200&h=1200&s=1",
  },
];

// --- CARD ---
const EventoCard = ({ evento }: { evento: Evento }) => {
  const router = useRouter();
  const { isEventSaved, toggleSaveEvent } = useUser();
  const confirmado = isEventSaved(evento.id);

  return (
    <View style={s.card}>
      <View style={s.imageContainer}>
        <Image source={{ uri: evento.imagen }} style={s.cardImage} />
        <View style={s.tag}>
          <Text style={s.tagText}>🎵 {evento.genero}</Text>
        </View>
      </View>

      <View style={s.textContainer}>
        <ScrollView
          contentContainerStyle={[s.bodyContent, { paddingBottom: 120 }]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={s.eventName}>{evento.nombre}</Text>

          <View style={s.infoBlock}>
            <View style={s.infoRow}>
              <View style={s.icon}>
                <Text style={s.iconText}>📅</Text>
              </View>
              <View>
                <Text style={s.infoLabel}>Fecha</Text>
                <Text style={s.infoVal}>{evento.fecha}</Text>
              </View>
            </View>

            <View style={s.divider} />

            <View style={s.infoRow}>
              <View style={s.icon}>
                <Text style={s.iconText}>🕙</Text>
              </View>
              <View>
                <Text style={s.infoLabel}>Hora</Text>
                <Text style={s.infoVal}>{evento.hora}</Text>
              </View>
            </View>
          </View>

          <View style={s.goingBadge}>
            <Text style={s.goingLabel}>Van a ir</Text>
            <Text style={s.goingNum}>
              {confirmado ? evento.van + 1 : evento.van}
            </Text>
          </View>

          {confirmado ? (
            <TouchableOpacity
              style={s.confirmBox}
              onPress={() => toggleSaveEvent(evento.id)}
            >
              <Text style={s.confirmTitle}>✓ ¡Ya estás anotado!</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={s.btnSage}
              onPress={() => toggleSaveEvent(evento.id)}
            >
              <Text style={s.btnSageText}>✓ ¡Yo también voy!</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={s.btnGhost}
            onPress={() =>
              router.push({
                pathname: "/detalle-evento",
                params: { evento: JSON.stringify(evento) },
              })
            }
          >
            <Text style={s.btnGhostText}>Ver más detalles</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

// --- SCREEN ---
export default function Inicio() {
  const { profile } = useUser();
  const [eventos, setEventos] = useState<Evento[]>(EVENTOS_INICIALES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerEventosWeb();
  }, []);

  async function obtenerEventosWeb() {
    try {
      const querySnapshot = await getDocs(collection(db, "eventos"));
      const eventosFirebase: Evento[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          nombre: data.nombre || "Evento sin nombre",
          genero: data.genero || "Baile",
          fecha: data.fecha || "Fecha no disponible",
          hora: data.hora || "Hora no disponible",
          lugar: data.lugar || "Lugar no disponible",
          van: data.van || 0,
          imagen:
            data.imagen ||
            "https://images.unsplash.com/photo-1519225421980-715cb0215aED?q=80&w=800",
        };
      });
      if (eventosFirebase.length > 0) setEventos(eventosFirebase);
    } catch (error) {
      console.error("Error Firebase:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={s.screen}>
      <StatusBar barStyle="light-content" />

      <View style={s.headerFrame}>
        <Text style={s.greeting}>Buenos días, {profile.nombre}</Text>
        <Text style={s.title}>Próximos Eventos</Text>
      </View>

      <View style={s.contentFrame}>
        {loading ? (
          <View style={s.loadingContainer}>
            <ActivityIndicator size="large" color="#4A6C9B" />
          </View>
        ) : (
          <FlatList
            data={eventos}
            renderItem={({ item }) => <EventoCard evento={item} />}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
          />
        )}
      </View>

      <View style={s.navFrame}>
        <NavBar active="inicio" />
      </View>
    </View>
  );
}

// --- NAVBAR ---
export function NavBar({ active }: { active: string }) {
  const router = useRouter();
  const items = [
    { id: "inicio", icon: "⌂", label: "Inicio", ruta: "/inicio" },
    { id: "buscar", icon: "🔍", label: "Buscar", ruta: "/buscar" },
    { id: "guardados", icon: "🔖", label: "Guardados", ruta: "/guardados" },
    { id: "perfil", icon: "👤", label: "Perfil", ruta: "/perfil" },
  ];

  return (
    <View style={nav.bar}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={nav.btn}
          onPress={() => router.replace(item.ruta as any)}
        >
          <Text style={[nav.icon, active === item.id && nav.iconOn]}>
            {item.icon}
          </Text>
          <Text style={[nav.label, active === item.id && nav.labelOn]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// --- STYLES ---
const nav = StyleSheet.create({
  bar: {
    flex: 1,
    backgroundColor: "rgba(74,108,155,0.95)",
    flexDirection: "row",
    paddingBottom: 20,
  },
  btn: { flex: 1, alignItems: "center", justifyContent: "center" },
  icon: { fontSize: 32, color: "#F5EDE0", opacity: 0.5 },
  iconOn: { opacity: 1 },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(245,237,224,0.5)",
    marginTop: 2,
  },
  labelOn: { color: "#F5EDE0" },
});

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5EDE0" },

  headerFrame: {
    height: HEADER_HEIGHT,
    backgroundColor: "#4A6C9B",
    paddingTop: 60,
    paddingHorizontal: 25,
    justifyContent: "center",
  },

  contentFrame: { flex: 1 },

  navFrame: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: NAV_BAR_HEIGHT,
  },

  greeting: { fontSize: 18, color: "rgba(245,237,224,0.8)" },
  title: { fontSize: 32, color: "#F5EDE0", fontWeight: "bold" },

  card: { width: "100%", backgroundColor: "#F5EDE0" },

  imageContainer: { height: 250 },
  cardImage: { width: "100%", height: "100%" },

  tag: {
    position: "absolute",
    bottom: 15,
    left: 15,
    backgroundColor: "#4A6C9B",
    padding: 10,
    borderRadius: 8,
  },

  tagText: { color: "white", fontWeight: "bold" },

  textContainer: {
    backgroundColor: "#F5EDE0",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -25,
    paddingTop: 15,
  },

  bodyContent: { paddingHorizontal: 25, gap: 15 },

  eventName: { fontSize: 28, fontWeight: "bold" },

  infoBlock: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 18,
  },

  infoRow: { flexDirection: "row", gap: 15 },

  icon: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#4A6C9B",
    justifyContent: "center",
    alignItems: "center",
  },

  iconText: { fontSize: 22 },

  infoLabel: { fontSize: 13, color: "#666" },
  infoVal: { fontSize: 18, fontWeight: "bold" },

  divider: { height: 1, backgroundColor: "#eee", marginVertical: 10 },

  goingBadge: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#4E8963",
  },

  goingLabel: { fontSize: 18 },
  goingNum: { fontSize: 32, fontWeight: "bold" },

  btnSage: {
    backgroundColor: "#4E8963",
    padding: 18,
    borderRadius: 20,
    alignItems: "center",
  },

  btnSageText: { color: "white", fontSize: 20 },

  confirmBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#4E8963",
  },

  confirmTitle: { fontSize: 18, color: "#4E8963" },

  btnGhost: {
    padding: 18,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#4A6C9B",
  },

  btnGhostText: { color: "#4A6C9B", fontSize: 18 },

  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});

