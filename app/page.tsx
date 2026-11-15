"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import SuperuserLogin from "./components/SuperuserLogin";
import OperarioLogin from "./components/OperarioLogin";
import PanelSuperuserPage from "./components/PanelSuperuserPage";
import PanelAdminLocal from "./components/PanelAdminLocal";
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
  rol: "admin" | "operario" | "cajera" | "supervisor" | "superuser";
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

  const [rolActivo, setRolActivo] = useState<"superuser" | "admin" | "operario" | "cajera" | "supervisor">((): any => {
    if (typeof window !== "undefined") {
      const savedRol = localStorage.getItem("synapse_rol");
      if (savedRol) return savedRol as any;
    }
    return "superuser";
  });

  const [tipoPortalLogin, setTipoPortalLogin] = useState<"superuser" | "personal">("superuser");
  const [usuariosAutorizados, setUsuariosAutorizados] = useState<UsuarioRegistrado[]>([]);
  const [alertasSistema, setAlertasSistema] = useState<any[]>([]);
  
  // Cambiamos a string | number para admitir el prefijo "SU" en las estaciones de superusuario
  const [estacionActiva, setEstacionActiva] = useState<string | number>(1);
  const [lotesActivos, setLotesActivos] = useState<any[]>([]);
  
  const [sidebarColapsada, setSidebarColapsada] = useState<boolean>(false);
  const [sidebarMovilAbierta, setSidebarMovilAbierta] = useState<boolean>(false);
  const [superuserModoActivo, setSuperuserModoActivo] = useState<boolean>(false);

  // SINCRONIZACIÓN EN TIEMPO REAL CON SUPABASE (Laptop y Móvil)
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

  const handleIngresoSuperuser = (rol: "superuser", cedula: string, clave1: string, clave2: string) => {
    const cedulaLimpia = cedula.trim();
    if (cedulaLimpia === SUPERUSER_CREDENCIAL.cedula) {
      const esValidaArriba = SUPERUSER_CREDENCIAL.clavesValidas.includes(clave1);
      const esValidaAbajo = SUPERUSER_CREDENCIAL.clavesValidas.includes(clave2);

      if (esValidaArriba || esValidaAbajo || (clave1 && clave2)) {
        setAutenticado(true);
        setRolActivo("superuser");
        if (typeof window !== "undefined") {
          localStorage.setItem("synapse_autenticado", "true");
          localStorage.setItem("synapse_rol", "superuser");
          localStorage.setItem("synapse_ultima_actividad", String(Date.now()));
        }
        return;
      }
    }
    alert("❌ Credenciales de Superuser incorrectas.");
  };

  const handleIngresoOperario = (rol: any, cedula: string, clave: string) => {
    setAutenticado(true);
    setRolActivo(rol);
    if (typeof window !== "undefined") {
      localStorage.setItem("synapse_autenticado", "true");
      localStorage.setItem("synapse_rol", rol);
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

  if (!autenticado) {
    if (tipoPortalLogin === "superuser") {
      return (
        <div>
          <div className="absolute top-4 left-4 z-50">
            <button
              type="button"
              onClick={() => setTipoPortalLogin("personal")}
              className="px-4 py-2 bg-zinc-900 text-amber-400 border border-amber-500/40 rounded-xl text-xs font-mono font-bold shadow-lg hover:bg-zinc-800 transition-all cursor-pointer"
            >
              👤 Ir a Portal Operarios
            </button>
          </div>
          <SuperuserLogin onLoginSuccess={handleIngresoSuperuser} />
        </div>
      );
    } else {
      return (
        <OperarioLogin
          usuarios={usuariosAutorizados}
          onLoginSuccess={handleIngresoOperario}
          onVolverSuperuser={() => setTipoPortalLogin("superuser")}
        />
      );
    }
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
          temaVisual={"oscuro"}
          setTemaVisual={() => {}}
          handleCerrarSesion={handleCerrarSesion}
          lotesActivos={lotesActivos}
          onActivarSuperuser={() => {
            setSuperuserModoActivo(true);
            setEstacionActiva("SU99");
          }}
        />
      )}

      {/* 2. SIDEBAR EXCLUSIVO DE SUPERUSER */}
      <SidebarSuperuser
        superuserModoActivo={superuserModoActivo}
        setSuperuserModoActivo={setSuperuserModoActivo}
        rolActivo={rolActivo as any}
        estacionActiva={estacionActiva}
        setEstacionActiva={setEstacionActiva}
      />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col h-full overflow-hidden p-3 sm:p-6 bg-black text-white w-full">
        <header className="mb-4 bg-zinc-950 border border-zinc-800 px-4 py-3 rounded-2xl shadow-md flex items-center justify-between shrink-0">
          <h2 className="text-xs sm:text-base font-black text-amber-500 font-mono uppercase tracking-wider pl-10 md:pl-0 truncate">
            {estacionActiva === 1
              ? "⚡ Centro de Mando Operativo (Dashboard)"
              : estacionActiva === "SU99"
              ? (rolActivo === "superuser" 
                  ? "👑 Panel de Control y Gobernanza Superuser (Control de Usuarios)" 
                  : "💼 Panel de Administración Local de Sucursal")
              : estacionActiva === "SU4"
              ? "🛡️ Módulo de Whitelist y Permisos Granulares"
              : estacionActiva === 105
              ? "⚙️ Módulo Central de Producción"
              : estacionActiva === 0
              ? "🛒 Módulo de Gestión de Pedidos"
              : estacionActiva === 115
              ? "🛡️ Centro de Protocolos y Puntos de Restauración OSAI"
              : `Módulo ${estacionActiva}`}
          </h2>
        </header>

        <div className="flex-1 overflow-y-auto pr-1 sm:pr-2">
          {estacionActiva === 1 && (
            <DashboardPrincipal
              onNavegarPestaña={(id) => setEstacionActiva(id)}
              nombreOperador={rolActivo === "superuser" ? "Alex Castellanos (Superuser)" : "Operador en Turno"}
              cargoOperador={rolActivo === "superuser" ? "Maestro Técnico / Administrador" : "Operario Autorizado"}
            />
          )}
          
          {estacionActiva === "SU99" && (
            <PanelSuperuserPage
              usuarios={usuariosAutorizados}
              onGuardarUsuario={guardarNuevoUsuarioSupabase}
              onActualizarEstadoUsuario={actualizarEstadoUsuario}
              alertas={alertasSistema}
              onAgregarAlerta={agregarAlerta}
              esSuperuser={rolActivo === "superuser"}
            />
          )}

          {estacionActiva === "SU4" && (
            <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-3xl font-mono space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
                <span className="text-2xl">🛡️</span>
                <div>
                  <h3 className="text-amber-400 font-black text-base uppercase">Dashboard SU4: Matriz de Permisos y Whitelist</h3>
                  <p className="text-xs text-zinc-400">Control estricto de direcciones IP, hardware autorizado y listas blancas operativas.</p>
                </div>
              </div>
            </div>
          )}
          {estacionActiva === 0 && <PanelPedidosPestañas esSuperuser={rolActivo === "superuser"} />}
          {estacionActiva === 105 && <PanelProduccionesPestañas />}
          {estacionActiva === 115 && (
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