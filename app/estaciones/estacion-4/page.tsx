"use client";

import React, { useState } from "react";
import type { LoteAmasado } from "../estacion-3/page";
import TablaTrazabilidadEstandar from "../../components/TablaTrazabilidadEstandar";
import CronometroIndustrial from "../../components/CronometroIndustrial";
import BloqueoSecuencialOSAI from "../osai/bloqueo-secuencial-osai";

export type LotePorcionado = LoteAmasado;

export interface Estacion4Props {
  lotesActivos?: LoteAmasado[];
  onLoteCompletado?: (lotePorcionado: LotePorcionado) => void;
  esClaro?: boolean;
}

// Lote simulado de respaldo compatible con todas las propiedades requeridas
const LOTE_DEMO_ESTACION4: LoteAmasado = {
  idLote: "LOTE-202610-001",
  receta: "Pan Brioche Láctico 10cm",
  amasadora: "Amasadora Industrial Spiral #1",
  cargaTotalKg: 45,
  responsable: "Alexander Segundo Castellanos Perozo",
  cedula: "10433935",
  fechaHora: new Date().toLocaleString(),
  pedidosAsociados: [
    {
      idPedido: "PED-202610-001",
      observacionPila: "Lote activo en porcionado y ovillado",
      clienteLocalTel: "Distribuidora Comercial Salam / +56951049399",
      producto: "Pan Brioche Láctico",
      tipoMasa: "Masa Brioche Especial",
      coberturaTopping: "Sésamo Blanco",
      cantPedido: 500,
      seguridad: 50,
      bodega: 0,
      totalFabricar: 550,
      pesoMasaKg: 49.5,
    } as any,
  ],
};

export default function Estacion4({
  lotesActivos = [],
  onLoteCompletado,
  esClaro = false,
}: Estacion4Props) {
  const listaEfectiva = lotesActivos.length > 0 ? lotesActivos : [LOTE_DEMO_ESTACION4];

  const [estacionActiva, setEstacionActiva] = useState<number>(4);
  const [loteSeleccionadoId, setLoteSeleccionadoId] = useState<string>(
    listaEfectiva[0].idLote
  );
  const [acordeonAbierto, setAcordeonAbierto] = useState<boolean>(true);

  // Parámetros técnicos de División y Ovillado
  const [pesoPiezaGr, setPesoPiezaGr] = useState<number>(90);
  const [toleranciaGr, setToleranciaGr] = useState<number>(2);
  const [tiempoDescansoMin, setTiempoDescansoMin] = useState<number>(12);
  const [maquinaUtilizada, setMaquinaUtilizada] = useState<string>(
    "Divisora y Ovilladora Automática Koenig Rex"
  );
  const [presionDivisoraBar, setPresionDivisoraBar] = useState<number>(45);

  // Responsable con validación Poka-Yoke
  const [responsableCedula, setResponsableCedula] = useState<string>("");
  const [responsableNombre, setResponsableNombre] = useState<string>(
    "Ingrese cédula para firmar..."
  );

  // Pasos secuenciales de la Estación 4 (División / Ovillado)
  const [pasosEstacion4, setPasosEstacion4] = useState([
    { id: 1, nombre: "Recepción de Amasado", estado: "completado" as string },
    { id: 2, nombre: "Ajuste Divisora", estado: "activo" as string },
    { id: 3, nombre: "Proceso de Ovillado", estado: "bloqueado" as string },
    { id: 4, nombre: "Control de Pesos", estado: "bloqueado" as string },
    { id: 5, nombre: "Firma Operario", estado: "bloqueado" as string },
  ]);

  const estacionesListado = [
    { id: 1, nombre: "Pesaje" },
    { id: 2, nombre: "Amasado" },
    { id: 3, nombre: "División" },
    { id: 4, nombre: "Formato" },
    { id: 5, nombre: "Fermentación" },
    { id: 6, nombre: "Horneado" },
    { id: 7, nombre: "Empaque" },
    { id: 8, nombre: "Control Salida" },
    { id: 9, nombre: "Rutas" },
    { id: 10, nombre: "Stock Bodega" },
    { id: 11, nombre: "Merma y Stock" },
    { id: 12, nombre: "Planta General" },
  ];

  const completarPasoSecuencial = (indexPaso: number) => {
    const nuevos = [...pasosEstacion4];
    nuevos[indexPaso].estado = "completado";
    if (indexPaso + 1 < nuevos.length) {
      nuevos[indexPaso + 1].estado = "activo";
    }
    setPasosEstacion4(nuevos);
  };

  const handleCambiarEstacion = (id: number) => {
    setEstacionActiva(id);
    if (typeof window !== "undefined") {
      window.location.href = `/estaciones/estacion-${id}`;
    }
  };

  const loteActual =
    listaEfectiva.find((l) => l.idLote === loteSeleccionadoId) || listaEfectiva[0];

  return (
    <BloqueoSecuencialOSAI
      estacionActual={estacionActiva}
      estaciones={estacionesListado}
      onCambiarEstacion={handleCambiarEstacion}
      pasos={pasosEstacion4}
      onCompletarPaso={completarPasoSecuencial}
    >
      <div className="space-y-6">
        
        {/* SELECTOR DE LOTES SI HAY MÁS DE UNO */}
        {listaEfectiva.length > 1 && (
          <div className="flex justify-end mb-2">
            <select
              value={loteSeleccionadoId}
              onChange={(e) => setLoteSeleccionadoId(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 text-xs text-amber-700 dark:text-amber-300 font-bold border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 focus:outline-none"
            >
              {listaEfectiva.map((l) => (
                <option key={l.idLote} value={l.idLote}>
                  Lote Amasado: {l.idLote} ({l.cargaTotalKg} Kg)
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ACORDEÓN DE TRAZABILIDAD ESTÁNDAR OSAI */}
        <div className="bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden transition-all">
          <div
            onClick={() => setAcordeonAbierto(!acordeonAbierto)}
            className="bg-slate-100 dark:bg-slate-900/90 p-4 cursor-pointer flex items-center justify-between hover:bg-slate-200 dark:hover:bg-slate-900 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-base">📦</span>
              <div>
                <div className="text-sm font-black text-amber-600 dark:text-amber-400 font-mono">
                  LOTE EN DIVISIÓN Y OVILLADO: {loteActual.idLote} ({loteActual.amasadora}) — Receta: {loteActual.receta}
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                  Carga Total de Masa: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{loteActual.cargaTotalKg} Kg</span> | Clic aquí para ver/ocultar trazabilidad.
                </div>
              </div>
            </div>
            <div className="text-xs text-amber-700 dark:text-amber-400 font-bold bg-slate-200 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700">
              {acordeonAbierto ? "Ocultar Trazabilidad ▲" : "Ver Trazabilidad Completa ▼"}
            </div>
          </div>

          {acordeonAbierto && (
            <div className="p-4 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-300 dark:border-slate-800 space-y-3 transition-colors">
              <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <span>🔍</span> Trazabilidad Estándar Completa del Lote de Amasado:
              </div>
              <TablaTrazabilidadEstandar pedidos={loteActual.pedidosAsociados as any} esClaro={esClaro} />
            </div>
          )}
        </div>

        {/* CONTROLES TÉCNICOS Y CRONÓMETRO DIGITAL */}
        <div className="bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 max-w-4xl mx-auto transition-colors">
          <div className="bg-amber-500 text-slate-950 py-3 px-6 rounded-xl text-center font-black text-base uppercase tracking-wider shadow-md">
            ⚙️ CONTROL TÉCNICO DE DIVISIÓN Y OVILLADO — {loteActual.receta.toUpperCase()}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            
            {/* PARÁMETROS DE MÁQUINA Y MASA */}
            <div className="md:col-span-2 space-y-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-300 dark:border-slate-800 transition-colors">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-400 block">Gramaje por Pieza (g):</label>
                  <input
                    type="number"
                    value={pesoPiezaGr}
                    onChange={(e) => {
                      setPesoPiezaGr(Number(e.target.value));
                      completarPasoSecuencial(1);
                    }}
                    className="w-full bg-white dark:bg-slate-800 text-sm font-mono text-amber-600 dark:text-amber-400 font-bold border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-center"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-400 block">Tolerancia (±g):</label>
                  <input
                    type="number"
                    value={toleranciaGr}
                    onChange={(e) => setToleranciaGr(Number(e.target.value))}
                    className="w-full bg-white dark:bg-slate-800 text-sm font-mono text-emerald-600 dark:text-emerald-400 font-bold border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-400 block">Descanso en Mesa (min):</label>
                  <input
                    type="number"
                    value={tiempoDescansoMin}
                    onChange={(e) => {
                      setTiempoDescansoMin(Number(e.target.value));
                      completarPasoSecuencial(2);
                    }}
                    className="w-full bg-white dark:bg-slate-800 text-sm font-mono text-sky-600 dark:text-sky-400 font-bold border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-center"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 dark:text-slate-400 block">Presión Hidráulica (Bar):</label>
                  <input
                    type="number"
                    value={presionDivisoraBar}
                    onChange={(e) => {
                      setPresionDivisoraBar(Number(e.target.value));
                      completarPasoSecuencial(3);
                    }}
                    className="w-full bg-white dark:bg-slate-800 text-sm font-mono text-indigo-600 dark:text-indigo-400 font-bold border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-center"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-400 block">Maquinaria Asignada:</label>
                <select
                  value={maquinaUtilizada}
                  onChange={(e) => setMaquinaUtilizada(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-200 font-bold border border-slate-300 dark:border-slate-700 rounded-lg p-2"
                >
                  <option value="Divisora y Ovilladora Automática Koenig Rex">Divisora y Ovilladora Automática Koenig Rex</option>
                  <option value="Divisora Volumétrica Semi-Automática">Divisora Volumétrica Semi-Automática</option>
                  <option value="Divisora Manual por Palanca">Divisora Manual por Palanca</option>
                </select>
              </div>
            </div>

            {/* CRONÓMETRO INDUSTRIAL DIGITAL */}
            <div>
              <CronometroIndustrial nombreEstacion="División y Ovillado" esClaro={esClaro} />
            </div>

          </div>

          {/* FIRMA Y CERTIFICACIÓN POKA-YOKE */}
          <div className="bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-xl p-4 space-y-3 transition-colors">
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              👤 RESPONSABLE DE DIVISIÓN Y OVILLADO
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
              <div>
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-400 block mb-1">Cédula del Operador:</label>
                <input
                  type="text"
                  value={responsableCedula}
                  onChange={(e) => {
                    const ced = e.target.value.replace(/\D/g, "");
                    setResponsableCedula(ced);
                    if (ced === "10433935" || ced === "12345678") {
                      setResponsableNombre("Alexander Segundo Castellanos Perozo");
                    } else if (ced === "87654321") {
                      setResponsableNombre("Carolina Pérez (Administración)");
                    } else if (ced.length >= 7) {
                      setResponsableNombre(`Operador ID ${ced}`);
                    } else {
                      setResponsableNombre("Ingrese cédula válida...");
                    }
                  }}
                  placeholder="Ej: 10433935"
                  className="w-full bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-400 block mb-1">Nombre Autorizado:</label>
                <div className="w-full bg-slate-200 dark:bg-slate-950 text-xs text-amber-700 dark:text-amber-400 font-bold border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 flex items-center">
                  {responsableNombre}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  if (!responsableCedula.trim() || responsableNombre.includes("Ingrese")) {
                    alert("⚠️ POKA-YOKE: Ingrese la cédula del operador para certificar la división y el ovillado.");
                    return;
                  }
                  completarPasoSecuencial(4);
                  alert(`✅ División y ovillado del Lote ${loteActual.idLote} completado por ${responsableNombre}. Avanzando a Estación 5.`);
                  if (onLoteCompletado) onLoteCompletado(loteActual);
                }}
                className="px-6 py-3 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-lg hover:bg-emerald-400 hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>🍞</span> CERTIFICAR DIVISIÓN Y OVILLADO Y AVANZAR
              </button>
            </div>
          </div>
        </div>
      </div>
    </BloqueoSecuencialOSAI>
  );
}