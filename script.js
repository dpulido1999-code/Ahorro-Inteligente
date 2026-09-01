// ============================================================
// 1. FUNCIÓN PARA OBTENER LA UNIDAD SELECCIONADA
// ============================================================
function getSelectedUnit(unitContainerId) {
  const container = document.getElementById(unitContainerId);
  const activeBtn = container.querySelector('button.active');
  return activeBtn ? activeBtn.dataset.unit : 'unidades';
}

function getUnitLabel(unit) {
  const labels = {
    'unidades': 'unidad',
    'gramos': 'g',
    'kilogramos': 'kg',
    'mililitros': 'ml',
    'litros': 'L'
  };
  return labels[unit] || 'unidad';
}

// ============================================================
// 2. SELECTORES DE UNIDAD - CLICK PARA CAMBIAR
// ============================================================
document.querySelectorAll('.unit-selector').forEach(container => {
  container.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', function() {
      container.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });
});

// ============================================================
// 3. FUNCIÓN PARA CONVERTIR A UNIDAD BASE (GRAMOS O ML)
// ============================================================
function convertirAUnidadBase(cantidad, unidad) {
  // Para peso: convertir todo a gramos (g)
  if (unidad === 'kilogramos') {
    return cantidad * 1000; // 1 kg = 1000 g
  }
  if (unidad === 'gramos') {
    return cantidad; // ya está en gramos
  }
  // Para volumen: convertir todo a mililitros (ml)
  if (unidad === 'litros') {
    return cantidad * 1000; // 1 L = 1000 ml
  }
  if (unidad === 'mililitros') {
    return cantidad; // ya está en ml
  }
  // Para unidades: no convertir
  return cantidad;
}

// ============================================================
// 4. FUNCIÓN PARA OBTENER LA ETIQUETA DE UNIDAD BASE
// ============================================================
function getUnidadBaseLabel(unidad) {
  if (unidad === 'kilogramos' || unidad === 'gramos') {
    return 'g';
  }
  if (unidad === 'litros' || unidad === 'mililitros') {
    return 'ml';
  }
  return 'unidad';
}

// ============================================================
// 5. COMPARADOR GRATIS (2 productos) - CORREGIDO
// ============================================================
document.getElementById('compareBtn').addEventListener('click', function () {
  const priceA = parseFloat(document.getElementById('priceA').value);
  const qtyA = parseFloat(document.getElementById('qtyA').value);
  const priceB = parseFloat(document.getElementById('priceB').value);
  const qtyB = parseFloat(document.getElementById('qtyB').value);

  const unitA = getSelectedUnit('unitA');
  const unitB = getSelectedUnit('unitB');

  // CONVERTIR a unidad base ANTES de calcular el precio por unidad
  const qtyBaseA = convertirAUnidadBase(qtyA, unitA);
  const qtyBaseB = convertirAUnidadBase(qtyB, unitB);

  const labelBase = getUnidadBaseLabel(unitA);

  const resultCard = document.getElementById('resultCard');
  const resultTitle = document.getElementById('resultTitle');
  const resultText = document.getElementById('resultText');
  const savingsText = document.getElementById('savingsText');

  if (isNaN(priceA) || isNaN(qtyA) || isNaN(priceB) || isNaN(qtyB) || qtyA <= 0 || qtyB <= 0) {
    alert('⚠️ Por favor, ingresa precios y cantidades válidos mayores a cero.');
    return;
  }

  // AHORA ambos precios están en la misma unidad base (g o ml)
  const unitPriceA = priceA / qtyBaseA;
  const unitPriceB = priceB / qtyBaseB;

  resultCard.classList.remove('hidden');

  if (unitPriceA < unitPriceB) {
    const savingsPercent = (((unitPriceB - unitPriceA) / unitPriceB) * 100).toFixed(1);
    resultTitle.textContent = '🏆 ¡Conviene el Producto A!';
    resultText.innerHTML = `
      🥇 Producto A: $${unitPriceA.toFixed(2)} / ${labelBase}<br>
      🥈 Producto B: $${unitPriceB.toFixed(2)} / ${labelBase}
    `;
    savingsText.textContent = `¡Ahorras un ${savingsPercent}% comprando el Producto A!`;
  } else if (unitPriceB < unitPriceA) {
    const savingsPercent = (((unitPriceA - unitPriceB) / unitPriceA) * 100).toFixed(1);
    resultTitle.textContent = '🏆 ¡Conviene el Producto B!';
    resultText.innerHTML = `
      🥇 Producto B: $${unitPriceB.toFixed(2)} / ${labelBase}<br>
      🥈 Producto A: $${unitPriceA.toFixed(2)} / ${labelBase}
    `;
    savingsText.textContent = `¡Ahorras un ${savingsPercent}% comprando el Producto B!`;
  } else {
    resultTitle.textContent = '⚖️ ¡Mismo Precio!';
    resultText.innerHTML = `
      💲 Producto A: $${unitPriceA.toFixed(2)} / ${labelBase}<br>
      💲 Producto B: $${unitPriceB.toFixed(2)} / ${labelBase}
    `;
    savingsText.textContent = 'Ambos productos cuestan exactamente lo mismo por unidad.';
  }
});

// ============================================================
// 6. COMPARADOR PREMIUM (hasta 5 productos) - CORREGIDO
// ============================================================
document.getElementById('comparePremiumBtn').addEventListener('click', function () {
  const products = [
    { name: 'Producto A', price: parseFloat(document.getElementById('priceA').value), qty: parseFloat(document.getElementById('qtyA').value), unit: getSelectedUnit('unitA') },
    { name: 'Producto B', price: parseFloat(document.getElementById('priceB').value), qty: parseFloat(document.getElementById('qtyB').value), unit: getSelectedUnit('unitB') },
    { name: 'Producto C', price: parseFloat(document.getElementById('priceC').value), qty: parseFloat(document.getElementById('qtyC').value), unit: getSelectedUnit('unitC') },
    { name: 'Producto D', price: parseFloat(document.getElementById('priceD').value), qty: parseFloat(document.getElementById('qtyD').value), unit: getSelectedUnit('unitD') },
    { name: 'Producto E', price: parseFloat(document.getElementById('priceE').value), qty: parseFloat(document.getElementById('qtyE').value), unit: getSelectedUnit('unitE') }
  ];

  const validProducts = products.filter(p => !isNaN(p.price) && !isNaN(p.qty) && p.price > 0 && p.qty > 0);

  if (validProducts.length < 3) {
    alert('⚠️ Para usar la función Premium, ingresa al menos 3 productos válidos.');
    return;
  }

  const results = validProducts.map(p => {
    const qtyBase = convertirAUnidadBase(p.qty, p.unit);
    const labelBase = getUnidadBaseLabel(p.unit);
    return {
      name: p.name,
      unitPrice: p.price / qtyBase,
      unitLabel: labelBase,
    };
  });

  const sorted = results.sort((a, b) => a.unitPrice - b.unitPrice);

  const resultCard = document.getElementById('resultCard');
  const resultTitle = document.getElementById('resultTitle');
  const resultText = document.getElementById('resultText');
  const savingsText = document.getElementById('savingsText');

  resultCard.classList.remove('hidden');
  resultTitle.textContent = '🏆 Ranking Premium (de más barato a más caro)';

  const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
  let html = `<div style="font-size:0.8rem; color:#6b7280; margin-bottom:8px;">📊 Precio por unidad</div>`;
  sorted.forEach((item, index) => {
    const medal = medals[index] || '🔹';
    const color = index === 0 ? '#16a34a' : index === 1 ? '#f59e0b' : '#ef4444';
    html += `<div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #e2e8f0;">
      <span>${medal} <strong>${item.name}</strong></span>
      <span style="color:${color}; font-weight:bold;">$${item.unitPrice.toFixed(2)} / ${item.unitLabel}</span>
    </div>`;
  });

  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  const savingsPercent = (((worst.unitPrice - best.unitPrice) / worst.unitPrice) * 100).toFixed(1);

  resultText.innerHTML = html;
  savingsText.innerHTML = `
    🎯 <strong>${best.name}</strong> es el más barato con $${best.unitPrice.toFixed(2)} / ${best.unitLabel}<br>
    💰 Ahorras un <strong>${savingsPercent}%</strong> comparado con el más caro (${worst.name})
  `;
});

// ============================================================
// 7. BOTÓN PREMIUM - ABRIR MODAL Y ACTIVAR PRODUCTOS
// ============================================================
document.getElementById('btnPremium').addEventListener('click', function() {
  document.getElementById('premiumModal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
});

document.getElementById('closeModal').addEventListener('click', function() {
  document.getElementById('premiumModal').style.display = 'none';
  document.body.style.overflow = 'auto';
});

document.getElementById('premiumModal').addEventListener('click', function(e) {
  if (e.target === this) {
    this.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

// ============================================================
// 8. DETECTAR SI EL USUARIO YA ES PREMIUM
// ============================================================
function checkPremiumStatus() {
  const isPremium = localStorage.getItem('isPremium') === 'true';
  const premiumProducts = document.getElementById('premiumProducts');
  const comparePremiumBtn = document.getElementById('comparePremiumBtn');
  const btnPremium = document.getElementById('btnPremium');
  
  if (isPremium) {
    premiumProducts.style.display = 'block';
    comparePremiumBtn.style.display = 'block';
    btnPremium.textContent = '⭐ Premium ✅';
    btnPremium.style.background = 'linear-gradient(135deg, #059669, #10b981)';
    btnPremium.style.cursor = 'default';
  }
}

checkPremiumStatus();

// ============================================================
// 9. BOTÓN DE INSTALACIÓN
// ============================================================
document.getElementById('btnInstalar').addEventListener('click', function() {
  const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  
  let mensaje = '';
  if (isChrome) {
    mensaje = '📱 En Chrome:\n\n1. Toca los 3 puntos (⋮)\n2. Selecciona "Instalar aplicación"\n3. Confirma la instalación';
  } else if (isSafari) {
    mensaje = '📱 En Safari:\n\n1. Toca "Compartir" (⬆️)\n2. Toca "Agregar a pantalla de inicio"\n3. Confirma';
  } else {
    mensaje = '📱 Para instalar:\n\n• Chrome: Menú → "Instalar aplicación"\n• Safari: Compartir → "Agregar a pantalla de inicio"';
  }
  alert(mensaje);
});

// ============================================================
// 10. VALORES DE EJEMPLO
// ============================================================
console.log('✅ App cargada correctamente');
console.log('📱 Ahorro Inteligente - Premium con unidades de medida');