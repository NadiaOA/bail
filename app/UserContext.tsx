import React, { createContext, ReactNode, useContext, useState } from "react";

// Define la forma del perfil de usuario
interface UserProfile {
  nombre: string;
  estado: string;
  municipio: string;
  musica: string[];
}

// Define la forma del valor del contexto
interface UserContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

// Crea el contexto
const UserContext = createContext<UserContextType | undefined>(undefined);

// Crea el componente proveedor
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile>({
    // Valores por defecto por si el usuario omite el registro
    nombre: "Doña Carmen",
    estado: "Ciudad de México",
    municipio: "Cuauhtémoc",
    musica: ["Danzón", "Salsa"],
  });

  // Función para actualizar partes del perfil
  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  return <UserContext.Provider value={{ profile, updateProfile }}>{children}</UserContext.Provider>;
};

// Crea un hook personalizado para consumir el contexto fácilmente
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser debe ser usado dentro de un UserProvider");
  }
  return context;
};