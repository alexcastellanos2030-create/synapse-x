'use client';

import React from 'react';
import { EntradaBitacora, PerfilFamiliar } from '../BovedaFamiliarTipos';

interface PestanaBitacoraPersonalizadaAC01Props {
  perfiles: PerfilFamiliar[];
  perfilCreador: PerfilFamiliar;
  perfilSeleccionado: PerfilFamiliar;
  entradas: EntradaBitacora[];
  accionManual: string;
  setAccionManual: (v: string) => void;
  detalleManual: string;
  setDetalleManual: (v: string) => void;
  onSeleccionarCedula: (cedula: string) => void;
  onAgregarEventoManual: (e: React.FormEvent) => void;
}

export default function PestanaBitacoraPersonalizadaAC01({
  perfiles,
  perfilCreador,
  perfilSeleccionado,
  entradas,
  accionManual,
  setAccionManual,
  detalleManual,
  setDetalleManual,
  onSeleccionarCedula,
  onAgregarEventoManual
}: PestanaBitacoraPersonalizadaAC01Props) {
  return (
    <div className="bg-black/40 border border-slate-800 rounded-xl p-5 space-y-5">
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold">
            BITÁCORA PERSONALIZADA // ÁREA BÓVEDA FAMILIAR
          </span>
          <h3 className="text-base font-bold text-white mt-0.5">
            Creador: {perfilCreador.nombre}
          </h3>
          <p className="text-xs text-slate-400">
            Cada integrante cuenta con su pestaña individual donde se registran sus movimientos,
            cambios de nivel y prácticas.
          </p>
        </div>
        <span className="text-[11px] px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold self-start">
          NIVEL 10 — AUTORIDAD PRINCIPAL
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {perfiles.map((p) => {
          const activa = p.cedula === perfilSeleccionado.cedula;
          return (
            <button
              key={p.cedula}
              type="button"
              onClick={() => onSeleccionarCedula(p.cedula)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activa
                  ? 'bg-amber-400 text-black'
                  : 'bg-[#030712] text-slate-300 hover:bg-slate-900 border border-slate-800'
              }`}
            >
              {p.nombre} <span className="opacity-75">(Nv. {p.nivel})</span>
            </button>
          );
        })}
      </div>

      <form
        onSubmit={onAgregarEventoManual}
        className="bg-[#030712] border border-slate-800 rounded-xl p-4 space-y-3"
      >
        <div className="text-[11px] font-bold uppercase text-amber-300">
          + Anotar movimiento o práctica en bitácora de: {perfilSeleccionado.nombre}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <input
            type="text"
            value={accionManual}
            onChange={(e) => setAccionManual(e.target.value)}
            placeholder="Tipo de movimiento"
            className="bg-black/60 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
          />
          <input
            type="text"
            value={detalleManual}
            onChange={(e) => setDetalleManual(e.target.value)}
            placeholder="Describe qué hizo, revisó o practicó..."
            className="md:col-span-2 bg-black/60 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase px-4 py-2 rounded-lg cursor-pointer"
          >
            Guardar en su Bitácora
          </button>
        </div>
      </form>

      <div className="bg-[#030712] border border-slate-800 rounded-xl p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <div className="text-xs font-bold text-emerald-400 uppercase">
              Bitácora de: {perfilSeleccionado.nombre}
            </div>
            <div className="text-[11px] text-slate-400">
              Cédula: {perfilSeleccionado.cedula} • Cargo: {perfilSeleccionado.rol} • Nivel actual:{' '}
              {perfilSeleccionado.nivel}
            </div>
          </div>
          <span className="text-[11px] text-slate-400">{entradas.length} registro(s)</span>
        </div>

        {entradas.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500">
            Aún no hay movimientos registrados en la bitácora de {perfilSeleccionado.nombre}.
          </div>
        ) : (
          <div className="space-y-2.5">
            {entradas.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg bg-black/50 border border-slate-800/90 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-amber-300">{item.accion}</div>
                  <div className="text-slate-300">{item.detalle}</div>
                </div>
                <div className="text-[10px] text-slate-400 shrink-0">{item.fechaHora}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}