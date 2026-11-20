'use client';

// ============================================================================
// PORTAL UNIVERSAL DE ACCESO — SYNAPSE-X OS (OSAI INDUSTRIAL)
// - Sin usuarios ficticios ni claves de prueba.
// - Toma los registros del núcleo desde BovedaCreadorMaster.tsx.
// - Jerarquía: Nivel 10 exclusivo del Creador (10433935); hijas (Aleanny y
//   Albany) como Superusers en escala progresiva (Nivel 1 -> Nivel 9) por
//   encima de ingenieros, técnicos y operadores.
// ============================================================================

import React, { useState } from 'react';
import {
  CREADOR_MASTER_DATABASE,
  CLAVES_CREADOR_AUTORIZADAS,
  CreadorCredential,
} from '@/components/AreaCreador/BovedaCreadorMaster';

interface UniversalLoginProps {
  tituloPortal: string;
  tipoPortalPermitido: "creador" | "ingeniero" | "tecnico" | "usuario";
  onLoginSuccess: (rol: string, cedula: string, nivel: string) => void;
}

interface UsuarioAutorizadoUniversal {
  cedula: string;
  name: string;
  cargo: string;
  nivel: string;
  nivelNumerico: number;
  rol: "creador" | "ingeniero" | "tecnico" | "usuario";
  passwords: string[];
}

const CREADOR_CEDULA_MASTER = CREADOR_MASTER_DATABASE["10433935"]?.cedula || "10433935";

// Construye los registros autorizados desde la bóveda maestra del Creador (sin datos de prueba)
const usuariosGlobalesBD: UsuarioAutorizadoUniversal[] = Object.values(
  CREADOR_MASTER_DATABASE
).map((item: CreadorCredential) => {
  const esCreador = item.cedula === CREADOR_CEDULA_MASTER || item.nivelNumerico === 10;
  const claves = esCreador
    ? Array.from(new Set([...item.passwords, ...CLAVES_CREADOR_AUTORIZADAS]))
    : [...item.passwords];

  return {
    cedula: item.cedula,
    name: item.name,
    cargo: esCreador ? "Creador / Superuser" : "Superuser (Núcleo Familiar)",
    nivel: esCreador ? "10" : String(item.nivelNumerico || 1),
    nivelNumerico: esCreador ? 10 : item.nivelNumerico || 1,
    rol: esCreador ? "creador" : "usuario",
    passwords: claves,
  };
});

function buscarUsuarioGlobalLocal(cedula: string) {
  return usuariosGlobalesBD.find((u) => u.cedula.trim() === cedula.trim());
}

export default function UniversalLogin({
  tituloPortal,
  tipoPortalPermitido,
  onLoginSuccess,
}: UniversalLoginProps) {
  const [cedula, setCedula] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [cargo, setCargo] = useState<string>('');
  const [nivel, setNivel] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [intentosFallidos, setIntentosFallidos] = useState<number>(0);
  const [estaBloqueado, setEstaBloqueado] = useState<boolean>(false);

  // Estados independientes para cada uno de los 4 bombillos LED físicos (Blanco, Amarillo, Verde, Rojo)
  const [bombillo1, setBombillo1] = useState<'white' | 'yellow' | 'green' | 'red'>('white'); // 1: Cédula
  const [bombillo2, setBombillo2] = useState<'white' | 'yellow' | 'green' | 'red'>('white'); // 2: Identidad
  const [bombillo3, setBombillo3] = useState<'white' | 'yellow' | 'green' | 'red'>('white'); // 3: Clave
  const [bombillo4, setBombillo4] = useState<'white' | 'yellow' | 'green' | 'red'>('white'); // 4: Acceso / Candado

  const [alertMsg, setAlertMsg] = useState<string>(
    'Ruta Paso 1: Ingrese su número de cédula para iniciar secuencia.'
  );
  const [isStep1Valid, setIsStep1Valid] = useState<boolean>(false);
  const [isFullyAuthorized, setIsFullyAuthorized] = useState<boolean>(false);
  const [usuarioDetectado, setUsuarioDetectado] = useState<UsuarioAutorizadoUniversal | null>(
    null
  );

  const resetSteps = () => {
    setIsStep1Valid(false);
    setIsFullyAuthorized(false);
    setName('');
    setCargo('');
    setNivel('');
    setPassword('');
    setUsuarioDetectado(null);
    setBombillo2('white');
    setBombillo3('white');
    setBombillo4('white');
  };

  const handleCedulaChange = (val: string) => {
    if (estaBloqueado) return;
    setCedula(val);

    if (/[^0-9]/.test(val)) {
      setBombillo1('red');
      setAlertMsg('ALERTA: La cédula solo debe contener dígitos numéricos.');
      resetSteps();
      return;
    }

    if (val.length === 0) {
      setBombillo1('white');
      setAlertMsg('Ruta Paso 1: Ingrese su número de cédula.');
      resetSteps();
      return;
    }

    setBombillo1('yellow');
    setAlertMsg('Ruta Paso 1: Buscando registro en bóveda...');

    const userRecord = buscarUsuarioGlobalLocal(val);

    if (userRecord) {
      setUsuarioDetectado(userRecord);

      // Solo el Creador (Nivel 10) tiene acceso universal a todos los portales
      const esCreadorUniversal =
        userRecord.rol === "creador" ||
        userRecord.cedula === CREADOR_CEDULA_MASTER ||
        userRecord.nivelNumerico === 10;

      if (!esCreadorUniversal && userRecord.rol !== tipoPortalPermitido) {
        setBombillo1('red');
        setBombillo2('red');
        setAlertMsg(
          `ACCESO DENEGADO: Su cédula corresponde a "${userRecord.cargo}". Debe ingresar por su portal habilitado.`
        );
        resetSteps();
        return;
      }

      setBombillo1('green');
      setBombillo2('green');
      setName(userRecord.name);
      setCargo(userRecord.cargo);
      setNivel(userRecord.nivel);
      setIsStep1Valid(true);
      setAlertMsg(
        `Ruta Paso 1 y 2 OK: Identidad verificada (${userRecord.name} • Nivel ${userRecord.nivel}). Ingrese su clave.`
      );
    } else {
      if (val.length >= 7) {
        setBombillo1('red');
        setAlertMsg('ALERTA: Cédula no registrada en este portal.');
        resetSteps();
      } else {
        setAlertMsg('Ruta Paso 1: Escribiendo número de cédula...');
        resetSteps();
      }
    }
  };

  const handlePasswordChange = (val: string) => {
    if (estaBloqueado || !isStep1Valid || !usuarioDetectado) return;
    setPassword(val);

    if (val.length === 0) {
      setBombillo3('white');
      setBombillo4('white');
      setIsFullyAuthorized(false);
      setAlertMsg('Ruta Paso 3: Ingrese su clave secreta.');
      return;
    }

    setBombillo3('yellow');
    setAlertMsg('Ruta Paso 3: Validando clave...');

    const isValidPass = usuarioDetectado.passwords.includes(val.trim());

    if (isValidPass) {
      setBombillo3('green');
      setBombillo4('green'); // Candado abierto
      setIsFullyAuthorized(true);
      setIntentosFallidos(0);
      setAlertMsg('¡SECUENCIA DE RUTA COMPLETADA! Candado abierto. Botón Entrar liberado.');
    } else {
      const nuevosIntentos = intentosFallidos + 1;
      setIntentosFallidos(nuevosIntentos);

      if (nuevosIntentos >= 5) {
        setEstaBloqueado(true);
        setBombillo1('red');
        setBombillo2('red');
        setBombillo3('red');
        setBombillo4('red');
        setAlertMsg(
          '⛔ SISTEMA BLOQUEADO: 5 intentos fallidos. Solo el Creador puede desbloquear este usuario.'
        );
      } else {
        setBombillo3('red');
        setBombillo4('white');
        setIsFullyAuthorized(false);
        setAlertMsg(
          `ALERTA: Clave incorrecta. Intentos fallidos: ${nuevosIntentos}/5 antes del bloqueo.`
        );
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFullyAuthorized && !estaBloqueado && usuarioDetectado) {
      onLoginSuccess(usuarioDetectado.rol, cedula.trim(), nivel);
    } else {
      setAlertMsg("ERROR: Secuencia de seguridad incompleta.");
    }
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
    <div className="w-full max-w-lg bg-[#070d1a] border border-cyan-900/50 rounded-2xl p-6 shadow-2xl relative font-mono text-cyan-100">
      <div className="text-center mb-6">
        <h1 className="text-sm font-bold tracking-widest text-cyan-300 uppercase animate-pulse">
          ⚡ {tituloPortal} ⚡
        </h1>
        <p className="text-[11px] text-cyan-400/70 mt-1">
          SYNAPSE-X OS // Guía de Ruta y Seguridad
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-cyan-300/80 mb-1 uppercase tracking-wider">
            1. Ingrese aquí su número de cédula:
          </label>
          <input
            type="text"
            value={cedula}
            onChange={(e) => handleCedulaChange(e.target.value)}
            placeholder="Ingrese su cédula..."
            disabled={estaBloqueado}
            required
            className="w-full bg-[#030712] border rounded px-3 py-2 text-cyan-100 border-cyan-900 focus:border-cyan-400 outline-none disabled:opacity-50"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-cyan-300/80 mb-1 uppercase tracking-wider">
              Nombre Completo:
            </label>
            <input
              type="text"
              value={name}
              readOnly
              placeholder="Auto-relleno por sistema..."
              className="w-full bg-[#030712]/60 border border-cyan-900/60 rounded px-3 py-2 text-cyan-300 font-semibold cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-cyan-300/80 mb-1 uppercase tracking-wider">
              Cargo:
            </label>
            <input
              type="text"
              value={cargo}
              readOnly
              placeholder="Cargo asignado..."
              className="w-full bg-[#030712]/60 border border-cyan-900/60 rounded px-3 py-2 text-cyan-300 font-semibold cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="block text-cyan-300/80 mb-1 uppercase tracking-wider">
            Nivel de Autorización:
          </label>
          <input
            type="text"
            value={nivel}
            readOnly
            placeholder="Nivel..."
            className="w-full bg-[#030712]/60 border border-cyan-900/60 rounded px-3 py-2 text-amber-400 font-semibold cursor-not-allowed"
          />
        </div>

        <div className="pt-2 border-t border-cyan-900/50">
          <label className="block text-cyan-300 uppercase tracking-wider font-semibold mb-2">
            3. Ingrese su clave secreta:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            disabled={!isStep1Valid || estaBloqueado}
            placeholder={
              isStep1Valid ? "Edite su clave aquí..." : "Bloqueado hasta ingresar cédula válida"
            }
            required
            className="w-full bg-[#030712] border rounded px-3 py-2 text-cyan-100 border-cyan-900 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="pt-3 flex justify-center">
          <button
            type="submit"
            disabled={!isFullyAuthorized || estaBloqueado}
            className={`font-bold w-full py-3 rounded text-xs uppercase tracking-widest transition-all ${
              isFullyAuthorized && !estaBloqueado
                ? 'bg-cyan-400 text-black cursor-pointer animate-pulse shadow-lg shadow-cyan-400/40'
                : 'bg-[#0d1626] text-cyan-700 cursor-not-allowed opacity-60'
            }`}
          >
            {estaBloqueado
              ? '⛔ USUARIO BLOQUEADO'
              : isFullyAuthorized
              ? '🔓 Candado Abierto - Entrar al Sistema'
              : '🔒 Ingrese Cédula y Clave para Abrir'}
          </button>
        </div>
      </form>

      {/* LOS 4 BOMBILLOS LED FÍSICOS INDEPENDIENTES */}
      <div className="mt-5 pt-3 border-t border-cyan-900/40 flex justify-between items-center px-4 bg-black/40 py-3 rounded-xl">
        <div className="flex flex-col items-center gap-1.5">
          <div
            className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${getLedColorClass(
              bombillo1
            )}`}
          />
          <span className="text-[10px] font-bold text-cyan-300">1. Cédula</span>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <div
            className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${getLedColorClass(
              bombillo2
            )}`}
          />
          <span className="text-[10px] font-bold text-cyan-300">2. Identidad</span>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <div
            className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${getLedColorClass(
              bombillo3
            )}`}
          />
          <span className="text-[10px] font-bold text-cyan-300">3. Clave</span>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <div
            className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${getLedColorClass(
              bombillo4
            )}`}
          />
          <span className="text-[10px] font-bold text-cyan-300">4. Acceso</span>
        </div>
      </div>

      <div className="mt-3 p-2.5 rounded text-[11px] font-semibold text-center border bg-[#030712] border-cyan-900/40 text-cyan-400/80">
        {alertMsg}
      </div>
    </div>
  );
}