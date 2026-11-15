"use client";

import React, { useState } from "react";
import { UsuarioRegistrado } from "../page";
import { AlertaSistema } from "./PanelAlertasGlobales";

interface PanelSuperuserProps {
  usuarios: UsuarioRegistrado[];
  onGuardarUsuario: (usuario: UsuarioRegistrado) => void;
  onActualizarEstadoUsuario: (cedula: string, bloqueado: boolean) => void;
  alertas: AlertaSistema[];
  onAgregarAlerta: (alerta: AlertaSistema) => void;
  esSuperuser?: boolean;
}

export default function PanelSuperuserPage({
  usuarios,
  onGuardarUsuario,
  onActualizarEstadoUsuario,
  alertas,
  onAgregarAlerta,
  esSuperuser = true,
}: PanelSuperuserProps) {
  const [pestañaActiva, setPestañaActiva] = useState<number>(1);

  // Estados de formulario unificado
  const [nombre, setNombre] = useState("");
  const [cedula, setCedula] = useState("");
  const [clave, setClave] = useState("");
  const [verClave, setVerClave] = useState(false);
  const [rol, setRol] = useState<"operario" | "cajera" | "supervisor" | "admin" | "superuser" | "ingeniero" | "tecnico">("operario");
  const [licenciaCliente, setLicenciaCliente] = useState<string>("Licencia Matriz Synexis-X (Santiago)");

  const [busqueda, setBusqueda] = useState("");
  const [cedulaEditando, setCedulaEditando] = useState<string | null>(null);

  // Estado para el control manual de acceso total a las hijas (Aleanny y Albany)
  const [accesoTotalHijas, setAccesoTotalHijas] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("synapse_autorizacion_total_hijas") === "true";
    }
    return false;
  });

  const handleToggleAccesoHijas = () => {
    const nuevoEstado = !accesoTotalHijas;
    setAccesoTotalHijas(nuevoEstado);
    if (typeof window !== "undefined") {
      localStorage.setItem("synapse_autorizacion_total_hijas", String(nuevoEstado));
    }
    onAgregarAlerta({
      id: `ALT-${Date.now()}`,
      modulo: "Panel Superuser / Accesos",
      tipo: "INFO",
      nivel: 1,
      mensaje: `Superusuario ${nuevoEstado ? "OTORGÓ" : "REVOCÓ"} acceso total manual a Superusers 2 y 3 (Aleanny y Albany).`,
      timestamp: new Date().toLocaleTimeString(),
    });
    alert(`🛡️ Protocolo de Respaldo: Acceso total para Aleanny y Albany ${nuevoEstado ? "HABILITADO" : "BLOQUEADO (Modo Solo Ver)"}.`);
  };

  // Generador de URL exclusiva por rol y cédula (Con blindaje de portal)
  const obtenerUrlExclusiva = (rolTarget: string) => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://synapse-x-ai-os.vercel.app";
    const cedulaParam = cedula.trim() ? `&ci=${cedula.trim()}` : "";
    return `${baseUrl}/?portal=${rolTarget}${cedulaParam}`;
  };

  const copiarUrlPortales = (rolTarget: string) => {
    const urlFinal = obtenerUrlExclusiva(rolTarget);
    navigator.clipboard.writeText(urlFinal);
    alert(`📋 URL exclusiva para portal [${rolTarget.toUpperCase()}] copiada al portapapeles.`);
  };

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.cedula.includes(busqueda)
  );

  const staffCoreGlobal = usuarios.filter((u) => u.rol === "ingeniero" || u.rol === "tecnico" || u.rol === "superuser");
  const personalOperativoComercial = usuarios.filter((u) => u.rol === "operario" || u.rol === "cajera" || u.rol === "supervisor" || u.rol === "admin");

  const iniciarEdicion = (u: UsuarioRegistrado) => {
    setNombre(u.nombre);
    setCedula(u.cedula);
    setClave(u.clave);
    setRol(u.rol as any);
    setCedulaEditando(u.cedula);
    alert(`✏️ Modo Edición Activo para: ${u.nombre}. Modifique los campos y haga clic en Actualizar.`);
  };

  const cancelarEdicion = () => {
    setNombre("");
    setCedula("");
    setClave("");
    setRol("operario");
    setCedulaEditando(null);
  };

  const eliminarUsuarioDirecto = (cedulaTarget: string, nombreTarget: string) => {
    if (confirm(`⚠️ ¿Está seguro de eliminar permanentemente al usuario ${nombreTarget} (CI: ${cedulaTarget}) de la nube?`)) {
      onActualizarEstadoUsuario(cedulaTarget, true);

      onAgregarAlerta({
        id: `ALT-${Date.now()}`,
        modulo: "Panel Superuser / Accesos",
        tipo: "BLOQUEO",
        nivel: 3,
        mensaje: `Usuario bloqueado/purgado del sistema: ${nombreTarget} (CI: ${cedulaTarget})`,
        timestamp: new Date().toLocaleTimeString(),
      });

      alert(`🗑️ Usuario ${nombreTarget} procesado exitosamente.`);
      if (cedulaEditando === cedulaTarget) {
        cancelarEdicion();
      }
    }
  };

  const registrarManual = () => {
    if (!nombre.trim() || !cedula.trim() || !clave.trim()) {
      alert("⚠️ Complete todos los campos requeridos.");
      return;
    }

    const nuevoUsr: UsuarioRegistrado = {
      nombre: nombre.trim(),
      cedula: cedula.trim(),
      clave: clave.trim(),
      rol,
      bloqueado: false,
    };

    onGuardarUsuario(nuevoUsr);

    onAgregarAlerta({
      id: `ALT-${Date.now()}`,
      modulo: "Panel Superuser / Accesos",
      tipo: "INFO",
      nivel: 1,
      mensaje: `Usuario ${cedulaEditando ? "actualizado" : "registrado"}: ${nombre} (CI: ${cedula}) con rol ${rol.toUpperCase()}`,
      timestamp: new Date().toLocaleTimeString(),
    });

    alert(`✅ Usuario ${nombre} registrado con éxito bajo la licencia: ${licenciaCliente}.`);
    cancelarEdicion();
  };

  const registrar = (e: React.FormEvent) => {
    e.preventDefault();
    registrarManual();
  };

  const alertasSuperuser = alertas.filter(
    (a) => a.modulo === "Panel Superuser / Accesos"
  );

  const pestañasConfig = [
    { id: 1, nombre: "⚙️ Staff Core (Ingenieros & Técnicos)" },
    { id: 2, nombre: "🏢 Personal Operativo & Licencias" },
    { id: 3, nombre: "📊 Auditoría de Planta" },
    { id: 4, nombre: "⚙️ Parámetros y Recetas" },
    { id: 5, nombre: "📈 Métricas y Lotes" },
    { id: 6, nombre: "🛡️ Control Sanitario" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-xs font-sans pb-12">
      
      <header className="bg-slate-900 p-5 rounded-xl border border-amber-500/40 shadow-xl">
        <h1 className="text-lg md:text-xl font-black text-amber-400 tracking-wide uppercase flex items-center gap-2">
          👑 Panel de Control y Gobernanza Superuser (Arquitectura Core & Licencias)
        </h1>
      </header>

      <nav className="flex overflow-x-auto space-x-2 border-b border-slate-800 pb-1 scrollbar-thin">
        {pestañasConfig.map((p) => {
          const isActive = pestañaActiva === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setPestañaActiva(p.id)}
              className={`px-4 py-2.5 rounded-t-lg font-bold text-xs whitespace-nowrap transition-all border-t border-x ${
                isActive
                  ? "bg-slate-900 border-amber-500/60 text-amber-400 border-b-2 border-b-amber-400 shadow-md"
                  : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
              }`}
            >
              {p.nombre}
            </button>
          );
        })}
      </nav>

      {/* PESTAÑA 1: STAFF CORE GLOBAL (INGENIEROS Y TÉCNICOS) */}
      {pestañaActiva === 1 && (
        <div className="space-y-6">
          
          <div className="bg-[#111827] border border-cyan-500/40 p-5 rounded-2xl space-y-3 shadow-xl">
            <h3 className="text-xs font-black text-cyan-400 uppercase tracking-wide flex items-center gap-2">
              ⚙️ Creación y Asignación de Staff Core Global (Ingenieros y Técnicos de Soporte)
            </h3>
            <p className="text-[11px] text-slate-300">
              Este personal opera en un dominio completamente independiente al personal operativo de planta. Solo usted (como Creador) otorga sus credenciales y su URL exclusiva de acceso con blindaje de portal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-[#111827] rounded-2xl border border-slate-800 shadow-xl overflow-hidden p-5 space-y-5">
              <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                <h2 className="text-sm font-black text-cyan-400 uppercase tracking-wider">
                  {cedulaEditando ? `✏️ Editando Staff (CI: ${cedulaEditando})` : "Registro de Ingeniero / Técnico Core"}
                </h2>
                {cedulaEditando && (
                  <button type="button" onClick={cancelarEdicion} className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-1 rounded border border-rose-500/30">
                    Cancelar
                  </button>
                )}
              </div>

              <form onSubmit={registrar} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-300">Nombre del Ingeniero o Técnico:</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Ing. Carlos Mendoza"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-300">Cédula de Identidad:</label>
                  <input
                    type="text"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value.replace(/\D/g, ""))}
                    placeholder="Número de cédula"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-cyan-300 font-mono font-bold focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-300">Clave de Acceso:</label>
                  <input
                    type={verClave ? "text" : "password"}
                    value={clave}
                    onChange={(e) => setClave(e.target.value)}
                    placeholder="Clave de seguridad"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-300">Asignar Perfil Core:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRol("ingeniero")}
                      className={`py-2 rounded-lg font-bold border text-[11px] transition-all ${
                        rol === "ingeniero" ? "bg-cyan-500 text-slate-950 border-cyan-400 font-extrabold shadow-md" : "bg-slate-950 text-slate-400 border-slate-800"
                      }`}
                    >
                      ⚙️ Ingeniero Sistemas
                    </button>
                    <button
                      type="button"
                      onClick={() => setRol("tecnico")}
                      className={`py-2 rounded-lg font-bold border text-[11px] transition-all ${
                        rol === "tecnico" ? "bg-amber-600 text-slate-950 border-amber-500 font-extrabold shadow-md" : "bg-slate-950 text-slate-400 border-slate-800"
                      }`}
                    >
                      🔧 Técnico Soporte
                    </button>
                  </div>
                </div>

                {/* URL EXCLUSIVA DE ACCESO */}
                <div className="bg-slate-950 p-3 rounded-xl border border-cyan-500/40 space-y-1.5">
                  <label className="text-[10px] font-black text-cyan-400 uppercase tracking-wider block">
                    🔗 URL Exclusiva para este perfil ({rol.toUpperCase()}):
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      readOnly
                      value={obtenerUrlExclusiva(rol)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-cyan-300 font-mono text-[10px] select-all"
                    />
                    <button
                      type="button"
                      onClick={() => copiarUrlPortales(rol)}
                      className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black px-3 py-2 rounded-lg text-xs transition-all cursor-pointer shrink-0"
                    >
                      📋 Copiar
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  ⚡ REGISTRAR STAFF CORE GLOBAL
                </button>
              </form>
            </div>

            <div className="bg-[#111827] rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col p-5 space-y-4">
              <h2 className="text-sm font-black text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-3">
                📋 Listado de Staff Core Registrado ({staffCoreGlobal.length})
              </h2>

              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {staffCoreGlobal.length === 0 ? (
                  <div className="text-slate-500 italic text-center py-8">
                    No hay ingenieros ni técnicos registrados en el core global.
                  </div>
                ) : (
                  staffCoreGlobal.map((u, i) => (
                    <div key={i} className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-slate-200">{u.nombre}</div>
                        <div className="text-[10px] font-mono text-slate-400">
                          CI: {u.cedula} | Rol: <span className="text-cyan-400 font-bold uppercase">{u.rol}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => iniciarEdicion(u)}
                          className="px-2.5 py-1.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-lg text-[10px] font-bold"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => eliminarUsuarioDirecto(u.cedula, u.nombre)}
                          className="px-2.5 py-1.5 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-lg text-[10px] font-bold"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 2: PERSONAL OPERATIVO & LICENCIAS (MATRIZ VS CLIENTES) */}
      {pestañaActiva === 2 && (
        <div className="space-y-6">
          
          {/* GOBERNANZA DE RESPALDO HIJAS */}
          <div className="bg-[#111827] border border-slate-800 p-5 rounded-2xl space-y-3 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xs font-black text-amber-400 uppercase tracking-wide flex items-center gap-2">
                  🛡️ Protocolo de Respaldo: Superusers 2 y 3 (Aleanny y Albany)
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Por defecto operan en modo <strong className="text-amber-400">Solo Ver</strong>. Interruptor manual de gobernanza general.
                </p>
              </div>
              <button
                type="button"
                onClick={handleToggleAccesoHijas}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all border cursor-pointer flex items-center gap-2 shadow-lg shrink-0 ${
                  accesoTotalHijas ? 'bg-emerald-600 text-slate-950 border-emerald-400 font-extrabold' : 'bg-slate-900 text-amber-400 border-amber-500/40'
                }`}
              >
                <span>{accesoTotalHijas ? '🟢 Acceso Total Habilitado' : '🔒 Modo Solo Ver Activo'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-[#111827] rounded-2xl border border-slate-800 shadow-xl overflow-hidden p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                <h2 className="text-sm font-black text-amber-400 uppercase tracking-wider">
                  {cedulaEditando ? `✏️ Editando Operario (CI: ${cedulaEditando})` : "Registro de Personal Operativo / Licencia"}
                </h2>
                {cedulaEditando && (
                  <button type="button" onClick={cancelarEdicion} className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-1 rounded border border-rose-500/30">
                    Cancelar
                  </button>
                )}
              </div>

              <form onSubmit={registrar} className="space-y-4">
                
                {/* SELECTOR DE LICENCIA / CLIENTE COMERCIAL */}
                <div className="space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <label className="block text-[11px] font-bold text-amber-400">
                    🏢 Asignar a Licencia / Empresa Cliente:
                  </label>
                  <select
                    value={licenciaCliente}
                    onChange={(e) => setLicenciaCliente(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="Licencia Matriz Synexis-X (Santiago)">Licencia Matriz Synexis-X (Santiago)</option>
                    <option value="Cliente Comercial: Panadería San Martín SpA">Cliente Comercial: Panadería San Martín SpA</option>
                    <option value="Cliente Comercial: Delicias del Sur Ltda.">Cliente Comercial: Delicias del Sur Ltda.</option>
                    <option value="Cliente Comercial: Industrial F alimentos">Cliente Comercial: Industrial F alimentos</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-300">Nombre del Empleado:</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre completo"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-300">Cédula de Identidad:</label>
                  <input
                    type="text"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value.replace(/\D/g, ""))}
                    placeholder="Cédula de identidad"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-300">Clave de Acceso:</label>
                  <input
                    type={verClave ? "text" : "password"}
                    value={clave}
                    onChange={(e) => setClave(e.target.value)}
                    placeholder="Clave"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-300">Perfil Comercial / Operativo:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRol("operario")}
                      className={`py-2 rounded-lg font-bold border text-[11px] transition-all ${
                        rol === "operario" ? "bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-md" : "bg-slate-950 text-slate-400 border-slate-800"
                      }`}
                    >
                      👷 Operario Planta
                    </button>
                    <button
                      type="button"
                      onClick={() => setRol("cajera")}
                      className={`py-2 rounded-lg font-bold border text-[11px] transition-all ${
                        rol === "cajera" ? "bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-md" : "bg-slate-950 text-slate-400 border-slate-800"
                      }`}
                    >
                      💰 Cajera (POS)
                    </button>
                    <button
                      type="button"
                      onClick={() => setRol("supervisor")}
                      className={`py-2 rounded-lg font-bold border text-[11px] transition-all ${
                        rol === "supervisor" ? "bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-md" : "bg-slate-950 text-slate-400 border-slate-800"
                      }`}
                    >
                      🛡️ Supervisor Turno
                    </button>
                    <button
                      type="button"
                      onClick={() => setRol("admin")}
                      className={`py-2 rounded-lg font-bold border text-[11px] transition-all ${
                        rol === "admin" ? "bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-md" : "bg-slate-950 text-slate-400 border-slate-800"
                      }`}
                    >
                      💼 Admin Local
                    </button>
                  </div>
                </div>

                {/* URL EXCLUSIVA DE OPERARIO */}
                <div className="bg-slate-950 p-3 rounded-xl border border-amber-500/40 space-y-1.5">
                  <label className="text-[10px] font-black text-amber-400 uppercase tracking-wider block">
                    🔗 URL Exclusiva para este Operario/Admin:
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      readOnly
                      value={obtenerUrlExclusiva("usuario")}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-amber-300 font-mono text-[10px] select-all"
                    />
                    <button
                      type="button"
                      onClick={() => copiarUrlPortales("usuario")}
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-3 py-2 rounded-lg text-xs transition-all cursor-pointer shrink-0"
                    >
                      📋 Copiar
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  ⚡ REGISTRAR PERSONAL COMERCIAL / OPERATIVO
                </button>
              </form>
            </div>

            <div className="bg-[#111827] rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3 space-y-3">
                <h2 className="text-sm font-black text-amber-400 uppercase tracking-wider">
                  📋 Personal Comercial y de Planta ({personalOperativoComercial.length})
                </h2>

                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">🔍</span>
                  <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar por nombre o cédula..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                {personalOperativoComercial.length === 0 ? (
                  <div className="text-slate-500 italic text-center py-8">
                    No se encontró personal operativo registrado.
                  </div>
                ) : (
                  personalOperativoComercial.map((u, i) => (
                    <div key={i} className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-slate-200">{u.nombre}</div>
                        <div className="text-[10px] font-mono text-slate-400">
                          CI: {u.cedula} | Perfil: <span className="text-amber-400 font-bold uppercase">{u.rol}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => iniciarEdicion(u)}
                          className="px-2.5 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg text-[10px] font-bold"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => eliminarUsuarioDirecto(u.cedula, u.nombre)}
                          className="px-2.5 py-1.5 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-lg text-[10px] font-bold"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑAS 3 A 6: AUDITORÍA Y MÓDULOS DE PLANTA */}
      {pestañaActiva === 3 && (
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-black text-amber-400 uppercase tracking-wider">📊 Auditoría General de Licencias y Planta</h2>
          <p className="text-xs text-slate-400">Total global de registros en la nube (Core + Comercial): {usuarios.length}</p>
        </div>
      )}
      {pestañaActiva === 4 && (
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-black text-amber-400 uppercase tracking-wider">⚙️ Parámetros y Recetas del Sistema</h2>
        </div>
      )}
      {pestañaActiva === 5 && (
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-6">
          <h2 className="text-sm font-black text-amber-400 uppercase tracking-wider">📈 Métricas y Lotes de Producción</h2>
        </div>
      )}
      {pestañaActiva === 6 && (
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-6">
          <h2 className="text-sm font-black text-amber-400 uppercase tracking-wider">🛡️ Control Sanitario y POES</h2>
        </div>
      )}

    </div>
  );
}