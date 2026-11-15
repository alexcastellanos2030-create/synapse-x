"use client";

import React, { useState } from "react";
import RecepcionPedidosPage from "../recepcion-pedidos/page";
import { PedidoOperativo } from "../estaciones/estacion-1/page";

interface PanelPedidosPestañasProps {
  esSuperuser?: boolean;
}

interface LoteIndustrial {
  idLote: string;
  amasadora: string;
  recetaBase: string;
  cargaTotalKg: number;
  estadoTránsito: string;
  pedidos: PedidoOperativo[];
}

interface ClienteConsolidado {
  nombreCliente: string;
  direccionSantiago: string;
  contacto: string;
  pedidos: PedidoOperativo[];
}

interface GrupoLoteBatida {
  idLoteBatida: string;
  amasadoraAsignada: string;
  recetaBase: string;
  capacidadMaximaKg: number;
  pesoTotalBatidaKg: number;
  estadoProceso: "En Cola" | "Amasando" | "Fermentando" | "Listos en Tolva";
  pedidosAsociados: PedidoOperativo[];
}

interface ConsolidadoProducto {
  tipoMasa: string;
  gramaje: number;
  totalUnidadesSolicitadas: number;
  totalUnidadesNetas: number;
  pesoTotalMasaKg: number;
  clientesInvolucrados: number;
}

interface EventoBitacoraOperacion {
  idLog: string;
  timestamp: string;
  cedula: string;
  nombreOperador: string;
  cargoOperador: string;
  accionRealizada: string;
  moduloAfectado: string;
  detalle: string;
}

const EMPLEADOS_PLANTA: Record<string, { nombre: string; cargo: string }> = {
  "12345678": { nombre: "Alex Castellanos", cargo: "Maestro Técnico Panadero / Jefe de Taller" },
  "87654321": { nombre: "Moussa", cargo: "Propietario / Gerencia General" },
  "11223344": { nombre: "Mariano Santibañez", cargo: "Supervisor de Producción" },
  "55667788": { nombre: "Delvis Arteaga", cargo: "Operador de Línea" },
  "99887766": { nombre: "Elvis Vera", cargo: "Operador de Amasado" },
};

const LISTA_MASAS = [
  "Masa de Pan Mini Restaurant",
  "Masa de Pan de Manteca",
  "Masa de Pan de Cachitos de Anis",
  "Masa de Pan de Completo",
  "Masa de Pan de Hamburguesas",
  "Masa de Pan de Italiano",
  "Masa de Pan de Marraqueta Peruana",
  "Masa de Pan de Biscocho Dulce",
  "Masa de Cachito de Mantequilla",
  "Masa de Pan de Molde Talla S",
  "Masa de Pan de Yema",
];

const generar60PedidosPrueba = (): PedidoOperativo[] => {
  const clientes = [
    "Distribuidora Comercial Salam",
    "Restaurante Central",
    "Panadería El Sol",
    "Cliente Express",
    "Cafetería Gourmet",
    "Hotel Santiago",
    "Supermercado Express",
    "Fuente de Soda Italia",
  ];

  const toppings = ["Sin Topping", "Sésamo Blanco", "Anís Verde", "Semillas de Chía", "Ajonjolí", "Queso Rallado"];
  const coberturas = ["Ninguna", "Huevo Batido", "Mantequilla Derretida", "Brillo de Yema", "Glaseado Dulce"];

  const pedidos: PedidoOperativo[] = [];

  for (let i = 1; i <= 60; i++) {
    const masa = LISTA_MASAS[(i - 1) % LISTA_MASAS.length];
    const cliente = clientes[i % clientes.length];
    const gramaje = 40 + (i % 8) * 15;
    const solicitados = 100 + (i % 5) * 50;
    const seguridad = Math.round(solicitados * 0.1);
    const bodega = (i % 3 === 0) ? 10 : 0;
    const neta = solicitados + seguridad - bodega;

    let estadoActual: "Pendiente" | "En Cola" | "En Producción" | "Completado" = "En Cola";
    if (i > 30 && i <= 45) estadoActual = "En Producción";
    if (i > 45) estadoActual = "Completado";

    pedidos.push({
      loteId: `PED-202610-${String(i).padStart(3, "0")}`,
      cliente,
      producto: `${masa.replace("Masa de ", "")} (${gramaje}g)`,
      tipoMasa: masa,
      gramajePiezaG: gramaje,
      cantidadSolicitada: solicitados,
      unidadesSeguridad: seguridad,
      existenciaBodega: bodega,
      cantidadNetaFabricar: neta,
      modalidad: i % 4 === 0 ? "Urgente" : "Normal",
      fechaRecepcion: "22/10/2026 06:00",
      fechaEntrega: i % 2 === 0 ? "22/10/2026 14:00" : "23/10/2026 08:00",
      cobertura: coberturas[i % coberturas.length],
      topping: toppings[i % toppings.length],
      observacionBodega: bodega > 0 ? "Con stock inicial" : "Bodega en Cero",
      observaciones: `Requerimiento especial orden #${i}`,
      estado: estadoActual,
    });
  }

  return pedidos;
};

export default function PanelPedidosPestañas({ esSuperuser = true }: PanelPedidosPestañasProps) {
  const [pestanaPedidoActiva, setPestanaPedidoActiva] = useState<number>(1);
  const [pedidosGlobales] = useState<PedidoOperativo[]>(generar60PedidosPrueba());
  
  const [lotesAbiertos, setLotesAbiertos] = useState<Record<string, boolean>>({
    "1001-1430-22102026": true,
  });

  const [clientesAbiertos, setClientesAbiertos] = useState<Record<string, boolean>>({
    "Distribuidora Comercial Salam": true,
    "Restaurante Central": true,
  });

  const [lotesBatidaSeleccionados, setLotesBatidaSeleccionados] = useState<Record<string, boolean>>({
    "LOTE-BATIDA-01": true,
  });

  const [filtroTiempo, setFiltroTiempo] = useState<string>("hoy");
  const [fechaDesde, setFechaDesde] = useState<string>("2026-11-11");
  const [fechaHasta, setFechaHasta] = useState<string>("2026-11-11");
  const [mesSeleccionado, setMesSeleccionado] = useState<string>("2026-11");
  const [anoSeleccionado, setAnoSeleccionado] = useState<string>("2026");
  const [contadorImpresiones, setContadorImpresiones] = useState<number>(0);
  const codigoDocumentoBase = "DOC-PROD-2026-1111";

  const [cedulasPorPestaña, setCedulasPorPestaña] = useState<Record<number, string>>({
    1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "",
  });

  const cedulaActualPestaña = cedulasPorPestaña[pestanaPedidoActiva] || "";
  const empleadoActualPestaña = EMPLEADOS_PLANTA[cedulaActualPestaña] || null;
  const sesionActivaPestaña = empleadoActualPestaña !== null;

  const [bitacoraOperaciones, setBitacoraOperaciones] = useState<EventoBitacoraOperacion[]>([
    {
      idLog: "LOG-001",
      timestamp: "11/11/2026 06:05:12",
      cedula: "12345678",
      nombreOperador: "Alex Castellanos",
      cargoOperador: "Maestro Técnico Panadero / Jefe de Taller",
      accionRealizada: "INICIO DE SESIÓN",
      moduloAfectado: "Pestaña 1: Recepción",
      detalle: "Acceso autorizado al módulo.",
    },
  ]);

  const registrarOperacionBitacora = (accion: string, modulo: string, detalle: string) => {
    if (!empleadoActualPestaña) return;
    const ahora = new Date();
    const timestampStr = ahora.toLocaleDateString() + " " + ahora.toLocaleTimeString();
    const nuevoLog: EventoBitacoraOperacion = {
      idLog: `LOG-${String(bitacoraOperaciones.length + 1).padStart(3, "0")}`,
      timestamp: timestampStr,
      cedula: cedulaActualPestaña,
      nombreOperador: empleadoActualPestaña.nombre,
      cargoOperador: empleadoActualPestaña.cargo,
      accionRealizada: accion,
      moduloAfectado: modulo,
      detalle,
    };
    setBitacoraOperaciones(prev => [nuevoLog, ...prev]);
  };

  const handleCambiarCédulaPestaña = (nuevaCedula: string) => {
    setCedulasPorPestaña(prev => ({
      ...prev,
      [pestanaPedidoActiva]: nuevaCedula
    }));

    const empleadoValidado = EMPLEADOS_PLANTA[nuevaCedula];
    if (empleadoValidado) {
      const ahora = new Date();
      const timestampStr = ahora.toLocaleDateString() + " " + ahora.toLocaleTimeString();
      const nuevoLog: EventoBitacoraOperacion = {
        idLog: `LOG-${String(bitacoraOperaciones.length + 1).padStart(3, "0")}`,
        timestamp: timestampStr,
        cedula: nuevaCedula,
        nombreOperador: empleadoValidado.nombre,
        cargoOperador: empleadoValidado.cargo,
        accionRealizada: "AUTORIZACIÓN DE ACCESO",
        moduloAfectado: `Pestaña ${pestanaPedidoActiva}`,
        detalle: `Operador ingresó cédula y desbloqueó la pestaña exitosamente.`,
      };
      setBitacoraOperaciones(prev => [nuevoLog, ...prev]);
    }
  };

  const cambiarPestanaSeleccionada = (idNuevaPestana: number) => {
    setPestanaPedidoActiva(idNuevaPestana);
  };

  const handleImprimirFormatoConFirma = () => {
    if (!sesionActivaPestaña) return;
    setContadorImpresiones(prev => prev + 1);
    const estadoImpresion = contadorImpresiones === 0 ? "EMISIÓN ORIGINAL" : `${contadorImpresiones}ª REIMPRESIÓN`;
    registrarOperacionBitacora("IMPRESIÓN / EMISIÓN", "Consolidado por Producto", `Impreso documento ${codigoDocumentoBase} (${estadoImpresion})`);
    alert(`🖨️ [ ${codigoDocumentoBase} ] — Estado: ${estadoImpresion}\n👤 Autorizado por: ${empleadoActualPestaña.nombre} (${empleadoActualPestaña.cargo})\n[Registrado en Bitácora de Operaciones con éxito]`);
  };

  const handleAccionBotonConRegistro = (accion: string, modulo: string) => {
    if (!sesionActivaPestaña) return;
    registrarOperacionBitacora(accion.toUpperCase(), modulo, `Ejecución de acción [${accion}] sobre registro.`);
    alert(`⚙️ Acción [ ${accion} ] ejecutada y registrada en la 7ª Pestaña (Bitácora).`);
  };

  const toggleAcordeonLote = (idLote: string) => {
    setLotesAbiertos(prev => ({ ...prev, [idLote]: !prev[idLote] }));
  };

  const toggleAcordeonCliente = (nombreCliente: string) => {
    setClientesAbiertos(prev => ({ ...prev, [nombreCliente]: !prev[nombreCliente] }));
  };

  const toggleSeleccionLoteBatida = (id: string) => {
    setLotesBatidaSeleccionados(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const pestañasPedidos = [
    { id: 1, nombre: "📝 Recepción", desc: "Ingreso Administrativo" },
    { id: 2, nombre: "📊 Situación del Pedido", desc: "Seguimiento en Planta" },
    { id: 3, nombre: "👥 Consolidado por Cliente", desc: "Resumen por Razón Social" },
    { id: 4, nombre: "🥖 Consolidado por Batida", desc: "Asignación de Masas" },
    { id: 5, nombre: "📦 Consolidado por Producto", desc: "Volúmenes Globales" },
    { id: 6, nombre: "🛡️ Bitácora de Pedidos", desc: "Auditoría e Historial Maestro" },
    { id: 7, nombre: "📋 Bitácora de Operaciones", desc: "Registro de Acciones (Live Log)" },
  ];

  const pedidosColaRojo = pedidosGlobales.filter((p) => p.estado === "En Cola");
  const pedidosTránsitoAmarillo = pedidosGlobales.filter((p) => p.estado === "En Producción");
  const pedidosListosVerde = pedidosGlobales.filter((p) => p.estado === "Completado");

  const lotesEnTránsito: LoteIndustrial[] = [
    {
      idLote: "1001-1430-22102026",
      amasadora: "Amasadora 63 Kg",
      recetaBase: "Masa de Pan de Hamburguesas",
      cargaTotalKg: 45.2,
      estadoTránsito: "En Amasado / Fermentación",
      pedidos: pedidosTránsitoAmarillo.slice(0, 8),
    },
    {
      idLote: "1002-1510-22102026",
      amasadora: "Amasadora 15 Kg",
      recetaBase: "Masa de Pan Mini Restaurant",
      cargaTotalKg: 12.8,
      estadoTránsito: "En Horneado",
      pedidos: pedidosTránsitoAmarillo.slice(8, 15),
    },
  ];

  const lotesBatidaEnPlanta: GrupoLoteBatida[] = [
    {
      idLoteBatida: "LOTE-BATIDA-01",
      amasadoraAsignada: "Amasadora Industrial 63 Kg",
      recetaBase: "Masa de Pan de Hamburguesas",
      capacidadMaximaKg: 63,
      pesoTotalBatidaKg: 48.5,
      estadoProceso: "Amasando",
      pedidosAsociados: pedidosGlobales.slice(0, 12),
    },
    {
      idLoteBatida: "LOTE-BATIDA-02",
      amasadoraAsignada: "Amasadora Rápida 25 Kg",
      recetaBase: "Masa de Pan Mini Restaurant",
      capacidadMaximaKg: 25,
      pesoTotalBatidaKg: 21.0,
      estadoProceso: "Fermentando",
      pedidosAsociados: pedidosGlobales.slice(12, 22),
    },
    {
      idLoteBatida: "LOTE-BATIDA-03",
      amasadoraAsignada: "Amasadora de Tolva 50 Kg",
      recetaBase: "Masa de Pan de Completo",
      capacidadMaximaKg: 50,
      pesoTotalBatidaKg: 44.2,
      estadoProceso: "Listos en Tolva",
      pedidosAsociados: pedidosGlobales.slice(22, 35),
    },
  ];

  const mapaProductosAgrupados: Record<string, ConsolidadoProducto> = {};
  pedidosGlobales.forEach(p => {
    const clave = `${p.tipoMasa}-${p.gramajePiezaG}`;
    if (!mapaProductosAgrupados[clave]) {
      mapaProductosAgrupados[clave] = {
        tipoMasa: p.tipoMasa,
        gramaje: p.gramajePiezaG,
        totalUnidadesSolicitadas: 0,
        totalUnidadesNetas: 0,
        pesoTotalMasaKg: 0,
        clientesInvolucrados: 0,
      };
    }
    mapaProductosAgrupados[clave].totalUnidadesSolicitadas += p.cantidadSolicitada;
    mapaProductosAgrupados[clave].totalUnidadesNetas += p.cantidadNetaFabricar;
    mapaProductosAgrupados[clave].pesoTotalMasaKg += (p.cantidadNetaFabricar * p.gramajePiezaG) / 1000;
  });

  const listadoConsolidadoProductos: ConsolidadoProducto[] = Object.values(mapaProductosAgrupados).map(item => {
    const clientesDelProducto = new Set(
      pedidosGlobales.filter(p => p.tipoMasa === item.tipoMasa && p.gramajePiezaG === item.gramaje).map(p => p.cliente)
    );
    return {
      ...item,
      clientesInvolucrados: clientesDelProducto.size,
    };
  });

  const mapaDireccionesSantiago: Record<string, { dir: string; contacto: string }> = {
    "Distribuidora Comercial Salam": { dir: "Av. Vicuña Mackenna 1820, Ñuñoa, Santiago", contacto: "Moussa (Gerencia)" },
    "Restaurante Central": { dir: "Ahumada 312, Santiago Centro, Santiago", contacto: "Carlos Silva (Propietario)" },
    "Panadería El Sol": { dir: "Av. Independencia 945, Independencia, Santiago", contacto: "Rosa Meléndez" },
    "Cliente Express": { dir: "San Diego 1230, Santiago Centro, Santiago", contacto: "Esteban Rojas" },
    "Cafetería Gourmet": { dir: "Av. Vitacura 3520, Vitacura, Santiago", contacto: "Ignacia Valdés" },
    "Hotel Santiago": { dir: "Av. Kennedy 4601, Las Condes, Santiago", contacto: "Felipe Morales (Recepción Central)" },
    "Supermercado Express": { dir: "Gran Avenida José Miguel Carrera 5020, San Miguel, Santiago", contacto: "Marcos Soto" },
    "Fuente de Soda Italia": { dir: "Av. Italia 1439, Providencia, Santiago", contacto: "Andrea Fuentes" },
  };

  const clientesNombresUnicos = Array.from(new Set(pedidosGlobales.map(p => p.cliente)));
  const listadoClientesConsolidados: ClienteConsolidado[] = clientesNombresUnicos.map(nombre => {
    const pedidosDelCliente = pedidosGlobales.filter(p => p.cliente === nombre);
    const infoExtra = mapaDireccionesSantiago[nombre] || { dir: "Av. Providencia 2000, Providencia, Santiago", contacto: "Encargado de Local" };
    return {
      nombreCliente: nombre,
      direccionSantiago: infoExtra.dir,
      contacto: infoExtra.contacto,
      pedidos: pedidosDelCliente,
    };
  });

  const registrosBitacoraPrueba = [
    {
      idRegistro: "BIT-2026-1111-01",
      fechaJornada: "11/11/2026 06:00",
      tipoConsolidado: "Producto",
      referenciaTitulo: "Consolidado Global de Pan de Hamburguesas (60g)",
      resumenOperativo: "10 locales solicitaron un total neto de 4,500 unids. Masa total estimada: 270 Kg.",
      usuarioResponsable: "Alex Castellanos (Maestro Técnico Panadero / Jefe de Taller)",
      estadoAuditoria: "Cerrado y Archivado",
    },
    {
      idRegistro: "BIT-2026-1111-02",
      fechaJornada: "11/11/2026 08:30",
      tipoConsolidado: "Batida",
      referenciaTitulo: "LOTE-BATIDA-01 (Amasadora Industrial 63 Kg)",
      resumenOperativo: "Carga de 48.5 Kg de Masa de Pan de Hamburguesas. Ciclo completado sin desviaciones.",
      usuarioResponsable: "Mariano Santibañez (Supervisor de Producción)",
      estadoAuditoria: "Cerrado y Archivado",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 text-white font-sans pb-10">
      
      <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h1 className="text-base font-black font-mono text-amber-500 uppercase tracking-wider">
            🛒 Centro de Control y Gestión de Pedidos — Synapse-X
          </h1>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            OSAI Industrial — Monitoreo, recepción y consolidación logística en Santiago de Chile
          </p>
        </div>
        <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full font-mono font-bold text-[11px] border border-amber-500/30 shrink-0">
          ● Módulo Comercial y Planta
        </span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-800 bg-zinc-950/80 p-2 rounded-2xl border border-zinc-800">
        {pestañasPedidos.map((p) => {
          const esActiva = pestanaPedidoActiva === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => cambiarPestanaSeleccionada(p.id)}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex flex-col items-center gap-0.5 border ${
                esActiva
                  ? "bg-amber-500 text-black font-black border-amber-400 shadow-lg scale-105"
                  : "bg-black text-zinc-300 border-zinc-800 hover:bg-zinc-900 hover:text-amber-400"
              }`}
            >
              <span>{p.nombre}</span>
              <span className="text-[9px] font-normal opacity-80">{p.desc}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-zinc-950 p-4 md:p-6 rounded-3xl border border-zinc-800 shadow-2xl min-h-[600px] relative">
        
        {/* BLOQUE DE CONTROL DE AUTORIZACIÓN INDUSTRIAL CON LÓGICA EDUCATIVA */}
        <div className={`p-4 rounded-2xl border shadow-xl transition-all mb-6 ${
          sesionActivaPestaña ? "bg-zinc-900/90 border-emerald-500/40" : "bg-zinc-950 border-amber-500/60"
        }`}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 font-mono">
            
            <div className="flex items-center gap-3">
              <span className="text-2xl">{sesionActivaPestaña ? "🔓" : "🔒"}</span>
              <div>
                <span className="text-[10px] text-amber-400 block uppercase font-bold tracking-wider">
                  Control de Autorización Industrial — Pestaña {pestanaPedidoActiva}
                </span>
                <h3 className="text-xs font-semibold text-zinc-300">
                  {sesionActivaPestaña 
                    ? "✓ Identidad verificada y registrada en bitácora." 
                    : "⚠️ Ingrese su cédula para habilitar las operaciones de esta sección."}
                </h3>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              
              <div className="flex flex-col w-full sm:w-48">
                <label className="text-[10px] text-amber-400 font-bold mb-1">
                  📌 Ingrese aquí su Nro. de Cédula:
                </label>
                <input 
                  type="text" 
                  value={cedulaActualPestaña}
                  onChange={(e) => handleCambiarCédulaPestaña(e.target.value)}
                  placeholder="Ej. 12345678"
                  className="bg-black border border-amber-500/60 rounded-xl px-3 py-2 text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-400 shadow-inner"
                />
                <span className="text-[9px] text-zinc-500 mt-0.5">Sin puntos ni guiones.</span>
              </div>

              <div className="flex flex-col w-full sm:w-56">
                <label className="text-[10px] text-zinc-400 font-bold mb-1">
                  👤 Nombre del Operador (Automático):
                </label>
                <input 
                  type="text" 
                  readOnly
                  value={empleadoActualPestaña ? empleadoActualPestaña.nombre : "Esperando cédula válida..."}
                  className={`bg-black/90 border rounded-xl px-3 py-2 text-xs font-semibold cursor-not-allowed ${
                    empleadoActualPestaña ? "text-white border-emerald-500/50" : "text-zinc-500 border-zinc-800 italic"
                  }`}
                />
                <span className="text-[9px] text-zinc-500 mt-0.5">Se completa al ingresar la cédula.</span>
              </div>

              <div className="flex flex-col w-full sm:w-60">
                <label className="text-[10px] text-zinc-400 font-bold mb-1">
                  🛡️ Cargo / Estación Asignada:
                </label>
                <input 
                  type="text" 
                  readOnly
                  value={empleadoActualPestaña ? empleadoActualPestaña.cargo : "Restringido hasta validar cédula"}
                  className={`bg-black/90 border rounded-xl px-3 py-2 text-xs font-semibold cursor-not-allowed ${
                    empleadoActualPestaña ? "text-emerald-400 border-emerald-500/50" : "text-zinc-500 border-zinc-800 italic"
                  }`}
                />
                <span className="text-[9px] text-zinc-500 mt-0.5">Nivel de autorización en planta.</span>
              </div>

            </div>
          </div>
        </div>

        {!sesionActivaPestaña && (
          <div className="absolute inset-x-4 bottom-4 top-36 flex flex-col items-center justify-center z-40 bg-black/85 backdrop-blur-md rounded-2xl border border-amber-500/30">
            <span className="text-4xl mb-2">🔒</span>
            <h2 className="text-sm font-mono font-black text-amber-400 uppercase">Pestaña Protegida por Autorización</h2>
            <p className="text-xs text-zinc-400 font-mono mt-1 text-center max-w-md">
              Para operar la Pestaña {pestanaPedidoActiva} en Synapse-X, ingrese su número de cédula en el panel superior.
            </p>
          </div>
        )}

        <div className={`transition-all ${sesionActivaPestaña ? "opacity-100" : "opacity-15 pointer-events-none select-none blur-[1px]"}`}>
          {pestanaPedidoActiva === 1 && <RecepcionPedidosPage esSuperuser={esSuperuser} />}

          {pestanaPedidoActiva === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-sm font-black text-amber-400 font-mono uppercase">📊 Situación Actual y Trazabilidad de los Pedidos</h2>
                <p className="text-xs text-zinc-400">Monitoreo en tiempo real del ciclo de vida de los 60 pedidos de prueba en planta.</p>
              </div>

              <div className="bg-red-950/20 border border-red-500/40 p-4 rounded-2xl space-y-3 shadow-xl">
                <div className="flex justify-between items-center border-b border-red-500/30 pb-2">
                  <span className="font-mono font-black text-xs text-red-400 uppercase tracking-wide">
                    🔴 1. Pedidos en Cola para Elaborar ({pedidosColaRojo.length} registros)
                  </span>
                  <span className="text-[10px] font-mono bg-red-500/20 text-red-300 px-2.5 py-0.5 rounded-full border border-red-500/40">
                    Estación 1: Pendiente de Lote
                  </span>
                </div>

                <div className="w-full overflow-x-auto rounded-xl border border-red-500/30 bg-black/40">
                  <table className="w-full text-left border-collapse text-[10px]">
                    <thead className="bg-red-950/40 text-red-300 font-mono uppercase">
                      <tr>
                        <th className="p-2">ID Pedido</th>
                        <th className="p-2">Cliente</th>
                        <th className="p-2">Producto</th>
                        <th className="p-2">Tipo de Masa</th>
                        <th className="p-2 text-center">Gramaje</th>
                        <th className="p-2 text-center">Cant. Solicitada</th>
                        <th className="p-2 text-center">Seguridad</th>
                        <th className="p-2 text-center">Bodega</th>
                        <th className="p-2 text-center font-bold text-red-300">Neto a Fabricar</th>
                        <th className="p-2">Modalidad</th>
                        <th className="p-2">F. Recepción</th>
                        <th className="p-2">F. Entrega</th>
                        <th className="p-2">Cobertura</th>
                        <th className="p-2">Topping</th>
                        <th className="p-2">Obs. Bodega</th>
                        <th className="p-2">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-red-900/30">
                      {pedidosColaRojo.map((p) => (
                        <tr key={p.loteId} className="hover:bg-red-950/30 transition-colors">
                          <td className="p-2 font-mono font-bold text-red-400">{p.loteId}</td>
                          <td className="p-2 font-semibold text-white">{p.cliente}</td>
                          <td className="p-2 text-zinc-300">{p.producto}</td>
                          <td className="p-2 text-zinc-400">{p.tipoMasa}</td>
                          <td className="p-2 font-mono text-center text-cyan-400 font-bold">{p.gramajePiezaG}g</td>
                          <td className="p-2 font-mono text-center text-zinc-300">{p.cantidadSolicitada}</td>
                          <td className="p-2 font-mono text-center text-zinc-500">{p.unidadesSeguridad}</td>
                          <td className="p-2 font-mono text-center text-zinc-500">{p.existenciaBodega}</td>
                          <td className="p-2 font-mono text-center font-bold text-red-400 bg-red-500/10">
                            {p.cantidadNetaFabricar} unids
                          </td>
                          <td className="p-2"><span className="px-2 py-0.5 rounded text-[9px] font-bold bg-zinc-800 text-zinc-300">{p.modalidad}</span></td>
                          <td className="p-2 font-mono text-[9px] text-zinc-500">{p.fechaRecepcion}</td>
                          <td className="p-2 font-mono text-[9px] text-zinc-500">{p.fechaEntrega}</td>
                          <td className="p-2 text-zinc-400 text-[9px]">{p.cobertura}</td>
                          <td className="p-2 text-zinc-400 text-[9px]">{p.topping}</td>
                          <td className="p-2 text-zinc-500 italic text-[9px]">{p.observacionBodega}</td>
                          <td className="p-2"><span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full text-[9px] font-bold">{p.estado}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-amber-950/20 border border-amber-500/40 p-4 rounded-2xl space-y-3 shadow-xl">
                <div className="flex justify-between items-center border-b border-amber-500/30 pb-2">
                  <div>
                    <span className="font-mono font-black text-xs text-amber-400 uppercase tracking-wide">
                      🟡 2. Lotes en Tránsito por Planta ({lotesEnTránsito.length} lotes activos)
                    </span>
                    <p className="text-[10px] text-zinc-400">Haga clic sobre cualquier lote para desplegar los pedidos que lo integran</p>
                  </div>
                  <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                    Estaciones: Amasado a Horneado
                  </span>
                </div>

                <div className="space-y-3 pt-1">
                  {lotesEnTránsito.map((lote) => {
                    const estaAbierto = !!lotesAbiertos[lote.idLote];
                    return (
                      <div key={lote.idLote} className="bg-black/60 rounded-xl border border-amber-500/40 overflow-hidden shadow-md">
                        <div 
                          onClick={() => toggleAcordeonLote(lote.idLote)}
                          className="p-3 bg-amber-950/30 hover:bg-amber-950/50 cursor-pointer flex justify-between items-center transition-colors"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-amber-400 font-mono font-black text-xs">📦 ID Lote: {lote.idLote}</span>
                              <span className="bg-amber-500 text-black font-bold text-[9px] px-2 py-0.5 rounded">{lote.amasadora}</span>
                            </div>
                            <span className="text-[10px] text-zinc-300 font-mono">
                              Receta Base: <strong className="text-amber-300">{lote.recetaBase}</strong> ({lote.cargaTotalKg} Kg)
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-amber-400 font-bold underline">
                            {estaAbierto ? "▼ Ocultar Pedidos (" + lote.pedidos.length + ")" : "► Ver Pedidos (" + lote.pedidos.length + ")"}
                          </span>
                        </div>

                        {estaAbierto && (
                          <div className="p-3 bg-black/80 border-t border-amber-500/20">
                            <div className="w-full overflow-x-auto rounded-lg border border-amber-500/30">
                              <table className="w-full text-left border-collapse text-[10px]">
                                <thead className="bg-amber-950/40 text-amber-300 font-mono uppercase">
                                  <tr>
                                    <th className="p-2">ID Pedido</th>
                                    <th className="p-2">Cliente</th>
                                    <th className="p-2">Producto</th>
                                    <th className="p-2">Tipo de Masa</th>
                                    <th className="p-2 text-center">Gramaje</th>
                                    <th className="p-2 text-center">Cant. Solicitada</th>
                                    <th className="p-2 text-center">Seguridad</th>
                                    <th className="p-2 text-center">Bodega</th>
                                    <th className="p-2 text-center font-bold text-amber-300">Neto a Fabricar</th>
                                    <th className="p-2">Modalidad</th>
                                    <th className="p-2">F. Recepción</th>
                                    <th className="p-2">F. Entrega</th>
                                    <th className="p-2">Cobertura</th>
                                    <th className="p-2">Topping</th>
                                    <th className="p-2">Obs. Bodega</th>
                                    <th className="p-2">Estado</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-amber-900/30">
                                  {lote.pedidos.map((p) => (
                                    <tr key={p.loteId} className="hover:bg-amber-950/30 transition-colors">
                                      <td className="p-2 font-mono font-bold text-amber-400">{p.loteId}</td>
                                      <td className="p-2 font-semibold text-white">{p.cliente}</td>
                                      <td className="p-2 text-zinc-300">{p.producto}</td>
                                      <td className="p-2 text-zinc-400">{p.tipoMasa}</td>
                                      <td className="p-2 font-mono text-center text-cyan-400 font-bold">{p.gramajePiezaG}g</td>
                                      <td className="p-2 font-mono text-center text-zinc-300">{p.cantidadSolicitada}</td>
                                      <td className="p-2 font-mono text-center text-zinc-500">{p.unidadesSeguridad}</td>
                                      <td className="p-2 font-mono text-center text-zinc-500">{p.existenciaBodega}</td>
                                      <td className="p-2 font-mono text-center font-bold text-amber-400 bg-amber-500/10">
                                        {p.cantidadNetaFabricar} unids
                                      </td>
                                      <td className="p-2"><span className="px-2 py-0.5 rounded text-[9px] font-bold bg-zinc-800 text-zinc-300">{p.modalidad}</span></td>
                                      <td className="p-2 font-mono text-[9px] text-zinc-500">{p.fechaRecepcion}</td>
                                      <td className="p-2 font-mono text-[9px] text-zinc-500">{p.fechaEntrega}</td>
                                      <td className="p-2 text-zinc-400 text-[9px]">{p.cobertura}</td>
                                      <td className="p-2 text-zinc-400 text-[9px]">{p.topping}</td>
                                      <td className="p-2 text-zinc-500 italic text-[9px]">{p.observacionBodega}</td>
                                      <td className="p-2"><span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full text-[9px] font-bold">{p.estado}</span></td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-emerald-950/20 border border-emerald-500/40 p-4 rounded-2xl space-y-3 shadow-xl">
                <div className="flex justify-between items-center border-b border-emerald-500/30 pb-2">
                  <span className="font-mono font-black text-xs text-emerald-400 uppercase tracking-wide">
                    🟢 3. Pedidos Listos para Empaque, Liberación y Despacho ({pedidosListosVerde.length} registros desglosados)
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                    Estación Final: Empaque
                  </span>
                </div>

                <div className="w-full overflow-x-auto rounded-xl border border-emerald-500/30 bg-black/40">
                  <table className="w-full text-left border-collapse text-[10px]">
                    <thead className="bg-emerald-950/40 text-emerald-300 font-mono uppercase">
                      <tr>
                        <th className="p-2">ID Pedido</th>
                        <th className="p-2">Cliente</th>
                        <th className="p-2">Producto</th>
                        <th className="p-2">Tipo de Masa</th>
                        <th className="p-2 text-center">Gramaje</th>
                        <th className="p-2 text-center">Cant. Solicitada</th>
                        <th className="p-2 text-center">Seguridad</th>
                        <th className="p-2 text-center">Bodega</th>
                        <th className="p-2 text-center font-bold text-emerald-300">Neto Producido</th>
                        <th className="p-2">Modalidad</th>
                        <th className="p-2">F. Recepción</th>
                        <th className="p-2">F. Entrega</th>
                        <th className="p-2">Cobertura</th>
                        <th className="p-2">Topping</th>
                        <th className="p-2">Obs. Bodega</th>
                        <th className="p-2 text-center">Estado de Despacho</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-900/30">
                      {pedidosListosVerde.map((p) => (
                        <tr key={p.loteId} className="hover:bg-emerald-950/30 transition-colors">
                          <td className="p-2 font-mono font-bold text-emerald-400">{p.loteId}</td>
                          <td className="p-2 font-semibold text-white">{p.cliente}</td>
                          <td className="p-2 text-zinc-300">{p.producto}</td>
                          <td className="p-2 text-zinc-400">{p.tipoMasa}</td>
                          <td className="p-2 font-mono text-center text-cyan-400 font-bold">{p.gramajePiezaG}g</td>
                          <td className="p-2 font-mono text-center text-zinc-300">{p.cantidadSolicitada}</td>
                          <td className="p-2 font-mono text-center text-zinc-500">{p.unidadesSeguridad}</td>
                          <td className="p-2 font-mono text-center text-zinc-500">{p.existenciaBodega}</td>
                          <td className="p-2 font-mono text-center font-bold text-emerald-400 bg-emerald-500/10">
                            {p.cantidadNetaFabricar} unids
                          </td>
                          <td className="p-2"><span className="px-2 py-0.5 rounded text-[9px] font-bold bg-zinc-800 text-zinc-300">{p.modalidad}</span></td>
                          <td className="p-2 font-mono text-[9px] text-zinc-500">{p.fechaRecepcion}</td>
                          <td className="p-2 font-mono text-[9px] text-zinc-500">{p.fechaEntrega}</td>
                          <td className="p-2 text-zinc-400 text-[9px]">{p.cobertura}</td>
                          <td className="p-2 text-zinc-400 text-[9px]">{p.topping}</td>
                          <td className="p-2 text-zinc-500 italic text-[9px]">{p.observacionBodega}</td>
                          <td className="p-2 text-center">
                            <span className="bg-emerald-500 text-black px-2.5 py-1 rounded-full text-[9px] font-black uppercase shadow-md">
                              ✓ Listo para Despachar
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {pestanaPedidoActiva === 3 && (
            <div className="space-y-6">
              <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-3 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800">
                <div>
                  <h2 className="text-sm font-black text-amber-400 font-mono uppercase">👥 Consolidado General por Razón Social y Cliente</h2>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Distribución logística y comercial en Santiago de Chile vinculada en tiempo real.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <button type="button" onClick={() => handleAccionBotonConRegistro("Ver", "Consolidado Cliente")} className="px-2.5 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-xl font-mono text-[10px] font-bold transition cursor-pointer flex items-center gap-1 shadow-md">
                    <span>👁️</span> <span>Ver</span>
                  </button>
                  <button type="button" onClick={() => handleAccionBotonConRegistro("Editar", "Consolidado Cliente")} className="px-2.5 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-amber-400 border border-amber-500/40 rounded-xl font-mono text-[10px] font-bold transition cursor-pointer flex items-center gap-1 shadow-md">
                    <span>✏️</span> <span>Editar</span>
                  </button>
                  <button type="button" onClick={() => handleAccionBotonConRegistro("Eliminar", "Consolidado Cliente")} className="px-2.5 py-1.5 bg-zinc-950 hover:bg-rose-950/60 text-rose-400 border border-rose-800/60 rounded-xl font-mono text-[10px] font-bold transition cursor-pointer flex items-center gap-1 shadow-md">
                    <span>🗑️</span> <span>Eliminar</span>
                  </button>
                  <button type="button" onClick={() => handleAccionBotonConRegistro("Crear", "Consolidado Cliente")} className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-mono text-[10px] font-black transition cursor-pointer flex items-center gap-1 shadow-md">
                    <span>➕</span> <span>Crear</span>
                  </button>
                  <button type="button" onClick={() => handleAccionBotonConRegistro("Imprimir", "Consolidado Cliente")} className="px-2.5 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-cyan-400 border border-cyan-500/40 rounded-xl font-mono text-[10px] font-bold transition cursor-pointer flex items-center gap-1 shadow-md">
                    <span>🖨️</span> <span>Imprimir</span>
                  </button>
                  <button type="button" onClick={() => handleAccionBotonConRegistro("Descargar", "Consolidado Cliente")} className="px-2.5 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-emerald-400 border border-emerald-500/40 rounded-xl font-mono text-[10px] font-bold transition cursor-pointer flex items-center gap-1 shadow-md">
                    <span>📥</span> <span>Descargar</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {listadoClientesConsolidados.map((cli) => {
                  const estaAbierto = !!clientesAbiertos[cli.nombreCliente];
                  const totalPiezasCli = cli.pedidos.reduce((acc, p) => acc + p.cantidadNetaFabricar, 0);
                  const pesoTotalKgCli = cli.pedidos.reduce((acc, p) => acc + (p.cantidadNetaFabricar * p.gramajePiezaG) / 1000, 0);

                  return (
                    <div key={cli.nombreCliente} className="bg-black/60 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
                      <div 
                        onClick={() => toggleAcordeonCliente(cli.nombreCliente)}
                        className="p-4 bg-zinc-900/80 hover:bg-zinc-900 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-3 transition-colors border-b border-zinc-800"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-amber-500 text-base">🏢</span>
                            <h3 className="font-mono font-black text-sm text-white">{cli.nombreCliente}</h3>
                            <span className="bg-amber-500/20 text-amber-400 font-mono text-[9px] px-2 py-0.5 rounded-full border border-amber-500/30">
                              Santiago de Chile
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-400 font-mono">
                            📍 Dirección: <span className="text-zinc-200">{cli.direccionSantiago}</span> | 👤 Contacto: <span className="text-amber-300">{cli.contacto}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right font-mono text-xs">
                            <span className="text-zinc-400 block text-[9px]">Pedidos: <strong className="text-amber-400">{cli.pedidos.length}</strong></span>
                            <span className="text-zinc-400 block text-[9px]">Total Piezas: <strong className="text-cyan-400">{totalPiezasCli} unids</strong></span>
                            <span className="text-zinc-400 block text-[9px]">Masa Est.: <strong className="text-emerald-400">{pesoTotalKgCli.toFixed(1)} Kg</strong></span>
                          </div>
                          <button 
                            type="button" 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleAcordeonCliente(cli.nombreCliente);
                            }}
                            className="px-3 py-1.5 bg-amber-500/20 text-amber-400 font-mono text-xs font-bold border border-amber-500/40 rounded-xl hover:bg-amber-500 hover:text-black transition-all cursor-pointer"
                          >
                            {estaAbierto ? "▼ Ocultar" : "► Ver Detalle"}
                          </button>
                        </div>
                      </div>

                      {estaAbierto && (
                        <div className="p-4 bg-black/90 border-t border-zinc-800">
                          <div className="w-full overflow-x-auto rounded-xl border border-zinc-800">
                            <table className="w-full text-left border-collapse text-[10px]">
                              <thead className="bg-zinc-900 text-zinc-300 font-mono uppercase">
                                <tr>
                                  <th className="p-2">ID Pedido</th>
                                  <th className="p-2">Producto</th>
                                  <th className="p-2">Tipo de Masa</th>
                                  <th className="p-2 text-center">Gramaje</th>
                                  <th className="p-2 text-center">Solicitado</th>
                                  <th className="p-2 text-center font-bold text-amber-400">Neto Fabricar</th>
                                  <th className="p-2">Modalidad</th>
                                  <th className="p-2">Entrega</th>
                                  <th className="p-2 text-center">Estado</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-zinc-900">
                                {cli.pedidos.map((p) => (
                                  <tr key={p.loteId} className="hover:bg-zinc-900/50 transition-colors">
                                    <td className="p-2 font-mono font-bold text-amber-400">{p.loteId}</td>
                                    <td className="p-2 text-zinc-200">{p.producto}</td>
                                    <td className="p-2 text-zinc-400">{p.tipoMasa}</td>
                                    <td className="p-2 font-mono text-center text-cyan-400">{p.gramajePiezaG}g</td>
                                    <td className="p-2 font-mono text-center text-zinc-300">{p.cantidadSolicitada}</td>
                                    <td className="p-2 font-mono text-center font-bold text-amber-400 bg-amber-500/10">{p.cantidadNetaFabricar} unids</td>
                                    <td className="p-2"><span className="px-2 py-0.5 rounded text-[9px] font-bold bg-zinc-800 text-zinc-300">{p.modalidad}</span></td>
                                    <td className="p-2 font-mono text-[9px] text-zinc-400">{p.fechaEntrega}</td>
                                    <td className="p-2 text-center"><span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full text-[9px] font-bold">{p.estado}</span></td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {pestanaPedidoActiva === 4 && (
            <div className="space-y-6">
              <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 shadow-xl">
                <div>
                  <h2 className="text-sm font-black text-amber-400 font-mono uppercase tracking-wider">
                    🥖 Consolidado por Batida y Conectores de Planta
                  </h2>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Asignación de masas a amasadoras, control de cargas en kg y trazabilidad de estaciones.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <button type="button" onClick={() => handleAccionBotonConRegistro("Sincronizar", "Consolidado Batida")} className="px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-cyan-400 border border-cyan-500/40 rounded-xl font-mono text-[10px] font-bold transition cursor-pointer flex items-center gap-1 shadow-md">
                    <span>🔄</span> <span>Sincronizar</span>
                  </button>
                  <button type="button" onClick={() => handleAccionBotonConRegistro("Imprimir Lotes", "Consolidado Batida")} className="px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-xl font-mono text-[10px] font-bold transition cursor-pointer flex items-center gap-1 shadow-md">
                    <span>🖨️</span> <span>Imprimir Lotes</span>
                  </button>
                  <button type="button" onClick={() => handleAccionBotonConRegistro("Exportar CSV", "Consolidado Batida")} className="px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-emerald-400 border border-emerald-500/40 rounded-xl font-mono text-[10px] font-bold transition cursor-pointer flex items-center gap-1 shadow-md">
                    <span>📥</span> <span>Exportar CSV</span>
                  </button>
                  <button type="button" onClick={() => handleAccionBotonConRegistro("Nueva Batida", "Consolidado Batida")} className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-mono text-[10px] font-black transition cursor-pointer flex items-center gap-1 shadow-md">
                    <span>➕</span> <span>Nueva Batida</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {lotesBatidaEnPlanta.map((lote, index) => {
                  const estaExpandido = !!lotesBatidaSeleccionados[lote.idLoteBatida];
                  const porcentajeCarga = Math.round((lote.pesoTotalBatidaKg / lote.capacidadMaximaKg) * 100);

                  return (
                    <div key={lote.idLoteBatida} className="relative">
                      {index < lotesBatidaEnPlanta.length - 1 && (
                        <div className="absolute left-6 -bottom-6 w-0.5 h-6 bg-amber-500/40 z-0 hidden md:block"></div>
                      )}

                      <div className="bg-black/70 rounded-2xl border border-zinc-800 hover:border-amber-500/50 transition-all shadow-xl overflow-hidden relative z-10">
                        <div className="p-4 bg-zinc-950 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 border-b border-zinc-800">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-mono font-bold text-xs">
                              #{index + 1}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-mono font-black text-xs text-amber-400">{lote.idLoteBatida}</h3>
                                <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-[9px] font-mono font-bold">
                                  {lote.amasadoraAsignada}
                                </span>
                              </div>
                              <p className="text-[11px] text-zinc-300 font-mono mt-0.5">
                                Receta: <strong className="text-white">{lote.recetaBase}</strong>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
                            <div className="text-right font-mono text-xs">
                              <span className="text-zinc-400 block text-[9px]">Carga de Masa:</span>
                              <strong className="text-emerald-400">{lote.pesoTotalBatidaKg} Kg</strong> 
                              <span className="text-zinc-500 text-[10px]"> / {lote.capacidadMaximaKg} Kg ({porcentajeCarga}%)</span>
                            </div>

                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase border ${
                              lote.estadoProceso === "Amasando" ? "bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse" :
                              lote.estadoProceso === "Fermentando" ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" :
                              "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                            }`}>
                              ● {lote.estadoProceso}
                            </span>

                            <button
                              type="button"
                              onClick={() => toggleSeleccionLoteBatida(lote.idLoteBatida)}
                              className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-zinc-700 rounded-xl font-mono text-xs font-bold transition cursor-pointer"
                            >
                              {estaExpandido ? "▲ Ocultar Detalle" : "▼ Ver Pedidos (" + lote.pedidosAsociados.length + ")"}
                            </button>
                          </div>
                        </div>

                        <div className="w-full bg-zinc-900 h-1.5 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-amber-600 to-amber-400 h-full transition-all duration-500" 
                            style={{ width: `${porcentajeCarga}%` }}
                          ></div>
                        </div>

                        {estaExpandido && (
                          <div className="p-4 bg-zinc-950/90 space-y-3">
                            <div className="flex justify-between items-center text-[11px] font-mono text-zinc-400 border-b border-zinc-800 pb-2">
                              <span>🔗 Pedidos integrados en esta tolva / batida</span>
                              <span>Total piezas: <strong className="text-cyan-400">{lote.pedidosAsociados.reduce((a, p) => a + p.cantidadNetaFabricar, 0)} unids</strong></span>
                            </div>

                            <div className="w-full overflow-x-auto rounded-xl border border-zinc-800">
                              <table className="w-full text-left border-collapse text-[10px]">
                                <thead className="bg-zinc-900 text-zinc-300 font-mono uppercase">
                                  <tr>
                                    <th className="p-2">ID Pedido</th>
                                    <th className="p-2">Cliente</th>
                                    <th className="p-2">Producto</th>
                                    <th className="p-2 text-center">Gramaje</th>
                                    <th className="p-2 text-center">Neto a Fabricar</th>
                                    <th className="p-2">Modalidad</th>
                                    <th className="p-2 text-center">Acciones Lote</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-900">
                                  {lote.pedidosAsociados.map((p) => (
                                    <tr key={p.loteId} className="hover:bg-zinc-900/40 transition-colors">
                                      <td className="p-2 font-mono font-bold text-amber-400">{p.loteId}</td>
                                      <td className="p-2 font-semibold text-white">{p.cliente}</td>
                                      <td className="p-2 text-zinc-300">{p.producto}</td>
                                      <td className="p-2 font-mono text-center text-cyan-400">{p.gramajePiezaG}g</td>
                                      <td className="p-2 font-mono text-center font-bold text-amber-400 bg-amber-500/10">
                                        {p.cantidadNetaFabricar} unids
                                      </td>
                                      <td className="p-2">
                                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-zinc-800 text-zinc-300">
                                          {p.modalidad}
                                        </span>
                                      </td>
                                      <td className="p-2 text-center space-x-1">
                                        <button
                                          type="button"
                                          onClick={() => handleAccionBotonConRegistro("Mover Lote", "Consolidado Batida")}
                                          className="px-2 py-0.5 bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-zinc-700 rounded text-[9px] font-mono cursor-pointer"
                                        >
                                          Mover ➔
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {pestanaPedidoActiva === 5 && (
            <div className="space-y-6">
              <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 shadow-xl space-y-4">
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-3">
                  <div>
                    <h2 className="text-sm font-black text-amber-400 font-mono uppercase tracking-wider">
                      📦 Consolidado Global por Tipo de Producto (Archivo de Planta)
                    </h2>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Nomenclatura: <strong className="text-amber-300">{codigoDocumentoBase}</strong> | Emisión: <span className="text-emerald-400 font-bold">{contadorImpresiones === 0 ? "Original" : `${contadorImpresiones}ª Reimpresión`}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={handleImprimirFormatoConFirma}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-mono text-[10px] font-black transition cursor-pointer flex items-center gap-1 shadow-md"
                    >
                      <span>🖨️</span> <span>Imprimir / Firmar Emisión</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAccionBotonConRegistro("Exportar CSV", "Consolidado Producto")}
                      className="px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-emerald-400 border border-emerald-500/40 rounded-xl font-mono text-[10px] font-bold transition cursor-pointer flex items-center gap-1 shadow-md"
                    >
                      <span>📥</span> <span>Exportar CSV</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => { setFiltroTiempo("hoy"); registrarOperacionBitacora("FILTRO", "Consolidado Producto", "Seleccionado filtro Hoy"); }}
                    className={`p-3 rounded-xl border font-mono text-left transition cursor-pointer flex flex-col gap-1 ${
                      filtroTiempo === "hoy" 
                        ? "bg-amber-500/20 border-amber-500 text-amber-300 shadow-md" 
                        : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-900"
                    }`}
                  >
                    <span className="text-[10px] opacity-80 uppercase">📅 Filtro Rápido</span>
                    <span className="text-xs font-bold text-white flex items-center justify-between">
                      <span>Hoy (Jornada Activa)</span>
                      <span>●</span>
                    </span>
                  </button>

                  <div className={`p-2.5 rounded-xl border font-mono flex flex-col gap-1 ${
                    filtroTiempo === "personalizado" 
                      ? "bg-amber-500/20 border-amber-500 text-amber-300" 
                      : "bg-zinc-950 border-zinc-800 text-zinc-400"
                  }`}>
                    <div className="flex justify-between items-center text-[10px] opacity-80">
                      <span onClick={() => { setFiltroTiempo("personalizado"); registrarOperacionBitacora("FILTRO", "Consolidado Producto", "Seleccionado filtro Personalizado"); }} className="cursor-pointer font-bold">🔍 Personalizado</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px]">
                      <input 
                        type="date" 
                        value={fechaDesde}
                        onChange={(e) => { setFechaDesde(e.target.value); setFiltroTiempo("personalizado"); }}
                        className="bg-black border border-zinc-700 rounded px-1.5 py-0.5 text-white w-full text-[9px]"
                      />
                      <span className="text-zinc-500">al</span>
                      <input 
                        type="date" 
                        value={fechaHasta}
                        onChange={(e) => { setFechaHasta(e.target.value); setFiltroTiempo("personalizado"); }}
                        className="bg-black border border-zinc-700 rounded px-1.5 py-0.5 text-white w-full text-[9px]"
                      />
                    </div>
                  </div>

                  <div className={`p-2.5 rounded-xl border font-mono flex flex-col gap-1 ${
                    filtroTiempo === "mes" 
                      ? "bg-amber-500/20 border-amber-500 text-amber-300" 
                      : "bg-zinc-950 border-zinc-800 text-zinc-400"
                  }`}>
                    <span onClick={() => { setFiltroTiempo("mes"); registrarOperacionBitacora("FILTRO", "Consolidado Producto", "Seleccionado filtro Mensual"); }} className="text-[10px] opacity-80 cursor-pointer font-bold">📂 Archivo Mensual</span>
                    <input 
                      type="month" 
                      value={mesSeleccionado}
                      onChange={(e) => { setMesSeleccionado(e.target.value); setFiltroTiempo("mes"); }}
                      className="bg-black border border-zinc-700 rounded px-2 py-1 text-white text-xs w-full"
                    />
                  </div>

                  <div className={`p-2.5 rounded-xl border font-mono flex flex-col gap-1 ${
                    filtroTiempo === "ano" 
                      ? "bg-amber-500/20 border-amber-500 text-amber-300" 
                      : "bg-zinc-950 border-zinc-800 text-zinc-400"
                  }`}>
                    <span onClick={() => { setFiltroTiempo("ano"); registrarOperacionBitacora("FILTRO", "Consolidado Producto", "Seleccionado filtro Anual"); }} className="text-[10px] opacity-80 cursor-pointer font-bold">📊 Archivo Anual</span>
                    <select 
                      value={anoSeleccionado}
                      onChange={(e) => { setAnoSeleccionado(e.target.value); setFiltroTiempo("ano"); }}
                      className="bg-black border border-zinc-700 rounded px-2 py-1 text-xs w-full text-white"
                    >
                      <option value="2026">2026 (Año Actual)</option>
                      <option value="2025">2025 (Histórico)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-black/70 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
                <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <span className="font-mono text-xs text-amber-400 font-bold uppercase block">
                      📋 Formato Oficial de Producción Diaria — Ref: {codigoDocumentoBase}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      Responsable de Emisión: <strong className="text-white">{empleadoActualPestaña.nombre}</strong> ({empleadoActualPestaña.cargo})
                    </span>
                  </div>
                  <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-bold border ${
                    contadorImpresiones === 0 
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" 
                      : "bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse"
                  }`}>
                    {contadorImpresiones === 0 ? "● DOCUMENTO NUEVO (SIN IMPRESIÓN PREVIA)" : `⚠️ ${contadorImpresiones}ª REIMPRESIÓN REGISTRADA`}
                  </span>
                </div>

                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-zinc-900 text-zinc-300 font-mono uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Tipo de Masa / Receta Base</th>
                        <th className="p-3 text-center">Gramaje Unidad</th>
                        <th className="p-3 text-center">Locales Involucrados</th>
                        <th className="p-3 text-center">Unidades Solicitadas</th>
                        <th className="p-3 text-center text-amber-400 font-bold">Neto a Fabricar (Unids)</th>
                        <th className="p-3 text-center text-emerald-400 font-bold">Masa Total Estimada (Kg)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                      {listadoConsolidadoProductos.map((item, idx) => (
                        <tr key={idx} className="hover:bg-zinc-900/40 transition-colors font-mono">
                          <td className="p-3 font-bold text-white flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            {item.tipoMasa}
                          </td>
                          <td className="p-3 text-center text-cyan-400 font-bold">{item.gramaje}g</td>
                          <td className="p-3 text-center text-zinc-300">
                            <span className="bg-zinc-800 px-2.5 py-0.5 rounded-full text-[10px]">
                              {item.clientesInvolucrados} locales
                            </span>
                          </td>
                          <td className="p-3 text-center text-zinc-300">{item.totalUnidadesSolicitadas} unids</td>
                          <td className="p-3 text-center font-bold text-amber-400 bg-amber-500/10 text-sm">
                            {item.totalUnidadesNetas} unids
                          </td>
                          <td className="p-3 text-center font-bold text-emerald-400 bg-emerald-500/10 text-sm">
                            {item.pesoTotalMasaKg.toFixed(1)} Kg
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {pestanaPedidoActiva === 6 && (
            <div className="space-y-6">
              <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 shadow-xl space-y-4">
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-3">
                  <div>
                    <h2 className="text-sm font-black text-amber-400 font-mono uppercase tracking-wider">
                      🛡️ Bitácora Maestro e Historial de Consolidaciones de Planta
                    </h2>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Memoria técnica industrial para consulta de protocolos anteriores, lotes y volúmenes de jornadas pasadas.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button type="button" onClick={() => handleAccionBotonConRegistro("Exportar Historial", "Bitácora Maestro")} className="px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-emerald-400 border border-emerald-500/40 rounded-xl font-mono text-[10px] font-bold transition cursor-pointer flex items-center gap-1 shadow-md">
                      <span>📥</span> <span>Exportar Historial</span>
                    </button>
                    <button type="button" onClick={() => handleAccionBotonConRegistro("Imprimir Auditoría", "Bitácora Maestro")} className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-mono text-[10px] font-black transition cursor-pointer flex items-center gap-1 shadow-md">
                      <span>🖨️</span> <span>Imprimir Auditoría</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-black/70 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
                <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex justify-between items-center">
                  <span className="font-mono text-xs text-amber-400 font-bold uppercase">
                    📂 Registros Históricos Almacenados
                  </span>
                  <span className="text-[10px] font-mono bg-zinc-800 text-zinc-300 px-2.5 py-0.5 rounded-full border border-zinc-700">
                    Acceso Superusuario / Auditoría Planta
                  </span>
                </div>

                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-zinc-900 text-zinc-300 font-mono uppercase text-[10px]">
                      <tr>
                        <th className="p-3">ID Registro</th>
                        <th className="p-3">Fecha / Jornada</th>
                        <th className="p-3 text-center">Tipo Consolidado</th>
                        <th className="p-3">Referencia / Título</th>
                        <th className="p-3">Resumen Operativo / Protocolo</th>
                        <th className="p-3">Responsable (Cédula / Firma)</th>
                        <th className="p-3 text-center">Estado Auditoría</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                      {registrosBitacoraPrueba.map((reg) => (
                        <tr key={reg.idRegistro} className="hover:bg-zinc-900/40 transition-colors font-mono">
                          <td className="p-3 font-bold text-amber-400">{reg.idRegistro}</td>
                          <td className="p-3 text-zinc-400 text-[11px]">{reg.fechaJornada}</td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold border bg-amber-500/20 text-amber-300 border-amber-500/40">
                              {reg.tipoConsolidado}
                            </span>
                          </td>
                          <td className="p-3 font-bold text-white">{reg.referenciaTitulo}</td>
                          <td className="p-3 text-zinc-300 text-[11px] max-w-xs">{reg.resumenOperativo}</td>
                          <td className="p-3 text-zinc-400 text-[11px]">{reg.usuarioResponsable}</td>
                          <td className="p-3 text-center">
                            <span className="bg-zinc-800 text-zinc-300 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                              {reg.estadoAuditoria}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {pestanaPedidoActiva === 7 && (
            <div className="space-y-6">
              <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div>
                  <h2 className="text-sm font-black text-amber-400 font-mono uppercase tracking-wider">
                    📋 Bitácora de Operaciones en Vivo (Live Audit Log)
                  </h2>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Registro cronológico automático e indefinido de cada acción, navegación, impresión y modificación realizada por los operadores.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <button 
                    type="button" 
                    onClick={() => alert("📥 Exportando bitácora de operaciones a CSV...")} 
                    className="px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-emerald-400 border border-emerald-500/40 rounded-xl font-mono text-[10px] font-bold transition cursor-pointer flex items-center gap-1 shadow-md"
                  >
                    <span>📥</span> <span>Exportar Logs</span>
                  </button>
                </div>
              </div>

              <div className="bg-black/70 rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
                <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex justify-between items-center font-mono">
                  <span className="text-xs text-amber-400 font-bold uppercase">
                    ⚡ Total Eventos Registrados: {bitacoraOperaciones.length}
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    ● Sistema Grabando en Tiempo Real
                  </span>
                </div>

                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead className="bg-zinc-900 text-zinc-300 uppercase text-[10px]">
                      <tr>
                        <th className="p-3">ID Log</th>
                        <th className="p-3">Fecha y Hora</th>
                        <th className="p-3">Cédula</th>
                        <th className="p-3">Operador / Nombre</th>
                        <th className="p-3">Cargo</th>
                        <th className="p-3 text-center">Acción</th>
                        <th className="p-3">Módulo</th>
                        <th className="p-3">Detalle del Evento</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900 text-[11px]">
                      {bitacoraOperaciones.map((log) => (
                        <tr key={log.idLog} className="hover:bg-zinc-900/40 transition-colors">
                          <td className="p-3 font-bold text-amber-400">{log.idLog}</td>
                          <td className="p-3 text-zinc-400">{log.timestamp}</td>
                          <td className="p-3 text-cyan-400 font-bold">{log.cedula}</td>
                          <td className="p-3 font-bold text-white">{log.nombreOperador}</td>
                          <td className="p-3 text-zinc-400 text-[10px]">{log.cargoOperador}</td>
                          <td className="p-3 text-center">
                            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded text-[9px] font-bold">
                              {log.accionRealizada}
                            </span>
                          </td>
                          <td className="p-3 text-zinc-300">{log.moduloAfectado}</td>
                          <td className="p-3 text-zinc-400">{log.detalle}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}