import React, { createContext, ReactNode, useContext, useState } from "react";

// Define la forma del perfil de usuario
interface UserProfile {
  nombre: string;
  estado: string;
  municipio: string;
  musica: string[];
  savedEvents: string[];
}

// Define la forma del valor del contexto
interface UserContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  // Helpers para manejar eventos guardados
  isEventSaved: (eventId: string) => boolean;
  toggleSaveEvent: (eventId: string) => void;
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
    savedEvents: [], // Inicialmente no hay eventos guardados
  });

  // Función para actualizar partes del perfil
  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const isEventSaved = (eventId: string) => {
    return profile.savedEvents.includes(eventId);
  };

  const toggleSaveEvent = (eventId: string) => {
    setProfile((prev) => {
      const isSaved = prev.savedEvents.includes(eventId);
      const newSavedEvents = isSaved
        ? prev.savedEvents.filter((id) => id !== eventId)
        : [...prev.savedEvents, eventId];
      return { ...prev, savedEvents: newSavedEvents };
    });
  };

  return <UserContext.Provider value={{ profile, updateProfile, isEventSaved, toggleSaveEvent }}>{children}</UserContext.Provider>;
};

// Crea un hook personalizado para consumir el contexto fácilmente
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser debe ser usado dentro de un UserProvider");
  }
  return context;
};