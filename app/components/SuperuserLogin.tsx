'use client';

import React, { useState } from 'react';

interface SuperuserLoginProps {
  onLoginSuccess: (rol: string, cedula: string, clave1: string, clave2: string, modoSoloVer: boolean) => void;
}

export default function SuperuserLogin({ onLoginSuccess }: SuperuserLoginProps) {
  const [cedula, setCedula] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [key1, setKey1] = useState<string>('');
  const [key2, setKey2] = useState<string>('');
  
  const [showCedula, setShowCedula] = useState<boolean>(false);
  const [showName, setShowName] = useState<boolean>(false);
  
  const [led1, setLed1] = useState<'white' | 'yellow' | 'green' | 'red'>('white');
  const [led2, setLed2] = useState<'white' | 'yellow' | 'green' | 'red'>('white');
  const [led3, setLed3] = useState<'white' | 'yellow' | 'green' | 'red'>('white');
  const [led4, setLed4] = useState<'white' | 'yellow' | 'green' | 'red'>('white');
  
  const [alertMsg, setAlertMsg] = useState<string>('Paso 1: Ingrese su número de identificación autorizado.');
  const [isStep1Valid, setIsStep1Valid] = useState<boolean>(false);
  const [isStep3Valid, setIsStep3Valid] = useState<boolean>(false);

  // Perfiles autorizados con cédulas reales actualizadas
  const AUTHORIZED_PROFILES: { [key: string]: { name: string; tipo: 'creator' | 'daughter' } } = {
    "12345678": { name: "Alexander Segundo Castellanos Perozo (Creador)", tipo: "creator" },
    "279276795": { name: "Aleanny Castellanos (Superuser 2 - Solo Ver)", tipo: "daughter" },
    "33323644": { name: "Albany Castellanos (Superuser 3 - Solo Ver)", tipo: "daughter" }
  };

  const VALID_MASTER_KEYS = ["synapse2026", "root9999", "admin2026", "*Albany123", "*Aleanny123"];

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
    setAlertMsg('Paso 1: Verificando identidad en base de datos raíz...');

    if (AUTHORIZED_PROFILES[val.trim()]) {
      const perfil = AUTHORIZED_PROFILES[val.trim()];
      setLed1('green');
      setName(perfil.name);
      setLed2('green');
      setIsStep1Valid(true);
      setAlertMsg(`Paso 1 & 2 OK: Identidad reconocida (${perfil.name}). Proceda al Paso 3.`);
    } else {
      if (val.length >= 7) {
        setLed1('red');
        setAlertMsg('ALERTA PASO 1: Cédula no autorizada para el Portal Superuser.');
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
    setAlertMsg('Paso 3: Validando clave...');

    if (VALID_MASTER_KEYS.includes(val.trim())) {
      setLed3('green');
      setIsStep3Valid(true);
      setAlertMsg('Paso 3 OK. Proceda al Paso 4.');
    } else {
      setLed3('red');
      setIsStep3Valid(false);
      setAlertMsg('ALERTA PASO 3: Clave incorrecta.');
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
      setAlertMsg('Paso 4: Ingrese la segunda clave maestra.');
      return;
    }

    setLed4('yellow');
    setAlertMsg('Paso 4: Verificando segunda clave...');

    if (VALID_MASTER_KEYS.includes(val.trim())) {
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
      const perfil = AUTHORIZED_PROFILES[cedula.trim()];
      const esHija = perfil && perfil.tipo === 'daughter';
      
      let autorizacionTotalHijas = false;
      if (typeof window !== 'undefined') {
        autorizacionTotalHijas = localStorage.getItem("synapse_autorizacion_total_hijas") === "true";
        const ultimaActividadCreador = Number(localStorage.getItem("synapse_ultima_actividad_creador") || Date.now());
        const diasInactivo = (Date.now() - ultimaActividadCreador) / (1000 * 60 * 60 * 24);
        
        // Validación estricta de 30 días de inactividad
        if (diasInactivo >= 30) {
          autorizacionTotalHijas = true; 
        }
      }

      const modoSoloVer = esHija && !autorizacionTotalHijas;

      onLoginSuccess("superuser", cedula, key1, key2, modoSoloVer);
    } else {
      setAlertMsg("ERROR: Secuencia de seguridad incompleta.");
    }
  };

  return (
    <div className="bg-[#030712] text-slate-200 font-mono antialiased min-h-screen flex flex-col justify-between selection:bg-emerald-500 selection:text-black">
      <header className="border-b border-slate-800 bg-[#0b0f19]/80 backdrop-blur px-6 py-3 flex justify-between items-center text-xs tracking-wider">
        <div className="flex items-center space-x-3">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-slate-100 uppercase">SINAPSE-X // Portal Superuser (Creador & Respaldos)</span>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0b0f19] border border-slate-800 rounded-lg p-6 shadow-2xl relative">
          <div className="text-center mb-6">
            <h1 className="text-sm font-bold tracking-widest text-slate-100 uppercase">Portal Superuser</h1>
            <p className="text-[11px] text-slate-400 mt-1">Acceso Maestro Creador y Superusuarios 2 y 3</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
              <label className="block text-slate-400 mb-1 uppercase tracking-wider">2. Nombre Verificado:</label>
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
                className="w-full bg-[#030712] border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none"
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
                className="w-full bg-[#030712] border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-center">
              <button 
                type="submit" 
                disabled={!isFullyAuthorized}
                className={`font-bold px-6 py-2 rounded text-xs uppercase tracking-widest transition-all shadow-lg ${
                  isFullyAuthorized ? 'bg-emerald-600 hover:bg-emerald-500 text-black cursor-pointer animate-pulse' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                Entrar
              </button>
            </div>
          </form>

          <div className="mt-4 p-2.5 rounded text-[11px] font-semibold text-center border bg-[#030712] border-slate-800 text-slate-400">
            {alertMsg}
          </div>
        </div>
      </main>
    </div>
  );
}