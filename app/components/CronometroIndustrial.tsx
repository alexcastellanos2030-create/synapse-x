"use client";

import React, { useState, useEffect } from "react";

export interface CronometroIndustrialProps {
  nombreEstacion?: string;
  esClaro?: boolean;
}

export default function CronometroIndustrial({
  nombreEstacion = "Control de Proceso",
  esClaro = false,
}: CronometroIndustrialProps) {
  const [segundosTotales, setSegundosTotales] = useState<number>(0);
  const [activo, setActivo] = useState<boolean>(false);
  const [editando, setEditando] = useState<boolean>(false);
  const [inputMin, setInputMin] = useState<string>("0");
  const [inputSec, setInputSec] = useState<string>("0");

  // FUNCIÓN PARA REPRODUCIR LA ALARMA SONORA INDUSTRIAL (WEB AUDIO API)
  const emitirAlarmaSonoraIndustrial = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      
      const audioCtx = new AudioCtx();
      
      // Emitir 4 ráfagas seguidas de pitidos industriales penetrantes
      const tiemposBeeps = [0, 0.25, 0.5, 0.75, 1.1, 1.35, 1.6];

      tiemposBeeps.forEach((inicio) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        // Tono tipo pito/sirena de fábrica (880 Hz - Nota A5)
        osc.type = "square";
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + inicio);

        // Volumen potente
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime + inicio);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + inicio + 0.18);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(audioCtx.currentTime + inicio);
        osc.stop(audioCtx.currentTime + inicio + 0.18);
      });
    } catch (e) {
      console.error("Error al reproducir alarma sonora:", e);
    }
  };

  useEffect(() => {
    let intervalo: NodeJS.Timeout | null = null;
    if (activo && segundosTotales > 0) {
      intervalo = setInterval(() => {
        setSegundosTotales((prev) => {
          if (prev <= 1) {
            setActivo(false);
            
            // 🚨 REPRODUCIR ALARMA SONORA Y ALERTA VISUAL
            emitirAlarmaSonoraIndustrial();
            setTimeout(() => {
              alert(`⏰ ¡TIEMPO CUMPLIDO EN ${nombreEstacion.toUpperCase()}!`);
            }, 100);

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalo) clearInterval(intervalo);
    };
  }, [activo, segundosTotales, nombreEstacion]);

  const minutos = Math.floor(segundosTotales / 60);
  const segundos = segundosTotales % 60;

  const formatear = (val: number) => String(val).padStart(2, "0");

  const sumarMinutos = (m: number) => {
    setSegundosTotales((prev) => Math.max(0, prev + m * 60));
  };

  const sumarSegundos = (s: number) => {
    setSegundosTotales((prev) => Math.max(0, prev + s));
  };

  const handleReset = () => {
    setActivo(false);
    setSegundosTotales(0);
  };

  const guardarEdicionManual = () => {
    const m = parseInt(inputMin) || 0;
    const s = parseInt(inputSec) || 0;
    setSegundosTotales(m * 60 + s);
    setEditando(false);
  };

  return (
    <div className="bg-slate-950 dark:bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-xl max-w-sm mx-auto text-white font-sans transition-colors">
      
      {/* CABECERA DEL CRONÓMETRO */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
          <span>🔊</span> ⏱️ Timer: {nombreEstacion}
        </span>
        <button
          type="button"
          onClick={() => setEditando(!editando)}
          className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded border border-slate-600 transition-colors cursor-pointer"
        >
          {editando ? "Cerrar Edición" : "✏️ Editar Tiempo"}
        </button>
      </div>

      {/* PANTALLA DIGITAL ESTILO RELOJ */}
      <div className={`bg-slate-900 dark:bg-slate-950 border-2 ${segundosTotales === 0 && !activo ? 'border-slate-700' : 'border-amber-500/80'} rounded-xl py-3 px-6 text-center shadow-inner mb-3`}>
        {editando ? (
          <div className="flex justify-center items-center gap-2">
            <input
              type="number"
              value={inputMin}
              onChange={(e) => setInputMin(e.target.value)}
              className="w-14 bg-slate-800 text-center text-lg font-mono font-bold text-amber-400 border border-slate-600 rounded p-1"
              placeholder="Min"
            />
            <span className="text-xl font-bold">:</span>
            <input
              type="number"
              value={inputSec}
              onChange={(e) => setInputSec(e.target.value)}
              className="w-14 bg-slate-800 text-center text-lg font-mono font-bold text-amber-400 border border-slate-600 rounded p-1"
              placeholder="Sec"
            />
            <button
              type="button"
              onClick={guardarEdicionManual}
              className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-2 py-1 rounded text-xs ml-1 cursor-pointer"
            >
              OK
            </button>
          </div>
        ) : (
          <div className="text-4xl font-mono font-black tracking-widest text-amber-400 drop-shadow">
            {formatear(minutos)}:{formatear(segundos)}
          </div>
        )}
      </div>

      {/* BOTONERA FÍSICA CON BOTÓN DE RESET INDEPENDIENTE */}
      <div className="grid grid-cols-4 gap-1.5 pt-1">
        
        {/* BOTÓN 1: MIN (+1 Min) */}
        <button
          type="button"
          onClick={() => sumarMinutos(1)}
          className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-[10px] py-2 px-1 rounded-lg shadow border border-sky-400 active:scale-95 transition-all flex flex-col items-center justify-center cursor-pointer"
        >
          <span>MIN</span>
          <span className="text-[9px] font-normal opacity-80">+1 min</span>
        </button>

        {/* BOTÓN 2: SEC (+15 Seg) */}
        <button
          type="button"
          onClick={() => sumarSegundos(15)}
          className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-[10px] py-2 px-1 rounded-lg shadow border border-sky-400 active:scale-95 transition-all flex flex-col items-center justify-center cursor-pointer"
        >
          <span>SEC</span>
          <span className="text-[9px] font-normal opacity-80">+15 seg</span>
        </button>

        {/* BOTÓN 3: START / PAUSE */}
        <button
          type="button"
          onClick={() => setActivo(!activo)}
          className={`${
            activo
              ? "bg-amber-500 hover:bg-amber-400 text-slate-950"
              : "bg-emerald-600 hover:bg-emerald-500 text-white"
          } font-bold text-[10px] py-2 px-1 rounded-lg shadow border border-slate-500 active:scale-95 transition-all flex flex-col items-center justify-center cursor-pointer`}
        >
          <span>{activo ? "PAUSE" : "START"}</span>
          <span className="text-[9px] font-normal opacity-90">{activo ? "Pausar" : "Iniciar"}</span>
        </button>

        {/* BOTÓN 4: RESET APARTE (Independiente) */}
        <button
          type="button"
          onClick={handleReset}
          className="bg-red-600 hover:bg-red-500 text-white font-black text-[10px] py-2 px-1 rounded-lg shadow border border-red-400 active:scale-95 transition-all flex flex-col items-center justify-center cursor-pointer"
        >
          <span>RESET</span>
          <span className="text-[9px] font-normal opacity-80">A 00:00</span>
        </button>

      </div>
    </div>
  );
}