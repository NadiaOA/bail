import { useRouter } from "expo-router";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useUser } from "./UserContext";
import { NavBar } from "./inicio";

export default function Perfil() {
  const router = useRouter();
  const { profile } = useUser();

  return (
    <View style={s.screen}>
      <View style={s.header}>
        <View style={s.avatar}>
          <Text style={s.avatarIcon}>👤</Text>
        </View>
        <Text style={s.nombre}>{profile.nombre}</Text>
        <Text style={s.loc}>
          {profile.municipio} · {profile.estado}
        </Text>
      </View>

      <ScrollView style={s.body} contentContainerStyle={s.bodyContent}>
        <View style={s.section}>
          <TouchableOpacity style={s.row} onPress={() => Alert.alert("Mi música", profile.musica.join(", "))}>
            <View style={s.rowLeft}>
              <Text style={s.rowLabel}>Mi música</Text>
              <Text style={s.rowVal}>{profile.musica.join(", ")}</Text>
            </View>
            <Text style={s.arrow}>›</Text>
          </TouchableOpacity>

          <View style={s.divider} />

          <TouchableOpacity
            style={s.row}
            onPress={() => Alert.alert("Mi zona", `${profile.municipio}, ${profile.estado}`)}
          >
            <View style={s.rowLeft}>
              <Text style={s.rowLabel}>Mi zona</Text>
              <Text style={s.rowVal}>{profile.municipio}</Text>
            </View>
            <Text style={s.arrow}>›</Text>
          </TouchableOpacity>

          <View style={s.divider} />

          <TouchableOpacity
            style={s.row}
            onPress={() => router.push("/recordatorios" as any)}
          >
            <View style={s.rowLeft}>
              <Text style={s.rowLabel}>Recordatorios</Text>
              <Text style={[s.rowVal, { color: "#4E8963" }]}>Activados ✓</Text>
            </View>
            <Text style={s.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={s.stats}>
          <View style={s.statSage}>
            <Text style={s.statNum}>8</Text>
            <Text style={[s.statLabel, { color: "#4E8963" }]}>Eventos</Text>
          </View>
          <View style={s.statRed}>
            <Text style={[s.statNum, { color: "#8B1A1A" }]}>3</Text>
            <Text style={[s.statLabel, { color: "#8B1A1A" }]}>Guardados</Text>
          </View>
        </View>
      </ScrollView>

      <NavBar active="perfil" />
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5EDE0" },
  header: {
    backgroundColor: "#8B1A1A",
    padding: 28,
    paddingBottom: 36,
    alignItems: "center",
    gap: 8,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  avatarIcon: { fontSize: 34 },
  nombre: { fontSize: 28, color: "#F5EDE0", fontWeight: "400" },
  loc: { fontSize: 15, color: "rgba(245,237,224,0.5)", fontWeight: "500" },
  body: { flex: 1 },
  bodyContent: { padding: 24, gap: 16 },
  section: {
    backgroundColor: "#FFFDF9",
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "#E8D5BC",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  divider: { height: 1, backgroundColor: "#F5EDE0", marginHorizontal: 20 },
  rowLeft: { gap: 4 },
  rowLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#C4A882",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  rowVal: { fontSize: 20, color: "#2A1A1A", fontWeight: "600" },
  arrow: { fontSize: 24, color: "#C4A882" },
  stats: { flexDirection: "row", gap: 12 },
  statSage: {
    flex: 1,
    backgroundColor: "#EAF2ED",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    gap: 4,
  },
  statRed: {
    flex: 1,
    backgroundColor: "#F5EAEA",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    gap: 4,
  },
  statNum: { fontSize: 40, fontWeight: "600", color: "#4E8963" },
  statLabel: { fontSize: 13, fontWeight: "700", letterSpacing: 1 },
});
