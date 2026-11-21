"use client";

import React from "react";
import {
  CicloPagoLicencia,
  DatosCarpetaExpediente,
  DatosVendedorLicencia,
  EstadoPagoLicencia,
  ItemLicenciaActiva,
} from "./TiposLicenciasAC09";

interface FormatoActivacionLicenciasAC09Props {
  vendedor: DatosVendedorLicencia;
  setVendedor: React.Dispatch<React.SetStateAction<DatosVendedorLicencia>>;
  licencias: ItemLicenciaActiva[];
  onAgregarLicencia: () => void;
  onEliminarLicencia: (id: string) => void;
  onActualizarLicencia: (
    id: string,
    campo: keyof ItemLicenciaActiva,
    valor: string | number | boolean
  ) => void;
  expediente: DatosCarpetaExpediente;
  setExpediente: React.Dispatch<React.SetStateAction<DatosCarpetaExpediente>>;
  formatoCompleto: boolean;
  faltantes: string[];
  onActivarCronometrosYRegistrar: () => void;
  onImprimirExpediente: () => void;
}

function formatearCuenta(segundos: number): string {
  const seguro = Math.max(0, Math.floor(segundos));
  const dias = Math.floor(seguro / 86400);
  const horas = Math.floor((seguro % 86400) / 3600);
  const mins = Math.floor((seguro % 3600) / 60);
  const segs = seguro % 60;
  return `${dias}d ${String(horas).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(segs).padStart(2, "0")}`;
}

export default function FormatoActivacionLicenciasAC09({
  vendedor,
  setVendedor,
  licencias,
  onAgregarLicencia,
  onEliminarLicencia,
  onActualizarLicencia,
  expediente,
  setExpediente,
  formatoCompleto,
  faltantes,
  onActivarCronometrosYRegistrar,
  onImprimirExpediente,
}: FormatoActivacionLicenciasAC09Props) {
  return (
    <div className="space-y-4 text-xs">
      {/* CONTENEDOR 1: DATOS DEL VENDEDOR / RESPONSABLE */}
      <div className="p-4 rounded-xl border border-amber-500/40 bg-slate-900/70 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
            1. Datos del Vendedor / Responsable de la Operación
          </span>
          <span className="text-[10px] text-slate-400">
            Responsable de venta, seguimiento de pago y reporte directo al dueño
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          <input
            type="text"
            value={vendedor.nombreCompleto}
            onChange={(e) =>
              setVendedor((prev) => ({ ...prev, nombreCompleto: e.target.value }))
            }
            placeholder="Nombre completo del vendedor *"
            className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-white"
          />
          <input
            type="text"
            value={vendedor.cedula}
            onChange={(e) =>
              setVendedor((prev) => ({ ...prev, cedula: e.target.value }))
            }
            placeholder="Cédula o RUT / ID del vendedor *"
            className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-white"
          />
          <input
            type="text"
            value={vendedor.contacto}
            onChange={(e) =>
              setVendedor((prev) => ({ ...prev, contacto: e.target.value }))
            }
            placeholder="Teléfono o correo de contacto *"
            className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-white"
          />
        </div>

        <input
          type="text"
          value={vendedor.observacionVenta}
          onChange={(e) =>
            setVendedor((prev) => ({ ...prev, observacionVenta: e.target.value }))
          }
          placeholder="Detalle del reporte al dueño (destino del pago, acuerdo o nota comercial)"
          className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-white"
        />

        <label className="inline-flex items-center gap-2 text-[11px] text-slate-200 cursor-pointer">
          <input
            type="checkbox"
            checked={vendedor.reporteDirectoAlDueno}
            onChange={(e) =>
              setVendedor((prev) => ({
                ...prev,
                reporteDirectoAlDueno: e.target.checked,
              }))
            }
            className="w-3.5 h-3.5 cursor-pointer"
          />
          <span>
            Confirmo reporte directo al dueño por esta operación de {licencias.length}{" "}
            {licencias.length === 1 ? "licencia" : "licencias"}.
          </span>
        </label>
      </div>

      {/* CONTENEDOR 2: LICENCIAS ACTIVAS Y SUS CRONÓMETROS (1 A N LICENCIAS) */}
      <div className="p-4 rounded-xl border border-cyan-500/40 bg-slate-900/70 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300">
            2. Datos de Licencias Activas y Cronómetros ({licencias.length})
          </span>
          <button
            type="button"
            onClick={onAgregarLicencia}
            className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px] cursor-pointer"
          >
            + Agregar nueva licencia
          </button>
        </div>

        <div className="space-y-3">
          {licencias.map((lic, idx) => (
            <div
              key={lic.id}
              className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/90 space-y-2.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold text-[10px]">
                    Licencia #{idx + 1}
                  </span>
                  <span className="font-mono font-bold text-amber-300">
                    ⏱ {formatearCuenta(lic.segundosRestantes)}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      lic.cronometroCorriendo
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {lic.cronometroCorriendo ? "Cronómetro activo" : "En espera"}
                  </span>
                </div>

                {licencias.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onEliminarLicencia(lic.id)}
                    className="px-2.5 py-1 rounded bg-rose-950/70 hover:bg-rose-600 border border-rose-500/50 text-rose-200 hover:text-white text-[10px] font-bold cursor-pointer"
                  >
                    Eliminar formato de licencia
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                <input
                  type="text"
                  value={lic.codigoLicencia}
                  onChange={(e) =>
                    onActualizarLicencia(lic.id, "codigoLicencia", e.target.value)
                  }
                  placeholder="Código / Serial de licencia *"
                  className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-white"
                />
                <input
                  type="text"
                  value={lic.clienteEmpresa}
                  onChange={(e) =>
                    onActualizarLicencia(lic.id, "clienteEmpresa", e.target.value)
                  }
                  placeholder="Cliente / Empresa compradora *"
                  className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-white"
                />
                <select
                  value={lic.cicloPago}
                  onChange={(e) =>
                    onActualizarLicencia(
                      lic.id,
                      "cicloPago",
                      e.target.value as CicloPagoLicencia
                    )
                  }
                  aria-label={`Ciclo de pago licencia ${idx + 1}`}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-white"
                >
                  <option value="mensual">Pago: Mensual</option>
                  <option value="semestral">Pago: Cada 6 meses</option>
                  <option value="anual">Pago: Anual</option>
                </select>
                <input
                  type="date"
                  value={lic.fechaExactaPago}
                  onChange={(e) =>
                    onActualizarLicencia(lic.id, "fechaExactaPago", e.target.value)
                  }
                  aria-label={`Fecha exacta de pago licencia ${idx + 1}`}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <select
                  value={lic.estadoPago}
                  onChange={(e) =>
                    onActualizarLicencia(
                      lic.id,
                      "estadoPago",
                      e.target.value as EstadoPagoLicencia
                    )
                  }
                  aria-label={`Estado de pago licencia ${idx + 1}`}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-white"
                >
                  <option value="pagado">Estado: Pago efectuado</option>
                  <option value="pendiente">Estado: Pago pendiente</option>
                  <option value="en_verificacion">Estado: En verificación</option>
                </select>
                <input
                  type="text"
                  value={lic.montoReferencia}
                  onChange={(e) =>
                    onActualizarLicencia(lic.id, "montoReferencia", e.target.value)
                  }
                  placeholder="Monto o comprobante de pago *"
                  className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-white"
                />
                <label className="flex items-center justify-between px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300">
                  <span>Vigencia (días):</span>
                  <input
                    type="number"
                    min={1}
                    max={3650}
                    value={lic.duracionDias}
                    onChange={(e) => {
                      const dias = Math.max(1, Number(e.target.value) || 1);
                      onActualizarLicencia(lic.id, "duracionDias", dias);
                      onActualizarLicencia(
                        lic.id,
                        "segundosRestantes",
                        dias * 86400
                      );
                    }}
                    className="w-16 px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 text-white font-mono text-right"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CONTENEDOR 3: CARPETA DE EXPEDIENTE, ENLACE Y LIBERACIÓN DEL DUEÑO */}
      <div className="p-4 rounded-xl border border-emerald-500/40 bg-slate-900/70 space-y-3">
        <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
          3. Carpeta de Licencia, Enlace de Requisitos y Firma del Dueño (Digital + Físico)
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          <input
            type="text"
            value={expediente.codigoCarpeta}
            onChange={(e) =>
              setExpediente((prev) => ({ ...prev, codigoCarpeta: e.target.value }))
            }
            placeholder="Código / Enlace de carpeta de expediente *"
            className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-white"
          />
          <input
            type="text"
            value={expediente.firmaLiberacionDueno}
            onChange={(e) =>
              setExpediente((prev) => ({
                ...prev,
                firmaLiberacionDueno: e.target.value,
              }))
            }
            placeholder="Autorización / Firma de liberación del dueño *"
            className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-white"
          />
        </div>

        <div className="space-y-1.5 text-[11px] text-slate-200">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={expediente.requisitosVerificados}
              onChange={(e) =>
                setExpediente((prev) => ({
                  ...prev,
                  requisitosVerificados: e.target.checked,
                }))
              }
              className="w-3.5 h-3.5 cursor-pointer"
            />
            <span>
              Requisitos y manual de procedimiento de compra-venta verificados y enlazados.
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={expediente.clausulaUsoAutonomoAceptada}
              onChange={(e) =>
                setExpediente((prev) => ({
                  ...prev,
                  clausulaUsoAutonomoAceptada: e.target.checked,
                }))
              }
              className="w-3.5 h-3.5 cursor-pointer"
            />
            <span>
              Constancia de respaldo: el cliente opera de forma autónoma el uso y la maquinaria, asumiendo su manipulación.
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={expediente.respaldoFisicoArchivado}
              onChange={(e) =>
                setExpediente((prev) => ({
                  ...prev,
                  respaldoFisicoArchivado: e.target.checked,
                }))
              }
              className="w-3.5 h-3.5 cursor-pointer"
            />
            <span>
              Respaldo programado para archivo digital en sistema y archivo físico en carpeta.
            </span>
          </label>
        </div>
      </div>

      {/* VALIDACIÓN DE COMPLETITUD + ACCIONES DE CRONÓMETRO E IMPRESIÓN */}
      {!formatoCompleto && faltantes.length > 0 && (
        <div className="p-3 rounded-xl border border-amber-500/40 bg-amber-950/25 text-amber-200 text-[11px]">
          <div className="font-bold mb-1">
            Completa estos requisitos antes de activar cronómetros o imprimir:
          </div>
          <ul className="list-disc list-inside space-y-0.5">
            {faltantes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-end gap-2.5 pt-1">
        <button
          type="button"
          disabled={!formatoCompleto}
          onClick={onImprimirExpediente}
          title={
            formatoCompleto
              ? "Imprimir expediente completo para archivo físico y digital"
              : "Completa todo el formato para habilitar la impresión"
          }
          className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
            formatoCompleto
              ? "bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 cursor-pointer"
              : "bg-slate-900 text-slate-500 border border-slate-800 opacity-50 cursor-not-allowed"
          }`}
        >
          Imprimir expediente completo
        </button>

        <button
          type="button"
          disabled={!formatoCompleto}
          onClick={onActivarCronometrosYRegistrar}
          title={
            formatoCompleto
              ? "Activar cronómetros de licencias y registrar en bitácora"
              : "Completa los 3 contenedores para habilitar el cronómetro"
          }
          className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
            formatoCompleto
              ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer"
              : "bg-slate-900 text-slate-500 border border-slate-800 opacity-50 cursor-not-allowed"
          }`}
        >
          Activar cronómetro(s) y asentar en bitácora
        </button>
      </div>
    </div>
  );
}