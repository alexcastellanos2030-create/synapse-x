"use client";

import React, { useState } from "react";

interface PersonalItem {
  id: number;
  nombre: string;
  cedula: string;
  cargo: string;
  movil: string;
  direccion: string;
}

export default function RelacionPersonalPage() {
  const [personal, setPersonal] = useState<PersonalItem[]>([
    { id: 1, nombre: "Alexander Castellanos", cedula: "V-15123456", cargo: "Jefe de Taller / Maestro Panadero", movil: "+56 9 1234 5678", direccion: "Av. Independencia #1234, Santiago" },
    { id: 2, nombre: "Delvis Arteaga", cedula: "V-18876543", cargo: "Personal de Producción", movil: "+56 9 8765 4321", direccion: "Calle Recoleta #567, Santiago" },
    { id: 3, nombre: "Elvis Vera", cedula: "V-19111222", cargo: "Operador de Mezcla", movil: "+56 9 1122 3344", direccion: "Av. La Paz #890, Independencia" },
    { id: 4, nombre: "Julio Zarraga", cedula: "V-20333444", cargo: "Operador de Mezcla", movil: "+56 9 4433 2211", direccion: "Calle Vivaceta #432, Santiago" },
    { id: 5, nombre: "Luis Farias", cedula: "V-17555666", cargo: "Asistente de Pastelería (Laminación)", movil: "+56 9 5566 7788", direccion: "Barrio Patronato #321, Santiago" },
    { id: 6, nombre: "Marlenys Batista", cedula: "V-16777888", cargo: "Empaque y Despacho", movil: "+56 9 7788 9900", direccion: "Av. Dorsal #789, Conchalí" },
    { id: 7, nombre: "Oscar Rojas", cedula: "V-21999000", cargo: "Horno y Fermentación", movil: "+56 9 9900 1122", direccion: "Calle Guanaco #654, Independencia" },
    { id: 8, nombre: "Rudy Aspilcueta", cedula: "V-22111333", cargo: "Operador de Maquinaria", movil: "+56 9 2233 4455", direccion: "Av. Einstein #112, Recoleta" },
    { id: 9, nombre: "Tommy Zambrano", cedula: "V-23444555", cargo: "Personal de Producción", movil: "+56 9 3344 5566", direccion: "Calle Zapadores #99, Conchalí" },
    { id: 10, nombre: "Jesus Arteaga", cedula: "V-24555777", cargo: "Operador de Horno", movil: "+56 9 6677 8899", direccion: "Av. Principal #456, Santiago" },
  ]);

  const [idSeleccionado, setIdSeleccionado] = useState<number | null>(null);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [formEdit, setFormEdit] = useState<PersonalItem>({ id: 0, nombre: "", cedula: "", cargo: "", movil: "", direccion: "" });
  
  // Estado para un nuevo registro
  const [creando, setCreando] = useState<boolean>(false);
  const [nuevoItem, setNuevoItem] = useState({ nombre: "", cedula: "", cargo: "", movil: "", direccion: "" });

  const handleSeleccionarFila = (item: PersonalItem) => {
    setIdSeleccionado(item.id);
  };

  const iniciarEdicion = () => {
    if (!idSeleccionado) {
      alert("⚠️ Por favor, haga clic primero sobre la línea del operario que desea editar.");
      return;
    }
    const operario = personal.find(p => p.id === idSeleccionado);
    if (operario) {
      setEditandoId(operario.id);
      setFormEdit(operario);
    }
  };

  const handleGuardarCambios = (id: number) => {
    setPersonal(personal.map(p => p.id === id ? formEdit : p));
    setEditandoId(null);
    alert("¡Cambios guardados con éxito!");
  };

  const handleEliminarSeleccionado = () => {
    if (!idSeleccionado) {
      alert("⚠️ Por favor, seleccione la línea del operario que desea eliminar.");
      return;
    }
    const operario = personal.find(p => p.id === idSeleccionado);
    if (confirm(`¿Estás seguro de eliminar a ${operario?.nombre || "este operario"}?`)) {
      setPersonal(personal.filter(p => p.id !== idSeleccionado));
      setIdSeleccionado(null);
    }
  };

  const handleCrear = (e: React.FormEvent) => {
    e.preventDefault();
    const item: PersonalItem = {
      id: Date.now(),
      ...nuevoItem
    };
    setPersonal([item, ...personal]);
    setCreando(false);
    setNuevoItem({ nombre: "", cedula: "", cargo: "", movil: "", direccion: "" });
  };

  const handleImprimir = () => {
    window.print();
  };

  const handleDescargarCSV = () => {
    const headers = "Nombre,Cédula,Cargo,Móvil,Dirección\n";
    const rows = personal.map(p => `"${p.nombre}","${p.cedula}","${p.cargo}","${p.movil}","${p.direccion}"`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "relacion_personal_synapse.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 md:p-6 bg-slate-100 dark:bg-[#0b101d] text-slate-900 dark:text-slate-100 min-h-screen font-sans transition-colors">
      
      {/* CABECERA Y BOTONERÍA GENERAL UNIFICADA EN LÍNEA ARRIBA */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 pb-4 border-b border-slate-300 dark:border-slate-800 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono">
            Relación de Personal
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            OSAI Industrial — Seleccione una fila de la tabla para editar o eliminar
          </p>
        </div>

        {/* BARRA DE BOTONES SUPERIOR EN LÍNEA */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCreando(!creando)}
            className="px-3 py-2 bg-emerald-600 text-white font-bold text-xs rounded shadow hover:bg-emerald-500 transition cursor-pointer"
          >
            {creando ? "❌ Cancelar" : "➕ Crear Nuevo"}
          </button>

          <button
            onClick={iniciarEdicion}
            className="px-3 py-2 bg-amber-500 text-slate-950 font-black text-xs rounded shadow hover:bg-amber-400 transition cursor-pointer"
          >
            ✏️ Editar Seleccionado
          </button>

          <button
            onClick={handleEliminarSeleccionado}
            className="px-3 py-2 bg-rose-600 text-white font-bold text-xs rounded shadow hover:bg-rose-500 transition cursor-pointer"
          >
            🗑️ Eliminar
          </button>

          <button
            onClick={handleDescargarCSV}
            className="px-3 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-300 transition cursor-pointer"
          >
            📥 Descargar CSV
          </button>

          <button
            onClick={handleImprimir}
            className="px-3 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-300 transition cursor-pointer"
          >
            🖨️ Imprimir
          </button>
        </div>
      </div>

      {/* FORMULARIO DE CREACIÓN RÁPIDA */}
      {creando && (
        <form onSubmit={handleCrear} className="mb-6 p-4 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 shadow-md space-y-3">
          <h2 className="text-xs font-black uppercase text-amber-600">Registrar Nuevo Empleado</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Nombre Completo"
              value={nuevoItem.nombre}
              onChange={e => setNuevoItem({...nuevoItem, nombre: e.target.value})}
              required
              className="p-2 border rounded text-xs bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            />
            <input
              type="text"
              placeholder="Cédula (Ej: V-12345678)"
              value={nuevoItem.cedula}
              onChange={e => setNuevoItem({...nuevoItem, cedula: e.target.value})}
              required
              className="p-2 border rounded text-xs bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 font-mono"
            />
            <input
              type="text"
              placeholder="Cargo"
              value={nuevoItem.cargo}
              onChange={e => setNuevoItem({...nuevoItem, cargo: e.target.value})}
              required
              className="p-2 border rounded text-xs bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            />
            <input
              type="text"
              placeholder="Nro. Móvil"
              value={nuevoItem.movil}
              onChange={e => setNuevoItem({...nuevoItem, movil: e.target.value})}
              required
              className="p-2 border rounded text-xs bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 font-mono"
            />
            <input
              type="text"
              placeholder="Dirección"
              value={nuevoItem.direccion}
              onChange={e => setNuevoItem({...nuevoItem, direccion: e.target.value})}
              required
              className="p-2 border rounded text-xs md:col-span-2 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded shadow hover:bg-emerald-500 transition cursor-pointer"
          >
            💾 Guardar Registro
          </button>
        </form>
      )}

      {/* TABLA DE RELACIÓN DE PERSONAL (Filas limpias, letra más grande, selección por clic) */}
      <div className="overflow-x-auto border border-slate-300 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-md">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-b border-slate-300 dark:border-slate-700 font-bold uppercase text-xs">
              <th className="p-3 border-r border-slate-300 dark:border-slate-700 text-center w-12">N°</th>
              <th className="p-3 border-r border-slate-300 dark:border-slate-700">Nombre Completo</th>
              <th className="p-3 border-r border-slate-300 dark:border-slate-700">Cédula</th>
              <th className="p-3 border-r border-slate-300 dark:border-slate-700">Cargo</th>
              <th className="p-3 border-r border-slate-300 dark:border-slate-700">Nro. Móvil</th>
              <th className="p-3">Dirección</th>
            </tr>
          </thead>
          <tbody>
            {personal.map((item, index) => {
              const estaSeleccionado = idSeleccionado === item.id;
              const estaEditando = editandoId === item.id;

              return (
                <tr 
                  key={item.id} 
                  onClick={() => !estaEditando && handleSeleccionarFila(item)}
                  className={`border-b border-slate-200 dark:border-slate-800 transition cursor-pointer ${
                    estaEditando 
                      ? "bg-amber-50 dark:bg-amber-950/30" 
                      : estaSeleccionado 
                      ? "bg-amber-500/20 dark:bg-amber-500/30 font-semibold" 
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  }`}
                >
                  
                  <td className="p-3 border-r border-slate-300 dark:border-slate-700 font-mono text-center font-bold">
                    {index + 1}
                  </td>

                  {estaEditando ? (
                    <>
                      <td className="p-2 border-r border-slate-300" onClick={e => e.stopPropagation()}>
                        <input
                          type="text"
                          value={formEdit.nombre}
                          onChange={e => setFormEdit({...formEdit, nombre: e.target.value})}
                          className="w-full p-1.5 border rounded text-sm bg-white text-black"
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300" onClick={e => e.stopPropagation()}>
                        <input
                          type="text"
                          value={formEdit.cedula}
                          onChange={e => setFormEdit({...formEdit, cedula: e.target.value})}
                          className="w-full p-1.5 border rounded text-sm bg-white text-black font-mono"
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300" onClick={e => e.stopPropagation()}>
                        <input
                          type="text"
                          value={formEdit.cargo}
                          onChange={e => setFormEdit({...formEdit, cargo: e.target.value})}
                          className="w-full p-1.5 border rounded text-sm bg-white text-black"
                        />
                      </td>
                      <td className="p-2 border-r border-slate-300" onClick={e => e.stopPropagation()}>
                        <input
                          type="text"
                          value={formEdit.movil}
                          onChange={e => setFormEdit({...formEdit, movil: e.target.value})}
                          className="w-full p-1.5 border rounded text-sm bg-white text-black font-mono"
                        />
                      </td>
                      <td className="p-2" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={formEdit.direccion}
                            onChange={e => setFormEdit({...formEdit, direccion: e.target.value})}
                            className="w-full p-1.5 border rounded text-sm bg-white text-black"
                          />
                          <button
                            onClick={() => handleGuardarCambios(item.id)}
                            className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded text-xs cursor-pointer shadow whitespace-nowrap"
                          >
                            💾 Guardar
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-3 border-r border-slate-300 dark:border-slate-700 font-bold">
                        {item.nombre}
                      </td>
                      <td className="p-3 border-r border-slate-300 dark:border-slate-700 font-mono font-medium">
                        {item.cedula}
                      </td>
                      <td className="p-3 border-r border-slate-300 dark:border-slate-700 font-medium">
                        {item.cargo}
                      </td>
                      <td className="p-3 border-r border-slate-300 dark:border-slate-700 font-mono">
                        {item.movil}
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">
                        {item.direccion}
                      </td>
                    </>
                  )}

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}