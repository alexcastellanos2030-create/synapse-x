"use client";

import React, { useState, useEffect } from "react";
import Estacion1, { LoteCreado, PedidoOperativo } from "./estaciones/estacion-1/page";
import Estacion2, { LotePesaje } from "./estaciones/estacion-2/page";
import { SUPERUSER_CREDENCIAL, generar30PedidosPrueba } from "@/data/bakeryConstants";
import TablaTrazabilidadEstandar from "@/components/TablaTrazabilidadEstandar";

// 🔍 MOLDE ÚNICO ESTANDARIZADO DE TRAZABILIDAD (10 COLUMNAS)
function TablaTrazabilidadEstandar({ pedidos, esClaro }: { pedidos: PedidoOperativo[]; esClaro: boolean }) {
  return (
    <div className={`overflow-x-auto max-h-60 rounded-lg border ${esClaro ? "border-slate-300 bg-white shadow-md" : "border-slate-800 bg-slate-950/80"}`}>
      <table className="w-full text-left text-[11px] border-collapse font-sans">
        <thead>
          <tr className={`${esClaro ? "bg-slate-200 text-slate-700 border-b border-slate-300" : "bg-slate-900 text-slate-400 border-b border-slate-800"} font-mono`}>
            <th className="p-2.5">1. ID Pedido / Obs</th>
            <th className="p-2.5">2. Cliente / Local / Tel</th>
            <th className="p-2.5">3. Producto</th>
            <th className="p-2.5">4. Tipo de Masa</th>
            <th className="p-2.5">5. Cobertura, Topping y Glaseado</th>
            <th className="p-2.5 text-center">6. Cant. Pedido</th>
            <th className="p-2.5 text-center">7. Seguridad</th>
            <th className="p-2.5 text-center">8. Bodega</th>
            <th className="p-2.5 text-center text-emerald-600 font-bold">9. Total a Fabricar</th>
            <th className="p-2.5 text-center text-amber-600 font-bold">10. Peso Masa (Kg)</th>
          </tr>
        </thead>
        <tbody className={`divide-y ${esClaro ? "divide-slate-200 text-slate-800" : "divide-slate-900 text-slate-300"} text-[11px]`}>
          {pedidos.map((p) => {
            const pesoMasaKg = ((p.cantidadNetaFabricar * p.gramajePiezaG) / 1000).toFixed(2);
            return (
              <tr key={p.loteId} className={`${esClaro ? "hover:bg-slate-100" : "hover:bg-slate-900/60"} transition-colors`}>
                <td className="p-2.5 font-mono">
                  <div className={`${esClaro ? "text-amber-700" : "text-amber-400"} font-bold`}>{p.loteId}</div>
                  <div className={`text-[9px] ${esClaro ? "text-amber-800 bg-amber-100 border-amber-300" : "text-amber-200 bg-amber-500/10 border-amber-500/20"} px-1.5 py-0.5 rounded mt-0.5 inline-block font-sans border`}>
                    {p.observaciones || "Sin observación"}
                  </div>
                </td>
                <td className={`p-2.5 font-semibold ${esClaro ? "text-slate-900" : "text-slate-100"}`}>
                  {p.cliente}
                </td>
                <td className={`p-2.5 ${esClaro ? "text-slate-800 font-medium" : "text-slate-200 font-medium"}`}>{p.producto}</td>
                <td className={`p-2.5 ${esClaro ? "text-slate-700" : "text-slate-300"}`}>{p.tipoMasa}</td>
                <td className={`p-2.5 font-mono text-[10px] ${esClaro ? "text-slate-700" : "text-slate-300"}`}>
                  {p.cobertura || "Estándar"} + {p.topping || "Sin Topping"} (Glaseado)
                </td>
                <td className="p-2.5 text-center font-mono">{p.cantidadSolicitada} uds</td>
                <td className={`p-2.5 text-center font-mono ${esClaro ? "text-slate-500" : "text-slate-400"}`}>{p.unidadesSeguridad}</td>
                <td className={`p-2.5 text-center font-mono ${esClaro ? "text-slate-500" : "text-slate-400"}`}>{p.existenciaBodega}</td>
                <td className={`p-2.5 text-center font-mono font-bold text-xs ${esClaro ? "text-emerald-700 bg-emerald-50" : "text-emerald-400 bg-emerald-950/20"}`}>
                  {p.cantidadNetaFabricar} uds
                </td>
                <td className={`p-2.5 text-center font-mono font-bold text-xs ${esClaro ? "text-amber-700 bg-amber-50" : "text-amber-400 bg-amber-950/20"}`}>
                  {pesoMasaKg} Kg
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

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

// 🍞 GENERADOR AUTOMÁTICO DE 30 PEDIDOS DE PRUEBA DIARIOS (REINICIABLES EN COLA)
const generar30PedidosPrueba = (): PedidoOperativo[] => {
  const productos = [
    { prod: "Pan B11 Brioche", masa: "Masa Brioche Tradicional", gr: 90 },
    { prod: "Pan Hallulla Especial", masa: "Masa Hallulla Hoja", gr: 85 },
    { prod: "Pan Marraqueta Crujiente", masa: "Masa Marraqueta Directa", gr: 100 },
    { prod: "Pan Amasado Casero", masa: "Masa Amasada Tradicional", gr: 110 },
    { prod: "Baguette Rústica", masa: "Masa Madre Rústica", gr: 250 },
    { prod: "Ciabatta de Oliva", masa: "Masa Alta Hidratación Ciabatta", gr: 120 },
    { prod: "Croissant Mantequilla", masa: "Masa Hojaldre Mantequilla", gr: 70 },
    { prod: "Pan Hamburgo Sésamo", masa: "Masa Brioche Hamburgo", gr: 95 }
  ];

  const coberturas = ["Huevo Batido", "Mantequilla Derretida", "Agua / Vapor", "Brillo Dulce", "Ninguna"];
  const toppings = ["Sésamo Blanco", "Sésamo Negro", "Semillas de Girasol", "Orégano", "Sin Topping"];

  return Array.from({ length: 30 }, (_, i) => {
    const p = productos[i % productos.length];
    const cant = Math.floor(Math.random() * 400) + 100;
    const seg = Math.floor(cant * 0.05);
    const bod = Math.floor(Math.random() * 20);
    const neta = cant + seg - bod;

    return {
      loteId: `PED-DIARIO-${(i + 1).toString().padStart(3, "0")}`,
      cliente: `Cliente Comercial #${i + 1} | Local Principal | Tel: +569${20000000 + i}`,
      producto: p.prod,
      tipoMasa: p.masa,
      gramajePiezaG: p.gr,
      cantidadSolicitada: cant,
      unidadesSeguridad: seg,
      existenciaBodega: bod,
      cantidadNetaFabricar: neta,
      modalidad: "Normal",
      fechaRecepcion: new Date().toLocaleDateString(),
      fechaEntrega: new Date().toLocaleDateString(),
      cobertura: coberturas[i % coberturas.length],
      topping: toppings[i % toppings.length],
      observacionBodega: "Verificado por protocolo",
      observaciones: `⚡ Pedido automático diario #${i + 1} (Reiniciable)`,
      responsableNombre: "Sistema Synapse-X OS",
      responsableCedula: "SYSTEM-DAILY",
      estado: "En Cola"
    };
  });
};

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

  const SUPERUSER_CREDENCIAL = {
    nombre: "Alexander Segundo Castellanos Perozo",
    cedula: "10433935",
    clavesValidas: ["*Paola123!", "*Ac12345!", "Iar661972", "Albani123", "Albany123"]
  };

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
        observaciones: `⚡ [${modalidadPedido}] ${item.observacionesProd || "Pedido múltiple"}`,
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
          observaciones: "⚡ [Normal] Lote de prueba principal (63 kg)",
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
            
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  1. Número de Cédula de Identidad:
                </label>
                <input
                  type="text"
                  value={inputCedula}
                  onChange={(e) => setInputCedula(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 text-xs text-amber-300 border border-slate-700 rounded-xl px-3.5 py-2.5 font-mono tracking-wider focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  2. Nombre Completo Registrado (Autodetectado):
                </label>
                <div className="w-full bg-slate-950 text-xs text-amber-400 font-bold border border-slate-800 rounded-xl px-3.5 py-2.5 flex items-center">
                  {nombreDetectado}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  {tipoPortalLogin === "superuser" ? "3. Clave Principal de Superuser:" : "3. Clave Personal Operativa:"}
                </label>
                <div className="relative">
                  <input
                    type={verClave ? "text" : "password"}
                    value={inputClave}
                    onChange={(e) => setInputClave(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900 text-xs text-slate-100 border border-slate-700 rounded-xl px-3.5 py-2.5 font-mono tracking-wider focus:outline-none focus:border-amber-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setVerClave(!verClave)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 text-sm cursor-pointer"
                  >
                    {verClave ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              {tipoPortalLogin === "superuser" && (
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    4. Clave de Doble Resguardo (Seguridad Industrial):
                  </label>
                  <div className="relative">
                    <input
                      type={verClave2 ? "text" : "password"}
                      value={inputClaveSecundaria}
                      onChange={(e) => setInputClaveSecundaria(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-900 text-xs text-slate-100 border border-slate-700 rounded-xl px-3.5 py-2.5 font-mono tracking-wider focus:outline-none focus:border-amber-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setVerClave2(!verClave2)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 text-sm cursor-pointer"
                    >
                      {verClave2 ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <span>🚀</span> INGRESAR AL SISTEMA INDUSTRIAL SYNAPSE-X
            </button>
          </form>

        </div>
      </div>
    );
  }

  // ==========================================
  // VISTA 2: APLICACIÓN PRINCIPAL (SYNAPSE-X OS)
  // ==========================================
  return (
    <div className={`min-h-screen flex ${esClaro ? "bg-slate-100 text-slate-900" : "bg-[#0b0f19] text-slate-100"} font-sans select-none overflow-hidden`}>
      
      {/* 📁 SIDEBAR LATERAL DE NAVEGACIÓN (RETRAÍBLE Y ULTRA COMPACTO) */}
      <aside className={`${
        sidebarRetraido ? "w-14" : "w-64"
      } border-r flex flex-col justify-between transition-all duration-300 z-30 ${
        esClaro ? "bg-white border-slate-300" : "bg-[#0e1422] border-slate-800"
      }`}>
        
        <div className="p-2.5 border-b border-slate-800 flex items-center justify-between">
          {!sidebarRetraido ? (
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="text-xl">🍞</span>
              <div className="truncate">
                <h2 className="text-xs font-black text-amber-400 uppercase tracking-widest truncate">SYNAPSE-X OS</h2>
                <p className="text-[9px] text-slate-400 font-mono truncate">Bakery Industrial</p>
              </div>
            </div>
          ) : (
            <div className="mx-auto text-xl">🍞</div>
          )}
          <button
            onClick={() => setSidebarRetraido(!sidebarRetraido)}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-amber-400 text-xs font-bold cursor-pointer mx-auto"
            title={sidebarRetraido ? "Expandir Sidebar" : "Retraer Sidebar"}
          >
            {sidebarRetraido ? "📂" : "📁"}
          </button>
        </div>

        {/* ACCESOS DE SUPERUSER (ALERTAS Y CREDENCIALES) */}
        {rolActivo === "superuser" && (
          <div className="p-2 border-b border-slate-800 space-y-1">
            <button
              onClick={() => {
                setVerGestionCredenciales(true);
                setVerPortalAlertas(false);
              }}
              className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                verGestionCredenciales ? "bg-amber-500 text-slate-950 font-black shadow-md" : "bg-slate-900/80 text-amber-400 hover:bg-slate-800"
              } ${sidebarRetraido ? "justify-center px-0" : ""}`}
              title="Gestión de Credenciales"
            >
              <span>🪪</span> {!sidebarRetraido && "Gestión de Credenciales"}
            </button>

            <button
              onClick={() => {
                setVerPortalAlertas(true);
                setVerGestionCredenciales(false);
              }}
              className={`w-full p-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                verPortalAlertas ? "bg-red-500 text-white font-black shadow-md" : "bg-slate-900/80 text-red-400 hover:bg-slate-800"
              } ${sidebarRetraido ? "justify-center px-0" : ""}`}
              title="Alertas de Seguridad"
            >
              <span>🚨</span> {!sidebarRetraido && `Alertas (${alertasSistema.length})`}
            </button>
          </div>
        )}

        {/* LISTADO DE ESTACIONES */}
        <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
          {!sidebarRetraido ? (
            <div className="space-y-1">
              <div className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                Estaciones de Planta:
              </div>
              {estaciones.map((est) => {
                const activo = estacionActiva === est.id && !verGestionCredenciales && !verPortalAlertas;
                return (
                  <button
                    key={est.id}
                    onClick={() => {
                      setEstacionActiva(est.id);
                      setVerGestionCredenciales(false);
                      setVerPortalAlertas(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center gap-2.5 text-xs font-bold cursor-pointer ${
                      activo
                        ? "bg-amber-500 text-slate-950 shadow-lg font-black"
                        : esClaro
                        ? "hover:bg-slate-200 text-slate-700"
                        : "hover:bg-slate-800 text-slate-300"
                    }`}
                  >
                    <span>{est.icon}</span>
                    <span className="truncate">{est.nombre}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2 pt-2">
              {estaciones.map((est) => {
                const activo = estacionActiva === est.id && !verGestionCredenciales && !verPortalAlertas;
                return (
                  <button
                    key={est.id}
                    onClick={() => {
                      setEstacionActiva(est.id);
                      setVerGestionCredenciales(false);
                      setVerPortalAlertas(false);
                    }}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all cursor-pointer ${
                      activo ? "bg-amber-500 text-slate-950 font-black shadow-lg" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                    title={est.nombre}
                  >
                    {est.icon}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* PIE DE SIDEBAR (TEMA Y CERRAR SESIÓN) */}
        <div className={`p-2 border-t ${esClaro ? "border-slate-200" : "border-slate-800"} flex flex-col gap-2`}>
          {!sidebarRetraido ? (
            <div className="flex items-center justify-between text-[11px] px-1">
              <span className={esClaro ? "text-slate-600 font-bold" : "text-slate-400 font-bold"}>Tema Visual:</span>
              <button
                onClick={() => setTemaVisual(esClaro ? "oscuro" : "claro")}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  esClaro ? "bg-slate-200 border-slate-300 text-slate-800" : "bg-slate-800 border-slate-700 text-amber-400"
                }`}
              >
                {esClaro ? "☀️ Claro" : "🌙 Oscuro"}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setTemaVisual(esClaro ? "oscuro" : "claro")}
              className="w-9 h-9 rounded-xl bg-slate-800 text-amber-400 text-xs flex items-center justify-center mx-auto"
              title="Cambiar Tema"
            >
              {esClaro ? "☀️" : "🌙"}
            </button>
          )}

          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                localStorage.removeItem("synapse_autenticado");
                localStorage.removeItem("synapse_rol");
              }
              setAutenticado(false);
              setRolActivo("superuser");
            }}
            className={`w-full py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              esClaro ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-red-950/50 text-red-400 hover:bg-red-900/60 border border-red-500/30"
            }`}
            title="Cerrar Sesión"
          >
            <span>🚪</span> {!sidebarRetraido && "CERRAR SESIÓN"}
          </button>
        </div>

      </aside>

      {/* 🖥️ CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        <header className={`px-4 sm:px-6 py-3.5 border-b flex items-center justify-between shadow-sm z-20 ${
          esClaro ? "bg-white border-slate-300" : "bg-[#111827] border-slate-800"
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-xl">🍞</span>
            <div>
              <h1 className={`text-xs sm:text-sm font-black uppercase tracking-wider truncate max-w-[200px] sm:max-w-none ${esClaro ? "text-slate-900" : "text-slate-100"}`}>
                {verGestionCredenciales
                  ? "Gestión de Credenciales (Protegidas)"
                  : verPortalAlertas
                  ? "Portal de Alertas y Bitácora"
                  : estacionActualObj.nombre}
              </h1>
              <p className={`text-[9px] sm:text-[10px] ${esClaro ? "text-slate-500" : "text-slate-400"} font-mono`}>
                Synapse-X OS Industrial — <span className="text-amber-500 font-bold">Control de Producción</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 ${
              esClaro ? "bg-slate-100 border-slate-300 text-slate-700" : "bg-slate-900 border-slate-800 text-amber-400"
            }`}>
              <span>⏱️</span> {formatearTiempo(segundosTranscurridos)}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          
          {/* MÓDULO DE GESTIÓN Y CREDENCIALES */}
          {rolActivo === "superuser" && verGestionCredenciales && (
            <div className="max-w-5xl mx-auto space-y-6">
              
              <div className={`p-6 rounded-3xl border shadow-xl ${esClaro ? "bg-white border-slate-300" : "bg-[#151c2e] border-slate-800"}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-amber-500 uppercase tracking-wider flex items-center gap-2">
                    <span>🪪</span> Credencial de Acceso y Búsqueda
                  </h3>
                  <span className={`text-[10px] font-mono px-3 py-1 rounded-xl font-bold uppercase border ${
                    modoEdicionForm ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" : "bg-sky-500/20 text-sky-300 border-sky-500/40"
                  }`}>
                    {modoEdicionForm ? "✍️ MODO EDICIÓN HABILITADO" : "👁️ MODO LECTURA (SOLO VER)"}
                  </span>
                </div>

                <form onSubmit={handleGuardarOUpdateUsuario} className="space-y-5">
                  <fieldset disabled={!modoEdicionForm} className="grid grid-cols-1 md:grid-cols-2 gap-4 disabled:opacity-75">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Nombre Completo:</label>
                      <input
                        type="text"
                        value={nuevoNombre}
                        onChange={(e) => setNuevoNombre(e.target.value)}
                        placeholder="••••••••••••••••"
                        className="w-full bg-slate-900 text-xs text-amber-300 border border-slate-700 rounded-xl px-3.5 py-2.5 font-mono disabled:cursor-not-allowed"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Número de Cédula:</label>
                      <input
                        type="text"
                        value={nuevoCedula}
                        onChange={(e) => setNuevoCedula(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-900 text-xs text-amber-300 border border-slate-700 rounded-xl px-3.5 py-2.5 font-mono disabled:cursor-not-allowed"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Clave Secreta Asignada:</label>
                      <input
                        type="text"
                        value={nuevoClave}
                        onChange={(e) => setNuevoClave(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-900 text-xs text-amber-300 border border-slate-700 rounded-xl px-3.5 py-2.5 font-mono disabled:cursor-not-allowed"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Tipo de Operario / Rol:</label>
                      <select
                        value={nuevoRol}
                        onChange={(e) => setNuevoRol(e.target.value as "admin" | "operario")}
                        className="w-full bg-slate-900 text-xs text-amber-300 border border-slate-700 rounded-xl px-3.5 py-2.5 font-mono disabled:cursor-not-allowed"
                      >
                        <option value="operario">Operario de Planta</option>
                        <option value="admin">Administrativo / Supervisor</option>
                      </select>
                    </div>
                  </fieldset>

                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider px-2">
                      🛠️ BOTONERA TÁCTICA:
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleBuscarCredencialPorCedula}
                        className="p-2.5 bg-blue-950/40 text-blue-400 border border-blue-500/30 hover:bg-blue-900/60 rounded-xl text-base font-black transition-all cursor-pointer shadow"
                        title="Buscar credencial por Cédula"
                      >
                        🔍
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setModoEdicionForm(false);
                          limpiarFormularioCredencial();
                        }}
                        className={`p-2.5 rounded-xl border text-base font-black transition-all cursor-pointer ${
                          !modoEdicionForm ? "bg-sky-500 text-slate-950 border-sky-400 shadow-lg scale-105" : "bg-sky-950/40 text-sky-400 border-sky-500/30 hover:bg-sky-900/60"
                        }`}
                        title="Modo Solo Ver"
                      >
                        👁️
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (usuariosAutorizados.length > 0 && !cedulaEnEdicion) {
                            handleCargarParaEdicion(usuariosAutorizados[0]);
                          } else {
                            setModoEdicionForm(true);
                          }
                        }}
                        className={`p-2.5 rounded-xl border text-base font-black transition-all cursor-pointer ${
                          modoEdicionForm ? "bg-amber-500 text-slate-950 border-amber-400 shadow-lg scale-105" : "bg-amber-950/40 text-amber-400 border-amber-500/30 hover:bg-amber-900/60"
                        }`}
                        title="Modo Editar"
                      >
                        ✍️
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          limpiarFormularioCredencial();
                          setModoEdicionForm(true);
                        }}
                        className="p-2.5 bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-900/60 rounded-xl text-base font-black transition-all cursor-pointer"
                        title="Crear Nuevo Usuario"
                      >
                        ➕
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (cedulaEnEdicion) handleEliminarUsuario(cedulaEnEdicion);
                          else alert("Cargue o seleccione un usuario para eliminar.");
                        }}
                        className="p-2.5 bg-red-950/40 text-red-400 border border-red-500/30 hover:bg-red-900/60 rounded-xl text-base font-black transition-all cursor-pointer"
                        title="Eliminar Credencial"
                      >
                        🗑️
                      </button>

                      <button
                        type="button"
                        onClick={handleDescargarCredenciales}
                        className="p-2.5 bg-purple-950/40 text-purple-400 border border-purple-500/30 hover:bg-purple-900/60 rounded-xl text-base font-black transition-all cursor-pointer"
                        title="Descargar JSON"
                      >
                        📥
                      </button>

                      <button
                        type="button"
                        onClick={handleImprimirCredenciales}
                        className="p-2.5 bg-slate-800 text-amber-300 border border-slate-700 hover:bg-slate-700 rounded-xl text-base font-black transition-all cursor-pointer"
                        title="Imprimir Credenciales"
                      >
                        🖨️
                      </button>
                    </div>
                  </div>

                  {modoEdicionForm && (
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all uppercase tracking-wider cursor-pointer animate-pulse"
                    >
                      💾 {cedulaEnEdicion ? "GUARDAR CAMBIOS Y VOLVER A MODO SOLO VER" : "REGISTRAR Y VOLVER A MODO SOLO VER"}
                    </button>
                  )}
                </form>
              </div>

              {/* LISTA DE PERSONAL */}
              <div className={`p-6 rounded-3xl border shadow-xl space-y-4 transition-all duration-300 ${esClaro ? "bg-white border-slate-300" : "bg-[#151c2e] border-slate-800"}`}>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-black text-slate-200 uppercase tracking-wider">
                    Personal Autorizado Registrado ({usuariosAutorizados.length})
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Protegido contra borrados automáticos
                  </span>
                </div>

                {usuariosAutorizados.some((u) => u.bloqueado) && (
                  <div className="bg-red-950/60 border border-red-500/60 rounded-2xl p-4 space-y-2 transition-all duration-500">
                    <div className="text-xs font-black text-red-400 uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-2">🚨 USUARIOS BLOQUEADOS Y SUSPENDIDOS</span>
                      <span className="bg-red-500 text-white font-mono text-[10px] px-2 py-0.5 rounded-full">
                        {usuariosAutorizados.filter((u) => u.bloqueado).length}
                      </span>
                    </div>

                    <div className="space-y-1.5 font-mono text-xs">
                      {usuariosAutorizados
                        .filter((u) => u.bloqueado)
                        .map((u) => (
                          <div key={u.cedula} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-red-900/40 p-2.5 rounded-xl text-red-200 border border-red-500/30 gap-2">
                            <div>
                              <span className="font-bold text-white">{u.nombre}</span> — Cédula: <span className="text-amber-300">{u.cedula}</span>
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                              <span className="text-[10px] text-red-300 italic">
                                Causa: {u.causaBloqueo || "Suspensión"}
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleEstadoBloqueoUsuario(u.cedula)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black rounded-lg transition-all cursor-pointer shadow"
                              >
                                🟢 Liberar
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {usuariosAutorizados.map((usr) => (
                    <div
                      key={usr.cedula}
                      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 border rounded-2xl transition-all gap-3 ${
                        usr.bloqueado
                          ? "bg-red-950/20 border-red-500/40"
                          : esClaro
                          ? "bg-slate-50 border-slate-200"
                          : "bg-slate-900/90 border-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleCargarParaEdicion(usr)}
                          className="text-slate-400 hover:text-amber-400 text-xs font-bold cursor-pointer"
                          title="Cargar para editar"
                        >
                          ✍️
                        </button>
                        <div>
                          <div className="font-bold text-xs text-amber-400">{usr.nombre}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Cédula: {usr.cedula}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
                            usr.rol === "admin"
                              ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                              : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                          }`}
                        >
                          {usr.rol === "admin" ? "Administración" : "Planta"}
                        </span>

                        <button
                          type="button"
                          onClick={() => toggleEstadoBloqueoUsuario(usr.cedula)}
                          className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all cursor-pointer flex items-center gap-1.5 ${
                            usr.bloqueado
                              ? "bg-red-600 text-white border-red-500 shadow-md animate-pulse"
                              : "bg-emerald-600/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-600/40"
                          }`}
                        >
                          <span>{usr.bloqueado ? "🔴" : "🟢"}</span>
                          <span>{usr.bloqueado ? "BLOQUEADO" : "ACTIVADO"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleEliminarUsuario(usr.cedula)}
                          className="text-red-400 hover:text-red-300 p-1 text-xs cursor-pointer ml-1"
                          title="Eliminar"
                        >
                          ❌
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* MÓDULO DE ALERTAS */}
          {rolActivo === "superuser" && verPortalAlertas && (
            <div className="max-w-4xl mx-auto space-y-6">
              <h3 className="text-sm font-black text-red-500 uppercase tracking-wider flex items-center gap-2">
                <span>🚨</span> Historial de Alertas de Seguridad
              </h3>
              
              {alertasSistema.length === 0 ? (
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-400 font-mono text-center">
                  Sin alertas críticas activas.
                </div>
              ) : (
                alertasSistema.map((alerta) => (
                  <div key={alerta.id} className={`p-4 rounded-2xl border ${alerta.atendida ? "bg-slate-900/50 border-slate-800 opacity-70" : "bg-red-950/40 border-red-500/60 shadow-lg"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-red-400">{alerta.id} — {alerta.tipo}</span>
                      <span className="text-[10px] font-mono text-slate-400">{alerta.fechaHora}</span>
                    </div>
                    <p className="text-xs text-slate-200 mb-3">{alerta.mensaje}</p>
                  </div>
                ))
              )}

              <div className="p-5 bg-slate-950 border border-slate-800 rounded-3xl space-y-2">
                <div className="text-xs font-black text-amber-500 uppercase tracking-wider flex items-center gap-2">
                  <span>📜</span> Bitácora Interna de Eventos:
                </div>
                <div className="max-h-48 overflow-y-auto space-y-1 font-mono text-[10px] text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  {bitacoraOculta.map((log, idx) => (
                    <div key={idx}>{log}</div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 📝 ESTACIÓN 0: HOJA DE REGISTRO DE NUEVOS PEDIDOS */}
          {!verGestionCredenciales && !verPortalAlertas && estacionActiva === 0 && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl ${esClaro ? "bg-white border-slate-300" : "bg-[#151c2e] border-slate-800"}`}>
                
                <div className="border-b border-slate-700/60 pb-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-amber-500 flex items-center gap-2">
                      <span>📝</span> Hoja de Registro de Nuevos Pedidos
                    </h2>
                    <p className="text-xs text-slate-400 font-mono">
                      Información del cliente/local y especificaciones de panificación del pedido.
                    </p>
                  </div>

                  {/* 🔍 LUPA DE RECUPERACIÓN / CONSULTA */}
                  <button
                    type="button"
                    onClick={handleBuscarPedidoPorCedulaOId}
                    className="px-3.5 py-2 bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 border border-blue-500/40 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 cursor-pointer shadow"
                    title="Buscar pedido por Cédula o ID"
                  >
                    <span>🔍</span> BUSCAR / RECUPERAR PEDIDO
                  </button>
                </div>

                <form onSubmit={handleRegistrarPedidoCompletoAdmin} className="space-y-6">
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* CONTENEDOR IZQUIERDO: DATOS DEL CLIENTE / LOCAL */}
                    <div className={`p-5 rounded-2xl border space-y-4 ${esClaro ? "bg-slate-50 border-slate-200" : "bg-slate-900/80 border-slate-800"}`}>
                      <div className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                        <span>👤</span> Datos del Cliente
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Nombre del Cliente o Local:
                        </label>
                        <input
                          type="text"
                          value={clienteNombre}
                          onChange={(e) => setClienteNombre(e.target.value)}
                          placeholder="Ej: Panadería Central / Supermercado Los Pinos"
                          className="w-full bg-slate-950 text-xs text-amber-300 border border-slate-700 rounded-xl px-3.5 py-2.5 font-mono focus:outline-none focus:border-amber-500"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Dirección / Local:
                          </label>
                          <input
                            type="text"
                            value={clienteDireccion}
                            onChange={(e) => setClienteDireccion(e.target.value)}
                            placeholder="Ej: Av. Principal #123"
                            className="w-full bg-slate-950 text-xs text-amber-300 border border-slate-700 rounded-xl px-3.5 py-2.5 font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Teléfono:
                          </label>
                          <input
                            type="text"
                            value={clienteTelefono}
                            onChange={(e) => setClienteTelefono(e.target.value)}
                            placeholder="Ej: +56911223344"
                            className="w-full bg-slate-950 text-xs text-amber-300 border border-slate-700 rounded-xl px-3.5 py-2.5 font-mono"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Fecha y Hora de Recepción:
                          </label>
                          <input
                            type="datetime-local"
                            value={fechaRecepcion}
                            onChange={(e) => setFechaRecepcion(e.target.value)}
                            className="w-full bg-slate-950 text-xs text-amber-300 border border-slate-700 rounded-xl px-3 py-2 font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Fecha y Hora de Entrega:
                          </label>
                          <input
                            type="datetime-local"
                            value={fechaEntrega}
                            onChange={(e) => setFechaEntrega(e.target.value)}
                            className="w-full bg-slate-950 text-xs text-amber-300 border border-slate-700 rounded-xl px-3 py-2 font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Modalidad de Pedido:
                        </label>
                        <select
                          value={modalidadPedido}
                          onChange={(e) => setModalidadPedido(e.target.value)}
                          className="w-full bg-slate-950 text-xs text-amber-300 border border-slate-700 rounded-xl px-3.5 py-2.5 font-mono"
                        >
                          <option value="Normal">Pedido Normal</option>
                          <option value="Urgente">Pedido Urgente</option>
                          <option value="Programado">Pedido Programado</option>
                        </select>
                      </div>
                    </div>

                    {/* CONTENEDOR DERECHO: DATOS DEL PRODUCTO */}
                    <div className={`p-5 rounded-2xl border space-y-4 flex flex-col justify-between ${esClaro ? "bg-slate-50 border-slate-200" : "bg-slate-900/80 border-slate-800"}`}>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                            <span>🥖</span> Tipo de Producto / Pedido
                          </span>
                          <span className="text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-lg">
                            Ítem #{listaProductosTemp.length + 1}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                              Seleccione Producto:
                            </label>
                            <select
                              value={prodSeleccionado}
                              onChange={(e) => setProdSeleccionado(e.target.value)}
                              className="w-full bg-slate-950 text-xs text-amber-300 border border-slate-700 rounded-xl px-3.5 py-2.5 font-mono"
                            >
                              <option value="Pan B11 Brioche">Pan B11 Brioche</option>
                              <option value="Pan Hallulla Especial">Pan Hallulla Especial</option>
                              <option value="Pan Marraqueta Crujiente">Pan Marraqueta Crujiente</option>
                              <option value="Pan Amasado Casero">Pan Amasado Casero</option>
                              <option value="Baguette Rústica">Baguette Rústica</option>
                              <option value="Ciabatta de Oliva">Ciabatta de Oliva</option>
                              <option value="Pan Hamburgo Sésamo">Pan Hamburgo Sésamo</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                              Cantidad (Unidades / Bultos):
                            </label>
                            <input
                              type="number"
                              value={cantidad}
                              onChange={(e) => setCantidad(Number(e.target.value))}
                              placeholder="Ej: 100"
                              className="w-full bg-slate-950 text-xs text-amber-300 border border-slate-700 rounded-xl px-3.5 py-2.5 font-mono"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                              Tipo de Masa:
                            </label>
                            <input
                              type="text"
                              value={tipoMasa}
                              onChange={(e) => setTipoMasa(e.target.value)}
                              placeholder="Ej: Brioche Tradicional"
                              className="w-full bg-slate-950 text-xs text-amber-300 border border-slate-700 rounded-xl px-3 py-2 font-mono"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                              Gramaje Pieza (g):
                            </label>
                            <input
                              type="number"
                              value={gramajeG}
                              onChange={(e) => setGramajeG(Number(e.target.value))}
                              placeholder="90"
                              className="w-full bg-slate-950 text-xs text-amber-300 border border-slate-700 rounded-xl px-3 py-2 font-mono"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                              Cobertura:
                            </label>
                            <input
                              type="text"
                              value={cobertura}
                              onChange={(e) => setCobertura(e.target.value)}
                              placeholder="Ej: Huevo Batido"
                              className="w-full bg-slate-950 text-xs text-amber-300 border border-slate-700 rounded-xl px-3 py-2 font-mono"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                              Topping:
                            </label>
                            <input
                              type="text"
                              value={topping}
                              onChange={(e) => setTopping(e.target.value)}
                              placeholder="Ej: Sésamo Blanco"
                              className="w-full bg-slate-950 text-xs text-amber-300 border border-slate-700 rounded-xl px-3 py-2 font-mono"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                              Observaciones del Producto:
                            </label>
                            <input
                              type="text"
                              value={obsProducto}
                              onChange={(e) => setObsProducto(e.target.value)}
                              placeholder="Ej: Lote especial sin sal"
                              className="w-full bg-slate-950 text-xs text-amber-300 border border-slate-700 rounded-xl px-3 py-2 font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      {/* ➕ BOTÓN MULTIPRODUCTO CON AVISO PARPADEANTE */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={handleAgregarProductoAlPedido}
                          className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 animate-bounce"
                        >
                          <span>➕</span> AGREGAR SIGUIENTE PRODUCTO AL PEDIDO (MULTIDETALLE)
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* LISTA TEMPORAL DE PRODUCTOS AGREGADOS AL PEDIDO */}
                  {listaProductosTemp.length > 0 && (
                    <div className={`p-5 rounded-2xl border space-y-3 ${esClaro ? "bg-slate-50 border-slate-200" : "bg-slate-900 border-slate-800"}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                          📋 Productos Agregados a este Pedido ({listaProductosTemp.length}):
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Listos para consolidación</span>
                      </div>

                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {listaProductosTemp.map((item) => (
                          <div key={item.idTemp} className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono">
                            <div>
                              <span className="text-amber-400 font-bold">{item.producto}</span> — 
                              <span className="text-slate-300"> {item.cantidadSolicitada} uds</span> 
                              <span className="text-slate-500"> ({item.gramajePiezaG}g)</span>
                              {item.observacionesProd && <div className="text-[10px] text-slate-400 italic">Obs: {item.observacionesProd}</div>}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleEliminarItemTemp(item.idTemp)}
                              className="px-2.5 py-1 bg-red-950/60 hover:bg-red-900 text-red-400 border border-red-500/40 rounded-lg text-xs font-bold cursor-pointer transition-all"
                            >
                              Eliminar
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* RESPONSABLE DINÁMICO Y BOTÓN DE REGISTRO */}
                  <div className={`p-5 rounded-2xl border space-y-4 ${esClaro ? "bg-slate-50 border-slate-200" : "bg-slate-900/80 border-slate-800"}`}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Cédula del Operario Responsable:
                        </label>
                        <input
                          type="text"
                          value={cedulaResponsableRegistro}
                          onChange={(e) => setCedulaResponsableRegistro(e.target.value)}
                          placeholder="Ingrese su cédula"
                          className="w-full bg-slate-950 text-xs text-amber-300 border border-slate-700 rounded-xl px-3.5 py-2.5 font-mono focus:outline-none focus:border-emerald-500"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Nombre Verificado (Dinámico):
                        </label>
                        <div className="w-full bg-slate-950 text-xs text-amber-400 font-bold border border-slate-800 rounded-xl px-3.5 py-2.5 flex items-center h-[38px] font-mono">
                          {nombreResponsableRegistro}
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
                    >
                      <span>🚀</span> REGISTRAR PEDIDO COMPLETO Y ENVIAR A ESTACIÓN 1
                    </button>
                  </div>

                </form>
              </div>
            </div>
          )}

          {/* ESTACIÓN 1: SELECCIÓN DE PEDIDOS */}
          {!verGestionCredenciales && !verPortalAlertas && estacionActiva === 1 && (
            <div className="space-y-6">
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${esClaro ? "bg-white border-slate-300" : "bg-slate-900 border-slate-800"}`}>
                <span className="text-xs font-bold text-amber-400 font-mono">
                  📌 Cola Operativa Diaria ({pedidosColaPrueba.length} Lotes Disponibles en Estación 1)
                </span>
                <button
                  onClick={() => setPedidosColaPrueba(generar30PedidosPrueba())}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow"
                >
                  🔄 Recargar / Generar 30 Pedidos Diarios
                </button>
              </div>
              <TablaTrazabilidadEstandar pedidos={pedidosColaPrueba} esClaro={esClaro} />
              <Estacion1 portal={rolActivo} onLoteCreado={handleLoteCreado} />
            </div>
          )}

          {/* ESTACIÓN 2: PESAJE DIGITAL DE INGREDIENTES */}
          {!verGestionCredenciales && !verPortalAlertas && estacionActiva === 2 && (
            <Estacion2 lotesActivos={lotesActivos} onLoteCompletado={handleLoteCompletadoPesaje} />
          )}

          {/* OTRAS ESTACIONES DE PLANTA (3 A 10) */}
          {!verGestionCredenciales && !verPortalAlertas && estacionActiva >= 3 && (
            <div className={`p-16 text-center rounded-3xl border space-y-4 max-w-2xl mx-auto my-12 ${esClaro ? "bg-white border-slate-300" : "bg-[#151c2e] border-slate-800 shadow-2xl"}`}>
              <div className="text-4xl animate-bounce">🛠️</div>
              <h3 className="text-lg font-black text-amber-400 uppercase tracking-wider">{estacionActualObj.nombre}</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                Módulo industrial activo bajo el protocolo de trazabilidad de planta. Sincronizado con el rol de acceso <span className="text-amber-300 uppercase font-bold">{rolActivo}</span>.
              </p>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}