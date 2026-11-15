"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import SuperuserLogin from "./components/SuperuserLogin";
import EngineerLogin from "./components/EngineerLogin";
import TechnicianLogin from "./components/TechnicianLogin";
import UsuarioLogin from "./components/UsuarioLogin";
import PanelSuperuserPage from "./components/PanelSuperuserPage";
import Sidebar from "./components/Sidebar";
import SidebarSuperuser from "./components/SidebarSuperuser";
import PanelProduccionesPestañas from "./components/PanelProduccionesPestañas";
import PanelPedidosPestañas from "./components/PanelPedidosPestañas";
import PanelProtocolosOSAI from "./components/PanelProtocolosOSAI";
import DashboardPrincipal from "./components/DashboardPrincipal";

import { SUPERUSER_CREDENCIAL } from "./data/bakeryConstants";

export interface UsuarioRegistrado {
  nombre: string;
  cedula: string;
  clave: string;
  rol: "admin" | "operario" | "cajera" | "supervisor" | "superuser" | "ingeniero" | "tecnico";
  nivel?: string; // Nivel 1, 2 o 3
  bloqueado: boolean;
}

export default function SynapseOS() {
  const [autenticado, setAutenticado] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const isAuth = localStorage.getItem("synapse_autenticado") === "true";
      const ultimaActividad = localStorage.getItem("synapse_ultima_actividad");
      const savedRol = localStorage.getItem("synapse_rol");
      
      if (isAuth && ultimaActividad) {
        const ahora = Date.now();
        const tiempoTranscurrito = ahora - Number(ultimaActividad);
        const esSuper = savedRol === "superuser";
        const limiteTiempo = esSuper ? 24 * 60 * 60 * 1000 : 10 * 60 * 1000;

        if (tiempoTranscurrito < limiteTiempo) {
          localStorage.setItem("synapse_ultima_actividad", String(ahora));
          return true;
        } else {
          localStorage.clear();
          return false;
        }
      }
    }
    return false;
  });

  const [rolActivo, setRolActivo] = useState<"superuser" | "ingeniero" | "tecnico" | "operario" | "admin" | "cajera" | "supervisor">((): any => {
    if (typeof window !== "undefined") {
      const savedRol = localStorage.getItem("synapse_rol");
      if (savedRol) return savedRol as any;
    }
    return "superuser";
  });

  // Nivel de ejecución activo (Nivel 1, Nivel 2 o Nivel 3)
  const [nivelActivo, setNivelActivo] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("synapse_nivel") || "Nivel 3";
    }
    return "Nivel 3";
  });

  // Selector entre los 4 portales de login
  const [tipoPortalLogin, setTipoPortalLogin] = useState<"superuser" | "engineer" | "technician" | "usuario">("superuser");
  
  const [usuariosAutorizados, setUsuariosAutorizados] = useState<UsuarioRegistrado[]>([]);
  const [alertasSistema, setAlertasSistema] = useState<any[]>([]);
  const [estacionActiva, setEstacionActiva] = useState<string | number>(1);
  const [lotesActivos, setLotesActivos] = useState<any[]>([]);
  
  const [sidebarColapsada, setSidebarColapsada] = useState<boolean>(false);
  const [sidebarMovilAbierta, setSidebarMovilAbierta] = useState<boolean>(false);
  const [superuserModoActivo, setSuperuserModoActivo] = useState<boolean>(false);
  const [temaVisual, setTemaVisual] = useState<"oscuro" | "claro" | "sistema">("oscuro");

  // SINCRONIZACIÓN EN TIEMPO REAL CON SUPABASE
  useEffect(() => {
    async function cargarUsuariosSupabase() {
      try {
        const { data, error } = await supabase.from("usuarios").select("*");
        if (!error && data && data.length > 0) {
          setUsuariosAutorizados(data as UsuarioRegistrado[]);
        }
      } catch (err) {
        console.error("Error cargando usuarios:", err);
      }
    }
    cargarUsuariosSupabase();

    const canalUsuarios = supabase
      .channel("public:usuarios")
      .on("postgres_changes", { event: "*", schema: "public", table: "usuarios" }, () => {
        cargarUsuariosSupabase();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(canalUsuarios);
    };
  }, []);

  // Manejo de ingresos unificado guardando rol y nivel
  const handleIngresoConRolYNivel = (rol: any, nivel: string = "Nivel 3") => {
    setAutenticado(true);
    setRolActivo(rol);
    setNivelActivo(nivel);
    if (typeof window !== "undefined") {
      localStorage.setItem("synapse_autenticado", "true");
      localStorage.setItem("synapse_rol", rol);
      localStorage.setItem("synapse_nivel", nivel);
      localStorage.setItem("synapse_ultima_actividad", String(Date.now()));
    }
  };

  const handleCerrarSesion = () => {
    setAutenticado(false);
    if (typeof window !== "undefined") localStorage.clear();
  };

  const conmutarRol = () => {
    setRolActivo((prev) => (prev === "superuser" ? "operario" : "superuser"));
  };

  const agregarAlerta = (nuevaAlerta: any) => {
    setAlertasSistema((prev) => [nuevaAlerta, ...prev]);
  };

  const guardarNuevoUsuarioSupabase = async (nuevoUsr: UsuarioRegistrado) => {
    setUsuariosAutorizados((prev) => {
      const existe = prev.some((u) => u.cedula === nuevoUsr.cedula);
      if (existe) {
        return prev.map((u) => (u.cedula === nuevoUsr.cedula ? nuevoUsr : u));
      }
      return [...prev, nuevoUsr];
    });

    const { error } = await supabase.from("usuarios").upsert([nuevoUsr], { onConflict: "cedula" });
    if (error) {
      console.error("Error al sincronizar usuario en Supabase:", error);
    }
  };

  const actualizarEstadoUsuario = async (cedula: string, bloqueado: boolean) => {
    setUsuariosAutorizados((prev) => prev.map((u) => (u.cedula === cedula ? { ...u, bloqueado } : u)));
    const { error } = await supabase.from("usuarios").update({ bloqueado }).eq("cedula", cedula);
    if (error) {
      console.error("Error al actualizar estado en Supabase:", error);
    }
  };

  const handleRestaurarSistema = (usuariosRestaurados: UsuarioRegistrado[]) => {
    setUsuariosAutorizados(usuariosRestaurados);
  };

  // CONTROL DE RUTA DE LOGIN (Los 4 Portales con sus botones de selección)
  if (!autenticado) {
    return (
      <div className="relative min-h-screen bg-black">
        <div className="absolute top-4 left-4 right-4 z-50 flex flex-wrap gap-2 justify-center md:justify-start">
          <button
            type="button"
            onClick={() => setTipoPortalLogin("superuser")}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
              tipoPortalLogin === "superuser" ? "bg-emerald-600 text-black border-emerald-400 shadow-lg" : "bg-zinc-900 text-emerald-400 border-emerald-500/40 hover:bg-zinc-800"
            }`}
          >
            👑 Portal Superuser (Creador)
          </button>
          <button
            type="button"
            onClick={() => setTipoPortalLogin("engineer")}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
              tipoPortalLogin === "engineer" ? "bg-cyan-600 text-black border-cyan-400 shadow-lg" : "bg-zinc-900 text-cyan-400 border-cyan-500/40 hover:bg-zinc-800"
            }`}
          >
            ⚙️ Portal Ingeniero
          </button>
          <button
            type="button"
            onClick={() => setTipoPortalLogin("technician")}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
              tipoPortalLogin === "technician" ? "bg-amber-600 text-black border-amber-400 shadow-lg" : "bg-zinc-900 text-amber-400 border-amber-500/40 hover:bg-zinc-800"
            }`}
          >
            🔧 Portal Técnico
          </button>
          <button
            type="button"
            onClick={() => setTipoPortalLogin("usuario")}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
              tipoPortalLogin === "usuario" ? "bg-purple-600 text-white border-purple-400 shadow-lg" : "bg-zinc-900 text-purple-400 border-purple-500/40 hover:bg-zinc-800"
            }`}
          >
            👤 Portal de Usuario / Operario
          </button>
        </div>

        <div className="pt-16">
          {tipoPortalLogin === "superuser" && <SuperuserLogin onLoginSuccess={() => handleIngresoConRolYNivel("superuser", "Nivel 3")} />}
          {tipoPortalLogin === "engineer" && <EngineerLogin />}
          {tipoPortalLogin === "technician" && <TechnicianLogin />}
          {tipoPortalLogin === "usuario" && (
            <UsuarioLogin
              usuarios={usuariosAutorizados}
              onLoginSuccess={(rol, cedula, clave) => handleIngresoConRolYNivel(rol, "Nivel 3")}
              onVolverSuperuser={() => setTipoPortalLogin("superuser")}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden font-sans bg-black text-white relative">
      
      {/* 1. SIDEBAR OPERATIVO */}
      {!superuserModoActivo && (
        <Sidebar
          sidebarColapsada={sidebarColapsada}
          setSidebarColapsada={setSidebarColapsada}
          sidebarMovilAbierta={sidebarMovilAbierta}
          setSidebarMovilAbierta={setSidebarMovilAbierta}
          estacionActiva={estacionActiva as number}
          setEstacionActiva={setEstacionActiva}
          rolActivo={rolActivo as any}
          conmutarRol={conmutarRol}
          temaVisual={temaVisual}
          setTemaVisual={setTemaVisual}
          handleCerrarSesion={handleCerrarSesion}
          lotesActivos={lotesActivos}
          superuserModoActivo={superuserModoActivo}
          setSuperuserModoActivo={setSuperuserModoActivo}
          onActivarSuperuser={() => {
            if (rolActivo === "superuser") {
              setSuperuserModoActivo(true);
              setEstacionActiva("SU99");
            } else {
              alert("⚠️ Acceso restringido: El área de gobernanza raíz es exclusiva del Creador.");
            }
          }}
        />
      )}

      {/* 2. SIDEBAR EXCLUSIVO DE SUPERUSER (Exclusivo Creador) */}
      {rolActivo === "superuser" && (
        <SidebarSuperuser
          superuserModoActivo={superuserModoActivo}
          setSuperuserModoActivo={setSuperuserModoActivo}
          rolActivo={rolActivo as any}
          estacionActiva={estacionActiva}
          setEstacionActiva={setEstacionActiva}
        />
      )}

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col h-full overflow-hidden p-3 sm:p-6 bg-black text-white w-full">
        <header className="mb-4 bg-zinc-950 border border-zinc-800 px-4 py-3 rounded-2xl shadow-md flex items-center justify-between shrink-0">
          <h2 className="text-xs sm:text-base font-black text-amber-500 font-mono uppercase tracking-wider pl-10 md:pl-0 truncate">
            {estacionActiva === 1
              ? `⚡ Centro de Mando (${rolActivo.toUpperCase()} ${nivelActivo})`
              : estacionActiva === "SU99" && rolActivo === "superuser"
              ? "👑 Panel de Control y Gobernanza Superuser"
              : estacionActiva === 105
              ? "⚙️ Módulo Central de Producción"
              : estacionActiva === 0
              ? "🛒 Módulo de Gestión de Pedidos"
              : `Módulo ${estacionActiva}`}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-1 bg-zinc-900 border border-zinc-700 text-amber-400 rounded">
              {nivelActivo}
            </span>
            <span className="text-[10px] font-mono px-2 py-1 bg-zinc-900 border border-zinc-700 text-zinc-300 rounded">
              Rol: {rolActivo.toUpperCase()}
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto pr-1 sm:pr-2">
          {estacionActiva === 1 && (
            <DashboardPrincipal
              onNavegarPestaña={(id) => {
                if (rolActivo === "ingeniero" && nivelActivo === "Nivel 1" && id === 115) {
                  alert("⚠️ Acceso restringido: El Nivel 1 de Ingeniería no tiene permisos sobre protocolos de restauración del núcleo.");
                  return;
                }
                if (rolActivo === "tecnico" && (nivelActivo === "Nivel 1" || nivelActivo === "Nivel 2") && id === 115) {
                  alert("⚠️ Acceso restringido: Se requiere Técnico Nivel 3 para acceder a este módulo avanzado.");
                  return;
                }
                setEstacionActiva(id);
              }}
              nombreOperador={rolActivo === "superuser" ? "Alex Castellanos (Creador)" : `Personal Autorizado (${rolActivo})`}
              cargoOperador={rolActivo === "superuser" ? "Superuser Root" : `${rolActivo.toUpperCase()} ${nivelActivo}`}
            />
          )}
          
          {estacionActiva === "SU99" && rolActivo === "superuser" && (
            <PanelSuperuserPage
              usuarios={usuariosAutorizados}
              onGuardarUsuario={guardarNuevoUsuarioSupabase}
              onActualizarEstadoUsuario={actualizarEstadoUsuario}
              alertas={alertasSistema}
              onAgregarAlerta={agregarAlerta}
              esSuperuser={true}
            />
          )}

          {estacionActiva === 0 && <PanelPedidosPestañas esSuperuser={rolActivo === "superuser"} />}
          {estacionActiva === 105 && <PanelProduccionesPestañas />}
          {estacionActiva === 115 && rolActivo === "superuser" && (
            <PanelProtocolosOSAI
              usuarios={usuariosAutorizados}
              onRestaurarSistema={handleRestaurarSistema}
            />
          )}
        </div>
      </main>
    </div>
  );
}