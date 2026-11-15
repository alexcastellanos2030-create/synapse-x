import React, { useState } from "react";
import { SUPERUSER_CREDENCIAL } from "../data/bakeryConstants";

interface SuperuserLoginProps {
  onLoginSuccess: (rol: "superuser", cedula: string, clave1: string, clave2: string) => void;
}

export default function SuperuserLogin({ onLoginSuccess }: SuperuserLoginProps) {
  const [cedula, setCedula] = useState("");
  const [clave1, setClave1] = useState("");
  const [clave2, setClave2] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // VALIDACIÓN ESTRICTA EN TIEMPO REAL PARA LOS ESTADOS LED
  const getLedState = () => {
    const cedulaLimpia = cedula.trim();
    const clave1Limpia = clave1.trim();
    const clave2Limpia = clave2.trim();

    // 1. Validar Cédula (Debe coincidir exactamente con la credencial maestra)
    if (cedulaLimpia.length > 0) {
      if (cedulaLimpia !== SUPERUSER_CREDENCIAL.cedula) {
        return "blanco_error"; // Cédula errónea o dígitos excedentes -> Regresa a Standby
      }
    } else {
      return "blanco"; // Vacío
    }

    // 2. Validar Clave 1 (Debe ser una clave válida)
    if (clave1Limpia.length > 0) {
      const esValidaClave1 = SUPERUSER_CREDENCIAL.clavesValidas.includes(clave1Limpia);
      if (!esValidaClave1) {
        return "rojo_error"; // Clave 1 errónea o extra -> Regresa a Cédula (Rojo)
      }
    } else {
      return "rojo"; // Cédula correcta, esperando Clave 1
    }

    // 3. Validar Clave 2 (Debe ser una clave válida)
    if (clave2Limpia.length > 0) {
      const esValidaClave2 = SUPERUSER_CREDENCIAL.clavesValidas.includes(clave2Limpia);
      if (!esValidaClave2) {
        return "amarillo_error"; // Clave 2 errónea o extra -> Regresa a Clave 1 (Amarillo)
      }
      return "verde"; // Todo correcto -> Acceso concedido
    }

    return "amarillo"; // Clave 1 correcta, esperando Clave 2
  };

  const estadoActual = getLedState();

  // Traducción del estado para los bombillos LED visuales
  const ledBlancoActivo = true;
  const ledRojoActivo = estadoActual !== "blanco" && estadoActual !== "blanco_error";
  const ledAmarilloActivo = estadoActual === "amarillo" || estadoActual === "amarillo_error" || estadoActual === "verde";
  const ledVerdeActivo = estadoActual === "verde";

  // Manejo de cambios con detección de errores y alertas automáticas en el botón
  const handleCedulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCedula(val);
    if (val.trim().length > 0 && val.trim() !== SUPERUSER_CREDENCIAL.cedula) {
      setErrorMsg("🚨 ALERTA: Cédula errónea o dígitos excedentes. Regresando a Standby.");
    } else {
      setErrorMsg("");
    }
  };

  const handleClave1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setClave1(val);
    if (val.trim().length > 0 && !SUPERUSER_CREDENCIAL.clavesValidas.includes(val.trim())) {
      setErrorMsg("🚨 ALERTA: Primera clave incorrecta. Regresando a Cédula.");
    } else {
      setErrorMsg("");
    }
  };

  const handleClave2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setClave2(val);
    if (val.trim().length > 0 && !SUPERUSER_CREDENCIAL.clavesValidas.includes(val.trim())) {
      setErrorMsg("🚨 ALERTA: Segunda clave incorrecta. Regresando a Clave 1.");
    } else {
      setErrorMsg("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (estadoActual !== "verde") {
      setErrorMsg("🔒 Acceso bloqueado. Complete la secuencia correctamente para encender la luz verde.");
      return;
    }
    onLoginSuccess("superuser", cedula.trim(), clave1.trim(), clave2.trim());
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center font-sans p-4 bg-slate-200 dark:bg-[#0d1322] text-slate-900 dark:text-white">
      <div className="w-full max-w-xl border rounded-3xl shadow-2xl p-6 space-y-6 bg-white dark:bg-[#151c2e] border-slate-300 dark:border-slate-700">
        
        <div className="text-center">
          <h1 className="text-2xl font-black text-amber-500 font-mono tracking-wider">
            SYNAPSE-X OS — SUPERUSER
          </h1>
          <p className="text-xs mt-1 text-slate-600 dark:text-slate-400">
            OSAI Industrial — Panel de Control y Seguridad Avanzada
          </p>
        </div>

        {/* SECUENCIA DE SEGURIDAD LED (4 BOMBILLOS) */}
        <div className="p-4 bg-black rounded-2xl border border-zinc-800 flex flex-col items-center justify-center shadow-inner">
          <span className="text-[11px] font-mono text-zinc-400 mb-3 uppercase tracking-widest">
            Secuencia de Seguridad LED Industrial
          </span>
          
          <div className="flex items-center space-x-6">
            {/* LED 1: BLANCO */}
            <div className="flex flex-col items-center gap-1">
              <div className={`w-5 h-5 rounded-full border border-zinc-600 transition-all duration-300 ${
                ledBlancoActivo ? "bg-white shadow-[0_0_15px_#ffffff]" : "bg-zinc-800 opacity-30"
              }`} />
              <span className="text-[9px] font-mono text-zinc-500">STANDBY</span>
            </div>

            {/* LED 2: ROJO */}
            <div className="flex flex-col items-center gap-1">
              <div className={`w-5 h-5 rounded-full border border-red-900 transition-all duration-300 ${
                ledRojoActivo ? "bg-red-600 shadow-[0_0_15px_#ff0000]" : "bg-zinc-800 opacity-30"
              }`} />
              <span className="text-[9px] font-mono text-zinc-500">CÉDULA</span>
            </div>

            {/* LED 3: AMARILLO */}
            <div className="flex flex-col items-center gap-1">
              <div className={`w-5 h-5 rounded-full border border-yellow-900 transition-all duration-300 ${
                ledAmarilloActivo ? "bg-yellow-400 shadow-[0_0_15px_#eab308]" : "bg-zinc-800 opacity-30"
              }`} />
              <span className="text-[9px] font-mono text-zinc-500">CLAVE 1</span>
            </div>

            {/* LED 4: VERDE */}
            <div className="flex flex-col items-center gap-1">
              <div className={`w-5 h-5 rounded-full border border-green-900 transition-all duration-300 ${
                ledVerdeActivo ? "bg-green-500 shadow-[0_0_15px_#22c55e]" : "bg-zinc-800 opacity-30"
              }`} />
              <span className="text-[9px] font-mono text-zinc-500">ACCESO</span>
            </div>
          </div>
        </div>

        {/* FORMULARIO DE ACCESO */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-400">
              Cédula de Superuser
            </label>
            <input
              type="text"
              value={cedula}
              onChange={handleCedulaChange}
              className="w-full p-3 rounded-xl border font-mono font-bold text-sm focus:outline-none focus:border-amber-500 bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-amber-500"
              placeholder="Ingrese su cédula"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-400">
              Primera Clave de Seguridad
            </label>
            <input
              type="password"
              value={clave1}
              onChange={handleClave1Change}
              className="w-full p-3 rounded-xl border text-sm focus:outline-none focus:border-amber-500 bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-400">
              Segunda Clave de Seguridad
            </label>
            <input
              type="password"
              value={clave2}
              onChange={handleClave2Change}
              className="w-full p-3 rounded-xl border text-sm focus:outline-none focus:border-amber-500 bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              placeholder="••••••••"
            />
          </div>

          {/* ALERTA DESPLEGADA DESDE EL ÁREA DEL BOTÓN AMARILLO */}
          {errorMsg && (
            <div className="p-3 bg-red-950/90 border border-red-600 text-red-300 text-xs font-mono rounded-xl text-center animate-pulse">
              {errorMsg}
            </div>
          )}

          {/* BOTÓN DE INGRESO CON CANDADO DE BLOQUEO / DESBLOQUEO */}
          <button
            type="submit"
            disabled={!ledVerdeActivo}
            className={`w-full py-3.5 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${
              ledVerdeActivo
                ? "bg-amber-500 text-slate-950 hover:bg-amber-400 cursor-pointer shadow-amber-500/20"
                : "bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed opacity-70"
            }`}
          >
            <span>{ledVerdeActivo ? "🔓" : "🔒"}</span>
            <span>{ledVerdeActivo ? "⚡ Autorizar Ingreso Superuser" : "🔒 Sistema Bloqueado (Esperando Secuencia Verde)"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}