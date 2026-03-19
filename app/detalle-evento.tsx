import { useLocalSearchParams, useRouter } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Evento, useUser } from "./UserContext";

export default function DetalleEvento() {
  const router = useRouter();
  const params = useLocalSearchParams<{ evento: string }>();
  const evento: Evento | null = params.evento ? JSON.parse(params.evento) : null;
  const { isEventSaved, toggleSaveEvent } = useUser();
  const confirmado = evento ? isEventSaved(evento.id) : false;

  if (!evento) {
    return (
      <View style={s.screen}>
        <View style={s.header}>
          <TouchableOpacity style={s.back} onPress={() => router.back()}>
            <Text style={s.backText}>‹</Text>
          </TouchableOpacity>
          <Text style={s.title}>Evento no encontrado</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={s.screen}>
      <View style={s.header}>
        <TouchableOpacity style={s.back} onPress={() => router.back()}>
          <Text style={s.backText}>‹</Text>
        </TouchableOpacity>
        <View style={s.tag}>
          <Text style={s.tagText}>🎵 {evento.genero}</Text>
        </View>
        <Text style={s.title}>{evento.nombre}</Text>
      </View>

      <ScrollView style={s.body} contentContainerStyle={s.bodyContent}>
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
          <View style={s.divider} />
          <View style={s.infoRow}>
            <View style={s.icon}>
              <Text style={s.iconText}>📍</Text>
            </View>
            <View>
              <Text style={s.infoLabel}>Lugar</Text>
              <Text style={s.infoVal}>{evento.lugar}</Text>
            </View>
          </View>
        </View>

        <View style={s.goingBadge}>
          <Text style={s.goingLabel}>Van a ir</Text>
          <Text style={s.goingNum}>{confirmado ? evento.van + 1 : evento.van}</Text>
        </View>

        {confirmado ? (
          <TouchableOpacity
            style={s.confirmBox}
            onPress={() => evento && toggleSaveEvent(evento.id)}
          >
            <Text style={s.confirmTitle}>✓ ¡Ya está anotado!</Text>
            <Text style={s.confirmSub}>Pulse aquí para cancelar</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={s.btnSage}
            onPress={() => evento && toggleSaveEvent(evento.id)}
          >
            <Text style={s.btnSageText}>✓ ¡Yo también voy!</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={s.btnGhost}
          onPress={() =>
            router.push({
              pathname: "/atuendo",
              params: { evento: JSON.stringify(evento) },
            })
          }
        >
          <Text style={s.btnGhostText}>Ver qué ponerme 👔</Text>
        </TouchableOpacity>
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
  tag: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 30,
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  tagText: { color: "#F5EDE0", fontSize: 17, fontWeight: "700" },
  title: { fontSize: 36, color: "#F5EDE0", fontWeight: "400", lineHeight: 44 },
  body: { flex: 1 },
  bodyContent: { padding: 24, gap: 16 },
  infoBlock: { backgroundColor: "#FFFDF9", borderRadius: 20, padding: 20 },
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
    backgroundColor: "#E8EFF5",
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: { fontSize: 26 },
  divider: { height: 1, backgroundColor: "#F5EDE0", marginVertical: 10 },
  infoLabel: {
    fontSize: 16,
    fontWeight: "700", 
    color: "#8A9CB3",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  infoVal: { fontSize: 24, fontWeight: "700", color: "#2A1A1A" },
  goingBadge: {
    backgroundColor: "#EAF2ED",
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goingLabel: { fontSize: 22, fontWeight: "700", color: "#4E8963" },
  goingNum: { fontSize: 46, fontWeight: "600", color: "#4E8963" },
  confirmBox: {
    backgroundColor: "#EAF2ED",
    borderRadius: 18,
    padding: 22,
    alignItems: "center",
    gap: 6,
  },
  confirmTitle: { fontSize: 26, fontWeight: "800", color: "#4E8963" },
  confirmSub: { fontSize: 18, color: "#4E8963", opacity: 0.8 },
  btnSage: {
    backgroundColor: "#4E8963",
    borderRadius: 18,
    paddingVertical: 22,
    alignItems: "center",
  },
  btnSageText: { color: "white", fontSize: 26, fontWeight: "800" },
  btnGhost: {
    borderWidth: 2.5,
    borderColor: "#E8D5BC",
    borderRadius: 18,
    paddingVertical: 20,
    alignItems: "center",
  },
  btnGhostText: { color: "#4A6C9B", fontSize: 22, fontWeight: "600" },
});
