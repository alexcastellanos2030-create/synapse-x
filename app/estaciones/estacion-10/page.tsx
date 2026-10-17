"use client";

import React, { useState } from "react";
import { LoteCesta } from "../estacion-8/page";
import TablaTrazabilidadEstandar from "../../components/TablaTrazabilidadEstandar";

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
  const [loteSeleccionadoId, setLoteSeleccionadoId] = useState<string>(
    lotesEnDespacho.length > 0 ? lotesEnDespacho[0].idLote : ""
  );
  const [acordeonAbierto, setAcordeonAbierto] = useState<boolean>(true);
  const [observacionAdmin, setObservacionAdmin] = useState<string>("Despacho recibido conforme y auditado por administración.");
  const [adminCedula, setAdminCedula] = useState<string>("");
  const [adminNombre, setAdminNombre] = useState<string>("Ingrese cédula administrativa...");

  const loteActual = lotesEnDespacho.find((l) => l.idLote === loteSeleccionadoId) || lotesEnDespacho[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 text-xs font-sans pb-12">
      {/* 1. CABECERA ADMINISTRATIVA DE DESPACHO */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-md flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-indigo-400 flex items-center gap-2">
            🏢 Estación 10: Área Administrativa — Recepción y Auditoría de Despacho
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Módulo de Supervisión OSAI Industrial — Control Financiero, Guías y Cierre de Ciclo de Lotes
          </p>
        </div>
        {lotesEnDespacho.length > 0 && (
          <select
            value={loteSeleccionadoId}
            onChange={(e) => setLoteSeleccionadoId(e.target.value)}
            className="bg-slate-800 text-xs text-indigo-300 font-bold border border-slate-700 rounded-lg px-3 py-2 focus:outline-none"
          >
            {lotesEnDespacho.map((l) => (
              <option key={l.idLote} value={l.idLote}>
                Lote Despacho: {l.idLote} ({l.cargaTotalKg} Kg)
              </option>
            ))}
          </select>
        )}
      </div>

      {lotesEnDespacho.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 rounded-xl border border-slate-800 text-slate-400 text-sm">
          📭 No hay lotes pendientes de recepción en el Área Administrativa de Despacho.
        </div>
      ) : (
        <>
          {/* 2. ACORDEÓN CON TABLA DE TRAZABILIDAD ESTÁNDAR (10 COLUMNAS) */}
          <div className="bg-[#111827] border border-slate-800 rounded-xl shadow-xl overflow-hidden transition-all">
            <div
              onClick={() => setAcordeonAbierto(!acordeonAbierto)}
              className="bg-slate-900/90 p-4 cursor-pointer flex items-center justify-between hover:bg-slate-900 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">📋</span>
                <div>
                  <div className="text-sm font-black text-indigo-400 font-mono">
                    AUDITORÍA DE LOTE: {loteActual.idLote} — Receta: {loteActual.receta}
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Carga Liberada: <span className="text-emerald-400 font-bold">{loteActual.cargaTotalKg} Kg</span> | Clic para desplegar detalle de pedidos.
                  </div>
                </div>
              </div>
              <div className="text-xs text-indigo-400 font-bold bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                {acordeonAbierto ? "Ocultar Trazabilidad ▲" : "Ver Trazabilidad Completa ▼"}
              </div>
            </div>

            {acordeonAbierto && (
              <div className="p-4 bg-slate-950/80 border-t border-slate-800 space-y-3">
                <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <span>🔍</span> Detalle Trazable del Lote Recibido en Despacho:
                </div>
                <TablaTrazabilidadEstandar pedidos={loteActual.pedidosAsociados} esClaro={esClaro} />
              </div>
            )}
          </div>

          {/* 3. PANEL DE VALIDACIÓN ADMINISTRATIVA */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 max-w-3xl mx-auto">
            <div className="bg-indigo-600 text-white py-3 px-6 rounded-xl text-center font-black text-base uppercase tracking-wider shadow-md">
              VALIDACIÓN ADMINISTRATIVA DE DESPACHO — {loteActual.receta.toUpperCase()}
            </div>

            <div className="space-y-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Observaciones / Notas de Auditoría:</label>
                <input
                  type="text"
                  value={observacionAdmin}
                  onChange={(e) => setObservacionAdmin(e.target.value)}
                  className="w-full bg-slate-800 text-xs font-mono text-slate-200 border border-slate-700 rounded-lg p-2.5"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center pt-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Cédula del Administrador:</label>
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
                    className="w-full bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-lg px-3 py-2 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Funcionario Autorizado:</label>
                  <div className="w-full bg-slate-950 text-xs text-indigo-400 font-bold border border-slate-800 rounded-lg px-3 py-2 flex items-center">
                    {adminNombre}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  if (!adminCedula.trim() || adminNombre.includes("Ingrese")) {
                    alert("⚠️ SEGURIDAD OSAI: Debe ingresar una cédula administrativa válida para firmar la recepción de despacho.");
                    return;
                  }
                  alert(`✅ Lote ${loteActual.idLote} recibido y auditado con éxito por ${adminNombre} en el Área Administrativa.`);
                  if (onLoteAuditado) {
                    onLoteAuditado({
                      ...loteActual,
                      fechaRecepcionAdmin: new Date().toLocaleString(),
                      auditadoPor: adminNombre,
                    });
                  }
                }}
                className="px-6 py-3 bg-indigo-500 text-slate-950 font-black text-xs rounded-xl shadow-lg hover:bg-indigo-400 hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>🛡️</span> CONFIRMAR RECEPCIÓN Y AUDITAR LOTE EN DESPACHO
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}