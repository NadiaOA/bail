import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Bienvenida() {
  const router = useRouter();
  return (
    <View style={s.screen}>
      <Text style={s.mushroom}>🍄</Text>
      <Text style={s.title}>bail</Text>
      <Text style={s.tagline}>Eventos de baile{"\n"}cerca de usted</Text>
      <TouchableOpacity
        style={s.btnPrimary}
        onPress={() => router.push("/registro-nombre" as any)}
      >
        <Text style={s.btnPrimaryText}>Comenzar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={s.btnSecondary}
        onPress={() => router.push("/inicio" as any)}
      >
        <Text style={s.btnSecondaryText}>Ya tengo cuenta</Text>
      </TouchableOpacity>
    </View>
  );
}
const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#8B1A1A",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  mushroom: { fontSize: 80, marginBottom: 16 },
  title: { fontSize: 64, color: "#F5EDE0", letterSpacing: 3, marginBottom: 12 },
  tagline: {
    fontSize: 20,
    color: "rgba(245,237,224,0.6)",
    textAlign: "center",
    lineHeight: 30,
    marginBottom: 56,
    fontWeight: "500",
  },
  btnPrimary: {
    backgroundColor: "#F5EDE0",
    borderRadius: 18,
    paddingVertical: 22,
    width: "100%",
    alignItems: "center",
    marginBottom: 14,
  },
  btnPrimaryText: { color: "#8B1A1A", fontSize: 24, fontWeight: "800" },
  btnSecondary: {
    borderWidth: 2.5,
    borderColor: "rgba(245,237,224,0.25)",
    borderRadius: 18,
    paddingVertical: 20,
    width: "100%",
    alignItems: "center",
  },
  btnSecondaryText: {
    color: "rgba(245,237,224,0.6)",
    fontSize: 18,
    fontWeight: "600",
  },
});
