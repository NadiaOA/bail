import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Evento {
  id: string;
  genero: string;
  nombre: string;
  fecha: string;
  hora: string;
  lugar: string;
  van: number;
}

export default function DetalleEvento() {
  const router = useRouter();
  const params = useLocalSearchParams<{ evento: string }>();
  const evento: Evento | null = params.evento ? JSON.parse(params.evento) : null;

  const [confirmado, setConfirmado] = useState(false);

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
          <View style={s.confirmBox}>
            <Text style={s.confirmTitle}>✓ ¡Ya está anotado!</Text>
            <Text style={s.confirmSub}>Le avisaremos el día anterior</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={s.btnSage}
            onPress={() => setConfirmado(true)}
          >
            <Text style={s.btnSageText}>✓ ¡Yo también voy!</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={s.btnGhost}
          onPress={() => router.push("/atuendo")}
        >
          <Text style={s.btnGhostText}>Ver qué ponerme 👔</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}


const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5EDE0" },
  header: { backgroundColor: "#8B1A1A", padding: 28, paddingBottom: 32 },
  back: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 12,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  backText: { color: "#F5EDE0", fontSize: 30, lineHeight: 34 },
  tag: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 30,
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  tagText: { color: "#F5EDE0", fontSize: 16, fontWeight: "700" },
  title: { fontSize: 34, color: "#F5EDE0", fontWeight: "400", lineHeight: 42 },
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
    backgroundColor: "#F5EAEA",
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: { fontSize: 26 },
  divider: { height: 1, backgroundColor: "#F5EDE0", marginVertical: 10 },
  infoLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#C4A882",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  infoVal: { fontSize: 22, fontWeight: "700", color: "#2A1A1A" },
  goingBadge: {
    backgroundColor: "#EAF2ED",
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goingLabel: { fontSize: 20, fontWeight: "700", color: "#4E8963" },
  goingNum: { fontSize: 44, fontWeight: "600", color: "#4E8963" },
  confirmBox: {
    backgroundColor: "#EAF2ED",
    borderRadius: 18,
    padding: 22,
    alignItems: "center",
    gap: 6,
  },
  confirmTitle: { fontSize: 24, fontWeight: "800", color: "#4E8963" },
  confirmSub: { fontSize: 17, color: "#4E8963", opacity: 0.8 },
  btnSage: {
    backgroundColor: "#4E8963",
    borderRadius: 18,
    paddingVertical: 22,
    alignItems: "center",
  },
  btnSageText: { color: "white", fontSize: 24, fontWeight: "800" },
  btnGhost: {
    borderWidth: 2.5,
    borderColor: "#E8D5BC",
    borderRadius: 18,
    paddingVertical: 20,
    alignItems: "center",
  },
  btnGhostText: { color: "#8B1A1A", fontSize: 20, fontWeight: "600" },
});
