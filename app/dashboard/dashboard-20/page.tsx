"use client";

import React, { useState } from "react";
import SidebarSuperuser from "../../components/SidebarSuperuser";
import { Shield, Cpu, KeyRound, Terminal, Lock, CheckCircle2, AlertTriangle, RefreshCw, Database, DollarSign, Wrench, FileText, XCircle } from "lucide-react";

interface ClienteLicencia {
  id: string;
  razonSocial: string;
  contacto: string;
  macAsociada: string;
  estado: "Activa" | "Suspendida" | "Bloqueada";
  vencimiento: string;
  nivelSoporte: "Básico" | "Medio" | "Avanzado (OTP Requerido)";
}

export default function Dashboard20Page() {
  const [superuserModoActivo, setSuperuserModoActivo] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("synapse_superuser_activo") !== "false";
    }
    return true;
  });

  const [estacionActiva, setEstacionActiva] = useState<string | number>("SU20");
  const [rolActivo, setRolActivo] = useState<"superuser" | "admin" | "operario" | "cajera" | "supervisor">("superuser");
  const [temaVisual, setTemaVisual] = useState<"oscuro" | "claro" | "sistema">("oscuro");

  // Pestañas internas del Hub Comercial
  const [pestanaActiva, setPestanaActiva] = useState<"ADISION" | "MAC_BINDING" | "LICENCIAS" | "OTP_SOPORTE">("OTP_SOPORTE");

  const [clientesLista] = useState<ClienteLicencia[]>([
    { id: "LIC-2026-001", razonSocial: "Panificadora Industrial San Martín", contacto: "+56 9 8765 4321", macAsociada: "00:1A:2B:3C:4D:5E", estado: "Activa", vencimiento: "31/12/2026", nivelSoporte: "Avanzado (OTP Requerido)" },
    { id: "LIC-2026-002", razonSocial: "Distribuidora Comercial Salam", contacto: "+56 9 1234 5678", macAsociada: "48:E2:44:12:88:99", estado: "Activa", vencimiento: "15/06/2027", nivelSoporte: "Medio" },
    { id: "LIC-2026-003", razonSocial: "Alimentos y Masas del Sur SpA", contacto: "+56 9 5544 3322", macAsociada: "B8:27:EB:FF:EE:AA", estado: "Suspendida", vencimiento: "01/11/2026", nivelSoporte: "Básico" },
  ]);

  const [clienteSeleccionado, setClienteSeleccionado] = useState<ClienteLicencia>(clientesLista[0]);
  
  // Estados de Soporte OTP y Peritaje
  const [otpGenerado, setOtpGenerado] = useState<string>("------");
  const [otpIngresado, setOtpIngresado] = useState<string>("");
  const [tunelActivo, setTunelActivo] = useState<boolean>(false);
  
  // Estados del Peritaje y Cotización Dinámica
  const [sintomaCliente, setSintomaCliente] = useState<string>("El sistema se congeló al registrar lotes y la interfaz muestra error de red.");
  const [nivelDaño, setNivelDaño] = useState<"NIVEL_1" | "NIVEL_2" | "NIVEL_3" | "NIVEL_4">("NIVEL_2");
  const [reparacionEjecutada, setReparacionEjecutada] = useState<boolean>(false);

  const [logsComerciales, setLogsComerciales] = useState<Array<{ id: number; time: string; tipo: string; mensaje: string }>>([
    { id: 1, time: "06:00:10", tipo: "INFO", mensaje: "Núcleo Comercial inicializado. Base de datos de licencias sincronizada." },
    { id: 2, time: "06:05:22", tipo: "SEC", mensaje: "Binding MAC verificado para Panificadora San Martín [00:1A:2B:3C:4D:5E]." }
  ]);

  const agregarLog = (tipo: string, mensaje: string) => {
    const time = new Date().toLocaleTimeString();
    setLogsComerciales(prev => [{ id: Date.now(), time, tipo, mensaje }, ...prev.slice(0, 14)]);
  };

  const generarCodigoOtp = () => {
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    setOtpGenerado(codigo);
    agregarLog("OTP", `Token temporal generado para: ${clienteSeleccionado.razonSocial}`);
  };

  const validarYAbrirTunel = () => {
    if (otpIngresado === otpGenerado && otpGenerado !== "------") {
      setTunelActivo(true);
      agregarLog("SUCCESS", `[TÚNEL SEGURO ESTABLECIDO] Conexión de peritaje remoto autorizada con ${clienteSeleccionado.razonSocial}.`);
    } else {
      alert("⛔ ERROR POKA-YOKE: Código OTP inválido o expirado.");
      agregarLog("ERROR", `Intento fallido de túnel OTP para ${clienteSeleccionado.razonSocial}`);
    }
  };

  // Costos calculados según el nivel de daño
  const obtenerCostoIngenieria = () => {
    switch (nivelDaño) {
      case "NIVEL_1": return { uf: 1.5, pesos: "$45.000 CLP", desc: "Restauración de archivos de configuración y parámetros de interfaz." };
      case "NIVEL_2": return { uf: 3.5, pesos: "$120.000 CLP", desc: "Reparación de tablas relacionales de Base de Datos y sincronización." };
      case "NIVEL_3": return { uf: 6.0, pesos: "$210.000 CLP", desc: "Reconstrucción de entorno local y mitigación por manipulación indebida." };
      case "NIVEL_4": return { uf: 10.0, pesos: "$350.000 CLP", desc: "Rescate crítico global, recuperación de imagen y auditoría forense de nodo." };
      default: return { uf: 2.0, pesos: "$60.000 CLP", desc: "Soporte técnico estándar." };
    }
  };

  const infoCosto = obtenerCostoIngenieria();

  const ejecutarReparacionCertificada = () => {
    setReparacionEjecutada(true);
    agregarLog("SUCCESS", `[REPARACIÓN COMPLETADA] Nodo de ${clienteSeleccionado.razonSocial} restaurado al 100%. Margen de error: 0.01%. Tarifa aplicada: ${infoCosto.pesos}`);
    alert(`✅ Reparación certificada ejecutada con éxito. Costo del servicio registrado para facturación: ${infoCosto.pesos}.`);
  };

  const cancelarReparacion = () => {
    setTunelActivo(false);
    setReparacionEjecutada(false);
    agregarLog("WARN", `Intervención y túnel cancelados por decisión comercial/operativa para ${clienteSeleccionado.razonSocial}.`);
    alert("⚠️ Intervención cancelada. El túnel seguro ha sido cerrado sin alteraciones.");
  };

  return (
    <div className="min-h-screen bg-black text-white flex font-mono select-none">
      
      <SidebarSuperuser
        superuserModoActivo={superuserModoActivo}
        setSuperuserModoActivo={(val) => {
          setSuperuserModoActivo(val);
          if (!val) window.location.href = "/estaciones/estacion-1";
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

      <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-6">
        
        {/* Cabecera */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-amber-500/40 pb-4 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              <h1 className="text-sm font-bold tracking-wider text-amber-400 uppercase">
                Synapse-X OSAI Industrial // HUB 1: NÚCLEO COMERCIAL Y PERITAJE REMOTO
              </h1>
            </div>
            <p className="text-zinc-400 text-[10px] mt-1">
              Centro de diagnóstico integral, validación OTP, peritaje de fallas y tasación comercial de ingeniería.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded text-xs text-amber-400 font-mono">
              🔒 Protocolo Zero Trust & Peritaje Activo
            </span>
          </div>
        </div>

        {/* Pestañas de Navegación */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            onClick={() => setPestanaActiva("ADISION")}
            className={`p-3 rounded-xl border text-left font-mono text-xs transition cursor-pointer flex items-center gap-2 ${
              pestanaActiva === "ADISION" ? "bg-amber-500 text-black font-bold border-amber-400 shadow-lg" : "bg-zinc-950 text-zinc-300 border-zinc-800 hover:bg-zinc-900"
            }`}
          >
            <span>👥</span>
            <div className="truncate">
              <div className="font-bold">Admisión</div>
              <div className="text-[9px] opacity-80">Razón Social</div>
            </div>
          </button>

          <button
            onClick={() => setPestanaActiva("MAC_BINDING")}
            className={`p-3 rounded-xl border text-left font-mono text-xs transition cursor-pointer flex items-center gap-2 ${
              pestanaActiva === "MAC_BINDING" ? "bg-amber-500 text-black font-bold border-amber-400 shadow-lg" : "bg-zinc-950 text-zinc-300 border-zinc-800 hover:bg-zinc-900"
            }`}
          >
            <span>💻</span>
            <div className="truncate">
              <div className="font-bold">2. Binding MAC</div>
              <div className="text-[9px] opacity-80">Hardware y Llaves</div>
            </div>
          </button>

          <button
            onClick={() => setPestanaActiva("LICENCIAS")}
            className={`p-3 rounded-xl border text-left font-mono text-xs transition cursor-pointer flex items-center gap-2 ${
              pestanaActiva === "LICENCIAS" ? "bg-amber-500 text-black font-bold border-amber-400 shadow-lg" : "bg-zinc-950 text-zinc-300 border-zinc-800 hover:bg-zinc-900"
            }`}
          >
            <span>🛡️</span>
            <div className="truncate">
              <div className="font-bold">3. Ciclo Licencia</div>
              <div className="text-[9px] opacity-80">Estado y Seguridad</div>
            </div>
          </button>

          <button
            onClick={() => setPestanaActiva("OTP_SOPORTE")}
            className={`p-3 rounded-xl border text-left font-mono text-xs transition cursor-pointer flex items-center gap-2 ${
              pestanaActiva === "OTP_SOPORTE" ? "bg-amber-500 text-black font-bold border-amber-400 shadow-lg" : "bg-zinc-950 text-zinc-300 border-zinc-800 hover:bg-zinc-900"
            }`}
          >
            <span>🌐</span>
            <div className="truncate">
              <div className="font-bold">4. Soporte & Peritaje</div>
              <div className="text-[9px] opacity-80">Túnel y Tasación Técnica</div>
            </div>
          </button>
        </div>

        {/* PESTAÑA 4: SOPORTE, PERITAJE Y COTIZACIÓN DE INGENIERÍA */}
        {pestanaActiva === "OTP_SOPORTE" && (
          <div className="space-y-6">

            {/* Fila 1: Selección de Cliente y Autenticación OTP */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Selector de Cliente */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 space-y-3 shadow-xl">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider border-b border-zinc-800 pb-2">
                  1. Seleccionar Licenciatario
                </h3>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {clientesLista.map((cli) => (
                    <div
                      key={cli.id}
                      onClick={() => setClienteSeleccionado(cli)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition ${
                        clienteSeleccionado.id === cli.id ? "bg-amber-500/10 border-amber-500 text-white" : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-900"
                      }`}
                    >
                      <div className="flex justify-between text-[11px] font-bold text-amber-300">
                        <span>{cli.id}</span>
                        <span>{cli.contacto}</span>
                      </div>
                      <div className="text-xs text-zinc-200 font-semibold truncate mt-0.5">{cli.razonSocial}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Generador OTP */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 space-y-3 shadow-xl">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider border-b border-zinc-800 pb-2 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" /> 2. Autenticación OTP Matriz
                </h3>
                <p className="text-[10px] text-zinc-400">
                  Genere el token de 6 dígitos para que el cliente lo ingrese o dicte.
                </p>
                <div className="bg-black border border-zinc-900 p-3 rounded-xl text-center space-y-1">
                  <div className="text-[9px] text-zinc-500 uppercase tracking-wider">Token Generado:</div>
                  <div className="text-2xl font-black text-amber-400 tracking-widest">{otpGenerado}</div>
                </div>
                <button
                  onClick={generarCodigoOtp}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Generar Nuevo Código OTP
                </button>
              </div>

              {/* Conexión de Túnel */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 space-y-3 shadow-xl">
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider border-b border-zinc-800 pb-2 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" /> 3. Apertura de Túnel Seguro
                </h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Ingrese OTP Ej. 482910"
                    value={otpIngresado}
                    onChange={(e) => setOtpIngresado(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-amber-400 text-sm font-bold tracking-widest focus:outline-none focus:border-cyan-500"
                  />
                  <div className="flex justify-between items-center text-[10px] bg-zinc-900 p-2 rounded-lg">
                    <span className="text-zinc-400">Estado:</span>
                    <span className={tunelActivo ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                      {tunelActivo ? "🟢 CONECTADO" : "🔴 CERRADO"}
                    </span>
                  </div>
                  <button
                    onClick={validarYAbrirTunel}
                    disabled={tunelActivo}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition ${
                      tunelActivo ? "bg-zinc-900 text-zinc-600 cursor-not-allowed" : "bg-cyan-500 hover:bg-cyan-400 text-black cursor-pointer"
                    }`}
                  >
                    {tunelActivo ? "Túnel Activo" : "Validar y Abrir Túnel"}
                  </button>
                </div>
              </div>

            </div>

            {/* Fila 2: Consola de Peritaje e Ingeniería (Solo activa si el túnel está abierto) */}
            {tunelActivo && (
              <div className="bg-zinc-950 border border-cyan-500/40 rounded-2xl p-5 space-y-5 shadow-2xl">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-cyan-400 animate-spin" />
                    <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      Estación de Peritaje Remoto & Diagnóstico Multinivel // Nodo: {clienteSeleccionado.razonSocial}
                    </h2>
                  </div>
                  <span className="px-2.5 py-1 bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] rounded font-bold">
                    Túnel Bidireccional Seguro
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Declaración del Cliente vs Realidad del Sistema */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Reporte / Síntoma Declarado por el Cliente:</label>
                      <textarea
                        rows={2}
                        value={sintomaCliente}
                        onChange={(e) => setSintomaCliente(e.target.value)}
                        className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>

                    <div className="bg-black border border-zinc-900 rounded-xl p-3 space-y-2">
                      <div className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                        <span>🔍 Telemetría de Peritaje Real (Escaneo Automático):</span>
                      </div>
                      <div className="text-[11px] text-zinc-300 font-mono space-y-1">
                        <div>Integridad Base de Datos: <strong className="text-amber-400">Tabla de lotes con corrupción leve por corte eléctrico.</strong></div>
                        <div>Estado de Memoria y Kernel: <strong className="text-emerald-400">Estable (Node.js v22 operativo).</strong></div>
                        <div>Causa Raíz Detectada: <strong className="text-cyan-400">Manipulación de registros locales por apagado abrupto de terminal.</strong></div>
                      </div>
                    </div>
                  </div>

                  {/* Selector de Nivel de Daño y Tasación Comercial */}
                  <div className="space-y-3">
                    <label className="text-xs text-zinc-400 block">Clasificación Técnica del Daño (Peritaje):</label>
                    <select
                      value={nivelDaño}
                      onChange={(e) => setNivelDaño(e.target.value as any)}
                      className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                    >
                      <option value="NIVEL_1">Nivel 1: Ajuste de Configuración y Parámetros (Básico)</option>
                      <option value="NIVEL_2">Nivel 2: Reparación de Base de Datos y Sincronización (Medio)</option>
                      <option value="NIVEL_3">Nivel 3: Reconstrucción de Entorno por Mal Uso (Avanzado)</option>
                      <option value="NIVEL_4">Nivel 4: Rescate Crítico de Emergencia Global (Catastrófico)</option>
                    </select>

                    {/* Tarjeta de Cotización Dinámica */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 space-y-2">
                      <div className="flex justify-between items-center border-b border-zinc-800 pb-1.5">
                        <span className="text-xs text-zinc-400">Valor Propuesto de Ingeniería:</span>
                        <strong className="text-amber-400 text-sm font-black">{infoCosto.pesos}</strong>
                      </div>
                      <p className="text-[10px] text-zinc-400">
                        <strong>Alcance:</strong> {infoCosto.desc}
                      </p>
                      <div className="text-[9px] text-emerald-400 pt-1">
                        💡 <em>Justificación comercial: Evita mermas por 8 horas de planta detenida valoradas en más de $800.000 CLP.</em>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botones de Decisión Final */}
                <div className="pt-3 border-t border-zinc-800 flex flex-col md:flex-row gap-3 justify-end">
                  <button
                    onClick={cancelarReparacion}
                    className="px-4 py-2.5 bg-zinc-900 hover:bg-rose-950/60 border border-zinc-700 hover:border-rose-800 text-zinc-300 hover:text-rose-400 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Cancelar y Rechazar Intervención</span>
                  </button>

                  <button
                    onClick={ejecutarReparacionCertificada}
                    disabled={reparacionEjecutada}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                      reparacionEjecutada ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : "bg-emerald-500 hover:bg-emerald-400 text-black"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{reparacionEjecutada ? "Reparación Certificada y Ejecutada" : "Ejecutar Reparación Completa y Certificada"}</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Pestañas 1, 2 y 3 */}
        {pestanaActiva !== "OTP_SOPORTE" && (
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider border-b border-zinc-800 pb-2">
              {pestanaActiva === "ADISION" ? "👥 Sub-portal de Admisión y Registro Comercial" : pestanaActiva === "MAC_BINDING" ? "💻 Sub-portal de Binding MAC y Criptografía de Hardware" : "🛡️ Sub-portal de Ciclo de Licencia y Estados"}
            </h2>
            <p className="text-zinc-400 text-xs">
              Módulo operativo interconectado con el Kernel de Synapse-X OSAI Industrial bajo la directriz de 0.01% margen de error.
            </p>
          </div>
        )}

        {/* Bitácora Comercial */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <h2 className="text-zinc-300 font-bold uppercase text-xs flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-400" /> Bitácora de Auditoría y Facturación de Ingeniería
            </h2>
            <button onClick={() => setLogsComerciales([])} className="text-[10px] text-zinc-500 hover:text-white underline cursor-pointer">
              Limpiar Bitácora
            </button>
          </div>

          <div className="bg-black border border-zinc-900 rounded-xl p-3 h-32 overflow-y-auto space-y-1.5 font-mono text-[10px]">
            {logsComerciales.map((log) => (
              <div key={log.id} className="flex items-start gap-2 border-b border-zinc-900/50 pb-1">
                <span className="text-zinc-500 shrink-0">[{log.time}]</span>
                <span className={`px-1 rounded text-[9px] font-bold shrink-0 ${
                  log.tipo === 'ERROR' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                  log.tipo === 'WARN' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                  log.tipo === 'SUCCESS' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                  'bg-zinc-900 text-zinc-300 border border-zinc-700'
                }`}>
                  {log.tipo}
                </span>
                <span className="text-zinc-300 break-all">{log.mensaje}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}