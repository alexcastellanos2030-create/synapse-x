"use client";

import React, { useState } from "react";
import { 
  Settings, ChevronLeft, 
  User, Crown, LayoutDashboard 
} from "lucide-react";
import BotoneraInferior from "../BotoneraInferior";

interface SidebarSuperuserProps {
  areaActiva: "usuario" | "superuser" | "creador";
  onChangeArea: (area: "usuario" | "superuser" | "creador") => void;
  rolActivo: string;
  estacionActiva: string;
  setEstacionActiva: (estacion: string) => void;
  handleCerrarSesion: () => void;
}

export default function SidebarSuperuser({
  areaActiva,
  onChangeArea,
  rolActivo,
  estacionActiva,
  setEstacionActiva,
  handleCerrarSesion,
}: SidebarSuperuserProps) {
  const [colapsado, setColapsado] = useState<boolean>(false);
  const [acentoColor, setAcentoColor] = useState<"amber" | "emerald" | "orange">("emerald");

  // Verificación de roles para los botones inferiores
  const esCreadorOrSuper = rolActivo === "superuser" || rolActivo === "admin";

  return (
    <aside 
      className={`bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none transition-all duration-300 relative z-40 ${
        colapsado ? "w-16" : "w-64"
      }`}
    >
      {/* CABECERA CON BOTÓN DE ENGRANAJE (COLLAPSE) */}
      <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
        <div className="flex items-center gap-2 overflow-hidden">
          <button
            onClick={() => setColapsado(!colapsado)}
            className="p-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 transition-all cursor-pointer flex items-center justify-center shadow-lg shrink-0 hover:bg-cyan-500/20"
            title={colapsado ? "Desplegar Barra" : "Contraer Barra"}
          >
            <Settings className="w-4 h-4"/>
          </button>
          {!colapsado && (
            <div className="leading-tight truncate">
              <span className="font-extrabold text-[10px] uppercase tracking-wider block text-white">
                ÁREA DE SUPERUSER
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

      {/* NAVEGACIÓN DEL ÁREA DE SUPERUSER (SU) */}
      <div className="p-3 flex-1 overflow-y-auto space-y-1.5">
        {!colapsado && (
          <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 px-1 block mb-1">
            Gobernanza de Planta
          </span>
        )}
        <button
          type="button"
          onClick={() => setEstacionActiva("SU01")}
          className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
            estacionActiva === "SU01"
              ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              : "bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          }`}
        >
          <Settings className="w-4 h-4 shrink-0 text-cyan-400"/>
          {!colapsado && <span className="truncate">Portal SU01</span>}
        </button>
      </div>

      {/* PARTE INFERIOR INAMOVIBLE: BOTONES DE CAMBIO DE ÁREA POR ROL */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 space-y-1.5">
        {!colapsado && (
          <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 px-1 block mb-1">
            Cambio de Área
          </span>
        )}

        {/* 1. Botón Creador (Solo visible si es Creador / Superuser Root) */}
        {esCreadorOrSuper && (
          <button
            type="button"
            onClick={() => {
              onChangeArea("creador");
              setEstacionActiva("AC01");
            }}
            className="w-full flex items-center gap-2.5 p-2 rounded-lg text-xs transition-all cursor-pointer font-bold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-400"
            title="Ir a Área del Creador (AC01)"
          >
            <Crown className="w-3.5 h-3.5 shrink-0"/>
            {!colapsado && <span className="truncate">Área de Creador</span>}
          </button>
        )}

        {/* 2. Botón Superuser */}
        <button
          type="button"
          onClick={() => {
            onChangeArea("superuser");
            setEstacionActiva("SU01");
          }}
          className="w-full flex items-center gap-2.5 p-2 rounded-lg text-xs transition-all cursor-pointer font-bold bg-cyan-500/30 border border-cyan-500/40 text-cyan-300"
          title="Ir a Área de Superuser (SU01)"
        >
          <Settings className="w-3.5 h-3.5 shrink-0"/>
          {!colapsado && <span className="truncate">Área de Superuser</span>}
        </button>

        {/* 3. Botón Usuario (Visible para TODOS) */}
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
      </div>

      {/* BOTONERÁ INFERIOR COMPARTIDA (Actualizar, Temas y Estética LED) */}
      {!colapsado && (
        <BotoneraInferior
          onCerrarSesion={handleCerrarSesion}
          acentoColor={acentoColor}
          onChangeAcento={setAcentoColor}
        />
      )}
    </aside>
  );
}