"use client";

import React from "react";
import {
  ChefHat,
  ShieldCheck,
  FlaskConical,
  HardHat,
  Factory,
  Package,
  Warehouse,
  Truck,
  FileText,
  LayoutDashboard,
  ClipboardList,
  Activity,
  Sparkles,
} from "lucide-react";

export type TipoUsuarioSistema = "prueba" | "real";

interface DashboardAU00Props {
  rolActivo?: string;
  cedulaActiva?: string;
  tipoUsuario?: TipoUsuarioSistema;
  estacionActiva?: string;
  onSeleccionarEstacion?: (estacion: string) => void;
  onCambiarArea?: (area: string) => void;
}

const ACCESOS_RAPIDOS_AU = [
  { id: "AU01", nombre: "Dueño / Adm", detalle: "Control general y supervisión", icono: ShieldCheck, acento: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
  { id: "AU02", nombre: "ING de Alimentación", detalle: "Calidad, formulación y control", icono: FlaskConical, acento: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" },
  { id: "AU03", nombre: "Técnico Panadero", detalle: "Procesos, masas y horneo", icono: ChefHat, acento: "text-orange-400 border-orange-500/30 bg-orange-500/10" },
  { id: "AU04", nombre: "Operador de Planta", detalle: "Ejecución en línea de producción", icono: HardHat, acento: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10" },
  { id: "AU05", nombre: "Producción", detalle: "Turnos, lotes y rendimiento", icono: Factory, acento: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
  { id: "AU06", nombre: "Inventario", detalle: "Existencias y materias primas", icono: Package, acento: "text-blue-400 border-blue-500/30 bg-blue-500/10" },
  { id: "AU07", nombre: "Bodega / Stock", detalle: "Almacenamiento y reposición", icono: Warehouse, acento: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10" },
  { id: "AU08", nombre: "Despacho", detalle: "Rutas, entregas y logística", icono: Truck, acento: "text-rose-400 border-rose-500/30 bg-rose-500/10" },
  { id: "AU09", nombre: "Protocolos", detalle: "Normas, higiene y POE", icono: FileText, acento: "text-teal-400 border-teal-500/30 bg-teal-500/10" },
  { id: "AU10", nombre: "Portal AU01", detalle: "Módulo base de operación", icono: LayoutDashboard, acento: "text-purple-400 border-purple-500/30 bg-purple-500/10" },
  { id: "AU11", nombre: "Registro de Pedido (AU02)", detalle: "Toma y control de pedidos", icono: ClipboardList, acento: "text-amber-300 border-amber-400/30 bg-amber-400/10" },
];

export default function DashboardAU00({
  rolActivo = "Operador",
  cedulaActiva = "",
  tipoUsuario = "real",
  estacionActiva = "AU00",
  onSeleccionarEstacion,
  onCambiarArea,
}: DashboardAU00Props) {
  const irAEstacion = (id: string) => {
    if (onCambiarArea) {
      onCambiarArea("usuario");
    }
    if (onSeleccionarEstacion) {
      onSeleccionarEstacion(id);
    } else if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("synapse:seleccionar-estacion", { detail: { estacion: id } })
      );
    }
  };

  return (
    <section className="w-full h-full overflow-y-auto p-4 md:p-6 bg-slate-950 text-slate-100 font-mono space-y-5">
      {/* Cabecera principal AU00 */}
      <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-r from-slate-900 via-slate-900/95 to-purple-950/30 p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-[10px] text-purple-300 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dashboard Principal · AU00</span>
          </div>
          <h1 className="text-base md:text-lg font-bold text-white tracking-tight">
            Entorno de Trabajo Unificado — Área de Usuario
          </h1>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Vista central de coordinación operativa, estaciones de trabajo y módulos del Área de Usuario en{" "}
            <span className="text-cyan-400 font-semibold">SYNAPSE-X OS-AI</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[10px]">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950/90 border border-slate-800">
            <span className="text-slate-500 block text-[9px] uppercase">Estación</span>
            <span className="text-purple-300 font-bold">{estacionActiva || "AU00"}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-950/90 border border-slate-800">
            <span className="text-slate-500 block text-[9px] uppercase">Perfil / Rol</span>
            <span className="text-slate-200 font-bold">{rolActivo || "Usuario"}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-950/90 border border-slate-800">
            <span className="text-slate-500 block text-[9px] uppercase">Entorno</span>
            <span className="text-emerald-400 font-bold uppercase">{tipoUsuario}</span>
          </div>
          {cedulaActiva ? (
            <div className="px-3 py-1.5 rounded-xl bg-slate-950/90 border border-slate-800">
              <span className="text-slate-500 block text-[9px] uppercase">ID / CI</span>
              <span className="text-cyan-300 font-bold">{cedulaActiva}</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Métricas rápidas de estado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>ESTACIONES ACTIVAS</span>
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-base font-bold text-white">AU01 – AU09</p>
          <p className="text-[10px] text-slate-400">Roles operativos listos para selección</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>MÓDULOS BASE</span>
            <LayoutDashboard className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <p className="text-base font-bold text-white">AU10 · AU11</p>
          <p className="text-[10px] text-slate-400">Portal base y registro de pedidos</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>CONTINUIDAD DE SESIÓN</span>
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <p className="text-base font-bold text-emerald-400">RETENIDA OK</p>
          <p className="text-[10px] text-slate-400">Navegación estable entre vistas</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 space-y-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>TIPO DE REGISTRO</span>
            <Factory className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-base font-bold text-amber-300 uppercase">{tipoUsuario}</p>
          <p className="text-[10px] text-slate-400">Trazabilidad por estación activa</p>
        </div>
      </div>

      {/* Grilla de estaciones y módulos del Área de Usuario */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Estaciones y Módulos del Área de Usuario
          </h2>
          <span className="text-[10px] text-slate-500">
            Selecciona cualquier tarjeta para abrir su vista
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ACCESOS_RAPIDOS_AU.map((item) => {
            const Icono = item.icono;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => irAEstacion(item.id)}
                className="group text-left rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-purple-500/40 p-3.5 transition-all cursor-pointer flex items-start gap-3"
              >
                <div
                  className={`p-2 rounded-lg border shrink-0 transition-transform group-hover:scale-105 ${item.acento}`}
                >
                  <Icono className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-white truncate">
                      {item.nombre}
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 shrink-0">
                      {item.id}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">
                    {item.detalle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}