"use client";

import React, { useState } from "react";
import TablaTrazabilidadEstandar from "../../components/TablaTrazabilidadEstandar";
import CronometroIndustrial from "../../components/CronometroIndustrial";
import BloqueoSecuencialOSAI from "../osai/bloqueo-secuencial-osai";

export interface Estacion5Props {
  lotesActivos?: any[];
  onLoteCompletado?: (loteFermentado: any) => void;
  esClaro?: boolean;
}

// Lote simulado por defecto en caso de no recibir datos previos
const LOTE_DEMO_ESTACION5 = {
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
      observacionPila: "Lote activo en fermentación controlada",
      clienteLocalTel: "Distribuidora Comercial Salam / +56951049399",
      producto: "Pan Brioche Láctico",
      tipoMasa: "Masa Brioche Especial",
      coberturaTopping: "Sésamo Blanco",
      cantPedido: 500,
      seguridad: 50,
      bodega: 0,
      totalFabricar: 550,
      pesoMasaKg: 49.5,
    },
  ],
};

const CAMARAS_FERMENTACION = [
  { id: "CAM-1", nombre: "Cámara de Fermentación #1 (Coche A y B)", capacidad: "2 Coches (36 Bandejas)" },
  { id: "CAM-2", nombre: "Cámara de Fermentación #2 (Coche C y D)", capacidad: "2 Coches (36 Bandejas)" },
  { id: "CAM-3", nombre: "Cámara de Frío / Retardo #3", capacidad: "4 Coches (72 Bandejas)" },
];

export default function Estacion5({
  lotesActivos = [],
  onLoteCompletado,
  esClaro = false,
}: Estacion5Props) {
  const listaEfectiva = lotesActivos.length > 0 ? lotesActivos : [LOTE_DEMO_ESTACION5];

  const [estacionActiva, setEstacionActiva] = useState<number>(5);
  const [lotesSeleccionados, setLotesSeleccionados] = useState<string[]>(
    listaEfectiva.map((l) => l.idLote)
  );

  const [loteActivoId, setLoteActivoId] = useState<string>(listaEfectiva[0].idLote);
  const [acordeonAbierto, setAcordeonAbierto] = useState<boolean>(true);

  // Parámetros técnicos globales de fermentación
  const [camaraAsignada, setCamaraAsignada] = useState<string>(CAMARAS_FERMENTACION[0].nombre);
  const [temperaturaSet, setTemperaturaSet] = useState<number>(26); // °C
  const [humedadSet, setHumedadSet] = useState<number>(80); // % HR

  // Responsable Poka-Yoke
  const [responsableCedula, setResponsableCedula] = useState<string>("");
  const [responsableNombre, setResponsableNombre] = useState<string>(
    "Ingrese cédula para firmar..."
  );

  // Pasos secuenciales de la Estación 5 (Fermentación)
  const [pasosEstacion5, setPasosEstacion5] = useState([
    { id: 1, nombre: "Ingreso a Cámara", estado: "completado" as string },
    { id: 2, nombre: "Setpoint Temp / HR", estado: "activo" as string },
    { id: 3, nombre: "Control de Leudado", estado: "bloqueado" as string },
    { id: 4, nombre: "Punto Óptimo", estado: "bloqueado" as string },
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

  const toggleSeleccionLote = (idLote: string) => {
    setLotesSeleccionados((prev) =>
      prev.includes(idLote) ? prev.filter((id) => id !== idLote) : [...prev, idLote]
    );
  };

  const completarPasoSecuencial = (indexPaso: number) => {
    const nuevos = [...pasosEstacion5];
    nuevos[indexPaso].estado = "completado";
    if (indexPaso + 1 < nuevos.length) {
      nuevos[indexPaso + 1].estado = "activo";
    }
    setPasosEstacion5(nuevos);
  };

  const handleCambiarEstacion = (id: number) => {
    setEstacionActiva(id);
    if (typeof window !== "undefined") {
      window.location.href = `/estaciones/estacion-${id}`;
    }
  };

  const loteActual =
    listaEfectiva.find((l) => l.idLote === loteActivoId) || listaEfectiva[0];

  return (
    <BloqueoSecuencialOSAI
      estacionActual={estacionActiva}
      estaciones={estacionesListado}
      onCambiarEstacion={handleCambiarEstacion}
      pasos={pasosEstacion5}
      onCompletarPaso={completarPasoSecuencial}
    >
      <div className="space-y-6">
        
        {/* 1. CHECKLIST DE LOTES VIAJANDO POR FERMENTACIÓN */}
        <div className="bg-white dark:bg-[#111827] border border-amber-500/40 rounded-xl p-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-2">
              📋 CHECKLIST DE LOTES EN FERMENTACIÓN ({listaEfectiva.length} DISPONIBLES)
            </span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
              Marque los lotes activos en cámara
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {listaEfectiva.map((lote) => {
              const estaSeleccionado = lotesSeleccionados.includes(lote.idLote);
              const esElActivo = lote.idLote === loteActivoId;

              return (
                <div
                  key={lote.idLote}
                  className={`p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                    esElActivo
                      ? "bg-amber-500/10 border-amber-500"
                      : estaSeleccionado
                      ? "bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                      : "bg-slate-100/50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 opacity-60"
                  }`}
                  onClick={() => setLoteActivoId(lote.idLote)}
                >
                  <input
                    type="checkbox"
                    checked={estaSeleccionado}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleSeleccionLote(lote.idLote);
                    }}
                    className="mt-0.5 h-4 w-4 text-amber-500 rounded border-slate-300 focus:ring-amber-400 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-black text-amber-600 dark:text-amber-400 truncate">
                        {lote.idLote}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        {lote.cargaTotalKg} Kg
                      </span>
                    </div>
                    <div className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate">
                      Receta: {lote.receta}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. ACORDEÓN DE TRAZABILIDAD */}
        <div className="bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden transition-all">
          <div
            onClick={() => setAcordeonAbierto(!acordeonAbierto)}
            className="bg-slate-100 dark:bg-slate-900/90 p-4 cursor-pointer flex items-center justify-between hover:bg-slate-200 dark:hover:bg-slate-900 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-base">🌡️</span>
              <div>
                <div className="text-sm font-black text-amber-600 dark:text-amber-400 font-mono">
                  LOTE EN FERMENTACIÓN: {loteActual.idLote} — Receta: {loteActual.receta}
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                  Carga Total: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{loteActual.cargaTotalKg} Kg</span> | Clic para ver/ocultar trazabilidad.
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
                <span>🔍</span> Trazabilidad de Pedidos en Leudado:
              </div>
              <TablaTrazabilidadEstandar pedidos={loteActual.pedidosAsociados as any} esClaro={esClaro} />
            </div>
          )}
        </div>

        {/* 3. CONTROL TÉCNICO DE CÁMARAS Y CRONÓMETROS */}
        <div className="bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-6 transition-colors">
          
          <div className="bg-amber-500 text-slate-950 py-3 px-6 rounded-xl text-center font-black text-base uppercase tracking-wider shadow-md">
            ⚙️ CONTROL TÉCNICO DE FERMENTACIÓN CONTROLADA Y RETARDO DE MASA
          </div>

          {/* CONTROLES TÉRMINOS / HUMEDAD GENERALES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-300 dark:border-slate-800">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-700 dark:text-slate-400 block">
                Temperatura de Setpoint (°C):
              </label>
              <input
                type="number"
                value={temperaturaSet}
                onChange={(e) => {
                  setTemperaturaSet(Number(e.target.value));
                  completarPasoSecuencial(1);
                }}
                className="w-full bg-white dark:bg-slate-800 text-sm font-mono text-rose-600 dark:text-rose-400 font-bold border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-center"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-700 dark:text-slate-400 block">
                Humedad Relativa (% HR):
              </label>
              <input
                type="number"
                value={humedadSet}
                onChange={(e) => {
                  setHumedadSet(Number(e.target.value));
                  completarPasoSecuencial(2);
                }}
                className="w-full bg-white dark:bg-slate-800 text-sm font-mono text-sky-600 dark:text-sky-400 font-bold border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-center"
              />
            </div>
          </div>

          {/* CÁMARAS DE FERMENTACIÓN CON CRONÓMETROS DEDICADOS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CAMARAS_FERMENTACION.map((cam) => {
              const estaSeleccionada = camaraAsignada === cam.nombre;

              return (
                <div
                  key={cam.id}
                  className={`p-4 rounded-xl border transition-all space-y-3 flex flex-col justify-between ${
                    estaSeleccionada
                      ? "bg-slate-50 dark:bg-slate-900 border-amber-500 ring-2 ring-amber-500/50 shadow-lg"
                      : "bg-slate-50 dark:bg-slate-900/60 border-slate-300 dark:border-slate-800"
                  }`}
                >
                  <div>
                    <div className="text-[11px] font-black uppercase text-amber-600 dark:text-amber-400 font-mono mb-1">
                      {cam.nombre}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mb-3">
                      Capacidad: <span className="text-slate-800 dark:text-slate-200 font-bold">{cam.capacidad}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setCamaraAsignada(cam.nombre);
                        completarPasoSecuencial(2);
                      }}
                      className={`w-full py-1.5 px-2 rounded-lg text-[10px] font-black uppercase mb-3 transition-all cursor-pointer ${
                        estaSeleccionada
                          ? "bg-amber-500 text-slate-950 shadow"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300"
                      }`}
                    >
                      {estaSeleccionada ? "✓ Cámara Asignada" : "Seleccionar Cámara"}
                    </button>
                  </div>

                  <CronometroIndustrial
                    nombreEstacion={cam.nombre}
                    esClaro={esClaro}
                  />
                </div>
              );
            })}
          </div>

          {/* 4. FIRMA Y CERTIFICACIÓN POKA-YOKE */}
          <div className="bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-xl p-4 space-y-3 transition-colors">
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              👤 RESPONSABLE DE CONTROL DE FERMENTACIÓN
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
              <div>
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-400 block mb-1">
                  Cédula del Operador:
                </label>
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
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-400 block mb-1">
                  Nombre Autorizado:
                </label>
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
                    alert(
                      "⚠️ POKA-YOKE: Ingrese la cédula del operador para certificar el punto de fermentación."
                    );
                    return;
                  }
                  completarPasoSecuencial(3);
                  completarPasoSecuencial(4);
                  alert(
                    `✅ Fermentación del Lote ${loteActual.idLote} en ${camaraAsignada} certificada por ${responsableNombre}. Listo para Horneado (Estación 6).`
                  );
                  if (onLoteCompletado)
                    onLoteCompletado({
                      ...loteActual,
                      camara: camaraAsignada,
                      temperaturaSet,
                      humedadSet,
                      responsable: responsableNombre,
                      cedula: responsableCedula,
                    });
                }}
                className="px-6 py-3 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-lg hover:bg-emerald-400 hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>🥐</span> CERTIFICAR LEUDADO Y ENVIAR A HORNEADO (ESTACIÓN 6)
              </button>
            </div>
          </div>

        </div>

      </div>
    </BloqueoSecuencialOSAI>
  );
}