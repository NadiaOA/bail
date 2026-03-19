import { useRouter } from "expo-router";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useUser } from "./UserContext";
import { NavBar } from "./inicio";

// Interfaz completa del evento para consistencia
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

export default function Guardados() {
  const router = useRouter();
  const { profile, toggleSaveEvent, allEvents, loadingEvents } = useUser();

  const savedEventos = allEvents.filter((evento) =>
    profile.savedEvents.includes(evento.id)
  );

  const formatFecha = (fechaStr: string) => {
    const parts = fechaStr.split(" ");
    if (parts.length > 2 && !isNaN(parseInt(parts[1]))) {
      const dia = parts[1];
      const mes = parts.length > 3 ? parts[3].substring(0, 3) : "";
      return { dia, mes: mes.charAt(0).toUpperCase() + mes.slice(1) };
    }
    if (fechaStr.toLowerCase().includes("domingo")) return { dia: "D", mes: "Dom" };
    return { dia: "?", mes: "???" };
  };

  return (
    <View style={s.screen}>
      <View style={s.header}>
        <Text style={s.eyebrow}>Sus favoritos</Text>
        <Text style={s.title}>Eventos guardados</Text>
      </View>

      <ScrollView style={s.body} contentContainerStyle={s.bodyContent}>
        {loadingEvents ? (
          <ActivityIndicator size="large" color="#4A6C9B" style={{ marginTop: 48 }} />
        ) : savedEventos.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyIcon}>🔖</Text>
            <Text style={s.emptyText}>Aún no tiene eventos guardados</Text>
            <Text style={s.emptySubtext}>
              Pulse "Me interesa" o "¡Yo también voy!" en un evento para guardarlo aquí.
            </Text>
          </View>
        ) : (
          savedEventos.map((ev) => {
            const { dia, mes } = formatFecha(ev.fecha);
            const meta = `${ev.genero} · ${ev.hora}`;
            return (
              <TouchableOpacity
                key={ev.id}
                style={s.row}
                onPress={() =>
                  router.push({
                    pathname: "/detalle-evento",
                    params: { evento: JSON.stringify(ev) },
                  })
                }
              >
                <View style={s.dateBox}>
                  <Text style={s.day}>{dia}</Text>
                  <Text style={s.mon}>{mes}</Text>
                </View>
                <View style={s.info}>
                  <Text style={s.nombre}>{ev.nombre}</Text>
                  <Text style={s.meta}>{meta}</Text>
                </View>
                <TouchableOpacity onPress={() => toggleSaveEvent(ev.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Text style={s.bookmark}>🔖</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })
        )}

        {!loadingEvents && savedEventos.length > 0 && (
          <View style={s.aviso}>
            <Text style={s.avisoText}>Le avisamos el día anterior</Text>
          </View>
        )}
      </ScrollView>

      <NavBar active="guardados" />
    </View>
  );
}


const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5EDE0" },
  header: { backgroundColor: "#4A6C9B", padding: 28, paddingBottom: 32 },
  eyebrow: {
    fontSize: 15,
    fontWeight: "700",
    color: "rgba(245,237,224,0.5)",
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: { fontSize: 32, color: "#F5EDE0", fontWeight: "400", lineHeight: 40 },
  body: { flex: 1 },
  bodyContent: { padding: 24, gap: 12 },
  empty: { alignItems: "center", paddingVertical: 48, gap: 12 },
  emptyIcon: { fontSize: 48, color: "#8A9CB3" },
  emptyText: { fontSize: 22, fontWeight: "600", color: "#5C6B7F", textAlign: "center" },
  emptySubtext: { fontSize: 18, color: "#5C6B7F", textAlign: "center", marginTop: 8, lineHeight: 26 },
  row: {
    backgroundColor: "#FFFDF9",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderWidth: 1.5,
    borderColor: "#E8D5BC",
  },
  dateBox: {
    backgroundColor: "#E8EFF5",
    borderRadius: 12,
    width: 54,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
  },
  day: { fontSize: 28, fontWeight: "600", color: "#4A6C9B", lineHeight: 30 },
  mon: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4A6C9B",
    textTransform: "uppercase",
    letterSpacing: 1,
    opacity: 0.7,
  },
  info: { flex: 1 },
  nombre: { fontSize: 20, color: "#2A1A1A", fontWeight: "400", lineHeight: 26 },
  meta: { fontSize: 16, color: "#5C6B7F", fontWeight: "600", marginTop: 3 },
  bookmark: { fontSize: 28, color: "#4E8963" },
  aviso: {
    backgroundColor: "#EAF2ED",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
  },
  avisoText: { fontSize: 18, fontWeight: "700", color: "#4E8963" },
});
