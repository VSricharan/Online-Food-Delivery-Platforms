// ─── Dashboard Core JS ──────────────────────────────────────────────────────
// Static data
const demandData = [
    { week: 'W1 Jan', actual: 820, predicted: 790 }, { week: 'W2 Jan', actual: 950, predicted: 920 },
    { week: 'W3 Jan', actual: 880, predicted: 910 }, { week: 'W4 Jan', actual: 1020, predicted: 980 },
    { week: 'W1 Feb', actual: 1100, predicted: 1050 }, { week: 'W2 Feb', actual: 1050, predicted: 1080 },
    { week: 'W3 Feb', actual: 1190, predicted: 1150 }, { week: 'W4 Feb', actual: 1080, predicted: 1120 },
    { week: 'W1 Mar', actual: 1240, predicted: 1200 }, { week: 'W2 Mar', actual: 1380, predicted: 1350 },
    { week: 'W3 Mar', actual: 1320, predicted: 1360 }, { week: 'W4 Mar', actual: 1480, predicted: 1440 },
    { week: 'W1 Apr', actual: 1550, predicted: 1510 }, { week: 'W2 Apr', actual: 1620, predicted: 1580 },
    { week: 'W3 Apr', actual: 1500, predicted: 1560 }, { week: 'W4 Apr', actual: 1720, predicted: 1680 },
    { week: 'W1 May', actual: 1800, predicted: 1760 }, { week: 'W2 May', actual: 1680, predicted: 1750 },
    { week: 'W3 May', actual: 1920, predicted: 1880 }, { week: 'W4 May', actual: 2050, predicted: 2000 },
    { week: 'W1 Jun', actual: null, predicted: 2100 }, { week: 'W2 Jun', actual: null, predicted: 2200 },
    { week: 'W3 Jun', actual: null, predicted: 2150 }, { week: 'W4 Jun', actual: null, predicted: 2320 },
    { week: 'W1 Jul', actual: null, predicted: 2450 }, { week: 'W2 Jul', actual: null, predicted: 2380 },
];
const deliveryData = [
    { hour: '8AM', time: 32 }, { hour: '10AM', time: 28 }, { hour: '12PM', time: 42 }, { hour: '2PM', time: 25 },
    { hour: '4PM', time: 30 }, { hour: '6PM', time: 48 }, { hour: '8PM', time: 52 }, { hour: '10PM', time: 35 },
];
const categoryData = [
    { name: 'Fast Food', value: 35, color: '#0A84FF' }, { name: 'Indian', value: 28, color: '#5AC8FA' },
    { name: 'Chinese', value: 18, color: '#34C759' }, { name: 'Pizza', value: 12, color: '#FF9F0A' },
    { name: 'Others', value: 7, color: '#AF52DE' },
];
const recentOrders = [
    { id: 'ORD-8291', restaurant: 'Burger Palace', cuisine: 'Fast Food', time: '24 min', status: 'delivered', time_ago: '2m ago' },
    { id: 'ORD-8290', restaurant: 'Spice Garden', cuisine: 'Indian', time: '38 min', status: 'in-transit', time_ago: '5m ago' },
    { id: 'ORD-8289', restaurant: 'Pizza Hub', cuisine: 'Pizza', time: '31 min', status: 'preparing', time_ago: '8m ago' },
    { id: 'ORD-8288', restaurant: 'Dragon Wok', cuisine: 'Chinese', time: '22 min', status: 'delivered', time_ago: '12m ago' },
    { id: 'ORD-8287', restaurant: 'Fresh Bowl', cuisine: 'Healthy', time: '29 min', status: 'delivered', time_ago: '18m ago' },
    { id: 'ORD-8286', restaurant: 'Taco Town', cuisine: 'Mexican', time: '35 min', status: 'cancelled', time_ago: '25m ago' },
];
const navItems = [
    { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>', label: 'Dashboard', id: 'dashboard' },
    { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>', label: 'Analytics', id: 'analytics' },
    { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>', label: 'Predictions', id: 'predictions' },
    { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>', label: 'Orders', id: 'orders' },
    { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>', label: 'Reports', id: 'reports' },
    { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>', label: 'Settings', id: 'settings' },
];
const notifications = [
    { text: 'Demand prediction updated for 6PM peak', time: '2m ago', icon: '📈', type: 'demand' },
    { text: 'Cloud sync completed successfully', time: '15m ago', icon: '☁️', type: 'system' },
    { text: 'New ML model trained: Accuracy 80.0%', time: '1h ago', icon: '⭐', type: 'retrain' },
    { text: '50 orders delivered in last hour', time: '2h ago', icon: '✅', type: 'delivery' },
];

// ─── State ──────────────────────────────────────────────────────────────────
let activeSection = 'dashboard';
let sidebarCollapsed = false;
let chartInstances = {};
let syncIntervalId = null;

// ─── Cloud Sync Logic ───────────────────────────────────────────────────────
function initCloudSync() {
    if (syncIntervalId) clearInterval(syncIntervalId);

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : {};
    const settings = user.settings || {};

    // Parse interval e.g. "Every 5 minutes" -> 5
    const intervalStr = settings.cloudSync || 'Every 5 minutes';
    const minutes = parseInt(intervalStr.replace(/[^0-9]/g, '')) || 5;

    console.log(`Cloud Sync initialized: Refreshing every ${minutes} minute(s)`);

    syncIntervalId = setInterval(() => {
        console.log('Syncing with cloud...');
        // Refresh the current section if it's one of the data-heavy ones
        if (activeSection === 'dashboard') { window.location.reload(); } // Dashboard has many charts, reload is simplest for now
        else if (activeSection === 'analytics') loadAnalytics();
        else if (activeSection === 'predictions') loadPredictions();
        else if (activeSection === 'orders') loadOrders();

        showToast('Synchronized with cloud provider', 'success');
    }, minutes * 60000);
}

// ─── Auth Guard ─────────────────────────────────────────────────────────────
function checkAuth() {
    if (!localStorage.getItem('token')) {
        window.location.href = 'auth.html';
        return;
    }
    // Verify token with backend
    apiGetMe().catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'auth.html';
    });
}

function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// ─── Sidebar ────────────────────────────────────────────────────────────────
function renderSidebar() {
    const nav = document.getElementById('sidebar-nav');
    nav.innerHTML = navItems.map(item => `
        <button onclick="setActiveSection('${item.id}')" data-nav="${item.id}"
            class="sidebar-link w-full relative ${activeSection === item.id
            ? 'text-primary dark:text-blue-400'
            : 'text-text-secondary dark:text-dark-text-muted hover:bg-bg-secondary dark:hover:bg-gray-800 hover:text-text-primary dark:hover:text-dark-text'
        } ${sidebarCollapsed ? 'justify-center px-2' : ''}" title="${sidebarCollapsed ? item.label : ''}">
            ${activeSection === item.id ? '<div class="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-xl"></div>' : ''}
            <span class="relative z-10 flex-shrink-0">${item.icon}</span>
            ${sidebarCollapsed ? '' : `<span class="relative z-10">${item.label}</span>`}
        </button>
    `).join('');
}

function toggleSidebar() {
    sidebarCollapsed = !sidebarCollapsed;
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('w-64', !sidebarCollapsed);
    sidebar.classList.toggle('w-16', sidebarCollapsed);
    document.querySelectorAll('.sidebar-label').forEach(el => el.style.display = sidebarCollapsed ? 'none' : '');
    renderSidebar();
}

// ─── Section switching ──────────────────────────────────────────────────────
function setActiveSection(id) {
    activeSection = id;
    document.querySelectorAll('.section-content').forEach(el => el.classList.add('hidden'));
    const target = document.getElementById('section-' + id);
    if (target) { target.classList.remove('hidden'); target.classList.add('animate-fade-in'); }
    document.getElementById('topbar-title').textContent = id;

    const globalSearch = document.getElementById('global-search-container');
    if (globalSearch) {
        globalSearch.style.display = id === 'dashboard' ? '' : 'none';
        if (id !== 'dashboard') {
            const dropdown = document.getElementById('search-dropdown');
            if (dropdown) dropdown.classList.add('hidden');
        }
    }

    renderSidebar();
    // Load data for section if needed
    if (id === 'analytics' && !target.dataset.loaded) { loadAnalytics(); target.dataset.loaded = '1'; }
    if (id === 'predictions' && !target.dataset.loaded) { loadPredictions(); target.dataset.loaded = '1'; }
    if (id === 'orders' && !target.dataset.loaded) { loadOrders(); target.dataset.loaded = '1'; }
    if (id === 'reports' && !target.dataset.loaded) { loadReports(); target.dataset.loaded = '1'; }
    if (id === 'settings' && !target.dataset.loaded) { renderSettings(); target.dataset.loaded = '1'; }
}

// ─── Dropdowns ──────────────────────────────────────────────────────────────
function closeDropdowns() {
    document.getElementById('notif-dropdown').classList.add('hidden');
    document.getElementById('profile-dropdown').classList.add('hidden');
}
function toggleNotifications() {
    document.getElementById('profile-dropdown').classList.add('hidden');
    document.getElementById('notif-dropdown').classList.toggle('hidden');
}
function toggleProfileMenu() {
    document.getElementById('notif-dropdown').classList.add('hidden');
    document.getElementById('profile-dropdown').classList.toggle('hidden');
}
function showProfileModal() {
    const m = document.getElementById('profile-modal'); m.classList.remove('hidden'); m.classList.add('flex');
}
function hideProfileModal() {
    const m = document.getElementById('profile-modal'); m.classList.add('hidden'); m.classList.remove('flex');
}

function showOrderModal(details) {
    if (!details) return;
    document.getElementById('order-modal-title').textContent = `Order at ${details.Restaurant_Type || 'Unknown'}`;
    document.getElementById('order-modal-id').textContent = details.computedId || 'N/A';
    document.getElementById('order-modal-restaurant').textContent = details.Restaurant_Type || 'Unknown';
    document.getElementById('order-modal-city').textContent = details.Cities || 'Unknown';
    document.getElementById('order-modal-medium').textContent = details.Medium || 'Unknown';
    document.getElementById('order-modal-meal').textContent = details.Meal || 'Unknown';
    document.getElementById('order-modal-cost').textContent = `₹${details.Avg_Cost || '0'}`;

    // Check if there is an ETA or Delivery_Time property, default to 30m if missing in CSV
    let timeRaw = details.Delivery_Time_Minutes || details.Delivery_Time || 30;
    document.getElementById('order-modal-time').textContent = typeof timeRaw === 'number' ? `${timeRaw}m` : String(timeRaw).replace(/[^0-9]/g, '') + 'm';

    const m = document.getElementById('order-modal'); m.classList.remove('hidden'); m.classList.add('flex');
}

function hideOrderModal() {
    const m = document.getElementById('order-modal'); m.classList.add('hidden'); m.classList.remove('flex');
}
document.addEventListener('click', (e) => {
    if (!e.target.closest('#notif-dropdown') && !e.target.closest('[onclick*="toggleNotifications"]')) document.getElementById('notif-dropdown')?.classList.add('hidden');
    if (!e.target.closest('#profile-dropdown') && !e.target.closest('[onclick*="toggleProfileMenu"]')) document.getElementById('profile-dropdown')?.classList.add('hidden');
});

// ─── Status Badge helper ────────────────────────────────────────────────────
function statusBadge(status) {
    const cfg = {
        delivered: { label: 'Delivered', cls: 'text-green-700 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/50 dark:text-green-400', icon: '✓' },
        'in-transit': { label: 'In Transit', cls: 'text-blue-700 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/50 dark:text-blue-400', icon: '🚚' },
        preparing: { label: 'Preparing', cls: 'text-orange-700 bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800/50 dark:text-orange-400', icon: '⏳' },
        cancelled: { label: 'Cancelled', cls: 'text-red-700 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/50 dark:text-red-400', icon: '✕' },
    };
    const c = cfg[status] || cfg.delivered;
    return `<span class="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border ${c.cls}">${c.icon} ${c.label}</span>`;
}

// ─── Privacy Masking Helper ─────────────────────────────────────────────────
function applyPrivacyMask(text, type = 'text') {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : {};
    const settings = user.settings || {};

    const isAnon = settings.dataAnon === true;
    const isGdpr = settings.dataGdpr === true;

    if (!isAnon && !isGdpr) return text;

    if (type === 'city' && isGdpr) return 'Protected Region';
    if (type === 'money' && isAnon) return '₹***';
    if (type === 'number' && isAnon) return '***';
    if (type === 'email' && isGdpr) return text.replace(/^(.{2}).*@/, '$1***@');
    if (type === 'name' && isAnon) return 'Customer ' + Math.floor(Math.random() * 900 + 100);

    return text;
}

// ─── Destroy chart helper ───────────────────────────────────────────────────
function destroyChart(id) { if (chartInstances[id]) { chartInstances[id].destroy(); delete chartInstances[id]; } }

// ─── Custom HTML Tooltip ────────────────────────────────────────────────────
const getOrCreateTooltip = (chart) => {
    let tooltipEl = chart.canvas.parentNode.querySelector('div.custom-tooltip');
    if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.style.color = '#F9FAFB';
        tooltipEl.className = 'custom-tooltip bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-xl shadow-large dark:shadow-none p-3 text-xs min-w-[150px] pointer-events-none absolute z-50 transition-all duration-150 ease-out';
        tooltipEl.style.opacity = 1;

        const table = document.createElement('div');
        table.className = 'tooltip-content';
        tooltipEl.appendChild(table);
        chart.canvas.parentNode.appendChild(tooltipEl);
    }
    return tooltipEl;
};

const customTooltipHandler = (context) => {
    const { chart, tooltip } = context;
    const tooltipEl = getOrCreateTooltip(chart);

    if (tooltip.opacity === 0) {
        tooltipEl.style.opacity = 0;
        return;
    }

    if (tooltip.body) {
        const titleLines = tooltip.title || [];
        const bodyLines = tooltip.body.map(b => b.lines);

        let innerHtml = '';

        // Title
        titleLines.forEach(title => {
            innerHtml += `<div class="font-bold text-text-primary dark:text-dark-text mb-2 text-sm">${title}</div>`;
        });

        // Body Elements
        let actualVal = null;
        let predVal = null;

        tooltip.dataPoints.forEach((dp, i) => {
            const label = dp.dataset.label;
            const val = dp.raw;
            const color = dp.dataset.borderColor || dp.dataset.backgroundColor;

            if (label === 'Actual') actualVal = val;
            if (label === 'Predicted') predVal = val;

            innerHtml += `
                <div class="flex justify-between items-center gap-4 mb-1">
                    <span class="flex items-center gap-1.5 text-text-secondary dark:text-dark-text-muted">
                        <span class="w-2.5 h-2.5 rounded-full inline-block" style="background-color: ${color};"></span>
                        ${label}
                    </span>
                    <span class="font-bold text-text-primary dark:text-dark-text" style="color: ${color};">${val.toLocaleString()}</span>
                </div>
            `;
        });

        // Add Diff for Demand/Hourly charts
        if (actualVal !== null && predVal !== null) {
            const diff = actualVal - predVal;
            const diffClass = diff >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400';
            const diffSign = diff >= 0 ? '+' : '';
            innerHtml += `
                <div class="flex justify-between items-center gap-4 pt-1.5 border-t border-gray-100 dark:border-dark-border mt-1.5 font-semibold ${diffClass}">
                    <span>Δ Diff</span>
                    <span>${diffSign}${diff.toLocaleString()}</span>
                </div>
            `;
        }

        tooltipEl.querySelector('.tooltip-content').innerHTML = innerHtml;
    }

    const position = context.chart.canvas.getBoundingClientRect();

    // Position Tooltip dynamically right next to the cursor (smooth glide)
    // The offset is large (65px) so the tooltip box stands completely clear
    // of the vertical crosshair line and looks floating and mesmerising.
    let offsetX = 65;
    let tooltipX = tooltip.caretX + offsetX;

    // Position it vertically aligned centered on the data point
    let tooltipY = tooltip.caretY - (tooltipEl.offsetHeight / 2);

    // Prevent going off right edge (flip to the left side of the cursor)
    if (tooltipX + (tooltipEl.offsetWidth || 150) > position.width - 10) {
        tooltipX = tooltip.caretX - (tooltipEl.offsetWidth || 150) - offsetX;
    }

    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = tooltipX + 'px';
    tooltipEl.style.top = tooltipY + 'px';
};

// ─── Simple Recharts Tooltip (For Analytics Hourly Trend) ───────────────────
const simpleTooltipHandler = (context) => {
    const { chart, tooltip } = context;
    let tooltipEl = chart.canvas.parentNode.querySelector('div.simple-tooltip');
    if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.style.background = 'rgba(31, 41, 55, 0.9)';
        tooltipEl.style.border = '1px solid #374151';
        tooltipEl.style.color = '#F9FAFB';
        tooltipEl.className = 'simple-tooltip rounded p-3 text-xs min-w-[120px] pointer-events-none absolute z-50 transition-opacity duration-200';
        tooltipEl.style.opacity = 1;

        const contentDiv = document.createElement('div');
        contentDiv.className = 'tooltip-content';
        tooltipEl.appendChild(contentDiv);
        chart.canvas.parentNode.appendChild(tooltipEl);
    }

    if (tooltip.opacity === 0) {
        tooltipEl.style.opacity = 0;
        return;
    }

    if (tooltip.body) {
        const titleLines = tooltip.title || [];
        let innerHtml = '';

        titleLines.forEach(title => {
            innerHtml += `<div class="mb-3">${title}</div>`;
        });

        tooltip.dataPoints.forEach(dp => {
            const label = dp.dataset.label;
            const val = dp.raw;
            innerHtml += `<div class="mb-1.5 last:mb-0">${label} : ${val}</div>`;
        });

        tooltipEl.querySelector('.tooltip-content').innerHTML = innerHtml;
    }

    const position = context.chart.canvas.getBoundingClientRect();
    let tooltipX = tooltip.caretX + 15;
    let tooltipY = tooltip.caretY - 20;

    if (tooltipX + tooltipEl.offsetWidth > position.width) {
        tooltipX = tooltip.caretX - tooltipEl.offsetWidth - 15;
    }

    tooltipEl.style.opacity = 1;
    tooltipEl.style.left = tooltipX + 'px';
    tooltipEl.style.top = Math.max(0, tooltipY) + 'px';
};

// ─── Crosshair Plugin ───────────────────────────────────────────────────────
const crosshairPlugin = {
    id: 'crosshair',
    afterDraw: chart => {
        if (chart.tooltip?._active?.length) {
            const ctx = chart.ctx;
            const x = chart.tooltip._active[0].element.x;
            const yAxis = chart.scales.y;

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, yAxis.top);
            ctx.lineTo(x, yAxis.bottom);
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.2)';
            ctx.stroke();
            ctx.restore();
        }
    }
};


// ─── Notifications panel ────────────────────────────────────────────────────
function renderNotifications() {
    // Determine which notifications to show based on user's saved settings
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : {};
    const settings = user.settings || {};

    // Default to true if not defined
    const showDemand = settings.notifDemand !== false;
    const showSystem = settings.notifSystem !== false;
    const showRetrain = settings.notifRetrain !== false;
    const showDelivery = settings.notifDelivery !== false;

    // Filter the raw notifications array
    const visibleNotifs = notifications.filter(n => {
        if (n.type === 'demand' && !showDemand) return false;
        if (n.type === 'system' && !showSystem) return false;
        if (n.type === 'retrain' && !showRetrain) return false;
        if (n.type === 'delivery' && !showDelivery) return false;
        return true;
    });

    const listHtml = visibleNotifs.length > 0
        ? visibleNotifs.map(n => `
            <div class="flex items-start gap-3 px-4 py-3 hover:bg-bg-secondary dark:hover:bg-dark-surface transition-colors cursor-pointer border-b border-gray-50 dark:border-dark-border last:border-0">
                <div class="w-8 h-8 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 text-sm">${n.icon}</div>
                <div class="flex-1 min-w-0">
                    <p class="text-xs text-text-primary dark:text-dark-text leading-relaxed">${n.text}</p>
                    <p class="text-xs text-text-secondary dark:text-dark-text-muted mt-0.5">${n.time}</p>
                </div>
            </div>
          `).join('')
        : `<div class="p-6 text-center text-xs text-text-secondary">No new notifications</div>`;

    document.getElementById('notif-list').innerHTML = listHtml;

    // Update badge count if element exists
    const badge = document.querySelector('.header-icon-btn.relative .absolute');
    if (badge) {
        badge.textContent = visibleNotifs.length;
        badge.style.display = visibleNotifs.length > 0 ? 'flex' : 'none';
    }
}

// ─── DASHBOARD SECTION ──────────────────────────────────────────────────────
function renderDashboard() {
    const stats = [
        { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>', label: 'Total Orders', value: '2,000', change: '+12.5%', positive: true, color: '#0A84FF', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>', label: 'Predicted Demand', value: '2,450', change: '+23.4%', positive: true, color: '#AF52DE', bg: 'bg-purple-50 dark:bg-purple-900/20' },
        { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5"/><path d="M14 17h1"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>', label: 'Active Deliveries', value: '284', change: '+8.1%', positive: true, color: '#34C759', bg: 'bg-green-50 dark:bg-green-900/20' },
        { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>', label: 'Customer Satisfaction', value: '80.5%', change: '+3.2%', positive: true, color: '#FF9F0A', bg: 'bg-orange-50 dark:bg-orange-900/20' },
    ];

    const el = document.getElementById('section-dashboard');
    el.innerHTML = `
    <div class="space-y-8">
        <!-- Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            ${stats.map(s => `
                <div class="stat-card transition-all duration-300 cursor-default hover:-translate-y-1 hover:shadow-medium">
                    <div class="flex items-start justify-between mb-4">
                        <div class="w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center text-xl" style="color: ${s.color}">${s.icon}</div>
                        <div class="flex items-center gap-1 text-xs font-semibold ${s.positive ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}">
                            ${s.positive ? '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="7" x2="17" y2="17"/><polyline points="17 7 17 17 7 17"/></svg>'} ${s.change}
                        </div>
                    </div>
                    <div class="text-2xl font-extrabold text-text-primary dark:text-dark-text">${s.value}</div>
                    <div class="text-sm text-text-secondary dark:text-dark-text-muted mt-1">${s.label}</div>
                </div>
            `).join('')}
        </div>

        <!-- Charts Row -->
        <div class="grid lg:grid-cols-3 gap-6">
            <!-- Demand Chart -->
            <div class="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-soft dark:shadow-none border border-gray-100 dark:border-dark-border lg:col-span-2 transition-colors duration-300">
                <div class="flex items-center justify-between mb-1">
                    <div><h3 class="font-bold text-text-primary dark:text-dark-text">Order Demand Prediction</h3>
                    <p class="text-xs text-text-secondary dark:text-dark-text-muted mt-0.5">Weekly actual orders vs ML-predicted demand</p></div>
                    <div class="flex items-center gap-4 text-xs">
                        <div class="flex items-center gap-1.5"><div class="w-8 h-0.5 bg-primary rounded"></div><span class="text-text-secondary">Actual</span></div>
                        <div class="flex items-center gap-1.5"><div class="w-8 h-0.5 border-t-2 border-dashed border-purple-400"></div><span class="text-text-secondary">Predicted</span></div>
                    </div>
                </div>
                <div class="flex gap-6 mb-4 mt-2">
                    <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl px-4 py-2 text-center"><div class="text-xs text-text-secondary dark:text-dark-text-muted">Avg Actual</div><div class="text-sm font-bold text-primary dark:text-blue-400">1,411/wk</div></div>
                    <div class="bg-purple-50 dark:bg-purple-900/20 rounded-xl px-4 py-2 text-center"><div class="text-xs text-text-secondary dark:text-dark-text-muted">Avg Predicted</div><div class="text-sm font-bold text-purple-500 dark:text-purple-400">1,378/wk</div></div>
                    <div class="bg-green-50 dark:bg-green-900/20 rounded-xl px-4 py-2 text-center"><div class="text-xs text-text-secondary dark:text-dark-text-muted">Model Accuracy</div><div class="text-sm font-bold text-green-600 dark:text-green-400">80.0%</div></div>
                    <div class="bg-orange-50 dark:bg-orange-900/20 rounded-xl px-4 py-2 text-center"><div class="text-xs text-text-secondary dark:text-dark-text-muted">Forecast Until</div><div class="text-sm font-bold text-orange-500 dark:text-orange-400">Jul 2025</div></div>
                </div>
                <div class="relative w-full h-[260px]"><canvas id="demandChart"></canvas></div>
                <p class="text-xs text-text-secondary dark:text-dark-text-muted mt-2 text-center">📌 Dashed line = ML forecast · Solid line = Actual orders · Orange marker = Forecast start</p>
            </div>
            <!-- Category Pie -->
            <div class="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-soft dark:shadow-none border border-gray-100 dark:border-dark-border transition-colors duration-300">
                <h3 class="font-bold text-text-primary dark:text-dark-text">Popular Food Categories</h3>
                <p class="text-xs text-text-secondary dark:text-dark-text-muted mt-0.5">Order distribution by cuisine</p>
                <div class="mt-4 relative w-full h-[150px]"><canvas id="categoryChart"></canvas></div>
                <div class="space-y-2 mt-2">
                    ${categoryData.map(c => `
                        <div class="flex items-center justify-between text-xs">
                            <div class="flex items-center gap-2"><div class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background:${c.color}"></div><span class="text-text-secondary dark:text-dark-text-muted">${c.name}</span></div>
                            <span class="font-semibold text-text-primary dark:text-dark-text">${c.value}%</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>

        <!-- Delivery Time -->
        <div class="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-soft dark:shadow-none border border-gray-100 dark:border-dark-border transition-colors duration-300">
            <div class="flex items-center justify-between mb-6">
                <div><h3 class="font-bold text-text-primary dark:text-dark-text">Delivery Time Analysis</h3>
                <p class="text-xs text-text-secondary dark:text-dark-text-muted mt-0.5">Average delivery time (minutes) by hour of day</p></div>
                <span class="text-xs font-medium px-3 py-1.5 bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-400 rounded-full">Today</span>
            </div>
            <div class="relative w-full h-[200px]"><canvas id="deliveryChart"></canvas></div>
            <div class="flex gap-5 mt-3">
                <div class="flex items-center gap-1.5 text-xs text-text-secondary dark:text-dark-text-muted"><div class="w-2.5 h-2.5 rounded-full" style="background:#34C759"></div>≤ 30 min — Fast</div>
                <div class="flex items-center gap-1.5 text-xs text-text-secondary dark:text-dark-text-muted"><div class="w-2.5 h-2.5 rounded-full" style="background:#FF9F0A"></div>31–40 min — Moderate</div>
                <div class="flex items-center gap-1.5 text-xs text-text-secondary dark:text-dark-text-muted"><div class="w-2.5 h-2.5 rounded-full" style="background:#FF453A"></div>> 40 min — Slow</div>
            </div>
        </div>

        <!-- Recent Orders Table -->
        <div class="bg-white dark:bg-dark-card rounded-2xl shadow-soft dark:shadow-none border border-gray-100 dark:border-dark-border overflow-hidden transition-colors duration-300">
            <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <div><h3 class="font-bold text-text-primary dark:text-dark-text">Recent Orders</h3>
                <p class="text-xs text-text-secondary dark:text-dark-text-muted mt-0.5">Latest order tracking and status</p></div>
                <button onclick="setActiveSection('orders')" class="text-xs font-semibold text-primary hover:underline">View All</button>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead><tr class="bg-bg-secondary dark:bg-dark-surface transition-colors duration-300">
                        ${['Order ID', 'Restaurant', 'Cuisine', 'Delivery Time', 'Status', 'Time'].map(h => `<th class="text-left text-xs font-semibold text-text-secondary uppercase tracking-wider px-6 py-3 whitespace-nowrap">${h}</th>`).join('')}
                    </tr></thead>
                    <tbody>
                        ${recentOrders.map(o => `
                            <tr class="border-t border-gray-50 dark:border-dark-border hover:bg-bg-secondary/50 dark:hover:bg-dark-surface transition-colors cursor-pointer">
                                <td class="px-6 py-4 text-sm font-semibold text-primary dark:text-blue-400 whitespace-nowrap">${o.id}</td>
                                <td class="px-6 py-4 text-sm font-medium text-text-primary dark:text-dark-text whitespace-nowrap">${applyPrivacyMask(o.restaurant, 'name')}</td>
                                <td class="px-6 py-4 text-sm text-text-secondary dark:text-dark-text-muted whitespace-nowrap">${o.cuisine}</td>
                                <td class="px-6 py-4 whitespace-nowrap"><div class="flex items-center gap-1.5 text-sm text-text-primary dark:text-dark-text"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-text-secondary"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> ${o.time}</div></td>
                                <td class="px-6 py-4 whitespace-nowrap">${statusBadge(o.status)}</td>
                                <td class="px-6 py-4 text-xs text-text-secondary dark:text-dark-text-muted whitespace-nowrap">${o.time_ago}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    </div>`;

    // Render charts
    setTimeout(() => {
        renderDemandChart();
        renderCategoryChart();
        renderDeliveryChart();
    }, 100);
}

// ─── Chart renderers ────────────────────────────────────────────────────────
// ─ Gradient Plugin for Area Fills and Forecast Line ─
const forecastLinePlugin = {
    id: 'forecastLine',
    beforeDraw: chart => {
        if (chart.config.options?.plugins?.forecastLine?.display) {
            const ctx = chart.ctx;
            const xAxis = chart.scales.x;
            const yAxis = chart.scales.y;
            const forecastTick = chart.config.options.plugins.forecastLine.label;

            // Find x-coordinate of the forecast tick
            let xCoord = null;
            xAxis.ticks.forEach((tick, i) => {
                if (tick.label === forecastTick) xCoord = xAxis.getPixelForTick(i);
            });

            if (xCoord !== null) {
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(xCoord, yAxis.top);
                ctx.lineTo(xCoord, yAxis.bottom);
                ctx.lineWidth = 1.5;
                ctx.strokeStyle = '#FF9F0A';
                ctx.setLineDash([4, 3]);
                ctx.stroke();

                // Draw "Forecast ->" label
                ctx.fillStyle = '#FF9F0A';
                ctx.font = 'bold 10px Inter';
                ctx.textAlign = 'right';
                ctx.textBaseline = 'top';
                ctx.fillText('Forecast →', xCoord - 6, yAxis.top + 5);
                ctx.restore();
            }
        }
    }
};

function renderDemandChart() {
    destroyChart('demandChart');
    const ctx = document.getElementById('demandChart');
    if (!ctx) return;

    // Create Gradients
    const actualGrad = ctx.getContext('2d').createLinearGradient(0, 0, 0, 260);
    actualGrad.addColorStop(0, 'rgba(10,132,255,0.2)');
    actualGrad.addColorStop(1, 'rgba(10,132,255,0.02)');

    const predGrad = ctx.getContext('2d').createLinearGradient(0, 0, 0, 260);
    predGrad.addColorStop(0, 'rgba(175,82,222,0.15)');
    predGrad.addColorStop(1, 'rgba(175,82,222,0.02)');

    chartInstances['demandChart'] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: demandData.map(d => d.week),
            datasets: [
                { label: 'Actual', data: demandData.map(d => d.actual), borderColor: '#0A84FF', backgroundColor: actualGrad, fill: true, tension: 0.4, borderWidth: 2.5, pointRadius: 3, pointBackgroundColor: '#0A84FF', hoverRadius: 6, hoverBackgroundColor: '#0A84FF', hoverBorderColor: '#fff', hoverBorderWidth: 2, spanGaps: false },
                { label: 'Predicted', data: demandData.map(d => d.predicted), borderColor: '#AF52DE', backgroundColor: predGrad, fill: true, tension: 0.4, borderWidth: 2, borderDash: [6, 3], pointRadius: 0, hoverRadius: 6, hoverBackgroundColor: '#AF52DE', hoverBorderColor: '#fff', hoverBorderWidth: 2 },
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    enabled: false,
                    position: 'nearest',
                    external: customTooltipHandler
                },
                forecastLine: { display: true, label: 'W1 Jun' }
            },
            scales: {
                x: { grid: { display: false }, ticks: { font: { size: 10, family: 'Inter' }, color: '#6E6E73', maxRotation: 0, autoSkip: true, maxTicksLimit: 8 } },
                y: { grid: { color: 'rgba(150, 150, 150, 0.15)', borderDash: [3, 3] }, ticks: { font: { size: 10, family: 'Inter' }, color: '#6E6E73', callback: v => (v / 1000).toFixed(1) + 'k' }, min: 600, max: 2600 }
            },
            interaction: { intersect: false, mode: 'index' }
        },
        plugins: [crosshairPlugin, forecastLinePlugin]
    });
}

function renderCategoryChart() {
    destroyChart('categoryChart');
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;
    chartInstances['categoryChart'] = new Chart(ctx, {
        type: 'doughnut',
        data: { labels: categoryData.map(c => c.name), datasets: [{ data: categoryData.map(c => c.value), backgroundColor: categoryData.map(c => c.color), borderWidth: 0, hoverOffset: 8 }] },
        options: {
            responsive: true, maintainAspectRatio: false, cutout: '60%',
            plugins: {
                legend: { display: false },
                tooltip: { backgroundColor: 'rgba(31, 41, 55, 0.95)', titleColor: '#F9FAFB', bodyColor: '#F9FAFB', callbacks: { label: (ctx) => ' ' + ctx.formattedValue + '%' } }
            }
        }
    });
}

function renderDeliveryChart() {
    destroyChart('deliveryChart');
    const ctx = document.getElementById('deliveryChart');
    if (!ctx) return;
    chartInstances['deliveryChart'] = new Chart(ctx, {
        type: 'bar',
        data: { labels: deliveryData.map(d => d.hour), datasets: [{ label: 'Avg Time', data: deliveryData.map(d => d.time), backgroundColor: deliveryData.map(d => d.time > 40 ? '#FF453A' : d.time > 30 ? '#FF9F0A' : '#34C759'), borderRadius: { topLeft: 6, topRight: 6 } }] },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { backgroundColor: 'rgba(31, 41, 55, 0.95)', titleColor: '#F9FAFB', bodyColor: '#D1D5DB', usePointStyle: true, padding: 12 }
            },
            scales: {
                x: { grid: { display: false }, ticks: { font: { size: 11, family: 'Inter' }, color: '#6E6E73' } },
                y: { grid: { color: 'rgba(150, 150, 150, 0.15)', borderDash: [3, 3] }, ticks: { font: { size: 11, family: 'Inter' }, color: '#6E6E73' } }
            },
            interaction: { intersect: false, mode: 'index' }
        }
    });
}

// ─── Global Search ────────────────────────────────────────────────────────────
let searchTimeout;
async function handleSearchInput(e) {
    const q = e.target.value.trim();
    const dropdown = document.getElementById('search-dropdown');
    const container = document.getElementById('search-results-container');

    if (q.length < 2) {
        dropdown.classList.add('hidden', 'opacity-0');
        return;
    }

    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
        try {
            // Re-check value just in case it was cleared during timeout
            if (document.getElementById('global-search-input').value.trim().length < 2) return;

            const res = await apiGlobalSearch(q);
            container.innerHTML = '';

            if (!res.results || res.results.length === 0) {
                container.innerHTML = `
                    <div class="p-4 text-center">
                        <div class="text-sm font-semibold text-text-primary dark:text-dark-text mb-1">No results found for "${q}"</div>
                        <div class="text-xs text-text-secondary dark:text-dark-text-muted">Try searching for platforms (Swiggy, Zomato), city tiers (Tier 1), or food types (Cafe, Quick Bites).</div>
                    </div>
                `;
            } else {
                res.results.forEach(item => {
                    const iconMap = {
                        'ShoppingBag': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
                        'Truck': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>',
                        'Globe': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-500"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>'
                    };
                    const icon = iconMap[item.icon] || '';

                    const el = document.createElement('div');
                    el.className = 'flex items-center gap-3 p-3 hover:bg-bg-secondary dark:hover:bg-dark-surface rounded-xl cursor-pointer transition-colors';
                    el.onclick = () => {
                        document.getElementById('global-search-input').value = item.title;
                        dropdown.classList.add('hidden', 'opacity-0');

                        if (item.type === 'order') {
                            showOrderModal(item.details);
                        } else if (item.type === 'restaurant') {
                            setActiveSection('analytics');
                            showToast(`Navigated to Analytics for ${item.title}`);
                        } else if (item.type === 'city') {
                            setActiveSection('analytics');
                            showToast(`Navigated to Analytics for ${item.title}`);
                        } else {
                            showToast(`Selected: ${item.title}`);
                        }
                    };
                    el.innerHTML = `
                        <div class="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">${icon}</div>
                        <div class="overflow-hidden">
                            <div class="text-sm font-semibold text-text-primary dark:text-dark-text truncate">${item.title}</div>
                            <div class="text-xs text-text-secondary dark:text-dark-text-muted truncate">${item.subtitle}</div>
                        </div>
                    `;
                    container.appendChild(el);
                });
            }

            dropdown.classList.remove('hidden');
            // Small delay to allow display block before opacity transition
            setTimeout(() => dropdown.classList.remove('opacity-0'), 10);

        } catch (e) {
            console.error('Search error', e);
        }
    }, 300);
}

function handleSearchFocus() {
    const q = document.getElementById('global-search-input').value.trim();
    if (q.length >= 2) {
        const dropdown = document.getElementById('search-dropdown');
        dropdown.classList.remove('hidden');
        setTimeout(() => dropdown.classList.remove('opacity-0'), 10);
    }
}

function handleSearchBlur() {
    // Delay hiding so clicks on the dropdown can register
    setTimeout(() => {
        const dropdown = document.getElementById('search-dropdown');
        dropdown.classList.add('opacity-0');
        setTimeout(() => dropdown.classList.add('hidden'), 200);
    }, 150);
}

// ─── Toast Notifications ────────────────────────────────────────────────────
function showToast(message, type = 'success') {
    // Check if toast container exists, if not create it
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-3';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const bgClass = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ️';

    toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl shadow-large text-white ${bgClass} transform translate-y-10 opacity-0 transition-all duration-300`;
    toast.innerHTML = `<span class="font-bold">${icon}</span><span class="text-sm font-medium">${message}</span>`;

    container.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-y-10', 'opacity-0');
    }, 10);

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('translate-y-10', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ─── User Profile ───────────────────────────────────────────────────────────
function loadUserProfileUI() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return;
    try {
        const user = JSON.parse(userStr);
        const name = user.name || 'User';
        const initial = name.charAt(0).toUpperCase();

        document.querySelectorAll('.user-display-name').forEach(el => el.textContent = name);
        document.querySelectorAll('.user-display-initial').forEach(el => el.textContent = initial);
        document.querySelectorAll('.user-display-role').forEach(el => el.textContent = user.role || 'User');
        document.querySelectorAll('.user-display-email').forEach(el => el.textContent = user.email || '');
    } catch (e) {
        console.error('Error parsing user data', e);
    }
}

// ─── Init ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadUserProfileUI();
    renderSidebar();
    renderNotifications();
    renderDashboard();
});
