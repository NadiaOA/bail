import { useRouter } from "expo-router";
import { useState } from "react";
import {
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

const resultados = [
  { nombre: "Salón Los Ángeles", info: "Domingo · 10:00 am · 38 van" },
  { nombre: "Salón México", info: "Domingo · 11:00 am · 22 van" },
];

export default function Buscar() {
  const router = useRouter();
  const [texto, setTexto] = useState("");
  const [mensajes, setMensajes] = useState([
    { tipo: "bot", texto: "¿Qué evento le gustaría encontrar hoy?" },
  ]);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  function enviar() {
    if (!texto.trim()) return;
    const nuevosMensajes = [
      ...mensajes,
      { tipo: "user", texto },
      { tipo: "bot", texto: "Encontré 2 eventos cerca de usted:" },
    ];
    setMensajes(nuevosMensajes);
    setTexto("");
    setMostrarResultados(true);
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
          ),
        )}

        {mostrarResultados &&
          resultados.map((r, i) => (
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
        />
        <TouchableOpacity style={s.sendBtn} onPress={enviar}>
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
  eyebrow: {
    fontSize: 14,
    fontWeight: "700",
    color: "rgba(245,237,224,0.5)",
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: { fontSize: 30, color: "#F5EDE0", fontWeight: "400", lineHeight: 38 },
  chat: { flex: 1 },
  chatContent: { padding: 18, gap: 14 },
  bubbleBot: {
    backgroundColor: "#FFFDF9",
    borderRadius: 22,
    borderBottomLeftRadius: 6,
    padding: 18,
    maxWidth: "82%",
    borderWidth: 1.5,
    borderColor: "#E8D5BC",
  },
  bubbleBotText: { fontSize: 18, color: "#2A1A1A", lineHeight: 28 },
  bubbleUser: {
    backgroundColor: "#8B1A1A",
    borderRadius: 22,
    borderBottomRightRadius: 6,
    padding: 18,
    maxWidth: "82%",
    alignSelf: "flex-end",
  },
  bubbleUserText: {
    fontSize: 18,
    color: "#F5EDE0",
    fontWeight: "600",
    lineHeight: 28,
  },
  resultCard: {
    backgroundColor: "#FFFDF9",
    borderRadius: 18,
    padding: 18,
    gap: 8,
    maxWidth: "88%",
    borderWidth: 1.5,
    borderColor: "#E8D5BC",
  },
  resultNombre: { fontSize: 20, color: "#2A1A1A", fontWeight: "400" },
  resultInfo: { fontSize: 15, color: "#7A5050", fontWeight: "600" },
  resultBtn: {
    backgroundColor: "#4E8963",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginTop: 4,
  },
  resultBtnText: { color: "white", fontSize: 17, fontWeight: "700" },
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
    fontSize: 18,
    color: "#2A1A1A",
  },
  sendBtn: {
    width: 54,
    height: 54,
    backgroundColor: "#8B1A1A",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  sendIcon: { color: "white", fontSize: 20 },
});
