// ============================================================================
// JERARQUÍA Y CONSTANCIA DE AUTORIDAD — SYNAPSE-X OS (OSAI INDUSTRIAL)
// - Archivo maestro protegido: fuente centralizada del núcleo familiar.
// - Nivel 10 (Creador): Exclusivo de Alexander Segundo Castellanos Perozo
//   (CI: 10433935). Autoridad máxima absoluta; nadie iguala este nivel.
// - Línea directa debajo del Creador: Aleanny Castellanos y Albany Castellanos
//   (hijas del Creador / Superuser). Inician en Nivel 1 y escalan progresivamente
//   paso a paso a medida que el Creador les enseña el sistema y los proyectos,
//   hasta alcanzar el Nivel 9 (máximo delegable, siempre debajo del Nivel 10).
// - Por debajo de ellas: Ingenieros, técnicos y el resto del árbol de operadores.
// ============================================================================

export interface CreadorCredential {
  readonly cedula: string;
  readonly name: string;
  readonly cargo: string;
  readonly nivel: string;
  readonly nivelNumerico: number;
  readonly passwords: readonly string[];
  readonly phone: string;
  readonly rol: "creador" | "superuser";
  readonly maxEstaciones: number;
  readonly rutaFormacion?: string;
}

export const CLAVES_CREADOR_AUTORIZADAS: readonly string[] = Object.freeze([
  "*Paola123!",
  "*Ac12345!",
  "Iar661972",
  "Albany123",
]);

const REGISTRO_CREADOR: CreadorCredential = Object.freeze({
  cedula: "10433935",
  name: "Alexander Segundo Castellanos Perozo",
  cargo: "Creador",
  nivel: "Nivel 10 - Acceso Total Absoluto (Super User / Creador)",
  nivelNumerico: 10,
  passwords: Object.freeze(["*Paola123!", "*Ac12345!", "Iar661972", "Albany123"]),
  phone: "+56951049399",
  rol: "creador",
  maxEstaciones: 12,
  rutaFormacion: "Autoridad máxima única del sistema operativo (Nivel 10).",
});

const REGISTRO_ALEANNY: CreadorCredential = Object.freeze({
  cedula: "279276795",
  name: "Aleanny Castellanos",
  cargo: "Superuser",
  nivel: "Nivel 1 - Solo Ver (Escala progresiva hacia Nivel 9 bajo guía del Creador)",
  nivelNumerico: 1,
  passwords: Object.freeze(["*Aleanny123"]),
  phone: "+56949296067",
  rol: "superuser",
  maxEstaciones: 12,
  rutaFormacion:
    "Hija del Creador. Línea directa tras el Nivel 10; sube del Nivel 1 al Nivel 9 conforme aprende el sistema y los proyectos.",
});

const REGISTRO_ALBANY: CreadorCredential = Object.freeze({
  cedula: "33323644",
  name: "Albany Castellanos",
  cargo: "Superuser",
  nivel: "Nivel 1 - Solo Ver (Escala progresiva hacia Nivel 9 bajo guía del Creador)",
  nivelNumerico: 1,
  passwords: Object.freeze(["*Albany123"]),
  phone: "+584146761793",
  rol: "superuser",
  maxEstaciones: 12,
  rutaFormacion:
    "Hija del Creador. Línea directa tras el Nivel 10; sube del Nivel 1 al Nivel 9 conforme aprende el sistema y los proyectos.",
});

// 👑 BÓVEDA EXCLUSIVA DEL CREADOR (Fuente centralizada de datos del núcleo)
export const CREADOR_MASTER_DATABASE: Readonly<{ [key: string]: CreadorCredential }> =
  Object.freeze({
    "10433935": REGISTRO_CREADOR,
    "279276795": REGISTRO_ALEANNY,
    "33323644": REGISTRO_ALBANY,
  });

export function esClaveValidaCreador(clave: string): boolean {
  return CLAVES_CREADOR_AUTORIZADAS.includes(clave.trim());
}

export function obtenerRegistrosMasterDesbloqueados(
  clave: string
): CreadorCredential[] | null {
  if (!esClaveValidaCreador(clave)) {
    return null;
  }
  return Object.values(CREADOR_MASTER_DATABASE);
}

export function obtenerCredencialCreadorPorCedula(
  cedula: string
): CreadorCredential | undefined {
  return CREADOR_MASTER_DATABASE[cedula.trim()];
}

export function esSuperuserFamiliar(cedula: string): boolean {
  const cred = obtenerCredencialCreadorPorCedula(cedula);
  return cred?.rol === "superuser";
}