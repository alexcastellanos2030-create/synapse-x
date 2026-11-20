"use client";

import React, { useState } from "react";
import {
  ChefHat,
  ChevronLeft,
  User,
  Wrench,
  Crown,
  Code2,
  LayoutDashboard,
  ClipboardList,
  ShieldCheck,
  FlaskConical,
  HardHat,
  Factory,
  Package,
  Warehouse,
  Truck,
  FileText,
} from "lucide-react";
import BotoneraInferior from "../BotoneraInferior";

interface SidebarUsuarioProps {
  areaActiva: "usuario" | "superuser" | "st" | "creador" | "codigo" | string;
  onChangeArea: (area: any) => void;
  rolActivo: string;
  cedulaActiva?: string;
  esBovedaFamiliarActiva?: boolean;
  estacionActiva: string;
  setEstacionActiva: (estacion: string) => void;
  handleCerrarSesion: () => void;
}

const CEDULAS_NUCLEO_FAMILIAR = new Set([
  "10433935",
  "279276795",
  "33323644",
]);

export default function SidebarUsuario({
  areaActiva,
  onChangeArea,
  rolActivo,
  cedulaActiva = "",
  esBovedaFamiliarActiva = false,
  estacionActiva,
  setEstacionActiva,
  handleCerrarSesion,
}: SidebarUsuarioProps) {
  const [colapsado, setColapsado] = useState<boolean>(false);
  const [acentoColor, setAcentoColor] = useState<"amber" | "emerald" | "orange">("amber");

  const cedulaLimpia = String(cedulaActiva || "").trim();
  const rolLimpio = String(rolActivo || "").toLowerCase().trim();

  const esNucleoFamiliar =
    Boolean(esBovedaFamiliarActiva) ||
    CEDULAS_NUCLEO_FAMILIAR.has(cedulaLimpia) ||
    rolLimpio === "creador" ||
    rolLimpio === "superuser";

  const esTecnicoOIngeniero =
    !esNucleoFamiliar &&
    (rolLimpio.includes("ingeniero") ||
      rolLimpio.includes("tecnico") ||
      rolLimpio === "st" ||
      rolLimpio === "servicio_tecnico");

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

  const botonesAreas = (() => {
    if (esNucleoFamiliar) {
      return [
        {
          id: "usuario",
          label: "Área de Usuario",
          estacion: "AU01",
          icon: User,
          clase: "bg-purple-600/30 border-purple-500/40 text-purple-300",
        },
        {
          id: "st",
          label: "Área de Servicio Técnico",
          estacion: "ST01",
          icon: Wrench,
          clase: "bg-slate-900 hover:bg-slate-800 border-slate-800 text-cyan-400",
        },
        {
          id: "creador",
          label: "Área de Creador",
          estacion: "AC01",
          icon: Crown,
          clase: "bg-slate-900 hover:bg-slate-800 border-slate-800 text-amber-400",
        },
        {
          id: "codigo",
          label: "Área de Código",
          estacion: "CD01",
          icon: Code2,
          clase: "bg-slate-900 hover:bg-slate-800 border-slate-800 text-emerald-400",
        },
      ];
    }

    if (esTecnicoOIngeniero) {
      return [
        {
          id: "usuario",
          label: "Área de Usuario",
          estacion: "AU01",
          icon: User,
          clase: "bg-purple-600/30 border-purple-500/40 text-purple-300",
        },
        {
          id: "st",
          label: "Área de Servicio Técnico",
          estacion: "ST01",
          icon: Wrench,
          clase: "bg-slate-900 hover:bg-slate-800 border-slate-800 text-cyan-400",
        },
      ];
    }

    // Personal de la empresa (Área de Usuario): solo el botón de Área de Usuario hacia la página principal
    return [
      {
        id: "usuario",
        label: "Área de Usuario",
        estacion: "AU01",
        icon: User,
        clase: "bg-purple-600/30 border-purple-500/40 text-purple-300",
      },
    ];
  })();

  return (
    <aside
      className={`bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none transition-all duration-300 relative z-40 font-mono ${
        colapsado ? "w-14" : "w-56"
      }`}
    >
      {/* CABECERA CON BOTÓN DE PANADERITO */}
      <div className="p-2 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
        <div className="flex items-center gap-2 overflow-hidden">
          <button
            type="button"
            onClick={() => setColapsado(!colapsado)}
            className="p-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 text-purple-400 transition-all cursor-pointer flex items-center justify-center shadow shrink-0 hover:bg-purple-500/20"
            title={colapsado ? "Desplegar Barra" : "Contraer Barra"}
          >
            <ChefHat className="w-3.5 h-3.5" />
          </button>
          {!colapsado && (
            <div className="leading-tight truncate">
              <span className="font-bold text-[10px] uppercase tracking-wider block text-white">
                ÁREA DE USUARIO
              </span>
              <span className="text-[8px] text-slate-400 block truncate">
                Synapse-X OS-AI
              </span>
            </div>
          )}
        </div>
        {!colapsado && (
          <button
            type="button"
            onClick={() => setColapsado(true)}
            className="text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* NAVEGACIÓN DEL ÁREA DE USUARIO */}
      <div className="p-2 flex-1 overflow-y-auto space-y-1">
        {!colapsado && (
          <span className="text-[8px] uppercase tracking-widest text-slate-500 px-1 block mb-1">
            Roles & Estaciones
          </span>
        )}

        {/* BOTONERA SUPERIOR DE 9 ROLES */}
        {rolesOperativos.map((item) => {
          const IconComponent = item.icon;
          const activo = estacionActiva === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setEstacionActiva(item.id)}
              title={item.label}
              className={`w-full flex items-center gap-2 px-2 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer text-left ${
                activo
                  ? "bg-purple-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.3)]"
                  : "bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              }`}
            >
              <IconComponent className={`w-3.5 h-3.5 shrink-0 ${activo ? "text-white" : item.color}`} />
              {!colapsado && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}

        {/* SEPARADOR HACIA LOS MÓDULOS EXISTENTES */}
        <div className="pt-1.5 mt-1.5 border-t border-slate-800/80 space-y-1">
          {!colapsado && (
            <span className="text-[8px] uppercase tracking-widest text-slate-500 px-1 block mb-1">
              Módulos Base
            </span>
          )}

          <button
            type="button"
            onClick={() => setEstacionActiva("AU10")}
            className={`w-full flex items-center gap-2 px-2 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer text-left ${
              estacionActiva === "AU10"
                ? "bg-purple-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.3)]"
                : "bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 shrink-0 text-purple-400" />
            {!colapsado && <span className="truncate">Portal AU01</span>}
          </button>

          <button
            type="button"
            onClick={() => setEstacionActiva("AU11")}
            className={`w-full flex items-center gap-2 px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer text-left ${
              estacionActiva === "AU11"
                ? "bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                : "bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            {!colapsado && <span className="truncate">Registro de Pedido (AU02)</span>}
          </button>
        </div>
      </div>

      {/* PARTE INFERIOR: BOTONES DE ÁREA SEGÚN PERFIL */}
      <div className="p-2 border-t border-slate-800 bg-slate-950/80 space-y-1">
        {!colapsado && (
          <span className="text-[8px] uppercase tracking-widest text-slate-500 px-1 block mb-1">
            {esNucleoFamiliar || esTecnicoOIngeniero ? "Cambio de Área" : "Acceso Principal"}
          </span>
        )}

        {botonesAreas.map((btn) => {
          const IconBtn = btn.icon;
          const esActiva = areaActiva === btn.id;
          return (
            <button
              key={btn.id}
              type="button"
              onClick={() => {
                onChangeArea(btn.id);
                setEstacionActiva(btn.estacion);
              }}
              className={`w-full flex items-center gap-2 px-2 py-1 rounded-lg text-[10px] transition-all cursor-pointer font-bold border ${
                btn.clase
              } ${esActiva ? "ring-1 ring-white/30" : ""}`}
              title={btn.label}
            >
              <IconBtn className="w-3.5 h-3.5 shrink-0" />
              {!colapsado && <span className="truncate">{btn.label}</span>}
            </button>
          );
        })}
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