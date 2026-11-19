"use client";

import React, { useState, useEffect } from "react";

interface SidebarServicioTecnicoProps {
  areaActiva: "superuser" | "st" | string;
  onChangeArea: (nuevaArea: string) => void;
  rolActivo: string;
  estacionActiva: string;
  setEstacionActiva: (estacion: string) => void;
  handleCerrarSesion: () => void;
}

export default function SidebarServicioTecnico({
  areaActiva,
  onChangeArea,
  rolActivo,
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
    const rol = rolActivo.toLowerCase();
    if (rol === "creador" || rol === "superuser" || rol === "admin" || rol.includes("ingeniero")) {
      return 12;
    }
    if (rol.includes("tecnico") || rol === "tecnico") {
      return 6;
    }
    return 12;
  };

  const estacionesVisibles = estacionesST.slice(0, getMaxEstacionesVisibles());

  return (
    <aside
      className={`h-full bg-slate-950 border-r border-slate-800/80 flex flex-col transition-all duration-300 select-none ${
        colapsado ? "w-16" : "w-60"
      }`}
    >
      <div className="p-2.5 border-b border-slate-800/80 flex items-center justify-between bg-black/40">
        {!colapsado && (
          <div className="flex flex-col">
            <span className="font-mono text-xs font-bold text-cyan-400 tracking-wider">
              SYNAPSE-X OS
            </span>
            <span className="font-mono text-[9px] text-slate-400 tracking-tight">
              Área de Servicio Técnico
            </span>
          </div>
        )}
        <button
          onClick={() => setColapsado(!colapsado)}
          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer mx-auto"
          title={colapsado ? "Desplegar barra" : "Colapsar barra"}
        >
          ⚙️
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {!colapsado && (
          <span className="block text-[9px] font-mono uppercase tracking-wider text-slate-500 px-1 mb-1">
            Estaciones ST ({estacionesVisibles.length})
          </span>
        )}

        {estacionesVisibles.map((est) => {
          const activo = estacionActiva === est.id;
          return (
            <button
              key={est.id}
              onClick={() => setEstacionActiva(est.id)}
              className={`w-full text-left px-2 py-1 rounded-lg font-mono text-[10px] transition-all cursor-pointer flex items-center gap-2 ${
                activo
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-sm"
                  : "text-slate-400 hover:bg-slate-900/80 hover:text-slate-200 border border-transparent"
              }`}
              title={est.label}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0"></span>
              {!colapsado && <span className="truncate">{est.label}</span>}
            </button>
          );
        })}

        <div className="pt-2 mt-2 border-t border-slate-800/60">
          <button
            onClick={() => onChangeArea("usuario")}
            className="w-full text-left px-2 py-1 rounded-lg font-mono text-[10px] text-purple-400 hover:bg-purple-950/30 border border-purple-900/40 transition-all cursor-pointer flex items-center gap-2"
            title="Cambiar a Área de Usuario"
          >
            <span>🔄</span>
            {!colapsado && <span className="truncate">Área de Usuario</span>}
          </button>
        </div>
      </div>

      <div className="mt-auto border-t border-slate-800/80 bg-slate-950 p-2 space-y-2">
        <button
          onClick={handleActualizar}
          disabled={actualizando}
          className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-[10px] font-mono font-semibold text-slate-200 transition-all cursor-pointer"
        >
          <span className={actualizando ? "animate-spin inline-block" : ""}>🔄</span>
          {!colapsado && <span>{actualizando ? "SINCRONIZANDO..." : "ACTUALIZAR SISTEMA"}</span>}
        </button>

        {!colapsado && (
          <div className="grid grid-cols-3 gap-1 bg-black p-1 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setTema("claro")}
              className={`py-1 rounded text-[9px] font-mono font-bold transition-all cursor-pointer ${
                tema === "claro" ? "bg-cyan-500 text-black shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              ☀️ Claro
            </button>
            <button
              type="button"
              onClick={() => setTema("oscuro")}
              className={`py-1 rounded text-[9px] font-mono font-bold transition-all cursor-pointer ${
                tema === "oscuro" ? "bg-cyan-500 text-black shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              🌙 Oscuro
            </button>
            <button
              type="button"
              onClick={() => setTema("sistema")}
              className={`py-1 rounded text-[9px] font-mono font-bold transition-all cursor-pointer ${
                tema === "sistema" ? "bg-cyan-500 text-black shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              💻 Sist.
            </button>
          </div>
        )}

        {!colapsado && (
          <div className="bg-black/80 border border-slate-800/80 rounded-lg p-1.5 space-y-1">
            <span className="block text-[8px] font-mono uppercase tracking-wider text-slate-500">
              Telemetría del Sistema
            </span>
            
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full transition-all ${ledRed === "green" ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" : "bg-amber-400"}`} />
              <span className="text-[9px] font-mono text-slate-300 truncate">
                {ledRed === "green" ? "Red Planta: Estable OK" : "Red Planta: Advertencia"}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full transition-all ${ledAI === "green" ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" : "bg-amber-400"}`} />
              <span className="text-[9px] font-mono text-slate-300 truncate">
                {ledAI === "green" ? "Motor AI-OS: Operativo" : "Motor AI-OS: Pausa"}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full transition-all ${ledAuth === "green" ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" : "bg-amber-400"}`} />
              <span className="text-[9px] font-mono text-slate-300 truncate">
                {ledAuth === "green" ? "Seguridad Sesión: Segura" : "Seguridad Sesión: Alerta"}
              </span>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleCerrarSesion}
          className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-red-950/50 hover:bg-red-900/70 border border-red-800/60 text-[10px] font-mono font-bold text-red-300 transition-all cursor-pointer"
        >
          <span>⏻</span>
          {!colapsado && <span>CERRAR SESIÓN</span>}
        </button>
      </div>
    </aside>
  );
}