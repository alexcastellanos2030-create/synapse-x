"use client";

import React, { useState, useEffect } from "react";

interface DashboardPrincipalProps {
  onNavegarPestaña: (id: number) => void;
  nombreOperador: string;
  cargoOperador: string;
}

export default function DashboardPrincipal({
  onNavegarPestaña,
  nombreOperador,
  cargoOperador,
}: DashboardPrincipalProps) {
  
  // Estados para controlar qué acordeón está abierto (1 al 4)
  const [acordeonActivo, setAcordeonActivo] = useState<number | null>(null);
  const [isDesglosado, setIsDesglosado] = useState(false);
  const [printTimestamp, setPrintTimestamp] = useState('');

  useEffect(() => {
    const now = new Date();
    setPrintTimestamp(now.toLocaleDateString('es-CL') + ' ' + now.toLocaleTimeString('es-CL'));
  }, []);

  const toggleAcordeon = (id: number) => {
    setAcordeonActivo(acordeonActivo === id ? null : id);
  };

  // Datos globales vs desglosados del parte diario
  const dataGlobal = [
    { descripcion: "Pan de Molde Integral", cantidad_solicitada: "450 und", gramos_unidad: "650g", seguridad: "+5%", existencia_bodega: "30 und", total_elaborar: "442 und", harina_usar: "248.5 kg", masa_total: "292.0 kg" },
    { descripcion: "Pan Frica Clásico", cantidad_solicitada: "1,200 und", gramos_unidad: "85g", seguridad: "+4%", existencia_bodega: "150 und", total_elaborar: "1,098 und", harina_usar: "83.5 kg", masa_total: "96.4 kg" },
    { descripcion: "Pan Pita Artesanal", cantidad_solicitada: "800 und", gramos_unidad: "90g", seguridad: "+5%", existencia_bodega: "80 und", total_elaborar: "760 und", harina_usar: "61.5 kg", masa_total: "72.2 kg" },
    { descripcion: "Pan Brioche Especial", cantidad_solicitada: "300 und", gramos_unidad: "120g", seguridad: "+6%", existencia_bodega: "20 und", total_elaborar: "298 und", harina_usar: "32.0 kg", masa_total: "38.1 kg" }
  ];

  const dataDesglosada = [
    { descripcion: "Pan de Molde Integral (Cliente: Supermercados Sur)", cantidad_solicitada: "250 und", gramos_unidad: "650g", seguridad: "+5%", existencia_bodega: "15 und", total_elaborar: "248 und", harina_usar: "139.5 kg", masa_total: "163.8 kg" },
    { descripcion: "Pan de Molde Integral (Cliente: Minimarket Central)", cantidad_solicitada: "200 und", gramos_unidad: "650g", seguridad: "+5%", existencia_bodega: "15 und", total_elaborar: "194 und", harina_usar: "109.0 kg", masa_total: "128.2 kg" },
    { descripcion: "Pan Frica Clásico (Cliente: Hamburguesería Don Pancho)", cantidad_solicitada: "800 und", gramos_unidad: "85g", seguridad: "+4%", existencia_bodega: "100 und", total_elaborar: "732 und", harina_usar: "55.7 kg", masa_total: "64.3 kg" },
    { descripcion: "Pan Frica Clásico (Cliente: Confitería La Plaza)", cantidad_solicitada: "400 und", gramos_unidad: "85g", seguridad: "+4%", existencia_bodega: "50 und", total_elaborar: "366 und", harina_usar: "27.8 kg", masa_total: "32.1 kg" },
    { descripcion: "Pan Pita Artesanal (Cliente: Distribuidora Oriente)", cantidad_solicitada: "500 und", gramos_unidad: "90g", seguridad: "+5%", existencia_bodega: "50 und", total_elaborar: "475 und", harina_usar: "38.4 kg", masa_total: "45.1 kg" },
    { descripcion: "Pan Pita Artesanal (Cliente: Local Express Ñuñoa)", cantidad_solicitada: "300 und", gramos_unidad: "90g", seguridad: "+5%", existencia_bodega: "30 und", total_elaborar: "285 und", harina_usar: "23.0 kg", masa_total: "27.1 kg" },
    { descripcion: "Pan Brioche Especial (Cliente: Cafetería Gourmet)", cantidad_solicitada: "300 und", gramos_unidad: "120g", seguridad: "+6%", existencia_bodega: "20 und", total_elaborar: "298 und", harina_usar: "32.0 kg", masa_total: "38.1 kg" }
  ];

  const dataset = isDesglosado ? dataDesglosada : dataGlobal;

  const handleAction = (actionName: string) => {
    alert(`[MODO SUPERUSER - SYNEXIS-X]\nAcción ejecutada: [${actionName}]\nPermisos validados para: ${nombreOperador || 'Alex Castellanos'}`);
  };

  return (
    <div className="space-y-6 font-sans text-white">
      
      {/* TARJETA DE BIENVENIDA Y ESTADO DE TURNO */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-black px-2.5 py-0.5 rounded font-mono text-[10px] font-black uppercase">
              OS-AI Industrial
            </span>
            <span className="text-zinc-400 font-mono text-xs">Santiago de Chile • Command-Nexus Intelligence</span>
          </div>
          <h2 className="text-xl font-mono font-black text-amber-400 uppercase tracking-wide">
            Centro de Inteligencia Operativa
          </h2>
          <p className="text-xs text-zinc-300">
            Superusuario: <strong className="text-white">{nombreOperador || "Alex Castellanos"}</strong> ({cargoOperador || "Jefe de Taller"})
          </p>
        </div>

        <div className="flex items-center gap-3 bg-black/60 px-4 py-3 rounded-2xl border border-zinc-800">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
          <div className="font-mono text-xs">
            <span className="text-zinc-400 block text-[9px]">Radar Ejecutivo</span>
            <strong className="text-emerald-400">🟢 Sistema En Línea (60 Pedidos)</strong>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* WIDGETS DE KPIs CLAVE CON ACORDEÓN INTERACTIVO Y BOTONES PARPARDEANTES    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* WIDGET 1: Pedidos en Cola */}
        <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 shadow-xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">🔴 Pedidos en Cola</span>
            <button 
              type="button"
              onClick={() => toggleAcordeon(1)}
              className="px-3 py-1.5 bg-red-500/30 text-red-300 border border-red-500 rounded-xl text-xs font-mono font-bold animate-pulse shadow-lg cursor-pointer hover:bg-red-500 hover:text-black transition"
            >
              {acordeonActivo === 1 ? '▲ Ocultar (15)' : '▼ Desglosar (15)'}
            </button>
          </div>
          <div className="text-3xl font-mono font-black text-red-400">15 unids</div>
          <p className="text-[10px] text-zinc-500">Pendientes de asignación a lote de masa</p>

          {/* Acordeon Desplegable Widget 1 */}
          {acordeonActivo === 1 && (
            <div className="mt-3 p-3 bg-black/80 border border-red-500/40 rounded-xl space-y-2 font-mono text-[11px]">
              <div className="text-red-300 font-bold border-b border-zinc-800 pb-1">Detalle: 15 Unidades en Cola</div>
              <div className="space-y-1 text-zinc-300">
                <div className="flex justify-between"><span>Pedido #102 (Pan Molde)</span><span className="text-red-400">5 unds</span></div>
                <div className="flex justify-between"><span>Pedido #105 (Pan Frica)</span><span className="text-red-400">6 unds</span></div>
                <div className="flex justify-between"><span>Pedido #108 (Pan Pita)</span><span className="text-red-400">4 unds</span></div>
              </div>
            </div>
          )}
        </div>

        {/* WIDGET 2: En Tránsito */}
        <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 shadow-xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">🟡 En Tránsito</span>
            <button 
              type="button"
              onClick={() => toggleAcordeon(2)}
              className="px-3 py-1.5 bg-amber-500/30 text-amber-300 border border-amber-500 rounded-xl text-xs font-mono font-bold animate-pulse shadow-lg cursor-pointer hover:bg-amber-500 hover:text-black transition"
            >
              {acordeonActivo === 2 ? '▲ Ocultar (23)' : '▼ Desglosar (23)'}
            </button>
          </div>
          <div className="text-3xl font-mono font-black text-amber-400">23 lotes</div>
          <p className="text-[10px] text-zinc-500">Proceso activo en amasadoras y hornos</p>

          {/* Acordeon Desplegable Widget 2 */}
          {acordeonActivo === 2 && (
            <div className="mt-3 p-3 bg-black/80 border border-amber-500/40 rounded-xl space-y-2 font-mono text-[11px]">
              <div className="text-amber-300 font-bold border-b border-zinc-800 pb-1">Detalle: 23 Lotes Activos</div>
              <div className="space-y-1 text-zinc-300">
                <div className="flex justify-between"><span>Amasadora 63Kg (Hamburguesa)</span><span className="text-amber-400">12 lotes</span></div>
                <div className="flex justify-between"><span>Amasadora 25Kg (Mini)</span><span className="text-amber-400">6 lotes</span></div>
                <div className="flex justify-between"><span>Tolva 50Kg (Completo)</span><span className="text-amber-400">5 lotes</span></div>
              </div>
            </div>
          )}
        </div>

        {/* WIDGET 3: Listos / Empaque */}
        <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 shadow-xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">🟢 Listos / Empaque</span>
            <button 
              type="button"
              onClick={() => toggleAcordeon(3)}
              className="px-3 py-1.5 bg-emerald-500/30 text-emerald-300 border border-emerald-500 rounded-xl text-xs font-mono font-bold animate-pulse shadow-lg cursor-pointer hover:bg-emerald-500 hover:text-black transition"
            >
              {acordeonActivo === 3 ? '▲ Ocultar (22)' : '▼ Desglosar (22)'}
            </button>
          </div>
          <div className="text-3xl font-mono font-black text-emerald-400">22 pedidos</div>
          <p className="text-[10px] text-zinc-500">Liberados para Santiago de Chile</p>

          {/* Acordeon Desplegable Widget 3 */}
          {acordeonActivo === 3 && (
            <div className="mt-3 p-3 bg-black/80 border border-emerald-500/40 rounded-xl space-y-2 font-mono text-[11px]">
              <div className="text-emerald-300 font-bold border-b border-zinc-800 pb-1">Detalle: 22 Pedidos Listos</div>
              <div className="space-y-1 text-zinc-300">
                <div className="flex justify-between"><span>Supermercados Sur</span><span className="text-emerald-400">10 pedidos</span></div>
                <div className="flex justify-between"><span>Minimarket Central</span><span className="text-emerald-400">8 pedidos</span></div>
                <div className="flex justify-between"><span>Confitería La Plaza</span><span className="text-emerald-400">4 pedidos</span></div>
              </div>
            </div>
          )}
        </div>

        {/* WIDGET 4: Masa Total Jornada */}
        <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 shadow-xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">📦 Masa Jornada</span>
            <button 
              type="button"
              onClick={() => toggleAcordeon(4)}
              className="px-3 py-1.5 bg-cyan-500/30 text-cyan-300 border border-cyan-500 rounded-xl text-xs font-mono font-bold animate-pulse shadow-lg cursor-pointer hover:bg-cyan-500 hover:text-black transition"
            >
              {acordeonActivo === 4 ? '▲ Ocultar' : '▼ Ver Masas'}
            </button>
          </div>
          <div className="text-3xl font-mono font-black text-cyan-400">270.5 Kg</div>
          <p className="text-[10px] text-zinc-500">Volumen consolidado en recetas base</p>

          {/* Acordeon Desplegable Widget 4 */}
          {acordeonActivo === 4 && (
            <div className="mt-3 p-3 bg-black/80 border border-cyan-500/40 rounded-xl space-y-2 font-mono text-[11px]">
              <div className="text-cyan-300 font-bold border-b border-zinc-800 pb-1">Desglose de Masas Base</div>
              <div className="space-y-1 text-zinc-300">
                <div className="flex justify-between"><span>Harina Integral</span><span className="text-cyan-400">105.0 kg</span></div>
                <div className="flex justify-between"><span>Harina Frica / Blanca</span><span className="text-cyan-400">110.5 kg</span></div>
                <div className="flex justify-between"><span>Masa Brioche</span><span className="text-cyan-400">55.0 kg</span></div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* PARTE DIARIO GLOBAL DE PEDIDOS E INSUMOS                                  */}
      {/* ========================================================================= */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
        
        <div className="p-4 border-b border-zinc-800 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-500 text-black font-bold text-[10px] px-2 py-0.5 rounded uppercase font-mono">Parte Maestro</span>
              <h3 className="font-mono text-sm font-black text-amber-400 uppercase tracking-wider">
                Parte Diario Global de Pedidos e Insumos
              </h3>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              Cálculo automatizado con deducción de bodega, margen de seguridad por merma y peso unitario.
            </p>
          </div>

          {/* BOTONERA EXCLUSIVA SUPERUSER */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsDesglosado(!isDesglosado)}
              className={`px-3 py-1.5 text-xs font-bold font-mono rounded-xl shadow transition flex items-center space-x-1.5 cursor-pointer ${
                isDesglosado ? 'bg-emerald-500 hover:bg-emerald-400 text-black' : 'bg-amber-500 hover:bg-amber-400 text-black'
              }`}
            >
              <span>{isDesglosado ? '📊 Ver Parte Consolidado Global' : '🗂️ Desglosar por Cliente / Pedido'}</span>
            </button>
            <button type="button" onClick={() => handleAction('Ver')} className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-mono rounded-xl transition cursor-pointer">👁️ Ver</button>
            <button type="button" onClick={() => handleAction('Crear')} className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-mono rounded-xl transition cursor-pointer">➕ Crear</button>
            <button type="button" onClick={() => handleAction('Editar')} className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-mono rounded-xl transition cursor-pointer">✏️ Editar</button>
            <button type="button" onClick={() => handleAction('Eliminar')} className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-red-400 text-xs font-mono rounded-xl transition cursor-pointer">🗑️ Eliminar</button>
            <button type="button" onClick={() => handleAction('Guardar')} className="px-2.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-400 text-xs font-semibold font-mono rounded-xl transition cursor-pointer">💾 Guardar</button>
            <button type="button" onClick={() => handleAction('Descargar')} className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-mono rounded-xl transition cursor-pointer">📥 Descargar</button>
            <button type="button" onClick={() => window.print()} className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-mono rounded-xl transition cursor-pointer">🖨️ Imprimir</button>
          </div>
        </div>

        <div className="bg-black/60 px-4 py-2 border-b border-zinc-800 flex justify-between items-center text-[11px] text-zinc-400 font-mono">
          <div>🕒 Generado el: <span className="text-zinc-200">{printTimestamp || '--'}</span> (<span className="text-emerald-400">Hoy en curso</span>)</div>
          <div>Modo Ejecutivo Superuser: <span className="text-white font-semibold">Autorizado</span></div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-zinc-900/80 text-zinc-400 uppercase tracking-wider border-b border-zinc-800 text-[11px]">
                <th className="p-3">Descripción (Producto)</th>
                <th className="p-3 text-center">Cant. Solicitada</th>
                <th className="p-3 text-center">Gramos / Unidad</th>
                <th className="p-3 text-center">Seguridad (%)</th>
                <th className="p-3 text-center">Existencia Bodega</th>
                <th className="p-3 text-center bg-emerald-500/10 text-emerald-400">Total a Elaborar</th>
                <th className="p-3 text-center">Harina a Usar (kg)</th>
                <th className="p-3 text-center">Masa Total (kg)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {dataset.map((row, index) => {
                const bgRow = index % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/30';
                const isSubItem = isDesglosado && row.descripcion.includes('(');
                return (
                  <tr key={index} className={`${bgRow} ${isSubItem ? 'border-l-2 border-amber-500/60 bg-amber-500/[0.02]' : ''} hover:bg-zinc-900/60 transition`}>
                    <td className={`p-3 text-white font-medium ${isSubItem ? 'pl-6 text-zinc-300 text-[11px]' : ''}`}>
                      {isSubItem ? '↳ ' : '▪ '} {row.descripcion}
                    </td>
                    <td className="p-3 text-center text-zinc-200 font-semibold">{row.cantidad_solicitada}</td>
                    <td className="p-3 text-center text-zinc-400">{row.gramos_unidad}</td>
                    <td className="p-3 text-center text-amber-400">{row.seguridad}</td>
                    <td className="p-3 text-center text-zinc-400">{row.existencia_bodega}</td>
                    <td className="p-3 text-center font-bold text-emerald-400 bg-emerald-500/5">{row.total_elaborar}</td>
                    <td className="p-3 text-center text-zinc-200">{row.harina_usar}</td>
                    <td className="p-3 text-center text-zinc-200">{row.masa_total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-black/40 border-t border-zinc-800 text-[10px] text-zinc-400 font-mono flex justify-between items-center">
          <span>Nota: El cálculo de harina deduce automáticamente stock en bodega aplicando control de calidad y merma estándar.</span>
          <span className="text-emerald-400 font-semibold">SYNEXIS-X Command-Nexus</span>
        </div>

      </div>

      {/* SECCIÓN DE ACCESOS RÁPIDOS Y ESTADO DE MÁQUINAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 shadow-xl space-y-4 lg:col-span-1">
          <h3 className="font-mono text-xs font-black text-amber-400 uppercase tracking-wider">
            ⚡ Accesos Rápidos Táctiles
          </h3>
          <div className="space-y-2 font-mono text-xs">
            <button type="button" onClick={() => onNavegarPestaña(1)} className="w-full text-left p-3 rounded-xl bg-zinc-900 hover:bg-amber-500 hover:text-black transition border border-zinc-800 flex items-center justify-between cursor-pointer group">
              <span>📝 Recepción de Pedidos</span>
              <span className="group-hover:translate-x-1 transition">➔</span>
            </button>
            <button type="button" onClick={() => onNavegarPestaña(4)} className="w-full text-left p-3 rounded-xl bg-zinc-900 hover:bg-amber-500 hover:text-black transition border border-zinc-800 flex items-center justify-between cursor-pointer group">
              <span>🥖 Consolidado por Batida</span>
              <span className="group-hover:translate-x-1 transition">➔</span>
            </button>
            <button type="button" onClick={() => onNavegarPestaña(5)} className="w-full text-left p-3 rounded-xl bg-zinc-900 hover:bg-amber-500 hover:text-black transition border border-zinc-800 flex items-center justify-between cursor-pointer group">
              <span>📦 Consolidado por Producto</span>
              <span className="group-hover:translate-x-1 transition">➔</span>
            </button>
            <button type="button" onClick={() => onNavegarPestaña(7)} className="w-full text-left p-3 rounded-xl bg-zinc-900 hover:bg-amber-500 hover:text-black transition border border-zinc-800 flex items-center justify-between cursor-pointer group">
              <span>📋 Bitácora de Operaciones (Live)</span>
              <span className="group-hover:translate-x-1 transition">➔</span>
            </button>
          </div>
        </div>

        <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 shadow-xl space-y-4 lg:col-span-2">
          <h3 className="font-mono text-xs font-black text-amber-400 uppercase tracking-wider">
            ⚙️ Estado de Equipos y Amasadoras en Planta
          </h3>
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 flex justify-between items-center">
              <div>
                <strong className="text-white block">Amasadora Industrial 63 Kg</strong>
                <span className="text-[10px] text-zinc-400">Receta: Masa de Pan de Hamburguesas</span>
              </div>
              <div className="text-right">
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded text-[10px] font-bold">
                  ● Amasando (48.5 Kg)
                </span>
              </div>
            </div>

            <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 flex justify-between items-center">
              <div>
                <strong className="text-white block">Amasadora Rápida 25 Kg</strong>
                <span className="text-[10px] text-zinc-400">Receta: Masa de Pan Mini Restaurant</span>
              </div>
              <div className="text-right">
                <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2.5 py-0.5 rounded text-[10px] font-bold">
                  ● Fermentando (21.0 Kg)
                </span>
              </div>
            </div>

            <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 flex justify-between items-center">
              <div>
                <strong className="text-white block">Amasadora de Tolva 50 Kg</strong>
                <span className="text-[10px] text-zinc-400">Receta: Masa de Pan de Completo</span>
              </div>
              <div className="text-right">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded text-[10px] font-bold">
                  ✓ Listos en Tolva
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}