import React, { useState } from 'react';
import { usePreview } from '../../context/PreviewContext';
import { StepGuard } from '../../components/stations/StepGuard';

export default function HorneadoPage() {
  const { isPreviewMode, togglePreviewMode } = usePreview();

  // Registro de pasos completados por el operario
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleStepComplete = (stepNumber: number) => {
    if (!completedSteps.includes(stepNumber)) {
      setCompletedSteps((prev) => [...prev, stepNumber]);
    }
  };

  const isStepUnlocked = (stepNumber: number) => {
    if (stepNumber === 1) return true;
    return completedSteps.includes(stepNumber - 1);
  };

  const allStepsCompleted = [1, 2, 3, 4].every((step) =>
    completedSteps.includes(step)
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6">
      {/* Barra Superior con Toggle de Modo Inspección */}
      <div className="flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div>
          <h1 className="text-xl font-bold">ESTACIÓN 6: HORNEADO Y COCCIÓN</h1>
          <p className="text-xs text-slate-400">Control Secuencial de Producción</p>
        </div>

        <button
          onClick={togglePreviewMode}
          className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all ${
            isPreviewMode
              ? 'bg-amber-500 text-slate-950 border-amber-400'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >
          {isPreviewMode ? '👁️ Modo Inspección: ACTIVADO' : '🔒 Modo Operativo: NORMAL'}
        </button>
      </div>

      {/* PASO 1 */}
      <StepGuard
        stepNumber={1}
        title="Paso 1: Precalentamiento de Horno"
        isCompleted={completedSteps.includes(1)}
        isUnlocked={isStepUnlocked(1)}
        onComplete={() => handleStepComplete(1)}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-xs text-slate-400">Temperatura Actual</span>
            <p className="text-xl font-bold text-amber-400">208 °C</p>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
            <span className="text-xs text-slate-400">Temperatura Objetivo</span>
            <p className="text-xl font-bold text-slate-200">210 °C</p>
          </div>
        </div>
      </StepGuard>

      {/* PASO 2 */}
      <StepGuard
        stepNumber={2}
        title="Paso 2: Selección de Formato"
        isCompleted={completedSteps.includes(2)}
        isUnlocked={isStepUnlocked(2)}
        onComplete={() => handleStepComplete(2)}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Pan Frica 13cm', 'Brioche Láctico', 'Pan de Molde', 'Croissant', 'Pan Pita', 'Pan Cook'].map((fmt) => (
            <div key={fmt} className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-sm font-semibold text-slate-300">
              {fmt}
            </div>
          ))}
        </div>
      </StepGuard>

      {/* PASO 3 */}
      <StepGuard
        stepNumber={3}
        title="Paso 3: Carga de Carros y Bandejas"
        isCompleted={completedSteps.includes(3)}
        isUnlocked={isStepUnlocked(3)}
        onComplete={() => handleStepComplete(3)}
      >
        <p className="text-sm text-slate-400">Capacidad asignada: 24 Bandejas (576 unidades en total).</p>
      </StepGuard>

      {/* PASO 4 */}
      <StepGuard
        stepNumber={4}
        title="Paso 4: Cronómetro de Horneado"
        isCompleted={completedSteps.includes(4)}
        isUnlocked={isStepUnlocked(4)}
        onComplete={() => handleStepComplete(4)}
      >
        <p className="text-lg font-mono text-amber-400">Tiempo Programado: 14:00 MIN</p>
      </StepGuard>

      {/* BOTÓN FINAL DE AVANCE */}
      <div className="pt-4 flex justify-end">
        <button
          disabled={!allStepsCompleted && !isPreviewMode}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${
            allStepsCompleted || isPreviewMode
              ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 cursor-pointer'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          Avanzar a Estación 7 (Enfriamiento) ➔
        </button>
      </div>
    </div>
  );
}