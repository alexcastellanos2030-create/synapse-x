// data/bakeryConstants.ts
import { PedidoOperativo } from "../app/estaciones/estacion-1/page";

export const SUPERUSER_CREDENCIAL = {
  nombre: "Alexander Segundo Castellanos Perozo",
  cedula: "10433935",
  clavesValidas: ["*Paola123!", "*Ac12345!", "Iar661972", "Albani123", "Albany123"]
};

// 🍞 GENERADOR AUTOMÁTICO DE 30 PEDIDOS DE PRUEBA DIARIOS
export const generar30PedidosPrueba = (): PedidoOperativo[] => {
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