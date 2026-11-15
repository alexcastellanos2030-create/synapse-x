'use client';

import React, { useState } from 'react';

export default function SuperuserLogin() {
  // Estados de los campos
  const [cedula, setCedula] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [key1, setKey1] = useState<string>('');
  const [key2, setKey2] = useState<string>('');
  
  // Estados de visibilidad (Candados invisibles en el extremo derecho)
  const [showCedula, setShowCedula] = useState<boolean>(false);
  const [showName, setShowName] = useState<boolean>(false);
  
  // Estados independientes para cada uno de los 4 LEDs ('white' | 'yellow' | 'green' | 'red')
  const [led1, setLed1] = useState<'white' | 'yellow' | 'green' | 'red'>('white');
  const [led2, setLed2] = useState<'white' | 'yellow' | 'green' | 'red'>('white');
  const [led3, setLed3] = useState<'white' | 'yellow' | 'green' | 'red'>('white');
  const [led4, setLed4] = useState<'white' | 'yellow' | 'green' | 'red'>('white');
  
  // Mensajes de alerta y estado detallados
  const [alertMsg, setAlertMsg] = useState<string>('Paso 1: Ingrese su número de identificación autorizado.');
  const [isStep1Valid, setIsStep1Valid] = useState<boolean>(false);
  const [isStep3Valid, setIsStep3Valid] = useState<boolean>(false);

  // Base de datos de Creador y respaldo
  const AUTHORIZED_PROFILES: { [key: string]: string } = {
    "12345678": "Alexander Segundo Castellanos Perozo (Creador)",
    "10433935": "Alexander Segundo Castellanos Perozo (Supervisor / Creador)",
    "87654321": "Hija Autorizada 1 (Respaldo Creador)",
    "11223344": "Hija Autorizada 2 (Respaldo Creador)"
  };

  // Claves maestras válidas registradas en el sistema
  const VALID_MASTER_KEYS = ["synapse2026", "root9999", "admin2026", "creador01", "key2026"];

  // ----------------------------------------------------
  // PASO 1: Validación de Cédula
  // ----------------------------------------------------
  const handleCedulaChange = (val: string) => {
    setCedula(val);
    
    if (/[^0-9]/.test(val)) {
      setLed1('red');
      setAlertMsg('ALERTA PASO 1: El número de cédula contiene caracteres no permitidos, signos o letras.');
      setIsStep1Valid(false);
      setName('');
      setLed2('white');
      return;
    }

    if (val.length === 0) {
      setLed1('white');
      setAlertMsg('Paso 1: Ingrese su número de identificación autorizado.');
      setIsStep1Valid(false);
      setName('');
      setLed2('white');
      return;
    }

    setLed1('yellow');
    setAlertMsg('Paso 1: Verificando identidad en la base de datos raíz...');

    if (AUTHORIZED_PROFILES[val.trim()]) {
      setLed1('green');
      setName(AUTHORIZED_PROFILES[val.trim()]);
      setLed2('green');
      setIsStep1Valid(true);
      setAlertMsg('Paso 1 y 2 OK: Identidad reconocida. Proceda al Paso 3 (Primera Clave Maestra).');
    } else {
      if (val.length >= 6) {
        setLed1('red');
        setAlertMsg('ALERTA PASO 1: Número de cédula no registrado en la base de datos de Superuser.');
        setIsStep1Valid(false);
        setName('');
        setLed2('white');
      } else {
        setAlertMsg('Paso 1: Escribiendo cédula... (Aguardando coincidencia)');
        setIsStep1Valid(false);
        setName('');
        setLed2('white');
      }
    }
  };

  // ----------------------------------------------------
  // PASO 3: Validación de Primera Clave
  // ----------------------------------------------------
  const handleKey1Change = (val: string) => {
    if (!isStep1Valid) {
      setAlertMsg('BLOQUEO DE SEGURIDAD: Debe completar y validar el Paso 1 (Cédula) primero.');
      return;
    }
    setKey1(val);

    if (val.length === 0) {
      setLed3('white');
      setAlertMsg('Paso 3: Ingrese su primera clave maestra.');
      setIsStep3Valid(false);
      return;
    }

    setLed3('yellow');
    setAlertMsg('Paso 3: Validando primera clave maestra...');

    if (VALID_MASTER_KEYS.includes(val.trim())) {
      setLed3('green');
      setIsStep3Valid(true);
      setAlertMsg('Paso 3 OK: Clave autorizada. Proceda al Paso 4 (Segunda Clave Maestra).');
    } else {
      setLed3('red');
      setAlertMsg('ALERTA PASO 3: La clave ingresada no coincide con ninguna clave maestra registrada.');
      setIsStep3Valid(false);
    }
  };

  // ----------------------------------------------------
  // PASO 4: Validación de Segunda Clave
  // ----------------------------------------------------
  const handleKey2Change = (val: string) => {
    if (!isStep3Valid) {
      setAlertMsg('BLOQUEO DE SEGURIDAD: Debe validar la Primera Clave (Paso 3) antes de editar aquí.');
      return;
    }
    setKey2(val);

    if (val.length === 0) {
      setLed4('white');
      setAlertMsg('Paso 4: Ingrese su segunda clave maestra (puede repetir o usar otra clave autorizada).');
      return;
    }

    setLed4('yellow');
    setAlertMsg('Paso 4: Verificando segunda clave...');

    if (VALID_MASTER_KEYS.includes(val.trim())) {
      setLed4('green');
      setAlertMsg('¡SECUENCIA COMPLETADA CON ÉXITO! Todos los pasos en verde. Botón Entrar liberado.');
    } else {
      setLed4('red');
      setAlertMsg('ALERTA PASO 4: Segunda clave incorrecta.');
    }
  };

  const isFullyAuthorized = led1 === 'green' && led2 === 'green' && led3 === 'green' && led4 === 'green';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFullyAuthorized) {
      alert("¡Acceso Total Concedido al Panel Maestro de SYNAPSE-X!");
      window.location.href = '/dashboard/dashboard-21';
    } else {
      setAlertMsg("ERROR CRÍTICO: La secuencia de seguridad no está 100% en verde.");
    }
  };

  return (
    <div className="bg-[#030712] text-slate-200 font-mono antialiased min-h-screen flex flex-col justify-between selection:bg-emerald-500 selection:text-black">
      
      {/* HEADER SUPERIOR */}
      <header className="border-b border-slate-800 bg-[#0b0f19]/80 backdrop-blur px-6 py-3 flex justify-between items-center text-xs tracking-wider">
        <div className="flex items-center space-x-3">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-slate-100 uppercase">SINAPSE-X // OS-AI Industrial</span>
        </div>
        <div className="text-slate-400">
          PORTAL: <span className="text-emerald-400 font-semibold">SUPERUSER / CREADOR & RESPALDOS</span>
        </div>
      </header>

      {/* CONTENEDOR PRINCIPAL */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0b0f19] border border-slate-800 rounded-lg p-6 shadow-2xl relative">
          
          {/* Título */}
          <div className="text-center mb-6">
            <div className="inline-flex p-3 bg-[#111827] rounded-full border border-slate-700 text-emerald-400 mb-2 shadow-inner">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h1 className="text-sm font-bold tracking-widest text-slate-100 uppercase">Portal Superuser</h1>
            <p className="text-[11px] text-slate-400 mt-1">Secuencia de 4 Pasos por Luces LED</p>
          </div>

          {/* PANEL DE 4 LUCES LED */}
          <div className="mb-6 p-3 bg-[#030712] border border-slate-800 rounded flex items-center justify-between">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">LEDs de Paso:</span>
            <div className="flex space-x-3 items-center">
              
              {/* LED 1 (Cédula) */}
              <div className="flex flex-col items-center">
                <div className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                  led1 === 'green' ? 'bg-emerald-500 shadow-[0_0_12px_rgba(34,197,94,1)]' :
                  led1 === 'yellow' ? 'bg-amber-400 shadow-[0_0_10px_rgba(234,179,8,0.9)]' :
                  led1 === 'red' ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)] animate-pulse' : 'bg-[#1f2937]'
                }`}></div>
                <span className="text-[9px] text-slate-500 mt-1">1.ID</span>
              </div>

              {/* LED 2 (Nombre Automático) */}
              <div className="flex flex-col items-center">
                <div className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                  led2 === 'green' ? 'bg-emerald-500 shadow-[0_0_12px_rgba(34,197,94,1)]' :
                  led2 === 'yellow' ? 'bg-amber-400 shadow-[0_0_10px_rgba(234,179,8,0.9)]' :
                  led2 === 'red' ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)]' : 'bg-[#1f2937]'
                }`}></div>
                <span className="text-[9px] text-slate-500 mt-1">2.AUTO</span>
              </div>

              {/* LED 3 (Clave 1) */}
              <div className="flex flex-col items-center">
                <div className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                  led3 === 'green' ? 'bg-emerald-500 shadow-[0_0_12px_rgba(34,197,94,1)]' :
                  led3 === 'yellow' ? 'bg-amber-400 shadow-[0_0_10px_rgba(234,179,8,0.9)]' :
                  led3 === 'red' ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)] animate-pulse' : 'bg-[#1f2937]'
                }`}></div>
                <span className="text-[9px] text-slate-500 mt-1">3.KEY1</span>
              </div>

              {/* LED 4 (Clave 2) */}
              <div className="flex flex-col items-center">
                <div className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                  led4 === 'green' ? 'bg-emerald-500 shadow-[0_0_12px_rgba(34,197,94,1)]' :
                  led4 === 'yellow' ? 'bg-amber-400 shadow-[0_0_10px_rgba(234,179,8,0.9)]' :
                  led4 === 'red' ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)] animate-pulse' : 'bg-[#1f2937]'
                }`}></div>
                <span className="text-[9px] text-slate-500 mt-1">4.KEY2</span>
              </div>

            </div>
          </div>

          {/* FORMULARIO */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Campo 1: Cédula */}
            <div>
              <label className="block text-slate-400 mb-1 uppercase tracking-wider">
                1. Nro. de Cédula (Editable):
              </label>
              <div className="relative">
                <input 
                  type={showCedula ? "text" : "password"} 
                  value={cedula} 
                  onChange={(e) => handleCedulaChange(e.target.value)}
                  placeholder="Ingrese número de cédula..." 
                  required 
                  className={`w-full bg-[#030712] border rounded px-3 py-2 text-slate-100 focus:outline-none transition-colors pr-10 ${led1 === 'red' ? 'border-red-500' : led1 === 'green' ? 'border-emerald-500' : 'border-slate-700'}`}
                />
                <button 
                  type="button"
                  onClick={() => setShowCedula(!showCedula)}
                  title="Candado de seguridad invisible"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity flex items-center justify-center text-emerald-400 bg-slate-800/80 rounded"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={showCedula ? "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" : "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"} />
                  </svg>
                </button>
              </div>
            </div>

            {/* Campo 2: Nombre */}
            <div>
              <label className="block text-slate-400 mb-1 uppercase tracking-wider">2. Nombre Verificado (Automático):</label>
              <div className="relative">
                <input 
                  type={showName ? "text" : "password"} 
                  value={name} 
                  readOnly 
                  placeholder="Esperando validación de cédula (Paso 1)..."
                  className="w-full bg-[#030712]/50 border border-slate-800 rounded px-3 py-2 text-emerald-400 font-semibold cursor-not-allowed pr-10"
                />
                <button 
                  type="button"
                  onClick={() => setShowName(!showName)}
                  title="Candado de seguridad invisible"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity flex items-center justify-center text-emerald-400 bg-slate-800/80 rounded"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={showName ? "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" : "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"} />
                  </svg>
                </button>
              </div>
            </div>

            {/* Campo 3: Primera Clave */}
            <div>
              <label className="block text-slate-400 mb-1 uppercase tracking-wider">3. Primera Clave Maestra:</label>
              <input 
                type="password" 
                value={key1} 
                onChange={(e) => handleKey1Change(e.target.value)}
                disabled={!isStep1Valid}
                placeholder={isStep1Valid ? "Ingrese primera clave..." : "Bloqueado (Complete Paso 1)"}
                required
                className={`w-full bg-[#030712] border rounded px-3 py-2 text-slate-100 focus:outline-none transition-colors ${!isStep1Valid ? 'opacity-50 cursor-not-allowed border-slate-800' : led3 === 'red' ? 'border-red-500' : led3 === 'green' ? 'border-emerald-500' : 'border-slate-700'}`}
              />
            </div>

            {/* Campo 4: Segunda Clave */}
            <div>
              <label className="block text-slate-400 mb-1 uppercase tracking-wider">4. Segunda Clave Maestra:</label>
              <input 
                type="password" 
                value={key2} 
                onChange={(e) => handleKey2Change(e.target.value)}
                disabled={!isStep3Valid}
                placeholder={isStep3Valid ? "Ingrese segunda clave..." : "Bloqueado (Complete Paso 3)"}
                required
                className={`w-full bg-[#030712] border rounded px-3 py-2 text-slate-100 focus:outline-none transition-colors ${!isStep3Valid ? 'opacity-50 cursor-not-allowed border-slate-800' : led4 === 'red' ? 'border-red-500' : led4 === 'green' ? 'border-emerald-500' : 'border-slate-700'}`}
              />
            </div>

            {/* Botón de Acceso */}
            <div className="pt-2 flex justify-center">
              <button 
                type="submit" 
                disabled={!isFullyAuthorized}
                className={`font-bold px-6 py-2 rounded text-xs uppercase tracking-widest transition-all shadow-lg ${
                  isFullyAuthorized 
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-[#030712] shadow-emerald-950/50 cursor-pointer animate-pulse' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                Entrar
              </button>
            </div>
          </form>

          {/* Cuadro de Alertas */}
          <div className={`mt-4 p-2.5 rounded text-[11px] font-semibold text-center transition-all border ${
            led1 === 'red' || led3 === 'red' || led4 === 'red' 
              ? 'bg-red-950/40 border-red-900/50 text-red-400 animate-pulse' 
              : isFullyAuthorized 
              ? 'bg-emerald-950/40 border-emerald-900/50 text-emerald-400' 
              : 'bg-[#030712] border-slate-800 text-slate-400'
          }`}>
            {alertMsg}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-[#0b0f19]/80 px-6 py-2 text-[10px] text-slate-500 flex justify-between">
        <span>SINAPSE-X OS-AI Industrial</span>
        <span>Margen de error: 0.01%</span>
      </footer>

    </div>
  );
}