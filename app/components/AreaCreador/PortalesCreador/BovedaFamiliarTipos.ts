export type TipoUsuarioSistema = 'prueba' | 'real';

export interface PerfilFamiliar {
  id?: string;
  nombre: string;
  cedula: string;
  claveMaestra: string;
  nivel: number;
  rol: string;
  bloqueado: boolean;
  notaAprendizaje?: string;
  tipo_usuario?: TipoUsuarioSistema;
  modoSoloVer?: boolean;
}

export interface EntradaBitacora {
  id: string;
  fechaHora: string;
  accion: string;
  detalle: string;
}

export interface InfoNivel {
  titulo: string;
  detalle: string;
  etapa: string;
  modo: string;
  puedeRegistrar: boolean;
}

export type PestanaPrincipal = 'registro' | 'progreso' | 'bitacora' | 'guia';

export const STORAGE_KEY = 'synapse_boveda_familiar_local_v2';
export const BITACORA_KEY = 'synapse_boveda_familiar_bitacora_v1';
export const TAB_KEY = 'synapse_boveda_familiar_pestana_v1';
export const SESSION_KEY = 'synapse_sesion_activa_v1';

export const CREADOR_NOMBRE = 'Alexander Segundo Castellanos Perozo';
export const CREADOR_CEDULA = '10433935';

export const HIJAS_SUPERUSERS: Record<string, string> = {
  '279276795': 'Aleanny',
  '33323644': 'Albany',
};

export const PERFIL_CREADOR_BASE: PerfilFamiliar = {
  nombre: CREADOR_NOMBRE,
  cedula: CREADOR_CEDULA,
  claveMaestra: 'synapse2026',
  nivel: 10,
  rol: 'Creador / Superuser',
  bloqueado: false,
  tipo_usuario: 'real',
  modoSoloVer: false,
  notaAprendizaje:
    'Autoridad máxima exclusiva del sistema operativo (Nivel 10). Control total y formación familiar.'
};

export const DESCRIPCION_NIVELES: Record<number, InfoNivel> = {
  1: {
    titulo: 'Nivel 1 — Solo Ver (Inicio / Observación)',
    detalle: 'Lectura de áreas en modo solo ver sin modificar ni registrar datos.',
    etapa: 'Aprendizaje Guiado',
    modo: 'SOLO VER',
    puedeRegistrar: false
  },
  2: {
    titulo: 'Nivel 2 — Ingreso de Datos Supervisado',
    detalle: 'Carga y registro de datos básicos bajo supervisión directa.',
    etapa: 'Aprendizaje Guiado',
    modo: 'OPERATIVO SUPERVISADO',
    puedeRegistrar: true
  },
  3: {
    titulo: 'Nivel 3 — Registro y Consulta Operativa',
    detalle: 'Registros rutinarios y consultas sin tocar configuraciones ni claves.',
    etapa: 'Aprendizaje Guiado',
    modo: 'OPERATIVO SUPERVISADO',
    puedeRegistrar: true
  },
  4: {
    titulo: 'Nivel 4 — Seguimiento y Verificación',
    detalle: 'Revisión de registros, estados y movimientos diarios del sistema.',
    etapa: 'Apoyo y Control Parcial',
    modo: 'SEGUIMIENTO ACTIVO',
    puedeRegistrar: true
  },
  5: {
    titulo: 'Nivel 5 — Coordinación y Control Operativo',
    detalle: 'Control operativo amplio en módulos habilitados, sin cambios estructurales.',
    etapa: 'Apoyo y Control Parcial',
    modo: 'CONTROL OPERATIVO',
    puedeRegistrar: true
  },
  6: {
    titulo: 'Nivel 6 — Supervisión Activa',
    detalle: 'Supervisión remota de operaciones y flujos, sin ajustes críticos.',
    etapa: 'Apoyo y Control Parcial',
    modo: 'SUPERVISIÓN ACTIVA',
    puedeRegistrar: true
  },
  7: {
    titulo: 'Nivel 7 — Gestión Operativa Avanzada',
    detalle: 'Manejo de controles avanzados del sistema con autonomía supervisada.',
    etapa: 'Delegación Avanzada',
    modo: 'GESTIÓN AVANZADA',
    puedeRegistrar: true
  },
  8: {
    titulo: 'Nivel 8 — Superuser de Apoyo Crítico',
    detalle: 'Alta capacidad de acción y supervisión sin tocar autoridad del Creador.',
    etapa: 'Delegación Avanzada',
    modo: 'APOYO CRÍTICO',
    puedeRegistrar: true
  },
  9: {
    titulo: 'Nivel 9 — Sub-control Maestro (Máximo Delegable)',
    detalle: 'Máximo nivel delegable en la bóveda familiar; subordinado al Nivel 10.',
    etapa: 'Delegación Avanzada',
    modo: 'SUB-CONTROL MAESTRO',
    puedeRegistrar: true
  },
  10: {
    titulo: 'Nivel 10 — Creador y Superuser (Acceso Total)',
    detalle: 'Exclusivo del Creador. Autoridad absoluta y control total del sistema.',
    etapa: 'Cúspide Exclusiva',
    modo: 'ACCESO TOTAL (CREADOR)',
    puedeRegistrar: true
  }
};