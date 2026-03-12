import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { NavBar } from "./inicio";

const eventosIniciales = [
  {
    dia: "1",
    mes: "Mar",
    nombre: "Salón Los Ángeles",
    meta: "Danzón · 10:00 am",
  },
  { dia: "8", mes: "Mar", nombre: "Salón México", meta: "Danzón · 11:00 am" },
  {
    dia: "15",
    mes: "Mar",
    nombre: "Casa de la Cultura",
    meta: "Salsa · 6:00 pm",
  },
];

export default function Guardados() {
  const router = useRouter();
  const [eventos, setEventos] = useState(eventosIniciales);

  function quitar(nombre: string) {
    setEventos((prev) => prev.filter((e) => e.nombre !== nombre));
  }

  return (
    <View style={s.screen}>
      <View style={s.header}>
        <Text style={s.eyebrow}>Sus favoritos</Text>
        <Text style={s.title}>Eventos guardados</Text>
      </View>

      <ScrollView style={s.body} contentContainerStyle={s.bodyContent}>
        {eventos.length === 0 && (
          <View style={s.empty}>
            <Text style={s.emptyIcon}>🔖</Text>
            <Text style={s.emptyText}>Aún no tiene eventos guardados</Text>
          </View>
        )}

        {eventos.map((ev) => (
          <TouchableOpacity
            key={ev.nombre}
            style={s.row}
            onPress={() => router.push("/detalle-evento" as any)}
          >
            <View style={s.dateBox}>
              <Text style={s.day}>{ev.dia}</Text>
              <Text style={s.mon}>{ev.mes}</Text>
            </View>
            <View style={s.info}>
              <Text style={s.nombre}>{ev.nombre}</Text>
              <Text style={s.meta}>{ev.meta}</Text>
            </View>
            <TouchableOpacity
              onPress={() => quitar(ev.nombre)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={s.bookmark}>🔖</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        {eventos.length > 0 && (
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
  header: { backgroundColor: "#8B1A1A", padding: 28, paddingBottom: 32 },
  eyebrow: {
    fontSize: 14,
    fontWeight: "700",
    color: "rgba(245,237,224,0.5)",
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: { fontSize: 30, color: "#F5EDE0", fontWeight: "400", lineHeight: 38 },
  body: { flex: 1 },
  bodyContent: { padding: 24, gap: 12 },
  empty: { alignItems: "center", paddingVertical: 48, gap: 12 },
  emptyIcon: { fontSize: 48, color: "#C4A882" },
  emptyText: { fontSize: 18, color: "#7A5050", textAlign: "center" },
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
    backgroundColor: "#F5EAEA",
    borderRadius: 12,
    width: 54,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
  },
  day: { fontSize: 26, fontWeight: "600", color: "#8B1A1A", lineHeight: 28 },
  mon: {
    fontSize: 11,
    fontWeight: "700",
    color: "#8B1A1A",
    textTransform: "uppercase",
    letterSpacing: 1,
    opacity: 0.7,
  },
  info: { flex: 1 },
  nombre: { fontSize: 19, color: "#2A1A1A", fontWeight: "400", lineHeight: 24 },
  meta: { fontSize: 15, color: "#7A5050", fontWeight: "600", marginTop: 3 },
  bookmark: { fontSize: 26, color: "#4E8963" },
  aviso: {
    backgroundColor: "#EAF2ED",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
  },
  avisoText: { fontSize: 17, fontWeight: "700", color: "#4E8963" },
});
