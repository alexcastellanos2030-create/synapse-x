"use client";

import React, { useState } from "react";

// --- TIPOS E INTERFACES OFICIALES ---
export type NivelRango = "Nivel 1 (Básico)" | "Nivel 2 (Medio)" | "Nivel 3 (Avanzado)";
export type RamaSoporte = "Técnico" | "Ingeniero";

export interface PersonalSoporte {
  id: string;
  nombre: string;
  cedula: string;
  rama: RamaSoporte;
  nivel: NivelRango;
  activo: boolean;
}

export interface MiembroFamiliar {
  id: string;
  nombre: string;
  parentesco: string;
  pinAcceso: string;
  notaPrivada: string;
}

export interface RegistroBitacora {
  id: string;
  portal: string;
  fecha: string; // YYYY-MM-DD
  hora: string;
  autor: string;
  detalle: string;
}

export interface AlertaSilenciosa {
  id: string;
  portal: string;
  fechaHora: string;
  responsable: string;
  rango: string;
  mensaje: string;
  revisada: boolean;
}

export interface EnlaceMaestro {
  id: string;
  nombre: string;
  url: string;
  color: string;
}

interface CentroMandoCreadorProps {
  estacionActiva: string;
  setEstacionActiva: (estacion: string) => void;
}

export default function CentroMandoCreador({
  estacionActiva,
  setEstacionActiva,
}: CentroMandoCreadorProps) {
  // Pestaña activa dentro de cada portal ("principal" | "bitacora" | "alertas" | sub-pestañas)
  const [subTab, setSubTab] = useState<string>("principal");
  const [fechaFiltroBitacora, setFechaFiltroBitacora] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  // --- ESTADOS DE DATOS DEL CREADOR ---
  // 1. Bóveda Núcleo Familiar (100% Privada - Solo Creador)
  const [familiares, setFamiliares] = useState<MiembroFamiliar[]>([
    {
      id: "FAM-01",
      nombre: "Hija 1 (Superusuario Familiar)",
      parentesco: "Hija",
      pinAcceso: "9091",
      notaPrivada: "Acceso privilegiado familiar sin visibilidad para soporte técnico.",
    },
    {
      id: "FAM-02",
      nombre: "Hija 2 (Superusuario Familiar)",
      parentesco: "Hija",
      pinAcceso: "9092",
      notaPrivada: "Acceso privilegiado familiar sin visibilidad para soporte técnico.",
    },
  ]);
  const [nuevoFamNombre, setNuevoFamNombre] = useState("");
  const [nuevoFamPin, setNuevoFamPin] = useState("");

  // 2. Equipo de Soporte (Técnicos e Ingenieros Niveles 1, 2 y 3)
  const [staffSoporte, setStaffSoporte] = useState<PersonalSoporte[]>([
    {
      id: "SUP-01",
      nombre: "Carlos Mendoza",
      cedula: "18450210",
      rama: "Técnico",
      nivel: "Nivel 1 (Básico)",
      activo: true,
    },
    {
      id: "SUP-02",
      nombre: "Ing. Valeria Ríos",
      cedula: "15230988",
      rama: "Ingeniero",
      nivel: "Nivel 3 (Avanzado)",
      activo: true,
    },
  ]);
  const [nombreStaff, setNombreStaff] = useState("");
  const [cedulaStaff, setCedulaStaff] = useState("");
  const [ramaStaff, setRamaStaff] = useState<RamaSoporte>("Técnico");
  const [nivelStaff, setNivelStaff] = useState<NivelRango>("Nivel 1 (Básico)");

  // 3. Bitácoras Segregadas por Portal y Día
  const [bitacoras, setBitacoras] = useState<RegistroBitacora[]>([
    {
      id: "BIT-101",
      portal: "AC01",
      fecha: new Date().toISOString().split("T")[0],
      hora: "08:15",
      autor: "Alex Castellanos (Root)",
      detalle: "Inicialización y verificación de integridad del Master Kernel.",
    },
    {
      id: "BIT-102",
      portal: "AC04",
      fecha: new Date().toISOString().split("T")[0],
      hora: "09:30",
      autor: "Ing. Valeria Ríos",
      detalle: "Revisión preventiva de credenciales de acceso remoto en planta.",
    },
  ]);
  const [nuevaNotaBitacora, setNuevaNotaBitacora] = useState("");

  // 4. Alertas Silenciosas de Procedimientos (Supervisión Activa)
  const [alertasSilenciosas, setAlertasSilenciosas] = useState<AlertaSilenciosa[]>([
    {
      id: "ALT-01",
      portal: "AC04",
      fechaHora: "Hoy 10:12",
      responsable: "Carlos Mendoza",
      rango: "Técnico - Nivel 1 (Básico)",
      mensaje: "Intentó acceder a parámetros de base de datos fuera de su nivel asignado.",
      revisada: false,
    },
    {
      id: "ALT-02",
      portal: "AC05",
      fechaHora: "Hoy 11:05",
      responsable: "Sistema Telemetría",
      rango: "Parche Oculto Cliente #04",
      mensaje: "Equipo cliente reporta latencia elevada; huella lista para asistencia remota.",
      revisada: false,
    },
  ]);

  // 5. Enlaces Maestros Personalizables (AC07)
  const [enlacesMaestros, setEnlacesMaestros] = useState<EnlaceMaestro[]>([
    { id: "LNK-1", nombre: "Correo Electrónico (Gmail)", url: "https://mail.google.com", color: "amber" },
    { id: "LNK-2", nombre: "WhatsApp Web Personal", url: "https://web.whatsapp.com", color: "emerald" },
    { id: "LNK-3", nombre: "Panel Supabase DB", url: "https://supabase.com/dashboard", color: "cyan" },
    { id: "LNK-4", nombre: "Vercel Despliegues", url: "https://vercel.com", color: "purple" },
  ]);
  const [nuevoEnlaceNombre, setNuevoEnlaceNombre] = useState("");
  const [nuevoEnlaceUrl, setNuevoEnlaceUrl] = useState("");

  // Pestaña documental activa en AC07
  const [docTab, setDocTab] = useState<
    "permisos" | "protocolos" | "reglamento" | "arquitectura_root" | "seguridad" | "enlaces"
  >("enlaces");

  // --- FUNCIONES DE ACCIÓN ---
  const cambiarPortal = (codigo: string) => {
    setEstacionActiva(codigo);
    setSubTab("principal");
  };

  const agregarFamiliar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoFamNombre.trim() || !nuevoFamPin.trim()) return;
    setFamiliares((prev) => [
      ...prev,
      {
        id: `FAM-0${prev.length + 1}`,
        nombre: nuevoFamNombre,
        parentesco: "Núcleo Familiar",
        pinAcceso: nuevoFamPin,
        notaPrivada: "Registro protegido bajo jerarquía exclusiva del Creador.",
      },
    ]);
    setNuevoFamNombre("");
    setNuevoFamPin("");
  };

  const registrarPersonalSoporte = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreStaff.trim() || !cedulaStaff.trim()) return;
    setStaffSoporte((prev) => [
      ...prev,
      {
        id: `SUP-0${prev.length + 1}`,
        nombre: nombreStaff,
        cedula: cedulaStaff,
        rama: ramaStaff,
        nivel: nivelStaff,
        activo: true,
      },
    ]);
    setNombreStaff("");
    setCedulaStaff("");
  };

  const agregarEntradaBitacora = (portalActual: string) => {
    if (!nuevaNotaBitacora.trim()) return;
    const ahora = new Date();
    setBitacoras((prev) => [
      {
        id: `BIT-${Date.now()}`,
        portal: portalActual,
        fecha: fechaFiltroBitacora,
        hora: `${String(ahora.getHours()).padStart(2, "0")}:${String(ahora.getMinutes()).padStart(2, "0")}`,
        autor: "Alex Castellanos (Creador)",
        detalle: nuevaNotaBitacora,
      },
      ...prev,
    ]);
    setNuevaNotaBitacora("");
  };

  const marcarAlertaRevisada = (id: string) => {
    setAlertasSilenciosas((prev) =>
      prev.map((a) => (a.id === id ? { ...a, revisada: true } : a))
    );
  };

  const agregarEnlaceMaestro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoEnlaceNombre.trim() || !nuevoEnlaceUrl.trim()) return;
    const urlFormateada = nuevoEnlaceUrl.startsWith("http")
      ? nuevoEnlaceUrl
      : `https://${nuevoEnlaceUrl}`;
    setEnlacesMaestros((prev) => [
      ...prev,
      {
        id: `LNK-${Date.now()}`,
        nombre: nuevoEnlaceNombre,
        url: urlFormateada,
        color: "amber",
      },
    ]);
    setNuevoEnlaceNombre("");
    setNuevoEnlaceUrl("");
  };

  // --- COMPONENTE REUTILIZABLE DE BARRA DE PESTAÑAS INTERNAS (PORTAL + BITÁCORA + ALERTAS) ---
  const renderBarraSubTabs = (portalCodigo: string, tituloPrincipal: string) => {
    const alertasPendientes = alertasSilenciosas.filter(
      (a) => a.portal === portalCodigo && !a.revisada
    ).length;

    return (
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/30 pb-3 mb-5">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSubTab("principal")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
              subTab === "principal"
                ? "bg-amber-500 text-black"
                : "bg-slate-900 text-slate-300 border border-slate-700 hover:border-amber-500/50"
            }`}
          >
            📌 {tituloPrincipal}
          </button>

          <button
            onClick={() => setSubTab("bitacora")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
              subTab === "bitacora"
                ? "bg-amber-500 text-black"
                : "bg-slate-900 text-slate-300 border border-slate-700 hover:border-amber-500/50"
            }`}
          >
            📝 Bitácora Diaria ({portalCodigo})
          </button>

          <button
            onClick={() => setSubTab("alertas")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-2 cursor-pointer ${
              subTab === "alertas"
                ? "bg-red-600 text-white"
                : "bg-slate-900 text-slate-300 border border-slate-700 hover:border-red-500/50"
            }`}
          >
            <span>🚨 Alertas Silenciosas</span>
            {alertasPendientes > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] bg-red-500 text-white rounded-full animate-pulse">
                {alertasPendientes}
              </span>
            )}
          </button>
        </div>

        <button
          onClick={() => cambiarPortal("AC00")}
          className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-900 text-amber-400 border border-amber-500/40 hover:bg-amber-500/10 cursor-pointer"
        >
          📖 Portada del Libro (Índice)
        </button>
      </div>
    );
  };

  // --- VISTA REUTILIZABLE DE BITÁCORA POR PORTAL Y DÍA ---
  const renderVistaBitacora = (portalCodigo: string) => {
    const registrosFiltrados = bitacoras.filter(
      (b) => b.portal === portalCodigo && b.fecha === fechaFiltroBitacora
    );

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-amber-400 uppercase">
              Bitácora Exclusiva — Estación {portalCodigo}
            </h3>
            <p className="text-xs text-slate-400">
              Auditoría diaria aislada para supervisión puntual sin ruido de otros módulos.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-mono text-slate-400">Fecha:</label>
            <input
              type="date"
              value={fechaFiltroBitacora}
              onChange={(e) => setFechaFiltroBitacora(e.target.value)}
              className="bg-black border border-amber-500/40 rounded-lg px-3 py-1 text-xs text-white font-mono"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder={`Registrar observación de supervisión en ${portalCodigo}...`}
            value={nuevaNotaBitacora}
            onChange={(e) => setNuevaNotaBitacora(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:border-amber-500 outline-none"
          />
          <button
            onClick={() => agregarEntradaBitacora(portalCodigo)}
            className="px-4 py-2 bg-amber-500 text-black font-bold text-xs rounded-xl hover:bg-amber-400 cursor-pointer"
          >
            + Anotar
          </button>
        </div>

        <div className="space-y-2">
          {registrosFiltrados.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-4 text-center border border-dashed border-slate-800 rounded-xl">
              Sin registros en {portalCodigo} para la fecha {fechaFiltroBitacora}.
            </p>
          ) : (
            registrosFiltrados.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex justify-between items-start gap-4"
              >
                <div>
                  <span className="text-[11px] font-mono text-amber-400 font-bold">
                    [{item.hora}] — {item.autor}
                  </span>
                  <p className="text-xs text-slate-200 mt-1">{item.detalle}</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-black border border-slate-700 rounded text-slate-400">
                  {item.portal}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // --- VISTA REUTILIZABLE DE ALERTAS SILENCIOSAS POR PORTAL ---
  const renderVistaAlertas = (portalCodigo: string) => {
    const listaAlertas = alertasSilenciosas.filter((a) => a.portal === portalCodigo);

    return (
      <div className="space-y-4">
        <div className="bg-red-950/20 border border-red-500/30 p-4 rounded-xl">
          <h3 className="text-sm font-bold text-red-400 uppercase">
            🚨 Radar de Supervisión Silenciosa — {portalCodigo}
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Reportes automáticos sobre cumplimiento de procedimientos de Técnicos e Ingenieros.
            Te permite orientar, corregir o intervenir antes de que ocurra una falla mayor.
          </p>
        </div>

        {listaAlertas.length === 0 ? (
          <p className="text-xs text-slate-500 italic p-6 text-center border border-dashed border-slate-800 rounded-xl">
            Todo en orden. No hay desviaciones ni alertas silenciosas pendientes en {portalCodigo}.
          </p>
        ) : (
          <div className="space-y-2">
            {listaAlertas.map((alerta) => (
              <div
                key={alerta.id}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  alerta.revisada
                    ? "bg-slate-900/40 border-slate-800 opacity-60"
                    : "bg-red-950/30 border-red-500/50"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{alerta.responsable}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-black rounded border border-slate-700 text-amber-300">
                      {alerta.rango}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{alerta.fechaHora}</span>
                  </div>
                  <p className="text-xs text-slate-200">{alerta.mensaje}</p>
                </div>

                {!alerta.revisada ? (
                  <button
                    onClick={() => marcarAlertaRevisada(alerta.id)}
                    className="px-3 py-1.5 bg-amber-500 text-black font-bold text-xs rounded-lg hover:bg-amber-400 shrink-0 cursor-pointer"
                  >
                    ✓ Marcar Supervisada
                  </button>
                ) : (
                  <span className="text-[11px] font-mono text-emerald-400">✔ Auditada</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // =========================================================================
  // RENDERIZADO PRINCIPAL SEGÚN LA ESTACIÓN ACTIVA (AC00 A AC07)
  // =========================================================================
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* AC00: PORTADA DEL LIBRO — ÍNDICE MAESTRO DEL CREADOR */}
      {estacionActiva === "AC00" && (
        <div className="bg-slate-950 border border-amber-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 font-mono text-xs rounded-full border border-amber-500/40">
                👑 JERARQUÍA MÁXIMA — PORTADA MAESTRA DEL CREADOR
              </span>
              <h1 className="text-2xl font-black text-white tracking-wider uppercase mt-2">
                Synapse-X OS — Centro de Comando Root
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Seleccione un capítulo operativo para supervisar bitácoras, alertas silenciosas,
                licencias o personal técnico.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                cod: "AC01",
                titulo: "Master Kernel & Bóveda Familiar",
                desc: "Núcleo del OS y registro privado de Superusuarios Familiares (invisibles al soporte).",
                icono: "🔒",
              },
              {
                cod: "AC02",
                titulo: "Gestión de Módulos Industriales",
                desc: "Activación de estaciones de producción, panadería, inventario y control.",
                icono: "📊",
              },
              {
                cod: "AC03",
                titulo: "Laboratorio HMI & Gemelo Digital",
                desc: "Simulación y pruebas de flujo antes de desplegar a líneas reales.",
                icono: "🧪",
              },
              {
                cod: "AC04",
                titulo: "Técnicos e Ingenieros (Niveles 1-3)",
                desc: "Creación estandarizada de soporte técnico por niveles y supervisión de rangos.",
                icono: "🛠️",
              },
              {
                cod: "AC05",
                titulo: "Licencias & Soporte Remoto Directo",
                desc: "Control de empresas clientes, parche oculto de telemetría y asistencia remota.",
                icono: "🌐",
              },
              {
                cod: "AC06",
                titulo: "Diagnóstico, Logs & Vercel/Git",
                desc: "Estado de Supabase, despliegue en nube y telemetría crítica del servidor.",
                icono: "⚙️",
              },
              {
                cod: "AC07",
                titulo: "Bóveda Documental & Enlaces Rápidos",
                desc: "Permisos, protocolos por capas, seguridad e higiene y accesos directos (WhatsApp/Correo).",
                icono: "📚",
              },
            ].map((item) => (
              <button
                key={item.cod}
                onClick={() => cambiarPortal(item.cod)}
                className="text-left p-5 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/60 rounded-2xl transition group space-y-2 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{item.icono}</span>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 bg-amber-500/10 text-amber-400 rounded border border-amber-500/30 group-hover:bg-amber-500 group-hover:text-black transition">
                    {item.cod}
                  </span>
                </div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wide">
                  {item.titulo}
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* AC01: MASTER KERNEL & BÓVEDA PRIVADA NÚCLEO FAMILIAR */}
      {estacionActiva === "AC01" && (
        <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-6 shadow-2xl">
          {renderBarraSubTabs("AC01", "Master Kernel & Bóveda Familiar")}

          {subTab === "bitacora" && renderVistaBitacora("AC01")}
          {subTab === "alertas" && renderVistaAlertas("AC01")}

          {subTab === "principal" && (
            <div className="space-y-6">
              <div className="bg-amber-950/20 border border-amber-500/40 p-4 rounded-xl">
                <h3 className="text-sm font-bold text-amber-300 uppercase flex items-center gap-2">
                  🔒 Bóveda Privada — Superusuarios Familiares (Acceso Exclusivo Creador)
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Los registros creados aquí pertenecen a tu núcleo familiar directo. Están
                  aislados a nivel de consulta: <strong>ningún técnico ni ingeniero</strong> puede
                  verlos, editarlos o saber que existen en el sistema.
                </p>
              </div>

              <form
                onSubmit={agregarFamiliar}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/70 p-4 rounded-xl border border-slate-800"
              >
                <input
                  type="text"
                  placeholder="Nombre completo (Ej. Hija)"
                  value={nuevoFamNombre}
                  onChange={(e) => setNuevoFamNombre(e.target.value)}
                  className="bg-black border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
                <input
                  type="password"
                  placeholder="PIN Maestro Privado"
                  value={nuevoFamPin}
                  onChange={(e) => setNuevoFamPin(e.target.value)}
                  className="bg-black border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg py-2 px-4 cursor-pointer"
                >
                  + Registrar en Bóveda Familiar
                </button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {familiares.map((fam) => (
                  <div
                    key={fam.id}
                    className="p-4 bg-slate-900 border border-amber-500/30 rounded-xl flex justify-between items-center"
                  >
                    <div>
                      <span className="text-[10px] font-mono text-amber-400 uppercase">
                        {fam.id} • {fam.parentesco} • ROOT_PRIVADO
                      </span>
                      <h4 className="text-sm font-bold text-white">{fam.nombre}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{fam.notaPrivada}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-black border border-amber-500/40 rounded text-xs font-mono text-amber-300">
                      PIN: ••••
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* AC02: GESTIÓN DE MÓDULOS INDUSTRIALES */}
      {estacionActiva === "AC02" && (
        <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-6 shadow-2xl">
          {renderBarraSubTabs("AC02", "Gestión de Módulos")}
          {subTab === "bitacora" && renderVistaBitacora("AC02")}
          {subTab === "alertas" && renderVistaAlertas("AC02")}
          {subTab === "principal" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { nombre: "Módulo Producción & Amasado", estado: "ACTIVO", version: "v2.4" },
                { nombre: "Módulo Registro de Pedidos (AU02)", estado: "ACTIVO", version: "v3.1" },
                { nombre: "Módulo Control de Inventario & Harinas", estado: "ACTIVO", version: "v1.9" },
                { nombre: "Módulo Telemetría & Parche Remoto", estado: "ACTIVO", version: "v1.0" },
              ].map((mod, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-sm font-bold text-white">{mod.nombre}</h4>
                    <span className="text-xs font-mono text-slate-400">Versión {mod.version}</span>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full text-xs font-mono font-bold">
                    {mod.estado}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* AC03: LABORATORIO HMI & GEMELO DIGITAL */}
      {estacionActiva === "AC03" && (
        <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-6 shadow-2xl">
          {renderBarraSubTabs("AC03", "Laboratorio HMI")}
          {subTab === "bitacora" && renderVistaBitacora("AC03")}
          {subTab === "alertas" && renderVistaAlertas("AC03")}
          {subTab === "principal" && (
            <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-xl text-center space-y-3">
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 font-mono text-xs rounded-full border border-cyan-500/40">
                🧪 ENTORNO DE SIMULACIÓN VIRTUAL
              </span>
              <h3 className="text-lg font-bold text-white">Banco de Pruebas de Estaciones</h3>
              <p className="text-xs text-slate-400 max-w-xl mx-auto">
                Aquí puedes simular el comportamiento de las pantallas del Área de Usuario antes de
                liberar actualizaciones a las licencias activas en planta.
              </p>
            </div>
          )}
        </div>
      )}

      {/* AC04: REGISTRO ESTANDARIZADO DE TÉCNICOS E INGENIEROS (NIVELES 1, 2 Y 3) */}
      {estacionActiva === "AC04" && (
        <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-6 shadow-2xl">
          {renderBarraSubTabs("AC04", "Técnicos e Ingenieros (Niveles 1-3)")}
          {subTab === "bitacora" && renderVistaBitacora("AC04")}
          {subTab === "alertas" && renderVistaAlertas("AC04")}

          {subTab === "principal" && (
            <div className="space-y-6">
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
                <h3 className="text-sm font-bold text-amber-400 uppercase">
                  Estandarización de Equipo Superuser (Soporte a Licencias)
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Asigna el rango exacto: <strong>Nivel 1 (Básico)</strong>,{" "}
                  <strong>Nivel 2 (Medio)</strong> o <strong>Nivel 3 (Avanzado)</strong>. Cada
                  nivel delimita automáticamente sus permisos en el Área Superuser.
                </p>

                <form
                  onSubmit={registrarPersonalSoporte}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-4"
                >
                  <input
                    type="text"
                    placeholder="Nombre y Apellido"
                    value={nombreStaff}
                    onChange={(e) => setNombreStaff(e.target.value)}
                    className="bg-black border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Cédula / ID"
                    value={cedulaStaff}
                    onChange={(e) => setCedulaStaff(e.target.value)}
                    className="bg-black border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <select
                    value={ramaStaff}
                    onChange={(e) => setRamaStaff(e.target.value as RamaSoporte)}
                    className="bg-black border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="Técnico">Rama: Técnico</option>
                    <option value="Ingeniero">Rama: Ingeniero</option>
                  </select>
                  <select
                    value={nivelStaff}
                    onChange={(e) => setNivelStaff(e.target.value as NivelRango)}
                    className="bg-black border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="Nivel 1 (Básico)">Nivel 1 (Básico)</option>
                    <option value="Nivel 2 (Medio)">Nivel 2 (Medio)</option>
                    <option value="Nivel 3 (Avanzado)">Nivel 3 (Avanzado)</option>
                  </select>
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg py-2 px-4 cursor-pointer"
                  >
                    + Crear Especialista
                  </button>
                </form>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {staffSoporte.map((persona) => (
                  <div
                    key={persona.id}
                    className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            persona.rama === "Ingeniero"
                              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                              : "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                          }`}
                        >
                          {persona.rama.toUpperCase()}
                        </span>
                        <span className="text-[11px] font-mono text-amber-400 font-bold">
                          {persona.nivel}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-1">{persona.nombre}</h4>
                      <p className="text-xs font-mono text-slate-400">ID: {persona.cedula}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded text-[11px] font-mono">
                      ● Activo
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* AC05: LICENCIAS COMERCIALES & SOPORTE REMOTO SIN FRICCIÓN */}
      {estacionActiva === "AC05" && (
        <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-6 shadow-2xl">
          {renderBarraSubTabs("AC05", "Licencias & Soporte Remoto")}
          {subTab === "bitacora" && renderVistaBitacora("AC05")}
          {subTab === "alertas" && renderVistaAlertas("AC05")}

          {subTab === "principal" && (
            <div className="space-y-4">
              <div className="bg-cyan-950/20 border border-cyan-500/30 p-4 rounded-xl">
                <h3 className="text-sm font-bold text-cyan-300 uppercase">
                  🌐 Consola de Telemetría Silenciosa y Asistencia Remota Directa
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Cada licencia instalada recopila automáticamente la huella técnica del equipo
                  cliente. Si el comprador requiere soporte, basta con autorizar el enlace directo
                  sin instalar programas de terceros.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    licencia: "LIC-SALAM-001",
                    cliente: "Panadería & Distribuidora Salam (Planta Central)",
                    equipo: "WIN11-PRO • IP 192.168.100.145 • Parche Telemetría: OK",
                    estado: "EN LÍNEA",
                  },
                  {
                    licencia: "LIC-CLIENT-002",
                    cliente: "Cliente Corporativo #02 (Sucursal Norte)",
                    equipo: "WIN10-ENT • Huella Hardware Capturada • Parche: OK",
                    estado: "LISTO PARA SOPORTE",
                  },
                ].map((lic, i) => (
                  <div
                    key={i}
                    className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {lic.licencia}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/40">
                        {lic.estado}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{lic.cliente}</h4>
                    <p className="text-[11px] font-mono text-slate-400">{lic.equipo}</p>
                    <button
                      onClick={() =>
                        alert(
                          `Iniciando túnel de soporte remoto directo con ${lic.licencia} usando huella pre-capturada...`
                        )
                      }
                      className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-lg cursor-pointer"
                    >
                      ⚡ Conectar Asistencia Remota Directa
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* AC06: DIAGNÓSTICO, LOGS & DESPLIEGUE */}
      {estacionActiva === "AC06" && (
        <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-6 shadow-2xl">
          {renderBarraSubTabs("AC06", "Diagnóstico, Logs & Despliegue")}
          {subTab === "bitacora" && renderVistaBitacora("AC06")}
          {subTab === "alertas" && renderVistaAlertas("AC06")}
          {subTab === "principal" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-xs font-mono text-slate-400">Base de Datos</span>
                <h4 className="text-base font-bold text-emerald-400 mt-1">Supabase Conectado</h4>
                <p className="text-[11px] text-slate-400 mt-1">Ruta: lib/supabase.ts verificada</p>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-xs font-mono text-slate-400">Producción Nube</span>
                <h4 className="text-base font-bold text-cyan-400 mt-1">Vercel Activo</h4>
                <p className="text-[11px] text-slate-400 mt-1">synapse-x-navy.vercel.app</p>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="text-xs font-mono text-slate-400">Control de Versiones</span>
                <h4 className="text-base font-bold text-amber-400 mt-1">Git Sincronizado</h4>
                <p className="text-[11px] text-slate-400 mt-1">Carpeta única: C:\Users\alexc\synapse-x</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* AC07: BÓVEDA DOCUMENTAL, PROTOCOLOS POR CAPAS Y ENLACES MAESTROS */}
      {estacionActiva === "AC07" && (
        <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-6 shadow-2xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/30 pb-3">
            <div>
              <span className="text-[11px] font-mono text-amber-400 uppercase">
                📚 Estación AC07 — Documentación Maestra y Accesos Directos
              </span>
              <h2 className="text-lg font-black text-white uppercase">
                Manual Vivo del Sistema Operativo & Enlaces Rápidos
              </h2>
            </div>
            <button
              onClick={() => cambiarPortal("AC00")}
              className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-900 text-amber-400 border border-amber-500/40 hover:bg-amber-500/10 cursor-pointer"
            >
              📖 Volver a Portada
            </button>
          </div>

          {/* Pestañas Documentales Internas */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: "enlaces", label: "⚡ Accesos Rápidos (Correo/WhatsApp/URLs)" },
              { id: "permisos", label: "📅 Permisos y Vigencias" },
              { id: "protocolos", label: "📜 Protocolos Operativos" },
              { id: "reglamento", label: "📖 Reglamento Interno OS" },
              { id: "arquitectura_root", label: "🔒 Protocolo Creación por Capas (Solo Creador)" },
              { id: "seguridad", label: "🛡️ Seguridad e Higiene" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setDocTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                  docTab === tab.id
                    ? "bg-amber-500 text-black"
                    : "bg-slate-900 text-slate-300 border border-slate-800 hover:border-amber-500/40"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Contenido de Pestaña: Centro de Enlaces Maestros */}
          {docTab === "enlaces" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Abre tus herramientas personales o enlaces externos directamente sin perder tu
                posición en el Área del Creador. Puedes agregar nuevos botones personalizados abajo.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {enlacesMaestros.map((enlace) => (
                  <a
                    key={enlace.id}
                    href={enlace.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 bg-slate-900 hover:bg-slate-800 border border-amber-500/40 rounded-xl flex flex-col justify-between gap-2 transition group"
                  >
                    <span className="text-xs font-bold text-white group-hover:text-amber-300">
                      🔗 {enlace.nombre}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 truncate">
                      {enlace.url}
                    </span>
                  </a>
                ))}
              </div>

              <form
                onSubmit={agregarEnlaceMaestro}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/70 p-4 rounded-xl border border-slate-800 mt-4"
              >
                <input
                  type="text"
                  placeholder="Nombre del botón (Ej. Drive Documentos)"
                  value={nuevoEnlaceNombre}
                  onChange={(e) => setNuevoEnlaceNombre(e.target.value)}
                  className="bg-black border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="URL destino (Ej. https://drive.google.com)"
                  value={nuevoEnlaceUrl}
                  onChange={(e) => setNuevoEnlaceUrl(e.target.value)}
                  className="bg-black border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg py-2 px-4 cursor-pointer"
                >
                  + Crear Botón de Acceso
                </button>
              </form>
            </div>
          )}

          {/* Contenido de Pestaña: Permisos y Vigencias */}
          {docTab === "permisos" && (
            <div className="space-y-3">
              {[
                { nombre: "Permiso Sanitario Planta Producción", frecuencia: "ANUAL", vence: "2027-03-15" },
                { nombre: "Certificación Fumigación y Control Plagas", frecuencia: "SEMESTRAL", vence: "2027-01-10" },
                { nombre: "Inspección de Extintores y Red Húmeda", frecuencia: "MENSUAL", vence: "2026-12-01" },
              ].map((perm, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center"
                >
                  <div>
                    <h4 className="text-sm font-bold text-white">{perm.nombre}</h4>
                    <span className="text-xs font-mono text-slate-400">Próximo vencimiento: {perm.vence}</span>
                  </div>
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-mono font-bold">
                    {perm.frecuencia}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Contenido de Pestaña: Protocolos Operativos */}
          {docTab === "protocolos" && (
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs text-slate-300">
              <h4 className="text-sm font-bold text-amber-400 uppercase">
                Protocolos Estandarizados de Operación
              </h4>
              <p>1. Verificación de temperatura y humedad antes de iniciar amasado.</p>
              <p>2. Registro obligatorio de lotes y tiempos de fermentación en estación AU02.</p>
              <p>3. Cierre de turno con reporte de merma y limpieza validada.</p>
            </div>
          )}

          {/* Contenido de Pestaña: Reglamento Interno del OS */}
          {docTab === "reglamento" && (
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs text-slate-300">
              <h4 className="text-sm font-bold text-amber-400 uppercase">
                Reglamento Interno de Uso de Synapse-X OS
              </h4>
              <p>• Cada operario, técnico o ingeniero es responsable único de su cédula y clave de acceso.</p>
              <p>• Queda prohibido compartir credenciales entre estaciones o modificar parámetros fuera de su nivel.</p>
              <p>• Toda intervención técnica debe quedar asentada en la bitácora diaria correspondiente.</p>
            </div>
          )}

          {/* Contenido de Pestaña: Protocolo Creación por Capas (Solo Creador) */}
          {docTab === "arquitectura_root" && (
            <div className="p-5 bg-amber-950/20 border border-amber-500/40 rounded-xl space-y-2 text-xs text-slate-200">
              <h4 className="text-sm font-bold text-amber-300 uppercase">
                🔒 Manual Confidencial de Arquitectura por Capas (Visibilidad Exclusiva Creador)
              </h4>
              <p><strong>Capa 1 (Núcleo Creador):</strong> Control absoluto, bóveda familiar, emisión de licencias y supervisión silenciosa.</p>
              <p><strong>Capa 2 (Gobernanza Superuser):</strong> Técnicos e Ingenieros (Niveles 1 a 3) dedicados exclusivamente al soporte de clientes.</p>
              <p><strong>Capa 3 (Operación Licencia):</strong> Entorno aislado del cliente final donde operan administradores, supervisores y panaderos.</p>
            </div>
          )}

          {/* Contenido de Pestaña: Normas de Seguridad e Higiene */}
          {docTab === "seguridad" && (
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs text-slate-300">
              <h4 className="text-sm font-bold text-emerald-400 uppercase">
                🛡️ Normas de Seguridad Industrial, Higiene y Sanitización
              </h4>
              <p>• Uso obligatorio de cofia, mascarilla, calzado antideslizante y guantes térmicos en área de hornos.</p>
              <p>• Dosificación exacta de soluciones sanitizantes según tabla de dilución aprobada en taller.</p>
              <p>• Desconexión y bloqueo de seguridad antes de intervenir cualquier amasadora o sobadora.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}