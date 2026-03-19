import { Audio } from "expo-av";
import { useRouter } from "expo-router";
<<<<<<< Updated upstream
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
=======
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
>>>>>>> Stashed changes
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
<<<<<<< Updated upstream

const GROQ_API_KEY = "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"; 
=======
import { Evento, useUser } from "./UserContext";
import { NavBar } from "./inicio";

const GROQ_API_KEY = "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";
>>>>>>> Stashed changes
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const WHISPER_URL = "https://api.groq.com/openai/v1/audio/transcriptions";

<<<<<<< Updated upstream
const IMAGENES: Record<string, string> = {
  // Hombre
  guayabera:
    "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80",
  traje:
    "https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=600&q=80",
  zapatos_h:
    "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80",
  pantalon:
    "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
  // Mujer
  vestido:
    "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&q=80",
  falda:
    "https://images.unsplash.com/photo-1577900232427-18219b9166a0?w=600&q=80",
  blusa:
    "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&q=80",
  zapatos_m:
    "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80",
  // Fallback
  ropa: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80",
};

function getImagen(titulo: string): string {
  const t = titulo.toLowerCase();
  if (t.includes("guayabera") || t.includes("camisa"))
    return IMAGENES.guayabera;
  if (t.includes("traje") || t.includes("saco") || t.includes("blazer"))
    return IMAGENES.traje;
  if (
    t.includes("zapato") &&
    (t.includes("cuero") || t.includes("piel") || t.includes("hombre"))
  )
    return IMAGENES.zapatos_h;
  if (t.includes("pantalon") || t.includes("pantalón"))
    return IMAGENES.pantalon;
  if (t.includes("vestido")) return IMAGENES.vestido;
  if (t.includes("falda")) return IMAGENES.falda;
  if (t.includes("blusa") || t.includes("top")) return IMAGENES.blusa;
  if (
    t.includes("zapato") ||
    t.includes("calzado") ||
    t.includes("tacón") ||
    t.includes("tacon")
  )
    return IMAGENES.zapatos_m;
  return IMAGENES.ropa;
}

interface Prenda {
  icon: string;
  titulo: string;
  desc: string;
  genero: "hombre" | "mujer";
}

const SUGERENCIAS_DEFAULT: Prenda[] = [
  {
    icon: "👔",
    titulo: "Guayabera blanca",
    desc: "Fresca y elegante, ideal para danzón en la mañana",
    genero: "hombre",
  },
  {
    icon: "👞",
    titulo: "Zapatos de piel oscuros",
    desc: "Suela de cuero para deslizarse bien en la pista",
    genero: "hombre",
  },
  {
    icon: "👗",
    titulo: "Vestido midi de vuelo",
    desc: "Largo a la rodilla, tela ligera que acompaña el movimiento",
    genero: "mujer",
  },
  {
    icon: "👟",
    titulo: "Zapatos de tacón bajo cómodos",
    desc: "Tacón de 3–4 cm, estables y elegantes para bailar",
    genero: "mujer",
  },
];

const CONSEJO_DEFAULT =
  "Un pañuelo de bolsillo para ellos y un abanico pequeño para ellas siempre dan un toque muy elegante en la pista";
=======
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
>>>>>>> Stashed changes

export default function Atuendo() {
  const router = useRouter();
<<<<<<< Updated upstream
  const [sugerencias, setSugerencias] = useState<Prenda[]>(SUGERENCIAS_DEFAULT);
  const [consejo, setConsejo] = useState(CONSEJO_DEFAULT);
  const [cargando, setCargando] = useState(true);
  const [tab, setTab] = useState<"hombre" | "mujer">("hombre");

  useEffect(() => {
    cargarIA();
  }, []);
=======
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
>>>>>>> Stashed changes

  async function cargarIA() {
    try {
      const response = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
<<<<<<< Updated upstream
            {
              role: "system",
              content: `Eres un experto en moda para baile de salón en México para adultos mayores de 60+ años.
Las sugerencias deben ser CONSERVADORAS y CÓMODAS: nada juvenil, nada apretado, nada con tacones altos.
Para mujer: vestidos midi (a la rodilla o más largo), blusas amplias, faldas de vuelo, zapatos de tacón bajo (máx 4cm) o planos elegantes.
Para hombre: guayaberas, trajes ligeros, camisas formales, zapatos de piel cómodos.
Responde ÚNICAMENTE con JSON válido, sin texto extra, sin markdown.
Formato exacto:
{"sugerencias":[
  {"icon":"emoji","titulo":"nombre prenda","desc":"descripción corta y amable","genero":"hombre"},
  {"icon":"emoji","titulo":"nombre prenda","desc":"descripción corta y amable","genero":"hombre"},
  {"icon":"emoji","titulo":"nombre prenda","desc":"descripción corta y amable","genero":"mujer"},
  {"icon":"emoji","titulo":"nombre prenda","desc":"descripción corta y amable","genero":"mujer"}
],"consejo":"consejo breve y amable para ambos"}`,
            },
            {
              role: "user",
              content:
                "Dame 2 sugerencias de atuendo para hombre adulto mayor y 2 para mujer adulta mayor para ir a bailar Danzón al Salón Los Ángeles mañana por la mañana.",
            },
=======
            { role: "system", content: buildSystemPrompt(allEvents) },
            ...historial,
>>>>>>> Stashed changes
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });
      const data = await response.json();
<<<<<<< Updated upstream
      const texto = data.choices?.[0]?.message?.content ?? "";
      const clean = texto.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      if (parsed.sugerencias) setSugerencias(parsed.sugerencias);
      if (parsed.consejo) setConsejo(parsed.consejo);
    } catch (e) {
      // Se quedan las sugerencias por defecto
=======

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
>>>>>>> Stashed changes
    } finally {
      setCargando(false);
    }
  }

<<<<<<< Updated upstream
  const prendasVisibles = sugerencias.filter((p) => p.genero === tab);
=======
  async function enviar() {
    if (!texto.trim() || cargando) return;
    const msg = texto.trim();
    setTexto("");
    await enviarTexto(msg);
  }

  const ocupado = cargando || transcribiendo;
>>>>>>> Stashed changes

  return (
    <View style={s.screen}>
      {/* Header azul */}
      <View style={s.header}>
        <TouchableOpacity style={s.back} onPress={() => router.back()}>
          <Text style={s.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={s.eyebrow}>Salón Los Ángeles · Mañana</Text>
        <Text style={s.title}>¿Qué me pongo?</Text>
      </View>

<<<<<<< Updated upstream
      {/* Tabs hombre / mujer */}
      <View style={s.tabRow}>
        <TouchableOpacity
          style={[s.tab, tab === "hombre" && s.tabActive]}
          onPress={() => setTab("hombre")}
        >
          <Text style={[s.tabText, tab === "hombre" && s.tabTextActive]}>
            👔 Para ellos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.tab, tab === "mujer" && s.tabActive]}
          onPress={() => setTab("mujer")}
        >
          <Text style={[s.tabText, tab === "mujer" && s.tabTextActive]}>
            💃 Para ellas
          </Text>
=======
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
>>>>>>> Stashed changes
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

      <ScrollView
        style={s.body}
        contentContainerStyle={s.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {cargando ? (
          <View style={s.loadingBox}>
            <ActivityIndicator color="#4A6C9B" size="large" />
            <Text style={s.loadingText}>Consultando al experto de moda...</Text>
          </View>
        ) : (
          <>
            {prendasVisibles.map((sg, i) => (
              <View key={i} style={s.prendaCard}>
                {/* Imagen */}
                <Image
                  source={{ uri: getImagen(sg.titulo) }}
                  style={s.prendaImg}
                  resizeMode="cover"
                />
                {/* Info */}
                <View style={s.prendaInfo}>
                  <View style={s.prendaIconBox}>
                    <Text style={s.prendaIconText}>{sg.icon}</Text>
                  </View>
                  <View style={s.prendaTexto}>
                    <Text style={s.prendaTitulo}>{sg.titulo}</Text>
                    <Text style={s.prendaDesc}>{sg.desc}</Text>
                  </View>
                </View>
              </View>
            ))}

            {/* Consejo del día */}
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

  // Header — azul
  header: { backgroundColor: "#4A6C9B", padding: 28, paddingBottom: 24 },
  back: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  backText: { color: "#F5EDE0", fontSize: 36, lineHeight: 40 },
  eyebrow: {
    fontSize: 14,
    fontWeight: "700",
    color: "rgba(245,237,224,0.55)",
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: { fontSize: 32, color: "#F5EDE0", fontWeight: "400", lineHeight: 40 },
<<<<<<< Updated upstream

  // Tabs — continúan el azul
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#4A6C9B",
    paddingHorizontal: 22,
    paddingBottom: 22,
    gap: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  tabActive: { backgroundColor: "#F5EDE0" },
  tabText: { fontSize: 17, fontWeight: "700", color: "rgba(245,237,224,0.6)" },
  tabTextActive: { color: "#4A6C9B" },

  // Contenido
  body: { flex: 1 },
  bodyContent: { padding: 20, gap: 18, paddingBottom: 36 },

  loadingBox: { alignItems: "center", paddingVertical: 48, gap: 16 },
  loadingText: {
    fontSize: 18,
    color: "#4A6C9B",
    textAlign: "center",
    lineHeight: 28,
  },

  // Tarjeta de prenda
  prendaCard: {
    backgroundColor: "#FFFDF9",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "#D6E0EE",
    // Sombra suave
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  prendaImg: {
    width: "100%",
    height: 220,
  },
  prendaInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 18,
  },
  prendaIconBox: {
    width: 54,
    height: 54,
    backgroundColor: "#EBF0F8",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  prendaIconText: { fontSize: 28 },
  prendaTexto: { flex: 1 },
  prendaTitulo: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2A1A1A",
    lineHeight: 26,
  },
  prendaDesc: { fontSize: 15, color: "#5C6B7F", marginTop: 5, lineHeight: 22 },

  // Consejo
  tip: {
    backgroundColor: "#4E8963",
    borderRadius: 18,
    padding: 22,
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",
  },
  tipIcon: { fontSize: 30 },
  tipBody: { flex: 1 },
  tipTitulo: {
    fontSize: 14,
    fontWeight: "700",
    color: "white",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  tipMsg: { fontSize: 18, color: "rgba(255,255,255,0.92)", lineHeight: 28 },

  // Botón
  btn: {
    backgroundColor: "#4A6C9B",
    borderRadius: 18,
    paddingVertical: 22,
    alignItems: "center",
  },
  btnText: { color: "#F5EDE0", fontSize: 24, fontWeight: "800" },
});
=======
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
>>>>>>> Stashed changes
