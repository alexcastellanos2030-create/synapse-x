'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

interface Operador {
  id: string;
  nombre: string;
  cargo: string;
  estado: string;
}

export default function PersonalPage() {
  const [personal, setPersonal] = useState<Operador[]>([]);
  const [nombre, setNombre] = useState('');
  const [cargo, setCargo] = useState('');

  // 1. Cargar personal inicial desde Supabase
  const fetchPersonal = async () => {
    const { data, error } = await supabase.from('personal').select('*');
    if (!error && data) setPersonal(data);
  };

  useEffect(() => {
    fetchPersonal();

    // 2. Sincronización en tiempo real (Realtime)
    const channel = supabase
      .channel('cambios-personal')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'personal' },
        () => {
          fetchPersonal();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 3. Registrar un nuevo operador
  const agregarOperador = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    const { error } = await supabase.from('personal').insert([
      { nombre, cargo, estado: 'AUTORIZADO' }
    ]);

    if (!error) {
      setNombre('');
      setCargo('');
      fetchPersonal();
    }
  };

  // 4. Eliminar operador sincronizado con Supabase
  const eliminarOperador = async (id: string) => {
    const { error } = await supabase.from('personal').delete().eq('id', id);
    if (!error) {
      fetchPersonal();
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Gestión de Personal - SYNAPSE-X OS</h1>
      
      <form onSubmit={agregarOperador} className="mb-6 space-y-3">
        <input
          type="text"
          placeholder="Nombre del operador"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full p-2 border rounded text-black bg-white"
        />
        <input
          type="text"
          placeholder="Cargo (ej. Técnico Panadero)"
          value={cargo}
          onChange={(e) => setCargo(e.target.value)}
          className="w-full p-2 border rounded text-black bg-white"
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded font-semibold hover:bg-blue-700">
          Guardar Operador
        </button>
      </form>

      <ul className="space-y-2">
        {personal.map((op) => (
          <li key={op.id} className="p-3 border rounded flex justify-between items-center bg-gray-50">
            <div>
              <p className="font-semibold text-black">{op.nombre}</p>
              <p className="text-sm text-gray-600">{op.cargo || 'Sin cargo asignado'}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
                {op.estado}
              </span>
              <button
                onClick={() => eliminarOperador(op.id)}
                className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}