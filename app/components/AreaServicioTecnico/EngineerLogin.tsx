'use client';

import React, { useState } from 'react';

interface EngineerLoginProps {
  onLoginSuccess: (rol: string, cedula: string, nivel: string) => void;
}

const ingenierosBD = [
  {
    cedula: "12345678",
    name: "Alexander Segundo Castellanos Perozo",
    cargo: "Creador / Super User",
    nivel: "10",
    passwords: ["synapse2026", "root9999", "admin2026"]
  },
  {
    cedula: "279276795",
    name: "Aleanny Castellanos",
    cargo: "Super User / Ingeniera",
    nivel: "8",
    passwords: ["*Aleanny123", "synapse2026"]
  }
];

export default function EngineerLogin({ onLoginSuccess }: EngineerLoginProps) {
  const [cedula, setCedula] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [cargo, setCargo] = useState<string>('');
  const [nivel, setNivel] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  const [led1, setLed1] = useState<'white' | 'yellow' | 'green' | 'red'>('white');
  const [led2, setLed2] = useState<'white' | 'yellow' | 'green' | 'red'>('white');
  const [led3, setLed3] = useState<'white' | 'yellow' | 'green' | 'red'>('white');
  const [led4, setLed4] = useState<'white' | 'yellow' | 'green' | 'red'>('white');

  const [alertMsg, setAlertMsg] = useState<string>('Paso 1: Ingrese su cédula de Ingeniero.');
  const [isStep1Valid, setIsStep1Valid] = useState<boolean>(false);
  const [usuarioDetectado, setUsuarioDetectado] = useState<any>(null);

  const handleCedulaChange = (val: string) => {
    setCedula(val);
    if (val.length === 0) {
      setLed1('white');
      setLed2('white');
      setIsStep1Valid(false);
      setName('');
      setCargo('');
      setNivel('');
      setAlertMsg('Paso 1: Ingrese su cédula.');
      return;
    }

    setLed1('yellow');
    setAlertMsg('Paso 1: Buscando ingeniero...');

    const encontrado = ingenierosBD.find(u => u.cedula.trim() === val.trim());
    if (encontrado) {
      setLed1('green');
      setLed2('green');
      setName(encontrado.name);
      setCargo(encontrado.cargo);
      setNivel(encontrado.nivel);
      setUsuarioDetectado(encontrado);
      setIsStep1Valid(true);
      setAlertMsg(`Paso 1 & 2 OK: Ingeniero reconocido (${encontrado.name}). Ingrese su clave.`);
    } else {
      if (val.length >= 7) {
        setLed1('red');
        setLed2('red');
        setAlertMsg('ALERTA: Cédula no autorizada para este portal de Ingenieros.');
        setIsStep1Valid(false);
      } else {
        setAlertMsg('Escribiendo cédula...');
      }
    }
  };

  const handlePasswordChange = (val: string) => {
    if (!isStep1Valid || !usuarioDetectado) return;
    setPassword(val);

    if (val.length === 0) {
      setLed3('white');
      setLed4('white');
      setAlertMsg('Paso 3: Ingrese clave.');
      return;
    }

    setLed3('yellow');
    const isValid = usuarioDetectado.passwords.includes(val.trim());

    if (isValid) {
      setLed3('green');
      setLed4('green');
      setAlertMsg('¡SECUENCIA OK! Candado abierto para Ingenieros.');
    } else {
      setLed3('red');
      setLed4('white');
      setAlertMsg('ALERTA: Clave incorrecta.');
    }
  };

  const isFullyAuthorized = led1 === 'green' && led2 === 'green' && led3 === 'green' && led4 === 'green';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFullyAuthorized && usuarioDetectado) {
      onLoginSuccess('ingeniero', cedula.trim(), nivel);
    } else {
      setAlertMsg('ERROR: Secuencia incompleta.');
    }
  };

  const getLedColorClass = (color: 'white' | 'yellow' | 'green' | 'red') => {
    switch (color) {
      case 'green': return 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)] border-emerald-200';
      case 'yellow': return 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.9)] border-amber-200';
      case 'red': return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.9)] border-red-200';
      default: return 'bg-slate-700 shadow-none border-slate-600';
    }
  };

  return (
    <div className="w-full max-w-lg bg-[#070d1a] border border-cyan-900/50 rounded-2xl p-5 shadow-2xl relative font-mono text-cyan-100">
      <div className="mb-4 pb-3 border-b border-cyan-900/40 flex items-center justify-between bg-black/50 px-4 py-2.5 rounded-xl">
        <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest">ESTADO LED:</span>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5"><span className={`w-3.5 h-3.5 rounded-full border ${getLedColorClass(led1)}`} /><span className="text-[10px] text-cyan-300">1</span></div>
          <div className="flex items-center space-x-1.5"><span className={`w-3.5 h-3.5 rounded-full border ${getLedColorClass(led2)}`} /><span className="text-[10px] text-cyan-300">2</span></div>
          <div className="flex items-center space-x-1.5"><span className={`w-3.5 h-3.5 rounded-full border ${getLedColorClass(led3)}`} /><span className="text-[10px] text-cyan-300">3</span></div>
          <div className="flex items-center space-x-1.5"><span className={`w-3.5 h-3.5 rounded-full border ${getLedColorClass(led4)}`} /><span className="text-[10px] text-cyan-300">4</span></div>
        </div>
      </div>

      <div className="text-center mb-5">
        <h1 className="text-sm font-bold tracking-widest text-cyan-300 uppercase animate-pulse">⚙️ PORTAL INGENIEROS (ST) ⚙️</h1>
        <p className="text-[11px] text-cyan-400/70 mt-1">Control de Servicio Técnico e Infraestructura</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        <div>
          <label className="block text-cyan-300/80 mb-1 uppercase tracking-wider">1. Cédula de Ingeniero:</label>
          <input type="text" value={cedula} onChange={(e) => handleCedulaChange(e.target.value)} placeholder="Ej: 12345678" required className="w-full bg-[#030712] border border-cyan-900 rounded px-3 py-2 text-cyan-100 outline-none focus:border-cyan-400" />
        </div>
        <div>
          <label className="block text-cyan-300/80 mb-1 uppercase tracking-wider">2. Nombre Verificado:</label>
          <input type="text" value={name} readOnly placeholder="Aguardando cédula..." className="w-full bg-[#030712]/60 border border-cyan-900/60 rounded px-3 py-2 text-cyan-300 font-semibold cursor-not-allowed" />
        </div>
        <div>
          <label className="block text-cyan-300 uppercase tracking-wider font-semibold mb-2">3. Clave Secreta:</label>
          <input type="password" value={password} onChange={(e) => handlePasswordChange(e.target.value)} disabled={!isStep1Valid} placeholder="••••••••••••" required className="w-full bg-[#030712] border border-cyan-900 rounded px-3 py-2 text-cyan-100 disabled:opacity-50" />
        </div>
        <div className="pt-2 flex justify-center">
          <button type="submit" disabled={!isFullyAuthorized} className={`font-bold w-full py-3 rounded text-xs uppercase tracking-widest transition-all ${isFullyAuthorized ? 'bg-cyan-400 text-black cursor-pointer animate-pulse shadow-lg shadow-cyan-400/40' : 'bg-[#0d1626] text-cyan-700 cursor-not-allowed opacity-60'}`}>
            {isFullyAuthorized ? '🔓 Candado Abierto - Entrar' : '🔒 Ingrese Secuencia Completa'}
          </button>
        </div>
      </form>

      <div className="mt-4 p-2.5 rounded text-[11px] font-semibold text-center border bg-[#030712] border-cyan-900/40 text-cyan-400/80">
        {alertMsg}
      </div>
    </div>
  );
}