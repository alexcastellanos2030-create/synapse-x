"use client";

import React, { useState, useEffect } from "react";
import SidebarUsuario from "./components/AreaUsuario/SidebarUsuario";
import SidebarSuperUser from "./components/AreaSuperUser/SidebarSuperUser";
import SidebarCreador from "./components/AreaCreador/SidebarCreador";
import RegistrodePedidos from "./components/AreaUsuario/RegistrodePedidos";
import PanelCreadorAC04, { AlertaSistema } from "./components/AreaCreador/PanelCreadorAC04";
import { supabase } from "./lib/supabase";

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

  const [usuarios, setUsuarios] = useState<UsuarioRegistrado[]>([
    { nombre: "Alexander Castellanos", cedula: "10433935", clave: "1234", rol: "superuser", bloqueado: false },
    { nombre: "Carolina Pérez", cedula: "87654321", clave: "1234", rol: "admin", bloqueado: false }
  ]);

  const [alertas, setAlertas] = useState<AlertaSistema[]>([]);

  // Sincronizar usuarios de Supabase al iniciar
  useEffect(() => {
    async function cargarUsuarios() {
      try {
        const { data, error } = await supabase.from("usuarios").select("*");
        if (!error && data && data.length > 0) {
          setUsuarios(data as UsuarioRegistrado[]);
        }
      } catch (err) {
        console.error("Error al sincronizar usuarios principales:", err);
      }
    }
    cargarUsuarios();
  }, []);

  const handleGuardarUsuario = async (nuevoUsr: UsuarioRegistrado) => {
    setUsuarios((prev) => {
      const existe = prev.findIndex((u) => u.cedula === nuevoUsr.cedula);
      if (existe >= 0) {
        const copia = [...prev];
        copia[existe] = nuevoUsr;
        return copia;
      }
      return [...prev, nuevoUsr];
    });
    try {
      await supabase.from("usuarios").upsert([nuevoUsr], { onConflict: "cedula" });
    } catch (err) {
      console.error("Error al guardar usuario en Supabase:", err);
    }
  };

  const handleActualizarEstadoUsuario = async (cedula: string, bloqueado: boolean) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.cedula === cedula ? { ...u, bloqueado } : u))
    );
    try {
      await supabase.from("usuarios").update({ bloqueado }).eq("cedula", cedula);
    } catch (err) {
      console.error("Error al actualizar estado en Supabase:", err);
    }
  };

  const handleAgregarAlerta = (alerta: AlertaSistema) => {
    setAlertas((prev) => [alerta, ...prev]);
  };

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
        
        {/* PANTALLA CREADOR: AC01 — Master Kernel */}
        {areaActiva === "creador" && estacionActiva === "AC01" && (
          <div className="max-w-xl w-full p-12 text-center border border-amber-500/30 bg-slate-950 rounded-2xl space-y-3 shadow-2xl my-auto">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 font-mono text-xs rounded-full border border-amber-500/40">
              👑 ÁREA DEL CREADOR — MASTER KERNEL
            </span>
            <h1 className="text-2xl font-black text-white tracking-wider uppercase">Portal AC01</h1>
            <p className="text-slate-400 text-xs italic">Núcleo principal del sistema operativo industrial OSAI.</p>
          </div>
        )}

        {/* PANTALLA CREADOR: AC02 — Gestión de Módulos */}
        {areaActiva === "creador" && estacionActiva === "AC02" && (
          <div className="max-w-xl w-full p-12 text-center border border-amber-500/30 bg-slate-950 rounded-2xl space-y-3 shadow-2xl my-auto">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 font-mono text-xs rounded-full border border-amber-500/40">
              📊 ÁREA DEL CREADOR — GESTIÓN DE MÓDULOS
            </span>
            <h1 className="text-2xl font-black text-white tracking-wider uppercase">Portal AC02</h1>
            <p className="text-slate-400 text-xs italic">Panel de control y activación de submódulos de producción.</p>
          </div>
        )}

        {/* PANTALLA CREADOR: AC03 — Laboratorio HMI */}
        {areaActiva === "creador" && estacionActiva === "AC03" && (
          <div className="max-w-xl w-full p-12 text-center border border-amber-500/30 bg-slate-950 rounded-2xl space-y-3 shadow-2xl my-auto">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 font-mono text-xs rounded-full border border-amber-500/40">
              🧪 ÁREA DEL CREADOR — LABORATORIO HMI
            </span>
            <h1 className="text-2xl font-black text-white tracking-wider uppercase">Portal AC03</h1>
            <p className="text-slate-400 text-xs italic">Simulación de interfaz hombre-máquina y gemelo digital.</p>
          </div>
        )}

        {/* PANTALLA CREADOR: AC04 — Staff & Licencias */}
        {areaActiva === "creador" && estacionActiva === "AC04" && (
          <PanelCreadorAC04
            usuarios={usuarios}
            onGuardarUsuario={handleGuardarUsuario}
            onActualizarEstadoUsuario={handleActualizarEstadoUsuario}
            onAgregarAlerta={handleAgregarAlerta}
          />
        )}

        {/* PANTALLA CREADOR: AC05 — Diagnóstico & Logs */}
        {areaActiva === "creador" && estacionActiva === "AC05" && (
          <div className="max-w-xl w-full p-12 text-center border border-amber-500/30 bg-slate-950 rounded-2xl space-y-3 shadow-2xl my-auto">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 font-mono text-xs rounded-full border border-amber-500/40">
              📡 ÁREA DEL CREADOR — DIAGNÓSTICO & LOGS
            </span>
            <h1 className="text-2xl font-black text-white tracking-wider uppercase">Portal AC05</h1>
            <p className="text-slate-400 text-xs italic">Monitoreo de telemetría y registro de eventos del sistema.</p>
          </div>
        )}

        {/* PANTALLA CREADOR: AC06 — Despliegue & Git */}
        {areaActiva === "creador" && estacionActiva === "AC06" && (
          <div className="max-w-xl w-full p-12 text-center border border-amber-500/30 bg-slate-950 rounded-2xl space-y-3 shadow-2xl my-auto">
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 font-mono text-xs rounded-full border border-amber-500/40">
              ⚙️ ÁREA DEL CREADOR — DESPLIEGUE & GIT
            </span>
            <h1 className="text-2xl font-black text-white tracking-wider uppercase">Portal AC06</h1>
            <p className="text-slate-400 text-xs italic">Control de versiones, ramas y sincronización con Vercel.</p>
          </div>
        )}

        {/* PANTALLA SUPERUSER: SU01 */}
        {areaActiva === "superuser" && estacionActiva === "SU01" && (
          <div className="max-w-xl w-full p-12 text-center border border-cyan-500/30 bg-slate-950 rounded-2xl space-y-3 shadow-2xl my-auto">
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 font-mono text-xs rounded-full border border-cyan-500/40">
              🛡️ ÁREA DE SUPERUSER — GOBERNANZA DE PLANTA
            </span>
            <h1 className="text-2xl font-black text-white tracking-wider uppercase">Portal SU01</h1>
          </div>
        )}

        {/* PANTALLA USUARIO: AU01 */}
        {areaActiva === "usuario" && estacionActiva === "AU01" && (
          <div className="max-w-xl w-full p-12 text-center border border-purple-500/30 bg-slate-950 rounded-2xl space-y-3 shadow-2xl my-auto">
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 font-mono text-xs rounded-full border border-purple-500/40">
              ⚡ ÁREA DE USUARIO — CENTRO DE MANDO
            </span>
            <h1 className="text-2xl font-black text-white tracking-wider uppercase">Portal AU01</h1>
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