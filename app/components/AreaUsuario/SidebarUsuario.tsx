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
  RefreshCw,
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
  onRefrescarEstado?: () => void;
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
  onRefrescarEstado,
}: SidebarUsuarioProps) {
  const [colapsado, setColapsado] = useState<boolean>(false);
  const [tema, setTema] = useState<TemaSidebarUsuario>("oscuro");
  const [sincronizando, setSincronizando] = useState<boolean>(false);

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

  // Solo el núcleo familiar ve los 4 botones; técnicos/ingenieros ven 2; empleados ven 1
  const botonesAreasVisibles = (() => {
    const todos = [
      {
        id: "usuario",
        label: "Área de Usuario",
        estacion: "AU00",
        icon: User,
        activoClase: "bg-purple-600/35 border-purple-400/60 text-purple-200",
        libreClase: "bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-purple-300",
      },
      {
        id: "st",
        label: "Servicio Técnico",
        estacion: "ST01",
        icon: Wrench,
        activoClase: "bg-cyan-600/35 border-cyan-400/60 text-cyan-200",
        libreClase: "bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-cyan-400",
      },
      {
        id: "creador",
        label: "Área de Creador",
        estacion: "AC01",
        icon: Crown,
        activoClase: "bg-amber-500/30 border-amber-400/60 text-amber-200",
        libreClase: "bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-amber-400",
      },
      {
        id: "codigo",
        label: "Área de Código",
        estacion: "CD01",
        icon: Code2,
        activoClase: "bg-emerald-500/30 border-emerald-400/60 text-emerald-200",
        libreClase: "bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-emerald-400",
      },
    ];

    if (esNucleoFamiliar) return todos;
    if (esTecnicoOIngeniero) return todos.slice(0, 2);
    return todos.slice(0, 1);
  })();

  const rolesOperativos = [
    { id: "AU01", label: "Dueño/Adm", icon: ShieldCheck, color: "text-amber-400" },
    { id: "AU02", label: "ING Alimentación", icon: FlaskConical, color: "text-cyan-400" },
    { id: "AU03", label: "Técnico Panadero", icon: ChefHat, color: "text-orange-400" },
    { id: "AU04", label: "Operador Planta", icon: HardHat, color: "text-yellow-400" },
    { id: "AU05", label: "Producción", icon: Factory, color: "text-emerald-400" },
    { id: "AU06", label: "Inventario", icon: Package, color: "text-blue-400" },
    { id: "AU07", label: "Bodega/Stock", icon: Warehouse, color: "text-indigo-400" },
    { id: "AU08", label: "Despacho", icon: Truck, color: "text-rose-400" },
    { id: "AU09", label: "Protocolos", icon: FileText, color: "text-teal-400" },
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

  const handleActualizar = () => {
    setSincronizando(true);
    if (onRefrescarEstado) {
      onRefrescarEstado();
    }
    setTimeout(() => {
      setSincronizando(false);
    }, 350);
  };

  const estacionNormalizada = estacionActiva || "AU00";
  const gridColsAreas =
    botonesAreasVisibles.length === 4
      ? "grid-cols-4"
      : botonesAreasVisibles.length === 2
      ? "grid-cols-2"
      : "grid-cols-1";

  return (
    <aside
      className={`bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none transition-all duration-300 relative z-40 font-mono text-[5px] leading-none ${
        colapsado ? "w-12" : "w-52"
      }`}
    >
      {/* CABECERA COMPACTA */}
      <div className="px-2 py-1.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <button
            type="button"
            onClick={() => setColapsado(!colapsado)}
            className="p-1 rounded border border-purple-500/30 bg-purple-500/10 text-purple-400 transition-all cursor-pointer flex items-center justify-center shrink-0 hover:bg-purple-500/20"
            title={colapsado ? "Desplegar barra" : "Contraer barra"}
          >
            <ChefHat className="w-3 h-3" />
          </button>
          {!colapsado && (
            <div className="truncate text-[5px] leading-tight">
              <span className="font-semibold text-white block truncate">
                ÁREA USUARIO · AU00
              </span>
              <span className="text-[5px] text-slate-400 block truncate">
                {tipoUsuario}
              </span>
            </div>
          )}
        </div>
        {!colapsado && (
          <button
            type="button"
            onClick={() => setColapsado(true)}
            className="text-slate-500 hover:text-slate-300 p-0.5 cursor-pointer text-[5px] leading-none"
            title="Contraer barra"
          >
            <ChevronLeft className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* PARTE SUPERIOR: MICROICONOS DE ÁREAS (SOLO ICONO, SIN TEXTO) */}
      <div className="px-1.5 py-1 border-b border-slate-800 bg-slate-950/90">
        <div className={`grid gap-1 ${colapsado ? "grid-cols-1" : gridColsAreas}`}>
          {botonesAreasVisibles.map((btn) => {
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
                title={btn.label}
                aria-label={btn.label}
                className={`h-6 rounded flex items-center justify-center border transition-all cursor-pointer ${
                  esActiva ? btn.activoClase : btn.libreClase
                }`}
              >
                <IconBtn className="w-3 h-3 shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      {/* NAVEGACIÓN DE ESTACIONES Y MÓDULOS */}
      <div className="p-1.5 flex-1 overflow-y-auto space-y-0.5 text-[5px] leading-tight">
        <button
          type="button"
          onClick={() => {
            onChangeArea("usuario");
            setEstacionActiva("AU00");
          }}
          title="AU00 · Dashboard"
          className={`w-full flex items-center gap-1.5 px-1.5 py-1 rounded transition-all cursor-pointer text-left text-[5px] leading-tight ${
            estacionNormalizada === "AU00"
              ? "bg-purple-600 text-white font-semibold"
              : "bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 text-slate-300 hover:text-white"
          }`}
        >
          <Home className="w-3 h-3 shrink-0 text-purple-300" />
          {!colapsado && <span className="truncate">AU00 · Dashboard</span>}
        </button>

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
              className={`w-full flex items-center gap-1.5 px-1.5 py-1 rounded transition-all cursor-pointer text-left text-[5px] leading-tight ${
                activo
                  ? "bg-purple-600 text-white font-semibold"
                  : "bg-slate-900/50 hover:bg-slate-900 border border-slate-800/70 text-slate-300 hover:text-white"
              }`}
            >
              <IconComponent className={`w-3 h-3 shrink-0 ${activo ? "text-white" : item.color}`} />
              {!colapsado && (
                <span className="truncate">
                  {item.id} · {item.label}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-1 mt-1 border-t border-slate-800/80 space-y-0.5">
          <button
            type="button"
            onClick={() => {
              onChangeArea("usuario");
              setEstacionActiva("AU10");
            }}
            title="Portal AU01"
            className={`w-full flex items-center gap-1.5 px-1.5 py-1 rounded transition-all cursor-pointer text-left text-[5px] leading-tight ${
              estacionNormalizada === "AU10"
                ? "bg-purple-600 text-white font-semibold"
                : "bg-slate-900/50 hover:bg-slate-900 border border-slate-800/70 text-slate-300 hover:text-white"
            }`}
          >
            <LayoutDashboard className="w-3 h-3 shrink-0 text-purple-400" />
            {!colapsado && <span className="truncate">Portal AU01</span>}
          </button>

          <button
            type="button"
            onClick={() => {
              onChangeArea("usuario");
              setEstacionActiva("AU11");
            }}
            title="Registro Pedido (AU02)"
            className={`w-full flex items-center gap-1.5 px-1.5 py-1 rounded transition-all cursor-pointer text-left text-[5px] leading-tight ${
              estacionNormalizada === "AU11"
                ? "bg-amber-500 text-slate-950 font-semibold"
                : "bg-slate-900/50 hover:bg-slate-900 border border-slate-800/70 text-slate-300 hover:text-white"
            }`}
          >
            <ClipboardList className="w-3 h-3 shrink-0 text-amber-400" />
            {!colapsado && <span className="truncate">Registro Pedido (AU02)</span>}
          </button>
        </div>
      </div>

      {/* PARTE INFERIOR MINIMIZADA: MICROICONOS DE TEMA + MICROBOTONES ACTUALIZAR Y CERRAR SESIÓN */}
      <div className="p-1.5 border-t border-slate-800 bg-slate-950/95 space-y-1 text-[5px] leading-tight">
        <div
          className={`grid gap-1 bg-black/80 p-0.5 rounded border border-slate-800/90 ${
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
                className={`h-5 rounded flex items-center justify-center transition-all cursor-pointer ${
                  seleccionado
                    ? "bg-purple-500 text-white"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <Icono className="w-3 h-3 shrink-0" />
              </button>
            );
          })}
        </div>

        <div className={`grid gap-1 ${colapsado ? "grid-cols-1" : "grid-cols-2"}`}>
          <button
            type="button"
            onClick={handleActualizar}
            title="Actualizar"
            aria-label="Actualizar"
            className="h-6 px-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 flex items-center justify-center gap-1 transition-all cursor-pointer text-[5px] leading-tight"
          >
            <RefreshCw className={`w-3 h-3 shrink-0 ${sincronizando ? "animate-spin" : ""}`} />
            {!colapsado && <span className="truncate">Refrescar</span>}
          </button>

          <button
            type="button"
            onClick={handleCerrarSesion}
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
            className="h-6 px-1.5 rounded bg-red-950/50 hover:bg-red-900/70 border border-red-800/60 text-red-300 flex items-center justify-center gap-1 transition-all cursor-pointer text-[5px] leading-tight"
          >
            <LogOut className="w-3 h-3 shrink-0" />
            {!colapsado && <span className="truncate">Salir</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}