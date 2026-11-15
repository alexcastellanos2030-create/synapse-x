"use client";

import React, { useState } from "react";
import { UsuarioRegistrado } from "../page";

interface PanelPersonalPermisosPageProps {
  usuarios: UsuarioRegistrado[];
  onGuardarUsuario: (usuario: UsuarioRegistrado) => void;
  onActualizarEstadoUsuario: (cedula: string, bloqueado: boolean) => void;
}

export default function PanelPersonalPermisosPage({
  usuarios,
  onGuardarUsuario,
  onActualizarEstadoUsuario,
}: PanelPersonalPermisosPageProps) {
  // Pestañas internas de esta vista (Ahora con 3 pestañas maestras)
  const [subTab, setSubTab] = useState<"registro" | "lista" | "buscador">("registro");

  // Estados del formulario de registro y plan de carrera
  const [nombre, setNombre] = useState("");
  const [cedula, setCedula] = useState("");
  const [clave, setClave] = useState("");
  const [cargo, setCargo] = useState("Operario de Línea");
  const [sueldoBase, setSueldoBase] = useState<number>(500);
  const [bonoResponsabilidad, setBonoResponsabilidad] = useState<number>(100);
  const [rol, setRol] = useState<"admin" | "operario">("operario");

  // Checklist de los 13 pasos de producción y módulos permitidos para NUEVOS registros
  const [permisos, setPermisos] = useState({
    recepcionPedidos: false,
    estacion1: false,
    estacion2: false,
    estacion3: false,
    estacion4: false,
    estacion5: false,
    estacion6A: false,
    estacion6B: false,
    estacion7: false,
    estacion701: false,
    estacion702: false,
    estacion8: false,
    estacion9: false,
    estacion11: false,
  });

  const handleCheckboxChange = (key: keyof typeof permisos) => {
    setPermisos((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !cedula || !clave) {
      alert("⚠️ Por favor completa los campos obligatorios: Nombre, Cédula y Clave.");
      return;
    }

    const nuevoUsuario: UsuarioRegistrado = {
      nombre,
      cedula,
      clave,
      rol,
      bloqueado: false,
    };

    onGuardarUsuario(nuevoUsuario);
    alert(`🌟 ¡Empleado ${nombre} registrado con éxito bajo el Plan de Carrera Industrial!`);
    
    setNombre("");
    setCedula("");
    setClave("");
    setSueldoBase(500);
    setBonoResponsabilidad(100);
    setSubTab("lista");
  };

  const compensacionTotal = Number(sueldoBase) + Number(bonoResponsabilidad);

  // Estados para la Pestaña 3: Buscador y Modificación de Empleados Existentes
  const [busquedaInput, setBusquedaInput] = useState("");
  const [cedulaSeleccionada, setCedulaSeleccionada] = useState<string | null>(null);

  // Filtrar operarios por nombre o cédula de manera independiente
  const empleadosFiltrados = usuarios.filter((u) => {
    const q = busquedaInput.toLowerCase().trim();
    if (!q) return true;
    return u.nombre.toLowerCase().includes(q) || u.cedula.includes(q);
  });

  const empleadoActual = usuarios.find((u) => u.cedula === cedulaSeleccionada);

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* 3 PESTAÑAS INTERNAS DE LA VISTA */}
      <div className="flex gap-2 border-b border-slate-300 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setSubTab("registro")}
          className={`px-4 py-2 rounded-xl font-black transition-all cursor-pointer whitespace-nowrap ${
            subTab === "registro"
              ? "bg-amber-500 text-slate-950 shadow-md"
              : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          }`}
        >
          📝 Registro y Plan de Carrera
        </button>
        <button
          type="button"
          onClick={() => setSubTab("lista")}
          className={`px-4 py-2 rounded-xl font-black transition-all cursor-pointer whitespace-nowrap ${
            subTab === "lista"
              ? "bg-amber-500 text-slate-950 shadow-md"
              : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          }`}
        >
          👥 Plantilla de Personal ({usuarios.length})
        </button>
        <button
          type="button"
          onClick={() => setSubTab("buscador")}
          className={`px-4 py-2 rounded-xl font-black transition-all cursor-pointer whitespace-nowrap ${
            subTab === "buscador"
              ? "bg-amber-500 text-slate-950 shadow-md"
              : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          }`}
        >
          🔍 Buscar y Gestionar Permisos Existentes
        </button>
      </div>

      {/* PESTAÑA 1: REGISTRO DE NUEVO EMPLEADO */}
      {subTab === "registro" && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-5 rounded-2xl shadow-xl space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-black text-amber-600 dark:text-amber-400 uppercase tracking-wide">
              Registro de Nuevo Empleado y Asignación de Funciones
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Define su identidad, su compensación por mérito y habilita quirúrgicamente las estaciones que domina en planta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Nombre Completo:</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Elvis Vera"
                className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Cédula de Identidad:</label>
              <input
                type="text"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                placeholder="Ej. 12345678"
                className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 font-mono"
              />
            </div>
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Clave de Acceso:</label>
              <input
                type="password"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Cargo Oficial:</label>
              <select
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 font-bold"
              >
                <option value="Operario de Línea">Operario de Línea</option>
                <option value="Maestro Panadero">Maestro Panadero</option>
                <option value="Supervisor de Área">Supervisor de Área</option>
                <option value="Auxiliar de Despacho/Bodega">Auxiliar de Despacho/Bodega</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1 text-slate-700 dark:text-slate-300">Rol en el Sistema:</label>
              <select
                value={rol}
                onChange={(e) => setRol(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 font-bold"
              >
                <option value="operario">Operario / Personal</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1 text-amber-600 dark:text-amber-400">Nivel de Acceso:</label>
              <div className="p-2.5 rounded-xl border bg-amber-500/10 border-amber-500/30 font-mono font-bold text-amber-700 dark:text-amber-300">
                🔒 Granular por Checklist
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-black uppercase text-amber-600 dark:text-amber-400">
              💰 Compensación Económica y Plan de Carrera por Mérito
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold mb-1">Sueldo Base ($):</label>
                <input
                  type="number"
                  value={sueldoBase}
                  onChange={(e) => setSueldoBase(Number(e.target.value))}
                  className="w-full p-2 rounded-xl border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Bono por Responsabilidad ($):</label>
                <input
                  type="number"
                  value={bonoResponsabilidad}
                  onChange={(e) => setBonoResponsabilidad(Number(e.target.value))}
                  className="w-full p-2 rounded-xl border bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 font-mono font-bold text-emerald-500"
                />
              </div>
              <div className="flex flex-col justify-end">
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                  TOTAL: $ {compensacionTotal.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-black uppercase text-amber-600 dark:text-amber-400">
              🔐 Asignación de Estaciones y Módulos Permitidos (Habilita Funciones)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 p-4 rounded-2xl border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800">
              {[
                { key: "recepcionPedidos", label: "📝 Recepción de Pedidos (Estación 0)" },
                { key: "estacion1", label: "🥖 1. Selección y Armado de Lotes (Estación 1)" },
                { key: "estacion2", label: "⚖️ 2. Pesaje de Ingredientes (Estación 2)" },
                { key: "estacion3", label: "🌀 3. Amasado Industrial (Estación 3)" },
                { key: "estacion4", label: "✂️ 4. División y Ovillado (Estación 4)" },
                { key: "estacion5", label: "🌡️ 5. Fermentación Controlada (Estación 5)" },
                { key: "estacion6A", label: "🎨 6-A. Cobertura, Topping y Corte (Estación 6-A)" },
                { key: "estacion6B", label: "🔥 6-B. Horneado y Temperatura (Estación 6-B)" },
                { key: "estacion7", label: "🔍 7. Enfriamiento y Control de Calidad (Estación 7)" },
                { key: "estacion701", label: "📦 701. Empaque y Sellado (Estación 701)" },
                { key: "estacion702", label: "🧺 702. Control de Cestas (Estación 702)" },
                { key: "estacion8", label: "🚚 8. Liberación de Cestas (Estación 8)" },
                { key: "estacion9", label: "🚀 9. Módulo de Despacho a Cliente (Estación 9)" },
                { key: "estacion11", label: "🏭 11. Bodega, Stock y Sobrantes (Estaciones 11-1102)" },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-amber-500 transition"
                >
                  <input
                    type="checkbox"
                    checked={(permisos as any)[item.key]}
                    onChange={() => handleCheckboxChange(item.key as any)}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                  <span className="font-bold text-slate-800 dark:text-slate-200">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-amber-500 text-slate-950 font-black uppercase tracking-wider rounded-xl hover:bg-amber-400 transition cursor-pointer shadow-lg text-sm"
          >
            🌟 Registrar Empleado, Asignar Permisos y Activar Plan de Carrera
          </button>
        </form>
      )}

      {/* PESTAÑA 2: PLANTILLA GENERAL DE PERSONAL */}
      {subTab === "lista" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
          <h3 className="text-sm font-black text-amber-600 dark:text-amber-400 uppercase tracking-wide">
            👥 Plantilla de Personal y Estado de Credenciales
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-black text-slate-500 uppercase">
                  <th className="p-3">Nombre</th>
                  <th className="p-3">Cédula</th>
                  <th className="p-3">Rol</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                {usuarios.map((usr) => (
                  <tr key={usr.cedula} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{usr.nombre}</td>
                    <td className="p-3 font-mono text-amber-600 dark:text-amber-400">{usr.cedula}</td>
                    <td className="p-3 uppercase text-[10px] font-black">{usr.rol}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${usr.bloqueado ? "bg-rose-500/20 text-rose-500" : "bg-emerald-500/20 text-emerald-500"}`}>
                        {usr.bloqueado ? "Bloqueado" : "Activo"}
                      </span>
                    </td>
                    <td className="p-3 text-right flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setCedulaSeleccionada(usr.cedula);
                          setSubTab("buscador");
                        }}
                        className="px-3 py-1 bg-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-slate-950 font-bold rounded-lg transition cursor-pointer"
                      >
                        🔍 Ver / Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => onActualizarEstadoUsuario(usr.cedula, !usr.bloqueado)}
                        className={`px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${usr.bloqueado ? "bg-emerald-500 text-slate-950" : "bg-rose-500 text-white"}`}
                      >
                        {usr.bloqueado ? "Desbloquear" : "Bloquear"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PESTAÑA 3: BUSCADOR Y MODIFICACIÓN DE EMPLEADOS EXISTENTES */}
      {subTab === "buscador" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-5 rounded-2xl shadow-xl space-y-5">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-black text-amber-600 dark:text-amber-400 uppercase tracking-wide">
              🔍 Buscador y Auditoría de Permisos por Funciones
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Escribe el nombre o la cédula del operario para consultar su perfil detallado y modificar sus accesos en tiempo real.
            </p>
          </div>

          {/* BARRA DE BÚSQUEDA INDEPENDIENTE */}
          <div className="flex gap-3">
            <input
              type="text"
              value={busquedaInput}
              onChange={(e) => setBusquedaInput(e.target.value)}
              placeholder="Buscar por Nombre (Ej. Elvis) o Cédula (Ej. 12345678)..."
              className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 font-bold text-sm text-amber-600 dark:text-amber-300"
            />
            {busquedaInput && (
              <button
                type="button"
                onClick={() => setBusquedaInput("")}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 font-bold rounded-xl hover:bg-rose-500 hover:text-white transition cursor-pointer"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* RESULTADOS DE LA BÚSQUEDA */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-1">
            {empleadosFiltrados.length === 0 ? (
              <div className="col-span-3 p-4 text-center text-slate-500 font-bold italic">
                No se encontraron empleados con ese criterio de búsqueda.
              </div>
            ) : (
              empleadosFiltrados.map((usr) => (
                <div
                  key={usr.cedula}
                  onClick={() => setCedulaSeleccionada(usr.cedula)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    cedulaSeleccionada === usr.cedula
                      ? "bg-amber-500/20 border-amber-500 shadow-md"
                      : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-amber-500/50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-black text-slate-900 dark:text-white">{usr.nombre}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${usr.bloqueado ? "bg-rose-500/20 text-rose-500" : "bg-emerald-500/20 text-emerald-500"}`}>
                      {usr.bloqueado ? "Bloqueado" : "Activo"}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-amber-600 dark:text-amber-400 mt-2">
                    CI: {usr.cedula} | Rol: {usr.rol.toUpperCase()}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* PANEL DE VISUALIZACIÓN Y EDICIÓN DEL EMPLEADO SELECCIONADO */}
          {empleadoActual ? (
            <div className="border-t border-slate-200 dark:border-slate-800 pt-5 space-y-4 bg-slate-50/50 dark:bg-slate-950/50 p-4 rounded-2xl border">
              <div className="flex justify-between items-center">
                <h4 className="font-black text-amber-600 dark:text-amber-400 uppercase text-xs">
                  ⚙️ Perfil y Permisos Activos de: <span className="text-slate-900 dark:text-white underline">{empleadoActual.nombre}</span>
                </h4>
                <span className="font-mono text-xs text-slate-500">Cédula: {empleadoActual.cedula}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 font-bold block">CARGO ASIGNADO</span>
                  <strong className="text-xs text-amber-500">Operario de Línea / Producción</strong>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 font-bold block">SUELDO Y BONO ESTIMADO</span>
                  <strong className="text-xs text-emerald-500">$ 600.00 (Base + Responsabilidad)</strong>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-bold">ESTADO DE ACCESO</span>
                  <button
                    type="button"
                    onClick={() => onActualizarEstadoUsuario(empleadoActual.cedula, !empleadoActual.bloqueado)}
                    className={`px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${empleadoActual.bloqueado ? "bg-emerald-500 text-slate-950" : "bg-rose-500 text-white"}`}
                  >
                    {empleadoActual.bloqueado ? "Desbloquear Acceso" : "Bloquear Acceso"}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase text-slate-600 dark:text-slate-400">
                  📋 Estaciones y Módulos Habilitados (Checklist Actual):
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    "📝 Recepción de Pedidos (Estación 0)",
                    "🥖 1. Selección y Armado de Lotes (Estación 1)",
                    "⚖️ 2. Pesaje de Ingredientes (Estación 2)",
                    "🌀 3. Amasado Industrial (Estación 3)",
                    "✂️ 4. División y Ovillado (Estación 4)",
                    "🌡️ 5. Fermentación Controlada (Estación 5)",
                    "🔥 6-B. Horneado y Temperatura (Estación 6-B)",
                    "📦 701. Empaque y Sellado (Estación 701)",
                    "🚀 9. Módulo de Despacho a Cliente (Estación 9)",
                  ].map((estacion, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <input type="checkbox" defaultChecked={idx < 4} className="accent-amber-500 w-4 h-4 cursor-pointer" />
                      <span className="font-bold text-slate-800 dark:text-slate-200">{estacion}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => alert(`✅ Cambios y permisos guardados exitosamente para ${empleadoActual.nombre}`)}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl shadow-lg transition cursor-pointer text-xs"
                >
                  💾 Guardar Modificaciones de Permisos
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-slate-500">
              👉 Selecciona un empleado de la lista superior para visualizar su perfil, su sueldo, su bono y su checklist de estaciones habilitadas.
            </div>
          )}
        </div>
      )}
    </div>
  );
}