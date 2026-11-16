"use client";

import React, { useState } from "react";
import { UsuarioRegistrado } from "../../page";

// Definición local de AlertaSistema para eliminar errores de importación externa
export interface AlertaSistema {
  id: string;
  modulo: string;
  tipo: "INFO" | "ADVERTENCIA" | "BLOQUEO" | "CRÍTICO";
  nivel: number;
  mensaje: string;
  timestamp: string;
}

interface AC04Props {
  usuarios: UsuarioRegistrado[];
  onGuardarUsuario: (usuario: UsuarioRegistrado) => void;
  onActualizarEstadoUsuario: (cedula: string, bloqueado: boolean) => void;
  onAgregarAlerta: (alerta: AlertaSistema) => void;
}

export default function PanelCreadorAC04({
  usuarios,
  onGuardarUsuario,
  onActualizarEstadoUsuario,
  onAgregarAlerta,
}: AC04Props) {
  const [subSeccion, setSubSeccion] = useState<"staff" | "operativo">("staff");

  // Estados de formulario unificado
  const [nombre, setNombre] = useState("");
  const [cedula, setCedula] = useState("");
  const [clave, setClave] = useState("");
  const [verClave, setVerClave] = useState(false);
  const [rol, setRol] = useState<"operario" | "cajera" | "supervisor" | "admin" | "superuser" | "ingeniero" | "tecnico">("ingeniero");
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
      modulo: "AC04 / Accesos Root",
      tipo: "INFO",
      nivel: 1,
      mensaje: `Superusuario ${nuevoEstado ? "OTORGÓ" : "REVOCÓ"} acceso total manual a Superusers 2 y 3 (Aleanny y Albany).`,
      timestamp: new Date().toLocaleTimeString(),
    });
    alert(`🛡️ Protocolo de Respaldo: Acceso total para Aleanny y Albany ${nuevoEstado ? "HABILITADO" : "BLOQUEADO (Modo Solo Ver)"}.`);
  };

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
    setRol("ingeniero");
    setCedulaEditando(null);
  };

  const eliminarUsuarioDirecto = (cedulaTarget: string, nombreTarget: string) => {
    if (confirm(`⚠️ ¿Está seguro de eliminar permanentemente al usuario ${nombreTarget} (CI: ${cedulaTarget})?`)) {
      onActualizarEstadoUsuario(cedulaTarget, true);
      onAgregarAlerta({
        id: `ALT-${Date.now()}`,
        modulo: "AC04 / Accesos Root",
        tipo: "BLOQUEO",
        nivel: 3,
        mensaje: `Usuario bloqueado/purgado del sistema: ${nombreTarget} (CI: ${cedulaTarget})`,
        timestamp: new Date().toLocaleTimeString(),
      });
      alert(`🗑️ Usuario ${nombreTarget} procesado exitosamente.`);
      if (cedulaEditando === cedulaTarget) cancelarEdicion();
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
      modulo: "AC04 / Accesos Root",
      tipo: "INFO",
      nivel: 1,
      mensaje: `Usuario ${cedulaEditando ? "actualizado" : "registrado"}: ${nombre} (CI: ${cedula}) con rol ${rol.toUpperCase()}`,
      timestamp: new Date().toLocaleTimeString(),
    });

    alert(`✅ Usuario ${nombre} registrado con éxito.`);
    cancelarEdicion();
  };

  const registrar = (e: React.FormEvent) => {
    e.preventDefault();
    registrarManual();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-xs font-sans pb-12">
      
      {/* CABECERA AC04 */}
      <header className="bg-slate-900 p-5 rounded-2xl border border-amber-500/40 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="px-2.5 py-1 bg-amber-500 text-black font-black text-xs rounded uppercase">AC04</span>
          <h1 className="text-base md:text-lg font-black text-amber-400 tracking-wide uppercase mt-1">
            Consola Kernel & Núcleo Comercial (Staff & Licencias)
          </h1>
          <p className="text-xs text-zinc-400">Gestión exclusiva de ingenieros, técnicos, personal operativo y control de respaldo.</p>
        </div>

        {/* INTERRUPTOR DE RESPALDO HIJAS */}
        <button
          type="button"
          onClick={handleToggleAccesoHijas}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono transition-all border cursor-pointer flex items-center gap-2 shadow-lg ${
            accesoTotalHijas ? 'bg-emerald-600 text-slate-950 border-emerald-400 font-extrabold' : 'bg-slate-950 text-amber-400 border-amber-500/40'
          }`}
        >
          <span>{accesoTotalHijas ? '🟢 Acceso Total Habilitado (Aleanny/Albany)' : '🔒 Modo Solo Ver Activo'}</span>
        </button>
      </header>

      {/* PESTAÑAS INTERNAS DE AC04 */}
      <div className="flex space-x-2 border-b border-slate-800 pb-1">
        <button
          type="button"
          onClick={() => { setSubSeccion("staff"); setRol("ingeniero"); }}
          className={`px-4 py-2 rounded-t-lg font-bold text-xs transition-all border-t border-x ${
            subSeccion === "staff" ? "bg-slate-900 border-amber-500/60 text-amber-400 border-b-2 border-b-amber-400" : "bg-slate-950 text-slate-400 border-slate-800"
          }`}
        >
          ⚙️ Staff Core (Ingenieros & Técnicos)
        </button>
        <button
          type="button"
          onClick={() => { setSubSeccion("operativo"); setRol("operario"); }}
          className={`px-4 py-2 rounded-t-lg font-bold text-xs transition-all border-t border-x ${
            subSeccion === "operativo" ? "bg-slate-900 border-amber-500/60 text-amber-400 border-b-2 border-b-amber-400" : "bg-slate-950 text-slate-400 border-slate-800"
          }`}
        >
          🏢 Personal Operativo & Licencias
        </button>
      </div>

      {/* SECCIÓN 1: STAFF CORE */}
      {subSeccion === "staff" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#111827] rounded-2xl border border-slate-800 shadow-xl p-5 space-y-4">
            <h2 className="text-sm font-black text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-3">
              {cedulaEditando ? `✏️ Editando Staff (CI: ${cedulaEditando})` : "Registro de Ingeniero / Técnico Core"}
            </h2>
            <form onSubmit={registrar} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-300">Nombre:</label>
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Ing. Carlos Mendoza" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100" />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-300">Cédula:</label>
                <input type="text" value={cedula} onChange={(e) => setCedula(e.target.value.replace(/\D/g, ""))} placeholder="Cédula" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-cyan-300 font-mono font-bold" />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-300">Clave:</label>
                <input type={verClave ? "text" : "password"} value={clave} onChange={(e) => setClave(e.target.value)} placeholder="Clave" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100" />
              </div>
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-300">Perfil:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setRol("ingeniero")} className={`py-2 rounded-lg font-bold border text-[11px] ${rol === "ingeniero" ? "bg-cyan-500 text-slate-950 border-cyan-400" : "bg-slate-950 text-slate-400 border-slate-800"}`}>⚙️ Ingeniero</button>
                  <button type="button" onClick={() => setRol("tecnico")} className={`py-2 rounded-lg font-bold border text-[11px] ${rol === "tecnico" ? "bg-amber-600 text-slate-950 border-amber-500" : "bg-slate-950 text-slate-400 border-slate-800"}`}>🔧 Técnico</button>
                </div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-cyan-500/40 space-y-1">
                <label className="text-[10px] font-black text-cyan-400 uppercase">URL Exclusiva ({rol.toUpperCase()}):</label>
                <div className="flex gap-2 items-center">
                  <input type="text" readOnly value={obtenerUrlExclusiva(rol)} className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-cyan-300 font-mono text-[10px]" />
                  <button type="button" onClick={() => copiarUrlPortales(rol)} className="bg-cyan-500 text-slate-950 font-black px-3 py-1.5 rounded text-xs cursor-pointer">Copiar</button>
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase rounded-xl shadow-lg cursor-pointer">⚡ Registrar Staff Core</button>
            </form>
          </div>

          <div className="bg-[#111827] rounded-2xl border border-slate-800 shadow-xl p-5 space-y-4">
            <h2 className="text-sm font-black text-cyan-400 uppercase tracking-wider border-b border-slate-800 pb-3">Listado Staff Core ({staffCoreGlobal.length})</h2>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {staffCoreGlobal.length === 0 ? <p className="text-slate-500 italic text-center py-6">No hay staff registrado.</p> : staffCoreGlobal.map((u, i) => (
                <div key={i} className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-200">{u.nombre}</div>
                    <div className="text-[10px] font-mono text-slate-400">CI: {u.cedula} | <span className="text-cyan-400 uppercase">{u.rol}</span></div>
                  </div>
                  <div className="flex gap-1.5">
                    <button type="button" onClick={() => iniciarEdicion(u)} className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-[10px] font-bold">Editar</button>
                    <button type="button" onClick={() => eliminarUsuarioDirecto(u.cedula, u.nombre)} className="px-2 py-1 bg-rose-500/20 text-rose-300 rounded text-[10px] font-bold">Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECCIÓN 2: PERSONAL OPERATIVO */}
      {subSeccion === "operativo" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#111827] rounded-2xl border border-slate-800 shadow-xl p-5 space-y-4">
            <h2 className="text-sm font-black text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-3">
              {cedulaEditando ? `✏️ Editando Operativo (CI: ${cedulaEditando})` : "Registro de Personal Operativo"}
            </h2>
            <form onSubmit={registrar} className="space-y-4">
              <div className="space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <label className="block text-[11px] font-bold text-amber-400">Licencia / Empresa:</label>
                <select value={licenciaCliente} onChange={(e) => setLicenciaCliente(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 text-xs">
                  <option value="Licencia Matriz Synexis-X (Santiago)">Licencia Matriz Synexis-X (Santiago)</option>
                  <option value="Cliente Comercial: Panadería San Martín SpA">Cliente Comercial: Panadería San Martín SpA</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-300">Nombre del Empleado:</label>
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre completo" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100" />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-300">Cédula:</label>
                <input type="text" value={cedula} onChange={(e) => setCedula(e.target.value.replace(/\D/g, ""))} placeholder="Cédula" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-amber-300 font-mono font-bold" />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-300">Clave:</label>
                <input type={verClave ? "text" : "password"} value={clave} onChange={(e) => setClave(e.target.value)} placeholder="Clave" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100" />
              </div>
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-300">Perfil Comercial:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setRol("operario")} className={`py-2 rounded-lg font-bold border text-[11px] ${rol === "operario" ? "bg-amber-500 text-slate-950 border-amber-400" : "bg-slate-950 text-slate-400 border-slate-800"}`}>👷 Operario</button>
                  <button type="button" onClick={() => setRol("cajera")} className={`py-2 rounded-lg font-bold border text-[11px] ${rol === "cajera" ? "bg-amber-500 text-slate-950 border-amber-400" : "bg-slate-950 text-slate-400 border-slate-800"}`}>💰 Cajera</button>
                  <button type="button" onClick={() => setRol("supervisor")} className={`py-2 rounded-lg font-bold border text-[11px] ${rol === "supervisor" ? "bg-amber-500 text-slate-950 border-amber-400" : "bg-slate-950 text-slate-400 border-slate-800"}`}>🛡️ Supervisor</button>
                  <button type="button" onClick={() => setRol("admin")} className={`py-2 rounded-lg font-bold border text-[11px] ${rol === "admin" ? "bg-amber-500 text-slate-950 border-amber-400" : "bg-slate-950 text-slate-400 border-slate-800"}`}>💼 Admin</button>
                </div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-amber-500/40 space-y-1">
                <label className="text-[10px] font-black text-amber-400 uppercase">URL Exclusiva Operativa:</label>
                <div className="flex gap-2 items-center">
                  <input type="text" readOnly value={obtenerUrlExclusiva("usuario")} className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-amber-300 font-mono text-[10px]" />
                  <button type="button" onClick={() => copiarUrlPortales("usuario")} className="bg-amber-500 text-slate-950 font-black px-3 py-1.5 rounded text-xs cursor-pointer">Copiar</button>
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase rounded-xl shadow-lg cursor-pointer">⚡ Registrar Personal Operativo</button>
            </form>
          </div>

          <div className="bg-[#111827] rounded-2xl border border-slate-800 shadow-xl p-5 space-y-4">
            <h2 className="text-sm font-black text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-3">Personal Comercial ({personalOperativoComercial.length})</h2>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {personalOperativoComercial.length === 0 ? <p className="text-slate-500 italic text-center py-6">No hay personal operativo.</p> : personalOperativoComercial.map((u, i) => (
                <div key={i} className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-200">{u.nombre}</div>
                    <div className="text-[10px] font-mono text-slate-400">CI: {u.cedula} | <span className="text-amber-400 uppercase">{u.rol}</span></div>
                  </div>
                  <div className="flex gap-1.5">
                    <button type="button" onClick={() => iniciarEdicion(u)} className="px-2 py-1 bg-amber-500/20 text-amber-300 rounded text-[10px] font-bold">Editar</button>
                    <button type="button" onClick={() => eliminarUsuarioDirecto(u.cedula, u.nombre)} className="px-2 py-1 bg-rose-500/20 text-rose-300 rounded text-[10px] font-bold">Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}