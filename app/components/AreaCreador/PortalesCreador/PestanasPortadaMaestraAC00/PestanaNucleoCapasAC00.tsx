"use client";

import React from "react";
import { DESCRIPCION_CAPAS_AC00 } from "./TiposPortadaAC00";

interface PestanaNucleoCapasAC00Props {
  nivelActivo: number;
  onCambiarNivel: (nuevoNivel: number) => void;
}

export default function PestanaNucleoCapasAC00({
  nivelActivo,
  onCambiarNivel,
}: PestanaNucleoCapasAC00Props) {
  const info = DESCRIPCION_CAPAS_AC00[nivelActivo] || DESCRIPCION_CAPAS_AC00[10];

  return (
    <div className="space-y-4 text-xs">
      <div className="p-4 rounded-xl border border-amber-400/40 bg-amber-950/20 space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
          Capa Activa: Nivel {nivelActivo} — {info.nombre}
        </div>
        <p className="text-slate-300">{info.detalle}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((lvl) => {
          const seleccionada = nivelActivo === lvl;
          return (
            <button
              key={lvl}
              type="button"
              onClick={() => onCambiarNivel(lvl)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                seleccionada
                  ? "border-amber-300 bg-amber-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(251,191,36,0.45)]"
                  : "border-slate-800 bg-slate-900/70 text-slate-200 hover:border-amber-400/50"
              }`}
            >
              <div className="text-[11px] font-bold">Nivel {lvl}</div>
              <div
                className={`text-[10px] truncate ${
                  seleccionada ? "text-slate-900" : "text-slate-400"
                }`}
              >
                {DESCRIPCION_CAPAS_AC00[lvl]?.nombre}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}