"use client";

import React, { useState } from "react";
import PortadaMaestraAC00 from "./PortalesCreador/PortadaMaestraAC00";
import PortalLicenciasAC09 from "./PortalesCreador/PortalLicenciasAC09";
import PortalLaboratorioAC10 from "./PortalesCreador/PortalLaboratorioAC10";

type VistaPortalActiva = "AC00" | "AC09" | "AC10" | "TODOS";

export default function ConsolaPortalesCreador() {
  const [vista, setVista] = useState<VistaPortalActiva>("AC00");
  const [ultimoPortalSolicitado, setUltimoPortalSolicitado] = useState<string>("");

  const handleSeleccionarPortalDesdeAC00 = (portalId: string) => {
    setUltimoPortalSolicitado(portalId);
  };

  return (
    <div className="space-y-4 font-mono text-white">
      <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
            Synapse-X OSAI Industrial · Consola del Creador
          </div>
          <h1 className="text-sm sm:text-base font-black uppercase text-white">
            Portales Maestros AC00 · AC09 · AC10
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setVista("AC00")}
            className={`px-3 py-1.5 rounded-lg border font-bold cursor-pointer ${
              vista === "AC00"
                ? "bg-amber-400 text-slate-950 border-amber-300"
                : "bg-slate-900 text-amber-300 border-amber-500/30"
            }`}
          >
            AC00 · Portada Maestra
          </button>

          <button
            type="button"
            onClick={() => setVista("AC09")}
            className={`px-3 py-1.5 rounded-lg border font-bold cursor-pointer ${
              vista === "AC09"
                ? "bg-emerald-400 text-slate-950 border-emerald-300"
                : "bg-slate-900 text-emerald-300 border-emerald-500/30"
            }`}
          >
            AC09 · Licencias
          </button>

          <button
            type="button"
            onClick={() => setVista("AC10")}
            className={`px-3 py-1.5 rounded-lg border font-bold cursor-pointer ${
              vista === "AC10"
                ? "bg-cyan-400 text-slate-950 border-cyan-300"
                : "bg-slate-900 text-cyan-300 border-cyan-500/30"
            }`}
          >
            AC10 · Laboratorio
          </button>

          <button
            type="button"
            onClick={() => setVista("TODOS")}
            className={`px-3 py-1.5 rounded-lg border font-bold cursor-pointer ${
              vista === "TODOS"
                ? "bg-white text-slate-950 border-white"
                : "bg-slate-900 text-slate-200 border-slate-700"
            }`}
          >
            Ver los 3
          </button>
        </div>
      </div>

      {ultimoPortalSolicitado && (
        <div className="px-4 py-2 rounded-xl border border-sky-500/40 bg-sky-950/25 text-xs text-sky-200">
          Acceso rápido solicitado desde AC00 hacia:{" "}
          <strong className="text-white">{ultimoPortalSolicitado}</strong>
        </div>
      )}

      {(vista === "AC00" || vista === "TODOS") && (
        <PortadaMaestraAC00
          onSeleccionarPortal={handleSeleccionarPortalDesdeAC00}
        />
      )}

      {(vista === "AC09" || vista === "TODOS") && <PortalLicenciasAC09 />}

      {(vista === "AC10" || vista === "TODOS") && <PortalLaboratorioAC10 />}
    </div>
  );
}