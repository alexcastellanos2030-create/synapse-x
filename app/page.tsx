"use client";

import React, { useState, useEffect } from "react";
import UniversalLogin from "./components/AreaServicioTecnico/UniversalLogin";
import SidebarServicioTecnico from "./components/AreaServicioTecnico/SidebarServicioTecnico";
import SidebarUsuario from "./components/AreaUsuario/SidebarUsuario";
import CreadorLogin from "./components/AreaCreador/CreadorLogin";

export default function Home() {
  const [autenticado, setAutenticado] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("synapse_sesion_activa") === "true";
    }
    return false;
  });

  const [rolActivo, setRolActivo] = useState<string>(() => {
    if (typeof window !== "undefined") return localStorage.getItem("synapse_rol_activo") || "";
    return "";
  });

  const [cedulaActiva, setCedulaActiva] = useState<string>(() => {
    if (typeof window !== "undefined") return localStorage.getItem("synapse_cedula_activa") || "";
    return "";
  });

  const [nivelActivo, setNivelActivo] = useState<string>(() => {
    if (typeof window !== "undefined") return localStorage.getItem("synapse_nivel_activo") || "";
    return "";
  });

  const [portalSeleccionado, setPortalSeleccionado] = useState<"creador" | "ingeniero" | "tecnico" | "usuario">("creador");

  const [areaActiva, setAreaActiva] = useState<string>(() => {
    if (typeof window !== "undefined") return localStorage.getItem("synapse_area_activa") || "st";
    return "st";
  });

  const [estacionActiva, setEstacionActiva] = useState<string>("ST01");

  useEffect(() => {
    if (autenticado) {
      localStorage.setItem("synapse_sesion_activa", "true");
      localStorage.setItem("synapse_rol_activo", rolActivo);
      localStorage.setItem("synapse_cedula_activa", cedulaActiva);
      localStorage.setItem("synapse_nivel_activo", nivelActivo);
      localStorage.setItem("synapse_area_activa", areaActiva);
    } else {
      localStorage.removeItem("synapse_sesion_activa");
      localStorage.removeItem("synapse_rol_activo");
      localStorage.removeItem("synapse_cedula_activa");
      localStorage.removeItem("synapse_nivel_activo");
      localStorage.removeItem("synapse_area_activa");
    }
  }, [autenticado, rolActivo, cedulaActiva, nivelActivo, areaActiva]);

  const handleLoginSuccess = (rol: string, cedula: string, nivel: string) => {
    setRolActivo(rol);
    setCedulaActiva(cedula);
    setNivelActivo(nivel);
    setAutenticado(true);

    if (rol === "creador" || rol === "Creador") {
      setAreaActiva("creador");
      setEstacionActiva("AC00");
    } else if (rol === "ingeniero" || rol === "tecnico") {
      setAreaActiva("st");
      setEstacionActiva("ST01");
    } else {
      setAreaActiva("usuario");
      setEstacionActiva("AU01");
    }
  };

  const handleCerrarSesion = () => {
    setAutenticado(false);
    setRolActivo("");
    setCedulaActiva("");
    setNivelActivo("");
    localStorage.clear();
  };

  const cambiarPortal = (portal: "creador" | "ingeniero" | "tecnico" | "usuario") => {
    setPortalSeleccionado(portal);
  };

  if (!autenticado) {
    return (
      <div className="min-h-screen bg-[#030712] text-slate-100 font-mono flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
        <header className="border-b border-slate-800/80 bg-slate-950/90 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <span className="inline-block w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></span>
            <div>
              <h1 className="text-sm font-bold tracking-widest text-cyan-300 uppercase">SYNAPSE-X OS</h1>
              <p className="text-[10px] text-slate-400">Selector Central de Portales de Acceso</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => cambiarPortal("creador")} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${portalSeleccionado === "creador" ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 animate-pulse" : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"}`}>👑 Portal Creador</button>
            <button onClick={() => cambiarPortal("ingeniero")} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${portalSeleccionado === "ingeniero" ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20 animate-pulse" : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"}`}>⚙️ Portal Ingeniero (ST)</button>
            <button onClick={() => cambiarPortal("tecnico")} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${portalSeleccionado === "tecnico" ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20 animate-pulse" : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"}`}>🔧 Portal Técnico (ST)</button>
            <button onClick={() => cambiarPortal("usuario")} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${portalSeleccionado === "usuario" ? "bg-purple-500 text-black shadow-lg shadow-purple-500/20 animate-pulse" : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"}`}>🏭 Portal Empresa / Operadores</button>
          </div>
        </header>

        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-xl space-y-4 flex flex-col items-center">
            {portalSeleccionado === "creador" && (
              <CreadorLogin 
                onLoginSuccess={(rol, cedula, k1, k2, modoVer) => {
                  handleLoginSuccess(rol, cedula, "10");
                }} 
              />
            )}
            {portalSeleccionado === "ingeniero" && (<UniversalLogin tituloPortal="ÁREA DE SERVICIO TÉCNICO - INGENIEROS" tipoPortalPermitido="ingeniero" onLoginSuccess={handleLoginSuccess} />)}
            {portalSeleccionado === "tecnico" && (<UniversalLogin tituloPortal="ÁREA DE SOPORTE - TÉCNICOS" tipoPortalPermitido="tecnico" onLoginSuccess={handleLoginSuccess} />)}
            {portalSeleccionado === "usuario" && (<UniversalLogin tituloPortal="PORTAL DE OPERADORES Y LICENCIA DE EMPRESA" tipoPortalPermitido="usuario" onLoginSuccess={handleLoginSuccess} />)}
          </div>
        </main>

        <footer className="border-t border-slate-900 py-3 text-center text-[10px] text-slate-500">
          SYNAPSE-X OS Industrial Automation &copy; 2026 — Todos los derechos reservados.
        </footer>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#030712] text-slate-100 font-mono overflow-hidden">
      {areaActiva === "st" && (
        <SidebarServicioTecnico areaActiva={areaActiva} onChangeArea={(nuevaArea) => setAreaActiva(nuevaArea)} rolActivo={rolActivo} estacionActiva={estacionActiva} setEstacionActiva={setEstacionActiva} handleCerrarSesion={handleCerrarSesion} />
      )}
      {areaActiva === "usuario" && (
        <SidebarUsuario areaActiva={areaActiva} onChangeArea={(nuevaArea) => setAreaActiva(nuevaArea)} rolActivo={rolActivo} estacionActiva={estacionActiva} setEstacionActiva={setEstacionActiva} handleCerrarSesion={handleCerrarSesion} />
      )}
      {areaActiva === "creador" && (
        <SidebarServicioTecnico areaActiva={areaActiva} onChangeArea={(nuevaArea) => setAreaActiva(nuevaArea)} rolActivo={rolActivo} estacionActiva={estacionActiva} setEstacionActiva={setEstacionActiva} handleCerrarSesion={handleCerrarSesion} />
      )}

      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950/50">
        <header className="h-14 border-b border-slate-800/80 bg-slate-950/80 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs font-bold tracking-wider text-slate-200">
              ESTACIÓN ACTIVA: <span className="text-cyan-400">{estacionActiva}</span>
            </span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-3">
            <span>Operador: <strong className="text-slate-200">{cedulaActiva}</strong></span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 font-semibold">{nivelActivo || rolActivo}</span>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-cyan-400 tracking-wider uppercase">
              Consola de Operaciones - Estación {estacionActiva}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Bienvenido al entorno de trabajo unificado. La sesión se mantiene retenida de forma persistente.
            </p>
            <div className="p-4 rounded-xl bg-black/40 border border-slate-800 text-xs text-slate-400 font-mono">
              <span className="text-emerald-400">ESTADO DE PERSISTENCIA:</span> Sesión blindada y activa.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}