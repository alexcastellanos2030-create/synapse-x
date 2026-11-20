"use client";

import React, { useState } from "react";

type AreaNavegacion = "usuario" | "superuser" | "creador" | "st";

interface SidebarCreadorProps {
  areaActiva: string;
  onChangeArea: (area: AreaNavegacion | string) => void;
  rolActivo?: string;
  estacionActiva: string;
  setEstacionActiva: (estacion: string) => void;
  handleCerrarSesion: () => void;
  onRefrescarEstado?: () => void;
}

export default function SidebarCreador({
  areaActiva,
  onChangeArea,
  estacionActiva,
  setEstacionActiva,
  handleCerrarSesion,
  onRefrescarEstado,
}: SidebarCreadorProps) {
  const [colapsada, setColapsada] = useState<boolean>(false);
  const [modoPantalla, setModoPantalla] = useState<"claro" | "oscuro" | "sistema">("oscuro");

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

  const handleActualizar = () => {
    if (onRefrescarEstado) {
      onRefrescarEstado();
    } else if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  if (colapsada) {
    return (
      <div className="w-12 bg-slate-950 border-r border-amber-500/20 flex flex-col items-center py-3 space-y-4 h-full select-none text-xs z-50 shrink-0">
        <button
          type="button"
          onClick={() => setColapsada(false)}
          title="Expandir Barra Lateral"
          className="p-2 rounded bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-black transition-all border border-amber-500/40 cursor-pointer"
        >
          ▶
        </button>
        <div className="flex flex-col space-y-3 pt-2">
          <button
            type="button"
            onClick={() => {
              onChangeArea("creador");
              setColapsada(false);
            }}
            title="Área Creador"
            className="p-2 text-base cursor-pointer"
          >
            👑
          </button>
          <button
            type="button"
            onClick={() => {
              onChangeArea("st");
              setColapsada(false);
            }}
            title="Área Servicio Técnico"
            className="p-2 text-base cursor-pointer"
          >
            ⚙️
          </button>
          <button
            type="button"
            onClick={() => {
              onChangeArea("usuario");
              setColapsada(false);
            }}
            title="Área Operación"
            className="p-2 text-base cursor-pointer"
          >
            🥖
          </button>
        </div>
      </div>
    );
  }

  return (
    <aside className="w-64 shrink-0 bg-slate-950 border-r border-amber-500/20 flex flex-col h-full select-none font-mono transition-all duration-300">
      {/* CABECERA INDUSTRIAL CON NOMBRE DE MARCA Y BOTÓN DE COLAPSO */}
      <div className="p-3 border-b border-amber-500/20 bg-black/40 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
          <span className="text-[11px] font-black text-amber-400 tracking-wider uppercase">
            SYNAPSE-X OS
          </span>
        </div>
        <button
          type="button"
          onClick={() => setColapsada(true)}
          title="Ocultar Barra"
          className="px-2 py-0.5 text-[11px] bg-slate-900 text-slate-300 hover:text-amber-400 rounded border border-slate-800 transition-colors cursor-pointer"
        >
          ◀
        </button>
      </div>

      {/* SELECTOR DE ÁREAS CON ICONOS PUROS (👑 Creador | ⚙️ Servicio Técnico | 🥖 Operación) */}
      <div className="grid grid-cols-3 gap-1.5 p-2 bg-black/60 border-b border-amber-500/20">
        <button
          type="button"
          onClick={() => onChangeArea("creador")}
          title="Área Creador"
          className={`py-1.5 flex items-center justify-center text-base rounded transition-all cursor-pointer ${
            areaActiva === "creador"
              ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20 font-bold"
              : "bg-slate-900 text-slate-300 hover:bg-slate-800"
          }`}
        >
          👑
        </button>
        <button
          type="button"
          onClick={() => onChangeArea("st")}
          title="Área Servicio Técnico"
          className={`py-1.5 flex items-center justify-center text-base rounded transition-all cursor-pointer ${
            areaActiva === "st" || areaActiva === "superuser"
              ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20 font-bold"
              : "bg-slate-900 text-slate-300 hover:bg-slate-800"
          }`}
        >
          ⚙️
        </button>
        <button
          type="button"
          onClick={() => onChangeArea("usuario")}
          title="Área Operación"
          className={`py-1.5 flex items-center justify-center text-base rounded transition-all cursor-pointer ${
            areaActiva === "usuario"
              ? "bg-purple-500 text-black shadow-lg shadow-purple-500/20 font-bold"
              : "bg-slate-900 text-slate-300 hover:bg-slate-800"
          }`}
        >
          🥖
        </button>
      </div>

      {/* LISTA DE PORTALES DEL 0 AL 7 */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        <div className="text-[10px] text-amber-400/90 px-2 py-1 uppercase tracking-wider font-bold">
          Portales AC00 - AC07
        </div>
        {portalesCreador.map((portal) => {
          const activo = estacionActiva === portal.id;
          return (
            <button
              key={portal.id}
              type="button"
              onClick={() => setEstacionActiva(portal.id)}
              className={`w-full flex items-center space-x-2 px-2.5 py-2 rounded transition-all text-left text-[11px] cursor-pointer ${
                activo
                  ? "bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold shadow-sm"
                  : "bg-slate-900/40 text-slate-200 hover:bg-slate-900 border border-transparent"
              }`}
            >
              <span className="text-sm shrink-0">{portal.icon}</span>
              <span className="truncate">{portal.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECCIÓN INFERIOR: ACTUALIZAR SISTEMA Y SOLO ICONOS DE PANTALLA */}
      <div className="p-2.5 border-t border-amber-500/20 bg-black/80 space-y-2">
        <button
          type="button"
          onClick={handleActualizar}
          className="w-full py-1.5 bg-amber-500 text-black font-bold text-[11px] uppercase rounded hover:bg-amber-400 transition-all shadow-md text-center cursor-pointer"
        >
          Actualizar Sistema
        </button>

        {/* SOLO LOS 3 ICONOS DE PANTALLA */}
        <div className="flex items-center justify-around bg-slate-900/70 py-1.5 px-2 rounded border border-slate-800">
          <button
            type="button"
            onClick={() => setModoPantalla("claro")}
            aria-label="Modo Claro"
            className={`px-2.5 py-1 rounded text-sm transition-colors cursor-pointer ${
              modoPantalla === "claro"
                ? "bg-amber-500 text-black font-bold"
                : "bg-slate-800 text-slate-300 hover:bg-amber-500 hover:text-black"
            }`}
          >
            ☀️
          </button>
          <button
            type="button"
            onClick={() => setModoPantalla("oscuro")}
            aria-label="Modo Oscuro"
            className={`px-2.5 py-1 rounded text-sm transition-colors cursor-pointer ${
              modoPantalla === "oscuro"
                ? "bg-amber-500 text-black font-bold"
                : "bg-slate-800 text-slate-300 hover:bg-amber-500 hover:text-black"
            }`}
          >
            🌙
          </button>
          <button
            type="button"
            onClick={() => setModoPantalla("sistema")}
            aria-label="Modo Sistema"
            className={`px-2.5 py-1 rounded text-sm transition-colors cursor-pointer ${
              modoPantalla === "sistema"
                ? "bg-amber-500 text-black font-bold"
                : "bg-slate-800 text-slate-300 hover:bg-amber-500 hover:text-black"
            }`}
          >
            💻
          </button>
        </div>

        {/* ESTÉTICA LED Y CERRAR SESIÓN */}
        <div className="flex items-center justify-between pt-1 px-1">
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] font-bold text-amber-400">LED</span>
            <div className="flex space-x-1">
              <span className="h-2 w-2 rounded-full bg-amber-500 shadow-sm shadow-amber-500"></span>
              <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCerrarSesion}
            className="text-[10px] text-red-400 hover:text-red-300 underline uppercase font-bold cursor-pointer"
          >
            Salir
          </button>
        </div>
      </div>
    </aside>
  );
}