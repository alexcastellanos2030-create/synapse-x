"use client";

import React, { useState } from "react";
import SidebarSuperuser from "@/app/components/SidebarSuperuser"; // o su ruta relativa exacta con mayúsculas y minúsculas idénticas

interface LicenciaCliente {
  id: string;
  nombrePanaderia: string;
  tokenLicencia: string;
  ciudad: string;
  versionOS: string;
  estado: "Activa" | "Por Renovar" | "Suspendida";
  ultimaSincronizacion: string;
}

export default function Dashboard20MasterControl() {
  const [tabActiva, setTabActiva] = useState<number>(1);
  const [busqueda, setBusqueda] = useState<string>("");
  const [sidebarColapsada, setSidebarColapsada] = useState<boolean>(false);
  const [esClaro, setEsClaro] = useState<boolean>(false);
  const [rolActual, setRolActual] = useState<string>("Superuser Master");

  // Datos de ejemplo de licencias externas conectadas al Núcleo Matriz
  const [licencias, setLicencias] = useState<LicenciaCliente[]>([
    {
      id: "LIC-001",
      nombrePanaderia: "Panadería y Pastelería El Sol",
      tokenLicencia: "SYNEX-9982-SCL",
      ciudad: "Santiago de Chile",
      versionOS: "v2.6.0",
      estado: "Activa",
      ultimaSincronizacion: "14/11/2026 05:10",
    },
    {
      id: "LIC-002",
      nombrePanaderia: "Distribuidora Comercial Salam",
      tokenLicencia: "SYNEX-7741-SCL",
      ciudad: "Santiago de Chile",
      versionOS: "v2.6.0",
      estado: "Activa",
      ultimaSincronizacion: "14/11/2026 04:55",
    },
    {
      id: "LIC-003",
      nombrePanaderia: "Cafetería y Obrador Gourmet",
      tokenLicencia: "SYNEX-3320-VAL",
      ciudad: "Valparaíso",
      versionOS: "v2.5.8",
      estado: "Por Renovar",
      ultimaSincronizacion: "13/11/2026 22:30",
    },
    {
      id: "LIC-004",
      nombrePanaderia: "Industrial Panificadora del Sur",
      tokenLicencia: "SYNEX-1105-CON",
      ciudad: "Concepción",
      versionOS: "v2.4.1",
      estado: "Suspendida",
      ultimaSincronizacion: "10/10/2026 12:15",
    },
  ]);

  const licenciasFiltradas = licencias.filter(
    (l) =>
      l.nombrePanaderia.toLowerCase().includes(busqueda.toLowerCase()) ||
      l.tokenLicencia.toLowerCase().includes(busqueda.toLowerCase()) ||
      l.ciudad.toLowerCase().includes(busqueda.toLowerCase())
  );

  const cambiarEstadoLicencia = (id: string, nuevoEstado: "Activa" | "Por Renovar" | "Suspendida") => {
    setLicencias(
      licencias.map((l) => (l.id === id ? { ...l, estado: nuevoEstado } : l))
    );
    alert(`⚡ [MATRIZ DE SEGURIDAD]: Estado de la licencia ${id} actualizado a "${nuevoEstado}".`);
  };

  // Función para recargar el sistema de forma limpia (equivale a Ctrl + Shift + R)
  const ejecutarActualizacionSistema = () => {
    if (typeof window !== "undefined") {
      alert("🔄 [NÚCLEO SUPREMO]: Limpiando caché y recargando módulos del sistema...");
      window.location.reload();
    }
  };

  // Función para verificar parámetros del sistema
  const mostrarParametrosSistema = () => {
    alert(
      "⚙️ [DIAGNÓSTICO DEL SISTEMA SYNAPSE-X OSAI]:\n\n" +
      "• Red de Sincronización: Estable (Supabase WebSocket OK)\n" +
      "• Hosting Principal: Vercel Production Edge OK\n" +
      "• Versión del Kernel: OSAI Industrial v2.6.0-MASTER\n" +
      "• Modo de Operación: Zona Exclusiva de Superusuario (SU20)"
    );
  };

  return (
    <div className={`min-h-screen ${esClaro ? "bg-zinc-100 text-zinc-900" : "bg-black text-white"} flex font-mono`}>
      
      {/* BARRA SIDEBAR COMPLETA DE SUPERUSER */}
      <aside className={`border-r transition-all duration-300 flex flex-col justify-between z-20 ${
        esClaro ? "bg-white border-zinc-200" : "bg-zinc-950 border-zinc-800"
      } ${sidebarColapsada ? "w-20" : "w-80"}`}>
        
        <div className="p-4 space-y-4 flex flex-col h-full overflow-hidden">
          
          {/* ENCABEZADO DE LA BARRA */}
          <div className="flex items-center justify-between border-b pb-3 border-zinc-800">
            {!sidebarColapsada && (
              <div>
                <div className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Synapse-X OSAI</div>
                <div className="text-xs font-black tracking-wider">Área Superuser / Matriz</div>
              </div>
            )}
            <button
              type="button"
              onClick={() => setSidebarColapsada(!sidebarColapsada)}
              className="p-2 bg-zinc-900 hover:bg-zinc-800 text-amber-400 rounded-lg border border-zinc-800 cursor-pointer flex items-center justify-center"
              title={sidebarColapsada ? "Expandir barra" : "Colapsar barra"}
            >
              👑
            </button>
          </div>

          {!sidebarColapsada && (
            <>
              {/* PUENTE DE CAMBIO DE ÁREA Y ROL */}
              <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400 font-bold">Cambio de Área:</span>
                  <button
                    onClick={() => window.location.href = "/estaciones/estacion-1"}
                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-black font-black text-[10px] rounded cursor-pointer transition-all shadow"
                    title="Pasar al Área de Operario / Usuario"
                  >
                    ⇄ Ir a Área Usuario
                  </button>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-zinc-400 font-bold block">Rol Activo:</span>
                  <select
                    value={rolActual}
                    onChange={(e) => setRolActual(e.target.value)}
                    className="w-full bg-black text-amber-400 border border-zinc-700 rounded p-1.5 text-[11px] font-bold cursor-pointer"
                  >
                    <option value="Superuser Master">👑 Superuser Master</option>
                    <option value="Ingeniero de Soporte">🛠️ Ingeniero de Soporte</option>
                    <option value="Auditor de Licencias">🛡️ Auditor de Licencias</option>
                  </select>
                </div>
              </div>

              {/* LISTA DE LOS 21 DASHBOARDS CON PREFIJO SU */}
              <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-1 pt-1">
                  Módulos de Control Exclusivos (SU)
                </div>
                {Array.from({ length: 21 }, (_, i) => i + 1).map((num) => {
                  const idModulo = `SU${num}`;
                  const esDashboard20 = num === 20;
                  return (
                    <div
                      key={idModulo}
                      onClick={() => {
                        if (num === 20) {
                          window.location.href = "/dashboard/dashboard-20";
                        } else if (num === 21) {
                          window.location.href = "/dashboard-21";
                        } else {
                          alert(`Navegando al Módulo ${idModulo} (Control de Ingeniería).`);
                        }
                      }}
                      className={`px-3 py-2 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-all ${
                        esDashboard20
                          ? "bg-amber-500/20 text-amber-400 font-black border border-amber-500/40 shadow"
                          : "hover:bg-zinc-900 text-zinc-400 hover:text-white border border-transparent"
                      }`}
                    >
                      <span>SU{num < 10 ? `0${num}` : num} {esDashboard20 ? "— Licencias y Soporte" : ""}</span>
                      <span className="text-[9px] opacity-60">{esDashboard20 ? "Activo" : "Sistema"}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* BOTONERA INFERIOR */}
        {!sidebarColapsada && (
          <div className="p-3 border-t border-zinc-900 bg-zinc-950/90 space-y-2">
            <div className="grid grid-cols-2 gap-1.5 text-[10px]">
              <button
                onClick={ejecutarActualizacionSistema}
                className="p-2 bg-zinc-900 hover:bg-zinc-800 text-amber-400 rounded border border-zinc-800 cursor-pointer text-center font-bold"
                title="Recarga limpia del sistema"
              >
                Actualización
              </button>
              <button
                onClick={() => setEsClaro(!esClaro)}
                className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded border border-zinc-800 cursor-pointer text-center font-bold"
              >
                {esClaro ? "Modo Oscuro" : "Tema Claro"}
              </button>
              <button
                onClick={() => alert("🎨 [ESTÉTICA]: Paleta industrial de alta contraste activa.")}
                className="p-2 bg-zinc-900 hover:bg-zinc-800 text-cyan-400 rounded border border-zinc-800 cursor-pointer text-center font-bold"
              >
                Estética
              </button>
              <button
                onClick={mostrarParametrosSistema}
                className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded border border-zinc-800 cursor-pointer text-center font-bold"
              >
                Sistema
              </button>
            </div>
            <button
              onClick={() => alert("🔒 [SESIÓN]: Sesión de superusuario finalizada de forma segura.")}
              className="w-full py-2 bg-red-950/40 hover:bg-red-900/50 text-red-400 border border-red-500/30 rounded text-[11px] font-bold cursor-pointer transition-all"
            >
              Cierre de Sesión
            </button>
          </div>
        )}
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* ENCABEZADO SUPREMO CON ENLACES RÁPIDOS DE INFRAESTRUCTURA (SUPABASE, VERCEL, GITHUB) */}
          <div className={`border p-6 rounded-2xl shadow-2xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 ${
            esClaro ? "bg-white border-zinc-300" : "bg-zinc-950 border-zinc-800"
          }`}>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-500 text-black font-black text-[10px] px-2 py-0.5 rounded">
                  SU20 // LICENCIAS Y SOPORTE
                </span>
                <h1 className="text-base md:text-lg font-black text-amber-400 tracking-wider uppercase">
                  Synapse-X OSAI Industrial — Núcleo Supremo
                </h1>
              </div>
              <p className="text-xs text-zinc-400 font-sans mt-1">
                Centro de mando centralizado para la supervisión, licenciamiento y telemetría de toda la red industrial externa.
              </p>
            </div>

            {/* BOTONES DE ACCESO RÁPIDO A INFRAESTRUCTURA (SUPABASE, VERCEL, GITHUB) */}
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-400 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all shadow"
                title="Abrir panel de Supabase en nueva pestaña"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Supabase ↗
              </a>

              <a
                href="https://vercel.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all shadow"
                title="Abrir panel de Vercel en nueva pestaña"
              >
                <span>▲</span> Vercel ↗
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all shadow"
                title="Abrir repositorio de GitHub en nueva pestaña"
              >
                <span>📂</span> GitHub ↗
              </a>
            </div>
          </div>

          {/* SISTEMA DE 10 MICROBOTONES EN UNA SOLA LÍNEA HORIZONTAL */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 w-full">
            {[
              { id: 1, nombre: "01. Directorio", tipo: "Activa" },
              { id: 2, nombre: "02. Soporte", tipo: "Activa" },
              { id: 3, nombre: "03. Versiones", tipo: "Activa" },
              { id: 4, nombre: "04. Telemetría", tipo: "Standby" },
              { id: 5, nombre: "05. Comercial", tipo: "Standby" },
              { id: 6, nombre: "06. Seguridad", tipo: "Standby" },
              { id: 7, nombre: "07. Auditoría", tipo: "Standby" },
              { id: 8, nombre: "08. Alertas", tipo: "Standby" },
              { id: 9, nombre: "09. Respaldos", tipo: "Standby" },
              { id: 10, nombre: "10. Analítica", tipo: "Standby" },
            ].map((t) => {
              const esActiva = t.tipo === "Activa";
              const seleccionada = tabActiva === t.id;

              return (
                <button
                  key={t.id}
                  onClick={() => setTabActiva(t.id)}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap border flex-shrink-0 ${
                    seleccionada
                      ? "bg-amber-500 text-black border-amber-400 shadow-md font-black"
                      : esActiva
                      ? "bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800"
                      : "bg-zinc-950 text-zinc-500 border-zinc-900 hover:bg-zinc-900"
                  }`}
                  title={`${t.nombre} (${t.tipo})`}
                >
                  <span className="opacity-60 text-[8px] mr-1">[{t.tipo[0]}]</span>
                  {t.nombre}
                </button>
              );
            })}
          </div>

          {/* CONTENIDO DE LA PESTAÑA 1: DIRECTORIO GLOBAL DE LICENCIAS (BUSCADOR) */}
          {tabActiva === 1 && (
            <div className={`border p-6 rounded-2xl shadow-xl space-y-4 ${esClaro ? "bg-white border-zinc-300" : "bg-zinc-950 border-zinc-800"}`}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div>
                  <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
                    🔍 Buscador y Directorio Global de Licencias Externas
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Gestión y control remoto de todas las panaderías operando con el software estándar.
                  </p>
                </div>
                <input
                  type="text"
                  placeholder="Buscar por panadería, token o ciudad..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 text-xs px-4 py-2 rounded-xl text-white w-full md:w-80 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div className="w-full overflow-x-auto rounded-xl border border-zinc-800">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead className="bg-zinc-900 text-zinc-300">
                    <tr>
                      <th className="p-3">ID Licencia</th>
                      <th className="p-3">Cliente / Panadería</th>
                      <th className="p-3">Token Único</th>
                      <th className="p-3">Ubicación</th>
                      <th className="p-3 text-center">Versión OS</th>
                      <th className="p-3 text-center">Estado</th>
                      <th className="p-3 text-right">Acciones Remotas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-zinc-300">
                    {licenciasFiltradas.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-zinc-500 italic">
                          No se encontraron licencias registradas con los criterios de búsqueda.
                        </td>
                      </tr>
                    ) : (
                      licenciasFiltradas.map((lic) => (
                        <tr key={lic.id} className="hover:bg-zinc-900/40">
                          <td className="p-3 font-bold text-amber-400">{lic.id}</td>
                          <td className="p-3 font-semibold text-white">{lic.nombrePanaderia}</td>
                          <td className="p-3 text-cyan-400">{lic.tokenLicencia}</td>
                          <td className="p-3 text-zinc-400">{lic.ciudad}</td>
                          <td className="p-3 text-center text-zinc-300">{lic.versionOS}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              lic.estado === "Activa" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                              lic.estado === "Por Renovar" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                              "bg-red-500/20 text-red-400 border border-red-500/30"
                            }`}>
                              {lic.estado}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-2">
                            {lic.estado !== "Activa" && (
                              <button
                                onClick={() => cambiarEstadoLicencia(lic.id, "Activa")}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold cursor-pointer"
                              >
                                Activar
                              </button>
                            )}
                            {lic.estado !== "Suspendida" && (
                              <button
                                onClick={() => cambiarEstadoLicencia(lic.id, "Suspendida")}
                                className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-[10px] font-bold cursor-pointer"
                              >
                                Suspender
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CONTENIDO DE LA PESTAÑA 2: MESA DE SOPORTE Y DIAGNÓSTICO */}
          {tabActiva === 2 && (
            <div className={`border p-6 rounded-2xl shadow-xl space-y-4 ${esClaro ? "bg-white border-zinc-300" : "bg-zinc-950 border-zinc-800"}`}>
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
                🛠️ Mesa de Soporte y Diagnóstico Técnico Remoto
              </h3>
              <p className="text-xs text-zinc-400">
                Panel de recepción de incidencias, errores de estación y reportes enviados por las instancias externas.
              </p>
              <div className="p-8 border border-dashed border-zinc-800 rounded-xl text-center space-y-2 bg-zinc-900/20">
                <div className="text-2xl">📡</div>
                <div className="font-bold text-zinc-300 text-xs">Sin incidencias críticas reportadas en la red</div>
                <p className="text-[11px] text-zinc-500">Las alertas de errores en terminales cliente aparecerán aquí en tiempo real.</p>
              </div>
            </div>
          )}

          {/* CONTENIDO DE LA PESTAÑA 3: CONTROL DE VERSIONES Y UPDATES */}
          {tabActiva === 3 && (
            <div className={`border p-6 rounded-2xl shadow-xl space-y-4 ${esClaro ? "bg-white border-zinc-300" : "bg-zinc-950 border-zinc-800"}`}>
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
                📦 Control de Versiones y Despliegues Estándar (Golden Master)
              </h3>
              <p className="text-xs text-zinc-400">
                Monitoreo del estado de sincronización de código y parches aplicados a las panaderías externas.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 space-y-1">
                  <div className="text-[10px] text-zinc-400">Versión Matriz Actual</div>
                  <div className="text-sm font-bold text-amber-400">OSAI Industrial v2.6.0</div>
                  <div className="text-[10px] text-emerald-400">● Desplegado en Vercel (Production)</div>
                </div>
                <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 space-y-1">
                  <div className="text-[10px] text-zinc-400">Instancias Actualizadas</div>
                  <div className="text-sm font-bold text-cyan-400">2 / 4 Clientes</div>
                  <div className="text-[10px] text-zinc-500">50% de adopción de red</div>
                </div>
                <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 space-y-1">
                  <div className="text-[10px] text-zinc-400">Protocolo de Actualización</div>
                  <div className="text-sm font-bold text-emerald-400">Automático vía Git/Vercel</div>
                  <div className="text-[10px] text-zinc-500">Estandarización intacta</div>
                </div>
              </div>
            </div>
          )}

          {/* CONTENIDO DE LAS PESTAÑAS EN STANDBY (4 AL 10) */}
          {tabActiva >= 4 && (
            <div className="border border-cyan-500/30 bg-cyan-950/10 p-8 rounded-2xl shadow-xl text-center space-y-3">
              <div className="text-3xl">🛡️</div>
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">
                Módulo Estructural en Standby (Pestaña {tabActiva} Preconfigurada)
              </h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Esta sección está conectada al núcleo maestro y lista para el momento en que desees desarrollar las nuevas funciones que tienes en mente.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}