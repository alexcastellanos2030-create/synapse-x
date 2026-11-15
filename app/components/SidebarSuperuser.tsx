"use client";

import React, { useState } from "react";

export interface SidebarSuperuserProps {
  superuserModoActivo: boolean;
  setSuperuserModoActivo: (val: boolean) => void;
  rolActivo: "superuser" | "admin" | "operario" | "cajera" | "supervisor";
  estacionActiva: string | number;
  setEstacionActiva: (id: string | number) => void;
  conmutarRol?: () => void;
  setTemaVisual?: (tema: "oscuro" | "claro" | "sistema") => void;
  handleCerrarSesion?: () => void;
}

export default function SidebarSuperuser({
  superuserModoActivo,
  setSuperuserModoActivo,
  rolActivo,
  estacionActiva,
  setEstacionActiva,
  conmutarRol,
  setTemaVisual,
  handleCerrarSesion,
}: SidebarSuperuserProps) {
  const [superuserColapsado, setSuperuserColapsado] = useState<boolean>(false);

  // Si no está activo el modo superuser, no renderizamos este sidebar
  if (!superuserModoActivo) return null;

  const dashboardsSuperuser = [
    { id: "SU99", nombre: "1. Control de Usuarios", icono: "👥" },
    { id: "SU2", nombre: "2. Gobernanza y Roles", icono: "👔" },
    { id: "SU3", nombre: "3. Auditoría de Seguridad", icono: "📋" },
    { id: "SU4", nombre: "4. Whitelist y Permisos", icono: "🛡️" },
    { id: "SU5", nombre: "5. Gestión de Hardware y MAC", icono: "💻" },
    { id: "SU6", nombre: "6. Monitoreo de Lotes Activos", icono: "🍞" },
    { id: "SU7", nombre: "7. Calibración de Hornos", icono: "🔥" },
    { id: "SU8", nombre: "8. Control Sanitario y Calidad", icono: "🧪" },
    { id: "SU9", nombre: "9. Formulación e Hidratación", icono: "💧" },
    { id: "SU10", nombre: "10. Inventario de Insumos", icono: "📦" },
    { id: "SU11", nombre: "11. Gestión de Proveedores", icono: "🚚" },
    { id: "SU12", nombre: "12. Caja y Transacciones", icono: "💰" },
    { id: "SU13", nombre: "13. Reportes de Producción", icono: "📈" },
    { id: "SU14", nombre: "14. Estadísticas de Planta", icono: "📊" },
    { id: "SU15", nombre: "15. Protocolos Profundos OSAI", icono: "🚨" },
    { id: "SU16", nombre: "16. Puntos de Restauración", icono: "💾" },
    { id: "SU17", nombre: "17. Puerta de Enlace Remoto", icono: "🌐" },
    { id: "SU18", nombre: "18. Diagnóstico de Red / DB", icono: "⚡" },
    { id: "SU19", nombre: "19. Trazabilidad Total", icono: "🔍" },
    { id: "SU20", nombre: "20. Licencias y Soporte", icono: "🔑" },
    { id: "SU21", nombre: "21. Laboratorio Virtual", icono: "🧪" },
  ];

  const handleActivarTemaOscuroGlobal = () => {
    if (setTemaVisual) setTemaVisual("oscuro");
    if (typeof window !== "undefined") {
      localStorage.setItem("synapse_tema", "oscuro");
      document.documentElement.setAttribute("data-global-theme", "dark");
      document.documentElement.classList.add("dark");
      window.location.reload();
    }
  };

  const ejecutarCierreSesion = () => {
    if (handleCerrarSesion) {
      handleCerrarSesion();
    } else if (typeof window !== "undefined") {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <>
      {superuserColapsado && (
        <button
          type="button"
          onClick={() => setSuperuserColapsado(false)}
          className="fixed top-3 left-1 z-50 w-10 h-10 rounded-xl bg-black border border-amber-500/80 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:bg-zinc-900 transition-all cursor-pointer flex items-center justify-center text-lg"
          title="Desplegar Menú Superuser"
        >
          👑
        </button>
      )}

      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          ${superuserColapsado ? "-translate-x-full md:w-0 md:overflow-hidden md:p-0 md:border-none" : "w-72"}
          bg-zinc-950 text-white border-r border-amber-500/40 
          flex flex-col justify-between p-3 shadow-2xl 
          transition-all duration-300 h-[100dvh] font-sans shrink-0
        `}
      >
        <div className="flex flex-col h-full overflow-hidden space-y-3">
          
          <div className="border-b border-amber-500/30 pb-3 flex items-center justify-between shrink-0 px-2">
            <div className="flex flex-col truncate">
              <span className="text-base font-black tracking-wider text-amber-400 uppercase font-mono truncate drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">
                Synapse-X
              </span>
              <span className="text-[10px] font-mono tracking-widest text-white uppercase font-bold drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]">
                OSAI Industrial
              </span>
            </div>

            <button
              type="button"
              onClick={() => setSuperuserColapsado(true)}
              className="px-3 py-2 rounded-xl bg-zinc-900 border border-amber-500/50 text-amber-400 hover:bg-zinc-800 transition-all cursor-pointer shadow-md flex items-center gap-2"
              title="Ocultar Menú Superuser"
            >
              <span className="text-base">👑</span>
              <span className="text-xs font-bold uppercase font-mono tracking-wider text-white">Super</span>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-amber-500/20">
            <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider px-2 pt-1">
              Módulos de Control Exclusivos:
            </div>

            {dashboardsSuperuser.map((item) => {
              const activo = estacionActiva === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (item.id === "SU20") {
                      window.location.href = "/dashboard/dashboard-20";
                    } else if (item.id === "SU21") {
                      window.location.href = "/dashboard-21";
                    } else {
                      setEstacionActiva(item.id);
                    }
                  }}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 flex items-center gap-3 border cursor-pointer shadow-md group ${
                    activo 
                      ? "bg-amber-500 text-black border-amber-400 font-black shadow-lg" 
                      : "bg-black border-zinc-800 hover:border-amber-500/60 hover:bg-zinc-900 text-zinc-200"
                  }`}
                >
                  <span className="text-base group-hover:scale-110 transition-transform">{item.icono}</span>
                  <span className="truncate font-mono">{item.nombre}</span>
                </button>
              );
            })}
          </nav>

          <div className="border-t border-zinc-800 pt-3 space-y-2 shrink-0">
            
            <button
              type="button"
              onClick={() => setSuperuserModoActivo(false)}
              className="w-full text-left px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-3 border bg-zinc-900 border-amber-500/50 hover:bg-zinc-800 text-amber-400 cursor-pointer shadow-lg"
            >
              <span className="text-base">👨‍🍳</span>
              <span className="truncate font-mono">Área de Usuario</span>
            </button>

            <div className="grid grid-cols-4 gap-1 pt-1">
              <button
                type="button"
                onClick={() => { if (setTemaVisual) setTemaVisual("claro"); }}
                className="py-1.5 rounded-lg border text-xs transition cursor-pointer flex items-center justify-center bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800"
                title="Tema Claro"
              >
                ☀️
              </button>
              
              <button
                type="button"
                onClick={handleActivarTemaOscuroGlobal}
                className="py-1.5 rounded-lg border text-xs transition cursor-pointer flex items-center justify-center bg-amber-500 text-black font-black border-amber-600 shadow-md"
                title="Tema Industrial Oscuro Global"
              >
                🌙
              </button>

              <button
                type="button"
                onClick={() => { if (setTemaVisual) setTemaVisual("sistema"); }}
                className="py-1.5 rounded-lg border text-xs transition cursor-pointer flex items-center justify-center bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800"
                title="Automático"
              >
                💻
              </button>
              <button
                type="button"
                onClick={() => {}}
                className="py-1.5 rounded-lg border text-xs transition cursor-pointer flex items-center justify-center bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500 hover:text-black font-bold"
                title="Estética"
              >
                🎨
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  localStorage.setItem("synapse_rol", "superuser");
                  window.location.reload();
                }
              }}
              className="w-full py-2 bg-amber-500 text-black font-black text-xs uppercase tracking-wider rounded-full hover:bg-amber-400 transition-all cursor-pointer shadow-lg text-center font-mono"
            >
              Actualización
            </button>

            <button
              type="button"
              onClick={ejecutarCierreSesion}
              className="w-full py-2 bg-zinc-900 hover:bg-rose-950/60 text-zinc-300 hover:text-rose-400 text-xs font-bold rounded-full transition-all border border-zinc-800 hover:border-rose-800 cursor-pointer flex items-center justify-center gap-2 font-mono"
            >
              <span>🚪</span>
              <span>Cierre de Sesión</span>
            </button>

            <div className="text-center pt-1">
              <span className="text-[9px] font-mono text-amber-500/80 uppercase tracking-widest block">
                Acceso Restrictivo Nivel 1
              </span>
            </div>

          </div>

        </div>
      </aside>
    </>
  );
}