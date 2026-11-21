"use client";

import React, { useState, useEffect } from "react";

export type TipoUsuarioSistema = "prueba" | "real";

interface SidebarServicioTecnicoProps {
  areaActiva: "superuser" | "st" | string;
  onChangeArea: (nuevaArea: string) => void;
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

const MODO_PANTALLA_KEY = "synapse_modo_pantalla_v1";

export default function SidebarServicioTecnico({
  areaActiva,
  onChangeArea,
  rolActivo,
  cedulaActiva = "",
  esBovedaFamiliarActiva = false,
  tipoUsuario = "real",
  estacionActiva,
  setEstacionActiva,
  handleCerrarSesion,
}: SidebarServicioTecnicoProps) {
  const [colapsado, setColapsado] = useState(false);
  const [tema, setTema] = useState<"oscuro" | "claro" | "sistema">("oscuro");
  const [actualizando, setActualizando] = useState(false);

  const [ledRed] = useState<"green" | "yellow" | "red">("green");
  const [ledAI] = useState<"green" | "yellow" | "red">("green");
  const [ledAuth] = useState<"green" | "yellow" | "red">("green");

  const aplicarTemaGlobal = (modo: "oscuro" | "claro" | "sistema") => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    root.setAttribute("data-synapse-theme", modo);

    if (modo === "claro") {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    } else if (modo === "oscuro") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      const prefiereOscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefiereOscuro);
      root.style.colorScheme = prefiereOscuro ? "dark" : "light";
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const guardado = localStorage.getItem(MODO_PANTALLA_KEY) as "oscuro" | "claro" | "sistema" | null;
    if (guardado && ["claro", "oscuro", "sistema"].includes(guardado)) {
      setTema(guardado);
      aplicarTemaGlobal(guardado);
    } else {
      aplicarTemaGlobal("oscuro");
    }
  }, []);

  const seleccionarTema = (modo: "oscuro" | "claro" | "sistema") => {
    setTema(modo);
    if (typeof window !== "undefined") {
      localStorage.setItem(MODO_PANTALLA_KEY, modo);
      aplicarTemaGlobal(modo);
    }
  };

  const handleActualizar = () => {
    setActualizando(true);
    setTimeout(() => {
      window.location.reload();
    }, 400);
  };

  const cedulaLimpia = String(cedulaActiva || "").trim();
  const rolLimpio = String(rolActivo || "").toLowerCase().trim();

  const esNucleoFamiliar =
    Boolean(esBovedaFamiliarActiva) ||
    CEDULAS_NUCLEO_FAMILIAR.has(cedulaLimpia) ||
    rolLimpio === "creador" ||
    rolLimpio === "superuser";

  const esPersonalST =
    !esNucleoFamiliar &&
    (rolLimpio.includes("ingeniero") ||
      rolLimpio.includes("tecnico") ||
      rolLimpio.includes("técnico") ||
      rolLimpio === "st" ||
      rolLimpio === "servicio_tecnico");

  // Orden estándar: 1. Usuario (izq), 2. Servicio Técnico, 3. Creador, 4. Código (der)
  const todosBotonesAreas = [
    {
      id: "usuario",
      label: "Área de Usuario",
      icon: "👤",
      estacion: "AU01",
      habilitado: true,
    },
    {
      id: "st",
      label: "Área de Servicio Técnico",
      icon: "🛠️",
      estacion: "ST01",
      habilitado: true,
    },
    {
      id: "creador",
      label: "Área de Creador",
      icon: "👑",
      estacion: "AC01",
      habilitado: esNucleoFamiliar,
    },
    {
      id: "codigo",
      label: "Área de Código",
      icon: "💻",
      estacion: "CD01",
      habilitado: esNucleoFamiliar,
    },
  ];

  // Empleados: 1 icono (Usuario) | ST/Ingenieros: 2 iconos (Usuario, ST) | Núcleo Familiar: 4 iconos
  const botonesAreasVisibles = esNucleoFamiliar
    ? todosBotonesAreas
    : esPersonalST
    ? todosBotonesAreas.slice(0, 2)
    : todosBotonesAreas.slice(0, 1);

  const estacionesST = [
    { id: "ST01", label: "ST01: Panel Central ST" },
    { id: "ST02", label: "ST02: Diagnóstico de Red" },
    { id: "ST03", label: "ST03: Terminales Locales" },
    { id: "ST04", label: "ST04: Protocolos Enlace" },
    { id: "ST05", label: "ST05: Mantenimiento Core" },
    { id: "ST06", label: "ST06: Calibración Sensores" },
    { id: "ST07", label: "ST07: Núcleo Sistemas" },
    { id: "ST08", label: "ST08: Enrutamiento IP" },
    { id: "ST09", label: "ST09: Seguridad Avanzada" },
    { id: "ST10", label: "ST10: Auditoría Firewall" },
    { id: "ST11", label: "ST11: Arquitectura Global" },
    { id: "ST12", label: "ST12: Consola Maestra ST" },
  ];

  const getMaxEstacionesVisibles = () => {
    if (esNucleoFamiliar || rolLimpio.includes("ingeniero")) {
      return 12;
    }
    if (rolLimpio.includes("tecnico") || rolLimpio.includes("técnico") || rolLimpio === "tecnico") {
      return 6;
    }
    return esPersonalST ? 6 : 12;
  };

  const estacionesVisibles = estacionesST.slice(0, getMaxEstacionesVisibles());

  const handleSeleccionArea = (
    idArea: string,
    habilitado: boolean,
    estacionSugerida?: string
  ) => {
    if (!habilitado) return;
    if (estacionSugerida && idArea === "st") {
      setEstacionActiva(estacionSugerida);
    }
    onChangeArea(idArea);
  };

  const gridColsAreas = colapsado
    ? "grid-cols-1"
    : botonesAreasVisibles.length === 4
    ? "grid-cols-4"
    : botonesAreasVisibles.length === 2
    ? "grid-cols-2"
    : "grid-cols-1";

  return (
    <aside
      className={`h-full bg-slate-950 border-r border-slate-800/80 flex flex-col transition-all duration-300 select-none ${
        colapsado ? "w-14" : "w-56"
      }`}
    >
      {/* Cabecera compacta: Synapse-X y AREA DE SERVICIO TECNICO parpadeante neón */}
      <div className="p-2 border-b border-slate-800/80 flex items-center justify-between bg-black/40">
        {!colapsado && (
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-bold text-white tracking-wider truncate">
              Synapse-X
            </span>
            <span className="inline-flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.95)] animate-pulse truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)] shrink-0" />
              <span className="truncate">AREA DE SERVICIO TECNICO ({tipoUsuario})</span>
            </span>
          </div>
        )}
        <button
          type="button"
          onClick={() => setColapsado(!colapsado)}
          className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 shadow-[0_0_8px_rgba(34,211,238,0.25)] text-[10px] transition-colors cursor-pointer shrink-0"
          title={colapsado ? "Desplegar barra" : "Colapsar barra"}
        >
          ⚙️
        </button>
      </div>

      {/* Iconos de Áreas en orden fijo (Usuario -> Servicio Técnico -> Creador -> Código) */}
      <div className="p-1.5 border-b border-slate-800/80 bg-slate-950/90">
        <div className={`grid gap-1 ${gridColsAreas}`}>
          {botonesAreasVisibles.map((btn) => {
            const esActiva = areaActiva === btn.id;
            return (
              <button
                key={btn.id}
                type="button"
                disabled={!btn.habilitado}
                onClick={() => handleSeleccionArea(btn.id, btn.habilitado, btn.estacion)}
                title={btn.habilitado ? btn.label : `${btn.label} (Restringido)`}
                aria-label={btn.label}
                className={`h-7 rounded text-[11px] transition-all flex items-center justify-center ${
                  esActiva
                    ? "bg-cyan-500/25 text-cyan-300 border border-cyan-400/60 cursor-pointer"
                    : btn.habilitado
                    ? "bg-slate-900/80 text-slate-200 hover:bg-slate-800 border border-slate-800 cursor-pointer"
                    : "bg-slate-950/50 text-slate-600 border border-slate-900 opacity-40 cursor-not-allowed"
                }`}
              >
                <span className="leading-none">{btn.icon}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Estaciones ST y mensaje de bienvenida */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-1 custom-scrollbar">
        {!colapsado && (
          <div className="px-1.5 py-1 rounded bg-slate-900/60 border border-slate-800/70 text-[8px] text-slate-400 leading-tight">
            Bienvenido al entorno de trabajo unificado. La sesión se mantiene retenida de forma ininterrumpida.
          </div>
        )}

        {!colapsado && (
          <span className="block text-[8px] uppercase tracking-wider text-slate-500 px-1 pt-1">
            Estaciones ST ({estacionesVisibles.length})
          </span>
        )}

        {estacionesVisibles.map((est) => {
          const activo = estacionActiva === est.id;
          return (
            <button
              key={est.id}
              type="button"
              onClick={() => setEstacionActiva(est.id)}
              className={`w-full text-left px-2 py-1 rounded text-[9px] transition-all cursor-pointer flex items-center gap-1.5 ${
                activo
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "text-slate-400 hover:bg-slate-900/80 hover:text-slate-200 border border-transparent"
              }`}
              title={est.label}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0"></span>
              {!colapsado && <span className="truncate">{est.label}</span>}
            </button>
          );
        })}
      </div>

      {/* Contenedor inferior unificado */}
      <div className="mt-auto border-t border-slate-800/80 bg-slate-950 p-1.5 space-y-1.5">
        <button
          type="button"
          onClick={handleActualizar}
          disabled={actualizando}
          className="w-full flex items-center justify-center gap-1 px-1.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-[8px] text-slate-200 transition-all cursor-pointer"
        >
          <span className={actualizando ? "animate-spin inline-block" : ""}>🔄</span>
          {!colapsado && (
            <span className="truncate">
              {actualizando ? "SINCRONIZANDO..." : "ACTUALIZAR SISTEMA"}
            </span>
          )}
        </button>

        {!colapsado && (
          <div className="grid grid-cols-3 gap-1 bg-black/80 px-1 py-0.5 rounded border border-slate-800/90">
            <button
              type="button"
              onClick={() => seleccionarTema("claro")}
              title="Tema claro"
              aria-label="Tema claro"
              className={`py-0.5 rounded text-[10px] leading-none transition-all cursor-pointer flex items-center justify-center ${
                tema === "claro"
                  ? "bg-cyan-500 text-black"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              ☀️
            </button>
            <button
              type="button"
              onClick={() => seleccionarTema("oscuro")}
              title="Tema oscuro"
              aria-label="Tema oscuro"
              className={`py-0.5 rounded text-[10px] leading-none transition-all cursor-pointer flex items-center justify-center ${
                tema === "oscuro"
                  ? "bg-cyan-500 text-black"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🌙
            </button>
            <button
              type="button"
              onClick={() => seleccionarTema("sistema")}
              title="Tema del sistema"
              aria-label="Tema del sistema"
              className={`py-0.5 rounded text-[10px] leading-none transition-all cursor-pointer flex items-center justify-center ${
                tema === "sistema"
                  ? "bg-cyan-500 text-black"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              💻
            </button>
          </div>
        )}

        {/* Telemetría LED solo para núcleo familiar / creador */}
        {esNucleoFamiliar && !colapsado && (
          <div className="bg-black/80 border border-slate-800/80 rounded p-1 space-y-0.5">
            <span className="block text-[7px] uppercase tracking-wider text-slate-500">
              LED // Telemetría del Sistema
            </span>

            <div className="flex items-center gap-1">
              <div
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  ledRed === "green"
                    ? "bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.8)]"
                    : "bg-amber-400"
                }`}
              />
              <span className="text-[8px] text-slate-300 truncate">
                {ledRed === "green" ? "Red Planta: Estable OK" : "Red Planta: Advertencia"}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <div
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  ledAI === "green"
                    ? "bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.8)]"
                    : "bg-amber-400"
                }`}
              />
              <span className="text-[8px] text-slate-300 truncate">
                {ledAI === "green" ? "Motor AI-OS: Operativo" : "Motor AI-OS: Pausa"}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <div
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  ledAuth === "green"
                    ? "bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.8)]"
                    : "bg-amber-400"
                }`}
              />
              <span className="text-[8px] text-slate-300 truncate">
                {ledAuth === "green" ? "Seguridad Sesión: Segura" : "Seguridad Sesión: Alerta"}
              </span>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleCerrarSesion}
          className="w-full flex items-center justify-center gap-1 px-1.5 py-1 rounded bg-red-950/50 hover:bg-red-900/70 border border-red-800/60 text-[8px] text-red-300 transition-all cursor-pointer"
        >
          <span>⏻</span>
          {!colapsado && <span className="truncate">CERRAR SESIÓN</span>}
        </button>
      </div>
    </aside>
  );
}