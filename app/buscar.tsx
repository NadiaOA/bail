import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { NavBar } from "./inicio";

const GROQ_API_KEY = "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"; // 👈 Pega aquí tu key de console.groq.com (empieza con gsk_...)
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const eventos = [
  { nombre: "Salón Los Ángeles", info: "Domingo · 10:00 am · 38 van", genero: "Danzón" },
  { nombre: "Salón México", info: "Domingo · 11:00 am · 22 van", genero: "Salsa" },
  { nombre: "La Maraka", info: "Sábado · 9:00 pm · 54 van", genero: "Cumbia" },
];

const SYSTEM_PROMPT = `Eres un asistente amigable y cálido de la app "Bail", una aplicación para adultos mayores aficionados al baile de salón en Ciudad de México.
Tu trabajo es ayudar a los usuarios a encontrar eventos de baile y dar recomendaciones de atuendo.

Eventos disponibles:
- Salón Los Ángeles: Domingo 10:00 am, 38 van (Danzón)
- Salón México: Domingo 11:00 am, 22 van (Salsa)
- La Maraka: Sábado 9:00 pm, 54 van (Cumbia)

Reglas:
- Habla de usted, con respeto y calidez.
- Si preguntan por eventos, menciona los disponibles y sus detalles.
- Para danzón: guayabera o traje claro, zapatos de piel, pañuelo de bolsillo. Vestido elegante, tacón cubano para damas.
- Para salsa: ropa cómoda y colorida, zapatos con suela lisa.
- Para cumbia: ropa fresca y colorida, calzado cómodo.
- Respuestas cortas, máximo 3-4 oraciones.
- Solo habla de eventos de baile y atuendo.`;

type Mensaje = { tipo: "bot" | "user"; texto: string };
type ResultadoEvento = { nombre: string; info: string };

export default function Buscar() {
  const router = useRouter();
  const [texto, setTexto] = useState("");
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    { tipo: "bot", texto: "¿Qué evento le gustaría encontrar hoy? También puedo ayudarle con recomendaciones de atuendo 👗🕺" },
  ]);
  const [resultadosVisibles, setResultadosVisibles] = useState<ResultadoEvento[]>([]);
  const [cargando, setCargando] = useState(false);

  async function enviar() {
    if (!texto.trim() || cargando) return;

    const mensajeUsuario = texto.trim();
    setTexto("");

    const mensajesActualizados: Mensaje[] = [
      ...mensajes,
      { tipo: "user", texto: mensajeUsuario },
    ];
    setMensajes(mensajesActualizados);
    setCargando(true);

    const mencionaEventos = /evento|bail|salon|salón|cerca|hoy|dónde|donde|busco|buscar|salsa|cumbia|danzón|danzon/i.test(mensajeUsuario);
    if (mencionaEventos) {
      setResultadosVisibles(eventos.slice(0, 2));
    }

    try {
      const historial = mensajesActualizados.slice(1).map((m) => ({
        role: m.tipo === "user" ? "user" : "assistant",
        content: m.texto,
      }));

      const response = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...historial,
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      const data = await response.json();

      if (data.choices?.[0]?.message?.content) {
        setMensajes((prev) => [...prev, { tipo: "bot", texto: data.choices[0].message.content }]);
      } else if (data.error) {
        setMensajes((prev) => [...prev, { tipo: "bot", texto: `Error: ${data.error.message}` }]);
      } else {
        setMensajes((prev) => [...prev, { tipo: "bot", texto: "Lo siento, no pude entender su consulta." }]);
      }
    } catch (error: any) {
      setMensajes((prev) => [
        ...prev,
        { tipo: "bot", texto: "Disculpe, tuve un problema al conectarme. Intente de nuevo." },
      ]);
    } finally {
      setCargando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={s.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={s.header}>
        <Text style={s.eyebrow}>Dígame qué busca</Text>
        <Text style={s.title}>Buscar un evento</Text>
      </View>

      <ScrollView style={s.chat} contentContainerStyle={s.chatContent}>
        {mensajes.map((m, i) =>
          m.tipo === "bot" ? (
            <View key={i} style={s.bubbleBot}>
              <Text style={s.bubbleBotText}>{m.texto}</Text>
            </View>
          ) : (
            <View key={i} style={s.bubbleUser}>
              <Text style={s.bubbleUserText}>{m.texto}</Text>
            </View>
          )
        )}

        {cargando && (
          <View style={s.bubbleBot}>
            <ActivityIndicator color="#8B1A1A" />
          </View>
        )}

        {resultadosVisibles.map((r, i) => (
          <TouchableOpacity
            key={i}
            style={s.resultCard}
            onPress={() => router.push("/detalle-evento" as any)}
          >
            <Text style={s.resultNombre}>{r.nombre}</Text>
            <Text style={s.resultInfo}>{r.info}</Text>
            <View style={s.resultBtn}>
              <Text style={s.resultBtnText}>¡Yo voy!</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={s.inputBar}>
        <TextInput
          style={s.input}
          placeholder="Escriba aquí..."
          placeholderTextColor="#C4A882"
          value={texto}
          onChangeText={setTexto}
          onSubmitEditing={enviar}
          returnKeyType="send"
          editable={!cargando}
        />
        <TouchableOpacity style={s.sendBtn} onPress={enviar} disabled={cargando}>
          <Text style={s.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>

      <NavBar active="buscar" />
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5EDE0" },
  header: { backgroundColor: "#8B1A1A", padding: 28, paddingBottom: 24 },
  eyebrow: { fontSize: 14, fontWeight: "700", color: "rgba(245,237,224,0.5)", letterSpacing: 1, marginBottom: 8 },
  title: { fontSize: 30, color: "#F5EDE0", fontWeight: "400", lineHeight: 38 },
  chat: { flex: 1 },
  chatContent: { padding: 18, gap: 14 },
  bubbleBot: { backgroundColor: "#FFFDF9", borderRadius: 22, borderBottomLeftRadius: 6, padding: 18, maxWidth: "82%", borderWidth: 1.5, borderColor: "#E8D5BC" },
  bubbleBotText: { fontSize: 24, color: "#2A1A1A", lineHeight: 28 },
  bubbleUser: { backgroundColor: "#8B1A1A", borderRadius: 22, borderBottomRightRadius: 6, padding: 18, maxWidth: "82%", alignSelf: "flex-end" },
  bubbleUserText: { fontSize: 24, color: "#F5EDE0", fontWeight: "600", lineHeight: 28 },
  resultCard: { backgroundColor: "#FFFDF9", borderRadius: 18, padding: 18, gap: 8, maxWidth: "88%", borderWidth: 1.5, borderColor: "#E8D5BC" },
  resultNombre: { fontSize: 20, color: "#2A1A1A", fontWeight: "400" },
  resultInfo: { fontSize: 15, color: "#7A5050", fontWeight: "600" },
  resultBtn: { backgroundColor: "#4E8963", borderRadius: 12, padding: 14, alignItems: "center", marginTop: 4 },
  resultBtnText: { color: "white", fontSize: 17, fontWeight: "700" },
  inputBar: { backgroundColor: "#FFFDF9", borderTopWidth: 2, borderTopColor: "#E8D5BC", padding: 12, flexDirection: "row", gap: 10, alignItems: "center" },
  input: { flex: 1, backgroundColor: "#F5EDE0", borderWidth: 2, borderColor: "#E8D5BC", borderRadius: 14, padding: 14, fontSize: 18, color: "#2A1A1A" },
  sendBtn: { width: 54, height: 54, backgroundColor: "#8B1A1A", borderRadius: 14, alignItems: "center", justifyContent: "center" },
  sendIcon: { color: "white", fontSize: 20 },
});
