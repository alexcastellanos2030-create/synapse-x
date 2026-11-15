"use client";

import React, { useState } from "react";
import { LoteHorneado } from "../estacion-6/page";
import BloqueoSecuencialOSAI from "../osai/bloqueo-secuencial-osai";

export type LoteEmpaquetado = LoteHorneado;

export interface SubPedidoEmpaque {
  idPedido: string;
  observacionPila: string;
  clienteLocalTel: string;
  producto: string;
  tipoMasa: string;
  coberturaTopping: string;
  cantPedido: number;
  seguridad: number;
  bodega: number;
  totalFabricar: number;
  pesoMasaKg: number;
}

export interface PedidoClienteEmpaque {
  idCliente: string;
  nombreCliente: string;
  pedidos: SubPedidoEmpaque[];
}

export interface Estacion7Props {
  lotesActivos?: LoteHorneado[];
  onPedidoAvanzado?: (idCliente: string, datosResponsable: { cedula: string; nombre: string }) => void;
  esClaro?: boolean;
}

export default function Estacion7({
  lotesActivos = [],
  onPedidoAvanzado,
  esClaro = false,
}: Estacion7Props) {
  const [estacionActiva, setEstacionActiva] = useState<number>(7);

  // Parámetros de Empaque
  const [temperaturaEmpaqueC, setTemperaturaEmpaqueC] = useState<number>(28);
  const [tipoEmpaque, setTipoEmpaque] = useState<string>("Bolsa Plástica Microperforada + Sellado Térmico");
  const [unidadesRechazadas, setUnidadesRechazadas] = useState<number>(0);

  // Responsable de Empaque
  const [responsableCedula, setResponsableCedula] = useState<string>("");
  const [responsableNombre, setResponsableNombre] = useState<string>("Ingrese cédula para firmar...");

  // Pasos secuenciales de la Estación 7 (Empaque)
  const [pasosEstacion7, setPasosEstacion7] = useState([
    { id: 1, nombre: "Recepción Horneado", estado: "completado" as string },
    { id: 2, nombre: "Enfriamiento Temp", estado: "activo" as string },
    { id: 3, nombre: "Checklist de Pedidos", estado: "bloqueado" as string },
    { id: 4, nombre: "Sellado y Empaque", estado: "bloqueado" as string },
    { id: 5, nombre: "Firma y Liberación", estado: "bloqueado" as string },
  ]);

  const estacionesListado = [
    { id: 1, nombre: "Pesaje" },
    { id: 2, nombre: "Amasado" },
    { id: 3, nombre: "División" },
    { id: 4, nombre: "Formato" },
    { id: 5, nombre: "Fermentación" },
    { id: 6, nombre: "Horneado" },
    { id: 7, nombre: "Empaque" },
    { id: 8, nombre: "Control Salida" },
    { id: 9, nombre: "Rutas" },
    { id: 10, nombre: "Stock Bodega" },
    { id: 11, nombre: "Merma y Stock" },
    { id: 12, nombre: "Planta General" },
  ];

  const completarPasoSecuencial = (indexPaso: number) => {
    const nuevos = [...pasosEstacion7];
    nuevos[indexPaso].estado = "completado";
    if (indexPaso + 1 < nuevos.length) {
      nuevos[indexPaso + 1].estado = "activo";
    }
    setPasosEstacion7(nuevos);
  };

  const handleCambiarEstacion = (id: number) => {
    setEstacionActiva(id);
    if (typeof window !== "undefined") {
      window.location.href = `/estaciones/estacion-${id}`;
    }
  };

  // Caso de prueba: Distribuidora Comercial Salam con 4 pedidos de diferentes masas
  const [grupoCliente, setGrupoCliente] = useState<PedidoClienteEmpaque>({
    idCliente: "CLI-SALAM-001",
    nombreCliente: "Distribuidora Comercial Salam",
    pedidos: [
      {
        idPedido: "PED-202610-001",
        observacionPila: "Pedido Estándar de Planta",
        clienteLocalTel: "Distribuidora Comercial Salam / +56951049399",
        producto: "Pan B11 Brioche",
        tipoMasa: "Masa Brioche Tradicional",
        coberturaTopping: "Huevo Batido + Sésamo Blanco (Glaseado)",
        cantPedido: 200,
        seguridad: 20,
        bodega: 10,
        totalFabricar: 210,
        pesoMasaKg: 18.90,
      },
      {
        idPedido: "PED-202610-002",
        observacionPila: "Prioridad Despacho",
        clienteLocalTel: "Distribuidora Comercial Salam / +56951049399",
        producto: "Pan Pita 13cm",
        tipoMasa: "Masa Pita Clásica",
        coberturaTopping: "Ninguna + Sin Topping",
        cantPedido: 300,
        seguridad: 30,
        bodega: 0,
        totalFabricar: 330,
        pesoMasaKg: 26.40,
      },
      {
        idPedido: "PED-202610-003",
        observacionPila: "Verificar Dorado de Corteza",
        clienteLocalTel: "Distribuidora Comercial Salam / +56951049399",
        producto: "Pan Frica 13cm",
        tipoMasa: "Masa Frica Hamburguesa",
        coberturaTopping: "Sésamo Blanco Especial",
        cantPedido: 250,
        seguridad: 25,
        bodega: 5,
        totalFabricar: 270,
        pesoMasaKg: 24.30,
      },
      {
        idPedido: "PED-202610-004",
        observacionPila: "Empaque en Bolsa Microperforada",
        clienteLocalTel: "Distribuidora Comercial Salam / +56951049399",
        producto: "Pan de Molde Blanco 500g",
        tipoMasa: "Masa Molde Lactal",
        coberturaTopping: "Sin Topping / Corte Estándar",
        cantPedido: 100,
        seguridad: 10,
        bodega: 0,
        totalFabricar: 110,
        pesoMasaKg: 55.00,
      },
    ],
  });

  // Métricas del Turno (Contadores de control)
  const [metricasTurno, setMetricasTurno] = useState({
    totalClientesHoy: 5,
    clientesCompletados: 2,
    clientesPendientes: 3,
    pedidosTotalesHoy: 18,
    pedidosEmpacados: 8,
    pedidosPendientesEmpaque: 10,
    lotesEnEsperaEstacion6: 2,
  });

  // Checklist individual por cada uno de los pedidos
  const [checklists, setChecklists] = useState<{ [idPedido: string]: boolean }>({});

  // Observaciones editables por el operario por cada pedido
  const [observacionesEditables, setObservacionesEditables] = useState<{ [idPedido: string]: string }>({});

  // Estado de avance
  const [pedidoProcesado, setPedidoProcesado] = useState<boolean>(false);

  const handleToggleCheck = (idPedido: string) => {
    setChecklists((prev) => {
      const nuevoEstado = {
        ...prev,
        [idPedido]: !prev[idPedido],
      };
      
      // Si todos los checks están listos, completamos el paso del checklist
      const todosListos = grupoCliente.pedidos.every((p) => nuevoEstado[p.idPedido]);
      if (todosListos) {
        completarPasoSecuencial(2);
      }
      return nuevoEstado;
    });
  };

  const handleObservacionChange = (idPedido: string, text: string) => {
    setObservacionesEditables((prev) => ({
      ...prev,
      [idPedido]: text,
    }));
  };

  const todosChecklistsListos = grupoCliente.pedidos.every((p) => !!checklists[p.idPedido]);
  const responsableValido = responsableCedula.trim().length > 0 && !responsableNombre.includes("Ingrese");
  const canAdvance = todosChecklistsListos && responsableValido && !pedidoProcesado;

  const handleAvanzarEstacion8 = () => {
    if (!responsableValido) {
      alert("⚠️ POKA-YOKE: Ingrese la cédula del responsable para firmar la entrega.");
      return;
    }

    if (!todosChecklistsListos) {
      alert("⚠️ Debe marcar el checklist de los pedidos del cliente para autorizar el empaque.");
      return;
    }

    setPedidoProcesado(true);
    completarPasoSecuencial(3);
    completarPasoSecuencial(4);

    // Actualizar métricas locales al avanzar
    setMetricasTurno((prev) => ({
      ...prev,
      clientesCompletados: prev.clientesCompletados + 1,
      clientesPendientes: Math.max(0, prev.clientesPendientes - 1),
      pedidosEmpacados: prev.pedidosEmpacados + grupoCliente.pedidos.length,
      pedidosPendientesEmpaque: Math.max(0, prev.pedidosPendientesEmpaque - grupoCliente.pedidos.length),
    }));

    if (onPedidoAvanzado) {
      onPedidoAvanzado(grupoCliente.idCliente, {
        cedula: responsableCedula,
        nombre: responsableNombre,
      });
    }

    alert(`✅ Los pedidos de ${grupoCliente.nombreCliente} fueron empaquetados y avanzados a la Estación 8 (Cestas) por ${responsableNombre}.\nEl operario se mantiene en la Estación 7 procesando la cola restante.`);
  };

  return (
    <BloqueoSecuencialOSAI
      estacionActual={estacionActiva}
      estaciones={estacionesListado}
      onCambiarEstacion={handleCambiarEstacion}
      pasos={pasosEstacion7}
      onCompletarPaso={completarPasoSecuencial}
    >
      <div className="space-y-5">
        
        {/* 1. PANEL DE MÉTRICAS / CONTADORES DE CONTROL DE TURNO */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white dark:bg-slate-900/90 p-3.5 rounded-xl border border-slate-300 dark:border-slate-800 shadow-inner transition-colors">
          <div className="bg-slate-100 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-300 dark:border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400 block">Clientes (Completados / Total)</span>
            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {metricasTurno.clientesCompletados} / {metricasTurno.totalClientesHoy}
            </span>
            <span className="text-[9px] text-amber-600 dark:text-amber-400 block mt-0.5">Faltan: {metricasTurno.clientesPendientes} clientes</span>
          </div>

          <div className="bg-slate-100 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-300 dark:border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400 block">Pedidos de Clientes (Empacados)</span>
            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {metricasTurno.pedidosEmpacados} / {metricasTurno.pedidosTotalesHoy}
            </span>
            <span className="text-[9px] text-amber-600 dark:text-amber-400 block mt-0.5">Pendientes por empacar: {metricasTurno.pedidosPendientesEmpaque}</span>
          </div>

          <div className="bg-slate-100 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-300 dark:border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400 block">Lotes en Tránsito (Estación 6)</span>
            <span className="text-sm font-black text-cyan-600 dark:text-cyan-400 font-mono">
              {metricasTurno.lotesEnEsperaEstacion6} Lotes
            </span>
            <span className="text-[9px] text-slate-500 dark:text-slate-400 block mt-0.5">En espera de salida de hornos</span>
          </div>

          <div className="bg-slate-100 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-300 dark:border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400 block">Estado del Área</span>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800 inline-block mt-1">
              🟢 Flujo Continuo Activo
            </span>
          </div>
        </div>

        {/* 2. PARÁMETROS GENERALES DE EMPAQUE */}
        <div className="bg-white dark:bg-[#111827] border border-slate-300 dark:border-slate-800 rounded-2xl shadow-2xl p-4 space-y-4 transition-colors">
          <div className="bg-emerald-600 text-white py-2.5 px-6 rounded-xl text-center font-black text-sm uppercase tracking-wider shadow-md">
            CONTROL DE EMPAQUE Y SALIDA A CESTAS (ESTACIÓN 8) — CLIENTE: {grupoCliente.nombreCliente.toUpperCase()}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-300 dark:border-slate-800 items-center transition-colors">
            <div className="space-y-1 max-w-[200px]">
              <label className="text-[10px] font-bold text-slate-700 dark:text-slate-400 block">Temp. Enfriamiento (°C):</label>
              <input
                type="number"
                value={temperaturaEmpaqueC}
                onChange={(e) => {
                  setTemperaturaEmpaqueC(Number(e.target.value));
                  completarPasoSecuencial(1);
                }}
                className="w-full bg-white dark:bg-slate-800 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-center"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-700 dark:text-slate-400 block">Tipo de Empaque:</label>
              <select
                value={tipoEmpaque}
                onChange={(e) => setTipoEmpaque(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-200 font-bold border border-slate-300 dark:border-slate-700 rounded-lg p-2"
              >
                <option value="Bolsa Plástica Microperforada + Sellado Térmico">Bolsa Plástica Microperforada</option>
                <option value="Caja de Cartón Industrial / Granel">Caja Cartón Industrial</option>
                <option value="Empaque Termoencogible">Empaque Termoencogible</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-700 dark:text-slate-400 block">Unidades Rechazadas / Mermas (Seguridad):</label>
              <input
                type="number"
                value={unidadesRechazadas}
                onChange={(e) => setUnidadesRechazadas(Number(e.target.value))}
                className="w-full bg-white dark:bg-slate-800 text-xs font-mono text-red-600 dark:text-red-400 font-bold border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-center"
              />
            </div>
          </div>

          {/* 3. TABLA CONTENEDOR DE TRAZABILIDAD */}
          <div className="bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-xl p-3 space-y-3 transition-colors">
            <div className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-300 dark:border-slate-800 pb-2">
              <span>📊 TRAZABILIDAD ESTÁNDAR COMPLETA DE LA COLA DE PEDIDOS</span>
              <span className="text-[10px] text-slate-600 dark:text-slate-400 font-normal">
                Marque el checklist de cada sub-pedido y agregue observaciones si hay piezas dañadas o faltantes.
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-200 dark:bg-slate-950 text-slate-800 dark:text-slate-300 font-bold border-b border-slate-300 dark:border-slate-800 text-[10px] uppercase">
                    <th className="p-2 text-center w-10">Check</th>
                    <th className="p-2 min-w-[170px]">ID Pedido / Obs</th>
                    <th className="p-2 min-w-[180px]">Cliente / Local / Tel</th>
                    <th className="p-2">Producto</th>
                    <th className="p-2">Tipo de Masa</th>
                    <th className="p-2 min-w-[160px]">Cobertura, Topping y Glaseado</th>
                    <th className="p-2 text-center">Cant. Pedido</th>
                    <th className="p-2 text-center">Seguridad</th>
                    <th className="p-2 text-center">Bodega</th>
                    <th className="p-2 text-center">Total Fabricar</th>
                    <th className="p-2 text-right">Peso Masa (Kg)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                  {grupoCliente.pedidos.map((ped) => {
                    const isChecked = !!checklists[ped.idPedido];
                    const obsValue = observacionesEditables[ped.idPedido] !== undefined
                      ? observacionesEditables[ped.idPedido]
                      : ped.observacionPila;

                    return (
                      <tr
                        key={ped.idPedido}
                        className={`transition-colors ${
                          isChecked ? "bg-amber-100 dark:bg-amber-950/20" : "bg-white dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-900"
                        }`}
                      >
                        <td className="p-2 text-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            disabled={pedidoProcesado}
                            onChange={() => handleToggleCheck(ped.idPedido)}
                            className="w-4 h-4 accent-emerald-500 cursor-pointer"
                          />
                        </td>

                        <td className="p-2">
                          <span className="font-mono font-bold text-amber-700 dark:text-amber-400 bg-slate-200 dark:bg-slate-950 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-800">
                            {ped.idPedido}
                          </span>
                          <input
                            type="text"
                            value={obsValue}
                            disabled={pedidoProcesado}
                            onChange={(e) => handleObservacionChange(ped.idPedido, e.target.value)}
                            placeholder="Observación o novedad de mermería..."
                            className="w-full mt-1 bg-white dark:bg-slate-950 text-[10px] text-amber-800 dark:text-amber-300/90 border border-slate-300 dark:border-slate-800 rounded px-1.5 py-0.5 focus:border-amber-500 outline-none"
                          />
                        </td>

                        <td className="p-2 text-slate-800 dark:text-slate-200 font-medium">{ped.clienteLocalTel}</td>
                        <td className="p-2 font-bold text-slate-900 dark:text-slate-100">{ped.producto}</td>
                        <td className="p-2 text-slate-700 dark:text-slate-300">{ped.tipoMasa}</td>
                        <td className="p-2 text-slate-600 dark:text-slate-400 text-[10px]">{ped.coberturaTopping}</td>
                        <td className="p-2 text-center font-mono font-bold text-slate-800 dark:text-slate-200">{ped.cantPedido} uds</td>
                        <td className="p-2 text-center font-mono text-slate-600 dark:text-slate-400">{ped.seguridad}</td>
                        <td className="p-2 text-center font-mono text-slate-600 dark:text-slate-400">{ped.bodega}</td>
                        <td className="p-2 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">{ped.totalFabricar} uds</td>
                        <td className="p-2 text-right font-mono font-bold text-amber-700 dark:text-amber-400">{ped.pesoMasaKg.toFixed(2)} Kg</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. BLOQUE DE FIRMA Y MICROBOTÓN DINÁMICO */}
          <div className="bg-slate-50 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 rounded-xl p-4 space-y-3 transition-colors">
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              👤 RESPONSABLE DE EMPAQUE Y LIBERACIÓN A ESTACIÓN 8 (CESTAS)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
              <div>
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-400 block mb-1">Cédula del Operador:</label>
                <input
                  type="text"
                  value={responsableCedula}
                  disabled={pedidoProcesado}
                  onChange={(e) => {
                    const ced = e.target.value.replace(/\D/g, "");
                    setResponsableCedula(ced);
                    if (ced === "10433935" || ced === "12345678") {
                      setResponsableNombre("Alexander Segundo Castellanos Perozo");
                    } else if (ced === "87654321") {
                      setResponsableNombre("Carolina Pérez (Administración)");
                    } else if (ced.length >= 7) {
                      setResponsableNombre(`Operador ID ${ced}`);
                    } else {
                      setResponsableNombre("Ingrese cédula válida...");
                    }
                  }}
                  placeholder="Ej: 10433935"
                  className="w-full bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-700 dark:text-slate-400 block mb-1">Nombre Autorizado:</label>
                <div className="w-full bg-slate-200 dark:bg-slate-950 text-xs text-amber-700 dark:text-amber-400 font-bold border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 flex items-center">
                  {responsableNombre}
                </div>
              </div>

              {/* MICROBOTÓN ROJO -> VERDE */}
              <div className="flex justify-end pt-3 md:pt-0">
                {pedidoProcesado ? (
                  <span className="px-5 py-3 bg-emerald-600 text-white font-black text-xs rounded-xl shadow-lg flex items-center gap-2">
                    ✓ GRUPO DE PEDIDOS ENVIADO A ESTACIÓN 8
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleAvanzarEstacion8}
                    className={`px-6 py-3 font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer ${
                      canAdvance
                        ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400 scale-105 shadow-emerald-950 animate-pulse"
                        : "bg-red-600 text-white hover:bg-red-500 opacity-90"
                    }`}
                  >
                    {canAdvance
                      ? "🟢 AVANZAR PEDIDOS A ESTACIÓN 8 (CESTAS)"
                      : "🔴 PENDIENTE (MARQUE 4 CHECKS + CÉDULA)"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BloqueoSecuencialOSAI>
  );
}