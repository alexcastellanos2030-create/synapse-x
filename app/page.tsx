"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import SidebarServicioTecnico from "./components/AreaServicioTecnico/SidebarServicioTecnico";
import SidebarUsuario from "./components/AreaUsuario/SidebarUsuario";
import CreadorLogin from "./components/AreaCreador/CreadorLogin";
import BovedaFamiliarAC01 from "./components/AreaCreador/PortalesCreador/BovedaFamiliarAC01";

type PortalTipo = "creador" | "ingeniero" | "tecnico" | "usuario";
type LedEstado = "white" | "yellow" | "green" | "red";

interface OperadorPortal {
  cedula: string;
  nombre: string;
  clave: string;
  nivel: string;
  rol: string;
}

const CLAVES_SESION = [
  "synapse_sesion_activa",
  "synapse_rol_activo",
  "synapse_cedula_activa",
  "synapse_nivel_activo",
  "synapse_area_activa",
  "synapse_estacion_activa",
];

const OPERADORES_RESPALDO: Record<Exclude<PortalTipo, "creador">, OperadorPortal[]> = {
  ingeniero: [
    {
      cedula: "10433935",
      nombre: "Alexander Segundo Castellanos Perozo",
      clave: "*Paola123!",
      nivel: "Nivel 10 - Ingeniero / Creador",
      rol: "ingeniero",
    },
  ],
  tecnico: [
    {
      cedula: "10433935",
      nombre: "Alexander Segundo Castellanos Perozo",
      clave: "*Paola123!",
      nivel: "Nivel 10 - Técnico Principal",
      rol: "tecnico",
    },
  ],
  usuario: [
    {
      cedula: "10433935",
      nombre: "Alexander Segundo Castellanos Perozo",
      clave: "*Paola123!",
      nivel: "Nivel 10 - Super User",
      rol: "usuario",
    },
    {
      cedula: "279276795",
      nombre: "Aleanny Castellanos",
      clave: "*Aleanny123",
      nivel: "Nivel 1 - Solo Ver",
      rol: "usuario",
    },
    {
      cedula: "33323644",
      nombre: "Albany Castellanos",
      clave: "*Albany123",
      nivel: "Nivel 1 - Solo Ver",
      rol: "usuario",
    },
  ],
};

function getLedClass(estado: LedEstado) {
  switch (estado) {
    case "green":
      return "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)] border-emerald-200";
    case "yellow":
      return "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)] border-amber-200";
    case "red":
      return "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)] border-red-200";
    default:
      return "bg-slate-700 shadow-none border-slate-600";
  }
}

interface PortalSimpleLedProps {
  portal: Exclude<PortalTipo, "creador">;
  titulo: string;
  subtitulo: string;
  onLoginSuccess: (rol: string, cedula: string, nivel: string) => void;
}

function PortalAccesoSimpleLED({
  portal,
  titulo,
  subtitulo,
  onLoginSuccess,
}: PortalSimpleLedProps) {
  const [cedula, setCedula] = useState("");
  const [nombreVerificado, setNombreVerificado] = useState("");
  const [clave, setClave] = useState("");
  const [usuarioEncontrado, setUsuarioEncontrado] = useState<OperadorPortal | null>(null);
  const [listaUsuarios, setListaUsuarios] = useState<OperadorPortal[]>(
    OPERADORES_RESPALDO[portal]
  );

  const [led1, setLed1] = useState<LedEstado>("white");
  const [led2, setLed2] = useState<LedEstado>("white");
  const [led3, setLed3] = useState<LedEstado>("white");
  const [mensaje, setMensaje] = useState("Paso 1: Ingrese su número de cédula.");
  const [paso1Ok, setPaso1Ok] = useState(false);

  useEffect(() => {
    setCedula("");
    setNombreVerificado("");
    setClave("");
    setUsuarioEncontrado(null);
    setLed1("white");
    setLed2("white");
    setLed3("white");
    setPaso1Ok(false);
    setMensaje("Paso 1: Ingrese su número de cédula.");

    let base = [...OPERADORES_RESPALDO[portal]];

    async function cargarDesdeSupabase() {
      try {
        const { data, error } = await supabase.from("boveda_familiar").select("*");
        if (!error && Array.isArray(data) && data.length > 0) {
          const remotos: OperadorPortal[] = data.map((row: any) => ({
            cedula: String(row.cedula || "").trim(),
            nombre: String(row.nombre || "").trim(),
            clave: String(row.claveMaestra || row.clave_maestra || "*Paola123!").trim(),
            nivel:
              Number(row.nivel) === 10
                ? "Nivel 10 - Super User"
                : `Nivel ${Number(row.nivel) || 1} - Solo Ver`,
            rol: portal,
          }));

          const mapa = new Map<string, OperadorPortal>();
          base.forEach((u) => mapa.set(u.cedula, u));
          remotos.forEach((u) => {
            if (u.cedula) mapa.set(u.cedula, { ...u, rol: portal });
          });
          base = Array.from(mapa.values());
          setListaUsuarios(base);
        }
      } catch {
        // Mantiene respaldo local si no hay conexión
      }
    }

    setListaUsuarios(base);
    cargarDesdeSupabase();
  }, [portal]);

  const handleCedula = (valorCrudo: string) => {
    const limpio = valorCrudo.replace(/\s+/g, "");
    setCedula(limpio);
    setClave("");
    setLed3("white");

    if (/[^0-9]/.test(limpio)) {
      setLed1("red");
      setLed2("white");
      setNombreVerificado("");
      setUsuarioEncontrado(null);
      setPaso1Ok(false);
      setMensaje("Alerta Paso 1: Ingrese solo números en la cédula.");
      return;
    }

    if (!limpio) {
      setLed1("white");
      setLed2("white");
      setNombreVerificado("");
      setUsuarioEncontrado(null);
      setPaso1Ok(false);
      setMensaje("Paso 1: Ingrese su número de cédula.");
      return;
    }

    setLed1("yellow");
    setMensaje("Paso 1: Verificando cédula...");

    const encontrado = listaUsuarios.find((u) => u.cedula === limpio);
    if (encontrado) {
      setLed1("green");
      setLed2("green");
      setNombreVerificado(encontrado.nombre);
      setUsuarioEncontrado(encontrado);
      setPaso1Ok(true);
      setMensaje(`Paso 1 y 2 OK: ${encontrado.nombre}. Ingrese su clave en el Paso 3.`);
    } else if (limpio.length >= 8) {
      setLed1("red");
      setLed2("white");
      setNombreVerificado("");
      setUsuarioEncontrado(null);
      setPaso1Ok(false);
      setMensaje("Cédula no registrada para este portal.");
    } else {
      setLed2("white");
      setNombreVerificado("");
      setUsuarioEncontrado(null);
      setPaso1Ok(false);
      setMensaje("Paso 1: Escribiendo número de cédula...");
    }
  };

  const handleClave = (valor: string) => {
    if (!paso1Ok || !usuarioEncontrado) {
      setMensaje("Complete primero el Paso 1 con una cédula válida.");
      return;
    }

    setClave(valor);
    if (!valor) {
      setLed3("white");
      setMensaje("Paso 3: Ingrese su clave de acceso.");
      return;
    }

    setLed3("yellow");
    const clavesExtraCreador =
      usuarioEncontrado.cedula === "10433935"
        ? ["*Paola123!", "*Ac12345!", "Iar661972", "Albany123"]
        : [usuarioEncontrado.clave];

    if (
      valor.trim() === usuarioEncontrado.clave.trim() ||
      clavesExtraCreador.includes(valor.trim())
    ) {
      setLed3("green");
      setMensaje("¡Credencial validada! Listo para ingresar.");
    } else {
      setLed3("red");
      setMensaje("Paso 3: Verificando clave de acceso...");
    }
  };

  const puedeEntrar = led1 === "green" && led2 === "green" && led3 === "green";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!puedeEntrar || !usuarioEncontrado) return;
    onLoginSuccess(usuarioEncontrado.rol, usuarioEncontrado.cedula, usuarioEncontrado.nivel);
  };

  return (
    <div className="w-full max-w-lg bg-[#070d1a] border border-slate-800 rounded-2xl p-5 shadow-2xl relative font-mono text-slate-100">
      <div className="mb-4 pb-3 border-b border-slate-800 flex items-center justify-between bg-black/60 px-4 py-2.5 rounded-xl">
        <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest">
          ESTADO LED:
        </span>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5" title="1. Cédula">
            <span
              className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 ${getLedClass(
                led1
              )}`}
            />
            <span className="text-[10px] text-slate-300 font-bold">1</span>
          </div>
          <div className="flex items-center space-x-1.5" title="2. Identidad">
            <span
              className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 ${getLedClass(
                led2
              )}`}
            />
            <span className="text-[10px] text-slate-300 font-bold">2</span>
          </div>
          <div className="flex items-center space-x-1.5" title="3. Clave">
            <span
              className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 ${getLedClass(
                led3
              )}`}
            />
            <span className="text-[10px] text-slate-300 font-bold">3</span>
          </div>
        </div>
      </div>

      <div className="text-center mb-5">
        <h1 className="text-sm font-bold tracking-widest text-cyan-300 uppercase">{titulo}</h1>
        <p className="text-[11px] text-slate-400 mt-1">{subtitulo}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        <div>
          <label className="block text-slate-400 mb-1 uppercase tracking-wider">
            1. Nro. de Cédula:
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={cedula}
            onChange={(e) => handleCedula(e.target.value)}
            placeholder="Ingrese su cédula..."
            required
            className="w-full bg-[#030712] border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-slate-400 mb-1 uppercase tracking-wider">
            2. Identidad Verificada:
          </label>
          <input
            type="text"
            value={nombreVerificado}
            readOnly
            placeholder="Aguardando cédula..."
            className="w-full bg-[#030712]/50 border border-slate-800 rounded px-3 py-2 text-emerald-400 font-semibold cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-slate-400 mb-1 uppercase tracking-wider">
            3. Clave de Acceso:
          </label>
          <input
            type="password"
            value={clave}
            onChange={(e) => handleClave(e.target.value)}
            disabled={!paso1Ok}
            placeholder="••••••••••••"
            required
            className="w-full bg-[#030712] border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400 disabled:opacity-50"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={!puedeEntrar}
            className={`font-bold w-full py-3 rounded text-xs uppercase tracking-widest transition-all shadow-lg ${
              puedeEntrar
                ? "bg-emerald-400 text-black cursor-pointer shadow-emerald-400/30"
                : "bg-slate-800 text-slate-500 cursor-not-allowed opacity-60"
            }`}
          >
            {puedeEntrar ? "🔓 Candado Abierto - Entrar" : "🔒 Ingrese Cédula y Clave"}
          </button>
        </div>
      </form>

      <div className="mt-4 p-2.5 rounded text-[11px] font-semibold text-center border bg-[#030712] border-slate-800 text-slate-300">
        {mensaje}
      </div>
    </div>
  );
}

export default function Home() {
  const [sesionLista, setSesionLista] = useState<boolean>(false);
  const [autenticado, setAutenticado] = useState<boolean>(false);
  const [rolActivo, setRolActivo] = useState<string>("");
  const [cedulaActiva, setCedulaActiva] = useState<string>("");
  const [nivelActivo, setNivelActivo] = useState<string>("");
  const [portalSeleccionado, setPortalSeleccionado] = useState<PortalTipo>("creador");
  const [areaActiva, setAreaActiva] = useState<string>("creador");
  const [estacionActiva, setEstacionActiva] = useState<string>("AC01");
  const [avisoActualizacion, setAvisoActualizacion] = useState<string>("");

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

  const cambiarPortal = (portal: PortalTipo) => {
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
      <div className="min-h-screen bg-[#030712] text-slate-100 font-mono flex flex-col md:flex-row selection:bg-cyan-500 selection:text-black">
        {/* Barra lateral izquierda dedicada con título y los 4 portales */}
        <aside className="w-full md:w-72 shrink-0 border-b md:border-b-0 md:border-r border-slate-800/90 bg-slate-950/95 p-5 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="pb-4 border-b border-slate-800/80">
              <div className="flex items-center space-x-2.5">
                <span className="inline-block w-3 h-3 rounded-full bg-cyan-400 animate-pulse shrink-0"></span>
                <h1 className="text-sm font-bold tracking-widest text-cyan-300 uppercase">
                  SYNAPSE-X OS
                </h1>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-snug">
                Selector Central de Portales de Acceso
              </p>
            </div>

            <nav className="flex flex-col gap-2" aria-label="Selector de Portales">
              <button
                type="button"
                onClick={() => cambiarPortal("creador")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                  portalSeleccionado === "creador"
                    ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                    : "bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800"
                }`}
              >
                <span>👑 Portal Creador</span>
                <span className="text-[10px] opacity-80">4 LED</span>
              </button>

              <button
                type="button"
                onClick={() => cambiarPortal("ingeniero")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                  portalSeleccionado === "ingeniero"
                    ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20"
                    : "bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800"
                }`}
              >
                <span>⚙️ Portal Ingeniero (ST)</span>
                <span className="text-[10px] opacity-80">3 LED</span>
              </button>

              <button
                type="button"
                onClick={() => cambiarPortal("tecnico")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                  portalSeleccionado === "tecnico"
                    ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                    : "bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800"
                }`}
              >
                <span>🔧 Portal Técnico (ST)</span>
                <span className="text-[10px] opacity-80">3 LED</span>
              </button>

              <button
                type="button"
                onClick={() => cambiarPortal("usuario")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                  portalSeleccionado === "usuario"
                    ? "bg-purple-500 text-black shadow-lg shadow-purple-500/20"
                    : "bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800"
                }`}
              >
                <span>🏭 Portal Empresa / Operadores</span>
                <span className="text-[10px] opacity-80">3 LED</span>
              </button>
            </nav>
          </div>

          <div className="pt-4 mt-6 border-t border-slate-900 text-[10px] text-slate-500 leading-relaxed">
            SYNAPSE-X OS Industrial Automation © 2026 — Todos los derechos reservados.
          </div>
        </aside>

        {/* Área central derecha con el formulario del portal activo */}
        <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-xl flex flex-col items-center">
            {portalSeleccionado === "creador" && (
              <CreadorLogin
                onLoginSuccess={(rol, cedula) => {
                  handleLoginSuccess(rol, cedula, "10");
                }}
              />
            )}

            {portalSeleccionado === "ingeniero" && (
              <PortalAccesoSimpleLED
                portal="ingeniero"
                titulo="ÁREA DE SERVICIO TÉCNICO - INGENIEROS"
                subtitulo="Validación en 3 pasos • Cédula, Identidad y Clave"
                onLoginSuccess={handleLoginSuccess}
              />
            )}

            {portalSeleccionado === "tecnico" && (
              <PortalAccesoSimpleLED
                portal="tecnico"
                titulo="ÁREA DE SOPORTE - TÉCNICOS"
                subtitulo="Validación en 3 pasos • Cédula, Identidad y Clave"
                onLoginSuccess={handleLoginSuccess}
              />
            )}

            {portalSeleccionado === "usuario" && (
              <PortalAccesoSimpleLED
                portal="usuario"
                titulo="PORTAL DE OPERADORES Y LICENCIA DE EMPRESA"
                subtitulo="Validación en 3 pasos • Cédula, Identidad y Clave"
                onLoginSuccess={handleLoginSuccess}
              />
            )}
          </div>
        </main>
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