"use client";

import React, { useState } from "react";
import type { LoteCesta } from "../estacion-8/page";
import TablaTrazabilidadEstandar from "../../components/TablaTrazabilidadEstandar";
import BloqueoSecuencialOSAI from "../osai/bloqueo-secuencial-osai";

export type LoteDespachoAdmin = LoteCesta & {
  fechaRecepcionAdmin?: string;
  auditadoPor?: string;
};

export interface Estacion10Props {
  lotesEnDespacho?: LoteCesta[];
  onLoteAuditado?: (lote: LoteDespachoAdmin) => void;
  esClaro?: boolean;
}

export default function Estacion10({
  lotesEnDespacho = [],
  onLoteAuditado,
  esClaro = false,
}: Estacion10Props) {
  const [estacionActiva, setEstacionActiva] = useState<number>(10);
  const [loteSeleccionadoId, setLoteSeleccionadoId] = useState<string>(
    lotesEnDespacho.length > 0 ? lotesEnDespacho[0].idLote : ""
  );
  const [acordeonAbierto, setAcordeonAbierto] = useState<boolean>(true);
  const [observacionAdmin, setObservacionAdmin] = useState<string>(
    "Despacho recibido conforme y auditado por administración."
  );
  const [adminCedula, setAdminCedula] = useState<string>("");
  const [adminNombre, setAdminNombre] = useState<string>(
    "Ingrese cédula administrativa..."
  );

  // Pasos secuenciales de la Estación 10 (Control Salida / Auditoría)
  const [pasosEstacion10, setPasosEstacion10] = useState([
    { id: 1, nombre: "Recepción de Rutas", estado: "completado" as string },
    { id: 2, nombre: "Auditoría de Cargas", estado: "activo" as string },
    { id: 3, nombre: "Notas de Control", estado: "bloqueado" as string },
    { id: 4, nombre: "Firma Administrativa", estado: "bloqueado" as string },
    { id: 5, nombre: "Cierre de Auditoría", estado: "bloqueado" as string },
  ]);

  const estacionesListado = [
    { id: 1, nombre: "Pesaje" },
    { id: 2, nombre: "Amasado" },
    { id: 3, nombre: "División" },
    { id: 4, nombre: "Formato" },
    { id: 5, nombre: "Fermentación" },
    { id: 6, nombre: "Horneado" },
    { id: 7, nombre: "Empaque" },
    { id: 8, nombre: "Control Salida" },
    { id: 9, nombre: "Rutas" },
    { id: 10, nombre: "Stock Bodega" },
    { id: 11, nombre: "Merma y Stock" },
    { id: 12, nombre: "Planta General" },
  ];

  const completarPasoSecuencial = (indexPaso: number) => {
    const nuevos = [...pasosEstacion10];
    nuevos[indexPaso].estado = "completado";
    if (indexPaso + 1 < nuevos.length) {
      nuevos[indexPaso + 1].estado = "activo";
    }
    setPasosEstacion10(nuevos);
  };

  const handleCambiarEstacion = (id: number) => {
    setEstacionActiva(id);
    if (typeof window !== "undefined") {
      window.location.href = `/estaciones/estacion-${id}`;
    }
  };

  const loteActual =
    lotesEnDespacho.find((l) => l.idLote === loteSeleccionadoId) ||
    lotesEnDespacho[0];

  return (
    <BloqueoSecuencialOSAI
      estacionActual={estacionActiva}
      estaciones={estacionesListado}
      onCambiarEstacion={handleCambiarEstacion}
      pasos={pasosEstacion10}
      onCompletarPaso={completarPasoSecuencial}
    >
      <div className="space-y-6">
        
        {/* SELECTOR RÁPIDO SI HAY MÚLTIPLES LOTES EN DESPACHO */}
        {lotesEnDespacho.length > 1 && (
          <div className="flex justify-end mb-2">
            <select
              value={loteSeleccionadoId}
              onChange={(e) => setLoteSeleccionadoId(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 text-xs text-indigo-700 dark:text-indigo-300 font-bold border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 focus:outline-none"
            >
              {lotesEnDespacho.map((l) => (
                <option key={l.idLote} value={l.idLote}>
                  Lote Despacho: {l.idLote} ({l.cargaTotalKg} Kg)
                </option>
              ))}
            </select>
          </div>
        )}

        {lotesEnDespacho.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900/60 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm transition-colors">
            📭 No hay lotes pendientes de recepción en el Área Administrativa de Despacho.
          </div>
        ) : (
          <>
            {/* ACORDEÓN CON TABLA DE TRAZABILIDAD ESTÁNDAR COMPLETA */}
            <div className="bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden transition-all">
              <div
                onClick={() => setAcordeonAbierto(!acordeonAbierto)}
                className="bg-slate-100 dark:bg-slate-900/90 p-4 cursor-pointer flex items-center justify-between hover:bg-slate-200 dark:hover:bg-slate-900 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">📋</span>
                  <div>
                    <div className="text-sm font-black text-indigo-600 dark:text-indigo-400 font-mono">
                      AUDITORÍA DE LOTE: {loteActual.idLote} — Receta: {loteActual.receta}
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                      Carga Liberada: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{loteActual.cargaTotalKg} Kg</span> | Clic para desplegar detalle de pedidos.
                    </div>
                  </div>
                </div>
                <div className="text-xs text-indigo-700 dark:text-indigo-400 font-bold bg-slate-200 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700">
                  {acordeonAbierto ? "Ocultar Trazabilidad ▲" : "Ver Trazabilidad Completa ▼"}
                </div>
              </div>

              {acordeonAbierto && (
                <div className="p-4 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-300 dark:border-slate-800 space-y-3 transition-colors">
                  <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <span>🔍</span> Detalle Trazable del Lote Recibido en Despacho:
                  </div>
                  <TablaTrazabilidadEstandar pedidos={loteActual.pedidosAsociados} esClaro={esClaro} />
                </div>
              )}
            </div>

            {/* PANEL DE VALIDACIÓN ADMINISTRATIVA */}
            <div className="bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 max-w-3xl mx-auto transition-colors">
              <div className="bg-indigo-600 text-white py-3 px-6 rounded-xl text-center font-black text-base uppercase tracking-wider shadow-md">
                VALIDACIÓN ADMINISTRATIVA DE DESPACHO — {loteActual.receta.toUpperCase()}
              </div>

              <div className="space-y-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-300 dark:border-slate-800 transition-colors">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-400 block mb-1">
                    Observaciones / Notas de Auditoría:
                  </label>
                  <input
                    type="text"
                    value={observacionAdmin}
                    onChange={(e) => {
                      setObservacionAdmin(e.target.value);
                      completarPasoSecuencial(2);
                    }}
                    className="w-full bg-white dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center pt-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 dark:text-slate-400 block mb-1">
                      Cédula del Administrador:
                    </label>
                    <input
                      type="text"
                      value={adminCedula}
                      onChange={(e) => {
                        const ced = e.target.value.replace(/\D/g, "");
                        setAdminCedula(ced);
                        if (ced === "87654321" || ced === "10433935") {
                          setAdminNombre("Carolina Pérez (Administración)");
                        } else if (ced.length >= 7) {
                          setAdminNombre(`Admin ID ${ced}`);
                        } else {
                          setAdminNombre("Ingrese cédula válida...");
                        }
                      }}
                      placeholder="Ej: 87654321"
                      className="w-full bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 dark:text-slate-400 block mb-1">
                      Funcionario Autorizado:
                    </label>
                    <div className="w-full bg-slate-200 dark:bg-slate-950 text-xs text-indigo-700 dark:text-indigo-400 font-bold border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 flex items-center">
                      {adminNombre}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!adminCedula.trim() || adminNombre.includes("Ingrese")) {
                      alert("⚠️ SEGURIDAD OSAI: Debe ingresar una cédula administrativa válida para firmar la recepción de despacho.");
                      return;
                    }
                    completarPasoSecuencial(3);
                    completarPasoSecuencial(4);
                    alert(`✅ Lote ${loteActual.idLote} recibido y auditado con éxito por ${adminNombre} en el Área Administrativa.`);
                    if (onLoteAuditado) {
                      onLoteAuditado({
                        ...loteActual,
                        fechaRecepcionAdmin: new Date().toLocaleString(),
                        auditadoPor: adminNombre,
                      });
                    }
                  }}
                  className="px-6 py-3 bg-indigo-600 text-white font-black text-xs rounded-xl shadow-lg hover:bg-indigo-500 hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>🛡️</span> CONFIRMAR RECEPCIÓN Y AUDITAR LOTE EN DESPACHO
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </BloqueoSecuencialOSAI>
  );
}