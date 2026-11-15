"use client";

import React, { useState } from "react";

// Importa aquí tus pantallas de estaciones ya creadas
import Estacion1 from "../estaciones/estacion-1/page";
import Estacion2 from "../estaciones/estacion-2/page";
import Estacion3 from "../estaciones/estacion-3/page";
import Estacion4 from "../estaciones/estacion-4/page";
import Estacion5 from "../estaciones/estacion-5/page";
import Estacion6 from "../estaciones/estacion-6/page";
import Estacion7 from "../estaciones/estacion-7/page";
import Estacion8 from "../estaciones/estacion-8/page";
import Estacion9 from "../estaciones/estacion-9/page";
import Estacion10 from "../estaciones/estacion-10/page";
import Estacion11 from "../estaciones/estacion-11/page";

export default function PanelProduccionesPestañas() {
  const [pestanaActiva, setPestanaActiva] = useState<number>(1);

  const estacionesList = [
    { id: 1, nombre: "Estación 1", desc: "Pesaje" },
    { id: 2, nombre: "Estación 2", desc: "Amasado" },
    { id: 3, nombre: "Estación 3", desc: "División" },
    { id: 4, nombre: "Estación 4", desc: "Formado" },
    { id: 5, nombre: "Estación 5", desc: "Fermentación" },
    { id: 6, nombre: "Estación 6", desc: "Horneado" },
    { id: 7, nombre: "Estación 7", desc: "Enfriamiento" },
    { id: 8, nombre: "Estación 8", desc: "Control Salida" },
    { id: 9, nombre: "Estación 9", desc: "Rutas" },
    { id: 10, nombre: "Estación 10", desc: "Stock Bodega" },
    { id: 11, nombre: "Estación 11", desc: "Planta General" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 text-white font-sans pb-10">
      
      {/* CABECERA DEL MÓDULO DE PRODUCCIÓN */}
      <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div>
          <h1 className="text-base font-black font-mono text-amber-500 uppercase tracking-wider">
            ⚙️ Panel Central de Producción — Estaciones en Pestañas
          </h1>
          <p className="text-xs text-zinc-400">
            OSAI Industrial — Visualización permanente y completa de todas las estaciones de planta
          </p>
        </div>
        <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full font-mono font-bold text-[11px] border border-amber-500/30">
          ● Vista Activa Global
        </span>
      </div>

      {/* BARRA DE PESTAÑAS SUPERIOR (NAVEGACIÓN RÁPIDA) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-800 bg-zinc-950/80 p-2 rounded-2xl border border-zinc-800">
        {estacionesList.map((est) => {
          const esActiva = pestanaActiva === est.id;
          return (
            <button
              key={est.id}
              type="button"
              onClick={() => setPestanaActiva(est.id)}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex flex-col items-center gap-0.5 border ${
                esActiva
                  ? "bg-amber-500 text-black font-black border-amber-400 shadow-lg scale-105"
                  : "bg-black text-zinc-300 border-zinc-800 hover:bg-zinc-900 hover:text-amber-400"
              }`}
            >
              <span>{est.nombre}</span>
              <span className="text-[9px] font-normal opacity-80">{est.desc}</span>
            </button>
          );
        })}
      </div>

      {/* CONTENEDOR DE LA PESTAÑA ACTIVA (MUESTRA LA PANTALLA COMPLETA SIN RESTRICCIONES) */}
      <div className="bg-zinc-950 p-4 md:p-6 rounded-3xl border border-zinc-800 shadow-2xl min-h-[600px]">
        {pestanaActiva === 1 && <Estacion1 />}
        {pestanaActiva === 2 && <Estacion2 />}
        {pestanaActiva === 3 && <Estacion3 />}
        {pestanaActiva === 4 && <Estacion4 />}
        {pestanaActiva === 5 && <Estacion5 />}
        {pestanaActiva === 6 && <Estacion6 />}
        {pestanaActiva === 7 && <Estacion7 />}
        {pestanaActiva === 8 && <Estacion8 />}
        {pestanaActiva === 9 && <Estacion9 />}
        {pestanaActiva === 10 && <Estacion10 />}
        {pestanaActiva === 11 && <Estacion11 />}
      </div>

    </div>
  );
}