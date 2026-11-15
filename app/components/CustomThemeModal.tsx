"use client";

import React, { useState, useEffect } from "react";

interface CustomThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTheme: (config: { fondo: string; contenedores: string; letras: string; botones: string }) => void;
}

export default function CustomThemeModal({ isOpen, onClose, onApplyTheme }: CustomThemeModalProps) {
  const [fondo, setFondo] = useState<string>("#0b101d");
  const [contenedores, setContenedores] = useState<string>("#151c2e");
  const [letras, setLetras] = useState<string>("#ffffff");
  const [botones, setBotones] = useState<string>("#f59e0b");

  // Cargar valores actuales si ya están guardados al abrir el modal
  useEffect(() => {
    if (typeof window !== "undefined" && isOpen) {
      const savedBg = localStorage.getItem("synapse_custom_bg");
      const savedContainer = localStorage.getItem("synapse_custom_container");
      const savedText = localStorage.getItem("synapse_custom_text");
      const savedBtn = localStorage.getItem("synapse_custom_btn");

      if (savedBg) setFondo(savedBg);
      if (savedContainer) setContenedores(savedContainer);
      if (savedText) setLetras(savedText);
      if (savedBtn) setBotones(savedBtn);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAplicar = () => {
    // 1. Guardar en localStorage de forma persistente
    if (typeof window !== "undefined") {
      localStorage.setItem("synapse_custom_bg", fondo);
      localStorage.setItem("synapse_custom_container", contenedores);
      localStorage.setItem("synapse_custom_text", letras);
      localStorage.setItem("synapse_custom_btn", botones);
      localStorage.setItem("synapse_custom_active", "true");
    }

    // 2. Aplicar variables CSS directamente al documento raíz sin recargar
    const root = document.documentElement;
    root.style.setProperty("--custom-bg", fondo);
    root.style.setProperty("--custom-container", contenedores);
    root.style.setProperty("--custom-text", letras);
    root.style.setProperty("--custom-btn", botones);

    document.body.setAttribute("data-custom-theme", "true");
    document.body.style.backgroundColor = fondo;
    document.body.style.color = letras;

    // 3. Notificar al componente superior
    onApplyTheme({ fondo, contenedores, letras, botones });
    alert("✨ ¡Estética personalizada aplicada con éxito a todo el Synapse-X OS!");
    onClose();
  };

  const handleRestaurar = () => {
    setFondo("#0b101d");
    setContenedores("#151c2e");
    setLetras("#ffffff");
    setBotones("#f59e0b");

    if (typeof window !== "undefined") {
      localStorage.removeItem("synapse_custom_bg");
      localStorage.removeItem("synapse_custom_container");
      localStorage.removeItem("synapse_custom_text");
      localStorage.removeItem("synapse_custom_btn");
      localStorage.removeItem("synapse_custom_active");
    }

    document.body.removeAttribute("data-custom-theme");
    document.body.style.backgroundColor = "";
    document.body.style.color = "";
    
    const root = document.documentElement;
    root.style.removeProperty("--custom-bg");
    root.style.removeProperty("--custom-container");
    root.style.removeProperty("--custom-text");
    root.style.removeProperty("--custom-btn");

    alert("🔄 Estética restaurada a los valores de fábrica.");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 font-sans animate-fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-[#111827] border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* CABECERA DEL MODAL */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-500 p-5 text-slate-950 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-mono uppercase font-black tracking-widest bg-black/20 px-2 py-0.5 rounded text-white">
              OSAI Industrial — Experiencia Operador
            </span>
            <h2 className="text-lg font-black uppercase tracking-wide mt-1 text-slate-950">
              🎨 Laboratorio de Estética y Colores a la Medida
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white font-bold flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* CUERPO DEL CONTENEDOR CON DESCRIPCIONES EDUCATIVAS */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          
          <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-xl text-amber-800 dark:text-amber-300">
            <p className="font-bold mb-1">💡 Guía para el Operador:</p>
            <p className="opacity-90 leading-relaxed">
              Personaliza el entorno visual de tu estación de trabajo según tu comodidad. Introduce códigos de color hexadecimales (ej. <code className="font-mono bg-black/10 dark:bg-white/10 px-1 rounded">#1a1a1a</code>) o nombres de colores. Al presionar aplicar, se propagarán por todo el sistema operativo de inmediato.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* CAMPO 1: FONDO */}
            <div className="space-y-1.5 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <label className="block font-black uppercase text-amber-600 dark:text-amber-400">
                1. Seleccione Color de Fondo
              </label>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="color"
                  value={fondo.startsWith("#") ? fondo : "#0b101d"}
                  onChange={(e) => setFondo(e.target.value)}
                  className="w-10 h-10 rounded-lg border-0 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={fondo}
                  onChange={(e) => setFondo(e.target.value)}
                  placeholder="Ej: #0b101d"
                  className="flex-1 p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-xs"
                />
              </div>
            </div>

            {/* CAMPO 2: CONTENEDORES */}
            <div className="space-y-1.5 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <label className="block font-black uppercase text-amber-600 dark:text-amber-400">
                2. Seleccione Color de Contenedores
              </label>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="color"
                  value={contenedores.startsWith("#") ? contenedores : "#151c2e"}
                  onChange={(e) => setContenedores(e.target.value)}
                  className="w-10 h-10 rounded-lg border-0 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={contenedores}
                  onChange={(e) => setContenedores(e.target.value)}
                  placeholder="Ej: #151c2e"
                  className="flex-1 p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-xs"
                />
              </div>
            </div>

            {/* CAMPO 3: LETRAS */}
            <div className="space-y-1.5 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <label className="block font-black uppercase text-amber-600 dark:text-amber-400">
                3. Seleccione Color de Letras
              </label>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="color"
                  value={letras.startsWith("#") ? letras : "#ffffff"}
                  onChange={(e) => setLetras(e.target.value)}
                  className="w-10 h-10 rounded-lg border-0 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={letras}
                  onChange={(e) => setLetras(e.target.value)}
                  placeholder="Ej: #ffffff"
                  className="flex-1 p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-xs"
                />
              </div>
            </div>

            {/* CAMPO 4: BOTONES */}
            <div className="space-y-1.5 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <label className="block font-black uppercase text-amber-600 dark:text-amber-400">
                4. Seleccione Color de Botones
              </label>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="color"
                  value={botones.startsWith("#") ? botones : "#f59e0b"}
                  onChange={(e) => setBotones(e.target.value)}
                  className="w-10 h-10 rounded-lg border-0 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={botones}
                  onChange={(e) => setBotones(e.target.value)}
                  placeholder="Ej: #f59e0b"
                  className="flex-1 p-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-xs"
                />
              </div>
            </div>

          </div>

          {/* VISTA PREVIA EN VIVO */}
          <div className="p-4 rounded-2xl border border-slate-300 dark:border-slate-700 space-y-2 transition-all shadow-inner" style={{ backgroundColor: fondo, color: letras }}>
            <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider opacity-70">
              <span>Vista Previa del Entorno Activo</span>
              <span>Synapse-X Engine</span>
            </div>
            <div className="p-3 rounded-xl border border-white/10" style={{ backgroundColor: contenedores }}>
              <div className="font-black text-sm mb-1">Panel Operativo de Prueba</div>
              <p className="text-[11px] opacity-80 mb-3">Así se visualizarán los datos y registros en planta.</p>
              <button type="button" className="px-4 py-2 font-black rounded-lg text-xs shadow-lg uppercase tracking-wider" style={{ backgroundColor: botones, color: '#000' }}>
                Botón de Acción Rápida
              </button>
            </div>
          </div>

        </div>

        {/* PIE DE PÁGINA / BOTONERÍA */}
        <div className="p-4 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <button
            type="button"
            onClick={handleRestaurar}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-300 transition cursor-pointer"
          >
            🔄 Restaurar Fábrica
          </button>
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl text-xs hover:bg-slate-400 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleAplicar}
              className="px-5 py-2 bg-amber-500 text-slate-950 font-black rounded-xl text-xs shadow-lg hover:bg-amber-400 transition cursor-pointer uppercase tracking-wider"
            >
              ✨ Aplicar Mi Estética Personalizada
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}