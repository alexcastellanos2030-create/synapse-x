"use client";

import React, { useState, useEffect } from "react";
import { UsuarioRegistrado } from "../page";
import { supabase } from "../lib/supabase";

interface OperarioLoginProps {
  usuarios: UsuarioRegistrado[];
  onLoginSuccess: (rol: "admin" | "operario" | "cajera" | "supervisor" | "superuser" | "ingeniero" | "tecnico", cedula: string, clave: string) => void;
  onVolverSuperuser: () => void;
}

export default function UsuarioLogin({ usuarios: propsUsuarios, onLoginSuccess, onVolverSuperuser }: OperarioLoginProps) {
  const [usuariosLocal, setUsuariosLocal] = useState<UsuarioRegistrado[]>(propsUsuarios);
  const [inputCedula, setInputCedula] = useState("");
  const [inputClave, setInputClave] = useState("");
  const [nombreDetectado, setNombreDetectado] = useState("••••••••••••••••");
  const [errorMsg, setErrorMsg] = useState("");

  // FORZAR CARGA DIRECTA DE SUPABASE PARA QUE EN INCÓGNITO O MÓVIL SE VEAN LOS USUARIOS
  useEffect(() => {
    async function sincronizarUsuariosNube() {
      try {
        const { data, error } = await supabase.from("usuarios").select("*");
        if (!error && data && data.length > 0) {
          setUsuariosLocal(data as UsuarioRegistrado[]);
        }
      } catch (err) {
        console.error("Error al sincronizar usuarios en login:", err);
      }
    }
    sincronizarUsuariosNube();
  }, []);

  const handleCedulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ced = e.target.value;
    setInputCedula(ced);
    setErrorMsg("");

    const cedLimpia = ced.trim();
    const u = usuariosLocal.find((usr) => usr.cedula === cedLimpia);
    if (u) {
      setNombreDetectado(u.nombre);
    } else if (cedLimpia.length >= 7) {
      setNombreDetectado("⚠️ Cédula no registrada en Supabase");
    } else {
      setNombreDetectado("••••••••••••••••");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const cedulaLimpia = inputCedula.trim();
    const claveLimpia = inputClave.trim();

    const usuarioEncontrado = usuariosLocal.find((u) => u.cedula === cedulaLimpia);
    
    if (!usuarioEncontrado) {
      setErrorMsg("❌ Cédula no encontrada en el sistema.");
      return;
    }

    if (usuarioEncontrado.bloqueado) {
      setErrorMsg("⛔ Acceso denegado: Este usuario está BLOQUEADO.");
      return;
    }

    if (usuarioEncontrado.clave === claveLimpia) {
      onLoginSuccess(usuarioEncontrado.rol, cedulaLimpia, claveLimpia);
    } else {
      setErrorMsg("❌ Clave incorrecta para este operario.");
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center font-sans p-4 bg-slate-200 dark:bg-[#0d1322] text-slate-900 dark:text-white relative">
      
      <div className="absolute top-4 right-4 z-50">
        <button
          type="button"
          onClick={onVolverSuperuser}
          className="px-4 py-2 bg-slate-800 text-amber-400 border border-amber-500/40 rounded-xl text-xs font-mono font-bold shadow-lg hover:bg-slate-700 transition-all cursor-pointer"
        >
          👑 Volver a Portal Superuser
        </button>
      </div>

      <div className="w-full max-w-xl border rounded-3xl shadow-2xl p-6 space-y-6 bg-white dark:bg-[#151c2e] border-slate-300 dark:border-slate-700">
        
        <div className="text-center">
          <h1 className="text-2xl font-black text-amber-500 font-mono tracking-wider">
            SYNAPSE-X OS — OPERARIOS
          </h1>
          <p className="text-xs mt-1 text-slate-600 dark:text-slate-400">
            OSAI Industrial — Portal de Acceso de Planta
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/90 border border-red-600 text-red-300 text-xs font-mono rounded-xl text-center animate-pulse">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-400">
              Cédula del Empleado
            </label>
            <input
              type="text"
              value={inputCedula}
              onChange={handleCedulaChange}
              className="w-full p-3 rounded-xl border font-mono font-bold text-sm focus:outline-none focus:border-amber-500 bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-amber-500"
              placeholder="Ingrese su cédula"
            />
            <div className="text-[11px] text-amber-600 font-mono mt-1 font-bold">
              {nombreDetectado}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold mb-1 text-slate-700 dark:text-slate-400">
              Clave de Acceso
            </label>
            <input
              type="password"
              value={inputClave}
              onChange={(e) => { setInputClave(e.target.value); setErrorMsg(""); }}
              className="w-full p-3 rounded-xl border text-sm focus:outline-none focus:border-amber-500 bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl hover:bg-amber-400 transition-all cursor-pointer shadow-lg"
          >
            👤 Ingresar al Sistema
          </button>
        </form>

      </div>
    </div>
  );
}