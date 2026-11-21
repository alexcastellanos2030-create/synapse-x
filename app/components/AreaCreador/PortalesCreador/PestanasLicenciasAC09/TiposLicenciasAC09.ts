export type CicloPagoLicencia = "mensual" | "semestral" | "anual";
export type EstadoPagoLicencia = "pagado" | "pendiente" | "en_verificacion";

export interface ItemLicenciaActiva {
  id: string;
  codigoLicencia: string;
  clienteEmpresa: string;
  cicloPago: CicloPagoLicencia;
  fechaExactaPago: string;
  estadoPago: EstadoPagoLicencia;
  montoReferencia: string;
  duracionDias: number;
  segundosRestantes: number;
  cronometroCorriendo: boolean;
}

export interface DatosVendedorLicencia {
  nombreCompleto: string;
  cedula: string;
  contacto: string;
  reporteDirectoAlDueno: boolean;
  observacionVenta: string;
}

export interface DatosCarpetaExpediente {
  codigoCarpeta: string;
  requisitosVerificados: boolean;
  clausulaUsoAutonomoAceptada: boolean;
  firmaLiberacionDueno: string;
  respaldoFisicoArchivado: boolean;
}

export interface RegistroBitacoraLicencia {
  id: string;
  fechaHora: string;
  responsable: string;
  accion: string;
  detalle: string;
}

export const CLAVES_CANDADO_LICENCIAS = [
  "SYNAPSE10",
  "SYNAPSE2026",
  "ALEX2026",
  "LICENCIA-MASTER",
];