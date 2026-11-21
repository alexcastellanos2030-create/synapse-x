export type IdPestanaAC00 =
  | "nucleo"
  | "radar"
  | "protocolos"
  | "ruteo"
  | "respaldo";

export interface EventoBitacoraAC00 {
  id: string;
  fechaHora: string;
  accion: string;
  detalle: string;
}

export interface EstadoProtocolosAC00 {
  mantenimientoActivo: boolean;
  drmRecetasActivo: boolean;
  jerarquiaBlindada: boolean;
  killSwitchArmado: boolean;
}

export const CLAVES_AC00_POR_DEFECTO = [
  "SYNAPSE10",
  "SYNAPSE2026",
  "ALEX2026",
  "BOVEDA-MASTER",
];

export const DESCRIPCION_CAPAS_AC00: Record<
  number,
  { nombre: string; detalle: string }
> = {
  1: { nombre: "Núcleo Básico", detalle: "Registro e inventario simple." },
  2: { nombre: "Operativo", detalle: "Pedidos y ventas locales." },
  3: { nombre: "Taller Integrado", detalle: "Trazabilidad inicial de producción." },
  4: { nombre: "Analítica", detalle: "Tiempos y movimientos de línea." },
  5: { nombre: "Interconectividad", detalle: "Múltiples nodos y comunicación remota." },
  6: { nombre: "Automatización", detalle: "Sensores y maquinaria en planta." },
  7: { nombre: "IA Predictiva", detalle: "Proyección de demanda y mermas." },
  8: { nombre: "Seguridad Expandida", detalle: "Biometría y control perimetral." },
  9: { nombre: "Ecosistema Total", detalle: "Sincronización logística y proveedores." },
  10: { nombre: "OSAI Industrial Enterprise", detalle: "Control supremo, auditoría y defensa." },
};