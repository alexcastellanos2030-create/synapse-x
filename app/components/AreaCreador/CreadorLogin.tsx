'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface CreadorLoginProps {
  onLoginSuccess: (
    rol: string,
    cedula: string,
    clave1: string,
    clave2: string,
    modoSoloVer: boolean
  ) => void;
}

interface PerfilAutorizado {
  id?: string;
  nombre: string;
  cedula: string;
  claveMaestra: string;
  clavesPermitidas?: string[];
  nivel: number;
  rol: string;
  bloqueado: boolean;
}

const STORAGE_KEY = 'synapse_boveda_familiar_local_v2';
const SESSION_KEY = 'synapse_sesion_activa_v1';
const LOCK_KEY = 'synapse_temporal_lock_until';
const BOT_LOCK_KEY = 'synapse_intrusion_lock';

const PERFILES_MAESTROS_BASE: PerfilAutorizado[] = [
  {
    nombre: 'Alexander Segundo Castellanos Perozo',
    cedula: '10433935',
    claveMaestra: '*Paola123!',
    clavesPermitidas: ['*Paola123!', '*Ac12345!', 'Iar661972', 'Albany123'],
    nivel: 10,
    rol: 'Creador / Superuser',
    bloqueado: false
  },
  {
    nombre: 'Aleanny Castellanos',
    cedula: '279276795',
    claveMaestra: '*Aleanny123',
    clavesPermitidas: ['*Aleanny123'],
    nivel: 1,
    rol: 'Superuser',
    bloqueado: false
  },
  {
    nombre: 'Albany Castellanos',
    cedula: '33323644',
    claveMaestra: '*Albany123',
    clavesPermitidas: ['*Albany123'],
    nivel: 1,
    rol: 'Superuser',
    bloqueado: false
  }
];

function combinarPerfilesConBase(entrantes: PerfilAutorizado[]): PerfilAutorizado[] {
  const mapa = new Map<string, PerfilAutorizado>();

  for (const base of PERFILES_MAESTROS_BASE) {
    mapa.set(base.cedula.trim(), { ...base });
  }

  for (const item of entrantes) {
    const ced = String(item.cedula || '').trim();
    if (!ced) continue;

    const base = mapa.get(ced);
    const claveDb = String(item.claveMaestra || '').trim();
    const listaClaves = new Set<string>(base?.clavesPermitidas || []);

    if (base?.claveMaestra) listaClaves.add(base.claveMaestra.trim());
    if (claveDb) listaClaves.add(claveDb);
    if (Array.isArray(item.clavesPermitidas)) {
      item.clavesPermitidas.forEach((c) => {
        if (String(c || '').trim()) listaClaves.add(String(c).trim());
      });
    }

    const esCreador = ced === '10433935' || Number(item.nivel) === 10;
    const nivelFinal = esCreador ? 10 : Math.min(Math.max(Number(item.nivel) || 1, 1), 9);

    mapa.set(ced, {
      id: item.id ?? base?.id,
      nombre: String(item.nombre || base?.nombre || '').trim(),
      cedula: ced,
      claveMaestra: claveDb || base?.claveMaestra || '',
      clavesPermitidas: Array.from(listaClaves),
      nivel: nivelFinal,
      rol: esCreador ? 'Creador / Superuser' : String(item.rol || 'Superuser').trim(),
      bloqueado: esCreador ? false : Boolean(item.bloqueado)
    });
  }

  return Array.from(mapa.values());
}

export default function CreadorLogin({ onLoginSuccess }: CreadorLoginProps) {
  const [cedula, setCedula] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [key1, setKey1] = useState<string>('');
  const [key2, setKey2] = useState<string>('');

  // 4 LEDs independientes (Paso 1, 2, 3, 4)
  const [led1, setLed1] = useState<'white' | 'yellow' | 'green' | 'red'>('white');
  const [led2, setLed2] = useState<'white' | 'yellow' | 'green' | 'red'>('white');
  const [led3, setLed3] = useState<'white' | 'yellow' | 'green' | 'red'>('white');
  const [led4, setLed4] = useState<'white' | 'yellow' | 'green' | 'red'>('white');

  const [alertMsg, setAlertMsg] = useState<string>('Paso 1: Ingrese su número de identificación.');
  const [isStep1Valid, setIsStep1Valid] = useState<boolean>(false);
  const [isStep3Valid, setIsStep3Valid] = useState<boolean>(false);

  const [usuariosAutorizados, setUsuariosAutorizados] = useState<PerfilAutorizado[]>(
    PERFILES_MAESTROS_BASE
  );

  // Control inteligente: errores humanos (hasta 10) vs ráfagas automatizadas
  const [intentosFallidos, setIntentosFallidos] = useState<number>(0);
  const [segundosRestantes, setSegundosRestantes] = useState<number>(0);
  const [bloqueoIntrusion, setBloqueoIntrusion] = useState<boolean>(false);

  const historialTiemposRef = useRef<number[]>([]);

  useEffect(() => {
    async function cargarPerfilesBoveda() {
      let perfiles: PerfilAutorizado[] = [...PERFILES_MAESTROS_BASE];

      if (typeof window !== 'undefined') {
        const local = localStorage.getItem(STORAGE_KEY);
        if (local) {
          try {
            const parsed = JSON.parse(local);
            if (Array.isArray(parsed) && parsed.length > 0) {
              perfiles = combinarPerfilesConBase(parsed);
            }
          } catch (e) {
            console.error(e);
          }
        }

        const intruso = localStorage.getItem(BOT_LOCK_KEY);
        if (intruso === 'true') {
          setBloqueoIntrusion(true);
        }

        const lockUntil = localStorage.getItem(LOCK_KEY);
        if (lockUntil) {
          const diff = Math.ceil((Number(lockUntil) - Date.now()) / 1000);
          if (diff > 0) {
            setSegundosRestantes(diff);
          } else {
            localStorage.removeItem(LOCK_KEY);
          }
        }
      }

      try {
        const { data, error } = await supabase.from('boveda_familiar').select('*');
        if (!error && data && data.length > 0) {
          const mapeados: PerfilAutorizado[] = data.map((item: any) => ({
            id: item.id,
            nombre: String(item.nombre || '').trim(),
            cedula: String(item.cedula || '').trim(),
            claveMaestra: String(item.claveMaestra || item.clave_maestra || '').trim(),
            nivel: Number(item.nivel) || 1,
            rol:
              String(item.rol || '').trim() ||
              (Number(item.nivel) === 10 ? 'Creador / Superuser' : 'Superuser'),
            bloqueado: Boolean(item.bloqueado)
          }));
          perfiles = combinarPerfilesConBase(mapeados);
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(perfiles));
          }
        }
      } catch (err) {
        console.error('Error sincronizando perfiles de bóveda:', err);
      }

      setUsuariosAutorizados(perfiles);
    }

    cargarPerfilesBoveda();
  }, []);

  // Temporizador de auto-liberación tras pausa de 5 minutos (300 segundos)
  useEffect(() => {
    if (segundosRestantes <= 0) return;

    const timer = setInterval(() => {
      setSegundosRestantes((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIntentosFallidos(0);
          if (typeof window !== 'undefined') {
            localStorage.removeItem(LOCK_KEY);
          }
          setAlertMsg('Tiempo de espera completado. Acceso liberado nuevamente.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [segundosRestantes]);

  const esClaveValidaParaUsuario = (
    usuario: PerfilAutorizado | undefined,
    claveIngresada: string
  ): boolean => {
    if (!usuario) return false;
    const limpia = claveIngresada.trim();
    if (!limpia) return false;

    const candidatas = new Set<string>();
    if (usuario.claveMaestra) candidatas.add(usuario.claveMaestra.trim());
    if (Array.isArray(usuario.clavesPermitidas)) {
      usuario.clavesPermitidas.forEach((c) => {
        if (String(c || '').trim()) candidatas.add(String(c).trim());
      });
    }

    const base = PERFILES_MAESTROS_BASE.find((p) => p.cedula === usuario.cedula.trim());
    if (base?.clavesPermitidas) {
      base.clavesPermitidas.forEach((c) => candidatas.add(c.trim()));
    }

    return candidatas.has(limpia);
  };

  const registrarEventoValidacion = (): boolean => {
    const ahora = Date.now();
    const ventanaReciente = historialTiemposRef.current.filter((t) => ahora - t < 2000);
    ventanaReciente.push(ahora);
    historialTiemposRef.current = ventanaReciente;

    if (ventanaReciente.length > 6) {
      setBloqueoIntrusion(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem(BOT_LOCK_KEY, 'true');
      }
      setAlertMsg(
        'ALERTA CRÍTICA: Actividad automatizada / ráfaga detectada. Sesión bloqueada y reporte enviado al Creador (Alexcastellanos2030@gmail.com).'
      );
      return false;
    }
    return true;
  };

  const registrarErrorHumano = (detalle: string) => {
    if (!registrarEventoValidacion()) return;

    setIntentosFallidos((prev) => {
      const nuevoConteo = prev + 1;
      if (nuevoConteo >= 10) {
        const cincoMinutos = 300;
        setSegundosRestantes(cincoMinutos);
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCK_KEY, String(Date.now() + cincoMinutos * 1000));
        }
        setAlertMsg(
          'PAUSA PREVENTIVA (5 MIN): Se alcanzaron 10 intentos con error de digitación. El sistema se liberará automáticamente en 5 minutos.'
        );
      } else {
        setAlertMsg(`${detalle} (Intento ${nuevoConteo} de 10 — Revise teclado/pantalla con calma)`);
      }
      return nuevoConteo;
    });
  };

  const handleCedulaChange = (rawVal: string) => {
    if (bloqueoIntrusion || segundosRestantes > 0) return;

    const val = rawVal.replace(/\s+/g, '');
    setCedula(val);
    setKey1('');
    setKey2('');
    setLed3('white');
    setLed4('white');
    setIsStep3Valid(false);

    if (/[^0-9]/.test(val)) {
      setLed1('red');
      setIsStep1Valid(false);
      setName('');
      setLed2('white');
      registrarErrorHumano('ALERTA PASO 1: Solo se permiten números en la cédula.');
      return;
    }

    if (val.length === 0) {
      setLed1('white');
      setAlertMsg('Paso 1: Ingrese su número de identificación.');
      setIsStep1Valid(false);
      setName('');
      setLed2('white');
      return;
    }

    setLed1('yellow');
    setAlertMsg('Paso 1: Verificando identidad en Bóveda Familiar...');

    const encontrado = usuariosAutorizados.find((u) => u.cedula.trim() === val);

    if (encontrado) {
      if (encontrado.bloqueado) {
        setLed1('red');
        setAlertMsg('AVISO: Este perfil está temporalmente deshabilitado por el Creador.');
        setIsStep1Valid(false);
        setName('');
        setLed2('white');
        return;
      }

      setLed1('green');
      setName(encontrado.nombre);
      setLed2('green');
      setIsStep1Valid(true);
      setAlertMsg(
        `Paso 1 & 2 OK: Bienvenido(a) ${encontrado.nombre} (Nivel ${encontrado.nivel}). Proceda al Paso 3.`
      );
    } else {
      if (val.length >= 9) {
        setLed1('red');
        setIsStep1Valid(false);
        setName('');
        setLed2('white');
        registrarErrorHumano('ALERTA PASO 1: Cédula no coincide con registros de la Bóveda.');
      } else {
        setAlertMsg('Paso 1: Escribiendo cédula...');
        setIsStep1Valid(false);
        setName('');
        setLed2('white');
      }
    }
  };

  const handleKey1Change = (val: string) => {
    if (bloqueoIntrusion || segundosRestantes > 0) return;
    if (!isStep1Valid) {
      setAlertMsg('Complete el Paso 1 (Cédula) primero.');
      return;
    }
    setKey1(val);

    if (val.length === 0) {
      setLed3('white');
      setLed4('white');
      setKey2('');
      setAlertMsg('Paso 3: Ingrese su clave maestra.');
      setIsStep3Valid(false);
      return;
    }

    setLed3('yellow');
    const usuarioActual = usuariosAutorizados.find((u) => u.cedula.trim() === cedula.trim());

    if (esClaveValidaParaUsuario(usuarioActual, val)) {
      setLed3('green');
      setIsStep3Valid(true);
      setAlertMsg('Paso 3 OK. Proceda al Paso 4.');
    } else {
      setLed3('red');
      setIsStep3Valid(false);
      setAlertMsg('Paso 3: Escribiendo o verificando clave maestra...');
    }
  };

  const handleKey2Change = (val: string) => {
    if (bloqueoIntrusion || segundosRestantes > 0) return;
    if (!isStep3Valid) {
      setAlertMsg('Complete el Paso 3 primero.');
      return;
    }
    setKey2(val);

    if (val.length === 0) {
      setLed4('white');
      setAlertMsg('Paso 4: Confirme su clave maestra.');
      return;
    }

    setLed4('yellow');
    const usuarioActual = usuariosAutorizados.find((u) => u.cedula.trim() === cedula.trim());

    if (esClaveValidaParaUsuario(usuarioActual, val)) {
      setLed4('green');
      setAlertMsg('¡SECUENCIA COMPLETADA! Botón Entrar liberado.');
    } else {
      setLed4('red');
      setAlertMsg('Paso 4: Verificando segunda confirmación...');
    }
  };

  const isFullyAuthorized =
    led1 === 'green' && led2 === 'green' && led3 === 'green' && led4 === 'green';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bloqueoIntrusion || segundosRestantes > 0) return;

    if (!registrarEventoValidacion()) return;

    if (isFullyAuthorized) {
      setIntentosFallidos(0);
      const usuarioActual = usuariosAutorizados.find((u) => u.cedula.trim() === cedula.trim());
      const nivelUsuario = usuarioActual ? Number(usuarioActual.nivel) : 1;
      const esCreador =
        cedula.trim() === '10433935' ||
        nivelUsuario === 10 ||
        Boolean(usuarioActual?.rol?.toLowerCase().includes('creador'));

      const modoSoloVer = !esCreador && nivelUsuario === 1;
      const rolFinal = esCreador ? 'Creador' : 'Superuser';

      if (typeof window !== 'undefined') {
        localStorage.setItem(
          SESSION_KEY,
          JSON.stringify({
            activa: true,
            nombre: usuarioActual?.nombre || name,
            cedula: cedula.trim(),
            rol: rolFinal,
            nivel: esCreador ? 10 : nivelUsuario,
            modoSoloVer,
            timestamp: Date.now()
          })
        );
      }

      onLoginSuccess(rolFinal, cedula.trim(), key1, key2, modoSoloVer);
    } else {
      registrarErrorHumano('Error de validación: Revise sus claves e intente nuevamente.');
    }
  };

  const formatTiempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getLedColorClass = (color: 'white' | 'yellow' | 'green' | 'red') => {
    switch (color) {
      case 'green':
        return 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)] border-emerald-200';
      case 'yellow':
        return 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)] border-amber-200';
      case 'red':
        return 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)] border-red-200';
      default:
        return 'bg-slate-700 shadow-none border-slate-600';
    }
  };

  return (
    <div className="w-full max-w-lg bg-[#070d1a] border border-slate-800 rounded-2xl p-5 shadow-2xl relative font-mono text-slate-100">
      {/* Barra LED Superior */}
      <div className="mb-4 pb-3 border-b border-slate-800 flex items-center justify-between bg-black/60 px-4 py-2.5 rounded-xl">
        <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
          ESTADO LED:
        </span>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5" title="1. Cédula">
            <span
              className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 ${getLedColorClass(
                led1
              )}`}
            />
            <span className="text-[10px] text-slate-300 font-bold">1</span>
          </div>
          <div className="flex items-center space-x-1.5" title="2. Identidad">
            <span
              className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 ${getLedColorClass(
                led2
              )}`}
            />
            <span className="text-[10px] text-slate-300 font-bold">2</span>
          </div>
          <div className="flex items-center space-x-1.5" title="3. Clave 1">
            <span
              className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 ${getLedColorClass(
                led3
              )}`}
            />
            <span className="text-[10px] text-slate-300 font-bold">3</span>
          </div>
          <div className="flex items-center space-x-1.5" title="4. Clave 2">
            <span
              className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 ${getLedColorClass(
                led4
              )}`}
            />
            <span className="text-[10px] text-slate-300 font-bold">4</span>
          </div>
        </div>
      </div>

      <div className="text-center mb-5">
        <h1 className="text-sm font-bold tracking-widest text-emerald-400 uppercase animate-pulse">
          ⚡ PORTAL BÓVEDA FAMILIAR Y CREADOR ⚡
        </h1>
        <p className="text-[11px] text-slate-400 mt-1">
          Acceso Multi-Dispositivo • Creador (Nivel 10) & Superusers (Niveles 1-9)
        </p>
      </div>

      {bloqueoIntrusion ? (
        <div className="p-5 bg-red-950/70 border border-red-500 rounded-xl text-center space-y-2">
          <div className="text-sm font-bold text-red-400 uppercase">
            🚨 BLOQUEO POR ACTIVIDAD ANÓMALA
          </div>
          <p className="text-xs text-red-200">
            Se detectaron intentos automatizados de alta velocidad. Protocolo de seguridad activado y
            notificación registrada para el Creador.
          </p>
        </div>
      ) : segundosRestantes > 0 ? (
        <div className="p-5 bg-amber-950/60 border border-amber-500/60 rounded-xl text-center space-y-2">
          <div className="text-sm font-bold text-amber-300 uppercase">
            ⏳ PAUSA PREVENTIVA DE 5 MINUTOS
          </div>
          <p className="text-xs text-amber-100">
            Se detectaron 10 errores de digitación. Espere a que finalice el contador para volver a
            ingresar sus datos con calma:
          </p>
          <div className="text-2xl font-extrabold text-white tracking-widest pt-1">
            {formatTiempo(segundosRestantes)}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 uppercase tracking-wider">
              1. Nro. de Cédula:
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={cedula}
              onChange={(e) => handleCedulaChange(e.target.value)}
              placeholder="Ingrese su cédula..."
              required
              className="w-full bg-[#030712] border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 uppercase tracking-wider">
              2. Identidad Verificada:
            </label>
            <input
              type="text"
              value={name}
              readOnly
              placeholder="Aguardando cédula..."
              className="w-full bg-[#030712]/50 border border-slate-800 rounded px-3 py-2 text-emerald-400 font-semibold cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 uppercase tracking-wider">
              3. Clave Maestra:
            </label>
            <input
              type="password"
              value={key1}
              onChange={(e) => handleKey1Change(e.target.value)}
              disabled={!isStep1Valid}
              placeholder="••••••••••••"
              required
              className="w-full bg-[#030712] border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 uppercase tracking-wider">
              4. Confirmar Clave Maestra:
            </label>
            <input
              type="password"
              value={key2}
              onChange={(e) => handleKey2Change(e.target.value)}
              disabled={!isStep3Valid}
              placeholder="••••••••••••"
              required
              className="w-full bg-[#030712] border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none disabled:opacity-50"
            />
          </div>

          <div className="pt-2 flex justify-center">
            <button
              type="submit"
              disabled={!isFullyAuthorized}
              className={`font-bold w-full py-3 rounded text-xs uppercase tracking-widest transition-all shadow-lg ${
                isFullyAuthorized
                  ? 'bg-emerald-400 text-black cursor-pointer animate-pulse shadow-emerald-400/40'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
              }`}
            >
              {isFullyAuthorized
                ? '🔓 Candado Abierto - Entrar'
                : '🔒 Ingrese Secuencia Completa'}
            </button>
          </div>
        </form>
      )}

      {/* Contenedor de Alerta Inferior */}
      <div className="mt-4 p-2.5 rounded text-[11px] font-semibold text-center border bg-[#030712] border-slate-800 text-slate-300">
        {alertMsg}
      </div>
    </div>
  );
}