"use client";

import React, { useState, useEffect } from "react";
import { LoteLaminado } from "../estacion-5/page";
import TablaTrazabilidadEstandar from "../../components/TablaTrazabilidadEstandar";

export type LoteHorneado = LoteLaminado;

export interface Estacion6Props {
  lotesActivos?: LoteLaminado[];
  onLoteCompletado?: (loteHorneado: LoteHorneado) => void;
  esClaro?: boolean;
}

export default function Estacion6({
  lotesActivos = [],
  onLoteCompletado,
  esClaro = false,
}: Estacion6Props) {
  const [loteSeleccionadoId, setLoteSeleccionadoId] = useState<string>(
    lotesActivos.length > 0 ? lotesActivos[0].idLote : ""
  );
  const [acordeonAbierto, setAcordeonAbierto] = useState<boolean>(true);

  // Parámetros específicos de Horneado
  const [hornoSeleccionado, setHornoSeleccionado] = useState<string>("Horno Central 1");
  const [temperaturaHornoC, setTemperaturaHornoC] = useState<number>(210);
  const [tiempoHorneadoMin, setTiempoHorneadoMin] = useState<number>(18);
  const [inyeccionVaporSec, setInyeccionVaporSec] = useState<number>(5);

  // Responsable
  const [responsableCedula, setResponsableCedula] = useState<string>("");
  const [responsableNombre, setResponsableNombre] = useState<string>("Ingrese cédula para firmar...");

  const loteActual =
    lotesActivos.find((l) => l.idLote === loteSeleccionadoId) || lotesActivos[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 text-xs font-sans pb-12">
      {/* 1. CABECERA DE ESTACIÓN */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-md flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-amber-400 flex items-center gap-2">
            🔥 Estación 6: Horneado y Cocción Digital
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Módulo de Cocción Industrial — Control de Horno, Temperatura y Tiempos de Horneado
          </p>
        </div>
        {lotesActivos.length > 0 && (
          <select
            value={loteSeleccionadoId}
            onChange={(e) => setLoteSeleccionadoId(e.target.value)}
            className="bg-slate-800 text-xs text-amber-300 font-bold border border-slate-700 rounded-lg px-3 py-2 focus:outline-none"
          >
            {lotesActivos.map((l) => (
              <option key={l.idLote} value={l.idLote}>
                Lote: {l.idLote} ({l.cargaTotalKg} Kg)
              </option>
            ))}
          </select>
        )}
      </div>

      {lotesActivos.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 rounded-xl border border-slate-800 text-slate-400 text-sm">
          ⚠️ No hay lotes activos transferidos desde la Estación 5 (Fermentación). Certifique la estación previa para habilitar el horneado.
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
                    LOTE EN HORNEADO: {loteActual.idLote} ({loteActual.amasadora}) — Receta: {loteActual.receta}
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Carga Total: <span className="text-emerald-400 font-bold">{loteActual.cargaTotalKg} Kg</span> | Clic aquí para ver/ocultar la trazabilidad completa.
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
                  <span>🔍</span> Trazabilidad Estándar Completa del Lote:
                </div>
                <TablaTrazabilidadEstandar pedidos={loteActual.pedidosAsociados} esClaro={esClaro} />
              </div>
            )}
          </div>

          {/* 3. PARÁMETROS DE HORNEADO */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 max-w-3xl mx-auto">
            <div className="bg-orange-500 text-slate-950 py-3 px-6 rounded-xl text-center font-black text-base uppercase tracking-wider shadow-md">
              CONTROL DE HORNEADO Y COCCIÓN — {loteActual.receta.toUpperCase()}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 block">Horno Seleccionado:</label>
                <select
                  value={hornoSeleccionado}
                  onChange={(e) => setHornoSeleccionado(e.target.value)}
                  className="w-full bg-slate-800 text-xs text-slate-200 font-bold border border-slate-700 rounded-lg p-2.5"
                >
                  <option value="Horno Central 1">Horno Central 1</option>
                  <option value="Horno Central 2">Horno Central 2</option>
                  <option value="Horno Rotativo A">Horno Rotativo A</option>
                  <option value="Horno de Piso / Modulos">Horno de Piso / Módulos</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 block">Temperatura (°C):</label>
                <input
                  type="number"
                  value={temperaturaHornoC}
                  onChange={(e) => setTemperaturaHornoC(Number(e.target.value))}
                  className="w-full bg-slate-800 text-sm font-mono text-orange-400 font-bold border border-slate-700 rounded-lg p-2.5"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 block">Tiempo Horneado (min):</label>
                <input
                  type="number"
                  value={tiempoHorneadoMin}
                  onChange={(e) => setTiempoHorneadoMin(Number(e.target.value))}
                  className="w-full bg-slate-800 text-sm font-mono text-amber-400 font-bold border border-slate-700 rounded-lg p-2.5"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 block">Inyección Vapor (seg):</label>
                <input
                  type="number"
                  value={inyeccionVaporSec}
                  onChange={(e) => setInyeccionVaporSec(Number(e.target.value))}
                  className="w-full bg-slate-800 text-sm font-mono text-cyan-400 font-bold border border-slate-700 rounded-lg p-2.5"
                />
              </div>
            </div>

            {/* 4. BLOQUE DE FIRMA Y AVANCE */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                👤 RESPONSABLE DE HORNEADO
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Cédula del Operador:</label>
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
                        setResponsableNombre(`Operador ID ${ced}`);
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
                      alert("⚠️ POKA-YOKE: Ingrese la cédula del operador para certificar el horneado.");
                      return;
                    }
                    alert(`✅ Horneado del Lote ${loteActual.idLote} completado por ${responsableNombre}. Avanzando a Estación 7 (Enfriamiento y Empaque).`);
                    if (onLoteCompletado) onLoteCompletado(loteActual);
                  }}
                  className="px-6 py-3 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-lg hover:bg-emerald-400 hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>🔥</span> CERTIFICAR HORNEADO Y AVANZAR A ESTACIÓN 7 (EMPAQUE)
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}