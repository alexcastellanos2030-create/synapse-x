"use client";

import React, { useState } from "react";
import SidebarUsuario from "./components/AreaUsuario/SidebarUsuario";
import SidebarSuperUser from "./components/AreaSuperUser/SidebarSuperUser";
import SidebarCreador from "./components/AreaCreador/SidebarCreador";
import RegistrodePedidos from "./components/AreaUsuario/RegistrodePedidos";

// Definición oficial exportada de la estructura de usuarios para todo el sistema
export interface UsuarioRegistrado {
  nombre: string;
  cedula: string;
  clave: string;
  rol: "admin" | "operario" | "cajera" | "supervisor" | "superuser" | "ingeniero" | "tecnico";
  bloqueado?: boolean;
}

export default function SynapseOS() {
  const [autenticado, setAutenticado] = useState<boolean>(true);
  const [rolActivo, setRolActivo] = useState<string>("superuser");
  
  const [areaActiva, setAreaActiva] = useState<"usuario" | "superuser" | "creador">("creador");
  const [estacionActiva, setEstacionActiva] = useState<string>("AC01");

  const handleCerrarSesion = () => {
    setAutenticado(false);
  };

  if (!autenticado) {
    return (
      <div className="h-screen w-screen bg-black text-white flex flex-col items-center justify-center space-y-4">
        <h1 className="text-lg font-mono font-bold text-amber-400">Sesión Cerrada — Synapse-X OS-AI</h1>
        <button
          onClick={() => setAutenticado(true)}
          className="px-4 py-2 bg-amber-500 text-black font-bold rounded-xl cursor-pointer"
        >
          Iniciar Sesión de Prueba (Root)
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden font-sans bg-black text-white relative">
      
      {/* RENDERIZADO DE SIDEBAR SEGÚN EL ÁREA ACTIVA */}
      {areaActiva === "creador" && (
        <SidebarCreador
          areaActiva={areaActiva}
          onChangeArea={(nuevaArea) => {
            setAreaActiva(nuevaArea);
            if (nuevaArea === "superuser") setEstacionActiva("SU01");
            if (nuevaArea === "usuario") setEstacionActiva("AU01");
          }}
          rolActivo={rolActivo}
          estacionActiva={estacionActiva}
          setEstacionActiva={setEstacionActiva}
          handleCerrarSesion={handleCerrarSesion}
        />
      )}

      {areaActiva === "superuser" && (
        <SidebarSuperUser
          areaActiva={areaActiva}
          onChangeArea={(nuevaArea) => {
            setAreaActiva(nuevaArea);
            if (nuevaArea === "creador") setEstacionActiva("AC01");
            if (nuevaArea === "usuario") setEstacionActiva("AU01");
          }}
          rolActivo={rolActivo}
          estacionActiva={estacionActiva}
          setEstacionActiva={setEstacionActiva}
          handleCerrarSesion={handleCerrarSesion}
        />
      )}

      {areaActiva === "usuario" && (
        <SidebarUsuario
          areaActiva={areaActiva}
          onChangeArea={(nuevaArea) => {
            setAreaActiva(nuevaArea);
            if (nuevaArea === "creador") setEstacionActiva("AC01");
            if (nuevaArea === "superuser") setEstacionActiva("SU01");
          }}
          rolActivo={rolActivo}
          estacionActiva={estacionActiva}
          setEstacionActiva={setEstacionActiva}
          handleCerrarSesion={handleCerrarSesion}
        />
      )}

      {/* ÁREA DE VISUALIZACIÓN DE PANTALLAS PRINCIPALES */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto p-4 sm:p-8 bg-black text-white w-full items-center">
        
        {/* PANTALLA CREADOR: AC01 */}
        {areaActiva === "creador" && estacionActiva === "AC01" && (
          <div className="max-w-xl w-full p-12 text-center border border-amber-500/30 bg-slate-950 rounded-2xl space-y-3 shadow-2xl my-auto">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 font-mono text-xs rounded-full border border-amber-500/40">
              👑 ÁREA DEL CREADOR — MASTER KERNEL
            </span>
            <h1 className="text-2xl font-black text-white tracking-wider uppercase">
              Portal AC01
            </h1>
            <p className="text-slate-400 text-xs italic">
              [Pantalla principal en blanco de Creador lista para desarrollar los submódulos]
            </p>
          </div>
        )}

        {/* PANTALLA SUPERUSER: SU01 */}
        {areaActiva === "superuser" && estacionActiva === "SU01" && (
          <div className="max-w-xl w-full p-12 text-center border border-cyan-500/30 bg-slate-950 rounded-2xl space-y-3 shadow-2xl my-auto">
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 font-mono text-xs rounded-full border border-cyan-500/40">
              🛡️ ÁREA DE SUPERUSER — GOBERNANZA DE PLANTA
            </span>
            <h1 className="text-2xl font-black text-white tracking-wider uppercase">
              Portal SU01
            </h1>
            <p className="text-slate-400 text-xs italic">
              [Pantalla principal en blanco de Superuser lista para desarrollar la planta]
            </p>
          </div>
        )}

        {/* PANTALLA USUARIO: AU01 */}
        {areaActiva === "usuario" && estacionActiva === "AU01" && (
          <div className="max-w-xl w-full p-12 text-center border border-purple-500/30 bg-slate-950 rounded-2xl space-y-3 shadow-2xl my-auto">
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 font-mono text-xs rounded-full border border-purple-500/40">
              ⚡ ÁREA DE USUARIO — CENTRO DE MANDO
            </span>
            <h1 className="text-2xl font-black text-white tracking-wider uppercase">
              Portal AU01
            </h1>
            <p className="text-slate-400 text-xs italic">
              [Pantalla principal en blanco de Usuario lista para desarrollar la operación]
            </p>
          </div>
        )}

        {/* PANTALLA USUARIO: AU02 (REGISTRO DE PEDIDO) */}
        {areaActiva === "usuario" && estacionActiva === "AU02" && (
          <RegistrodePedidos esSuperuser={rolActivo === "superuser"} />
        )}

      </main>
    </div>
  );
}