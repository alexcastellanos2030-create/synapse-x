"use client";

import React from "react";
import { NodoMaquinaSensor } from "./TiposLaboratorioAC10";

interface PestanaSensoresMaquinariaAC10Props {
  nodos: NodoMaquinaSensor[];
  onAgregarNodo: () => void;
  onActualizarNodo: (
    id: string,
    campo: keyof NodoMaquinaSensor,
    valor: string
  ) => void;
}

export default function PestanaSensoresMaquinariaAC10({
  nodos,
  onAgregarNodo,
  onActualizarNodo,
}: PestanaSensoresMaquinariaAC10Props) {
  return (
    <div className="space-y-3 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
            Sistema Operativo Adaptado a Dispositivos Sensoriales y Simulación SO
          </div>
          <p className="text-[11px] text-slate-400">
            Control de equipos conectados por pantalla digital/WiFi/red (batidoras, sobadoras, divisoras, conik, hornos, fermentadoras) y diagnóstico de SO.
          </p>
        </div>
        <button
          type="button"
          onClick={onAgregarNodo}
          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] cursor-pointer"
        >
          + Agregar equipo / sensor
        </button>
      </div>

      <div className="space-y-2.5">
        {nodos.map((nodo) => (
          <div
            key={nodo.id}
            className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/70 grid grid-cols-1 md:grid-cols-5 gap-2"
          >
            <input
              type="text"
              value={nodo.equipo}
              onChange={(e) => onActualizarNodo(nodo.id, "equipo", e.target.value)}
              placeholder="Equipo / Estación"
              className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-950 text-white font-bold"
            />
            <select
              value={nodo.canalConexion}
              onChange={(e) =>
                onActualizarNodo(nodo.id, "canalConexion", e.target.value)
              }
              aria-label={`Canal de ${nodo.equipo}`}
              className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-950 text-cyan-200"
            >
              <option value="WiFi Digital">WiFi Digital (Pantalla)</option>
              <option value="Red Industrial">Red Industrial (Sensor/PC)</option>
              <option value="Simulación SO">Simulación / Servicio SO</option>
            </select>
            <input
              type="text"
              value={nodo.temperaturaC}
              onChange={(e) =>
                onActualizarNodo(nodo.id, "temperaturaC", e.target.value)
              }
              placeholder="Lectura / Temp °C"
              className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-950 text-amber-300 font-mono"
            />
            <select
              value={nodo.estadoSensor}
              onChange={(e) =>
                onActualizarNodo(nodo.id, "estadoSensor", e.target.value)
              }
              aria-label={`Estado de ${nodo.equipo}`}
              className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-950 text-white"
            >
              <option value="Operativo">Operativo</option>
              <option value="Alerta Térmica">Alerta Térmica</option>
              <option value="Requiere Revisión">Requiere Revisión</option>
            </select>
            <input
              type="text"
              value={nodo.nota}
              onChange={(e) => onActualizarNodo(nodo.id, "nota", e.target.value)}
              placeholder="Diagnóstico / Alerta"
              className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-950 text-slate-200"
            />
          </div>
        ))}
      </div>
    </div>
  );
}