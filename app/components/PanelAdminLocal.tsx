"use client";

import React, { useState, useEffect } from "react";
import { UsuarioRegistrado } from "../page";
import { AlertaSistema } from "./PanelAlertasGlobales";

interface PanelAdminLocalProps {
  usuarios: UsuarioRegistrado[];
  onGuardarUsuario: (usuario: UsuarioRegistrado) => void;
  onActualizarEstadoUsuario: (cedula: string, bloqueado: boolean) => void;
  alertas: AlertaSistema[];
  onAgregarAlerta: (alerta: AlertaSistema) => void;
}

export default function PanelAdminLocal({
  usuarios,
  onGuardarUsuario,
  onActualizarEstadoUsuario,
  alertas,
  onAgregarAlerta,
}: PanelAdminLocalProps) {
  // Pestañas locales exclusivas para la administración de la sucursal
  const [pestañaActiva, setPestañaActiva] = useState<number>(1);

  // Estados del formulario de registro de personal local
  const [nombre, setNombre] = useState("");
  const [cedula, setCedula] = useState("");
  const [clave, setClave] = useState("");
  const [verClave, setVerClave] = useState(false);
  const [rol, setRol] = useState<"operario" | "cajera" | "supervisor" | "admin">("operario");

  const [busqueda, setBusqueda] = useState("");
  const [cedulaEditando, setCedulaEditando] = useState<string | null>(null);
  
  const [listaLocalUsuarios, setListaLocalUsuarios] = useState<UsuarioRegistrado[]>(() => {
    if (typeof window !== "undefined") {
      const guardados = localStorage.getItem("synapse_usuarios_persistentes");
      if (guardados) {
        try {
          return JSON.parse(guardados);
        } catch (e) {
          console.error("Error al leer usuarios persistentes", e);
        }
      }
    }
    return usuarios;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("synapse_usuarios_persistentes", JSON.stringify(listaLocalUsuarios));
    }
  }, [listaLocalUsuarios]);

  const usuariosFiltrados = listaLocalUsuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.cedula.includes(busqueda)
  );

  const iniciarEdicion = (u: any) => {
    setNombre(u.nombre);
    setCedula(u.cedula);
    setClave(u.clave);
    setRol(u.rol || "operario");
    setCedulaEditando(u.cedula);
    alert(`✏️ Editando empleado: ${u.nombre}`);
  };

  const cancelarEdicion = () => {
    setNombre("");
    setCedula("");
    setClave("");
    setRol("operario");
    setCedulaEditando(null);
  };

  const eliminarUsuarioDirecto = (cedulaTarget: string, nombreTarget: string) => {
    if (confirm(`⚠️ ¿Está seguro de eliminar al empleado ${nombreTarget} (CI: ${cedulaTarget}) de esta sucursal?`)) {
      const nuevaLista = listaLocalUsuarios.filter((u) => u.cedula !== cedulaTarget);
      setListaLocalUsuarios(nuevaLista);

      onAgregarAlerta({
        id: `ALT-${Date.now()}`,
        modulo: "Panel Administración Local",
        tipo: "BLOQUEO",
        nivel: 2,
        mensaje: `Empleado dado de baja: ${nombreTarget} (CI: ${cedulaTarget})`,
        timestamp: new Date().toLocaleTimeString(),
      });

      alert(`🗑️ Empleado ${nombreTarget} eliminado exitosamente.`);
      if (cedulaEditando === cedulaTarget) cancelarEdicion();
    }
  };

  const registrar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !cedula.trim() || !clave.trim()) {
      alert("⚠️ Complete todos los campos requeridos para el registro del empleado.");
      return;
    }

    if (cedulaEditando) {
      const listaActualizada = listaLocalUsuarios.map((u) =>
        u.cedula === cedulaEditando ? { ...u, nombre, cedula, clave, rol } : u
      );
      setListaLocalUsuarios(listaActualizada);
      onGuardarUsuario({ nombre, cedula, clave, rol, bloqueado: false } as any);
      alert(`✅ Datos de ${nombre} actualizados correctamente.`);
      cancelarEdicion();
    } else {
      if (listaLocalUsuarios.some((u) => u.cedula === cedula)) {
        alert(`⚠️ Ya existe un registro con la cédula ${cedula}.`);
        return;
      }

      const nuevoUsr: any = {
        nombre,
        cedula,
        clave,
        rol,
        bloqueado: false,
      };
      setListaLocalUsuarios([...listaLocalUsuarios, nuevoUsr]);
      onGuardarUsuario(nuevoUsr);

      onAgregarAlerta({
        id: `ALT-${Date.now()}`,
        modulo: "Panel Administración Local",
        tipo: "INFO",
        nivel: 1,
        mensaje: `Nuevo empleado registrado: ${nombre} con perfil ${rol.toUpperCase()}`,
        timestamp: new Date().toLocaleTimeString(),
      });

      alert(`✅ Empleado ${nombre} registrado exitosamente con el perfil ${rol.toUpperCase()}.`);
      cancelarEdicion();
    }
  };

  const alertasLocales = alertas.filter((a) => a.modulo === "Panel Administración Local");

  // Pestañas gerenciales para el dueño o administrador de la panadería
  const pestañasAdminLocal = [
    { id: 1, nombre: "Gestión de Personal" },
    { id: 2, nombre: "Catálogo y Precios Locales" },
    { id: 3, nombre: "Proveedores y Stock" },
    { id: 4, nombre: "Reportes de Caja y Turno" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-xs font-sans pb-12">
      
      {/* Cabecera corporativa del Administrador Local */}
      <header className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 shadow-xl flex items-center justify-between">
        <div>
          <h1 className="text-lg md:text-xl font-black text-amber-400 tracking-wide uppercase flex items-center gap-2 font-mono">
            💼 Centro de Control y Administración Local
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Gestión de personal, asignación de perfiles y operaciones de sucursal.</p>
        </div>
        <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1.5 rounded-xl font-mono text-[10px] uppercase font-bold">
          Licencia Activa
        </span>
      </header>

      {/* Navegación por Pestañas Locales */}
      <nav className="flex overflow-x-auto space-x-2 border-b border-zinc-800 pb-1 scrollbar-thin">
        {pestañasAdminLocal.map((p) => {
          const isActive = pestañaActiva === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setPestañaActiva(p.id)}
              className={`px-4 py-2.5 rounded-t-xl font-bold text-xs whitespace-nowrap transition-all border-t border-x cursor-pointer ${
                isActive
                  ? "bg-zinc-900 border-amber-500/60 text-amber-400 border-b-2 border-b-amber-400 shadow-md font-black"
                  : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
              }`}
            >
              {p.nombre}
            </button>
          );
        })}
      </nav>

      {/* PESTAÑA 1: GESTIÓN DE PERSONAL Y PERFILES */}
      {pestañaActiva === 1 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Formulario de Alta y Edición de Empleados */}
            <div className="bg-zinc-950 rounded-3xl border border-zinc-800 shadow-xl overflow-hidden p-5 space-y-5">
              <div className="border-b border-zinc-800 pb-3 flex justify-between items-center">
                <h2 className="text-sm font-black text-amber-400 uppercase tracking-wider font-mono">
                  {cedulaEditando ? `✏️ Editando Empleado (CI: ${cedulaEditando})` : "Registrar Nuevo Empleado"}
                </h2>
                {cedulaEditando && (
                  <button
                    type="button"
                    onClick={cancelarEdicion}
                    className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-1 rounded border border-rose-500/30 hover:bg-rose-500/30 cursor-pointer"
                  >
                    Cancelar
                  </button>
                )}
              </div>

              <form onSubmit={registrar} className="space-y-4">
                
                <div className="bg-black/60 p-4 rounded-2xl border border-zinc-800 space-y-3">
                  <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-1.5 font-mono">
                    Datos Personales
                  </h3>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-zinc-300">Nombre Completo:</label>
                    <input
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Ej. Juan Pérez"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-amber-500 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-zinc-300">Cédula de Identidad:</label>
                    <input
                      type="text"
                      value={cedula}
                      onChange={(e) => setCedula(e.target.value.replace(/\D/g, ""))}
                      placeholder="Ej. 12345678"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-500 text-xs"
                    />
                  </div>
                </div>

                <div className="bg-black/60 p-4 rounded-2xl border border-zinc-800 space-y-3">
                  <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-1.5 font-mono">
                    Credencial de Ingreso
                  </h3>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-zinc-300">Clave de Acceso (PIN):</label>
                    <div className="relative">
                      <input
                        type={verClave ? "text" : "password"}
                        value={clave}
                        onChange={(e) => setClave(e.target.value)}
                        placeholder="••••"
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 pr-9 text-zinc-100 focus:outline-none focus:border-amber-500 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setVerClave(!verClave)}
                        className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-amber-400 text-sm cursor-pointer"
                      >
                        {verClave ? "👁️" : "🙈"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Selector de los 4 Perfiles Operativos y Gerenciales Locales */}
                <div className="bg-black/60 p-4 rounded-2xl border border-zinc-800 space-y-3">
                  <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-1.5 font-mono">
                    Asignación de Perfil Estándar
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRol("operario")}
                      className={`py-2 px-3 rounded-xl font-bold border transition-all text-left cursor-pointer text-xs ${
                        rol === "operario"
                          ? "bg-amber-500 text-black border-amber-400 font-black shadow-md"
                          : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800"
                      }`}
                    >
                      👷 Operario Planta
                    </button>
                    <button
                      type="button"
                      onClick={() => setRol("cajera")}
                      className={`py-2 px-3 rounded-xl font-bold border transition-all text-left cursor-pointer text-xs ${
                        rol === "cajera"
                          ? "bg-amber-500 text-black border-amber-400 font-black shadow-md"
                          : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800"
                      }`}
                    >
                      💰 Cajera (POS)
                    </button>
                    <button
                      type="button"
                      onClick={() => setRol("supervisor")}
                      className={`py-2 px-3 rounded-xl font-bold border transition-all text-left cursor-pointer text-xs ${
                        rol === "supervisor"
                          ? "bg-amber-500 text-black border-amber-400 font-black shadow-md"
                          : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800"
                      }`}
                    >
                      🍞 Supervisor Turno
                    </button>
                    <button
                      type="button"
                      onClick={() => setRol("admin")}
                      className={`py-2 px-3 rounded-xl font-bold border transition-all text-left cursor-pointer text-xs ${
                        rol === "admin"
                          ? "bg-amber-500 text-black border-amber-400 font-black shadow-md"
                          : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800"
                      }`}
                    >
                      💼 Admin Local
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full py-3 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer font-mono ${
                    cedulaEditando
                      ? "bg-amber-500 text-black hover:bg-amber-400"
                      : "bg-emerald-500 text-black hover:bg-emerald-400"
                  }`}
                >
                  {cedulaEditando ? "💾 Actualizar Empleado" : "⚡ Registrar y Asignar Perfil"}
                </button>
              </form>
            </div>

            {/* Listado de Personal Registrado en la Sucursal */}
            <div className="bg-zinc-950 rounded-3xl border border-zinc-800 shadow-xl overflow-hidden flex flex-col p-5 space-y-4">
              <div className="border-b border-zinc-800 pb-3 space-y-3">
                <h2 className="text-sm font-black text-amber-400 uppercase tracking-wider font-mono">
                  📋 Personal Activo ({listaLocalUsuarios.length})
                </h2>

                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                    🔍
                  </span>
                  <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar por nombre o cédula..."
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-9 pr-3 py-2 text-zinc-200 focus:outline-none focus:border-amber-500 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {usuariosFiltrados.length === 0 ? (
                  <div className="text-zinc-500 italic text-center py-8">
                    No se encontraron empleados registrados.
                  </div>
                ) : (
                  usuariosFiltrados.map((u: any, i) => (
                    <div
                      key={i}
                      className="bg-black/60 p-3 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                    >
                      <div>
                        <div className="font-bold text-zinc-200">{u.nombre}</div>
                        <div className="text-[10px] font-mono text-zinc-400">
                          CI: {u.cedula} | Perfil: <span className="text-amber-400 uppercase font-bold">{u.rol || "operario"}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => iniciarEdicion(u)}
                          className="px-2.5 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl text-[10px] font-bold hover:bg-amber-500/30 cursor-pointer"
                        >
                          ✏️ Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const nuevoEstado = !u.bloqueado;
                            onActualizarEstadoUsuario(u.cedula, nuevoEstado);
                            setListaLocalUsuarios(
                              listaLocalUsuarios.map((item) =>
                                item.cedula === u.cedula ? { ...item, bloqueado: nuevoEstado } : item
                              )
                            );
                          }}
                          className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer ${
                            u.bloqueado
                              ? "bg-rose-500 text-white border border-rose-400"
                              : "bg-emerald-500 text-black border border-emerald-400 font-extrabold"
                          }`}
                        >
                          {u.bloqueado ? "🔴 Bloqueado" : "🟢 Activo"}
                        </button>

                        <button
                          type="button"
                          onClick={() => eliminarUsuarioDirecto(u.cedula, u.nombre)}
                          className="px-2.5 py-1.5 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-xl text-[10px] font-bold hover:bg-rose-500/30 cursor-pointer"
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

      {/* PESTAÑA 2: CATÁLOGO Y PRECIOS LOCALES */}
      {pestañaActiva === 2 && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-4">
          <h2 className="text-sm font-black text-amber-400 uppercase tracking-wider font-mono">
            📦 Gestión de Productos y Precios (Sucursal)
          </h2>
          <p className="text-xs text-zinc-400">Aquí el administrador local puede actualizar los precios de venta al público para las cajeras (POS).</p>
        </div>
      )}

      {/* PESTAÑA 3: PROVEEDORES Y STOCK */}
      {pestañaActiva === 3 && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-4">
          <h2 className="text-sm font-black text-amber-400 uppercase tracking-wider font-mono">
            🚚 Proveedores y Abastecimiento Local
          </h2>
          <p className="text-xs text-zinc-400">Control de insumos de harina, manteca y proveedores de la zona.</p>
        </div>
      )}

      {/* PESTAÑA 4: REPORTES DE CAJA Y TURNO */}
      {pestañaActiva === 4 && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 space-y-4">
          <h2 className="text-sm font-black text-amber-400 uppercase tracking-wider font-mono">
            📈 Reportes Financieros y Cierres de Turno
          </h2>
          <p className="text-xs text-zinc-400">Consolidado de ventas de la cajera y producción total de los operarios.</p>
        </div>
      )}

    </div>
  );
}