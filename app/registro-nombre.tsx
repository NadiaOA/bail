import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useUser } from "./UserContext";

export default function RegistroNombre() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const { updateProfile } = useUser();

  function handleNext() {
    if (!nombre.trim()) return;
    updateProfile({ nombre: nombre.trim() });
    router.push("/registro-ciudad" as any);
  }

  return (
    <KeyboardAvoidingView
      style={s.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={s.header}>
        <Text style={s.step}>Paso 1 de 3</Text>
        <Text style={s.title}>¿Cómo se llama usted?</Text>
        <View style={s.progress}>
          <View style={[s.dot, s.dotActive]} />
          <View style={[s.dot, s.dotInactive]} />
          <View style={[s.dot, s.dotInactive]} />
        </View>
      </View>

      <View style={s.body}>
        <View style={s.top}>
          <View style={s.inputWrap}>
            <Text style={s.inputLabel}>Su nombre</Text>
            <TextInput
              style={s.input}
              value={nombre}
              onChangeText={setNombre}
              placeholder="Escribe su nombre aquí"
              placeholderTextColor="#C4A882"
              autoFocus
              returnKeyType="next"
            />
          </View>
          <Text style={s.hint}>Puede ser su nombre o su apodo</Text>
        </View>

        <TouchableOpacity
          style={[s.btn, !nombre.trim() && s.btnDisabled]}
          onPress={handleNext}
        >
          <Text style={s.btnText}>Siguiente →</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  dotActive: { backgroundColor: "#F5EDE0" },
  dotInactive: { backgroundColor: "rgba(255,255,255,0.2)" },
  body: { flex: 1, padding: 24, justifyContent: "space-between" },
  top: { gap: 16 },
  inputWrap: {
    backgroundColor: "#FFFDF9",
    borderRadius: 18,
    borderWidth: 2.5,
    borderColor: "#8B1A1A",
    padding: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: "#C4A882",
    marginBottom: 8,
  },
  input: { fontSize: 32, color: "#2A1A1A" },
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
