"use client";

import React from "react";
import { EventoBitacoraAC00 } from "./TiposPortadaAC00";

interface PestanaRuteoBitacoraAC00Props {
  onIrPortal: (portalId: string) => void;
  eventos: EventoBitacoraAC00[];
}

const PORTALES_RAPIDOS = [
  { id: "AC01", label: "AC01 · Bóveda Familiar" },
  { id: "AC02", label: "AC02 · Núcleo OS-AI" },
  { id: "AC03", label: "AC03 · Laboratorio HMI" },
  { id: "AC04", label: "AC04 · Staff & Licencias" },
  { id: "AC05", label: "AC05 · Diagnóstico & Logs" },
  { id: "AC06", label: "AC06 · Despliegue & Git" },
  { id: "AC07", label: "AC07 · Enlaces Maestros" },
];

export default function PestanaRuteoBitacoraAC00({
  onIrPortal,
  eventos,
}: PestanaRuteoBitacoraAC00Props) {
  return (
    <div className="space-y-4 text-xs">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {PORTALES_RAPIDOS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onIrPortal(p.id)}
            className="p-2.5 rounded-xl border border-sky-400/40 bg-sky-950/25 hover:bg-sky-500 hover:text-slate-950 text-sky-200 font-bold text-left transition-all cursor-pointer"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="p-3.5 rounded-xl border border-sky-500/30 bg-slate-900/60 space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-sky-300">
          Bitácora Reciente de Portada Maestra
        </div>
        {eventos.length === 0 ? (
          <div className="text-slate-400 text-[11px]">
            Aún no hay movimientos registrados en esta sesión de AC00.
          </div>
        ) : (
          <div className="space-y-1.5 max-h-44 overflow-y-auto">
            {eventos.map((ev) => (
              <div
                key={ev.id}
                className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1"
              >
                <div>
                  <span className="font-bold text-sky-300">{ev.accion}:</span>{" "}
                  <span className="text-slate-200">{ev.detalle}</span>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">{ev.fechaHora}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}