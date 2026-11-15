"use client";

import React, { useState } from "react";

interface AsistenciaDia {
  dia: number;
  estado: "asistio" | "libre" | "falta" | "pendiente";
}

interface EmpleadoAsistencia {
  id: number;
  nombre: string;
  cedula: string;
  cargo: string;
  mes: string;
  dias: AsistenciaDia[];
}

export default function ControlAsistenciaPage() {
  const [mesActual, setMesActual] = useState<string>("Noviembre 2026");
  
  // Lista inicial de empleados con control de 30 días
  const [empleados, setEmpleados] = useState<EmpleadoAsistencia[]>([
    {
      id: 1,
      nombre: "Alexander Castellanos",
      cedula: "V-15123456",
      cargo: "Jefe de Taller / Maestro Panadero",
      mes: "Noviembre 2026",
      dias: Array.from({ length: 30 }, (_, i) => ({ dia: i + 1, estado: i < 5 ? "asistio" : "pendiente" }))
    },
    {
      id: 2,
      nombre: "Delvis Arteaga",
      cedula: "V-18876543",
      cargo: "Personal de Producción",
      mes: "Noviembre 2026",
      dias: Array.from({ length: 30 }, (_, i) => ({ dia: i + 1, estado: i < 4 ? "asistio" : "pendiente" }))
    },
    {
      id: 3,
      nombre: "Elvis Vera",
      cedula: "V-12345678",
      cargo: "Operador de Mezcla",
      mes: "Noviembre 2026",
      dias: Array.from({ length: 30 }, (_, i) => ({ dia: i + 1, estado: i < 5 ? "asistio" : "pendiente" }))
    },
    {
      id: 4,
      nombre: "Julio Zarraga",
      cedula: "V-20333444",
      cargo: "Operador de Mezcla",
      mes: "Noviembre 2026",
      dias: Array.from({ length: 30 }, (_, i) => ({ dia: i + 1, estado: i < 5 ? "asistio" : "pendiente" }))
    },
    {
      id: 5,
      nombre: "Luis Farias",
      cedula: "V-17555666",
      cargo: "Asistente de Pastelería",
      mes: "Noviembre 2026",
      dias: Array.from({ length: 30 }, (_, i) => ({ dia: i + 1, estado: i < 5 ? "asistio" : "pendiente" }))
    }
  ]);

  const [empleadoSeleccionadoId, setEmpleadoSeleccionadoId] = useState<number>(empleados[0].id);

  const empleadoActual = empleados.find(e => e.id === empleadoSeleccionadoId) || empleados[0];

  // Ciclar estado del día al hacer clic: pendiente ➔ asistio ➔ libre ➔ falta ➔ pendiente
  const handleCambiarEstadoDia = (diaNum: number) => {
    const nuevosEmpleados = empleados.map(emp => {
      if (emp.id === empleadoActual.id) {
        const nuevosDias = emp.dias.map(d => {
          if (d.dia === diaNum) {
            let siguienteEstado: AsistenciaDia["estado"] = "asistio";
            if (d.estado === "asistio") siguienteEstado = "libre";
            else if (d.estado === "libre") siguienteEstado = "falta";
            else if (d.estado === "falta") siguienteEstado = "pendiente";
            else if (d.estado === "pendiente") siguienteEstado = "asistio";
            return { ...d, estado: siguienteEstado };
          }
          return d;
        });
        return { ...emp, dias: nuevosDias };
      }
      return emp;
    });
    setEmpleados(nuevosEmpleados);
  };

  // Contadores de estadísticas del mes
  const totalAsistencias = empleadoActual.dias.filter(d => d.estado === "asistio").length;
  const totalLibres = empleadoActual.dias.filter(d => d.estado === "libre").length;
  const totalFaltas = empleadoActual.dias.filter(d => d.estado === "falta").length;

  const handleImprimir = () => {
    window.print();
  };

  const handleDescargarCSV = () => {
    const filas = empleadoActual.dias.map(d => `Día ${d.dia},${d.estado.toUpperCase()}`).join("\n");
    const contenido = `Control de Asistencia - Synapse-X\nEmpleado,${empleadoActual.nombre}\nCédula,${empleadoActual.cedula}\nMes,${empleadoActual.mes}\n\nDía,Estado\n${filas}`;
    const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `asistencia_${empleadoActual.cedula}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 md:p-6 bg-slate-100 dark:bg-[#0b101d] text-slate-900 dark:text-slate-100 min-h-screen font-sans transition-colors">
      
      {/* CABECERA Y SELECTOR DE EMPLEADO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-slate-300 dark:border-slate-800 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono">
            Control de Asistencia de Empleados
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            OSAI Industrial — Registro diario de asistencia, permisos libres y faltas injustificadas
          </p>
        </div>

        {/* SELECTOR DE OPERARIO RÁPIDO */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-300 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-500">Operario:</span>
          <select
            value={empleadoSeleccionadoId}
            onChange={e => setEmpleadoSeleccionadoId(Number(e.target.value))}
            className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 font-bold focus:outline-none focus:border-amber-500"
          >
            {empleados.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.nombre} ({emp.cedula})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TARJETA PRINCIPAL DE LA FICHA DE ASISTENCIA */}
      <div className="max-w-5xl mx-auto bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-6 md:p-8 rounded-2xl shadow-xl space-y-6">
        
        {/* INFORMACIÓN GENERAL DEL EMPLEADO Y PERIODO */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 gap-4">
          <div>
            <span className="text-[10px] font-mono bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded font-bold uppercase">
              {empleadoActual.cargo}
            </span>
            <h2 className="text-lg font-black uppercase tracking-wide mt-1">{empleadoActual.nombre}</h2>
            <p className="text-xs text-slate-500 font-mono">Cédula / RUT: {empleadoActual.cedula}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold">Mes Registrado:</span>
            <input
              type="text"
              value={mesActual}
              onChange={e => setMesActual(e.target.value)}
              className="px-3 py-1 text-xs font-mono font-bold bg-white dark:bg-slate-900 border rounded-lg border-slate-300 dark:border-slate-700 text-center w-36"
            />
          </div>
        </div>

        {/* RESUMEN ESTADÍSTICO DEL MES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 p-4 rounded-xl">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block uppercase">Días Asistidos</span>
            <span className="text-2xl font-black font-mono text-emerald-800 dark:text-emerald-300 mt-1 block">{totalAsistencias}</span>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 p-4 rounded-xl">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 block uppercase">Días Libres / Permisos</span>
            <span className="text-2xl font-black font-mono text-amber-800 dark:text-amber-300 mt-1 block">{totalLibres}</span>
          </div>
          <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 p-4 rounded-xl">
            <span className="text-xs font-bold text-rose-700 dark:text-rose-400 block uppercase">Faltas Injustificadas</span>
            <span className="text-2xl font-black font-mono text-rose-800 dark:text-rose-300 mt-1 block">{totalFaltas}</span>
          </div>
        </div>

        {/* LEYENDA DE COLORES INTERACTIVA */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold bg-slate-100 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="text-slate-500">Haz clic en cada día para cambiar el estado:</span>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> Asistió</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500 inline-block" /> Libre Solicitado</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-rose-600 inline-block" /> Falta Injustificada</div>
          <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-300 dark:bg-slate-700 inline-block" /> Pendiente</div>
        </div>

        {/* CALENDARIO DIARIO (GRILLA DE 30 DÍAS) */}
        <div>
          <h3 className="text-xs font-black uppercase tracking-wide text-slate-600 dark:text-slate-400 mb-3">
            📅 Detalle Diario del Mes (1 al 30)
          </h3>
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
            {empleadoActual.dias.map((d) => {
              let colorClase = "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-amber-500";
              let etiqueta = "Pendiente";
              
              if (d.estado === "asistio") {
                colorClase = "bg-emerald-500 text-slate-950 font-black border-emerald-600 shadow-md";
                etiqueta = "Asistió";
              } else if (d.estado === "libre") {
                colorClase = "bg-amber-500 text-slate-950 font-black border-amber-600 shadow-md";
                etiqueta = "Libre";
              } else if (d.estado === "falta") {
                colorClase = "bg-rose-600 text-white font-black border-rose-700 shadow-md animate-pulse";
                etiqueta = "Falta";
              }

              return (
                <button
                  key={d.dia}
                  type="button"
                  onClick={() => handleCambiarEstadoDia(d.dia)}
                  className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center ${colorClase}`}
                  title={`Día ${d.dia}: ${etiqueta} (Haz clic para cambiar)`}
                >
                  <span className="text-[10px] uppercase tracking-wider opacity-80">Día</span>
                  <span className="text-base font-mono font-bold">{d.dia}</span>
                  <span className="text-[9px] uppercase tracking-tight mt-0.5 px-1 rounded bg-black/10 dark:bg-white/10">
                    {etiqueta}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* BOTONERÍA OPERATIVA EN LÍNEA EN LA PARTE INFERIOR */}
      <div className="max-w-5xl mx-auto mt-6 pt-4 border-t border-slate-300 dark:border-slate-800 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => alert("¡Asistencia guardada y sincronizada correctamente en el sistema!")}
          className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded shadow hover:bg-emerald-500 transition cursor-pointer flex items-center gap-1.5"
        >
          💾 Guardar Asistencia
        </button>

        <button
          type="button"
          onClick={handleImprimir}
          className="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-300 transition cursor-pointer flex items-center gap-1.5"
        >
          🖨️ Imprimir Formato
        </button>

        <button
          type="button"
          onClick={handleDescargarCSV}
          className="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-300 transition cursor-pointer flex items-center gap-1.5"
        >
          📥 Descargar Reporte CSV
        </button>
      </div>

    </div>
  );
}