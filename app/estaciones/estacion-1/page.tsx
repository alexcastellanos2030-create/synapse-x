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
  const [estacionActiva, setEstacionActiva] = useState<string | number>(1);
  const [amasadoraSeleccionada, setAmasadoraSeleccionada] = useState<string>("Seleccionar batidora");
  const [recetaSeleccionada, setRecetaSeleccionada] = useState<string>("Seleccionar tipo de masa");
  const [pedidosCola, setPedidosCola] = useState<PedidoOperativo[]>(generar60PedidosPrueba());
  const [pedidosSeleccionados, setPedidosSeleccionados] = useState<string[]>([]);
  const [acordeonDetalleAbierto, setAcordeonDetalleAbierto] = useState<boolean>(true);
  
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
            if (id === 20 || id === "SU20") {
              window.location.href = "/dashboard/dashboard-20";
            } else if (id === 21 || id === "SU21") {
              window.location.href = "/dashboard-21";
            } else if (id !== 99 && id !== "SU99") {
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
          estacionActiva={estacionActiva as number}
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

          {/* CONTENEDOR 2: SISTEMA DE CANDADOS Y BLOQUEO DE RUTA */}
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

          {/* CONTENEDOR DE PEDIDOS */}
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
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Ficha de Receta Escalada y Pesaje de Ingredientes
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Cálculo automático basado en el peso total de masa requerido ({pesoTotalLoteKg.toFixed(2)} Kg).
                </p>
              </div>
              {!paso3Completado && (
                <span className="text-[10px] font-mono text-red-400 font-bold">🔒 Candado Activo: Seleccione Pedidos</span>
              )}
            </div>

            <div className="w-full overflow-x-auto rounded-xl border border-zinc-800">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead className="bg-zinc-900 text-zinc-300">
                  <tr>
                    <th className="p-3">Ingrediente</th>
                    <th className="p-3 text-center">Base (g)</th>
                    <th className="p-3 text-center">% Panadero</th>
                    <th className="p-3 text-right text-amber-400">Cantidad Escalada (g)</th>
                    <th className="p-3 text-right text-emerald-400">Cantidad Escalada (Kg)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {!paso3Completado ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-red-400 font-bold italic">
                        🔒 Complete los pasos anteriores para calcular el pesaje de ingredientes.
                      </td>
                    </tr>
                  ) : (
                    ingredientesReceta.map((ing) => {
                      const gramosBase = typeof ing.gramosOriginal === "number" ? ing.gramosOriginal : 0;
                      const gramosEscalados = gramosBase * factorEscala;
                      const kgEscalados = gramosEscalados / 1000;

                      return (
                        <tr key={ing.id} className="hover:bg-zinc-900/40">
                          <td className="p-3 font-bold text-zinc-200">{ing.descripcion}</td>
                          <td className="p-3 text-center text-zinc-400">{ing.gramosOriginal !== "" ? ing.gramosOriginal : "—"}</td>
                          <td className="p-3 text-center text-cyan-400">{ing.porcentajePanadero !== "" ? `${ing.porcentajePanadero}%` : "—"}</td>
                          <td className="p-3 text-right font-bold text-amber-400">
                            {gramosBase > 0 ? gramosEscalados.toFixed(1) : "A criterio"}
                          </td>
                          <td className="p-3 text-right font-bold text-emerald-400">
                            {gramosBase > 0 ? kgEscalados.toFixed(3) : "—"}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* CONTENEDOR: VALIDACIÓN DE CÉDULA Y FIRMA DE OPERARIO (PASO 5) */}
          <div className={`bg-zinc-950 p-6 rounded-2xl border space-y-4 shadow-xl transition-all ${
            !paso4Completado ? "opacity-40 border-red-500/50 bg-red-950/10" : "border-zinc-800 opacity-100"
          }`}>
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Firma y Validación de Responsable (Paso 5)
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Ingrese su cédula para autorizar la creación del lote y habilitar el tránsito a Amasado.
                </p>
              </div>
              {!paso4Completado && (
                <span className="text-[10px] font-mono text-red-400 font-bold">🔒 Candado Activo</span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="space-y-1.5">
                <label className="text-zinc-300 text-xs font-bold block uppercase">
                  Cédula de Identidad del Operador:
                </label>
                <input
                  type="text"
                  placeholder="Ej. 10433935"
                  value={cedulaResponsable}
                  disabled={!paso4Completado}
                  onChange={(e) => manejarCedula(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border text-xs font-mono ${
                    !paso4Completado ? "bg-zinc-900 text-zinc-600 cursor-not-allowed border-zinc-800" : "bg-zinc-900 text-amber-400 border-zinc-800 focus:outline-none focus:border-amber-500 font-bold"
                  }`}
                />
              </div>

              <div className="bg-zinc-900 p-3.5 rounded-xl border border-zinc-800 space-y-1">
                <div className="text-[10px] text-zinc-400 uppercase">Responsable Validado:</div>
                <div className={`text-xs font-bold ${paso5Completado ? "text-emerald-400" : "text-zinc-400"}`}>
                  {nombreResponsable}
                </div>
              </div>
            </div>

            {/* BOTONERA DE ACCIÓN FINAL */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-zinc-900">
              <button
                type="button"
                onClick={registrarEnBitacora}
                disabled={!paso5Completado}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  !paso5Completado ? "bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed" : "bg-zinc-900 hover:bg-zinc-800 text-cyan-400 border border-cyan-500/40 cursor-pointer shadow"
                }`}
              >
                📝 Registrar en Bitácora
              </button>

              <button
                type="button"
                onClick={avanzarSiguienteEstacion}
                disabled={!paso5Completado}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  !paso5Completado ? "bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed" : "bg-amber-500 hover:bg-amber-400 text-black border border-amber-400 cursor-pointer shadow-lg shadow-amber-500/20"
                }`}
              >
                🚀 Avanzar a Estación 2 (Amasado) →
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}