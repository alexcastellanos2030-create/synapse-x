"use client";

import React, { useState, useEffect } from "react";

export type RolVistaBotonera =
  | "creador"
  | "hija"
  | "servicio_tecnico"
  | "empleado";

export type AcentoBotonera = "amber" | "emerald" | "orange";

interface BotoneraInferiorProps {
  onCerrarSesion: () => void;
  rolActual?: RolVistaBotonera;
  esCreador?: boolean;
  esHija?: boolean;
  acentoColor?: AcentoBotonera;
  onChangeAcento?: (color: AcentoBotonera) => void;
}

export default function BotoneraInferior({
  onCerrarSesion,
  rolActual = "creador",
  esCreador,
  esHija,
  acentoColor = "amber",
  onChangeAcento,
}: BotoneraInferiorProps) {
  const [tema, setTema] = useState<"oscuro" | "claro" | "sistema">("oscuro");
  const [actualizando, setActualizando] = useState(false);

  // Estados de los LEDs de telemetría
  const [ledRed] = useState<"green" | "yellow" | "red">("green");
  const [ledAI] = useState<"green" | "yellow" | "red">("green");
  const [ledAuth] = useState<"green" | "yellow" | "red">("green");

  // Acceso completo solo para Creador o Hijas; Servicio Técnico y Empleados ven modo simplificado
  const tieneVistaCompleta =
    typeof esCreador === "boolean" || typeof esHija === "boolean"
      ? Boolean(esCreador || esHija)
      : rolActual === "creador" || rolActual === "hija";

  useEffect(() => {
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

  const handleActualizar = () => {
    setActualizando(true);
    setTimeout(() => {
      window.location.reload();
    }, 400);
  };

  const getRedLabel = (color: "green" | "yellow" | "red") => {
    if (color === "green") return "Red de Planta: Estable OK";
    if (color === "yellow") return "Red de Planta: Alta Latencia";
    return "Red de Planta: Desconectado";
  };

  const getAILabel = (color: "green" | "yellow" | "red") => {
    if (color === "green") return "Motor AI-OS: Operativo";
    if (color === "yellow") return "Motor AI-OS: En Pausa";
    return "Motor AI-OS: Alerta de Script";
  };

  const getAuthLabel = (color: "green" | "yellow" | "red") => {
    if (color === "green") return "Seguridad/Sesión: Segura";
    if (color === "yellow") return "Seguridad/Sesión: Expirando";
    return "Seguridad/Sesión: Alerta Token";
  };

  const getLedClasses = (color: "green" | "yellow" | "red") => {
    if (color === "green") {
      return "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]";
    }
    if (color === "yellow") {
      return "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]";
    }
    return "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse";
  };

  return (
    <div className="mt-auto shrink-0 border-t border-slate-800/90 bg-slate-950/95 p-3 space-y-2.5 select-none">
      {/* 1. ACTUALIZAR SISTEMA */}
      <button
        type="button"
        onClick={handleActualizar}
        disabled={actualizando}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-mono font-semibold text-slate-200 transition-all cursor-pointer active:scale-95"
      >
        <span className={actualizando ? "animate-spin inline-block" : ""}>🔄</span>
        <span>{actualizando ? "SINCRONIZANDO..." : "ACTUALIZAR SISTEMA"}</span>
      </button>

      {/* 2. TEMA CLARO / OSCURO / SISTEMA */}
      <div className="space-y-1">
        <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 px-1">
          Modo de Pantalla
        </span>
        <div className="grid grid-cols-3 gap-1 bg-black p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setTema("claro")}
            className={`py-1.5 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
              tema === "claro"
                ? "bg-amber-500 text-black shadow"
                : "text-slate-400 hover:text-white"
            }`}
            title="Tema Claro"
          >
            ☀️ Claro
          </button>
          <button
            type="button"
            onClick={() => setTema("oscuro")}
            className={`py-1.5 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
              tema === "oscuro"
                ? "bg-amber-500 text-black shadow"
                : "text-slate-400 hover:text-white"
            }`}
            title="Tema Oscuro Industrial"
          >
            🌙 Oscuro
          </button>
          <button
            type="button"
            onClick={() => setTema("sistema")}
            className={`py-1.5 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
              tema === "sistema"
                ? "bg-amber-500 text-black shadow"
                : "text-slate-400 hover:text-white"
            }`}
            title="Automático según el dispositivo"
          >
            💻 Sist.
          </button>
        </div>
      </div>

      {/* 3. CONTROLES EXCLUSIVOS PARA CREADOR E HIJAS */}
      {tieneVistaCompleta && (
        <>
          <div className="bg-black/80 border border-slate-800/80 rounded-xl p-2 space-y-1.5">
            <span className="block text-[9px] font-mono uppercase tracking-wider text-slate-500 px-0.5">
              LED // Telemetría del Sistema
            </span>

            <div className="flex items-center gap-2 px-1">
              <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${getLedClasses(ledRed)}`} />
              <span className="text-[10px] font-mono text-slate-300 truncate">
                {getRedLabel(ledRed)}
              </span>
            </div>

            <div className="flex items-center gap-2 px-1">
              <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${getLedClasses(ledAI)}`} />
              <span className="text-[10px] font-mono text-slate-300 truncate">
                {getAILabel(ledAI)}
              </span>
            </div>

            <div className="flex items-center gap-2 px-1">
              <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${getLedClasses(ledAuth)}`} />
              <span className="text-[10px] font-mono text-slate-300 truncate">
                {getAuthLabel(ledAuth)}
              </span>
            </div>
          </div>

          {onChangeAcento && (
            <div className="flex items-center justify-between px-1 pt-0.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                Acento LED
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onChangeAcento("amber")}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-400 text-black cursor-pointer transition-all ${
                    acentoColor === "amber" ? "ring-2 ring-white scale-105" : "opacity-65 hover:opacity-100"
                  }`}
                  title="RB / Acento Ámbar"
                >
                  RB
                </button>
                <button
                  type="button"
                  onClick={() => onChangeAcento("emerald")}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-400 text-black cursor-pointer transition-all ${
                    acentoColor === "emerald" ? "ring-2 ring-white scale-105" : "opacity-65 hover:opacity-100"
                  }`}
                  title="AB / Acento Verde"
                >
                  AB
                </button>
                <button
                  type="button"
                  onClick={() => onChangeAcento("orange")}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-500 text-black cursor-pointer transition-all ${
                    acentoColor === "orange" ? "ring-2 ring-white scale-105" : "opacity-65 hover:opacity-100"
                  }`}
                  title="AS / Acento Naranja"
                >
                  AS
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* 4. CERRAR SESIÓN */}
      <button
        type="button"
        onClick={onCerrarSesion}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-950/50 hover:bg-red-900/70 border border-red-800/60 text-xs font-mono font-bold text-red-300 transition-all cursor-pointer"
      >
        <span>⏻</span>
        <span>CERRAR SESIÓN</span>
      </button>
    </div>
  );
}