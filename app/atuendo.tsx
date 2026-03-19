import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const GROQ_API_KEY = "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"; 

const IMAGENES: Record<string, string> = {
  // Hombre
  guayabera:
    "https://www.elpalaciodehierro.com/dw/image/v2/BDKB_PRD/on/demandware.static/-/Sites-palacio-master-catalog/default/dwb205b0c8/images/44304994/BEIGE/large/44305005_x4.jpg?sw=2200&sh=2500",
  traje:
    "https://www.elpalaciodehierro.com/dw/image/v2/BDKB_PRD/on/demandware.static/-/Sites-palacio-master-catalog/default/dw00b9cedb/images/43434813/AZUL%20OBSCURO/large/43434814_x6.jpg?sw=2200&sh=2500",
  zapatos_h:
    "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80",
  pantalon:
    "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
  // Mujer
  vestido:
    "https://www.elpalaciodehierro.com/dw/image/v2/BDKB_PRD/on/demandware.static/-/Sites-palacio-master-catalog/default/dw423e43c7/images/43316925/MULTICOLOR/large/43316926_x4.jpg?sw=2200&sh=2500",
  falda:
    "https://www.elpalaciodehierro.com/dw/image/v2/BDKB_PRD/on/demandware.static/-/Sites-palacio-master-catalog/default/dwe2034074/images/44967026/MULTICOLOR/large/44967027_x4.jpg?sw=2200&sh=2500",
  blusa:
    "https://www.elpalaciodehierro.com/dw/image/v2/BDKB_PRD/on/demandware.static/-/Sites-palacio-master-catalog/default/dw6ef11405/images/45033087/MULTICOLOR/large/45033088_x4.jpg?sw=2200&sh=2500",
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

export default function Atuendo() {
  const router = useRouter();
  const [sugerencias, setSugerencias] = useState<Prenda[]>(SUGERENCIAS_DEFAULT);
  const [consejo, setConsejo] = useState(CONSEJO_DEFAULT);
  const [cargando, setCargando] = useState(true);
  const [tab, setTab] = useState<"hombre" | "mujer">("hombre");

  useEffect(() => {
    cargarIA();
  }, []);

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
          ],
          max_tokens: 500,
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
      // Se quedan las sugerencias por defecto
    } finally {
      setCargando(false);
    }
  }

  const prendasVisibles = sugerencias.filter((p) => p.genero === tab);

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
        </TouchableOpacity>
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
