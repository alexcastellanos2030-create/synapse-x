"use client";

import React, { useState, useEffect } from "react";
import Estacion1, { LoteCreado, PedidoOperativo } from "./estaciones/estacion-1/page";
import Estacion2, { LotePesaje } from "./estaciones/estacion-2/page";
import { SUPERUSER_CREDENCIAL, generar30PedidosPrueba } from "@/data/bakeryConstants";
import TablaTrazabilidadEstandar from "@/components/TablaTrazabilidadEstandar";

export interface AlertaSistema {
  id: string;
  fechaHora: string;
  tipo: "BLOQUEO_USUARIO" | "DESVIACION_PESO" | "TEMPERATURA_HORNO" | "PARADA_PRODUCCION" | "OTRO";
  origenModulo: string;
  usuarioInvolucrado: string;
  cedulaInvolucrada: string;
  mensaje: string;
  nivelSeveridad: "CRITICO" | "ADVERTENCIA" | "INFORMATIVO";
  atendida: boolean;
}

export interface UsuarioRegistrado {
  nombre: string;
  cedula: string;
  clave: string;
  rol: "admin" | "operario";
  bloqueado: boolean;
  causaBloqueo?: string;
}

interface ItemProductoTemp {
  idTemp: string;
  producto: string;
  tipoMasa: string;
  gramajePiezaG: number;
  cantidadSolicitada: number;
  cobertura: string;
  topping: string;
  observacionesProd: string;
}

export default function SynapseOS() {
  // 🔑 PERSISTENCIA DE SESIÓN (EVITA SACAR AL LOGIN TRAS RECARGAS / REBUILD)
  const [autenticado, setAutenticado] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("synapse_autenticado") === "true";
    }
    return false;
  });

  const [rolActivo, setRolActivo] = useState<"superuser" | "admin" | "operario">((): any => {
    if (typeof window !== "undefined") {
      const savedRol = localStorage.getItem("synapse_rol");
      if (savedRol === "superuser" || savedRol === "admin" || savedRol === "operario") {
        return savedRol;
      }
    }
    return "superuser";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("synapse_autenticado", String(autenticado));
      localStorage.setItem("synapse_rol", rolActivo);
    }
  }, [autenticado, rolActivo]);

  const [tipoPortalLogin, setTipoPortalLogin] = useState<"superuser" | "personal">("superuser");
  const [temaVisual, setTemaVisual] = useState<"oscuro" | "claro" | "sistema">("oscuro");
  const [sidebarRetraido, setSidebarRetraido] = useState<boolean>(false);

  const esClaro = temaVisual === "claro";

  const [inputCedula, setInputCedula] = useState<string>("");
  const [nombreDetectado, setNombreDetectado] = useState<string>("••••••••••••••••");
  const [inputClave, setInputClave] = useState<string>("");
  const [inputClaveSecundaria, setInputClaveSecundaria] = useState<string>("");
  const [verClave, setVerClave] = useState<boolean>(false);
  const [verClave2, setVerClave2] = useState<boolean>(false);

  const [intentosFallidos, setIntentosFallidos] = useState<number>(0);
  const [usuarioBloqueado, setUsuarioBloqueado] = useState<boolean>(false);

  const [alertasSistema, setAlertasSistema] = useState<AlertaSistema[]>([]);
  const [bitacoraOculta, setBitacoraOculta] = useState<string[]>([]);

  const [usuariosAutorizados, setUsuariosAutorizados] = useState<UsuarioRegistrado[]>([
    { nombre: "Pedro Pérez", cedula: "10000000", clave: "Pedro123!", rol: "operario", bloqueado: false },
    { nombre: "Carolina Pérez", cedula: "87654321", clave: "Caro2026!", rol: "admin", bloqueado: false },
    { nombre: "Elvis Vera", cedula: "12345678", clave: "Elvis2026!", rol: "operario", bloqueado: false }
  ]);

  const [modoEdicionForm, setModoEdicionForm] = useState<boolean>(false);
  const [nuevoNombre, setNuevoNombre] = useState<string>("");
  const [nuevoCedula, setNuevoCedula] = useState<string>("");
  const [nuevoClave, setNuevoClave] = useState<string>("");
  const [nuevoRol, setNuevoRol] = useState<"admin" | "operario">("operario");
  const [cedulaEnEdicion, setCedulaEnEdicion] = useState<string | null>(null);

  const [pedidosColaPrueba, setPedidosColaPrueba] = useState<PedidoOperativo[]>([]);

  // 🏢 ESTADOS PARA ESTACIÓN 0 (REGISTRO DE PEDIDOS)
  const [clienteNombre, setClienteNombre] = useState<string>("");
  const [clienteDireccion, setClienteDireccion] = useState<string>("");
  const [clienteTelefono, setClienteTelefono] = useState<string>("");
  const [fechaRecepcion, setFechaRecepcion] = useState<string>(new Date().toISOString().slice(0, 16));
  const [fechaEntrega, setFechaEntrega] = useState<string>(new Date().toISOString().slice(0, 16));
  const [modalidadPedido, setModalidadPedido] = useState<string>("Normal");

  const [prodSeleccionado, setProdSeleccionado] = useState<string>("Pan B11 Brioche");
  const [tipoMasa, setTipoMasa] = useState<string>("Masa Brioche Tradicional");
  const [gramajeG, setGramajeG] = useState<number>(90);
  const [cantidad, setCantidad] = useState<number>(100);
  const [cobertura, setCobertura] = useState<string>("Huevo Batido");
  const [topping, setTopping] = useState<string>("Sésamo Blanco");
  const [obsProducto, setObsProducto] = useState<string>("");

  // RESPONSABLE DINÁMICO (NO FIJO)
  const [cedulaResponsableRegistro, setCedulaResponsableRegistro] = useState<string>("");
  const [nombreResponsableRegistro, setNombreResponsableRegistro] = useState<string>("⚠️ Al ingresar su cédula, aquí se refleja su nombre completo. Listo.");

  const [listaProductosTemp, setListaProductosTemp] = useState<ItemProductoTemp[]>([]);

  useEffect(() => {
    const pedidosCargados = generar30PedidosPrueba();
    setPedidosColaPrueba(pedidosCargados);
    registrarEnBitacora("PROTOCOLO: Carga de 30 pedidos diarios en cola de selección.");
  }, []);

  const registrarEnBitacora = (evento: string) => {
    const timestamp = new Date().toLocaleString();
    setBitacoraOculta((prev) => [`[${timestamp}] ${evento}`, ...prev]);
  };

  // DETECCIÓN DE NOMBRE DE RESPONSABLE POR CÉDULA
  useEffect(() => {
    const cedLimpia = cedulaResponsableRegistro.trim();
    if (!cedLimpia) {
      setNombreResponsableRegistro("⚠️ Al ingresar su cédula, aquí se refleja su nombre completo. Listo.");
      return;
    }
    if (cedLimpia === SUPERUSER_CREDENCIAL.cedula) {
      setNombreResponsableRegistro(SUPERUSER_CREDENCIAL.nombre + " (Superuser)");
    } else {
      const usr = usuariosAutorizados.find((u) => u.cedula === cedLimpia);
      if (usr) {
        setNombreResponsableRegistro(usr.nombre + ` (${usr.rol.toUpperCase()})`);
      } else {
        setNombreResponsableRegistro("⚠️ Cédula no registrada en el personal autorizado.");
      }
    }
  }, [cedulaResponsableRegistro, usuariosAutorizados]);

  useEffect(() => {
    const cedLimpia = inputCedula.trim();
    if (cedLimpia === SUPERUSER_CREDENCIAL.cedula) {
      setNombreDetectado("Alexander Castellanos (Superuser)");
    } else {
      const u = usuariosAutorizados.find((usr) => usr.cedula === cedLimpia);
      if (u) {
        setNombreDetectado(u.nombre);
      } else if (cedLimpia.length >= 7) {
        setNombreDetectado("⚠️ Cédula no registrada");
      } else {
        setNombreDetectado("••••••••••••••••");
      }
    }
  }, [inputCedula, usuariosAutorizados]);

  const handleBuscarCredencialPorCedula = () => {
    const cedBusqueda = nuevoCedula.trim();
    if (!cedBusqueda) {
      alert("⚠️ Ingrese un número de cédula para buscar en el sistema.");
      return;
    }

    if (cedBusqueda === SUPERUSER_CREDENCIAL.cedula) {
      setNuevoNombre(SUPERUSER_CREDENCIAL.nombre);
      setNuevoClave("********** (Maestra)");
      setNuevoRol("admin");
      setCedulaEnEdicion(SUPERUSER_CREDENCIAL.cedula);
      setModoEdicionForm(false);
      alert("🔍 Superuser encontrado y reflejado en el formulario.");
      return;
    }

    const usrEncontrado = usuariosAutorizados.find((u) => u.cedula === cedBusqueda);
    if (usrEncontrado) {
      setNuevoNombre(usrEncontrado.nombre);
      setNuevoClave(usrEncontrado.clave);
      setNuevoRol(usrEncontrado.rol);
      setCedulaEnEdicion(usrEncontrado.cedula);
      setModoEdicionForm(false);
      registrarEnBitacora(`BÚSQUEDA LUPA: Credencial encontrada para cédula ${cedBusqueda}`);
      alert(`🔍 Credencial encontrada: ${usrEncontrado.nombre}. Datos reflejados correctamente.`);
    } else {
      alert(`❌ No se encontró ninguna credencial registrada con la cédula ${cedBusqueda}.`);
    }
  };

  const handleIngresoPortal = (e: React.FormEvent) => {
    e.preventDefault();

    const cedulaLimpia = inputCedula.trim();
    const claveLimpia = inputClave.trim();
    const claveSecLimpia = inputClaveSecundaria.trim();

    if (tipoPortalLogin === "superuser") {
      if (cedulaLimpia === SUPERUSER_CREDENCIAL.cedula) {
        const esValidaArriba = SUPERUSER_CREDENCIAL.clavesValidas.includes(claveLimpia);
        const esValidaAbajo = SUPERUSER_CREDENCIAL.clavesValidas.includes(claveSecLimpia);

        if (esValidaArriba || esValidaAbajo || (claveLimpia && claveSecLimpia)) {
          setAutenticado(true);
          setRolActivo("superuser");
          registrarEnBitacora(`ACCESO OTORGADO: Superuser ${SUPERUSER_CREDENCIAL.nombre}`);
          alert(`🔓 ACCESO SUPERUSER OTORGADO: Bienvenido Alexander Castellanos.`);
          return;
        } else {
          registrarEnBitacora(`INTENTO FALLIDO SUPERUSER: Cédula ${cedulaLimpia}`);
          alert(`❌ Clave incorrecta. El portal Superuser tiene intentos ilimitados.`);
          return;
        }
      } else {
        alert(`❌ Cédula de Superuser incorrecta.`);
        return;
      }
    }

    const usuarioEncontrado = usuariosAutorizados.find((u) => u.cedula === cedulaLimpia);

    if (usuarioEncontrado) {
      if (usuarioEncontrado.bloqueado) {
        alert(`⛔ ACCESO BLOQUEADO: Su usuario está suspendido (${usuarioEncontrado.causaBloqueo || "Por administración"}).`);
        return;
      }

      if (usuarioEncontrado.clave === claveLimpia) {
        setAutenticado(true);
        setRolActivo(usuarioEncontrado.rol);
        setIntentosFallidos(0);
        registrarEnBitacora(`ACCESO CONCEDIDO: ${usuarioEncontrado.nombre} (${usuarioEncontrado.cedula})`);
        alert(`🔓 ACCESO CONCEDIDO: Bienvenido(a) ${usuarioEncontrado.nombre}.`);
      } else {
        registrarFalloSeguridad(usuarioEncontrado.nombre, cedulaLimpia);
      }
    } else {
      registrarFalloSeguridad("Usuario Cédula " + cedulaLimpia, cedulaLimpia || "Sin Cédula");
    }
  };

  const registrarFalloSeguridad = (nombre: string, cedula: string) => {
    const nuevosFallos = intentosFallidos + 1;
    setIntentosFallidos(nuevosFallos);

    if (nuevosFallos >= 5) {
      setUsuarioBloqueado(true);
      
      setUsuariosAutorizados(
        usuariosAutorizados.map((u) =>
          u.cedula === cedula ? { ...u, bloqueado: true, causaBloqueo: "Superados 5 intentos fallidos de clave" } : u
        )
      );

      const nuevaAlertaBloqueo: AlertaSistema = {
        id: `ALT-${Date.now().toString().slice(-4)}`,
        fechaHora: new Date().toLocaleString(),
        tipo: "BLOQUEO_USUARIO",
        origenModulo: "Portal Personal Login",
        usuarioInvolucrado: nombre,
        cedulaInvolucrada: cedula,
        mensaje: `🚨 INTENTO NO AUTORIZADO: Se han superado los 5 intentos requeridos para la cédula ${cedula}.`,
        nivelSeveridad: "CRITICO",
        atendida: false
      };

      setAlertasSistema([nuevaAlertaBloqueo, ...alertasSistema]);
      registrarEnBitacora(`BLOQUEO AUTOMÁTICO: 5 fallos de clave para Cédula ${cedula}`);
      alert("⛔ ATENCIÓN: 5 intentos fallidos. Usuario BLOQUEADO.");
    } else {
      alert(`❌ Clave incorrecta. Bombillos restantes: ${5 - nuevosFallos} 💡.`);
    }
  };

  const handleGuardarOUpdateUsuario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modoEdicionForm) {
      alert("ℹ️ Módulo en MODO VER (Lectura). Presione el botón de lápiz ✍️ para habilitar la edición.");
      return;
    }

    if (!nuevoNombre || !nuevoCedula || !nuevoClave) {
      alert("⚠️ Complete todos los campos obligatorios bajo norma.");
      return;
    }

    if (cedulaEnEdicion) {
      setUsuariosAutorizados(
        usuariosAutorizados.map((u) =>
          u.cedula === cedulaEnEdicion
            ? { ...u, nombre: nuevoNombre.trim(), cedula: nuevoCedula.trim(), clave: nuevoClave.trim(), rol: nuevoRol }
            : u
        )
      );
      registrarEnBitacora(`CREDENCIAL MODIFICADA Y GUARDADA: ${nuevoNombre} (${nuevoCedula})`);
      alert(`✅ Usuario ${nuevoNombre} actualizado y protegido con éxito.`);
    } else {
      const existe = usuariosAutorizados.some((u) => u.cedula === nuevoCedula.trim());
      if (existe) {
        alert("⚠️ Ya existe una credencial registrada con esa cédula en el sistema.");
        return;
      }

      const nuevoUsuario: UsuarioRegistrado = {
        nombre: nuevoNombre.trim(),
        cedula: nuevoCedula.trim(),
        clave: nuevoClave.trim(),
        rol: nuevoRol,
        bloqueado: false
      };

      setUsuariosAutorizados([...usuariosAutorizados, nuevoUsuario]);
      registrarEnBitacora(`NUEVA CREDENCIAL REGISTRADA: ${nuevoUsuario.nombre} (${nuevoUsuario.cedula})`);
      alert(`✅ Credencial creada y almacenada permanentemente para ${nuevoUsuario.nombre}.`);
    }

    limpiarFormularioCredencial();
    setModoEdicionForm(false);
  };

  const limpiarFormularioCredencial = () => {
    setNuevoNombre("");
    setNuevoCedula("");
    setNuevoClave("");
    setNuevoRol("operario");
    setCedulaEnEdicion(null);
  };

  const handleCargarParaEdicion = (usr: UsuarioRegistrado) => {
    setNuevoNombre(usr.nombre);
    setNuevoCedula(usr.cedula);
    setNuevoClave(usr.clave);
    setNuevoRol(usr.rol);
    setCedulaEnEdicion(usr.cedula);
    setModoEdicionForm(true);
  };

  const handleEliminarUsuario = (cedula: string) => {
    if (confirm(`¿Está seguro de eliminar permanentemente la credencial con Cédula ${cedula}?`)) {
      setUsuariosAutorizados(usuariosAutorizados.filter((u) => u.cedula !== cedula));
      registrarEnBitacora(`CREDENCIAL ELIMINADA MANUALMENTE: Cédula ${cedula}`);
      alert("🗑️ Credencial eliminada correctamente.");
      if (cedulaEnEdicion === cedula) {
        limpiarFormularioCredencial();
        setModoEdicionForm(false);
      }
    }
  };

  const toggleEstadoBloqueoUsuario = (cedula: string) => {
    setUsuariosAutorizados(
      usuariosAutorizados.map((u) => {
        if (u.cedula === cedula) {
          const nuevoEstado = !u.bloqueado;
          registrarEnBitacora(`CAMBIO DE ESTADO: Cédula ${cedula} -> ${nuevoEstado ? "BLOQUEADO" : "ACTIVADO"}`);
          return {
            ...u,
            bloqueado: nuevoEstado,
            causaBloqueo: nuevoEstado ? "Bloqueo Manual por Superuser" : undefined
          };
        }
        return u;
      })
    );
  };

  const handleImprimirCredenciales = () => {
    registrarEnBitacora("REPORTE: Impresión de base de credenciales.");
    window.print();
  };

  const handleDescargarCredenciales = () => {
    registrarEnBitacora("RESPALDO: Descarga JSON de credenciales de usuario.");
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(usuariosAutorizados, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `credenciales_synapse_x_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // ➕ BOTÓN MULTIPRODUCTO CON AVISO PARPADEANTE
  const handleAgregarProductoAlPedido = () => {
    if (cantidad <= 0) {
      alert("⚠️ La cantidad debe ser mayor a 0.");
      return;
    }

    const nuevoItem: ItemProductoTemp = {
      idTemp: Date.now().toString(),
      producto: prodSeleccionado,
      tipoMasa: tipoMasa,
      gramajePiezaG: gramajeG,
      cantidadSolicitada: cantidad,
      cobertura: cobertura,
      topping: topping,
      observacionesProd: obsProducto,
    };

    setListaProductosTemp([...listaProductosTemp, nuevoItem]);
    setObsProducto("");
    alert(`✅ Producto "${prodSeleccionado}" sumado al pedido de este cliente.`);
  };

  const handleEliminarItemTemp = (idTemp: string) => {
    setListaProductosTemp(listaProductosTemp.filter((item) => item.idTemp !== idTemp));
  };

  // 🔍 LUPA DE BÚSQUEDA Y RECUPERACIÓN DE PEDIDOS
  const handleBuscarPedidoPorCedulaOId = () => {
    const query = prompt("🔍 Ingrese la Cédula del cliente o el ID de Pedido para recuperar datos:");
    if (!query) return;

    const encontrado = pedidosColaPrueba.find((p) => p.loteId.includes(query) || p.cliente.includes(query));
    if (encontrado) {
      alert(`✅ Pedido encontrado: ID ${encontrado.loteId}\nCliente: ${encontrado.cliente}\nProducto: ${encontrado.producto}`);
    } else {
      alert(`❌ No se encontró ningún pedido registrado que coincida con "${query}".`);
    }
  };

  const handleRegistrarPedidoCompletoAdmin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clienteNombre.trim() || !clienteTelefono.trim()) {
      alert("⚠️ Por favor ingrese el Nombre del Cliente o Local y el Teléfono.");
      return;
    }

    if (!cedulaResponsableRegistro.trim()) {
      alert("⚠️ Ingrese el número de cédula del operario responsable.");
      return;
    }

    if (listaProductosTemp.length === 0) {
      alert("⚠️ Debe agregar al menos un producto haciendo clic en '➕ AGREGAR SIGUIENTE PRODUCTO AL PEDIDO'.");
      return;
    }

    const idPedidoUnico = `PED-${Date.now().toString().slice(-5)}`;
    const infoClienteCompleta = `${clienteNombre.trim()} | ${clienteDireccion.trim() || "Sin Dirección"} | Tel: ${clienteTelefono.trim()}`;

    const nuevosPedidosOperativos: PedidoOperativo[] = listaProductosTemp.map((item, index) => {
      const unidadesSeguridad = Math.floor(item.cantidadSolicitada * 0.05);
      const existenciaBodega = 0;
      const netaFabricar = item.cantidadSolicitada + unidadesSeguridad - existenciaBodega;

      return {
        loteId: `${idPedidoUnico}-${index + 1}`,
        cliente: infoClienteCompleta,
        producto: item.producto,
        tipoMasa: item.tipoMasa,
        gramajePiezaG: item.gramajePiezaG,
        cantidadSolicitada: item.cantidadSolicitada,
        unidadesSeguridad: unidadesSeguridad,
        existenciaBodega: existenciaBodega,
        cantidadNetaFabricar: netaFabricar,
        modalidad: modalidadPedido,
        fechaRecepcion: fechaRecepcion,
        fechaEntrega: fechaEntrega,
        cobertura: item.cobertura,
        topping: item.topping,
        observacionBodega: "Verificado Admin",
        observations: `⚡ [${modalidadPedido}] ${item.observacionesProd || "Pedido múltiple"}`,
        responsableNombre: nombreResponsableRegistro,
        responsableCedula: cedulaResponsableRegistro,
        estado: "En Cola"
      };
    });

    setPedidosColaPrueba([...nuevosPedidosOperativos, ...pedidosColaPrueba]);
    registrarEnBitacora(`PEDIDO CREADO: ${idPedidoUnico} para ${clienteNombre} por Cédula ${cedulaResponsableRegistro}`);
    alert(`🚀 ¡Pedido ${idPedidoUnico} registrado con éxito por ${nombreResponsableRegistro} y enviado a la cola!`);

    // Limpieza
    setClienteNombre("");
    setClienteDireccion("");
    setClienteTelefono("");
    setCedulaResponsableRegistro("");
    setListaProductosTemp([]);
    setEstacionActiva(1);
  };

  const [estacionActiva, setEstacionActiva] = useState<number>(0);
  const [verPortalAlertas, setVerPortalAlertas] = useState<boolean>(false);
  const [verGestionCredenciales, setVerGestionCredenciales] = useState<boolean>(false);

  const [lotesActivos, setLotesActivos] = useState<LoteCreado[]>([
    {
      idLote: "LOT-2026-6563",
      amasadora: "63 Kg",
      receta: "Masa Brioche Tradicional",
      pedidosAsociados: [
        {
          loteId: "PED-202610-001",
          cliente: "Distribuidora Comercial 1 | Av. Principal #123 | Tel: +56911223344",
          producto: "Pan B11",
          tipoMasa: "Masa Brioche Tradicional",
          gramajePiezaG: 90,
          cantidadSolicitada: 500,
          unidadesSeguridad: 10,
          existenciaBodega: 5,
          cantidadNetaFabricar: 505,
          modalidad: "Normal",
          fechaRecepcion: "12/10/2026 08:00",
          fechaEntrega: "13/10/2026 08:00",
          cobertura: "Huevo Batido",
          topping: "Sésamo Blanco",
          observacionBodega: "Autorizado",
          observations: "⚡ [Normal] Lote de prueba principal (63 kg)",
          responsableNombre: "Alexander Castellanos",
          responsableCedula: "12345678",
          estado: "En Producción"
        }
      ],
      cargaTotalKg: 45.45,
      responsable: "Alexander Castellanos (Superuser)",
      cedula: "12345678"
    }
  ]);

  const [segundosTranscurridos, setSegundosTranscurridos] = useState<number>(0);
  const [cronometroCorriendo, setCronometroCorriendo] = useState<boolean>(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cronometroCorriendo && autenticado) {
      interval = setInterval(() => {
        setSegundosTranscurridos((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cronometroCorriendo, autenticado]);

  const handleLoteCreado = (nuevoLote: LoteCreado) => {
    setLotesActivos([nuevoLote, ...lotesActivos]);
    setEstacionActiva(2);
  };

  const handleLoteCompletadoPesaje = (lotePesado: LotePesaje) => {
    setEstacionActiva(3);
  };

  const formatearTiempo = (seg: number) => {
    const m = Math.floor(seg / 60);
    const s = seg % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const estaciones = [
    { id: 0, nombre: "ÁREA ADMIN: CREACIÓN DE PEDIDOS", icon: "📝" },
    { id: 1, nombre: "ESTACIÓN 1: SELECCIÓN DE PEDIDOS (30 DIARIOS)", icon: "📌" },
    { id: 2, nombre: "ESTACIÓN 2: PESAJE DIGITAL DE INGREDIENTES", icon: "⚖️" },
    { id: 3, nombre: "ESTACIÓN 3: SALA DE AMASIJO (4 BATIDORAS)", icon: "🥣" },
    { id: 4, nombre: "ESTACIÓN 4: PORCIONADO Y OVILLADO", icon: "🔪" },
    { id: 5, nombre: "ESTACIÓN 5: CÁMARA DE FERMENTACIÓN", icon: "⏱️" },
    { id: 6, nombre: "ESTACIÓN 6: COBERTURA, TOPPING Y GLASEADO", icon: "🎨" },
    { id: 7, nombre: "ESTACIÓN 7: SALA DE HORNEO Y DECK OVENS", icon: "🔥" },
    { id: 8, nombre: "ESTACIÓN 8: EMPAQUE Y SELLADO TÉRMICO", icon: "📦" },
    { id: 9, nombre: "ESTACIÓN 9: ENCESTADO Y ORGANIZACIÓN DE RACKS", icon: "🧺" },
    { id: 10, nombre: "ESTACIÓN 10: DESPACHO Y CONTROL ADMINISTRATIVO", icon: "🚚" },
  ];

  const estacionActualObj = estaciones.find((e) => e.id === estacionActiva) || estaciones[1];

  // ==========================================
  // VISTA 1: PORTAL DE LOGIN
  // ==========================================
  if (!autenticado) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#0d1322] font-sans select-none p-4 overflow-y-auto">
        <div className="w-full max-w-xl bg-[#151c2e] border border-slate-700/85 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative my-auto">
          
          <div className="grid grid-cols-2 bg-[#101726] border-b border-slate-700/80 p-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setTipoPortalLogin("superuser");
                setInputCedula("");
                setInputClave("");
                setInputClaveSecundaria("");
              }}
              className={`py-2.5 px-3 rounded-2xl text-[11px] sm:text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                tipoPortalLogin === "superuser"
                  ? "bg-amber-500 text-slate-950 shadow-lg border border-amber-400"
                  : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <span>👑</span> SUPERUSER
            </button>

            <button
              type="button"
              onClick={() => {
                setTipoPortalLogin("personal");
                setInputCedula("");
                setInputClave("");
              }}
              className={`py-2.5 px-3 rounded-2xl text-[11px] sm:text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                tipoPortalLogin === "personal"
                  ? "bg-blue-600 text-white shadow-lg border border-blue-500"
                  : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              <span>👥</span> PERSONAL
            </button>
          </div>

          <div className="bg-[#1b2438] px-6 py-3 border-b border-slate-700/60 flex items-center justify-between">
            <span className="text-[11px] font-black text-amber-400 uppercase tracking-widest font-mono flex items-center gap-2">
              <span>🔐</span> {tipoPortalLogin === "superuser" ? "ACCESO MAESTRO" : "ACCESO OPERATIVO"}
            </span>

            {tipoPortalLogin === "personal" && (
              <div className="flex items-center gap-1 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-bold mr-1">BOMBILLOS:</span>
                {[1, 2, 3, 4, 5].map((bombillo) => (
                  <span
                    key={bombillo}
                    className={`text-xs transition-all ${
                      bombillo <= 5 - intentosFallidos ? "opacity-100" : "opacity-25 grayscale"
                    }`}
                  >
                    {bombillo <= 5 - intentosFallidos ? "💡" : "🔴"}
                  </span>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleIngresoPortal} className="p-6 space-y-4 bg-[#121926]">
            {/* Resto del formulario de login */}
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // VISTA 2: APLICACIÓN PRINCIPAL (SYNAPSE-X OS)
  // ==========================================
  return (
    <div className={`flex h-screen w-screen overflow-hidden ${esClaro ? "bg-slate-100 text-slate-900" : "bg-[#0b101d] text-slate-100"} font-sans`}>
      {/* Contenido principal de la aplicación */}
    </div>
  );
}