// app/data/bakeryConstants.ts

export interface UserCredential {
  cedula: string;
  name: string;
  cargo: string;
  nivel: string;
  passwords: string[];
  phone: string;
  rol: "ingeniero" | "tecnico" | "usuario";
  maxEstaciones: number;
}

export const MASTER_USER_DATABASE: { [key: string]: UserCredential } = {
  // --- INGENIEROS (Niveles Altos de Arquitectura y Control) ---
  "40111222": {
    cedula: "40111222",
    name: "Ing. Carlos Mendoza",
    cargo: "Ingeniero en Sistemas",
    nivel: "Nivel 9 - Arquitectura Core y Despliegue",
    passwords: ["eng2026sys", "sysadmin99"],
    phone: "+56987654321",
    rol: "ingeniero",
    maxEstaciones: 12
  },
  "40333444": {
    cedula: "40333444",
    name: "Ing. Sofía Valenzuela",
    cargo: "Ingeniero en Sistemas",
    nivel: "Nivel 8 - Redes, Protocolos y Seguridad de Datos",
    passwords: ["sysnet99", "netpass12"],
    phone: "+56912345678",
    rol: "ingeniero",
    maxEstaciones: 12
  },

  // --- TÉCNICOS (Niveles Medios-Altos de Soporte y Diagnóstico) ---
  "50111222": {
    cedula: "50111222",
    name: "Tec. Marcos Pérez",
    cargo: "Técnico en Informática",
    nivel: "Nivel 7 - Soporte Avanzado y Diagnóstico de Hardware",
    passwords: ["tech2026", "soporte123"],
    phone: "+56998887766",
    rol: "tecnico",
    maxEstaciones: 6
  },
  "50333444": {
    cedula: "50333444",
    name: "Tec. Andrea Gómez",
    cargo: "Técnico en Informática",
    nivel: "Nivel 6 - Mantenimiento de Terminales e Interfaces",
    passwords: ["tech99", "terminales45"],
    phone: "+56944443322",
    rol: "tecnico",
    maxEstaciones: 6
  },

  // --- OPERADORES DE TALLER (Niveles Operativos 1 al 5) ---
  "60111111": {
    cedula: "60111111",
    name: "Delvis Arteaga",
    cargo: "Operador de Producción",
    nivel: "Nivel 5 - Producción Líder y Supervisión de Línea",
    passwords: ["delvis2026"],
    phone: "+56911111111",
    rol: "usuario",
    maxEstaciones: 2
  },
  "60222222": {
    cedula: "60222222",
    name: "Elvis Vera",
    cargo: "Operador de Amasado",
    nivel: "Nivel 4 - Estación de Amasado y Mezclas",
    passwords: ["elvis2026"],
    phone: "+56922222222",
    rol: "usuario",
    maxEstaciones: 2
  },
  "60333333": {
    cedula: "60333333",
    name: "Julio Zarraga",
    cargo: "Operador de Horno",
    nivel: "Nivel 3 - Control de Cocción y Horno",
    passwords: ["julio2026"],
    phone: "+56933333333",
    rol: "usuario",
    maxEstaciones: 2
  },
  "60444444": {
    cedula: "60444444",
    name: "Luis Farias",
    cargo: "Operador de División",
    nivel: "Nivel 2 - División y Formado de Masas",
    passwords: ["luis2026"],
    phone: "+56944444444",
    rol: "usuario",
    maxEstaciones: 2
  },
  "60555555": {
    cedula: "60555555",
    name: "Marlenys Batista",
    cargo: "Operadora de Empaque",
    nivel: "Nivel 1 - Empaque y Control Visual Inicial",
    passwords: ["marlenys2026"],
    phone: "+56955555555",
    rol: "usuario",
    maxEstaciones: 2
  },
  "60666666": {
    cedula: "60666666",
    name: "Oscar Rojas",
    cargo: "Operador Logístico",
    nivel: "Nivel 2 - Logística y Despacho de Insumos",
    passwords: ["oscar2026"],
    phone: "+56966666666",
    rol: "usuario",
    maxEstaciones: 2
  },
  "60777777": {
    cedula: "60777777",
    name: "Rudy Aspilcueta",
    cargo: "Operador de Preparación",
    nivel: "Nivel 3 - Preparación de Ingredientes y Pesaje",
    passwords: ["rudy2026"],
    phone: "+56977777777",
    rol: "usuario",
    maxEstaciones: 2
  },
  "60888888": {
    cedula: "60888888",
    name: "Tommy Zambrano",
    cargo: "Operador de Acabados",
    nivel: "Nivel 4 - Acabados, Coberturas y Toppings",
    passwords: ["tommy2026"],
    phone: "+56988888888",
    rol: "usuario",
    maxEstaciones: 2
  }
};

export const generar30PedidosPrueba = () => {
  // (Generador de pedidos intacto)
  return [];
};