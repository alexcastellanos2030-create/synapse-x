export type PestanaAC10 = "enlace" | "sensores" | "mando";

export interface SesionEnlaceRemoto {
  idClientePais: string;
  codigoGenerado: string;
  codigoPortalCliente: string;
  parcheAutorizadoPorCliente: boolean;
  enlaceActivoConCreador: boolean;
  fechaRecopilacion: string;
  fechaVigenciaProgramada: string;
}

export interface NodoMaquinaSensor {
  id: string;
  equipo: string;
  canalConexion: "WiFi Digital" | "Red Industrial" | "Simulación SO";
  temperaturaC: string;
  estadoSensor: "Operativo" | "Alerta Térmica" | "Requiere Revisión";
  nota: string;
}

export interface EventoAC10 {
  id: string;
  fechaHora: string;
  modulo: string;
  detalle: string;
}