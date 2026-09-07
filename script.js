// Variables globales
let unidadesA = 'kilogramos';
let unidadesB = 'gramos';
let tiendaA = 'D1';
let tiendaB = 'D1';

// Elementos del DOM
const priceA = document.getElementById('priceA');
const qtyA = document.getElementById('qtyA');
const priceB = document.getElementById('priceB');
const qtyB = document.getElementById('qtyB');
const resultCard = document.getElementById('resultCard');
const resultText = document.getElementById('resultText');
const savingsText = document.getElementById('savingsText');
const historyContainer = document.getElementById('historyContainer');
const shoppingListContainer = document.getElementById('shoppingListContainer');

// Elementos Premium
const premiumProducts = document.getElementById('premiumProducts');
const dynamicContainer = document.getElementById('dynamicContainer');
const addProductBtn = document.getElementById('addProductBtn');
const premiumWelcome = document.getElementById('premiumWelcome');
const btnEscanear = document.getElementById('btnEscanear');

// Variables del escáner
const readerDiv = document.getElementById('reader');
let html5QrCode = null;
let escaneando = false;

// Contador para productos ilimitados (F, G, H...)
let dynamicProductCount = 0;

// 1. Verificar si el Premium sigue activo (1 mes)
function verificarPremium() {
    const fechaExpiracion = localStorage.getItem('premiumExpiracion');
    if (!fechaExpiracion) return false;
    const hoy = new Date();
    const expiracion = new Date(fechaExpiracion);
    if (hoy < expiracion) {
        return true;
    } else {
        localStorage.removeItem('premiumExpiracion');
        return false;
    }
}

// 2. Guardar la expiración (1 mes = 30 días)
function guardarExpiracionPremium() {
    const fechaActual = new Date();
    fechaActual.setDate(fechaActual.getDate() + 30);
    localStorage.setItem('premiumExpiracion', fechaActual.toISOString());
}

// 3. Función para desbloquear todo visualmente
function activarPremiumVisual() {
    premiumProducts.style.filter = 'none';
    premiumProducts.style.pointerEvents = 'auto';
    premiumProducts.style.userSelect = 'auto';
    premiumProducts.style.opacity = '1';
    
    const overlay = document.querySelector('.lock-overlay');
    if (overlay) overlay.style.display = 'none';

    addProductBtn.style.display = 'block';

    // 🔥 CORRECCIÓN: Ocultar el botón verde cuando es Premium
    const btnCompararGratis = document.getElementById('compareBtnFree');
    if (btnCompararGratis) btnCompararGratis.style.display = 'none';

    const btnCompararPremium = document.getElementById('compareAllBtn');
    if (btnCompararPremium) btnCompararPremium.style.display = 'block';

    btnEscanear.style.display = 'block';

    const btnDarkMode = document.getElementById('darkModeBtn');
    if (btnDarkMode) btnDarkMode.style.display = 'block';

    const hotmartAd = document.getElementById('hotmartAd');
    if (hotmartAd) hotmartAd.style.display = 'none';

    const hotmartBtnPremium = document.getElementById('hotmartBtnPremium');
    if (hotmartBtnPremium) hotmartBtnPremium.style.display = 'block';

    premiumWelcome.style.display = 'block';
}

// 4. Manejo de selección de unidades
function setupUnits(containerId, callback) {
    const container = document.getElementById(containerId);
    container.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            callback(btn.dataset.unit);
        });
    });
}

// Selección de tiendas
document.getElementById('tiendaA').addEventListener('change', (e) => tiendaA = e.target.value);
document.getElementById('tiendaB').addEventListener('change', (e) => tiendaB = e.target.value);

setupUnits('unitA', (unit) => unidadesA = unit);
setupUnits('unitB', (unit) => unidadesB = unit);
setupUnits('unitC', (unit) => { /* Default kg */ });
setupUnits('unitD', (unit) => { /* Default kg */ });
setupUnits('unitE', (unit) => { /* Default kg */ });

// 5. Función para convertir todo a un valor base
function convertirAPrecioPorUnidadBase(precio, cantidad, unidad) {
    let cantidadBase = cantidad;
    if (unidad === 'kilogramos') cantidadBase = cantidad * 1000;
    else if (unidad === 'litros') cantidadBase = cantidad * 1000;
    if (cantidadBase <= 0) return null;
    return precio / cantidadBase;
}

// 6. Comparar 2 Productos (Gratis)
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

    let resultadoHTML = '';
    let ahorroHTML = '';

    if (costoUnitarioA < costoUnitarioB) {
        resultadoHTML = `
            <div class="winner-box">
                <h3 style="color: #059669; font-size: 1.4rem;">🏆 ¡El Producto A es más barato!</h3>
                <p>Cuesta <strong>$${Math.round(costoUnitarioA).toLocaleString('es-CO')}</strong> / unidad en <strong>${tiendaA}</strong>, mientras que B cuesta $${Math.round(costoUnitarioB).toLocaleString('es-CO')} / unidad en <strong>${tiendaB}</strong>.</p>
            </div>
        `;
        const ahorroTotal = (costoUnitarioB - costoUnitarioA) * cantidadA;
        ahorroHTML = `<p>💰 ¡Ahorras $${ahorroTotal.toLocaleString('es-CO')} en esta compra!</p>`;
    } else if (costoUnitarioB < costoUnitarioA) {
        resultadoHTML = `
            <div class="winner-box">
                <h3 style="color: #059669; font-size: 1.4rem;">🏆 ¡El Producto B es más barato!</h3>
                <p>Cuesta <strong>$${Math.round(costoUnitarioB).toLocaleString('es-CO')}</strong> / unidad en <strong>${tiendaB}</strong>, mientras que A cuesta $${Math.round(costoUnitarioA).toLocaleString('es-CO')} / unidad en <strong>${tiendaA}</strong>.</p>
            </div>
        `;
        const ahorroTotal = (costoUnitarioA - costoUnitarioB) * cantidadB;
        ahorroHTML = `<p>💰 ¡Ahorras $${ahorroTotal.toLocaleString('es-CO')} en esta compra!</p>`;
    } else {
        resultadoHTML = `<div style="text-align:center; font-weight:bold;">🤝 Ambos productos tienen el mismo costo por unidad.</div>`;
    }

    resultText.innerHTML = resultadoHTML;
    savingsText.innerHTML = ahorroHTML;
    resultCard.classList.remove('hidden');
    guardarHistorial(priceA.value, qtyA.value, unidadesA, priceB.value, qtyB.value, unidadesB);
    
    // Reproducir sonido de éxito
    const sonido = document.getElementById('successSound');
    if (sonido) sonido.play();
}

// 7. Botones y funciones básicas
document.getElementById('compareBtnFree').addEventListener('click', comparar);

document.getElementById('clearBtn').addEventListener('click', () => {
    ['priceA', 'qtyA', 'priceB', 'qtyB', 'priceC', 'qtyC', 'priceD', 'qtyD', 'priceE', 'qtyE'].forEach(id => document.getElementById(id).value = '');
    dynamicContainer.innerHTML = '';
    dynamicProductCount = 0;
    resultCard.classList.add('hidden');
    shoppingListContainer.style.display = 'none';
});

// 8. Historial
function guardarHistorial(pA, cA, uA, pB, cB, uB) {
    const historial = JSON.parse(localStorage.getItem('historial') || '[]');
    historial.unshift({ pA, cA, uA, pB, cB, uB, fecha: new Date().toLocaleString() });
    if (historial.length > 5) historial.pop();
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
    historial.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
            <strong>A: $${item.pA} (${item.cA} ${item.uA})</strong> vs <strong>B: $${item.pB} (${item.cB} ${item.uB})</strong>
            <br><small>${item.fecha}</small>
        `;
        historyContainer.appendChild(div);
    });
}

mostrarHistorial();

// 9. Limpiar historial
document.getElementById('clearHistoryBtn').addEventListener('click', () => {
    if (confirm('¿Seguro que quieres borrar todo el historial?')) {
        localStorage.removeItem('historial');
        mostrarHistorial();
    }
});

// 10. Lógica Premium
function abrirModal() {
    document.getElementById('premiumModal').style.display = 'flex';
}

// Función para agregar productos ilimitados
function agregarProducto() {
    const letra = String.fromCharCode(70 + dynamicProductCount); 
    
    const nuevoProducto = `
        <section class="card product-card premium-card dynamic-premium" id="producto${letra}">
            <h2>🛒 Producto ${letra} <span class="badge-premium">⭐ Premium</span></h2>
            <div class="input-group">
                <label for="price${letra}">Precio ($):</label>
                <input type="number" id="price${letra}" placeholder="Ej: 15000" step="any">
            </div>
            <div class="input-group">
                <label for="qty${letra}">Cantidad:</label>
                <input type="number" id="qty${letra}" placeholder="Ej: 300" step="any">
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
    
    setupUnits(`unit${letra}`, (unit) => { /* No hacemos nada especial */ });
}

function eliminarProducto(letra) {
    const producto = document.getElementById(`producto${letra}`);
    if (producto) {
        producto.remove();
        dynamicProductCount--;
    }
}

// Función para desbloquear Premium (Pago)
function desbloquearPremium() {
    guardarExpiracionPremium();
    activarPremiumVisual();
    document.getElementById('premiumModal').style.display = 'none';
    alert('🎉 ¡Premium activado por 1 mes! Disfruta de todas las funciones sin límites.');
}

document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('premiumModal').style.display = 'none';
});

document.getElementById('premiumModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('premiumModal')) {
        document.getElementById('premiumModal').style.display = 'none';
    }
});

// 11. Función Premium: Comparar Todos (Sin límites)
function compararPremium() {
    const productos = [
        { nombre: 'A', precio: document.getElementById('priceA').value, cantidad: document.getElementById('qtyA').value, unidad: unidadesA },
        { nombre: 'B', precio: document.getElementById('priceB').value, cantidad: document.getElementById('qtyB').value, unidad: unidadesB },
        { nombre: 'C', precio: document.getElementById('priceC').value, cantidad: document.getElementById('qtyC').value, unidad: 'kilogramos' },
        { nombre: 'D', precio: document.getElementById('priceD').value, cantidad: document.getElementById('qtyD').value, unidad: 'kilogramos' },
        { nombre: 'E', precio: document.getElementById('priceE').value, cantidad: document.getElementById('qtyE').value, unidad: 'kilogramos' }
    ];

    for (let i = 0; i < dynamicProductCount; i++) {
        const letra = String.fromCharCode(70 + i);
        const precio = document.getElementById(`price${letra}`).value;
        const cantidad = document.getElementById(`qty${letra}`).value;
        if (precio && cantidad) {
            productos.push({ nombre: letra, precio, cantidad, unidad: 'kilogramos' });
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

    let html = '<h3 style="text-align:center; margin-bottom:15px;">🏆 Ranking de Precios</h3>';
    
    ranking.forEach((p, index) => {
        const medalla = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📦';
        const estilo = index === 0 ? 'background:#ecfdf5; border:2px solid #059669;' : 'background:#f8fafc;';
        
        const costoMostrar = Math.round(p.costoUnit).toLocaleString('es-CO');
        
        html += `
            <div style="${estilo} padding: 12px; border-radius: 10px; margin-bottom: 10px;">
                <strong>${medalla} Producto ${p.nombre}</strong> 
                <span style="float:right; font-weight:bold;">$${costoMostrar} / unidad</span>
            </div>
        `;
    });

    resultText.innerHTML = html;
    savingsText.innerHTML = '';
    resultCard.classList.remove('hidden');
    
    // Reproducir sonido de éxito
    const sonido = document.getElementById('successSound');
    if (sonido) sonido.play();
}

// 12. Función Premium: Modo Oscuro manual
function toggleDarkMode() {
    const body = document.body;
    const isDark = body.style.backgroundColor === 'rgb(15, 23, 42)';
    
    if (isDark) {
        body.style.backgroundColor = '#f1f5f9';
        body.style.color = '#1e293b';
        document.getElementById('darkModeBtn').innerText = '🌙 Modo Oscuro';
    } else {
        body.style.backgroundColor = '#0f172a';
        body.style.color = '#e2e8f0';
        document.getElementById('darkModeBtn').innerText = '☀️ Modo Claro';
    }
}

// 13. Lista de compras
function mostrarListaCompras() {
    const lista = JSON.parse(localStorage.getItem('listaCompras') || '[]');
    if (lista.length === 0) {
        alert('Aún no tienes productos guardados.');
        return;
    }
    
    shoppingListContainer.style.display = 'block';
    let total = 0;
    
    let html = '<h3 style="margin-bottom: 15px;">🛒 Mi Lista de Compras</h3>';
    lista.forEach((item, index) => {
        total += parseFloat(item.precioTotal);
        html += `
            <div class="shopping-item">
                <div>
                    <strong>Producto ${item.nombre}</strong> - ${item.tienda}<br>
                    <small>Precio total: $${Math.round(item.precioTotal).toLocaleString('es-CO')}</small>
                </div>
                <button onclick="eliminarDeLista(${index})">🗑️</button>
            </div>
        `;
    });
    
    html += `<div style="text-align: center; font-weight: bold; margin-top: 15px; font-size: 1.2rem;">💰 Total: $${Math.round(total).toLocaleString('es-CO')}</div>`;
    historyContainer.innerHTML = html;
}

function guardarEnLista(nombre, tienda, precioTotal) {
    const lista = JSON.parse(localStorage.getItem('listaCompras') || '[]');
    lista.push({ nombre, tienda, precioTotal });
    localStorage.setItem('listaCompras', JSON.stringify(lista));
}

function eliminarDeLista(index) {
    const lista = JSON.parse(localStorage.getItem('listaCompras') || '[]');
    lista.splice(index, 1);
    localStorage.setItem('listaCompras', JSON.stringify(lista));
    mostrarListaCompras();
}

// 14. AL CARGAR LA APP, VERIFICAR SI EL PREMIUM SIGUE ACTIVO
window.addEventListener('load', () => {
    if (verificarPremium()) {
        activarPremiumVisual();
    }
});

// 15. Lógica PWA (Instalación)
let deferredPrompt;
const btnInstalar = document.getElementById('btnInstalar');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    btnInstalar.style.display = 'block';
});

btnInstalar.addEventListener('click', () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') console.log('App instalada');
            deferredPrompt = null;
            btnInstalar.style.display = 'none';
        });
    } else {
        alert('Usa el menú del navegador y selecciona "Agregar a pantalla de inicio"');
    }
});

// 16. Función para abrir el escáner (Con cámara trasera forzada)
function abrirEscaneo() {
    // 🔥 SI NO ES PREMIUM, SE ABRE EL MODAL DE COMPRA
    if (!verificarPremium()) {
        abrirModal();
        return;
    }

    if (escaneando) {
        cerrarEscaneo();
        return;
    }

    readerDiv.style.display = 'block';
    
    // Usar Html5Qrcode directamente para más control
    html5QrCode = new Html5Qrcode("reader");
    
    html5QrCode.start(
        { facingMode: "environment" }, // Fuerza cámara trasera
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText, decodedResult) => {
            // Éxito al escanear
            alert('📷 ¡Código escaneado! ' + decodedText);
            buscarProductoPorCodigo(decodedText);
            
            // Detener y cerrar
            html5QrCode.stop().then(() => {
                html5QrCode.clear();
                readerDiv.style.display = 'none';
                escaneando = false;
            }).catch(err => console.log(err));
        },
        (errorMessage) => {
            // Ignorar errores de escaneo
        }
    ).catch(err => {
        console.error("Error al iniciar la cámara:", err);
        alert("No se pudo abrir la cámara. Verifica que estés usando HTTPS o localhost, y tengas permisos.");
    });
    
    escaneando = true;
}

function cerrarEscaneo() {
    if (html5QrCode) {
        html5QrCode.stop().then(() => {
            html5QrCode.clear();
            readerDiv.style.display = 'none';
        }).catch(err => console.log(err));
    }
    readerDiv.style.display = 'none';
    escaneando = false;
}

// 17. Función para buscar producto en una API
async function buscarProductoPorCodigo(codigo) {
    const apiKey = document.getElementById('apiKeyInput').value;
    
    if (!apiKey) {
        alert('Por favor, ingresa tu API Key en el campo de configuración para buscar el producto automáticamente.');
        return;
    }

    try {
        const response = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${codigo}`);
        
        if (response.ok) {
            const data = await response.json();
            if (data.items && data.items.length > 0) {
                const producto = data.items[0];
                alert(`✅ Producto encontrado: ${producto.title}\nPrecio: ${producto.offers ? producto.offers[0].price : 'No disponible'}`);
            } else {
                alert('Producto no encontrado en la base de datos.');
            }
        } else {
            alert('Error al buscar el producto.');
        }
    } catch (error) {
        console.error('Error en la API:', error);
        alert('Error de conexión con la API.');
    }
}