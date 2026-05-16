// app.js - Repositorio Magallanes (Versión Leaflet)

let map;
let markers = [];
let currentSection = 'inicio';
let darkMode = false;

// Datos de ubicación - Punta Arenas, Chile
const locations = {
    invernaderos: [
        { name: "Invernadero Sol Austral", lat: -53.1547, lng: -70.9113 },
        { name: "Invernadero Las Vertientes", lat: -53.1500, lng: -70.9050 },
        { name: "Invernadero Sur", lat: -53.1600, lng: -70.9150 },
        { name: "Quinta Los Andes", lat: -53.1480, lng: -70.9080 }
    ],
    bancos: [
        { name: "Banco Natales", lat: -53.1520, lng: -70.9100 },
        { name: "Banco Centro", lat: -53.1547, lng: -70.9113 },
        { name: "Banco Sur", lat: -53.1580, lng: -70.9140 },
        { name: "Banco Oriente", lat: -53.1530, lng: -70.9080 },
        { name: "Banco Norte", lat: -53.1500, lng: -70.9120 },
        { name: "Banco Costa", lat: -53.1560, lng: -70.9160 }
    ],
    distribuidoras: [
        { name: "Distribuidora Magallanes", lat: -53.1490, lng: -70.9070 },
        { name: "Transportes del Sur", lat: -53.1550, lng: -70.9130 },
        { name: "Logística Austral", lat: -53.1510, lng: -70.9090 }
    ]
};

// Rutas de distribución (formato Leaflet: [lat, lng])
const routes = [
    {
        path: [
            [-53.1547, -70.9113], [-53.1520, -70.9100], [-53.1547, -70.9113]
        ],
        color: "#40916c",
        name: "Ruta Norte"
    },
    {
        path: [
            [-53.1500, -70.9050], [-53.1580, -70.9140], [-53.1560, -70.9160]
        ],
        color: "#4361ee",
        name: "Ruta Sur"
    }
];

// Inicializar mapa Leaflet
function initMap() {
    if (!document.getElementById('map')) return;
    
    // Crear mapa centrado en Punta Arenas
    map = L.map('map').setView([-53.1547, -70.9113], 14);

    // Capa base de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    addMarkers();
    drawRoutes();
    
    // Ajustar vista para mostrar todos los puntos
    setTimeout(() => {
        if (markers.length > 0) {
            const group = L.featureGroup(markers);
            map.fitBounds(group.getBounds().pad(0.2));
        }
    }, 100);
}

// Crear iconos personalizados para marcadores
function createIcon(color) {
    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="background:${color};width:30px;height:30px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
}

// Agregar marcadores al mapa
function addMarkers() {
    const greenIcon = createIcon('#40916c');
    const blueIcon = createIcon('#4361ee');
    const redIcon = createIcon('#f72585');

    // Invernaderos (verde)
    locations.invernaderos.forEach(loc => {
        const marker = L.marker([loc.lat, loc.lng], {icon: greenIcon})
            .addTo(map)
            .bindPopup(`<b>${loc.name}</b><br><span style="color:#40916c">🥬 Invernadero</span>`);
        markers.push(marker);
    });

    // Bancos de alimentos (azul)
    locations.bancos.forEach(loc => {
        const marker = L.marker([loc.lat, loc.lng], {icon: blueIcon})
            .addTo(map)
            .bindPopup(`<b>${loc.name}</b><br><span style="color:#4361ee">🏪 Banco de Alimentos</span>`);
        markers.push(marker);
    });

    // Distribuidoras (rojo)
    locations.distribuidoras.forEach(loc => {
        const marker = L.marker([loc.lat, loc.lng], {icon: redIcon})
            .addTo(map)
            .bindPopup(`<b>${loc.name}</b><br><span style="color:#f72585">🚚 Distribuidora</span>`);
        markers.push(marker);
    });
}

// Dibujar rutas de distribución
function drawRoutes() {
    routes.forEach(route => {
        L.polyline(route.path, {
            color: route.color,
            weight: 4,
            opacity: 0.9,
            dashArray: '10, 8'
        }).addTo(map).bindTooltip(route.name, {sticky: true});
    });
}

// Navegación entre secciones
function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.style.animation = 'none';
        setTimeout(() => {
            targetSection.style.animation = 'fadeIn 0.5s ease';
        }, 10);
    }
    
    if (event?.target?.closest) {
        event.target.closest('.nav-link')?.classList.add('active');
    }
    
    currentSection = sectionId;
    
    // Si es la sección de mapa, inicializar/redimensionar
    if (sectionId === 'mapa') {
        setTimeout(() => {
            if (!map) {
                initMap();
            } else {
                map.invalidateSize();
                map.setView([-53.1547, -70.9113], 14);
            }
        }, 100);
    }
    
    return false;
}

// Toggle Modo Oscuro
function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode', darkMode);
    
    if (darkMode) {
        document.body.style.backgroundColor = '#1a1a2e';
        document.body.style.color = '#ffffff';
    } else {
        document.body.style.backgroundColor = '#f8f9fa';
        document.body.style.color = '#2d3436';
    }
    
    // Actualizar mapa si existe
    if (map) {
        const tiles = document.querySelectorAll('.leaflet-tile-pane');
        tiles.forEach(tile => {
            tile.style.filter = darkMode ? 'invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%)' : 'none';
        });
    }
    
    showNotification('success', `Modo ${darkMode ? 'Oscuro' : 'Claro'} activado`);
}

// Cambiar tamaño de fuente
function changeFontSize(size) {
    const html = document.documentElement;
    html.style.fontSize = size === 'small' ? '14px' : size === 'large' ? '18px' : '16px';
    showNotification('info', 'Tamaño de fuente actualizado');
}

// Filtrar productos
function filterProducts() {
    const category = document.getElementById('filterCategory')?.value || '';
    const status = document.getElementById('filterStatus')?.value || '';
    const search = (document.getElementById('searchProduct')?.value || '').toLowerCase();
    
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const productCategory = product.getAttribute('data-category');
        const productStatus = product.getAttribute('data-status');
        const productName = product.querySelector('.card-title')?.textContent.toLowerCase() || '';
        
        let show = true;
        if (category && productCategory !== category) show = false;
        if (status && productStatus !== status) show = false;
        if (search && !productName.includes(search)) show = false;
        
        product.style.display = show ? 'block' : 'none';
        if (show) product.style.animation = 'fadeIn 0.3s ease';
    });
}

// Solicitar producto
function requestProduct(productName) {
    showModal(
        'Solicitar Producto',
        `¿Desea solicitar <strong>${productName}</strong>? Se notificará al banco de alimentos seleccionado.`,
        () => showNotification('success', `Solicitud de ${productName} enviada correctamente`)
    );
}

// Ver banco de alimentos
function viewFoodbank(bankName) {
    showModal(bankName, `
        <strong>Detalles del banco:</strong><br><br>
        <strong>Capacidad:</strong> 500 familias<br>
        <strong>Productos almacenados:</strong> 120 kg<br>
        <strong>Voluntarios:</strong> 15 personas<br>
        <strong>Horario:</strong> 9:00 - 18:00 hrs
    `, null, 'Cerrar');
}

// Distribuir a banco
function distributeTo(bankName) {
    showModal(
        'Distribución',
        `¿Confirmar distribución de productos a <strong>${bankName}</strong>?`,
        () => showNotification('success', `Distribución a ${bankName} programada exitosamente`)
    );
}

// Contactar distribuidora
function contactDistributor(distributorName) {
    showModal(
        'Contactar Distribuidora',
        `¿Desea contactar a <strong>${distributorName}</strong> para coordinar una distribución?`,
        () => showNotification('info', `Contactando a ${distributorName}...`)
    );
}

// Editar perfil / Cambiar contraseña
function editProfile() { showModal('Editar Perfil', 'Función en desarrollo...', null, 'Cerrar'); }
function changePassword() { showModal('Cambiar Contraseña', 'Función en desarrollo...', null, 'Cerrar'); }

// Logout
function logout() {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
        window.location.href = 'index.html';
    }
}

// Mostrar modal
function showModal(title, body, onConfirm, confirmText = 'Confirmar') {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = body;
    
    const confirmBtn = document.getElementById('modalConfirm');
    confirmBtn.textContent = confirmText;
    
    if (onConfirm) {
        confirmBtn.onclick = () => {
            onConfirm();
            bootstrap.Modal.getInstance(document.getElementById('notificationModal'))?.hide();
        };
        confirmBtn.style.display = 'block';
    } else {
        confirmBtn.style.display = 'none';
    }
    
    const modal = new bootstrap.Modal(document.getElementById('notificationModal'));
    modal.show();
}

// Mostrar notificación
function showNotification(type, message) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Gráfico de categorías
    const ctx = document.getElementById('categoryChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Hortalizas de hoja', 'Frutas', 'Hortalizas de fruto', 'Hierbas y otros'],
                datasets: [{
                    data: [40, 25, 20, 15],
                    backgroundColor: ['#40916c', '#f4a261', '#e76f51', '#2a9d8f'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'bottom', labels: { padding: 15, usePointStyle: true } }
                }
            }
        });
    }
    
    // Filtro en tiempo real
    const searchInput = document.getElementById('searchProduct');
    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }
    
    // Inicializar mapa si estamos en la sección de mapa
    if (document.getElementById('mapa')?.classList.contains('active')) {
        setTimeout(initMap, 200);
    }
});

// Manejo de errores
window.onerror = function(msg, url, lineNo) {
    console.error('Error: ' + msg + ' | Línea: ' + lineNo);
    return false;
};