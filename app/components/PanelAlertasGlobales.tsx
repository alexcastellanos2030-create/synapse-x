"use client";

import React, { useState } from "react";

export interface AlertaSistema {
  id: string;
  modulo: string;
  tipo: "ADVERTENCIA" | "BLOQUEO" | "INFO" | "CRÍTICO";
  nivel?: 1 | 2 | 3; // Nivel 1: Leve, Nivel 2: Mediano, Nivel 3: Grave
  mensaje: string;
  detallesTecnicos?: string;
  timestamp: string;
  accionesRecomendadas?: [string, string, string];
  accionEjecutada?: string;
}

interface PanelAlertasProps {
  alertas: AlertaSistema[];
  onEjecutarAccion?: (alertaId: string, accion: string) => void;
}

const ESTACIONES_LISTA = [
  "Recepción de Pedidos",
  "Estación 1: Selección Taller",
  "Estación 2: Pesaje & Formulaciones",
  "Estación 3: Amasado & Mezcla",
  "Estación 4: Divisora & Ovillado",
  "Estación 5: Fermentación Controlada",
  "Estación 6: Horneado & Cocción",
  "Estación 7: Enfriamiento & Empaque",
  "Estación 8: Control Calidad / Rechazos",
  "Estación 9: Despacho & Logística",
  "Estación 10: Despacho Adm. & Firma",
  "Estación 11: Bodega de Planta (Stock)",
];

const ALERTAS_INICIALES_DEMO: AlertaSistema[] = [
  {
    id: "ALT-101",
    modulo: "Panel Superuser / Accesos",
    tipo: "BLOQUEO",
    nivel: 3,
    mensaje: "Intento de ingreso con clave secundaria fallida en 3 oportunidades.",
    detallesTecnicos: "Origen IP local / Credencial bloqueada temporalmente por protocolo Poka-Yoke.",
    timestamp: new Date().toLocaleTimeString(),
    accionesRecomendadas: [
      "1. Resetear credenciales en Superuser",
      "2. Validar identidad vía Cédula",
      "3. Mantener bloqueo preventivo (24h)",
    ],
  },
  {
    id: "ALT-102",
    modulo: "Estación 2: Pesaje & Formulaciones",
    tipo: "ADVERTENCIA",
    nivel: 2,
    mensaje: "Desviación del +2.5% en pesaje de Harina Brioche Láctico respecto al POE.",
    detallesTecnicos: "Diferencia de 1.25 kg detectada en la celda de carga de Balanza Central 1.",
    timestamp: new Date(Date.now() - 300000).toLocaleTimeString(),
    accionesRecomendadas: [
      "1. Recalibrar báscula digital",
      "2. Reajustar tara del contenedor",
      "3. Autorizar tolerancia y continuar",
    ],
  },
  {
    id: "ALT-103",
    modulo: "Estación 6: Horneado & Cocción",
    tipo: "INFO",
    nivel: 1,
    mensaje: "Horno Central alcanzó temperatura óptima de precalentamiento (210°C).",
    detallesTecnicos: "Sensor PT100 estabilizado. Listo para cargar carros de Pan B11 Brioche.",
    timestamp: new Date(Date.now() - 900000).toLocaleTimeString(),
    accionesRecomendadas: [
      "1. Iniciar temporizador de horneado",
      "2. Activar inyección de vapor",
      "3. Registrar lote en bitácora",
    ],
  },
];

export default function PanelAlertasGlobales({
  alertas = [],
  onEjecutarAccion,
}: PanelAlertasProps) {
  const [pestañaActiva, setPestañaActiva] = useState<string>("TODOS LOS MÓDULOS");
  const [accionesTomadas, setAccionesTomadas] = useState<{ [id: string]: string }>({});

  // ESTADOS DE DESPLEGABLE / ACORDEÓN DE FILTROS DE ALERTAS
  const [menuSuperuserAbierto, setMenuSuperuserAbierto] = useState<boolean>(false);
  const [menuEstacionesAbierto, setMenuEstacionesAbierto] = useState<boolean>(false);

  const listaAlertasCombinadas = alertas.length > 0 ? alertas : ALERTAS_INICIALES_DEMO;

  // Filtrado de Alertas según selección
  const alertasFiltradas =
    pestañaActiva === "TODOS LOS MÓDULOS"
      ? listaAlertasCombinadas
      : pestañaActiva === "GRUPO_ESTACIONES"
      ? listaAlertasCombinadas.filter((a) =>
          ESTACIONES_LISTA.includes(a.modulo)
        )
      : listaAlertasCombinadas.filter((a) => a.modulo === pestañaActiva);

  const tomarAccion = (alertaId: string, accion: string) => {
    setAccionesTomadas((prev) => ({ ...prev, [alertaId]: accion }));
    if (onEjecutarAccion) {
      onEjecutarAccion(alertaId, accion);
    }
    alert(`⚡ PROTOCOLO EJECUTADO:\n\nAlerta ID: ${alertaId}\nAcción tomada: "${accion}"`);
  };

  // Contadores de alertas
  const totalAlertasSuperuser = listaAlertasCombinadas.filter(
    (a) => a.modulo === "Panel Superuser / Accesos"
  ).length;

  const totalAlertasEstaciones = listaAlertasCombinadas.filter((a) =>
    ESTACIONES_LISTA.includes(a.modulo)
  ).length;

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-xs font-sans pb-12">
      {/* CABECERA */}
      <div className="bg-slate-900 p-4 rounded-xl border border-amber-500/40 shadow-xl flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-base font-black text-amber-400 flex items-center gap-2">
            🚨 Portal Global de Alertas y Auditoría Industrial
          </h2>
          <p className="text-slate-400 text-[11px] mt-0.5">
            Monitoreo continuo de desviaciones en línea, semáforos de criticidad y protocolos de respuesta
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-[11px]">
          <span className="text-slate-400 font-bold">Niveles:</span>
          <span className="flex items-center gap-1 text-emerald-400 font-bold">🟢 N1 (Leve)</span>
          <span className="flex items-center gap-1 text-amber-400 font-bold">🟡 N2 (Medio)</span>
          <span className="flex items-center gap-1 text-rose-400 font-bold">🔴 N3 (Grave)</span>
        </div>
      </div>

      {/* BARRA DE NAVEGACIÓN Y FILTROS TIPO ACORDEÓN / DROPDOWN */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-800">
        
        {/* 1. BOTÓN PRINCIPAL: TODOS LOS MÓDULOS */}
        <button
          onClick={() => {
            setPestañaActiva("TODOS LOS MÓDULOS");
            setMenuSuperuserAbierto(false);
            setMenuEstacionesAbierto(false);
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 border cursor-pointer ${
            pestañaActiva === "TODOS LOS MÓDULOS"
              ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-105"
              : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800"
          }`}
        >
          <span>🌐 TODOS LOS MÓDULOS</span>
          <span className="px-1.5 py-0.2 rounded-full font-mono text-[10px] bg-slate-950 text-amber-300">
            {listaAlertasCombinadas.length}
          </span>
        </button>

        {/* 2. ACORDEÓN / DESPLEGABLE: SUPERUSER */}
        <div className="relative">
          <button
            onClick={() => {
              setMenuSuperuserAbierto(!menuSuperuserAbierto);
              setMenuEstacionesAbierto(false);
              setPestañaActiva("Panel Superuser / Accesos");
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 border cursor-pointer ${
              pestañaActiva.includes("Superuser")
                ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-105"
                : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800"
            }`}
          >
            <span>👑 Panel Superuser & Accesos</span>
            <span className="px-1.5 py-0.2 rounded-full font-mono text-[10px] bg-slate-950 text-amber-300">
              {totalAlertasSuperuser}
            </span>
            <span className="text-[10px]">{menuSuperuserAbierto ? "▲" : "▼"}</span>
          </button>

          {menuSuperuserAbierto && (
            <div className="absolute left-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 space-y-1">
              <button
                onClick={() => {
                  setPestañaActiva("Panel Superuser / Accesos");
                  setMenuSuperuserAbierto(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold bg-slate-800/80 text-amber-300 hover:bg-amber-500 hover:text-slate-950 transition-all"
              >
                🔐 Control de Accesos y Gobernanza
              </button>
            </div>
          )}
        </div>

        {/* 3. ACORDEÓN / DESPLEGABLE: ESTACIONES OPERATIVAS */}
        <div className="relative">
          <button
            onClick={() => {
              setMenuEstacionesAbierto(!menuEstacionesAbierto);
              setMenuSuperuserAbierto(false);
              setPestañaActiva("GRUPO_ESTACIONES");
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 border cursor-pointer ${
              pestañaActiva === "GRUPO_ESTACIONES" || ESTACIONES_LISTA.includes(pestañaActiva)
                ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-105"
                : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800"
            }`}
          >
            <span>🥖 Estaciones de Producción</span>
            <span className="px-1.5 py-0.2 rounded-full font-mono text-[10px] bg-slate-950 text-amber-300">
              {totalAlertasEstaciones}
            </span>
            <span className="text-[10px]">{menuEstacionesAbierto ? "▲" : "▼"}</span>
          </button>

          {menuEstacionesAbierto && (
            <div className="absolute left-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 space-y-1 max-h-80 overflow-y-auto scrollbar-thin">
              <button
                onClick={() => {
                  setPestañaActiva("GRUPO_ESTACIONES");
                  setMenuEstacionesAbierto(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-black bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-slate-950 transition-all border border-amber-500/30 mb-1"
              >
                📋 Ver Todas las Estaciones ({totalAlertasEstaciones})
              </button>

              {ESTACIONES_LISTA.map((stNombre, sIdx) => {
                const numAlertasSt = listaAlertasCombinadas.filter(
                  (a) => a.modulo === stNombre
                ).length;

                return (
                  <button
                    key={sIdx}
                    onClick={() => {
                      setPestañaActiva(stNombre);
                      setMenuEstacionesAbierto(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-between ${
                      pestañaActiva === stNombre
                        ? "bg-amber-500 text-slate-950 font-black"
                        : "text-slate-300 hover:bg-slate-800 hover:text-amber-300"
                    }`}
                  >
                    <span className="truncate">{stNombre}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full font-mono text-[9px] ${
                        numAlertasSt > 0
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : "bg-slate-800 text-slate-500"
                      }`}
                    >
                      {numAlertasSt}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* INDICADOR DE SECTOR ACTIVO */}
        <div className="ml-auto text-[11px] font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          Sector Activo: <span className="text-amber-400 font-bold">{pestañaActiva === "GRUPO_ESTACIONES" ? "Todas las Estaciones" : pestañaActiva}</span>
        </div>
      </div>

      {/* LISTA EN LÍNEA DE ALERTAS Y PROTOCOLOS */}
      <div className="space-y-3">
        {alertasFiltradas.length === 0 ? (
          <div className="bg-[#111827] p-12 rounded-2xl border border-slate-800 text-center space-y-2 shadow-xl">
            <div className="text-3xl">✅</div>
            <div className="text-slate-300 font-bold text-sm">
              Sin alertas registradas en el sector: <span className="text-amber-400">{pestañaActiva === "GRUPO_ESTACIONES" ? "Todas las Estaciones" : pestañaActiva}</span>
            </div>
            <p className="text-slate-500 text-xs">
              Todos los sensores y parámetros de este módulo operan bajo especificación nominal.
            </p>
          </div>
        ) : (
          alertasFiltradas.map((alerta) => {
            const nivelEfectivo =
              alerta.nivel ||
              (alerta.tipo === "CRÍTICO" || alerta.tipo === "BLOQUEO"
                ? 3
                : alerta.tipo === "ADVERTENCIA"
                ? 2
                : 1);
            const accionRegistrada = accionesTomadas[alerta.id] || alerta.accionEjecutada;

            const opcionesAcciones = alerta.accionesRecomendadas || [
              "1. Inspeccionar parámetro y continuar",
              "2. Notificar a supervisor de turno",
              "3. Paralizar módulo y reiniciar proceso",
            ];

            return (
              <div
                key={alerta.id}
                className={`bg-[#111827] p-4 rounded-2xl border transition-all shadow-xl space-y-3 ${
                  nivelEfectivo === 3
                    ? "border-rose-500/50 bg-rose-950/10"
                    : nivelEfectivo === 2
                    ? "border-amber-500/40"
                    : "border-slate-800"
                }`}
              >
                {/* FILA SUPERIOR: SEMÁFORO + MÓDULO + TIMESTAMP */}
                <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-3 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 font-bold">GRAVEDAD:</span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-3.5 h-3.5 rounded-full border transition-all ${
                          nivelEfectivo === 1
                            ? "bg-emerald-500 border-emerald-300 shadow-[0_0_10px_#10b981] animate-pulse"
                            : "bg-emerald-950/40 border-slate-800 opacity-30"
                        }`}
                        title="Nivel 1: Leve / Informativo"
                      />
                      <span
                        className={`w-3.5 h-3.5 rounded-full border transition-all ${
                          nivelEfectivo === 2
                            ? "bg-amber-400 border-amber-200 shadow-[0_0_10px_#f59e0b] animate-pulse"
                            : "bg-amber-950/40 border-slate-800 opacity-30"
                        }`}
                        title="Nivel 2: Mediano / Advertencia"
                      />
                      <span
                        className={`w-3.5 h-3.5 rounded-full border transition-all ${
                          nivelEfectivo === 3
                            ? "bg-rose-500 border-rose-300 shadow-[0_0_12px_#f43f5e] animate-pulse"
                            : "bg-rose-950/40 border-slate-800 opacity-30"
                        }`}
                        title="Nivel 3: Grave / Bloqueo Crítico"
                      />
                    </div>
                    <span
                      className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded ${
                        nivelEfectivo === 3
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          : nivelEfectivo === 2
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      NIVEL {nivelEfectivo} - {nivelEfectivo === 3 ? "GRAVE" : nivelEfectivo === 2 ? "MEDIANO" : "LEVE"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-extrabold text-xs uppercase tracking-wider">
                      {alerta.modulo}
                    </span>
                    <span className="text-slate-500 font-mono">|</span>
                    <span className="font-mono text-slate-400 text-[11px]">{alerta.timestamp}</span>
                  </div>
                </div>

                {/* FILA CENTRAL: MENSAJE Y DIAGNÓSTICO */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start py-1">
                  <div className="md:col-span-2 space-y-1">
                    <div className="flex items-center gap-2">
                      {nivelEfectivo === 3 && (
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping inline-block" />
                      )}
                      <h4
                        className={`font-black text-xs tracking-wide ${
                          nivelEfectivo === 3
                            ? "text-rose-400 animate-pulse"
                            : nivelEfectivo === 2
                            ? "text-amber-300"
                            : "text-slate-100"
                        }`}
                      >
                        {alerta.mensaje}
                      </h4>
                    </div>
                    {alerta.detallesTecnicos && (
                      <p className="text-[11px] text-slate-400 font-mono bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                        🔍 <span className="text-slate-300 font-bold">Diagnóstico explícito:</span> {alerta.detallesTecnicos}
                      </p>
                    )}
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Estado de Protocolo:
                    </span>
                    {accionRegistrada ? (
                      <div className="text-emerald-400 font-bold text-[11px] bg-emerald-500/10 p-2 rounded border border-emerald-500/20">
                        ✓ Ejecutado: "{accionRegistrada}"
                      </div>
                    ) : (
                      <div className="text-amber-400 font-bold text-[11px] bg-amber-500/10 p-2 rounded border border-amber-500/20 flex items-center gap-1">
                        <span>⏳ Pendiente de acción por operario/supervisor</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* FILA INFERIOR: ACCIONES TÁCTICAS */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-2">
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block">
                    ⚡ MATRIZ DE ACCIONES TÁCTICAS DISPONIBLES (SELECCIONE PROTOCOLO):
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {opcionesAcciones.map((accionText, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => tomarAccion(alerta.id, accionText)}
                        className={`p-2.5 rounded-xl text-[11px] font-bold text-left transition-all border cursor-pointer flex items-center justify-between gap-2 ${
                          accionRegistrada === accionText
                            ? "bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-lg"
                            : "bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800 hover:border-amber-500 hover:text-amber-300"
                        }`}
                      >
                        <span className="truncate">{accionText}</span>
                        <span className="text-xs">➜</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}