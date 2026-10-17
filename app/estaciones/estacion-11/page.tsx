"use client";

import React, { useState } from "react";
import { LoteCesta } from "../estacion-8/page";
import TablaTrazabilidadEstandar from "../../components/TablaTrazabilidadEstandar";

export type LoteBodegaPlanta = LoteCesta & {
  fechaIngresoBodegaPlanta?: string;
  responsableIngreso?: string;
  ubicacionRackInterno?: string;
};

export interface Estacion11Props {
  lotesEnBodegaPlanta?: LoteCesta[];
  onLoteAlmacenado?: (lote: LoteBodegaPlanta) => void;
  esClaro?: boolean;
}

export default function Estacion11BodegaPlanta({
  lotesEnBodegaPlanta = [],
  onLoteAlmacenado,
  esClaro = false,
}: Estacion11Props) {
  const [loteSeleccionadoId, setLoteSeleccionadoId] = useState<string>(
    lotesEnBodegaPlanta.length > 0 ? lotesEnBodegaPlanta[0].idLote : ""
  );
  const [acordeonAbierto, setAcordeonAbierto] = useState<boolean>(true);
  
  // Parámetros de Almacenamiento Interno de Planta
  const [sectorRack, setSectorRack] = useState<string>("RACK-PLANT-01 (Mantenimiento de Frescura / Stock Preventivo)");
  const [motivoProduccion, setMotivoProduccion] = useState<string>("Stock de Anticipación (Demanda Alta de Fin de Semana)");
  const [temperaturaBodegaC, setTemperaturaBodegaC] = useState<number>(18);

  // Responsable
  const [responsableCedula, setResponsableCedula] = useState<string>("");
  const [responsableNombre, setResponsableNombre] = useState<string>("Ingrese cédula para firmar...");

  const loteActual = lotesEnBodegaPlanta.find((l) => l.idLote === loteSeleccionadoId) || lotesEnBodegaPlanta[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 text-xs font-sans pb-12">
      {/* 1. CABECERA DE ESTACIÓN 11: BODEGA DE PLANTA */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-md flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-amber-400 flex items-center gap-2">
            🏬 Estación 11: Bodega de Planta (Stock Interno y Anticipación)
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Módulo de Reserva Interna OSAI Industrial — Almacenamiento Estratégico de Planta para Días de Alta Demanda
          </p>
        </div>
        {lotesEnBodegaPlanta.length > 0 && (
          <select
            value={loteSeleccionadoId}
            onChange={(e) => setLoteSeleccionadoId(e.target.value)}
            className="bg-slate-800 text-xs text-amber-300 font-bold border border-slate-700 rounded-lg px-3 py-2 focus:outline-none"
          >
            {lotesEnBodegaPlanta.map((l) => (
              <option key={l.idLote} value={l.idLote}>
                Lote Reserva: {l.idLote} ({l.cargaTotalKg} Kg)
              </option>
            ))}
          </select>
        )}
      </div>

      {lotesEnBodegaPlanta.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 rounded-xl border border-slate-800 text-slate-400 text-sm">
          📦 No hay lotes pendientes de ingreso a Bodega de Planta.
        </div>
      ) : (
        <>
          {/* 2. ACORDEÓN CON TABLA DE TRAZABILIDAD ESTÁNDAR COMPLETA (10 COLUMNAS) */}
          <div className="bg-[#111827] border border-slate-800 rounded-xl shadow-xl overflow-hidden transition-all">
            <div
              onClick={() => setAcordeonAbierto(!acordeonAbierto)}
              className="bg-slate-900/90 p-4 cursor-pointer flex items-center justify-between hover:bg-slate-900 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">📦</span>
                <div>
                  <div className="text-sm font-black text-amber-400 font-mono">
                    LOTE EN BODEGA DE PLANTA: {loteActual.idLote} — Receta: {loteActual.receta}
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Carga Almacenada: <span className="text-emerald-400 font-bold">{loteActual.cargaTotalKg} Kg</span> | Clic aquí para desplegar/ocultar trazabilidad.
                  </div>
                </div>
              </div>
              <div className="text-xs text-amber-400 font-bold bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                {acordeonAbierto ? "Ocultar Trazabilidad ▲" : "Ver Trazabilidad Completa ▼"}
              </div>
            </div>

            {acordeonAbierto && (
              <div className="p-4 bg-slate-950/80 border-t border-slate-800 space-y-3">
                <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <span>🔍</span> Detalle Trazable de Pedidos / Productos en Reserva Interna:
                </div>
                <TablaTrazabilidadEstandar pedidos={loteActual.pedidosAsociados} esClaro={esClaro} />
              </div>
            )}
          </div>

          {/* 3. PARÁMETROS DE ALMACENAMIENTO Y CONTROL DE INVENTARIO PLANTA */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 max-w-3xl mx-auto">
            <div className="bg-amber-500 text-slate-950 py-3 px-6 rounded-xl text-center font-black text-base uppercase tracking-wider shadow-md">
              REGISTRO DE STOCK PREVENTIVO — PLANTA SALAM BAKERY — {loteActual.receta.toUpperCase()}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 block">Rack / Ubicación Interna:</label>
                <input
                  type="text"
                  value={sectorRack}
                  onChange={(e) => setSectorRack(e.target.value)}
                  className="w-full bg-slate-800 text-xs font-mono text-amber-400 font-bold border border-slate-700 rounded-lg p-2.5"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 block">Propósito del Stock:</label>
                <select
                  value={motivoProduccion}
                  onChange={(e) => setMotivoProduccion(e.target.value)}
                  className="w-full bg-slate-800 text-xs text-slate-200 font-bold border border-slate-700 rounded-lg p-2.5"
                >
                  <option value="Stock de Anticipación (Demanda Alta de Fin de Semana)">Anticipación Fin de Semana</option>
                  <option value="Reserva de Seguridad Administrativa">Reserva de Seguridad Admin</option>
                  <option value="Muestra Comercial / Control de Calidad Interno">Muestra Comercial / Control Interno</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 block">Temp. Bodega Planta (°C):</label>
                <input
                  type="number"
                  value={temperaturaBodegaC}
                  onChange={(e) => setTemperaturaBodegaC(Number(e.target.value))}
                  className="w-full bg-slate-800 text-sm font-mono text-emerald-400 font-bold border border-slate-700 rounded-lg p-2.5"
                />
              </div>
            </div>

            {/* 4. BLOQUE DE FIRMA Y REGISTRO */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                👤 RESPONSABLE BODEGA DE PLANTA
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Cédula del Encargado:</label>
                  <input
                    type="text"
                    value={responsableCedula}
                    onChange={(e) => {
                      const ced = e.target.value.replace(/\D/g, "");
                      setResponsableCedula(ced);
                      if (ced === "10433935" || ced === "12345678") {
                        setResponsableNombre("Alexander Segundo Castellanos Perozo");
                      } else if (ced === "87654321") {
                        setResponsableNombre("Carolina Pérez (Administración)");
                      } else if (ced.length >= 7) {
                        setResponsableNombre(`Encargado ID ${ced}`);
                      } else {
                        setResponsableNombre("Ingrese cédula válida...");
                      }
                    }}
                    placeholder="Ej: 10433935"
                    className="w-full bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-lg px-3 py-2 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Nombre Autorizado:</label>
                  <div className="w-full bg-slate-950 text-xs text-amber-400 font-bold border border-slate-800 rounded-lg px-3 py-2 flex items-center">
                    {responsableNombre}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    if (!responsableCedula.trim() || responsableNombre.includes("Ingrese")) {
                      alert("⚠️ POKA-YOKE: Ingrese la cédula del encargado para ingresar el lote a Bodega de Planta.");
                      return;
                    }
                    alert(`✅ Lote ${loteActual.idLote} ingresado a Bodega de Planta como Stock Preventivo por ${responsableNombre}.`);
                    if (onLoteAlmacenado) {
                      onLoteAlmacenado({
                        ...loteActual,
                        fechaIngresoBodegaPlanta: new Date().toLocaleString(),
                        responsableIngreso: responsableNombre,
                        ubicacionRackInterno: sectorRack,
                      });
                    }
                  }}
                  className="px-6 py-3 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-lg hover:bg-emerald-400 hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>🏬</span> CONFIRMAR Y ALMACENAR EN BODEGA DE PLANTA
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}