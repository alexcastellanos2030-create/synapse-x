'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface PerfilFamiliar {
  id?: string;
  nombre: string;
  cedula: string;
  claveMaestra: string;
  nivel: number;
  rol: string;
  bloqueado: boolean;
}

const DESCRIPCION_NIVELES: Record<number, { titulo: string; detalle: string; etapa: string }> = {
  1: {
    titulo: 'Nivel 1 — Solo Ver (Inicio / Observación)',
    detalle: 'Lectura de todas las áreas sin modificar ni registrar datos.',
    etapa: 'Aprendizaje Guiado'
  },
  2: {
    titulo: 'Nivel 2 — Ingreso de Datos Supervisado',
    detalle: 'Carga y registro de datos básicos bajo supervisión directa.',
    etapa: 'Aprendizaje Guiado'
  },
  3: {
    titulo: 'Nivel 3 — Registro y Consulta Operativa',
    detalle: 'Registros rutinarios y consultas sin tocar configuraciones ni claves.',
    etapa: 'Aprendizaje Guiado'
  },
  4: {
    titulo: 'Nivel 4 — Seguimiento y Verificación',
    detalle: 'Revisión de registros, estados y movimientos diarios del sistema.',
    etapa: 'Apoyo y Control Parcial'
  },
  5: {
    titulo: 'Nivel 5 — Coordinación y Control Operativo',
    detalle: 'Control operativo amplio en módulos habilitados, sin cambios estructurales.',
    etapa: 'Apoyo y Control Parcial'
  },
  6: {
    titulo: 'Nivel 6 — Supervisión Activa',
    detalle: 'Supervisión remota de operaciones y flujos, sin ajustes críticos.',
    etapa: 'Apoyo y Control Parcial'
  },
  7: {
    titulo: 'Nivel 7 — Gestión Operativa Avanzada',
    detalle: 'Manejo de controles avanzados del sistema con autonomía supervisada.',
    etapa: 'Delegación Avanzada'
  },
  8: {
    titulo: 'Nivel 8 — Superuser de Apoyo Crítico',
    detalle: 'Alta capacidad de acción y supervisión sin tocar autoridad del Creador.',
    etapa: 'Delegación Avanzada'
  },
  9: {
    titulo: 'Nivel 9 — Sub-control Maestro (Máximo Delegable)',
    detalle: 'Máximo nivel delegable en la bóveda familiar; subordinado al Nivel 10.',
    etapa: 'Delegación Avanzada'
  },
  10: {
    titulo: 'Nivel 10 — Creador y Superuser (Acceso Total)',
    detalle: 'Exclusivo del Creador. Autoridad absoluta y control total del sistema.',
    etapa: 'Cúspide Exclusiva'
  }
};

const STORAGE_KEY = 'synapse_boveda_familiar_local_v2';

export default function BovedaFamiliarAC01() {
  const [perfiles, setPerfiles] = useState<PerfilFamiliar[]>([]);
  const [nombre, setNombre] = useState<string>('');
  const [cedula, setCedula] = useState<string>('');
  const [claveMaestra, setClaveMaestra] = useState<string>('');
  const [nivel, setNivel] = useState<number>(1);
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error' | 'info'; texto: string } | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);

  const perfilCreadorBase: PerfilFamiliar = {
    nombre: 'Alexander Segundo Castellanos Perozo',
    cedula: '12345678',
    claveMaestra: 'synapse2026',
    nivel: 10,
    rol: 'Creador / Superuser',
    bloqueado: false
  };

  useEffect(() => {
    cargarPerfiles();
  }, []);

  const cargarPerfiles = async () => {
    setCargando(true);
    let lista: PerfilFamiliar[] = [];

    if (typeof window !== 'undefined') {
      const guardado = localStorage.getItem(STORAGE_KEY);
      if (guardado) {
        try {
          lista = JSON.parse(guardado);
        } catch (e) {
          console.error('Error leyendo localStorage:', e);
        }
      }
    }

    try {
      const { data, error } = await supabase.from('boveda_familiar').select('*');
      if (!error && data && data.length > 0) {
        lista = data.map((item: any) => ({
          id: item.id,
          nombre: item.nombre,
          cedula: String(item.cedula),
          claveMaestra: item.claveMaestra || item.clave_maestra || '',
          nivel: Number(item.nivel) || 1,
          rol: item.rol || (Number(item.nivel) === 10 ? 'Creador / Superuser' : 'Superuser'),
          bloqueado: Boolean(item.bloqueado)
        }));
      }
    } catch (err) {
      console.error('Error consultando Supabase:', err);
    }

    // Garantizar que el Creador siempre exista en Nivel 10 y nadie más tenga Nivel 10
    const existeCreador = lista.some(
      (p) => p.nivel === 10 || p.nombre.toLowerCase().includes('alexander segundo castellanos')
    );

    if (!existeCreador) {
      lista = [perfilCreadorBase, ...lista];
    } else {
      lista = lista.map((p) => {
        if (p.nombre.toLowerCase().includes('alexander segundo castellanos')) {
          return { ...p, nivel: 10, rol: 'Creador / Superuser', bloqueado: false };
        }
        // Candado: ningún otro perfil puede tener nivel 10
        if (p.nivel >= 10) {
          return { ...p, nivel: 9, rol: 'Superuser' };
        }
        return { ...p, rol: 'Superuser' };
      });
    }

    guardarLocal(lista);
    setPerfiles(lista);
    setCargando(false);
  };

  const guardarLocal = (lista: PerfilFamiliar[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    }
  };

  const handleRegistrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);

    const nombreLimpio = nombre.trim();
    const cedulaLimpia = cedula.trim();
    const claveLimpia = claveMaestra.trim();

    if (!nombreLimpio || !cedulaLimpia || !claveLimpia) {
      setMensaje({ tipo: 'error', texto: 'Complete nombre completo, cédula de identidad y clave maestra.' });
      return;
    }

    if (!/^\d+$/.test(cedulaLimpia)) {
      setMensaje({ tipo: 'error', texto: 'La cédula de identidad debe contener solo números.' });
      return;
    }

    // Candado estricto: nuevos registros familiares solo pueden ir del 1 al 9
    const nivelSeguro = Math.min(Math.max(Number(nivel), 1), 9);
    if (nivel >= 10) {
      setMensaje({
        tipo: 'error',
        texto: 'BLOQUEO DE JERARQUÍA: El Nivel 10 es exclusivo del Creador. Se asignó Nivel 9 como máximo.'
      });
    }

    const duplicado = perfiles.some((p) => p.cedula === cedulaLimpia);
    if (duplicado) {
      setMensaje({ tipo: 'error', texto: 'Ya existe un registro en la Bóveda Familiar con esa cédula.' });
      return;
    }

    const nuevoPerfil: PerfilFamiliar = {
      nombre: nombreLimpio,
      cedula: cedulaLimpia,
      claveMaestra: claveLimpia,
      nivel: nivelSeguro,
      rol: 'Superuser',
      bloqueado: false
    };

    const nuevaLista = [...perfiles, nuevoPerfil];
    setPerfiles(nuevaLista);
    guardarLocal(nuevaLista);

    try {
      await supabase.from('boveda_familiar').insert([nuevoPerfil]);
    } catch (err) {
      console.error('Error guardando en Supabase:', err);
    }

    setNombre('');
    setCedula('');
    setClaveMaestra('');
    setNivel(1);
    setMensaje({
      tipo: 'ok',
      texto: `Perfil registrado como Superuser en Nivel ${nivelSeguro} (${DESCRIPCION_NIVELES[nivelSeguro].titulo}).`
    });
  };

  const cambiarNivelHija = async (cedulaObjetivo: string, nuevoNivel: number) => {
    const target = perfiles.find((p) => p.cedula === cedulaObjetivo);
    if (!target) return;

    if (target.nivel === 10 || target.nombre.toLowerCase().includes('alexander segundo castellanos')) {
      setMensaje({
        tipo: 'error',
        texto: 'AUTORIDAD PROTEGIDA: El registro maestro del Creador (Nivel 10) no puede degradarse ni alterarse.'
      });
      return;
    }

    const nivelValidado = Math.min(Math.max(nuevoNivel, 1), 9);
    const actualizada = perfiles.map((p) =>
      p.cedula === cedulaObjetivo ? { ...p, nivel: nivelValidado, rol: 'Superuser' } : p
    );

    setPerfiles(actualizada);
    guardarLocal(actualizada);

    try {
      await supabase
        .from('boveda_familiar')
        .update({ nivel: nivelValidado, rol: 'Superuser' })
        .eq('cedula', cedulaObjetivo);
    } catch (err) {
      console.error('Error actualizando nivel en Supabase:', err);
    }

    setMensaje({
      tipo: 'ok',
      texto: `Progreso actualizado: ${target.nombre} ahora opera en ${DESCRIPCION_NIVELES[nivelValidado].titulo}.`
    });
  };

  const toggleBloqueo = async (cedulaObjetivo: string) => {
    const target = perfiles.find((p) => p.cedula === cedulaObjetivo);
    if (!target) return;

    if (target.nivel === 10 || target.nombre.toLowerCase().includes('alexander segundo castellanos')) {
      setMensaje({ tipo: 'error', texto: 'El Creador (Nivel 10) no puede ser bloqueado.' });
      return;
    }

    const nuevoEstado = !target.bloqueado;
    const actualizada = perfiles.map((p) =>
      p.cedula === cedulaObjetivo ? { ...p, bloqueado: nuevoEstado } : p
    );

    setPerfiles(actualizada);
    guardarLocal(actualizada);

    try {
      await supabase
        .from('boveda_familiar')
        .update({ bloqueado: nuevoEstado })
        .eq('cedula', cedulaObjetivo);
    } catch (err) {
      console.error('Error actualizando estado en Supabase:', err);
    }

    setMensaje({
      tipo: 'info',
      texto: `Acceso de ${target.nombre} ${nuevoEstado ? 'SUSPENDIDO' : 'HABILITADO'}.`
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-[#070d1a] border border-slate-800 rounded-2xl p-6 shadow-2xl font-mono text-slate-100 space-y-6">
      {/* Encabezado */}
      <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">
            AC01 // SEGURIDAD DE NÚCLEO FAMILIAR
          </span>
          <h2 className="text-lg font-bold text-white tracking-wide mt-0.5">
            BÓVEDA PRIVADA — ESCALA PROGRESIVA (NIVELES 1 AL 10)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Jerarquía exclusiva: Nivel 10 reservado al Creador (Acceso Total). Niveles 1 al 9 asignables paso a paso para Superusers familiares.
          </p>
        </div>
        <div className="bg-emerald-950/50 border border-emerald-500/40 rounded-xl px-4 py-2.5 text-right">
          <div className="text-[10px] text-emerald-300 uppercase font-bold">Cúspide del Sistema</div>
          <div className="text-xs font-bold text-white">NIVEL 10 — CREADOR</div>
        </div>
      </div>

      {/* Alertas */}
      {mensaje && (
        <div
          className={`p-3 rounded-xl border text-xs font-semibold ${
            mensaje.tipo === 'ok'
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
              : mensaje.tipo === 'error'
              ? 'bg-red-950/60 border-red-500/50 text-red-300'
              : 'bg-amber-950/60 border-amber-500/50 text-amber-300'
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      {/* Formulario de Registro */}
      <form onSubmit={handleRegistrar} className="bg-black/40 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
            + Registrar Integrante de Bóveda Familiar (Cargo: Superuser)
          </h3>
          <span className="text-[11px] text-slate-400">Inicio recomendado: Nivel 1 (Solo Ver)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 uppercase">Nombre Completo:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Aleanny Castellanos"
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

      {/* Tabla de Perfiles Registrados y Control Progresivo */}
      <div className="bg-black/40 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Jerarquía Activa en Bóveda Familiar
          </h3>
          <span className="text-[11px] text-slate-400">{perfiles.length} perfiles registrados</span>
        </div>

        {cargando ? (
          <div className="p-6 text-center text-xs text-slate-400">Sincronizando bóveda...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/70 text-[10px] uppercase text-slate-400">
                  <th className="py-3 px-4">Integrante</th>
                  <th className="py-3 px-4">Cédula</th>
                  <th className="py-3 px-4">Cargo</th>
                  <th className="py-3 px-4">Nivel y Función Actual</th>
                  <th className="py-3 px-4">Escalar Nivel (1-9)</th>
                  <th className="py-3 px-4 text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {perfiles.map((p) => {
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
                        <div className="font-bold text-slate-100">{infoNivel.titulo}</div>
                        <div className="text-[10px] text-slate-400">{infoNivel.detalle}</div>
                      </td>
                      <td className="py-3 px-4">
                        {esCreador ? (
                          <span className="text-[11px] font-bold text-emerald-400">
                            🔒 Nivel 10 Fijo (Acceso Total)
                          </span>
                        ) : (
                          <select
                            value={p.nivel}
                            onChange={(e) => cambiarNivelHija(p.cedula, Number(e.target.value))}
                            className="bg-[#030712] border border-slate-700 rounded px-2.5 py-1.5 text-[11px] text-amber-300 font-bold focus:outline-none focus:border-emerald-500"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                              <option key={n} value={n}>
                                Nivel {n} — {DESCRIPCION_NIVELES[n].titulo.split('—')[1]?.trim()}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {esCreador ? (
                          <span className="text-[10px] text-emerald-400 font-bold">PROTEGIDO</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => toggleBloqueo(p.cedula)}
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

      {/* Guía Visual de los 10 Niveles */}
      <div className="bg-black/40 border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Mapa de Autorización Progresiva (Niveles 1 al 10)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-[11px]">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => {
            const item = DESCRIPCION_NIVELES[n];
            const esDiez = n === 10;
            return (
              <div
                key={n}
                className={`p-3 rounded-lg border ${
                  esDiez
                    ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                    : 'bg-[#030712] border-slate-800/90 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-bold ${esDiez ? 'text-emerald-400' : 'text-amber-300'}`}>
                    {item.titulo}
                  </span>
                  <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-slate-900 text-slate-400">
                    {item.etapa}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">{item.detalle}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}