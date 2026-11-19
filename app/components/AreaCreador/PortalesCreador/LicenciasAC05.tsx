"use client";

import React from "react";

export default function LicenciasAC05() {
  const licencias = [
    {
      licencia: "LIC-SALAM-001",
      cliente: "Panadería & Distribuidora Salam (Planta Central)",
      equipo: "WIN11-PRO • IP 192.168.100.145 • Parche Telemetría: OK",
      estado: "EN LÍNEA",
    },
    {
      licencia: "LIC-CLIENT-002",
      cliente: "Cliente Corporativo #02 (Sucursal Norte)",
      equipo: "WIN10-ENT • Huella Hardware Capturada • Parche: OK",
      estado: "LISTO PARA SOPORTE",
    },
  ];

  return (
    <div className="space-y-4 text-white font-mono text-xs">
      <div className="bg-cyan-950/20 border border-cyan-500/30 p-4 rounded-xl">
        <h3 className="text-sm font-bold text-cyan-300 uppercase">🌐 Consola de Telemetría Silenciosa y Asistencia Remota</h3>
        <p className="text-xs text-slate-300 mt-1">Autoriza enlaces directos de soporte sin instalar programas de terceros.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {licencias.map((lic, i) => (
          <div key={i} className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-amber-400">{lic.licencia}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/40">{lic.estado}</span>
            </div>
            <h4 className="text-sm font-bold text-white">{lic.cliente}</h4>
            <p className="text-[11px] font-mono text-slate-400">{lic.equipo}</p>
            <button
              onClick={() => alert(`Iniciando túnel de soporte remoto con ${lic.licencia}...`)}
              className="w-full py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-lg cursor-pointer"
            >
              ⚡ Conectar Asistencia Remota Directa
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}