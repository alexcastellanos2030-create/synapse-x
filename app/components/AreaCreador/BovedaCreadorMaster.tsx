// app/components/AreaCreador/BovedaCreadorMaster.tsx

export interface CreadorCredential {
  cedula: string;
  name: string;
  cargo: string;
  nivel: string;
  passwords: string[];
  phone: string;
  rol: "creador";
  maxEstaciones: number;
}

// 👑 BÓVEDA EXCLUSIVA DEL CREADOR (Aislada y blindada contra acceso externo)
export const CREADOR_MASTER_DATABASE: { [key: string]: CreadorCredential } = {
  "10433935": {
    cedula: "10433935",
    name: "Alexander Segundo Castellanos Perozo",
    cargo: "Creador",
    nivel: "Nivel 10 - Acceso Total Absoluto (Super User / Creador)",
    passwords: ["*Paola123!", "*Ac12345!", "Iar661972", "Albany123"],
    phone: "+56951049399",
    rol: "creador",
    maxEstaciones: 12
  },
  "279276795": {
    cedula: "279276795",
    name: "Aleanny Castellanos",
    cargo: "Creador",
    nivel: "Nivel 10 - Acceso Total Absoluto (Super User)",
    passwords: ["*Aleanny123"],
    phone: "+56949296067",
    rol: "creador",
    maxEstaciones: 12
  },
  "33323644": {
    cedula: "33323644",
    name: "Albany Castellanos",
    cargo: "Creador",
    nivel: "Nivel 10 - Acceso Total Absoluto (Super User)",
    passwords: ["*Albany123"],
    phone: "+584146761793",
    rol: "creador",
    maxEstaciones: 12
  }
};