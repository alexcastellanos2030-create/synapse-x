"use client";

import React, { useState } from "react";
import BloqueoSecuencialOSAI from "../osai/bloqueo-secuencial-osai";

// Definición local del tipo de lote para evitar conflictos de importación
export interface LoteMezclado {
  idLote: string;
  amasadora: string;
  receta: string;
  cargaTotalKg: number;
  pedidosAsociados?: any[];
}

export type LoteHorneado = LoteMezclado & {
  hornoUtilizado: string;
  temperaturaHornoC: number;
  tiempoHorneadoMin: number;
};

export interface Estacion6Props {
  lotesActivos?: LoteMezclado[];
  onLoteHorneadoCompletado?: (loteHorneado: LoteHorneado) => void;
  esClaro?: boolean;
}

interface CronometroHorno {
  id: string;
  nombre: string;
  minutos: number;
  segundos: number;
  temperatura: number;
  vaporSeg: number;
  activo: boolean;
  completado: boolean;
}

export default function Estacion6({
  lotesActivos = [],
  onLoteHorneadoCompletado,
  esClaro = false,
}: Estacion6Props) {
  const [estacionActiva, setEstacionActiva] = useState<number>(6);
  const [loteSeleccionadoId, setLoteSeleccionadoId] = useState<string>(
    lotesActivos.length > 0 ? lotesActivos[0].idLote : ""
  );

  const [responsableCedula, setResponsableCedula] = useState<string>("");
  const [responsableNombre, setResponsableNombre] = useState<string>("Ingrese cédula para firmar...");

  const [cronometros, setCronometros] = useState<CronometroHorno[]>([
    { id: "h1", nombre: "Horno 1: Horno Ronco", minutos: 25, segundos: 0, temperatura: 180, vaporSeg: 15, activo: false, completado: false },
    { id: "h2", nombre: "Horno 2: Horno Sucheli", minutos: 20, segundos: 0, temperatura: 200, vaporSeg: 10, activo: false, completado: false },
    { id: "h3", nombre: "Horno 3: Horno Sucheli Nuevo", minutos: 20, segundos: 0, temperatura: 190, vaporSeg: 12, activo: false, completado: false },
    { id: "h4", nombre: "Horno 4: Horno de Piso", minutos: 30, segundos: 0, temperatura: 220, vaporSeg: 20, activo: false, completado: false },
    { id: "h5", nombre: "Horno 5: Horno de Cinta", minutos: 15, segundos: 0, temperatura: 210, vaporSeg: 8, activo: false, completado: false },
    { id: "h6", nombre: "Horno 6: Plancha Caliente", minutos: 8, segundos: 0, temperatura: 160, vaporSeg: 0, activo: false, completado: false },
  ]);

  const [hornoSeleccionadoParaLote, setHornoSeleccionadoParaLote] = useState<string>("Horno 1: Horno Ronco");

  // Pasos secuenciales de la Estación 6 (Horneado)
  const [pasosEstacion6, setPasosEstacion6] = useState([
    { id: 1, nombre: "Ingreso a Horno", estado: "completado" as string },
    { id: 2, nombre: "Selección de Equipo", estado: "activo" as string },
    { id: 3, nombre: "Inyección de Vapor", estado: "bloqueado" as string },
    { id: 4, nombre: "Control de Tiempos", estado: "bloqueado" as string },
    { id: 5, nombre: "Firma Operario", estado: "bloqueado" as string },
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
    const nuevos = [...pasosEstacion6];
    nuevos[indexPaso].estado = "completado";
    if (indexPaso + 1 < nuevos.length) {
      nuevos[indexPaso + 1].estado = "activo";
    }
    setPasosEstacion6(nuevos);
  };

  const handleCambiarEstacion = (id: number) => {
    setEstacionActiva(id);
    if (typeof window !== "undefined") {
      window.location.href = `/estaciones/estacion-${id}`;
    }
  };

  const loteActual =
    lotesActivos.find((l) => l.idLote === loteSeleccionadoId) || lotesActivos[0];

  const handleUpdateCronometro = (id: string, campo: keyof CronometroHorno, valor: any) => {
    setCronometros((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [campo]: valor } : c))
    );
  };

  const handleToggleIniciarCronometro = (id: string) => {
    setCronometros((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nuevoEstado = !c.activo;
          if (nuevoEstado) {
            completarPasoSecuencial(2); // Al iniciar cronómetro, se marca inyección de vapor / parámetros
          }
          return { ...c, activo: nuevoEstado };
        }
        return c;
      })
    );
  };

  const handleCertificarHorneado = () => {
    if (!responsableCedula.trim() || responsableNombre.includes("Ingrese")) {
      alert("⚠️ POKA-YOKE: Ingrese la cédula del operador responsable para certificar el horneado.");
      return;
    }

    if (!loteActual) {
      alert("⚠️ No hay ningún lote activo seleccionado para procesar.");
      return;
    }

    const equipoUsado = cronometros.find((c) => c.nombre === hornoSeleccionadoParaLote);
    completarPasoSecuencial(3);
    completarPasoSecuencial(4);

    const loteTerminado: LoteHorneado = {
      ...loteActual,
      hornoUtilizado: hornoSeleccionadoParaLote,
      temperaturaHornoC: equipoUsado ? equipoUsado.temperatura : 180,
      tiempoHorneadoMin: equipoUsado ? equipoUsado.minutos : 20,
    };

    alert(`✅ Horneado del Lote ${loteActual.idLote} completado en [${hornoSeleccionadoParaLote}] por ${responsableNombre}.\nAvanzando automáticamente a Estación 7 (Empaque).`);

    if (onLoteHorneadoCompletado) {
      onLoteHorneadoCompletado(loteTerminado);
    }
  };

  return (
    <BloqueoSecuencialOSAI
      estacionActual={estacionActiva}
      estaciones={estacionesListado}
      onCambiarEstacion={handleCambiarEstacion}
      pasos={pasosEstacion6}
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
                  Lote: {l.idLote} ({l.cargaTotalKg} Kg) — {l.receta}
                </option>
              ))}
            </select>
          </div>
        )}

        {lotesActivos.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900/60 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-sm transition-colors">
            ⚠️ No hay lotes activos transferidos desde la Estación 5 (Fermentación). Complete la fermentación previa.
          </div>
        ) : (
          <>
            <div className="bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 transition-colors">
              <div className="bg-amber-500 dark:bg-amber-600 text-slate-950 py-3 px-6 rounded-xl text-center font-black text-base uppercase tracking-wider shadow-md">
                PANEL DE CRONÓMETROS Y PARÁMETROS POR EQUIPO
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cronometros.map((c) => (
                  <div
                    key={c.id}
                    className={`p-4 rounded-xl border transition-all space-y-3 ${
                      c.activo
                        ? "bg-slate-100 dark:bg-slate-900 border-amber-500 shadow-lg shadow-amber-950/40"
                        : "bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{c.nombre}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setHornoSeleccionadoParaLote(c.nombre);
                          completarPasoSecuencial(1);
                        }}
                        className={`px-2 py-1 text-[10px] font-bold rounded border cursor-pointer transition-all ${
                          hornoSeleccionadoParaLote === c.nombre
                            ? "bg-amber-500 text-slate-950 border-amber-400 font-black shadow"
                            : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-300 dark:hover:bg-slate-700"
                        }`}
                      >
                        {hornoSeleccionadoParaLote === c.nombre ? "✓ Seleccionado para Lote" : "Asignar Lote"}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-white dark:bg-slate-900/80 p-2.5 rounded-lg border border-slate-300 dark:border-slate-800 text-[11px]">
                      <div>
                        <label className="text-[9px] text-slate-600 dark:text-slate-400 block font-bold">Tiempo (Min):</label>
                        <input
                          type="number"
                          value={c.minutos}
                          onChange={(e) => handleUpdateCronometro(c.id, "minutos", Number(e.target.value))}
                          className="w-full bg-slate-100 dark:bg-slate-800 text-xs font-mono text-amber-600 dark:text-amber-400 font-bold border border-slate-300 dark:border-slate-700 rounded p-1 text-center"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-600 dark:text-slate-400 block font-bold">Segundos:</label>
                        <input
                          type="number"
                          value={c.segundos}
                          onChange={(e) => handleUpdateCronometro(c.id, "segundos", Number(e.target.value))}
                          className="w-full bg-slate-100 dark:bg-slate-800 text-xs font-mono text-amber-600 dark:text-amber-400 font-bold border border-slate-300 dark:border-slate-700 rounded p-1 text-center"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-600 dark:text-slate-400 block font-bold">Temp (°C):</label>
                        <input
                          type="number"
                          value={c.temperatura}
                          onChange={(e) => handleUpdateCronometro(c.id, "temperatura", Number(e.target.value))}
                          className="w-full bg-slate-100 dark:bg-slate-800 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold border border-slate-300 dark:border-slate-700 rounded p-1 text-center"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-600 dark:text-slate-400 block font-bold">Inyección Vapor (s):</label>
                        <input
                          type="number"
                          value={c.vaporSeg}
                          onChange={(e) => handleUpdateCronometro(c.id, "vaporSeg", Number(e.target.value))}
                          className="w-full bg-slate-100 dark:bg-slate-800 text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold border border-slate-300 dark:border-slate-700 rounded p-1 text-center"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <span className="font-mono text-sm font-black text-amber-700 dark:text-amber-300">
                        {String(c.minutos).padStart(2, "0")}:{String(c.segundos).padStart(2, "0")}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleIniciarCronometro(c.id)}
                        className={`px-3 py-1 font-bold text-[10px] rounded shadow transition-all cursor-pointer ${
                          c.activo
                            ? "bg-red-600 text-white animate-pulse"
                            : "bg-emerald-600 text-white hover:bg-emerald-500"
                        }`}
                      >
                        {c.activo ? "⏹ Detener" : "▶ Iniciar Cronómetro"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-xl p-4 space-y-3 mt-4 transition-colors">
                <div className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                  👤 RESPONSABLE DE HORNEADO (FIRMA Y CERTIFICACIÓN) — Equipo Asignado: <span className="text-slate-900 dark:text-white font-mono">{hornoSeleccionadoParaLote}</span>
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
                    onClick={handleCertificarHorneado}
                    className="px-6 py-3 bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg hover:bg-amber-400 hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <span>🔥</span> CERTIFICAR HORNEADO Y AVANZAR A ESTACIÓN 7 (EMPAQUE)
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