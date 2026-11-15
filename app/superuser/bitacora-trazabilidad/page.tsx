"use client";

import React, { useState } from "react";

export interface RegistroBitacora {
  idLog: string;
  loteId: string;
  estacion: string;
  operador: string;
  cedula: string;
  timestamp: string;
  accion: string;
}

export default function BitacoraTrazabilidadPage() {
  const [registros] = useState<RegistroBitacora[]>([
    {
      idLog: "LOG-9001",
      loteId: "LOTE-1042",
      estacion: "Estación 1: Armado de Lote",
      operador: "Alexander Segundo Castellanos Perozo",
      cedula: "10433935",
      timestamp: "2026-10-18 22:45:12",
      accion: "Armado de lote con Masa Brioche Tradicional (Batidora 63 Kg)",
    },
    {
      idLog: "LOG-9002",
      loteId: "LOTE-1040",
      estacion: "Estación 7: Empaque",
      operador: "Alexander Segundo Castellanos Perozo",
      cedula: "10433935",
      timestamp: "2026-10-18 22:30:00",
      accion: "Certificación y liberación de pedidos de Distribuidora Comercial Salam",
    },
  ]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-6 text-xs font-sans text-slate-100">
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-md flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-amber-400 flex items-center gap-2">
            🛡️ Superusuario — Bitácora de Trazabilidad de Pedidos y Lotes
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Registro satelital y auditoría en tiempo real de operaciones, cédulas y marcas de tiempo del taller.
          </p>
        </div>
      </div>

      <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 shadow-xl overflow-x-auto">
        <table className="w-full text-left border-collapse text-[11px]">
          <thead>
            <tr className="bg-slate-950 text-slate-300 font-bold border-b border-slate-800 text-[10px] uppercase">
              <th className="p-3">ID Log</th>
              <th className="p-3">Lote / Pedido</th>
              <th className="p-3">Estación Operativa</th>
              <th className="p-3">Operador Responsable</th>
              <th className="p-3">Cédula</th>
              <th className="p-3">Fecha y Hora (Timestamp)</th>
              <th className="p-3">Acción Registrada</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {registros.map((log) => (
              <tr key={log.idLog} className="hover:bg-slate-900/60">
                <td className="p-3 font-mono font-bold text-amber-400">{log.idLog}</td>
                <td className="p-3 font-mono font-bold text-slate-200">{log.loteId}</td>
                <td className="p-3 text-cyan-300 font-medium">{log.estacion}</td>
                <td className="p-3 text-slate-100 font-bold">{log.operador}</td>
                <td className="p-3 font-mono text-slate-400">{log.cedula}</td>
                <td className="p-3 font-mono text-emerald-400">{log.timestamp}</td>
                <td className="p-3 text-slate-300">{log.accion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}