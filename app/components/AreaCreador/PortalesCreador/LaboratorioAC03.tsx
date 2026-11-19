"use client";

import React from "react";

export default function LaboratorioAC03() {
  return (
    <div className="space-y-4 text-white font-mono text-xs">
      <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-xl text-center space-y-3">
        <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 font-mono text-xs rounded-full border border-cyan-500/40">
          🧪 ENTORNO DE SIMULACIÓN VIRTUAL
        </span>
        <h3 className="text-lg font-bold text-white">Banco de Pruebas de Estaciones</h3>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          Aquí puedes simular el comportamiento de las pantallas del Área de Usuario antes de liberar actualizaciones a las licencias activas en planta.
        </p>
      </div>
    </div>
  );
}