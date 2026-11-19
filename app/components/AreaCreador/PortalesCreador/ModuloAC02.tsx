"use client";

import React from "react";

export default function ModuloAC02() {
  const modulos = [
    { nombre: "Módulo Producción & Amasado", estado: "ACTIVO", version: "v2.4" },
    { nombre: "Módulo Registro de Pedidos (AU02)", estado: "ACTIVO", version: "v3.1" },
    { nombre: "Módulo Control de Inventario & Harinas", estado: "ACTIVO", version: "v1.9" },
    { nombre: "Módulo Telemetría & Parche Remoto", estado: "ACTIVO", version: "v1.0" },
  ];

  return (
    <div className="space-y-4 text-white font-mono text-xs">
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
        <h3 className="text-sm font-bold text-amber-400 uppercase">Gestión de Módulos Industriales</h3>
        <p className="text-xs text-slate-400 mt-1">Activación y control de estaciones de producción y panadería.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {modulos.map((mod, idx) => (
          <div key={idx} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">{mod.nombre}</h4>
              <span className="text-xs font-mono text-slate-400">Versión {mod.version}</span>
            </div>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full text-xs font-mono font-bold">
              {mod.estado}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}