// components/TablaTrazabilidadEstandar.tsx
import React from "react";
import { PedidoOperativo } from "../estaciones/estacion-1/page";

interface Props {
  pedidos: PedidoOperativo[];
  esClaro: boolean;
}

export default function TablaTrazabilidadEstandar({ pedidos, esClaro }: Props) {
  return (
    <div className={`overflow-x-auto max-h-60 rounded-lg border ${esClaro ? "border-slate-300 bg-white shadow-md" : "border-slate-800 bg-slate-950/80"}`}>
      <table className="w-full text-left text-[11px] border-collapse font-sans">
        <thead>
          <tr className={`${esClaro ? "bg-slate-200 text-slate-700 border-b border-slate-300" : "bg-slate-900 text-slate-400 border-b border-slate-800"} font-mono`}>
            <th className="p-2.5">1. ID Pedido / Obs</th>
            <th className="p-2.5">2. Cliente / Local / Tel</th>
            <th className="p-2.5">3. Producto</th>
            <th className="p-2.5">4. Tipo de Masa</th>
            <th className="p-2.5">5. Cobertura, Topping y Glaseado</th>
            <th className="p-2.5 text-center">6. Cant. Pedido</th>
            <th className="p-2.5 text-center">7. Seguridad</th>
            <th className="p-2.5 text-center">8. Bodega</th>
            <th className="p-2.5 text-center text-emerald-600 font-bold">9. Total a Fabricar</th>
            <th className="p-2.5 text-center text-amber-600 font-bold">10. Peso Masa (Kg)</th>
          </tr>
        </thead>
        <tbody className={`divide-y ${esClaro ? "divide-slate-200 text-slate-800" : "divide-slate-900 text-slate-300"} text-[11px]`}>
          {pedidos.map((p) => {
            const pesoMasaKg = ((p.cantidadNetaFabricar * p.gramajePiezaG) / 1000).toFixed(2);
            return (
              <tr key={p.loteId} className={`${esClaro ? "hover:bg-slate-100" : "hover:bg-slate-900/60"} transition-colors`}>
                <td className="p-2.5 font-mono">
                  <div className={`${esClaro ? "text-amber-700" : "text-amber-400"} font-bold`}>{p.loteId}</div>
                  <div className={`text-[9px] ${esClaro ? "text-amber-800 bg-amber-100 border-amber-300" : "text-amber-200 bg-amber-500/10 border-amber-500/20"} px-1.5 py-0.5 rounded mt-0.5 inline-block font-sans border`}>
                    {p.observaciones || "Sin observación"}
                  </div>
                </td>
                <td className={`p-2.5 font-semibold ${esClaro ? "text-slate-900" : "text-slate-100"}`}>
                  {p.cliente}
                </td>
                <td className={`p-2.5 ${esClaro ? "text-slate-800 font-medium" : "text-slate-200 font-medium"}`}>{p.producto}</td>
                <td className={`p-2.5 ${esClaro ? "text-slate-700" : "text-slate-300"}`}>{p.tipoMasa}</td>
                <td className={`p-2.5 font-mono text-[10px] ${esClaro ? "text-slate-700" : "text-slate-300"}`}>
                  {p.cobertura || "Estándar"} + {p.topping || "Sin Topping"} (Glaseado)
                </td>
                <td className="p-2.5 text-center font-mono">{p.cantidadSolicitada} uds</td>
                <td className={`p-2.5 text-center font-mono ${esClaro ? "text-slate-500" : "text-slate-400"}`}>{p.unidadesSeguridad}</td>
                <td className={`p-2.5 text-center font-mono ${esClaro ? "text-slate-500" : "text-slate-400"}`}>{p.existenciaBodega}</td>
                <td className={`p-2.5 text-center font-mono font-bold text-xs ${esClaro ? "text-emerald-700 bg-emerald-50" : "text-emerald-400 bg-emerald-950/20"}`}>
                  {p.cantidadNetaFabricar} uds
                </td>
                <td className={`p-2.5 text-center font-mono font-bold text-xs ${esClaro ? "text-amber-700 bg-amber-50" : "text-amber-400 bg-amber-950/20"}`}>
                  {pesoMasaKg} Kg
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}