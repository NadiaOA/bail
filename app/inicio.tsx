import { useRouter } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function Inicio() {
  const router = useRouter();

  return (
    <View style={s.screen}>
      <View style={s.header}>
        <Text style={s.greeting}>Buenos días, doña Carmen</Text>
        <Text style={s.title}>Su próximo evento</Text>
      </View>

      <ScrollView style={s.body} contentContainerStyle={s.bodyContent}>
        <View style={s.tag}>
          <Text style={s.tagText}>🎵 Danzón</Text>
        </View>
        <Text style={s.eventName}>Salón Los Ángeles</Text>

        <View style={s.infoBlock}>
          <View style={s.infoRow}>
            <View style={s.icon}>
              <Text style={s.iconText}>📅</Text>
            </View>
            <View>
              <Text style={s.infoLabel}>Fecha</Text>
              <Text style={s.infoVal}>Sábado 1 de marzo</Text>
            </View>
          </View>
          <View style={s.divider} />
          <View style={s.infoRow}>
            <View style={s.icon}>
              <Text style={s.iconText}>🕙</Text>
            </View>
            <View>
              <Text style={s.infoLabel}>Hora</Text>
              <Text style={s.infoVal}>10 de la mañana</Text>
            </View>
          </View>
        </View>

        <View style={s.goingBadge}>
          <Text style={s.goingLabel}>Van a ir</Text>
          <Text style={s.goingNum}>42</Text>
        </View>

        <TouchableOpacity
          style={s.btnSage}
          onPress={() => router.push("/detalle-evento" as any)}
        >
          <Text style={s.btnSageText}>✓ ¡Yo también voy!</Text>
        </TouchableOpacity>
      </ScrollView>

      <NavBar active="inicio" />
    </View>
  );
}

export function NavBar({ active }: { active: string }) {
  const router = useRouter();
  const items = [
    { id: "inicio", icon: "⌂", label: "Inicio", ruta: "/inicio" },
    { id: "buscar", icon: "✦", label: "Buscar", ruta: "/buscar" },
    { id: "guardados", icon: "♡", label: "Guardados", ruta: "/guardados" },
    { id: "perfil", icon: "◯", label: "Perfil", ruta: "/perfil" },
  ];
  return (
    <View style={nav.bar}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={nav.btn}
          onPress={() => router.push(item.ruta as any)}
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
  bar: {
    backgroundColor: "#8B1A1A",
    flexDirection: "row",
    paddingTop: 12,
    paddingBottom: 28,
  },
  btn: { flex: 1, alignItems: "center", gap: 3 },
  icon: { fontSize: 24, color: "#F5EDE0", opacity: 0.35 },
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
  header: { backgroundColor: "#8B1A1A", padding: 28, paddingBottom: 32 },
  greeting: {
    fontSize: 14,
    fontWeight: "700",
    color: "rgba(245,237,224,0.5)",
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: { fontSize: 30, color: "#F5EDE0", fontWeight: "400", lineHeight: 38 },
  body: { flex: 1 },
  bodyContent: { padding: 24, gap: 16 },
  tag: {
    backgroundColor: "#F5EAEA",
    borderRadius: 30,
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignSelf: "flex-start",
  },
  tagText: { color: "#8B1A1A", fontSize: 14, fontWeight: "700" },
  eventName: {
    fontSize: 30,
    color: "#2A1A1A",
    fontWeight: "400",
    lineHeight: 36,
  },
  infoBlock: {
    backgroundColor: "#FFFDF9",
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
    backgroundColor: "#F5EAEA",
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: { fontSize: 26 },
  divider: { height: 1, backgroundColor: "#F5EDE0", marginVertical: 8 },
  infoLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#C4A882",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  infoVal: { fontSize: 20, fontWeight: "700", color: "#2A1A1A" },
  goingBadge: {
    backgroundColor: "#EAF2ED",
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goingLabel: { fontSize: 18, fontWeight: "700", color: "#4E8963" },
  goingNum: { fontSize: 40, fontWeight: "600", color: "#4E8963" },
  btnSage: {
    backgroundColor: "#4E8963",
    borderRadius: 18,
    paddingVertical: 22,
    alignItems: "center",
  },
  btnSageText: { color: "white", fontSize: 22, fontWeight: "800" },
});
