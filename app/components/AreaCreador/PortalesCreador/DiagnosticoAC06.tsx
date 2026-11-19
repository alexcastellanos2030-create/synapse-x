"use client";

import React from "react";

export default function DiagnosticoAC06() {
  return (
    <div className="space-y-4 text-white font-mono text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs font-mono text-slate-400">Base de Datos</span>
          <h4 className="text-base font-bold text-emerald-400 mt-1">Supabase Conectado</h4>
          <p className="text-[11px] text-slate-400 mt-1">Ruta: lib/supabase.ts verificada</p>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs font-mono text-slate-400">Producción Nube</span>
          <h4 className="text-base font-bold text-cyan-400 mt-1">Vercel Activo</h4>
          <p className="text-[11px] text-slate-400 mt-1">synapse-x-navy.vercel.app</p>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs font-mono text-slate-400">Control de Versiones</span>
          <h4 className="text-base font-bold text-amber-400 mt-1">Git Sincronizado</h4>
          <p className="text-[11px] text-slate-400 mt-1">Carpeta única: C:\Users\alexc\synapse-x</p>
        </div>
      </div>
    </div>
  );
}