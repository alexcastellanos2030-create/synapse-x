"use client";

import React, { useState } from "react";
import BotoneraInferior from "../BotoneraInferior";

interface SidebarCreadorProps {
  areaActiva: string;
  onChangeArea: (nuevaArea: "usuario" | "superuser" | "creador") => void;
  rolActivo: string;
  estacionActiva: string;
  setEstacionActiva: (estacion: string) => void;
  handleCerrarSesion: () => void;
}

export default function SidebarCreador({
  areaActiva,
  onChangeArea,
  rolActivo,
  estacionActiva,
  setEstacionActiva,
  handleCerrarSesion,
}: SidebarCreadorProps) {
  const [acentoColor, setAcentoColor] = useState<"amber" | "emerald" | "orange">("amber");

  const estacionesCreador = [
    { id: "AC01", label: "AC01 — Master Kernel", icon: "👑" },
    { id: "AC02", label: "AC02 — Gestión de Módulos", icon: "📊" },
    { id: "AC03", label: "AC03 — Laboratorio HMI", icon: "🧪" },
    { id: "AC04", label: "AC04 — Staff & Licencias", icon: "👥" },
    { id: "AC05", label: "AC05 — Diagnóstico & Logs", icon: "📡" },
    { id: "AC06", label: "AC06 — Despliegue & Git", icon: "⚙️" },
  ];

  // Estilos dinámicos según el LED elegido
  const estilosAcento = {
    amber: {
      borde: "border-amber-500/30",
      badge: "bg-amber-500 text-black",
      titulo: "text-amber-400",
      activo: "bg-amber-500/20 text-amber-300 border-amber-500/50",
    },
    emerald: {
      borde: "border-emerald-500/30",
      badge: "bg-emerald-500 text-black",
      titulo: "text-emerald-400",
      activo: "bg-emerald-500/20 text-emerald-300 border-emerald-500/50",
    },
    orange: {
      borde: "border-orange-500/30",
      badge: "bg-orange-500 text-black",
      titulo: "text-orange-400",
      activo: "bg-orange-500/20 text-orange-300 border-orange-500/50",
    },
  }[acentoColor];

  return (
    <aside className={`w-72 bg-slate-950 border-r ${estilosAcento.borde} flex flex-col h-full font-sans select-none shrink-0`}>
      
      {/* CABECERA DEL SIDEBAR */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/50">
        <div className="flex items-center justify-between">
          <span className={`px-2 py-0.5 ${estilosAcento.badge} font-black text-[10px] rounded uppercase font-mono`}>
            OSAI KERNEL
          </span>
          <span className="text-[10px] font-mono text-emerald-400">● LIVE</span>
        </div>
        <h2 className={`text-sm font-black ${estilosAcento.titulo} uppercase tracking-wider mt-2 font-mono`}>
          Synapse-X Creador
        </h2>
        <p className="text-[10px] text-slate-400 mt-0.5">Control Total del Sistema</p>
      </div>

      {/* SELECTOR DE ÁREAS PRINCIPALES (Creador ve las 3) */}
      <div className="p-3 border-b border-slate-800 bg-black/40 grid grid-cols-3 gap-1">
        <button
          type="button"
          onClick={() => onChangeArea("creador")}
          className={`py-1.5 px-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
            areaActiva === "creador"
              ? "bg-amber-500 text-slate-950 font-black shadow-md"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800"
          }`}
        >
          👑 Creador
        </button>
        <button
          type="button"
          onClick={() => onChangeArea("superuser")}
          className={`py-1.5 px-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
            areaActiva === "superuser"
              ? "bg-cyan-500 text-slate-950 font-black shadow-md"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800"
          }`}
        >
          🛡️ Superuser
        </button>
        <button
          type="button"
          onClick={() => onChangeArea("usuario")}
          className={`py-1.5 px-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
            areaActiva === "usuario"
              ? "bg-purple-500 text-slate-950 font-black shadow-md"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800"
          }`}
        >
          ⚡ Operación
        </button>
      </div>

      {/* NAVEGACIÓN DE LAS 6 ESTACIONES DEL CREADOR (AC01 - AC06) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        <div className={`text-[10px] font-mono font-bold ${estilosAcento.titulo} px-2 uppercase tracking-wider mb-2`}>
          Estaciones de Control (6)
        </div>
        
        {estacionesCreador.map((est) => (
          <button
            key={est.id}
            type="button"
            onClick={() => setEstacionActiva(est.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
              estacionActiva === est.id
                ? `${estilosAcento.activo} shadow-lg`
                : "text-slate-300 hover:bg-slate-900 border-transparent"
            }`}
          >
            <span className="text-sm">{est.icon}</span>
            <span className="font-mono">{est.label}</span>
          </button>
        ))}
      </div>

      {/* BOTONERA INFERIOR UNIFICADA */}
      <BotoneraInferior
        onCerrarSesion={handleCerrarSesion}
        acentoColor={acentoColor}
        onChangeAcento={setAcentoColor}
      />

    </aside>
  );
}