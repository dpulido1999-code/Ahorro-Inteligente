// Variables globales
let unidadesA = 'kilogramos';
let unidadesB = 'gramos';
let tiendaA = 'D1';
let tiendaB = 'D1';
let chatAbierto = false;

// Elementos del DOM
const priceA = document.getElementById('priceA');
const qtyA = document.getElementById('qtyA');
const priceB = document.getElementById('priceB');
const qtyB = document.getElementById('qtyB');
const nameA = document.getElementById('nameA');
const nameB = document.getElementById('nameB');
const resultCard = document.getElementById('resultCard');
const resultText = document.getElementById('resultText');
const savingsText = document.getElementById('savingsText');
const historyContainer = document.getElementById('historyContainer');

// Elementos Premium
const premiumProducts = document.getElementById('premiumProducts');
const dynamicContainer = document.getElementById('dynamicContainer');
const addProductBtn = document.getElementById('addProductBtn');
const premiumWelcome = document.getElementById('premiumWelcome');
const btnAsistente = document.getElementById('btnAsistente');
const btnGuardarFavorito = document.getElementById('btnGuardarFavorito');
const btnExportar = document.getElementById('btnExportar');
const chatContainer = document.getElementById('chatContainer');
const chatMessages = document.getElementById('chatMessages');
const chatOptions = document.getElementById('chatOptions');
const favoritesContainer = document.getElementById('favoritesContainer');
const favoritesList = document.getElementById('favoritesList');

let dynamicProductCount = 0;

// ==========================================
// 🔐 CÓDIGOS DE ACTIVACIÓN MENSUALES
// ==========================================
const CODIGOS_VALIDOS = [
   
    'AHORRO-FEB26',  // Febrero 2026
    'AHORRO-MAR26',  // Marzo 2026
    'AHORRO-ABR26',  // Abril 2026
    'AHORRO-MAY26',  // Mayo 2026
    'AHORRO-JUN26',  // Junio 2026
    'AHORRO-JUL26',  // Julio 2026
    'AHORRO-AGO26',  // Agosto 2026
    'AHORRO-SEP26',  // Septiembre 2026
    'AHORRO-OCT26',  // Octubre 2026
    'AHORRO-NOV26',  // Noviembre 2026
    'AHORRO-DIC26'   // Diciembre 2026
];

// 1. Verificar Premium
function verificarPremium() {
    const fechaExpiracion = localStorage.getItem('premiumExpiracion');
    if (!fechaExpiracion) return false;
    const hoy = new Date();
    const expiracion = new Date(fechaExpiracion);
    if (hoy < expiracion) return true;
    localStorage.removeItem('premiumExpiracion');
    return false;
}

function guardarExpiracionPremium() {
    const fechaActual = new Date();
    fechaActual.setDate(fechaActual.getDate() + 30);
    localStorage.setItem('premiumExpiracion', fechaActual.toISOString());
}

// 🔑 Activar Premium con código vinculado a dispositivo
function activarConCodigo() {
    const codigo = document.getElementById('codigoPremium').value.trim().toUpperCase();
    
    if (!codigo) {
        alert('⚠️ Por favor, ingresa un código de activación.');
        return;
    }
    
    // 1. Obtener o generar un ID único para este dispositivo
    let dispositivoId = localStorage.getItem('dispositivoId');
    if (!dispositivoId) {
        dispositivoId = 'disp-' + Math.random().toString(36).substr(2, 12) + '-' + Date.now();
        localStorage.setItem('dispositivoId', dispositivoId);
    }
    
    // 2. Mostrar estado de carga en el botón
    const btn = document.querySelector('#premiumModal button[onclick="activarConCodigo()"]');
    const textoOriginal = btn.innerHTML;
    btn.innerHTML = '⏳ Verificando...';
    btn.disabled = true;
    
    // 3. URL de tu Google Apps Script (YA CONFIGURADA)
    const URL_SCRIPT = 'https://script.google.com/macros/s/AKfycbVSJj40FznzN6a72f4dgmfe3CuGYZ417qFhg1aqS75gK5MfmsnxialHWMqw9CUwznP/exec';
    
    // 4. Enviar el código y el dispositivo al servidor
    // NOTA: Se usa text/plain para evitar errores de CORS con Google Apps Script
    fetch(URL_SCRIPT, {
        method: 'POST',
        mode: 'no-cors', // Importante para evitar bloqueos de CORS en Apps Script
        headers: {
            'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({ 
            codigo: codigo, 
            dispositivo: dispositivoId 
        })
    })
    .then(response => {
        // Con 'no-cors', no podemos leer la respuesta directamente. 
        // Por eso, usamos un truco: si el servidor responde, asumimos que fue exitoso
        // y verificamos localmente si el código está en la lista de válidos.
        // Si necesitas validación real en el servidor, deberás cambiar el modo a 'cors'
        // y asegurarte de que tu Apps Script tenga los encabezados correctos.
        
        // Como solución inmediata, validamos localmente para que la app funcione:
        const esValidoLocalmente = CODIGOS_VALIDOS.includes(codigo);
        
        if (esValidoLocalmente) {
            guardarExpiracionPremium();
            activarPremiumVisual();
            document.getElementById('premiumModal').style.display = 'none';
            document.getElementById('codigoPremium').value = '';
            alert('🎉 ¡Premium activado por 1 mes!\n\nCódigo verificado correctamente.');
        } else {
            alert('❌ Código inválido. Verifica que esté escrito correctamente o contacta a: dpulido1999@gmail.com');
        }
    })
    .catch(err => {
        console.error('Error detallado:', err);
        alert('⚠️ Error al verificar el código.\n\nVerifica tu conexión a internet e inténtalo de nuevo.');
    })
    .finally(() => {
        btn.innerHTML = textoOriginal;
        btn.disabled = false;
    });
}

// 3. Desbloquear Premium visualmente
function activarPremiumVisual() {
    premiumProducts.style.filter = 'none';
    premiumProducts.style.pointerEvents = 'auto';
    premiumProducts.style.userSelect = 'auto';
    premiumProducts.style.opacity = '1';
    
    const overlay = document.querySelector('.lock-overlay');
    if (overlay) overlay.style.display = 'none';

    addProductBtn.style.display = 'block';

    const btnCompararPremium = document.getElementById('compareAllBtn');
    if (btnCompararPremium) btnCompararPremium.style.display = 'block';

    btnAsistente.style.display = 'block';
    btnGuardarFavorito.style.display = 'block';
    btnExportar.style.display = 'block';

    const btnCompararGratis = document.getElementById('compareBtnFree');
    if (btnCompararGratis) btnCompararGratis.style.display = 'none';

    const hotmartAd = document.getElementById('hotmartAd');
    if (hotmartAd) hotmartAd.style.display = 'none';

    const hotmartBtnPremium = document.getElementById('hotmartBtnPremium');
    if (hotmartBtnPremium) hotmartBtnPremium.style.display = 'block';

    const miAppAd = document.getElementById('miAppAd');
    if (miAppAd) miAppAd.style.display = 'none';

    // 🔥 CAMBIAR EL TEXTO DEL BOTÓN DE ANÁLISIS
    const btnAnalisis = document.getElementById('btnAnalisis');
    if (btnAnalisis) {
        btnAnalisis.innerText = '📊 Análisis Inteligente (Ilimitado)';
    }

    premiumWelcome.style.display = 'block';
    favoritesContainer.style.display = 'block';
    mostrarFavoritos();
    mostrarHistorial();
}

// 4. Unidades
function setupUnits(containerId, callback) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            callback(btn.dataset.unit);
        });
    });
}

document.getElementById('tiendaA').addEventListener('input', (e) => tiendaA = e.target.value.trim() || 'D1');
document.getElementById('tiendaB').addEventListener('input', (e) => tiendaB = e.target.value.trim() || 'D1');

setupUnits('unitA', (unit) => unidadesA = unit);
setupUnits('unitB', (unit) => unidadesB = unit);
setupUnits('unitC', (unit) => {});
setupUnits('unitD', (unit) => {});
setupUnits('unitE', (unit) => {});

// 5. Convertir precio
function convertirAPrecioPorUnidadBase(precio, cantidad, unidad) {
    let cantidadBase = cantidad;
    if (unidad === 'kilogramos') cantidadBase = cantidad * 1000;
    else if (unidad === 'litros') cantidadBase = cantidad * 1000;
    if (cantidadBase <= 0) return null;
    return precio / cantidadBase;
}

function getNombre(nombre, letra) {
    return nombre && nombre.trim() !== '' ? nombre : `Producto ${letra}`;
}

// 7. Comparar 2 productos
function comparar() {
    if (!priceA.value || !qtyA.value || !priceB.value || !qtyB.value) {
        alert('⚠️ Por favor, completa todos los campos de Precio y Cantidad.');
        return;
    }

    const precioA = parseFloat(priceA.value);
    const cantidadA = parseFloat(qtyA.value);
    const precioB = parseFloat(priceB.value);
    const cantidadB = parseFloat(qtyB.value);

    const costoUnitarioA = convertirAPrecioPorUnidadBase(precioA, cantidadA, unidadesA);
    const costoUnitarioB = convertirAPrecioPorUnidadBase(precioB, cantidadB, unidadesB);

    const nombreMostrarA = getNombre(nameA.value, 'A');
    const nombreMostrarB = getNombre(nameB.value, 'B');

    let resultadoHTML = '';
    let ahorroHTML = '';

    if (costoUnitarioA < costoUnitarioB) {
        resultadoHTML = `
            <div class="winner-box">
                <h3 style="color: #059669; font-size: 1.4rem;">🏆 ¡${nombreMostrarA} es más barato!</h3>
                <p>Cuesta <strong>$${Math.round(costoUnitarioA).toLocaleString('es-CO')}</strong> / unidad en <strong>${tiendaA}</strong>, mientras que ${nombreMostrarB} cuesta $${Math.round(costoUnitarioB).toLocaleString('es-CO')} / unidad en <strong>${tiendaB}</strong>.</p>
            </div>
        `;
        const ahorroTotal = (costoUnitarioB - costoUnitarioA) * cantidadA;
        ahorroHTML = `<p>💰 ¡Ahorras $${ahorroTotal.toLocaleString('es-CO')} en esta compra!</p>`;
        
        if (verificarPremium()) {
            const ahorroAnual = ahorroTotal * 52;
            ahorroHTML += `<p style="color: #6d28d9; font-weight: bold; margin-top: 10px;">📅 Si compras semanalmente, ahorras <strong>$${ahorroAnual.toLocaleString('es-CO')} al año!</strong></p>`;
        }
    } else if (costoUnitarioB < costoUnitarioA) {
        resultadoHTML = `
            <div class="winner-box">
                <h3 style="color: #059669; font-size: 1.4rem;">🏆 ¡${nombreMostrarB} es más barato!</h3>
                <p>Cuesta <strong>$${Math.round(costoUnitarioB).toLocaleString('es-CO')}</strong> / unidad en <strong>${tiendaB}</strong>, mientras que ${nombreMostrarA} cuesta $${Math.round(costoUnitarioA).toLocaleString('es-CO')} / unidad en <strong>${tiendaA}</strong>.</p>
            </div>
        `;
        const ahorroTotal = (costoUnitarioA - costoUnitarioB) * cantidadB;
        ahorroHTML = `<p>💰 ¡Ahorras $${ahorroTotal.toLocaleString('es-CO')} en esta compra!</p>`;
        
        if (verificarPremium()) {
            const ahorroAnual = ahorroTotal * 52;
            ahorroHTML += `<p style="color: #6d28d9; font-weight: bold; margin-top: 10px;">📅 Si compras semanalmente, ahorras <strong>$${ahorroAnual.toLocaleString('es-CO')} al año!</strong></p>`;
        }
    } else {
        resultadoHTML = `<div style="text-align:center; font-weight:bold;">🤝 Ambos productos tienen el mismo costo por unidad.</div>`;
    }

    resultText.innerHTML = resultadoHTML;
    savingsText.innerHTML = ahorroHTML;
    resultCard.classList.remove('hidden');
    guardarHistorial(priceA.value, qtyA.value, unidadesA, nameA.value, priceB.value, qtyB.value, unidadesB, nameB.value, 2);
    
    const sonido = document.getElementById('successSound');
    if (sonido) sonido.play();
}

document.getElementById('compareBtnFree').addEventListener('click', comparar);

document.getElementById('clearBtn').addEventListener('click', () => {
    ['priceA', 'qtyA', 'priceB', 'qtyB', 'priceC', 'qtyC', 'priceD', 'qtyD', 'priceE', 'qtyE', 'nameA', 'nameB', 'nameC', 'nameD', 'nameE'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    dynamicContainer.innerHTML = '';
    dynamicProductCount = 0;
    resultCard.classList.add('hidden');
    chatContainer.style.display = 'none';
});

// 8. Historial
function guardarHistorial(pA, cA, uA, nA, pB, cB, uB, nB, totalProductos = 2) {
    const historial = JSON.parse(localStorage.getItem('historial') || '[]');
    historial.unshift({ pA, cA, uA, nA, pB, cB, uB, nB, totalProductos, fecha: new Date().toLocaleString() });
    if (historial.length > 10) historial.pop();
    localStorage.setItem('historial', JSON.stringify(historial));
    mostrarHistorial();
}

function mostrarHistorial() {
    const historial = JSON.parse(localStorage.getItem('historial') || '[]');
    historyContainer.innerHTML = '';
    
    if (historial.length === 0) {
        historyContainer.innerHTML = '<p style="color:#64748b; font-size:0.9rem;">Aún no has hecho comparaciones.</p>';
        return;
    }
    
    const esPremium = verificarPremium();
    const btnCompararHistorial = document.getElementById('btnCompararHistorial');
    if (esPremium && historial.length >= 2) {
        btnCompararHistorial.style.display = 'block';
    } else {
        btnCompararHistorial.style.display = 'none';
    }
    
    historial.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.gap = '10px';
        
        let checkboxHTML = '';
        if (esPremium) {
            checkboxHTML = `<input type="checkbox" class="history-checkbox" data-index="${index}" style="width: 20px; height: 20px; cursor: pointer;">`;
        }
        
        const nombreA = item.nA || 'Producto A';
        const nombreB = item.nB || 'Producto B';
        const totalProd = item.totalProductos || 2;
        
        let badgeHTML = '';
        if (totalProd > 2) {
            badgeHTML = `<br><small style="color: #f59e0b; font-weight: bold;">⭐ Comparación de ${totalProd} productos</small>`;
        }
        
        div.innerHTML = `
            ${checkboxHTML}
            <div style="flex: 1;">
                <strong>${nombreA}: $${item.pA}</strong> vs <strong>${nombreB}: $${item.pB}</strong>
                ${badgeHTML}
                <br><small>${item.fecha}</small>
            </div>
        `;
        historyContainer.appendChild(div);
    });
}

mostrarHistorial();

document.getElementById('clearHistoryBtn').addEventListener('click', () => {
    if (confirm('¿Seguro que quieres borrar todo el historial?')) {
        localStorage.removeItem('historial');
        mostrarHistorial();
    }
});

function abrirModal() {
    document.getElementById('premiumModal').style.display = 'flex';
}

function agregarProducto() {
    const letra = String.fromCharCode(70 + dynamicProductCount);
    
    const nuevoProducto = `
        <section class="card product-card premium-card dynamic-premium" id="producto${letra}">
            <h2>🛒 Producto ${letra} <span class="badge-premium">⭐ Premium</span></h2>
            <div class="input-group">
                <label for="name${letra}">Nombre o promoción:</label>
                <input type="text" id="name${letra}" placeholder="Ej: Producto ${letra} 10% dcto">
            </div>
            <div class="input-group">
                <label for="price${letra}">Precio ($):</label>
                <input type="number" id="price${letra}" placeholder="Ej: 15000" step="any">
            </div>
            <div class="input-group">
                <label for="qty${letra}">Cantidad:</label>
                <input type="number" id="qty${letra}" placeholder="Ej: 300" step="any">
            </div>
            <div class="input-group">
                <label for="tienda${letra}">Tienda:</label>
                <input type="text" id="tienda${letra}" placeholder="Ej: D1, Éxito..." list="tiendasLista" value="D1">
            </div>
            <div class="input-group">
                <label>Unidad de medida:</label>
                <div class="unit-selector" id="unit${letra}">
                    <button data-unit="unidades">📦 Unidades</button>
                    <button data-unit="gramos">⚖️ Gramos (g)</button>
                    <button data-unit="kilogramos" class="active">⚖️ Kilogramos (kg)</button>
                    <button data-unit="mililitros">💧 Mililitros (ml)</button>
                    <button data-unit="litros">💧 Litros (L)</button>
                </div>
            </div>
            <button onclick="eliminarProducto('${letra}')" style="margin-top: 10px; background: #fee2e2; color: #dc2626; border: none; padding: 6px 12px; border-radius: 8px; cursor: pointer; font-weight: bold;">🗑️ Eliminar</button>
        </section>
    `;

    dynamicContainer.insertAdjacentHTML('beforeend', nuevoProducto);
    dynamicProductCount++;
    setupUnits(`unit${letra}`, (unit) => {});
}

function eliminarProducto(letra) {
    const producto = document.getElementById(`producto${letra}`);
    if (producto) {
        producto.remove();
        dynamicProductCount--;
    }
}

document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('premiumModal').style.display = 'none';
});

document.getElementById('premiumModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('premiumModal')) {
        document.getElementById('premiumModal').style.display = 'none';
    }
});

// 13. Comparar Todos (con colores corregidos para modo oscuro)
function compararPremium() {
    const productos = [
        { nombre: getNombre(nameA.value, 'A'), precio: document.getElementById('priceA').value, cantidad: document.getElementById('qtyA').value, unidad: unidadesA, tienda: tiendaA },
        { nombre: getNombre(nameB.value, 'B'), precio: document.getElementById('priceB').value, cantidad: document.getElementById('qtyB').value, unidad: unidadesB, tienda: tiendaB },
        { nombre: document.getElementById('nameC').value || 'Producto C', precio: document.getElementById('priceC').value, cantidad: document.getElementById('qtyC').value, unidad: 'kilogramos', tienda: document.getElementById('tiendaC').value || 'D1' },
        { nombre: document.getElementById('nameD').value || 'Producto D', precio: document.getElementById('priceD').value, cantidad: document.getElementById('qtyD').value, unidad: 'kilogramos', tienda: document.getElementById('tiendaD').value || 'D1' },
        { nombre: document.getElementById('nameE').value || 'Producto E', precio: document.getElementById('priceE').value, cantidad: document.getElementById('qtyE').value, unidad: 'kilogramos', tienda: document.getElementById('tiendaE').value || 'D1' }
    ];

    for (let i = 0; i < dynamicProductCount; i++) {
        const letra = String.fromCharCode(70 + i);
        const precio = document.getElementById(`price${letra}`).value;
        const cantidad = document.getElementById(`qty${letra}`).value;
        const tienda = document.getElementById(`tienda${letra}`).value || 'D1';
        const nombre = document.getElementById(`name${letra}`).value || `Producto ${letra}`;
        if (precio && cantidad) {
            productos.push({ nombre, precio, cantidad, unidad: 'kilogramos', tienda });
        }
    }

    const validos = productos.filter(p => p.precio && p.cantidad);
    if (validos.length < 2) {
        alert('⚠️ Llena al menos 2 productos para comparar.');
        return;
    }

    const ranking = validos.map(p => {
        const costoUnit = convertirAPrecioPorUnidadBase(parseFloat(p.precio), parseFloat(p.cantidad), p.unidad);
        return { ...p, costoUnit };
    }).sort((a, b) => a.costoUnit - b.costoUnit);

    const modoOscuro = document.body.classList.contains('dark-mode');
    const bgVerde = modoOscuro ? '#064e3b' : '#ecfdf5';
    const bgGris = modoOscuro ? '#334155' : '#f8fafc';
    const textoColor = modoOscuro ? '#e2e8f0' : '#1e293b';
    const textoSecundario = modoOscuro ? '#cbd5e1' : '#64748b';
    const verdeColor = modoOscuro ? '#6ee7b7' : '#059669';

    let html = `<h3 style="text-align:center; margin-bottom:15px; color: ${textoColor};">🏆 Ranking de Precios</h3>`;
    
    ranking.forEach((p, index) => {
        const medalla = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📦';
        const esGanador = index === 0;
        const bgItem = esGanador ? bgVerde : bgGris;
        const borderItem = esGanador ? '#059669' : (modoOscuro ? '#475569' : '#cbd5e1');
        const colorPrecio = esGanador ? verdeColor : textoColor;
        
        const costoMostrar = Math.round(p.costoUnit).toLocaleString('es-CO');
        
        html += `
            <div style="background: ${bgItem}; padding: 12px; border-radius: 10px; margin-bottom: 10px; border-left: 4px solid ${borderItem};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; flex-wrap: wrap; gap: 5px;">
                    <strong style="color: ${textoColor}; font-size: 1rem;">${medalla} ${p.nombre}</strong>
                    <span style="font-weight: bold; color: ${colorPrecio}; font-size: 0.9rem;">$${costoMostrar} / unidad</span>
                </div>
                <small style="color: ${textoSecundario};">Tienda: ${p.tienda}</small>
            </div>
        `;
    });

    resultText.innerHTML = html;
    savingsText.innerHTML = '';
    resultCard.classList.remove('hidden');
    
    const sonido = document.getElementById('successSound');
    if (sonido) sonido.play();
    
    guardarHistorial(priceA.value, qtyA.value, unidadesA, nameA.value, priceB.value, qtyB.value, unidadesB, nameB.value, validos.length);
}

// 14. Modo Oscuro
function toggleDarkMode() {
    const body = document.body;
    const btn = document.getElementById('darkModeBtn');
    const isDark = body.classList.contains('dark-mode');
    
    if (isDark) {
        body.classList.remove('dark-mode');
        btn.innerText = '🌙 Modo Oscuro';
        localStorage.setItem('modoOscuro', 'false');
    } else {
        body.classList.add('dark-mode');
        btn.innerText = '☀️ Modo Claro';
        localStorage.setItem('modoOscuro', 'true');
    }
}

function aplicarModoOscuroGuardado() {
    if (localStorage.getItem('modoOscuro') === 'true') {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeBtn').innerText = '☀️ Modo Claro';
    }
}

// 15. Chatbot
function abrirAsistente() {
    if (!verificarPremium()) {
        abrirModal();
        return;
    }

    chatAbierto = true;
    chatContainer.style.display = 'block';
    chatMessages.innerHTML = '';
    
    mostrarMensajeBot("🤖 ¡Hola! Soy tu Asistente de Ahorro. ¿Qué quieres saber?");
    
    chatOptions.innerHTML = '';
    agregarOpcion("¿Cómo ahorro más dinero?", "ahorrar");
    agregarOpcion("¿Cuál fue mi mejor compra?", "mejor");
    agregarOpcion("¿Qué tienda es más barata?", "tienda");
    agregarOpcion("Cerrar", "cerrar");
}

function mostrarMensajeBot(texto) {
    const div = document.createElement('div');
    div.className = 'chat-message bot';
    div.innerHTML = texto;
    chatMessages.appendChild(div);
}

function mostrarMensajeUser(texto) {
    const div = document.createElement('div');
    div.className = 'chat-message user';
    div.innerHTML = texto;
    chatMessages.appendChild(div);
}

function agregarOpcion(texto, accion) {
    const btn = document.createElement('button');
    btn.innerText = texto;
    btn.onclick = () => responderAsistente(accion);
    chatOptions.appendChild(btn);
}

function responderAsistente(accion) {
    mostrarMensajeUser("Yo: " + (accion === "ahorrar" ? "¿Cómo ahorro más dinero?" : accion === "mejor" ? "¿Cuál fue mi mejor compra?" : accion === "tienda" ? "¿Qué tienda es más barata?" : "Cerrar"));
    
    if (accion === "cerrar") {
        chatContainer.style.display = 'none';
        chatAbierto = false;
        return;
    }

    if (accion === "ahorrar") {
        mostrarMensajeBot("💡 <strong>Consejo:</strong> Siempre compara el precio por unidad, no el precio total. ¡El D1 suele ser más barato en productos básicos! Si usas la app semanalmente, puedes ahorrar hasta $500.000 al año.");
    } else if (accion === "mejor") {
        const historial = JSON.parse(localStorage.getItem('historial') || '[]');
        if (historial.length === 0) {
            mostrarMensajeBot("📊 Aún no has hecho comparaciones. Compara productos para ver tus resultados.");
        } else {
            const item = historial[0];
            const nombreA = item.nA || 'Producto A';
            const nombreB = item.nB || 'Producto B';
            mostrarMensajeBot("📊 <strong>Tu última comparación:</strong><br>" + nombreA + " vs " + nombreB + " el " + item.fecha);
        }
    } else if (accion === "tienda") {
        mostrarMensajeBot("🏪 <strong>Consejo:</strong> Compara los precios de la misma marca en diferentes tiendas. Generalmente el D1 y Justo & Bueno tienen precios más bajos que el Éxito en productos de la canasta básica.");
    }
    
    chatOptions.innerHTML = '';
    agregarOpcion("¿Cómo ahorro más dinero?", "ahorrar");
    agregarOpcion("¿Cuál fue mi mejor compra?", "mejor");
    agregarOpcion("¿Qué tienda es más barata?", "tienda");
    agregarOpcion("Cerrar", "cerrar");
}

// 16. Análisis Inteligente
function mostrarAnalisis() {
    const esPremium = verificarPremium();
    
    if (!esPremium) {
        let usosAnalisis = parseInt(localStorage.getItem('usosAnalisis') || '0');
        
        if (usosAnalisis >= 5) {
            let html = `
                <h3 style="text-align:center; margin-bottom:15px;">📊 Análisis Inteligente</h3>
                <div style="background: linear-gradient(135deg, #fee2e2, #fecaca); border: 3px solid #dc2626; padding: 20px; border-radius: 12px; margin-bottom: 15px; text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 10px;">🔒</div>
                    <h4 style="color: #dc2626; margin-bottom: 10px; font-size: 1.2rem;">Has agotado tus 5 análisis gratis</h4>
                    <p style="font-size: 0.95rem; color: #7f1d1d; margin-bottom: 15px;">¡Hazte Premium para tener <strong>análisis ilimitados</strong>!</p>
                    <button onclick="abrirModal()" style="padding: 12px 24px; background: linear-gradient(135deg, #f59e0b, #d97706); color: white; border: none; border-radius: 12px; font-weight: bold; cursor: pointer; font-size: 1rem;">⭐ Hacerme Premium</button>
                </div>
            `;
            resultText.innerHTML = html;
            savingsText.innerHTML = '';
            resultCard.classList.remove('hidden');
            return;
        }
        
        usosAnalisis++;
        localStorage.setItem('usosAnalisis', usosAnalisis);
    }

    const productos = [
        { nombre: getNombre(nameA.value, 'A'), precio: parseFloat(priceA.value) || 0, cantidad: parseFloat(qtyA.value) || 0, unidad: unidadesA, tienda: tiendaA },
        { nombre: getNombre(nameB.value, 'B'), precio: parseFloat(priceB.value) || 0, cantidad: parseFloat(qtyB.value) || 0, unidad: unidadesB, tienda: tiendaB }
    ];

    if (esPremium) {
        productos.push(
            { nombre: document.getElementById('nameC').value || 'Producto C', precio: parseFloat(document.getElementById('priceC').value) || 0, cantidad: parseFloat(document.getElementById('qtyC').value) || 0, unidad: 'kilogramos', tienda: document.getElementById('tiendaC').value || 'D1' },
            { nombre: document.getElementById('nameD').value || 'Producto D', precio: parseFloat(document.getElementById('priceD').value) || 0, cantidad: parseFloat(document.getElementById('qtyD').value) || 0, unidad: 'kilogramos', tienda: document.getElementById('tiendaD').value || 'D1' },
            { nombre: document.getElementById('nameE').value || 'Producto E', precio: parseFloat(document.getElementById('priceE').value) || 0, cantidad: parseFloat(document.getElementById('qtyE').value) || 0, unidad: 'kilogramos', tienda: document.getElementById('tiendaE').value || 'D1' }
        );
        
        for (let i = 0; i < dynamicProductCount; i++) {
            const letra = String.fromCharCode(70 + i);
            const precio = parseFloat(document.getElementById(`price${letra}`).value) || 0;
            const cantidad = parseFloat(document.getElementById(`qty${letra}`).value) || 0;
            const nombre = document.getElementById(`name${letra}`).value || `Producto ${letra}`;
            if (precio > 0 && cantidad > 0) {
                productos.push({ nombre, precio, cantidad, unidad: 'kilogramos', tienda: document.getElementById(`tienda${letra}`).value || 'D1' });
            }
        }
    }

    const validos = productos.filter(p => p.precio > 0 && p.cantidad > 0);
    if (validos.length < 2) {
        alert('⚠️ Llena al menos 2 productos para analizar.');
        if (!esPremium) {
            let usosAnalisis = parseInt(localStorage.getItem('usosAnalisis') || '0');
            usosAnalisis = Math.max(0, usosAnalisis - 1);
            localStorage.setItem('usosAnalisis', usosAnalisis);
        }
        return;
    }

    const porTienda = {};
    validos.forEach(p => {
        if (!porTienda[p.tienda]) {
            porTienda[p.tienda] = { productos: [], totalReal: 0, totalUnitario: 0 };
        }
        porTienda[p.tienda].productos.push({ nombre: p.nombre, precio: p.precio });
        porTienda[p.tienda].totalReal += p.precio;
        porTienda[p.tienda].totalUnitario += convertirAPrecioPorUnidadBase(p.precio, p.cantidad, p.unidad);
    });

    let tiendaMasBarata = '';
    let totalMasBarato = Infinity;
    let totalMasCaro = 0;
    let tiendaMasCara = '';

    for (const tienda in porTienda) {
        if (porTienda[tienda].totalReal < totalMasBarato) {
            totalMasBarato = porTienda[tienda].totalReal;
            tiendaMasBarata = tienda;
        }
        if (porTienda[tienda].totalReal > totalMasCaro) {
            totalMasCaro = porTienda[tienda].totalReal;
            tiendaMasCara = tienda;
        }
    }

    const ahorroTotal = totalMasCaro - totalMasBarato;
    const modoOscuro = document.body.classList.contains('dark-mode');
    const bgVerde = modoOscuro ? '#064e3b' : '#ecfdf5';
    const bgGris = modoOscuro ? '#334155' : '#f8fafc';
    const textoColor = modoOscuro ? '#e2e8f0' : '#1e293b';
    const textoSecundario = modoOscuro ? '#cbd5e1' : '#64748b';
    const verdeColor = modoOscuro ? '#6ee7b7' : '#059669';
    const rojoColor = modoOscuro ? '#fca5a5' : '#dc2626';

    if (!esPremium) {
        let usosRestantes = 5 - parseInt(localStorage.getItem('usosAnalisis') || '0');
        
        let html = `<h3 style="text-align:center; margin-bottom:15px; color: ${textoColor};">📊 Análisis Inteligente</h3>`;
        
        html += `
            <div style="background: ${modoOscuro ? '#1e40af' : '#dbeafe'}; border: 2px solid #3b82f6; padding: 10px; border-radius: 10px; margin-bottom: 15px; text-align: center;">
                <p style="font-size: 0.9rem; color: ${modoOscuro ? '#dbeafe' : '#1e40af'}; font-weight: bold;">🎁 Análisis gratis restantes: <strong>${usosRestantes}</strong></p>
            </div>
        `;
        
        html += `
            <div style="background: ${bgVerde}; border: 3px solid #059669; padding: 20px; border-radius: 12px; margin-bottom: 15px;">
                <h4 style="color: ${verdeColor}; margin-bottom: 10px; font-size: 1.2rem;">🏆 Te conviene comprar en: ${tiendaMasBarata}</h4>
                <p style="font-size: 0.95rem; color: ${textoColor};">Encontramos que <strong>${tiendaMasBarata}</strong> tiene el mejor precio para tu compra.</p>
            </div>
        `;

        html += `
            <div style="position: relative; background: ${bgGris}; padding: 20px; border-radius: 12px; border: 2px dashed ${modoOscuro ? '#475569' : '#cbd5e1'}; margin-bottom: 15px; text-align: center; overflow: hidden;">
                <div style="filter: blur(6px); pointer-events: none; user-select: none;">
                    <div style="font-size: 2rem; font-weight: bold; color: ${verdeColor}; margin: 10px 0;">$${Math.round(ahorroTotal).toLocaleString('es-CO')}</div>
                    <p style="font-size: 0.9rem; color: ${rojoColor}; font-weight: bold;">💰 Ahorras comprando todo en ${tiendaMasBarata}</p>
                </div>
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 10px;">
                    <div style="font-size: 2rem; margin-bottom: 8px;">🔒</div>
                    <p style="font-size: 0.95rem; font-weight: bold; color: ${textoColor}; margin-bottom: 10px;">Ahorro exacto bloqueado</p>
                    <button onclick="abrirModal()" style="padding: 10px 20px; background: linear-gradient(135deg, #f59e0b, #d97706); color: white; border: none; border-radius: 12px; font-weight: bold; cursor: pointer;">⭐ Desbloquear Premium</button>
                </div>
            </div>
        `;

        html += `
            <div style="background: ${modoOscuro ? '#78350f' : '#fef3c7'}; border: 2px solid #f59e0b; padding: 15px; border-radius: 10px; text-align: center;">
                <p style="font-size: 0.9rem; color: ${modoOscuro ? '#fde68a' : '#92400e'};">🔒 <strong>Con Premium podrás ver:</strong></p>
                <ul style="text-align: left; margin: 10px auto; font-size: 0.85rem; color: ${modoOscuro ? '#fef3c7' : '#78350f'}; max-width: 280px;">
                    <li>💰 Ahorro exacto en pesos</li>
                    <li>📊 Comparación entre todas las tiendas</li>
                    <li>🏆 Consejo personalizado</li>
                    <li>♾️ Análisis <strong>ilimitados</strong></li>
                </ul>
            </div>
        `;

        resultText.innerHTML = html;
        savingsText.innerHTML = '';
        resultCard.classList.remove('hidden');
        return;
    }

    // Premium: análisis completo
    let html = `<h3 style="text-align:center; margin-bottom:15px; color: ${textoColor};">📊 Análisis Inteligente</h3>`;
    
    html += `
        <div style="background: ${bgVerde}; border: 2px solid #059669; padding: 10px; border-radius: 10px; margin-bottom: 15px; text-align: center;">
            <p style="font-size: 0.9rem; color: ${verdeColor}; font-weight: bold;">♾️ Análisis Premium - Ilimitados</p>
        </div>
    `;

    html += `
        <div style="background: ${bgVerde}; border: 3px solid #059669; padding: 20px; border-radius: 12px; margin-bottom: 15px;">
            <h4 style="color: ${verdeColor}; margin-bottom: 10px; font-size: 1.2rem;">🏆 Te conviene comprar en: ${tiendaMasBarata}</h4>
            <p style="font-size: 0.95rem; color: ${textoColor}; margin-bottom: 10px;">Si compras los <strong>${validos.length} productos</strong> en <strong>${tiendaMasBarata}</strong>, pagarías aproximadamente:</p>
            <div style="text-align: center; font-size: 2rem; font-weight: bold; color: ${verdeColor}; margin: 10px 0;">$${Math.round(totalMasBarato).toLocaleString('es-CO')}</div>
            <p style="text-align: center; font-size: 0.9rem; color: ${rojoColor}; font-weight: bold;">💰 Ahorras $${Math.round(ahorroTotal).toLocaleString('es-CO')} vs ${tiendaMasCara}</p>
        </div>
    `;

    if (Object.keys(porTienda).length > 1) {
        html += `<h4 style="margin-bottom: 10px; color: ${textoColor};">📋 Comparación entre tiendas:</h4>`;
        for (const tienda in porTienda) {
            const esMasBarata = tienda === tiendaMasBarata;
            const diferencia = porTienda[tienda].totalReal - totalMasBarato;
            
            html += `
                <div style="background: ${esMasBarata ? bgVerde : bgGris}; padding: 15px; border-radius: 10px; margin-bottom: 10px; border-left: 4px solid ${esMasBarata ? '#059669' : (modoOscuro ? '#475569' : '#cbd5e1')};">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <strong style="font-size: 1.05rem; color: ${textoColor};">${esMasBarata ? '🥇' : '🏪'} ${tienda}</strong>
                        <span style="font-weight: bold; color: ${esMasBarata ? verdeColor : textoColor};">$${Math.round(porTienda[tienda].totalReal).toLocaleString('es-CO')}</span>
                    </div>
                    ${diferencia > 0 ? `<p style="font-size: 0.85rem; color: ${rojoColor};">+$${Math.round(diferencia).toLocaleString('es-CO')} más caro</p>` : `<p style="font-size: 0.85rem; color: ${verdeColor};">✅ Mejor precio total</p>`}
                    <small style="color: ${textoSecundario};">Productos: ${porTienda[tienda].productos.map(p => p.nombre).join(', ')}</small>
                </div>
            `;
        }
    }

    html += `
        <div style="background: ${modoOscuro ? '#78350f' : '#fef3c7'}; border: 2px solid #f59e0b; padding: 15px; border-radius: 10px; margin-top: 15px;">
            <h5 style="color: ${modoOscuro ? '#fde68a' : '#92400e'}; margin-bottom: 8px;">💡 Consejo Inteligente:</h5>
            <p style="font-size: 0.9rem; color: ${modoOscuro ? '#fef3c7' : '#78350f'};">${generarConsejo(porTienda, tiendaMasBarata, validos)}</p>
        </div>
    `;

    resultText.innerHTML = html;
    savingsText.innerHTML = '';
    resultCard.classList.remove('hidden');

    guardarHistorial(priceA.value, qtyA.value, unidadesA, nameA.value, priceB.value, qtyB.value, unidadesB, nameB.value, validos.length);
}

function generarConsejo(porTienda, tiendaGanadora, productos) {
    if (Object.keys(porTienda).length === 1) {
        return `Todos tus productos están asignados a <strong>${tiendaGanadora}</strong>. Si quieres comparar con otra tienda, cambia el campo de tienda en los productos.`;
    }
    
    const tiendas = Object.keys(porTienda);
    const esGanadorPorPoco = tiendas.some(t => t !== tiendaGanadora && Math.abs(porTienda[t].totalReal - porTienda[tiendaGanadora].totalReal) < 5000);
    
    if (esGanadorPorPoco) {
        return `Los precios entre <strong>${tiendas.join(' y ')}</strong> son muy parecidos. Si <strong>${tiendaGanadora}</strong> te queda más cerca, ¡esa es la mejor opción para ahorrar tiempo y gasolina!`;
    }
    
    if (tiendaGanadora.toLowerCase() === 'd1') {
        return `El <strong>D1</strong> suele ser la opción más económica en la canasta básica. Recuerda que al ahorrar en el precio por unidad, puedes comparar el mismo producto en otras tiendas para verificar si vale la pena el viaje.`;
    }
    
    return `Compra todo en <strong>${tiendaGanadora}</strong> y evita hacer varios viajes. Si la diferencia es poca, prioriza la tienda más cercana a tu casa.`;
}

// 17. Guardar favorito
function guardarComparacionFavorita() {
    if (!verificarPremium()) {
        abrirModal();
        return;
    }

    const nombre = prompt('📝 Ponle un nombre a esta comparación (ej: "Mercado semanal"):');
    if (!nombre) return;

    const favorito = {
        nombre: nombre,
        fecha: new Date().toLocaleString(),
        productoA: { precio: priceA.value, cantidad: qtyA.value, unidad: unidadesA, tienda: tiendaA, nombre: nameA.value },
        productoB: { precio: priceB.value, cantidad: qtyB.value, unidad: unidadesB, tienda: tiendaB, nombre: nameB.value }
    };

    const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    favoritos.unshift(favorito);
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    mostrarFavoritos();
    alert('💾 ¡Comparación guardada! Puedes cargarla cuando quieras.');
}

function mostrarFavoritos() {
    const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    favoritesList.innerHTML = '';
    
    const modoOscuro = document.body.classList.contains('dark-mode');
    const bgItem = modoOscuro ? '#334155' : '#ffffff';
    const textoColor = modoOscuro ? '#e2e8f0' : '#1e293b';
    const textoSecundario = modoOscuro ? '#cbd5e1' : '#64748b';
    
    if (favoritos.length === 0) {
        favoritesList.innerHTML = `<p style="color: ${textoSecundario}; font-size:0.9rem; text-align:center;">Aún no has guardado comparaciones.</p>`;
        return;
    }
    
    favoritos.forEach((fav, index) => {
        const div = document.createElement('div');
        div.className = 'favorite-item';
        div.style.background = bgItem;
        div.style.color = textoColor;
        div.style.boxShadow = '0 1px 4px rgba(0,0,0,0.1)';
        div.innerHTML = `
            <div>
                <strong style="color: ${textoColor};">${fav.nombre}</strong><br>
                <small style="color: ${textoSecundario};">${fav.fecha}</small>
            </div>
            <div>
                <button class="cargar-btn" onclick="cargarFavorito(${index})">📂 Cargar</button>
                <button onclick="eliminarFavorito(${index})">🗑️</button>
            </div>
        `;
        favoritesList.appendChild(div);
    });
}

function cargarFavorito(index) {
    const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    const fav = favoritos[index];
    if (!fav) return;

    priceA.value = fav.productoA.precio;
    qtyA.value = fav.productoA.cantidad;
    unidadesA = fav.productoA.unidad;
    tiendaA = fav.productoA.tienda;
    document.getElementById('tiendaA').value = fav.productoA.tienda;
    if (fav.productoA.nombre) document.getElementById('nameA').value = fav.productoA.nombre;

    priceB.value = fav.productoB.precio;
    qtyB.value = fav.productoB.cantidad;
    unidadesB = fav.productoB.unidad;
    tiendaB = fav.productoB.tienda;
    document.getElementById('tiendaB').value = fav.productoB.tienda;
    if (fav.productoB.nombre) document.getElementById('nameB').value = fav.productoB.nombre;

    document.querySelectorAll('#unitA button').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('#unitB button').forEach(b => b.classList.remove('active'));
    document.querySelector(`#unitA button[data-unit="${fav.productoA.unidad}"]`).classList.add('active');
    document.querySelector(`#unitB button[data-unit="${fav.productoB.unidad}"]`).classList.add('active');

    alert('📂 ¡Comparación cargada! Ya puedes presionar "Comparar Productos".');
}

function eliminarFavorito(index) {
    if (confirm('¿Eliminar esta comparación guardada?')) {
        const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
        favoritos.splice(index, 1);
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
        mostrarFavoritos();
    }
}

// 18. EXPORTAR - Modal
function abrirModalExportar() {
    if (!verificarPremium()) {
        abrirModal();
        return;
    }
    
    if (!resultText.innerHTML.trim() || resultCard.classList.contains('hidden')) {
        alert('Primero haz una comparación para poder exportarla.');
        return;
    }
    
    document.getElementById('exportModal').style.display = 'flex';
}

function cerrarModalExportar() {
    document.getElementById('exportModal').style.display = 'none';
}

// 18.1 Exportar como texto
function exportarComoTexto() {
    const texto = '🏷️ AHORRO INTELIGENTE\n\n' + resultText.innerText + '\n\n' + savingsText.innerText;
    
    if (navigator.share) {
        navigator.share({
            title: 'Ahorro Inteligente',
            text: texto
        }).catch(err => console.log(err));
    } else {
        navigator.clipboard.writeText(texto).then(() => {
            alert('📋 ¡Resultado copiado! Pégalo donde quieras.');
        }).catch(() => {
            alert('⚠️ No se pudo copiar. Copia manualmente:\n\n' + texto);
        });
    }
    cerrarModalExportar();
}

// 18.2 Exportar como imagen
function exportarComoImagen() {
    cerrarModalExportar();
    
    const contenedor = document.createElement('div');
    contenedor.style.position = 'fixed';
    contenedor.style.top = '-9999px';
    contenedor.style.left = '-9999px';
    contenedor.style.width = '480px';
    contenedor.style.padding = '20px';
    contenedor.style.background = 'white';
    contenedor.style.borderRadius = '12px';
    contenedor.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    contenedor.style.color = '#1e293b';
    
    contenedor.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #059669; font-size: 1.5rem; margin-bottom: 5px;">🏷️ Ahorro Inteligente</h1>
            <p style="color: #64748b; font-size: 0.85rem;">Comparador de Precios</p>
        </div>
        <div style="background: #f8fafc; padding: 15px; border-radius: 10px; color: #1e293b;">
            ${resultText.innerHTML}
        </div>
        <div style="margin-top: 15px; text-align: center; color: #059669; font-weight: bold;">
            ${savingsText.innerHTML}
        </div>
        <p style="text-align: center; font-size: 0.75rem; color: #94a3b8; margin-top: 20px;">Generado por Ahorro Inteligente</p>
    `;
    
    document.body.appendChild(contenedor);
    
    html2canvas(contenedor, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false
    }).then(canvas => {
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `ahorro-inteligente-${Date.now()}.png`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
            
            document.body.removeChild(contenedor);
            alert('🖼️ ¡Imagen descargada! Revísala en tu galería o carpeta de descargas.');
        });
    }).catch(err => {
        console.error(err);
        document.body.removeChild(contenedor);
        alert('⚠️ No se pudo generar la imagen. Intenta de nuevo.');
    });
}

// 18.3 Exportar como PDF
function exportarComoPDF() {
    cerrarModalExportar();
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let y = 20;
    
    doc.setFillColor(5, 150, 105);
    doc.rect(0, 0, pageWidth, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Ahorro Inteligente', pageWidth / 2, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Comparador de Precios', pageWidth / 2, 21, { align: 'center' });
    
    y = 35;
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.text(`Fecha: ${new Date().toLocaleString('es-CO')}`, margin, y);
    y += 10;
    
    const textoResultado = resultText.innerText;
    const textoAhorro = savingsText.innerText;
    
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    const lineas = doc.splitTextToSize(textoResultado, pageWidth - margin * 2);
    lineas.forEach(linea => {
        if (y > pageHeight - 20) {
            doc.addPage();
            y = 20;
        }
        doc.text(linea, margin, y);
        y += 6;
    });
    
    y += 5;
    
    doc.setTextColor(5, 150, 105);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    const lineasAhorro = doc.splitTextToSize(textoAhorro, pageWidth - margin * 2);
    lineasAhorro.forEach(linea => {
        if (y > pageHeight - 20) {
            doc.addPage();
            y = 20;
        }
        doc.text(linea, margin, y);
        y += 7;
    });
    
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('Generado por Ahorro Inteligente - Comparador de Precios', pageWidth / 2, pageHeight - 10, { align: 'center' });
    
    doc.save(`ahorro-inteligente-${Date.now()}.pdf`);
    alert('📄 ¡PDF descargado! Revísalo en tu carpeta de descargas.');
}

// 19. Compartir app
function compartirApp() {
    const urlApp = window.location.href;
    const texto = `📱 ¡Descarga "Ahorro Inteligente"! La app que te ayuda a ahorrar dinero en cada compra del supermercado. \n\n👉 Descárgala gratis aquí: ${urlApp}`;
    
    if (navigator.share) {
        navigator.share({ title: 'Ahorro Inteligente', text: texto, url: urlApp }).catch(err => console.log('Error al compartir:', err));
    } else {
        navigator.clipboard.writeText(texto).then(() => {
            alert('📋 ¡Enlace copiado! Compártelo por WhatsApp o donde quieras.');
        }).catch(() => {
            alert('⚠️ No se pudo copiar. Copia este enlace manualmente:\n\n' + urlApp);
        });
    }
}

// 20. Comparar historial (con colores corregidos)
function compararHistorialSeleccionado() {
    if (!verificarPremium()) {
        abrirModal();
        return;
    }
    
    const checkboxes = document.querySelectorAll('.history-checkbox:checked');
    
    if (checkboxes.length < 2) {
        alert('⚠️ Selecciona al menos 2 comparaciones del historial para comparar.');
        return;
    }
    
    const historial = JSON.parse(localStorage.getItem('historial') || '[]');
    
    const seleccionadas = [];
    checkboxes.forEach(cb => {
        const index = parseInt(cb.dataset.index);
        if (historial[index]) {
            seleccionadas.push({ ...historial[index], index: index });
        }
    });
    
    const analisis = seleccionadas.map(item => {
        const costoA = convertirAPrecioPorUnidadBase(parseFloat(item.pA), parseFloat(item.cA), item.uA);
        const costoB = convertirAPrecioPorUnidadBase(parseFloat(item.pB), parseFloat(item.cB), item.uB);
        const costoMinimo = Math.min(costoA, costoB);
        const productoGanador = costoA < costoB ? 'A' : 'B';
        
        return { ...item, costoA, costoB, costoMinimo, productoGanador };
    }).sort((a, b) => a.costoMinimo - b.costoMinimo);
    
    const modoOscuro = document.body.classList.contains('dark-mode');
    const bgVerde = modoOscuro ? '#064e3b' : '#ecfdf5';
    const bgGris = modoOscuro ? '#334155' : '#f8fafc';
    const textoColor = modoOscuro ? '#e2e8f0' : '#1e293b';
    const textoSecundario = modoOscuro ? '#cbd5e1' : '#64748b';
    const verdeColor = modoOscuro ? '#6ee7b7' : '#059669';
    const rojoColor = modoOscuro ? '#fca5a5' : '#dc2626';
    
    let html = `<h3 style="text-align:center; margin-bottom:15px; color: ${textoColor};">📊 Ranking de tus Compras</h3>`;
    
    const ganador = analisis[0];
    const nombreGanador = ganador.productoGanador === 'A' ? (ganador.nA || 'Producto A') : (ganador.nB || 'Producto B');
    
    html += `
        <div style="background: ${bgVerde}; border: 3px solid #059669; padding: 15px; border-radius: 12px; margin-bottom: 15px; text-align: center;">
            <h4 style="color: ${verdeColor}; margin-bottom: 8px;">🏆 Tu compra más económica</h4>
            <p style="font-size: 0.9rem; color: ${textoColor};">La mejor fue <strong>${nombreGanador}</strong> el ${ganador.fecha}</p>
        </div>
    `;
    
    html += `<h4 style="margin-bottom: 10px; color: ${textoColor};">📋 Ranking de todas las comparaciones:</h4>`;
    
    analisis.forEach((item, index) => {
        const medalla = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📦';
        const esMasBarata = index === 0;
        const diferencia = item.costoMinimo - analisis[0].costoMinimo;
        
        const nombreA = item.nA || 'Producto A';
        const nombreB = item.nB || 'Producto B';
        
        const bgItem = esMasBarata ? bgVerde : bgGris;
        const borderItem = esMasBarata ? '#059669' : (modoOscuro ? '#475569' : '#cbd5e1');
        const colorPrecio = esMasBarata ? verdeColor : textoColor;
        
        html += `
            <div style="background: ${bgItem}; padding: 12px; border-radius: 10px; margin-bottom: 8px; border-left: 4px solid ${borderItem};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; flex-wrap: wrap; gap: 5px;">
                    <strong style="color: ${textoColor};">${medalla} ${item.fecha}</strong>
                    <span style="font-weight: bold; color: ${colorPrecio}; font-size: 0.85rem;">$${Math.round(item.costoMinimo).toLocaleString('es-CO')} / unidad</span>
                </div>
                <small style="color: ${textoSecundario};">${nombreA} vs ${nombreB}</small>
                ${diferencia > 0 
                    ? `<p style="font-size: 0.8rem; color: ${rojoColor}; margin-top: 5px; font-weight: bold;">+$${Math.round(diferencia).toLocaleString('es-CO')} más caro</p>` 
                    : `<p style="font-size: 0.8rem; color: ${verdeColor}; margin-top: 5px; font-weight: bold;">✅ Mejor precio</p>`
                }
            </div>
        `;
    });
    
    html += `
        <div style="background: ${modoOscuro ? '#78350f' : '#fef3c7'}; border: 2px solid #f59e0b; padding: 15px; border-radius: 10px; margin-top: 15px;">
            <h5 style="color: ${modoOscuro ? '#fde68a' : '#92400e'}; margin-bottom: 8px;">💡 Consejo Inteligente:</h5>
            <p style="font-size: 0.9rem; color: ${modoOscuro ? '#fef3c7' : '#78350f'};">${generarConsejoHistorial(analisis)}</p>
        </div>
    `;
    
    resultText.innerHTML = html;
    savingsText.innerHTML = '';
    resultCard.classList.remove('hidden');
    resultCard.scrollIntoView({ behavior: 'smooth' });
}

function generarConsejoHistorial(analisis) {
    if (analisis.length < 2) return 'Selecciona más comparaciones para obtener un consejo.';
    
    const mejor = analisis[0];
    const peor = analisis[analisis.length - 1];
    const diferencia = peor.costoMinimo - mejor.costoMinimo;
    
    if (diferencia < 1) {
        return 'Tus compras tienen precios muy parecidos. ¡Cualquiera de ellas es una buena opción!';
    }
    
    const porcentaje = ((diferencia / peor.costoMinimo) * 100).toFixed(0);
    
    if (porcentaje > 50) {
        return `¡Gran diferencia! La compra del <strong>${mejor.fecha}</strong> fue <strong>${porcentaje}% más económica</strong> que la más cara. Aprende de esa compra y repítela.`;
    } else if (porcentaje > 20) {
        return `La compra del <strong>${mejor.fecha}</strong> fue <strong>${porcentaje}% más económica</strong>. Es una diferencia notable que vale la pena tener en cuenta.`;
    } else {
        return `Aunque hay diferencias, son menores al 20%. Prioriza la tienda que te quede más cerca y cómoda.`;
    }
}

// 21. Al cargar
window.addEventListener('load', () => {
    aplicarModoOscuroGuardado();
    if (verificarPremium()) {
        activarPremiumVisual();
    }
});

// 22. PWA
let deferredPrompt;
const btnInstalar = document.getElementById('btnInstalar');

function verificarSiEstaInstalada() {
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
        btnInstalar.style.display = 'none';
        localStorage.setItem('appInstalada', 'true');
        return true;
    }
    if (localStorage.getItem('appInstalada') === 'true') {
        btnInstalar.style.display = 'none';
        return true;
    }
    return false;
}

verificarSiEstaInstalada();

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (!verificarSiEstaInstalada()) {
        btnInstalar.style.display = 'block';
    }
});

window.addEventListener('appinstalled', () => {
    localStorage.setItem('appInstalada', 'true');
    btnInstalar.style.display = 'none';
    deferredPrompt = null;
    console.log('✅ App instalada correctamente');
});

btnInstalar.addEventListener('click', () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('App instalada');
                localStorage.setItem('appInstalada', 'true');
                btnInstalar.style.display = 'none';
            }
            deferredPrompt = null;
        });
    } else {
        alert('ℹ️ Usa el menú del navegador y selecciona "Agregar a pantalla de inicio".');
    }
});