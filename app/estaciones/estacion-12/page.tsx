"use client";

import React, { useState } from "react";
import BloqueoSecuencialOSAI from "../osai/bloqueo-secuencial-osai";

export interface LoteGeneral {
  idLote: string;
  receta: string;
  estacionActualId: number;
  estacionActualNombre: string;
  cargaTotalKg: number;
  estado: "En Proceso" | "Empacado" | "En Cestas" | "En Bodega Final" | "Auditado / Cerrado";
  responsableUltimo: string;
}

export default function Estacion12PlantaGeneral() {
  const [estacionActiva, setEstacionActiva] = useState<number>(12);

  // Simulación del estado global de lotes en la planta
  const [lotesPlanta] = useState<LoteGeneral[]>([
    {
      idLote: "LOTE-202610-001",
      receta: "Pan Brioche Láctico 10cm",
      estacionActualId: 7,
      estacionActualNombre: "Estación 7 (Empaque)",
      cargaTotalKg: 49.50,
      estado: "En Proceso",
      responsableUltimo: "Alexander Castellanos",
    },
    {
      idLote: "LOT-2026-011",
      receta: "Pan Francés Artesanal",
      estacionActualId: 9,
      estacionActualNombre: "Estación 9 (Bodega Final)",
      cargaTotalKg: 150.00,
      estado: "En Bodega Final",
      responsableUltimo: "Carolina Pérez",
    },
    {
      idLote: "LOT-2026-012",
      receta: "Pan Sobao Tradicional",
      estacionActualId: 10,
      estacionActualNombre: "Estación 10 (Stock Bodega)",
      cargaTotalKg: 120.00,
      estado: "Auditado / Cerrado",
      responsableUltimo: "Carolina Pérez",
    },
  ]);

  // Extendemos la lista de estaciones a 12
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

  const pasosEstacion12 = [
    { id: 1, nombre: "Monitoreo Global", estado: "completado" as string },
    { id: 2, nombre: "Control de Flujo", estado: "activo" as string },
    { id: 3, nombre: "Auditoría de Cargas", estado: "bloqueado" as string },
    { id: 4, nombre: "Consolidación Turno", estado: "bloqueado" as string },
    { id: 5, nombre: "Cierre Gerencial", estado: "bloqueado" as string },
  ];

  const handleCambiarEstacion = (id: number) => {
    setEstacionActiva(id);
    if (typeof window !== "undefined") {
      window.location.href = `/estaciones/estacion-${id}`;
    }
  };

  return (
    <BloqueoSecuencialOSAI
      estacionActual={estacionActiva}
      estaciones={estacionesListado}
      onCambiarEstacion={handleCambiarEstacion}
      pasos={pasosEstacion12}
      onCompletarPaso={() => {}}
    >
      <div className="space-y-6">
        
        {/* MÉTRICAS SUPERIORES DE PLANTA */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-4 rounded-xl text-center shadow-sm">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Estaciones Operativas</span>
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">12 / 12</span>
            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 block mt-1">● Sistema OS-AI Activo</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-4 rounded-xl text-center shadow-sm">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Lotes Activos en Planta</span>
            <span className="text-2xl font-black text-sky-600 dark:text-sky-400 font-mono">{lotesPlanta.length} Lotes</span>
            <span className="text-[9px] text-slate-500 block mt-1">Flujo industrial continuo</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-4 rounded-xl text-center shadow-sm">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Equipo de Taller</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">8 Operadores</span>
            <span className="text-[9px] text-slate-500 block mt-1">Jefe de Taller: Alex Castellanos</span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-4 rounded-xl text-center shadow-sm">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Empresa</span>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/30 inline-block mt-1">
              🏢 Salam Bakery
            </span>
          </div>
        </div>

        {/* TABLA GLOBAL DE TRAZABILIDAD DE LOTES */}
        <div className="bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-800 rounded-2xl shadow-xl p-5 space-y-4">
          <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <span>📊 ESTADO GENERAL Y TRAZABILIDAD DE LOTES EN TIEMPO REAL</span>
            <span className="text-[10px] text-slate-500 font-normal">Sincronizado con Supabase y Vercel</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-300 dark:border-slate-800 text-[10px] uppercase">
                  <th className="p-3">ID Lote</th>
                  <th className="p-3">Receta</th>
                  <th className="p-3">Estación Actual</th>
                  <th className="p-3 text-center">Carga (Kg)</th>
                  <th className="p-3 text-center">Estado de Ciclo</th>
                  <th className="p-3">Responsable / Auditor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-mono">
                {lotesPlanta.map((lote) => (
                  <tr key={lote.idLote} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="p-3 font-bold text-amber-600 dark:text-amber-400">{lote.idLote}</td>
                    <td className="p-3 font-sans text-slate-900 dark:text-slate-100 font-bold">{lote.receta}</td>
                    <td className="p-3 text-sky-600 dark:text-sky-400">{lote.estacionActualNombre}</td>
                    <td className="p-3 text-center text-emerald-600 dark:text-emerald-400">{lote.cargaTotalKg.toFixed(2)} Kg</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold inline-block ${
                        lote.estado === "Auditado / Cerrado"
                          ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30"
                          : lote.estado === "En Bodega Final"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                      }`}>
                        ● {lote.estado}
                      </span>
                    </td>
                    <td className="p-3 text-slate-700 dark:text-slate-300 font-sans text-xs">{lote.responsableUltimo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </BloqueoSecuencialOSAI>
  );
}