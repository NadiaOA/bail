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
import { useUser } from "./UserContext";
import { NavBar } from "./inicio";

const GROQ_API_KEY = "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"; // 👈 Pega aquí tu key de console.groq.com (empieza con gsk_...)
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

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

const BASE_SYSTEM_PROMPT = `Eres un asistente amigable y cálido de la app "Bail", una aplicación para adultos mayores aficionados al baile de salón en Ciudad de México.
Tu trabajo es ayudar a los usuarios a encontrar eventos de baile y dar recomendaciones de atuendo.

Reglas:
- Habla de usted, con respeto y calidez.
- Si preguntan por eventos, menciona los disponibles y sus detalles.
- Para danzón: guayabera o traje claro, zapatos de piel, pañuelo de bolsillo. Vestido elegante, tacón cubano para damas.
- Para salsa: ropa cómoda y colorida, zapatos con suela lisa.
- Para cumbia: ropa fresca y colorida, calzado cómodo.
- Si el usuario ya está anotado en un evento, hágaselo saber y no se lo sugiera como nuevo. En su lugar, sugiera otros eventos disponibles.
- Respuestas cortas, máximo 3-4 oraciones.
- Solo habla de eventos de baile y atuendo.`;

type Mensaje = { tipo: "bot" | "user"; texto: string };
type Accion = { tipo: "atuendo"; evento: Evento };

export default function Buscar() {
  const router = useRouter();
  const { allEvents, isEventSaved } = useUser();
  const [texto, setTexto] = useState("");
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    { tipo: "bot", texto: "¿Qué evento le gustaría encontrar hoy? También puedo ayudarle con recomendaciones de atuendo 👗🕺" },
  ]);
  const [resultadosVisibles, setResultadosVisibles] = useState<Evento[]>([]);
  const [accionVisible, setAccionVisible] = useState<Accion | null>(null);
  const [cargando, setCargando] = useState(false);

  async function enviar() {
    if (!texto.trim() || cargando) return;

    const mensajeUsuario = texto.trim();
    setTexto("");
    setResultadosVisibles([]); // Limpiamos resultados anteriores
    setAccionVisible(null);

    const mensajesActualizados: Mensaje[] = [
      ...mensajes,
      { tipo: "user", texto: mensajeUsuario },
    ];
    setMensajes(mensajesActualizados);
    setCargando(true);

    const mencionaEventos = /evento|bail|salon|salón|cerca|hoy|dónde|donde|busco|buscar|salsa|cumbia|danzón|danzon/i.test(mensajeUsuario);
    const mencionaAtuendo = /atuendo|ropa|vestir|pongo|vestimenta/i.test(mensajeUsuario);
    
    // Buscamos si se menciona un evento específico en la consulta
    const eventoEncontrado = allEvents.find(ev => mensajeUsuario.toLowerCase().includes(ev.nombre.toLowerCase()));

    // Filtramos los eventos en los que el usuario NO está anotado
    const eventosDisponibles = allEvents.filter(ev => !isEventSaved(ev.id));

    if (eventoEncontrado) {
      // Si se menciona un evento específico, mostramos la tarjeta de detalles
      setResultadosVisibles([eventoEncontrado]);
      // Y si además se pregunta por el atuendo, mostramos también esa acción
      if (mencionaAtuendo) {
        setAccionVisible({ tipo: "atuendo", evento: eventoEncontrado });
      }
    } else if (mencionaEventos || mencionaAtuendo) {
      // Si no se menciona un evento específico pero se buscan eventos (o atuendos en general),
      // mostramos sugerencias generales de eventos disponibles.
      const resultados = eventosDisponibles.filter(ev => 
        // Buscamos si el usuario mencionó algún género de los eventos disponibles
        ev.genero.toLowerCase().split(',').some(g => mensajeUsuario.toLowerCase().includes(g.trim()))
      );
      // Mostramos los resultados filtrados, o si no hay, los primeros 2 eventos disponibles
      setResultadosVisibles(resultados.length > 0 ? resultados.slice(0, 2) : eventosDisponibles.slice(0, 2));
    }

    // La IA necesita saber el estado de CADA evento para dar respuestas coherentes
    const eventosPrompt = allEvents.map(e => {
      const estado = isEventSaved(e.id) ? "(Usted ya está anotado)" : "(Disponible)";
      return `- ${e.nombre}: ${e.fecha} a las ${e.hora}, van ${e.van} personas (${e.genero}) ${estado}`;
    }).join('\n');
    
    let systemPrompt = `${BASE_SYSTEM_PROMPT}\n\nEventos y su estado:\n${eventosPrompt}`;

    // Añadimos una nota contextual si no hay más eventos disponibles
    if (eventosDisponibles.length === 0) {
      systemPrompt += "\n\nNOTA IMPORTANTE: El usuario ya se ha anotado a todos los eventos. Si pregunta por más, infórmele amablemente que por el momento no hay más eventos disponibles para él/ella.";
    } else {
      const generos = ["salsa", "cumbia", "danzón", "danzon", "mambo"];
      const generoBuscado = generos.find(g => mensajeUsuario.toLowerCase().includes(g));
      if (generoBuscado) {
          const eventosDeGeneroDisponibles = eventosDisponibles.filter(ev => ev.genero.toLowerCase().includes(generoBuscado));
          if (eventosDeGeneroDisponibles.length === 0) {
               systemPrompt += `\n\nNOTA IMPORTANTE: El usuario está preguntando por eventos de '${generoBuscado}', pero ya se ha anotado a todos los disponibles de ese género. Infórmele amablemente de esto y sugiérale otros géneros si lo desea.`;
          }
      }
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
            { role: "system", content: systemPrompt },
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
            <ActivityIndicator color="#4A6C9B" />
          </View>
        )}

        {accionVisible?.tipo === "atuendo" && (
          <TouchableOpacity
            style={s.actionCard}
            onPress={() =>
              router.push({
                pathname: "/atuendo",
                params: { evento: JSON.stringify(accionVisible.evento) },
              })
            }
          >
            <Text style={s.actionCardText}>
              Ver sugerencias de atuendo para {accionVisible.evento.nombre} 👔
            </Text>
          </TouchableOpacity>
        )}

        {resultadosVisibles.map((r, i) => (
          <TouchableOpacity
            key={i}
            style={s.resultCard}
            onPress={() =>
              router.push({
                pathname: "/detalle-evento",
                params: { evento: JSON.stringify(r) },
              })
            }
          >
            <Text style={s.resultNombre}>{r.nombre}</Text>
            <Text style={s.resultInfo}>{`${r.fecha} · ${r.hora} · ${r.van} van`}</Text>
            <View style={s.resultBtn}>
              <Text style={s.resultBtnText}>Ver detalles</Text>
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
  header: { backgroundColor: "#4A6C9B", padding: 28, paddingBottom: 24 },
  eyebrow: { fontSize: 15, fontWeight: "700", color: "rgba(245,237,224,0.5)", letterSpacing: 1, marginBottom: 8 },
  title: { fontSize: 32, color: "#F5EDE0", fontWeight: "400", lineHeight: 40 },
  chat: { flex: 1 },
  chatContent: { padding: 18, gap: 14 },
  bubbleBot: { backgroundColor: "#FFFDF9", borderRadius: 22, borderBottomLeftRadius: 6, padding: 18, maxWidth: "82%", borderWidth: 1.5, borderColor: "#E8D5BC" },
  bubbleBotText: { fontSize: 26, color: "#2A1A1A", lineHeight: 32 },
  bubbleUser: { backgroundColor: "#4A6C9B", borderRadius: 22, borderBottomRightRadius: 6, padding: 18, maxWidth: "82%", alignSelf: "flex-end" },
  bubbleUserText: { fontSize: 26, color: "#F5EDE0", fontWeight: "600", lineHeight: 32 },
  resultCard: { backgroundColor: "#FFFDF9", borderRadius: 18, padding: 18, gap: 8, maxWidth: "88%", borderWidth: 1.5, borderColor: "#E8D5BC" },
  resultNombre: { fontSize: 22, color: "#2A1A1A", fontWeight: "400" },
  resultInfo: { fontSize: 16, color: "#5C6B7F", fontWeight: "600" },
  resultBtn: { backgroundColor: "#4E8963", borderRadius: 12, padding: 14, alignItems: "center", marginTop: 4 },
  resultBtnText: { color: "white", fontSize: 18, fontWeight: "700" },
  actionCard: {
    backgroundColor: "#E8EFF5",
    borderRadius: 18,
    padding: 18,
    maxWidth: "88%",
    borderWidth: 1.5,
    borderColor: "#4A6C9B",
    alignItems: "center",
  },
  actionCardText: {
    color: "#4A6C9B",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  inputBar: { backgroundColor: "#FFFDF9", borderTopWidth: 2, borderTopColor: "#E8D5BC", padding: 12, flexDirection: "row", gap: 10, alignItems: "center" },
  input: { flex: 1, backgroundColor: "#F5EDE0", borderWidth: 2, borderColor: "#E8D5BC", borderRadius: 14, padding: 14, fontSize: 20, color: "#2A1A1A", placeholderTextColor: "#8A9CB3" },
  sendBtn: { width: 54, height: 54, backgroundColor: "#4A6C9B", borderRadius: 14, alignItems: "center", justifyContent: "center" },
  sendIcon: { color: "white", fontSize: 24 },
});
