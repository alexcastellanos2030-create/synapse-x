"use client";

import React, { useState } from "react";

interface SidebarCreadorProps {
  areaActiva: "usuario" | "superuser" | "creador";
  onChangeArea: (area: "usuario" | "superuser" | "creador") => void;
  rolActivo: string;
  estacionActiva: string;
  setEstacionActiva: (estacion: string) => void;
  handleCerrarSesion: () => void;
}

export default function SidebarCreador({
  areaActiva,
  onChangeArea,
  estacionActiva,
  setEstacionActiva,
  handleCerrarSesion,
}: SidebarCreadorProps) {
  
  // Estado para colapsar/expandir la barra lateral
  const [colapsada, setColapsada] = useState<boolean>(false);

  // Lista oficial de los 7 portales del Creador + Portada AC00
  const portalesCreador = [
    { id: "AC00", label: "AC00 — Portada Maestra", icon: "🏠" },
    { id: "AC01", label: "AC01 — Bóveda Familiar", icon: "🔒" },
    { id: "AC02", label: "AC02 — Núcleo OS-AI", icon: "⚡" },
    { id: "AC03", label: "AC03 — Laboratorio HMI", icon: "🧪" },
    { id: "AC04", label: "AC04 — Staff & Licencias", icon: "👥" },
    { id: "AC05", label: "AC05 — Diagnóstico & Logs", icon: "📊" },
    { id: "AC06", label: "AC06 — Despliegue & Git", icon: "🚀" },
    { id: "AC07", label: "AC07 — Enlaces Maestros", icon: "🔗" },
  ];

  // Si está colapsada, mostramos únicamente una tira fina flotante con los botones para reabrir
  if (colapsada) {
    return (
      <div className="w-12 bg-slate-950 border-r border-amber-500/20 flex flex-col items-center py-3 space-y-4 h-full select-none text-xs z-50">
        <button
          onClick={() => setColapsada(false)}
          title="Expandir Barra Lateral"
          className="p-2 rounded bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-black transition-all border border-amber-500/40"
        >
          ▶
        </button>
        <div className="flex flex-col space-y-3 pt-2">
          <button onClick={() => { onChangeArea("creador"); setColapsada(false); }} title="Área Creador" className="p-2 text-base">👑</button>
          <button onClick={() => { onChangeArea("superuser"); setColapsada(false); }} title="Área Superuser" className="p-2 text-base">⚙️</button>
          <button onClick={() => { onChangeArea("usuario"); setColapsada(false); }} title="Área Operación" className="p-2 text-base">🥖</button>
        </div>
      </div>
    );
  }

  return (
    <aside className="w-64 bg-slate-950 border-r border-amber-500/20 flex flex-col h-full select-none text-xs font-mono transition-all duration-300">
      
      {/* CABECERA INDUSTRIAL CON NOMBRE DE MARCA Y BOTÓN DE COLAPSO */}
      <div className="p-3 border-b border-amber-500/20 bg-black/40 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span className="text-[11px] font-black text-amber-400 tracking-wider uppercase">SYNAPSE-X OS</span>
        </div>
        <button
          onClick={() => setColapsada(true)}
          title="Ocultar Barra"
          className="px-2 py-0.5 text-[10px] bg-slate-900 text-slate-400 hover:text-amber-400 rounded border border-slate-800 transition-colors"
        >
          ◀
        </button>
      </div>

      {/* SELECTOR DE ÁREAS CON ICONOS PUROS (👑 Creador | ⚙️ Superuser | 🥖 Operación) */}
      <div className="grid grid-cols-3 gap-1 p-2 bg-black/60 border-b border-amber-500/20">
        <button
          onClick={() => onChangeArea("creador")}
          title="Área Creador"
          className={`py-1.5 flex items-center justify-center text-base rounded transition-all ${
            areaActiva === "creador"
              ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20 font-bold"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800"
          }`}
        >
          👑
        </button>
        <button
          onClick={() => onChangeArea("superuser")}
          title="Área Superuser"
          className={`py-1.5 flex items-center justify-center text-base rounded transition-all ${
            areaActiva === "superuser"
              ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20 font-bold"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800"
          }`}
        >
          ⚙️
        </button>
        <button
          onClick={() => onChangeArea("usuario")}
          title="Área Operación"
          className={`py-1.5 flex items-center justify-center text-base rounded transition-all ${
            areaActiva === "usuario"
              ? "bg-purple-500 text-black shadow-lg shadow-purple-500/20 font-bold"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800"
          }`}
        >
          🥖
        </button>
      </div>

      {/* LISTA DE PORTALES DEL 0 AL 7 (FINOS Y RECTANGULARES) */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        <div className="text-[9px] text-amber-500/70 px-2 py-1 uppercase tracking-wider font-bold">
          Portales AC00 - AC07
        </div>
        {portalesCreador.map((portal) => {
          const activo = estacionActiva === portal.id;
          return (
            <button
              key={portal.id}
              onClick={() => setEstacionActiva(portal.id)}
              className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded transition-all text-left text-xs ${
                activo
                  ? "bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold shadow-sm"
                  : "bg-slate-900/40 text-slate-300 hover:bg-slate-900 border border-transparent"
              }`}
            >
              <span className="text-sm">{portal.icon}</span>
              <span className="truncate">{portal.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECCIÓN INFERIOR: MODO DE PANTALLA MINIMALISTA (SOLO ICONOS) Y BOTÓN DE ACTUALIZAR */}
      <div className="p-2 border-t border-amber-500/20 bg-black/80 space-y-2">
        
        {/* BOTÓN ACTUALIZAR SISTEMA FINO Y RECTANGULAR */}
        <button
          onClick={() => window.location.reload()}
          className="w-full py-1.5 bg-amber-500 text-black font-bold text-[10px] uppercase rounded hover:bg-amber-400 transition-all shadow-md text-center"
        >
          Actualizar Sistema
        </button>

        {/* MODO DE PANTALLA SOLO ICONOS */}
        <div className="flex items-center justify-between px-2 bg-slate-900/60 py-1 rounded border border-slate-800">
          <span className="text-[9px] text-slate-400 uppercase tracking-widest">Pantalla</span>
          <div className="flex space-x-1">
            <button title="Modo Claro" className="p-1 rounded bg-slate-800 hover:bg-amber-500 hover:text-black text-slate-300 transition-colors">
              ☀️
            </button>
            <button title="Modo Oscuro" className="p-1 rounded bg-slate-800 hover:bg-amber-500 hover:text-black text-slate-300 transition-colors">
              🌙
            </button>
            <button title="Modo Sistema" className="p-1 rounded bg-slate-800 hover:bg-amber-500 hover:text-black text-slate-300 transition-colors">
              💻
            </button>
          </div>
        </div>

        {/* ESTÉTICA LED Y CERRAR SESIÓN */}
        <div className="flex items-center justify-between pt-1 px-1">
          <div className="flex items-center space-x-1.5">
            <span className="text-[9px] text-amber-400">LED</span>
            <div className="flex space-x-1">
              <span className="h-2 w-2 rounded-full bg-amber-500 shadow-sm shadow-amber-500"></span>
              <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            </div>
          </div>
          <button
            onClick={handleCerrarSesion}
            className="text-[9px] text-red-400 hover:text-red-300 underline uppercase font-bold"
          >
            Salir
          </button>
        </div>

      </div>
    </aside>
  );
}