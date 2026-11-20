"use client";

// ============================================================================
// PORTAL AC08 — PORTAL ID / IDENTIDADES (SYNAPSE-X OS / OSAI INDUSTRIAL)
// - Ubicado junto a los portales 00 al 07.
// - Título superior completo y parpadeante para acceso rápido del Creador.
// - Pestañas protegidas con clave conectadas a Supabase:
//   1) Bóveda Familiar (Nivel 10 exclusivo Creador; hijas Superusers 1 -> 9)
//   2) Ing. y Técnicos (tabla unificada usuarios_ing_tec: 'prueba' / 'real')
//   3) Licencias (usuarios_licencia: 'prueba' / 'real')
//   4) Bitácora (registro de eventos y movimientos del portal AC08)
// ============================================================================

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { esClaveValidaCreador } from "../BovedaCreadorMaster";

type PestanaAC08 =
  | "boveda_familiar"
  | "usuarios_ing_tec"
  | "usuarios_licencia"
  | "bitacora";

interface FilaBoveda {
  id: string;
  nombre: string;
  cedula: string;
  telefono: string;
  nivel: number;
  rol: string;
  bloqueado: boolean;
  clave_maestra: string;
  nota_aprendizaje: string;
}

interface FilaIngTec {
  id?: string;
  cedula: string;
  nombre: string;
  especialidad: "Ingeniero en Sistemas" | "Técnico en Informática";
  cargo: string;
  nivel: string;
  clave: string;
  telefono: string;
  tipo_usuario: "prueba" | "real";
  activo: boolean;
}

interface FilaLicencia {
  id?: string;
  codigo_licencia: string;
  cedula_usuario: string;
  nombre_usuario: string;
  rol_licencia: string;
  estado_licencia: "activa" | "suspendida" | "vencida";
  tipo_usuario: "prueba" | "real";
  max_estaciones: number;
}

interface EventoBitacoraAC08 {
  id: string;
  fechaHora: string;
  pestana: string;
  accion: string;
  detalle: string;
}

export default function PortalAC08Identidades() {
  const [claveIngreso, setClaveIngreso] = useState("");
  const [claveValidada, setClaveValidada] = useState<string | null>(null);
  const [pestanaActiva, setPestanaActiva] = useState<PestanaAC08>("boveda_familiar");
  const [cargando, setCargando] = useState(false);
  const [mensajeEstado, setMensajeEstado] = useState(
    "Portal bloqueado. Ingrese su clave del Creador para ver, actualizar y registrar en bitácora."
  );

  const [filasBoveda, setFilasBoveda] = useState<FilaBoveda[]>([]);
  const [filasIngTec, setFilasIngTec] = useState<FilaIngTec[]>([]);
  const [filasLicencia, setFilasLicencia] = useState<FilaLicencia[]>([]);
  const [bitacora, setBitacora] = useState<EventoBitacoraAC08[]>([]);

  const agregarEventoBitacora = (
    pestana: string,
    accion: string,
    detalle: string
  ) => {
    const ahora = new Date();
    const fechaHora = ahora.toLocaleString("es-CL", { hour12: false });
    const nuevoEvento: EventoBitacoraAC08 = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      fechaHora,
      pestana,
      accion,
      detalle,
    };
    setBitacora((prev) => [nuevoEvento, ...prev]);
  };

  const cargarDatosSupabase = async (
    claveActiva: string,
    registrarLectura = false
  ) => {
    setCargando(true);
    try {
      const [resBoveda, resIngTec, resLic] = await Promise.all([
        supabase.rpc("leer_boveda_familiar_segura", { p_clave: claveActiva }),
        supabase.rpc("leer_usuarios_ing_tec_segura", { p_clave: claveActiva }),
        supabase.rpc("leer_usuarios_licencia_segura", { p_clave: claveActiva }),
      ]);

      if (resBoveda.error) throw resBoveda.error;
      if (resIngTec.error) throw resIngTec.error;
      if (resLic.error) throw resLic.error;

      const bovedaData = (resBoveda.data || []) as FilaBoveda[];
      const ingTecData = (resIngTec.data || []) as FilaIngTec[];
      const licData = (resLic.data || []) as FilaLicencia[];

      setFilasBoveda(bovedaData);
      setFilasIngTec(ingTecData);
      setFilasLicencia(licData);
      setMensajeEstado("Portal del Núcleo Familiar e Identidades sincronizado con Supabase.");

      if (registrarLectura) {
        agregarEventoBitacora(
          "Sincronización",
          "Lectura protegida",
          `Cargados ${bovedaData.length} en Bóveda Familiar, ${ingTecData.length} en Ing/Técnicos y ${licData.length} en Licencias.`
        );
      }
    } catch (err: any) {
      const errMsg = err?.message || "verifique clave y funciones en Supabase";
      setMensajeEstado(`Error al consultar Supabase: ${errMsg}`);
      agregarEventoBitacora("Error", "Fallo de consulta", errMsg);
    } finally {
      setCargando(false);
    }
  };

  const handleDesbloquear = async (e: React.FormEvent) => {
    e.preventDefault();
    const limpia = claveIngreso.trim();
    if (!esClaveValidaCreador(limpia)) {
      setMensajeEstado("Clave inválida para desbloquear el Portal del Núcleo Familiar e Identidades.");
      agregarEventoBitacora("Seguridad", "Intento fallido", "Clave no autorizada ingresada en AC08.");
      return;
    }
    setClaveValidada(limpia);
    agregarEventoBitacora("Acceso", "Desbloqueo OK", "Clave del Creador validada en AC08.");
    await cargarDatosSupabase(limpia, true);
  };

  const handleBloquear = () => {
    agregarEventoBitacora("Acceso", "Bloqueo manual", "Sesión del portal AC08 bloqueada.");
    setClaveValidada(null);
    setClaveIngreso("");
    setFilasBoveda([]);
    setFilasIngTec([]);
    setFilasLicencia([]);
    setMensajeEstado("Portal bloqueado.");
  };

  const guardarBoveda = async (fila: FilaBoveda) => {
    if (!claveValidada) return;
    setCargando(true);
    try {
      const { error } = await supabase.rpc("actualizar_boveda_familiar_segura", {
        p_clave: claveValidada,
        p_cedula: fila.cedula,
        p_nombre: fila.nombre,
        p_telefono: fila.telefono,
        p_nivel: Number(fila.nivel),
        p_rol: fila.rol,
        p_bloqueado: Boolean(fila.bloqueado),
        p_clave_maestra: fila.clave_maestra,
        p_nota_aprendizaje: fila.nota_aprendizaje,
      });
      if (error) throw error;
      setMensajeEstado(`Bóveda Familiar actualizada (${fila.nombre} • CI ${fila.cedula}).`);
      agregarEventoBitacora(
        "Bóveda Familiar",
        "Actualización",
        `CI ${fila.cedula} (${fila.nombre}) -> Nivel ${fila.nivel}, Tel: ${fila.telefono || "N/A"}.`
      );
      await cargarDatosSupabase(claveValidada, false);
    } catch (err: any) {
      const errMsg = err?.message || "error al actualizar";
      setMensajeEstado(`Error al actualizar Bóveda: ${errMsg}`);
      agregarEventoBitacora("Bóveda Familiar", "Error", errMsg);
    } finally {
      setCargando(false);
    }
  };

  const guardarIngTec = async (fila: FilaIngTec) => {
    if (!claveValidada || !fila.cedula.trim() || !fila.nombre.trim()) return;
    setCargando(true);
    try {
      const { error } = await supabase.rpc("guardar_usuario_ing_tec_segura", {
        p_clave: claveValidada,
        p_cedula: fila.cedula.trim(),
        p_nombre: fila.nombre.trim(),
        p_especialidad: fila.especialidad,
        p_cargo: fila.cargo.trim() || fila.especialidad,
        p_nivel: fila.nivel.trim() || "Nivel 6",
        p_clave_usuario: fila.clave.trim() || "clave2026",
        p_telefono: fila.telefono.trim(),
        p_tipo_usuario: fila.tipo_usuario,
        p_activo: Boolean(fila.activo),
      });
      if (error) throw error;
      setMensajeEstado(
        `Guardado en usuarios_ing_tec (${fila.cedula}) como "${fila.tipo_usuario}".`
      );
      agregarEventoBitacora(
        "Ing. y Técnicos",
        "Guardar / Upsert",
        `CI ${fila.cedula} (${fila.nombre}) • ${fila.especialidad} • Tipo: ${fila.tipo_usuario}.`
      );
      await cargarDatosSupabase(claveValidada, false);
    } catch (err: any) {
      const errMsg = err?.message || "error al guardar";
      setMensajeEstado(`Error al guardar Ing/Técnico: ${errMsg}`);
      agregarEventoBitacora("Ing. y Técnicos", "Error", errMsg);
    } finally {
      setCargando(false);
    }
  };

  const guardarLicencia = async (fila: FilaLicencia) => {
    if (!claveValidada || !fila.codigo_licencia.trim() || !fila.cedula_usuario.trim()) return;
    setCargando(true);
    try {
      const { error } = await supabase.rpc("guardar_usuario_licencia_segura", {
        p_clave: claveValidada,
        p_codigo_licencia: fila.codigo_licencia.trim(),
        p_cedula_usuario: fila.cedula_usuario.trim(),
        p_nombre_usuario: fila.nombre_usuario.trim(),
        p_rol_licencia: fila.rol_licencia.trim() || "usuario",
        p_estado_licencia: fila.estado_licencia,
        p_tipo_usuario: fila.tipo_usuario,
        p_max_estaciones: Number(fila.max_estaciones) || 2,
      });
      if (error) throw error;
      setMensajeEstado(`Licencia guardada (${fila.codigo_licencia}).`);
      agregarEventoBitacora(
        "Licencias",
        "Guardar / Upsert",
        `Licencia ${fila.codigo_licencia} • CI ${fila.cedula_usuario} • Estado: ${fila.estado_licencia} • Tipo: ${fila.tipo_usuario}.`
      );
      await cargarDatosSupabase(claveValidada, false);
    } catch (err: any) {
      const errMsg = err?.message || "error al guardar";
      setMensajeEstado(`Error al guardar licencia: ${errMsg}`);
      agregarEventoBitacora("Licencias", "Error", errMsg);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="bg-[#070d1a] border border-amber-500/30 rounded-2xl p-5 space-y-5 font-mono text-slate-100">
      {/* TÍTULO COMPLETO PARpadeante SUPERIOR */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-sm md:text-base font-extrabold tracking-wider text-amber-400 uppercase animate-pulse">
            ⚡ PORTAL DEL NÚCLEO FAMILIAR E IDENTIDADES — ÁREA DEL CREADOR ⚡
          </h1>
          <p className="text-[11px] text-slate-400 mt-1">
            AC08 • Creador Nivel 10 Exclusivo • Hijas Superusers (1–9) • Ing/Técnicos • Licencias • Bitácora
          </p>
        </div>

        {claveValidada && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={cargando}
              onClick={() => cargarDatosSupabase(claveValidada, true)}
              className="px-3 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase cursor-pointer"
            >
              Actualizar
            </button>
            <button
              type="button"
              onClick={handleBloquear}
              className="px-3 py-1.5 rounded bg-red-950 hover:bg-red-900 text-red-200 border border-red-500/40 font-bold text-xs uppercase cursor-pointer"
            >
              🔒 Bloquear
            </button>
          </div>
        )}
      </div>

      {!claveValidada ? (
        <form onSubmit={handleDesbloquear} className="max-w-md mx-auto py-6 space-y-3 text-xs">
          <label className="block text-amber-300 uppercase font-bold tracking-wider">
            Clave del Creador:
          </label>
          <input
            type="password"
            value={claveIngreso}
            onChange={(e) => setClaveIngreso(e.target.value)}
            placeholder="••••••••••••"
            required
            className="w-full bg-[#030712] border border-slate-700 rounded px-3 py-2 text-slate-100"
          />
          <button
            type="submit"
            className="w-full py-2.5 rounded bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold uppercase tracking-wider cursor-pointer"
          >
            🔓 Desbloquear Portal del Núcleo Familiar e Identidades
          </button>
        </form>
      ) : (
        <>
          {/* 4 PESTAÑAS: 3 TABLAS DE DATOS + BITÁCORA */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setPestanaActiva("boveda_familiar")}
              className={`py-2 px-3 rounded-lg font-bold uppercase border cursor-pointer ${
                pestanaActiva === "boveda_familiar"
                  ? "bg-amber-400 text-black border-amber-200"
                  : "bg-[#030712] text-slate-300 border-slate-800"
              }`}
            >
              1. Bóveda ({filasBoveda.length})
            </button>
            <button
              type="button"
              onClick={() => setPestanaActiva("usuarios_ing_tec")}
              className={`py-2 px-3 rounded-lg font-bold uppercase border cursor-pointer ${
                pestanaActiva === "usuarios_ing_tec"
                  ? "bg-cyan-400 text-black border-cyan-200"
                  : "bg-[#030712] text-slate-300 border-slate-800"
              }`}
            >
              2. Ing/Técnicos ({filasIngTec.length})
            </button>
            <button
              type="button"
              onClick={() => setPestanaActiva("usuarios_licencia")}
              className={`py-2 px-3 rounded-lg font-bold uppercase border cursor-pointer ${
                pestanaActiva === "usuarios_licencia"
                  ? "bg-emerald-400 text-black border-emerald-200"
                  : "bg-[#030712] text-slate-300 border-slate-800"
              }`}
            >
              3. Licencias ({filasLicencia.length})
            </button>
            <button
              type="button"
              onClick={() => setPestanaActiva("bitacora")}
              className={`py-2 px-3 rounded-lg font-bold uppercase border cursor-pointer ${
                pestanaActiva === "bitacora"
                  ? "bg-purple-400 text-black border-purple-200"
                  : "bg-[#030712] text-slate-300 border-slate-800"
              }`}
            >
              4. Bitácora ({bitacora.length})
            </button>
          </div>

          {/* PESTAÑA 1: BÓVEDA FAMILIAR */}
          {pestanaActiva === "boveda_familiar" && (
            <div className="space-y-3 text-xs">
              {filasBoveda.map((fila, idx) => (
                <div
                  key={fila.cedula || idx}
                  className="p-4 rounded-xl bg-[#030712] border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-amber-300">
                      {fila.nombre} — CI {fila.cedula} (Nivel {fila.nivel})
                    </span>
                    <button
                      type="button"
                      disabled={cargando}
                      onClick={() => guardarBoveda(fila)}
                      className="px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase text-[11px] cursor-pointer"
                    >
                      Guardar
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1">
                        Teléfono
                      </label>
                      <input
                        type="text"
                        value={fila.telefono || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFilasBoveda((prev) =>
                            prev.map((r, i) => (i === idx ? { ...r, telefono: val } : r))
                          );
                        }}
                        className="w-full bg-black/70 border border-slate-700 rounded px-2.5 py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1">
                        Nivel (10 Creador / 1–9 Superuser)
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        disabled={fila.cedula === "10433935"}
                        value={fila.nivel}
                        onChange={(e) => {
                          const val = Number(e.target.value) || 1;
                          setFilasBoveda((prev) =>
                            prev.map((r, i) => (i === idx ? { ...r, nivel: val } : r))
                          );
                        }}
                        className="w-full bg-black/70 border border-slate-700 rounded px-2.5 py-1.5 disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1">
                        Clave Maestra
                      </label>
                      <input
                        type="text"
                        value={fila.clave_maestra || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFilasBoveda((prev) =>
                            prev.map((r, i) => (i === idx ? { ...r, clave_maestra: val } : r))
                          );
                        }}
                        className="w-full bg-black/70 border border-slate-700 rounded px-2.5 py-1.5"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PESTAÑA 2: INGENIEROS Y TÉCNICOS */}
          {pestanaActiva === "usuarios_ing_tec" && (
            <div className="space-y-3 text-xs">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setFilasIngTec((prev) => [
                      ...prev,
                      {
                        cedula: "",
                        nombre: "",
                        especialidad: "Ingeniero en Sistemas",
                        cargo: "Ingeniero en Sistemas",
                        nivel: "Nivel 8",
                        clave: "",
                        telefono: "",
                        tipo_usuario: "real",
                        activo: true,
                      },
                    ])
                  }
                  className="px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase text-[11px] cursor-pointer"
                >
                  + Agregar Ing / Técnico
                </button>
              </div>

              {filasIngTec.map((fila, idx) => (
                <div
                  key={`${fila.cedula}-${idx}`}
                  className="p-4 rounded-xl bg-[#030712] border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-cyan-300">
                      {fila.especialidad} — {fila.tipo_usuario.toUpperCase()}
                    </span>
                    <button
                      type="button"
                      disabled={cargando}
                      onClick={() => guardarIngTec(fila)}
                      className="px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase text-[11px] cursor-pointer"
                    >
                      Guardar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1">
                        Cédula
                      </label>
                      <input
                        type="text"
                        value={fila.cedula}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFilasIngTec((prev) =>
                            prev.map((r, i) => (i === idx ? { ...r, cedula: val } : r))
                          );
                        }}
                        className="w-full bg-black/70 border border-slate-700 rounded px-2.5 py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={fila.nombre}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFilasIngTec((prev) =>
                            prev.map((r, i) => (i === idx ? { ...r, nombre: val } : r))
                          );
                        }}
                        className="w-full bg-black/70 border border-slate-700 rounded px-2.5 py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1">
                        Especialidad
                      </label>
                      <select
                        value={fila.especialidad}
                        onChange={(e) => {
                          const val = e.target.value as
                            | "Ingeniero en Sistemas"
                            | "Técnico en Informática";
                          setFilasIngTec((prev) =>
                            prev.map((r, i) =>
                              i === idx ? { ...r, especialidad: val, cargo: val } : r
                            )
                          );
                        }}
                        className="w-full bg-black/70 border border-slate-700 rounded px-2.5 py-1.5"
                      >
                        <option value="Ingeniero en Sistemas">Ingeniero en Sistemas</option>
                        <option value="Técnico en Informática">Técnico en Informática</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1">
                        Tipo de Usuario
                      </label>
                      <select
                        value={fila.tipo_usuario}
                        onChange={(e) => {
                          const val = e.target.value as "prueba" | "real";
                          setFilasIngTec((prev) =>
                            prev.map((r, i) => (i === idx ? { ...r, tipo_usuario: val } : r))
                          );
                        }}
                        className="w-full bg-black/70 border border-slate-700 rounded px-2.5 py-1.5 text-amber-300 font-bold"
                      >
                        <option value="prueba">prueba</option>
                        <option value="real">real</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1">
                        Teléfono
                      </label>
                      <input
                        type="text"
                        value={fila.telefono || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFilasIngTec((prev) =>
                            prev.map((r, i) => (i === idx ? { ...r, telefono: val } : r))
                          );
                        }}
                        className="w-full bg-black/70 border border-slate-700 rounded px-2.5 py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1">
                        Clave
                      </label>
                      <input
                        type="text"
                        value={fila.clave || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFilasIngTec((prev) =>
                            prev.map((r, i) => (i === idx ? { ...r, clave: val } : r))
                          );
                        }}
                        className="w-full bg-black/70 border border-slate-700 rounded px-2.5 py-1.5"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PESTAÑA 3: LICENCIAS */}
          {pestanaActiva === "usuarios_licencia" && (
            <div className="space-y-3 text-xs">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setFilasLicencia((prev) => [
                      ...prev,
                      {
                        codigo_licencia: "",
                        cedula_usuario: "",
                        nombre_usuario: "",
                        rol_licencia: "usuario",
                        estado_licencia: "activa",
                        tipo_usuario: "real",
                        max_estaciones: 2,
                      },
                    ])
                  }
                  className="px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase text-[11px] cursor-pointer"
                >
                  + Agregar Licencia
                </button>
              </div>

              {filasLicencia.map((fila, idx) => (
                <div
                  key={`${fila.codigo_licencia}-${idx}`}
                  className="p-4 rounded-xl bg-[#030712] border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-emerald-300">
                      {fila.codigo_licencia || "Nueva Licencia"} — {fila.tipo_usuario.toUpperCase()}
                    </span>
                    <button
                      type="button"
                      disabled={cargando}
                      onClick={() => guardarLicencia(fila)}
                      className="px-3 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase text-[11px] cursor-pointer"
                    >
                      Guardar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1">
                        Código Licencia
                      </label>
                      <input
                        type="text"
                        value={fila.codigo_licencia}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFilasLicencia((prev) =>
                            prev.map((r, i) => (i === idx ? { ...r, codigo_licencia: val } : r))
                          );
                        }}
                        className="w-full bg-black/70 border border-slate-700 rounded px-2.5 py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1">
                        Cédula Usuario
                      </label>
                      <input
                        type="text"
                        value={fila.cedula_usuario}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFilasLicencia((prev) =>
                            prev.map((r, i) => (i === idx ? { ...r, cedula_usuario: val } : r))
                          );
                        }}
                        className="w-full bg-black/70 border border-slate-700 rounded px-2.5 py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1">
                        Nombre Usuario
                      </label>
                      <input
                        type="text"
                        value={fila.nombre_usuario}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFilasLicencia((prev) =>
                            prev.map((r, i) => (i === idx ? { ...r, nombre_usuario: val } : r))
                          );
                        }}
                        className="w-full bg-black/70 border border-slate-700 rounded px-2.5 py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1">
                        Tipo de Usuario
                      </label>
                      <select
                        value={fila.tipo_usuario}
                        onChange={(e) => {
                          const val = e.target.value as "prueba" | "real";
                          setFilasLicencia((prev) =>
                            prev.map((r, i) => (i === idx ? { ...r, tipo_usuario: val } : r))
                          );
                        }}
                        className="w-full bg-black/70 border border-slate-700 rounded px-2.5 py-1.5 text-amber-300 font-bold"
                      >
                        <option value="prueba">prueba</option>
                        <option value="real">real</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1">
                        Estado Licencia
                      </label>
                      <select
                        value={fila.estado_licencia}
                        onChange={(e) => {
                          const val = e.target.value as "activa" | "suspendida" | "vencida";
                          setFilasLicencia((prev) =>
                            prev.map((r, i) => (i === idx ? { ...r, estado_licencia: val } : r))
                          );
                        }}
                        className="w-full bg-black/70 border border-slate-700 rounded px-2.5 py-1.5"
                      >
                        <option value="activa">activa</option>
                        <option value="suspendida">suspendida</option>
                        <option value="vencida">vencida</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1">
                        Máx. Estaciones
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={fila.max_estaciones}
                        onChange={(e) => {
                          const val = Number(e.target.value) || 2;
                          setFilasLicencia((prev) =>
                            prev.map((r, i) => (i === idx ? { ...r, max_estaciones: val } : r))
                          );
                        }}
                        className="w-full bg-black/70 border border-slate-700 rounded px-2.5 py-1.5"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PESTAÑA 4: BITÁCORA DEL PORTAL AC08 */}
          {pestanaActiva === "bitacora" && (
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-purple-300 uppercase">
                  Bitácora de Movimientos — Portal del Núcleo Familiar e Identidades
                </span>
                {bitacora.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setBitacora([])}
                    className="px-3 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[11px] uppercase cursor-pointer"
                  >
                    Limpiar Bitácora
                  </button>
                )}
              </div>

              {bitacora.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#030712] border border-slate-800 text-slate-400 text-center">
                  Aún no hay eventos registrados en esta sesión de bitácora.
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {bitacora.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-3 rounded-lg bg-[#030712] border border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400">{ev.fechaHora}</span>
                          <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30 text-[10px] font-bold uppercase">
                            {ev.pestana}
                          </span>
                          <span className="text-[11px] font-bold text-amber-300">
                            {ev.accion}
                          </span>
                        </div>
                        <p className="text-slate-200 text-[11px]">{ev.detalle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      <div className="p-2.5 rounded text-[11px] font-semibold text-center border bg-[#030712] border-slate-800 text-slate-300">
        {mensajeEstado}
      </div>
    </div>
  );
}