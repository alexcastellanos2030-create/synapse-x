"use client";

import React, { useState, useEffect } from "react";
import UniversalLogin from "./components/AreaServicioTecnico/UniversalLogin";
import SidebarServicioTecnico from "./components/AreaServicioTecnico/SidebarServicioTecnico";
import SidebarUsuario from "./components/AreaUsuario/SidebarUsuario";
import CreadorLogin from "./components/AreaCreador/CreadorLogin";
import BovedaFamiliarAC01 from "./components/AreaCreador/PortalesCreador/BovedaFamiliarAC01";

const CLAVES_SESION = [
  "synapse_sesion_activa",
  "synapse_rol_activo",
  "synapse_cedula_activa",
  "synapse_nivel_activo",
  "synapse_area_activa",
  "synapse_estacion_activa",
];

export default function Home() {
  const [sesionLista, setSesionLista] = useState<boolean>(false);
  const [autenticado, setAutenticado] = useState<boolean>(false);
  const [rolActivo, setRolActivo] = useState<string>("");
  const [cedulaActiva, setCedulaActiva] = useState<string>("");
  const [nivelActivo, setNivelActivo] = useState<string>("");
  const [portalSeleccionado, setPortalSeleccionado] = useState<
    "creador" | "ingeniero" | "tecnico" | "usuario"
  >("creador");
  const [areaActiva, setAreaActiva] = useState<string>("creador");
  const [estacionActiva, setEstacionActiva] = useState<string>("AC01");
  const [avisoActualizacion, setAvisoActualizacion] = useState<string>("");

  // 1. Restaurar sesión al cargar o refrescar la URL
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const sesionGuardada = localStorage.getItem("synapse_sesion_activa") === "true";
      const rolGuardado = localStorage.getItem("synapse_rol_activo") || "";
      const cedulaGuardada = localStorage.getItem("synapse_cedula_activa") || "";
      const nivelGuardado = localStorage.getItem("synapse_nivel_activo") || "";
      const areaGuardada = localStorage.getItem("synapse_area_activa") || "creador";
      const estacionGuardada = localStorage.getItem("synapse_estacion_activa") || "AC01";

      if (sesionGuardada && cedulaGuardada) {
        setAutenticado(true);
        setRolActivo(rolGuardado);
        setCedulaActiva(cedulaGuardada);
        setNivelActivo(nivelGuardado);
        setAreaActiva(areaGuardada);
        setEstacionActiva(estacionGuardada);
      }
    } catch (err) {
      console.error("Error restaurando sesión:", err);
    } finally {
      setSesionLista(true);
    }
  }, []);

  // 2. Persistir cambios solo cuando la sesión ya fue restaurada y está activa
  useEffect(() => {
    if (!sesionLista || typeof window === "undefined") return;

    if (autenticado) {
      localStorage.setItem("synapse_sesion_activa", "true");
      localStorage.setItem("synapse_rol_activo", rolActivo);
      localStorage.setItem("synapse_cedula_activa", cedulaActiva);
      localStorage.setItem("synapse_nivel_activo", nivelActivo);
      localStorage.setItem("synapse_area_activa", areaActiva);
      localStorage.setItem("synapse_estacion_activa", estacionActiva);
    }
  }, [sesionLista, autenticado, rolActivo, cedulaActiva, nivelActivo, areaActiva, estacionActiva]);

  const handleLoginSuccess = (rol: string, cedula: string, nivel: string) => {
    let nuevaArea = "usuario";
    let nuevaEstacion = "AU01";

    if (rol === "creador" || rol === "Creador") {
      nuevaArea = "creador";
      nuevaEstacion = "AC01";
    } else if (rol === "ingeniero" || rol === "tecnico") {
      nuevaArea = "st";
      nuevaEstacion = "ST01";
    }

    setRolActivo(rol);
    setCedulaActiva(cedula);
    setNivelActivo(nivel);
    setAreaActiva(nuevaArea);
    setEstacionActiva(nuevaEstacion);
    setAutenticado(true);

    if (typeof window !== "undefined") {
      localStorage.setItem("synapse_sesion_activa", "true");
      localStorage.setItem("synapse_rol_activo", rol);
      localStorage.setItem("synapse_cedula_activa", cedula);
      localStorage.setItem("synapse_nivel_activo", nivel);
      localStorage.setItem("synapse_area_activa", nuevaArea);
      localStorage.setItem("synapse_estacion_activa", nuevaEstacion);
    }
  };

  const handleCerrarSesion = () => {
    setAutenticado(false);
    setRolActivo("");
    setCedulaActiva("");
    setNivelActivo("");
    setAvisoActualizacion("");
    if (typeof window !== "undefined") {
      CLAVES_SESION.forEach((clave) => localStorage.removeItem(clave));
    }
  };

  const handleRefrescarEstado = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("synapse_sesion_activa", "true");
      localStorage.setItem("synapse_rol_activo", rolActivo);
      localStorage.setItem("synapse_cedula_activa", cedulaActiva);
      localStorage.setItem("synapse_nivel_activo", nivelActivo);
      localStorage.setItem("synapse_area_activa", areaActiva);
      localStorage.setItem("synapse_estacion_activa", estacionActiva);
    }
    setAvisoActualizacion(
      `Vista actualizada (${new Date().toLocaleTimeString("es-CL")}). Sesión activa retenida.`
    );
  };

  const cambiarPortal = (portal: "creador" | "ingeniero" | "tecnico" | "usuario") => {
    setPortalSeleccionado(portal);
  };

  if (!sesionLista) {
    return (
      <div className="min-h-screen bg-[#030712] text-slate-300 font-mono flex items-center justify-center text-xs">
        Verificando sesión activa...
      </div>
    );
  }

  if (!autenticado) {
    return (
      <div className="min-h-screen bg-[#030712] text-slate-100 font-mono flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
        <header className="border-b border-slate-800/80 bg-slate-950/90 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <span className="inline-block w-3 h-3 rounded-full bg-cyan-400 animate-pulse"></span>
            <div>
              <h1 className="text-sm font-bold tracking-widest text-cyan-300 uppercase">
                SYNAPSE-X OS
              </h1>
              <p className="text-[10px] text-slate-400">Selector Central de Portales de Acceso</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => cambiarPortal("creador")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                portalSeleccionado === "creador"
                  ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 animate-pulse"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
              }`}
            >
              👑 Portal Creador
            </button>
            <button
              onClick={() => cambiarPortal("ingeniero")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                portalSeleccionado === "ingeniero"
                  ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20 animate-pulse"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
              }`}
            >
              ⚙️ Portal Ingeniero (ST)
            </button>
            <button
              onClick={() => cambiarPortal("tecnico")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                portalSeleccionado === "tecnico"
                  ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20 animate-pulse"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
              }`}
            >
              🔧 Portal Técnico (ST)
            </button>
            <button
              onClick={() => cambiarPortal("usuario")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                portalSeleccionado === "usuario"
                  ? "bg-purple-500 text-black shadow-lg shadow-purple-500/20 animate-pulse"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
              }`}
            >
              🏭 Portal Empresa / Operadores
            </button>
          </div>
        </header>

        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-xl space-y-4 flex flex-col items-center">
            {portalSeleccionado === "creador" && (
              <CreadorLogin
                onLoginSuccess={(rol, cedula) => {
                  handleLoginSuccess(rol, cedula, "10");
                }}
              />
            )}
            {portalSeleccionado === "ingeniero" && (
              <UniversalLogin
                tituloPortal="ÁREA DE SERVICIO TÉCNICO - INGENIEROS"
                tipoPortalPermitido="ingeniero"
                onLoginSuccess={handleLoginSuccess}
              />
            )}
            {portalSeleccionado === "tecnico" && (
              <UniversalLogin
                tituloPortal="ÁREA DE SOPORTE - TÉCNICOS"
                tipoPortalPermitido="tecnico"
                onLoginSuccess={handleLoginSuccess}
              />
            )}
            {portalSeleccionado === "usuario" && (
              <UniversalLogin
                tituloPortal="PORTAL DE OPERADORES Y LICENCIA DE EMPRESA"
                tipoPortalPermitido="usuario"
                onLoginSuccess={handleLoginSuccess}
              />
            )}
          </div>
        </main>

        <footer className="border-t border-slate-900 py-3 text-center text-[10px] text-slate-500">
          SYNAPSE-X OS Industrial Automation © 2026 — Todos los derechos reservados.
        </footer>
      </div>
    );
  }

  const mostrarBovedaFamiliar =
    areaActiva === "creador" &&
    (estacionActiva === "AC00" || estacionActiva === "AC01" || !estacionActiva);

  return (
    <div className="flex h-screen bg-[#030712] text-slate-100 font-mono overflow-hidden">
      {areaActiva === "st" && (
        <SidebarServicioTecnico
          areaActiva={areaActiva}
          onChangeArea={(nuevaArea) => setAreaActiva(nuevaArea)}
          rolActivo={rolActivo}
          estacionActiva={estacionActiva}
          setEstacionActiva={setEstacionActiva}
          handleCerrarSesion={handleCerrarSesion}
        />
      )}
      {areaActiva === "usuario" && (
        <SidebarUsuario
          areaActiva={areaActiva}
          onChangeArea={(nuevaArea) => setAreaActiva(nuevaArea)}
          rolActivo={rolActivo}
          estacionActiva={estacionActiva}
          setEstacionActiva={setEstacionActiva}
          handleCerrarSesion={handleCerrarSesion}
        />
      )}
      {areaActiva === "creador" && (
        <SidebarServicioTecnico
          areaActiva={areaActiva}
          onChangeArea={(nuevaArea) => setAreaActiva(nuevaArea)}
          rolActivo={rolActivo}
          estacionActiva={estacionActiva}
          setEstacionActiva={setEstacionActiva}
          handleCerrarSesion={handleCerrarSesion}
        />
      )}

      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950/50">
        <header className="h-14 border-b border-slate-800/80 bg-slate-950/80 px-6 flex items-center justify-between shrink-0 gap-4">
          <div className="flex items-center space-x-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs font-bold tracking-wider text-slate-200">
              ESTACIÓN ACTIVA: <span className="text-cyan-400">{estacionActiva}</span>
            </span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-3">
            <button
              type="button"
              onClick={handleRefrescarEstado}
              className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-300 font-bold cursor-pointer"
            >
              ↻ Actualizar
            </button>
            <span>
              Operador: <strong className="text-slate-200">{cedulaActiva}</strong>
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 font-semibold">
              {nivelActivo || rolActivo}
            </span>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {avisoActualizacion && (
            <div className="max-w-6xl mx-auto px-4 py-2 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-xs text-emerald-300 font-semibold">
              {avisoActualizacion}
            </div>
          )}

          {mostrarBovedaFamiliar ? (
            <BovedaFamiliarAC01 />
          ) : (
            <div className="max-w-4xl mx-auto bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="text-sm font-bold text-cyan-400 tracking-wider uppercase">
                Consola de Operaciones - Estación {estacionActiva}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Bienvenido al entorno de trabajo unificado. La sesión se mantiene retenida de forma
                persistente.
              </p>
              <div className="p-4 rounded-xl bg-black/40 border border-slate-800 text-xs text-slate-400 font-mono">
                <span className="text-emerald-400">ESTADO DE PERSISTENCIA:</span> Sesión blindada y
                activa.
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}