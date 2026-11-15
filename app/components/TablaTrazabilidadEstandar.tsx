"use client";

import React from "react";
import { PedidoOperativo } from "../estaciones/estacion-1/page";

interface TablaTrazabilidadProps {
  pedidos: PedidoOperativo[];
  esClaro?: boolean;
}

export default function TablaTrazabilidadEstandar({ pedidos, esClaro = false }: TablaTrazabilidadProps) {
  return (
    <div className="w-full space-y-2">
      {/* Contenedor completamente abierto, sin alturas fijas ni barras de scroll vertical */}
      <div className="w-full overflow-x-auto rounded-lg border border-slate-300 dark:border-slate-800">
        <table className="w-full text-left border-collapse text-[11px]">
          <thead className="bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 font-mono">
            <tr>
              <th className="p-2.5">ID Pedido</th>
              <th className="p-2.5">Cliente</th>
              <th className="p-2.5">Producto</th>
              <th className="p-2.5">Tipo de Masa</th>
              <th className="p-2.5 text-center">Gramaje</th>
              <th className="p-2.5 text-center">Cant. Solicitada</th>
              <th className="p-2.5 text-center">Seguridad (10%)</th>
              <th className="p-2.5 text-center">Bodega</th>
              <th className="p-2.5 text-center font-bold text-amber-600 dark:text-amber-400">Neto a Fabricar</th>
              <th className="p-2.5">Modalidad</th>
              <th className="p-2.5">F. Recepción</th>
              <th className="p-2.5">F. Entrega</th>
              <th className="p-2.5">Cobertura</th>
              <th className="p-2.5">Topping</th>
              <th className="p-2.5">Obs. Bodega</th>
              <th className="p-2.5">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {pedidos.length === 0 ? (
              <tr>
                <td colSpan={16} className="p-6 text-center text-slate-500 italic">
                  No hay registros en la trazabilidad estándar.
                </td>
              </tr>
            ) : (
              pedidos.map((p) => (
                <tr key={p.loteId} className="hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-2.5 font-mono font-bold text-amber-700 dark:text-amber-300">{p.loteId}</td>
                  <td className="p-2.5 font-semibold text-slate-900 dark:text-slate-100">{p.cliente}</td>
                  <td className="p-2.5 text-slate-800 dark:text-slate-200">{p.producto}</td>
                  <td className="p-2.5 text-slate-700 dark:text-slate-300">{p.tipoMasa}</td>
                  <td className="p-2.5 font-mono text-center text-cyan-600 dark:text-cyan-400 font-bold">{p.gramajePiezaG}g</td>
                  <td className="p-2.5 font-mono text-center text-slate-800 dark:text-slate-200">{p.cantidadSolicitada}</td>
                  <td className="p-2.5 font-mono text-center text-slate-500">{p.unidadesSeguridad}</td>
                  <td className="p-2.5 font-mono text-center text-slate-500">{p.existenciaBodega}</td>
                  <td className="p-2.5 font-mono text-center font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10">
                    {p.cantidadNetaFabricar} unids
                  </td>
                  <td className="p-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.modalidad === "Urgente" 
                        ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300" 
                        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}>
                      {p.modalidad}
                    </span>
                  </td>
                  <td className="p-2.5 font-mono text-[10px] text-slate-500">{p.fechaRecepcion}</td>
                  <td className="p-2.5 font-mono text-[10px] text-slate-500">{p.fechaEntrega}</td>
                  <td className="p-2.5 text-slate-600 dark:text-slate-400 text-[10px]">{p.cobertura}</td>
                  <td className="p-2.5 text-slate-600 dark:text-slate-400 text-[10px]">{p.topping}</td>
                  <td className="p-2.5 text-slate-500 italic text-[10px]">{p.observacionBodega}</td>
                  <td className="p-2.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.estado === "En Cola" 
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-500/25 dark:text-amber-300" 
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/25 dark:text-emerald-300"
                    }`}>
                      {p.estado}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}