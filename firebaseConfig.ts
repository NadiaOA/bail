import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// NOTA: Debes reemplazar estos valores con los de tu proyecto en Firebase Console
// (Ve a: Project Settings > General > Your apps > SDK Setup and Configuration)
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};

// Inicializamos la conexión
const app = initializeApp(firebaseConfig);
// Exportamos la base de datos para usarla en otras pantallas
export const db = getFirestore(app);