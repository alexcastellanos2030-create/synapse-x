"use client";

import React, { useState } from "react";

export type RamaSoporte = "Técnico" | "Ingeniero";
export type NivelRango = "Nivel 1 (Básico)" | "Nivel 2 (Medio)" | "Nivel 3 (Avanzado)";

export interface PersonalSoporte {
  id: string;
  nombre: string;
  cedula: string;
  rama: RamaSoporte;
  nivel: NivelRango;
  activo: boolean;
}

export default function StaffAC04() {
  const [staffSoporte, setStaffSoporte] = useState<PersonalSoporte[]>([
    { id: "SUP-01", nombre: "Carlos Mendoza", cedula: "V-18450210", rama: "Técnico", nivel: "Nivel 1 (Básico)", activo: true },
    { id: "SUP-02", nombre: "Ing. Valeria Ríos", cedula: "V-15230988", rama: "Ingeniero", nivel: "Nivel 3 (Avanzado)", activo: true },
  ]);

  const [nombreStaff, setNombreStaff] = useState("");
  const [cedulaStaff, setCedulaStaff] = useState("");
  const [ramaStaff, setRamaStaff] = useState<RamaSoporte>("Técnico");
  const [nivelStaff, setNivelStaff] = useState<NivelRango>("Nivel 1 (Básico)");
  const [busquedaStaff, setBusquedaStaff] = useState("");

  const registrarPersonalSoporte = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreStaff.trim() || !cedulaStaff.trim()) {
      alert("Por favor complete el nombre y la cédula del personal.");
      return;
    }

    const nuevoPersonal: PersonalSoporte = {
      id: `SUP-${Date.now()}`,
      nombre: nombreStaff,
      cedula: cedulaStaff,
      rama: ramaStaff,
      nivel: nivelStaff,
      activo: true,
    };

    setStaffSoporte([...staffSoporte, nuevoPersonal]);
    setNombreStaff("");
    setCedulaStaff("");
    alert("Personal de soporte registrado con éxito.");
  };

  const toggleEstadoStaff = (id: string) => {
    setStaffSoporte(staffSoporte.map(s => s.id === id ? { ...s, activo: !s.activo } : s));
  };

  const eliminarStaff = (id: string) => {
    if (!confirm("¿Está seguro de eliminar este miembro del staff?")) return;
    setStaffSoporte(staffSoporte.filter(s => s.id !== id));
  };

  const staffFiltrado = staffSoporte.filter(s =>
    s.nombre.toLowerCase().includes(busquedaStaff.toLowerCase()) ||
    s.cedula.toLowerCase().includes(busquedaStaff.toLowerCase())
  );

  return (
    <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-6 shadow-2xl font-mono text-xs space-y-6">
      {/* CABECERA */}
      <div className="bg-amber-950/20 border border-amber-500/40 p-4 rounded-xl flex justify-between items-center text-white">
        <div>
          <h3 className="text-sm font-bold text-amber-300 uppercase">👥 Portal AC04 — Técnicos, Ingenieros & Staff de Soporte</h3>
          <p className="text-xs text-slate-300 mt-1">Gobernanza de técnicos, ingenieros y control de niveles de acceso del personal operativo.</p>
        </div>
        <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-lg text-[10px] font-bold">
          TOTAL: {staffSoporte.length} MIEMBROS
        </span>
      </div>

      {/* BARRA DE BÚSQUEDA */}
      <div className="flex items-center space-x-2">
        <input 
          type="text" 
          placeholder="🔍 Buscar por nombre o cédula de soporte..." 
          value={busquedaStaff} 
          onChange={e => setBusquedaStaff(e.target.value)} 
          className="flex-1 bg-black border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 outline-none" 
        />
      </div>

      {/* FORMULARIO DE REGISTRO */}
      <form onSubmit={registrarPersonalSoporte} className="grid grid-cols-1 sm:grid-cols-5 gap-3 bg-black/40 p-4 rounded-xl border border-slate-800 text-white">
        <div>
          <label className="text-[10px] text-slate-400 block mb-1">Nombre y Apellido</label>
          <input 
            type="text" 
            placeholder="Ej. Carlos Mendoza" 
            value={nombreStaff} 
            onChange={e => setNombreStaff(e.target.value)} 
            required 
            className="w-full bg-black border border-slate-700 rounded-lg p-2 text-white" 
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-400 block mb-1">Cédula</label>
          <input 
            type="text" 
            placeholder="Ej. V-18450210" 
            value={cedulaStaff} 
            onChange={e => setCedulaStaff(e.target.value)} 
            required 
            className="w-full bg-black border border-slate-700 rounded-lg p-2 text-white" 
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-400 block mb-1">Rama</label>
          <select 
            value={ramaStaff} 
            onChange={e => setRamaStaff(e.target.value as RamaSoporte)} 
            className="w-full bg-black border border-slate-700 rounded-lg p-2 text-white font-bold"
          >
            <option value="Técnico">Técnico</option>
            <option value="Ingeniero">Ingeniero</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] text-slate-400 block mb-1">Nivel de Rango</label>
          <select 
            value={nivelStaff} 
            onChange={e => setNivelStaff(e.target.value as NivelRango)} 
            className="w-full bg-black border border-slate-700 rounded-lg p-2 text-amber-400 font-bold"
          >
            <option value="Nivel 1 (Básico)">Nivel 1 (Básico)</option>
            <option value="Nivel 2 (Medio)">Nivel 2 (Medio)</option>
            <option value="Nivel 3 (Avanzado)">Nivel 3 (Avanzado)</option>
          </select>
        </div>
        <div className="flex items-end">
          <button 
            type="submit" 
            className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition cursor-pointer text-xs"
          >
            + Registrar Staff
          </button>
        </div>
      </form>

      {/* CONTENEDOR TIPO TABLA */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-3 bg-slate-950 border-b border-slate-800 flex justify-between items-center text-white">
          <span className="font-bold text-amber-400 text-xs uppercase">📋 Listado de Personal de Soporte Activo</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-white">
            <thead>
              <tr className="bg-black/60 text-slate-400 text-[10px] uppercase border-b border-slate-800 font-mono">
                <th className="p-3">Cédula</th>
                <th className="p-3">Nombre Completo</th>
                <th className="p-3">Rama</th>
                <th className="p-3">Nivel</th>
                <th className="p-3 text-center">Estado</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {staffFiltrado.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3">
                    <span className="px-2 py-1 bg-black text-amber-400 rounded-lg border border-slate-800 text-[10px] font-bold">
                      {s.cedula}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-white">{s.nombre}</td>
                  <td className="p-3 text-cyan-300 text-[11px]">{s.rama}</td>
                  <td className="p-3 text-amber-300 text-[11px]">{s.nivel}</td>
                  <td className="p-3 text-center">
                    <button
                      type="button"
                      onClick={() => toggleEstadoStaff(s.id)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition shadow-sm ${
                        s.activo 
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-900" 
                          : "bg-red-950 text-red-400 border border-red-500/40 hover:bg-red-900"
                      }`}
                    >
                      {s.activo ? "🟢 ACTIVO" : "🔴 INACTIVO"}
                    </button>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => eliminarStaff(s.id)}
                      className="px-2.5 py-1 bg-red-500/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg text-[10px] font-bold transition cursor-pointer border border-red-500/40"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {staffFiltrado.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No se encontró personal registrado en este portal.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}