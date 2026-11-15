import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, AlertTriangle, CheckSquare, Square, ChevronDown, ChevronUp, User, Bell, Clock } from 'lucide-react';

interface Batch {
  id: string;
  productName: string;
  quantity: string;
  chamber: string;
  startTime: number | null; // Timestamp cuando inició
  elapsedSeconds: number;  // Segundos acumulados
  isRunning: boolean;
  checked: boolean;
  lastAlarmInterval: number; // Para controlar avisos de 30 min (1, 2, 3...)
}

export default function Station5Fermentation() {
  // Estado de los lotes en la Estación 5
  const [batches, setBatches] = useState<Batch[]>([
    { id: 'LOT-101', productName: 'Croissant Tradicional', quantity: '400 uds', chamber: 'Cámara 01', startTime: null, elapsedSeconds: 0, isRunning: false, checked: false, lastAlarmInterval: 0 },
    { id: 'LOT-102', productName: 'Pan Molde Integral', quantity: '150 uds', chamber: 'Cámara 02', startTime: null, elapsedSeconds: 0, isRunning: false, checked: false, lastAlarmInterval: 0 },
    { id: 'LOT-103', productName: 'Brioche Láctico 10cm', quantity: '600 uds', chamber: 'Cámara 01', startTime: null, elapsedSeconds: 0, isRunning: false, checked: false, lastAlarmInterval: 0 },
  ]);

  // Lote actualmente seleccionado en el foco del cronómetro superior
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  
  // Control de acordeón desplegado (IDs de lotes expandidos)
  const [expandedBatches, setExpandedBatches] = useState<Record<string, boolean>>({});

  // Datos del Responsable
  const [operatorName, setOperatorName] = useState('Alex Castellanos');
  const [shift, setShift] = useState('Mañana');
  const [chamberNotes, setChamberNotes] = useState('Parámetros: Temp 28°C | Humedad 80%');

  // Alarmas visuales activas
  const [alarmActive, setAlarmActive] = useState<string | null>(null);

  // Audio Context para alarma sonora
  const audioCtxRef = useRef<AudioContext | null>(null);

  const triggerSoundAlarm = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // Tono A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.5); // Sonido de 1.5s
    } catch (e) {
      console.log('Error reproduciendo sonido de alarma:', e);
    }
  };

  // Timer global para actualizar tiempos de lotes activos y verificar regla de 30 min
  useEffect(() => {
    const interval = setInterval(() => {
      setBatches((prevBatches) =>
        prevBatches.map((batch) => {
          if (!batch.isRunning) return batch;

          const newElapsed = batch.elapsedSeconds + 1;
          const currentInterval = Math.floor(newElapsed / 1800); // 1800 segundos = 30 minutos

          // Si alcanzó un nuevo múltiplo de 30 minutos (30m, 60m, 90m...)
          if (currentInterval > batch.lastAlarmInterval && currentInterval > 0) {
            triggerSoundAlarm();
            setAlarmActive(`¡Alerta de 30 min alcanzada en ${batch.id} (${batch.productName})!`);
            return {
              ...batch,
              elapsedSeconds: newElapsed,
              lastAlarmInterval: currentInterval,
            };
          }

          return { ...batch, elapsedSeconds: newElapsed };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Selección de lote (Aplica sombreado amarillo clarito + auto-checklist + activa/sincroniza cronómetro superior)
  const handleSelectBatch = (id: string) => {
    setSelectedBatchId(id);

    setBatches((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          // Si el lote no estaba corriendo, se marca checklist y arranca el conteo
          return {
            ...b,
            checked: true,
            isRunning: true,
          };
        }
        return b;
      })
    );
  };

  // Alternar checkbox manualmente
  const toggleCheck = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBatches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, checked: !b.checked } : b))
    );
  };

  // Alternar desplegado de acordeón
  const toggleAccordion = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedBatches((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Formatear segundos a 00:00:00
  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Lote actual en el panel superior
  const currentBatch = batches.find((b) => b.id === selectedBatchId);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 bg-slate-50 min-h-screen text-slate-800">
      <h1 className="text-2xl font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
        <Clock className="w-7 h-7 text-amber-600" />
        Estación 5: Fermentación Controlada
      </h1>

      {/* ALERTA VISUAL GLOBAL */}
      {alarmActive && (
        <div className="bg-red-500 text-white p-3 rounded-lg shadow-md animate-pulse flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <Bell className="w-6 h-6" />
            <span>{alarmActive}</span>
          </div>
          <button
            onClick={() => setAlarmActive(null)}
            className="bg-white text-red-600 px-3 py-1 rounded font-semibold text-sm hover:bg-slate-100"
          >
            Silenciar / Enterado
          </button>
        </div>
      )}

      {/* 1. PARTE SUPERIOR: CRONÓMETRO PRINCIPAL UNIFICADO */}
      <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg border-2 border-amber-500/50 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute top-3 left-4 text-xs tracking-wider uppercase text-amber-400 font-semibold flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          Cronómetro Principal de Fermentación
        </div>

        <div className="mt-2 text-sm text-slate-400">
          {currentBatch ? (
            <span className="text-amber-300 font-medium">
              Lote Seleccionado: <strong className="text-white">{currentBatch.id} - {currentBatch.productName}</strong> ({currentBatch.chamber})
            </span>
          ) : (
            <span className="text-slate-400 italic">Selecciona un lote abajo para activar el cronómetro</span>
          )}
        </div>

        {/* Pantalla digital de tiempo */}
        <div className="text-6xl font-mono font-extrabold my-4 tracking-widest text-amber-400 drop-shadow">
          {currentBatch ? formatTime(currentBatch.elapsedSeconds) : '00:00:00'}
        </div>

        {/* Controles de prueba del cronómetro activo */}
        {currentBatch && (
          <div className="flex items-center gap-3 mt-1">
            <button
              onClick={() =>
                setBatches((prev) =>
                  prev.map((b) => (b.id === currentBatch.id ? { ...b, isRunning: !b.isRunning } : b))
                )
              }
              className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 text-sm transition ${
                currentBatch.isRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {currentBatch.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {currentBatch.isRunning ? 'Pausar' : 'Reanudar'}
            </button>

            <button
              onClick={() =>
                setBatches((prev) =>
                  prev.map((b) => (b.id === currentBatch.id ? { ...b, elapsedSeconds: 0, lastAlarmInterval: 0 } : b))
                )
              }
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm flex items-center gap-1"
            >
              <RotateCcw className="w-4 h-4" /> Reiniciar Lote
            </button>
          </div>
        )}
      </div>

      {/* 2. PARTE MEDIA: LISTA DE LOTES (ACORDEÓN CON SOMBREADO AMARILLO CLARITO) */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-700 flex items-center justify-between">
          <span>Lotes en Fermentación Avanzada</span>
          <span className="text-xs bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full font-normal">
            {batches.length} Lotes activos
          </span>
        </h2>

        <div className="space-y-2">
          {batches.map((batch) => {
            const isSelected = selectedBatchId === batch.id;
            const isExpanded = expandedBatches[batch.id];

            return (
              <div
                key={batch.id}
                onClick={() => handleSelectBatch(batch.id)}
                className={`border rounded-xl transition-all cursor-pointer shadow-sm ${
                  isSelected
                    ? 'bg-yellow-100 border-yellow-400 ring-2 ring-yellow-300/60' // Sombreado Amarillo Clarito solicitado
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Cabecera del Acordeón / Fila de Lote */}
                <div className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Checklist Automático */}
                    <button
                      onClick={(e) => toggleCheck(batch.id, e)}
                      className="text-amber-600 hover:text-amber-700 focus:outline-none"
                    >
                      {batch.checked ? (
                        <CheckSquare className="w-6 h-6 text-amber-600" />
                      ) : (
                        <Square className="w-6 h-6 text-slate-400" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{batch.id}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-medium">
                          {batch.chamber}
                        </span>
                      </div>
                      <div className="text-sm text-slate-600">{batch.productName} — <span className="font-medium">{batch.quantity}</span></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Conteo individual del lote */}
                    <div className="text-right">
                      <div className="font-mono font-bold text-slate-800 text-base">
                        {formatTime(batch.elapsedSeconds)}
                      </div>
                      <div className="text-xs text-slate-500">
                        {batch.isRunning ? 'En proceso (30m)' : 'Detenido'}
                      </div>
                    </div>

                    {/* Botón desplegar acordeón */}
                    <button
                      onClick={(e) => toggleAccordion(batch.id, e)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Contenido Desplegable (Detalles del Acordeón) */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-yellow-200/60 pt-3 text-sm text-slate-700 space-y-2 bg-yellow-50/50 rounded-b-xl">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><strong>Intervalos Alarma (30 min):</strong> Cada 30 min</div>
                      <div><strong>Última Alarma Disparada:</strong> {batch.lastAlarmInterval * 30} min transcurridos</div>
                    </div>
                    <div className="text-xs text-slate-500 border-t border-yellow-200/40 pt-2">
                      * El sombreado amarillo e inicio del cronómetro superior se activan automáticamente al hacer clic en este lote.
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. PARTE INFERIOR: DATOS DEL RESPONSABLE DE LA ESTACIÓN */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b pb-2">
          <User className="w-4 h-4 text-amber-600" />
          Datos del Responsable & Estación
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Técnico / Responsable:</label>
            <input
              type="text"
              value={operatorName}
              onChange={(e) => setOperatorName(e.target.value)}
              className="w-full p-2 border rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Turno Asignado:</label>
            <select
              value={shift}
              onChange={(e) => setShift(e.target.value)}
              className="w-full p-2 border rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
            >
              <option value="Mañana">Turno Mañana</option>
              <option value="Tarde">Turno Tarde</option>
              <option value="Noche">Turno Noche</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Observaciones / Parámetros de Cámara:</label>
            <input
              type="text"
              value={chamberNotes}
              onChange={(e) => setChamberNotes(e.target.value)}
              className="w-full p-2 border rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}