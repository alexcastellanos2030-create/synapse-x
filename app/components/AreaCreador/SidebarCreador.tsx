"use client";

// ============================================================================
// BARRA LATERAL DEL CREADOR — SYNAPSE-X OS (OSAI INDUSTRIAL)
// - Jerarquía: Nivel 10 exclusivo del Creador; hijas (Aleanny y Albany) como
//   Superusers en escala progresiva (Nivel 1 -> Nivel 9) por encima de
//   ingenieros y operadores.
// ============================================================================

import React, { useState, useEffect } from "react";

type AreaNavegacion = "usuario" | "superuser" | "creador" | "st";
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const guardado = localStorage.getItem(MODO_PANTALLA_KEY) as ModoPantallaSidebar | null;
    if (guardado && ["claro", "oscuro", "sistema"].includes(guardado)) {
      setModoPantalla(guardado);
      document.documentElement.setAttribute("data-synapse-theme", guardado);
      onChangeModoPantalla?.(guardado);
    }
  }, [onChangeModoPantalla]);

  const seleccionarModoPantalla = (modo: ModoPantallaSidebar) => {
    setModoPantalla(modo);
    if (typeof window !== "undefined") {
      localStorage.setItem(MODO_PANTALLA_KEY, modo);
      document.documentElement.setAttribute("data-synapse-theme", modo);
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
              onChangeArea("creador");
              setColapsada(false);
            }}
            title="Área Creador"
            className="p-2 text-base cursor-pointer rounded hover:bg-slate-900"
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
            className="p-2 text-base cursor-pointer rounded hover:bg-slate-900"
          >
            🛠️
          </button>
          <button
            type="button"
            onClick={() => {
              onChangeArea("usuario");
              setColapsada(false);
            }}
            title="Área Operación"
            className="p-2 text-base cursor-pointer rounded hover:bg-slate-900"
          >
            🏭
          </button>
          {esCreadorPrincipal && onAbrirAreaCodigos && (
            <button
              type="button"
              onClick={() => {
                onAbrirAreaCodigos();
                setColapsada(false);
              }}
              title="Área Códigos"
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
    <aside className="w-64 shrink-0 bg-slate-950 border-r border-amber-500/20 flex flex-col h-full select-none font-mono transition-all duration-300">
      {/* CABECERA CON NOMBRE DE MARCA Y BOTÓN DE COLAPSO */}
      <div className="p-3 border-b border-amber-500/20 bg-black/40 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
          <span className="text-xs font-black text-amber-400 tracking-wider uppercase">
            SYNAPSE-X OS
          </span>
        </div>
        <button
          type="button"
          onClick={() => setColapsada(true)}
          title="Ocultar Barra"
          className="px-2 py-0.5 text-xs bg-slate-900 text-slate-300 hover:text-amber-400 rounded border border-slate-800 transition-colors cursor-pointer"
        >
          ◀
        </button>
      </div>

      {/* BARRA DE ICONOS PUROS FIJA DEBAJO DE LA MARCA */}
      <div
        className={`grid ${
          esCreadorPrincipal && onAbrirAreaCodigos ? "grid-cols-4" : "grid-cols-3"
        } gap-1.5 p-2 bg-black/60 border-b border-amber-500/20 shrink-0`}
      >
        <button
          type="button"
          onClick={() => onChangeArea("creador")}
          title="Área Creador"
          aria-label="Área Creador"
          className={`py-1.5 flex items-center justify-center text-base rounded transition-all cursor-pointer ${
            areaActiva === "creador" && !verAreaCodigos
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
          aria-label="Área Servicio Técnico"
          className={`py-1.5 flex items-center justify-center text-base rounded transition-all cursor-pointer ${
            areaActiva === "st" || areaActiva === "superuser"
              ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20 font-bold"
              : "bg-slate-900 text-slate-300 hover:bg-slate-800"
          }`}
        >
          🛠️
        </button>

        <button
          type="button"
          onClick={() => onChangeArea("usuario")}
          title="Área Usuario"
          aria-label="Área Usuario"
          className={`py-1.5 flex items-center justify-center text-base rounded transition-all cursor-pointer ${
            areaActiva === "usuario"
              ? "bg-pink-500 text-black shadow-lg shadow-pink-500/20 font-bold"
              : "bg-slate-900 text-slate-300 hover:bg-slate-800"
          }`}
        >
          🏭
        </button>

        {esCreadorPrincipal && onAbrirAreaCodigos && (
          <button
            type="button"
            onClick={onAbrirAreaCodigos}
            title="Área Códigos"
            aria-label="Área Códigos"
            className={`py-1.5 flex items-center justify-center text-base rounded transition-all cursor-pointer ${
              verAreaCodigos
                ? "bg-amber-400 text-black shadow-lg shadow-amber-400/20 font-bold"
                : "bg-slate-900 text-amber-300 hover:bg-slate-800 border border-amber-500/30"
            }`}
          >
            🔐
          </button>
        )}
      </div>

      {/* LISTA DE PORTALES AC00 - AC07 CON TAMAÑO DE LETRA UNIFICADO */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        <div className="text-[11px] text-amber-400/90 px-2 py-1 uppercase tracking-wider font-bold">
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

      {/* SECCIÓN INFERIOR: BOTONERA DE REFRESCO/ACTUALIZACIÓN IDENTIFICADA + PANTALLA */}
      <div className="p-2.5 border-t border-amber-500/20 bg-black/80 space-y-1.5 shrink-0">
        <button
          type="button"
          disabled={ocupadoAccion}
          onClick={handleRefrescarVista}
          className="w-full py-1.5 bg-cyan-500 text-black font-bold text-[11px] uppercase rounded hover:bg-cyan-400 disabled:opacity-50 transition-all shadow-md text-center cursor-pointer"
        >
          Refrescar Vista
        </button>

        <button
          type="button"
          disabled={ocupadoAccion}
          onClick={handleRecargarBoveda}
          className="w-full py-1.5 bg-emerald-500 text-black font-bold text-[11px] uppercase rounded hover:bg-emerald-400 disabled:opacity-50 transition-all shadow-md text-center cursor-pointer"
        >
          Actualizar Bóveda
        </button>

        <button
          type="button"
          disabled={ocupadoAccion}
          onClick={handleActualizarSistema}
          className="w-full py-1.5 bg-amber-500 text-black font-bold text-[11px] uppercase rounded hover:bg-amber-400 disabled:opacity-50 transition-all shadow-md text-center cursor-pointer"
        >
          Actualizar Sistema
        </button>

        {/* SOLO LOS 3 ICONOS DE PANTALLA */}
        <div className="flex items-center justify-around bg-slate-900/70 py-1.5 px-2 rounded border border-slate-800">
          <button
            type="button"
            onClick={() => seleccionarModoPantalla("claro")}
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
            onClick={() => seleccionarModoPantalla("oscuro")}
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
            onClick={() => seleccionarModoPantalla("sistema")}
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
            <span className="text-[11px] font-bold text-amber-400">LED</span>
            <div className="flex space-x-1">
              <span className="h-2 w-2 rounded-full bg-amber-500 shadow-sm shadow-amber-500"></span>
              <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCerrarSesion}
            className="text-[11px] text-red-400 hover:text-red-300 underline uppercase font-bold cursor-pointer"
          >
            Salir
          </button>
        </div>
      </div>
    </aside>
  );
}