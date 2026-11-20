"use client";

// ============================================================================
// CENTRO DE MANDO DEL CREADOR — SYNAPSE-X OS (OSAI INDUSTRIAL)
// - Jerarquía: Nivel 10 exclusivo del Creador; hijas (Aleanny y Albany) como
//   Superusers en escala progresiva (Nivel 1 -> Nivel 9) por encima de
//   ingenieros, técnicos y operadores.
// ============================================================================

import React from "react";
import BovedaFamiliarAC01 from "./PortalesCreador/BovedaFamiliarAC01";
import PortalAC08Identidades from "./PortalesCreador/PortalAC08Identidades";

interface CentroMandoCreadorProps {
  estacionActiva: string;
  setEstacionActiva: (estacion: string) => void;
}

export default function CentroMandoCreador({
  estacionActiva,
  setEstacionActiva,
}: CentroMandoCreadorProps) {
  const cambiarPortal = (codigo: string) => {
    setEstacionActiva(codigo);
  };

  const portales = [
    { cod: "AC01", titulo: "Master Kernel & Bóveda Familiar", desc: "(Núcleo y Superusuarios Familiares)", icono: "🔒" },
    { cod: "AC02", titulo: "Gestión de Módulos", desc: "(Estaciones de producción y panadería)", icono: "📊" },
    { cod: "AC03", titulo: "Laboratorio HMI", desc: "(Simulación y gemelo digital de planta)", icono: "🧪" },
    { cod: "AC04", titulo: "Técnicos e Ingenieros", desc: "(Soporte y gobernanza)", icono: "🛠️" },
    { cod: "AC05", titulo: "Licencias & Soporte Remoto", desc: "(Telemetría y control de conexiones)", icono: "🌐" },
    { cod: "AC06", titulo: "Diagnóstico & Logs", desc: "(Monitoreo de Vercel y Supabase)", icono: "⚙️" },
    { cod: "AC07", titulo: "Bóveda Documental", desc: "(Manuales, normativas y accesos rápidos)", icono: "📚" },
    { cod: "AC08", titulo: "Portal ID", desc: "(Núcleo Familiar, Ing/Técnicos, Licencias y Bitácora)", icono: "🪪" },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 font-mono">
      {/* AC00: PORTADA MAESTRA */}
      {estacionActiva === "AC00" && (
        <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-3">
          <div className="border-b border-amber-500/20 pb-2.5">
            <h1 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">
              Synapse-X OS — Centro de Comando Root
            </h1>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Seleccione un portal del sistema para iniciar la operación industrial.
            </p>
          </div>

          <div className="space-y-2">
            {portales.map((item) => (
              <div
                key={item.cod}
                className="group flex items-center justify-between px-3 py-1.5 bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-amber-500/50 rounded-xl transition-all shadow-inner"
              >
                <div className="flex items-center space-x-2.5 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => cambiarPortal(item.cod)}
                    title={`Entrar a ${item.titulo}`}
                    className="w-7 h-7 flex items-center justify-center bg-black/80 group-hover:bg-amber-500/20 border border-slate-700/80 group-hover:border-amber-500 text-sm rounded-lg transition-all cursor-pointer shadow-sm shrink-0"
                  >
                    {item.icono}
                  </button>

                  <div className="flex items-center space-x-2 flex-wrap">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-black text-amber-400 rounded border border-slate-800 shrink-0">
                      {item.cod}
                    </span>
                    <h2 className="text-xs font-bold text-white uppercase tracking-wide group-hover:text-amber-300 transition-colors shrink-0">
                      {item.titulo}
                    </h2>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {item.desc}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => cambiarPortal(item.cod)}
                  className="px-2.5 py-1 bg-slate-800/80 hover:bg-amber-500 hover:text-black text-amber-300/90 border border-slate-700/60 hover:border-amber-500 rounded-xl text-[10px] font-bold transition-all cursor-pointer shadow-sm shrink-0 ml-2"
                >
                  Acceder →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RENDERIZADO DE PORTALES DISPONIBLES */}
      {estacionActiva === "AC01" && <BovedaFamiliarAC01 />}

      {estacionActiva === "AC08" && <PortalAC08Identidades />}

      {estacionActiva !== "AC00" &&
        estacionActiva !== "AC01" &&
        estacionActiva !== "AC08" && (
          <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-6 text-white text-xs space-y-2">
            <h2 className="font-bold text-amber-400 text-sm uppercase">
              Portal {estacionActiva} (En Desarrollo Modular)
            </h2>
            <p className="text-slate-400">
              Este portal independiente se conectará en breve manteniendo la misma arquitectura limpia.
            </p>
          </div>
        )}
    </div>
  );
}