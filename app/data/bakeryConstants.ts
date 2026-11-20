// ============================================================================
// USUARIOS TEMPORALES DE PRUEBA — SYNAPSE-X OS (OSAI INDUSTRIAL)
// - Jerarquía: Nivel 10 exclusivo del Creador (10433935 en BovedaCreadorMaster);
//   hijas (Aleanny y Albany) como Superusers en escala progresiva (Nivel 1 -> 9)
//   por encima de ingenieros, técnicos y operadores.
// - Columna `tipoUsuario`: "prueba" para registros temporales; "real" para
//   usuarios definitivos una vez creados.
// ============================================================================

export type TipoUsuarioRegistro = "prueba" | "real";

export interface UserCredential {
  cedula: string;
  name: string;
  cargo: string;
  nivel: string;
  passwords: string[];
  phone: string;
  rol: "ingeniero" | "tecnico" | "usuario";
  subrolArea?: "administrador" | "operario_planta";
  tipoUsuario: TipoUsuarioRegistro;
  maxEstaciones: number;
}

export const MASTER_USER_DATABASE: { [key: string]: UserCredential } = {
  // 1. Ingeniero de Sistemas (Prueba)
  "40111222": {
    cedula: "40111222",
    name: "Ingeniero de Sistemas (Prueba)",
    cargo: "Ingeniero en Sistemas",
    nivel: "Nivel 8 - Soporte de Sistemas (Debajo de Superusers)",
    passwords: ["eng2026sys"],
    phone: "+56987654321",
    rol: "ingeniero",
    tipoUsuario: "prueba",
    maxEstaciones: 12,
  },

  // 2. Técnico de Informática (Prueba)
  "50111222": {
    cedula: "50111222",
    name: "Técnico de Informática (Prueba)",
    cargo: "Técnico en Informática",
    nivel: "Nivel 6 - Soporte Técnico y Terminales",
    passwords: ["tech2026"],
    phone: "+56998887766",
    rol: "tecnico",
    tipoUsuario: "prueba",
    maxEstaciones: 6,
  },

  // 3. Operario 1 del Área de Usuario — Rol Administrador (Prueba)
  "60111111": {
    cedula: "60111111",
    name: "Operario Admin (Prueba)",
    cargo: "Administrador de Área Usuario",
    nivel: "Nivel 5 - Administración Operativa",
    passwords: ["adminop2026"],
    phone: "+56911111111",
    rol: "usuario",
    subrolArea: "administrador",
    tipoUsuario: "prueba",
    maxEstaciones: 4,
  },

  // 4. Operario 2 del Área de Usuario — Operario de Planta (Prueba)
  "60222222": {
    cedula: "60222222",
    name: "Operario de Planta (Prueba)",
    cargo: "Operario de Planta de Producción",
    nivel: "Nivel 2 - Operación de Planta",
    passwords: ["planta2026"],
    phone: "+56922222222",
    rol: "usuario",
    subrolArea: "operario_planta",
    tipoUsuario: "prueba",
    maxEstaciones: 2,
  },
};

// Listas separadas para editar fácilmente en cada sección
export const USUARIOS_PRUEBA_AREA_USUARIO = Object.values(MASTER_USER_DATABASE).filter(
  (u) => u.rol === "usuario"
);

export const USUARIOS_PRUEBA_TECNICOS = Object.values(MASTER_USER_DATABASE).filter(
  (u) => u.rol === "tecnico"
);

export const USUARIOS_PRUEBA_INGENIEROS = Object.values(MASTER_USER_DATABASE).filter(
  (u) => u.rol === "ingeniero"
);

export const generar30PedidosPrueba = () => {
  return [];
};
2. SQL para crear las tablas base en Supabase (junto a boveda_familiar)
Ya que boveda_familiar está creada con tus datos y los de tus dos hijas, aquí tienes el SQL limpio para crear las tablas de ingenieros, técnicos y usuarios/operarios con la columna tipo_usuario ('prueba' o 'real') para dejarlas listas antes de armar las relaciones:

SQL
create table if not exists public.usuarios_ingenieros (
  id uuid primary key default gen_random_uuid(),
  cedula text unique not null,
  nombre text not null,
  cargo text not null default 'Ingeniero en Sistemas',
  nivel text not null default 'Nivel 8',
  clave text not null,
  telefono text,
  tipo_usuario text not null default 'prueba' check (tipo_usuario in ('prueba', 'real')),
  activo boolean not null default true,
  creado_en timestamptz not null default now()
);

create table if not exists public.usuarios_tecnicos (
  id uuid primary key default gen_random_uuid(),
  cedula text unique not null,
  nombre text not null,
  cargo text not null default 'Técnico en Informática',
  nivel text not null default 'Nivel 6',
  clave text not null,
  telefono text,
  tipo_usuario text not null default 'prueba' check (tipo_usuario in ('prueba', 'real')),
  activo boolean not null default true,
  creado_en timestamptz not null default now()
);

create table if not exists public.usuarios_operarios (
  id uuid primary key default gen_random_uuid(),
  cedula text unique not null,
  nombre text not null,
  cargo text not null default 'Operario de Planta de Producción',
  subrol_area text not null default 'operario_planta' check (subrol_area in ('administrador', 'operario_planta')),
  nivel text not null default 'Nivel 2',
  clave text not null,
  telefono text,
  tipo_usuario text not null default 'prueba' check (tipo_usuario in ('prueba', 'real')),
  activo boolean not null default true,
  creado_en timestamptz not null default now()
);

insert into public.usuarios_ingenieros (cedula, nombre, cargo, nivel, clave, telefono, tipo_usuario)
values ('40111222', 'Ingeniero de Sistemas (Prueba)', 'Ingeniero en Sistemas', 'Nivel 8', 'eng2026sys', '+56987654321', 'prueba')
on conflict (cedula) do nothing;

insert into public.usuarios_tecnicos (cedula, nombre, cargo, nivel, clave, telefono, tipo_usuario)
values ('50111222', 'Técnico de Informática (Prueba)', 'Técnico en Informática', 'Nivel 6', 'tech2026', '+56998887766', 'prueba')
on conflict (cedula) do nothing;

insert into public.usuarios_operarios (cedula, nombre, cargo, subrol_area, nivel, clave, telefono, tipo_usuario)
values
  ('60111111', 'Operario Admin (Prueba)', 'Administrador de Área Usuario', 'administrador', 'Nivel 5', 'adminop2026', '+56911111111', 'prueba'),
  ('60222222', 'Operario de Planta (Prueba)', 'Operario de Planta de Producción', 'operario_planta', 'Nivel 2', 'planta2026', '+56922222222', 'prueba')
on conflict (cedula) do nothing;