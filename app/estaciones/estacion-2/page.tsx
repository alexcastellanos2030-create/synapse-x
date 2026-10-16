"use client";

import React, { useState, useEffect } from "react";
import { LoteCreado } from "../estacion-1/page";

// Tipos exportados requeridos por el archivo principal (app/page.tsx)
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
}: Estacion2Props) {
  const [loteSeleccionadoId, setLoteSeleccionadoId] = useState<string>(
    lotesActivos.length > 0 ? lotesActivos[0].idLote : ""
  );
  const [acordeonAbierto, setAcordeonAbierto] = useState<boolean>(true);
  
  // CAMPOS DE RESPONSABLE EN BLANCO AL ENTRAR / SALIR
  const [responsableCedula, setResponsableCedula] = useState<string>("");
  const [responsableNombre, setResponsableNombre] = useState<string>("Ingrese cédula para firmar...");

  useEffect(() => {
    return () => {
      setResponsableCedula("");
      setResponsableNombre("Ingrese cédula para firmar...");
    };
  }, []);

  const ingredientesBase: IngredienteFila[] = [
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
    { descripcion: "Colorante", grBase: 0, porc: 0 },
    { descripcion: "Harina Integral", grBase: 0, porc: 0 },
    { descripcion: "Base de Pan MOLDE", grBase: 0, porc: 0 },
    { descripcion: "Propinato de CALCIO", grBase: 0, porc: 0 },
  ];

  const loteActual = lotesActivos.find((l) => l.idLote === loteSeleccionadoId) || lotesActivos[0];

  const pesoTotalPedidosKg = loteActual 
    ? loteActual.pedidosAsociados.reduce((acc, p) => acc + (p.cantidadNetaFabricar * p.gramajePiezaG) / 1000, 0)
    : 1.622;

  const factorEscala = (pesoTotalPedidosKg * 1000) / 1622;
  const totalGrBase = ingredientesBase.reduce((acc, i) => acc + i.grBase, 0);
  const totalPorcBase = ingredientesBase.reduce((acc, i) => acc + i.porc, 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 text-xs font-sans pb-12">
      
      {/* 1. CABECERA DE ESTACIÓN */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-md flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-amber-400 flex items-center gap-2">
            ⚖️ Estación 2: Sala de Pesaje Digital
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Módulo de Operación Panificable — Control de Ingredientes y Proporciones Panaderas
          </p>
        </div>
        {lotesActivos.length > 0 && (
          <select
            value={loteSeleccionadoId}
            onChange={(e) => setLoteSeleccionadoId(e.target.value)}
            className="bg-slate-800 text-xs text-amber-300 font-bold border border-slate-700 rounded-lg px-3 py-2 focus:outline-none"
          >
            {lotesActivos.map((l) => (
              <option key={l.idLote} value={l.idLote}>
                Lote: {l.idLote} ({l.cargaTotalKg} Kg)
              </option>
            ))}
          </select>
        )}
      </div>

      {lotesActivos.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 rounded-xl border border-slate-800 text-slate-400 text-sm">
          ⚠️ No hay lotes activos transferidos desde la Estación 1. Genere un lote para visualizar la receta de pesaje.
        </div>
      ) : (
        <>
          {/* 2. ACORDEÓN INTERACTIVO CON TRAZABILIDAD COMPLETA */}
          <div className="bg-[#111827] border border-slate-800 rounded-xl shadow-xl overflow-hidden transition-all">
            <div
              onClick={() => setAcordeonAbierto(!acordeonAbierto)}
              className="bg-slate-900/90 p-4 cursor-pointer flex items-center justify-between hover:bg-slate-900 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">📦</span>
                <div>
                  <div className="text-sm font-black text-amber-400 font-mono">
                    LOTE ACTIVO: {loteActual.idLote} ({loteActual.amasadora}) — Receta: {loteActual.receta}
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Carga Total: <span className="text-emerald-400 font-bold">{loteActual.cargaTotalKg} Kg</span> | Clic aquí para desplegar/ocultar trazabilidad.
                  </div>
                </div>
              </div>
              <div className="text-xs text-amber-400 font-bold bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                {acordeonAbierto ? "Ocultar Trazabilidad ▲" : "Ver Trazabilidad Completa ▼"}
              </div>
            </div>

            {acordeonAbierto && (
              <div className="p-4 bg-slate-950/80 border-t border-slate-800 space-y-3">
                <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <span>🔍</span> Trazabilidad Detallada de los Pedidos en este Lote ({loteActual.pedidosAsociados.length}):
                </div>
                <div className="overflow-x-auto max-h-64">
                  <table className="w-full text-left text-[11px] border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                        <th className="p-2.5">ID Pedido / Observación</th>
                        <th className="p-2.5">Cliente</th>
                        <th className="p-2.5">Producto (Modelo)</th>
                        <th className="p-2.5">Tipo de Masa</th>
                        <th className="p-2.5">Cobertura y Topping</th>
                        <th className="p-2.5 text-center">Cantidad</th>
                        <th className="p-2.5 text-center">Seguridad</th>
                        <th className="p-2.5 text-center">Bodega</th>
                        <th className="p-2.5 text-center text-emerald-400 font-bold">Total</th>
                        <th className="p-2.5 text-center text-amber-400 font-bold">Masa (Kg)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-slate-300">
                      {loteActual.pedidosAsociados.map((p) => {
                        const pesoKg = ((p.cantidadNetaFabricar * p.gramajePiezaG) / 1000).toFixed(2);
                        return (
                          <tr key={p.loteId} className="hover:bg-slate-900/40">
                            <td className="p-2.5 font-mono">
                              <div className="text-amber-400 font-bold">{p.loteId}</div>
                              <div className="text-[9px] text-amber-200/90 bg-amber-500/10 px-1 py-0.5 rounded mt-0.5 border border-amber-500/20 font-sans">
                                {p.observaciones}
                              </div>
                            </td>
                            <td className="p-2.5 font-semibold">{p.cliente}</td>
                            <td className="p-2.5 text-slate-200 font-medium">{p.producto}</td>
                            <td className="p-2.5 text-slate-400">{p.tipoMasa}</td>
                            <td className="p-2.5 text-slate-400">{p.cobertura} + {p.topping}</td>
                            <td className="p-2.5 text-center font-mono">{p.cantidadSolicitada}</td>
                            <td className="p-2.5 text-center font-mono">{p.unidadesSeguridad}</td>
                            <td className="p-2.5 text-center font-mono">{p.existenciaBodega}</td>
                            <td className="p-2.5 text-center font-mono font-bold text-emerald-400">{p.cantidadNetaFabricar}</td>
                            <td className="p-2.5 text-center font-mono font-bold text-amber-400">{pesoKg} Kg</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* 3. FORMATO DE RECETA CENTRADO Y CON DATOS GRANDES */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 max-w-3xl mx-auto">
            
            <div className="bg-amber-400 text-slate-950 py-3 px-6 rounded-xl text-center font-black text-base uppercase tracking-wider shadow-md">
              RECETA PARA {loteActual.receta.toUpperCase()}
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900 shadow-inner">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-200 border-b border-slate-800 text-xs font-black">
                    <th className="p-3.5">DESCRIPCION</th>
                    <th className="p-3.5 text-center font-mono">gr (Base)</th>
                    <th className="p-3.5 text-center font-mono">PORC %</th>
                    <th className="p-3.5 text-center font-mono text-emerald-400 bg-emerald-950/40">GRAMOS (Calculados)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-sm">
                  {ingredientesBase.map((item, idx) => {
                    const gramosCalculados = Math.round(item.grBase * factorEscala);
                    return (
                      <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5 font-bold text-slate-100">{item.descripcion}</td>
                        <td className="p-3.5 text-center font-mono text-slate-300 font-semibold">
                          {item.grBase > 0 ? item.grBase.toLocaleString() : ""}
                        </td>
                        <td className="p-3.5 text-center font-mono text-slate-300 font-semibold">
                          {item.porc > 0 ? item.porc.toFixed(2) : "0.00"}
                        </td>
                        <td className="p-3.5 text-center font-mono text-emerald-400 font-black text-base bg-emerald-950/20">
                          {gramosCalculados > 0 ? gramosCalculados.toLocaleString() : "0"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-amber-400 text-slate-950 font-black text-base border-t-2 border-amber-500">
                    <td className="p-4 uppercase tracking-wide">Masa Total</td>
                    <td className="p-4 text-center font-mono">{totalGrBase.toLocaleString()}</td>
                    <td className="p-4 text-center font-mono">{totalPorcBase.toFixed(0)}</td>
                    <td className="p-4 text-center font-mono text-lg font-black bg-amber-500/80 text-slate-950">
                      {Math.round(totalGrBase * factorEscala).toLocaleString()} g
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* 4. BLOQUE DE FIRMA Y RESPONSABLE DE PESAJE + BARRA SUPERUSER FOOTER */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                👤 RESPONSABLE DE SALA DE PESAJE
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Cédula del Operador:</label>
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
                    className="w-full bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-lg px-3 py-2 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Nombre Autorizado:</label>
                  <div className="w-full bg-slate-950 text-xs text-amber-400 font-bold border border-slate-800 rounded-lg px-3 py-2 flex items-center">
                    {responsableNombre}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    if (!responsableCedula.trim() || responsableNombre.includes("Ingrese")) {
                      alert("⚠️ POKA-YOKE: Debe ingresar una cédula válida del responsable para validar el pesaje.");
                      return;
                    }
                    alert(`✅ Pesaje del Lote ${loteActual.idLote} validado y registrado por ${responsableNombre}. Avanzando a Estación 3 (Amasijo).`);
                    if (onLoteCompletado) onLoteCompletado(loteActual);
                  }}
                  className="px-6 py-3 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-lg hover:bg-emerald-400 hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>🥣</span> VALIDAR PESAJE Y AVANZAR A ESTACIÓN 3 (AMASIJO IRREVERSIBLE)
                </button>
              </div>

              {/* 🛠️ BARRA DE EDICIÓN / SUPERUSER AL PIE DE PÁGINA (ESTACIÓN 2) */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 bg-slate-950/80 p-2.5 rounded-lg">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">🛠️ Barra de Superusuario (Pesaje):</span>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => alert("👁️ [Ver]: Modo inspección de receta activo.")} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px] font-bold flex items-center gap-1 transition-all">👁️ Ver</button>
                  <button onClick={() => alert("✏️ [Editar]: Modo edición de proporciones activo.")} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded text-[10px] font-bold flex items-center gap-1 transition-all">✏️ Editar</button>
                  <button onClick={() => alert("➕ [Crear]: Nueva línea de ingrediente en receta.")} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded text-[10px] font-bold flex items-center gap-1 transition-all">➕ Crear</button>
                  <button onClick={() => alert("🗑️ [Eliminar]: Purgar ingrediente seleccionado.")} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-red-400 rounded text-[10px] font-bold flex items-center gap-1 transition-all">🗑️ Eliminar</button>
                  <button onClick={() => alert("📥 [Descargar]: Descargando hoja de pesaje.")} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded text-[10px] font-bold flex items-center gap-1 transition-all">📥 Descargar</button>
                  <button onClick={() => window.print()} className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded text-[10px] font-black flex items-center gap-1 transition-all">🖨️ Imprimir</button>
                </div>
              </div>

            </div>

          </div>
        </>
      )}

    </div>
  );
}