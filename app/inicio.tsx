import { useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../firebaseConfig";
import { useUser } from "./UserContext";

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

// Usamos los eventos de `eventos-cerca` como respaldo, incluyendo el original
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
  {
    id: "inicial-ciudade",
    genero: " Danzón",
    nombre: "Plaza de la Ciudadela",
    fecha: "Cada Domingo",
    hora: "11:00 de la mañana",
    lugar: "Balderas, Centro",
    van: 158,
    imagen:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/10/b7/cf/ec/parque-de-la-ciudadela.jpg?w=1200&h=1200&s=1"
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
      "https://pbs.twimg.com/media/GQNpmgabIAAV9vd.jpg",
  },
  {
    id: "inicial-alameda",
    nombre: "Alameda Central",
    genero: "Salsa",
    fecha: "Todos los Domingos",
    hora: "A partir de las 12 del mediodía",
    lugar: "Centro Histórico, Bellas Artes, CDMX",
    van: 72,
    imagen:
      "https://mexicocity.cdmx.gob.mx/wp-content/uploads/2023/11/Alameda-Central.jpg",
  },
  {
    id: "inicial-morisco",
    nombre: "Kiosco Morisco",
    genero: "Danzón, Mambo, Salsa",
    fecha: "Todos los Domingos",
    hora: "3 - 8 PM",
    lugar: "Kiosc Morisco, Sta. Maria La Ribera, CDMX",
    van: 36,
    imagen:
      "https://i0.wp.com/godinchilango.mx/wp-content/uploads/2024/06/kiosco-morisco-santa-maria-la-ribera-ciudad-mexico-cdmx_4.jpg?resize=750%2C600&ssl=1",
  },
  // https://i0.wp.com/godinchilango.mx/wp-content/uploads/2024/06/kiosco-morisco-santa-maria-la-ribera-ciudad-mexico-cdmx_4.jpg?resize=750%2C600&ssl=1
];

const { height } = Dimensions.get("window");

/**
 * Componente para renderizar la tarjeta de un solo evento.
 * Ocupa el alto de la pantalla y permite scroll interno si el contenido es muy largo.
 */
const EventoCard = ({ evento }: { evento: Evento }) => {
  const router = useRouter();
  return (
    <ImageBackground
      source={{ uri: evento.imagen }}
      style={s.card}
      imageStyle={s.cardImage}
    >
      <View style={s.cardOverlay}>
        <ScrollView
          style={s.body}
          contentContainerStyle={s.bodyContent}
          alwaysBounceVertical={false}
        >
          <View style={s.tag}>
            <Text style={s.tagText}>🎵 {evento.genero}</Text>
          </View>
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
            <Text style={s.goingNum}>{evento.van}</Text>
          </View>

          <TouchableOpacity
            style={s.btnSage}
            onPress={() =>
              router.push({
                pathname: "/detalle-evento",
                params: { evento: JSON.stringify(evento) },
              })
            }
          >
            <Text style={s.btnSageText}>✓ ¡Yo también voy!</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

export default function Inicio() {
  const router = useRouter();
  const { profile } = useUser();
  const [eventos, setEventos] = useState<Evento[]>(EVENTOS_INICIALES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerEventosWeb();
  }, []);

  async function obtenerEventosWeb() {
    try {
      console.log("Conectando a Firebase para la pantalla de inicio...");
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
          imagen: data.imagen || "https://images.unsplash.com/photo-1519225421980-715cb0215aED?q=80&w=800",
        };
      });

      if (eventosFirebase.length > 0) {
        setEventos(eventosFirebase);
      }
    } catch (error) {
      console.error("Error conectando a Firebase en inicio:", error);
      // Si falla, nos quedamos con los eventos iniciales
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={s.screen}>
      {loading ? (
        <View style={s.loadingContainer}>
          <ActivityIndicator size="large" color="#8B1A1A" />
          <Text style={s.loadingText}>Cargando eventos...</Text>
        </View>
      ) : (
        <FlatList
          data={eventos}
          renderItem={({ item }) => <EventoCard evento={item} />}
          keyExtractor={(item) => item.id}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToAlignment="start"
          decelerationRate="fast"
        />
      )}

      {/* El encabezado se superpone a la lista para un efecto visual limpio */}
      <View style={s.headerAbsolute}>
        <Text style={s.greeting}>Buenos días, {profile.nombre}</Text>
        <Text style={s.title}>Próximos Eventos</Text>
      </View>

      {/* La barra de navegación se mantiene fija en la parte inferior */}
      <View style={s.navBarContainer}>
        <NavBar active="inicio" />
      </View>
    </View>
  );
}

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
          {active === item.id && <View style={nav.dot} />}
          <Text style={[nav.label, active === item.id && nav.labelOn]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const nav = StyleSheet.create({
  // Contenedor para la barra de navegación para posicionarla absolutamente
  navBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  bar: {
    backgroundColor: "#8B1A1A",
    flexDirection: "row",
    paddingTop: 12,
    paddingBottom: 28,
  },
  btn: { flex: 1, alignItems: "center", gap: 3 },
  icon: { fontSize: 24, color: "#F5EDE0", opacity: 1 },
  iconOn: { opacity: 1 },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#6BA882",
    marginTop: -1,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    color: "rgba(245,237,224,0.35)",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  labelOn: { color: "#F5EDE0" },
});

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5EDE0" },
  // El header original se convierte en un header absoluto
  headerAbsolute: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(139, 26, 26, 0.85)", // Un poco transparente
    padding: 28,
    paddingTop: 50, // Más padding para Safe Area
    paddingBottom: 20,
    zIndex: 10,
  },
  greeting: {
    fontSize: 16,
    fontWeight: "700",
    color: "rgba(245,237,224,0.7)",
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: { fontSize: 34, color: "#F5EDE0", fontWeight: "400", lineHeight: 42 },
  body: { flex: 1 },
  bodyContent: {
    padding: 24,
    gap: 16,
    // Añadimos padding para que el contenido no quede debajo de los elementos superpuestos
    paddingTop: 140,
    paddingBottom: 120,
  },
  card: {
    width: "100%",
    height: height,
  },
  cardImage: {
    resizeMode: "cover",
  },
  cardOverlay: {
    flex: 1,
    backgroundColor: "rgba(42, 26, 26, 0.65)",
  },
  tag: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 30,
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignSelf: "flex-start",
  },
  tagText: { color: "#F5EDE0", fontSize: 16, fontWeight: "700" },
  eventName: {
    fontSize: 34,
    color: "#F5EDE0",
    fontWeight: "400",
    lineHeight: 42,
  },
  infoBlock: {
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 20,
    padding: 20,
    gap: 0,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 4,
  },
  icon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: { fontSize: 26 },
  divider: { height: 1, backgroundColor: "rgba(255,255,255,0.15)", marginVertical: 8 },
  infoLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "rgba(245, 237, 224, 0.7)",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  infoVal: { fontSize: 22, fontWeight: "700", color: "#F5EDE0" },
  goingBadge: {
    backgroundColor: "rgba(78, 137, 99, 0.3)",
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goingLabel: { fontSize: 20, fontWeight: "700", color: "#EAF2ED" },
  goingNum: { fontSize: 44, fontWeight: "600", color: "#FFFFFF" },
  btnSage: {
    backgroundColor: "#4E8963",
    borderRadius: 18,
    paddingVertical: 22,
    alignItems: "center",
  },
  btnSageText: { color: "white", fontSize: 24, fontWeight: "800" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5EDE0",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: "#7A5050",
  },
  navBarContainer: { position: "absolute", bottom: 0, left: 0, right: 0 },
});
