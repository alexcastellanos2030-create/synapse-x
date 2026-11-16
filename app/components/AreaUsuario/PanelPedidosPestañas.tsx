"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";

export interface PedidoRecepcionado {
  idPedido: string;
  clienteNombre: string;
  clienteRutCedula: string;
  clienteDireccion: string;
  clienteTelefono: string;
  fechaRecepcion: string;
  fechaEntrega: string;
  modalidad: "Normal" | "Urgente" | "Express";
  lineasPedido: Array<{
    producto: string;
    tipoMasa: string;
    gramajePiezaG: number;
    cantidadSolicitada: number;
    unidadesSeguridad: number;
    cobertura: string;
    topping: string;
    observaciones: string;
  }>;
  responsableRegistro: string;
  nivelSeguridad: string;
}

export interface RecepcionPedidosProps {
  esSuperuser?: boolean;
}

interface ClienteRegistrado {
  id?: string;
  nombre: string;
  rut_cedula: string;
  telefono: string;
  direccion: string;
}

interface LineaPedidoSpec {
  id: string;
  producto: string;
  tipoMasa: string;
  gramajePiezaG: number;
  cantidadSolicitada: number;
  unidadesSeguridad: number;
  cobertura: string;
  topping: string;
  observaciones: string;
}

export default function RecepcionPedidosPage({ esSuperuser = true }: RecepcionPedidosProps) {
  // CATÁLOGOS DINÁMICOS EDITABLES POR EL SUPERUSER
  const [listaClientesBD, setListaClientesBD] = useState<ClienteRegistrado[]>([]);
  const [listaClientes, setListaClientes] = useState<string[]>([
    "Distribuidora Comercial Salam",
    "Minimarket Central",
    "Cafetería Gourmet Express",
  ]);

  const [listaProductos, setListaProductos] = useState<string[]>([
    "Pan B11 Brioche",
    "Pan Pita 13cm",
    "Pan de Molde Blanco",
    "Pan Frica 13cm",
    "Croissant Láctico",
    "Pan Cook",
  ]);

  const [listaRecetas, setListaRecetas] = useState<string[]>([
    "Masa Brioche Tradicional",
    "Masa Pita Clásica",
    "Masa Pan Molde",
    "Masa Hojaldre Croissant",
  ]);

  const [listaCoberturas, setListaCoberturas] = useState<string[]>([
    "Huevo Batido",
    "Ninguna",
    "Mantequilla Derretida",
    "Brillo Comercial",
  ]);

  const [listaToppings, setListaToppings] = useState<string[]>([
    "Sésamo Blanco",
    "Sin Topping",
    "Sésamo Negro",
    "Mix Semillas",
  ]);

  // CARGAR CLIENTES DE SUPABASE AL INICIAR
  useEffect(() => {
    async function cargarClientes() {
      try {
        const { data, error } = await supabase.from("clientes").select("*");
        if (!error && data && data.length > 0) {
          setListaClientesBD(data as ClienteRegistrado[]);
          const nombres = data.map((c: any) => c.nombre);
          setListaClientes(Array.from(new Set([...listaClientes, ...nombres])));
        }
      } catch (err) {
        console.error("Error al cargar clientes de Supabase:", err);
      }
    }
    cargarClientes();
  }, []);

  // ESTADOS DEL FORMULARIO
  const [clienteNombre, setClienteNombre] = useState<string>(listaClientes[0]);
  const [clienteRutCedula, setClienteRutCedula] = useState<string>("");
  const [clienteDireccion, setClienteDireccion] = useState<string>("");
  const [clienteTelefono, setClienteTelefono] = useState<string>("");
  const [fechaRecepcion, setFechaRecepcion] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );
  const [fechaEntrega, setFechaEntrega] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().slice(0, 16)
  );
  const [modalidad, setModalidad] = useState<"Normal" | "Urgente" | "Express">("Normal");

  // LÍNEAS DINÁMICAS DE ESPECIFICACIONES TÉCNICAS (EN LÍNEA)
  const [lineasPedido, setLineasPedido] = useState<LineaPedidoSpec[]>([
    {
      id: "1",
      producto: listaProductos[0],
      tipoMasa: listaRecetas[0],
      gramajePiezaG: 90,
      cantidadSolicitada: 200,
      unidadesSeguridad: 10,
      cobertura: listaCoberturas[0],
      topping: listaToppings[0],
      observaciones: "",
    },
  ]);

  // SEGURIDAD Y FIRMA
  const [nivelSeguridadPedido, setNivelSeguridadPedido] = useState<"ESTÁNDAR" | "SENSOR TIGHT" | "CRÍTICO">(
    "ESTÁNDAR"
  );
  const [cedulaResponsable, setCedulaResponsable] = useState<string>("");
  const [nombreResponsable, setNombreResponsable] = useState<string>(
    "Al ingresar su cédula, aquí se refleja automáticamente el nombre autorizando..."
  );

  // BUSCAR CLIENTE POR LUPA MEDIANTE RUT / CÉDULA
  const buscarClientePorRut = () => {
    const rutLimpio = clienteRutCedula.trim();
    if (!rutLimpio) {
      alert("⚠️ Ingrese un RUT o Cédula para buscar.");
      return;
    }

    const encontrado = listaClientesBD.find(
      (c) => c.rut_cedula.toLowerCase() === rutLimpio.toLowerCase()
    );

    if (encontrado) {
      setClienteNombre(encontrado.nombre);
      setClienteTelefono(encontrado.telefono || "");
      setClienteDireccion(encontrado.direccion || "");
      alert(`✅ Cliente encontrado: ${encontrado.nombre}`);
    } else {
      alert("❌ Cliente no encontrado en la base de datos de Supabase.");
    }
  };

  // SELECCIONAR CLIENTE DESDE LA LISTA DESPLEGABLE
  const handleSeleccionarClienteLista = (nombre: string) => {
    setClienteNombre(nombre);
    const encontrado = listaClientesBD.find((c) => c.nombre === nombre);
    if (encontrado) {
      setClienteRutCedula(encontrado.rut_cedula || "");
      setClienteTelefono(encontrado.telefono || "");
      setClienteDireccion(encontrado.direccion || "");
    }
  };

  // FUNCIONES PARA AGREGAR NUEVAS LÍNEAS DE PEDIDO
  const agregarLineaPedido = () => {
    const nuevaLinea: LineaPedidoSpec = {
      id: Date.now().toString(),
      producto: listaProductos[0],
      tipoMasa: listaRecetas[0],
      gramajePiezaG: 90,
      cantidadSolicitada: 100,
      unidadesSeguridad: 5,
      cobertura: listaCoberturas[0],
      topping: listaToppings[0],
      observaciones: "",
    };
    setLineasPedido([...lineasPedido, nuevaLinea]);
  };

  const eliminarLineaPedido = (id: string) => {
    if (lineasPedido.length > 1) {
      setLineasPedido(lineasPedido.filter((item) => item.id !== id));
    }
  };

  const actualizarLineaPedido = (id: string, campo: keyof LineaPedidoSpec, valor: any) => {
    setLineasPedido(
      lineasPedido.map((linea) => (linea.id === id ? { ...linea, [campo]: valor } : linea))
    );
  };

  // FUNCIONES SUPERUSER PARA DIVERSIFICAR CATÁLOGOS EN TIEMPO REAL
  const agregarClienteNuevo = () => {
    const nuevo = prompt("👑 SUPERUSER: Nombre del nuevo cliente / empresa:");
    if (nuevo && nuevo.trim()) {
      setListaClientes((prev) => [...prev, nuevo.trim()]);
      setClienteNombre(nuevo.trim());
    }
  };

  const agregarProductoNuevo = () => {
    const nuevo = prompt("👑 SUPERUSER: Nombre del nuevo producto:");
    if (nuevo && nuevo.trim()) {
      setListaProductos((prev) => [...prev, nuevo.trim()]);
    }
  };

  const agregarRecetaNueva = () => {
    const nueva = prompt("👑 SUPERUSER: Nombre de la nueva receta base:");
    if (nueva && nueva.trim()) {
      setListaRecetas((prev) => [...prev, nueva.trim()]);
    }
  };

  const agregarCoberturaNueva = () => {
    const nueva = prompt("👑 SUPERUSER: Nombre de la nueva cobertura:");
    if (nueva && nueva.trim()) {
      setListaCoberturas((prev) => [...prev, nueva.trim()]);
    }
  };

  const agregarToppingNuevo = () => {
    const nuevo = prompt("👑 SUPERUSER: Nombre del nuevo topping:");
    if (nuevo && nuevo.trim()) {
      setListaToppings((prev) => [...prev, nuevo.trim()]);
    }
  };

  const manejarCedula = (val: string) => {
    const ced = val.replace(/\D/g, "");
    setCedulaResponsable(ced);
    if (ced === "87654321") {
      setNombreResponsable("Carolina Pérez (Área Administración)");
    } else if (ced === "10433935") {
      setNombreResponsable("Alexander Segundo Castellanos Perozo (Superuser)");
    } else if (ced.length >= 7) {
      setNombreResponsable(`Personal Autorizado ID ${ced}`);
    } else {
      setNombreResponsable(
        "Al ingresar su cédula, se refleja automáticamente el nombre autorizando..."
      );
    }
  };

  // ENVIAR PEDIDO OFICIAL Y RESTAURAR FORMATO INICIAL
  const enviarAProduccion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clienteNombre.trim()) {
      alert("⚠️ Seleccione o ingrese un cliente válido.");
      return;
    }
    if (!cedulaResponsable || nombreResponsable.includes("Al ingresar")) {
      alert("⚠️ Ingrese aquí su cédula para validar y firmar la recepción del pedido.");
      return;
    }

    const lineasValidas = lineasPedido.filter((l) => l.cantidadSolicitada > 0);
    if (lineasValidas.length === 0) {
      alert("❌ Debe completar al menos un producto con su cantidad correspondiente.");
      return;
    }

    const nuevoPedido: PedidoRecepcionado = {
      idPedido: `PED-${Date.now().toString().slice(-6)}`,
      clienteNombre,
      clienteRutCedula,
      clienteDireccion,
      clienteTelefono,
      fechaRecepcion,
      fechaEntrega,
      modalidad,
      lineasPedido: lineasValidas,
      responsableRegistro: nombreResponsable, // <--- Solo dejamos esta propiedad correcta
      nivelSeguridad: nivelSeguridadPedido,
    };

    try {
      await supabase.from("pedidos").insert([nuevoPedido]);
    } catch (err) {
      console.error("Error al guardar en Supabase:", err);
    }

    alert(
      `✅ PEDIDO REGISTRADO EXITOSAMENTE\n\nID: ${nuevoPedido.idPedido}\nCliente: ${nuevoPedido.clienteNombre}\nLíneas de Productos: ${lineasValidas.length}\nNivel Seguridad: ${nuevoPedido.nivelSeguridad}\n\nEl pedido ha sido enviado a la Cola de Producción.`
    );

    // RESTAURAR DATOS DEL CLIENTE Y DEJAR LÍNEAS DE PEDIDO EN BLANCO (1 sola línea)
    setClienteRutCedula("");
    setClienteDireccion("");
    setClienteTelefono("");
    setCedulaResponsable("");
    setNombreResponsable("Al ingresar su cédula, aquí se refleja automáticamente el nombre autorizando...");
    setLineasPedido([
      {
        id: Date.now().toString(),
        producto: listaProductos[0],
        tipoMasa: listaRecetas[0],
        gramajePiezaG: 90,
        cantidadSolicitada: 100,
        unidadesSeguridad: 5,
        cobertura: listaCoberturas[0],
        topping: listaToppings[0],
        observaciones: "",
      },
    ]);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-xs font-sans pb-12 text-white">
      
      {/* CABECERA */}
      <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex justify-between items-center shadow-lg">
        <div>
          <h2 className="text-base font-black text-amber-500 flex items-center gap-2 font-mono uppercase">
            📝 Portal de Recepción Administrativa de Pedidos
          </h2>
          <p className="text-zinc-400 text-[11px] mt-0.5">
            Ingreso oficial de pedidos del cliente por Área Administración | VISTA:{" "}
            <span className="text-emerald-400 font-bold uppercase">
              {esSuperuser ? "👑 SUPERUSER (Edición y Configuración Habilitada)" : "💼 ÁREA ADMINISTRACIÓN"}
            </span>
          </p>
        </div>
        <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-mono font-bold text-[11px] border border-emerald-500/30">
          ● Módulo Administrativo
        </span>
      </div>

      <form onSubmit={enviarAProduccion} className="space-y-6">
        
        {/* SECCIÓN 1: DATOS DEL CLIENTE CON LUPA Y LISTA DESPLEGABLE */}
        <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-4 shadow-xl">
          <div className="border-b border-zinc-800 pb-2 flex items-center justify-between text-amber-400 font-black text-xs uppercase tracking-wider font-mono">
            <span className="flex items-center gap-2">👤 1. DATOS DEL CLIENTE Y LOGÍSTICA</span>
            {esSuperuser && (
              <button
                type="button"
                onClick={agregarClienteNuevo}
                className="text-[10px] bg-amber-500 text-black font-black px-2.5 py-1 rounded-lg hover:bg-amber-400 transition-all cursor-pointer"
              >
                + Nuevo Cliente
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Opción A: Selección por lista desplegable */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-zinc-300">Cliente / Razón Social:</label>
              <select
                value={clienteNombre}
                onChange={(e) => handleSeleccionarClienteLista(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-xl p-2.5 text-white font-bold focus:outline-none focus:border-amber-500"
              >
                {listaClientes.map((c, idx) => (
                  <option key={idx} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Opción B: Búsqueda con Lupa por RUT / Cédula */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-zinc-300">RUT / Cédula del Cliente:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={clienteRutCedula}
                  onChange={(e) => setClienteRutCedula(e.target.value)}
                  placeholder="Ej: 12345678-9"
                  className="flex-1 bg-black border border-zinc-700 rounded-xl p-2.5 text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={buscarClientePorRut}
                  className="px-3.5 bg-amber-500 hover:bg-amber-400 text-black font-black text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center shadow-lg"
                  title="Buscar cliente por RUT"
                >
                  🔍
                </button>
              </div>
            </div>

            {/* Teléfono */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-zinc-300">Teléfono de Contacto:</label>
              <input
                type="text"
                value={clienteTelefono}
                onChange={(e) => setClienteTelefono(e.target.value)}
                placeholder="Teléfono"
                className="w-full bg-black border border-zinc-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div className="space-y-1 md:col-span-1">
              <label className="block text-[11px] font-bold text-zinc-300">Dirección de Despacho:</label>
              <input
                type="text"
                value={clienteDireccion}
                onChange={(e) => setClienteDireccion(e.target.value)}
                placeholder="Dirección completa de entrega"
                className="w-full bg-black border border-zinc-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-zinc-300">Fecha / Hora Recepción:</label>
              <input
                type="datetime-local"
                value={fechaRecepcion}
                onChange={(e) => setFechaRecepcion(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-xl p-2.5 text-zinc-200 font-mono focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-zinc-300">Fecha / Hora Entrega Requerida:</label>
              <input
                type="datetime-local"
                value={fechaEntrega}
                onChange={(e) => setFechaEntrega(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-xl p-2.5 text-amber-300 font-mono font-bold focus:outline-none"
              />
            </div>
          </div>

          {/* Modalidad */}
          <div className="space-y-1 pt-1">
            <label className="block text-[11px] font-bold text-zinc-300">Modalidad / Prioridad Comercial:</label>
            <div className="grid grid-cols-3 gap-2">
              {(["Normal", "Urgente", "Express"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setModalidad(m)}
                  className={`py-2 rounded-xl font-bold transition-all border cursor-pointer ${
                    modalidad === m
                      ? m === "Express"
                        ? "bg-rose-600 text-white border-rose-500"
                        : m === "Urgente"
                        ? "bg-orange-500 text-black border-orange-400"
                        : "bg-amber-500 text-black border-amber-400"
                      : "bg-black text-zinc-400 border-zinc-800 hover:bg-zinc-900"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SECCIÓN 2: ESPECIFICACIONES TÉCNICAS DEL PEDIDO (EN LÍNEA + MICROBOTÓN + OBSERVACIONES ABAJO) */}
        <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-4 shadow-xl">
          <div className="border-b border-zinc-800 pb-2 flex items-center justify-between text-amber-400 font-black text-xs uppercase tracking-wider font-mono">
            <span className="flex items-center gap-2">🥖 2. ESPECIFICACIONES TÉCNICAS DEL PEDIDO (MULTILÍNEA)</span>
            <span className="text-[10px] text-zinc-400">Total líneas: {lineasPedido.length}</span>
          </div>

          <div className="space-y-4">
            {lineasPedido.map((linea, index) => (
              <div key={linea.id} className="p-4 bg-black/60 border border-zinc-800 rounded-2xl space-y-3">
                
                {/* FILA EN UNA SOLA LÍNEA HORIZONTAL CON MICROBOTÓN AL FINAL */}
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <span className="text-xs font-mono font-bold text-amber-500 w-6">
                    #{index + 1}
                  </span>

                  {/* Producto Solicitado */}
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] font-bold text-zinc-400">Producto:</label>
                      {esSuperuser && index === 0 && (
                        <button type="button" onClick={agregarProductoNuevo} className="text-[9px] text-amber-400 hover:underline">
                          + Producto
                        </button>
                      )}
                    </div>
                    <select
                      value={linea.producto}
                      onChange={(e) => actualizarLineaPedido(linea.id, "producto", e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-amber-300 font-bold focus:outline-none text-xs"
                    >
                      {listaProductos.map((p, idx) => (
                        <option key={idx} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  {/* Receta Base */}
                  <div className="w-full md:w-48">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] font-bold text-zinc-400">Receta Base:</label>
                      {esSuperuser && index === 0 && (
                        <button type="button" onClick={agregarRecetaNueva} className="text-[9px] text-amber-400 hover:underline">
                          + Receta
                        </button>
                      )}
                    </div>
                    <select
                      value={linea.tipoMasa}
                      onChange={(e) => actualizarLineaPedido(linea.id, "tipoMasa", e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-white font-bold focus:outline-none text-xs"
                    >
                      {listaRecetas.map((r, idx) => (
                        <option key={idx} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  {/* Gramaje (g) */}
                  <div className="w-full md:w-24">
                    <label className="block text-[10px] font-bold text-zinc-400 mb-1">Gramaje (g):</label>
                    <input
                      type="number"
                      value={linea.gramajePiezaG}
                      onChange={(e) => actualizarLineaPedido(linea.id, "gramajePiezaG", Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-emerald-400 font-mono font-bold focus:outline-none text-xs text-center"
                    />
                  </div>

                  {/* Cantidad Solicitada */}
                  <div className="w-full md:w-28">
                    <label className="block text-[10px] font-bold text-zinc-400 mb-1">Cantidad:</label>
                    <input
                      type="number"
                      value={linea.cantidadSolicitada}
                      onChange={(e) => actualizarLineaPedido(linea.id, "cantidadSolicitada", Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-amber-400 font-mono font-bold focus:outline-none text-xs text-center"
                    />
                  </div>

                  {/* Margen Seguridad */}
                  <div className="w-full md:w-24">
                    <label className="block text-[10px] font-bold text-zinc-400 mb-1">Seguridad:</label>
                    <input
                      type="number"
                      value={linea.unidadesSeguridad}
                      onChange={(e) => actualizarLineaPedido(linea.id, "unidadesSeguridad", Number(e.target.value))}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-2.5 text-cyan-400 font-mono font-bold focus:outline-none text-xs text-center"
                    />
                  </div>

                  {/* MICROBOTÓN NARANJA / BLANCO AL FINAL DE LA LÍNEA PARA AGREGAR NUEVO PEDIDO */}
                  <button
                    type="button"
                    onClick={agregarLineaPedido}
                    className="w-full md:w-auto px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-1 shrink-0 mt-4 md:mt-5"
                    title="Agregar otro pedido"
                  >
                    <span>+</span>
                    <span>Agregar Pedido</span>
                  </button>

                  {/* Eliminar línea */}
                  {lineasPedido.length > 1 && (
                    <button
                      type="button"
                      onClick={() => eliminarLineaPedido(linea.id)}
                      className="p-2.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-400 rounded-xl text-xs font-bold transition-all cursor-pointer mt-4 md:mt-5"
                      title="Eliminar línea"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* CAMPO DE OBSERVACIÓN UBICADO JUSTO DEBAJO DEL PRODUCTO SOLICITADO */}
                <div className="pl-0 md:pl-8 pt-1">
                  <input
                    type="text"
                    value={linea.observaciones}
                    onChange={(e) => actualizarLineaPedido(linea.id, "observaciones", e.target.value)}
                    placeholder="Observaciones de esta línea (ej: Horneado suave, empaque especial)"
                    className="w-full p-2 rounded-xl bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-300 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* SECCIÓN 3: FIRMA Y AUTORIZACIÓN REGISTRAL */}
        <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
              ✍️ FIRMA Y AUTORIZACIÓN REGISTRAL
            </span>

            {esSuperuser ? (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-amber-400 font-mono">🔒 Parámetro Seguridad:</span>
                <select
                  value={nivelSeguridadPedido}
                  onChange={(e: any) => setNivelSeguridadPedido(e.target.value)}
                  className="bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/40 rounded-lg px-2.5 py-1 focus:outline-none"
                >
                  <option value="ESTÁNDAR">ESTÁNDAR</option>
                  <option value="SENSOR TIGHT">SENSOR TIGHT (VIP)</option>
                  <option value="CRÍTICO">CRÍTICO (SUPERVISIÓN TOTAL)</option>
                </select>
              </div>
            ) : (
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                🔒 Nivel Seguridad: {nivelSeguridadPedido}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 mb-1">Cédula del Responsable:</label>
              <input
                type="text"
                required
                value={cedulaResponsable}
                onChange={(e) => manejarCedula(e.target.value)}
                placeholder="Ingrese aquí su cédula"
                className="w-full bg-black border border-zinc-700 rounded-xl px-3 py-2.5 text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 mb-1">Nombre Autorizado:</label>
              <div className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2.5 text-amber-400 font-bold text-xs truncate">
                {nombreResponsable}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>🚀</span> ENVIAR PEDIDO OFICIAL A COLA DE PRODUCCIÓN
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}