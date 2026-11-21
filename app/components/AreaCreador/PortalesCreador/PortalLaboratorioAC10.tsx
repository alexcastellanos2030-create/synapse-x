"use client";

import React, { useState, useCallback } from "react";
import PestanaEnlaceRemotoAC10 from "./PestanasLaboratorioAC10/PestanaEnlaceRemotoAC10";
import PestanaSensoresMaquinariaAC10 from "./PestanasLaboratorioAC10/PestanaSensoresMaquinariaAC10";
import {
  EventoAC10,
  NodoMaquinaSensor,
  PestanaAC10,
  SesionEnlaceRemoto,
} from "./PestanasLaboratorioAC10/TiposLaboratorioAC10";

const NODOS_INICIALES: NodoMaquinaSensor[] = [
  {
    id: "n-1",
    equipo: "Batidora Espiral Principal",
    canalConexion: "WiFi Digital",
    temperaturaC: "24.5°C",
    estadoSensor: "Operativo",
    nota: "Torque estable en 1ª y 2ª velocidad.",
  },
  {
    id: "n-2",
    equipo: "Sobadora / Divisora / Conik",
    canalConexion: "Red Industrial",
    temperaturaC: "22.0°C",
    estadoSensor: "Operativo",
    nota: "Sincronización de porciones y boleado activa.",
  },
  {
    id: "n-3",
    equipo: "Horno / Fermentadora",
    canalConexion: "WiFi Digital",
    temperaturaC: "215°C",
    estadoSensor: "Operativo",
    nota: "Sonda térmica y humedad en rango.",
  },
  {
    id: "n-4",
    equipo: "Simulación SO / Servicio",
    canalConexion: "Simulación SO",
    temperaturaC: "N/A",
    estadoSensor: "Operativo",
    nota: "Entorno de pruebas del Creador sin restricciones.",
  },
];

export default function PortalLaboratorioAC10() {
  const hoyIso = new Date().toISOString().slice(0, 10);
  const mananaIso = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const [pestana, setPestana] = useState<PestanaAC10>("enlace");
  const [modoSupremoSinLimites, setModoSupremoSinLimites] = useState(true);

  const [sesion, setSesion] = useState<SesionEnlaceRemoto>({
    idClientePais: "",
    codigoGenerado: "SYN-REM-0000",
    codigoPortalCliente: "",
    parcheAutorizadoPorCliente: false,
    enlaceActivoConCreador: false,
    fechaRecopilacion: hoyIso,
    fechaVigenciaProgramada: mananaIso,
  });

  const [nodos, setNodos] = useState<NodoMaquinaSensor[]>(NODOS_INICIALES);
  const [eventos, setEventos] = useState<EventoAC10[]>([]);

  const registrarEvento = useCallback((modulo: string, detalle: string) => {
    const ahora = new Date().toLocaleTimeString("es-CL", { hour12: false });
    setEventos((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        fechaHora: ahora,
        modulo,
        detalle,
      },
      ...prev,
    ]);
  }, []);

  const handleGenerarCodigoEnlace = () => {
    const aleatorio = Math.floor(1000 + Math.random() * 9000);
    const sufijo = (sesion.idClientePais.trim().slice(0, 3) || "GLB").toUpperCase();
    const nuevoCodigo = `SYN-${sufijo}-${aleatorio}`;
    setSesion((prev) => ({ ...prev, codigoGenerado: nuevoCodigo }));
    registrarEvento(
      "Enlace Remoto",
      `Código ${nuevoCodigo} generado para recopilación ${sesion.fechaRecopilacion} / vigencia ${sesion.fechaVigenciaProgramada}.`
    );
  };

  const handleAlternarParcheCliente = () => {
    setSesion((prev) => {
      const siguiente = !prev.parcheAutorizadoPorCliente;
      registrarEvento(
        "Parche Cliente",
        siguiente
          ? "Parche de permiso autorizado desde portal del cliente."
          : "Parche de permiso revocado."
      );
      return { ...prev, parcheAutorizadoPorCliente: siguiente };
    });
  };

  const handleEnlazarConCreador = () => {
    if (!sesion.parcheAutorizadoPorCliente) {
      registrarEvento(
        "Enlace Remoto",
        "Intento de enlace sin parche autorizado por el cliente."
      );
      return;
    }

    const coincide =
      sesion.codigoPortalCliente.trim().toUpperCase() ===
        sesion.codigoGenerado.trim().toUpperCase() &&
      sesion.codigoGenerado !== "SYN-REM-0000";

    if (!coincide) {
      registrarEvento(
        "Enlace Remoto",
        "El código del portal del cliente no coincide con el código generado."
      );
      return;
    }

    setSesion((prev) => ({ ...prev, enlaceActivoConCreador: true }));
    registrarEvento(
      "Enlace Remoto",
      `Enlace internacional activo con ${sesion.idClientePais || "planta remota"} (vigencia ${sesion.fechaVigenciaProgramada}).`
    );
  };

  const handleAgregarNodo = () => {
    const nuevo: NodoMaquinaSensor = {
      id: `n-${Date.now()}`,
      equipo: `Equipo / Sensor #${nodos.length + 1}`,
      canalConexion: "WiFi Digital",
      temperaturaC: "25.0°C",
      estadoSensor: "Operativo",
      nota: "Registrado en laboratorio AC10.",
    };
    setNodos((prev) => [...prev, nuevo]);
    registrarEvento("Sensores / SO", `Se agregó ${nuevo.equipo}.`);
  };

  const handleActualizarNodo = (
    id: string,
    campo: keyof NodoMaquinaSensor,
    valor: string
  ) => {
    setNodos((prev) =>
      prev.map((n) => (n.id === id ? { ...n, [campo]: valor } : n))
    );
  };

  return (
    <div className="bg-slate-950 border border-cyan-500/30 rounded-2xl p-4 sm:p-6 text-white space-y-5 font-mono">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
            AC10 · Laboratorio del Creador · Enlace Remoto · Sensores y SO
          </div>
          <h2 className="text-sm sm:text-base font-black uppercase text-white">
            Laboratorio Supremo del Creador (Nivel 10)
          </h2>
        </div>

        <button
          type="button"
          onClick={() => {
            setModoSupremoSinLimites((prev) => {
              const sig = !prev;
              registrarEvento(
                "Control Creador",
                sig
                  ? "Acceso supremo sin límites activado."
                  : "Modo restricción de prueba activado."
              );
              return sig;
            });
          }}
          className={`px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer ${
            modoSupremoSinLimites
              ? "bg-amber-400 text-slate-950 border-amber-300"
              : "bg-slate-900 text-slate-300 border-slate-700"
          }`}
        >
          {modoSupremoSinLimites
            ? "Creador: Acceso Total Sin Límites"
            : "Creador: Modo Prueba Restringida"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <button
          type="button"
          onClick={() => setPestana("enlace")}
          className={`px-3.5 py-2 rounded-xl border font-bold cursor-pointer ${
            pestana === "enlace"
              ? "bg-cyan-400 text-slate-950 border-cyan-300"
              : "bg-slate-900 text-cyan-300 border-cyan-500/30"
          }`}
        >
          1. Enlace Remoto Internacional
        </button>
        <button
          type="button"
          onClick={() => setPestana("sensores")}
          className={`px-3.5 py-2 rounded-xl border font-bold cursor-pointer ${
            pestana === "sensores"
              ? "bg-emerald-400 text-slate-950 border-emerald-300"
              : "bg-slate-900 text-emerald-300 border-emerald-500/30"
          }`}
        >
          2. Sensores Maquinaria & SO
        </button>
        <button
          type="button"
          onClick={() => setPestana("mando")}
          className={`px-3.5 py-2 rounded-xl border font-bold cursor-pointer ${
            pestana === "mando"
              ? "bg-amber-400 text-slate-950 border-amber-300"
              : "bg-slate-900 text-amber-300 border-amber-500/30"
          }`}
        >
          3. Mando del Creador & Bitácora
        </button>
      </div>

      {pestana === "enlace" && (
        <PestanaEnlaceRemotoAC10
          sesion={sesion}
          setSesion={setSesion}
          onGenerarCodigoEnlace={handleGenerarCodigoEnlace}
          onAlternarParcheCliente={handleAlternarParcheCliente}
          onEnlazarConCreador={handleEnlazarConCreador}
        />
      )}

      {pestana === "sensores" && (
        <PestanaSensoresMaquinariaAC10
          nodos={nodos}
          onAgregarNodo={handleAgregarNodo}
          onActualizarNodo={handleActualizarNodo}
        />
      )}

      {pestana === "mando" && (
        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-xl border border-amber-500/40 bg-slate-900/70 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
              Capacidades del Creador frente a Técnicos e Ingenieros
            </div>
            <p className="text-slate-300 text-[11px]">
              Como Creador de Synapse-X OSAI Industrial, mantienes control directo de pruebas, simulación de SO, sensores en planta y enlaces remotos sin bloqueos internos.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
              Bitácora del Laboratorio AC10 ({eventos.length})
            </div>
            {eventos.length === 0 ? (
              <div className="text-slate-500 text-[11px]">
                Sin eventos registrados todavía en esta sesión.
              </div>
            ) : (
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {eventos.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-2.5 rounded-lg border border-slate-800 bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]"
                  >
                    <div>
                      <span className="font-bold text-cyan-300">[{ev.modulo}]</span>{" "}
                      <span className="text-slate-200">{ev.detalle}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0">{ev.fechaHora}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}