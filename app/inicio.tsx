import { useRouter } from "expo-router";
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
import { Evento, useUser } from "./UserContext";

// --- CONFIG ---
const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const HEADER_HEIGHT = 140;
const NAV_BAR_HEIGHT = 100;

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
  const { profile, allEvents, loadingEvents } = useUser();

  return (
    <View style={s.screen}>
      <StatusBar barStyle="light-content" />

      <View style={s.headerFrame}>
        <Text style={s.greeting}>Buenos días, {profile.nombre}</Text>
        <Text style={s.title}>Próximos Eventos</Text>
      </View>

      <View style={s.contentFrame}>
        {loadingEvents ? (
          <View style={s.loadingContainer}>
            <ActivityIndicator size="large" color="#4A6C9B" />
          </View>
        ) : (
          <FlatList
            data={allEvents}
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
    height: 140,
    backgroundColor: "#4A6C9B",
    paddingTop: 60,
    paddingHorizontal: 25,
    justifyContent: "center",
  },

  greeting: {
    fontSize: 18,
    color: "rgba(245,237,224,0.8)",
  },

  title: {
    fontSize: 28,
    color: "#F5EDE0",
    fontWeight: "bold",
  },

  contentFrame: { flex: 1 },

  navFrame: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 100,
  },

  card: {
    width: "100%",
    backgroundColor: "#F5EDE0",
  },

  imageContainer: {
    height: 250,
  },

  cardImage: {
    width: "100%",
    height: "100%",
  },

  tag: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "#4A6C9B",
    padding: 8,
    borderRadius: 8,
  },

  tagText: { color: "white" },

  textContainer: {
    backgroundColor: "#F5EDE0",
    padding: 20,
  },

  bodyContent: {
    gap: 15,
  },

  eventName: {
    fontSize: 24,
    fontWeight: "bold",
  },

  infoBlock: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
  },

  infoRow: {
    flexDirection: "row",
    gap: 10,
  },

  icon: {
    backgroundColor: "#4A6C9B",
    padding: 10,
    borderRadius: 10,
  },

  iconText: { color: "white" },

  infoLabel: { fontSize: 12, color: "#666" },

  infoVal: { fontSize: 16, fontWeight: "bold" },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },

  goingBadge: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#EAF2ED",
    padding: 15,
    borderRadius: 10,
  },

  goingLabel: { fontSize: 16 },

  goingNum: { fontSize: 20, fontWeight: "bold" },

  btnSage: {
    backgroundColor: "#4E8963",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  btnSageText: { color: "white", fontWeight: "bold" },

  confirmBox: {
    backgroundColor: "#EAF2ED",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  confirmTitle: { color: "#4E8963", fontWeight: "bold" },

  btnGhost: {
    borderWidth: 1,
    borderColor: "#4A6C9B",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  btnGhostText: {
    color: "#4A6C9B",
    fontWeight: "bold",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
