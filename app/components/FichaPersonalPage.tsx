"use client";

import React, { useState } from "react";

interface FamiliarInfo {
  nombreFamiliar: string;
  parentesco: string;
  movilFamiliar: string;
}

interface EmpleadoFicha {
  id: number;
  nroFicha: string;
  nombre: string;
  cedula: string;
  cargo: string;
  movil: string;
  direccion: string;
  fechaIngreso: string;
  estado: string;
  tallaCamisa: string;
  tallaPantalon: string;
  calzado: string;
  familiar: FamiliarInfo;
}

export default function FichaPersonalPage() {
  const [empleados, setEmpleados] = useState<EmpleadoFicha[]>([
    {
      id: 1,
      nroFicha: "FCH-001",
      nombre: "Alexander Castellanos",
      cedula: "V-15123456",
      cargo: "Jefe de Taller / Maestro Panadero",
      movil: "+56 9 1234 5678",
      direccion: "Av. Independencia #1234, Santiago",
      fechaIngreso: "2025-03-01",
      estado: "Activo",
      tallaCamisa: "L",
      tallaPantalon: "34",
      calzado: "42",
      familiar: { nombreFamiliar: "Maria Perozo", parentesco: "Esposa", movilFamiliar: "+56 9 8765 4321" }
    },
    {
      id: 2,
      nroFicha: "FCH-002",
      nombre: "Delvis Arteaga",
      cedula: "V-18876543",
      cargo: "Personal de Producción",
      movil: "+56 9 8765 4321",
      direccion: "Calle Recoleta #567, Santiago",
      fechaIngreso: "2025-06-15",
      estado: "Activo",
      tallaCamisa: "M",
      tallaPantalon: "32",
      calzado: "40",
      familiar: { nombreFamiliar: "Carlos Arteaga", parentesco: "Hermano", movilFamiliar: "+56 9 1111 2222" }
    },
    {
      id: 3,
      nroFicha: "FCH-003",
      nombre: "Elvis Vera",
      cedula: "V-12345678",
      cargo: "Operador de Mezcla",
      movil: "+56 9 1234 5678",
      direccion: "Av. La Paz #890, Independencia",
      fechaIngreso: "2025-09-10",
      estado: "Activo",
      tallaCamisa: "L",
      tallaPantalon: "36",
      calzado: "43",
      familiar: { nombreFamiliar: "Ana Vera", parentesco: "Madre", movilFamiliar: "+56 9 3333 4444" }
    },
    {
      id: 4,
      nroFicha: "FCH-004",
      nombre: "Julio Zarraga",
      cedula: "V-20333444",
      cargo: "Operador de Mezcla",
      movil: "+56 9 4433 2211",
      direccion: "Calle Vivaceta #432, Santiago",
      fechaIngreso: "2025-10-01",
      estado: "Activo",
      tallaCamisa: "M",
      tallaPantalon: "32",
      calzado: "41",
      familiar: { nombreFamiliar: "Rosa Zarraga", parentesco: "Madre", movilFamiliar: "+56 9 5555 6666" }
    },
    {
      id: 5,
      nroFicha: "FCH-005",
      nombre: "Luis Farias",
      cedula: "V-17555666",
      cargo: "Asistente de Pastelería (Laminación)",
      movil: "+56 9 5566 7788",
      direccion: "Barrio Patronato #321, Santiago",
      fechaIngreso: "2026-01-10",
      estado: "Activo",
      tallaCamisa: "S",
      tallaPantalon: "30",
      calzado: "39",
      familiar: { nombreFamiliar: "Carmen Farias", parentesco: "Esposa", movilFamiliar: "+56 9 7777 8888" }
    }
  ]);

  const [busqueda, setBusqueda] = useState<string>("");
  const [empleadoActivo, setEmpleadoActivo] = useState<EmpleadoFicha | null>(empleados[0]);
  const [editando, setEditando] = useState<boolean>(false);
  const [creando, setCreando] = useState<boolean>(false);
  const [formEdit, setFormEdit] = useState<EmpleadoFicha>(empleados[0]);

  const [nuevoItem, setNuevoItem] = useState<EmpleadoFicha>({
    id: Date.now(),
    nroFicha: `FCH-00${empleados.length + 1}`,
    nombre: "",
    cedula: "",
    cargo: "",
    movil: "",
    direccion: "",
    fechaIngreso: new Date().toISOString().split("T")[0],
    estado: "Activo",
    tallaCamisa: "M",
    tallaPantalon: "32",
    calzado: "40",
    familiar: { nombreFamiliar: "", parentesco: "", movilFamiliar: "" }
  });

  const handleBuscar = () => {
    const encontrado = empleados.find(
      e => e.nombre.toLowerCase().includes(busqueda.toLowerCase()) || e.cedula.toLowerCase().includes(busqueda.toLowerCase())
    );
    if (encontrado) {
      setEmpleadoActivo(encontrado);
      setFormEdit(encontrado);
      setEditando(false);
      setCreando(false);
    } else {
      alert("❌ No se encontró ningún operario con ese nombre o cédula.");
    }
  };

  const handleGuardarEdicion = (e: React.FormEvent) => {
    e.preventDefault();
    setEmpleados(empleados.map(emp => emp.id === formEdit.id ? formEdit : emp));
    setEmpleadoActivo(formEdit);
    setEditando(false);
    alert("¡Ficha actualizada con éxito!");
  };

  const handleCrearNuevo = (e: React.FormEvent) => {
    e.preventDefault();
    const itemCreado = { ...nuevoItem, id: Date.now() };
    setEmpleados([itemCreado, ...empleados]);
    setEmpleadoActivo(itemCreado);
    setCreando(false);
    alert("¡Nuevo operario registrado con éxito!");
  };

  const handleEliminar = () => {
    if (!empleadoActivo) return;
    if (confirm(`¿Estás seguro de eliminar la ficha de ${empleadoActivo.nombre}?`)) {
      const filtrados = empleados.filter(e => e.id !== empleadoActivo.id);
      setEmpleados(filtrados);
      setEmpleadoActivo(filtrados.length > 0 ? filtrados[0] : null);
      setEditando(false);
    }
  };

  const handleImprimir = () => {
    window.print();
  };

  const handleDescargarCSV = () => {
    if (!empleadoActivo) return;
    const contenido = `Ficha de Datos Personales - Synapse-X\nNro Ficha,${empleadoActivo.nroFicha}\nNombre,${empleadoActivo.nombre}\nCédula/RUT,${empleadoActivo.cedula}\nCargo,${empleadoActivo.cargo}\nMóvil,${empleadoActivo.movil}\nDirección,${empleadoActivo.direccion}\nFecha Ingreso,${empleadoActivo.fechaIngreso}\nTallas,Camisa: ${empleadoActivo.tallaCamisa} | Pantalón: ${empleadoActivo.tallaPantalon} | Calzado: ${empleadoActivo.calzado}\nFamiliar Emergencia,${empleadoActivo.familiar.nombreFamiliar} (${empleadoActivo.familiar.parentesco}) - Móvil: ${empleadoActivo.familiar.movilFamiliar}`;
    const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ficha_${empleadoActivo.cedula}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 md:p-6 bg-slate-100 dark:bg-[#0b101d] text-slate-900 dark:text-slate-100 min-h-screen font-sans transition-colors">
      
      {/* CABECERA Y BUSCADOR CON LUPA INDEPENDIENTE */}
      <div className="mb-6 pb-4 border-b border-slate-300 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono">
            Ficha de Datos Personales
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            OSAI Industrial — Expediente individual del operario y control operativo
          </p>
        </div>

        {/* CAMPO DE BÚSQUEDA CON MICROBOTÓN DE LUPA (FUERA DE LA FICHA) */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-300 dark:border-slate-700 shadow-sm">
          <input
            type="text"
            placeholder="Buscar por Nombre o Cédula..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleBuscar()}
            className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-amber-500 font-mono"
          />
          <button
            type="button"
            onClick={handleBuscar}
            className="px-3 py-1.5 bg-amber-500 text-slate-950 font-black text-xs rounded-lg shadow hover:bg-amber-400 transition cursor-pointer flex items-center gap-1"
            title="Buscar Operario"
          >
            🔍 Buscar
          </button>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL ESTILO TARJETA / FORMATO UNIFICADO */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-6 md:p-8 rounded-2xl shadow-xl space-y-6">
        
        {creando ? (
          /* FORMULARIO DE CREACIÓN */
          <form onSubmit={handleCrearNuevo} className="space-y-4">
            <h2 className="text-sm font-black uppercase text-amber-600 border-b pb-2">Registrar Nuevo Operario</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Nro. de Ficha:</label>
                <input type="text" value={nuevoItem.nroFicha} onChange={e => setNuevoItem({...nuevoItem, nroFicha: e.target.value})} required className="w-full p-2 border rounded bg-slate-50 dark:bg-slate-800 font-mono" />
              </div>
              <div className="md:col-span-2">
                <label className="block font-bold mb-1">Nombre Completo:</label>
                <input type="text" value={nuevoItem.nombre} onChange={e => setNuevoItem({...nuevoItem, nombre: e.target.value})} required className="w-full p-2 border rounded bg-slate-50 dark:bg-slate-800" />
              </div>
              <div>
                <label className="block font-bold mb-1">Cédula / RUT:</label>
                <input type="text" value={nuevoItem.cedula} onChange={e => setNuevoItem({...nuevoItem, cedula: e.target.value})} required className="w-full p-2 border rounded bg-slate-50 dark:bg-slate-800 font-mono" />
              </div>
              <div>
                <label className="block font-bold mb-1">Cargo:</label>
                <input type="text" value={nuevoItem.cargo} onChange={e => setNuevoItem({...nuevoItem, cargo: e.target.value})} required className="w-full p-2 border rounded bg-slate-50 dark:bg-slate-800" />
              </div>
              <div>
                <label className="block font-bold mb-1">Nro. Móvil:</label>
                <input type="text" value={nuevoItem.movil} onChange={e => setNuevoItem({...nuevoItem, movil: e.target.value})} required className="w-full p-2 border rounded bg-slate-50 dark:bg-slate-800 font-mono" />
              </div>
              <div className="md:col-span-3">
                <label className="block font-bold mb-1">Dirección de Habitación:</label>
                <input type="text" value={nuevoItem.direccion} onChange={e => setNuevoItem({...nuevoItem, direccion: e.target.value})} required className="w-full p-2 border rounded bg-slate-50 dark:bg-slate-800" />
              </div>
              <div>
                <label className="block font-bold mb-1">Talla Camisa:</label>
                <input type="text" value={nuevoItem.tallaCamisa} onChange={e => setNuevoItem({...nuevoItem, tallaCamisa: e.target.value})} required className="w-full p-2 border rounded bg-slate-50 dark:bg-slate-800 text-center" />
              </div>
              <div>
                <label className="block font-bold mb-1">Talla Pantalón:</label>
                <input type="text" value={nuevoItem.tallaPantalon} onChange={e => setNuevoItem({...nuevoItem, tallaPantalon: e.target.value})} required className="w-full p-2 border rounded bg-slate-50 dark:bg-slate-800 text-center" />
              </div>
              <div>
                <label className="block font-bold mb-1">Calzado:</label>
                <input type="text" value={nuevoItem.calzado} onChange={e => setNuevoItem({...nuevoItem, calzado: e.target.value})} required className="w-full p-2 border rounded bg-slate-50 dark:bg-slate-800 text-center" />
              </div>
              <div className="md:col-span-3 pt-2 border-t">
                <h3 className="font-bold text-rose-600 mb-2">Contacto de Emergencia / Familiar</h3>
              </div>
              <div>
                <label className="block font-bold mb-1">Nombre del Familiar:</label>
                <input type="text" value={nuevoItem.familiar.nombreFamiliar} onChange={e => setNuevoItem({...nuevoItem, familiar: {...nuevoItem.familiar, nombreFamiliar: e.target.value}})} required className="w-full p-2 border rounded bg-slate-50 dark:bg-slate-800" />
              </div>
              <div>
                <label className="block font-bold mb-1">Parentesco:</label>
                <input type="text" value={nuevoItem.familiar.parentesco} onChange={e => setNuevoItem({...nuevoItem, familiar: {...nuevoItem.familiar, parentesco: e.target.value}})} required className="w-full p-2 border rounded bg-slate-50 dark:bg-slate-800" />
              </div>
              <div>
                <label className="block font-bold mb-1">Móvil del Familiar:</label>
                <input type="text" value={nuevoItem.familiar.movilFamiliar} onChange={e => setNuevoItem({...nuevoItem, familiar: {...nuevoItem.familiar, movilFamiliar: e.target.value}})} required className="w-full p-2 border rounded bg-slate-50 dark:bg-slate-800 font-mono" />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded shadow cursor-pointer">💾 Guardar Registro</button>
              <button type="button" onClick={() => setCreando(false)} className="px-4 py-2 bg-slate-500 text-white font-bold text-xs rounded shadow cursor-pointer">Cancelar</button>
            </div>
          </form>
        ) : editando && empleadoActivo ? (
          /* FORMULARIO DE EDICIÓN */
          <form onSubmit={handleGuardarEdicion} className="space-y-4">
            <h2 className="text-sm font-black uppercase text-amber-600 border-b pb-2">Editando Ficha de: {empleadoActivo.nombre}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Nro. de Ficha:</label>
                <input type="text" value={formEdit.nroFicha} onChange={e => setFormEdit({...formEdit, nroFicha: e.target.value})} required className="w-full p-2 border rounded bg-slate-50 dark:bg-slate-800 font-mono" />
              </div>
              <div className="md:col-span-2">
                <label className="block font-bold mb-1">Nombre Completo:</label>
                <input type="text" value={formEdit.nombre} onChange={e => setFormEdit({...formEdit, nombre: e.target.value})} required className="w-full p-2 border rounded bg-slate-50 dark:bg-slate-800" />
              </div>
              <div>
                <label className="block font-bold mb-1">Cédula / RUT:</label>
                <input type="text" value={formEdit.cedula} onChange={e => setFormEdit({...formEdit, cedula: e.target.value})} required className="w-full p-2 border rounded bg-slate-50 dark:bg-slate-800 font-mono" />
              </div>
              <div>
                <label className="block font-bold mb-1">Cargo:</label>
                <input type="text" value={formEdit.cargo} onChange={e => setFormEdit({...formEdit, cargo: e.target.value})} required className="w-full p-2 border rounded bg-slate-50 dark:bg-slate-800" />
              </div>
              <div>
                <label className="block font-bold mb-1">Nro. Móvil:</label>
                <input type="text" value={formEdit.movil} onChange={e => setFormEdit({...formEdit, movil: e.target.value})} required className="w-full p-2 border rounded bg-slate-50 dark:bg-slate-800 font-mono" />
              </div>
              <div className="md:col-span-3">
                <label className="block font-bold mb-1">Dirección de Habitación:</label>
                <input type="text" value={formEdit.direccion} onChange={e => setFormEdit({...formEdit, direccion: e.target.value})} required className="w-full p-2 border rounded bg-slate-50 dark:bg-slate-800" />
              </div>
              <div>
                <label className="block font-bold mb-1">Talla Camisa:</label>
                <input type="text" value={formEdit.tallaCamisa} onChange={e => setFormEdit({...formEdit, tallaCamisa: e.target.value})} required className="w-full p-2 border rounded bg-slate-50 dark:bg-slate-800 text-center" />
              </div>
              <div>
                <label className="block font-bold mb-1">Talla Pantalón:</label>
                <input type="text" value={formEdit.tallaPantalon} onChange={e => setFormEdit({...formEdit, tallaPantalon: e.target.value})} required className="w-full p-2 border rounded bg-slate-50 dark:bg-slate-800 text-center" />
              </div>
              <div>
                <label className="block font-bold mb-1">Calzado:</label>
                <input type="text" value={formEdit.calzado} onChange={e => setFormEdit({...formEdit, calzado: e.target.value})} required className="w-full p-2 border rounded bg-slate-50 dark:bg-slate-800 text-center" />
              </div>
              <div className="md:col-span-3 pt-2 border-t">
                <h3 className="font-bold text-rose-600 mb-2">Contacto de Emergencia / Familiar</h3>
              </div>
              <div>
                <label className="block font-bold mb-1">Nombre del Familiar:</label>
                <input type="text" value={formEdit.familiar.nombreFamiliar} onChange={e => setFormEdit({...formEdit, familiar: {...formEdit.familiar, nombreFamiliar: e.target.value}})} required className="w-full p-2 border rounded bg-slate-50 dark:bg-slate-800" />
              </div>
              <div>
                <label className="block font-bold mb-1">Parentesco:</label>
                <input type="text" value={formEdit.familiar.parentesco} onChange={e => setFormEdit({...formEdit, familiar: {...formEdit.familiar, parentesco: e.target.value}})} required className="w-full p-2 border rounded bg-slate-50 dark:bg-slate-800" />
              </div>
              <div>
                <label className="block font-bold mb-1">Móvil del Familiar:</label>
                <input type="text" value={formEdit.familiar.movilFamiliar} onChange={e => setFormEdit({...formEdit, familiar: {...formEdit.familiar, movilFamiliar: e.target.value}})} required className="w-full p-2 border rounded bg-slate-50 dark:bg-slate-800 font-mono" />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded shadow cursor-pointer">💾 Guardar Cambios</button>
              <button type="button" onClick={() => setEditando(false)} className="px-4 py-2 bg-slate-500 text-white font-bold text-xs rounded shadow cursor-pointer">Cancelar</button>
            </div>
          </form>
        ) : empleadoActivo ? (
          /* VISTA DE LA FICHA EN FORMATO LIMPIO (ESTILO TARJETAS / BLOQUES) */
          <div className="space-y-6">
            
            {/* CABECERA INTERNA DE LA FICHA */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 dark:border-slate-800 pb-4 gap-2">
              <div>
                <span className="text-[10px] font-mono bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded font-bold uppercase">
                  {empleadoActivo.nroFicha}
                </span>
                <h2 className="text-lg font-black uppercase tracking-wide mt-1">{empleadoActivo.nombre}</h2>
              </div>
              <div className="text-right text-xs">
                <span className="text-slate-500 block">Fecha de Ingreso: <strong className="font-mono">{empleadoActivo.fechaIngreso}</strong></span>
                <span className="inline-block mt-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 font-bold text-[10px] uppercase">
                  ● {empleadoActivo.estado}
                </span>
              </div>
            </div>

            {/* BLOQUE 1: DATOS PERSONALES Y LABORALES */}
            <div>
              <h3 className="text-xs font-black uppercase text-amber-600 dark:text-amber-400 mb-3 tracking-wide">
                📋 Datos Personales y Laborales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-slate-500 font-semibold block">Cédula de Identidad / RUT:</span>
                  <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">{empleadoActivo.cedula}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block">Cargo Oficial:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{empleadoActivo.cargo}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block">Número de Teléfono Móvil:</span>
                  <span className="font-mono text-slate-900 dark:text-white">{empleadoActivo.movil}</span>
                </div>
                <div className="md:col-span-3">
                  <span className="text-slate-500 font-semibold block">Dirección de Habitación:</span>
                  <span className="text-slate-900 dark:text-white">{empleadoActivo.direccion}</span>
                </div>
              </div>
            </div>

            {/* BLOQUE 2: DOTACIÓN Y TALLAS */}
            <div>
              <h3 className="text-xs font-black uppercase text-amber-600 dark:text-amber-400 mb-3 tracking-wide">
                👕 Dotación y Tallas Asignadas
              </h3>
              <div className="grid grid-cols-3 gap-4 text-xs bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                <div>
                  <span className="text-slate-500 font-semibold block">Talla de Camisa:</span>
                  <span className="font-mono font-bold text-sm">{empleadoActivo.tallaCamisa}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block">Talla de Pantalón:</span>
                  <span className="font-mono font-bold text-sm">{empleadoActivo.tallaPantalon}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block">Calzado de Seguridad:</span>
                  <span className="font-mono font-bold text-sm">{empleadoActivo.calzado}</span>
                </div>
              </div>
            </div>

            {/* BLOQUE 3: CONTACTO DE EMERGENCIA (FAMILIAR) */}
            <div>
              <h3 className="text-xs font-black uppercase text-rose-600 dark:text-rose-400 mb-3 tracking-wide">
                🚨 Contacto de Emergencia / Familiar
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-rose-50 dark:bg-rose-950/20 p-4 rounded-xl border border-rose-200 dark:border-rose-900/40">
                <div>
                  <span className="text-slate-500 font-semibold block">Nombre del Familiar:</span>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{empleadoActivo.familiar.nombreFamiliar}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block">Parentesco:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{empleadoActivo.familiar.parentesco}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block">Número de Teléfono del Familiar:</span>
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400">{empleadoActivo.familiar.movilFamiliar}</span>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            Utiliza el buscador superior con la lupa para reflejar la ficha del operario.
          </div>
        )}

      </div>

      {/* BOTONERÍA OPERATIVA EN LÍNEA EN LA PARTE INFERIOR */}
      <div className="max-w-4xl mx-auto mt-6 pt-4 border-t border-slate-300 dark:border-slate-800 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => { if(empleadoActivo) { setBusqueda(empleadoActivo.nombre); handleBuscar(); } }}
          className="px-4 py-2 bg-slate-800 text-white font-bold text-xs rounded shadow hover:bg-slate-700 transition cursor-pointer"
        >
          👁️ Ver
        </button>

        <button
          type="button"
          onClick={() => setCreando(true)}
          className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded shadow hover:bg-emerald-500 transition cursor-pointer"
        >
          ➕ Crear
        </button>

        <button
          type="button"
          onClick={() => { setEditando(true); if(empleadoActivo) setFormEdit(empleadoActivo); }}
          className="px-4 py-2 bg-amber-500 text-slate-950 font-black text-xs rounded shadow hover:bg-amber-400 transition cursor-pointer"
        >
          ✏️ Editar
        </button>

        <button
          type="button"
          onClick={handleEliminar}
          className="px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded shadow hover:bg-rose-500 transition cursor-pointer"
        >
          🗑️ Eliminar
        </button>

        <button
          type="button"
          onClick={handleImprimir}
          className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded border border-slate-400 dark:border-slate-700 hover:bg-slate-300 transition cursor-pointer"
        >
          🖨️ Imprimir
        </button>

        <button
          type="button"
          onClick={handleDescargarCSV}
          className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded border border-slate-400 dark:border-slate-700 hover:bg-slate-300 transition cursor-pointer"
        >
          📥 Descargar
        </button>
      </div>

    </div>
  );
}