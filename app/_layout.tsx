import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="registro-nombre" />
        <Stack.Screen name="registro-ciudad" />
        <Stack.Screen name="registro-musica" />
        <Stack.Screen name="inicio" />
        <Stack.Screen name="buscar" />
        <Stack.Screen name="guardados" />
        <Stack.Screen name="detalle-evento" />
        <Stack.Screen name="atuendo" />
        <Stack.Screen name="recordatorios" />
        <Stack.Screen name="perfil" />
        <Stack.Screen name="eventos-cerca" />
      </Stack>
    </>
  );
}
