'use client';

import React, { useState } from 'react';

interface UsuarioLoginProps {
  onLoginSuccess: (rol: string, cedula: string, clave: string) => void;
}

export default function UsuarioLogin({ onLoginSuccess }: UsuarioLoginProps) {
  const [cedula, setCedula] = useState<string>('');
  const [clave, setClave] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const EMPLEADOS_AUTORIZADOS: { [key: string]: { nombre: string; rol: string; clave: string } } = {
    "10433935": { nombre: "Alexander Castellanos (Administración)", rol: "superuser", clave: "1234" },
    "87654321": { nombre: "Carolina Pérez (Administración)", rol: "admin", clave: "1234" },
    "11223344": { nombre: "Jefe de Taller / Panadero", rol: "supervisor", clave: "1234" },
    "55667788": { nombre: "Operario de Producción", rol: "operario", clave: "1234" },
    "99887766": { nombre: "Personal de Despacho y Ruta", rol: "cajera", clave: "1234" }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cedulaLimpia = cedula.trim();
    const claveLimpia = clave.trim();

    if (!cedulaLimpia || !claveLimpia) {
      setErrorMsg('Por favor ingrese su cédula y clave.');
      return;
    }

    const usuarioEncontrado = EMPLEADOS_AUTORIZADOS[cedulaLimpia];

    if (usuarioEncontrado && usuarioEncontrado.clave === claveLimpia) {
      setErrorMsg('');
      onLoginSuccess(usuarioEncontrado.rol, cedulaLimpia, claveLimpia);
    } else {
      setErrorMsg('Cédula o clave incorrecta. Verifique sus credenciales de empleado.');
    }
  };

  return (
    <div className="bg-[#030712] text-purple-100 font-mono antialiased min-h-screen flex flex-col justify-between selection:bg-purple-500 selection:text-black">
      <header className="border-b border-purple-900/60 bg-[#0d0714] px-6 py-3 flex justify-between items-center text-xs tracking-wider">
        <div className="flex items-center space-x-3">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse"></span>
          <span className="font-bold text-purple-200 uppercase">SINAPSE-X // Portal de Usuario y Licenciatarios</span>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0d0714] border border-purple-900/50 rounded-lg p-6 shadow-2xl relative">
          <div className="text-center mb-6">
            <h1 className="text-sm font-bold tracking-widest text-purple-200 uppercase">Portal de Empleados y Licencia</h1>
            <p className="text-[11px] text-purple-400/70 mt-1">Área Administrativa, Producción, Despacho y Operaciones</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-purple-300/80 mb-1 uppercase tracking-wider">Número de Cédula:</label>
              <input type="text" value={cedula} onChange={(e) => setCedula(e.target.value)} placeholder="Ingrese su cédula..." required className="w-full bg-[#030712] border border-purple-900 rounded px-3 py-2 text-purple-100 focus:outline-none focus:border-purple-400" />
            </div>

            <div>
              <label className="block text-purple-300/80 mb-1 uppercase tracking-wider">Clave de Acceso:</label>
              <input type="password" value={clave} onChange={(e) => setClave(e.target.value)} placeholder="••••••••" required className="w-full bg-[#030712] border border-purple-900 rounded px-3 py-2 text-purple-100 focus:outline-none focus:border-purple-400" />
            </div>

            <div className="pt-3 flex justify-center">
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-black font-bold py-2.5 rounded text-xs uppercase tracking-widest transition-all shadow-lg cursor-pointer">
                Entrar al Sistema
              </button>
            </div>
          </form>

          {errorMsg && (
            <div className="mt-4 p-2.5 rounded text-[11px] font-semibold text-center border bg-red-950/40 border-red-900/50 text-red-400">
              {errorMsg}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}