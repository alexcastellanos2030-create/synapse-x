'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import {
  BITACORA_KEY,
  CREADOR_CEDULA,
  CREADOR_NOMBRE,
  DESCRIPCION_NIVELES,
  EntradaBitacora,
  PERFIL_CREADOR_BASE,
  PerfilFamiliar,
  PestanaPrincipal,
  SESSION_KEY,
  STORAGE_KEY,
  TAB_KEY
} from './BovedaFamiliarTipos';
import PestanaRegistroJerarquiaAC01 from './PestanasBovedaFamiliarAC01/PestanaRegistroJerarquiaAC01';
import PestanaProgresoSupervisionAC01 from './PestanasBovedaFamiliarAC01/PestanaProgresoSupervisionAC01';
import PestanaBitacoraPersonalizadaAC01 from './PestanasBovedaFamiliarAC01/PestanaBitacoraPersonalizadaAC01';
import PestanaGuiaNivelesAC01 from './PestanasBovedaFamiliarAC01/PestanaGuiaNivelesAC01';

export default function BovedaFamiliarAC01() {
  const [pestanaActiva, setPestanaActiva] = useState<PestanaPrincipal>('registro');
  const [perfiles, setPerfiles] = useState<PerfilFamiliar[]>([]);
  const [bitacoras, setBitacoras] = useState<Record<string, EntradaBitacora[]>>({});
  const [cedulaBitacoraActiva, setCedulaBitacoraActiva] = useState<string>(CREADOR_CEDULA);

  const [nombre, setNombre] = useState<string>('');
  const [cedula, setCedula] = useState<string>('');
  const [claveMaestra, setClaveMaestra] = useState<string>('');
  const [nivel, setNivel] = useState<number>(1);
  const [notaAprendizaje, setNotaAprendizaje] = useState<string>('');

  const [accionManual, setAccionManual] = useState<string>('PRÁCTICA / SUPERVISIÓN REGISTRADA');
  const [detalleManual, setDetalleManual] = useState<string>('');

  const [mensaje, setMensaje] = useState<{
    tipo: 'ok' | 'error' | 'info';
    texto: string;
  } | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [sincronizando, setSincronizando] = useState<boolean>(false);

  const guardarLocal = (lista: PerfilFamiliar[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    }
  };

  const guardarBitacoraLocal = (data: Record<string, EntradaBitacora[]>) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(BITACORA_KEY, JSON.stringify(data));
    }
  };

  const marcarSesionActiva = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ activa: true, modulo: 'BovedaFamiliarAC01', timestamp: Date.now() })
      );
    }
  };

  const seleccionarPestana = (tab: PestanaPrincipal) => {
    setPestanaActiva(tab);
    if (typeof window !== 'undefined') {
      localStorage.setItem(TAB_KEY, tab);
    }
  };

  const agregarEntradaBitacora = (
    cedulaObjetivo: string,
    accion: string,
    detalle: string,
    bitacoraBase?: Record<string, EntradaBitacora[]>
  ) => {
    const origen = bitacoraBase || bitacoras;
    const nuevaEntrada: EntradaBitacora = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      fechaHora: new Date().toLocaleString('es-CL'),
      accion,
      detalle
    };

    const actualizada: Record<string, EntradaBitacora[]> = {
      ...origen,
      [cedulaObjetivo]: [nuevaEntrada, ...(origen[cedulaObjetivo] || [])]
    };

    setBitacoras(actualizada);
    guardarBitacoraLocal(actualizada);
  };

  const cargarTodo = useCallback(async (esActualizacionManual = false) => {
    setCargando((prev) => (perfiles.length === 0 ? true : prev));
    setSincronizando(true);
    marcarSesionActiva();

    let lista: PerfilFamiliar[] = [];
    let bitacoraCargada: Record<string, EntradaBitacora[]> = {};

    if (typeof window !== 'undefined') {
      const guardado = localStorage.getItem(STORAGE_KEY);
      if (guardado) {
        try {
          lista = JSON.parse(guardado);
        } catch (e) {
          console.error('Error leyendo perfiles en localStorage:', e);
        }
      }

      const bitGuardada = localStorage.getItem(BITACORA_KEY);
      if (bitGuardada) {
        try {
          bitacoraCargada = JSON.parse(bitGuardada);
        } catch (e) {
          console.error('Error leyendo bitácora en localStorage:', e);
        }
      }
    }

    try {
      const { data, error } = await supabase.from('boveda_familiar').select('*');
      if (!error && data && data.length > 0) {
        lista = data.map((item: any) => ({
          id: item.id,
          nombre: item.nombre,
          cedula: String(item.cedula).trim(),
          claveMaestra: item.claveMaestra || item.clave_maestra || '',
          nivel: Number(item.nivel) || 1,
          rol: item.rol || (Number(item.nivel) === 10 ? 'Creador / Superuser' : 'Superuser'),
          bloqueado: Boolean(item.bloqueado),
          notaAprendizaje: item.notaAprendizaje || item.nota_aprendizaje || ''
        }));
      }
    } catch (err) {
      console.error('Error consultando Supabase:', err);
    }

    const existeCreador = lista.some(
      (p) =>
        p.cedula === CREADOR_CEDULA ||
        p.nivel === 10 ||
        p.nombre.toLowerCase().includes('alexander segundo castellanos')
    );

    if (!existeCreador) {
      lista = [PERFIL_CREADOR_BASE, ...lista];
    } else {
      lista = lista.map((p) => {
        if (
          p.cedula === CREADOR_CEDULA ||
          p.nombre.toLowerCase().includes('alexander segundo castellanos')
        ) {
          return {
            ...p,
            nombre: p.nombre || CREADOR_NOMBRE,
            cedula: CREADOR_CEDULA,
            nivel: 10,
            rol: 'Creador / Superuser',
            bloqueado: false
          };
        }
        return {
          ...p,
          nivel: p.nivel >= 10 ? 9 : p.nivel,
          rol: 'Superuser'
        };
      });
    }

    const creadorReal = lista.find((p) => p.nivel === 10) || PERFIL_CREADOR_BASE;
    setCedulaBitacoraActiva((prev) => prev || creadorReal.cedula);

    if (!bitacoraCargada[creadorReal.cedula] || bitacoraCargada[creadorReal.cedula].length === 0) {
      bitacoraCargada[creadorReal.cedula] = [
        {
          id: 'init-creador',
          fechaHora: new Date().toLocaleString('es-CL'),
          accion: 'SESIÓN DE BÓVEDA INICIALIZADA',
          detalle: `Portal activo bajo autoridad del Creador (${creadorReal.nombre}) — Nivel 10.`
        }
      ];
    }

    guardarLocal(lista);
    guardarBitacoraLocal(bitacoraCargada);

    setPerfiles(lista);
    setBitacoras(bitacoraCargada);
    setCargando(false);
    setSincronizando(false);

    if (esActualizacionManual) {
      setMensaje({
        tipo: 'ok',
        texto: 'Datos actualizados. Permaneces en tu pantalla activa sin cierre de sesión.'
      });
    }
  }, [perfiles.length]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tabGuardada = localStorage.getItem(TAB_KEY) as PestanaPrincipal | null;
      if (tabGuardada && ['registro', 'progreso', 'bitacora', 'guia'].includes(tabGuardada)) {
        setPestanaActiva(tabGuardada);
      }
    }
    cargarTodo(false);
  }, [cargarTodo]);

  const handleRegistrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);

    const nombreLimpio = nombre.trim();
    const cedulaLimpia = cedula.trim();
    const claveLimpia = claveMaestra.trim();
    const notaLimpia =
      notaAprendizaje.trim() || 'Etapa inicial: familiarización con el sistema en modo Solo Ver.';

    if (!nombreLimpio || !cedulaLimpia || !claveLimpia) {
      setMensaje({
        tipo: 'error',
        texto: 'Complete nombre completo, cédula de identidad y clave maestra.'
      });
      return;
    }

    if (!/^\d+$/.test(cedulaLimpia)) {
      setMensaje({
        tipo: 'error',
        texto: 'La cédula de identidad debe contener solo números.'
      });
      return;
    }

    const nivelSeguro = Math.min(Math.max(Number(nivel), 1), 9);
    if (nivel >= 10) {
      setMensaje({
        tipo: 'error',
        texto:
          'BLOQUEO DE JERARQUÍA: El Nivel 10 es exclusivo del Creador. Se asignó Nivel 9 como máximo.'
      });
    }

    if (perfiles.some((p) => p.cedula === cedulaLimpia)) {
      setMensaje({
        tipo: 'error',
        texto: 'Ya existe un registro en la Bóveda Familiar con esa cédula.'
      });
      return;
    }

    const nuevoPerfil: PerfilFamiliar = {
      nombre: nombreLimpio,
      cedula: cedulaLimpia,
      claveMaestra: claveLimpia,
      nivel: nivelSeguro,
      rol: 'Superuser',
      bloqueado: false,
      notaAprendizaje: notaLimpia
    };

    const nuevaLista = [...perfiles, nuevoPerfil];
    setPerfiles(nuevaLista);
    guardarLocal(nuevaLista);

    try {
      await supabase.from('boveda_familiar').insert([nuevoPerfil]);
    } catch (err) {
      console.error('Error guardando en Supabase:', err);
    }

    const creadorActual = perfiles.find((p) => p.nivel === 10) || PERFIL_CREADOR_BASE;
    const bitTemp: Record<string, EntradaBitacora[]> = {
      ...bitacoras,
      [cedulaLimpia]: [
        {
          id: `${Date.now()}-alta`,
          fechaHora: new Date().toLocaleString('es-CL'),
          accion: 'ALTA EN BÓVEDA FAMILIAR',
          detalle: `Registrado como Superuser con ${DESCRIPCION_NIVELES[nivelSeguro].titulo}. Meta: ${notaLimpia}`
        }
      ]
    };

    agregarEntradaBitacora(
      creadorActual.cedula,
      'REGISTRO DE INTEGRANTE FAMILIAR',
      `Se registró a ${nombreLimpio} (CI: ${cedulaLimpia}) en Nivel ${nivelSeguro}.`,
      bitTemp
    );

    setNombre('');
    setCedula('');
    setClaveMaestra('');
    setNivel(1);
    setNotaAprendizaje('');
    setMensaje({
      tipo: 'ok',
      texto: `Perfil registrado como Superuser en Nivel ${nivelSeguro} (${DESCRIPCION_NIVELES[nivelSeguro].titulo}).`
    });
  };

  const cambiarNivelHija = async (cedulaObjetivo: string, nuevoNivel: number) => {
    const target = perfiles.find((p) => p.cedula === cedulaObjetivo);
    if (!target) return;

    if (
      target.nivel === 10 ||
      target.nombre.toLowerCase().includes('alexander segundo castellanos')
    ) {
      setMensaje({
        tipo: 'error',
        texto:
          'AUTORIDAD PROTEGIDA: El registro maestro del Creador (Nivel 10) no puede degradarse ni alterarse.'
      });
      return;
    }

    const nivelValidado = Math.min(Math.max(nuevoNivel, 1), 9);
    const nivelAnterior = target.nivel;
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

    const creadorActual = perfiles.find((p) => p.nivel === 10) || PERFIL_CREADOR_BASE;
    agregarEntradaBitacora(
      cedulaObjetivo,
      nivelValidado > nivelAnterior ? 'ASCENSO DE NIVEL AUTORIZADO' : 'AJUSTE DE NIVEL SUPERVISADO',
      `Cambio de Nivel ${nivelAnterior} a Nivel ${nivelValidado} (${DESCRIPCION_NIVELES[nivelValidado].titulo}).`
    );
    agregarEntradaBitacora(
      creadorActual.cedula,
      'ACTUALIZACIÓN DE JERARQUÍA FAMILIAR',
      `Nivel de ${target.nombre} ajustado de ${nivelAnterior} a ${nivelValidado}.`
    );

    setMensaje({
      tipo: 'ok',
      texto: `Progreso actualizado: ${target.nombre} ahora opera en ${DESCRIPCION_NIVELES[nivelValidado].titulo}.`
    });
  };

  const actualizarNota = (cedulaObjetivo: string, nuevaNota: string) => {
    const actualizada = perfiles.map((p) =>
      p.cedula === cedulaObjetivo ? { ...p, notaAprendizaje: nuevaNota } : p
    );
    setPerfiles(actualizada);
    guardarLocal(actualizada);
  };

  const guardarNotaEnBitacora = (cedulaObjetivo: string) => {
    const target = perfiles.find((p) => p.cedula === cedulaObjetivo);
    if (!target) return;
    agregarEntradaBitacora(
      cedulaObjetivo,
      'OBSERVACIÓN DE SEGUIMIENTO ACTUALIZADA',
      target.notaAprendizaje || 'Sin observación registrada.'
    );
    setMensaje({
      tipo: 'info',
      texto: `Observación guardada en la bitácora personal de ${target.nombre}.`
    });
  };

  const handleAgregarEventoManual = (e: React.FormEvent) => {
    e.preventDefault();
    const detalleLimpio = detalleManual.trim();
    const accionLimpia = accionManual.trim() || 'REGISTRO DE ACTIVIDAD';

    if (!detalleLimpio) {
      setMensaje({
        tipo: 'error',
        texto: 'Escribe el detalle de la acción o práctica antes de guardar en la bitácora.'
      });
      return;
    }

    agregarEntradaBitacora(
      perfilBitacoraSeleccionado.cedula,
      accionLimpia,
      `${detalleLimpio} (Registrado en panel del Creador: ${perfilCreador.nombre})`
    );
    setDetalleManual('');
    setMensaje({
      tipo: 'ok',
      texto: `Movimiento agregado a la bitácora de ${perfilBitacoraSeleccionado.nombre}.`
    });
  };

  const toggleBloqueo = async (cedulaObjetivo: string) => {
    const target = perfiles.find((p) => p.cedula === cedulaObjetivo);
    if (!target) return;

    if (
      target.nivel === 10 ||
      target.nombre.toLowerCase().includes('alexander segundo castellanos')
    ) {
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

    agregarEntradaBitacora(
      cedulaObjetivo,
      nuevoEstado ? 'ACCESO PAUSADO' : 'ACCESO HABILITADO',
      `Estado del perfil actualizado a ${nuevoEstado ? 'Bloqueado' : 'Activo'}.`
    );

    setMensaje({
      tipo: 'info',
      texto: `Acceso de ${target.nombre} ${nuevoEstado ? 'SUSPENDIDO' : 'HABILITADO'}.`
    });
  };

  const abrirBitacoraDe = (cedulaObjetivo: string) => {
    setCedulaBitacoraActiva(cedulaObjetivo);
    seleccionarPestana('bitacora');
  };

  const perfilCreador = perfiles.find((p) => p.nivel === 10) || PERFIL_CREADOR_BASE;
  const perfilBitacoraSeleccionado =
    perfiles.find((p) => p.cedula === cedulaBitacoraActiva) || perfilCreador;
  const entradasSeleccionadas = bitacoras[perfilBitacoraSeleccionado.cedula] || [];

  const pestanas: { id: PestanaPrincipal; etiqueta: string }[] = [
    { id: 'registro', etiqueta: '1. Registro y Jerarquía' },
    { id: 'progreso', etiqueta: '2. Progreso y Supervisión' },
    { id: 'bitacora', etiqueta: '3. Bitácora Personalizada' },
    { id: 'guia', etiqueta: '4. Guía de Niveles (1–10)' }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto bg-[#070d1a] border border-slate-800 rounded-2xl p-6 shadow-2xl font-mono text-slate-100 space-y-6">
      <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">
            AC01 // SEGURIDAD DE NÚCLEO FAMILIAR
          </span>
          <h2 className="text-lg font-bold text-white tracking-wide mt-0.5">
            BÓVEDA PRIVADA — ESCALA PROGRESIVA (NIVELES 1 AL 10)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Creador: <span className="text-emerald-300 font-bold">{perfilCreador.nombre}</span> •
            Nivel 10 exclusivo (Acceso Total) • Superusers familiares del 1 al 9.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => cargarTodo(true)}
            className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer"
          >
            {sincronizando ? 'Actualizando...' : '↻ Actualizar'}
          </button>
          <div className="bg-emerald-950/50 border border-emerald-500/40 rounded-xl px-4 py-2 text-right">
            <div className="text-[10px] text-emerald-300 uppercase font-bold">
              Cúspide del Sistema
            </div>
            <div className="text-xs font-bold text-white">NIVEL 10 — CREADOR</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {pestanas.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => seleccionarPestana(tab.id)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              pestanaActiva === tab.id
                ? 'bg-emerald-500 text-black'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {tab.etiqueta}
          </button>
        ))}
      </div>

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

      {pestanaActiva === 'registro' && (
        <PestanaRegistroJerarquiaAC01
          perfiles={perfiles}
          cargando={cargando}
          nombre={nombre}
          setNombre={setNombre}
          cedula={cedula}
          setCedula={setCedula}
          claveMaestra={claveMaestra}
          setClaveMaestra={setClaveMaestra}
          nivel={nivel}
          setNivel={setNivel}
          notaAprendizaje={notaAprendizaje}
          setNotaAprendizaje={setNotaAprendizaje}
          onRegistrar={handleRegistrar}
          onCambiarNivel={cambiarNivelHija}
          onAbrirBitacora={abrirBitacoraDe}
          onToggleBloqueo={toggleBloqueo}
        />
      )}

      {pestanaActiva === 'progreso' && (
        <PestanaProgresoSupervisionAC01
          perfiles={perfiles}
          onActualizarNota={actualizarNota}
          onGuardarNotaEnBitacora={guardarNotaEnBitacora}
        />
      )}

      {pestanaActiva === 'bitacora' && (
        <PestanaBitacoraPersonalizadaAC01
          perfiles={perfiles}
          perfilCreador={perfilCreador}
          perfilSeleccionado={perfilBitacoraSeleccionado}
          entradas={entradasSeleccionadas}
          accionManual={accionManual}
          setAccionManual={setAccionManual}
          detalleManual={detalleManual}
          setDetalleManual={setDetalleManual}
          onSeleccionarCedula={setCedulaBitacoraActiva}
          onAgregarEventoManual={handleAgregarEventoManual}
        />
      )}

      {pestanaActiva === 'guia' && <PestanaGuiaNivelesAC01 />}
    </div>
  );
}