'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

// ============================================================================
// TIPOS Y CONSTANTES
// ============================================================================

interface PerfilFamiliar {
  id?: string;
  nombre: string;
  cedula: string;
  claveMaestra: string;
  nivel: number;
  rol: string;
  bloqueado: boolean;
  notaAprendizaje?: string;
}

interface EntradaBitacora {
  id: string;
  fechaHora: string;
  accion: string;
  detalle: string;
}

interface InfoNivel {
  titulo: string;
  detalle: string;
  etapa: string;
  modo: string;
  puedeRegistrar: boolean;
}

type PestanaPrincipal = 'registro' | 'progreso' | 'bitacora' | 'guia';

const STORAGE_KEY = 'synapse_boveda_familiar_local_v2';
const BITACORA_KEY = 'synapse_boveda_familiar_bitacora_v1';
const TAB_KEY = 'synapse_boveda_familiar_pestana_v1';
const SESSION_KEY = 'synapse_sesion_activa_v1';

const CREADOR_NOMBRE = 'Alexander Segundo Castellanos Perozo';
const CREADOR_CEDULA = '12345678';

const PERFIL_CREADOR_BASE: PerfilFamiliar = {
  nombre: CREADOR_NOMBRE,
  cedula: CREADOR_CEDULA,
  claveMaestra: 'synapse2026',
  nivel: 10,
  rol: 'Creador / Superuser',
  bloqueado: false,
  notaAprendizaje:
    'Autoridad máxima del sistema operativo. Supervisión general y formación familiar.'
};

const DESCRIPCION_NIVELES: Record<number, InfoNivel> = {
  1: {
    titulo: 'Nivel 1 — Solo Ver (Inicio / Observación)',
    detalle: 'Lectura de todas las áreas sin modificar ni registrar datos.',
    etapa: 'Aprendizaje Guiado',
    modo: 'SOLO VER',
    puedeRegistrar: false
  },
  2: {
    titulo: 'Nivel 2 — Ingreso de Datos Supervisado',
    detalle: 'Carga y registro de datos básicos bajo supervisión directa.',
    etapa: 'Aprendizaje Guiado',
    modo: 'OPERATIVO SUPERVISADO',
    puedeRegistrar: true
  },
  3: {
    titulo: 'Nivel 3 — Registro y Consulta Operativa',
    detalle: 'Registros rutinarios y consultas sin tocar configuraciones ni claves.',
    etapa: 'Aprendizaje Guiado',
    modo: 'OPERATIVO SUPERVISADO',
    puedeRegistrar: true
  },
  4: {
    titulo: 'Nivel 4 — Seguimiento y Verificación',
    detalle: 'Revisión de registros, estados y movimientos diarios del sistema.',
    etapa: 'Apoyo y Control Parcial',
    modo: 'SEGUIMIENTO ACTIVO',
    puedeRegistrar: true
  },
  5: {
    titulo: 'Nivel 5 — Coordinación y Control Operativo',
    detalle: 'Control operativo amplio en módulos habilitados, sin cambios estructurales.',
    etapa: 'Apoyo y Control Parcial',
    modo: 'CONTROL OPERATIVO',
    puedeRegistrar: true
  },
  6: {
    titulo: 'Nivel 6 — Supervisión Activa',
    detalle: 'Supervisión remota de operaciones y flujos, sin ajustes críticos.',
    etapa: 'Apoyo y Control Parcial',
    modo: 'SUPERVISIÓN ACTIVA',
    puedeRegistrar: true
  },
  7: {
    titulo: 'Nivel 7 — Gestión Operativa Avanzada',
    detalle: 'Manejo de controles avanzados del sistema con autonomía supervisada.',
    etapa: 'Delegación Avanzada',
    modo: 'GESTIÓN AVANZADA',
    puedeRegistrar: true
  },
  8: {
    titulo: 'Nivel 8 — Superuser de Apoyo Crítico',
    detalle: 'Alta capacidad de acción y supervisión sin tocar autoridad del Creador.',
    etapa: 'Delegación Avanzada',
    modo: 'APOYO CRÍTICO',
    puedeRegistrar: true
  },
  9: {
    titulo: 'Nivel 9 — Sub-control Maestro (Máximo Delegable)',
    detalle: 'Máximo nivel delegable en la bóveda familiar; subordinado al Nivel 10.',
    etapa: 'Delegación Avanzada',
    modo: 'SUB-CONTROL MAESTRO',
    puedeRegistrar: true
  },
  10: {
    titulo: 'Nivel 10 — Creador y Superuser (Acceso Total)',
    detalle: 'Exclusivo del Creador. Autoridad absoluta y control total del sistema.',
    etapa: 'Cúspide Exclusiva',
    modo: 'ACCESO TOTAL (CREADOR)',
    puedeRegistrar: true
  }
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function BovedaFamiliarAC01() {
  // Pestaña y selección de bitácora
  const [pestanaActiva, setPestanaActiva] = useState<PestanaPrincipal>('registro');
  const [perfiles, setPerfiles] = useState<PerfilFamiliar[]>([]);
  const [bitacoras, setBitacoras] = useState<Record<string, EntradaBitacora[]>>({});
  const [cedulaBitacoraActiva, setCedulaBitacoraActiva] = useState<string>(CREADOR_CEDULA);

  // Formulario de registro familiar
  const [nombre, setNombre] = useState<string>('');
  const [cedula, setCedula] = useState<string>('');
  const [claveMaestra, setClaveMaestra] = useState<string>('');
  const [nivel, setNivel] = useState<number>(1);
  const [notaAprendizaje, setNotaAprendizaje] = useState<string>('');

  // Formulario de entrada manual en bitácora
  const [accionManual, setAccionManual] = useState<string>('PRÁCTICA / SUPERVISIÓN REGISTRADA');
  const [detalleManual, setDetalleManual] = useState<string>('');

  // Estado de interfaz y sincronización
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error' | 'info'; texto: string } | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [sincronizando, setSincronizando] = useState<boolean>(false);

  // --------------------------------------------------------------------------
  // HELPERS DE PERSISTENCIA Y BITÁCORA
  // --------------------------------------------------------------------------

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

  // --------------------------------------------------------------------------
  // CARGA Y SINCRONIZACIÓN
  // --------------------------------------------------------------------------

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
      (p) => p.nivel === 10 || p.nombre.toLowerCase().includes('alexander segundo castellanos')
    );

    if (!existeCreador) {
      lista = [PERFIL_CREADOR_BASE, ...lista];
    } else {
      lista = lista.map((p) => {
        if (p.nombre.toLowerCase().includes('alexander segundo castellanos')) {
          return {
            ...p,
            nombre: p.nombre || CREADOR_NOMBRE,
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

  // --------------------------------------------------------------------------
  // ACCIONES DE JERARQUÍA, NIVELES Y BITÁCORA
  // --------------------------------------------------------------------------

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

  // --------------------------------------------------------------------------
  // DATOS DERIVADOS PARA RENDER
  // --------------------------------------------------------------------------

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

  // --------------------------------------------------------------------------
  // RENDER
  // --------------------------------------------------------------------------

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

      {/* Navegación por pestañas */}
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

      {/* Banner de mensajes */}
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

      {/* Pestaña 1: Registro y Jerarquía */}
      {pestanaActiva === 'registro' && (
        <div className="space-y-6">
          <form
            onSubmit={handleRegistrar}
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
            <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Jerarquía Activa en Bóveda Familiar
              </h3>
              <span className="text-[11px] text-slate-400">
                {perfiles.length} perfiles registrados
              </span>
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
                      <th className="py-3 px-4">Nivel y Alcance</th>
                      <th className="py-3 px-4">Escalar Nivel (1–9)</th>
                      <th className="py-3 px-4 text-right">Bitácora y Estado</th>
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
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {infoNivel.detalle}
                            </div>
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
                                  onClick={() => cambiarNivelHija(p.cedula, p.nivel - 1)}
                                  disabled={p.nivel <= 1}
                                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-bold cursor-pointer"
                                  title="Bajar un nivel"
                                >
                                  -1
                                </button>
                                <select
                                  value={p.nivel}
                                  onChange={(e) =>
                                    cambiarNivelHija(p.cedula, Number(e.target.value))
                                  }
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
                                  onClick={() => cambiarNivelHija(p.cedula, p.nivel + 1)}
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
                              onClick={() => abrirBitacoraDe(p.cedula)}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-amber-300 cursor-pointer"
                            >
                              Bitácora
                            </button>
                            {esCreador ? (
                              <span className="text-[10px] text-emerald-400 font-bold">
                                PROTEGIDO
                              </span>
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
        </div>
      )}

      {/* Pestaña 2: Progreso y Supervisión */}
      {pestanaActiva === 'progreso' && (
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
                          onChange={(e) => actualizarNota(p.cedula, e.target.value)}
                          placeholder="Escribe una observación de avance..."
                          className="flex-1 bg-black/60 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => guardarNotaEnBitacora(p.cedula)}
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
      )}

      {/* Pestaña 3: Bitácora Personalizada */}
      {pestanaActiva === 'bitacora' && (
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
              const activa = p.cedula === perfilBitacoraSeleccionado.cedula;
              return (
                <button
                  key={p.cedula}
                  type="button"
                  onClick={() => setCedulaBitacoraActiva(p.cedula)}
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
            onSubmit={handleAgregarEventoManual}
            className="bg-[#030712] border border-slate-800 rounded-xl p-4 space-y-3"
          >
            <div className="text-[11px] font-bold uppercase text-amber-300">
              + Anotar movimiento o práctica en bitácora de: {perfilBitacoraSeleccionado.nombre}
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
                  Bitácora de: {perfilBitacoraSeleccionado.nombre}
                </div>
                <div className="text-[11px] text-slate-400">
                  Cédula: {perfilBitacoraSeleccionado.cedula} • Cargo:{' '}
                  {perfilBitacoraSeleccionado.rol} • Nivel actual:{' '}
                  {perfilBitacoraSeleccionado.nivel}
                </div>
              </div>
              <span className="text-[11px] text-slate-400">
                {entradasSeleccionadas.length} registro(s)
              </span>
            </div>

            {entradasSeleccionadas.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500">
                Aún no hay movimientos registrados en la bitácora de{' '}
                {perfilBitacoraSeleccionado.nombre}.
              </div>
            ) : (
              <div className="space-y-2.5">
                {entradasSeleccionadas.map((item) => (
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
      )}

      {/* Pestaña 4: Guía de Niveles */}
      {pestanaActiva === 'guia' && (
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
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`font-bold ${esDiez ? 'text-emerald-400' : 'text-amber-300'}`}
                    >
                      {item.titulo}
                    </span>
                    <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-slate-900 text-slate-400 shrink-0">
                      {item.etapa}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">{item.detalle}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}