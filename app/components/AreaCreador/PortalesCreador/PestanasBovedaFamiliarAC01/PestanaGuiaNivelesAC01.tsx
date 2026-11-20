'use client';

import React from 'react';
import { DESCRIPCION_NIVELES } from '../BovedaFamiliarTipos';

export default function PestanaGuiaNivelesAC01() {
  return (
    <div className="bg-black/40 border border-slate-800 rounded-xl p-5 space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
        Mapa de Autorización Progresiva (Niveles 1 al 10)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-[11px]">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => {
          const item = DESCRIPCION_NIVELES[n];
          const esDiez = n === 10;
          return (
            <div
              key={n}
              className={`p-3 rounded-lg border ${
                esDiez
                  ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                  : 'bg-[#030712] border-slate-800/90 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`font-bold ${esDiez ? 'text-emerald-400' : 'text-amber-300'}`}>
                  {item.titulo}
                </span>
                <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-slate-900 text-slate-400 shrink-0">
                  {item.etapa}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">{item.detalle}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}