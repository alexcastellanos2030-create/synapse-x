"use client";

import React, { useState, useEffect } from "react";

interface BotoneraInferiorProps {
  onCerrarSesion: () => void;
  acentoColor?: "amber" | "emerald" | "orange";
  onChangeAcento?: (color: "amber" | "emerald" | "orange") => void;
}

export default function BotoneraInferior({
  onCerrarSesion,
  acentoColor = "amber",
  onChangeAcento,
}: BotoneraInferiorProps) {
  const [tema, setTema] = useState<"oscuro" | "claro" | "sistema">("oscuro");
  const [actualizando, setActualizando] = useState(false);

  // Aplicar el tema real al documento HTML
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

  return (
    <div className="mt-auto shrink-0 border-t border-slate-800/90 bg-slate-950/95 p-3 space-y-2.5 select-none">
      {/* 1. BOTÓN DE ACTUALIZAR SISTEMA */}
      <button
        onClick={handleActualizar}
        disabled={actualizando}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-mono font-semibold text-slate-200 transition-all cursor-pointer active:scale-95"
      >
        <span className={actualizando ? "animate-spin inline-block" : ""}>🔄</span>
        <span>{actualizando ? "SINCRONIZANDO..." : "ACTUALIZAR SISTEMA"}</span>
      </button>

      {/* 2. SELECTORES DE TEMA: CLARO / OSCURO / SISTEMA */}
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

      {/* 3. CONTROL DE ESTÉTICA / ACENTO INDUSTRIAL */}
      {onChangeAcento && (
        <div className="flex items-center justify-between px-1 pt-0.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
            Estética LED
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onChangeAcento("amber")}
              className={`w-4 h-4 rounded-full bg-amber-400 cursor-pointer transition-transform ${
                acentoColor === "amber" ? "ring-2 ring-white scale-110" : "opacity-60 hover:opacity-100"
              }`}
              title="Acento Ámbar"
            />
            <button
              type="button"
              onClick={() => onChangeAcento("emerald")}
              className={`w-4 h-4 rounded-full bg-emerald-400 cursor-pointer transition-transform ${
                acentoColor === "emerald" ? "ring-2 ring-white scale-110" : "opacity-60 hover:opacity-100"
              }`}
              title="Acento Verde Neón"
            />
            <button
              type="button"
              onClick={() => onChangeAcento("orange")}
              className={`w-4 h-4 rounded-full bg-orange-500 cursor-pointer transition-transform ${
                acentoColor === "orange" ? "ring-2 ring-white scale-110" : "opacity-60 hover:opacity-100"
              }`}
              title="Acento Naranja Industrial"
            />
          </div>
        </div>
      )}

      {/* 4. BOTÓN DE CERRAR SESIÓN */}
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