"use client";

import React from 'react';
import { usePreview } from '../../context/PreviewContext';

interface StepGuardProps {
  stepNumber: number;
  title: string;
  isCompleted: boolean;
  isUnlocked: boolean;
  onComplete: () => void;
  children: React.ReactNode;
}

export const StepGuard: React.FC<StepGuardProps> = ({
  stepNumber,
  title,
  isCompleted,
  isUnlocked,
  onComplete,
  children,
}) => {
  const { isPreviewMode } = usePreview();
  const activeUnlocked = isPreviewMode || isUnlocked;

  return (
    <div
      className={`border rounded-xl p-6 transition-all duration-300 mb-6 ${
        isCompleted
          ? 'border-emerald-500/40 bg-emerald-950/10'
          : activeUnlocked
          ? 'border-slate-700 bg-slate-900/60 shadow-lg'
          : 'border-slate-800 bg-slate-950/40 opacity-50 pointer-events-none'
      }`}
    >
      {/* Encabezado del Paso */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
              isCompleted
                ? 'bg-emerald-500 text-slate-950'
                : activeUnlocked
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-800 text-slate-500'
            }`}
          >
            {isCompleted ? '✓' : stepNumber}
          </span>
          <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
        </div>

        {!activeUnlocked && (
          <span className="text-xs text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            🔒 Completa el Paso Anterior
          </span>
        )}

        {isCompleted && (
          <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Completado
          </span>
        )}
      </div>

      {/* Contenido principal del paso */}
      <div>{children}</div>

      {/* Botón de validación del paso */}
      {activeUnlocked && !isCompleted && (
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onComplete}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-all"
          >
            Validar Paso {stepNumber} y Continuar
          </button>
        </div>
      )}
    </div>
  );
};