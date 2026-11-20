"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  LedEstado,
  OperadorPortal,
  CEDULAS_BOVEDA_FAMILIAR_RESPALDO,
  CONFIG_PORTALES,
  CATALOGO_USUARIOS_RESPALDO,
  clasificarRolPorCargoYTipo,
  getLedClass,
} from "@/lib/authPortales";

type PortalOperativo = Exclude<keyof typeof CONFIG_PORTALES, "creador">;

interface PortalSimpleLedProps {
  portal: PortalOperativo;
  onLoginSuccess: (
    rol: string,
    cedula: string,
    nivel: string,
    esBovedaFamiliar?: boolean
  ) => void;
}

export default function PortalAccesoSimpleLED({
  portal,
  onLoginSuccess,
}: PortalSimpleLedProps) {
  const configPortal = CONFIG_PORTALES[portal];

  const [cedula, setCedula] = useState("");
  const [nombreVerificado, setNombreVerificado] = useState("");
  const [clave, setClave] = useState("");
  const [usuarioEncontrado, setUsuarioEncontrado] = useState<OperadorPortal | null>(null);
  const [listaCompleta, setListaCompleta] = useState<OperadorPortal[]>(
    CATALOGO_USUARIOS_RESPALDO
  );

  const [led1, setLed1] = useState<LedEstado>("white");
  const [led2, setLed2] = useState<LedEstado>("white");
  const [led3, setLed3] = useState<LedEstado>("white");
  const [mensaje, setMensaje] = useState("Paso 1: Ingrese su número de cédula.");
  const [paso1Ok, setPaso1Ok] = useState(false);

  useEffect(() => {
    setCedula("");
    setNombreVerificado("");
    setClave("");
    setUsuarioEncontrado(null);
    setLed1("white");
    setLed2("white");
    setLed3("white");
    setPaso1Ok(false);
    setMensaje("Paso 1: Ingrese su número de cédula.");

    let base = [...CATALOGO_USUARIOS_RESPALDO];

    async function cargarUsuarios() {
      try {
        const mapa = new Map<string, OperadorPortal>();
        base.forEach((u) => mapa.set(u.cedula, u));

        const { data: bovedaData, error: bovedaError } = await supabase
          .from("boveda_familiar")
          .select("*");
        if (!bovedaError && Array.isArray(bovedaData) && bovedaData.length > 0) {
          bovedaData.forEach((row: any) => {
            const ced = String(row.cedula || "").trim();
            if (!ced) return;
            mapa.set(ced, {
              cedula: ced,
              nombre: String(row.nombre || "").trim(),
              clave: String(row.claveMaestra || row.clave_maestra || "*Paola123!").trim(),
              nivel:
                Number(row.nivel) === 10
                  ? "Nivel 10 - Creador"
                  : `Nivel ${Number(row.nivel) || 1} - Solo Ver`,
              cargoEspecifico: "Bóveda Familiar",
              rolAsignado: "usuario",
              esBovedaFamiliar: true,
            });
          });
        }

        const { data: usuariosData, error: usuariosError } = await supabase
          .from("usuarios_sistema")
          .select("*");
        if (!usuariosError && Array.isArray(usuariosData) && usuariosData.length > 0) {
          usuariosData.forEach((row: any) => {
            const ced = String(row.cedula || "").trim();
            if (!ced || mapa.has(ced)) return;

            const rolRaw = String(row.rol || row.tipo_portal || "").trim();
            const cargoRaw = String(
              row.cargo || row.especialidad || row.area || ""
            ).trim();

            const rolAsignado = clasificarRolPorCargoYTipo(rolRaw, cargoRaw);

            mapa.set(ced, {
              cedula: ced,
              nombre: String(row.nombre || "").trim(),
              clave: String(row.clave || row.password || "").trim(),
              nivel: String(row.nivel || "Nivel 1 - Operador"),
              cargoEspecifico: cargoRaw || rolRaw || "Empleado",
              rolAsignado,
              esBovedaFamiliar: false,
            });
          });
        }

        base = Array.from(mapa.values());
        setListaCompleta(base);
      } catch {
        setListaCompleta(base);
      }
    }

    setListaCompleta(base);
    cargarUsuarios();
  }, [portal]);

  const handleCedula = (valorCrudo: string) => {
    const limpio = valorCrudo.replace(/\s+/g, "");
    setCedula(limpio);
    setClave("");
    setLed3("white");

    if (/[^0-9]/.test(limpio)) {
      setLed1("red");
      setLed2("white");
      setNombreVerificado("");
      setUsuarioEncontrado(null);
      setPaso1Ok(false);
      setMensaje("Alerta Paso 1: Ingrese solo números en la cédula.");
      return;
    }

    if (!limpio) {
      setLed1("white");
      setLed2("white");
      setNombreVerificado("");
      setUsuarioEncontrado(null);
      setPaso1Ok(false);
      setMensaje("Paso 1: Ingrese su número de cédula.");
      return;
    }

    setLed1("yellow");
    setMensaje("Paso 1: Verificando cédula...");

    const encontrado = listaCompleta.find((u) => u.cedula === limpio);
    const esBoveda =
      Boolean(encontrado?.esBovedaFamiliar) || CEDULAS_BOVEDA_FAMILIAR_RESPALDO.has(limpio);

    if (encontrado && (esBoveda || encontrado.rolAsignado === portal)) {
      setLed1("green");
      setLed2("green");
      setNombreVerificado(encontrado.nombre);
      setUsuarioEncontrado({ ...encontrado, esBovedaFamiliar: esBoveda });
      setPaso1Ok(true);
      setMensaje(`Paso 1 y 2 OK: ${encontrado.nombre}. Ingrese su clave en el Paso 3.`);
    } else if (encontrado && encontrado.rolAsignado !== portal) {
      setLed1("red");
      setLed2("white");
      setNombreVerificado("");
      setUsuarioEncontrado(null);
      setPaso1Ok(false);
      setMensaje(
        "Cédula no reconocida en este portal. Cada cargo debe ingresar por su portal correspondiente."
      );
    } else if (limpio.length >= 8) {
      setLed1("red");
      setLed2("white");
      setNombreVerificado("");
      setUsuarioEncontrado(null);
      setPaso1Ok(false);
      setMensaje("Cédula no registrada en este portal.");
    } else {
      setLed2("white");
      setNombreVerificado("");
      setUsuarioEncontrado(null);
      setPaso1Ok(false);
      setMensaje("Paso 1: Escribiendo número de cédula...");
    }
  };

  const handleClave = (valor: string) => {
    if (!paso1Ok || !usuarioEncontrado) {
      setMensaje("Complete primero el Paso 1 con una cédula válida para este portal.");
      return;
    }

    setClave(valor);
    if (!valor) {
      setLed3("white");
      setMensaje("Paso 3: Ingrese su clave de acceso.");
      return;
    }

    setLed3("yellow");
    const clavesExtraCreador =
      usuarioEncontrado.cedula === "10433935"
        ? ["*Paola123!", "*Ac12345!", "Iar661972", "Albany123"]
        : [usuarioEncontrado.clave];

    if (
      (usuarioEncontrado.clave && valor.trim() === usuarioEncontrado.clave.trim()) ||
      clavesExtraCreador.includes(valor.trim())
    ) {
      setLed3("green");
      setMensaje("¡Credencial validada! Listo para ingresar.");
    } else {
      setLed3("red");
      setMensaje("Paso 3: Verificando clave de acceso...");
    }
  };

  const puedeEntrar = led1 === "green" && led2 === "green" && led3 === "green";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!puedeEntrar || !usuarioEncontrado) return;
    onLoginSuccess(
      usuarioEncontrado.rolAsignado,
      usuarioEncontrado.cedula,
      usuarioEncontrado.nivel,
      usuarioEncontrado.esBovedaFamiliar
    );
  };

  return (
    <div className="w-full max-w-2xl bg-[#070d1a] border border-slate-800 rounded-2xl p-6 shadow-2xl relative font-mono text-slate-100">
      <div className="mb-4 pb-3 border-b border-slate-800 flex items-center justify-between bg-black/60 px-4 py-2.5 rounded-xl">
        <span className={`text-[11px] font-bold uppercase tracking-widest ${configPortal.ledBarText}`}>
          ESTADO LED:
        </span>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5" title="1. Cédula">
            <span
              className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 ${getLedClass(
                led1
              )}`}
            />
            <span className="text-[10px] text-slate-300 font-bold">1</span>
          </div>
          <div className="flex items-center space-x-1.5" title="2. Identidad">
            <span
              className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 ${getLedClass(
                led2
              )}`}
            />
            <span className="text-[10px] text-slate-300 font-bold">2</span>
          </div>
          <div className="flex items-center space-x-1.5" title="3. Clave">
            <span
              className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 ${getLedClass(
                led3
              )}`}
            />
            <span className="text-[10px] text-slate-300 font-bold">3</span>
          </div>
        </div>
      </div>

      <div className="text-center mb-6">
        <h1
          className={`text-xl md:text-2xl font-extrabold tracking-wide uppercase leading-tight animate-pulse ${configPortal.tituloColor}`}
        >
          {configPortal.emblema} {configPortal.titulo} {configPortal.emblema}
        </h1>
        <p className="text-[11px] text-slate-400 mt-2">{configPortal.subtitulo}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        <div>
          <label className="block text-slate-400 mb-1 uppercase tracking-wider">
            1. Nro. de Cédula:
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={cedula}
            onChange={(e) => handleCedula(e.target.value)}
            placeholder="Ingrese su cédula..."
            required
            className={`w-full bg-[#030712] border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none ${configPortal.focusInput}`}
          />
        </div>

        <div>
          <label className="block text-slate-400 mb-1 uppercase tracking-wider">
            2. Identidad Verificada:
          </label>
          <input
            type="text"
            value={nombreVerificado}
            readOnly
            placeholder="Aguardando cédula..."
            className="w-full bg-[#030712]/50 border border-slate-800 rounded px-3 py-2 text-emerald-400 font-semibold cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-slate-400 mb-1 uppercase tracking-wider">
            3. Clave de Acceso:
          </label>
          <input
            type="password"
            value={clave}
            onChange={(e) => handleClave(e.target.value)}
            disabled={!paso1Ok}
            placeholder="••••••••••••"
            required
            className={`w-full bg-[#030712] border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none ${configPortal.focusInput} disabled:opacity-50`}
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={!puedeEntrar}
            className={`font-bold w-full py-3 rounded text-xs uppercase tracking-widest transition-all shadow-lg ${
              puedeEntrar
                ? "bg-emerald-400 text-black cursor-pointer shadow-emerald-400/30"
                : "bg-slate-800 text-slate-500 cursor-not-allowed opacity-60"
            }`}
          >
            {puedeEntrar ? "🔓 Candado Abierto - Entrar" : "🔒 Ingrese Cédula y Clave"}
          </button>
        </div>
      </form>

      <div className="mt-4 p-2.5 rounded text-[11px] font-semibold text-center border bg-[#030712] border-slate-800 text-slate-300">
        {mensaje}
      </div>
    </div>
  );
}