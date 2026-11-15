"use client";

import React, { useState } from "react";
import CustomThemeModal from "./CustomThemeModal";

interface SidebarProps {
  sidebarColapsada: boolean;
  setSidebarColapsada: (val: boolean) => void;
  sidebarMovilAbierta: boolean;
  setSidebarMovilAbierta: (val: boolean) => void;
  estacionActiva: number;
  setEstacionActiva: (id: number) => void;
  rolActivo: "superuser" | "admin" | "operario" | "cajera" | "supervisor";
  conmutarRol: () => void;
  temaVisual: "oscuro" | "claro" | "sistema";
  setTemaVisual: (tema: "oscuro" | "claro" | "sistema") => void;
  handleCerrarSesion: () => void;
  lotesActivos?: any[];
  onActivarSuperuser?: () => void;
}

export default function Sidebar({
  sidebarColapsada,
  setSidebarColapsada,
  sidebarMovilAbierta,
  setSidebarMovilAbierta,
  estacionActiva,
  setEstacionActiva,
  rolActivo,
  conmutarRol,
  temaVisual,
  setTemaVisual,
  handleCerrarSesion,
  onActivarSuperuser,
}: SidebarProps) {
  const [isCustomThemeOpen, setIsCustomThemeOpen] = useState<boolean>(false);

  // Menú operativo
  const menuItems = [
    { id: 1, nombre: "Dashboard", icono: "🏠" },
    { id: 0, nombre: "Pedidos", icono: "🛒" },
    { id: 105, nombre: "Producción", icono: "⚙️" },
    { id: 101, nombre: "Productos", icono: "📦" },
    { id: 102, nombre: "Inventario", icono: "📊" },
    { id: 103, nombre: "Clientes", icono: "👥" },
    { id: 104, nombre: "Recetas", icono: "🍳" },
    { id: 106, nombre: "Ficha Técnica", icono: "📋" },
    { id: 107, nombre: "Proveedores", icono: "🚚" },
    { id: 108, nombre: "Reportes", icono: "📈" },
    { id: 109, nombre: "Caja", icono: "💰" },
    { id: 115, nombre: "Protocolos", icono: "🛡️" },
  ];

  const handleActivarTemaOscuroGlobal = () => {
    setTemaVisual("oscuro");
    if (typeof window !== "undefined") {
      localStorage.setItem("synapse_tema", "oscuro");
      document.documentElement.setAttribute("data-global-theme", "dark");
      document.documentElement.classList.add("dark");
      window.location.reload();
    }
  };

  return (
    <>
      {sidebarColapsada && (
        <button
          type="button"
          onClick={() => setSidebarColapsada(false)}
          className="fixed top-3 left-1 z-50 w-10 h-10 rounded-xl bg-black border border-amber-500/60 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:bg-zinc-900 transition-all cursor-pointer flex items-center justify-center text-lg"
          title="Desplegar Menú Operativo"
        >
          👨‍🍳
        </button>
      )}

      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          ${sidebarColapsada ? "-translate-x-full md:w-0 md:overflow-hidden md:p-0 md:border-none" : "w-72"}
          bg-black text-white border-r border-zinc-800 
          flex flex-col justify-between p-3 shadow-2xl 
          transition-all duration-300 h-[100dvh] font-sans shrink-0
        `}
      >
        <div className="flex flex-col h-full overflow-hidden space-y-3">
          
          {/* Cabecera corporativa */}
          <div className="border-b border-zinc-800 pb-3 flex items-center justify-between shrink-0 px-2">
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
              onClick={() => setSidebarColapsada(true)}
              className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-amber-400 hover:bg-zinc-800 transition-all cursor-pointer shadow-md flex items-center gap-2"
              title="Ocultar Menú"
            >
              <span className="text-base">👨‍🍳</span>
              <span className="text-xs font-bold uppercase font-mono tracking-wider text-white">Menú</span>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
            {menuItems.map((item) => {
              const activo = estacionActiva === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setEstacionActiva(item.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-3 border cursor-pointer shadow-md ${
                    activo
                      ? "bg-white text-black font-black border-white shadow-lg"
                      : "bg-zinc-950 text-white border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700"
                  }`}
                >
                  <span className="text-base">{item.icono}</span>
                  <span className="truncate">{item.nombre}</span>
                </button>
              );
            })}
          </nav>

          <div className="border-t border-zinc-800 pt-3 space-y-2 shrink-0">
            
            {/* GESTIÓN DE PERSONAL */}
            {(rolActivo === "superuser" || rolActivo === "admin" || rolActivo === "supervisor") && (
              <button
                type="button"
                onClick={() => setEstacionActiva(99)}
                className={`w-full text-left px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-3 border cursor-pointer shadow-md ${
                  estacionActiva === 99
                    ? "bg-amber-500 text-slate-950 font-black border-amber-400 shadow-lg"
                    : "bg-zinc-900 text-amber-400 border-amber-500/40 hover:bg-zinc-800"
                }`}
              >
                <span className="text-base">👥</span>
                <span className="truncate font-mono">Gestión de Personal</span>
              </button>
            )}

            {/* ÁREA DE SUPERUSER */}
            {rolActivo === "superuser" && (
              <button
                type="button"
                onClick={() => {
                  if (onActivarSuperuser) onActivarSuperuser();
                }}
                className="w-full text-left px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-3 border bg-zinc-900 border-amber-500/60 text-amber-400 hover:bg-zinc-800 cursor-pointer shadow-lg"
              >
                <span className="text-base">👑</span>
                <span className="truncate font-mono">Área de Superuser</span>
              </button>
            )}

            <div className="grid grid-cols-4 gap-1 pt-1">
              <button
                type="button"
                onClick={() => setTemaVisual("claro")}
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
                onClick={() => setTemaVisual("sistema")}
                className="py-1.5 rounded-lg border text-xs transition cursor-pointer flex items-center justify-center bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800"
                title="Automático"
              >
                💻
              </button>
              <button
                type="button"
                onClick={() => setIsCustomThemeOpen(true)}
                className="py-1.5 rounded-lg border text-xs transition cursor-pointer flex items-center justify-center bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500 hover:text-black font-bold"
                title="Estética"
              >
                🎨
              </button>
            </div>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full py-2 bg-white text-black font-black text-xs uppercase tracking-wider rounded-full hover:bg-zinc-200 transition-all cursor-pointer shadow-lg text-center"
            >
              Actualización
            </button>

            <button
              type="button"
              onClick={handleCerrarSesion}
              className="w-full py-2 bg-zinc-900 hover:bg-rose-950/60 text-zinc-300 hover:text-rose-400 text-xs font-bold rounded-full transition-all border border-zinc-800 hover:border-rose-800 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>🚪</span>
              <span>Cierre de Sesión</span>
            </button>
          </div>

        </div>
      </aside>

      <CustomThemeModal
        isOpen={isCustomThemeOpen}
        onClose={() => setIsCustomThemeOpen(false)}
        onApplyTheme={() => {
          setIsCustomThemeOpen(false);
        }}
      />
    </>
  );
}