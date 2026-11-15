export function generarLlaveSoporteRemoto(nombreLocal: string, hardwareId: string) {
  const timestamp = Date.now();
  const codigoAleatorio = Math.floor(100000 + Math.random() * 900000);
  const llaveMaestraCifrada = `SYNEXIS-BRIDGE-${nombreLocal.toUpperCase().replace(/\s+/g, '')}-${codigoAleatorio}-${timestamp}`;
  
  return {
    hwidTarget: hardwareId,
    llaveAcceso: llaveMaestraCifrada,
    expiracion: new Date(timestamp + 15 * 60000)
  };
}