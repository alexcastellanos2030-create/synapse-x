"use client";

"use client";

import React, { useState, useEffect } from "react";
import Estacion1, { LoteCreado, PedidoOperativo } from "./estaciones/estacion-1/page";
import Estacion2, { LotePesaje } from "./estaciones/estacion-2/page";
import { SUPERUSER_CREDENCIAL, generar30PedidosPrueba } from "./data/bakeryConstants";
import TablaTrazabilidadEstandar from "./components/TablaTrazabilidadEstandar";
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

  const [cedulaResponsableRegistro, setCedulaResponsableRegistro] = useState<string>("");
  const [nombreResponsableRegistro, setNombreResponsableRegistro] = useState<string>("⚠️ Al ingresar su cédula, aquí se refleja su nombre completo. Listo.");

  const [listaProductosTemp, setListaProductosTemp] = useState<ItemProductoTemp[]>([]);

  useEffect(() => {
    const pedidosCargados = generar30PedidosPrueba();
    setPedidosColaPrueba(pedidosCargados);
  }, []);

  const registrarEnBitacora = (evento: string) => {
    const timestamp = new Date().toLocaleString();
    setBitacoraOculta((prev) => [`[${timestamp}] ${evento}`, ...prev]);
  };

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
          return;
        }
      }
      alert(`❌ Credenciales incorrectas.`);
      return;
    }

    const usuarioEncontrado = usuariosAutorizados.find((u) => u.cedula === cedulaLimpia);
    if (usuarioEncontrado && usuarioEncontrado.clave === claveLimpia) {
      setAutenticado(true);
      setRolActivo(usuarioEncontrado.rol);
    } else {
      setIntentosFallidos((prev) => prev + 1);
      alert(`❌ Clave incorrecta.`);
    }
  };

  const [estacionActiva, setEstacionActiva] = useState<number>(0);
  const [lotesActivos, setLotesActivos] = useState<LoteCreado[]>([]);

  if (!autenticado) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#0d1322] font-sans p-4">
        <div className="w-full max-w-xl bg-[#151c2e] border border-slate-700/85 rounded-3xl shadow-2xl p-6 text-white">
          <h1 className="text-xl font-bold text-amber-400 mb-4 font-mono">SYNAPSE-X OS | ACCESO</h1>
          <form onSubmit={handleIngresoPortal} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Cédula</label>
              <input
                type="text"
                value={inputCedula}
                onChange={(e) => setInputCedula(e.target.value)}
                className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white text-sm"
                placeholder="Ingrese su cédula"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Clave de Acceso</label>
              <input
                type="password"
                value={inputClave}
                onChange={(e) => setInputClave(e.target.value)}
                className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white text-sm"
                placeholder="••••••••"
              />
            </div>
            {tipoPortalLogin === "superuser" && (
              <div>
                <label className="block text-xs text-slate-400 mb-1">Clave Secundaria (Superuser)</label>
                <input
                  type="password"
                  value={inputClaveSecundaria}
                  onChange={(e) => setInputClaveSecundaria(e.target.value)}
                  className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-white text-sm"
                  placeholder="••••••••"
                />
              </div>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400 transition-colors"
            >
              Ingresar al Sistema
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${esClaro ? "bg-slate-100 text-slate-900" : "bg-[#0b101d] text-slate-100"} font-sans`}>
      <div className="flex-1 flex flex-col h-full overflow-hidden p-6">
        <h1 className="text-xl font-bold text-amber-400 font-mono mb-4">SYNAPSE-X OS | OSAI Industrial</h1>
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <button
            onClick={() => setEstacionActiva(1)}
            className={`px-4 py-2 rounded text-xs font-bold whitespace-nowrap ${estacionActiva === 1 ? "bg-amber-500 text-slate-950" : "bg-slate-800 text-slate-300"}`}
          >
            Estación 1: Selección de Pedidos
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-900/40 p-4 rounded-xl border border-slate-800">
          {estacionActiva === 1 && (
            <div>
              <h2 className="text-sm font-bold text-slate-300 mb-3">Cola de Pedidos Activos (Trazabilidad Estándar)</h2>
              <TablaTrazabilidadEstandar pedidos={pedidosColaPrueba} esClaro={esClaro} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}