$html = @"
<!DOCTYPE html>
<html lang='es'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Bakery AI-OS - Alexander</title>
    <script src='https://cdn.tailwindcss.com'></script>
    <script>
        function mostrarPantalla(idPantalla) {
            document.querySelectorAll('.pantalla').forEach(p => p.classList.add('hidden'));
            const objetivo = document.getElementById(idPantalla);
            if (objetivo) {
                objetivo.classList.remove('hidden');
            }
        }
        function toggleAcordeon() {
            const contenido = document.getElementById('acordeon-pedido');
            const flecha = document.getElementById('flecha-pedido');
            contenido.classList.toggle('hidden');
            flecha.classList.toggle('rotate-180');
        }
        const personalBakery = {
            '12345678': 'Alexander Castellanos',
            '87654321': 'Mariano Santibañez',
            '11223344': 'Delvis Arteaga',
            '22334455': 'Elvis Vera',
            '33445566': 'Julio Zarraga',
            '44556677': 'Luis Farias',
            '55667788': 'Marlenys Batista',
            '66778899': 'Oscar Rojas',
            '77889900': 'Rudy Aspilcueta',
            '99887766': 'Tommy Zambrano'
        };
        function obtenerSiguienteNumeroPedido() {
            const hoy = new Date();
            const mesActual = hoy.getFullYear() + '-' + String(hoy.getMonth() + 1).padStart(2, '0');
            let ultimoMes = localStorage.getItem('ultimo_mes_pedidos');
            let contador = parseInt(localStorage.getItem('contador_pedidos') || '0', 10);
            if (ultimoMes !== mesActual) {
                contador = 1;
                localStorage.setItem('ultimo_mes_pedidos', mesActual);
            } else {
                contador += 1;
            }
            localStorage.setItem('contador_pedidos', contador.toString());
            return String(contador).padStart(3, '0');
        }
        function buscarPersonalPorCedula() {
            const cedulaInput = document.getElementById('numero-cedula').value.replace(/\D/g, '');
            document.getElementById('numero-cedula').value = cedulaInput;
            const nombreInput = document.getElementById('nombre-completo');
            if (personalBakery[cedulaInput]) {
                nombreInput.value = personalBakery[cedulaInput];
                nombreInput.classList.remove('bg-gray-50', 'text-gray-400');
                nombreInput.classList.add('bg-emerald-50', 'text-emerald-800', 'font-bold');
            } else {
                if (cedulaInput.length >= 6) {
                    nombreInput.removeAttribute('readonly');
                    nombreInput.classList.remove('bg-gray-50', 'text-gray-400');
                    nombreInput.placeholder = 'Ingrese nombre completo...';
                } else {
                    nombreInput.setAttribute('readonly', 'readonly');
                    nombreInput.classList.add('bg-gray-50', 'text-gray-400');
                    nombreInput.value = '';
                }
            }
        }
        function registrarPedido(event) {
            event.preventDefault();
            const cliente = document.getElementById('cliente-local').value.trim();
            const producto = document.getElementById('tipo-producto').value;
            const cantidad = document.getElementById('cantidad-unidades').value.trim();
            const fechaRecepcion = document.getElementById('fecha-recepcion').value;
            const fechaEntrega = document.getElementById('fecha-entrega').value;
            const modalidad = document.getElementById('modalidad-pedido').value;
            const cedula = document.getElementById('numero-cedula').value.trim();
            const nombre = document.getElementById('nombre-completo').value.trim();

            if (!cliente || !cantidad || !fechaRecepcion || !fechaEntrega || !cedula || !nombre) {
                alert('?? ATENCIÓN: Todos los campos son obligatorios, incluyendo el número de cédula y el nombre completo del responsable.');
                return;
            }

            const numCorrelativo = obtenerSiguienteNumeroPedido();
            const ahora = new Date();
            const fechaCod = ahora.getFullYear() + String(ahora.getMonth() + 1).padStart(2, '0') + String(ahora.getDate()).padStart(2, '0');
            const horaCod = String(ahora.getHours()).padStart(2, '0') + ':' + String(ahora.getMinutes()).padStart(2, '0');
            const idPedidoCompleto = 'PED-' + fechaCod + '-' + numCorrelativo;

            const tabla = document.getElementById('tabla-bitacora-pedidos');
            const filaVacia = document.getElementById('fila-sin-pedidos');
            if (filaVacia) filaVacia.remove();

            const nuevaFila = document.createElement('tr');
            nuevaFila.className = 'border-b border-gray-100 hover:bg-amber-50/50 transition-all text-xs text-gray-800';
            nuevaFila.innerHTML = '<td class=\'py-3 px-3 font-bold text-amber-600\'>#' + numCorrelativo + '</td>' +
                '<td class=\'py-3 px-3 font-mono text-gray-500\'>' + idPedidoCompleto + ' (' + horaCod + ')</td>' +
                '<td class=\'py-3 px-3 font-semibold text-gray-900\'>' + cliente + '</td>' +
                '<td class=\'py-3 px-3\'>' + producto + ' (' + cantidad + ' u.)</td>' +
                '<td class=\'py-3 px-3\'>' + fechaRecepcion.replace('T', ' ') + '</td>' +
                '<td class=\'py-3 px-3 font-medium text-amber-700\'>' + fechaEntrega.replace('T', ' ') + '</td>' +
                '<td class=\'py-3 px-3\'><span class=\'bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-medium\'>' + modalidad + '</span></td>' +
                '<td class=\'py-3 px-3 font-medium text-zinc-700\'>' + nombre + ' (' + cedula + ')</td>';

            tabla.prepend(nuevaFila);
            alert('? ¡Pedido registrado con éxito!\n\nNúmero de Pedido: #' + numCorrelativo + '\nResponsable: ' + nombre);
            document.getElementById('form-pedido').reset();
            document.getElementById('nombre-completo').value = '';
            document.getElementById('nombre-completo').setAttribute('readonly', 'readonly');
            document.getElementById('nombre-completo').className = 'w-full border border-gray-300 rounded-lg p-2.5 bg-gray-50 text-gray-400 outline-none';
        }
    </script>
</head>
<body class='bg-gray-100 h-screen overflow-hidden font-sans'>
    <div class='flex h-full'>
        <aside class='w-72 bg-zinc-950 text-white flex flex-col shadow-2xl'>
            <div class='p-6 text-xl font-bold border-b border-zinc-800 text-amber-400 flex items-center justify-between'>
                <span>?? Bakery AI-OS</span>
            </div>
            <nav class='flex-1 p-4 space-y-2 overflow-y-auto'>
                <div class='text-xs font-semibold text-zinc-500 px-3 uppercase tracking-wider mb-2'>Operación Taller</div>
                <a href='#' onclick="mostrarPantalla('pantalla-panel')" class='flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-300 hover:bg-zinc-900 hover:text-white transition-all'>
                    <span>??</span> Panel de Control
                </a>
                <div>
                    <button onclick='toggleAcordeon()' class='w-full flex items-center justify-between px-4 py-3 rounded-xl bg-amber-500 text-zinc-950 font-bold shadow-lg transition-all'>
                        <div class='flex items-center gap-3'><span>??</span> Pedido</div>
                        <span id='flecha-pedido' class='transition-transform duration-200'>?</span>
                    </button>
                    <div id='acordeon-pedido' class='pl-4 mt-2 space-y-1'>
                        <a href='#' onclick="mostrarPantalla('pantalla-registro-pedido')" class='flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm bg-zinc-900 text-amber-400 font-medium hover:bg-zinc-800 transition-all border-l-2 border-amber-500'>
                            <span>??</span> Registro de pedido
                        </a>
                    </div>
                </div>
                <a href='#' onclick="mostrarPantalla('pantalla-produccion')" class='flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-300 hover:bg-zinc-900 hover:text-white transition-all'><span>??</span> Producción y Lotes</a>
                <a href='#' onclick="mostrarPantalla('pantalla-mantenimiento')" class='flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-300 hover:bg-zinc-900 hover:text-white transition-all'><span>??</span> Mantenimiento y Afilado</a>
                <div class='text-xs font-semibold text-zinc-500 px-3 uppercase tracking-wider mt-6 mb-2'>Gestión</div>
                <a href='#' onclick="mostrarPantalla('pantalla-personal')" class='flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-300 hover:bg-zinc-900 hover:text-white transition-all'><span>??</span> Control de Personal</a>
                <a href='#' onclick="mostrarPantalla('pantalla-configuracion')" class='flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-300 hover:bg-zinc-900 hover:text-white transition-all'><span>??</span> Configuración</a>
            </nav>
            <div class='p-4 border-t border-zinc-900 text-xs text-zinc-500 text-center'>Salam Bakery - Edición Técnica</div>
        </aside>
        <main class='flex-1 bg-white p-8 overflow-y-auto shadow-inner flex flex-col'>
            <div id='pantalla-panel' class='pantalla flex flex-col flex-1'>
                <header class='mb-6 border-b border-gray-200 pb-4 flex justify-between items-center'>
                    <div>
                        <h1 class='text-2xl font-bold text-gray-900'>Panel General</h1>
                        <p class='text-gray-500 text-sm'>Sistema de gestión operativo activo</p>
                    </div>
                    <div class='bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold'>Turno Activo</div>
                </header>
                <section class='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
                    <div class='bg-white border border-gray-200 rounded-xl p-5 shadow-sm'><h3 class='text-gray-500 text-sm font-medium'>Estado del Taller</h3><p class='text-2xl font-bold text-gray-900 mt-1'>Normal</p></div>
                    <div class='bg-white border border-gray-200 rounded-xl p-5 shadow-sm'><h3 class='text-gray-500 text-sm font-medium'>Herramientas / Afilado</h3><p class='text-2xl font-bold text-gray-900 mt-1'>Al día</p></div>
                    <div class='bg-white border border-gray-200 rounded-xl p-5 shadow-sm'><h3 class='text-gray-500 text-sm font-medium'>Personal en Turno</h3><p class='text-2xl font-bold text-gray-900 mt-1'>8 Activos</p></div>
                </section>
                <section class='bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex-1'>
                    <h3 class='text-lg font-bold text-gray-800 mb-2'>Área de Trabajo Principal</h3>
                    <p class='text-gray-600'>Haz clic en <strong class='text-amber-600'>'Pedido'</strong> -> <strong class='text-amber-600'>'Registro de pedido'</strong> para ingresar al formulario.</p>
                </section>
            </div>
            <div id='pantalla-registro-pedido' class='pantalla hidden flex flex-col flex-1 space-y-8'>
                <div>
                    <header class='mb-6 border-b border-gray-200 pb-4'>
                        <h1 class='text-2xl font-bold text-gray-900'>Hoja para registrar nuevos pedidos</h1>
                        <p class='text-gray-500 text-sm'>Registro técnico con numeración mensual correlativa y trazabilidad</p>
                    </header>
                    <section class='bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-4xl'>
                        <form id='form-pedido' onsubmit='registrarPedido(event)' class='space-y-4'>
                            <div>
                                <label class='block text-sm font-medium text-gray-700 mb-1'>Cliente / Local</label>
                                <input type='text' id='cliente-local' placeholder='Ej. Sucursal Central o Nombre del Local' class='w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 outline-none'>
                            </div>
                            <div class='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <label class='block text-sm font-medium text-gray-700 mb-1'>Tipo de Pan / Producto</label>
                                    <select id='tipo-producto' class='w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 outline-none'>
                                        <option>Pan Pita</option>
                                        <option>Croissant</option>
                                        <option>Brioche</option>
                                        <option>Masa Madre</option>
                                    </select>
                                </div>
                                <div>
                                    <label class='block text-sm font-medium text-gray-700 mb-1'>Cantidad (Unidades / Kilos)</label>
                                    <input type='number' id='cantidad-unidades' placeholder='Ej. 250' class='w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 outline-none'>
                                </div>
                            </div>
                            <div class='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <label class='block text-sm font-medium text-gray-700 mb-1'>Fecha y Hora de Recepción del Pedido</label>
                                    <input type='datetime-local' id='fecha-recepcion' class='w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 outline-none'>
                                </div>
                                <div>
                                    <label class='block text-sm font-medium text-gray-700 mb-1'>Fecha y Hora de Entrega del Pedido</label>
                                    <input type='datetime-local' id='fecha-entrega' class='w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 outline-none'>
                                </div>
                            </div>
                            <div>
                                <label class='block text-sm font-medium text-gray-700 mb-1'>Modalidad del Pedido</label>
                                <select id='modalidad-pedido' class='w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 outline-none'>
                                    <option>Normal (Día anterior para empaque y entrega)</option>
                                    <option>Express (Urgente)</option>
                                    <option>Mañana para Tarde</option>
                                    <option>Extendido a 7 días</option>
                                </select>
                            </div>
                            <div>
                                <label class='block text-sm font-medium text-gray-700 mb-1'>Observaciones / Notas de Producción</label>
                                <textarea id='observaciones-pedido' rows='3' placeholder='Instrucciones especiales para el taller de panadería...' class='w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 outline-none'></textarea>
                            </div>
                            <div class='pt-4 border-t border-gray-200 mt-6'>
                                <h3 class='text-sm font-bold text-gray-800 mb-3'>Responsable del registro</h3>
                                <div class='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                                    <div>
                                        <label class='block text-xs font-semibold text-gray-600 mb-1'>Número de cédula</label>
                                        <input type='text' id='numero-cedula' oninput='buscarPersonalPorCedula()' placeholder='Ingrese número...' class='w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 outline-none'>
                                    </div>
                                    <div>
                                        <label class='block text-xs font-semibold text-gray-600 mb-1'>Nombre completo</label>
                                        <input type='text' id='nombre-completo' readonly placeholder='Se completará según cédula...' class='w-full border border-gray-300 rounded-lg p-2.5 bg-gray-50 text-gray-400 outline-none'>
                                    </div>
                                </div>
                                <button type='submit' class='bg-amber-500 text-zinc-950 font-bold px-8 py-3.5 rounded-xl shadow-lg hover:bg-amber-400 transition-all w-full md:w-auto text-base'>
                                    Registrar pedido
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
                <div class='bg-white border border-gray-200 rounded-xl p-6 shadow-sm max-w-5xl'>
                    <h3 class='text-lg font-bold text-gray-900 mb-1'>?? Bitácora de Pedidos Registrados</h3>
                    <p class='text-gray-500 text-xs mb-4'>Numeración correlativa reiniciada mensualmente en #001</p>
                    <div class='overflow-x-auto'>
                        <table class='w-full text-left border-collapse'>
                            <thead>
                                <tr class='bg-gray-50 border-b border-gray-200 text-xs text-gray-500 font-semibold uppercase'>
                                    <th class='py-2.5 px-3'># No.</th>
                                    <th class='py-2.5 px-3'>Código ID (Fecha/Hora)</th>
                                    <th class='py-2.5 px-3'>Cliente / Local</th>
                                    <th class='py-2.5 px-3'>Producto</th>
                                    <th class='py-2.5 px-3'>Recepción</th>
                                    <th class='py-2.5 px-3'>Entrega</th>
                                    <th class='py-2.5 px-3'>Modalidad</th>
                                    <th class='py-2.5 px-3'>Responsable</th>
                                </tr>
                            </thead>
                            <tbody id='tabla-bitacora-pedidos'>
                                <tr id='fila-sin-pedidos'>
                                    <td colspan='8' class='py-6 text-center text-gray-400 text-xs'>No hay pedidos registrados hoy aún.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div id='pantalla-produccion' class='pantalla hidden flex-1'><h1 class='text-2xl font-bold text-gray-900 mb-2'>Producción y Lotes</h1><p class='text-gray-600'>Gestión de lotes de masa.</p></div>
            <div id='pantalla-mantenimiento' class='pantalla hidden flex-1'><h1 class='text-2xl font-bold text-gray-900 mb-2'>Mantenimiento y Afilado</h1><p class='text-gray-600'>Control de herramientas.</p></div>
            <div id='pantalla-personal' class='pantalla hidden flex-1'><h1 class='text-2xl font-bold text-gray-900 mb-2'>Control de Personal</h1><p class='text-gray-600'>Asistencia y turnos.</p></div>
            <div id='pantalla-configuracion' class='pantalla hidden flex-1'><h1 class='text-2xl font-bold text-gray-900 mb-2'>Configuración</h1><p class='text-gray-600'>Ajustes generales.</p></div>
        </main>
    </div>
</body>
</html>
"@
[System.IO.File]::WriteAllText("index.html", $html, [System.Text.Encoding]::UTF8)
Write-Host "¡Acordeón y pantallas reparados con éxito!" -ForegroundColor Green
