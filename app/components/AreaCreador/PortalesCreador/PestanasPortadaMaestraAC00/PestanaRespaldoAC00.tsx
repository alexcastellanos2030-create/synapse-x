"use client";

import React, { useState } from "react";
import { EstadoProtocolosAC00 } from "./TiposPortadaAC00";

interface PestanaRespaldoAC00Props {
  nivelActivo: number;
  protocolos: EstadoProtocolosAC00;
  onRegistrarRespaldo: () => void;
}

export default function PestanaRespaldoAC00({
  nivelActivo,
  protocolos,
  onRegistrarRespaldo,
}: PestanaRespaldoAC00Props) {
  const [copiado, setCopiado] = useState(false);

  const snapshotJson = JSON.stringify(
    {
      marca: "Synapse-X OSAI Industrial",
      portal: "AC00",
      nivelNucleoActivo: nivelActivo,
      protocolos,
      generadoEn: new Date().toISOString(),
    },
    null,
    2
  );

  const handleCopiar = async () => {
    try {
      await navigator.clipboard.writeText(snapshotJson);
      setCopiado(true);
      onRegistrarRespaldo();
      setTimeout(() => setCopiado(false), 1800);
    } catch {
      onRegistrarRespaldo();
    }
  };

  const handleDescargar = () => {
    const blob = new Blob([snapshotJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `synapse-x-ac00-snapshot-nivel-${nivelActivo}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onRegistrarRespaldo();
  };

  return (
    <div className="space-y-3 text-xs">
      <div className="p-4 rounded-xl border border-white/40 bg-white/5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-bold uppercase tracking-wider text-white">
            Snapshot de Configuración Maestra (JSON)
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopiar}
              className="px-3 py-1.5 rounded-lg bg-white text-slate-950 font-bold hover:bg-slate-200 cursor-pointer"
            >
              {copiado ? "Copiado" : "Copiar JSON"}
            </button>
            <button
              type="button"
              onClick={handleDescargar}
              className="px-3 py-1.5 rounded-lg border border-white/50 text-white font-bold hover:bg-white/10 cursor-pointer"
            >
              Descargar .json
            </button>
          </div>
        </div>

        <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-200 overflow-x-auto">
          {snapshotJson}
        </pre>
      </div>
    </div>
  );
}