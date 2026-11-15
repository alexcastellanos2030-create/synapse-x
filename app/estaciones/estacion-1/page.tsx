"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import SidebarSuperuser from "../../components/SidebarSuperuser";

export interface PedidoOperativo {
  loteId: string;
  cliente: string;
  producto: string;
  tipoMasa: string;
  gramajePiezaG: number;
  cantidadSolicitada: number;
  unidadesSeguridad: number;
  existenciaBodega: number;
  cantidadNetaFabricar: number;
  modalidad: string;
  fechaRecepcion: string;
  fechaEntrega: string;
  cobertura: string;
  topping: string;
  observacionBodega: string;
  observaciones: string;
  estado: "Pendiente" | "En Cola" | "En Producción" | "Completado";
}

export interface LoteCreado {
  idLote: string;
  amasadora: string;
  receta: string;
  pedidosAsociados: PedidoOperativo[];
  cargaTotalKg: number;
  responsable: string;
  cedula: string;
  fechaHora: string;
}

export interface Estacion1Props {
  onLoteCreado?: (nuevoLote: LoteCreado) => void;
  esClaro?: boolean;
}

interface IngredienteReceta {
  id: string;
  descripcion: string;
  gramosOriginal: number | "";
  porcentajePanadero: number | "";
}

const RECETAS_BASE: Record<string, IngredienteReceta[]> = {
  "Masa de Pan Mini Restaurant": [
    { id: "1", descripcion: "Harina Fortaleza P", gramosOriginal: 1000, porcentajePanadero: 100 },
    { id: "2", descripcion: "Azucar", gramosOriginal: 70, porcentajePanadero: 7 },
    { id: "3", descripcion: "Sal", gramosOriginal: 20, porcentajePanadero: 2 },
    { id: "4", descripcion: "Mejorador", gramosOriginal: 10, porcentajePanadero: 1 },
    { id: "5", descripcion: "LEVADURA ROJA", gramosOriginal: 7, porcentajePanadero: 0.7 },
    { id: "6", descripcion: "Huevos", gramosOriginal: "", porcentajePanadero: 0 },
    { id: "7", descripcion: "Vainilla", gramosOriginal: "", porcentajePanadero: 0 },
    { id: "8", descripcion: "H2O", gramosOriginal: 475, porcentajePanadero: 47.5 },
    { id: "9", descripcion: "Aceite Vegetal", gramosOriginal: 10, porcentajePanadero: 1 },
    { id: "10", descripcion: "Manteca Vegetal", gramosOriginal: 30, porcentajePanadero: 3 },
  ],
  DEFAULT: [
    { id: "1", descripcion: "Harina de Trigo Base", gramosOriginal: 1000, porcentajePanadero: 100 },
    { id: "2", descripcion: "Agua / Líquidos", gramosOriginal: 550, porcentajePanadero: 55 },
    { id: "3", descripcion: "Levadura Fresca/Seca", gramosOriginal: 20, porcentajePanadero: 2 },
    { id: "4", descripcion: "Sal Refinada", gramosOriginal: 20, porcentajePanadero: 2 },
    { id: "5", descripcion: "Manteca / Grasa", gramosOriginal: 40, porcentajePanadero: 4 },
  ]
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
    "Hotel Santiago",
    "Restaurante Central",
    "Panadería El Sol",
    "Cliente Express",
    "Cafetería Gourmet",
    "Supermercado Express",
    "Fuente de Soda Italia",
  ];

  const toppings = ["Sin Topping", "Sésamo Blanco", "Anís Verde", "Semillas de Chía", "Ajonjolí", "Queso Rallado"];
  const coberturas = ["Ninguna", "Huevo Batido", "Mantequilla Derretida", "Brillo de Yema", "Glaseado Dulce"];

  const pedidos: PedidoOperativo[] = [];

  for (let i = 1; i <= 60; i++) {
    const masa = LISTA_MASAS[(i - 1) % LISTA_MASAS.length];
    const cliente = clientes[i % clientes.length];
    
    const esMini = masa.toLowerCase().includes("mini restaurant");
    const gramaje = esMini ? 25 : (40 + (i % 8) * 15);

    const solicitados = 165 + ((i * 5) % 50);
    const seguridad = 10; 
    const bodega = (i % 2 === 0) ? 10 : 0; 
    
    const neta = solicitados + seguridad - bodega;

    pedidos.push({
      loteId: `PED-202610-${String(i).padStart(3, "0")}`,
      cliente,
      producto: `${esMini ? "Pan Mini Restaurant" : masa.replace("Masa de ", "")} (${gramaje}g)`,
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
      observacionBodega: bodega > 0 ? `Stock en bodega: ${bodega} unids (resguardo para fallas)` : "Bodega en Cero",
      observaciones: esMini ? `Pedido: ${solicitados} unids | +${seguridad} seguridad | -${bodega} en bodega` : `Requerimiento estándar orden #${i}`,
      estado: "En Cola",
    });
  }

  return pedidos;
};

export default function Estacion1({ onLoteCreado, esClaro = false }: Estacion1Props) {
  const [estacionActiva, setEstacionActiva] = useState<number>(1);
  const [amasadoraSeleccionada, setAmasadoraSeleccionada] = useState<string>("Seleccionar batidora");
  const [recetaSeleccionada, setRecetaSeleccionada] = useState<string>("Seleccionar tipo de masa");
  const [pedidosCola, setPedidosCola] = useState<PedidoOperativo[]>(generar60PedidosPrueba());
  const [pedidosSeleccionados, setPedidosSeleccionados] = useState<string[]>([]);
  const [acordeonDetalleAbierto, setAcordeonDetalleAbierto] = useState<boolean>(true);
  
  // Estados de control de barra y modos
  const [sidebarColapsada, setSidebarColapsada] = useState<boolean>(false);
  const [sidebarMovilAbierta, setSidebarMovilAbierta] = useState<boolean>(false);
  const [rolActivo, setRolActivo] = useState<"superuser" | "admin" | "operario" | "cajera" | "supervisor">("superuser");
  const [temaVisual, setTemaVisual] = useState<"oscuro" | "claro" | "sistema">("oscuro");
  const [superuserModoActivo, setSuperuserModoActivo] = useState<boolean>(false);

  const [ingredientesReceta, setIngredientesReceta] = useState<IngredienteReceta[]>([]);
  const [cedulaResponsable, setCedulaResponsable] = useState<string>("");
  const [nombreResponsable, setNombreResponsable] = useState<string>("Ingrese su cédula aquí para validar...");
  const [fechaHoraActual, setFechaHoraActual] = useState<string>("");
  const [idLoteActual, setIdLoteActual] = useState<string>("");

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

  useEffect(() => {
    const actualizarRelojYLote = () => {
      const ahora = new Date();
      const formato = ahora.toLocaleString("es-CL", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setFechaHoraActual(formato);

      const horasMil = String(ahora.getHours()).padStart(2, "0") + String(ahora.getMinutes()).padStart(2, "0");
      const dia = String(ahora.getDate()).padStart(2, "0");
      const mes = String(ahora.getMonth() + 1).padStart(2, "0");
      const anio = ahora.getFullYear();
      
      setIdLoteActual(`1001-${horasMil}-${dia}${mes}${anio}`);
    };

    actualizarRelojYLote();
    const timer = setInterval(actualizarRelojYLote, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (recetaSeleccionada !== "Seleccionar tipo de masa") {
      const base = RECETAS_BASE[recetaSeleccionada] || RECETAS_BASE["DEFAULT"];
      setIngredientesReceta(JSON.parse(JSON.stringify(base)));
    } else {
      setIngredientesReceta([]);
    }
  }, [recetaSeleccionada]);

  const obtenerCapacidadMaximaKg = (amasadora: string): number => {
    if (amasadora.includes("10")) return 10;
    if (amasadora.includes("15")) return 15;
    if (amasadora.includes("63")) return 63;
    if (amasadora.includes("75")) return 75;
    return 0;
  };

  const paso1Completado = amasadoraSeleccionada !== "Seleccionar batidora";
  const paso2Completado = paso1Completado && recetaSeleccionada !== "Seleccionar tipo de masa";
  const paso3Completado = paso2Completado && pedidosSeleccionados.length > 0;
  const paso4Completado = paso3Completado;
  const paso5Completado = paso4Completado && cedulaResponsable.length >= 7 && !nombreResponsable.includes("Ingrese");

  const handleCambiarEstacion = (id: number) => {
    setEstacionActiva(id);
    if (typeof window !== "undefined") {
      window.location.href = `/estaciones/estacion-${id}`;
    }
  };

  const toggleSeleccionPedido = (idPedido: string) => {
    if (!paso2Completado) {
      alert("🔒 BLOQUEO POKA-YOKE: Debe completar el Paso 1 y el Paso 2 antes de seleccionar pedidos.");
      return;
    }

    const pedidoAProbar = pedidosCola.find((p) => p.loteId === idPedido);
    if (!pedidoAProbar) return;

    const pesoPedidoKg = (pedidoAProbar.cantidadNetaFabricar * pedidoAProbar.gramajePiezaG) / 1000;
    const pedidosActuales = pedidosCola.filter((p) => pedidosSeleccionados.includes(p.loteId));
    const pesoActualKg = pedidosActuales.reduce((acc, p) => acc + (p.cantidadNetaFabricar * p.gramajePiezaG) / 1000, 0);

    if (pedidosSeleccionados.includes(idPedido)) {
      setPedidosSeleccionados(pedidosSeleccionados.filter((p) => p !== idPedido));
      return;
    }

    const pesoTotalEstimado = pesoActualKg + pesoPedidoKg;
    const capacidadMax = obtenerCapacidadMaximaKg(amasadoraSeleccionada);

    if (capacidadMax > 0 && pesoTotalEstimado > (capacidadMax + 0.1)) {
      alert(`⛔ POKA-YOKE [CAPACIDAD EXCEDIDA]: El pedido sobrepasa la capacidad de la amasadora (${capacidadMax} Kg).`);
      return;
    }

    setPedidosSeleccionados([...pedidosSeleccionados, idPedido]);
  };

  const manejarCedula = (val: string) => {
    if (!paso3Completado) {
      alert("🔒 BLOQUEO POKA-YOKE: Debe seleccionar al menos un pedido antes de registrar la cédula.");
      return;
    }

    const ced = val.replace(/\D/g, "");
    setCedulaResponsable(ced);
    if (ced === "10433935") {
      setNombreResponsable("Alexander Segundo Castellanos Perozo (Supervisor)");
    } else if (ced === "87654321") {
      setNombreResponsable("Carolina Pérez (Administración)");
    } else if (ced.length >= 7) {
      setNombreResponsable(`Operador Autorizado ID ${ced}`);
    } else {
      setNombreResponsable("Ingrese su cédula aquí para validar...");
    }
  };

  const pedidosFiltrados = recetaSeleccionada === "Seleccionar tipo de masa"
    ? []
    : pedidosCola.filter((p) => p.tipoMasa === recetaSeleccionada && p.estado === "En Cola");

  const pedidosLoteActivos = pedidosCola.filter((p) => pedidosSeleccionados.includes(p.loteId));
  const totalPiezasLote = pedidosLoteActivos.reduce((acc, p) => acc + p.cantidadNetaFabricar, 0);
  const pesoTotalLoteKg = pedidosLoteActivos.reduce((acc, p) => acc + (p.cantidadNetaFabricar * p.gramajePiezaG) / 1000, 0);

  const totalGramosRecetaOriginal = ingredientesReceta.reduce((acc, ing) => {
    return acc + (typeof ing.gramosOriginal === "number" ? ing.gramosOriginal : 0);
  }, 0);

  const factorEscala = totalGramosRecetaOriginal > 0 ? (pesoTotalLoteKg * 1000) / totalGramosRecetaOriginal : 0;

  const actualizarIngredienteLocal = (id: string, campo: "descripcion" | "gramosOriginal" | "porcentajePanadero", valor: any) => {
    setIngredientesReceta(
      ingredientesReceta.map((ing) => (ing.id === id ? { ...ing, [campo]: valor } : ing))
    );
  };

  const registrarEnBitacora = () => {
    if (!paso5Completado) {
      alert("⚠️ POKA-YOKE: Complete todos los pasos y valide la cédula antes de registrar en bitácora.");
      return;
    }
    alert(`📝 [BITÁCORA TALLER DE PRODUCCIÓN]: Lote ${idLoteActual} registrado a las ${fechaHoraActual}.`);
  };

  const avanzarSiguienteEstacion = () => {
    if (!paso5Completado) {
      alert("⚠️ POKA-YOKE: Debe completar y firmar el lote actual antes de avanzar.");
      return;
    }

    const nuevoLote: LoteCreado = {
      idLote: idLoteActual,
      amasadora: amasadoraSeleccionada,
      receta: recetaSeleccionada,
      pedidosAsociados: pedidosLoteActivos,
      cargaTotalKg: Number(pesoTotalLoteKg.toFixed(2)),
      responsable: nombreResponsable,
      cedula: cedulaResponsable,
      fechaHora: fechaHoraActual,
    };

    const idsSeleccionadosSet = new Set(pedidosSeleccionados);
    setPedidosCola(pedidosCola.map(p => idsSeleccionadosSet.has(p.loteId) ? { ...p, estado: "En Producción" } : p));

    alert(`🚀 [AVANCE EXITOSO]: Lote ${nuevoLote.idLote} transferido a Estación 2 (Amasado). Sistema reiniciado.`);
    
    if (onLoteCreado) onLoteCreado(nuevoLote);

    setAmasadoraSeleccionada("Seleccionar batidora");
    setRecetaSeleccionada("Seleccionar tipo de masa");
    setPedidosSeleccionados([]);
    setCedulaResponsable("");
    setNombreResponsable("Ingrese su cédula aquí para validar...");
  };

  const pedidosPendientesCola = pedidosCola.filter(p => p.estado === "En Cola");

  return (
    <div className="min-h-screen bg-black text-white flex font-mono">
      
      {/* SELECTOR DINÁMICO DE SIDEBAR: SUPERUSER VS OPERARIO */}
      {superuserModoActivo ? (
        <SidebarSuperuser
          superuserModoActivo={superuserModoActivo}
          setSuperuserModoActivo={setSuperuserModoActivo}
          rolActivo={rolActivo}
          estacionActiva={estacionActiva}
          setEstacionActiva={(id) => {
            setEstacionActiva(id);
            if (id === 20) {
              window.location.href = "/dashboard-20";
            } else if (id !== 99) {
              window.location.href = `/estaciones/estacion-${id}`;
            }
          }}
          conmutarRol={() => setRolActivo(rolActivo === "superuser" ? "operario" : "superuser")}
          setTemaVisual={setTemaVisual}
          handleCerrarSesion={() => alert("🔒 Sesión finalizada.")}
        />
      ) : (
        <Sidebar
          sidebarColapsada={sidebarColapsada}
          setSidebarColapsada={setSidebarColapsada}
          sidebarMovilAbierta={sidebarMovilAbierta}
          setSidebarMovilAbierta={setSidebarMovilAbierta}
          estacionActiva={estacionActiva}
          setEstacionActiva={(id) => {
            setEstacionActiva(id);
            if (id === 99) {
              alert("Abriendo Gestión de Personal...");
            } else {
              window.location.href = `/estaciones/estacion-${id}`;
            }
          }}
          rolActivo={rolActivo}
          conmutarRol={() => setRolActivo(rolActivo === "superuser" ? "operario" : "superuser")}
          temaVisual={temaVisual}
          setTemaVisual={setTemaVisual}
          handleCerrarSesion={() => alert("🔒 Sesión finalizada.")}
          onActivarSuperuser={() => setSuperuserModoActivo(true)}
        />
      )}

      {/* CONTENIDO PRINCIPAL DE LA ESTACIÓN 1 */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <div className="space-y-6 max-w-6xl mx-auto pb-12">
          
          {/* CONTENEDOR 1: TÍTULO MAESTRO Y LAS 12 ESTACIONES */}
          <div className="border border-zinc-800 bg-zinc-950 p-5 rounded-2xl shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-zinc-800 pb-3">
              <div>
                <h1 className="text-base font-black text-amber-400 tracking-wider uppercase">
                  Synapse-X OSAI Industrial
                </h1>
                <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-wide">
                  Panel Central de Produccion — Taller de Produccion
                </h2>
              </div>
              <span className="text-[10px] text-zinc-400 bg-zinc-900 px-3 py-1 rounded border border-zinc-800 font-mono">
                ● 12 Estaciones de Trazabilidad Activas
              </span>
            </div>

            {/* 12 BOTONES DE LAS ESTACIONES */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-2 pt-1">
              {estacionesListado.map((est) => (
                <button
                  key={est.id}
                  type="button"
                  onClick={() => handleCambiarEstacion(est.id)}
                  className={`px-2 py-2.5 rounded-lg text-xs font-mono transition-all cursor-pointer text-center truncate ${
                    estacionActiva === est.id
                      ? "bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/20 scale-105"
                      : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800"
                  }`}
                  title={`${est.id}. ${est.nombre}`}
                >
                  <span className="font-bold">{est.id}.</span> {est.nombre}
                </button>
              ))}
            </div>
          </div>

          {/* CONTENEDOR 2: SISTEMA DE CANDADOS Y BLOQUEO DE RUTA (ROJO, AMARILLO Y VERDE) */}
          <div className="border border-zinc-800 bg-zinc-950 p-5 rounded-2xl shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <span>🔒</span> Sistema de Candados y Bloqueo de Ruta que debe Seguir el Operador
            </h3>
            <p className="text-[11px] text-zinc-400 font-sans">
              Secuencia estricta Poka-Yoke obligatoria. El sistema bloquea automáticamente los pasos siguientes hasta validar el anterior.
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-1 font-mono text-[10px]">
              <div className={`p-3 rounded-xl border text-center flex flex-col justify-between gap-1.5 ${paso1Completado ? "bg-emerald-950/30 border-emerald-500 text-emerald-300" : "bg-red-950/30 border-red-500 text-red-300 animate-pulse"}`}>
                <div className="font-bold text-zinc-400">PASO 1</div>
                <div className="flex items-center justify-center gap-1">
                  <span>{paso1Completado ? "🟢" : "🔴"}</span> Amasadora
                </div>
              </div>
              <div className={`p-3 rounded-xl border text-center flex flex-col justify-between gap-1.5 ${paso2Completado ? "bg-emerald-950/30 border-emerald-500 text-emerald-300" : paso1Completado ? "bg-amber-950/30 border-amber-500 text-amber-300" : "bg-zinc-900 border-zinc-800 text-zinc-600"}`}>
                <div className="font-bold text-zinc-400">PASO 2</div>
                <div className="flex items-center justify-center gap-1">
                  <span>{paso2Completado ? "🟢" : paso1Completado ? "🟡" : "🔴"}</span> Tipo de Masa
                </div>
              </div>
              <div className={`p-3 rounded-xl border text-center flex flex-col justify-between gap-1.5 ${paso3Completado ? "bg-emerald-950/30 border-emerald-500 text-emerald-300" : paso2Completado ? "bg-amber-950/30 border-amber-500 text-amber-300" : "bg-zinc-900 border-zinc-800 text-zinc-600"}`}>
                <div className="font-bold text-zinc-400">PASO 3</div>
                <div className="flex items-center justify-center gap-1">
                  <span>{paso3Completado ? "🟢" : paso2Completado ? "🟡" : "🔴"}</span> Pedidos Lote
                </div>
              </div>
              <div className={`p-3 rounded-xl border text-center flex flex-col justify-between gap-1.5 ${paso4Completado ? "bg-emerald-950/30 border-emerald-500 text-emerald-300" : paso3Completado ? "bg-amber-950/30 border-amber-500 text-amber-300" : "bg-zinc-900 border-zinc-800 text-zinc-600"}`}>
                <div className="font-bold text-zinc-400">PASO 4</div>
                <div className="flex items-center justify-center gap-1">
                  <span>{paso4Completado ? "🟢" : paso3Completado ? "🟡" : "🔴"}</span> Ficha Receta
                </div>
              </div>
              <div className={`p-3 rounded-xl border text-center flex flex-col justify-between gap-1.5 ${paso5Completado ? "bg-emerald-950/30 border-emerald-500 text-emerald-300" : paso4Completado ? "bg-amber-950/30 border-amber-500 text-amber-300" : "bg-zinc-900 border-zinc-800 text-zinc-600"}`}>
                <div className="font-bold text-zinc-400">PASO 5</div>
                <div className="flex items-center justify-center gap-1">
                  <span>{paso5Completado ? "🟢" : paso4Completado ? "🟡" : "🔴"}</span> Firma Operario
                </div>
              </div>
            </div>
          </div>

          {/* CAMPOS DE SELECCIÓN DE AMASADORA Y TIPO DE MASA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2 shadow-md">
              <label className="text-amber-400 font-bold block uppercase text-[11px]">
                Seleccion de Amasadora:
              </label>
              <select
                value={amasadoraSeleccionada}
                onChange={(e) => {
                  setAmasadoraSeleccionada(e.target.value);
                  setPedidosSeleccionados([]);
                  setRecetaSeleccionada("Seleccionar tipo de masa");
                }}
                className="w-full bg-zinc-900 text-zinc-100 p-2.5 rounded-lg border border-zinc-800 font-bold text-xs cursor-pointer focus:outline-none focus:border-amber-500"
              >
                <option value="Seleccionar batidora">Seleccionar batidora</option>
                <option value="Amasadora 10 Kg">Amasadora 10 kg (Harina Base)</option>
                <option value="Amasadora 15 Kg">Amasadora 15 kg (Harina Base)</option>
                <option value="Amasadora 63 Kg">Amasadora 63 kg (Harina Base)</option>
                <option value="Amasadora 75 Kg">Amasadora 75 kg (Harina Base)</option>
              </select>
            </div>

            <div className={`p-4 rounded-xl border space-y-2 shadow-md transition-all ${
              !paso1Completado ? "opacity-40 border-red-500/50 bg-red-950/10" : "border-zinc-800 bg-zinc-950 opacity-100"
            }`}>
              <div className="flex justify-between items-center">
                <label className="text-amber-400 font-bold block uppercase text-[11px]">
                  Seleccion Tipo de Masa:
                </label>
                {!paso1Completado && (
                  <span className="text-[10px] font-mono text-red-400 font-bold">🔒 BLOQUEADO</span>
                )}
              </div>
              <select
                value={recetaSeleccionada}
                disabled={!paso1Completado}
                onChange={(e) => {
                  setRecetaSeleccionada(e.target.value);
                  setPedidosSeleccionados([]); 
                }}
                className={`w-full p-2.5 rounded-lg border font-bold text-xs ${
                  !paso1Completado ? "bg-zinc-900 text-zinc-600 cursor-not-allowed border-zinc-800" : "bg-zinc-900 text-zinc-100 cursor-pointer border-zinc-800 focus:outline-none focus:border-amber-500"
                }`}
              >
                <option value="Seleccionar tipo de masa">Seleccionar tipo de masa</option>
                {LISTA_MASAS.map((masa, idx) => (
                  <option key={idx} value={masa}>
                    {masa}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* CONTENEDOR DE PEDIDOS (DESGLOSE DE CANTIDAD, SEGURIDAD Y BODEGA) */}
          <div className={`bg-zinc-950 p-5 rounded-2xl border space-y-3 shadow-xl transition-all ${
            !paso2Completado ? "opacity-40 border-red-500/50 bg-red-950/10" : "border-zinc-800 opacity-100"
          }`}>
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Pedidos Disponibles para el Lote ({pedidosSeleccionados.length} seleccionados)
              </h3>
              {!paso2Completado ? (
                <span className="text-[10px] font-mono text-red-400 font-bold">🔒 Candado Activo: Seleccione Amasadora y Tipo de Masa</span>
              ) : (
                <span className="text-[10px] text-zinc-400">
                  Batidora Límite: <strong className="text-amber-400">{amasadoraSeleccionada}</strong>
                </span>
              )}
            </div>

            <div className="w-full overflow-x-auto rounded-xl border border-zinc-800">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead className="bg-zinc-900 text-zinc-300 font-mono">
                  <tr>
                    <th className="p-3 text-center">Sel. (Checklist)</th>
                    <th className="p-3">Identificación de Pedido</th>
                    <th className="p-3">Cliente</th>
                    <th className="p-3">Producto / Pan</th>
                    <th className="p-3">Tipo de Masa</th>
                    <th className="p-3 text-center">Gramaje</th>
                    <th className="p-3 text-center">Desglose (Pedido / Seguridad / Bodega)</th>
                    <th className="p-3 text-center font-bold text-amber-400">Total a Fabricar</th>
                    <th className="p-3 text-right">Peso Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {!paso2Completado ? (
                    <tr>
                      <td colSpan={9} className="p-6 text-center text-red-400 font-bold italic">
                        🔒 Complete el Paso 1 y Paso 2 para habilitar la selección de pedidos.
                      </td>
                    </tr>
                  ) : pedidosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-6 text-center text-zinc-500 italic">
                        No hay pedidos activos en cola para la receta "{recetaSeleccionada}".
                      </td>
                    </tr>
                  ) : (
                    pedidosFiltrados.map((p) => {
                      const pesoKg = (p.cantidadNetaFabricar * p.gramajePiezaG) / 1000;
                      const estaSeleccionado = pedidosSeleccionados.includes(p.loteId);
                      return (
                        <tr
                          key={p.loteId}
                          onClick={() => toggleSeleccionPedido(p.loteId)}
                          className={`cursor-pointer transition-colors ${
                            estaSeleccionado ? "bg-amber-500/10" : "hover:bg-zinc-900/50"
                          }`}
                        >
                          <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={estaSeleccionado}
                              onChange={() => toggleSeleccionPedido(p.loteId)}
                              className="accent-amber-500 w-4 h-4 cursor-pointer"
                            />
                          </td>
                          <td className="p-3">
                            <div className="font-mono font-bold text-amber-400">{p.loteId}</div>
                            <div className="text-[10px] text-zinc-400 italic">Obs: {p.observaciones}</div>
                          </td>
                          <td className="p-3 font-semibold text-zinc-200">{p.cliente}</td>
                          <td className="p-3 text-zinc-300">{p.producto}</td>
                          <td className="p-3 text-zinc-400">{p.tipoMasa}</td>
                          <td className="p-3 text-center text-cyan-400 font-bold">{p.gramajePiezaG}g</td>
                          
                          <td className="p-3 text-center font-mono text-[10px]">
                            <span className="text-amber-400" title="Cantidad Solicitada">{p.cantidadSolicitada} unids</span>
                            <span className="text-zinc-500"> + </span>
                            <span className="text-cyan-400" title="Seguridad">{p.unidadesSeguridad} seg</span>
                            <span className="text-zinc-500"> - </span>
                            <span className="text-red-400" title="Stock en Bodega">{p.existenciaBodega} bodega</span>
                          </td>

                          <td className="p-3 text-center font-bold text-amber-400 text-xs">
                            {p.cantidadNetaFabricar} unids
                          </td>

                          <td className="p-3 text-right font-bold text-emerald-400">{pesoKg.toFixed(2)} Kg</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* ACORDEÓN / CONSOLIDADO DE LOTE SELECCIONADO */}
            {pedidosLoteActivos.length > 0 && (
              <div className="bg-black p-4 rounded-xl border border-amber-500/40 space-y-3 mt-4">
                <div 
                  className="flex justify-between items-center cursor-pointer border-b border-zinc-900 pb-2"
                  onClick={() => setAcordeonDetalleAbierto(!acordeonDetalleAbierto)}
                >
                  <div className="font-mono text-xs text-zinc-200 space-x-3">
                    <span>ID Lote: <strong className="text-amber-400">{idLoteActual}</strong></span>
                    <span>•</span>
                    <span>Total Piezas: <strong className="text-cyan-400">{totalPiezasLote} unids</strong></span>
                    <span>•</span>
                    <span>Masa Total: <strong className="text-emerald-400">{pesoTotalLoteKg.toFixed(2)} Kg</strong></span>
                  </div>
                  <button type="button" className="text-amber-400 text-xs font-bold hover:underline">
                    {acordeonDetalleAbierto ? "▼ Ocultar Acordeón" : "▶ Ver Detalle de Pedidos"}
                  </button>
                </div>

                {acordeonDetalleAbierto && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {pedidosLoteActivos.map((ped, idx) => (
                      <div key={ped.loteId} className="bg-zinc-900 p-3 rounded-lg border border-zinc-800 space-y-1 text-[11px]">
                        <div className="flex justify-between text-amber-400 font-bold">
                          <span>#{idx + 1} {ped.loteId}</span>
                          <span>{((ped.cantidadNetaFabricar * ped.gramajePiezaG) / 1000).toFixed(2)} Kg</span>
                        </div>
                        <div className="text-zinc-200">{ped.cliente} — {ped.producto}</div>
                        <div className="text-[10px] text-zinc-400 italic">Desglose: {ped.cantidadSolicitada} solicitados + {ped.unidadesSeguridad} seguridad - {ped.existenciaBodega} bodega = {ped.cantidadNetaFabricar} a fabricar</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CONTENEDOR: PESAJE DE INGREDIENTES Y RECETA MAESTRA */}
          <div className={`bg-zinc-950 p-6 rounded-2xl border space-y-4 shadow-xl transition-all ${
            !paso3Completado ? "opacity-40 border-red-500/50 bg-red-950/10" : "border-zinc-800 opacity-100"
          }`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-800 pb-4 gap-2">
              <div className="space-y-1">
                <h3 className="text-xl md:text-3xl font-black text-amber-400 uppercase tracking-wider">
                  ⚖️ PESAJE DE INGREDIENTES
                </h3>
                <p className="text-xs md:text-sm font-bold text-cyan-400 font-mono uppercase tracking-wide">
                  (Receta Maestra — Fórmula Base: {recetaSeleccionada})
                </p>
              </div>
              {!paso3Completado && (
                <span className="text-[10px] font-mono text-red-400 font-bold">🔒 BLOQUEADO</span>
              )}
            </div>

            {!paso3Completado ? (
              <div className="p-6 text-center text-red-400 italic text-xs border border-dashed border-red-500/30 rounded-xl">
                🔒 Candado activo: Seleccione al menos un pedido para calcular los gramajes exactos de la receta.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-zinc-800">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead className="bg-zinc-900 text-zinc-300 font-mono">
                    <tr>
                      <th className="p-3 w-16 text-center">Ítem</th>
                      <th className="p-3">DESCRIPCIÓN INGREDIENTE</th>
                      <th className="p-3 w-36 text-center">gr (Receta Base)</th>
                      <th className="p-3 w-32 text-center">PORC %</th>
                      <th className="p-3 w-40 text-right bg-emerald-950/50 text-emerald-300">GRAMOS SISTEMA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 font-mono">
                    {ingredientesReceta.map((ing) => {
                      const gOrig = typeof ing.gramosOriginal === "number" ? ing.gramosOriginal : 0;
                      const gramosCalculadosSistema = gOrig > 0 ? gOrig * factorEscala : 0;

                      return (
                        <tr key={ing.id} className="hover:bg-zinc-900/40">
                          <td className="p-3 text-center text-zinc-500">#{ing.id}</td>
                          <td className="p-3">
                            <input
                              type="text"
                              value={ing.descripcion}
                              onChange={(e) => actualizarIngredienteLocal(ing.id, "descripcion", e.target.value)}
                              className="w-full bg-zinc-900 p-1.5 rounded border border-zinc-800 font-bold text-zinc-100"
                            />
                          </td>
                          <td className="p-3 text-center">
                            <input
                              type="number"
                              value={ing.gramosOriginal}
                              onChange={(e) => actualizarIngredienteLocal(ing.id, "gramosOriginal", e.target.value === "" ? "" : Number(e.target.value))}
                              className="w-28 text-center bg-zinc-900 p-1.5 rounded border border-zinc-800 text-amber-400 font-bold"
                            />
                          </td>
                          <td className="p-3 text-center">
                            <input
                              type="number"
                              step="0.01"
                              value={ing.porcentajePanadero}
                              onChange={(e) => actualizarIngredienteLocal(ing.id, "porcentajePanadero", e.target.value === "" ? "" : Number(e.target.value))}
                              className="w-24 text-center bg-zinc-900 p-1.5 rounded border border-zinc-800 text-cyan-400 font-bold"
                            />
                          </td>
                          <td className="p-3 text-right font-bold bg-emerald-950/20 text-emerald-400 text-xs">
                            {gramosCalculadosSistema > 0 ? `${gramosCalculadosSistema.toFixed(1)} g` : "0.0 g"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* CONTENEDOR: FIRMA DEL OPERARIO Y 2 BOTONES DE ACCIÓN */}
          <div className={`bg-zinc-950 p-5 rounded-2xl border space-y-4 shadow-xl transition-all ${
            !paso4Completado ? "opacity-40 border-red-500/50 bg-red-950/10" : "border-zinc-800 opacity-100"
          }`}>
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                👤 Firma del Operario y Validación de Lote
              </h3>
              {!paso4Completado && (
                <span className="text-[10px] font-mono text-red-400 font-bold">🔒 BLOQUEADO</span>
              )}
            </div>

            {!paso4Completado ? (
              <div className="p-6 text-center text-red-400 italic text-xs border border-dashed border-red-500/30 rounded-xl">
                🔒 Candado activo: Complete los pasos anteriores para habilitar la firma de cierre de estación.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 block mb-1">Campo de Cédula:</label>
                    <input
                      type="text"
                      value={cedulaResponsable}
                      onChange={(e) => manejarCedula(e.target.value)}
                      placeholder="Ej: 10433935"
                      className="w-full bg-zinc-900 text-xs text-zinc-100 border border-zinc-800 rounded-lg px-3 py-2 font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 block mb-1">Campo de Nombre en Automático:</label>
                    <div className="w-full bg-zinc-900 text-xs text-amber-400 font-bold border border-zinc-800 rounded-lg px-3 py-2 flex items-center h-[34px]">
                      {nombreResponsable}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 block mb-1">Hora y Fecha del Sistema:</label>
                    <div className="w-full bg-zinc-900 text-xs text-emerald-400 font-bold border border-zinc-800 rounded-lg px-3 py-2 flex items-center h-[34px] font-mono">
                      {fechaHoraActual || "Sincronizando..."}
                    </div>
                  </div>
                </div>

                {/* 2 BOTONES DE ACCIÓN INDUSTRIAL */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={registrarEnBitacora}
                    className="px-5 py-3 bg-zinc-900 hover:bg-zinc-800 text-amber-400 font-bold text-xs rounded-xl border border-amber-500/30 transition-all cursor-pointer flex items-center justify-center gap-2 shadow"
                  >
                    <span>📝</span> Registrar accion en la Bitacora
                  </button>
                  <button
                    type="button"
                    onClick={avanzarSiguienteEstacion}
                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>🚀</span> Avanzar a la Siguiente Estacion
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* CONTENEDOR DINÁMICO: COLA DE PEDIDOS POR ELABORAR */}
          <div className="border border-zinc-800 bg-zinc-950 p-5 rounded-2xl shadow-xl space-y-3">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                <span>📋</span> Cola de Pedidos por Elaborar en Planta ({pedidosPendientesCola.length} en espera)
              </h3>
              <span className="text-[10px] text-zinc-400 font-mono">Tamaño dinámico en tiempo real</span>
            </div>

            <div className="w-full overflow-x-auto rounded-xl border border-zinc-800">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead className="bg-zinc-900 text-zinc-400 font-mono">
                  <tr>
                    <th className="p-2.5">ID Pedido</th>
                    <th className="p-2.5">Cliente</th>
                    <th className="p-2.5">Producto</th>
                    <th className="p-2.5">Tipo de Masa</th>
                    <th className="p-2.5 text-center">Gramaje</th>
                    <th className="p-2.5 text-center">Desglose (Sol. + Seg. - Bodega)</th>
                    <th className="p-2.5 text-center">Entrega</th>
                    <th className="p-2.5">Modalidad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/60 font-mono text-zinc-300">
                  {pedidosPendientesCola.map((p) => (
                    <tr key={p.loteId} className="hover:bg-zinc-900/40">
                      <td className="p-2.5">
                        <div className="font-bold text-amber-400">{p.loteId}</div>
                        <div className="text-[10px] text-zinc-400 italic">Obs: {p.observaciones}</div>
                      </td>
                      <td className="p-2.5 font-sans">{p.cliente}</td>
                      <td className="p-2.5">{p.producto}</td>
                      <td className="p-2.5 text-zinc-400">{p.tipoMasa}</td>
                      <td className="p-2.5 text-center text-cyan-400">{p.gramajePiezaG}g</td>
                      <td className="p-2.5 text-center text-amber-400 font-bold">
                        {p.cantidadSolicitada} + {p.unidadesSeguridad} - {p.existenciaBodega} = {p.cantidadNetaFabricar} unids
                      </td>
                      <td className="p-2.5 text-zinc-400">{p.fechaEntrega}</td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.modalidad === "Urgente" 
                            ? "bg-red-500/20 text-red-400 border border-red-500/30" 
                            : "bg-zinc-800 text-zinc-400"
                        }`}>
                          {p.modalidad}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}