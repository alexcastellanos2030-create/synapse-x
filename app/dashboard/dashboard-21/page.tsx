"use client";

import React, { useState } from "react";
import SidebarSuperuser from "../../components/SidebarSuperuser";
import { ShieldAlert, Activity, Cpu, RefreshCw, AlertTriangle, Zap, Radio, Database, Gauge, Terminal } from "lucide-react";

export default function Dashboard21Page() {
  const [superuserModoActivo, setSuperuserModoActivo] = useState<boolean>(true);
  const [estacionActiva, setEstacionActiva] = useState<string | number>("SU21");
  const [rolActivo, setRolActivo] = useState<"superuser" | "admin" | "operario" | "cajera" | "supervisor">("superuser");
  const [temaVisual, setTemaVisual] = useState<"oscuro" | "claro" | "sistema">("oscuro");

  // Estado del Gemelo Digital (Planta en Vivo)
  const [plantState, setPlantState] = useState({
    ovenTemp: 240,         // °C
    mixerSpeed: 85,        // % RPM
    conveyorActive: true,
    hopperWeight: 1250,    // kg
    steamPressure: 2.4,    // Bar
  });

  // Simulador de Hidratación en el Lab
  const [labHarinaKg, setLabHarinaKg] = useState<number>(50);
  const [labHidratacionPct, setLabHidratacionPct] = useState<number>(55);

  // Estado de Inyección de Fallas
  const [faults, setFaults] = useState({
    sensorFailure: false,
    authBypassAttempt: false,
    plcTimeout: false,
  });

  // Logs de telemetría y consola
  const [logs, setLogs] = useState<Array<{ id: number; time: string; type: 'INFO' | 'WARN' | 'ERROR'; message: string }>>([
    { id: 1, time: '12:00:01', type: 'INFO', message: 'Synapse-X OSAI Industrial: Laboratorio Virtual SU21 inicializado correctamente.' },
    { id: 2, time: '12:00:02', type: 'INFO', message: 'Conexión WebSocket con Supabase Edge establecida (Latencia: 14ms).' },
  ]);

  const addLog = (type: 'INFO' | 'WARN' | 'ERROR', message: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs(prev => [{ id: Date.now(), time, type, message }, ...prev.slice(0, 19)]);
  };

  const toggleFault = (faultKey: keyof typeof faults) => {
    const newState = !faults[faultKey];
    setFaults(prev => ({ ...prev, [faultKey]: newState }));
    if (newState) {
      addLog('ERROR', `[INYECCIÓN DE ANOMALÍA] Activada: ${faultKey.toUpperCase()}`);
    } else {
      addLog('INFO', `[RECUPERACIÓN] Resuelta anomalía: ${faultKey.toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex font-mono select-none">
      
      {/* BARRA LATERAL MAESTRA DE SUPERUSER */}
      <SidebarSuperuser
        superuserModoActivo={superuserModoActivo}
        setSuperuserModoActivo={(val) => {
          setSuperuserModoActivo(val);
          if (!val) {
            window.location.href = "/estaciones/estacion-1";
          }
        }}
        rolActivo={rolActivo}
        estacionActiva={estacionActiva}
        setEstacionActiva={(id) => {
          setEstacionActiva(id);
          if (id === "SU20" || id === 20) {
            window.location.href = "/dashboard/dashboard-20";
          } else if (id === "SU21" || id === 21) {
            window.location.href = "/dashboard/dashboard-21";
          } else if (id !== "SU99") {
            window.location.href = `/estaciones/estacion-${id}`;
          }
        }}
        conmutarRol={() => setRolActivo(rolActivo === "superuser" ? "operario" : "superuser")}
        setTemaVisual={setTemaVisual}
        handleCerrarSesion={() => {
          localStorage.clear();
          window.location.reload();
        }}
      />

      {/* CONTENIDO PRINCIPAL DEL LABORATORIO VIRTUAL (SU21) */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
        
        {/* Cabecera del Laboratorio */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-emerald-500/30 pb-4 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h1 className="text-sm font-bold tracking-wider text-emerald-400 uppercase">
                Synapse-X OSAI Industrial // SU21: LABORATORIO VIRTUAL & GEMELO DIGITAL
              </h1>
            </div>
            <p className="text-slate-400 text-[10px] mt-1">
              Entorno de pruebas y simulación física en tiempo real para validación de lógica de planta y tolerancia a fallos.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-slate-300 text-xs">ESTADO: <strong className="text-emerald-400">SIMULACIÓN ACTIVA</strong></span>
            </div>
            <button 
              onClick={() => { 
                setPlantState({ ovenTemp: 240, mixerSpeed: 85, conveyorActive: true, hopperWeight: 1250, steamPressure: 2.4 }); 
                addLog('INFO', 'Gemelo digital reiniciado a valores nominales de fábrica.'); 
              }}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded transition flex items-center gap-1.5 cursor-pointer text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Resetear Mock</span>
            </button>
          </div>
        </div>

        {/* Grid Principal de Control del Laboratorio */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Columna 1: Gemelo Digital & Parámetros Físicos */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h2 className="text-slate-300 font-bold uppercase text-xs flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" /> Gemelo Digital (Variables PLC)
              </h2>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">En Vivo</span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Temperatura Horno Principal:</span>
                  <span className="text-amber-400 font-bold">{plantState.ovenTemp} °C</span>
                </div>
                <input 
                  type="range" min="100" max="350" value={plantState.ovenTemp} 
                  onChange={(e) => setPlantState({ ...plantState, ovenTemp: Number(e.target.value) })}
                  className="w-full accent-emerald-500 bg-slate-900 h-1 rounded cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Velocidad Amasadora (Koenig):</span>
                  <span className="text-emerald-400 font-bold">{plantState.mixerSpeed} RPM</span>
                </div>
                <input 
                  type="range" min="0" max="150" value={plantState.mixerSpeed} 
                  onChange={(e) => setPlantState({ ...plantState, mixerSpeed: Number(e.target.value) })}
                  className="w-full accent-emerald-500 bg-slate-900 h-1 rounded cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Peso Tolva Principal:</span>
                  <span className="text-cyan-400 font-bold">{plantState.hopperWeight} kg</span>
                </div>
                <input 
                  type="range" min="0" max="3000" value={plantState.hopperWeight} 
                  onChange={(e) => setPlantState({ ...plantState, hopperWeight: Number(e.target.value) })}
                  className="w-full accent-cyan-500 bg-slate-900 h-1 rounded cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">Presión de Vapor (Caldera):</span>
                  <span className="text-amber-300 font-bold">{plantState.steamPressure} Bar</span>
                </div>
                <input 
                  type="range" min="1.0" max="5.0" step="0.1" value={plantState.steamPressure} 
                  onChange={(e) => setPlantState({ ...plantState, steamPressure: Number(e.target.value) })}
                  className="w-full accent-amber-500 bg-slate-900 h-1 rounded cursor-pointer"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-900">
                <span className="text-slate-400">Banda Transportadora:</span>
                <button 
                  onClick={() => {
                    const newState = !plantState.conveyorActive;
                    setPlantState({ ...plantState, conveyorActive: newState });
                    addLog('INFO', `Banda transportadora ${newState ? 'ACTIVADA' : 'DETENIDA'}`);
                  }}
                  className={`px-3 py-1 rounded text-[10px] font-bold border transition cursor-pointer ${plantState.conveyorActive ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40' : 'bg-rose-950/60 text-rose-400 border-rose-500/40'}`}
                >
                  {plantState.conveyorActive ? 'OPERANDO' : 'DETENIDO'}
                </button>
              </div>
            </div>
          </div>

          {/* Columna 2: Simulador de Hidratación & Recetas */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h2 className="text-slate-300 font-bold uppercase text-xs flex items-center gap-2">
                <Gauge className="w-4 h-4 text-cyan-400" /> Laboratorio de Hidratación
              </h2>
              <span className="text-[10px] text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">Fórmulas</span>
            </div>

            <p className="text-slate-400 text-[11px]">
              Simula la absorción de agua y el rendimiento de masa antes de enviar la orden al taller:
            </p>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Harina Base (Kg):</label>
                <input 
                  type="number" value={labHarinaKg} 
                  onChange={(e) => setLabHarinaKg(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">% Hidratación Panadera:</span>
                  <span className="text-cyan-400 font-bold">{labHidratacionPct}%</span>
                </div>
                <input 
                  type="range" min="40" max="90" value={labHidratacionPct} 
                  onChange={(e) => setLabHidratacionPct(Number(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-900 h-1 rounded cursor-pointer"
                />
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between text-slate-300">
                  <span>Agua Requerida:</span>
                  <strong className="text-cyan-400">{(labHarinaKg * (labHidratacionPct / 100)).toFixed(2)} Kg</strong>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Masa Total Resultante:</span>
                  <strong className="text-emerald-400">{(labHarinaKg * (1 + labHidratacionPct / 100)).toFixed(2)} Kg</strong>
                </div>
              </div>

              <button 
                onClick={() => addLog('INFO', `Simulación guardada: ${labHarinaKg}kg harina al ${labHidratacionPct}% de hidratación.`)}
                className="w-full py-2 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 text-cyan-400 rounded text-xs font-bold transition cursor-pointer"
              >
                Guardar Fórmula en Caché Lab
              </button>
            </div>
          </div>

          {/* Columna 3: Inyector de Fallas & Banco de Pruebas */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h2 className="text-slate-300 font-bold uppercase text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" /> Inyector de Fallas (Test 0.01%)
              </h2>
              <span className="text-[10px] text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/20">Resiliencia</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <button 
                onClick={() => toggleFault('sensorFailure')}
                className={`w-full p-2.5 rounded border text-left flex items-center justify-between transition cursor-pointer ${faults.sensorFailure ? 'bg-rose-950/40 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'}`}
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`w-4 h-4 ${faults.sensorFailure ? 'text-rose-400 animate-bounce' : 'text-slate-500'}`} />
                  <span>Fallo de Sensores (Timeout PLC)</span>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded ${faults.sensorFailure ? 'bg-rose-500 text-black font-bold' : 'bg-slate-800 text-slate-400'}`}>
                  {faults.sensorFailure ? 'ACTIVO' : 'INACTIVO'}
                </span>
              </button>

              <button 
                onClick={() => toggleFault('authBypassAttempt')}
                className={`w-full p-2.5 rounded border text-left flex items-center justify-between transition cursor-pointer ${faults.authBypassAttempt ? 'bg-rose-950/40 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'}`}
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert className={`w-4 h-4 ${faults.authBypassAttempt ? 'text-rose-400 animate-bounce' : 'text-slate-500'}`} />
                  <span>Simular Intrusión Whitelist (Sub Portal 3)</span>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded ${faults.authBypassAttempt ? 'bg-rose-500 text-black font-bold' : 'bg-slate-800 text-slate-400'}`}>
                  {faults.authBypassAttempt ? 'ACTIVO' : 'INACTIVO'}
                </span>
              </button>

              <button 
                onClick={() => toggleFault('plcTimeout')}
                className={`w-full p-2.5 rounded border text-left flex items-center justify-between transition cursor-pointer ${faults.plcTimeout ? 'bg-rose-950/40 border-rose-500 text-rose-300' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'}`}
              >
                <div className="flex items-center gap-2">
                  <Zap className={`w-4 h-4 ${faults.plcTimeout ? 'text-amber-400 animate-bounce' : 'text-slate-500'}`} />
                  <span>Corte de Conexión PLC Industrial</span>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded ${faults.plcTimeout ? 'bg-amber-500 text-black font-bold' : 'bg-slate-800 text-slate-400'}`}>
                  {faults.plcTimeout ? 'ACTIVO' : 'INACTIVO'}
                </span>
              </button>
            </div>
          </div>

        </div>

        {/* Consola Inferior de Telemetría y Logs en Vivo */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 flex flex-col gap-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-slate-300 font-bold uppercase text-xs flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" /> Consola de Trazabilidad & Logs del Laboratorio
            </h2>
            <button 
              onClick={() => setLogs([])}
              className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
            >
              Limpiar Consola
            </button>
          </div>

          <div className="bg-black border border-slate-900 rounded-lg p-3 h-40 overflow-y-auto space-y-1.5 font-mono text-[10px]">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-2 border-b border-slate-900/50 pb-1">
                <span className="text-slate-500 shrink-0">[{log.time}]</span>
                <span className={`px-1 rounded text-[9px] font-bold shrink-0 ${
                  log.type === 'ERROR' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                  log.type === 'WARN' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                  'bg-emerald-950 text-emerald-400 border border-emerald-800'
                }`}>
                  {log.type}
                </span>
                <span className="text-slate-300 break-all">{log.message}</span>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-slate-500 flex justify-between items-center pt-1">
            <span>Margen de Error Controlado: <strong className="text-emerald-400">0.01%</strong></span>
            <span>Synapse-X OSAI Industrial — Kernel v2.6.0</span>
          </div>
        </div>

      </div>

    </div>
  );
}