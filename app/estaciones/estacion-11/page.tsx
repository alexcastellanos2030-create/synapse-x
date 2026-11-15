"use client";

import React, { useState } from "react";
import BloqueoSecuencialOSAI from "../osai/bloqueo-secuencial-osai";

export default function Estacion11BodegaPlanta() {
  const [estacionActiva, setEstacionActiva] = useState<number>(11);
  
  const [lotesDisponibles] = useState([
    { idLote: "LOT-2026-011", receta: "Pan Francés Artesanal", cargaTotalKg: 150, unidadesTotal: 600, estadoCalidad: "Aprobado" },
    { idLote: "LOT-2026-012", receta: "Pan Sobao Tradicional", cargaTotalKg: 120, unidadesTotal: 480, estadoCalidad: "Aprobado" },
  ]);

  const [loteSeleccionado, setLoteSeleccionado] = useState(lotesDisponibles[0]);
  const [unidadesEmpacadas, setUnidadesEmpacadas] = useState<number>(450);
  const [unidadesSobrantesStock, setUnidadesSobrantesStock] = useState<number>(130);
  const [unidadesMerma, setUnidadesMerma] = useState<number>(20);
  const [motivoMerma, setMotivoMerma] = useState<string>("Deformación en cocción / Exceso de tostado");
  const [observacionGeneral, setObservacionGeneral] = useState<string>("Empaque verificado bajo parámetros de calidad.");
  const [responsableCedula, setResponsableCedula] = useState<string>("");
  const [responsableNombre, setResponsableNombre] = useState<string>("Ingrese cédula para firmar...");
  const [historialEmpaque, setHistorialEmpaque] = useState<any[]>([]);

  // Pasos secuenciales de la Estación 11 (Empaque, Stock y Merma)
  const [pasosEstacion11, setPasosEstacion11] = useState([
    { id: 1, nombre: "Recepción de Lote", estado: "completado" as string },
    { id: 2, nombre: "Distribución Empaque", estado: "activo" as string },
    { id: 3, nombre: "Registro de Merma", estado: "bloqueado" as string },
    { id: 4, nombre: "Validación Stock", estado: "bloqueado" as string },
    { id: 5, nombre: "Firma y Cierre", estado: "bloqueado" as string },
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
    const nuevos = [...pasosEstacion11];
    nuevos[indexPaso].estado = "completado";
    if (indexPaso + 1 < nuevos.length) {
      nuevos[indexPaso + 1].estado = "activo";
    }
    setPasosEstacion11(nuevos);
  };

  const handleCambiarEstacion = (id: number) => {
    setEstacionActiva(id);
    if (typeof window !== "undefined") {
      window.location.href = `/estaciones/estacion-${id}`;
    }
  };

  const handleEmpacadasChange = (val: number) => {
    setUnidadesEmpacadas(val);
    const restante = loteSeleccionado.unidadesTotal - val - unidadesMerma;
    setUnidadesSobrantesStock(restante >= 0 ? restante : 0);
    completarPasoSecuencial(1);
  };

  const handleMermaChange = (val: number) => {
    setUnidadesMerma(val);
    const restante = loteSeleccionado.unidadesTotal - unidadesEmpacadas - val;
    setUnidadesSobrantesStock(restante >= 0 ? restante : 0);
    completarPasoSecuencial(2);
  };

  const handleCedulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ced = e.target.value.replace(/\D/g, "");
    setResponsableCedula(ced);
    if (ced === "10433935" || ced === "12345678") {
      setResponsableNombre("Alexander Segundo Castellanos Perozo");
    } else if (ced === "87654321") {
      setResponsableNombre("Carolina Pérez (Administración)");
    } else if (ced.length >= 7) {
      setResponsableNombre(`Encargado ID ${ced}`);
    } else {
      setResponsableNombre("Ingrese cédula válida...");
    }
  };

  const handleProcesarEmpaque = (e: React.FormEvent) => {
    e.preventDefault();
    if (!responsableCedula.trim() || responsableNombre.includes("Ingrese")) {
      alert("⚠️ POKA-YOKE: Ingrese la cédula del encargado para firmar el proceso de empaque.");
      return;
    }

    if (unidadesEmpacadas + unidadesSobrantesStock + unidadesMerma !== loteSeleccionado.unidadesTotal) {
      alert("⚠️ La suma de (Empacado + Sobrante Stock + Merma) debe ser igual al total de unidades producidas del lote.");
      return;
    }

    completarPasoSecuencial(3);
    completarPasoSecuencial(4);

    const registro = {
      id: Date.now(),
      idLote: loteSeleccionado.idLote,
      receta: loteSeleccionado.receta,
      unidadesEmpacadas,
      unidadesSobrantesStock,
      unidadesMerma,
      motivoMerma,
      responsable: responsableNombre,
      timestamp: new Date().toLocaleTimeString()
    };

    setHistorialEmpaque([registro, ...historialEmpaque]);
    alert(`✅ Lote ${loteSeleccionado.idLote} empacado exitosamente por ${responsableNombre}.\n\n- ${unidadesEmpacadas} unids a Pedidos.\n- ${unidadesSobrantesStock} unids a Stock Empresa.\n- ${unidadesMerma} unids registradas como Merma.`);
  };

  return (
    <BloqueoSecuencialOSAI
      estacionActual={estacionActiva}
      estaciones={estacionesListado}
      onCambiarEstacion={handleCambiarEstacion}
      pasos={pasosEstacion11}
      onCompletarPaso={completarPasoSecuencial}
    >
      <div className="space-y-6">
        
        {/* SELECTOR DE LOTE */}
        <div className="flex justify-between items-center mb-2 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-300 dark:border-slate-800 shadow-sm transition-colors">
          <div>
            <h2 className="text-sm font-black text-amber-600 dark:text-amber-400 font-mono uppercase">
              Estación 11 — Empaque, Stock y Control de Merma
            </h2>
            <p className="text-[11px] text-slate-500">Seleccione el lote aprobado en calidad listo para empaque y despacho</p>
          </div>
          <select
            value={loteSeleccionado.idLote}
            onChange={(e) => {
              const l = lotesDisponibles.find(x => x.idLote === e.target.value);
              if (l) {
                setLoteSeleccionado(l);
                setUnidadesEmpacadas(Math.round(l.unidadesTotal * 0.75));
                setUnidadesSobrantesStock(Math.round(l.unidadesTotal * 0.20));
                setUnidadesMerma(l.unidadesTotal - Math.round(l.unidadesTotal * 0.75) - Math.round(l.unidadesTotal * 0.20));
              }
            }}
            className="bg-slate-100 dark:bg-slate-800 text-xs text-amber-700 dark:text-amber-300 font-bold border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 font-mono cursor-pointer"
          >
            {lotesDisponibles.map((lote) => (
              <option key={lote.idLote} value={lote.idLote}>
                Lote: {lote.idLote} ({lote.receta})
              </option>
            ))}
          </select>
        </div>

        {/* FORMULARIO PRINCIPAL */}
        <form onSubmit={handleProcesarEmpaque} className="bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-800 rounded-2xl shadow-xl p-6 space-y-6 transition-colors">
          
          <div className="bg-amber-500 text-slate-950 py-3 px-6 rounded-xl text-center font-black text-xs uppercase tracking-wider font-mono shadow-md">
            CONTROL DE EMPAQUE Y MERMA — SALAM BAKERY — {loteSeleccionado.receta.toUpperCase()}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-300 dark:border-slate-800">
            <div>
              <span className="text-slate-500 block font-semibold">ID del Lote:</span>
              <span className="font-mono font-bold text-sm text-amber-600">{loteSeleccionado.idLote}</span>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold">Total Producido (Calidad OK):</span>
              <span className="font-mono font-bold text-sm">{loteSeleccionado.unidadesTotal} Unidades ({loteSeleccionado.cargaTotalKg} Kg)</span>
            </div>
            <div>
              <span className="text-slate-500 block font-semibold">Estado de Calidad:</span>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 font-bold text-[10px] uppercase">
                ● {loteSeleccionado.estadoCalidad}
              </span>
            </div>
          </div>

          {/* DISTRIBUCIÓN */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/40 space-y-2">
              <label className="block font-bold text-emerald-800 dark:text-emerald-300 text-xs">
                📦 Empaque para Pedidos:
              </label>
              <input
                type="number"
                value={unidadesEmpacadas}
                onChange={(e) => handleEmpacadasChange(Number(e.target.value))}
                min={0}
                required
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 rounded-lg font-mono font-bold text-sm text-center text-slate-900 dark:text-slate-100"
              />
              <p className="text-[10px] text-emerald-700">Despacho inmediato para clientes.</p>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-xl border border-amber-200 dark:border-amber-900/40 space-y-2">
              <label className="block font-bold text-amber-800 dark:text-amber-300 text-xs">
                🏢 Sobrante a Stock Empresa:
              </label>
              <input
                type="number"
                value={unidadesSobrantesStock}
                readOnly
                className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-amber-300 dark:border-amber-700 rounded-lg font-mono font-bold text-sm text-center cursor-not-allowed text-slate-900 dark:text-slate-100"
              />
              <p className="text-[10px] text-amber-700">Pasa al inventario general de stock.</p>
            </div>

            <div className="bg-rose-50 dark:bg-rose-950/20 p-4 rounded-xl border border-rose-200 dark:border-rose-900/40 space-y-2">
              <label className="block font-bold text-rose-800 dark:text-rose-300 text-xs">
                ⚠️ Unidades en Merma (Desecho):
              </label>
              <input
                type="number"
                value={unidadesMerma}
                onChange={(e) => handleMermaChange(Number(e.target.value))}
                min={0}
                required
                className="w-full p-2.5 bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-700 rounded-lg font-mono font-bold text-sm text-center text-rose-600"
              />
              <p className="text-[10px] text-rose-700">Dañado / Pérdida auditada.</p>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-rose-600 dark:text-rose-400 mb-1">Motivo de la Merma:</label>
              <input
                type="text"
                value={motivoMerma}
                onChange={(e) => setMotivoMerma(e.target.value)}
                className="w-full p-2.5 border rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Observaciones Generales:</label>
              <input
                type="text"
                value={observacionGeneral}
                onChange={(e) => setObservacionGeneral(e.target.value)}
                className="w-full p-2.5 border rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* POKA-YOKE FIRMA */}
          <div className="bg-slate-100 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              👤 RESPONSABLE DE EMPAQUE (FIRMA POKA-YOKE)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
              <div>
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-400 block mb-1">Cédula del Encargado:</label>
                <input
                  type="text"
                  value={responsableCedula}
                  onChange={handleCedulaChange}
                  placeholder="Ej: 10433935"
                  className="w-full bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-400 block mb-1">Nombre Autorizado:</label>
                <div className="w-full bg-slate-200 dark:bg-slate-950 text-xs text-amber-700 dark:text-amber-400 font-bold border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 flex items-center h-[34px]">
                  {responsableNombre}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-lg hover:bg-emerald-400 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>📦</span> CONFIRMAR EMPAQUE Y REGISTRAR MERMA
              </button>
            </div>
          </div>

        </form>
      </div>
    </BloqueoSecuencialOSAI>
  );
}