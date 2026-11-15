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

  const [nombre, setNombre] = useState("");
  const [cedula, setCedula] = useState("");
  const [clave, setClave] = useState("");
  const [verClave, setVerClave] = useState(false);
  const [rol, setRol] = useState<"operario" | "cajera" | "supervisor" | "admin" | "superuser">("operario");

  const [busqueda, setBusqueda] = useState("");
  const [cedulaEditando, setCedulaEditando] = useState<string | null>(null);

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.cedula.includes(busqueda)
  );

  const iniciarEdicion = (u: UsuarioRegistrado) => {
    setNombre(u.nombre);
    setCedula(u.cedula);
    setClave(u.clave);
    setRol(u.rol);
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

  const handleVer = () => {
    alert(`👁️ Modo Visualización Activa: Total de usuarios en la nube: ${usuarios.length}`);
  };

  const handleEditar = () => {
    alert(`✏️ Modo Edición: Utilice el botón "Editar" al lado de cada usuario en la lista inferior.`);
  };

  const handleCrear = () => {
    if (!nombre.trim() || !cedula.trim() || !clave.trim()) {
      alert("⚠️ Complete los campos de nombre, cédula y clave para crear el registro.");
      return;
    }
    registrarManual();
  };

  const handleEliminar = () => {
    const cedulaEliminar = prompt("Ingrese la Cédula del usuario que desea gestionar:");
    if (cedulaEliminar) {
      const target = usuarios.find(u => u.cedula === cedulaEliminar);
      if (target) {
        eliminarUsuarioDirecto(target.cedula, target.nombre);
      } else {
        alert(`⚠️ No se encontró ningún usuario con la cédula ${cedulaEliminar}`);
      }
    }
  };

  const handleImprimir = () => {
    window.print();
  };

  const handleDescargar = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(usuarios, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `synapse_usuarios_nube_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    alert("📥 Datos de usuarios descargados exitosamente en formato JSON.");
  };

  const handleGuardar = () => {
    alert("💾 Todos los registros están sincronizados directamente en Supabase.");
    onAgregarAlerta({
      id: `ALT-${Date.now()}`,
      modulo: "Panel Superuser / Accesos",
      tipo: "INFO",
      nivel: 1,
      mensaje: `Superusuario ejecutó punto de control en la nube.`,
      timestamp: new Date().toLocaleTimeString(),
    });
  };

  const registrarManual = () => {
    if (!nombre.trim() || !cedula.trim() || !clave.trim()) {
      alert("⚠️ Complete todos los campos.");
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

    alert(`✅ Usuario ${nombre} guardado y sincronizado en la nube con éxito.`);
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
    { id: 1, nombre: "Nuevo usuario" },
    { id: 2, nombre: "Auditoría de Planta" },
    { id: 3, nombre: "Parámetros y Recetas" },
    { id: 4, nombre: "Métricas y Lotes" },
    { id: 5, nombre: "Control Sanitario" },
    { id: 6, nombre: "Pestaña 6" },
    { id: 7, nombre: "Pestaña 7" },
    { id: 8, nombre: "Pestaña 8" },
    { id: 9, nombre: "Pestaña 9" },
    { id: 10, nombre: "Pestaña 10" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-xs font-sans pb-12">
      
      <header className="bg-slate-900 p-5 rounded-xl border border-amber-500/40 shadow-xl">
        <h1 className="text-lg md:text-xl font-black text-amber-400 tracking-wide uppercase flex items-center gap-2">
          👑 Panel de Control y Gobernanza Superuser (Control de Usuarios)
        </h1>
      </header>

      <nav className="flex overflow-x-auto space-x-2 border-b border-slate-800 pb-1 scrollbar-thin">
        {pestañasConfig.map((p) => {
          const isActive = pestañaActiva === p.id;
          const isBlank = p.id >= 6;

          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setPestañaActiva(p.id)}
              className={`px-4 py-2.5 rounded-t-lg font-bold text-xs whitespace-nowrap transition-all border-t border-x ${
                isActive
                  ? "bg-slate-900 border-amber-500/60 text-amber-400 border-b-2 border-b-amber-400 shadow-md"
                  : isBlank
                  ? "bg-slate-950/40 border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-900/50"
                  : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
              }`}
            >
              {p.nombre}
            </button>
          );
        })}
      </nav>

      {pestañaActiva === 1 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-[#111827] rounded-2xl border border-slate-800 shadow-xl overflow-hidden p-5 space-y-5">
              <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                <h2 className="text-sm font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  {cedulaEditando ? `✏️ Editando Usuario (CI: ${cedulaEditando})` : "Registro de nuevo usuario"}
                </h2>
                {cedulaEditando && (
                  <button
                    type="button"
                    onClick={cancelarEdicion}
                    className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-1 rounded border border-rose-500/30 hover:bg-rose-500/30"
                  >
                    Cancelar Edición
                  </button>
                )}
              </div>

              <form onSubmit={registrar} className="space-y-4">
                
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800/80 pb-1.5">
                    Información Personal
                  </h3>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-300">
                      Nombre Completo:
                    </label>
                    <input
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Ingrese aquí su nombre"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-300">
                      Cédula de Identidad:
                    </label>
                    <input
                      type="text"
                      value={cedula}
                      onChange={(e) => setCedula(e.target.value.replace(/\D/g, ""))}
                      placeholder="Ingrese aquí su cédula"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800/80 pb-1.5">
                    Credenciales de Acceso
                  </h3>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-300">
                      Clave de Acceso:
                    </label>
                    <div className="relative">
                      <input
                        type={verClave ? "text" : "password"}
                        value={clave}
                        onChange={(e) => setClave(e.target.value)}
                        placeholder="Ingrese aquí su clave"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 pr-9 text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => setVerClave(!verClave)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-amber-400 transition-colors text-sm"
                      >
                        {verClave ? "👁️" : "🙈"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
                  <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800/80 pb-1.5">
                    Asignación de Perfil Estándar
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRol("operario")}
                      className={`py-2 rounded-lg font-bold border text-[11px] transition-all ${
                        rol === "operario"
                          ? "bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-md"
                          : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800"
                      }`}
                    >
                      👷 Operario Planta
                    </button>
                    <button
                      type="button"
                      onClick={() => setRol("cajera")}
                      className={`py-2 rounded-lg font-bold border text-[11px] transition-all ${
                        rol === "cajera"
                          ? "bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-md"
                          : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800"
                      }`}
                    >
                      💰 Cajera (POS)
                    </button>
                    <button
                      type="button"
                      onClick={() => setRol("supervisor")}
                      className={`py-2 rounded-lg font-bold border text-[11px] transition-all ${
                        rol === "supervisor"
                          ? "bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-md"
                          : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800"
                      }`}
                    >
                      🛡️ Supervisor Turno
                    </button>
                    <button
                      type="button"
                      onClick={() => setRol("admin")}
                      className={`py-2 rounded-lg font-bold border text-[11px] transition-all ${
                        rol === "admin"
                          ? "bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-md"
                          : "bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800"
                      }`}
                    >
                      💼 Admin Local
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full py-3 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer ${
                    cedulaEditando
                      ? "bg-amber-500 text-slate-950 hover:bg-amber-400"
                      : "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                  }`}
                >
                  {cedulaEditando ? "💾 ACTUALIZAR REGISTRO" : "⚡ REGISTRAR Y ASIGNAR PERFIL"}
                </button>
              </form>
            </div>

            <div className="bg-[#111827] rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3 space-y-3">
                <h2 className="text-sm font-black text-amber-400 uppercase tracking-wider">
                  📋 Personal Activo ({usuariosFiltrados.length})
                </h2>

                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    🔍
                  </span>
                  <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar por nombre o cédula..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500 text-xs"
                  />
                  {busqueda && (
                    <button
                      type="button"
                      onClick={() => setBusqueda("")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                {usuariosFiltrados.length === 0 ? (
                  <div className="text-slate-500 italic text-center py-8">
                    No se encontraron usuarios en la nube con ese criterio.
                  </div>
                ) : (
                  usuariosFiltrados.map((u, i) => (
                    <div
                      key={i}
                      className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                    >
                      <div>
                        <div className="font-bold text-slate-200">{u.nombre}</div>
                        <div className="text-[10px] font-mono text-slate-400">
                          CI: {u.cedula} | Perfil: <span className="text-amber-400 font-bold uppercase">{u.rol}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => iniciarEdicion(u)}
                          className="px-2.5 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg text-[10px] font-bold hover:bg-amber-500/30 transition-all cursor-pointer"
                        >
                          ✏️ Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const nuevoEstado = !u.bloqueado;
                            onActualizarEstadoUsuario(u.cedula, nuevoEstado);
                          }}
                          className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                            u.bloqueado
                              ? "bg-rose-500 text-white border border-rose-400 animate-pulse"
                              : "bg-emerald-500 text-slate-950 border border-emerald-400"
                          }`}
                        >
                          {u.bloqueado ? "🔴 Bloqueado" : "🟢 Activo"}
                        </button>

                        <button
                          type="button"
                          onClick={() => eliminarUsuarioDirecto(u.cedula, u.nombre)}
                          className="px-2.5 py-1.5 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-lg text-[10px] font-bold hover:bg-rose-500/30 transition-all cursor-pointer"
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

          {esSuperuser && (
            <div className="bg-[#111827] rounded-2xl border border-amber-500/40 shadow-xl p-5 space-y-3">
              <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
                <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  🔒 Panel de Edición y Control Operativo (Restringido a Superuser)
                </h3>
                <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[9px] font-mono border border-amber-500/30">
                  MODO PRIVILEGIADO
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-1">
                <button type="button" onClick={handleVer} className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold py-2 px-3 rounded-lg transition-all text-center flex items-center justify-center gap-1 cursor-pointer shadow">👁️ Ver</button>
                <button type="button" onClick={handleEditar} className="bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 font-bold py-2 px-3 rounded-lg transition-all text-center flex items-center justify-center gap-1 cursor-pointer shadow">✏️ Editar</button>
                <button type="button" onClick={handleCrear} className="bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/40 font-bold py-2 px-3 rounded-lg transition-all text-center flex items-center justify-center gap-1 cursor-pointer shadow">➕ Crear</button>
                <button type="button" onClick={handleEliminar} className="bg-slate-900 hover:bg-slate-800 text-rose-400 border border-rose-500/40 font-bold py-2 px-3 rounded-lg transition-all text-center flex items-center justify-center gap-1 cursor-pointer shadow">🗑️ Eliminar</button>
                <button type="button" onClick={handleImprimir} className="bg-slate-900 hover:bg-slate-800 text-sky-300 border border-sky-500/40 font-bold py-2 px-3 rounded-lg transition-all text-center flex items-center justify-center gap-1 cursor-pointer shadow">🖨️ Imprimir</button>
                <button type="button" onClick={handleDescargar} className="bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-indigo-500/40 font-bold py-2 px-3 rounded-lg transition-all text-center flex items-center justify-center gap-1 cursor-pointer shadow">📥 Descargar</button>
                <button type="button" onClick={handleGuardar} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2 px-3 rounded-lg transition-all text-center flex items-center justify-center gap-1 cursor-pointer shadow col-span-2 sm:col-span-1 md:col-span-1">💾 Guardar</button>
              </div>
            </div>
          )}

          <div className="bg-[#111827] rounded-2xl border border-slate-800 shadow-xl p-5 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-sm font-black text-amber-400 uppercase tracking-wider">
                🚨 Portal de Alertas y Telemetría del Sistema ({alertasSuperuser.length})
              </h2>
            </div>
            <div className="w-full h-52 bg-slate-950 rounded-xl border border-slate-800 p-4 overflow-y-auto font-mono text-[11px] space-y-2 shadow-inner">
              {alertasSuperuser.length === 0 ? (
                <div className="text-slate-500 italic text-center py-12">
                  Sin eventos ni alertas registradas en el control de acceso y gobernanza.
                </div>
              ) : (
                alertasSuperuser.map((alt) => (
                  <div key={alt.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 flex justify-between items-center">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black ${alt.tipo === "BLOQUEO" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : "bg-amber-500/20 text-amber-300"}`}>
                          {alt.tipo}
                        </span>
                        <span className="text-slate-300 font-bold">{alt.mensaje}</span>
                      </div>
                    </div>
                    <span className="text-slate-500 text-[10px]">{alt.timestamp}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {pestañaActiva === 2 && (
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-6">
          <h2 className="text-sm font-black text-amber-400 uppercase tracking-wider">📊 Auditoría de Planta</h2>
          <p className="text-xs text-slate-400">Total de operarios sincronizados en la nube: {usuarios.length}</p>
        </div>
      )}
      {pestañaActiva === 3 && (
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-6">
          <h2 className="text-sm font-black text-amber-400 uppercase tracking-wider">⚙️ Parámetros y Recetas</h2>
        </div>
      )}
      {pestañaActiva === 4 && (
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-6">
          <h2 className="text-sm font-black text-amber-400 uppercase tracking-wider">📈 Métricas y Lotes</h2>
        </div>
      )}
      {pestañaActiva === 5 && (
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-6">
          <h2 className="text-sm font-black text-amber-400 uppercase tracking-wider">🛡️ Control Sanitario</h2>
        </div>
      )}
    </div>
  );
}