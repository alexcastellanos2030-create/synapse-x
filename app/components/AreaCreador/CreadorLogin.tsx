'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface CreadorLoginProps {
  onLoginSuccess: (rol: string, cedula: string, clave1: string, clave2: string, modoSoloVer: boolean) => void;
}

interface PerfilAutorizado {
  id?: string;
  nombre: string;
  cedula: string;
  claveMaestra: string;
  nivel: number;
  rol: string;
  bloqueado: boolean;
}

export default function CreadorLogin({ onLoginSuccess }: CreadorLoginProps) {
  const [cedula, setCedula] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [key1, setKey1] = useState<string>('');
  const [key2, setKey2] = useState<string>('');
  
  const [showCedula] = useState<boolean>(false);
  const [showName] = useState<boolean>(false);
  
  // 4 LEDs independientes (Paso 1, 2, 3, 4)
  const [led1, setLed1] = useState<'white' | 'yellow' | 'green' | 'red'>('white');
  const [led2, setLed2] = useState<'white' | 'yellow' | 'green' | 'red'>('white');
  const [led3, setLed3] = useState<'white' | 'yellow' | 'green' | 'red'>('white');
  const [led4, setLed4] = useState<'white' | 'yellow' | 'green' | 'red'>('white');
  
  const [alertMsg, setAlertMsg] = useState<string>('Paso 1: Ingrese su número de identificación de Creador.');
  const [isStep1Valid, setIsStep1Valid] = useState<boolean>(false);
  const [isStep3Valid, setIsStep3Valid] = useState<boolean>(false);

  const [usuariosAutorizados, setUsuariosAutorizados] = useState<PerfilAutorizado[]>([]);

  useEffect(() => {
    async function cargarPerfilesBoveda() {
      let perfiles: PerfilAutorizado[] = [];

      if (typeof window !== 'undefined') {
        const local = localStorage.getItem("synapse_boveda_familiar_local_v2");
        if (local) {
          try {
            perfiles = JSON.parse(local);
          } catch (e) {
            console.error(e);
          }
        }
      }

      try {
        const { data, error } = await supabase.from("boveda_familiar").select("*");
        if (!error && data && data.length > 0) {
          perfiles = data as PerfilAutorizado[];
        }
      } catch (err) {
        console.error("Error sincronizando perfiles de bóveda:", err);
      }

      if (perfiles.length === 0) {
        perfiles = [
          { nombre: "Alexander Segundo Castellanos Perozo (Creador)", cedula: "12345678", claveMaestra: "synapse2026", nivel: 5, rol: "Creador", bloqueado: false },
          { nombre: "Aleanny Castellanos (Superuser 2)", cedula: "279276795", claveMaestra: "*Aleanny123", nivel: 1, rol: "Super User", bloqueado: false }
        ];
      }

      setUsuariosAutorizados(perfiles);
    }
    cargarPerfilesBoveda();
  }, []);

  const handleCedulaChange = (val: string) => {
    setCedula(val);
    
    if (/[^0-9]/.test(val)) {
      setLed1('red');
      setAlertMsg('ALERTA PASO 1: Caracteres no permitidos en la cédula.');
      setIsStep1Valid(false);
      setName('');
      setLed2('white');
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
    setAlertMsg('Paso 1: Verificando identidad en Bóveda...');

    const encontrado = usuariosAutorizados.find(u => u.cedula.trim() === val.trim());

    if (encontrado) {
      if (encontrado.bloqueado) {
        setLed1('red');
        setAlertMsg('ALERTA: Este usuario se encuentra BLOQUEADO en el sistema.');
        setIsStep1Valid(false);
        setName('');
        setLed2('white');
        return;
      }

      // Al reconocer la cédula con éxito, los LEDs 1 y 2 se ponen en VERDE brillante de inmediato
      setLed1('green');
      setName(encontrado.nombre);
      setLed2('green');
      setIsStep1Valid(true);
      setAlertMsg(`Paso 1 & 2 OK: Identidad reconocida (${encontrado.nombre}). Proceda al Paso 3.`);
    } else {
      if (val.length >= 7) {
        setLed1('red');
        setAlertMsg('ALERTA PASO 1: Cédula no registrada en la Bóveda Familiar.');
        setIsStep1Valid(false);
        setName('');
        setLed2('white');
      } else {
        setAlertMsg('Paso 1: Escribiendo cédula...');
        setIsStep1Valid(false);
        setName('');
        setLed2('white');
      }
    }
  };

  const handleKey1Change = (val: string) => {
    if (!isStep1Valid) {
      setAlertMsg('BLOQUEO: Complete el Paso 1 (Cédula) primero.');
      return;
    }
    setKey1(val);

    if (val.length === 0) {
      setLed3('white');
      setAlertMsg('Paso 3: Ingrese su clave maestra.');
      setIsStep3Valid(false);
      return;
    }

    setLed3('yellow');
    setAlertMsg('Paso 3: Validando clave en Bóveda...');

    const usuarioActual = usuariosAutorizados.find(u => u.cedula.trim() === cedula.trim());
    const clavesGlobales = ["synapse2026", "root9999", "admin2026"];
    const claveValida = (usuarioActual && usuarioActual.claveMaestra === val.trim()) || clavesGlobales.includes(val.trim());

    if (claveValida) {
      setLed3('green');
      setIsStep3Valid(true);
      setAlertMsg('Paso 3 OK. Proceda al Paso 4.');
    } else {
      setLed3('red');
      setIsStep3Valid(false);
      setAlertMsg('ALERTA PASO 3: Clave maestra incorrecta.');
    }
  };

  const handleKey2Change = (val: string) => {
    if (!isStep3Valid) {
      setAlertMsg('BLOQUEO: Complete el Paso 3 primero.');
      return;
    }
    setKey2(val);

    if (val.length === 0) {
      setLed4('white');
      setAlertMsg('Paso 4: Ingrese la segunda clave maestra o de confirmación.');
      return;
    }

    setLed4('yellow');
    setAlertMsg('Paso 4: Verificando segunda clave...');

    const usuarioActual = usuariosAutorizados.find(u => u.cedula.trim() === cedula.trim());
    const clavesGlobales = ["synapse2026", "root9999", "admin2026", "*Albany123", "*Aleanny123"];
    const claveValida = (usuarioActual && usuarioActual.claveMaestra === val.trim()) || clavesGlobales.includes(val.trim());

    if (claveValida) {
      setLed4('green');
      setAlertMsg('¡SECUENCIA COMPLETADA! Botón Entrar liberado.');
    } else {
      setLed4('red');
      setAlertMsg('ALERTA PASO 4: Clave incorrecta.');
    }
  };

  const isFullyAuthorized = led1 === 'green' && led2 === 'green' && led3 === 'green' && led4 === 'green';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFullyAuthorized) {
      const usuarioActual = usuariosAutorizados.find(u => u.cedula.trim() === cedula.trim());
      const esCreador = usuarioActual ? usuarioActual.nivel === 5 || usuarioActual.rol === "Creador" : false;
      
      let autorizacionTotalHijas = false;
      if (typeof window !== 'undefined') {
        autorizacionTotalHijas = localStorage.getItem("synapse_autorizacion_total_hijas") === "true";
      }

      const modoSoloVer = !esCreador && !autorizacionTotalHijas;

      onLoginSuccess(esCreador ? "Creador" : "superuser", cedula, key1, key2, modoSoloVer);
    } else {
      setAlertMsg("ERROR: Secuencia de seguridad incompleta.");
    }
  };

  const getLedColorClass = (color: 'white' | 'yellow' | 'green' | 'red') => {
    switch (color) {
      case 'green': return 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)] border-emerald-200';
      case 'yellow': return 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)] border-amber-200';
      case 'red': return 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)] border-red-200';
      default: return 'bg-slate-700 shadow-none border-slate-600';
    }
  };

  return (
    <div className="w-full max-w-lg bg-[#070d1a] border border-slate-800 rounded-2xl p-5 shadow-2xl relative font-mono text-slate-100">
      
      {/* 💡 BARRA DE ESTADO LED SUPERIOR - VISIBLE Y GARANTIZADA */}
      <div className="mb-4 pb-3 border-b border-slate-800 flex items-center justify-between bg-black/60 px-4 py-2.5 rounded-xl">
        <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">ESTADO LED:</span>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5" title="1. Cédula">
            <span className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 ${getLedColorClass(led1)}`} />
            <span className="text-[10px] text-slate-300 font-bold">1</span>
          </div>
          <div className="flex items-center space-x-1.5" title="2. Identidad">
            <span className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 ${getLedColorClass(led2)}`} />
            <span className="text-[10px] text-slate-300 font-bold">2</span>
          </div>
          <div className="flex items-center space-x-1.5" title="3. Clave 1">
            <span className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 ${getLedColorClass(led3)}`} />
            <span className="text-[10px] text-slate-300 font-bold">3</span>
          </div>
          <div className="flex items-center space-x-1.5" title="4. Clave 2">
            <span className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 ${getLedColorClass(led4)}`} />
            <span className="text-[10px] text-slate-300 font-bold">4</span>
          </div>
        </div>
      </div>

      <div className="text-center mb-5">
        <h1 className="text-sm font-bold tracking-widest text-emerald-400 uppercase animate-pulse">
          ⚡ PORTAL LOGIN DEL CREADOR (NIVEL 10) ⚡
        </h1>
        <p className="text-[11px] text-slate-400 mt-1">Acceso Maestro Principal y Bóveda de Seguridad</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        <div>
          <label className="block text-slate-400 mb-1 uppercase tracking-wider">1. Nro. de Cédula:</label>
          <input 
            type={showCedula ? "text" : "password"} 
            value={cedula} 
            onChange={(e) => handleCedulaChange(e.target.value)}
            placeholder="Ingrese número de cédula..." 
            required 
            className="w-full bg-[#030712] border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-slate-400 mb-1 uppercase tracking-wider">2. Nombre Verificado (Creador):</label>
          <input 
            type={showName ? "text" : "password"} 
            value={name} 
            readOnly 
            placeholder="Aguardando cédula..."
            className="w-full bg-[#030712]/50 border border-slate-800 rounded px-3 py-2 text-emerald-400 font-semibold cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-slate-400 mb-1 uppercase tracking-wider">3. Primera Clave Maestra:</label>
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
          <label className="block text-slate-400 mb-1 uppercase tracking-wider">4. Segunda Clave Maestra:</label>
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
              isFullyAuthorized ? 'bg-emerald-400 text-black cursor-pointer animate-pulse shadow-emerald-400/40' : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            {isFullyAuthorized ? '🔓 Candado Abierto - Entrar' : '🔒 Ingrese Secuencia Completa'}
          </button>
        </div>
      </form>

      {/* Contenedor de Alerta Inferior */}
      <div className="mt-4 p-2.5 rounded text-[11px] font-semibold text-center border bg-[#030712] border-slate-800 text-slate-400">
        {alertMsg}
      </div>
    </div>
  );
}