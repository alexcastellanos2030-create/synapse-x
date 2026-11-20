'use client';

import React from 'react';
import { DESCRIPCION_NIVELES, PerfilFamiliar } from '../BovedaFamiliarTipos';

interface PestanaProgresoSupervisionAC01Props {
  perfiles: PerfilFamiliar[];
  onActualizarNota: (cedulaObjetivo: string, nuevaNota: string) => void;
  onGuardarNotaEnBitacora: (cedulaObjetivo: string) => void;
}

export default function PestanaProgresoSupervisionAC01({
  perfiles,
  onActualizarNota,
  onGuardarNotaEnBitacora
}: PestanaProgresoSupervisionAC01Props) {
  return (
    <div className="space-y-4">
      <div className="bg-black/40 border border-slate-800 rounded-xl p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
          Seguimiento Progresivo de Aprendizaje y Supervisión
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Controla el avance de cada integrante paso a paso desde el Nivel 1 hasta el Nivel 9,
          manteniendo el Nivel 10 exclusivo para el Creador.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {perfiles.map((p) => {
            const esCreador = p.nivel === 10;
            const info = DESCRIPCION_NIVELES[p.nivel] || DESCRIPCION_NIVELES[1];
            const porcentaje = (p.nivel / 10) * 100;

            return (
              <div
                key={p.cedula}
                className={`rounded-xl p-4 border space-y-3 ${
                  esCreador
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : 'bg-[#030712] border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-bold text-white">{p.nombre}</div>
                    <div className="text-[11px] text-slate-400">
                      CI: {p.cedula} • {esCreador ? 'Creador / Superuser' : 'Superuser'}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-slate-900 text-amber-300 border border-slate-700">
                    NIVEL {p.nivel} / 10
                  </span>
                </div>

                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      esCreador ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                    style={{ width: `${porcentaje}%` }}
                  />
                </div>

                <div className="text-[11px] text-slate-300">
                  <span className="text-emerald-400 font-bold">Función actual: </span>
                  {info.titulo} — {info.detalle}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] uppercase text-slate-400">
                    Nota de práctica / siguiente paso:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={p.notaAprendizaje || ''}
                      onChange={(e) => onActualizarNota(p.cedula, e.target.value)}
                      placeholder="Escribe una observación de avance..."
                      className="flex-1 bg-black/60 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => onGuardarNotaEnBitacora(p.cedula)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold uppercase text-emerald-300 cursor-pointer"
                    >
                      Registrar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}