// ============================================================================
// CONSTANCIA CENTRAL DE IDENTIDAD Y JERARQUÍA — SYNAPSE-X OS
// - Nivel 10: Creador (Alexander Segundo Castellanos Perozo). Nadie alcanza este rango.
// - Superusers familiares (Aleanny Castellanos y Albany Castellanos): siguen
//   directamente al Creador por encima de ingenieros y operadores; avanzan desde
//   Nivel 1 hasta Nivel 9 a medida que el Creador les enseña el sistema y
//   define en qué módulos pueden o no intervenir.
// ============================================================================

import {
  CLAVES_CREADOR_AUTORIZADAS,
  CREADOR_MASTER_DATABASE,
  esClaveValidaCreador,
  obtenerRegistrosMasterDesbloqueados,
} from "../app/components/AreaCreador/BovedaCreadorMaster";

export interface RegistroNucleo {
  id: string;
  registroNumero: 1 | 2 | 3;
  nombre: string;
  cedula: string;
  claveMaestra: string;
  clavesRegistradas: string[];
  telefono: string;
  nivel: number;
  rol: string;
  bloqueado: boolean;
  notaAprendizaje: string;
}

export const CLAVES_MAESTRAS_CREADOR = CLAVES_CREADOR_AUTORIZADAS;
export const TELEFONO_ALERTA_CREADOR = CREADOR_MASTER_DATABASE["10433935"].phone;

export const REGISTROS_NUCLEO: RegistroNucleo[] = [
  {
    id: "registro-1",
    registroNumero: 1,
    nombre: CREADOR_MASTER_DATABASE["10433935"].name,
    cedula: CREADOR_MASTER_DATABASE["10433935"].cedula,
    claveMaestra: CREADOR_MASTER_DATABASE["10433935"].passwords[0],
    clavesRegistradas: [...CREADOR_MASTER_DATABASE["10433935"].passwords],
    telefono: CREADOR_MASTER_DATABASE["10433935"].phone,
    nivel: 10,
    rol: "Creador / Superuser",
    bloqueado: false,
    notaAprendizaje:
      "Autoridad máxima exclusiva del sistema operativo (Nivel 10). Supervisión general, formación familiar y dirección de proyectos.",
  },
  {
    id: "registro-2",
    registroNumero: 2,
    nombre: CREADOR_MASTER_DATABASE["279276795"].name,
    cedula: CREADOR_MASTER_DATABASE["279276795"].cedula,
    claveMaestra: CREADOR_MASTER_DATABASE["279276795"].passwords[0],
    clavesRegistradas: [...CREADOR_MASTER_DATABASE["279276795"].passwords],
    telefono: CREADOR_MASTER_DATABASE["279276795"].phone,
    nivel: 1,
    rol: "Superuser",
    bloqueado: false,
    notaAprendizaje:
      "Hija del Creador. Línea directa tras el Nivel 10 (por encima de ingenieros y operadores); escala del Nivel 1 al Nivel 9 conforme aprende y recibe indicaciones de qué tocar o no.",
  },
  {
    id: "registro-3",
    registroNumero: 3,
    nombre: CREADOR_MASTER_DATABASE["33323644"].name,
    cedula: CREADOR_MASTER_DATABASE["33323644"].cedula,
    claveMaestra: CREADOR_MASTER_DATABASE["33323644"].passwords[0],
    clavesRegistradas: [...CREADOR_MASTER_DATABASE["33323644"].passwords],
    telefono: CREADOR_MASTER_DATABASE["33323644"].phone,
    nivel: 1,
    rol: "Superuser",
    bloqueado: false,
    notaAprendizaje:
      "Hija del Creador. Línea directa tras el Nivel 10 (por encima de ingenieros y operadores); escala del Nivel 1 al Nivel 9 conforme aprende y recibe indicaciones de qué tocar o no.",
  },
];

export function validarClaveCreador(claveIngresada: string): boolean {
  return esClaveValidaCreador(claveIngresada);
}

export function desbloquearRegistrosNucleo(claveIngresada: string): RegistroNucleo[] | null {
  if (!obtenerRegistrosMasterDesbloqueados(claveIngresada)) {
    return null;
  }
  return REGISTROS_NUCLEO;
}