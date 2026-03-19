import { Audio } from "expo-av";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Evento, useUser } from "../context/UserContext";
import { NavBar } from "./inicio";

const GROQ_API_KEY = "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";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const WHISPER_URL = "https://api.groq.com/openai/v1/audio/transcriptions";

function buildSystemPrompt(eventos: Evento[]): string {
  const listaEventos = eventos
    .map(
      (e) =>
        `- ${e.nombre}: ${e.fecha} a las ${e.hora}, ${e.van} van a ir (${e.genero}), en ${e.lugar}`
    )
    .join("\n");

  return `Eres un asistente amigable y cálido de la app "Bail", una aplicación para adultos mayores aficionados al baile de salón en Ciudad de México.
Tu trabajo es ayudar a los usuarios a encontrar eventos de baile y dar recomendaciones de atuendo.

Eventos disponibles actualmente:
${listaEventos}

Reglas:
- Habla de usted, con respeto y calidez.
- Si preguntan por eventos, menciona los disponibles y sus detalles (fecha, hora, lugar).
- Para danzón: guayabera o traje claro, zapatos de piel, pañuelo de bolsillo. Vestido elegante, tacón cubano para damas.
- Para salsa: ropa cómoda y colorida, zapatos con suela lisa.
- Para cumbia: ropa fresca y colorida, calzado cómodo.
- Respuestas cortas, máximo 3-4 oraciones.
- Solo habla de eventos de baile y atuendo.`;
}

type Mensaje = { tipo: "bot" | "user"; texto: string };
type ResultadoEvento = { nombre: string; info: string; evento: Evento };

export default function Buscar() {
  const router = useRouter();
  const { allEvents, loadingEvents } = useUser();
  const scrollRef = useRef<ScrollView>(null);

  const [texto, setTexto] = useState("");
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      tipo: "bot",
      texto:
        "¿Qué evento le gustaría encontrar hoy? También puedo ayudarle con recomendaciones de atuendo 👗🕺",
    },
  ]);
  const [resultadosVisibles, setResultadosVisibles] = useState<ResultadoEvento[]>([]);
  const [cargando, setCargando] = useState(false);

  const [grabando, setGrabando] = useState(false);
  const [transcribiendo, setTranscribiendo] = useState(false);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (grabando) {
      pulseLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.3, duration: 500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      );
      pulseLoop.current.start();
    } else {
      pulseLoop.current?.stop();
      pulseAnim.setValue(1);
    }
  }, [grabando]);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [mensajes, resultadosVisibles]);

  // ── Iniciar grabación ──
  async function iniciarGrabacion() {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        setMensajes((prev) => [
          ...prev,
          { tipo: "bot", texto: "Necesito permiso para usar el micrófono. Por favor actívelo en la configuración." },
        ]);
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync({
        android: {
          extension: ".m4a",
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: ".m4a",
          outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        web: {
          mimeType: "audio/webm",
          bitsPerSecond: 128000,
        },
      });

      recordingRef.current = recording;
      setGrabando(true);
    } catch (e) {
      console.error("Error iniciando grabación:", e);
      setMensajes((prev) => [
        ...prev,
        { tipo: "bot", texto: `Error al iniciar el micrófono: ${e}` },
      ]);
    }
  }

  // ── Detener y transcribir ──
  // ⚠️ FIX CLAVE: guardamos el URI ANTES de stopAndUnloadAsync
  async function detenerYTranscribir() {
    if (!recordingRef.current) return;
    setGrabando(false);
    setTranscribiendo(true);

    try {
      // 1. Guardamos el URI antes de detener
      const uri = recordingRef.current.getURI();
      console.log("URI del audio (antes de stop):", uri);

      // 2. Ahora sí detenemos
      await recordingRef.current.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      recordingRef.current = null;

      if (!uri) {
        setMensajes((prev) => [
          ...prev,
          { tipo: "bot", texto: "Error: no se pudo obtener el archivo de audio. Intente de nuevo." },
        ]);
        return;
      }

      // 3. Mandamos a Whisper
      const formData = new FormData();
      formData.append("file", {
        uri,
        type: "audio/m4a",
        name: "audio.m4a",
      } as any);
      formData.append("model", "whisper-large-v3");
      formData.append("language", "es");
      formData.append("response_format", "json");

      const whisperRes = await fetch(WHISPER_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: formData,
      });

      const whisperData = await whisperRes.json();
      console.log("Respuesta Whisper:", JSON.stringify(whisperData));

      // Si hay error de Whisper, lo mostramos en el chat para depurar
      if (whisperData?.error) {
        setMensajes((prev) => [
          ...prev,
          { tipo: "bot", texto: `Error de Whisper: ${whisperData.error.message}` },
        ]);
        return;
      }

      const textoTranscrito = whisperData?.text?.trim();

      if (!textoTranscrito) {
        setMensajes((prev) => [
          ...prev,
          { tipo: "bot", texto: "No se captó ningún audio. Mantenga presionado el botón 🎙 mientras habla." },
        ]);
        return;
      }

      await enviarTexto(textoTranscrito);
    } catch (e) {
      console.error("Error transcribiendo:", e);
      setMensajes((prev) => [
        ...prev,
        { tipo: "bot", texto: `Error de conexión: ${e}` },
      ]);
    } finally {
      setTranscribiendo(false);
    }
  }

  // ── Lógica del chatbot ──
  async function enviarTexto(mensajeUsuario: string) {
    setCargando(true);

    const mensajesActualizados: Mensaje[] = [
      ...mensajes,
      { tipo: "user", texto: mensajeUsuario },
    ];
    setMensajes(mensajesActualizados);

    const mencionaEventos =
      /evento|bail|salon|salón|cerca|hoy|dónde|donde|busco|buscar|salsa|cumbia|danzón|danzon|mambo/i.test(
        mensajeUsuario
      );
    if (mencionaEventos) {
      const resultados: ResultadoEvento[] = allEvents.slice(0, 2).map((e) => ({
        nombre: e.nombre,
        info: `${e.genero} · ${e.hora} · ${e.van} van`,
        evento: e,
      }));
      setResultadosVisibles(resultados);
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
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: buildSystemPrompt(allEvents) },
            ...historial,
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      const data = await response.json();

      if (data.choices?.[0]?.message?.content) {
        setMensajes((prev) => [
          ...prev,
          { tipo: "bot", texto: data.choices[0].message.content },
        ]);
      } else if (data.error) {
        setMensajes((prev) => [
          ...prev,
          { tipo: "bot", texto: `Error: ${data.error.message}` },
        ]);
      } else {
        setMensajes((prev) => [
          ...prev,
          { tipo: "bot", texto: "Lo siento, no pude entender su consulta." },
        ]);
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

  async function enviar() {
    if (!texto.trim() || cargando) return;
    const msg = texto.trim();
    setTexto("");
    await enviarTexto(msg);
  }

  const ocupado = cargando || transcribiendo;

  return (
    <KeyboardAvoidingView
      style={s.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={s.header}>
        <Text style={s.eyebrow}>Dígame qué busca</Text>
        <Text style={s.title}>Buscar un evento</Text>
      </View>

      <ScrollView ref={scrollRef} style={s.chat} contentContainerStyle={s.chatContent}>
        {loadingEvents && (
          <View style={s.bubbleBot}>
            <Text style={s.bubbleBotText}>Cargando eventos de la ciudad...</Text>
          </View>
        )}

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

        {(cargando || transcribiendo) && (
          <View style={s.bubbleBot}>
            <ActivityIndicator color="#4A6C9B" />
            {transcribiendo && (
              <Text style={[s.bubbleBotText, { marginTop: 8, fontSize: 18 }]}>
                Entendiendo su mensaje de voz...
              </Text>
            )}
          </View>
        )}

        {resultadosVisibles.map((r, i) => (
          <TouchableOpacity
            key={i}
            style={s.resultCard}
            onPress={() =>
              router.push({
                pathname: "/detalle-evento",
                params: { evento: JSON.stringify(r.evento) },
              })
            }
          >
            <Text style={s.resultNombre}>{r.nombre}</Text>
            <Text style={s.resultInfo}>{r.info}</Text>
            <View style={s.resultBtn}>
              <Text style={s.resultBtnText}>Ver evento →</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {grabando && (
        <View style={s.recordingBar}>
          <Animated.View style={[s.recordingDot, { transform: [{ scale: pulseAnim }] }]} />
          <Text style={s.recordingText}>Grabando... suelte para enviar</Text>
        </View>
      )}

      <View style={s.inputBar}>
        <TextInput
          style={s.input}
          placeholder="Escriba aquí..."
          placeholderTextColor="#C4A882"
          value={texto}
          onChangeText={setTexto}
          onSubmitEditing={enviar}
          returnKeyType="send"
          editable={!ocupado && !grabando}
        />
        <TouchableOpacity
          style={[s.sendBtn, (ocupado || grabando) && s.btnDisabled]}
          onPress={enviar}
          disabled={ocupado || grabando}
        >
          <Text style={s.sendIcon}>➤</Text>
        </TouchableOpacity>
        <Pressable
          style={[s.micBtn, grabando && s.micBtnActive]}
          onLongPress={iniciarGrabacion}
          onPressOut={grabando ? detenerYTranscribir : undefined}
          delayLongPress={150}
          disabled={ocupado}
        >
          <Text style={s.micIcon}>{grabando ? "⏹" : "🎙"}</Text>
        </Pressable>
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
  chatContent: { padding: 18, gap: 14, paddingBottom: 8 },
  bubbleBot: {
    backgroundColor: "#FFFDF9",
    borderRadius: 22,
    borderBottomLeftRadius: 6,
    padding: 18,
    maxWidth: "82%",
    borderWidth: 1.5,
    borderColor: "#E8D5BC",
  },
  bubbleBotText: { fontSize: 26, color: "#2A1A1A", lineHeight: 32 },
  bubbleUser: {
    backgroundColor: "#4A6C9B",
    borderRadius: 22,
    borderBottomRightRadius: 6,
    padding: 18,
    maxWidth: "82%",
    alignSelf: "flex-end",
  },
  bubbleUserText: { fontSize: 26, color: "#F5EDE0", fontWeight: "600", lineHeight: 32 },
  resultCard: {
    backgroundColor: "#FFFDF9",
    borderRadius: 18,
    padding: 18,
    gap: 8,
    maxWidth: "88%",
    borderWidth: 1.5,
    borderColor: "#E8D5BC",
  },
  resultNombre: { fontSize: 22, color: "#2A1A1A", fontWeight: "400" },
  resultInfo: { fontSize: 16, color: "#5C6B7F", fontWeight: "600" },
  resultBtn: { backgroundColor: "#4E8963", borderRadius: 12, padding: 14, alignItems: "center", marginTop: 4 },
  resultBtnText: { color: "white", fontSize: 18, fontWeight: "700" },
  recordingBar: {
    backgroundColor: "#FFE8E8",
    borderTopWidth: 1.5,
    borderTopColor: "#FFBCBC",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
  },
  recordingDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: "#D94040" },
  recordingText: { fontSize: 18, color: "#D94040", fontWeight: "700" },
  inputBar: {
    backgroundColor: "#FFFDF9",
    borderTopWidth: 2,
    borderTopColor: "#E8D5BC",
    padding: 12,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#F5EDE0",
    borderWidth: 2,
    borderColor: "#E8D5BC",
    borderRadius: 14,
    padding: 14,
    fontSize: 20,
    color: "#2A1A1A",
  },
  sendBtn: { width: 54, height: 54, backgroundColor: "#4A6C9B", borderRadius: 14, alignItems: "center", justifyContent: "center" },
  micBtn: { width: 54, height: 54, backgroundColor: "#4E8963", borderRadius: 14, alignItems: "center", justifyContent: "center" },
  micBtnActive: { backgroundColor: "#D94040" },
  micIcon: { fontSize: 26 },
  sendIcon: { color: "white", fontSize: 24 },
  btnDisabled: { opacity: 0.4 },
});