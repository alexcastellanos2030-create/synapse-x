"use client";

import React from "react";

interface PestanaRadarSistemaAC00Props {
  nivelActivo: number;
  totalPerfilesNucleo: number;
  creadorProtegido: boolean;
}

export default function PestanaRadarSistemaAC00({
  nivelActivo,
  totalPerfilesNucleo,
  creadorProtegido,
}: PestanaRadarSistemaAC00Props) {
  const tarjetas = [
    {
      titulo: "Bóveda Familiar",
      estado: creadorProtegido ? "BLINDADA" : "REVISAR",
      detalle: `${totalPerfilesNucleo} perfiles autorizados en núcleo principal.`,
    },
    {
      titulo: "Arquitectura de Áreas",
      estado: "ACTIVA",
      detalle: "Usuario, Servicio Técnico, Creador y Código aislados por contexto.",
    },
    {
      titulo: "Capa del Núcleo",
      estado: `NIVEL ${nivelActivo}`,
      detalle: "Parámetros maestros sincronizados en sesión local.",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
      {tarjetas.map((item) => (
        <div
          key={item.titulo}
          className="p-4 rounded-xl border border-emerald-400/40 bg-emerald-950/20 space-y-1.5"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-emerald-200">{item.titulo}</span>
            <span className="px-2 py-0.5 rounded bg-emerald-400 text-slate-950 font-bold text-[10px]">
              {item.estado}
            </span>
          </div>
          <p className="text-slate-300 text-[11px]">{item.detalle}</p>
        </div>
      ))}
    </div>
  );
}