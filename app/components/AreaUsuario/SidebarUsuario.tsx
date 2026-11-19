"use client";

import React, { useState } from "react";
import { 
  ChefHat, ChevronLeft, 
  User, Settings, Crown, LayoutDashboard, ClipboardList,
  ShieldCheck, FlaskConical, HardHat, Factory, Package, Warehouse, Truck, FileText
} from "lucide-react";
import BotoneraInferior from "../BotoneraInferior";

interface SidebarUsuarioProps {
  areaActiva: "usuario" | "superuser" | "creador";
  onChangeArea: (area: "usuario" | "superuser" | "creador") => void;
  rolActivo: string;
  estacionActiva: string;
  setEstacionActiva: (estacion: string) => void;
  handleCerrarSesion: () => void;
}

export default function SidebarUsuario({
  areaActiva,
  onChangeArea,
  rolActivo,
  estacionActiva,
  setEstacionActiva,
  handleCerrarSesion,
}: SidebarUsuarioProps) {
  const [colapsado, setColapsado] = useState<boolean>(false);
  const [acentoColor, setAcentoColor] = useState<"amber" | "emerald" | "orange">("amber");

  const esCreadorOrSuper = rolActivo === "superuser" || rolActivo === "admin";
  const esTecnicoOIngeniero = rolActivo === "ingeniero" || rolActivo === "tecnico";

  const rolesOperativos = [
    { id: "AU01", label: "Dueño/Adm", icon: ShieldCheck, color: "text-amber-400" },
    { id: "AU02", label: "ING de Alimentación", icon: FlaskConical, color: "text-cyan-400" },
    { id: "AU03", label: "Técnico Panadero", icon: ChefHat, color: "text-orange-400" },
    { id: "AU04", label: "Operador de Planta", icon: HardHat, color: "text-yellow-400" },
    { id: "AU05", label: "Producción", icon: Factory, color: "text-emerald-400" },
    { id: "AU06", label: "Inventario", icon: Package, color: "text-blue-400" },
    { id: "AU07", label: "Bodega/Stock", icon: Warehouse, color: "text-indigo-400" },
    { id: "AU08", label: "Despacho", icon: Truck, color: "text-rose-400" },
    { id: "AU09", label: "Protocolos", icon: FileText, color: "text-teal-400" },
  ];

  return (
    <aside 
      className={`bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none transition-all duration-300 relative z-40 ${
        colapsado ? "w-16" : "w-64"
      }`}
    >
      {/* CABECERA CON BOTÓN DE PANADERITO */}
      <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
        <div className="flex items-center gap-2 overflow-hidden">
          <button
            onClick={() => setColapsado(!colapsado)}
            className="p-2 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400 transition-all cursor-pointer flex items-center justify-center shadow-lg shrink-0 hover:bg-purple-500/20"
            title={colapsado ? "Desplegar Barra" : "Contraer Barra"}
          >
            <ChefHat className="w-4 h-4" />
          </button>
          {!colapsado && (
            <div className="leading-tight truncate">
              <span className="font-extrabold text-[10px] uppercase tracking-wider block text-white">
                ÁREA DE USUARIO
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
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* NAVEGACIÓN DEL ÁREA DE USUARIO */}
      <div className="p-3 flex-1 overflow-y-auto space-y-1.5">
        {!colapsado && (
          <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 px-1 block mb-1">
            Roles & Estaciones
          </span>
        )}

        {/* NUEVA BOTONERA SUPERIOR DE 9 ROLES */}
        {rolesOperativos.map((item) => {
          const IconComponent = item.icon;
          const activo = estacionActiva === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setEstacionActiva(item.id)}
              title={item.label}
              className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
                activo
                  ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                  : "bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              }`}
            >
              <IconComponent className={`w-4 h-4 shrink-0 ${activo ? "text-white" : item.color}`} />
              {!colapsado && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}

        {/* SEPARADOR HACIA LOS MÓDULOS EXISTENTES */}
        <div className="pt-2 mt-2 border-t border-slate-800/80 space-y-1.5">
          {!colapsado && (
            <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 px-1 block mb-1">
              Módulos Base
            </span>
          )}

          {/* Portal AU01 Base */}
          <button
            type="button"
            onClick={() => setEstacionActiva("AU10")}
            className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
              estacionActiva === "AU10"
                ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                : "bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0 text-purple-400" />
            {!colapsado && <span className="truncate">Portal AU01</span>}
          </button>

          {/* Portal Registro de Pedido */}
          <button
            type="button"
            onClick={() => setEstacionActiva("AU11")}
            className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
              estacionActiva === "AU11"
                ? "bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)] font-black"
                : "bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            <ClipboardList className="w-4 h-4 shrink-0 text-amber-400" />
            {!colapsado && <span className="truncate">Registro de Pedido (AU02)</span>}
          </button>
        </div>
      </div>

      {/* PARTE INFERIOR: CAMBIO DE ÁREA */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/80 space-y-1.5">
        {!colapsado && (
          <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500 px-1 block mb-1">
            Cambio de Área
          </span>
        )}

        {esCreadorOrSuper && (
          <button
            type="button"
            onClick={() => {
              onChangeArea("creador");
              setEstacionActiva("AC00");
            }}
            className="w-full flex items-center gap-2.5 p-2 rounded-lg text-xs transition-all cursor-pointer font-bold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-400"
            title="Área de Creador"
          >
            <Crown className="w-3.5 h-3.5 shrink-0" />
            {!colapsado && <span className="truncate">Área de Creador</span>}
          </button>
        )}

        {(esCreadorOrSuper || esTecnicoOIngeniero) && (
          <button
            type="button"
            onClick={() => {
              onChangeArea("superuser");
              setEstacionActiva("SU01");
            }}
            className="w-full flex items-center gap-2.5 p-2 rounded-lg text-xs transition-all cursor-pointer font-bold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400"
            title="Área de Superuser"
          >
            <Settings className="w-3.5 h-3.5 shrink-0" />
            {!colapsado && <span className="truncate">Área de Superuser</span>}
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            onChangeArea("usuario");
            setEstacionActiva("AU01");
          }}
          className="w-full flex items-center gap-2.5 p-2 rounded-lg text-xs transition-all cursor-pointer font-bold bg-purple-600/30 border border-purple-500/40 text-purple-300"
          title="Área de Usuario"
        >
          <User className="w-3.5 h-3.5 shrink-0" />
          {!colapsado && <span className="truncate">Área de Usuario</span>}
        </button>
      </div>

      {/* BOTONERA INFERIOR UNIFICADA */}
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