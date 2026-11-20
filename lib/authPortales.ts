export type PortalTipo = "creador" | "ingeniero" | "tecnico" | "usuario";
export type LedEstado = "white" | "yellow" | "green" | "red";

export interface OperadorPortal {
  cedula: string;
  nombre: string;
  clave: string;
  nivel: string;
  cargoEspecifico: string;
  rolAsignado: "ingeniero" | "tecnico" | "usuario";
  esBovedaFamiliar?: boolean;
}

export interface ConfigPortalLogin {
  id: PortalTipo;
  etiquetaBoton: string;
  titulo: string;
  subtitulo: string;
  emblema: string;
  ledBarText: string;
  tituloColor: string;
  focusInput: string;
  botonActivoClass: string;
}

export const CLAVES_SESION = [
  "synapse_sesion_activa",
  "synapse_rol_activo",
  "synapse_cedula_activa",
  "synapse_nivel_activo",
  "synapse_area_activa",
  "synapse_estacion_activa",
  "synapse_boveda_familiar",
];

export const CEDULAS_BOVEDA_FAMILIAR_RESPALDO = new Set([
  "10433935",
  "279276795",
  "33323644",
]);

// Configuración por portal:
// - creador: Portal del Creador / Bóveda Familiar -> Área del Creador ("creador")
// - ingeniero: Ingeniero de Sistemas -> Área de Servicio Técnico ("st")
// - tecnico: Técnico en Informática -> Área de Servicio Técnico ("st")
// - usuario: Dueño, Administrador, Ing. de Alimentación, Técnico Panadero, Operadores y Empleados -> Área de Usuario ("usuario")
export const CONFIG_PORTALES: Record<PortalTipo, ConfigPortalLogin> = {
  creador: {
    id: "creador",
    etiquetaBoton: "Portal del Creador",
    titulo: "PORTAL BÓVEDA FAMILIAR Y CREADOR",
    subtitulo: "Acceso Bóveda Familiar • Dirige al Área del Creador",
    emblema: "👑",
    ledBarText: "text-emerald-400",
    tituloColor: "text-emerald-400",
    focusInput: "focus:border-emerald-400",
    botonActivoClass: "bg-emerald-500 text-black shadow-md shadow-emerald-500/20",
  },
  ingeniero: {
    id: "ingeniero",
    etiquetaBoton: "Portal del Ingeniero",
    titulo: "PORTAL INGENIERO DE SISTEMAS",
    subtitulo: "Exclusivo Ingeniero de Sistemas • Dirige al Área de Servicio Técnico",
    emblema: "⚙️",
    ledBarText: "text-cyan-400",
    tituloColor: "text-cyan-400",
    focusInput: "focus:border-cyan-400",
    botonActivoClass: "bg-cyan-500 text-black shadow-md shadow-cyan-500/20",
  },
  tecnico: {
    id: "tecnico",
    etiquetaBoton: "Portal del Técnico",
    titulo: "PORTAL TÉCNICO EN INFORMÁTICA",
    subtitulo: "Exclusivo Técnico en Informática • Dirige al Área de Servicio Técnico",
    emblema: "🔧",
    ledBarText: "text-amber-400",
    tituloColor: "text-amber-400",
    focusInput: "focus:border-amber-400",
    botonActivoClass: "bg-amber-500 text-black shadow-md shadow-amber-500/20",
  },
  usuario: {
    id: "usuario",
    etiquetaBoton: "Portal de Empleados",
    titulo: "PORTAL DE EMPLEADOS Y LICENCIA DE EMPRESA",
    subtitulo:
      "Dueño, Administrador, Ing. de Alimentación, Técnico Panadero, Operadores y Empleados",
    emblema: "🏭",
    ledBarText: "text-pink-400",
    tituloColor: "text-pink-400",
    focusInput: "focus:border-pink-400",
    botonActivoClass: "bg-pink-500 text-black shadow-md shadow-pink-500/20",
  },
};

export function clasificarRolPorCargoYTipo(
  rolRawInput: string,
  cargoRawInput: string
): "ingeniero" | "tecnico" | "usuario" {
  const texto = `${rolRawInput} ${cargoRawInput}`.toLowerCase().trim();

  if (texto.includes("aliment")) {
    return "usuario";
  }

  if (texto.includes("panader")) {
    return "usuario";
  }

  if (
    texto.includes("ingeniero de sistemas") ||
    texto.includes("ing. de sistemas") ||
    texto.includes("ing sistemas") ||
    texto === "ingeniero" ||
    texto.startsWith("ingeniero ")
  ) {
    return "ingeniero";
  }

  if (
    texto.includes("técnico en informática") ||
    texto.includes("tecnico en informatica") ||
    texto.includes("técnico informática") ||
    texto.includes("tecnico informatica") ||
    texto.includes("informática") ||
    texto.includes("informatica") ||
    texto === "tecnico" ||
    texto === "técnico"
  ) {
    return "tecnico";
  }

  return "usuario";
}

export const CATALOGO_USUARIOS_RESPALDO: OperadorPortal[] = [
  {
    cedula: "10433935",
    nombre: "Alexander Segundo Castellanos Perozo",
    clave: "*Paola123!",
    nivel: "Nivel 10 - Creador",
    cargoEspecifico: "Bóveda Familiar / Creador",
    rolAsignado: "usuario",
    esBovedaFamiliar: true,
  },
  {
    cedula: "279276795",
    nombre: "Aleanny Castellanos",
    clave: "*Aleanny123",
    nivel: "Nivel 1 - Solo Ver",
    cargoEspecifico: "Bóveda Familiar",
    rolAsignado: "usuario",
    esBovedaFamiliar: true,
  },
  {
    cedula: "33323644",
    nombre: "Albany Castellanos",
    clave: "*Albany123",
    nivel: "Nivel 1 - Solo Ver",
    cargoEspecifico: "Bóveda Familiar",
    rolAsignado: "usuario",
    esBovedaFamiliar: true,
  },
];

export function getLedClass(estado: LedEstado) {
  switch (estado) {
    case "green":
      return "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)] border-emerald-200";
    case "yellow":
      return "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)] border-amber-200";
    case "red":
      return "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)] border-red-200";
    default:
      return "bg-slate-700 shadow-none border-slate-600";
  }
}