"use client";

import React, { useState, useEffect } from "react";
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
  Sun,
  Moon,
  Monitor,
  LogOut,
  Home,
} from "lucide-react";

export type TipoUsuarioSistema = "prueba" | "real";
export type TemaSidebarUsuario = "claro" | "oscuro" | "sistema";

interface SidebarUsuarioProps {
  areaActiva: "usuario" | "superuser" | "st" | "creador" | "codigo" | string;
  onChangeArea: (area: any) => void;
  rolActivo: string;
  cedulaActiva?: string;
  esBovedaFamiliarActiva?: boolean;
  tipoUsuario?: TipoUsuarioSistema;
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
  tipoUsuario = "real",
  estacionActiva,
  setEstacionActiva,
  handleCerrarSesion,
}: SidebarUsuarioProps) {
  const [colapsado, setColapsado] = useState<boolean>(false);
  const [tema, setTema] = useState<TemaSidebarUsuario>("oscuro");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    if (tema === "claro") {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    } else if (tema === "oscuro") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      const prefiereOscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefiereOscuro);
      root.style.colorScheme = prefiereOscuro ? "dark" : "light";
    }
  }, [tema]);

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
      rolLimpio.includes("técnico") ||
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

  // Siempre mostramos los 4 iconos arriba; habilitados según perfil y jerarquía
  const botonesAreas = [
    {
      id: "usuario",
      label: "Área de Usuario",
      estacion: "AU00",
      icon: User,
      habilitado: true,
      activoClase: "bg-purple-600/35 border-purple-400/60 text-purple-200",
      libreClase: "bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-purple-300",
    },
    {
      id: "st",
      label: "Área de Servicio Técnico",
      estacion: "ST01",
      icon: Wrench,
      habilitado: esNucleoFamiliar || esTecnicoOIngeniero,
      activoClase: "bg-cyan-600/35 border-cyan-400/60 text-cyan-200",
      libreClase: "bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-cyan-400",
    },
    {
      id: "creador",
      label: "Área de Creador",
      estacion: "AC01",
      icon: Crown,
      habilitado: esNucleoFamiliar,
      activoClase: "bg-amber-500/30 border-amber-400/60 text-amber-200",
      libreClase: "bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-amber-400",
    },
    {
      id: "codigo",
      label: "Área de Código",
      estacion: "CD01",
      icon: Code2,
      habilitado: esNucleoFamiliar,
      activoClase: "bg-emerald-500/30 border-emerald-400/60 text-emerald-200",
      libreClase: "bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-emerald-400",
    },
  ];

  const botonesTema: {
    id: TemaSidebarUsuario;
    titulo: string;
    Icono: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: "claro", titulo: "Claro", Icono: Sun },
    { id: "oscuro", titulo: "Oscuro", Icono: Moon },
    { id: "sistema", titulo: "Sistema", Icono: Monitor },
  ];

  const estacionNormalizada = estacionActiva || "AU00";

  return (
    <aside
      className={`bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none transition-all duration-300 relative z-40 font-mono text-[8px] leading-tight ${
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
              <span className="font-bold text-[8px] leading-tight uppercase tracking-wider block text-white">
                ÁREA DE USUARIO · AU00
              </span>
              <span className="text-[8px] leading-tight text-slate-400 block truncate">
                Synapse-X OS-AI ({tipoUsuario})
              </span>
            </div>
          )}
        </div>
        {!colapsado && (
          <button
            type="button"
            onClick={() => setColapsado(true)}
            className="text-slate-500 hover:text-slate-300 p-1 cursor-pointer text-[8px] leading-tight"
            title="Contraer Barra"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* PARTE SUPERIOR: 4 BOTONES DE ÁREA (SOLO ICONOS) */}
      <div className="p-1.5 border-b border-slate-800 bg-slate-950/90 space-y-1">
        {!colapsado && (
          <span className="text-[8px] leading-tight uppercase tracking-widest text-slate-500 px-1 block">
            Áreas del Sistema
          </span>
        )}
        <div className={`grid gap-1 ${colapsado ? "grid-cols-1" : "grid-cols-4"}`}>
          {botonesAreas.map((btn) => {
            const IconBtn = btn.icon;
            const esActiva = areaActiva === btn.id;
            return (
              <button
                key={btn.id}
                type="button"
                disabled={!btn.habilitado}
                onClick={() => {
                  if (!btn.habilitado) return;
                  onChangeArea(btn.id);
                  setEstacionActiva(btn.estacion);
                }}
                title={btn.habilitado ? btn.label : `${btn.label} (Restringido)`}
                aria-label={btn.label}
                className={`h-7 rounded-lg flex items-center justify-center border transition-all text-[8px] leading-tight ${
                  esActiva
                    ? `${btn.activoClase} cursor-pointer`
                    : btn.habilitado
                    ? `${btn.libreClase} cursor-pointer`
                    : "bg-slate-950/60 border-slate-900 text-slate-600 opacity-40 cursor-not-allowed"
                }`}
              >
                <IconBtn className="w-3.5 h-3.5 shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      {/* NAVEGACIÓN DEL ÁREA DE USUARIO */}
      <div className="p-2 flex-1 overflow-y-auto space-y-1 text-[8px] leading-tight">
        {!colapsado && (
          <div className="px-1.5 py-1 rounded bg-slate-900/60 border border-slate-800/70 text-[8px] leading-tight text-slate-400">
            Dashboard principal AU00 conectado. Entorno de trabajo unificado activo.
          </div>
        )}

        {/* DASHBOARD PRINCIPAL AU00 */}
        <button
          type="button"
          onClick={() => {
            onChangeArea("usuario");
            setEstacionActiva("AU00");
          }}
          title="AU00 · Dashboard Principal"
          className={`w-full flex items-center gap-2 px-2 py-1 rounded-lg text-[8px] leading-tight font-semibold transition-all cursor-pointer text-left ${
            estacionNormalizada === "AU00"
              ? "bg-purple-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.3)]"
              : "bg-slate-900/80 hover:bg-slate-900 border border-slate-800 text-slate-200 hover:text-white"
          }`}
        >
          <Home
            className={`w-3.5 h-3.5 shrink-0 ${
              estacionNormalizada === "AU00" ? "text-white" : "text-purple-400"
            }`}
          />
          {!colapsado && <span className="truncate">AU00 · Dashboard Principal</span>}
        </button>

        {!colapsado && (
          <span className="text-[8px] leading-tight uppercase tracking-widest text-slate-500 px-1 pt-1 block">
            Roles & Estaciones
          </span>
        )}

        {/* BOTONERA DE 9 ROLES OPERATIVOS */}
        {rolesOperativos.map((item) => {
          const IconComponent = item.icon;
          const activo = estacionNormalizada === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onChangeArea("usuario");
                setEstacionActiva(item.id);
              }}
              title={`${item.id} · ${item.label}`}
              className={`w-full flex items-center gap-2 px-2 py-1 rounded-lg text-[8px] leading-tight font-semibold transition-all cursor-pointer text-left ${
                activo
                  ? "bg-purple-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.3)]"
                  : "bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              }`}
            >
              <IconComponent className={`w-3.5 h-3.5 shrink-0 ${activo ? "text-white" : item.color}`} />
              {!colapsado && (
                <span className="truncate">
                  {item.id} · {item.label}
                </span>
              )}
            </button>
          );
        })}

        {/* SEPARADOR HACIA LOS MÓDULOS EXISTENTES */}
        <div className="pt-1.5 mt-1.5 border-t border-slate-800/80 space-y-1">
          {!colapsado && (
            <span className="text-[8px] leading-tight uppercase tracking-widest text-slate-500 px-1 block mb-1">
              Módulos Base
            </span>
          )}

          <button
            type="button"
            onClick={() => {
              onChangeArea("usuario");
              setEstacionActiva("AU10");
            }}
            className={`w-full flex items-center gap-2 px-2 py-1 rounded-lg text-[8px] leading-tight font-semibold transition-all cursor-pointer text-left ${
              estacionNormalizada === "AU10"
                ? "bg-purple-600 text-white shadow-[0_0_12px_rgba(147,51,234,0.3)]"
                : "bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 shrink-0 text-purple-400" />
            {!colapsado && <span className="truncate">Portal AU01</span>}
          </button>

          <button
            type="button"
            onClick={() => {
              onChangeArea("usuario");
              setEstacionActiva("AU11");
            }}
            className={`w-full flex items-center gap-2 px-2 py-1 rounded-lg text-[8px] leading-tight font-bold transition-all cursor-pointer text-left ${
              estacionNormalizada === "AU11"
                ? "bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                : "bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5 shrink-0 text-amber-400" />
            {!colapsado && <span className="truncate">Registro de Pedido (AU02)</span>}
          </button>
        </div>
      </div>

      {/* PARTE INFERIOR: SOLO ICONOS DE TEMA (CLARO / OSCURO / SISTEMA) Y CERRAR SESIÓN */}
      <div className="p-2 border-t border-slate-800 bg-slate-950/90 space-y-1.5 text-[8px] leading-tight">
        <div
          className={`grid gap-1 bg-black/80 p-1 rounded-lg border border-slate-800/90 ${
            colapsado ? "grid-cols-1" : "grid-cols-3"
          }`}
        >
          {botonesTema.map(({ id, titulo, Icono }) => {
            const seleccionado = tema === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setTema(id)}
                title={titulo}
                aria-label={titulo}
                className={`h-7 rounded-md flex items-center justify-center transition-all cursor-pointer text-[8px] leading-tight ${
                  seleccionado
                    ? "bg-purple-500 text-white shadow-sm"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <Icono className="w-3.5 h-3.5 shrink-0" />
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleCerrarSesion}
          title="Cerrar sesión"
          aria-label="Cerrar sesión"
          className="w-full h-7 flex items-center justify-center gap-1.5 px-2 rounded-lg bg-red-950/50 hover:bg-red-900/70 border border-red-800/60 text-[8px] leading-tight font-bold text-red-300 transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5 shrink-0" />
          {!colapsado && <span className="truncate">CERRAR SESIÓN</span>}
        </button>
      </div>
    </aside>
  );
}