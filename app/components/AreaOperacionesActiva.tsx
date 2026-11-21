"use client";

import React, { useState } from "react";
import SidebarCreador from "./AreaCreador/SidebarCreador";
import SidebarServicioTecnico from "./AreaServicioTecnico/SidebarServicioTecnico";
import SidebarUsuario from "./AreaUsuario/SidebarUsuario";
import BovedaFamiliarAC01 from "./AreaCreador/PortalesCreador/BovedaFamiliarAC01";
import ConsolaPortalesCreador from "./AreaCreador/ConsolaPortalesCreador";
import DashboardAU00 from "./AreaUsuario/DashboardAU00";

interface AreaOperacionesActivaProps {
  rolActivo: string;
  cedulaActiva: string;
  nivelActivo: string;
  esBovedaFamiliarActiva: boolean;
  areaActiva: string;
  setAreaActiva: (area: string) => void;
  estacionActiva: string;
  setEstacionActiva: (estacion: string) => void;
  avisoActualizacion: string;
  onRefrescarEstado: () => void;
  onCerrarSesion: () => void;
}

const PORTALES_CONSOLA_CREADOR = new Set<string>(["AC00", "AC09", "AC10"]);

export default function AreaOperacionesActiva({
  rolActivo,
  cedulaActiva,
  nivelActivo,
  esBovedaFamiliarActiva,
  areaActiva,
  setAreaActiva,
  estacionActiva,
  setEstacionActiva,
  avisoActualizacion,
  onRefrescarEstado,
  onCerrarSesion,
}: AreaOperacionesActivaProps) {
  const [verAreaCodigos, setVerAreaCodigos] = useState<boolean>(false);
  const [refreshToken, setRefreshToken] = useState<number>(0);

  const esCreadorPrincipal =
    cedulaActiva === "10433935" || nivelActivo.toLowerCase().includes("nivel 10");

  const navegarArea = (nuevaArea: string) => {
    if (nuevaArea === "codigo") {
      if (esCreadorPrincipal || esBovedaFamiliarActiva) {
        setAreaActiva("creador");
        setVerAreaCodigos(true);
      }
      return;
    }

    setVerAreaCodigos(false);
    setAreaActiva(nuevaArea);

    if (nuevaArea === "creador") {
      setEstacionActiva("AC01");
    } else if (nuevaArea === "st" || nuevaArea === "superuser") {
      setAreaActiva("st");
      setEstacionActiva("ST01");
    } else if (nuevaArea === "usuario") {
      setEstacionActiva("AU00");
    }
  };

  const abrirAreaCodigos = () => {
    if (!esCreadorPrincipal && !esBovedaFamiliarActiva) return;
    setAreaActiva("creador");
    setVerAreaCodigos(true);
  };

  const handleSeleccionEstacionCreador = (estacion: string) => {
    setVerAreaCodigos(false);
    setEstacionActiva(estacion);
  };

  const handleActualizarBoveda = () => {
    setRefreshToken((prev) => prev + 1);
    onRefrescarEstado();
  };

  const mostrarConsolaPortales =
    areaActiva === "creador" &&
    !verAreaCodigos &&
    PORTALES_CONSOLA_CREADOR.has(estacionActiva);

  const mostrarBovedaFamiliar =
    areaActiva === "creador" &&
    !verAreaCodigos &&
    (estacionActiva === "AC01" || !estacionActiva);

  const mostrarDashboardAU00 =
    areaActiva === "usuario" &&
    (!estacionActiva || estacionActiva === "AU00");

  return (
    <div className="flex h-screen bg-[#030712] text-slate-100 font-mono overflow-hidden">
      {/* Barra sidebar del Creador */}
      {areaActiva === "creador" && (
        <SidebarCreador
          areaActiva={verAreaCodigos ? "codigo" : areaActiva}
          onChangeArea={navegarArea}
          rolActivo={rolActivo}
          estacionActiva={estacionActiva}
          setEstacionActiva={handleSeleccionEstacionCreador}
          handleCerrarSesion={onCerrarSesion}
          onRefrescarEstado={onRefrescarEstado}
          onActualizarBoveda={handleActualizarBoveda}
          esCreadorPrincipal={esCreadorPrincipal}
          verAreaCodigos={verAreaCodigos}
          onAbrirAreaCodigos={abrirAreaCodigos}
        />
      )}

      {/* Barra sidebar de Servicio Técnico */}
      {areaActiva === "st" && (
        <SidebarServicioTecnico
          areaActiva={areaActiva}
          onChangeArea={navegarArea}
          rolActivo={rolActivo}
          cedulaActiva={cedulaActiva}
          esBovedaFamiliarActiva={esBovedaFamiliarActiva}
          estacionActiva={estacionActiva}
          setEstacionActiva={setEstacionActiva}
          handleCerrarSesion={onCerrarSesion}
        />
      )}

      {/* Barra sidebar de Usuario / Operación */}
      {areaActiva === "usuario" && (
        <SidebarUsuario
          areaActiva={areaActiva}
          onChangeArea={navegarArea}
          rolActivo={rolActivo}
          cedulaActiva={cedulaActiva}
          esBovedaFamiliarActiva={esBovedaFamiliarActiva}
          estacionActiva={estacionActiva}
          setEstacionActiva={setEstacionActiva}
          handleCerrarSesion={onCerrarSesion}
        />
      )}

      {/* Contenedor principal de la estación activa */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950/50">
        <header className="h-14 border-b border-slate-800/80 bg-slate-950/80 px-6 flex items-center justify-between shrink-0 gap-4">
          <div className="flex items-center space-x-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs font-bold tracking-wider text-slate-200">
              ESTACIÓN ACTIVA:{" "}
              <span className="text-cyan-400">{estacionActiva || "AU00"}</span>
            </span>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-3">
            <span>
              Operador: <strong className="text-slate-200">{cedulaActiva}</strong>
            </span>
            <span className="px-2.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 font-semibold">
              {nivelActivo || rolActivo}
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {avisoActualizacion && (
            <div className="max-w-6xl mx-auto mt-4 px-4 py-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-xs md:text-sm text-emerald-300 font-semibold">
              {avisoActualizacion}
            </div>
          )}

          {esBovedaFamiliarActiva && !esCreadorPrincipal && (
            <div className="max-w-6xl mx-auto mt-4 px-4 py-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs md:text-sm text-cyan-200">
              Acceso Familiar: Puedes recorrer las áreas habilitadas del sistema operativo. El área
              de códigos permanece reservada hasta autorización expresa del Creador.
            </div>
          )}

          {verAreaCodigos && (esCreadorPrincipal || esBovedaFamiliarActiva) ? (
            <div className="p-6">
              <div className="max-w-5xl mx-auto bg-slate-900/70 border border-amber-500/40 rounded-2xl p-6 shadow-xl space-y-4">
                <h1 className="text-xl md:text-2xl font-extrabold text-amber-400 tracking-wide uppercase">
                  🔐 Área Reservada de Códigos y Configuración Maestra
                </h1>
                <h2 className="text-sm md:text-base font-semibold text-amber-200">
                  Control del Creador y Superusers del sistema operativo
                </h2>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  Desde este espacio administras la configuración maestra de Synapse-X (OSAI
                  Industrial).
                </p>
              </div>
            </div>
          ) : mostrarConsolaPortales ? (
            <div className="p-6">
              <div className="max-w-6xl mx-auto">
                <ConsolaPortalesCreador
                  key={`consola-${estacionActiva}`}
                  vistaInicial={estacionActiva as "AC00" | "AC09" | "AC10"}
                />
              </div>
            </div>
          ) : mostrarBovedaFamiliar ? (
            <div className="p-6">
              <BovedaFamiliarAC01 key={`boveda-${refreshToken}`} />
            </div>
          ) : mostrarDashboardAU00 ? (
            <DashboardAU00
              rolActivo={rolActivo}
              cedulaActiva={cedulaActiva}
              estacionActiva={estacionActiva || "AU00"}
              onSeleccionarEstacion={setEstacionActiva}
              onCambiarArea={navegarArea}
            />
          ) : (
            <div className="p-6">
              <div className="max-w-5xl mx-auto bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
                <h1 className="text-xl md:text-2xl font-extrabold text-cyan-400 tracking-wide uppercase">
                  Consola de Operaciones — Estación {estacionActiva}
                </h1>
                <h2 className="text-sm md:text-base font-semibold text-slate-200">
                  Entorno de trabajo activo y sesión persistente
                </h2>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                  Bienvenido al entorno de trabajo unificado. La sesión se mantiene retenida de forma
                  persistente para continuar operando sin interrupciones.
                </p>
                <div className="p-4 rounded-xl bg-black/40 border border-slate-800 text-xs md:text-sm text-slate-300 font-mono">
                  <span className="text-emerald-400 font-bold">ESTADO DE PERSISTENCIA:</span> Sesión
                  blindada y activa.
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}