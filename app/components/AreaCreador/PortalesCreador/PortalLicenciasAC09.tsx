"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  CREADOR_MASTER_DATABASE,
  esClaveValidaCreador,
} from "../BovedaCreadorMaster";
import FormatoActivacionLicenciasAC09 from "./PestanasLicenciasAC09/FormatoActivacionLicenciasAC09";
import {
  DatosCarpetaExpediente,
  DatosVendedorLicencia,
  ItemLicenciaActiva,
  RegistroBitacoraLicencia,
} from "./PestanasLicenciasAC09/TiposLicenciasAC09";

interface PortalLicenciasAC09Props {
  clavesAutorizadas?: string[];
  validarClaveExterna?: (clave: string) => boolean | Promise<boolean>;
}

function obtenerClavesDesdeBoveda(): string[] {
  const todas: string[] = [];

  Object.values(CREADOR_MASTER_DATABASE).forEach((credencial) => {
    if (Array.isArray(credencial.passwords)) {
      credencial.passwords.forEach((pwd) => {
        if (typeof pwd === "string" && pwd.trim().length > 0) {
          todas.push(pwd.trim());
        }
      });
    }
  });

  return Array.from(new Set(todas));
}

function crearLicenciaVacia(indice: number): ItemLicenciaActiva {
  const dias = 30;
  return {
    id: `lic-${Date.now()}-${indice}-${Math.random().toString(36).slice(2, 5)}`,
    codigoLicencia: "",
    clienteEmpresa: "",
    cicloPago: "mensual",
    fechaExactaPago: "",
    estadoPago: "pagado",
    montoReferencia: "",
    duracionDias: dias,
    segundosRestantes: dias * 86400,
    cronometroCorriendo: false,
  };
}

export default function PortalLicenciasAC09({
  clavesAutorizadas,
  validarClaveExterna,
}: PortalLicenciasAC09Props) {
  const clavesRegistradas = useMemo(() => {
    if (Array.isArray(clavesAutorizadas) && clavesAutorizadas.length > 0) {
      return clavesAutorizadas;
    }
    return obtenerClavesDesdeBoveda();
  }, [clavesAutorizadas]);

  const [candadoAbierto, setCandadoAbierto] = useState(false);
  const [pidiendoClave, setPidiendoClave] = useState(false);
  const [claveInput, setClaveInput] = useState("");
  const [errorClave, setErrorClave] = useState("");
  const [avisoEstado, setAvisoEstado] = useState("");

  const [vendedor, setVendedor] = useState<DatosVendedorLicencia>({
    nombreCompleto: "",
    cedula: "",
    contacto: "",
    reporteDirectoAlDueno: false,
    observacionVenta: "",
  });

  const [licencias, setLicencias] = useState<ItemLicenciaActiva[]>([
    crearLicenciaVacia(1),
  ]);

  const [expediente, setExpediente] = useState<DatosCarpetaExpediente>({
    codigoCarpeta: "",
    requisitosVerificados: false,
    clausulaUsoAutonomoAceptada: false,
    firmaLiberacionDueno: "",
    respaldoFisicoArchivado: false,
  });

  const [bitacora, setBitacora] = useState<RegistroBitacoraLicencia[]>([]);

  const agregarBitacora = useCallback(
    (accion: string, detalle: string) => {
      const ahora = new Date().toLocaleString("es-CL", { hour12: false });
      const responsable = vendedor.nombreCompleto.trim() || "Operador / Creador AC09";
      setBitacora((prev) => [
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          fechaHora: ahora,
          responsable,
          accion,
          detalle,
        },
        ...prev,
      ]);
    },
    [vendedor.nombreCompleto]
  );

  useEffect(() => {
    const hayActivo = licencias.some(
      (l) => l.cronometroCorriendo && l.segundosRestantes > 0
    );
    if (!hayActivo) return;

    const timer = setInterval(() => {
      setLicencias((prev) =>
        prev.map((lic) => {
          if (!lic.cronometroCorriendo) return lic;
          if (lic.segundosRestantes <= 1) {
            return { ...lic, segundosRestantes: 0, cronometroCorriendo: false };
          }
          return { ...lic, segundosRestantes: lic.segundosRestantes - 1 };
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [licencias]);

  const faltantes = useMemo(() => {
    const lista: string[] = [];
    if (!vendedor.nombreCompleto.trim()) lista.push("Nombre completo del vendedor.");
    if (!vendedor.cedula.trim()) lista.push("Cédula o ID del vendedor.");
    if (!vendedor.contacto.trim()) lista.push("Contacto del vendedor.");
    if (!vendedor.reporteDirectoAlDueno) {
      lista.push("Confirmación de reporte directo al dueño.");
    }

    licencias.forEach((lic, idx) => {
      const n = idx + 1;
      if (!lic.codigoLicencia.trim()) lista.push(`Código/serial de Licencia #${n}.`);
      if (!lic.clienteEmpresa.trim()) lista.push(`Cliente/empresa de Licencia #${n}.`);
      if (!lic.fechaExactaPago.trim()) lista.push(`Fecha exacta de pago de Licencia #${n}.`);
      if (!lic.montoReferencia.trim()) lista.push(`Monto o comprobante de Licencia #${n}.`);
    });

    if (!expediente.codigoCarpeta.trim()) {
      lista.push("Código o enlace de carpeta del expediente.");
    }
    if (!expediente.firmaLiberacionDueno.trim()) {
      lista.push("Firma o autorización de liberación del dueño.");
    }
    if (!expediente.requisitosVerificados) {
      lista.push("Verificación de requisitos y manual de compra-venta.");
    }
    if (!expediente.clausulaUsoAutonomoAceptada) {
      lista.push("Aceptación de cláusula de uso autónomo por parte del cliente.");
    }
    if (!expediente.respaldoFisicoArchivado) {
      lista.push("Confirmación de respaldo para archivo digital y físico.");
    }

    return lista;
  }, [vendedor, licencias, expediente]);

  const formatoCompleto = faltantes.length === 0;

  const handleClickCandado = () => {
    setAvisoEstado("");
    setErrorClave("");
    if (candadoAbierto) {
      setCandadoAbierto(false);
      setPidiendoClave(false);
      agregarBitacora("Candado Cronómetro", "Candado cerrado.");
      return;
    }
    setPidiendoClave(true);
    setClaveInput("");
  };

  const handleConfirmarClave = async (e: React.FormEvent) => {
    e.preventDefault();
    const limpia = claveInput.trim();
    if (!limpia) {
      setErrorClave("Ingresa una clave registrada en tu bóveda.");
      return;
    }

    let autorizada = false;

    if (validarClaveExterna) {
      autorizada = await validarClaveExterna(limpia);
    } else if (Array.isArray(clavesAutorizadas) && clavesAutorizadas.length > 0) {
      autorizada = clavesRegistradas.some((c) => c === limpia);
    } else {
      autorizada =
        esClaveValidaCreador(limpia) || clavesRegistradas.includes(limpia);
    }

    if (!autorizada) {
      setErrorClave("Clave no válida en BovedaCreadorMaster.");
      return;
    }

    setCandadoAbierto(true);
    setPidiendoClave(false);
    setClaveInput("");
    setErrorClave("");
    agregarBitacora(
      "Candado Cronómetro",
      "Candado abierto con clave validada desde BovedaCreadorMaster."
    );
  };

  const handleAgregarLicencia = () => {
    const nueva = crearLicenciaVacia(licencias.length + 1);
    setLicencias((prev) => [...prev, nueva]);
    agregarBitacora(
      "Agregar Licencia",
      `Se agregó formato de Licencia #${licencias.length + 1}.`
    );
  };

  const handleEliminarLicencia = (id: string) => {
    if (licencias.length <= 1) return;
    const objetivo = licencias.find((l) => l.id === id);
    setLicencias((prev) => prev.filter((l) => l.id !== id));
    agregarBitacora(
      "Eliminar Licencia",
      `Se eliminó un formato de licencia (${objetivo?.codigoLicencia || "sin código"}).`
    );
  };

  const handleActualizarLicencia = (
    id: string,
    campo: keyof ItemLicenciaActiva,
    valor: string | number | boolean
  ) => {
    setLicencias((prev) =>
      prev.map((lic) => (lic.id === id ? { ...lic, [campo]: valor } : lic))
    );
  };

  const handleActivarCronometrosYRegistrar = () => {
    if (!formatoCompleto) {
      setAvisoEstado(
        "No se puede activar el cronómetro hasta completar todos los campos del formato."
      );
      return;
    }

    setLicencias((prev) =>
      prev.map((lic) => ({
        ...lic,
        cronometroCorriendo: true,
        segundosRestantes:
          lic.segundosRestantes > 0 ? lic.segundosRestantes : lic.duracionDias * 86400,
      }))
    );

    setAvisoEstado(
      `Cronómetros activados para ${licencias.length} ${
        licencias.length === 1 ? "licencia" : "licencias"
      } y asentados en bitácora bajo carpeta ${expediente.codigoCarpeta}.`
    );
    agregarBitacora(
      "Activación Cronómetro",
      `Activados ${licencias.length} cronómetros · Carpeta: ${expediente.codigoCarpeta} · Cliente(s): ${licencias
        .map((l) => l.clienteEmpresa)
        .join(", ")}.`
    );
  };

  const handleImprimirExpediente = () => {
    if (!formatoCompleto) {
      setAvisoEstado(
        "El formato está incompleto: no se puede imprimir hasta llenar todos los campos requeridos."
      );
      return;
    }
    agregarBitacora(
      "Impresión Expediente",
      `Expediente listo para impresión (carpeta física y digital: ${expediente.codigoCarpeta}).`
    );
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-4 sm:p-6 text-white space-y-5 font-mono">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
            AC09 · Licencias, Compra-Venta, Respaldo y Cronómetro Custodiado
          </div>
          <h2 className="text-sm sm:text-base font-black uppercase text-white">
            Control de Licencias y Cadena de Custodia
          </h2>
        </div>

        <button
          type="button"
          onClick={handleClickCandado}
          className={`px-3.5 py-1.5 rounded-lg border text-xs font-bold cursor-pointer transition-all ${
            candadoAbierto
              ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
              : "bg-slate-900 border-amber-400/50 text-amber-300 hover:bg-slate-800"
          }`}
        >
          {candadoAbierto ? "🔓 Candado Cronómetro Abierto" : "🔒 Candado Cronómetro"}
        </button>
      </div>

      {pidiendoClave && !candadoAbierto && (
        <form
          onSubmit={handleConfirmarClave}
          className="p-3.5 rounded-xl border border-amber-400/50 bg-slate-900 space-y-2 max-w-md text-xs"
        >
          <div className="font-bold text-amber-300">
            Ingresa una clave registrada en BovedaCreadorMaster para abrir el candado:
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              value={claveInput}
              onChange={(e) => setClaveInput(e.target.value)}
              placeholder="Clave maestra"
              autoFocus
              className="flex-1 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-950 text-white"
            />
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold cursor-pointer"
            >
              Abrir
            </button>
            <button
              type="button"
              onClick={() => {
                setPidiendoClave(false);
                setErrorClave("");
              }}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 cursor-pointer"
            >
              Cancelar
            </button>
          </div>
          {errorClave && <div className="text-rose-400 text-[11px]">{errorClave}</div>}
        </form>
      )}

      {avisoEstado && (
        <div className="p-3 rounded-xl border border-amber-500/40 bg-amber-950/25 text-amber-200 text-xs">
          {avisoEstado}
        </div>
      )}

      {candadoAbierto ? (
        <FormatoActivacionLicenciasAC09
          vendedor={vendedor}
          setVendedor={setVendedor}
          licencias={licencias}
          onAgregarLicencia={handleAgregarLicencia}
          onEliminarLicencia={handleEliminarLicencia}
          onActualizarLicencia={handleActualizarLicencia}
          expediente={expediente}
          setExpediente={setExpediente}
          formatoCompleto={formatoCompleto}
          faltantes={faltantes}
          onActivarCronometrosYRegistrar={handleActivarCronometrosYRegistrar}
          onImprimirExpediente={handleImprimirExpediente}
        />
      ) : (
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 text-xs text-slate-300 space-y-1.5">
          <div className="font-bold text-amber-300">
            Cronómetro e impresión protegidos por candado
          </div>
          <p className="text-slate-400">
            Abre el candado con una clave válida de tu bóveda para desplegar el formato de 3 contenedores (vendedor, licencias con cronómetro y carpeta/firma del dueño). Sin completar todo el formato no se activan cronómetros ni se habilita la impresión.
          </p>
        </div>
      )}

      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-2 text-xs">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
          Bitácora de Acciones de Licencias ({bitacora.length})
        </div>
        {bitacora.length === 0 ? (
          <div className="text-slate-500 text-[11px]">
            Aún no hay movimientos registrados en esta sesión de AC09.
          </div>
        ) : (
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {bitacora.map((reg) => (
              <div
                key={reg.id}
                className="p-2.5 rounded-lg border border-slate-800 bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]"
              >
                <div>
                  <span className="font-bold text-amber-300">[{reg.accion}]</span>{" "}
                  <span className="text-slate-400">({reg.responsable}):</span>{" "}
                  <span className="text-slate-200">{reg.detalle}</span>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">{reg.fechaHora}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}