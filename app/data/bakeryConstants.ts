// ============================================================================
// USUARIOS TEMPORALES DE PRUEBA — SYNAPSE-X OS (OSAI INDUSTRIAL)
// - Jerarquía: Nivel 10 exclusivo del Creador (10433935 en BovedaCreadorMaster);
//   hijas (Aleanny y Albany) como Superusers en escala progresiva (Nivel 1 -> 9)
//   por encima de ingenieros, técnicos y operadores.
// - Columna `tipoUsuario`: "prueba" para registros temporales; "real" para
//   usuarios definitivos una vez creados.
// ============================================================================

export type TipoUsuarioRegistro = "prueba" | "real";

export interface UserCredential {
  cedula: string;
  name: string;
  cargo: string;
  nivel: string;
  passwords: string[];
  phone: string;
  rol: "ingeniero" | "tecnico" | "usuario";
  subrolArea?: "administrador" | "operario_planta";
  tipoUsuario: TipoUsuarioRegistro;
  maxEstaciones: number;
}

export const MASTER_USER_DATABASE: { [key: string]: UserCredential } = {
  // 1. Ingeniero de Sistemas (Prueba)
  "40111222": {
    cedula: "40111222",
    name: "Ingeniero de Sistemas (Prueba)",
    cargo: "Ingeniero en Sistemas",
    nivel: "Nivel 8 - Soporte de Sistemas (Debajo de Superusers)",
    passwords: ["eng2026sys"],
    phone: "+56987654321",
    rol: "ingeniero",
    tipoUsuario: "prueba",
    maxEstaciones: 12,
  },

  // 2. Técnico de Informática (Prueba)
  "50111222": {
    cedula: "50111222",
    name: "Técnico de Informática (Prueba)",
    cargo: "Técnico en Informática",
    nivel: "Nivel 6 - Soporte Técnico y Terminales",
    passwords: ["tech2026"],
    phone: "+56998887766",
    rol: "tecnico",
    tipoUsuario: "prueba",
    maxEstaciones: 6,
  },

  // 3. Operario 1 del Área de Usuario — Rol Administrador (Prueba)
  "60111111": {
    cedula: "60111111",
    name: "Operario Admin (Prueba)",
    cargo: "Administrador de Área Usuario",
    nivel: "Nivel 5 - Administración Operativa",
    passwords: ["adminop2026"],
    phone: "+56911111111",
    rol: "usuario",
    subrolArea: "administrador",
    tipoUsuario: "prueba",
    maxEstaciones: 4,
  },

  // 4. Operario 2 del Área de Usuario — Operario de Planta (Prueba)
  "60222222": {
    cedula: "60222222",
    name: "Operario de Planta (Prueba)",
    cargo: "Operario de Planta de Producción",
    nivel: "Nivel 2 - Operación de Planta",
    passwords: ["planta2026"],
    phone: "+56922222222",
    rol: "usuario",
    subrolArea: "operario_planta",
    tipoUsuario: "prueba",
    maxEstaciones: 2,
  },
};

// Listas separadas para editar fácilmente en cada sección
export const USUARIOS_PRUEBA_AREA_USUARIO = Object.values(MASTER_USER_DATABASE).filter(
  (u) => u.rol === "usuario"
);

export const USUARIOS_PRUEBA_TECNICOS = Object.values(MASTER_USER_DATABASE).filter(
  (u) => u.rol === "tecnico"
);

export const USUARIOS_PRUEBA_INGENIEROS = Object.values(MASTER_USER_DATABASE).filter(
  (u) => u.rol === "ingeniero"
);

export const generar30PedidosPrueba = () => {
  return [];
};