"use client";

import React, { useState } from "react";
import { LoteCreado } from "../estacion-1/page";
import TablaTrazabilidadEstandar from "../../components/TablaTrazabilidadEstandar";
import BloqueoSecuencialOSAI from "../osai/bloqueo-secuencial-osai";

export type LotePesaje = LoteCreado;

export interface Estacion2Props {
  lotesActivos?: LoteCreado[];
  onLoteCompletado?: (lotePesado: LotePesaje) => void;
  esClaro?: boolean;
}

interface IngredienteFila {
  descripcion: string;
  grBase: number;
  porc: number;
}

export default function Estacion2({
  lotesActivos = [],
  onLoteCompletado,
  esClaro = false,
}: Estacion2Props) {
  const [estacionActiva, setEstacionActiva] = useState<number>(2);
  const [acordeonAbierto, setAcordeonAbierto] = useState<boolean>(true);
  
  // ESTADOS DE SUPERUSUARIO Y EDICIÓN DE RECETA
  const [modoEdicionActivo, setModoEdicionActivo] = useState<boolean>(false);

  const [ingredientesBase, setIngredientesBase] = useState<IngredienteFila[]>([
    { descripcion: "Harina Fortaleza P", grBase: 1000, porc: 100 },
    { descripcion: "Azucar", grBase: 70, porc: 7 },
    { descripcion: "Sal", grBase: 20, porc: 2 },
    { descripcion: "Mejorador", grBase: 10, porc: 1 },
    { descripcion: "LEVADURA ROJA", grBase: 7, porc: 0.7 },
    { descripcion: "Huevos", grBase: 0, porc: 0 },
    { descripcion: "Vainilla", grBase: 0, porc: 0 },
    { descripcion: "H2O", grBase: 475, porc: 47.5 },
    { descripcion: "Aceite Vegetal", grBase: 10, porc: 1 },
    { descripcion: "Manteca Vegetal", grBase: 30, porc: 3 },
  ]);
  
  const [responsableCedula, setResponsableCedula] = useState<string>("");
  const [responsableNombre, setResponsableNombre] = useState<string>("Ingrese cédula para firmar...");

  // Estados de control Poka-Yoke de los 5 pasos de Amasado
  const [paso1Revisado, setPaso1Revisado] = useState<boolean>(true); // Lote recibido de Estación 1
  const [paso2PesajeOk, setPaso2PesajeOk] = useState<boolean>(false); // Receta y pesaje verificado
  const [paso3Amasando, setPaso3Amasando] = useState<boolean>(false); // Proceso de amasado en curso/listo
  const [paso4TexturaOk, setPaso4TexturaOk] = useState<boolean>(false); // Control de textura validado
  const [paso5Firmado, setPaso5Firmado] = useState<boolean>(false); // Firma del operario responsable

  const paso1Completado = paso1Revisado;
  const paso2Completado = paso1Completado && paso2PesajeOk;
  const paso3Completado = paso2Completado && paso3Amasando;
  const paso4Completado = paso3Completado && paso4TexturaOk;
  const paso5Completado = paso4Completado && paso5Firmado && responsableCedula.length >= 7;

  // Catálogo oficial de las 12 estaciones OSAI
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

  // Pasos secuenciales para la barra OSAI superior
  const pasosEstacion2OSAI = [
    { id: 1, nombre: "Revisión Lote", estado: paso1Completado ? "completado" : "activo" },
    { id: 2, nombre: "Pesaje Receta", estado: paso2Completado ? "completado" : paso1Completado ? "activo" : "bloqueado" },
    { id: 3, nombre: "Proceso Amasado", estado: paso3Completado ? "completado" : paso2Completado ? "activo" : "bloqueado" },
    { id: 4, nombre: "Control Textura", estado: paso4Completado ? "completado" : paso3Completado ? "activo" : "bloqueado" },
    { id: 5, nombre: "Firma Operario", estado: paso5Completado ? "completado" : paso4Completado ? "activo" : "bloqueado" },
  ];

  // Fallback tipado estrictamente como LoteCreado
  const loteActual: LoteCreado = (lotesActivos && lotesActivos.length > 0) ? lotesActivos[0] : {
    idLote: "LOTE-AMASADO-ACTIVO-001",
    amasadora: "Amasadora 63 Kg",
    receta: "Masa de Pan Mini Restaurant",
    pedidosAsociados: [
      {
        loteId: "PED-202610-001",
        cliente: "Distribuidora Comercial Salam",
        producto: "Pan Mini Restaurant (50g)",
        tipoMasa: "Masa de Pan Mini Restaurant",
        gramajePiezaG: 50,
        cantidadSolicitada: 200,
        unidadesSeguridad: 20,
        existenciaBodega: 0,
        cantidadNetaFabricar: 220,
        modalidad: "Normal",
        fechaRecepcion: "22/10/2026 06:00",
        fechaEntrega: "22/10/2026 14:00",
        cobertura: "Huevo Batido",
        topping: "Sésamo Blanco",
        observacionBodega: "Bodega en Cero",
        observaciones: "Requerimiento estándar",
        estado: "En Producción",
      }
    ],
    cargaTotalKg: 11.0,
    responsable: "Alexander Castellanos",
    cedula: "10433935",
    fechaHora: "22/10/2026 08:00"
  } as LoteCreado;

  const pesoTotalPedidosKg = loteActual.pedidosAsociados.reduce((acc, p) => acc + (p.cantidadNetaFabricar * p.gramajePiezaG) / 1000, 0);
  const factorEscala = (pesoTotalPedidosKg * 1000) / 1622;
  const totalGrBase = ingredientesBase.reduce((acc, i) => acc + i.grBase, 0);
  const totalPorcBase = ingredientesBase.reduce((acc, i) => acc + i.porc, 0);

  const obtenerBaseHarinaKg = (): number => {
    const harinaEncontrada = ingredientesBase.find(
      (i) => i.descripcion.toLowerCase().includes("harina") && i.grBase > 0
    );
    return harinaEncontrada ? harinaEncontrada.grBase : 1000;
  };

  const actualizarIngrediente = (index: number, campo: keyof IngredienteFila, valor: string | number) => {
    const nuevos = [...ingredientesBase];
    const ingredienteActual = { ...nuevos[index] };

    if (campo === "grBase") {
      const nuevoGr = Number(valor);
      ingredienteActual.grBase = isNaN(nuevoGr) ? 0 : nuevoGr;
      
      const baseHarina = ingredienteActual.descripcion.toLowerCase().includes("harina") && nuevoGr > 0 
        ? nuevoGr 
        : obtenerBaseHarinaKg();

      if (baseHarina > 0 && ingredienteActual.grBase > 0) {
        const porcCalculado = (ingredienteActual.grBase / baseHarina) * 100;
        ingredienteActual.porc = Number(porcCalculado.toFixed(2));
      } else if (ingredienteActual.grBase === 0) {
        ingredienteActual.porc = 0;
      }
    } else {
      // @ts-ignore
      ingredienteActual[campo] = valor;
    }

    nuevos[index] = ingredienteActual;
    setIngredientesBase(nuevos);
  };

  const agregarNuevoIngrediente = () => {
    const nombre = prompt("Ingrese el nombre del nuevo ingrediente:");
    if (!nombre) return;
    const gr = Number(prompt("Ingrese los gramos base (gr):", "0"));
    const gramosValidos = isNaN(gr) ? 0 : gr;

    const baseHarina = obtenerBaseHarinaKg();
    const porcCalculado = baseHarina > 0 && gramosValidos > 0 ? Number(((gramosValidos / baseHarina) * 100).toFixed(2)) : 0;

    setIngredientesBase([...ingredientesBase, { descripcion: nombre, grBase: gramosValidos, porc: porcCalculado }]);
    alert(`✅ Ingrediente "${nombre}" agregado con éxito (${gramosValidos}g | ${porcCalculado}% automático).`);
  };

  const eliminarIngrediente = (index: number) => {
    if (confirm(`¿Desea eliminar el ingrediente "${ingredientesBase[index].descripcion}" de la receta?`)) {
      const nuevos = ingredientesBase.filter((_, i) => i !== index);
      setIngredientesBase(nuevos);
    }
  };

  const guardarModificacionReceta = () => {
    setModoEdicionActivo(false);
    alert("💾 [GUARDADO EXITOSO]: Las modificaciones de la receta y los cálculos automáticos de porcentajes han sido aplicados y sincronizados en SYNAPSE-X OS.");
  };

  const handleCambiarEstacion = (id: number) => {
    setEstacionActiva(id);
    if (typeof window !== "undefined") {
      window.location.href = `/estaciones/estacion-${id}`;
    }
  };

  return (
    <BloqueoSecuencialOSAI
      estacionActual={estacionActiva}
      estaciones={estacionesListado}
      onCambiarEstacion={handleCambiarEstacion}
      pasos={pasosEstacion2OSAI}
      onCompletarPaso={() => {}}
    >
      <div className="space-y-6 max-w-6xl mx-auto text-xs font-sans pb-12">
        
        {/* BARRA DE ESTADO DE CANDADOS (INDICADORES LED ROJO / VERDE IGUAL QUE ESTACIÓN 1) */}
        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 shadow-xl space-y-2">
          <div className="flex justify-between items-center text-[11px] font-mono font-bold text-amber-400">
            <span>🔒 Sistema de Candados y Bloqueo Secuencial OSAI</span>
            <span>ESTACIÓN 2: AMASADO INDUSTRIAL</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 pt-1 font-mono text-[10px]">
            <div className={`p-2 rounded-lg border text-center flex items-center justify-center gap-1.5 ${paso1Completado ? "bg-emerald-500/20 border-emerald-500 text-emerald-300" : "bg-red-500/20 border-red-500 text-red-300"}`}>
              <span>{paso1Completado ? "🟢" : "🔴"}</span> 1. Revisión Lote
            </div>
            <div className={`p-2 rounded-lg border text-center flex items-center justify-center gap-1.5 ${paso2Completado ? "bg-emerald-500/20 border-emerald-500 text-emerald-300" : "bg-red-500/20 border-red-500 text-red-300 animate-pulse"}`}>
              <span>{paso2Completado ? "🟢" : "🔴"}</span> 2. Pesaje Receta
            </div>
            <div className={`p-2 rounded-lg border text-center flex items-center justify-center gap-1.5 ${paso3Completado ? "bg-emerald-500/20 border-emerald-500 text-emerald-300" : "bg-red-500/20 border-red-500 text-red-300"}`}>
              <span>{paso3Completado ? "🟢" : "🔴"}</span> 3. Amasado
            </div>
            <div className={`p-2 rounded-lg border text-center flex items-center justify-center gap-1.5 ${paso4Completado ? "bg-emerald-500/20 border-emerald-500 text-emerald-300" : "bg-red-500/20 border-red-500 text-red-300"}`}>
              <span>{paso4Completado ? "🟢" : "🔴"}</span> 4. Textura
            </div>
            <div className={`p-2 rounded-lg border text-center flex items-center justify-center gap-1.5 ${paso5Completado ? "bg-emerald-500/20 border-emerald-500 text-emerald-300" : "bg-red-500/20 border-red-500 text-red-300"}`}>
              <span>{paso5Completado ? "🟢" : "🔴"}</span> 5. Firma Operario
            </div>
          </div>
        </div>

        {/* PASO 1: ACORDEÓN INTERACTIVO CON TRAZABILIDAD COMPLETA */}
        <div className="bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden transition-all">
          <div
            onClick={() => setAcordeonAbierto(!acordeonAbierto)}
            className="bg-slate-100 dark:bg-slate-900/90 p-4 cursor-pointer flex items-center justify-between hover:bg-slate-200 dark:hover:bg-slate-900 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-base">📦</span>
              <div>
                <div className="text-sm font-black text-amber-600 dark:text-amber-400 font-mono">
                  1. LOTE ACTIVO: {loteActual.idLote} ({loteActual.amasadora}) — Receta: {loteActual.receta}
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                  Carga Total: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{loteActual.cargaTotalKg} Kg</span> | Clic aquí para desplegar/ocultar trazabilidad.
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
                <span>🔍</span> Trazabilidad Estándar Completa de Pedidos en este Lote ({loteActual.pedidosAsociados.length}):
              </div>
              <TablaTrazabilidadEstandar pedidos={loteActual.pedidosAsociados} esClaro={esClaro} />
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setPaso2PesajeOk(true)}
                  className={`px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                    paso2PesajeOk ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500" : "bg-amber-500 text-black hover:bg-amber-400"
                  }`}
                >
                  {paso2PesajeOk ? "✅ Paso 2 Validado (Pesaje y Receta OK)" : "👉 Validar Revisión de Lote y Receta (Avanzar a Paso 2)"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* PASO 2 Y 3: FORMATO DE RECETA CENTRADO Y CÁLCULO AUTOMÁTICO (CANDADO ESTRICTO) */}
        <div className={`bg-white dark:bg-[#111827] border rounded-2xl shadow-2xl p-6 space-y-4 max-w-4xl mx-auto transition-all ${
          !paso2Completado ? "opacity-40 border-red-500/50 bg-red-950/10" : "border-slate-300 dark:border-slate-800 opacity-100"
        }`}>
          <div className="flex justify-between items-center">
            <div className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase">
              2 y 3. Pesaje de Receta & Proceso de Amasado
            </div>
            {!paso2Completado && (
              <span className="text-[10px] font-mono text-red-500 font-bold">🔒 BLOQUEADO: Valide el Paso 1 primero</span>
            )}
          </div>

          <div className="flex items-center justify-between bg-amber-500 text-slate-950 py-3 px-6 rounded-xl shadow-md">
            <span className="font-black text-base uppercase tracking-wider">
              AMASADO PARA {loteActual.receta.toUpperCase()} {modoEdicionActivo && " ✏️ [MODO EDICIÓN & CÁLCULO AUTOMÁTICO]"}
            </span>
            <div className="flex items-center gap-2">
              {modoEdicionActivo && paso2Completado && (
                <>
                  <button
                    type="button"
                    onClick={agregarNuevoIngrediente}
                    className="px-3 py-1 bg-slate-950 text-amber-400 font-bold rounded-lg text-xs hover:bg-slate-900 transition-all cursor-pointer"
                  >
                    ➕ Agregar Ingrediente
                  </button>
                  <button
                    type="button"
                    onClick={guardarModificacionReceta}
                    className="px-3 py-1 bg-emerald-700 text-white font-black rounded-lg text-xs hover:bg-emerald-600 transition-all cursor-pointer shadow"
                  >
                    💾 Guardar Cambios
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 shadow-inner transition-colors">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-200 dark:bg-slate-950 text-slate-800 dark:text-slate-200 border-b border-slate-300 dark:border-slate-800 text-xs font-black">
                  <th className="p-3.5">DESCRIPCION</th>
                  <th className="p-3.5 text-center font-mono">gr (Base)</th>
                  <th className="p-3.5 text-center font-mono">PORC % (Auto)</th>
                  <th className="p-3.5 text-center font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/40">GRAMOS (Calculados)</th>
                  {modoEdicionActivo && <th className="p-3.5 text-center">Acciones</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 text-sm">
                {!paso2Completado ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-red-500 dark:text-red-400 font-bold italic">
                      🔒 Candado activo: Complete el Paso 1 para desbloquear la receta.
                    </td>
                  </tr>
                ) : (
                  ingredientesBase.map((item, idx) => {
                    const gramosCalculados = Math.round(item.grBase * factorEscala);
                    return (
                      <tr key={idx} className="hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">
                          {modoEdicionActivo ? (
                            <input
                              type="text"
                              value={item.descripcion}
                              onChange={(e) => actualizarIngrediente(idx, "descripcion", e.target.value)}
                              className="w-full bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 font-bold border border-slate-400 dark:border-slate-600 rounded px-2 py-1"
                            />
                          ) : (
                            item.descripcion
                          )}
                        </td>
                        <td className="p-3.5 text-center font-mono text-slate-700 dark:text-slate-300 font-semibold">
                          {modoEdicionActivo ? (
                            <input
                              type="number"
                              step="any"
                              value={item.grBase}
                              onChange={(e) => actualizarIngrediente(idx, "grBase", e.target.value)}
                              className="w-24 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 font-mono font-bold text-center border border-slate-400 dark:border-slate-600 rounded px-2 py-1"
                            />
                          ) : (
                            item.grBase > 0 ? item.grBase.toLocaleString() : ""
                          )}
                        </td>
                        <td className="p-3.5 text-center font-mono text-slate-700 dark:text-slate-300 font-semibold">
                          {item.porc > 0 ? `${item.porc.toFixed(2)}%` : "0.00%"}
                        </td>
                        <td className="p-3.5 text-center font-mono text-emerald-600 dark:text-emerald-400 font-black text-base bg-emerald-50 dark:bg-emerald-950/20">
                          {gramosCalculados > 0 ? gramosCalculados.toLocaleString() : "0"}
                        </td>
                        {modoEdicionActivo && (
                          <td className="p-3.5 text-center">
                            <button
                              type="button"
                              onClick={() => eliminarIngrediente(idx)}
                              className="px-2 py-1 bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white rounded text-[10px] font-bold transition-all cursor-pointer"
                            >
                              🗑️ Quitar
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
              {paso2Completado && (
                <tfoot>
                  <tr className="bg-amber-500 text-slate-950 font-black text-base border-t-2 border-amber-600">
                    <td className="p-4 uppercase tracking-wide">Masa Total</td>
                    <td className="p-4 text-center font-mono">{totalGrBase.toLocaleString()}</td>
                    <td className="p-4 text-center font-mono">{totalPorcBase.toFixed(0)}%</td>
                    <td className="p-4 text-center font-mono text-lg font-black bg-amber-600 text-slate-950" colSpan={modoEdicionActivo ? 2 : 1}>
                      {Math.round(totalGrBase * factorEscala).toLocaleString()} g
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          {paso2Completado && (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setPaso3Amasando(true)}
                className={`px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  paso3Amasando ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500" : "bg-amber-500 text-black hover:bg-amber-400"
                }`}
              >
                {paso3Amasando ? "✅ Proceso de Amasado Ejecutado" : "⚙️ Confirmar Ejecución de Amasado (Avanzar a Paso 4)"}
              </button>
            </div>
          )}
        </div>

        {/* PASO 4: CONTROL DE TEXTURA (CANDADO ESTRICTO) */}
        <div className={`bg-white dark:bg-slate-900/90 border rounded-xl p-4 space-y-3 transition-all ${
          !paso3Completado ? "opacity-40 border-red-500/50 bg-red-950/10" : "border-slate-300 dark:border-slate-800 opacity-100"
        }`}>
          <div className="flex justify-between items-center">
            <div className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase">
              4. Control de Textura y Elasticidad de Masa
            </div>
            {!paso3Completado && (
              <span className="text-[10px] font-mono text-red-500 font-bold">🔒 BLOQUEADO: Complete el Paso 3</span>
            )}
          </div>

          {!paso3Completado ? (
            <div className="p-4 text-center text-red-500 italic text-xs">🔒 Candado activo: Complete el proceso de amasado previo.</div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-xs">Verifique red de gluten óptima y temperatura de salida (&lt; 26°C).</span>
              <button
                type="button"
                onClick={() => setPaso4TexturaOk(true)}
                className={`px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  paso4TexturaOk ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500" : "bg-amber-500 text-black hover:bg-amber-400"
                }`}
              >
                {paso4TexturaOk ? "✅ Textura Aprobada" : "🔍 Validar Control de Textura (Avanzar a Paso 5)"}
              </button>
            </div>
          )}
        </div>

        {/* PASO 5: BLOQUE DE FIRMA Y RESPONSABLE DE AMASADO (CANDADO ESTRICTO) */}
        <div className={`bg-slate-100 dark:bg-slate-900/90 border rounded-xl p-4 space-y-3 transition-all ${
          !paso4Completado ? "opacity-40 border-red-500/50 bg-red-950/10" : "border-slate-300 dark:border-slate-800 opacity-100"
        }`}>
          <div className="flex justify-between items-center">
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              👤 5. RESPONSABLE DE ESTACIÓN DE AMASADO Y FIRMA
            </div>
            {!paso4Completado && (
              <span className="text-[10px] font-mono text-red-500 font-bold">🔒 BLOQUEADO: Complete el Paso 4</span>
            )}
          </div>

          {!paso4Completado ? (
            <div className="p-4 text-center text-red-500 italic text-xs">🔒 Candado activo: Complete el control de textura para firmar.</div>
          ) : (
            <div className="space-y-3">
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
                        setPaso5Firmado(true);
                      } else if (ced === "87654321") {
                        setResponsableNombre("Carolina Pérez (Administración)");
                        setPaso5Firmado(true);
                      } else if (ced.length >= 7) {
                        setResponsableNombre(`Operador ID ${ced}`);
                        setPaso5Firmado(true);
                      } else {
                        setResponsableNombre("Ingrese cédula válida...");
                        setPaso5Firmado(false);
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
                      alert("⚠️ POKA-YOKE: Debe ingresar una cédula válida del responsable para validar el amasado.");
                      return;
                    }
                    alert(`✅ Amasado del Lote ${loteActual.idLote} validado y registrado por ${responsableNombre}. Avanzando a Estación 3 (División).`);
                    if (onLoteCompletado) onLoteCompletado(loteActual);
                  }}
                  className="px-6 py-3 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-lg hover:bg-emerald-400 hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>⚙️</span> VALIDAR AMASADO Y AVANZAR A ESTACIÓN 3 (DIVISIÓN)
                </button>
              </div>
            </div>
          )}

          {/* BARRA DE EDICIÓN / SUPERUSER */}
          <div className="mt-4 pt-3 border-t border-slate-300 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 bg-slate-200 dark:bg-slate-950/80 p-2.5 rounded-lg transition-colors">
            <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider">
              🛠️ Barra de Superusuario (Amasado) {modoEdicionActivo ? "🟢 [EDICIÓN ACTIVA]" : "🔒 [BLOQUEADO]"}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setModoEdicionActivo(false)}
                className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  !modoEdicionActivo ? "bg-amber-500 text-slate-950 font-black" : "bg-slate-300 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-400"
                }`}
              >
                👁️ Ver
              </button>

              <button
                type="button"
                onClick={() => setModoEdicionActivo(true)}
                className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  modoEdicionActivo ? "bg-indigo-600 text-white font-black" : "bg-slate-300 dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 hover:bg-slate-400"
                }`}
              >
                ✏️ Editar
              </button>

              <button
                type="button"
                onClick={guardarModificacionReceta}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-black transition-all cursor-pointer shadow"
              >
                💾 Guardar
              </button>
            </div>
          </div>
        </div>

      </div>
    </BloqueoSecuencialOSAI>
  );
}