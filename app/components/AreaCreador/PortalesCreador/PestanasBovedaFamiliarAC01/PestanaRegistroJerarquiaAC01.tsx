'use client';

import React, { useState } from 'react';
import { DESCRIPCION_NIVELES, PerfilFamiliar } from '../BovedaFamiliarTipos';

interface PestanaRegistroJerarquiaAC01Props {
  perfiles: PerfilFamiliar[];
  cargando: boolean;
  nombre: string;
  setNombre: (v: string) => void;
  cedula: string;
  setCedula: (v: string) => void;
  claveMaestra: string;
  setClaveMaestra: (v: string) => void;
  nivel: number;
  setNivel: (v: number) => void;
  notaAprendizaje: string;
  setNotaAprendizaje: (v: string) => void;
  onRegistrar: (e: React.FormEvent) => void;
  onCambiarNivel: (cedulaObjetivo: string, nuevoNivel: number) => void;
  onAbrirBitacora: (cedulaObjetivo: string) => void;
  onToggleBloqueo: (cedulaObjetivo: string) => void;
}

export default function PestanaRegistroJerarquiaAC01({
  perfiles,
  cargando,
  nombre,
  setNombre,
  cedula,
  setCedula,
  claveMaestra,
  setClaveMaestra,
  nivel,
  setNivel,
  notaAprendizaje,
  setNotaAprendizaje,
  onRegistrar,
  onCambiarNivel,
  onAbrirBitacora,
  onToggleBloqueo
}: PestanaRegistroJerarquiaAC01Props) {
  const [busquedaNombre, setBusquedaNombre] = useState<string>('');

  const perfilesFiltrados = perfiles.filter((p) => {
    const q = busquedaNombre.trim().toLowerCase();
    if (!q) return true;
    return p.nombre.toLowerCase().includes(q) || p.cedula.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <form
        onSubmit={onRegistrar}
        className="bg-black/40 border border-slate-800 rounded-xl p-5 space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
            + Registrar Integrante de Bóveda Familiar (Cargo: Superuser)
          </h3>
          <span className="text-[11px] text-slate-400">
            Inicio recomendado: Nivel 1 (Solo Ver)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 uppercase">Nombre Completo:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre y apellido"
              className="w-full bg-[#030712] border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 uppercase">Cédula de Identidad:</label>
            <input
              type="text"
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              placeholder="Solo números"
              className="w-full bg-[#030712] border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 uppercase">Clave Maestra:</label>
            <input
              type="password"
              value={claveMaestra}
              onChange={(e) => setClaveMaestra(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#030712] border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 uppercase">Nivel Inicial (1 al 9):</label>
            <select
              value={nivel}
              onChange={(e) => setNivel(Number(e.target.value))}
              className="w-full bg-[#030712] border border-slate-700 rounded-lg px-3 py-2 text-amber-300 font-bold focus:outline-none focus:border-emerald-500"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <option key={n} value={n}>
                  {DESCRIPCION_NIVELES[n].titulo}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs">
          <label className="block text-slate-400 mb-1 uppercase">
            Meta / Observación de Aprendizaje (Opcional):
          </label>
          <input
            type="text"
            value={notaAprendizaje}
            onChange={(e) => setNotaAprendizaje(e.target.value)}
            placeholder="Ej: Observar módulos y recorrer portales en modo Solo Ver..."
            className="w-full bg-[#030712] border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-2 border-t border-slate-800/80">
          <div className="text-[11px] text-slate-400">
            <span className="text-emerald-400 font-bold">Alcance seleccionado: </span>
            {DESCRIPCION_NIVELES[nivel]?.detalle}
          </div>
          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-all cursor-pointer shrink-0"
          >
            Guardar en Bóveda
          </button>
        </div>
      </form>

      <div className="bg-black/40 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Jerarquía Activa en Bóveda Familiar
            </h3>
            <span className="text-[11px] text-slate-400">
              {perfilesFiltrados.length} de {perfiles.length} perfiles visibles
            </span>
          </div>

          <div className="relative w-full sm:w-72">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">
              🔍
            </span>
            <input
              type="text"
              value={busquedaNombre}
              onChange={(e) => setBusquedaNombre(e.target.value)}
              placeholder="Buscar por nombre o cédula..."
              aria-label="Buscar integrante por nombre"
              className="w-full bg-[#030712] border border-slate-700 rounded-lg pl-8 pr-7 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
            {busquedaNombre && (
              <button
                type="button"
                onClick={() => setBusquedaNombre('')}
                title="Limpiar búsqueda"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {cargando ? (
          <div className="p-6 text-center text-xs text-slate-400">Sincronizando bóveda...</div>
        ) : perfilesFiltrados.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            No se encontraron integrantes que coincidan con &ldquo;{busquedaNombre}&rdquo;.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/70 text-[10px] uppercase text-slate-400">
                  <th className="py-3 px-4">Integrante</th>
                  <th className="py-3 px-4">Cédula</th>
                  <th className="py-3 px-4">Cargo</th>
                  <th className="py-3 px-4">Nivel y Alcance</th>
                  <th className="py-3 px-4">Escalar Nivel (1–9)</th>
                  <th className="py-3 px-4 text-right">Bitácora y Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {perfilesFiltrados.map((p) => {
                  const esCreador = p.nivel === 10;
                  const infoNivel = DESCRIPCION_NIVELES[p.nivel] || DESCRIPCION_NIVELES[1];
                  return (
                    <tr
                      key={p.cedula}
                      className={esCreador ? 'bg-emerald-950/20' : 'hover:bg-slate-900/40'}
                    >
                      <td className="py-3 px-4 font-bold text-white">
                        {p.nombre}
                        {esCreador && (
                          <span className="ml-2 px-2 py-0.5 text-[10px] rounded bg-emerald-500 text-black font-extrabold">
                            CREADOR
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-300">{p.cedula}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            esCreador
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {esCreador ? 'Creador / Superuser' : 'Superuser'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-slate-100">{infoNivel.titulo}</span>
                          <span
                            className={`px-1.5 py-0.5 text-[9px] rounded font-bold ${
                              infoNivel.puedeRegistrar
                                ? 'bg-emerald-500/15 text-emerald-300'
                                : 'bg-sky-500/15 text-sky-300'
                            }`}
                          >
                            {infoNivel.modo}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{infoNivel.detalle}</div>
                      </td>
                      <td className="py-3 px-4">
                        {esCreador ? (
                          <span className="text-[11px] font-bold text-emerald-400">
                            🔒 Nivel 10 Fijo (Acceso Total)
                          </span>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => onCambiarNivel(p.cedula, p.nivel - 1)}
                              disabled={p.nivel <= 1}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-bold cursor-pointer"
                              title="Bajar un nivel"
                            >
                              -1
                            </button>
                            <select
                              value={p.nivel}
                              onChange={(e) => onCambiarNivel(p.cedula, Number(e.target.value))}
                              className="bg-[#030712] border border-slate-700 rounded px-2 py-1 text-[11px] text-amber-300 font-bold focus:outline-none focus:border-emerald-500"
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                                <option key={n} value={n}>
                                  Nivel {n}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => onCambiarNivel(p.cedula, p.nivel + 1)}
                              disabled={p.nivel >= 9}
                              className="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 disabled:opacity-40 text-emerald-300 font-bold cursor-pointer"
                              title="Subir un nivel"
                            >
                              +1
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onAbrirBitacora(p.cedula)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-amber-300 cursor-pointer"
                        >
                          Bitácora
                        </button>
                        {esCreador ? (
                          <span className="text-[10px] text-emerald-400 font-bold">PROTEGIDO</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onToggleBloqueo(p.cedula)}
                            className={`px-3 py-1 rounded text-[10px] font-bold uppercase cursor-pointer ${
                              p.bloqueado
                                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            }`}
                          >
                            {p.bloqueado ? 'Bloqueado' : 'Activo'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}