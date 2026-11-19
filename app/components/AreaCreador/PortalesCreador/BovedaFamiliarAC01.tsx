"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface MiembroFamiliar {
  id: string;
  nombre: string;
  cedula: string;
  claveMaestra: string;
  nivel: number;
  rol: string;
  bloqueado: boolean;
}

const CLAVE_STORAGE = "synapse_boveda_familiar_local_v2";

export default function BovedaFamiliarAC01() {
  const [familiares, setFamiliares] = useState<MiembroFamiliar[]>([]);
  const [nombreFamInput, setNombreFamInput] = useState("");
  const [cedulaFamInput, setCedulaFamInput] = useState("");
  const [claveMaestraFamInput, setClaveMaestraFamInput] = useState("");
  const [nivelFamInput, setNivelFamInput] = useState<number>(1);
  const [busquedaFam, setBusquedaFam] = useState("");
  const [idFamSeleccionado, setIdFamSeleccionado] = useState<string | null>(null);
  const [modoAccion, setModoAccion] = useState<"crear" | "editar" | "ver">("crear");
  const [mostrarClave, setMostrarClave] = useState<boolean>(false);

  // CARGA HÍBRIDA ROBUSTA
  useEffect(() => {
    async function inicializarBoveda() {
      let datos: MiembroFamiliar[] = [];

      // 1. Intentar de localStorage
      if (typeof window !== "undefined") {
        const local = localStorage.getItem(CLAVE_STORAGE);
        if (local) {
          try {
            datos = JSON.parse(local);
          } catch (e) {
            console.error(e);
          }
        }
      }

      // 2. Intentar de Supabase
      try {
        const { data, error } = await supabase.from("boveda_familiar").select("*");
        if (!error && data && data.length > 0) {
          datos = data as MiembroFamiliar[];
        }
      } catch (err) {
        console.error("Modo offline activado por red:", err);
      }

      // Si está vacío, asignar datos base
      if (datos.length === 0) {
        datos = [
          { id: "FAM-01", nombre: "Hija 1", cedula: "V-26000001", claveMaestra: "H1#2026*", nivel: 1, rol: "Super User", bloqueado: false },
          { id: "FAM-02", nombre: "Hija 2", cedula: "V-26000002", claveMaestra: "H2#2026*", nivel: 1, rol: "Super User", bloqueado: false },
        ];
      }

      setFamiliares(datos);
      if (typeof window !== "undefined") {
        localStorage.setItem(CLAVE_STORAGE, JSON.stringify(datos));
      }
    }
    inicializarBoveda();
  }, []);

  const actualizarAlmacenamiento = (nuevaLista: MiembroFamiliar[]) => {
    setFamiliares(nuevaLista);
    if (typeof window !== "undefined") {
      localStorage.setItem(CLAVE_STORAGE, JSON.stringify(nuevaLista));
    }
  };

  const limpiarFormularioFamiliar = () => {
    setNombreFamInput("");
    setCedulaFamInput("");
    setClaveMaestraFamInput("");
    setNivelFamInput(1);
    setIdFamSeleccionado(null);
    setModoAccion("crear");
    setMostrarClave(false);
  };

  const accionCrearNuevo = () => {
    limpiarFormularioFamiliar();
    setModoAccion("crear");
  };

  // REGISTRAR NUEVO USUARIO
  const accionRegistrarNuevo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreFamInput.trim() || !cedulaFamInput.trim() || !claveMaestraFamInput.trim()) {
      alert("Por favor complete los campos obligatorios para registrar.");
      return;
    }

    const nuevo: MiembroFamiliar = {
      id: `FAM-${Date.now()}`,
      nombre: nombreFamInput.trim(),
      cedula: cedulaFamInput.trim(),
      claveMaestra: claveMaestraFamInput.trim(),
      nivel: Number(nivelFamInput),
      rol: "Super User",
      bloqueado: false,
    };

    const nuevaLista = [...familiares, nuevo];
    actualizarAlmacenamiento(nuevaLista);

    try {
      await supabase.from("boveda_familiar").upsert([nuevo]);
    } catch (err) {
      console.error("Aviso de red en registro:", err);
    }

    alert("¡Usuario registrado con éxito en el sistema!");
    limpiarFormularioFamiliar();
  };

  // GUARDAR CAMBIOS DE USUARIO EXISTENTE
  const accionGuardarCambios = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idFamSeleccionado) {
      alert("Seleccione un usuario de la lista para guardar cambios.");
      return;
    }
    if (!nombreFamInput.trim() || !cedulaFamInput.trim() || !claveMaestraFamInput.trim()) {
      alert("Por favor complete los campos obligatorios.");
      return;
    }

    const actualizados = familiares.map(f => f.id === idFamSeleccionado ? {
      ...f,
      nombre: nombreFamInput.trim(),
      cedula: cedulaFamInput.trim(),
      claveMaestra: claveMaestraFamInput.trim(),
      nivel: Number(nivelFamInput),
    } : f);

    actualizarAlmacenamiento(actualizados);

    try {
      await supabase.from("boveda_familiar").update({
        nombre: nombreFamInput.trim(),
        cedula: cedulaFamInput.trim(),
        claveMaestra: claveMaestraFamInput.trim(),
        nivel: Number(nivelFamInput),
        rol: "Super User",
      }).eq("id", idFamSeleccionado);
    } catch (err) {
      console.error(err);
    }

    alert("¡Cambios guardados con éxito!");
    limpiarFormularioFamiliar();
  };

  const seleccionarMiembroPorBusqueda = () => {
    const encontrado = familiares.find(
      (f) => f.cedula.toLowerCase().includes(busquedaFam.toLowerCase()) || f.nombre.toLowerCase().includes(busquedaFam.toLowerCase())
    );
    if (encontrado) {
      setIdFamSeleccionado(encontrado.id);
      setNombreFamInput(encontrado.nombre);
      setCedulaFamInput(encontrado.cedula);
      setClaveMaestraFamInput(encontrado.claveMaestra);
      setNivelFamInput(encontrado.nivel);
      setModoAccion("editar");
      alert(`Usuario encontrado: ${encontrado.nombre}. Listo para editar y guardar.`);
    } else {
      alert("No se encontró ningún usuario con ese criterio de búsqueda.");
    }
  };

  const accionVerSeleccionado = () => {
    if (!idFamSeleccionado) {
      alert("Seleccione un usuario de la lista primero.");
      return;
    }
    setModoAccion("ver");
  };

  const accionEditarSeleccionado = () => {
    if (!idFamSeleccionado) {
      alert("Seleccione un usuario de la lista para editar.");
      return;
    }
    setModoAccion("editar");
  };

  // ELIMINAR REGISTRO DE FORMA LIMPIA
  const accionEliminarSeleccionado = async () => {
    if (!idFamSeleccionado) {
      alert("Seleccione un usuario para eliminar.");
      return;
    }
    if (!confirm("¿Está seguro de eliminar este registro permanentemente?")) return;

    const nuevaLista = familiares.filter(f => f.id !== idFamSeleccionado);
    actualizarAlmacenamiento(nuevaLista);

    try {
      await supabase.from("boveda_familiar").delete().eq("id", idFamSeleccionado);
    } catch (err) {
      console.error("Error al eliminar en Supabase:", err);
    }

    alert("Registro eliminado con éxito.");
    limpiarFormularioFamiliar();
  };

  const toggleBloqueoFamiliar = async (id: string) => {
    const actualizados = familiares.map(f => f.id === id ? { ...f, bloqueado: !f.bloqueado } : f);
    actualizarAlmacenamiento(actualizados);
    const mod = actualizados.find(f => f.id === id);
    if (mod) {
      try {
        await supabase.from("boveda_familiar").update({ bloqueado: mod.bloqueado }).eq("id", id);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const familiaresFiltrados = familiares.filter(
    (f) => f.nombre.toLowerCase().includes(busquedaFam.toLowerCase()) || f.cedula.toLowerCase().includes(busquedaFam.toLowerCase())
  );

  return (
    <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-6 shadow-2xl font-mono text-xs space-y-6">
      <div className="bg-amber-950/20 border border-amber-500/40 p-4 rounded-xl flex justify-between items-center text-white">
        <div>
          <h3 className="text-sm font-bold text-amber-300 uppercase">🔒 Bóveda Privada & 5 Niveles (Control Operativo Total)</h3>
          <p className="text-xs text-slate-300 mt-1">Gestión centralizada con persistencia híbrida a prueba de fallos de red.</p>
        </div>
        <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-lg text-[10px] font-bold">
          MODO: {modoAccion.toUpperCase()} {idFamSeleccionado ? `(Seleccionado)` : ""}
        </span>
      </div>

      {/* BARRA DE BÚSQUEDA Y BOTONERA DE ICONOS PUROS */}
      <div className="bg-black/50 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="🔍 Ingrese nombre o número de cédula..."
            value={busquedaFam}
            onChange={(e) => setBusquedaFam(e.target.value)}
            className="flex-1 bg-black border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 outline-none"
          />
          <button
            type="button"
            onClick={seleccionarMiembroPorBusqueda}
            title="Buscar usuario"
            className="p-2.5 bg-slate-800 hover:bg-amber-500 hover:text-black text-slate-200 font-bold rounded-xl border border-slate-700 transition cursor-pointer flex items-center justify-center text-sm shadow-sm"
          >
            🔍
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase font-bold mr-2">Herramientas:</span>

          <button
            type="button"
            onClick={accionCrearNuevo}
            title="Crear Nuevo Registro"
            className="p-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-sm transition cursor-pointer flex items-center justify-center shadow-sm"
          >
            ➕
          </button>

          <button
            type="button"
            onClick={accionRegistrarNuevo}
            title="Registrar Nuevo Usuario"
            className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition cursor-pointer flex items-center justify-center shadow-sm"
          >
            📥
          </button>

          <button
            type="button"
            onClick={accionGuardarCambios}
            title="Guardar Cambios del Usuario Seleccionado"
            className="p-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-sm transition cursor-pointer flex items-center justify-center shadow-sm"
          >
            💾
          </button>

          <button
            type="button"
            onClick={accionVerSeleccionado}
            title="Ver Registro Seleccionado"
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-sm transition cursor-pointer flex items-center justify-center border border-slate-700 shadow-sm"
          >
            👁️
          </button>

          <button
            type="button"
            onClick={accionEditarSeleccionado}
            title="Editar Registro Seleccionado"
            className="p-2.5 bg-purple-600/30 hover:bg-purple-600 text-purple-300 hover:text-white font-bold rounded-xl text-sm transition cursor-pointer flex items-center justify-center border border-purple-500/40 shadow-sm"
          >
            ✏️
          </button>

          <button
            type="button"
            onClick={accionEliminarSeleccionado}
            title="Eliminar Registro Seleccionado"
            className="p-2.5 bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white font-bold rounded-xl text-sm transition cursor-pointer flex items-center justify-center border border-red-500/40 shadow-sm"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* FORMULARIO DE ENTRADA CON EL OJITO DE VISIBILIDAD */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-black/40 p-4 rounded-xl border border-slate-800 text-white">
        <div>
          <label className="text-[10px] text-slate-400 block mb-1">Nombre Completo</label>
          <input
            type="text"
            placeholder="Nombre"
            value={nombreFamInput}
            onChange={(e) => setNombreFamInput(e.target.value)}
            disabled={modoAccion === "ver"}
            className="w-full bg-black border border-slate-700 rounded-lg p-2 text-white disabled:opacity-50"
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-400 block mb-1">Cédula de Identidad</label>
          <input
            type="text"
            placeholder="Cédula"
            value={cedulaFamInput}
            onChange={(e) => setCedulaFamInput(e.target.value)}
            disabled={modoAccion === "ver"}
            className="w-full bg-black border border-slate-700 rounded-lg p-2 text-white disabled:opacity-50"
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-400 block mb-1">Clave Maestra</label>
          <div className="relative flex items-center">
            <input
              type={mostrarClave ? "text" : "password"}
              placeholder="Clave Maestra"
              value={claveMaestraFamInput}
              onChange={(e) => setClaveMaestraFamInput(e.target.value)}
              disabled={modoAccion === "ver"}
              className="w-full bg-black border border-slate-700 rounded-lg p-2 pr-9 text-white disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setMostrarClave(!mostrarClave)}
              title={mostrarClave ? "Ocultar clave" : "Ver clave"}
              className="absolute right-2.5 text-slate-400 hover:text-amber-400 text-sm transition cursor-pointer"
            >
              {mostrarClave ? "👁️‍🗨️" : "👁️"}
            </button>
          </div>
        </div>
        <div>
          <label className="text-[10px] text-slate-400 block mb-1">Nivel de Autorización (1-5)</label>
          <select
            value={nivelFamInput}
            onChange={(e) => setNivelFamInput(Number(e.target.value))}
            disabled={modoAccion === "ver"}
            className="w-full bg-black border border-slate-700 rounded-lg p-2 text-amber-400 font-bold disabled:opacity-50"
          >
            <option value={1}>Nivel 1</option>
            <option value={2}>Nivel 2</option>
            <option value={3}>Nivel 3</option>
            <option value={4}>Nivel 4</option>
            <option value={5}>Nivel 5</option>
          </select>
        </div>
      </div>

      {/* CONTENEDOR TIPO TABLA LIMPIA */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-3 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
          <span className="font-bold text-amber-400 text-xs uppercase">📋 Listado Activo del Sistema (Haga clic en una fila para seleccionar)</span>
          <span className="text-[10px] text-slate-400">Total: {familiaresFiltrados.length} registros</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/60 text-slate-400 text-[10px] uppercase border-b border-slate-800 font-mono">
                <th className="p-3">Cédula</th>
                <th className="p-3">Nombre Completo</th>
                <th className="p-3">Rol</th>
                <th className="p-3">Nivel</th>
                <th className="p-3 text-center">Estado (Micro-botón Activo / Bloqueado)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {familiaresFiltrados.map((fam) => {
                const seleccionado = idFamSeleccionado === fam.id;
                return (
                  <tr
                    key={fam.id}
                    onClick={() => {
                      setIdFamSeleccionado(fam.id);
                      setNombreFamInput(fam.nombre);
                      setCedulaFamInput(fam.cedula);
                      setClaveMaestraFamInput(fam.claveMaestra);
                      setNivelFamInput(fam.nivel);
                      setModoAccion("editar");
                    }}
                    className={`cursor-pointer transition-colors ${seleccionado ? "bg-amber-500/10 border-l-4 border-amber-500" : "hover:bg-slate-800/40"}`}
                  >
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-lg border text-[10px] font-bold ${seleccionado ? "bg-amber-500 text-black border-amber-400" : "bg-black text-amber-400 border-slate-800"}`}>
                        {fam.cedula} {seleccionado ? "✓" : ""}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-white">{fam.nombre}</td>
                    <td className="p-3 text-cyan-300 text-[11px] font-bold">Super User</td>
                    <td className="p-3 text-amber-400 text-[11px] font-bold">Nivel {fam.nivel}</td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBloqueoFamiliar(fam.id);
                        }}
                        title="Haga clic para alternar entre Activo y Bloqueado"
                        className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition shadow-sm ${
                          fam.bloqueado
                            ? "bg-red-950 text-red-400 border border-red-500/40 hover:bg-red-900"
                            : "bg-emerald-950 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-900"
                        }`}
                      >
                        {fam.bloqueado ? "🔒 BLOQUEADO" : "🟢 ACTIVO"}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {familiaresFiltrados.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No se encontraron registros activos en la Bóveda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}