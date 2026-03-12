import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const GROQ_API_KEY = "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"; // 👈 Misma key que en buscar.tsx
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const sugerenciasDefault = [
  { icon: "👔", titulo: "Guayabera o traje claro", desc: "Colores claros, manga larga" },
  { icon: "👞", titulo: "Zapatos de piel", desc: "Suela de cuero para bailar bien" },
];
const consejoDefault = "Un pañuelo de bolsillo le da un toque muy elegante";

export default function Atuendo() {
  const router = useRouter();

  const [sugerencias, setSugerencias] = useState(sugerenciasDefault);
  const [consejo, setConsejo] = useState(consejoDefault);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarIA() {
      try {
        const response = await fetch(GROQ_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content: `Eres un experto en moda para baile de salón en México para adultos mayores.
Responde ÚNICAMENTE con JSON válido, sin texto extra, sin markdown, sin bloques de código.
Formato exacto:
{"sugerencias":[{"icon":"emoji","titulo":"texto","desc":"texto"},{"icon":"emoji","titulo":"texto","desc":"texto"},{"icon":"emoji","titulo":"texto","desc":"texto"}],"consejo":"texto"}`,
              },
              {
                role: "user",
                content: "Dame 3 sugerencias de atuendo para ir a bailar Danzón al Salón Los Ángeles mañana.",
              },
            ],
            max_tokens: 400,
            temperature: 0.7,
          }),
        });

        const data = await response.json();
        const texto = data.choices?.[0]?.message?.content ?? "";
        const clean = texto.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(clean);
        if (parsed.sugerencias) setSugerencias(parsed.sugerencias);
        if (parsed.consejo) setConsejo(parsed.consejo);
      } catch (e) {
        // Si falla, se quedan las sugerencias por defecto
      } finally {
        setCargando(false);
      }
    }
    cargarIA();
  }, []);

  return (
    <View style={s.screen}>
      <View style={s.header}>
        <TouchableOpacity style={s.back} onPress={() => router.back()}>
          <Text style={s.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={s.eyebrow}>Salón Los Ángeles · Mañana</Text>
        <Text style={s.title}>¿Qué me pongo?</Text>
      </View>

      <ScrollView style={s.body} contentContainerStyle={s.bodyContent}>
        {cargando ? (
          <View style={s.loadingBox}>
            <ActivityIndicator color="#8B1A1A" size="large" />
            <Text style={s.loadingText}>Consultando al experto de moda...</Text>
          </View>
        ) : (
          <>
            {sugerencias.map((sg, i) => (
              <View key={i} style={s.item}>
                <View style={s.itemIcon}>
                  <Text style={s.itemIconText}>{sg.icon}</Text>
                </View>
                <View style={s.itemText}>
                  <Text style={s.itemTitulo}>{sg.titulo}</Text>
                  <Text style={s.itemDesc}>{sg.desc}</Text>
                </View>
              </View>
            ))}
            <View style={s.tip}>
              <Text style={s.tipIcon}>💡</Text>
              <View style={s.tipBody}>
                <Text style={s.tipTitulo}>Consejo del día</Text>
                <Text style={s.tipMsg}>{consejo}</Text>
              </View>
            </View>
          </>
        )}
        <TouchableOpacity style={s.btn} onPress={() => router.back()}>
          <Text style={s.btnText}>Entendido ✓</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5EDE0" },
  header: { backgroundColor: "#8B1A1A", padding: 28, paddingBottom: 32 },
  back: { backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 12, width: 44, height: 44, alignItems: "center", justifyContent: "center", marginBottom: 16 },
  backText: { color: "#F5EDE0", fontSize: 30, lineHeight: 34 },
  eyebrow: { fontSize: 14, fontWeight: "700", color: "rgba(245,237,224,0.5)", letterSpacing: 1, marginBottom: 8 },
  title: { fontSize: 30, color: "#F5EDE0", fontWeight: "400", lineHeight: 38 },
  body: { flex: 1 },
  bodyContent: { padding: 24, gap: 14 },
  loadingBox: { alignItems: "center", paddingVertical: 40, gap: 16 },
  loadingText: { fontSize: 17, color: "#7A5050", textAlign: "center" },
  item: { backgroundColor: "#FFFDF9", borderRadius: 18, padding: 20, flexDirection: "row", alignItems: "center", gap: 16, borderLeftWidth: 5, borderLeftColor: "#8B1A1A" },
  itemIcon: { width: 56, height: 56, backgroundColor: "#F5EAEA", borderRadius: 14, alignItems: "center", justifyContent: "center" },
  itemIconText: { fontSize: 30 },
  itemText: { flex: 1 },
  itemTitulo: { fontSize: 19, fontWeight: "700", color: "#2A1A1A", lineHeight: 24 },
  itemDesc: { fontSize: 15, color: "#7A5050", marginTop: 4, lineHeight: 22 },
  tip: { backgroundColor: "#4E8963", borderRadius: 18, padding: 20, flexDirection: "row", gap: 14, alignItems: "flex-start" },
  tipIcon: { fontSize: 30 },
  tipBody: { flex: 1 },
  tipTitulo: { fontSize: 14, fontWeight: "700", color: "white", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 },
  tipMsg: { fontSize: 17, color: "rgba(255,255,255,0.9)", lineHeight: 26 },
  btn: { backgroundColor: "#8B1A1A", borderRadius: 18, paddingVertical: 22, alignItems: "center" },
  btnText: { color: "#F5EDE0", fontSize: 22, fontWeight: "800" },
});