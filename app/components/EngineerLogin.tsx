'use client';

import React, { useState, useEffect } from 'react';

export default function EngineerLogin() {
  // Estados del formulario
  const [cedula, setCedula] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [cargo, setCargo] = useState<string>('');
  const [nivel, setNivel] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  // Modo de autenticación: 'password' o 'otp'
  const [authMode, setAuthMode] = useState<'password' | 'otp'>('password');
  const [otpInput, setOtpInput] = useState<string>('');
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [otpTimer, setOtpTimer] = useState<number>(0);
  const [otpSent, setOtpSent] = useState<boolean>(false);

  // Estados de los 4 LEDs de paso (cyan theme)
  const [led1, setLed1] = useState<'white' | 'yellow' | 'green' | 'red'>('white');
  const [led2, setLed2] = useState<'white' | 'yellow' | 'green' | 'red'>('white');
  const [led3, setLed3] = useState<'white' | 'yellow' | 'green' | 'red'>('white');
  const [led4, setLed4] = useState<'white' | 'yellow' | 'green' | 'red'>('white');

  // Mensajes de alerta y estado
  const [alertMsg, setAlertMsg] = useState<string>('Paso 1: Ingrese el número de cédula del Ingeniero en Sistemas.');
  const [isStep1Valid, setIsStep1Valid] = useState<boolean>(false);
  const [isStep3Valid, setIsStep3Valid] = useState<boolean>(false);

  // Base de datos simulada de Ingenieros en Sistemas autorizados
  const ENGINEER_DATABASE: { [key: string]: { name: string; nivel: string; pass: string; phone: string } } = {
    "40111222": { name: "Ing. Carlos Mendoza", nivel: "Nivel 3 (Arquitectura Core)", pass: "eng2026sys", phone: "+56 9 8765 4321" },
    "40333444": { name: "Ing. Sofía Valenzuela", nivel: "Nivel 2 (Redes y Protocolos)", pass: "sysnet99", phone: "+56 9 1234 5678" },
    "40555666": { name: "Ing. Esteban Silva", nivel: "Nivel 1 (Soporte de Núcleo)", pass: "core1234", phone: "+56 9 5555 4433" }
  };

  // Temporizador para el OTP SMS
  useEffect(() => {
    let interval: any;
    if (otpTimer > 0) {
      interval = setInterval(() => setOtpTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // ----------------------------------------------------
  // PASO 1: Validación de Cédula del Ingeniero
  // ----------------------------------------------------
  const handleCedulaChange = (val: string) => {
    setCedula(val);

    if (/[^0-9]/.test(val)) {
      setLed1('red');
      setAlertMsg('ALERTA PASO 1: El número de cédula solo debe contener dígitos numéricos.');
      resetStepsAfter1();
      return;
    }

    if (val.length === 0) {
      setLed1('white');
      setAlertMsg('Paso 1: Ingrese el número de cédula del Ingeniero en Sistemas.');
      resetStepsAfter1();
      return;
    }

    setLed1('yellow');
    setAlertMsg('Paso 1: Consultando registro de ingeniería en sistemas...');

    if (ENGINEER_DATABASE[val.trim()]) {
      const eng = ENGINEER_DATABASE[val.trim()];
      setLed1('green');
      setName(eng.name);
      setCargo("Ingeniero en Sistema");
      setNivel(eng.nivel);
      setLed2('green'); // Paso 2 automático completado en verde
      setIsStep1Valid(true);
      setAlertMsg(`Paso 1 & 2 OK: Ingeniero identificado (${eng.name} - ${eng.nivel}). Proceda al Paso 3 (Autenticación).`);
    } else {
      if (val.length >= 7) {
        setLed1('red');
        setAlertMsg('ALERTA PASO 1: Cédula no encontrada en la base de datos de Ingeniería.');
        resetStepsAfter1();
      } else {
        setAlertMsg('Paso 1: Escribiendo cédula...');
        resetStepsAfter1();
      }
    }
  };

  const resetStepsAfter1 = () => {
    setIsStep1Valid(false);
    setName('');
    setCargo('');
    setNivel('');
    setLed2('white');
    setLed3('white');
    setLed4('white');
    setIsStep3Valid(false);
  };

  // ----------------------------------------------------
  // GENERAR TOKEN SMS (OTP de 6 dígitos)
  // ----------------------------------------------------
  const handleRequestOtp = () => {
    if (!isStep1Valid) return;
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomCode);
    setOtpSent(true);
    setOtpTimer(60); // 60 segundos de validez
    const engPhone = ENGINEER_DATABASE[cedula.trim()].phone;
    setAlertMsg(`SMS ENVIADO: Código de 6 dígitos despachado al móvil ${engPhone}. (Modo simulación token: ${randomCode})`);
  };

  // ----------------------------------------------------
  // PASO 3: Validación de Clave o Código OTP SMS
  // ----------------------------------------------------
  const handlePasswordChange = (val: string) => {
    if (!isStep1Valid) {
      setAlertMsg('BLOQUEO: Debe validar la cédula (Paso 1) primero.');
      return;
    }
    setPassword(val);

    if (val.length === 0) {
      setLed3('white');
      setAlertMsg('Paso 3: Ingrese su clave de ingeniero.');
      setIsStep3Valid(false);
      setLed4('white');
      return;
    }

    setLed3('yellow');
    setAlertMsg('Paso 3: Verificando clave de acceso...');

    const validPass = ENGINEER_DATABASE[cedula.trim()].pass;
    if (val === validPass) {
      setLed3('green');
      setLed4('green'); // Paso 4 se activa directo al validar la credencial
      setIsStep3Valid(true);
      setAlertMsg('¡SECUENCIA COMPLETADA! Credenciales de Ingeniero verificadas. Botón Entrar liberado.');
    } else {
      setLed3('red');
      setLed4('white');
      setIsStep3Valid(false);
      setAlertMsg('ALERTA PASO 3: Clave de ingeniero incorrecta.');
    }
  };

  const handleOtpInput = (val: string) => {
    if (!isStep1Valid) return;
    setOtpInput(val);

    if (val.length === 0) {
      setLed3('white');
      setAlertMsg('Paso 3: Ingrese el código OTP de 6 dígitos recibido por mensaje.');
      setIsStep3Valid(false);
      setLed4('white');
      return;
    }

    setLed3('yellow');
    setAlertMsg('Paso 3: Validando token SMS de un solo uso...');

    if (otpTimer > 0 && val === generatedOtp) {
      setLed3('green');
      setLed4('green');
      setIsStep3Valid(true);
      setAlertMsg('¡TOKEN SMS VÁLIDO! Token invalidado para futuros usos. Botón Entrar liberado.');
    } else {
      setLed3('red');
      setLed4('white');
      setIsStep3Valid(false);
      setAlertMsg(otpTimer === 0 ? 'ALERTA: El token SMS ha expirado. Solicite uno nuevo.' : 'ALERTA PASO 3: Código OTP incorrecto.');
    }
  };

  // Validación final
  const isFullyAuthorized = led1 === 'green' && led2 === 'green' && led3 === 'green' && led4 === 'green';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFullyAuthorized) {
      alert("¡Acceso concedido al Portal de Ingeniería en Sistemas de SINAPSE-X!");
      // window.location.href = '/dashboard/engineer';
    } else {
      setAlertMsg("ERROR: Secuencia de seguridad incompleta.");
    }
  };

  return (
    <div className="bg-[#030712] text-cyan-100 font-mono antialiased min-h-screen flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      
      {/* HEADER SUPERIOR (Diferente combinación: acentos cian/azul) */}
      <header className="border-b border-cyan-900/60 bg-[#070d1a] px-6 py-3 flex justify-between items-center text-xs tracking-wider">
        <div className="flex items-center space-x-3">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="font-bold text-cyan-200 uppercase">SINAPSE-X // Portal Ingeniero en Sistemas</span>
        </div>
        <div className="text-cyan-400/80">
          SEC_LEVEL: <span className="text-cyan-300 font-semibold">SYS_ENGINEER_ROOT</span>
        </div>
      </header>

      {/* CONTENEDOR PRINCIPAL */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-[#070d1a] border border-cyan-900/50 rounded-lg p-6 shadow-2xl relative">
          
          {/* Icono & Título */}
          <div className="text-center mb-6">
            <div className="inline-flex p-3 bg-[#0d1626] rounded-full border border-cyan-800 text-cyan-400 mb-2 shadow-inner">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h1 className="text-sm font-bold tracking-widest text-cyan-200 uppercase">Ingeniería de Sistemas & Core</h1>
            <p className="text-[11px] text-cyan-400/70 mt-1">Resolución de Incidencias & Arquitectura Operativa</p>
          </div>

          {/* PANEL DE 4 LUCES LED (Secuenciales) */}
          <div className="mb-6 p-3 bg-[#030712] border border-cyan-900/40 rounded flex items-center justify-between">
            <span className="text-[11px] text-cyan-400/80 uppercase tracking-wider font-semibold">LEDs de Paso:</span>
            <div className="flex space-x-4 items-center">
              
              {/* LED 1 (Cédula) */}
              <div className="flex flex-col items-center">
                <div className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                  led1 === 'green' ? 'bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,1)]' :
                  led1 === 'yellow' ? 'bg-amber-400 shadow-[0_0_10px_rgba(234,179,8,0.9)]' :
                  led1 === 'red' ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)] animate-pulse' : 'bg-[#111c2e]'
                }`}></div>
                <span className="text-[9px] text-cyan-500 mt-1">1.ID</span>
              </div>

              {/* LED 2 (Autocompletado Datos) */}
              <div className="flex flex-col items-center">
                <div className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                  led2 === 'green' ? 'bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,1)]' :
                  led2 === 'yellow' ? 'bg-amber-400 shadow-[0_0_10px_rgba(234,179,8,0.9)]' :
                  led2 === 'red' ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)]' : 'bg-[#111c2e]'
                }`}></div>
                <span className="text-[9px] text-cyan-500 mt-1">2.AUTO</span>
              </div>

              {/* LED 3 (Autenticación Clave/OTP) */}
              <div className="flex flex-col items-center">
                <div className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                  led3 === 'green' ? 'bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,1)]' :
                  led3 === 'yellow' ? 'bg-amber-400 shadow-[0_0_10px_rgba(234,179,8,0.9)]' :
                  led3 === 'red' ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)] animate-pulse' : 'bg-[#111c2e]'
                }`}></div>
                <span className="text-[9px] text-cyan-500 mt-1">3.AUTH</span>
              </div>

              {/* LED 4 (Clearance Final) */}
              <div className="flex flex-col items-center">
                <div className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                  led4 === 'green' ? 'bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,1)]' :
                  led4 === 'yellow' ? 'bg-amber-400 shadow-[0_0_10px_rgba(234,179,8,0.9)]' :
                  led4 === 'red' ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)]' : 'bg-[#111c2e]'
                }`}></div>
                <span className="text-[9px] text-cyan-500 mt-1">4.READY</span>
              </div>

            </div>
          </div>

          {/* FORMULARIO */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Campo 1: Nro. de Cédula (Editable y Visible) */}
            <div>
              <label className="block text-cyan-300/80 mb-1 uppercase tracking-wider">1. Nro. de Cédula (Editable):</label>
              <input 
                type="text" 
                value={cedula} 
                onChange={(e) => handleCedulaChange(e.target.value)}
                placeholder="Ingrese número de cédula del ingeniero..." 
                required 
                className={`w-full bg-[#030712] border rounded px-3 py-2 text-cyan-100 focus:outline-none transition-colors ${led1 === 'red' ? 'border-red-500' : led1 === 'green' ? 'border-cyan-400' : 'border-cyan-900'}`}
              />
            </div>

            {/* Fila con Datos Automáticos (Nombre y Cargo) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-cyan-300/80 mb-1 uppercase tracking-wider">2A. Nombre (Automático):</label>
                <input 
                  type="text" 
                  value={name} 
                  readOnly 
                  placeholder="Esperando cédula..."
                  className="w-full bg-[#030712]/60 border border-cyan-900/60 rounded px-3 py-2 text-cyan-300 font-semibold cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-cyan-300/80 mb-1 uppercase tracking-wider">2B. Cargo (Automático):</label>
                <input 
                  type="text" 
                  value={cargo} 
                  readOnly 
                  placeholder="Cargo asignado..."
                  className="w-full bg-[#030712]/60 border border-cyan-900/60 rounded px-3 py-2 text-cyan-300 font-semibold cursor-not-allowed"
                />
              </div>
            </div>

            {/* Campo de Nivel Automático */}
            <div>
              <label className="block text-cyan-300/80 mb-1 uppercase tracking-wider">2C. Nivel del Ingeniero (Automático):</label>
              <input 
                type="text" 
                value={nivel} 
                readOnly 
                placeholder="Nivel 1, 2 o 3 (Según base de datos)..."
                className="w-full bg-[#030712]/60 border border-cyan-900/60 rounded px-3 py-2 text-amber-400 font-semibold cursor-not-allowed"
              />
            </div>

            {/* Selector de Método de Autenticación (Clave vs Token SMS) */}
            <div className="pt-2 border-t border-cyan-900/50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-cyan-300 uppercase tracking-wider font-semibold">3. Método de Autenticación:</span>
                <div className="space-x-2">
                  <button 
                    type="button"
                    onClick={() => { setAuthMode('password'); setOtpInput(''); }}
                    className={`px-2 py-1 rounded text-[10px] ${authMode === 'password' ? 'bg-cyan-600 text-black font-bold' : 'bg-cyan-950 text-cyan-400'}`}
                  >
                    Clave Única
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setAuthMode('otp'); setPassword(''); }}
                    className={`px-2 py-1 rounded text-[10px] ${authMode === 'otp' ? 'bg-cyan-600 text-black font-bold' : 'bg-cyan-950 text-cyan-400'}`}
                  >
                    Token SMS OTP
                  </button>
                </div>
              </div>

              {authMode === 'password' ? (
                <div>
                  <label className="block text-cyan-300/80 mb-1 uppercase tracking-wider">Clave de Ingeniero:</label>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    disabled={!isStep1Valid}
                    placeholder={isStep1Valid ? "Ingrese clave única..." : "Bloqueado (Complete Paso 1)"}
                    required
                    className={`w-full bg-[#030712] border rounded px-3 py-2 text-cyan-100 focus:outline-none transition-colors ${!isStep1Valid ? 'opacity-50 cursor-not-allowed border-cyan-950' : led3 === 'red' ? 'border-red-500' : led3 === 'green' ? 'border-cyan-400' : 'border-cyan-900'}`}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2 items-center">
                    <button 
                      type="button"
                      onClick={handleRequestOtp}
                      disabled={!isStep1Valid || otpTimer > 0}
                      className={`px-3 py-2 rounded text-[11px] font-bold uppercase transition-all ${!isStep1Valid || otpTimer > 0 ? 'bg-cyan-950 text-cyan-700 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-500 text-black'}`}
                    >
                      {otpTimer > 0 ? `Reenviar en ${otpTimer}s` : 'Enviar Código SMS'}
                    </button>
                    <span className="text-[10px] text-cyan-400/70">Código de 6 dígitos único para esta sesión.</span>
                  </div>
                  <input 
                    type="text" 
                    maxLength={6}
                    value={otpInput} 
                    onChange={(e) => handleOtpInput(e.target.value)}
                    disabled={!otpSent}
                    placeholder={otpSent ? "Ingrese código de 6 dígitos..." : "Pulse 'Enviar Código SMS' primero"}
                    className={`w-full bg-[#030712] border rounded px-3 py-2 text-cyan-100 focus:outline-none transition-colors tracking-widest text-center font-bold ${!otpSent ? 'opacity-50 cursor-not-allowed border-cyan-950' : led3 === 'red' ? 'border-red-500' : led3 === 'green' ? 'border-cyan-400' : 'border-cyan-900'}`}
                  />
                </div>
              )}
            </div>

            {/* Botón de Acceso (Bloqueado hasta luz verde total) */}
            <div className="pt-3 flex justify-center">
              <button 
                type="submit" 
                disabled={!isFullyAuthorized}
                className={`font-bold px-8 py-2.5 rounded text-xs uppercase tracking-widest transition-all shadow-lg ${
                  isFullyAuthorized 
                    ? 'bg-cyan-400 hover:bg-cyan-300 text-black shadow-cyan-950/80 cursor-pointer animate-pulse' 
                    : 'bg-[#0d1626] text-cyan-700 cursor-not-allowed border border-cyan-900/60'
                }`}
              >
                Entrar al Sistema
              </button>
            </div>
          </form>

          {/* Caja de Alertas y Retroalimentación */}
          <div className={`mt-4 p-2.5 rounded text-[11px] font-semibold text-center transition-all border ${
            led1 === 'red' || led3 === 'red' 
              ? 'bg-red-950/40 border-red-900/50 text-red-400 animate-pulse' 
              : isFullyAuthorized 
              ? 'bg-cyan-950/40 border-cyan-900/50 text-cyan-300' 
              : 'bg-[#030712] border-cyan-900/40 text-cyan-400/80'
          }`}>
            {alertMsg}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-cyan-900/60 bg-[#070d1a] px-6 py-2 text-[10px] text-cyan-500 flex justify-between">
        <span>SINAPSE-X OS-AI Industrial</span>
        <span>Margen de error: 0.01%</span>
      </footer>

    </div>
  );
}