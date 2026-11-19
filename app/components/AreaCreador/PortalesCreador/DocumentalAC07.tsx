"use client";

import React, { useState } from "react";

export interface EnlaceMaestro {
  id: string;
  nombre: string;
  url: string;
  color: string;
}

export default function DocumentalAC07() {
  const [enlacesMaestros, setEnlacesMaestros] = useState<EnlaceMaestro[]>([
    { id: "LNK-1", nombre: "Correo Electrónico (Gmail)", url: "https://mail.google.com", color: "amber" },
    { id: "LNK-2", nombre: "WhatsApp Web Personal", url: "https://web.whatsapp.com", color: "emerald" },
    { id: "LNK-3", nombre: "Panel Supabase DB", url: "https://supabase.com/dashboard", color: "cyan" },
    { id: "LNK-4", nombre: "Vercel Despliegues", url: "https://vercel.com", color: "purple" },
  ]);
  const [nuevoEnlaceNombre, setNuevoEnlaceNombre] = useState("");
  const [nuevoEnlaceUrl, setNuevoEnlaceUrl] = useState("");
  const [docTab, setDocTab] = useState<"permisos" | "protocolos" | "reglamento" | "arquitectura_root" | "seguridad" | "enlaces">("enlaces");

  const agregarEnlaceMaestro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoEnlaceNombre.trim() || !nuevoEnlaceUrl.trim()) return;
    const urlFormateada = nuevoEnlaceUrl.startsWith("http") ? nuevoEnlaceUrl : `https://${nuevoEnlaceUrl}`;
    setEnlacesMaestros((prev) => [...prev, { id: `LNK-${Date.now()}`, nombre: nuevoEnlaceNombre, url: urlFormateada, color: "amber" }]);
    setNuevoEnlaceNombre("");
    setNuevoEnlaceUrl("");
  };

  return (
    <div className="space-y-5 text-white font-mono text-xs">
      <div className="flex flex-wrap gap-2">
        {[
          { id: "enlaces", label: "⚡ Accesos Rápidos" },
          { id: "permisos", label: "📅 Permisos y Vigencias" },
          { id: "protocolos", label: "📜 Protocolos Operativos" },
          { id: "reglamento", label: "📖 Reglamento Interno OS" },
          { id: "arquitectura_root", label: "🔒 Arquitectura por Capas" },
          { id: "seguridad", label: "🛡️ Seguridad e Higiene" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setDocTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
              docTab === tab.id ? "bg-amber-500 text-black" : "bg-slate-900 text-slate-300 border border-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {docTab === "enlaces" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {enlacesMaestros.map((enlace) => (
              <a
                key={enlace.id}
                href={enlace.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-slate-900 hover:bg-slate-800 border border-amber-500/40 rounded-xl flex flex-col justify-between gap-2 transition"
              >
                <span className="text-xs font-bold text-white">🔗 {enlace.nombre}</span>
                <span className="text-[10px] font-mono text-slate-400 truncate">{enlace.url}</span>
              </a>
            ))}
          </div>

          <form onSubmit={agregarEnlaceMaestro} className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900/70 p-4 rounded-xl border border-slate-800 mt-4">
            <input type="text" placeholder="Nombre del botón" value={nuevoEnlaceNombre} onChange={(e) => setNuevoEnlaceNombre(e.target.value)} className="bg-black border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none" />
            <input type="text" placeholder="URL destino" value={nuevoEnlaceUrl} onChange={(e) => setNuevoEnlaceUrl(e.target.value)} className="bg-black border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none" />
            <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg py-2 px-4 cursor-pointer">+ Crear Botón</button>
          </form>
        </div>
      )}

      {docTab === "permisos" && (
        <div className="space-y-3">
          {[{ nombre: "Permiso Sanitario Planta Producción", vence: "2027-03-15" }, { nombre: "Certificación Control Plagas", vence: "2027-01-10" }].map((p, i) => (
            <div key={i} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center">
              <div>{p.nombre}</div>
              <div className="text-amber-400">Vence: {p.vence}</div>
            </div>
          ))}
        </div>
      )}

      {docTab === "protocolos" && (
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs text-slate-300">
          <p>1. Verificación de temperatura y humedad antes de iniciar amasado.</p>
          <p>2. Registro obligatorio de lotes y tiempos de fermentación.</p>
        </div>
      )}

      {docTab === "reglamento" && (
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs text-slate-300">
          <p>• Cada operario, técnico o ingeniero es responsable único de su cédula y clave de acceso.</p>
        </div>
      )}

      {docTab === "arquitectura_root" && (
        <div className="p-5 bg-amber-950/20 border border-amber-500/40 rounded-xl space-y-2 text-xs text-slate-200">
          <p><strong>Capa 1:</strong> Núcleo Creador y Bóveda Familiar.</p>
          <p><strong>Capa 2:</strong> Gobernanza Superuser (Técnicos e Ingenieros).</p>
        </div>
      )}

      {docTab === "seguridad" && (
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs text-slate-300">
          <p>• Uso obligatorio de cofia, mascarilla y calzado antideslizante.</p>
        </div>
      )}
    </div>
  );
}