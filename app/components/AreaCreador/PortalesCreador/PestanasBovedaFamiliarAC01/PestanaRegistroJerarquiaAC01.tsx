"use client";

import React, { useMemo, useState } from "react";
import { DESCRIPCION_NIVELES, PerfilFamiliar } from "../BovedaFamiliarTipos";

export interface PestanaRegistroJerarquiaAC01Props {
  perfiles: PerfilFamiliar[];
  cargando: boolean;
  nombre: string;
  setNombre: React.Dispatch<React.SetStateAction<string>>;
  cedula: string;
  setCedula: React.Dispatch<React.SetStateAction<string>>;
  claveMaestra: string;
  setClaveMaestra: React.Dispatch<React.SetStateAction<string>>;
  nivel: number;
  setNivel: React.Dispatch<React.SetStateAction<number>>;
  notaAprendizaje: string;
  setNotaAprendizaje: React.Dispatch<React.SetStateAction<string>>;
  onRegistrar: (e: React.FormEvent) => void | Promise<void>;
  onCambiarNivel: (cedulaObjetivo: string, nuevoNivel: number) => void | Promise<void>;
  onAbrirBitacora: (cedulaObjetivo: string) => void;
  onToggleBloqueo: (cedulaObjetivo: string) => void | Promise<void>;
  onEliminarPerfil?: (cedulaObjetivo: string) => void | Promise<void>;
  clavesAutorizadas?: string[];
}

const CLAVES_POR_DEFECTO = ["SYNAPSE10", "SYNAPSE2026", "ALEX2026", "BOVEDA-MASTER"];

type ModoBusqueda = "todos" | "nombre" | "cedula";

function normalizarTexto(valor: string): string {
  return String(valor || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function esPerfilNucleoPermitido(perfil: PerfilFamiliar): boolean {
  const ced = String(perfil.cedula || "").trim();
  const nom = normalizarTexto(perfil.nombre || "");

  // 1. Creador principal (nunca se elimina)
  if (
    ced === "10433935" ||
    perfil.nivel === 10 ||
    nom.includes("alexander segundo castellanos")
  ) {
    return true;
  }

  // 2. Aleanny Castellanos
  if (ced === "279276795" || nom.includes("aleanny")) {
    return true;
  }

  // 3. Albany Castellanos
  if (ced === "33323644" || nom.includes("albany")) {
    return true;
  }

  // Excluye "Hija Uno", registros de prueba o duplicados como "Alexander Castellano" a secas
  if (nom.includes("hija uno") || perfil.tipo_usuario === "prueba") {
    return false;
  }

  return false;
}

export default function PestanaRegistroJerarquiaAC01({
  perfiles,
  cargando,
  nombre,
  setNombre,
  cedula,
  setCedula,
  claveMaestra,
  setClaveMaestra,
  nivel,
  setNivel,
  notaAprendizaje,
  setNotaAprendizaje,
  onRegistrar,
  onCambiarNivel,
  onAbrirBitacora,
  onToggleBloqueo,
  onEliminarPerfil,
  clavesAutorizadas = CLAVES_POR_DEFECTO,
}: PestanaRegistroJerarquiaAC01Props) {
  const [seleccionados, setSeleccionados] = useState<Record<string, boolean>>({});
  const [candadosAbiertos, setCandadosAbiertos] = useState<Record<string, boolean>>({});
  const [eliminadosLocales, setEliminadosLocales] = useState<Record<string, boolean>>({});

  // Estado del buscador de usuarios por nombre o cédula
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [modoBusqueda, setModoBusqueda] = useState<ModoBusqueda>("todos");

  const [modalClave, setModalClave] = useState<{
    cedulaObjetivo: string;
    accion: "estado" | "eliminar";
  } | null>(null);
  const [claveIngresada, setClaveIngresada] = useState("");
  const [errorClave, setErrorClave] = useState("");
  const [avisoSeguridad, setAvisoSeguridad] = useState<string | null>(null);

  const esPerfilCreadorProtegido = (perfil: PerfilFamiliar): boolean => {
    const ced = String(perfil.cedula || "").trim();
    const nom = normalizarTexto(perfil.nombre || "");
    return (
      ced === "10433935" ||
      perfil.nivel === 10 ||
      nom.includes("alexander segundo castellanos")
    );
  };

  const perfilesNucleo = useMemo(() => {
    const base = perfiles.filter(
      (p) => esPerfilNucleoPermitido(p) && !eliminadosLocales[p.cedula]
    );

    const tieneCreador = base.some((p) => esPerfilCreadorProtegido(p));
    if (!tieneCreador) {
      base.unshift({
        nombre: "Alexander Segundo Castellanos Perozo",
        cedula: "10433935",
        claveMaestra: "",
        nivel: 10,
        rol: "Creador / Superuser",
        bloqueado: false,
        notaAprendizaje: "Autoridad máxima exclusiva del sistema operativo (Nivel 10).",
      });
    }

    return base.sort((a, b) => b.nivel - a.nivel);
  }, [perfiles, eliminadosLocales]);

  const perfilesFiltrados = useMemo(() => {
    const consulta = normalizarTexto(terminoBusqueda);
    if (!consulta) return perfilesNucleo;

    return perfilesNucleo.filter((p) => {
      const coincideNombre = normalizarTexto(p.nombre).includes(consulta);
      const coincideCedula = normalizarTexto(p.cedula).includes(consulta);

      if (modoBusqueda === "nombre") return coincideNombre;
      if (modoBusqueda === "cedula") return coincideCedula;
      return coincideNombre || coincideCedula;
    });
  }, [perfilesNucleo, terminoBusqueda, modoBusqueda]);

  const clavesValidas = useMemo(() => {
    const clavesDePerfiles = perfiles
      .map((p) => p.claveMaestra)
      .filter((c): c is string => Boolean(c && c.trim()));
    return Array.from(new Set([...clavesAutorizadas, ...clavesDePerfiles]));
  }, [clavesAutorizadas, perfiles]);

  const toggleSeleccion = (ced: string) => {
    setSeleccionados((prev) => ({ ...prev, [ced]: !prev[ced] }));
  };

  const abrirCandado = (cedulaObjetivo: string, accion: "estado" | "eliminar") => {
    const key = `${cedulaObjetivo}:${accion}`;
    if (candadosAbiertos[key]) {
      setCandadosAbiertos((prev) => ({ ...prev, [key]: false }));
      return;
    }
    setAvisoSeguridad(null);
    setErrorClave("");
    setClaveIngresada("");
    setModalClave({ cedulaObjetivo, accion });
  };

  const confirmarClave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalClave) return;

    const valida = clavesValidas.some(
      (c) => c.trim().toUpperCase() === claveIngresada.trim().toUpperCase()
    );

    if (!valida) {
      setErrorClave("Clave no autorizada. Verifica e intenta de nuevo.");
      return;
    }

    const key = `${modalClave.cedulaObjetivo}:${modalClave.accion}`;
    setCandadosAbiertos((prev) => ({ ...prev, [key]: true }));
    setModalClave(null);
    setClaveIngresada("");
    setErrorClave("");
  };

  const manejarClickBloqueo = async (perfil: PerfilFamiliar) => {
    if (!candadosAbiertos[`${perfil.cedula}:estado`]) return;

    if (esPerfilCreadorProtegido(perfil)) {
      setAvisoSeguridad(
        "PROTECCIÓN DE CREADOR: El perfil del Creador (Nivel 10) no puede bloquearse."
      );
      return;
    }

    setAvisoSeguridad(null);
    await onToggleBloqueo(perfil.cedula);
  };

  const manejarClickEliminar = async (perfil: PerfilFamiliar) => {
    if (!candadosAbiertos[`${perfil.cedula}:eliminar`]) return;

    if (esPerfilCreadorProtegido(perfil)) {
      setAvisoSeguridad(
        "PROTECCIÓN DE CREADOR: Tu usuario principal (Alexander Segundo Castellanos Perozo) está blindado y no puede eliminarse."
      );
      return;
    }

    setAvisoSeguridad(null);
    if (onEliminarPerfil) {
      await onEliminarPerfil(perfil.cedula);
    }
    setEliminadosLocales((prev) => ({ ...prev, [perfil.cedula]: true }));
    setCandadosAbiertos((prev) => {
      const copia = { ...prev };
      delete copia[`${perfil.cedula}:estado`];
      delete copia[`${perfil.cedula}:eliminar`];
      return copia;
    });
  };

  return (
    <div className="space-y-5 text-xs">
      {/* FORMULARIO DE REGISTRO EN BÓVEDA FAMILIAR */}
      <form
        onSubmit={onRegistrar}
        className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3"
      >
        <div className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold">
          Registrar Integrante en Bóveda Familiar (Niveles 1 al 9)
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre completo"
            className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-100"
          />

          <input
            type="text"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            placeholder="Cédula (solo números)"
            className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-100"
          />

          <input
            type="password"
            value={claveMaestra}
            onChange={(e) => setClaveMaestra(e.target.value)}
            placeholder="Clave maestra asignada"
            className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-100"
          />

          <select
            value={nivel}
            onChange={(e) => setNivel(Number(e.target.value))}
            aria-label="Nivel asignado"
            className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-100"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => (
              <option key={lvl} value={lvl}>
                {DESCRIPCION_NIVELES[lvl]?.titulo || `Nivel ${lvl}`}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col md:flex-row gap-2.5">
          <input
            type="text"
            value={notaAprendizaje}
            onChange={(e) => setNotaAprendizaje(e.target.value)}
            placeholder="Nota de etapa / supervisión inicial (opcional)"
            className="flex-1 px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-100"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold uppercase tracking-wider cursor-pointer shrink-0"
          >
            + Registrar Integrante
          </button>
        </div>
      </form>

      {/* BUSCADOR DE USUARIO POR NOMBRE O CÉDULA */}
      <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] uppercase tracking-wider text-cyan-300 font-bold">
            Buscar Usuario (Nombre o Cédula)
          </span>
          <span className="text-[10px] text-slate-400">
            Mostrando {perfilesFiltrados.length} de {perfilesNucleo.length}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={modoBusqueda}
            onChange={(e) => setModoBusqueda(e.target.value as ModoBusqueda)}
            aria-label="Criterio de búsqueda"
            className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-100 sm:w-44"
          >
            <option value="todos">Nombre o Cédula</option>
            <option value="nombre">Solo por Nombre</option>
            <option value="cedula">Solo por Cédula</option>
          </select>

          <input
            type="text"
            value={terminoBusqueda}
            onChange={(e) => setTerminoBusqueda(e.target.value)}
            placeholder={
              modoBusqueda === "cedula"
                ? "Buscar por número de cédula..."
                : modoBusqueda === "nombre"
                ? "Buscar por nombre..."
                : "Buscar por nombre o número de cédula..."
            }
            className="flex-1 px-3 py-2 rounded-lg border border-slate-700 bg-slate-950 text-slate-100"
          />

          {terminoBusqueda && (
            <button
              type="button"
              onClick={() => setTerminoBusqueda("")}
              className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer shrink-0"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {avisoSeguridad && (
        <div className="p-3 rounded-xl border border-amber-500/50 bg-amber-950/50 text-amber-300 font-semibold">
          {avisoSeguridad}
        </div>
      )}

      {/* CONTROL DE ACCESOS Y CANDADOS DE SEGURIDAD */}
      <div className="space-y-2">
        <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
          Control de Accesos y Candados de Seguridad
        </div>

        {cargando && perfiles.length === 0 ? (
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 text-slate-400">
            Cargando registros de bóveda...
          </div>
        ) : perfilesFiltrados.length === 0 ? (
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 text-slate-400">
            No se encontraron usuarios que coincidan con “{terminoBusqueda}”.
          </div>
        ) : (
          <div className="space-y-2">
            {perfilesFiltrados.map((p) => {
              const estadoDesbloqueado = Boolean(candadosAbiertos[`${p.cedula}:estado`]);
              const eliminarDesbloqueado = Boolean(candadosAbiertos[`${p.cedula}:eliminar`]);
              const esActivo = !p.bloqueado;

              return (
                <div
                  key={p.cedula}
                  className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl border border-slate-800 bg-slate-900/70"
                >
                  <label className="flex items-center gap-2.5 cursor-pointer min-w-0">
                    <input
                      type="checkbox"
                      checked={Boolean(seleccionados[p.cedula])}
                      onChange={() => toggleSeleccion(p.cedula)}
                      className="w-3.5 h-3.5 cursor-pointer"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-slate-100 truncate">
                        {p.nombre}{" "}
                        <span className="text-[10px] text-amber-400 font-normal">
                          (Nivel {p.nivel})
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        CI: {p.cedula} · {p.rol}
                      </div>
                    </div>
                  </label>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {p.nivel !== 10 && (
                      <select
                        value={p.nivel}
                        onChange={(e) => onCambiarNivel(p.cedula, Number(e.target.value))}
                        aria-label={`Nivel de ${p.nombre}`}
                        className="px-2 py-1 rounded border border-slate-700 bg-slate-950 text-[11px] text-slate-200 cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => (
                          <option key={lvl} value={lvl}>
                            Nivel {lvl}
                          </option>
                        ))}
                      </select>
                    )}

                    <button
                      type="button"
                      onClick={() => onAbrirBitacora(p.cedula)}
                      className="px-2.5 py-1 rounded border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 text-[10px] font-bold cursor-pointer"
                    >
                      Bitácora
                    </button>

                    {/* 1. BOTÓN BLOQUEAR / ACTIVAR + SU CANDADITO */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={!estadoDesbloqueado}
                        onClick={() => manejarClickBloqueo(p)}
                        title={
                          estadoDesbloqueado
                            ? esActivo
                              ? "Bloquear usuario"
                              : "Activar usuario"
                            : "Abre el candadito con tu clave para cambiar estado"
                        }
                        className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${
                          esActivo ? "bg-emerald-500 text-slate-950" : "bg-rose-600 text-white"
                        } ${
                          estadoDesbloqueado
                            ? "cursor-pointer opacity-100"
                            : "opacity-50 cursor-not-allowed"
                        }`}
                      >
                        {esActivo ? "Activo" : "Bloqueado"}
                      </button>
                      <button
                        type="button"
                        onClick={() => abrirCandado(p.cedula, "estado")}
                        title={
                          estadoDesbloqueado
                            ? "Cerrar candado de estado"
                            : "Desbloquear candado de estado con clave"
                        }
                        className="px-1.5 py-1 rounded border border-slate-700 bg-slate-800 hover:bg-slate-700 cursor-pointer text-[11px]"
                      >
                        {estadoDesbloqueado ? "🔓" : "🔒"}
                      </button>
                    </div>

                    {/* 2. BOTÓN ELIMINAR (A LA DERECHA DE BLOQUEAR/ACTIVAR) + SU CANDADITO */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={!eliminarDesbloqueado}
                        onClick={() => manejarClickEliminar(p)}
                        title={
                          eliminarDesbloqueado
                            ? "Eliminar usuario"
                            : "Abre el candadito con tu clave para eliminar"
                        }
                        className={`px-2 py-1 rounded text-[10px] font-bold bg-red-600 text-white ${
                          eliminarDesbloqueado
                            ? "hover:bg-red-500 cursor-pointer opacity-100"
                            : "opacity-50 cursor-not-allowed"
                        }`}
                      >
                        Eliminar
                      </button>
                      <button
                        type="button"
                        onClick={() => abrirCandado(p.cedula, "eliminar")}
                        title={
                          eliminarDesbloqueado
                            ? "Cerrar candado de eliminación"
                            : "Desbloquear candado de eliminación con clave"
                        }
                        className="px-1.5 py-1 rounded border border-slate-700 bg-slate-800 hover:bg-slate-700 cursor-pointer text-[11px]"
                      >
                        {eliminarDesbloqueado ? "🔓" : "🔒"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* JERARQUÍA ACTIVA EN BÓVEDA FAMILIAR */}
      <div className="pt-2 border-t border-slate-800 space-y-1.5">
        <div className="text-[11px] text-slate-400">
          Jerarquía activa en bóveda familiar (Nivel)
        </div>
        <div className="divide-y divide-slate-800/70 rounded-xl border border-slate-800 bg-slate-900/40">
          {perfilesNucleo.map((p) => (
            <div key={p.cedula} className="flex items-center justify-between px-3 py-2">
              <span className="truncate">{p.nombre}</span>
              <span className="px-2.5 py-0.5 rounded bg-slate-800 text-amber-400 font-bold">
                {p.nivel}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL DE CLAVE PARA ABRIR CANDADO */}
      {modalClave && (
        <form
          onSubmit={confirmarClave}
          className="p-3 rounded-xl border border-amber-500/40 bg-slate-900 space-y-2"
        >
          <div className="text-amber-300">
            Ingresa una clave autorizada para abrir el candadito de{" "}
            {modalClave.accion === "eliminar" ? "Eliminar" : "Activar / Bloquear"}:
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              value={claveIngresada}
              onChange={(e) => setClaveIngresada(e.target.value)}
              placeholder="Clave registrada"
              autoFocus
              className="flex-1 px-2.5 py-1.5 rounded border border-slate-700 bg-slate-950 text-slate-100"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded bg-emerald-500 text-slate-950 font-bold cursor-pointer"
            >
              Liberar
            </button>
            <button
              type="button"
              onClick={() => {
                setModalClave(null);
                setErrorClave("");
              }}
              className="px-2.5 py-1.5 rounded bg-slate-800 text-slate-300 cursor-pointer"
            >
              Cancelar
            </button>
          </div>
          {errorClave && <div className="text-rose-400 text-[11px]">{errorClave}</div>}
        </form>
      )}
    </div>
  );
}