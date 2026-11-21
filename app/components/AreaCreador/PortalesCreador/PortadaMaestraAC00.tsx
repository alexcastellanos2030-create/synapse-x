"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  CLAVES_AC00_POR_DEFECTO,
  EstadoProtocolosAC00,
  EventoBitacoraAC00,
  IdPestanaAC00,
} from "./PestanasPortadaMaestraAC00/TiposPortadaAC00";
import PestanaNucleoCapasAC00 from "./PestanasPortadaMaestraAC00/PestanaNucleoCapasAC00";
import PestanaRadarSistemaAC00 from "./PestanasPortadaMaestraAC00/PestanaRadarSistemaAC00";
import PestanaProtocolosCriticosAC00 from "./PestanasPortadaMaestraAC00/PestanaProtocolosCriticosAC00";
import PestanaRuteoBitacoraAC00 from "./PestanasPortadaMaestraAC00/PestanaRuteoBitacoraAC00";
import PestanaRespaldoAC00 from "./PestanasPortadaMaestraAC00/PestanaRespaldoAC00";

interface PortadaMaestraAC00Props {
  onSeleccionarPortal?: (portalId: string) => void;
  totalPerfilesNucleo?: number;
  clavesAutorizadas?: string[];
}

const SEGUNDOS_POR_DEFECTO_10_MIN = 10 * 60;
const SEGUNDOS_GRACIA_RESET = 10;
const MAX_SEGUNDOS_48_HORAS = 48 * 60 * 60;

const PESTANAS: {
  id: IdPestanaAC00;
  titulo: string;
  activaClase: string;
  inactivaClase: string;
}[] = [
  {
    id: "nucleo",
    titulo: "1. Núcleo y Capas",
    activaClase:
      "bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.45)]",
    inactivaClase:
      "bg-slate-900/70 text-amber-300 border-amber-400/30 hover:border-amber-400/70",
  },
  {
    id: "radar",
    titulo: "2. Radar del Sistema",
    activaClase:
      "bg-emerald-400 text-slate-950 border-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.45)]",
    inactivaClase:
      "bg-slate-900/70 text-emerald-300 border-emerald-400/30 hover:border-emerald-400/70",
  },
  {
    id: "protocolos",
    titulo: "3. Protocolos Críticos",
    activaClase:
      "bg-rose-500 text-white border-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.45)]",
    inactivaClase:
      "bg-slate-900/70 text-rose-300 border-rose-500/30 hover:border-rose-500/70",
  },
  {
    id: "ruteo",
    titulo: "4. Ruteo y Bitácora",
    activaClase:
      "bg-sky-400 text-slate-950 border-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.45)]",
    inactivaClase:
      "bg-slate-900/70 text-sky-300 border-sky-400/30 hover:border-sky-400/70",
  },
  {
    id: "respaldo",
    titulo: "5. Respaldo JSON",
    activaClase:
      "bg-white text-slate-950 border-white shadow-[0_0_12px_rgba(255,255,255,0.45)]",
    inactivaClase:
      "bg-slate-900/70 text-white border-white/30 hover:border-white/70",
  },
];

function formatearCronometro(totalSegundos: number): string {
  const seguro = Math.max(0, Math.floor(totalSegundos));
  const horas = Math.floor(seguro / 3600);
  const minutos = Math.floor((seguro % 3600) / 60);
  const segundos = seguro % 60;

  return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
}

export default function PortadaMaestraAC00({
  onSeleccionarPortal,
  totalPerfilesNucleo = 3,
  clavesAutorizadas = CLAVES_AC00_POR_DEFECTO,
}: PortadaMaestraAC00Props) {
  const [candado1Abierto, setCandado1Abierto] = useState(false);
  const [candado2Abierto, setCandado2Abierto] = useState(false);
  const [claveCandado1, setClaveCandado1] = useState("");
  const [claveCandado2, setClaveCandado2] = useState("");

  const [candadoActivoForm, setCandadoActivoForm] = useState<1 | 2 | null>(null);
  const [claveInput, setClaveInput] = useState("");
  const [errorClave, setErrorClave] = useState("");
  const [avisoBloqueo, setAvisoBloqueo] = useState("");

  const [segundosRestantes, setSegundosRestantes] = useState<number>(0);
  const [cronometroActivo, setCronometroActivo] = useState<boolean>(false);
  const [editHoras, setEditHoras] = useState<string>("0");
  const [editMinutos, setEditMinutos] = useState<string>("10");

  const [esperandoGraciaReset, setEsperandoGraciaReset] = useState<boolean>(false);
  const [segundosGracia, setSegundosGracia] = useState<number>(0);

  const inputHorasRef = useRef<HTMLInputElement | null>(null);
  const inputMinutosRef = useRef<HTMLInputElement | null>(null);

  const [pestanaActiva, setPestanaActiva] = useState<IdPestanaAC00>("nucleo");
  const [nivelActivo, setNivelActivo] = useState<number>(10);
  const [protocolos, setProtocolos] = useState<EstadoProtocolosAC00>({
    mantenimientoActivo: false,
    drmRecetasActivo: true,
    jerarquiaBlindada: true,
    killSwitchArmado: false,
  });
  const [eventos, setEventos] = useState<EventoBitacoraAC00[]>([]);

  const sesionDesbloqueada = candado1Abierto && candado2Abierto;
  const accesoOperativoHabilitado = sesionDesbloqueada || esperandoGraciaReset;

  const registrarEvento = useCallback((accion: string, detalle: string) => {
    const ahora = new Date().toLocaleTimeString("es-CL", { hour12: false });
    setEventos((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        fechaHora: ahora,
        accion,
        detalle,
      },
      ...prev,
    ]);
  }, []);

  const bloquearAmbosCandados = useCallback(
    (motivo: string) => {
      setCandado1Abierto(false);
      setCandado2Abierto(false);
      setClaveCandado1("");
      setClaveCandado2("");
      setCandadoActivoForm(null);
      setClaveInput("");
      setErrorClave("");
      setSegundosRestantes(0);
      setCronometroActivo(false);
      setEsperandoGraciaReset(false);
      setSegundosGracia(0);
      setEditHoras("0");
      setEditMinutos("0");
      setAvisoBloqueo(motivo);
      registrarEvento("Bloqueo AC00", motivo);
    },
    [registrarEvento]
  );

  useEffect(() => {
    if (sesionDesbloqueada) {
      setEsperandoGraciaReset(false);
      setSegundosGracia(0);
      setSegundosRestantes(SEGUNDOS_POR_DEFECTO_10_MIN);
      setEditHoras("0");
      setEditMinutos("10");
      setCronometroActivo(true);
    } else if (!esperandoGraciaReset) {
      setCronometroActivo(false);
    }
  }, [sesionDesbloqueada, esperandoGraciaReset]);

  useEffect(() => {
    if (!esperandoGraciaReset) return;

    const intervaloGracia = setInterval(() => {
      setSegundosGracia((prev) => {
        if (prev <= 1) {
          clearInterval(intervaloGracia);
          bloquearAmbosCandados(
            "Se cumplieron los 10 segundos tras Reset sin fijar tiempo: ambos candados se bloquearon."
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervaloGracia);
  }, [esperandoGraciaReset, bloquearAmbosCandados]);

  useEffect(() => {
    if (!sesionDesbloqueada || !cronometroActivo || esperandoGraciaReset) return;

    const intervalo = setInterval(() => {
      setSegundosRestantes((prev) => {
        if (prev <= 1) {
          clearInterval(intervalo);
          bloquearAmbosCandados(
            "Cronómetro en 00:00:00: ambos candados se cerraron automáticamente."
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalo);
  }, [sesionDesbloqueada, cronometroActivo, esperandoGraciaReset, bloquearAmbosCandados]);

  const exigirAccesoActivo = (): boolean => {
    if (accesoOperativoHabilitado) return true;
    setAvisoBloqueo(
      "Área restringida: abre el Candado 1 y el Candado 2 con dos claves diferentes."
    );
    return false;
  };

  const fijarTiempoDesdeInputs = (hrsTexto: string, minsTexto: string) => {
    if (!exigirAccesoActivo()) return;
    const hrs = Math.max(0, Math.min(48, Math.floor(Number(hrsTexto) || 0)));
    const mins = Math.max(0, Math.min(59, Math.floor(Number(minsTexto) || 0)));
    const total = Math.min(MAX_SEGUNDOS_48_HORAS, hrs * 3600 + mins * 60);

    if (total <= 0) {
      setAvisoBloqueo(
        "Tiempo en blanco (00:00:00). Escribe horas o minutos y pulsa Hora/Minuto para arrancar."
      );
      return;
    }

    setEditHoras(String(hrs));
    setEditMinutos(String(mins));
    setSegundosRestantes(total);
    setEsperandoGraciaReset(false);
    setSegundosGracia(0);
    setCronometroActivo(true);
    setAvisoBloqueo("");
    registrarEvento(
      "Cronómetro AC00",
      `Tiempo fijado en ${formatearCronometro(total)} (${hrs}h ${mins}m) y conteo iniciado.`
    );
  };

  const handleBotonHora = () => {
    if (!exigirAccesoActivo()) return;
    inputHorasRef.current?.focus();
    inputHorasRef.current?.select();
    const hrs = Number(editHoras) || 0;
    const mins = Number(editMinutos) || 0;
    if (hrs > 0 || mins > 0) {
      fijarTiempoDesdeInputs(editHoras, editMinutos);
    }
  };

  const handleBotonMinuto = () => {
    if (!exigirAccesoActivo()) return;
    inputMinutosRef.current?.focus();
    inputMinutosRef.current?.select();
    const hrs = Number(editHoras) || 0;
    const mins = Number(editMinutos) || 0;
    if (hrs > 0 || mins > 0) {
      fijarTiempoDesdeInputs(editHoras, editMinutos);
    }
  };

  const handleBotonReset = () => {
    if (!exigirAccesoActivo()) return;
    setSegundosRestantes(0);
    setCronometroActivo(false);
    setEditHoras("");
    setEditMinutos("");
    setEsperandoGraciaReset(true);
    setSegundosGracia(SEGUNDOS_GRACIA_RESET);
    setAvisoBloqueo(
      "Cronómetro en blanco (00:00:00). Tienes 10 segundos para escribir tu nuevo tiempo y pulsar Hora o Minuto."
    );
    registrarEvento(
      "Reset Cronómetro",
      "Cronómetro blanqueado; ventana de 10s activa para ingresar nuevo tiempo."
    );
    setTimeout(() => {
      inputHorasRef.current?.focus();
    }, 30);
  };

  const handleBotonOnOff = () => {
    if (!sesionDesbloqueada) {
      exigirAccesoActivo();
      return;
    }
    setCronometroActivo((prev) => {
      const siguiente = !prev;
      registrarEvento(
        "Estado Cronómetro",
        siguiente ? "Cronómetro en ON (conteo activo)." : "Cronómetro en OFF (conteo pausado)."
      );
      return siguiente;
    });
  };

  const handleClickCandado = (numero: 1 | 2) => {
    setAvisoBloqueo("");
    setErrorClave("");
    setClaveInput("");

    if (numero === 1 && candado1Abierto) {
      setCandado1Abierto(false);
      setClaveCandado1("");
      setCandadoActivoForm(null);
      registrarEvento("Candado 1", "Candado 1 cerrado manualmente.");
      return;
    }

    if (numero === 2 && candado2Abierto) {
      setCandado2Abierto(false);
      setClaveCandado2("");
      setCandadoActivoForm(null);
      registrarEvento("Candado 2", "Candado 2 cerrado manualmente.");
      return;
    }

    setCandadoActivoForm(numero);
  };

  const handleConfirmarCandado = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candadoActivoForm) return;

    const limpia = claveInput.trim().toUpperCase();
    const coincideConAutorizada = clavesAutorizadas.some(
      (c) => c.trim().toUpperCase() === limpia
    );

    if (!coincideConAutorizada) {
      setErrorClave("Clave no válida entre las registradas.");
      return;
    }

    if (candadoActivoForm === 1) {
      if (candado2Abierto && claveCandado2.toUpperCase() === limpia) {
        setErrorClave("No puedes repetir la misma clave del Candado 2.");
        return;
      }
      setCandado1Abierto(true);
      setClaveCandado1(limpia);
      setCandadoActivoForm(null);
      setClaveInput("");
      setErrorClave("");
      registrarEvento("Candado 1", "Candado 1 abierto con clave autorizada.");
      return;
    }

    if (candadoActivoForm === 2) {
      if (candado1Abierto && claveCandado1.toUpperCase() === limpia) {
        setErrorClave("Debes ingresar una clave distinta a la del Candado 1.");
        return;
      }
      setCandado2Abierto(true);
      setClaveCandado2(limpia);
      setCandadoActivoForm(null);
      setClaveInput("");
      setErrorClave("");
      registrarEvento("Candado 2", "Candado 2 abierto con segunda clave distinta.");
    }
  };

  const handleCambiarPestana = (id: IdPestanaAC00) => {
    if (!exigirAccesoActivo()) return;
    setPestanaActiva(id);
  };

  const handleCambiarNivel = (nuevoNivel: number) => {
    if (!exigirAccesoActivo()) return;
    setNivelActivo(nuevoNivel);
    registrarEvento("Capa del Núcleo", `Nivel cambiado a ${nuevoNivel}.`);
  };

  const handleAlternarProtocolo = (clave: keyof EstadoProtocolosAC00) => {
    if (!exigirAccesoActivo()) return;
    setProtocolos((prev) => {
      const siguiente = !prev[clave];
      registrarEvento(
        "Protocolo Crítico",
        `${clave} ahora está ${siguiente ? "ACTIVO" : "INACTIVO"}.`
      );
      return { ...prev, [clave]: siguiente };
    });
  };

  const handleIrPortal = (portalId: string) => {
    if (!exigirAccesoActivo()) return;
    registrarEvento("Navegación", `Acceso rápido hacia ${portalId}.`);
    onSeleccionarPortal?.(portalId);
  };

  const handleRegistrarRespaldo = () => {
    if (!exigirAccesoActivo()) return;
    registrarEvento("Snapshot JSON", "Respaldo de configuración generado.");
  };

  const pestanaActualObj = PESTANAS.find((p) => p.id === pestanaActiva) || PESTANAS[0];

  const renderControlesCronometro = () => (
    <div className="flex flex-wrap items-center gap-1.5 text-xs">
      <div
        title="Cronómetro regresivo"
        className="px-2.5 py-1 rounded-lg border border-amber-400/40 bg-slate-950 font-mono text-xs font-bold text-amber-300"
      >
        ⏱ {formatearCronometro(segundosRestantes)}
      </div>

      {esperandoGraciaReset && (
        <span className="px-2 py-1 rounded-lg border border-amber-400/60 bg-amber-950/60 font-mono text-[11px] font-bold text-amber-200 animate-pulse">
          Gracia: {segundosGracia}s
        </span>
      )}

      <input
        ref={inputHorasRef}
        type="number"
        min={0}
        max={48}
        placeholder="Hrs"
        value={editHoras}
        disabled={!accesoOperativoHabilitado}
        onChange={(e) => setEditHoras(e.target.value)}
        aria-label="Horas del cronómetro"
        className="w-12 px-1.5 py-1 rounded border border-slate-700 bg-slate-950 text-white font-mono text-[11px] disabled:opacity-50"
      />

      <input
        ref={inputMinutosRef}
        type="number"
        min={0}
        max={59}
        placeholder="Min"
        value={editMinutos}
        disabled={!accesoOperativoHabilitado}
        onChange={(e) => setEditMinutos(e.target.value)}
        aria-label="Minutos del cronómetro"
        className="w-12 px-1.5 py-1 rounded border border-slate-700 bg-slate-950 text-white font-mono text-[11px] disabled:opacity-50"
      />

      <button
        type="button"
        onClick={handleBotonHora}
        className={`px-2 py-1 rounded border text-[11px] font-bold transition-colors ${
          accesoOperativoHabilitado
            ? "border-amber-400/50 bg-slate-900 text-amber-300 hover:bg-amber-400 hover:text-slate-950 cursor-pointer"
            : "border-slate-800 bg-slate-900/50 text-slate-500 cursor-not-allowed"
        }`}
      >
        Hora
      </button>

      <button
        type="button"
        onClick={handleBotonMinuto}
        className={`px-2 py-1 rounded border text-[11px] font-bold transition-colors ${
          accesoOperativoHabilitado
            ? "border-amber-400/50 bg-slate-900 text-amber-300 hover:bg-amber-400 hover:text-slate-950 cursor-pointer"
            : "border-slate-800 bg-slate-900/50 text-slate-500 cursor-not-allowed"
        }`}
      >
        Minuto
      </button>

      <button
        type="button"
        onClick={handleBotonReset}
        className={`px-2 py-1 rounded border text-[11px] font-bold transition-colors ${
          accesoOperativoHabilitado
            ? "border-rose-500/60 bg-rose-950/60 text-rose-200 hover:bg-rose-500 hover:text-white cursor-pointer"
            : "border-slate-800 bg-slate-900/50 text-slate-500 cursor-not-allowed"
        }`}
      >
        Reset
      </button>

      <button
        type="button"
        onClick={handleBotonOnOff}
        className={`px-2.5 py-1 rounded border text-[11px] font-bold transition-colors ${
          !sesionDesbloqueada
            ? "border-slate-800 bg-slate-900/50 text-slate-500 cursor-not-allowed"
            : cronometroActivo
            ? "border-emerald-400 bg-emerald-500 text-slate-950 cursor-pointer"
            : "border-slate-600 bg-slate-800 text-slate-200 cursor-pointer"
        }`}
      >
        {cronometroActivo ? "On" : "Off"}
      </button>
    </div>
  );

  return (
    <section className="p-4 md:p-6 rounded-2xl border border-amber-500/30 bg-slate-950 text-slate-100 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
        <div className="space-y-0.5">
          <div className="text-[11px] font-bold uppercase tracking-widest text-rose-400">
            Área restringida · AC00 · Synapse-X OSAI Industrial
          </div>
          <h2 className="text-base md:text-lg font-bold text-white">
            Configuración Maestra del Creador
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleClickCandado(1)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer transition-all ${
              candado1Abierto
                ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                : "bg-slate-900 border-amber-400/50 text-amber-300 hover:bg-slate-800"
            }`}
          >
            {candado1Abierto ? "🔓 Candado 1" : "🔒 Candado 1"}
          </button>

          <button
            type="button"
            onClick={() => handleClickCandado(2)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer transition-all ${
              candado2Abierto
                ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                : "bg-slate-900 border-amber-400/50 text-amber-300 hover:bg-slate-800"
            }`}
          >
            {candado2Abierto ? "🔓 Candado 2" : "🔒 Candado 2"}
          </button>

          {renderControlesCronometro()}
        </div>
      </div>

      {candadoActivoForm && (
        <form
          onSubmit={handleConfirmarCandado}
          className="p-3.5 rounded-xl border border-amber-400/50 bg-slate-900 space-y-2 max-w-md"
        >
          <div className="text-xs font-bold text-amber-300">
            Candado {candadoActivoForm}: ingresa una clave autorizada{" "}
            {candadoActivoForm === 2 ? "(distinta a la del Candado 1)" : ""}.
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              value={claveInput}
              onChange={(e) => setClaveInput(e.target.value)}
              placeholder={`Clave para Candado ${candadoActivoForm}`}
              autoFocus
              className="flex-1 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-950 text-xs text-white"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs cursor-pointer"
            >
              Abrir
            </button>
            <button
              type="button"
              onClick={() => {
                setCandadoActivoForm(null);
                setErrorClave("");
              }}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs cursor-pointer"
            >
              Cancelar
            </button>
          </div>
          {errorClave && <div className="text-rose-400 text-[11px]">{errorClave}</div>}
        </form>
      )}

      {avisoBloqueo && (
        <div className="px-3.5 py-2.5 rounded-xl border border-rose-500/40 bg-rose-950/30 text-rose-200 text-xs">
          {avisoBloqueo}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
        {PESTANAS.map((tab) => {
          const activa = pestanaActiva === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleCambiarPestana(tab.id)}
              className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                activa ? tab.activaClase : tab.inactivaClase
              }`}
            >
              {tab.titulo}
            </button>
          );
        })}
      </div>

      <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/50 flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-white">{pestanaActualObj.titulo}</span>
          <span className="text-slate-600">·</span>
          <button
            type="button"
            onClick={() => handleClickCandado(1)}
            className={`px-2 py-0.5 rounded border text-[11px] font-bold cursor-pointer ${
              candado1Abierto
                ? "border-emerald-400/50 text-emerald-300 bg-emerald-950/30"
                : "border-amber-400/40 text-amber-300 bg-slate-950"
            }`}
          >
            {candado1Abierto ? "🔓 Candado 1" : "🔒 Candado 1"}
          </button>
          <button
            type="button"
            onClick={() => handleClickCandado(2)}
            className={`px-2 py-0.5 rounded border text-[11px] font-bold cursor-pointer ${
              candado2Abierto
                ? "border-emerald-400/50 text-emerald-300 bg-emerald-950/30"
                : "border-amber-400/40 text-amber-300 bg-slate-950"
            }`}
          >
            {candado2Abierto ? "🔓 Candado 2" : "🔒 Candado 2"}
          </button>
        </div>

        {renderControlesCronometro()}
      </div>

      <div className="pt-1">
        {pestanaActiva === "nucleo" && (
          <PestanaNucleoCapasAC00
            nivelActivo={nivelActivo}
            onCambiarNivel={handleCambiarNivel}
          />
        )}

        {pestanaActiva === "radar" && (
          <PestanaRadarSistemaAC00
            nivelActivo={nivelActivo}
            totalPerfilesNucleo={totalPerfilesNucleo}
            creadorProtegido={protocolos.jerarquiaBlindada}
          />
        )}

        {pestanaActiva === "protocolos" && (
          <PestanaProtocolosCriticosAC00
            protocolos={protocolos}
            onAlternarProtocolo={handleAlternarProtocolo}
          />
        )}

        {pestanaActiva === "ruteo" && (
          <PestanaRuteoBitacoraAC00
            onIrPortal={handleIrPortal}
            eventos={eventos}
          />
        )}

        {pestanaActiva === "respaldo" && (
          <PestanaRespaldoAC00
            nivelActivo={nivelActivo}
            protocolos={protocolos}
            onRegistrarRespaldo={handleRegistrarRespaldo}
          />
        )}
      </div>
    </section>
  );
}