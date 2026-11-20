"use client";

import React, { useState } from "react";
import SidebarServicioTecnico from "./AreaServicioTecnico/SidebarServicioTecnico";
import SidebarUsuario from "./AreaUsuario/SidebarUsuario";
import BovedaFamiliarAC01 from "./AreaCreador/PortalesCreador/BovedaFamiliarAC01";

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

  const esCreadorPrincipal =
    cedulaActiva === "10433935" || nivelActivo.toLowerCase().includes("nivel 10");

  const navegarArea = (nuevaArea: string) => {
    setVerAreaCodigos(false);
    setAreaActiva(nuevaArea);
    if (nuevaArea === "creador") {
      setEstacionActiva("AC01");
    } else if (nuevaArea === "st") {
      setEstacionActiva("ST01");
    } else if (nuevaArea === "usuario") {
      setEstacionActiva("AU01");
    }
  };

  const mostrarBovedaFamiliar =
    areaActiva === "creador" &&
    !verAreaCodigos &&
    (estacionActiva === "AC00" || estacionActiva === "AC01" || !estacionActiva);

  return (
    <div className="flex h-screen bg-[#030712] text-slate-100 font-mono overflow-hidden">
      {areaActiva === "st" && (
        <SidebarServicioTecnico
          areaActiva={areaActiva}
          onChangeArea={navegarArea}
          rolActivo={rolActivo}
          estacionActiva={estacionActiva}
          setEstacionActiva={setEstacionActiva}
          handleCerrarSesion={onCerrarSesion}
        />
      )}
      {areaActiva === "usuario" && (
        <SidebarUsuario
          areaActiva={areaActiva}
          onChangeArea={navegarArea}
          rolActivo={rolActivo}
          estacionActiva={estacionActiva}
          setEstacionActiva={setEstacionActiva}
          handleCerrarSesion={onCerrarSesion}
        />
      )}
      {areaActiva === "creador" && (
        <SidebarServicioTecnico
          areaActiva={areaActiva}
          onChangeArea={navegarArea}
          rolActivo={rolActivo}
          estacionActiva={estacionActiva}
          setEstacionActiva={setEstacionActiva}
          handleCerrarSesion={onCerrarSesion}
        />
      )}

      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950/50">
        <header className="h-14 border-b border-slate-800/80 bg-slate-950/80 px-6 flex items-center justify-between shrink-0 gap-4">
          <div className="flex items-center space-x-3 flex-wrap gap-y-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs font-bold tracking-wider text-slate-200">
              ESTACIÓN ACTIVA: <span className="text-cyan-400">{estacionActiva}</span>
            </span>

            {esBovedaFamiliarActiva && (
              <div className="flex items-center gap-1.5 ml-2">
                <button
                  type="button"
                  onClick={() => navegarArea("creador")}
                  className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer border ${
                    areaActiva === "creador" && !verAreaCodigos
                      ? "bg-emerald-500 text-black border-emerald-400"
                      : "bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800"
                  }`}
                >
                  👑 Área Creador
                </button>
                <button
                  type="button"
                  onClick={() => navegarArea("st")}
                  className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer border ${
                    areaActiva === "st"
                      ? "bg-cyan-500 text-black border-cyan-400"
                      : "bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800"
                  }`}
                >
                  🛠️ Área ST
                </button>
                <button
                  type="button"
                  onClick={() => navegarArea("usuario")}
                  className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer border ${
                    areaActiva === "usuario"
                      ? "bg-pink-500 text-black border-pink-400"
                      : "bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800"
                  }`}
                >
                  🏭 Área Usuario
                </button>
                {esCreadorPrincipal && (
                  <button
                    type="button"
                    onClick={() => setVerAreaCodigos((prev) => !prev)}
                    className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer border ${
                      verAreaCodigos
                        ? "bg-amber-400 text-black border-amber-300"
                        : "bg-slate-900 text-amber-300 border-amber-500/40 hover:bg-slate-800"
                    }`}
                  >
                    🔐 Área Códigos
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-3">
            <button
              type="button"
              onClick={onRefrescarEstado}
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

          {esBovedaFamiliarActiva && !esCreadorPrincipal && (
            <div className="max-w-6xl mx-auto px-4 py-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-[11px] text-cyan-200">
              Acceso Familiar (Nivel 1 - Solo Ver): Puedes recorrer y ver todas las áreas del sistema
              operativo. El área de códigos permanece reservada hasta autorización expresa del Creador.
            </div>
          )}

          {verAreaCodigos && esCreadorPrincipal ? (
            <div className="max-w-5xl mx-auto bg-slate-900/70 border border-amber-500/40 rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="text-sm font-bold text-amber-400 tracking-wider uppercase">
                🔐 Área Reservada de Códigos y Configuración Maestra (Solo Creador)
              </h2>
              <p className="text-xs text-slate-300">
                Módulo exclusivo para el Creador del sistema operativo. Las cuentas de Nivel 1 de la
                bóveda familiar no acceden a esta vista sin autorización.
              </p>
            </div>
          ) : mostrarBovedaFamiliar ? (
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