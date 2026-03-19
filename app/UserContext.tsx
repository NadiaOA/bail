import { collection, getDocs } from "firebase/firestore";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { db } from "../firebaseConfig";

// Define la forma del perfil de usuario
export interface UserProfile {
  nombre: string;
  estado: string;
  municipio: string;
  musica: string[];
  savedEvents: string[];
}

// Define la forma del evento para consistencia en toda la app
export interface Evento {
  id: string;
  nombre: string;
  genero: string;
  fecha: string;
  hora: string;
  lugar: string;
  van: number;
  imagen: string;
}

// Creamos una lista maestra de eventos locales para tener un respaldo y evitar duplicados.
// Esta será la "fuente de verdad" si la conexión a internet falla.
const ALL_INITIAL_EVENTS: Evento[] = [
  {
    id: "sla-0",
    nombre: "Gran Salón Internacional",
    genero: "Salsa",
    fecha: "Viernes 27 de marzo",
    hora: "7:00 PM",
    lugar: "Tlatelolco, CDMX",
    van: 0,
    imagen: "https://www.convencionestlatelolco.com/_astro/GranSalon.BSmIsd1i.jpg",
  },
  {
    id: "sla-1",
    nombre: "Salón Los Ángeles",
    genero: "Danzón",
    fecha: "Sábado 28 de marzo",
    hora: "10:00 AM",
    lugar: "Tlatelolco, CDMX",
    van: 1,
    imagen: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/23/f3/ae/2d/caption.jpg?w=1200&h=1200&s=1",
  },
  {
    id: "inicial-ciudade",
    genero: "Danzón",
    nombre: "Plaza de la Ciudadela",
    fecha: "Cada Domingo",
    hora: "11:00 de la mañana",
    lugar: "Balderas, Centro",
    van: 3,
    imagen: "https://interactivo.eluniversal.com.mx/mochilazo-tiempo/interiores/ciudadelaA.jpg",
  },
  {
    id: "inicial-venados",
    genero: "Danzón",
    nombre: "Parque de los Venados",
    fecha: "Cada Domingo",
    hora: "12:00 del día",
    lugar: "Benito Juárez",
    van: 20,
    imagen: "https://images.unsplash.com/photo-1589218149378-184954a33986?q=80&w=800",
  },
  {
    id: "inicial-alameda-central", // ID corregido
    nombre: "Alameda Central",
    genero: "Salsa",
    fecha: "Todos los Domingos",
    hora: "A partir de las 12 del mediodía",
    lugar: "Centro Histórico, Bellas Artes, CDMX",
    van: 6,
    imagen: "https://mexicocity.cdmx.gob.mx/wp-content/uploads/2023/11/Alameda-Central.jpg",
  },
  {
    id: "inicial-morisco",
    nombre: "Kiosco Morisco",
    genero: "Danzón, Mambo, Salsa",
    fecha: "Todos los Domingos",
    hora: "3 - 8 PM",
    lugar: "Kiosc Morisco, Sta. Maria La Ribera, CDMX",
    van: 32,
    imagen: "https://i0.wp.com/godinchilango.mx/wp-content/uploads/2024/06/kiosco-morisco-santa-maria-la-ribera-ciudad-mexico-cdmx_4.jpg?resize=750%2C600&ssl=1",
  },
  {
    id: "inicial-alameda-sur", // ID corregido
    genero: "🎩 Danzón",
    nombre: "Alameda del Sur",
    fecha: "Cada Domingo",
    hora: "4:00 de la tarde",
    lugar: "Coyoacán",
    van: 45,
    imagen: "https://images.unsplash.com/photo-1611928543823-39e7d683f549?q=80&w=800",
  },
  {
    id: "salon1",
    nombre: "Salón Xcaret",
    genero: "Salsa",
    fecha: "Sábado 28 de marzo",
    hora: "5:00 PM",
    lugar: "Tlatelolco, CDMX",
    van: 0,
    imagen: "https://www.convencionestlatelolco.com/_astro/SalonXcaret.CUT1viYI.jpg",
  },
  {
    id: "salon2",
    nombre: "Salón Tulum",
    genero: "Salsa",
    fecha: "Viernes 3 de abril",
    hora: "8:00 PM",
    lugar: "Tlatelolco, CDMX",
    van: 0,
    imagen: "https://www.convencionestlatelolco.com/_astro/SalonTulum.w4YkIn3t.jpg",
  },
  {
    id: "salon3",
    nombre: "Salón Royal Rizzo",
    genero: "Mambo",
    fecha: "Miercoles 1 de abril",
    hora: "8:00 PM",
    lugar: "Lindavista, CDMX",
    van: 0,
    imagen: "https://lh3.googleusercontent.com/gps-cs-s/AHVAweqJgxdyRvI6vblc4yU1tMCGfcaTReMY50KqhM18u9pA9nvDG-23etYUkLQYratrCucT4Y3f88E6-O9_3B7rJllkqKzMw2I2OZ6CkeMWyV_-wa6OidlSDmxJccS0BPQQvOA5r8U=s680-w680-h510-rw",
  },
];

// Define la forma del valor del contexto
interface UserContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  // Helpers para manejar eventos guardados
  isEventSaved: (eventId: string) => boolean;
  toggleSaveEvent: (eventId: string) => void;
  // Centralizamos los eventos y el estado de carga
  allEvents: Evento[];
  loadingEvents: boolean;
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

  const [allEvents, setAllEvents] = useState<Evento[]>(ALL_INITIAL_EVENTS);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // Centralizamos la carga de eventos aquí para que se haga una sola vez
  useEffect(() => {
    async function obtenerEventosWeb() {
      try {
        console.log("Cargando eventos desde el Contexto central...");
        const querySnapshot = await getDocs(collection(db, "eventos"));
        const eventosFirebase: Evento[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            nombre: data.nombre || "Evento sin nombre",
            genero: data.genero || "Baile",
            fecha: data.fecha || "Fecha no disponible",
            hora: data.hora || "Hora no disponible",
            lugar: data.lugar || "Lugar no disponible",
            van: data.van || 0,
            imagen: data.imagen || "https://images.unsplash.com/photo-1519225421980-715cb0215aED?q=80&w=800",
          };
        });

        if (eventosFirebase.length > 0) {
          // Combinamos los eventos de Firebase con los locales, evitando duplicados
          const nombresFirebase = new Set(eventosFirebase.map(e => e.nombre));
          const eventosInicialesFiltrados = ALL_INITIAL_EVENTS.filter(e => !nombresFirebase.has(e.nombre));
          setAllEvents([...eventosFirebase, ...eventosInicialesFiltrados]);
        }
      } catch (error) {
        console.error("Error centralizado al obtener eventos:", error);
        // Si falla, la app usará los eventos locales de respaldo
      } finally {
        setLoadingEvents(false);
      }
    }

    obtenerEventosWeb();
  }, []);

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

  return <UserContext.Provider value={{ profile, updateProfile, isEventSaved, toggleSaveEvent, allEvents, loadingEvents }}>{children}</UserContext.Provider>;
};

// Crea un hook personalizado para consumir el contexto fácilmente
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser debe ser usado dentro de un UserProvider");
  }
  return context;
};