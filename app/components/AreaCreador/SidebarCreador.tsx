"use client";

import React, { useState } from "react";
import { 
  Crown, ChevronLeft, 
  User, Settings, LogOut, LayoutDashboard 
} from "lucide-react";

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
  rolActivo,
  estacionActiva,
  setEstacionActiva,
  handleCerrarSesion,
}: SidebarCreadorProps) {
  const [colapsado, setColapsado] = useState<boolean>(false);

  const esCreadorOrSuper = rolActivo === "superuser";
  const esTecnicoOIngeniero = rolActivo === "ingeniero" || rolActivo === "tecnico";

  return (
    <aside 
      className={`bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none transition-all duration-300 relative z-40 ${
        colapsado ? "w-16" : "w-64"
      }`}
    >
      {/* CABECERA CON CORONA (COLLAPSE) */}
      <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
        <div className="flex items-center gap-2 overflow-hidden">
          <button
            onClick={() => setColapsado(!colapsado)}
            className="p-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 transition-all cursor-pointer flex items-center justify-center shadow-lg shrink-0 hover:bg-amber-500/20"
            title={colapsado ? "Desplegar Barra" : "Contraer Barra"}
          >
            <Crown className="w-4 h-4"/>
          </button>
          {!colapsado && (
            <div className="leading-tight truncate">
              <span className="font-extrabold text-[10px] uppercase tracking-wider block text-white">
                ÁREA DEL CREADOR
              </span>
              <span className="text-[9px] text-slate-400 block truncate">
                Synapse-X OS-AI
              </span>
            </div>
          )}
        </div>
        {!colapsado && (
          <button 
            onClick={() => setColapsado(true)} 
            className="text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4"/>
          </button>
        )}
      </div>

      {/* NAVEGACIÓN DEL ÁREA DEL CREADOR (AC) */}
      <div className="p-3 flex-1 overflow-y-auto space-y-1.5">
        {!colapsado && (
          <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 px-1 block mb-1">
            Gobernanza Root
          </span>
        )}
        <button
          type="button"
          onClick={() => setEstacionActiva("AC01")}
          className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
            estacionActiva === "AC01"
              ? "bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
              : "bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          }`}
        >
          <Crown className="w-4 h-4 shrink-0 text-amber-400"/>
          {!colapsado && <span className="truncate">Portal AC01</span>}
        </button>
      </div>

      {/* PARTE INFERIOR INAMOVIBLE: BOTONES DE CAMBIO DE ÁREA POR ROL */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 space-y-1.5">
        {!colapsado && (
          <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 px-1 block mb-1">
            Cambio de Área
          </span>
        )}

        {/* 1. Botón Creador */}
        {esCreadorOrSuper && (
          <button
            type="button"
            onClick={() => {
              onChangeArea("creador");
              setEstacionActiva("AC01");
            }}
            className="w-full flex items-center gap-2.5 p-2 rounded-lg text-xs transition-all cursor-pointer font-bold bg-amber-500/30 border border-amber-500/40 text-amber-300"
            title="Ir a Área del Creador (AC01)"
          >
            <Crown className="w-3.5 h-3.5 shrink-0"/>
            {!colapsado && <span className="truncate">Área de Creador</span>}
          </button>
        )}

        {/* 2. Botón Superuser */}
        {(esCreadorOrSuper || esTecnicoOIngeniero) && (
          <button
            type="button"
            onClick={() => {
              onChangeArea("superuser");
              setEstacionActiva("SU01");
            }}
            className="w-full flex items-center gap-2.5 p-2 rounded-lg text-xs transition-all cursor-pointer font-bold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400"
            title="Ir a Área de Superuser (SU01)"
          >
            <Settings className="w-3.5 h-3.5 shrink-0"/>
            {!colapsado && <span className="truncate">Área de Superuser</span>}
          </button>
        )}

        {/* 3. Botón Usuario */}
        <button
          type="button"
          onClick={() => {
            onChangeArea("usuario");
            setEstacionActiva("AU01");
          }}
          className="w-full flex items-center gap-2.5 p-2 rounded-lg text-xs transition-all cursor-pointer font-bold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-purple-400"
          title="Ir a Área de Usuario (AU01)"
        >
          <User className="w-3.5 h-3.5 shrink-0"/>
          {!colapsado && <span className="truncate">Área de Usuario</span>}
        </button>

        {/* Botón de Cierre de Sesión */}
        <button
          type="button"
          onClick={handleCerrarSesion}
          className="w-full flex items-center gap-2.5 p-2 rounded-lg bg-rose-950/40 hover:bg-rose-950/80 border border-rose-900/50 text-rose-400 transition-all cursor-pointer font-bold text-xs mt-1"
          title="Cerrar Sesión"
        >
          <LogOut className="w-3.5 h-3.5 shrink-0"/>
          {!colapsado && <span className="truncate">Cierre de Sesión</span>}
        </button>
      </div>
    </aside>
  );
}