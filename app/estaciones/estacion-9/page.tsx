"use client";

import React, { useState } from "react";
import type { LoteCesta } from "../estacion-8/page";
import TablaTrazabilidadEstandar from "../../components/TablaTrazabilidadEstandar";
import BloqueoSecuencialOSAI from "../osai/bloqueo-secuencial-osai";

export type LoteBodega = LoteCesta;

export interface Estacion9Props {
  lotesActivos?: LoteCesta[];
  onLoteCompletado?: (loteBodega: LoteBodega) => void;
  esClaro?: boolean;
}

export default function Estacion9({
  lotesActivos = [],
  onLoteCompletado,
  esClaro = false,
}: Estacion9Props) {
  const [estacionActiva, setEstacionActiva] = useState<number>(9);
  const [loteSeleccionadoId, setLoteSeleccionadoId] = useState<string>(
    lotesActivos.length > 0 ? lotesActivos[0].idLote : ""
  );
  const [acordeonAbierto, setAcordeonAbierto] = useState<boolean>(true);

  // Parámetros específicos de Bodega Final y Salida
  const [ubicacionBodega, setUbicacionBodega] = useState<string>("RACK-A1 (Zona Despacho Inmediato)");
  const [guiaDespacho, setGuiaDespacho] = useState<string>("GD-2026-00941");
  const [estadoDespacho, setEstadoDespacho] = useState<string>("Listo para Carga / Transporte");

  // Responsable
  const [responsableCedula, setResponsableCedula] = useState<string>("");
  const [responsableNombre, setResponsableNombre] = useState<string>("Ingrese cédula para firmar...");

  // Pasos secuenciales de la Estación 9 (Bodega Final / Salida)
  const [pasosEstacion9, setPasosEstacion9] = useState([
    { id: 1, nombre: "Recepción Cestas", estado: "completado" as string },
    { id: 2, nombre: "Asignación Rack", estado: "activo" as string },
    { id: 3, nombre: "Guía de Despacho", estado: "bloqueado" as string },
    { id: 4, nombre: "Control de Salida", estado: "bloqueado" as string },
    { id: 5, nombre: "Cierre de Ciclo", estado: "bloqueado" as string },
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
    const nuevos = [...pasosEstacion9];
    nuevos[indexPaso].estado = "completado";
    if (indexPaso + 1 < nuevos.length) {
      nuevos[indexPaso + 1].estado = "activo";
    }
    setPasosEstacion9(nuevos);
  };

  const handleCambiarEstacion = (id: number) => {
    setEstacionActiva(id);
    if (typeof window !== "undefined") {
      window.location.href = `/estaciones/estacion-${id}`;
    }
  };

  const loteActual =
    lotesActivos.find((l) => l.idLote === loteSeleccionadoId) || lotesActivos[0];

  return (
    <BloqueoSecuencialOSAI
      estacionActual={estacionActiva}
      estaciones={estacionesListado}
      onCambiarEstacion={handleCambiarEstacion}
      pasos={pasosEstacion9}
      onCompletarPaso={completarPasoSecuencial}
    >
      <div className="space-y-6">
        
        {/* SELECTOR RAPIDO SI HAY MULTIPLES LOTES ACTIVOS */}
        {lotesActivos.length > 1 && (
          <div className="flex justify-end mb-2">
            <select
              value={loteSeleccionadoId}
              onChange={(e) => setLoteSeleccionadoId(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 text-xs text-amber-700 dark:text-amber-300 font-bold border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 focus:outline-none"
            >
              {lotesActivos.map((l) => (
                <option key={l.idLote} value={l.idLote}>
                  Lote: {l.idLote} ({l.cargaTotalKg} Kg)
                </option>
              ))}
            </select>
          </div>
        )}

        {lotesActivos.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900/60 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm transition-colors">
            ⚠️ No hay lotes activos transferidos desde la Estación 8 (Cestas). Certifique la estación previa para registrar la salida de bodega.
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
                  <span className="text-base">📦</span>
                  <div>
                    <div className="text-sm font-black text-amber-600 dark:text-amber-400 font-mono">
                      LOTE EN BODEGA FINAL: {loteActual.idLote} ({loteActual.amasadora}) — Receta: {loteActual.receta}
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                      Carga Total: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{loteActual.cargaTotalKg} Kg</span> | Clic aquí para ver/ocultar la trazabilidad completa.
                    </div>
                  </div>
                </div>
                <div className="text-xs text-amber-700 dark:text-amber-400 font-bold bg-slate-200 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700">
                  {acordeonAbierto ? "Ocultar Trazabilidad ▲" : "Ver Trazabilidad Completa ▼"}
                </div>
              </div>

              {acordeonAbierto && (
                <div className="p-4 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-300 dark:border-slate-800 space-y-3 transition-colors">
                  <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <span>🔍</span> Trazabilidad Estándar Completa del Lote:
                  </div>
                  <TablaTrazabilidadEstandar pedidos={loteActual.pedidosAsociados} esClaro={esClaro} />
                </div>
              )}
            </div>

            {/* PARÁMETROS DE BODEGA FINAL Y SALIDA */}
            <div className="bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 max-w-3xl mx-auto transition-colors">
              <div className="bg-emerald-500 text-slate-950 py-3 px-6 rounded-xl text-center font-black text-base uppercase tracking-wider shadow-md">
                REGISTRO DE SALIDA Y BODEGA FINAL — {loteActual.receta.toUpperCase()}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-300 dark:border-slate-800 transition-colors">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-400 block">Ubicación en Bodega:</label>
                  <input
                    type="text"
                    value={ubicacionBodega}
                    onChange={(e) => {
                      setUbicacionBodega(e.target.value);
                      completarPasoSecuencial(1);
                    }}
                    className="w-full bg-white dark:bg-slate-800 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold border border-slate-300 dark:border-slate-700 rounded-lg p-2.5"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-400 block">N° Guía de Despacho:</label>
                  <input
                    type="text"
                    value={guiaDespacho}
                    onChange={(e) => {
                      setGuiaDespacho(e.target.value);
                      completarPasoSecuencial(2);
                    }}
                    className="w-full bg-white dark:bg-slate-800 text-xs font-mono text-amber-600 dark:text-amber-400 font-bold border border-slate-300 dark:border-slate-700 rounded-lg p-2.5"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-400 block">Estado del Despacho:</label>
                  <select
                    value={estadoDespacho}
                    onChange={(e) => {
                      setEstadoDespacho(e.target.value);
                      completarPasoSecuencial(3);
                    }}
                    className="w-full bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-200 font-bold border border-slate-300 dark:border-slate-700 rounded-lg p-2.5"
                  >
                    <option value="Listo para Carga / Transporte">Listo para Carga / Transporte</option>
                    <option value="En Tránsito a Cliente">En Tránsito a Cliente</option>
                    <option value="Entregado y Conforme">Entregado y Conforme</option>
                  </select>
                </div>
              </div>

              {/* BLOQUE DE FIRMA Y FINALIZACIÓN */}
              <div className="bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-xl p-4 space-y-3 transition-colors">
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  👤 RESPONSABLE DE BODEGA Y DESPACHO
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 dark:text-slate-400 block mb-1">Cédula del Operador:</label>
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
                      className="w-full bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 dark:text-slate-400 block mb-1">Nombre Autorizado:</label>
                    <div className="w-full bg-slate-200 dark:bg-slate-950 text-xs text-amber-700 dark:text-amber-400 font-bold border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 flex items-center">
                      {responsableNombre}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!responsableCedula.trim() || responsableNombre.includes("Ingrese")) {
                        alert("⚠️ POKA-YOKE: Ingrese la cédula del operador para finalizar la trazabilidad y autorizar la salida.");
                        return;
                      }
                      completarPasoSecuencial(4);
                      alert(`🎉 ¡TRAZABILIDAD COMPLETA! El Lote ${loteActual.idLote} ha cerrado su ciclo de producción en Bodega Final registrado por ${responsableNombre}.`);
                      if (onLoteCompletado) onLoteCompletado(loteActual);
                    }}
                    className="px-6 py-3 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-lg hover:bg-emerald-400 hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <span>🚀</span> FINALIZAR CICLO Y REGISTRAR SALIDA DE BODEGA
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </BloqueoSecuencialOSAI>
  );
}