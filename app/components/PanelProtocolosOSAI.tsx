"use client";

import React, { useState } from "react";
import { UsuarioRegistrado } from "../page";

interface PanelProtocolosOSAIProps {
  usuarios: UsuarioRegistrado[];
  onRestaurarSistema: (usuariosRestaurados: UsuarioRegistrado[]) => void;
}

export default function PanelProtocolosOSAI({
  usuarios,
  onRestaurarSistema,
}: PanelProtocolosOSAIProps) {
  const [protocoloActivo, setProtocoloActivo] = useState<string>("menu");

  // 1. Protocolo de Respaldo Total (Exportar JSON)
  const handleExportarRespaldo = () => {
    const estadoGlobal = {
      version: "Synapse-X OS v3.2 OSAI Industrial",
      fechaRespaldo: new Date().toISOString(),
      autor: "Alex Segundo Castellanos Perozo",
      usuariosAutorizados: usuarios,
      configuracionGlobal: {
        empresa: "Salam Bakery / Synexis-X",
        estacionesActivas: 13,
      },
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(estadoGlobal, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `SynapseX_Respaldo_OSAI_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    alert("💾 ¡Respaldo total del sistema generado y descargado con éxito!");
  };

  // 2. Protocolo de Restauración por Archivo
  const handleRestaurarArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    const lector = new FileReader();
    lector.onload = (event) => {
      try {
        const contenido = event.target?.result as string;
        const jsonParseado = JSON.parse(contenido);

        if (jsonParseado && jsonParseado.usuariosAutorizados) {
          onRestaurarSistema(jsonParseado.usuariosAutorizados);
          alert(`📥 ¡Sistema restaurado exitosamente desde el punto de fecha: ${jsonParseado.fechaRespaldo || "Desconocida"}!`);
          setProtocoloActivo("menu");
        } else {
          alert("❌ El archivo seleccionado no tiene un formato de respaldo válido para Synapse-X OS.");
        }
      } catch (error) {
        alert("❌ Error al leer o interpretar el archivo de respaldo.");
      }
    };
    lector.readAsText(archivo);
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* CABECERA DEL MÓDULO */}
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-amber-600 dark:text-amber-400 uppercase tracking-wide">
            🛡️ Centro de Protocolos y Puntos de Restauración OSAI
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Garantiza la soberanía, respaldo total y movilidad de la información de tu planta en cualquier dispositivo.
          </p>
        </div>
        {protocoloActivo !== "menu" && (
          <button
            type="button"
            onClick={() => setProtocoloActivo("menu")}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-800 font-black rounded-xl hover:bg-amber-500 hover:text-slate-950 transition cursor-pointer"
          >
            ← Volver al Menú
          </button>
        )}
      </div>

      {/* VISTA PRINCIPAL: LISTA DE PROTOCOLOS TIPO TARJETAS */}
      {protocoloActivo === "menu" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Protocolo 1: Respaldo Total */}
          <div
            onClick={handleExportarRespaldo}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:border-amber-500 shadow-lg transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="text-2xl">💾</div>
              <h4 className="font-black text-sm text-slate-900 dark:text-white group-hover:text-amber-500 transition">
                1. Protocolo de Respaldo Total (.JSON)
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Exporta una copia inmutable con todos los usuarios, sueldos, bonos y permisos registrados hasta el momento para guardarla donde prefieras.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 font-bold text-amber-600 dark:text-amber-400 text-[11px] flex items-center justify-between">
              <span>Ejecutar Respaldo Inmediato</span>
              <span>→</span>
            </div>
          </div>

          {/* Protocolo 2: Restauración de Estado */}
          <div
            onClick={() => setProtocoloActivo("restaurar")}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:border-amber-500 shadow-lg transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="text-2xl">📥</div>
              <h4 className="font-black text-sm text-slate-900 dark:text-white group-hover:text-amber-500 transition">
                2. Protocolo de Restauración de Estado
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Sube un archivo de respaldo previo para sincronizar y restaurar todo el sistema operativo en cualquier laptop o teléfono en segundos.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 font-bold text-amber-600 dark:text-amber-400 text-[11px] flex items-center justify-between">
              <span>Seleccionar Punto de Restauración</span>
              <span>→</span>
            </div>
          </div>

          {/* Protocolo 3: Sincronización Multi-Dispositivo */}
          <div
            onClick={() => setProtocoloActivo("cloud")}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:border-amber-500 shadow-lg transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="text-2xl">🌐</div>
              <h4 className="font-black text-sm text-slate-900 dark:text-white group-hover:text-amber-500 transition">
                3. Protocolo de Conectividad Multi-Dispositivo
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Directrices técnicas para operar el sistema desde cualquier equipo portátil, móvil o de mesa sin pérdida de datos.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 font-bold text-amber-600 dark:text-amber-400 text-[11px] flex items-center justify-between">
              <span>Ver Bitácora y Guía</span>
              <span>→</span>
            </div>
          </div>

          {/* Protocolo 4: Verificación de Identidad y Seguridad OSAI */}
          <div
            onClick={() => setProtocoloActivo("seguridad")}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:border-amber-500 shadow-lg transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-2">
              <div className="text-2xl">🔒</div>
              <h4 className="font-black text-sm text-slate-900 dark:text-white group-hover:text-amber-500 transition">
                4. Protocolo de Seguridad y Superuser Master
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Información sobre el cifrado de sesiones (24h Superuser / 10m Operarios) y validación de doble clave de acceso.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 font-bold text-amber-600 dark:text-amber-400 text-[11px] flex items-center justify-between">
              <span>Consultar Parámetros</span>
              <span>→</span>
            </div>
          </div>

        </div>
      )}

      {/* DETALLE DEL PROTOCOLO 2: RESTAURACIÓN */}
      {protocoloActivo === "restaurar" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h4 className="font-black text-amber-600 dark:text-amber-400 text-sm uppercase">
            📥 Carga de Archivo de Respaldo OSAI
          </h4>
          <p className="text-slate-600 dark:text-slate-400 text-xs">
            Selecciona el archivo `.json` que descargaste previamente como punto de restauración. El sistema actualizará inmediatamente la plantilla de personal y permisos.
          </p>
          <div className="p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-center space-y-3 bg-slate-50 dark:bg-slate-950">
            <input
              type="file"
              accept=".json"
              onChange={handleRestaurarArchivo}
              className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* DETALLE DEL PROTOCOLO 3: CONECTIVIDAD CLOUD */}
      {protocoloActivo === "cloud" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h4 className="font-black text-amber-600 dark:text-amber-400 text-sm uppercase">
            🌐 Guía de Operación Multi-Dispositivo
          </h4>
          <div className="space-y-3 text-slate-700 dark:text-slate-300">
            <p><strong>1. Movilidad Absoluta:</strong> Synapse-X OS está desplegado en la nube a través de Vercel. Puedes entrar desde cualquier navegador web usando tu enlace oficial.</p>
            <p><strong>2. Puntos de Restauración:</strong> Si cambias de equipo (por ejemplo, de tu laptop personal a un teléfono en la panadería), puedes usar el <em>Protocolo 1</em> para exportar tu archivo de respaldo y el <em>Protocolo 2</em> para cargarlo en el nuevo equipo en menos de 5 segundos.</p>
            <p><strong>3. Seguridad al Cerrar Sesión:</strong> Al hacer clic en "Cerrar Sesión", el sistema borra las credenciales activas del equipo prestado, dejando el terminal limpio y seguro.</p>
          </div>
        </div>
      )}

      {/* DETALLE DEL PROTOCOLO 4: SEGURIDAD MASTER */}
      {protocoloActivo === "seguridad" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <h4 className="font-black text-amber-600 dark:text-amber-400 text-sm uppercase">
            🔒 Protocolos de Autenticación y Cifrado OSAI
          </h4>
          <div className="space-y-3 text-slate-700 dark:text-slate-300">
            <p><strong>Superuser Master:</strong> Cuenta con una vigencia de sesión de 24 horas continuas y contador regresivo visible, requiriendo doble clave de seguridad.</p>
            <p><strong>Operarios de Planta:</strong> Cuentan con un sistema de inactividad de 10 minutos para proteger las estaciones de producción ante descuidos en planta.</p>
            <p><strong>Control de Bloqueos:</strong> Cualquier intento de acceso no autorizado con cédulas bloqueadas genera una alerta inmediata en la bitácora de auditoría.</p>
          </div>
        </div>
      )}
    </div>
  );
}