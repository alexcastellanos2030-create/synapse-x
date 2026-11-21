"use client";

// ============================================================================
// PUNTO DE ENTRADA PRINCIPAL — SYNAPSE-X OS (OSAI INDUSTRIAL)
// - Verifica identidad del núcleo desde BovedaCreadorMaster.tsx y Supabase.
// - Jerarquía: Nivel 10 exclusivo del Creador (10433935); hijas como
//   Superusers en escala progresiva (Nivel 1 -> Nivel 9) por encima de
//   ingenieros, técnicos y operadores.
// ============================================================================

import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import {
  PortalTipo,
  CLAVES_SESION,
  CONFIG_PORTALES,
} from "@/lib/authPortales";
import {
  CREADOR_MASTER_DATABASE,
  obtenerCredencialCreadorPorCedula,
} from "./components/AreaCreador/BovedaCreadorMaster";
import CreadorLogin from "./components/AreaCreador/CreadorLogin";
import ConsolaPortalesCreador from "./components/AreaCreador/ConsolaPortalesCreador";
import PortalAccesoSimpleLED from "./components/PortalAccesoSimpleLED";
import AreaOperacionesActiva from "./components/AreaOperacionesActiva";

const ORDEN_PORTALES: PortalTipo[] = ["creador", "ingeniero", "tecnico", "usuario"];
const CEDULAS_MASTER_FAMILIA = new Set<string>(Object.keys(CREADOR_MASTER_DATABASE));
const ESTACIONES_CONSOLA_NUEVA = new Set<string>(["AC00", "AC09", "AC10"]);

const CLAVES_LOCAL_SESION = [
  "synapse_sesion_activa",
  "synapse_rol_activo",
  "synapse_cedula_activa",
  "synapse_nivel_activo",
  "synapse_area_activa",
  "synapse_estacion_activa",
  "synapse_boveda_familiar",
];

interface EstadoSesionGuardada {
  rol: string;
  cedula: string;
  nivel: string;
  area: string;
  estacion: string;
  esBovedaFamiliar: boolean;
}

function persistirSesionLocal(datos: EstadoSesionGuardada): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("synapse_sesion_activa", "true");
  localStorage.setItem("synapse_rol_activo", datos.rol);
  localStorage.setItem("synapse_cedula_activa", datos.cedula);
  localStorage.setItem("synapse_nivel_activo", datos.nivel);
  localStorage.setItem("synapse_area_activa", datos.area);
  localStorage.setItem("synapse_estacion_activa", datos.estacion);
  localStorage.setItem(
    "synapse_boveda_familiar",
    datos.esBovedaFamiliar ? "true" : "false"
  );
}

function limpiarSesionLocal(): void {
  if (typeof window === "undefined") return;
  CLAVES_SESION.forEach((clave) => localStorage.removeItem(clave));
  CLAVES_LOCAL_SESION.forEach((clave) => localStorage.removeItem(clave));
}

export default function Home() {
  const [sesionLista, setSesionLista] = useState<boolean>(false);
  const [autenticado, setAutenticado] = useState<boolean>(false);
  const [rolActivo, setRolActivo] = useState<string>("");
  const [cedulaActiva, setCedulaActiva] = useState<string>("");
  const [nivelActivo, setNivelActivo] = useState<string>("");
  const [esBovedaFamiliarActiva, setEsBovedaFamiliarActiva] = useState<boolean>(false);

  const [portalSeleccionado, setPortalSeleccionado] = useState<PortalTipo>("creador");
  const [areaActiva, setAreaActiva] = useState<string>("creador");
  const [estacionActiva, setEstacionActiva] = useState<string>("AC01");
  const [avisoActualizacion, setAvisoActualizacion] = useState<string>("");

  // 1. Restauración inicial de sesión desde localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const sesionGuardada = localStorage.getItem("synapse_sesion_activa") === "true";
      const rolGuardado = localStorage.getItem("synapse_rol_activo") || "";
      const cedulaGuardada = localStorage.getItem("synapse_cedula_activa") || "";
      const nivelGuardado = localStorage.getItem("synapse_nivel_activo") || "";
      const areaGuardada = localStorage.getItem("synapse_area_activa") || "creador";
      const estacionGuardada =
        localStorage.getItem("synapse_estacion_activa") ||
        (areaGuardada === "usuario" ? "AU00" : "AC01");
      const bovedaGuardada =
        localStorage.getItem("synapse_boveda_familiar") === "true" ||
        CEDULAS_MASTER_FAMILIA.has(cedulaGuardada);

      if (sesionGuardada && cedulaGuardada) {
        setAutenticado(true);
        setRolActivo(rolGuardado);
        setCedulaActiva(cedulaGuardada);
        setNivelActivo(nivelGuardado);
        setAreaActiva(areaGuardada);
        setEstacionActiva(estacionGuardada);
        setEsBovedaFamiliarActiva(bovedaGuardada);
      }
    } catch (err) {
      console.error("Error restaurando sesión:", err);
    } finally {
      setSesionLista(true);
    }
  }, []);

  // 2. Sincronización automática cuando cambia el estado autenticado
  useEffect(() => {
    if (!sesionLista || !autenticado) return;
    persistirSesionLocal({
      rol: rolActivo,
      cedula: cedulaActiva,
      nivel: nivelActivo,
      area: areaActiva,
      estacion: estacionActiva,
      esBovedaFamiliar: esBovedaFamiliarActiva,
    });
  }, [
    sesionLista,
    autenticado,
    rolActivo,
    cedulaActiva,
    nivelActivo,
    areaActiva,
    estacionActiva,
    esBovedaFamiliarActiva,
  ]);

  const handleLoginSuccess = useCallback(
    async (
      rol: string,
      cedula: string,
      nivel: string,
      esBovedaFamiliar?: boolean
    ) => {
      const cedulaLimpia = String(cedula || "").trim();
      const registroMaster = obtenerCredencialCreadorPorCedula(cedulaLimpia);
      const nivelMasterTexto = registroMaster?.nivel ? String(registroMaster.nivel) : "";

      let perteneceBoveda =
        Boolean(esBovedaFamiliar) ||
        Boolean(registroMaster) ||
        CEDULAS_MASTER_FAMILIA.has(cedulaLimpia);

      try {
        const { data } = await supabase
          .from("boveda_familiar")
          .select("cedula")
          .eq("cedula", cedulaLimpia)
          .limit(1);
        if (Array.isArray(data) && data.length > 0) {
          perteneceBoveda = true;
        }
      } catch {
        // Mantiene validación previa si no hay red
      }

      let nuevaArea = "usuario";
      let nuevaEstacion = "AU00";
      let rolFinal = rol;
      const nivelFinal = nivel || nivelMasterTexto || "Nivel 1";

      if (perteneceBoveda || rol === "creador" || rol === "Creador") {
        nuevaArea = "creador";
        nuevaEstacion = "AC01";
        rolFinal =
          cedulaLimpia === "10433935" || registroMaster?.rol === "creador"
            ? "creador"
            : "superuser";
        perteneceBoveda = true;
      } else if (rol === "ingeniero" || rol === "tecnico") {
        nuevaArea = "st";
        nuevaEstacion = "ST01";
      } else {
        nuevaArea = "usuario";
        nuevaEstacion = "AU00";
        rolFinal = "usuario";
      }

      setRolActivo(rolFinal);
      setCedulaActiva(cedulaLimpia);
      setNivelActivo(nivelFinal);
      setEsBovedaFamiliarActiva(perteneceBoveda);
      setAreaActiva(nuevaArea);
      setEstacionActiva(nuevaEstacion);
      setAutenticado(true);

      persistirSesionLocal({
        rol: rolFinal,
        cedula: cedulaLimpia,
        nivel: nivelFinal,
        area: nuevaArea,
        estacion: nuevaEstacion,
        esBovedaFamiliar: perteneceBoveda,
      });
    },
    []
  );

  const handleCerrarSesion = useCallback(() => {
    setAutenticado(false);
    setRolActivo("");
    setCedulaActiva("");
    setNivelActivo("");
    setEsBovedaFamiliarActiva(false);
    setAvisoActualizacion("");
    limpiarSesionLocal();
  }, []);

  const handleRefrescarEstado = useCallback(() => {
    persistirSesionLocal({
      rol: rolActivo,
      cedula: cedulaActiva,
      nivel: nivelActivo,
      area: areaActiva,
      estacion: estacionActiva,
      esBovedaFamiliar: esBovedaFamiliarActiva,
    });
    setAvisoActualizacion(
      `Vista actualizada (${new Date().toLocaleTimeString("es-CL")}). Sesión activa retenida.`
    );
  }, [
    rolActivo,
    cedulaActiva,
    nivelActivo,
    areaActiva,
    estacionActiva,
    esBovedaFamiliarActiva,
  ]);

  if (!sesionLista) {
    return (
      <div className="min-h-screen bg-[#030712] text-slate-300 font-mono flex items-center justify-center text-xs">
        Verificando sesión activa...
      </div>
    );
  }

  if (!autenticado) {
    return (
      <div className="min-h-screen bg-[#030712] text-slate-100 font-mono flex flex-col md:flex-row selection:bg-cyan-500 selection:text-black">
        <aside className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-slate-800/90 bg-slate-950/95 p-3.5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="pb-2.5 border-b border-slate-800/80 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                <h1 className="text-[11px] font-bold tracking-wider text-cyan-300 uppercase">
                  SYNAPSE-X OS
                </h1>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                Selector Central de Portales
              </p>
            </div>

            <nav className="flex flex-col gap-2" aria-label="Selector de Portales">
              {ORDEN_PORTALES.map((idPortal) => {
                const item = CONFIG_PORTALES[idPortal];
                const activo = portalSeleccionado === idPortal;
                return (
                  <button
                    key={idPortal}
                    type="button"
                    onClick={() => setPortalSeleccionado(idPortal)}
                    className={`w-full px-3.5 py-2.5 rounded-lg text-[11px] font-bold leading-snug overflow-hidden transition-all cursor-pointer flex items-center justify-start gap-2 ${
                      activo
                        ? item.botonActivoClass
                        : "bg-slate-900/90 text-slate-200 hover:bg-slate-800 border border-slate-700/80"
                    }`}
                  >
                    <span className="text-xs leading-none shrink-0">{item.emblema}</span>
                    <span className="min-w-0 flex-1 text-left">{item.etiquetaBoton}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="hidden md:block pt-3 mt-4 border-t border-slate-900 text-[9px] text-slate-500 leading-tight">
            SYNAPSE-X OS © 2026
          </div>
        </aside>

        <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-2xl flex flex-col items-center">
            {portalSeleccionado === "creador" ? (
              <div className="w-full flex flex-col items-center [&>div]:border-slate-800 [&>div]:bg-[#070d1a] [&_h1]:!text-xl [&_h1]:md:!text-2xl [&_h1]:!leading-tight [&_h1]:!text-emerald-400">
                <CreadorLogin
                  onLoginSuccess={(rol, cedula) => {
                    const reg = obtenerCredencialCreadorPorCedula(cedula);
                    handleLoginSuccess(
                      rol,
                      cedula,
                      reg?.nivel
                        ? String(reg.nivel)
                        : "Nivel 10 - Acceso Total Absoluto (Super User / Creador)",
                      true
                    );
                  }}
                />
              </div>
            ) : (
              <PortalAccesoSimpleLED
                portal={portalSeleccionado}
                onLoginSuccess={handleLoginSuccess}
              />
            )}
          </div>
        </main>
      </div>
    );
  }

  const mostrarConsolaPorSidebar =
    areaActiva === "creador" && ESTACIONES_CONSOLA_NUEVA.has(estacionActiva);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-mono">
      <AreaOperacionesActiva
        rolActivo={rolActivo}
        cedulaActiva={cedulaActiva}
        nivelActivo={nivelActivo}
        esBovedaFamiliarActiva={esBovedaFamiliarActiva}
        areaActiva={areaActiva}
        setAreaActiva={setAreaActiva}
        estacionActiva={estacionActiva}
        setEstacionActiva={setEstacionActiva}
        avisoActualizacion={avisoActualizacion}
        onRefrescarEstado={handleRefrescarEstado}
        onCerrarSesion={handleCerrarSesion}
      />

      {mostrarConsolaPorSidebar && (
        <section className="max-w-7xl mx-auto px-4 pb-8 pt-2">
          <ConsolaPortalesCreador
            vistaInicial={estacionActiva as "AC00" | "AC09" | "AC10"}
          />
        </section>
      )}
    </div>
  );
}