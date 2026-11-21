"use client";

import React from "react";
import { EstadoProtocolosAC00 } from "./TiposPortadaAC00";

interface PestanaProtocolosCriticosAC00Props {
  protocolos: EstadoProtocolosAC00;
  onAlternarProtocolo: (clave: keyof EstadoProtocolosAC00) => void;
}

export default function PestanaProtocolosCriticosAC00({
  protocolos,
  onAlternarProtocolo,
}: PestanaProtocolosCriticosAC00Props) {
  const items: {
    clave: keyof EstadoProtocolosAC00;
    titulo: string;
    descripcion: string;
    activo: boolean;
  }[] = [
    {
      clave: "mantenimientoActivo",
      titulo: "Modo Mantenimiento Operativo",
      descripcion: "Marca el entorno para intervenciones técnicas o ajustes de planta.",
      activo: protocolos.mantenimientoActivo,
    },
    {
      clave: "drmRecetasActivo",
      titulo: "Protección DRM de Recetas y Fórmulas",
      descripcion: "Refuerza el resguardo de propiedad intelectual y procesos críticos.",
      activo: protocolos.drmRecetasActivo,
    },
    {
      clave: "jerarquiaBlindada",
      titulo: "Blindaje de Jerarquía Creador (Nivel 10)",
      descripcion: "Impide bloqueo o eliminación del perfil maestro del Creador.",
      activo: protocolos.jerarquiaBlindada,
    },
    {
      clave: "killSwitchArmado",
      titulo: "Kill-Switch de Emergencia",
      descripcion: "Interruptor de contingencia bajo control exclusivo del Creador.",
      activo: protocolos.killSwitchArmado,
    },
  ];

  return (
    <div className="space-y-2.5 text-xs">
      {items.map((item) => (
        <div
          key={item.clave}
          className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="space-y-0.5">
            <div className="font-bold text-rose-200">{item.titulo}</div>
            <div className="text-[11px] text-slate-300">{item.descripcion}</div>
          </div>
          <button
            type="button"
            onClick={() => onAlternarProtocolo(item.clave)}
            className={`px-3 py-1.5 rounded-lg font-bold text-[11px] cursor-pointer shrink-0 ${
              item.activo
                ? "bg-rose-500 text-white shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {item.activo ? "ACTIVO" : "INACTIVO"}
          </button>
        </div>
      ))}
    </div>
  );
}