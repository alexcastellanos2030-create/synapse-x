"use client";

import React, { useState } from "react";
import type { LoteEmpaquetado } from "../estacion-7/page";
import TablaTrazabilidadEstandar from "../../components/TablaTrazabilidadEstandar";
import BloqueoSecuencialOSAI from "../osai/bloqueo-secuencial-osai";

export type LoteCesta = LoteEmpaquetado;

export interface Estacion8Props {
  lotesActivos?: LoteEmpaquetado[];
  onLoteCompletado?: (loteCesta: LoteCesta) => void;
  esClaro?: boolean;
}

export default function Estacion8({
  lotesActivos = [],
  onLoteCompletado,
  esClaro = false,
}: Estacion8Props) {
  const [estacionActiva, setEstacionActiva] = useState<number>(8);
  const [loteSeleccionadoId, setLoteSeleccionadoId] = useState<string>(
    lotesActivos.length > 0 ? lotesActivos[0].idLote : ""
  );
  const [acordeonAbierto, setAcordeonAbierto] = useState<boolean>(true);

  // Parámetros específicos de Cestas y Organización
  const [numeroCestasUsadas, setNumeroCestasUsadas] = useState<number>(12);
  const [tipoCesta, setTipoCesta] = useState<string>("Cesta Plástica Estándar Panadería (Roja/Azul)");
  const [zonaOrganizacion, setZonaOrganizacion] = useState<string>("Ruta 1 - Distribución Central");

  // Responsable
  const [responsableCedula, setResponsableCedula] = useState<string>("");
  const [responsableNombre, setResponsableNombre] = useState<string>("Ingrese cédula para firmar...");

  // Pasos secuenciales de la Estación 8 (Control Cestas / Salida)
  const [pasosEstacion8, setPasosEstacion8] = useState([
    { id: 1, nombre: "Recepción Empaque", estado: "completado" as string },
    { id: 2, nombre: "Asignación Cestas", estado: "activo" as string },
    { id: 3, nombre: "Consolidación Ruta", estado: "bloqueado" as string },
    { id: 4, nombre: "Verificación Final", estado: "bloqueado" as string },
    { id: 5, nombre: "Firma Responsable", estado: "bloqueado" as string },
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
    const nuevos = [...pasosEstacion8];
    nuevos[indexPaso].estado = "completado";
    if (indexPaso + 1 < nuevos.length) {
      nuevos[indexPaso + 1].estado = "activo";
    }
    setPasosEstacion8(nuevos);
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
      pasos={pasosEstacion8}
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
            ⚠️ No hay lotes activos transferidos desde la Estación 7 (Empaque). Certifique el empaque para habilitar la organización de cestas.
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
                      LOTE EN CESTAS: {loteActual.idLote} ({loteActual.amasadora}) — Receta: {loteActual.receta}
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

            {/* PARÁMETROS DE ORGANIZACIÓN DE CESTAS */}
            <div className="bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 max-w-3xl mx-auto transition-colors">
              <div className="bg-sky-500 text-slate-950 py-3 px-6 rounded-xl text-center font-black text-base uppercase tracking-wider shadow-md">
                ORGANIZACIÓN Y CONSOLIDACIÓN DE CESTAS — {loteActual.receta.toUpperCase()}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-300 dark:border-slate-800 transition-colors">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-400 block">Número de Cestas:</label>
                  <input
                    type="number"
                    value={numeroCestasUsadas}
                    onChange={(e) => {
                      setNumeroCestasUsadas(Number(e.target.value));
                      completarPasoSecuencial(1);
                    }}
                    className="w-full bg-white dark:bg-slate-800 text-sm font-mono text-sky-600 dark:text-sky-400 font-bold border border-slate-300 dark:border-slate-700 rounded-lg p-2.5"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-400 block">Tipo de Cesta / Contenedor:</label>
                  <select
                    value={tipoCesta}
                    onChange={(e) => {
                      setTipoCesta(e.target.value);
                      completarPasoSecuencial(2);
                    }}
                    className="w-full bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-200 font-bold border border-slate-300 dark:border-slate-700 rounded-lg p-2.5"
                  >
                    <option value="Cesta Plástica Estándar Panadería (Roja/Azul)">Cesta Plástica Estándar</option>
                    <option value="Cesta Calada de Despacho Rápido">Cesta Calada Rápida</option>
                    <option value="Caja Master de Envío">Caja Master</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-400 block">Ruta / Zona de Organización:</label>
                  <select
                    value={zonaOrganizacion}
                    onChange={(e) => {
                      setZonaOrganizacion(e.target.value);
                      completarPasoSecuencial(3);
                    }}
                    className="w-full bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-200 font-bold border border-slate-300 dark:border-slate-700 rounded-lg p-2.5"
                  >
                    <option value="Ruta 1 - Distribución Central">Ruta 1 - Central</option>
                    <option value="Ruta 2 - Despacho Local / Clientes Directos">Ruta 2 - Local</option>
                    <option value="Ruta Especial / Pedidos de Prioridad">Ruta Especial / Prioridad</option>
                  </select>
                </div>
              </div>

              {/* BLOQUE DE FIRMA Y AVANCE */}
              <div className="bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-xl p-4 space-y-3 transition-colors">
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  👤 RESPONSABLE DE CESTAS Y DESPACHO
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
                        alert("⚠️ POKA-YOKE: Ingrese la cédula del operador para certificar la organización en cestas.");
                        return;
                      }
                      completarPasoSecuencial(4);
                      alert(`✅ Organización en cestas del Lote ${loteActual.idLote} completada por ${responsableNombre}. Avanzando a Estación 9 (Bodega Final / Salida).`);
                      if (onLoteCompletado) onLoteCompletado(loteActual);
                    }}
                    className="px-6 py-3 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-lg hover:bg-emerald-400 hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <span>🧺</span> CERTIFICAR CESTAS Y AVANZAR A ESTACIÓN 9 (BODEGA FINAL)
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