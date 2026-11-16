"use client";

import React, { useState } from "react";

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
  const [esteticaActual, setEsteticaActual] = useState<"oscuro" | "claro" | "sistema">("oscuro");

  const estacionesCreador = [
    { id: "AC01", label: "AC01 — Master Kernel", icon: "👑" },
    { id: "AC02", label: "AC02 — Gestión de Módulos", icon: "📊" },
    { id: "AC03", label: "AC03 — Laboratorio HMI", icon: "🧪" },
    { id: "AC04", label: "AC04 — Staff & Licencias", icon: "👥" },
    { id: "AC05", label: "AC05 — Diagnóstico & Logs", icon: "📡" },
    { id: "AC06", label: "AC06 — Despliegue & Git", icon: "⚙️" },
  ];

  const handleActualizarApp = () => {
    window.location.reload();
  };

  const cambiarTema = (modo: "oscuro" | "claro" | "sistema") => {
    setEsteticaActual(modo);
    if (modo === "claro") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
    alert(`🎨 Tema visual ajustado a: ${modo.toUpperCase()}`);
  };

  return (
    <aside className="w-72 bg-slate-950 border-r border-amber-500/30 flex flex-col h-full font-sans select-none shrink-0">
      
      {/* CABECERA DEL SIDEBAR */}
      <div className="p-4 border-b border-amber-500/20 bg-slate-900/50">
        <div className="flex items-center justify-between">
          <span className="px-2 py-0.5 bg-amber-500 text-black font-black text-[10px] rounded uppercase font-mono">
            OSAI KERNEL
          </span>
          <span className="text-[10px] font-mono text-emerald-400">● LIVE</span>
        </div>
        <h2 className="text-sm font-black text-amber-400 uppercase tracking-wider mt-2 font-mono">
          Synapse-X Creador
        </h2>
        <p className="text-[10px] text-slate-400 mt-0.5">Control Total del Sistema</p>
      </div>

      {/* SELECTOR DE ÁREAS PRINCIPALES */}
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
        <div className="text-[10px] font-mono font-bold text-amber-500/80 px-2 uppercase tracking-wider mb-2">
          Estaciones de Control (6)
        </div>
        
        {estacionesCreador.map((est) => (
          <button
            key={est.id}
            type="button"
            onClick={() => setEstacionActiva(est.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              estacionActiva === est.id
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-lg"
                : "text-slate-300 hover:bg-slate-900 border border-transparent"
            }`}
          >
            <span className="text-sm">{est.icon}</span>
            <span className="font-mono">{est.label}</span>
          </button>
        ))}
      </div>

      {/* ZONA INFERIOR: CONTROLES DE ESTÉTICA, ACTUALIZACIÓN Y SALIDA */}
      <div className="p-3 border-t border-slate-800 bg-slate-950 space-y-2.5">
        
        {/* BOTÓN DE ACTUALIZAR APP */}
        <button
          type="button"
          onClick={handleActualizarApp}
          className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow"
          title="Recargar la aplicación por completo"
        >
          <span>🔄</span> Actualizar Sistema
        </button>

        {/* CONTROLES DE ESTÉTICA Y TEMAS (Claro / Oscuro / Sistema) */}
        <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800 space-y-1.5">
          <div className="text-[10px] font-bold text-slate-400 flex items-center justify-between px-1">
            <span>🎨 Estética / Tema:</span>
            <span className="text-amber-400 uppercase text-[9px]">{esteticaActual}</span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <button
              type="button"
              onClick={() => cambiarTema("claro")}
              className={`py-1 rounded text-[10px] font-bold transition-all cursor-pointer border ${
                esteticaActual === "claro" ? "bg-amber-500 text-black border-amber-400" : "bg-black text-slate-400 border-slate-800"
              }`}
            >
              ☀️ Claro
            </button>
            <button
              type="button"
              onClick={() => cambiarTema("oscuro")}
              className={`py-1 rounded text-[10px] font-bold transition-all cursor-pointer border ${
                esteticaActual === "oscuro" ? "bg-amber-500 text-black border-amber-400" : "bg-black text-slate-400 border-slate-800"
              }`}
            >
              🌙 Oscuro
            </button>
            <button
              type="button"
              onClick={() => cambiarTema("sistema")}
              className={`py-1 rounded text-[10px] font-bold transition-all cursor-pointer border ${
                esteticaActual === "sistema" ? "bg-amber-500 text-black border-amber-400" : "bg-black text-slate-400 border-slate-800"
              }`}
            >
              💻 Sistema
            </button>
          </div>
        </div>

        {/* BOTÓN DE CERRAR SESIÓN */}
        <button
          type="button"
          onClick={handleCerrarSesion}
          className="w-full py-2 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>🚪</span> Cerrar Sesión (Root)
        </button>

      </div>

    </aside>
  );
}