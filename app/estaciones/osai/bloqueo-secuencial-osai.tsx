"use client";

import React from "react";

interface Paso {
  id: number;
  nombre: string;
  estado: string;
}

interface Estacion {
  id: number;
  nombre: string;
}

interface BloqueoSecuencialOSAIProps {
  estacionActual: number;
  estaciones?: Estacion[];
  onCambiarEstacion: (id: number) => void;
  pasos: Paso[];
  onCompletarPaso: (index: number) => void;
  children: React.ReactNode;
}

export const ESTACIONES_OFICIALES: Estacion[] = [
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

export default function BloqueoSecuencialOSAI({
  estacionActual,
  estaciones = ESTACIONES_OFICIALES,
  onCambiarEstacion,
  pasos,
  onCompletarPaso,
  children,
}: BloqueoSecuencialOSAIProps) {
  return (
    <div className="min-h-screen bg-black text-white p-4 font-mono">
      {/* Cabecera Maestra Unificada - 12 Estaciones OS-AI */}
      <div className="mb-6 border border-zinc-800 bg-zinc-950 p-4 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <span>🏭</span> SYNEXIS-X OS-AI INDUSTRIAL — PANEL CENTRAL DE PRODUCCIÓN
          </h2>
          <span className="text-[10px] text-zinc-400 font-normal bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800">
            Vista Activa Global (12 Estaciones)
          </span>
        </div>
        
        {/* Barra de pestañas unificada */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-2">
          {estaciones.map((est) => (
            <button
              key={est.id}
              type="button"
              onClick={() => onCambiarEstacion(est.id)}
              className={`px-2 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer text-center truncate ${
                estacionActual === est.id
                  ? "bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/20 scale-105"
                  : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800"
              }`}
              title={`${est.id}. ${est.nombre}`}
            >
              <span className="font-bold">{est.id}.</span> {est.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Panel de Secuencia de Pasos Poka-Yoke */}
      <div className="mb-6 border border-zinc-800 bg-zinc-950 p-4 rounded-xl shadow-lg">
        <h3 className="text-xs font-bold text-zinc-400 mb-3 uppercase tracking-wider flex items-center gap-2">
          <span>🔒</span> Sistema de Candados y Bloqueo Secuencial OSAI
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
          {pasos.map((paso, index) => (
            <div
              key={paso.id}
              onClick={() => {
                if (paso.estado === "activo") {
                  onCompletarPaso(index);
                }
              }}
              className={`p-3 rounded-lg border text-xs flex flex-col justify-between transition-all ${
                paso.estado === "completado"
                  ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-300"
                  : paso.estado === "activo"
                  ? "border-amber-500/60 bg-amber-950/20 text-amber-300 shadow-md cursor-pointer hover:border-amber-400"
                  : "border-zinc-800 bg-zinc-900/50 text-zinc-600 opacity-60"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">Paso {paso.id}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${
                  paso.estado === "completado" 
                    ? "bg-emerald-500/20 text-emerald-400" 
                    : paso.estado === "activo" 
                    ? "bg-amber-500/20 text-amber-400 animate-pulse" 
                    : "bg-zinc-800 text-zinc-500"
                }`}>
                  {paso.estado}
                </span>
              </div>
              <p className="text-[11px] font-sans">{paso.nombre}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contenido Dinámico de la Estación */}
      <div className="border border-zinc-800 bg-zinc-950 p-4 rounded-xl shadow-2xl">
        {children}
      </div>
    </div>
  );
}