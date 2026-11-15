"use client";

import React, { useState } from "react";

export interface EstacionAuditoria {
  numero: number;
  nombre: string;
  operador: string;
  cedula: string;
  timestamp: string;
  completado: boolean;
}

export interface LoteTrazabilidadCompleta {
  idLote: string;
  fechaCreacion: string;
  receta: string;
  cargaTotalKg: number;
  estaciones: EstacionAuditoria[];
}

export interface PedidoTrazabilidad {
  idPedido: string;
  fechaCreacion: string;
  cliente: string;
  producto: string;
  operador: string;
  cedula: string;
  timestamp: string;
  estado: string;
  estacionesRelevantes: EstacionAuditoria[];
}

export interface MermaTrazabilidad {
  idMerma: string;
  fechaCreacion: string;
  loteOidPedido: string;
  estacionAfectada: string;
  motivo: string;
  pesoMermaKg: number;
  operador: string;
  cedula: string;
  timestamp: string;
}

export default function PanelTrazabilidadPage() {
  const [tabActiva, setTabActiva] = useState<"pedidos" | "lotes" | "merma">("lotes");

  // Filtros de fecha
  const [modoFiltro, setModoFiltro] = useState<"hoy" | "desde_hasta" | "personalizado">("hoy");
  const [fechaHoy] = useState<string>(new Date().toISOString().split("T")[0]);
  const [fechaDesde, setFechaDesde] = useState<string>(fechaHoy);
  const [fechaHasta, setFechaHasta] = useState<string>(fechaHoy);
  const [fechaPersonalizada, setFechaPersonalizada] = useState<string>(fechaHoy);

  // 10 Lotes de prueba (Estaciones 2 al 6 enfocadas principalmente)
  const [lotesEjemplo] = useState<LoteTrazabilidadCompleta[]>([
    {
      idLote: "LOTE-202610-001",
      fechaCreacion: "2026-10-19",
      receta: "Masa Brioche Tradicional",
      cargaTotalKg: 63.0,
      estaciones: [
        { numero: 2, nombre: "2. Pesaje & Formulaciones", operador: "Delvis Arteaga", cedula: "22334455", timestamp: "19/10/2026 22:25", completado: true },
        { numero: 3, nombre: "3. Amasado & Mezcla", operador: "Elvis Vera", cedula: "33445566", timestamp: "19/10/2026 22:40", completado: true },
        { numero: 4, nombre: "4. Divisora & Ovillado", operador: "Julio Zarraga", cedula: "44556677", timestamp: "19/10/2026 22:55", completado: true },
        { numero: 5, nombre: "5. Fermentación Controlada", operador: "Luis Farias", cedula: "55667788", timestamp: "19/10/2026 23:15", completado: true },
        { numero: 6, nombre: "6. Horneado & Cocción", operador: "Alexander Castellanos", cedula: "10433935", timestamp: "19/10/2026 23:40", completado: true },
      ],
    },
    {
      idLote: "LOTE-202610-002",
      fechaCreacion: "2026-10-19",
      receta: "Pan Frica 13cm",
      cargaTotalKg: 75.0,
      estaciones: [
        { numero: 2, nombre: "2. Pesaje & Formulaciones", operador: "Delvis Arteaga", cedula: "22334455", timestamp: "19/10/2026 10:20", completado: true },
        { numero: 3, nombre: "3. Amasado & Mezcla", operador: "Elvis Vera", cedula: "33445566", timestamp: "19/10/2026 10:45", completado: true },
        { numero: 4, nombre: "4. Divisora & Ovillado", operador: "Julio Zarraga", cedula: "44556677", timestamp: "19/10/2026 11:00", completado: true },
        { numero: 5, nombre: "5. Fermentación Controlada", operador: "Luis Farias", cedula: "55667788", timestamp: "19/10/2026 11:30", completado: true },
        { numero: 6, nombre: "6. Horneado & Cocción", operador: "Alexander Castellanos", cedula: "10433935", timestamp: "19/10/2026 12:00", completado: true },
      ],
    },
    {
      idLote: "LOTE-202610-003",
      fechaCreacion: "2026-10-18",
      receta: "Pan de Molde Integral",
      cargaTotalKg: 50.0,
      estaciones: [
        { numero: 2, nombre: "2. Pesaje & Formulaciones", operador: "Delvis Arteaga", cedula: "22334455", timestamp: "18/10/2026 08:15", completado: true },
        { numero: 3, nombre: "3. Amasado & Mezcla", operador: "Elvis Vera", cedula: "33445566", timestamp: "18/10/2026 08:40", completado: true },
        { numero: 4, nombre: "4. Divisora & Ovillado", operador: "Julio Zarraga", cedula: "44556677", timestamp: "18/10/2026 09:00", completado: true },
        { numero: 5, nombre: "5. Fermentación Controlada", operador: "Luis Farias", cedula: "55667788", timestamp: "18/10/2026 09:30", completado: true },
        { numero: 6, nombre: "6. Horneado & Cocción", operador: "Alexander Castellanos", cedula: "10433935", timestamp: "18/10/2026 10:10", completado: true },
      ],
    },
    {
      idLote: "LOTE-202610-004",
      fechaCreacion: "2026-10-18",
      receta: "Croissant Mantequilla",
      cargaTotalKg: 40.0,
      estaciones: [
        { numero: 2, nombre: "2. Pesaje & Formulaciones", operador: "Delvis Arteaga", cedula: "22334455", timestamp: "18/10/2026 13:20", completado: true },
        { numero: 3, nombre: "3. Amasado & Mezcla", operador: "Elvis Vera", cedula: "33445566", timestamp: "18/10/2026 13:50", completado: true },
        { numero: 4, nombre: "4. Divisora & Ovillado", operador: "Julio Zarraga", cedula: "44556677", timestamp: "18/10/2026 14:15", completado: true },
        { numero: 5, nombre: "5. Fermentación Controlada", operador: "Luis Farias", cedula: "55667788", timestamp: "18/10/2026 14:45", completado: true },
        { numero: 6, nombre: "6. Horneado & Cocción", operador: "Alexander Castellanos", cedula: "10433935", timestamp: "18/10/2026 15:30", completado: true },
      ],
    },
    {
      idLote: "LOTE-202610-005",
      fechaCreacion: "2026-10-17",
      receta: "Pan Pita Árabe",
      cargaTotalKg: 60.0,
      estaciones: [
        { numero: 2, nombre: "2. Pesaje & Formulaciones", operador: "Delvis Arteaga", cedula: "22334455", timestamp: "17/10/2026 09:15", completado: true },
        { numero: 3, nombre: "3. Amasado & Mezcla", operador: "Elvis Vera", cedula: "33445566", timestamp: "17/10/2026 09:40", completado: true },
        { numero: 4, nombre: "4. Divisora & Ovillado", operador: "Julio Zarraga", cedula: "44556677", timestamp: "17/10/2026 10:00", completado: true },
        { numero: 5, nombre: "5. Fermentación Controlada", operador: "Luis Farias", cedula: "55667788", timestamp: "17/10/2026 10:30", completado: true },
        { numero: 6, nombre: "6. Horneado & Cocción", operador: "Alexander Castellanos", cedula: "10433935", timestamp: "17/10/2026 11:10", completado: true },
      ],
    },
    {
      idLote: "LOTE-202610-006",
      fechaCreacion: "2026-10-17",
      receta: "Pan Cook (Sopa)",
      cargaTotalKg: 45.0,
      estaciones: [
        { numero: 2, nombre: "2. Pesaje & Formulaciones", operador: "Delvis Arteaga", cedula: "22334455", timestamp: "17/10/2026 14:20", completado: true },
        { numero: 3, nombre: "3. Amasado & Mezcla", operador: "Elvis Vera", cedula: "33445566", timestamp: "17/10/2026 14:45", completado: true },
        { numero: 4, nombre: "4. Divisora & Ovillado", operador: "Julio Zarraga", cedula: "44556677", timestamp: "17/10/2026 15:05", completado: true },
        { numero: 5, nombre: "5. Fermentación Controlada", operador: "Luis Farias", cedula: "55667788", timestamp: "17/10/2026 15:35", completado: true },
        { numero: 6, nombre: "6. Horneado & Cocción", operador: "Alexander Castellanos", cedula: "10433935", timestamp: "17/10/2026 16:15", completado: true },
      ],
    },
    {
      idLote: "LOTE-202610-007",
      fechaCreacion: "2026-10-16",
      receta: "Baguette Francesa",
      cargaTotalKg: 55.0,
      estaciones: [
        { numero: 2, nombre: "2. Pesaje & Formulaciones", operador: "Delvis Arteaga", cedula: "22334455", timestamp: "16/10/2026 08:45", completado: true },
        { numero: 3, nombre: "3. Amasado & Mezcla", operador: "Elvis Vera", cedula: "33445566", timestamp: "16/10/2026 09:10", completado: true },
        { numero: 4, nombre: "4. Divisora & Ovillado", operador: "Julio Zarraga", cedula: "44556677", timestamp: "16/10/2026 09:30", completado: true },
        { numero: 5, nombre: "5. Fermentación Controlada", operador: "Luis Farias", cedula: "55667788", timestamp: "16/10/2026 10:00", completado: true },
        { numero: 6, nombre: "6. Horneado & Cocción", operador: "Alexander Castellanos", cedula: "10433935", timestamp: "16/10/2026 10:40", completado: true },
      ],
    },
    {
      idLote: "LOTE-202610-008",
      fechaCreacion: "2026-10-16",
      receta: "Pan de Hamburguesa",
      cargaTotalKg: 70.0,
      estaciones: [
        { numero: 2, nombre: "2. Pesaje & Formulaciones", operador: "Delvis Arteaga", cedula: "22334455", timestamp: "16/10/2026 13:50", completado: true },
        { numero: 3, nombre: "3. Amasado & Mezcla", operador: "Elvis Vera", cedula: "33445566", timestamp: "16/10/2026 14:20", completado: true },
        { numero: 4, nombre: "4. Divisora & Ovillado", operador: "Julio Zarraga", cedula: "44556677", timestamp: "16/10/2026 14:40", completado: true },
        { numero: 5, nombre: "5. Fermentación Controlada", operador: "Luis Farias", cedula: "55667788", timestamp: "16/10/2026 15:10", completado: true },
        { numero: 6, nombre: "6. Horneado & Cocción", operador: "Alexander Castellanos", cedula: "10433935", timestamp: "16/10/2026 15:50", completado: true },
      ],
    },
    {
      idLote: "LOTE-202610-009",
      fechaCreacion: "2026-10-15",
      receta: "Masa Láctica Dulce",
      cargaTotalKg: 65.0,
      estaciones: [
        { numero: 2, nombre: "2. Pesaje & Formulaciones", operador: "Delvis Arteaga", cedula: "22334455", timestamp: "15/10/2026 09:20", completado: true },
        { numero: 3, nombre: "3. Amasado & Mezcla", operador: "Elvis Vera", cedula: "33445566", timestamp: "15/10/2026 09:50", completado: true },
        { numero: 4, nombre: "4. Divisora & Ovillado", operador: "Julio Zarraga", cedula: "44556677", timestamp: "15/10/2026 10:10", completado: true },
        { numero: 5, nombre: "5. Fermentación Controlada", operador: "Luis Farias", cedula: "55667788", timestamp: "15/10/2026 10:40", completado: true },
        { numero: 6, nombre: "6. Horneado & Cocción", operador: "Alexander Castellanos", cedula: "10433935", timestamp: "15/10/2026 11:20", completado: true },
      ],
    },
    {
      idLote: "LOTE-202610-010",
      fechaCreacion: "2026-10-15",
      receta: "Pan de Hot Dog 15cm",
      cargaTotalKg: 55.0,
      estaciones: [
        { numero: 2, nombre: "2. Pesaje & Formulaciones", operador: "Delvis Arteaga", cedula: "22334455", timestamp: "15/10/2026 14:20", completado: true },
        { numero: 3, nombre: "3. Amasado & Mezcla", operador: "Elvis Vera", cedula: "33445566", timestamp: "15/10/2026 14:50", completado: true },
        { numero: 4, nombre: "4. Divisora & Ovillado", operador: "Julio Zarraga", cedula: "44556677", timestamp: "15/10/2026 15:10", completado: true },
        { numero: 5, nombre: "5. Fermentación Controlada", operador: "Luis Farias", cedula: "55667788", timestamp: "15/10/2026 15:40", completado: true },
        { numero: 6, nombre: "6. Horneado & Cocción", operador: "Alexander Castellanos", cedula: "10433935", timestamp: "15/10/2026 16:20", completado: true },
      ],
    },
  ]);

  // Pedidos de prueba (Estaciones 1, 7, 8, 9, 10 y 11)
  const [pedidosEjemplo] = useState<PedidoTrazabilidad[]>([
    {
      idPedido: "PED-202610-001",
      fechaCreacion: "2026-10-19",
      cliente: "Distribuidora Salam",
      producto: "Pan Brioche",
      operador: "Alexander Castellanos",
      cedula: "10433935",
      timestamp: "19/10/2026 22:45",
      estado: "Completado / Empaque",
      estacionesRelevantes: [
        { numero: 1, nombre: "1. Selección Pedidos (Taller)", operador: "Alexander Castellanos", cedula: "10433935", timestamp: "19/10/2026 21:00", completado: true },
        { numero: 7, nombre: "7. Enfriamiento & Empaque", operador: "Marlenys Batista", cedula: "66778899", timestamp: "20/10/2026 00:05", completado: true },
        { numero: 8, nombre: "8. Control Calidad / Rechazos", operador: "Oscar Rojas", cedula: "77889900", timestamp: "20/10/2026 00:30", completado: true },
        { numero: 9, nombre: "9. Despacho & Logística", operador: "Rudy Aspilcueta", cedula: "88990011", timestamp: "20/10/2026 01:00", completado: true },
        { numero: 10, nombre: "10. Despacho Adm. & Firma", operador: "Tommy Zambrano", cedula: "99001122", timestamp: "20/10/2026 01:30", completado: true },
        { numero: 11, nombre: "11. Bodega de Planta (Stock)", operador: "Alexander Castellanos", cedula: "10433935", timestamp: "20/10/2026 02:00", completado: true },
      ],
    },
    {
      idPedido: "PED-202610-002",
      fechaCreacion: "2026-10-19",
      cliente: "Supermercados Lider",
      producto: "Pan Frica 13cm",
      operador: "Delvis Arteaga",
      cedula: "22334455",
      timestamp: "19/10/2026 14:10",
      estado: "Despacho Logística",
      estacionesRelevantes: [
        { numero: 1, nombre: "1. Selección Pedidos (Taller)", operador: "Delvis Arteaga", cedula: "22334455", timestamp: "19/10/2026 09:00", completado: true },
        { numero: 7, nombre: "7. Enfriamiento & Empaque", operador: "Marlenys Batista", cedula: "66778899", timestamp: "19/10/2026 12:40", completado: true },
        { numero: 8, nombre: "8. Control Calidad / Rechazos", operador: "Oscar Rojas", cedula: "77889900", timestamp: "19/10/2026 13:00", completado: true },
        { numero: 9, nombre: "9. Despacho & Logística", operador: "Rudy Aspilcueta", cedula: "88990011", timestamp: "19/10/2026 13:30", completado: true },
        { numero: 10, nombre: "10. Despacho Adm. & Firma", operador: "Tommy Zambrano", cedula: "99001122", timestamp: "19/10/2026 14:00", completado: true },
        { numero: 11, nombre: "11. Bodega de Planta (Stock)", operador: "Alexander Castellanos", cedula: "10433935", timestamp: "Pendiente", completado: false },
      ],
    },
    {
      idPedido: "PED-202610-003",
      fechaCreacion: "2026-10-18",
      cliente: "Restaurant El Fogón",
      producto: "Pan Cook",
      operador: "Elvis Vera",
      cedula: "33445566",
      timestamp: "18/10/2026 11:30",
      estado: "Confirmación Entrega",
      estacionesRelevantes: [
        { numero: 1, nombre: "1. Selección Pedidos (Taller)", operador: "Elvis Vera", cedula: "33445566", timestamp: "18/10/2026 07:30", completado: true },
        { numero: 7, nombre: "7. Enfriamiento & Empaque", operador: "Marlenys Batista", cedula: "66778899", timestamp: "18/10/2026 10:50", completado: true },
        { numero: 8, nombre: "8. Control Calidad / Rechazos", operador: "Oscar Rojas", cedula: "77889900", timestamp: "18/10/2026 11:15", completado: true },
        { numero: 9, nombre: "9. Despacho & Logística", operador: "Rudy Aspilcueta", cedula: "88990011", timestamp: "18/10/2026 11:45", completado: true },
        { numero: 10, nombre: "10. Despacho Adm. & Firma", operador: "Tommy Zambrano", cedula: "99001122", timestamp: "18/10/2026 12:15", completado: true },
        { numero: 11, nombre: "11. Bodega de Planta (Stock)", operador: "Alexander Castellanos", cedula: "10433935", timestamp: "18/10/2026 12:45", completado: true },
      ],
    },
  ]);

  // Merma de prueba (Estaciones 1 al 11)
  const [mermasEjemplo] = useState<MermaTrazabilidad[]>([
    {
      idMerma: "MERM-202610-001",
      fechaCreacion: "2026-10-19",
      loteOidPedido: "LOTE-202610-001",
      estacionAfectada: "Estación 3 (Amasado)",
      motivo: "Exceso de hidratación / Corrección de masa",
      pesoMermaKg: 2.5,
      operador: "Elvis Vera",
      cedula: "33445566",
      timestamp: "19/10/2026 22:45",
    },
    {
      idMerma: "MERM-202610-002",
      fechaCreacion: "2026-10-18",
      loteOidPedido: "LOTE-202610-004",
      estacionAfectada: "Estación 6 (Horneado)",
      motivo: "Piezas sobrecocidas por variación de temperatura",
      pesoMermaKg: 4.0,
      operador: "Alexander Castellanos",
      cedula: "10433935",
      timestamp: "18/10/2026 15:45",
    },
  ]);

  const [loteSeleccionadoId, setLoteSeleccionadoId] = useState<string>("LOTE-202610-001");
  const [pedidoSeleccionadoId, setPedidoSeleccionadoId] = useState<string>("PED-202610-001");
  const [mermaSeleccionadaId, setMermaSeleccionadaId] = useState<string>("MERM-202610-001");

  const loteActual = lotesEjemplo.find((l) => l.idLote === loteSeleccionadoId) || lotesEjemplo[0];
  const pedidoActual = pedidosEjemplo.find((p) => p.idPedido === pedidoSeleccionadoId) || pedidosEjemplo[0];
  const mermaActual = mermasEjemplo.find((m) => m.idMerma === mermaSeleccionadaId) || mermasEjemplo[0];

  const handleBuscar = () => {
    alert(`🔍 Búsqueda aplicada correctamente para el filtro [${modoFiltro.toUpperCase()}].`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-xs font-sans pb-12">
      {/* TÍTULO ÚNICO DE LA PÁGINA */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-300 dark:border-amber-500/40 shadow-xl flex justify-between items-center transition-colors">
        <div>
          <h2 className="text-base font-black text-amber-600 dark:text-amber-400 flex items-center gap-2">
            📊 PANEL DE TRAZABILIDAD
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5">
            Supervisión y auditoría industrial conectada por lotes, pedidos y registro de mermas
          </p>
        </div>
      </div>

      {/* BARRA DE FILTROS DE FECHA Y MICRO-BOTÓN BUSCAR */}
      <div className="bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-2">
          <span className="text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px]">Periodo:</span>
          <button
            type="button"
            onClick={() => setModoFiltro("hoy")}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
              modoFiltro === "hoy"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700"
            }`}
          >
            Hoy
          </button>
          <button
            type="button"
            onClick={() => setModoFiltro("desde_hasta")}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
              modoFiltro === "desde_hasta"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700"
            }`}
          >
            Desde / Hasta
          </button>
          <button
            type="button"
            onClick={() => setModoFiltro("personalizado")}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
              modoFiltro === "personalizado"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700"
            }`}
          >
            Personalizado
          </button>
        </div>

        {/* INPUTS DE FECHA Y BOTÓN BUSCAR */}
        <div className="flex items-center gap-2">
          {modoFiltro === "hoy" && (
            <div className="bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-amber-600 dark:text-amber-400 font-mono font-bold">
              Fecha: {fechaHoy}
            </div>
          )}

          {modoFiltro === "desde_hasta" && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 font-mono text-xs"
              />
              <span className="text-slate-500 dark:text-slate-400">hasta</span>
              <input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 font-mono text-xs"
              />
            </div>
          )}

          {modoFiltro === "personalizado" && (
            <div>
              <input
                type="date"
                value={fechaPersonalizada}
                onChange={(e) => setFechaPersonalizada(e.target.value)}
                className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1.5 font-mono text-xs"
              />
            </div>
          )}

          <button
            type="button"
            onClick={handleBuscar}
            className="px-4 py-1.5 bg-emerald-500 text-slate-950 font-black text-xs uppercase rounded-lg shadow-md hover:bg-emerald-400 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>🔍</span> Buscar
          </button>
        </div>
      </div>

      {/* TRES PESTAÑAS PRINCIPALES */}
      <div className="flex gap-3 bg-white dark:bg-slate-900/90 p-2 rounded-xl border border-slate-300 dark:border-slate-800 transition-colors">
        <button
          type="button"
          onClick={() => setTabActiva("pedidos")}
          className={`flex-1 py-3 font-extrabold text-xs rounded-lg transition-all cursor-pointer ${
            tabActiva === "pedidos"
              ? "bg-blue-600 text-white shadow-lg"
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          📦 Pedidos (Estaciones 1, 7, 8, 9, 10, 11)
        </button>

        <button
          type="button"
          onClick={() => setTabActiva("lotes")}
          className={`flex-1 py-3 font-extrabold text-xs rounded-lg transition-all cursor-pointer ${
            tabActiva === "lotes"
              ? "bg-amber-500 text-slate-950 shadow-lg"
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          🔥 Lotes (Estaciones 2 al 6)
        </button>

        <button
          type="button"
          onClick={() => setTabActiva("merma")}
          className={`flex-1 py-3 font-extrabold text-xs rounded-lg transition-all cursor-pointer ${
            tabActiva === "merma"
              ? "bg-rose-600 text-white shadow-lg"
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          ♻️ Merma (Estaciones 1 al 11)
        </button>
      </div>

      {/* PESTAÑA 1: PEDIDOS (Estaciones 1, 7, 8, 9, 10, 11) */}
      {tabActiva === "pedidos" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 transition-colors">
            <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Seleccione un Pedido (Estaciones 1, 7, 8, 9, 10, 11):
            </h3>
            <div className="max-h-60 overflow-y-auto border border-slate-300 dark:border-slate-800 rounded-xl">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-300 dark:border-slate-800 text-[10px] uppercase sticky top-0">
                    <th className="p-2.5">ID Pedido</th>
                    <th className="p-2.5">Fecha</th>
                    <th className="p-2.5">Cliente</th>
                    <th className="p-2.5">Producto</th>
                    <th className="p-2.5">Estado Actual</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-mono">
                  {pedidosEjemplo.map((ped) => {
                    const seleccionado = ped.idPedido === pedidoSeleccionadoId;
                    return (
                      <tr
                        key={ped.idPedido}
                        onClick={() => setPedidoSeleccionadoId(ped.idPedido)}
                        className={`cursor-pointer transition-all ${
                          seleccionado
                            ? "bg-blue-600 text-white font-black dark:bg-blue-700"
                            : "hover:bg-slate-100 dark:hover:bg-slate-900/80 text-slate-800 dark:text-slate-300"
                        }`}
                      >
                        <td className={`p-2.5 font-bold ${seleccionado ? "text-white" : "text-blue-600 dark:text-blue-400"}`}>
                          {ped.idPedido}
                        </td>
                        <td className="p-2.5">{ped.fechaCreacion}</td>
                        <td className="p-2.5">{ped.cliente}</td>
                        <td className="p-2.5">{ped.producto}</td>
                        <td className="p-2.5">{ped.estado}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4 transition-colors">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-sm font-black text-blue-600 dark:text-blue-400 font-mono">{pedidoActual.idPedido}</span>
                <span className="text-slate-800 dark:text-slate-300 text-xs font-bold ml-3">— Cliente: {pedidoActual.cliente}</span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-700 text-cyan-600 dark:text-cyan-400 font-bold text-xs font-mono">
                Estado: {pedidoActual.estado}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                📦 Auditoría del Pedido (Estaciones 1, 7, 8, 9, 10 y 11):
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-300 dark:border-slate-800 text-[10px] uppercase">
                      <th className="p-2.5">Proceso / Estación</th>
                      <th className="p-2.5">Operario Responsable</th>
                      <th className="p-2.5">Cédula</th>
                      <th className="p-2.5">Fecha y Hora</th>
                      <th className="p-2.5 text-center">Estatus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-mono">
                    {pedidoActual.estacionesRelevantes.map((est) => (
                      <tr key={est.numero} className="hover:bg-slate-100 dark:hover:bg-slate-900/60 text-slate-900 dark:text-slate-100">
                        <td className="p-2.5 font-bold text-blue-600 dark:text-blue-400">{est.nombre}</td>
                        <td className="p-2.5">{est.operador}</td>
                        <td className="p-2.5 text-slate-500 dark:text-slate-400">{est.cedula}</td>
                        <td className="p-2.5 text-cyan-600 dark:text-cyan-400">{est.timestamp}</td>
                        <td className="p-2.5 text-center">
                          <span
                            className={`text-[9px] font-black px-2 py-0.5 rounded ${
                              est.completado ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30" : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                            }`}
                          >
                            {est.completado ? "✓ COMPLETADO" : "PENDIENTE"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 2: LOTES (Estaciones 2 al 6) */}
      {tabActiva === "lotes" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 transition-colors">
            <h3 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Seleccione un Lote (Estaciones 2 al 6):
            </h3>
            <div className="max-h-60 overflow-y-auto border border-slate-300 dark:border-slate-800 rounded-xl">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-300 dark:border-slate-800 text-[10px] uppercase sticky top-0">
                    <th className="p-2.5">ID Lote</th>
                    <th className="p-2.5">Fecha</th>
                    <th className="p-2.5">Receta / Masa</th>
                    <th className="p-2.5">Carga Total (Kg)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-mono">
                  {lotesEjemplo.map((lote) => {
                    const seleccionado = lote.idLote === loteSeleccionadoId;
                    return (
                      <tr
                        key={lote.idLote}
                        onClick={() => setLoteSeleccionadoId(lote.idLote)}
                        className={`cursor-pointer transition-all ${
                          seleccionado
                            ? "bg-amber-600 text-slate-950 font-black dark:bg-amber-700"
                            : "hover:bg-slate-100 dark:hover:bg-slate-900/80 text-slate-800 dark:text-slate-300"
                        }`}
                      >
                        <td className={`p-2.5 font-bold ${seleccionado ? "text-slate-950" : "text-amber-600 dark:text-amber-400"}`}>
                          {lote.idLote}
                        </td>
                        <td className="p-2.5">{lote.fechaCreacion}</td>
                        <td className={`p-2.5 ${seleccionado ? "text-slate-950 font-bold" : "text-slate-900 dark:text-slate-200"}`}>{lote.receta}</td>
                        <td className="p-2.5">{lote.cargaTotalKg} Kg</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4 transition-colors">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-sm font-black text-amber-600 dark:text-amber-400 font-mono">{loteActual.idLote}</span>
                <span className="text-slate-800 dark:text-slate-300 text-xs font-bold ml-3">— Receta: {loteActual.receta}</span>
                <span className="text-slate-500 dark:text-slate-400 text-[10px] ml-2 font-mono">(Fecha: {loteActual.fechaCreacion})</span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 font-bold text-xs font-mono">
                Carga Total: {loteActual.cargaTotalKg} Kg
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                📍 Secuencia de Producción en Planta (Estaciones 2 al 6):
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-300 dark:border-slate-800 text-[10px] uppercase">
                      <th className="p-2.5">Nombre del Proceso</th>
                      <th className="p-2.5">Operario Responsable</th>
                      <th className="p-2.5">Cédula</th>
                      <th className="p-2.5">Fecha y Hora</th>
                      <th className="p-2.5 text-center">Estatus</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-mono">
                    {loteActual.estaciones.map((est) => (
                      <tr key={est.numero} className="hover:bg-slate-100 dark:hover:bg-slate-900/60 text-slate-900 dark:text-slate-100">
                        <td className="p-2.5 font-bold text-amber-600 dark:text-amber-400">{est.nombre}</td>
                        <td className="p-2.5">{est.operador}</td>
                        <td className="p-2.5 text-slate-500 dark:text-slate-400">{est.cedula}</td>
                        <td className="p-2.5 text-cyan-600 dark:text-cyan-400">{est.timestamp}</td>
                        <td className="p-2.5 text-center">
                          <span
                            className={`text-[9px] font-black px-2 py-0.5 rounded ${
                              est.completado ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30" : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                            }`}
                          >
                            {est.completado ? "✓ COMPLETADO" : "PENDIENTE"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 3: MERMA (Estaciones 1 al 11) */}
      {tabActiva === "merma" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 transition-colors">
            <h3 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              Seleccione un Registro de Merma (Estaciones 1 al 11):
            </h3>
            <div className="max-h-60 overflow-y-auto border border-slate-300 dark:border-slate-800 rounded-xl">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-300 dark:border-slate-800 text-[10px] uppercase sticky top-0">
                    <th className="p-2.5">ID Merma</th>
                    <th className="p-2.5">Fecha</th>
                    <th className="p-2.5">Lote / Pedido</th>
                    <th className="p-2.5">Estación Afectada</th>
                    <th className="p-2.5">Peso (Kg)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-mono">
                  {mermasEjemplo.map((merma) => {
                    const seleccionado = merma.idMerma === mermaSeleccionadaId;
                    return (
                      <tr
                        key={merma.idMerma}
                        onClick={() => setMermaSeleccionadaId(merma.idMerma)}
                        className={`cursor-pointer transition-all ${
                          seleccionado
                            ? "bg-rose-600 text-white font-black dark:bg-rose-700"
                            : "hover:bg-slate-100 dark:hover:bg-slate-900/80 text-slate-800 dark:text-slate-300"
                        }`}
                      >
                        <td className={`p-2.5 font-bold ${seleccionado ? "text-white" : "text-rose-600 dark:text-rose-400"}`}>
                          {merma.idMerma}
                        </td>
                        <td className="p-2.5">{merma.fechaCreacion}</td>
                        <td className="p-2.5">{merma.loteOidPedido}</td>
                        <td className="p-2.5">{merma.estacionAfectada}</td>
                        <td className="p-2.5 font-bold">{merma.pesoMermaKg} Kg</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4 transition-colors">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-sm font-black text-rose-600 dark:text-rose-400 font-mono">{mermaActual.idMerma}</span>
                <span className="text-slate-800 dark:text-slate-300 text-xs font-bold ml-3">— Ref: {mermaActual.loteOidPedido}</span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-700 text-rose-600 dark:text-rose-400 font-bold text-xs font-mono">
                Merma Registrada: {mermaActual.pesoMermaKg} Kg
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                ♻️ Detalle y Auditoría del Registro de Merma:
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-300 dark:border-slate-800 text-[10px] uppercase">
                      <th className="p-2.5">Estación Afectada</th>
                      <th className="p-2.5">Motivo / Causa</th>
                      <th className="p-2.5">Operario Responsable</th>
                      <th className="p-2.5">Cédula</th>
                      <th className="p-2.5">Fecha y Hora</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 font-mono">
                    <tr className="hover:bg-slate-100 dark:hover:bg-slate-900/60 text-slate-900 dark:text-slate-100">
                      <td className="p-2.5 font-bold text-rose-600 dark:text-rose-400">{mermaActual.estacionAfectada}</td>
                      <td className="p-2.5 text-slate-800 dark:text-slate-200">{mermaActual.motivo}</td>
                      <td className="p-2.5">{mermaActual.operador}</td>
                      <td className="p-2.5 text-slate-500 dark:text-slate-400">{mermaActual.cedula}</td>
                      <td className="p-2.5 text-cyan-600 dark:text-cyan-400">{mermaActual.timestamp}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}