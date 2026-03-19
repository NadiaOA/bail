import { useRouter } from "expo-router";
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

const { height } = Dimensions.get("window");

/**
 * Componente para renderizar la tarjeta de un solo evento.
 * Ocupa el alto de la pantalla y permite scroll interno si el contenido es muy largo.
 */
const EventoCard = ({ evento }: { evento: Evento }) => {
  const router = useRouter();
  const { isEventSaved, toggleSaveEvent } = useUser();
  const confirmado = isEventSaved(evento.id);

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
            <Text style={s.goingNum}>
              {confirmado ? evento.van + 1 : evento.van}
            </Text>
          </View>

          {confirmado ? (
            <TouchableOpacity
              style={s.confirmBox}
              onPress={() => toggleSaveEvent(evento.id)}
            >
              <Text style={s.confirmTitle}>✓ ¡Ya está anotado!</Text>
              <Text style={s.confirmSub}>Pulse aquí para cancelar</Text>
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
    </ImageBackground>
  );
};

export default function Inicio() {
  const router = useRouter();
  const { profile, allEvents, loadingEvents } = useUser();

  return (
    <View style={s.screen}>
      {loadingEvents ? (
        <View style={s.loadingContainer}>
          <ActivityIndicator size="large" color="#4A6C9B" />
          <Text style={s.loadingText}>Cargando eventos...</Text>
        </View>
      ) : (
        <FlatList
          data={allEvents}
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
    backgroundColor: "#4A6C9B",
    flexDirection: "row",
    paddingTop: 12,
    paddingBottom: 28,
  },
  btn: { flex: 1, alignItems: "center", gap: 4 },
  icon: { fontSize: 28, color: "#F5EDE0", opacity: 1 },
  iconOn: { opacity: 1 },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#6BA882",
    marginTop: 2,
  },
  label: {
    fontSize: 12,
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
    backgroundColor: "rgba(74, 108, 155, 0.85)", // Un poco transparente
    padding: 28,
    paddingTop: 50, // Más padding para Safe Area
    paddingBottom: 20,
    zIndex: 10,
  },
  greeting: {
    fontSize: 17,
    fontWeight: "700",
    color: "rgba(245,237,224,0.7)",
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: { fontSize: 36, color: "#F5EDE0", fontWeight: "400", lineHeight: 44 },
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
  tagText: { color: "#F5EDE0", fontSize: 17, fontWeight: "700" },
  eventName: {
    fontSize: 36,
    color: "#F5EDE0",
    fontWeight: "400",
    lineHeight: 44,
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
    fontSize: 16,
    fontWeight: "700",
    color: "rgba(245, 237, 224, 0.7)",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  infoVal: { fontSize: 24, fontWeight: "700", color: "#F5EDE0" },
  goingBadge: {
    backgroundColor: "rgba(78, 137, 99, 0.3)",
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goingLabel: { fontSize: 22, fontWeight: "700", color: "#EAF2ED" },
  goingNum: { fontSize: 46, fontWeight: "600", color: "#FFFFFF" },
  btnSage: {
    backgroundColor: "#4E8963",
    borderRadius: 18,
    paddingVertical: 22,
    alignItems: "center",
  },
  btnSageText: { color: "white", fontSize: 26, fontWeight: "800" },
  confirmBox: {
    backgroundColor: "#EAF2ED",
    borderRadius: 18,
    padding: 22,
    alignItems: "center",
    gap: 6,
  },
  confirmTitle: { fontSize: 26, fontWeight: "800", color: "#4E8963" },
  confirmSub: { fontSize: 18, color: "#4E8963", opacity: 0.8 },
  btnGhost: {
    borderWidth: 2.5,
    borderColor: "rgba(255,255,255,0.4)",
    borderRadius: 18,
    paddingVertical: 20,
    alignItems: "center",
    marginTop: -4,
  },
  btnGhostText: {
    color: "#F5EDE0",
    fontSize: 22,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5EDE0",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 19,
    color: "#5C6B7F",
  },
  navBarContainer: { position: "absolute", bottom: 0, left: 0, right: 0 },
});
