// ─── Dashboard Sections JS (loaded after dashboard.js) ─────────────────────

// ─── ANALYTICS SECTION ──────────────────────────────────────────────────────
async function loadAnalytics() {
    const el = document.getElementById('section-analytics');
    el.innerHTML = '<div class="flex items-center justify-center h-96"><div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>';
    try {
        const data = await apiGetAnalytics();
        const COLORS = ['#0A84FF', '#AF52DE', '#34C759', '#FF9F0A', '#FF453A', '#5AC8FA'];
        el.innerHTML = `<div class="space-y-6 animate-fade-in">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                ${[{ l: 'Total Orders', v: data.summary?.totalOrders?.toLocaleString(), c: '#0A84FF' }, { l: 'Avg Order Value', v: '₹' + data.summary?.avgOrderValue, c: '#34C759' }, { l: 'High Demand %', v: data.summary?.highDemandPct + '%', c: '#FF9F0A' }, { l: 'Peak Hour', v: data.peakHour?.hour, c: '#AF52DE' }].map(s => `
                    <div class="bg-white dark:bg-dark-card rounded-2xl p-5 shadow-soft border border-gray-100 dark:border-dark-border">
                        <div class="text-xs text-text-secondary dark:text-dark-text-muted mb-1">${s.l}</div>
                        <div class="text-2xl font-bold" style="color:${s.c}">${s.v || '—'}</div>
                    </div>`).join('')}
            </div>
            <div class="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-dark-border">
                <h3 class="font-bold text-text-primary dark:text-dark-text mb-1">Hourly Order Trend</h3>
                <p class="text-xs text-text-secondary dark:text-dark-text-muted mb-4">Orders per hour — Actual vs ML predicted</p>
                <div class="relative w-full h-[240px]"><canvas id="analyticsHourlyChart"></canvas></div>
            </div>
            <div class="grid lg:grid-cols-2 gap-6">
                <div class="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-dark-border">
                    <h3 class="font-bold text-text-primary dark:text-dark-text mb-1">Platform Market Share</h3>
                    <p class="text-xs text-text-secondary dark:text-dark-text-muted mb-4">Orders by delivery platform</p>
                    <div class="relative w-full h-[180px]"><canvas id="analyticsPlatformChart"></canvas></div>
                    <div class="flex flex-wrap gap-3 mt-4">${(data.platformShare || []).map((p, i) => `<div class="flex flex-col items-center gap-1.5 text-xs"><div class="w-2.5 h-2.5 rounded-full" style="background:${COLORS[i % COLORS.length]}"></div><span class="text-text-secondary dark:text-dark-text-muted">${p.platform}</span><span class="font-semibold text-text-primary dark:text-dark-text">${p.percentage}%</span></div>`).join('')}</div>
                </div>
                <div class="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-dark-border">
                    <h3 class="font-bold text-text-primary dark:text-dark-text mb-1">Orders by City</h3>
                    <p class="text-xs text-text-secondary dark:text-dark-text-muted mb-4">Distribution across city tiers</p>
                    <div class="relative w-full h-[180px]"><canvas id="analyticsCityChart"></canvas></div>
                </div>
            </div>
            <div class="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-dark-border">
                <h3 class="font-bold text-text-primary dark:text-dark-text mb-1">Order Frequency Distribution</h3>
                <p class="text-xs text-text-secondary dark:text-dark-text-muted mb-4">How often customers order</p>
                <div class="relative w-full h-[200px]"><canvas id="analyticsFreqChart"></canvas></div>
            </div>
        </div>`;
        // Render charts
        setTimeout(() => {
            if (data.hourlyTrend) {
                destroyChart('analyticsHourlyChart');
                chartInstances['analyticsHourlyChart'] = new Chart(document.getElementById('analyticsHourlyChart'), {
                    type: 'line',
                    data: { labels: data.hourlyTrend.map(d => d.hour), datasets: [{ label: 'Actual', data: data.hourlyTrend.map(d => d.actual), borderColor: '#0A84FF', backgroundColor: 'transparent', fill: false, tension: .4, borderWidth: 2.5, pointRadius: 0, hoverRadius: 6, hoverBackgroundColor: '#0A84FF', hoverBorderColor: '#fff', hoverBorderWidth: 2 }, { label: 'Predicted', data: data.hourlyTrend.map(d => d.predicted), borderColor: '#AF52DE', backgroundColor: 'transparent', fill: false, tension: .4, borderWidth: 2, borderDash: [5, 3], pointRadius: 0, hoverRadius: 6, hoverBackgroundColor: '#AF52DE', hoverBorderColor: '#fff', hoverBorderWidth: 2 }] },
                    options: {
                        responsive: true, maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                enabled: false,
                                position: 'nearest',
                                external: simpleTooltipHandler
                            }
                        },
                        scales: {
                            x: { grid: { display: false }, ticks: { font: { size: 10, family: 'Inter' }, color: '#6E6E73' } },
                            y: { grid: { color: 'rgba(150, 150, 150, 0.15)', borderDash: [3, 3] }, ticks: { font: { size: 10, family: 'Inter' }, color: '#6E6E73' } }
                        },
                        interaction: { intersect: false, mode: 'index' }
                    },
                    plugins: [crosshairPlugin]
                });
            }
            if (data.platformShare) {
                destroyChart('analyticsPlatformChart');
                chartInstances['analyticsPlatformChart'] = new Chart(document.getElementById('analyticsPlatformChart'), {
                    type: 'doughnut',
                    data: { labels: data.platformShare.map(p => p.platform), datasets: [{ data: data.platformShare.map(p => p.orders), backgroundColor: COLORS, borderWidth: 0 }] },
                    options: {
                        responsive: true, maintainAspectRatio: false, cutout: '60%',
                        plugins: {
                            legend: { display: false },
                            tooltip: { backgroundColor: 'rgba(31, 41, 55, 0.95)', titleColor: '#F9FAFB', bodyColor: '#F9FAFB', callbacks: { label: (ctx) => ' ' + ctx.formattedValue + '%' } }
                        }
                    }
                });
            }
            if (data.cityPerformance) {
                destroyChart('analyticsCityChart');
                chartInstances['analyticsCityChart'] = new Chart(document.getElementById('analyticsCityChart'), {
                    type: 'bar',
                    data: { labels: data.cityPerformance.map(c => applyPrivacyMask(c.city, 'city')), datasets: [{ label: 'Orders', data: data.cityPerformance.map(c => c.orders), backgroundColor: '#0A84FF', borderRadius: 6 }] },
                    options: {
                        responsive: true, maintainAspectRatio: false, indexAxis: 'y',
                        plugins: {
                            legend: { display: false },
                            tooltip: { backgroundColor: 'rgba(31, 41, 55, 0.95)', titleColor: '#F9FAFB', bodyColor: '#D1D5DB', usePointStyle: true, padding: 12 }
                        },
                        scales: {
                            x: { grid: { color: 'rgba(150, 150, 150, 0.15)', borderDash: [3, 3] }, ticks: { font: { size: 10, family: 'Inter' }, color: '#6E6E73' } },
                            y: { grid: { display: false }, ticks: { font: { size: 10, family: 'Inter' }, color: '#6E6E73' } }
                        }
                    }
                });
            }
            if (data.frequencyData) {
                destroyChart('analyticsFreqChart');
                chartInstances['analyticsFreqChart'] = new Chart(document.getElementById('analyticsFreqChart'), {
                    type: 'bar',
                    data: { labels: data.frequencyData.map(f => f.frequency), datasets: [{ label: 'Orders', data: data.frequencyData.map(f => f.count), backgroundColor: '#34C759', borderRadius: { topLeft: 6, topRight: 6 } }] },
                    options: {
                        responsive: true, maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false },
                            tooltip: { backgroundColor: 'rgba(31, 41, 55, 0.95)', titleColor: '#F9FAFB', bodyColor: '#D1D5DB', usePointStyle: true, padding: 12 }
                        },
                        scales: {
                            x: { grid: { display: false }, ticks: { font: { size: 10, family: 'Inter' }, color: '#6E6E73' } },
                            y: { grid: { color: 'rgba(150, 150, 150, 0.15)', borderDash: [3, 3] }, ticks: { font: { size: 10, family: 'Inter' }, color: '#6E6E73' } }
                        }
                    }
                });
            }
        }, 100);
    } catch (e) { el.innerHTML = '<div class="text-center text-text-secondary py-20">Failed to load analytics data.</div>'; }
}

// ─── PREDICTIONS SECTION ────────────────────────────────────────────────────
async function loadPredictions() {
    const el = document.getElementById('section-predictions');
    el.innerHTML = '<div class="flex items-center justify-center h-96"><div class="w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div></div>';
    try {
        const data = await apiGetPredictions();
        const MC = { 'XGBoost (Ensemble)': '#34C759', 'Random Forest (RF)': '#0A84FF', 'Decision Tree': '#FF9F0A', 'Linear Regression (LM)': '#AF52DE' };
        const BC = ['#0A84FF', '#AF52DE', '#34C759', '#FF9F0A', '#5AC8FA'];
        el.innerHTML = `<div class="space-y-6 animate-fade-in">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                ${[{ l: 'Best Model', v: data.bestModel?.name, c: '#34C759' }, { l: 'Overall Accuracy', v: ((data.overallAccuracy || 0) * 100).toFixed(1) + '%', c: '#0A84FF' }, { l: 'Data Points', v: (data.dataPoints || 0).toLocaleString(), c: '#AF52DE' }, { l: 'Forecast Weeks', v: '' + (data.forecast?.length || 6), c: '#FF9F0A' }].map(s => `
                    <div class="bg-white dark:bg-dark-card rounded-2xl p-5 shadow-soft border border-gray-100 dark:border-dark-border">
                        <div class="text-xs text-text-secondary dark:text-dark-text-muted mb-1">${s.l}</div>
                        <div class="text-xl font-bold" style="color:${s.c}">${s.v || '—'}</div>
                    </div>`).join('')}
            </div>
            <div class="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-dark-border">
                <h3 class="font-bold text-text-primary dark:text-dark-text mb-1">ML Model Comparison</h3>
                <p class="text-xs text-text-secondary dark:text-dark-text-muted mb-4">Accuracy, Precision, Recall & F1 Score</p>
                <div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr class="border-b border-gray-100 dark:border-dark-border">
                    ${['Model', 'Accuracy', 'Precision', 'Recall', 'F1 Score', 'AUC-ROC'].map(h => `<th class="text-left py-2 px-3 text-xs font-semibold text-text-secondary dark:text-dark-text-muted">${h}</th>`).join('')}
                </tr></thead><tbody>
                    ${(data.models || []).map(m => {
                        const isBest = m.name === data.bestModel?.name;
                        const isSelected = m.name === data.selectedModel;
                        const rowBg = isBest ? 'bg-green-50 dark:bg-green-900/10' : isSelected ? 'bg-blue-50 dark:bg-blue-900/10' : '';
                        let badges = '';
                        if (isBest) badges += '<span class="text-xs bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 px-1.5 py-0.5 rounded-full font-semibold">Best</span>';
                        if (isSelected) badges += '<span class="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400 px-1.5 py-0.5 rounded-full font-semibold ml-1">Selected</span>';
                        return `<tr class="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${rowBg}">
                        <td class="py-3 px-3"><div class="flex items-center gap-2"><div class="w-2 h-2 rounded-full" style="background:${MC[m.name] || '#6E6E73'}"></div><span class="font-medium text-text-primary dark:text-dark-text text-xs">${m.name}</span>${badges}</div></td>
                        ${[m.accuracy, m.precision, m.recall, m.f1Score, m.aucRoc].map(v => `<td class="py-3 px-3"><div class="flex items-center gap-2"><div class="w-16 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div class="h-full rounded-full" style="width:${(v || 0) * 100}%;background:${(v || 0) > .9 ? '#34C759' : (v || 0) > .8 ? '#0A84FF' : '#FF9F0A'}"></div></div><span class="text-xs font-semibold text-text-primary dark:text-dark-text">${((v || 0) * 100).toFixed(1)}%</span></div></td>`).join('')}
                    </tr>`;
                    }).join('')}
                </tbody></table></div>
            </div>
            <div class="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-dark-border">
                <div class="flex items-center justify-between mb-4">
                    <div><h3 class="font-bold text-text-primary dark:text-dark-text">Volume Forecast</h3>
                    <p class="text-xs text-text-secondary dark:text-dark-text-muted mt-0.5">Predicted demand for the next ${data.forecast?.length || 7} days</p></div>
                </div>
                <div class="relative w-full h-[240px]"><canvas id="predictionsForecastChart"></canvas></div>
            </div>
            <div class="grid lg:grid-cols-2 gap-6">
                <div class="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-dark-border">
                    <h3 class="font-bold text-text-primary dark:text-dark-text mb-1">Top Food Categories</h3>
                    <p class="text-xs text-text-secondary dark:text-dark-text-muted mb-4">Orders & revenue by restaurant type</p>
                    <div class="space-y-3">${(data.foodCategories || []).slice(0, 5).map((c, i) => `
                        <div><div class="flex justify-between text-xs mb-1"><span class="font-medium text-text-primary dark:text-dark-text">${c.category}</span><span class="text-text-secondary dark:text-dark-text-muted">${c.orders} orders · ₹${c.avgRevenue} avg</span></div>
                        <div class="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"><div class="h-full rounded-full transition-all duration-500" style="width:${c.percentage}%;background:${BC[i]}"></div></div></div>
                    `).join('')}</div>
                </div>
                <div class="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-dark-border">
                    <h3 class="font-bold text-text-primary dark:text-dark-text mb-1">AI Insights</h3>
                    <p class="text-xs text-text-secondary dark:text-dark-text-muted mb-4">Automated intelligence recommendations</p>
                    <div class="space-y-3">${(data.insights || []).map((ins, i) => {
            const clr = ['#0A84FF', '#34C759', '#AF52DE', '#FF9F0A'][i]; return `
                        <div class="flex gap-3 p-3 rounded-xl" style="background:${clr}1A">
                            <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style="background:${clr}33"><span style="color:${clr};font-size:14px">✦</span></div>
                            <div><div class="text-xs font-bold text-text-primary dark:text-dark-text mb-0.5">${ins.title}</div><div class="text-xs text-text-secondary dark:text-dark-text-muted leading-relaxed">${ins.message}</div></div>
                        </div>`;
        }).join('')}</div>
                </div>
            </div>
        </div>`;

        setTimeout(() => {
            if (data.forecast && data.forecast.length > 0) {
                destroyChart('predictionsForecastChart');
                const labels = Array.from({ length: data.forecast.length }, (_, i) => `Day ${i + 1}`);
                chartInstances['predictionsForecastChart'] = new Chart(document.getElementById('predictionsForecastChart'), {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Predicted Volume',
                            data: data.forecast,
                            borderColor: '#AF52DE',
                            backgroundColor: 'rgba(175, 82, 222, 0.1)',
                            fill: true,
                            tension: 0.4,
                            borderWidth: 2.5,
                            pointRadius: 4,
                            pointBackgroundColor: '#fff',
                            pointHoverRadius: 6
                        }]
                    },
                    options: {
                        responsive: true, maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                enabled: false,
                                position: 'nearest',
                                external: customTooltipHandler
                            }
                        },
                        scales: {
                            x: { grid: { display: false }, ticks: { font: { size: 10, family: 'Inter' }, color: '#6E6E73' } },
                            y: { grid: { color: 'rgba(150, 150, 150, 0.15)', borderDash: [3, 3] }, ticks: { font: { size: 10, family: 'Inter' }, color: '#6E6E73' } }
                        },
                        interaction: { intersect: false, mode: 'index' },
                        animation: { duration: 250, easing: 'easeOutQuart' },
                        hover: { animationDuration: 0 }
                    },
                    plugins: [crosshairPlugin]
                });
            }
        }, 100);
    } catch (e) { el.innerHTML = '<div class="text-center text-text-secondary py-20">Failed to load predictions.</div>'; }
}

// ─── ORDERS SECTION ─────────────────────────────────────────────────────────
let ordersState = { page: 1, search: '', status: '' };

async function loadOrders() {
    const el = document.getElementById('section-orders');
    const params = { page: ordersState.page, limit: 15, q: ordersState.search, status: ordersState.status };

    // Show skeleton if first load
    if (!el.dataset.initialized) {
        el.innerHTML = renderOrdersShell();
        el.dataset.initialized = '1';
    }

    const tbody = document.getElementById('orders-tbody');
    const pagination = document.getElementById('orders-pagination');
    const countEl = document.getElementById('orders-count');

    if (tbody) tbody.innerHTML = Array(6).fill('<tr class="border-b border-gray-50 dark:border-gray-800">' + Array(8).fill('<td class="py-3 px-4"><div class="h-3 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-20"></div></td>').join('') + '</tr>').join('');

    try {
        const data = await apiGetOrders(params);
        const sc = { delivered: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 border dark:border-green-800/50', 'in-transit': 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border dark:border-blue-800/50', preparing: 'bg-orange-100 text-orange-700 dark:bg-amber-900/20 dark:text-amber-500 border dark:border-amber-800/50' };

        if (tbody) tbody.innerHTML = (data.data || []).map(o => `
            <tr class="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <td class="py-3 px-4 text-xs font-mono font-semibold text-primary dark:text-blue-400">${o.id}</td>
                <td class="py-3 px-4 text-xs font-medium text-text-primary dark:text-dark-text max-w-[120px] truncate">${applyPrivacyMask(o.restaurant, 'name')}</td>
                <td class="py-3 px-4 text-xs text-text-secondary dark:text-dark-text-muted">${applyPrivacyMask(o.city, 'city')}</td>
                <td class="py-3 px-4 text-xs text-text-secondary dark:text-dark-text-muted">${o.medium}</td>
                <td class="py-3 px-4 text-xs font-semibold text-text-primary dark:text-dark-text">${applyPrivacyMask('₹' + (o.avgCost || 0).toFixed(0), 'money')}</td>
                <td class="py-3 px-4 text-xs text-text-secondary dark:text-dark-text-muted">${o.timePeriod}</td>
                <td class="py-3 px-4 text-xs text-text-secondary dark:text-dark-text-muted">${o.predictedDeliveryMin} min</td>
                <td class="py-3 px-4"><span class="text-xs px-2.5 py-1 rounded-full font-semibold ${sc[o.status] || 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}">${o.status}</span></td>
            </tr>`).join('');

        if (countEl) countEl.textContent = (data.pagination?.total || 0).toLocaleString() + ' orders';
        if (pagination && data.pagination) pagination.innerHTML = `
            <span class="text-xs text-text-secondary dark:text-dark-text-muted">Page ${data.pagination.page} of ${data.pagination.totalPages}</span>
            <div class="flex gap-2">
                <button ${!data.pagination.hasPrev ? 'disabled' : ''} onclick="ordersState.page--;loadOrders()" class="px-3 py-1.5 text-xs rounded-lg bg-gray-100 dark:bg-gray-800 text-text-secondary dark:text-dark-text-muted hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">← Prev</button>
                <button ${!data.pagination.hasNext ? 'disabled' : ''} onclick="ordersState.page++;loadOrders()" class="px-3 py-1.5 text-xs rounded-lg bg-primary text-white hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Next →</button>
            </div>`;
    } catch (e) { if (tbody) tbody.innerHTML = '<tr><td colspan="8" class="text-center py-10 text-text-secondary">Failed to load orders.</td></tr>'; }
}

function renderOrdersShell() {
    return `<div class="space-y-5 animate-fade-in">
        <div class="flex flex-wrap items-center gap-3">
            <form onsubmit="event.preventDefault()" class="flex gap-2 flex-1 min-w-0">
                <div class="relative flex-1"><svg class="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input id="orders-search-input" value="${ordersState.search || ''}" oninput="clearTimeout(window.osTimeout); window.osTimeout = setTimeout(() => { ordersState.page=1; ordersState.search=this.value; loadOrders() }, 250)" placeholder="Search by restaurant, city, platform…" class="input-field !pl-9 py-2.5 text-xs" /></div>
            </form>
            <select onchange="ordersState.status=this.value;ordersState.page=1;loadOrders()" class="input-field w-auto py-2.5 text-xs">
                <option value="">All Statuses</option><option value="delivered">Delivered</option><option value="in-transit">In Transit</option><option value="preparing">Preparing</option>
            </select>
            <span id="orders-count" class="text-xs text-text-secondary whitespace-nowrap"></span>
        </div>
        <div class="bg-white dark:bg-dark-card rounded-2xl shadow-soft border border-gray-100 dark:border-dark-border overflow-hidden">
            <div class="overflow-x-auto"><table class="w-full"><thead><tr class="border-b border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-surface/50">
                ${['Order ID', 'Restaurant', 'City', 'Platform', 'Cost', 'Time Period', 'Pred. Delivery', 'Status'].map(h => `<th class="text-left py-3 px-4 text-xs font-semibold text-text-secondary dark:text-dark-text-muted">${h}</th>`).join('')}
            </tr></thead><tbody id="orders-tbody"></tbody></table></div>
            <div id="orders-pagination" class="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-dark-border"></div>
        </div>
    </div>`;
}

// ─── REPORTS SECTION ────────────────────────────────────────────────────────
async function loadReports() {
    const el = document.getElementById('section-reports');
    el.innerHTML = '<div class="flex items-center justify-center h-96"><div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>';
    try {
        const data = await apiGetReports();
        const ICON_MAP = { TrendingUp: '📈', Truck: '🚚', Users: '👥', BarChart2: '📊', DollarSign: '💰' };
        const COLOR_MAP = { blue: '#0A84FF', green: '#34C759', purple: '#AF52DE', orange: '#FF9F0A', emerald: '#30D158' };
        el.innerHTML = `<div class="space-y-5 animate-fade-in"><div class="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            ${(data.reports || []).map(r => {
            const color = COLOR_MAP[r.color] || '#0A84FF'; return `
                <div class="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-dark-border flex flex-col gap-4">
                    <div class="flex items-start gap-4">
                        <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style="background:${color}1A">${ICON_MAP[r.icon] || '📊'}</div>
                        <div class="flex-1 min-w-0">
                            <div class="font-bold text-text-primary dark:text-dark-text text-sm leading-tight">${r.title}</div>
                            <div class="text-xs text-text-secondary dark:text-dark-text-muted mt-1 leading-relaxed">${r.description}</div>
                            <div class="flex items-center gap-3 mt-2">
                                <span class="text-xs font-medium px-2 py-0.5 rounded-full" style="background:${color}1A;color:${color}">${r.category}</span>
                                <span class="text-xs text-text-secondary dark:text-dark-text-muted">${r.size}</span>
                            </div>
                        </div>
                    </div>
                    <div class="text-xs text-text-secondary dark:text-dark-text-muted">Last updated: ${new Date(r.lastGenerated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    <div class="flex gap-2">
                        <button onclick="handleReportDownload('${r.id}','csv',this)" class="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-colors" style="background:${color}1A;color:${color}">⬇ CSV</button>
                        <button onclick="handleReportDownload('${r.id}','pdf',this)" class="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-text-secondary dark:text-dark-text-muted hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">📄 PDF</button>
                    </div>
                </div>`;
        }).join('')}
        </div></div>`;
    } catch (e) { el.innerHTML = '<div class="text-center text-text-secondary py-20">Failed to load reports.</div>'; }
}

async function handleReportDownload(id, format, btn) {
    const orig = btn.textContent;
    btn.textContent = '⏳ Downloading…';
    btn.disabled = true;
    try { await apiDownloadReport(id, format); } catch (e) { console.error(e); }
    btn.textContent = orig;
    btn.disabled = false;
}

// ─── SETTINGS SECTION ───────────────────────────────────────────────────────
function renderSettings() {
    const el = document.getElementById('section-settings');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : {};
    const name = user.name || 'User';
    const email = user.email || 'email@address.com';
    const role = user.role || 'Data Analyst';

    const s = user.settings || {};

    el.innerHTML = `<div class="space-y-6 animate-fade-in max-w-4xl">
        <div class="flex items-center justify-between">
            <div><h2 class="text-2xl font-bold text-text-primary dark:text-dark-text">Settings</h2>
            <p class="text-sm text-text-secondary dark:text-dark-text-muted mt-1">Manage your analytics platform preferences</p></div>
            <button type="button" id="settings-save-btn" onclick="handleSettingsSave(event)" class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold btn-primary">💾 Save Changes</button>
        </div>

        ${settingsCard('Profile & Account', 'Your personal information and credentials', '👤', '#0A84FF', `
            <div class="grid md:grid-cols-2 gap-4">
                <div><label class="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wide">Full Name</label><input id="profile-name" class="input-field" value="${name}" /></div>
                <div><label class="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wide">Email Address</label><input id="profile-email" type="email" class="input-field" value="${email}" /></div>
                <div><label class="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wide">Role</label><select id="profile-role" class="input-field py-2.5 text-sm">
                    <option ${role === 'Data Analyst' ? 'selected' : ''}>Data Analyst</option>
                    <option ${role === 'ML Engineer' ? 'selected' : ''}>ML Engineer</option>
                    <option ${role === 'Platform Admin' || role === 'Admin' ? 'selected' : ''}>Admin</option>
                    <option ${role === 'Business Analyst' ? 'selected' : ''}>Business Analyst</option>
                    <option ${role === 'Viewer' ? 'selected' : ''}>Viewer</option>
                </select></div>
                <div><label class="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wide">Institution</label><input id="profile-institution" class="input-field" value="${user.institution || 'CloudPredict AI'}" /></div>
            </div>
            <div class="pt-2 border-t border-gray-100 dark:border-dark-border"><button onclick="showChangePasswordModal()" class="flex items-center gap-2 text-sm font-medium text-primary hover:underline">🔑 Change Password</button></div>
        `)}

        ${settingsCard('ML Model Configuration', 'Control prediction models, training schedules, and accuracy thresholds', '⚡', '#AF52DE', `
            <div class="grid md:grid-cols-2 gap-4">
                <div><label class="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wide">Prediction Model</label><select id="ml-model" class="input-field py-2.5 text-sm"><option ${s.mlModel === 'XGBoost (Ensemble)' ? 'selected' : ''}>XGBoost (Ensemble)</option><option ${s.mlModel === 'Random Forest (RF)' ? 'selected' : ''}>Random Forest (RF)</option><option ${s.mlModel === 'Decision Tree' ? 'selected' : ''}>Decision Tree</option><option ${s.mlModel === 'Linear Regression (LM)' ? 'selected' : ''}>Linear Regression (LM)</option></select></div>
                <div><label class="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wide">Forecast Horizon (Days)</label><select id="ml-horizon" class="input-field py-2.5 text-sm"><option ${s.mlHorizon === '1 Day' ? 'selected' : ''}>1 Day</option><option ${s.mlHorizon !== '1 Day' && s.mlHorizon !== '14 Days' && s.mlHorizon !== '30 Days' ? 'selected' : ''}>7 Days</option><option ${s.mlHorizon === '14 Days' ? 'selected' : ''}>14 Days</option><option ${s.mlHorizon === '30 Days' ? 'selected' : ''}>30 Days</option></select></div>
                <div><label class="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wide">Confidence Interval</label><select id="ml-confidence" class="input-field py-2.5 text-sm"><option ${s.mlConfidence === '90%' ? 'selected' : ''}>90%</option><option ${s.mlConfidence !== '90%' && s.mlConfidence !== '99%' ? 'selected' : ''}>95%</option><option ${s.mlConfidence === '99%' ? 'selected' : ''}>99%</option></select></div>
            </div>
            <div class="space-y-4 pt-2 border-t border-gray-100 dark:border-dark-border">
                ${settingToggle('Auto Re-training', 'Automatically retrain model when new data exceeds 10% drift', 'ml-auto', s.mlAuto !== false)}
                ${settingToggle('Feature Engineering', 'Automatically generate lag features, rolling averages, and time-based features', 'ml-feat', s.mlFeat !== false)}
                ${settingToggle('Anomaly Detection', 'Flag unusual spikes or drops in order volume with ML-based detection', 'ml-anomaly', s.mlAnomaly !== false)}
            </div>
            <div class="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/10 rounded-xl p-3 text-xs text-purple-700 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30">ℹ️ Current model accuracy: <strong>80.0%</strong> — Last trained: <strong>Mar 6, 2026 at 09:00 AM</strong></div>
        `)}

        ${settingsCard('Cloud Integration', 'Configure your cloud provider, region, and synchronization settings', '☁️', '#06B6D4', `
            <div class="grid md:grid-cols-2 gap-4">
                <div><label class="block text-xs font-semibold text-text-secondary dark:text-dark-text-muted mb-2 uppercase tracking-wide">Cloud Provider</label><select id="cloud-provider" class="input-field py-2.5 text-sm"><option ${s.cloudProvider === 'Amazon Web Services (AWS)' || !s.cloudProvider ? 'selected' : ''}>Amazon Web Services (AWS)</option><option ${s.cloudProvider === 'Google Cloud Platform (GCP)' ? 'selected' : ''}>Google Cloud Platform (GCP)</option><option ${s.cloudProvider === 'Microsoft Azure' ? 'selected' : ''}>Microsoft Azure</option></select></div>
                <div><label class="block text-xs font-semibold text-text-secondary dark:text-dark-text-muted mb-2 uppercase tracking-wide">Region</label><select id="cloud-region" class="input-field py-2.5 text-sm"><option ${s.cloudRegion === 'Asia Pacific — Mumbai (ap-south-1)' || !s.cloudRegion ? 'selected' : ''}>Asia Pacific — Mumbai (ap-south-1)</option><option ${s.cloudRegion === 'US East — N. Virginia (us-east-1)' ? 'selected' : ''}>US East — N. Virginia (us-east-1)</option><option ${s.cloudRegion === 'Europe — Ireland (eu-west-1)' ? 'selected' : ''}>Europe — Ireland (eu-west-1)</option><option ${s.cloudRegion === 'Asia Pacific — Singapore' ? 'selected' : ''}>Asia Pacific — Singapore</option></select></div>
                <div><label class="block text-xs font-semibold text-text-secondary dark:text-dark-text-muted mb-2 uppercase tracking-wide">Sync Interval (minutes)</label><select id="cloud-sync" class="input-field py-2.5 text-sm"><option ${s.cloudSync === 'Every 1 minute' ? 'selected' : ''}>Every 1 minute</option><option ${s.cloudSync === 'Every 5 minutes' || !s.cloudSync ? 'selected' : ''}>Every 5 minutes</option><option ${s.cloudSync === 'Every 15 minutes' ? 'selected' : ''}>Every 15 minutes</option><option ${s.cloudSync === 'Every 30 minutes' ? 'selected' : ''}>Every 30 minutes</option></select></div>
            </div>
            <div class="space-y-4 pt-2 border-t border-gray-100 dark:border-dark-border">
                ${settingToggle('Auto Scaling', 'Dynamically scale compute resources during high-demand periods', 'cloud-scale', s.cloudScale !== false)}
                ${settingToggle('Automated Backups', 'Daily snapshot backups of all analytics data and model states', 'cloud-backup', s.cloudBackup !== false)}
                ${settingToggle('Data Encryption (AES-256)', 'Encrypt all data at rest and in transit to the cloud', 'cloud-encrypt', s.cloudEncrypt !== false)}
            </div>
            <div class="flex items-center gap-3 bg-green-50 dark:bg-green-900/10 rounded-xl p-3 border border-green-100 dark:border-green-900/30"><div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div><span class="text-xs text-green-700 dark:text-green-400 font-medium">Cloud connection active — 99.8% uptime this month</span></div>
        `)}

        <div class="grid md:grid-cols-2 gap-6">
            ${settingsCard('Notifications', 'Choose what alerts you receive', '🔔', '#FF9F0A', `<div class="space-y-4">
                ${settingToggle('Demand Spike Alerts', 'Notify when predicted demand exceeds threshold', 'notif-demand', s.notifDemand !== false)}
                ${settingToggle('Model Re-training', 'Alert when auto re-training completes', 'notif-retrain', s.notifRetrain !== false)}
                ${settingToggle('Delivery Anomalies', 'Unusual delays or cancellations above baseline', 'notif-delivery', s.notifDelivery !== false)}
                ${settingToggle('System Status Updates', 'Cloud sync, uptime and infrastructure alerts', 'notif-system', s.notifSystem !== false)}
                <div class="pt-2 border-t border-gray-100 dark:border-dark-border space-y-4">
                    ${settingToggle('Email Digest (Daily)', 'Receive a daily summary to your inbox', 'notif-email', s.notifEmail === true)}
                    ${settingToggle('SMS Alerts', 'Critical alerts via SMS', 'notif-sms', s.notifSms === true)}
                </div>
            </div>`)}
            ${settingsCard('Data & Privacy', 'Data retention, anonymization and compliance', '🛡️', '#34C759', `<div class="space-y-4">
                <div><label class="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wide">Data Retention Period</label><select id="data-retention" class="input-field py-2.5 text-sm"><option ${s.dataRetention === '30 Days' ? 'selected' : ''}>30 Days</option><option ${s.dataRetention === '60 Days' ? 'selected' : ''}>60 Days</option><option ${s.dataRetention === '90 Days' || !s.dataRetention ? 'selected' : ''}>90 Days</option><option ${s.dataRetention === '180 Days' ? 'selected' : ''}>180 Days</option><option ${s.dataRetention === '1 Year' ? 'selected' : ''}>1 Year</option></select></div>
                ${settingToggle('Anonymize Customer Data', 'Remove PII from analytics pipeline', 'data-anon', s.dataAnon !== false)}
                ${settingToggle('Share Aggregated Analytics', 'Contribute anonymized insights to research', 'data-share', s.dataShare === true)}
                ${settingToggle('GDPR Compliance Mode', 'Enforce right-to-deletion and data portability', 'data-gdpr', s.dataGdpr !== false)}
            </div>
            <div class="flex items-center gap-2 bg-green-50 dark:bg-green-900/10 rounded-xl p-3 text-xs text-green-700 dark:text-green-400 border border-green-100 dark:border-green-900/30 mt-2">🔒 All data is stored securely with AES-256 encryption</div>`)}
        </div>

        ${settingsCard('System Information', 'Platform version, API endpoints, and technical details', '🖥️', '#6E6E73', `
            <div class="grid md:grid-cols-2 gap-x-8 gap-y-3">
                ${[['Platform Version', 'CloudPredict v1.0.0'], ['ML Engine', 'Scikit-learn 1.4 + XGBoost 2.0'], ['Cloud SDK', 'AWS SDK 3.x'], ['API Version', 'REST API v2 (FastAPI)'], ['Database', 'PostgreSQL 16 + MongoDB 7'], ['Last Model Update', 'March 6, 2026 — 09:00 AM'], ['Data Pipeline', 'Apache Kafka + Airflow'], ['Uptime', '99.8% (Last 30 days)']].map(([l, v]) => `
                    <div class="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800 last:border-0"><span class="text-xs text-text-secondary dark:text-dark-text-muted">${l}</span><span class="text-xs font-semibold text-text-primary dark:text-dark-text">${v}</span></div>
                `).join('')}
            </div>
            <div class="flex flex-wrap gap-3 pt-2">
                <button onclick="showToast('Checking for updates... All systems up to date.')" class="flex items-center gap-2 px-4 py-2 bg-bg-secondary dark:bg-dark-surface rounded-xl text-xs font-semibold text-text-secondary dark:text-dark-text-muted hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">🔄 Check for Updates</button>
                <button onclick="showApiKeysModal()" class="flex items-center gap-2 px-4 py-2 bg-bg-secondary dark:bg-dark-surface rounded-xl text-xs font-semibold text-text-secondary dark:text-dark-text-muted hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">🔑 Manage API Keys</button>
                <button onclick="showLogsModal()" class="flex items-center gap-2 px-4 py-2 bg-bg-secondary dark:bg-dark-surface rounded-xl text-xs font-semibold text-text-secondary dark:text-dark-text-muted hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">📊 View Logs</button>
            </div>
        `)}

        <!-- Danger Zone -->
        <div class="bg-white dark:bg-dark-card rounded-2xl shadow-soft border border-red-200 dark:border-red-900/50 overflow-hidden">
            <div class="flex items-center gap-3 px-6 py-5 border-b border-red-100 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10">
                <div class="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-lg">🗑️</div>
                <div><h3 class="font-bold text-red-700 dark:text-red-400 text-sm">Danger Zone</h3><p class="text-xs text-red-500 dark:text-red-400/80 mt-0.5">Irreversible and destructive actions</p></div>
            </div>
            <div class="px-6 py-5">
                <div class="flex items-start justify-between gap-6">
                    <div><div class="text-sm font-semibold text-text-primary dark:text-dark-text">Delete Account</div>
                    <div class="text-xs text-text-secondary dark:text-dark-text-muted mt-1 leading-relaxed max-w-sm">Permanently delete your CloudPredict account and all associated data. This action <strong>cannot be undone</strong>.</div></div>
                    <button onclick="showDeleteDialog()" class="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 active:bg-red-700 transition-colors">🗑️ Delete Account</button>
                </div>
            </div>
        </div>
    </div>`;
}

// ─── Settings helpers ───────────────────────────────────────────────────────
function settingsCard(title, desc, icon, color, content) {
    return `<div class="bg-white dark:bg-dark-card rounded-2xl shadow-soft border border-gray-100 dark:border-dark-border overflow-hidden">
        <div class="flex items-center gap-3 px-6 py-5 border-b border-gray-100 dark:border-dark-border">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style="background:${color}15">${icon}</div>
            <div><h3 class="font-bold text-text-primary dark:text-dark-text text-sm">${title}</h3>${desc ? `<p class="text-xs text-text-secondary dark:text-dark-text-muted mt-0.5">${desc}</p>` : ''}</div>
        </div>
        <div class="px-6 py-5 space-y-5">${content}</div>
    </div>`;
}

function settingToggle(label, desc, id, defaultOn) {
    return `<div class="flex items-center justify-between gap-4">
        <div class="flex-1 min-w-0"><div class="text-sm font-medium text-text-primary dark:text-dark-text">${label}</div>${desc ? `<div class="text-xs text-text-secondary dark:text-dark-text-muted mt-0.5 leading-relaxed">${desc}</div>` : ''}</div>
        <button id="toggle-${id}" onclick="toggleSettingSwitch('${id}')" class="toggle-switch ${defaultOn ? 'on' : 'off'}"><span class="toggle-knob"></span></button>
    </div>`;
}

function toggleSettingSwitch(id) {
    const btn = document.getElementById('toggle-' + id);
    if (btn.classList.contains('on')) { btn.classList.remove('on'); btn.classList.add('off'); }
    else { btn.classList.remove('off'); btn.classList.add('on'); }
}

async function handleSettingsSave(event) {
    if (event) event.preventDefault();
    const btn = document.getElementById('settings-save-btn');
    const origText = btn.innerHTML;
    btn.innerHTML = '⏳ Saving...';
    btn.disabled = true;

    try {
        const name = document.getElementById('profile-name').value.trim();
        const email = document.getElementById('profile-email').value.trim();
        const role = document.getElementById('profile-role').value;
        const inst = document.getElementById('profile-institution').value.trim();

        const settings = {
            mlModel: document.getElementById('ml-model').value,
            mlHorizon: document.getElementById('ml-horizon').value,
            mlConfidence: document.getElementById('ml-confidence').value,
            cloudProvider: document.getElementById('cloud-provider').value,
            cloudRegion: document.getElementById('cloud-region').value,
            cloudSync: document.getElementById('cloud-sync').value,
            dataRetention: document.getElementById('data-retention').value,
            mlAuto: document.getElementById('toggle-ml-auto').classList.contains('on'),
            mlFeat: document.getElementById('toggle-ml-feat').classList.contains('on'),
            mlAnomaly: document.getElementById('toggle-ml-anomaly').classList.contains('on'),
            cloudScale: document.getElementById('toggle-cloud-scale').classList.contains('on'),
            cloudBackup: document.getElementById('toggle-cloud-backup').classList.contains('on'),
            cloudEncrypt: document.getElementById('toggle-cloud-encrypt').classList.contains('on'),
            notifDemand: document.getElementById('toggle-notif-demand').classList.contains('on'),
            notifRetrain: document.getElementById('toggle-notif-retrain').classList.contains('on'),
            notifDelivery: document.getElementById('toggle-notif-delivery').classList.contains('on'),
            notifSystem: document.getElementById('toggle-notif-system').classList.contains('on'),
            notifEmail: document.getElementById('toggle-notif-email').classList.contains('on'),
            notifSms: document.getElementById('toggle-notif-sms').classList.contains('on'),
            dataAnon: document.getElementById('toggle-data-anon').classList.contains('on'),
            dataShare: document.getElementById('toggle-data-share').classList.contains('on'),
            dataGdpr: document.getElementById('toggle-data-gdpr').classList.contains('on')
        };

        const res = await apiUpdateProfile(name, email, role, inst, settings);

        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : {};
        user.name = res.user?.name || name;
        user.email = res.user?.email || email;
        user.role = res.user?.role || role;
        user.institution = res.user?.institution || inst;
        user.settings = res.user?.settings || settings;

        localStorage.setItem('user', JSON.stringify(user));

        if (typeof loadUserProfileUI === 'function') loadUserProfileUI();

        // Clear loaded UI caches so that navigating back to these tabs fetches fresh data
        ['analytics', 'predictions', 'orders', 'dashboard'].forEach(secId => {
            const el = document.getElementById('section-' + secId);
            if (el) { el.removeAttribute('data-loaded'); el.removeAttribute('data-initialized'); }
        });

        btn.innerHTML = '✅ Saved!';
        btn.classList.remove('btn-primary');
        btn.classList.add('bg-green-500', 'text-white', 'shadow-md');
        showToast('Settings saved successfully', 'success');

        setTimeout(() => {
            btn.innerHTML = origText;
            btn.classList.add('btn-primary');
            btn.classList.remove('bg-green-500', 'text-white', 'shadow-md');
            btn.disabled = false;
        }, 2500);
    } catch (err) {
        console.error(err);
        showToast(err.response?.data?.error || 'Failed to save settings', 'error');
        btn.innerHTML = origText;
        btn.disabled = false;
    }
}

function showChangePasswordModal() {
    const userStr = localStorage.getItem('user');
    let emailHtml = `
                    <div id="changepw-email-container">
                        <label class="block text-[11px] font-bold text-gray-500 mb-3 uppercase tracking-widest">Email Address</label>
                        <input id="changepw-email" type="email" class="w-full bg-[#111827] border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all placeholder:text-gray-600" placeholder="Confirm your email" required />
                    </div>`;

    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            if (user.email) {
                emailHtml = `<input id="changepw-email" type="hidden" value="${user.email}" />`;
            }
        } catch (e) { }
    }

    const overlay = document.createElement('div');
    overlay.id = 'changepw-overlay';
    overlay.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in px-4';
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    overlay.innerHTML = `
    <div class="bg-[#1C2533] rounded-[40px] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row border border-white/5" onclick="event.stopPropagation()">
        <!-- Left Panel: Branding -->
        <div class="w-full md:w-[45%] p-12 flex flex-col justify-center bg-[#151C28]">
            <div class="w-14 h-14 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6-7 6 7l-6 13-6-13z"/><path d="m6 9 12 0"/></svg>
            </div>
            <h2 class="text-4xl font-extrabold text-white mb-6 tracking-tight">Reset your password</h2>
            <p class="text-gray-400 text-lg leading-relaxed">Please enter your account email and create a new master password. Make sure it meets all the security requirements.</p>
        </div>

        <!-- Right Panel: Form -->
        <div class="flex-1 p-12 flex flex-col justify-center bg-[#1C2533] border-l border-white/5">
            <button onclick="document.getElementById('changepw-overlay').remove()" class="absolute top-6 right-6 w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-white/10 text-gray-400 hover:text-white transition-all xl:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <div id="changepw-error" class="hidden text-sm text-red-500 mb-6 font-medium bg-red-500/10 p-4 rounded-2xl border border-red-500/20"></div>
            <form onsubmit="event.preventDefault();handleChangePassword()" class="space-y-8">
                ${emailHtml}
                <div>
                    <label class="block text-[11px] font-bold text-gray-500 mb-3 uppercase tracking-widest">New Password</label>
                    <div class="relative">
                        <input id="changepw-new" type="password" class="w-full bg-[#111827] border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all placeholder:text-gray-600" placeholder="Create a strong password" required oninput="if(typeof updateResetPasswordStrength==='function')updateResetPasswordStrength(this.value); if(typeof checkMatch==='function')checkMatch('changepw-new', 'changepw-confirm', 'changepw-match-icon');" />
                        <button type="button" onclick="const p=document.getElementById('changepw-new');p.type=p.type==='password'?'text':'password'" class="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                    </div>
                    
                    <!-- Password strength -->
                    <div id="reset-pw-strength-wrapper" class="hidden mt-3">
                        <div class="space-y-2 pb-1 pt-1 opacity-100">
                            <div class="flex items-center gap-2">
                                <div class="flex gap-1 flex-1">
                                    <div id="reset-pw-bar-1" class="h-1.5 flex-1 rounded-full bg-white/10 transition-colors duration-300"></div>
                                    <div id="reset-pw-bar-2" class="h-1.5 flex-1 rounded-full bg-white/10 transition-colors duration-300"></div>
                                    <div id="reset-pw-bar-3" class="h-1.5 flex-1 rounded-full bg-white/10 transition-colors duration-300"></div>
                                    <div id="reset-pw-bar-4" class="h-1.5 flex-1 rounded-full bg-white/10 transition-colors duration-300"></div>
                                </div>
                                <span id="reset-pw-text" class="text-xs font-semibold w-12 text-right text-gray-500"></span>
                            </div>
                            <div class="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                                <div class="flex items-center gap-1.5 text-[10px] text-gray-500 transition-colors duration-200" id="reset-check-length">
                                    <div class="w-3 h-3 rounded-full flex items-center justify-center flex-shrink-0 bg-white/5 transition-all duration-200 icon-container">
                                        <div class="w-1 h-1 rounded-full bg-gray-600"></div>
                                    </div>
                                    <span class="truncate">At least 8 characters</span>
                                </div>
                                <div class="flex items-center gap-1.5 text-[10px] text-gray-500 transition-colors duration-200" id="reset-check-upper">
                                    <div class="w-3 h-3 rounded-full flex items-center justify-center flex-shrink-0 bg-white/5 transition-all duration-200 icon-container">
                                        <div class="w-1 h-1 rounded-full bg-gray-600"></div>
                                    </div>
                                    <span class="truncate">One uppercase letter</span>
                                </div>
                                <div class="flex items-center gap-1.5 text-[10px] text-gray-500 transition-colors duration-200" id="reset-check-number">
                                    <div class="w-3 h-3 rounded-full flex items-center justify-center flex-shrink-0 bg-white/5 transition-all duration-200 icon-container">
                                        <div class="w-1 h-1 rounded-full bg-gray-600"></div>
                                    </div>
                                    <span class="truncate">One number</span>
                                </div>
                                <div class="flex items-center gap-1.5 text-[10px] text-gray-500 transition-colors duration-200" id="reset-check-special">
                                    <div class="w-3 h-3 rounded-full flex items-center justify-center flex-shrink-0 bg-white/5 transition-all duration-200 icon-container">
                                        <div class="w-1 h-1 rounded-full bg-gray-600"></div>
                                    </div>
                                    <span class="truncate">One special character</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <label class="block text-[11px] font-bold text-gray-500 mb-3 uppercase tracking-widest">Confirm New Password</label>
                    <div class="relative">
                        <input id="changepw-confirm" type="password" class="w-full bg-[#111827] border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all placeholder:text-gray-600 pl-6 pr-20" placeholder="Confirm your new password" required oninput="if(typeof checkMatch==='function')checkMatch('changepw-new', 'changepw-confirm', 'changepw-match-icon')" />
                        
                        <div id="changepw-match-icon" class="absolute right-14 top-1/2 -translate-y-1/2 w-5 h-5 transition-transform duration-300 scale-0 flex items-center justify-center">
                            <!-- Icon injected via JS -->
                        </div>

                        <button type="button" onclick="const p=document.getElementById('changepw-confirm');p.type=p.type==='password'?'text':'password'" class="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                    </div>
                </div>
                <div class="flex gap-4 pt-4">
                    <button type="button" onclick="document.getElementById('changepw-overlay').remove()" class="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl transition-all border border-white/5">Cancel</button>
                    <button id="changepw-submit-btn" type="submit" class="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/20">Reset Password</button>
                </div>
            </form>
        </div>
    </div>`;
    document.body.appendChild(overlay);
}

async function handleChangePassword() {
    const errorDiv = document.getElementById('changepw-error');
    const btn = document.getElementById('changepw-submit-btn');
    const email = document.getElementById('changepw-email').value.trim();
    const password = document.getElementById('changepw-new').value;
    const confirm = document.getElementById('changepw-confirm').value;

    errorDiv.classList.add('hidden');

    // 1. Basic validation
    if (password !== confirm) {
        errorDiv.textContent = 'Passwords do not match.';
        errorDiv.classList.remove('hidden');
        return;
    }

    // 2. Extra strong validation
    const hasLen = password.length >= 8;
    const hasUpp = /[A-Z]/.test(password);
    const hasNum = /[0-9]/.test(password);
    const hasSpc = /[^A-Za-z0-9]/.test(password);

    if (!hasLen || !hasUpp || !hasNum || !hasSpc) {
        errorDiv.textContent = 'Password must meet all 4 strength criteria (8+ chars, Uppercase, Number, Special).';
        errorDiv.classList.remove('hidden');
        return;
    }

    btn.disabled = true;
    btn.textContent = 'Updating...';

    try {
        await apiResetPassword(email, password);
        const overlay = document.getElementById('changepw-overlay');
        overlay.querySelector('form').parentElement.innerHTML = `
            <div class="flex flex-col items-center justify-center py-12 gap-6 animate-fade-in h-full">
                <div class="w-24 h-24 bg-green-500/20 rounded-[32px] flex items-center justify-center text-5xl border border-green-500/20">✅</div>
                <div class="text-center">
                    <h3 class="text-2xl font-bold text-white mb-2">Password Updated!</h3>
                    <p class="text-gray-400">Your master password has been changed successfully.</p>
                </div>
            </div>`;
        setTimeout(() => overlay.remove(), 2500);
    } catch (err) {
        console.error(err);
        errorDiv.textContent = err.response?.data?.error || 'Failed to reset password. Check your email.';
        errorDiv.classList.remove('hidden');
        btn.disabled = false;
        btn.textContent = 'Reset Password';
    }
}

function showDeleteDialog() {
    const overlay = document.createElement('div');
    overlay.id = 'delete-overlay';
    overlay.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/60 backdrop-blur-sm animate-fade-in';
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    overlay.innerHTML = `<div class="bg-white dark:bg-dark-card rounded-3xl shadow-large w-full max-w-md mx-4 p-8 border border-gray-100 dark:border-dark-border" onclick="event.stopPropagation()">
        <div class="flex flex-col items-center text-center mb-6">
            <div class="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4 text-3xl">🗑️</div>
            <h3 class="text-xl font-bold text-text-primary dark:text-dark-text">Delete Account?</h3>
            <p class="text-sm text-text-secondary dark:text-dark-text-muted mt-2 leading-relaxed">This will permanently erase your account, all analytics data, ML model histories, and configurations. There is no way to recover this.</p>
        </div>
        <div class="mb-5 relative">
            <label class="block text-xs font-semibold text-text-secondary dark:text-dark-text-muted mb-2">Please enter your password to confirm</label>
            <div class="relative">
                <input id="delete-pw-input" type="password" class="input-field border-red-200 dark:border-red-900/50 focus:border-red-400 w-full !pr-10" placeholder="Password" autocomplete="off" autofocus />
                <button type="button" onclick="const p=document.getElementById('delete-pw-input');p.type=p.type==='password'?'text':'password'" class="absolute right-3 top-1/2 -translate-y-1/2 text-text-primary dark:text-dark-text opacity-50 hover:opacity-100 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
            </div>
        </div>
        <div id="delete-error" class="hidden text-xs text-red-500 mb-3 text-center"></div>
        <div class="flex gap-3"><button type="button" onclick="document.getElementById('delete-overlay').remove()" class="flex-1 btn-ghost py-3">Cancel</button>
        <button id="delete-confirm-btn" disabled onclick="handleDeleteAccount()" class="flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed">🗑️ Permanently Delete</button></div>
    </div>`;
    document.body.appendChild(overlay);

    // Enable button styling when password entered
    const input = overlay.querySelector('#delete-pw-input');
    // Auto-focus with slight delay
    setTimeout(() => input.focus(), 50);
    input.addEventListener('input', () => {
        const btn = overlay.querySelector('#delete-confirm-btn');
        if (input.value.length > 0) { btn.disabled = false; btn.className = 'flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 bg-red-500 text-white hover:bg-red-600 cursor-pointer shadow-md'; }
        else { btn.disabled = true; btn.className = 'flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'; }
    });
}

async function handleDeleteAccount() {
    const btn = document.getElementById('delete-confirm-btn');
    const pwInput = document.getElementById('delete-pw-input');
    const errDiv = document.getElementById('delete-error');

    errDiv.classList.add('hidden');
    btn.innerHTML = '<div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>';
    btn.disabled = true;
    pwInput.disabled = true;

    try {
        await apiDeleteAccount(pwInput.value);
        document.getElementById('delete-overlay').remove();
        showToast('Account permanently deleted', 'error');

        // Delay to let toast show, then redirect to auth
        setTimeout(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'auth.html';
        }, 1500);
    } catch (e) {
        console.error(e);
        const errDiv = document.getElementById('delete-error');
        errDiv.textContent = e.response?.data?.error || 'Failed to delete account';
        errDiv.classList.remove('hidden');
        btn.innerHTML = '🗑️ Permanently Delete';
        btn.className = 'flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed';
        btn.disabled = true;
        pwInput.disabled = false;
        pwInput.value = '';
        pwInput.focus();
    }
}

// ─── Settings Modals (API Keys & Logs) ──────────────────────────────────────

const MAIN_ADMIN_ACCOUNTS = [
    'sricharan@cloudpredict.ai',
    'hamsa@cloudpredict.ai',
    'jayakumar@cloudpredict.ai',
    'sampath@cloudpredict.ai'
];

function checkAdminAccess(featureName) {
    const userStr = localStorage.getItem('user');
    if (!userStr) return false;
    const user = JSON.parse(userStr);
    
    if (MAIN_ADMIN_ACCOUNTS.includes(user.email)) {
        return true;
    } else {
        showToast(`Access Denied: ${featureName} is locked. You are on a demo or restricted account.`, 'error');
        return false;
    }
}

function createGlassModal(id, title, icon, contentHTML) {
    if (document.getElementById(id)) return;
    
    const overlay = document.createElement('div');
    overlay.id = id;
    overlay.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md opacity-0 transition-opacity duration-300';
    
    // Smooth Apple-like entrance scale
    overlay.innerHTML = `
        <div class="bg-white/70 dark:bg-[#1E2024]/80 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-2xl rounded-3xl w-full max-w-2xl overflow-hidden transform scale-95 transition-transform duration-300 relative shadow-[0_30px_60px_rgba(0,0,0,0.12)]">
            <div class="px-8 py-6 border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="text-2xl">${icon}</div>
                    <h2 class="text-lg font-bold text-text-primary dark:text-dark-text tracking-tight">${title}</h2>
                </div>
                <button id="${id}-close-btn" class="w-8 h-8 rounded-full bg-gray-200/50 dark:bg-white/10 flex items-center justify-center hover:bg-gray-300/50 dark:hover:bg-white/20 transition-colors text-text-secondary dark:text-white/60 hover:text-text-primary dark:hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
            </div>
            <div class="p-8">
                ${contentHTML}
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const closeHandler = () => {
        overlay.classList.remove('opacity-100');
        overlay.querySelector('div').classList.remove('scale-100');
        setTimeout(() => overlay.remove(), 300);
    };

    overlay.querySelector(`#${id}-close-btn`).addEventListener('click', closeHandler);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeHandler();
    });
    
    // Document keydown for escape (needs to attach/detach properly, so we just check existence)
    const escListener = (e) => {
        if (e.key === 'Escape' && document.getElementById(id)) {
            closeHandler();
            document.removeEventListener('keydown', escListener);
        }
    };
    document.addEventListener('keydown', escListener);

    // Trigger animation
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            overlay.classList.add('opacity-100');
            overlay.querySelector('div').classList.add('scale-100');
        });
    });
}

function showApiKeysModal() {
    if (!checkAdminAccess('Manage API Keys')) return;

    const keys = [
        { name: 'AWS Cloud Services', role: 'Production Database Sync', key: 'ak_prod_8f92********************' },
        { name: 'Mapbox API', role: 'Geospatial Analytics Routing', key: 'pk.eyJ1IjoicH**************************' },
        { name: 'OpenAI API', role: 'Predictive Demand Insights Gen', key: 'sk-proj-Tf7*************************' },
        { name: 'SendGrid Email', role: 'System Alert Notifications', key: 'SG.9aWf*****************************' }
    ];

    const content = `
        <div class="space-y-4">
            ${keys.map(k => `
                <div class="flex items-center justify-between p-4 bg-white/50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10 transition-colors">
                    <div class="flex-1 min-w-0 pr-4">
                        <div class="text-sm font-bold text-text-primary dark:text-dark-text truncate">${k.name}</div>
                        <div class="text-xs text-text-secondary dark:text-dark-text-muted mt-0.5 truncate">${k.role}</div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="px-3 py-1.5 bg-gray-100/80 dark:bg-white/5 rounded-lg text-xs font-mono text-text-primary dark:text-white/80 select-all border border-transparent dark:border-white/5">
                            ${k.key}
                        </div>
                        <button onclick="showToast('API Key copied to clipboard', 'success')" class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary/10 text-primary dark:bg-blue-500/20 dark:text-blue-400 hover:bg-primary/20 dark:hover:bg-blue-500/30 transition-colors">Copy</button>
                    </div>
                </div>
            `).join('')}
            
            <div class="mt-8 flex items-start gap-3 p-4 bg-orange-50/80 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-900/30">
                <div class="text-orange-500 dark:text-orange-400 mt-0.5">⚠️</div>
                <div class="text-xs text-orange-800 dark:text-orange-300/80 leading-relaxed">
                    <strong>Security Warning:</strong> These API keys provide full read/write access to CloudPredict's production infrastructure. Never share them or expose them in client-side code repositories.
                </div>
            </div>
            
            <div class="mt-6 flex justify-end">
                 <button onclick="showToast('Generating new master token...', 'success')" class="px-5 py-2.5 bg-text-primary dark:bg-white text-white dark:text-black text-sm font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                     Rotate Master Key
                 </button>
            </div>
        </div>
    `;

    createGlassModal('modal-api-keys', 'Platform API Keys', '🔑', content);
}

function showLogsModal() {
    if (!checkAdminAccess('View System Logs')) return;

    // Load actual logs
    const storedLogs = JSON.parse(localStorage.getItem('sysLogs') || '[]');

    // Setup base flavor logs if the system is completely new
    let logsHtml = '';
    const now = new Date();
    
    if (storedLogs.length === 0) {
        const t5 = new Date(now.getTime() - 120 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const t4 = new Date(now.getTime() - 65 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const t3 = new Date(now.getTime() - 43 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const t2 = new Date(now.getTime() - 15 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        logsHtml += `
            <div class="text-white/60"><span class="text-green-400 mr-2">[${t5}]</span> <span>[INFO] Docker containers initialized on prod-cluster-A.</span></div>
            <div class="text-white/60"><span class="text-green-400 mr-2">[${t4}]</span> <span>[INFO] PostgreSQL database connected successfully (Pool: 20).</span></div>
            <div class="text-white/60"><span class="text-yellow-400 mr-2">[${t3}]</span> <span>[WARN] High memory usage detected on Redis node 04 (82%). Auto-scaling Triggered.</span></div>
            <div class="text-white/60"><span class="text-green-400 mr-2">[${t2}]</span> <span>[INFO] Cloud AWS snapshot backed up securely (Size: 4.2GB).</span></div>
        `;
    }

    // Render real stored logs (chronological order - newest at bottom)
    const reversedLogs = [...storedLogs].reverse();
    reversedLogs.forEach(l => {
        logsHtml += `<div class="text-white/60"><span class="text-green-400 mr-2">[${l.time}]</span> <span>[${l.type}] <span class="${l.color}">${l.message}</span></span></div>`;
    });

    const content = `
        <div class="bg-black/80 dark:bg-[#0E1015] rounded-2xl w-full h-[380px] border border-white/10 dark:border-white/5 overflow-hidden flex flex-col font-mono shadow-inner">
            <div class="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-black/40">
                <div class="w-3 h-3 rounded-full bg-red-500"></div>
                <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div class="w-3 h-3 rounded-full bg-green-500"></div>
                <div class="ml-2 text-[10px] text-white/40 uppercase tracking-widest">Live Terminal — sys-prod-01</div>
            </div>
            <div class="p-5 overflow-y-auto flex-1 space-y-3 text-xs leading-relaxed flex flex-col" id="live-log-container">
                <div class="flex-1 space-y-3">
                    ${logsHtml}
                </div>
                <div class="text-white/60 mt-3 pt-3 border-t border-white/10"><span class="text-green-400 mr-2">[Live]</span> <span class="text-white">Waiting for new incoming log streams...</span><span class="animate-pulse opacity-50 ml-1">_</span></div>
            </div>
        </div>
        
        <div class="mt-6 flex justify-between items-center">
            <div class="text-xs text-text-secondary dark:text-dark-text-muted">Showing latest ${storedLogs.length > 0 ? storedLogs.length : 'system'} lines of output.</div>
            <button onclick="exportLogsToCSV()" class="px-5 py-2 bg-bg-secondary dark:bg-white/10 text-text-primary dark:text-white text-sm font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
                📥 Export to CSV
            </button>
        </div>
    `;

    createGlassModal('modal-system-logs', 'Real-time System Logs', '📊', content);
    
    // Auto-scroll terminal to bottom
    setTimeout(() => {
        const container = document.getElementById('live-log-container');
        if (container) container.scrollTop = container.scrollHeight;
    }, 50);
}

function exportLogsToCSV() {
    const storedLogs = JSON.parse(localStorage.getItem('sysLogs') || '[]');
    
    // Add default flavor logs if empty for demo purposes
    let dataToExport = [];
    if (storedLogs.length === 0) {
        dataToExport = [
            { time: 'T-120m', type: 'INFO', message: 'Docker containers initialized on prod-cluster-A.' },
            { time: 'T-65m', type: 'INFO', message: 'PostgreSQL database connected successfully (Pool: 20).' },
            { time: 'T-43m', type: 'WARN', message: 'High memory usage detected on Redis node 04 (82%). Auto-scaling Triggered.' },
            { time: 'T-15m', type: 'INFO', message: 'Cloud AWS snapshot backed up securely (Size: 4.2GB).' }
        ];
    } else {
        dataToExport = [...storedLogs].reverse();
    }

    let csvContent = "Timestamp,Log Level,Message\n";
    dataToExport.forEach(l => {
        // Escape quotes in message
        const safeMsg = `"${l.message.replace(/"/g, '""')}"`;
        csvContent += `${l.time},${l.type},${safeMsg}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `cloudpredict_system_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Logs exported to CSV successfully', 'success');
}
