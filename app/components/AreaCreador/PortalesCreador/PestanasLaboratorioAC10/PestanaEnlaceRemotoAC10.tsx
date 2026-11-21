"use client";

import React from "react";
import { SesionEnlaceRemoto } from "./TiposLaboratorioAC10";

interface PestanaEnlaceRemotoAC10Props {
  sesion: SesionEnlaceRemoto;
  setSesion: React.Dispatch<React.SetStateAction<SesionEnlaceRemoto>>;
  onGenerarCodigoEnlace: () => void;
  onAlternarParcheCliente: () => void;
  onEnlazarConCreador: () => void;
}

export default function PestanaEnlaceRemotoAC10({
  sesion,
  setSesion,
  onGenerarCodigoEnlace,
  onAlternarParcheCliente,
  onEnlazarConCreador,
}: PestanaEnlaceRemotoAC10Props) {
  return (
    <div className="space-y-4 text-xs">
      <div className="p-4 rounded-xl border border-cyan-500/40 bg-slate-900/70 space-y-3">
        <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-300">
          Enlace Remoto Internacional · Parche de Permiso + Generador de Código
        </div>
        <p className="text-[11px] text-slate-300">
          Recopilación de datos hoy con entrada en vigencia mañana tras instalación remota. El cliente ejecuta el parche/portal para otorgar permiso de enlace con tu equipo sin importar el país.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          <input
            type="text"
            value={sesion.idClientePais}
            onChange={(e) =>
              setSesion((prev) => ({ ...prev, idClientePais: e.target.value }))
            }
            placeholder="Cliente / Planta / País (ej. Planta Lima - Perú)"
            className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-white"
          />
          <label className="flex items-center justify-between px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-300">
            <span>Recopilación:</span>
            <input
              type="date"
              value={sesion.fechaRecopilacion}
              onChange={(e) =>
                setSesion((prev) => ({
                  ...prev,
                  fechaRecopilacion: e.target.value,
                }))
              }
              className="bg-slate-900 text-white px-1.5 py-0.5 rounded border border-slate-700 text-[11px]"
            />
          </label>
          <label className="flex items-center justify-between px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-300">
            <span>Vigencia (mañana):</span>
            <input
              type="date"
              value={sesion.fechaVigenciaProgramada}
              onChange={(e) =>
                setSesion((prev) => ({
                  ...prev,
                  fechaVigenciaProgramada: e.target.value,
                }))
              }
              className="bg-slate-900 text-white px-1.5 py-0.5 rounded border border-slate-700 text-[11px]"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {/* PIEZA 1: GENERADOR DE CÓDIGO */}
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 space-y-2.5">
            <div className="font-bold text-amber-300">
              1. Generador de Código de Enlace (Creador)
            </div>
            <div className="px-3 py-2 rounded-lg border border-amber-500/30 bg-slate-900 font-mono text-sm font-bold text-amber-300 tracking-wider">
              {sesion.codigoGenerado || "SIN CÓDIGO GENERADO"}
            </div>
            <button
              type="button"
              onClick={onGenerarCodigoEnlace}
              className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] cursor-pointer"
            >
              Generar código de acceso remoto
            </button>
          </div>

          {/* PIEZA 2: PORTAL / PARCHE DE ACCESO DEL CLIENTE */}
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 space-y-2.5">
            <div className="font-bold text-emerald-300">
              2. Portal / Parche de Permiso del Cliente
            </div>
            <input
              type="text"
              value={sesion.codigoPortalCliente}
              onChange={(e) =>
                setSesion((prev) => ({
                  ...prev,
                  codigoPortalCliente: e.target.value.toUpperCase(),
                }))
              }
              placeholder="Código ingresado en portal del cliente"
              className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-white font-mono"
            />
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onAlternarParcheCliente}
                className={`px-3 py-1.5 rounded-lg font-bold text-[11px] cursor-pointer ${
                  sesion.parcheAutorizadoPorCliente
                    ? "bg-emerald-500 text-slate-950"
                    : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                }`}
              >
                {sesion.parcheAutorizadoPorCliente
                  ? "Parche de acceso: AUTORIZADO"
                  : "Autorizar parche de acceso"}
              </button>

              <button
                type="button"
                onClick={onEnlazarConCreador}
                className={`px-3 py-1.5 rounded-lg font-bold text-[11px] cursor-pointer ${
                  sesion.enlaceActivoConCreador
                    ? "bg-cyan-400 text-slate-950"
                    : "bg-cyan-950 border border-cyan-500/40 text-cyan-200 hover:bg-cyan-900"
                }`}
              >
                {sesion.enlaceActivoConCreador
                  ? "Enlace activo con equipo Creador"
                  : "Establecer enlace remoto"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}