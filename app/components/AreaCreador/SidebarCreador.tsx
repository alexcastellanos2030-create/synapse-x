"use client";

// ============================================================================
// BARRA LATERAL DEL CREADOR — SYNAPSE-X OS (OSAI INDUSTRIAL)
// - Jerarquía: Nivel 10 exclusivo del Creador; hijas (Aleanny y Albany) como
//   Superusers en escala progresiva (Nivel 1 -> Nivel 9) por encima de
//   ingenieros y operadores.
// ============================================================================

import React, { useState, useEffect } from "react";

type AreaNavegacion = "usuario" | "superuser" | "creador" | "st" | "codigo";
export type ModoPantallaSidebar = "claro" | "oscuro" | "sistema";

interface SidebarCreadorProps {
  areaActiva: string;
  onChangeArea: (area: AreaNavegacion | string) => void;
  rolActivo?: string;
  estacionActiva: string;
  setEstacionActiva: (estacion: string) => void;
  handleCerrarSesion: () => void;
  onRefrescarEstado?: () => void;
  onActualizarBoveda?: () => void;
  onChangeModoPantalla?: (modo: ModoPantallaSidebar) => void;
  esCreadorPrincipal?: boolean;
  verAreaCodigos?: boolean;
  onAbrirAreaCodigos?: () => void;
}

const MODO_PANTALLA_KEY = "synapse_modo_pantalla_v1";

export default function SidebarCreador({
  areaActiva,
  onChangeArea,
  estacionActiva,
  setEstacionActiva,
  handleCerrarSesion,
  onRefrescarEstado,
  onActualizarBoveda,
  onChangeModoPantalla,
  esCreadorPrincipal = true,
  verAreaCodigos = false,
  onAbrirAreaCodigos,
}: SidebarCreadorProps) {
  const [colapsada, setColapsada] = useState<boolean>(false);
  const [modoPantalla, setModoPantalla] = useState<ModoPantallaSidebar>("oscuro");
  const [ocupadoAccion, setOcupadoAccion] = useState<boolean>(false);

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

  const aplicarTemaEnDocumento = (modo: ModoPantallaSidebar) => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    root.setAttribute("data-synapse-theme", modo);

    const esOscuro =
      modo === "oscuro" ||
      (modo === "sistema" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    if (esOscuro) {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const guardado = localStorage.getItem(MODO_PANTALLA_KEY) as ModoPantallaSidebar | null;
    if (guardado && ["claro", "oscuro", "sistema"].includes(guardado)) {
      setModoPantalla(guardado);
      aplicarTemaEnDocumento(guardado);
      onChangeModoPantalla?.(guardado);
    } else {
      aplicarTemaEnDocumento("oscuro");
    }
  }, [onChangeModoPantalla]);

  const seleccionarModoPantalla = (modo: ModoPantallaSidebar) => {
    setModoPantalla(modo);
    if (typeof window !== "undefined") {
      localStorage.setItem(MODO_PANTALLA_KEY, modo);
      aplicarTemaEnDocumento(modo);
    }
    onChangeModoPantalla?.(modo);
  };

  const ejecutarConPausaCorta = (accion: () => void | Promise<void>) => {
    if (ocupadoAccion) return;
    setOcupadoAccion(true);
    Promise.resolve()
      .then(() => accion())
      .finally(() => {
        setTimeout(() => setOcupadoAccion(false), 400);
      });
  };

  const handleRefrescarVista = () => {
    ejecutarConPausaCorta(() => {
      onRefrescarEstado?.();
    });
  };

  const handleRecargarBoveda = () => {
    ejecutarConPausaCorta(() => {
      if (onActualizarBoveda) {
        onActualizarBoveda();
      } else {
        onRefrescarEstado?.();
      }
    });
  };

  const handleActualizarSistema = () => {
    ejecutarConPausaCorta(() => {
      onRefrescarEstado?.();
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    });
  };

  const handleIrAreaCodigo = () => {
    if (onAbrirAreaCodigos) {
      onAbrirAreaCodigos();
    } else {
      onChangeArea("codigo");
    }
  };

  if (colapsada) {
    return (
      <div className="w-12 bg-slate-950 border-r border-amber-500/20 flex flex-col items-center py-3 space-y-3 h-full select-none text-xs z-50 shrink-0">
        <button
          type="button"
          onClick={() => setColapsada(false)}
          title="Expandir Barra Lateral"
          className="p-2 rounded bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-black transition-all border border-amber-500/40 cursor-pointer"
        >
          ▶
        </button>
        <div className="flex flex-col space-y-2 pt-1">
          <button
            type="button"
            onClick={() => {
              onChangeArea("usuario");
              setColapsada(false);
            }}
            title="Área de Usuario"
            className="p-2 text-base cursor-pointer rounded hover:bg-slate-900"
          >
            🏭
          </button>
          <button
            type="button"
            onClick={() => {
              onChangeArea("st");
              setColapsada(false);
            }}
            title="Área de Servicio Técnico"
            className="p-2 text-base cursor-pointer rounded hover:bg-slate-900"
          >
            🛠️
          </button>
          <button
            type="button"
            onClick={() => {
              onChangeArea("creador");
              setColapsada(false);
            }}
            title="Área del Creador"
            className="p-2 text-base cursor-pointer rounded hover:bg-slate-900"
          >
            👑
          </button>
          {esCreadorPrincipal && (
            <button
              type="button"
              onClick={() => {
                handleIrAreaCodigo();
                setColapsada(false);
              }}
              title="Área de Código"
              className="p-2 text-base cursor-pointer rounded hover:bg-slate-900"
            >
              🔐
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <aside className="w-64 shrink-0 bg-slate-950 border-r border-amber-500/20 flex flex-col h-full select-none transition-all duration-300">
      {/* CABECERA: SYNAPSE-X Y AREA DEL CREADOR PARPADEANTE NEÓN */}
      <div className="p-3 border-b border-amber-500/20 bg-black/40 flex items-center justify-between gap-2">
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-white tracking-wider truncate">
            Synapse-X
          </span>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.95)] animate-pulse truncate">
            <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,1)] shrink-0" />
            <span className="truncate">AREA DEL CREADOR</span>
          </span>
        </div>
        <button
          type="button"
          onClick={() => setColapsada(true)}
          title="Ocultar Barra"
          className="px-2 py-0.5 text-xs bg-slate-900 text-slate-300 hover:text-amber-400 rounded border border-slate-800 transition-colors cursor-pointer shrink-0"
        >
          ◀
        </button>
      </div>

      {/* BARRA DE ICONOS EN ORDEN FIJO: 1. USUARIO | 2. SERVICIO TÉCNICO | 3. CREADOR | 4. CÓDIGO */}
      <div className="p-2 bg-black/60 border-b border-amber-500/20 shrink-0">
        <div
          className={`grid ${
            esCreadorPrincipal ? "grid-cols-4" : "grid-cols-3"
          } gap-1.5`}
        >
          {/* 1. Izquierda: Área de Usuario */}
          <button
            type="button"
            onClick={() => onChangeArea("usuario")}
            title="Área de Usuario"
            aria-label="Área de Usuario"
            className={`py-1.5 flex items-center justify-center text-base rounded transition-all cursor-pointer ${
              areaActiva === "usuario"
                ? "bg-pink-500 text-black shadow-lg shadow-pink-500/20"
                : "bg-slate-900 text-slate-300 hover:bg-slate-800"
            }`}
          >
            🏭
          </button>

          {/* 2. Segundo: Área de Servicio Técnico */}
          <button
            type="button"
            onClick={() => onChangeArea("st")}
            title="Área de Servicio Técnico"
            aria-label="Área de Servicio Técnico"
            className={`py-1.5 flex items-center justify-center text-base rounded transition-all cursor-pointer ${
              areaActiva === "st" || areaActiva === "superuser"
                ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20"
                : "bg-slate-900 text-slate-300 hover:bg-slate-800"
            }`}
          >
            🛠️
          </button>

          {/* 3. Tercero: Área del Creador */}
          <button
            type="button"
            onClick={() => onChangeArea("creador")}
            title="Área del Creador"
            aria-label="Área del Creador"
            className={`py-1.5 flex items-center justify-center text-base rounded transition-all cursor-pointer ${
              areaActiva === "creador" && !verAreaCodigos
                ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                : "bg-slate-900 text-slate-300 hover:bg-slate-800"
            }`}
          >
            👑
          </button>

          {/* 4. Derecha: Área de Código */}
          {esCreadorPrincipal && (
            <button
              type="button"
              onClick={handleIrAreaCodigo}
              title="Área de Código"
              aria-label="Área de Código"
              className={`py-1.5 flex items-center justify-center text-base rounded transition-all cursor-pointer ${
                verAreaCodigos || areaActiva === "codigo"
                  ? "bg-amber-400 text-black shadow-lg shadow-amber-400/20"
                  : "bg-slate-900 text-amber-300 hover:bg-slate-800 border border-amber-500/30"
              }`}
            >
              🔐
            </button>
          )}
        </div>
      </div>

      {/* LISTA DE PORTALES AC00 - AC07 CON TAMAÑO DE LETRA UNIFICADO */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        <div className="text-[11px] text-amber-400/90 px-2 py-1 uppercase tracking-wider">
          Portales AC00 - AC07
        </div>
        {portalesCreador.map((portal) => {
          const activo = estacionActiva === portal.id;
          return (
            <button
              key={portal.id}
              type="button"
              onClick={() => setEstacionActiva(portal.id)}
              className={`w-full flex items-center space-x-2 px-2.5 py-2 rounded transition-all text-left text-xs cursor-pointer ${
                activo
                  ? "bg-amber-500/20 border border-amber-500/50 text-amber-300 shadow-sm"
                  : "bg-slate-900/40 text-slate-200 hover:bg-slate-900 border border-transparent"
              }`}
            >
              <span className="text-sm shrink-0">{portal.icon}</span>
              <span className="truncate">{portal.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECCIÓN INFERIOR: 3 MICROBOTONES COMPACTOS (RB, AB, AS) + PANTALLA + LED / CERRAR SESIÓN */}
      <div className="p-2.5 border-t border-amber-500/20 bg-black/80 space-y-1.5 shrink-0">
        <div className="grid grid-cols-3 gap-1">
          <button
            type="button"
            disabled={ocupadoAccion}
            onClick={handleRefrescarVista}
            title="Refrescar Vista — Actualiza el estado y la vista actual sin recargar la página"
            aria-label="Refrescar Vista"
            className="h-6 px-1 bg-cyan-500 text-black text-[9px] uppercase rounded hover:bg-cyan-400 disabled:opacity-50 transition-all shadow-sm flex items-center justify-center gap-0.5 cursor-pointer"
          >
            <span className="text-[10px] leading-none">🔄</span>
            <span className="leading-none">RB</span>
          </button>

          <button
            type="button"
            disabled={ocupadoAccion}
            onClick={handleRecargarBoveda}
            title="Actualizar Bóveda — Sincroniza y recarga los datos de la bóveda"
            aria-label="Actualizar Bóveda"
            className="h-6 px-1 bg-emerald-500 text-black text-[9px] uppercase rounded hover:bg-emerald-400 disabled:opacity-50 transition-all shadow-sm flex items-center justify-center gap-0.5 cursor-pointer"
          >
            <span className="text-[10px] leading-none">🔒</span>
            <span className="leading-none">AB</span>
          </button>

          <button
            type="button"
            disabled={ocupadoAccion}
            onClick={handleActualizarSistema}
            title="Actualizar Sistema — Refresca el estado y recarga completamente el sistema"
            aria-label="Actualizar Sistema"
            className="h-6 px-1 bg-amber-500 text-black text-[9px] uppercase rounded hover:bg-amber-400 disabled:opacity-50 transition-all shadow-sm flex items-center justify-center gap-0.5 cursor-pointer"
          >
            <span className="text-[10px] leading-none">⚡</span>
            <span className="leading-none">AS</span>
          </button>
        </div>

        {/* SOLO LOS 3 ICONOS DE PANTALLA */}
        <div className="flex items-center justify-around bg-slate-900/70 py-1.5 px-2 rounded border border-slate-800">
          <button
            type="button"
            onClick={() => seleccionarModoPantalla("claro")}
            aria-label="Modo Claro"
            className={`px-2.5 py-1 rounded text-sm transition-colors cursor-pointer ${
              modoPantalla === "claro"
                ? "bg-amber-500 text-black"
                : "bg-slate-800 text-slate-300 hover:bg-amber-500 hover:text-black"
            }`}
          >
            ☀️
          </button>
          <button
            type="button"
            onClick={() => seleccionarModoPantalla("oscuro")}
            aria-label="Modo Oscuro"
            className={`px-2.5 py-1 rounded text-sm transition-colors cursor-pointer ${
              modoPantalla === "oscuro"
                ? "bg-amber-500 text-black"
                : "bg-slate-800 text-slate-300 hover:bg-amber-500 hover:text-black"
            }`}
          >
            🌙
          </button>
          <button
            type="button"
            onClick={() => seleccionarModoPantalla("sistema")}
            aria-label="Modo Sistema"
            className={`px-2.5 py-1 rounded text-sm transition-colors cursor-pointer ${
              modoPantalla === "sistema"
                ? "bg-amber-500 text-black"
                : "bg-slate-800 text-slate-300 hover:bg-amber-500 hover:text-black"
            }`}
          >
            💻
          </button>
        </div>

        {/* ESTÉTICA LED Y CERRAR SESIÓN */}
        <div className="flex items-center justify-between pt-1 px-1">
          <div className="flex items-center space-x-1.5">
            <span className="text-[11px] text-amber-400 font-bold">LED</span>
            <div className="flex space-x-1">
              <span className="h-2 w-2 rounded-full bg-amber-500 shadow-sm shadow-amber-500"></span>
              <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCerrarSesion}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-red-400 hover:text-red-300 uppercase cursor-pointer"
          >
            <span>⏻</span>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>
    </aside>
  );
}