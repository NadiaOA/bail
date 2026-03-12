// ── ARCHIVO: app/registro-ciudad.tsx ─────────────────────────
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useUser } from "./UserContext";

const ESTADOS = [
  "Ciudad de México",
  "Jalisco",
  "Nuevo León",
  "Puebla",
  "Veracruz",
  "Oaxaca",
  "Guanajuato",
  "Chihuahua",
];
const MUNICIPIOS: Record<string, string[]> = {
  "Ciudad de México": [
    "Cuauhtémoc",
    "Benito Juárez",
    "Coyoacán",
    "Miguel Hidalgo",
    "Iztapalapa",
    "Tlalpan",
    "Xochimilco",
  ],
  Jalisco: ["Guadalajara", "Zapopan", "Tlaquepaque", "Tonalá"],
  "Nuevo León": ["Monterrey", "San Nicolás", "Guadalupe", "San Pedro"],
  Puebla: ["Puebla", "Cholula", "Tehuacán"],
  Veracruz: ["Veracruz", "Xalapa", "Coatzacoalcos"],
  Oaxaca: ["Oaxaca de Juárez", "Huajuapan", "Juchitán"],
  Guanajuato: ["León", "Guanajuato", "Irapuato", "Celaya"],
  Chihuahua: ["Chihuahua", "Ciudad Juárez", "Delicias"],
};

export default function RegistroCiudad() {
  const router = useRouter();
  const { updateProfile } = useUser();
  const [estado, setEstado] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [showEstados, setShowEstados] = useState(false);
  const [showMunicipios, setShowMunicipios] = useState(false);

  const canContinue = estado && municipio;

  function handleNext() {
    if (!canContinue) return;
    updateProfile({ estado, municipio });
    router.push("/registro-musica" as any);
  }

  return (
    <View style={s.screen}>
      <View style={s.header}>
        <Text style={s.step}>Paso 2 de 3</Text>
        <Text style={s.title}>¿Dónde vive usted?</Text>
        <View style={s.progress}>
          <View style={[s.dot, s.dotDone]} />
          <View style={[s.dot, s.dotActive]} />
          <View style={[s.dot, s.dotInactive]} />
        </View>
      </View>

      <View style={s.body}>
        <View style={s.top}>
          {/* Estado */}
          <TouchableOpacity
            style={[s.field, estado && s.fieldActive]}
            onPress={() => {
              setShowEstados(!showEstados);
              setShowMunicipios(false);
            }}
          >
            <View>
              <Text style={s.fieldLabel}>Estado</Text>
              <Text style={[s.fieldValue, !estado && s.fieldPlaceholder]}>
                {estado || "Seleccione su estado"}
              </Text>
            </View>
            <Text style={s.arrow}>{showEstados ? "▲" : "▼"}</Text>
          </TouchableOpacity>

          {showEstados && (
            <ScrollView style={s.dropdown} nestedScrollEnabled>
              {ESTADOS.map((e) => (
                <TouchableOpacity
                  key={e}
                  style={s.dropItem}
                  onPress={() => {
                    setEstado(e);
                    setMunicipio("");
                    setShowEstados(false);
                  }}
                >
                  <Text style={[s.dropText, estado === e && s.dropTextActive]}>
                    {e}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Municipio */}
          <TouchableOpacity
            style={[
              s.field,
              municipio && s.fieldActive,
              !estado && s.fieldDisabled,
            ]}
            onPress={() =>
              estado &&
              (setShowMunicipios(!showMunicipios), setShowEstados(false))
            }
          >
            <View>
              <Text style={s.fieldLabel}>Alcaldía o Municipio</Text>
              <Text style={[s.fieldValue, !municipio && s.fieldPlaceholder]}>
                {municipio || "Seleccione su municipio"}
              </Text>
            </View>
            <Text style={s.arrow}>{showMunicipios ? "▲" : "▼"}</Text>
          </TouchableOpacity>

          {showMunicipios && estado && (
            <ScrollView style={s.dropdown} nestedScrollEnabled>
              {(MUNICIPIOS[estado] || []).map((m) => (
                <TouchableOpacity
                  key={m}
                  style={s.dropItem}
                  onPress={() => {
                    setMunicipio(m);
                    setShowMunicipios(false);
                  }}
                >
                  <Text
                    style={[s.dropText, municipio === m && s.dropTextActive]}
                  >
                    {m}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <Text style={s.hint}>No necesitamos saber su ubicación exacta</Text>
        </View>

        <TouchableOpacity
          style={[s.btn, !canContinue && s.btnDisabled]}
          onPress={handleNext}
        >
          <Text style={s.btnText}>Siguiente →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F5EDE0" },
  header: {
    backgroundColor: "#8B1A1A",
    paddingTop: 60,
    paddingHorizontal: 26,
    paddingBottom: 32,
  },
  step: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "rgba(245,237,224,0.5)",
    marginBottom: 8,
  },
  title: { fontSize: 34, color: "#F5EDE0", lineHeight: 42 },
  progress: { flexDirection: "row", gap: 8, marginTop: 16 },
  dot: { height: 5, borderRadius: 3, flex: 1, maxWidth: 56 },
  dotDone: { backgroundColor: "rgba(245,237,224,0.9)" },
  dotActive: { backgroundColor: "#F5EDE0" },
  dotInactive: { backgroundColor: "rgba(255,255,255,0.2)" },
  body: { flex: 1, padding: 24, justifyContent: "space-between" },
  top: { gap: 12 },
  field: {
    backgroundColor: "#FFFDF9",
    borderRadius: 18,
    borderWidth: 2.5,
    borderColor: "#E8D5BC",
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fieldActive: { borderColor: "#8B1A1A" },
  fieldDisabled: { opacity: 0.4 },
  fieldLabel: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: "#C4A882",
    marginBottom: 4,
  },
  fieldValue: { fontSize: 24, color: "#2A1A1A" },
  fieldPlaceholder: { color: "#C4A882" },
  arrow: { fontSize: 18, color: "#C4A882" },
  dropdown: {
    backgroundColor: "#FFFDF9",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E8D5BC",
    maxHeight: 180,
  },
  dropItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#F5EDE0" },
  dropText: { fontSize: 20, color: "#2A1A1A", fontWeight: "500" },
  dropTextActive: { color: "#8B1A1A", fontWeight: "800" },
  hint: {
    fontSize: 17,
    color: "#7A5050",
    textAlign: "center",
    lineHeight: 26,
    fontWeight: "500",
  },
  btn: {
    backgroundColor: "#8B1A1A",
    borderRadius: 18,
    paddingVertical: 22,
    alignItems: "center",
  },
  btnDisabled: { opacity: 0.4 },
  btnText: { fontSize: 24, fontWeight: "800", color: "#F5EDE0" },
});
