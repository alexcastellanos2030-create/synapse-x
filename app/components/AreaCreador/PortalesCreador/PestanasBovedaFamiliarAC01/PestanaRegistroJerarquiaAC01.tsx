"use client";

import React, { useMemo, useState } from "react";

export type EstadoUsuarioBoveda = "activo" | "bloqueado";

export interface UsuarioBoveda {
  id: string;
  nombre: string;
  nivel: number; // 1 al 10 (10 reservado para el Creador)
  estado: EstadoUsuarioBoveda;
}

interface BovedaRegistroJerarquiaProps {
  usuariosIniciales?: UsuarioBoveda[];
  clavesAutorizadas?: string[];
  onChangeUsuarios?: (usuarios: UsuarioBoveda[]) => void;
}

const DESCRIPCIONES_NIVEL: Record<number, string> = {
  1: "Nivel 1 — Solo ver (inicio y observación básica)",
  2: "Nivel 2 — Consulta ampliada de registros",
  3: "Nivel 3 — Apoyo operativo inicial",
  4: "Nivel 4 — Registro de datos básicos",
  5: "Nivel 5 — Gestión operativa intermedia",
  6: "Nivel 6 — Supervisión de procesos asignados",
  7: "Nivel 7 — Coordinación avanzada de área",
  8: "Nivel 8 — Control superior de bóveda",
  9: "Nivel 9 — Máximo nivel asignable en registro",
  10: "Nivel 10 — Nivel exclusivo del Creador",
};

const CLAVES_POR_DEFECTO = ["SYNAPSE10", "ALEX2026", "BOVEDA-MASTER"];

export default function BovedaRegistroJerarquia({
  usuariosIniciales,
  clavesAutorizadas = CLAVES_POR_DEFECTO,
  onChangeUsuarios,
}: BovedaRegistroJerarquiaProps) {
  const [usuarios, setUsuarios] = useState<UsuarioBoveda[]>(
    usuariosIniciales ?? [
      { id: "usr-1", nombre: "Alexander II Castellano Peroso", nivel: 10, estado: "activo" },
      { id: "usr-2", nombre: "Alexander Castellano", nivel: 2, estado: "activo" },
      { id: "usr-3", nombre: "Hija Uno", nivel: 5, estado: "activo" },
    ]
  );

  // Estado para registro de nuevo usuario (niveles 1 a 9 disponibles en el selector)
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nivelInicial, setNivelInicial] = useState<number>(1);

  // Casillas de selección (checklist) por usuario
  const [seleccionados, setSeleccionados] = useState<Record<string, boolean>>({});

  // Candados independientes por usuario y acción ("estado" = activar/bloquear, "eliminar" = borrar)
  const [candadosAbiertos, setCandadosAbiertos] = useState<Record<string, boolean>>({});
  const [modalClave, setModalClave] = useState<{
    usuarioId: string;
    accion: "estado" | "eliminar";
  } | null>(null);
  const [claveIngresada, setClaveIngresada] = useState("");
  const [errorClave, setErrorClave] = useState("");

  const actualizarLista = (siguiente: UsuarioBoveda[]) => {
    setUsuarios(siguiente);
    onChangeUsuarios?.(siguiente);
  };

  const toggleSeleccion = (id: string) => {
    setSeleccionados((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const abrirCandado = (usuarioId: string, accion: "estado" | "eliminar") => {
    const key = `${usuarioId}:${accion}`;
    if (candadosAbiertos[key]) {
      setCandadosAbiertos((prev) => ({ ...prev, [key]: false }));
      return;
    }
    setErrorClave("");
    setClaveIngresada("");
    setModalClave({ usuarioId, accion });
  };

  const confirmarClave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalClave) return;
    const valida = clavesAutorizadas.some(
      (c) => c.trim().toUpperCase() === claveIngresada.trim().toUpperCase()
    );
    if (!valida) {
      setErrorClave("Clave no autorizada. Verifica e intenta de nuevo.");
      return;
    }
    const key = `${modalClave.usuarioId}:${modalClave.accion}`;
    setCandadosAbiertos((prev) => ({ ...prev, [key]: true }));
    setModalClave(null);
    setClaveIngresada("");
    setErrorClave("");
  };

  const alternarEstadoUsuario = (id: string) => {
    const key = `${id}:estado`;
    if (!candadosAbiertos[key]) return;
    actualizarLista(
      usuarios.map((u) =>
        u.id === id ? { ...u, estado: u.estado === "activo" ? "bloqueado" : "activo" } : u
      )
    );
  };

  const eliminarUsuario = (id: string) => {
    const key = `${id}:eliminar`;
    if (!candadosAbiertos[key]) return;
    actualizarLista(usuarios.filter((u) => u.id !== id));
    setSeleccionados((prev) => {
      const copia = { ...prev };
      delete copia[id];
      return copia;
    });
  };

  const agregarUsuario = (e: React.FormEvent) => {
    e.preventDefault();
    const limpio = nuevoNombre.trim();
    if (!limpio) return;
    const nivelSeguro = Math.min(9, Math.max(1, nivelInicial));
    const nuevo: UsuarioBoveda = {
      id: `usr-${Date.now()}`,
      nombre: limpio,
      nivel: nivelSeguro,
      estado: "activo",
    };
    actualizarLista([...usuarios, nuevo]);
    setNuevoNombre("");
  };

  const usuariosOrdenados = useMemo(
    () => [...usuarios].sort((a, b) => b.nivel - a.nivel),
    [usuarios]
  );

  return (
    <div className="space-y-4 p-3 rounded border border-slate-800 bg-slate-950/80 text-xs">
      {/* Formulario de Registro */}
      <form onSubmit={agregarUsuario} className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <input
          type="text"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          placeholder="Nombre del usuario a registrar"
          className="px-2.5 py-1.5 rounded border border-slate-700 bg-slate-900 text-slate-100"
        />

        <select
          value={nivelInicial}
          onChange={(e) => setNivelInicial(Number(e.target.value))}
          aria-label="Nivel inicial"
          className="px-2.5 py-1.5 rounded border border-slate-700 bg-slate-900 text-slate-100"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => (
            <option key={lvl} value={lvl}>
              {DESCRIPCIONES_NIVEL[lvl]}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="px-3 py-1.5 rounded bg-amber-500 text-slate-950 hover:bg-amber-400 cursor-pointer"
        >
          Agregar Usuario
        </button>
      </form>

      {/* Gestión de usuarios con checklist y microbotones con candadito */}
      <div className="space-y-1.5">
        {usuarios.map((u) => {
          const estadoDesbloqueado = Boolean(candadosAbiertos[`${u.id}:estado`]);
          const eliminarDesbloqueado = Boolean(candadosAbiertos[`${u.id}:eliminar`]);
          const esActivo = u.estado === "activo";

          return (
            <div
              key={u.id}
              className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded border border-slate-800 bg-slate-900/70"
            >
              <label className="flex items-center gap-2 cursor-pointer min-w-0">
                <input
                  type="checkbox"
                  checked={Boolean(seleccionados[u.id])}
                  onChange={() => toggleSeleccion(u.id)}
                  className="w-3.5 h-3.5 cursor-pointer"
                />
                <span className="truncate">{u.nombre}</span>
              </label>

              <div className="flex items-center gap-2 shrink-0">
                {/* Microbotón Activar / Bloquear (verde/rojo) + su candadito */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={!estadoDesbloqueado}
                    onClick={() => alternarEstadoUsuario(u.id)}
                    title={
                      estadoDesbloqueado
                        ? esActivo
                          ? "Bloquear usuario"
                          : "Activar usuario"
                        : "Abre el candadito con tu clave para cambiar estado"
                    }
                    className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                      esActivo ? "bg-emerald-500 text-slate-950" : "bg-rose-600 text-white"
                    } ${estadoDesbloqueado ? "cursor-pointer opacity-100" : "opacity-50 cursor-not-allowed"}`}
                  >
                    {esActivo ? "Activo" : "Bloqueado"}
                  </button>
                  <button
                    type="button"
                    onClick={() => abrirCandado(u.id, "estado")}
                    title={
                      estadoDesbloqueado
                        ? "Cerrar candado de estado"
                        : "Desbloquear candado de estado con clave"
                    }
                    aria-label="Candado de activar o bloquear"
                    className="px-1.5 py-0.5 rounded border border-slate-700 bg-slate-800 hover:bg-slate-700 cursor-pointer text-[11px]"
                  >
                    {estadoDesbloqueado ? "🔓" : "🔒"}
                  </button>
                </div>

                {/* Microbotón Eliminar + su candadito */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={!eliminarDesbloqueado}
                    onClick={() => eliminarUsuario(u.id)}
                    title={
                      eliminarDesbloqueado
                        ? "Eliminar usuario"
                        : "Abre el candadito con tu clave para eliminar"
                    }
                    className={`px-2 py-0.5 rounded text-[10px] bg-red-600 text-white ${
                      eliminarDesbloqueado
                        ? "hover:bg-red-500 cursor-pointer opacity-100"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                  >
                    Eliminar
                  </button>
                  <button
                    type="button"
                    onClick={() => abrirCandado(u.id, "eliminar")}
                    title={
                      eliminarDesbloqueado
                        ? "Cerrar candado de eliminación"
                        : "Desbloquear candado de eliminación con clave"
                    }
                    aria-label="Candado de eliminar"
                    className="px-1.5 py-0.5 rounded border border-slate-700 bg-slate-800 hover:bg-slate-700 cursor-pointer text-[11px]"
                  >
                    {eliminarDesbloqueado ? "🔓" : "🔒"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lista de Jerarquía Activa en Bóveda Familiar: solo muestra el número de nivel */}
      <div className="pt-2 border-t border-slate-800 space-y-1">
        <div className="text-[11px] text-slate-400">
          Jerarquía activa en bóveda familiar (Nivel)
        </div>
        <div className="divide-y divide-slate-800/70 rounded border border-slate-800 bg-slate-900/40">
          {usuariosOrdenados.map((u) => (
            <div key={u.id} className="flex items-center justify-between px-2.5 py-1.5">
              <span className="truncate">{u.nombre}</span>
              <span className="num px-2 py-0.5 rounded bg-slate-800 text-amber-400">
                {u.nivel}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal / panel de clave para abrir el candadito */}
      {modalClave && (
        <form
          onSubmit={confirmarClave}
          className="p-3 rounded border border-amber-500/40 bg-slate-900 space-y-2"
        >
          <div className="text-amber-300">
            Ingresa una de tus claves registradas para abrir el candadito de{" "}
            {modalClave.accion === "eliminar" ? "Eliminar" : "Activar / Bloquear"}:
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              value={claveIngresada}
              onChange={(e) => setClaveIngresada(e.target.value)}
              placeholder="Clave registrada"
              autoFocus
              className="flex-1 px-2.5 py-1 rounded border border-slate-700 bg-slate-950 text-slate-100"
            />
            <button
              type="submit"
              className="px-3 py-1 rounded bg-emerald-500 text-slate-950 cursor-pointer"
            >
              Liberar
            </button>
            <button
              type="button"
              onClick={() => {
                setModalClave(null);
                setErrorClave("");
              }}
              className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 cursor-pointer"
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