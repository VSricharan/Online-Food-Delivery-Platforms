// ─── API Client ─────────────────────────────────────────────────────────────
const BASE_URL = 'http://localhost:3001/api';

function getToken() {
    return localStorage.getItem('token');
}

function handleUnauthorized() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'auth.html';
}

async function apiRequest(method, path, body, responseType) {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const opts = { method, headers, timeout: 10000 };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(`${BASE_URL}${path}`, opts);

    if (res.status === 401) {
        if (path !== '/auth/login' && path !== '/auth/delete-account') {
            handleUnauthorized();
        }
        const err = await res.json().catch(() => ({}));
        throw { response: { status: res.status, data: err } };
    }

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw { response: { status: res.status, data: err } };
    }

    if (responseType === 'blob') return res.blob();
    if (responseType === 'text') return res.text();
    return res.json();
}

// ─── Public API functions ───────────────────────────────────────────────────

// Auth
function apiLogin(email, password) {
    return apiRequest('POST', '/auth/login', { email, password });
}

function apiRegister(name, email, password) {
    return apiRequest('POST', '/auth/register', { name, email, password });
}

function apiResetPassword(email, newPassword) {
    return apiRequest('POST', '/auth/reset-password', { email, newPassword });
}

function apiGetMe() {
    return apiRequest('GET', '/auth/me');
}

function apiUpdateProfile(name, email, role, institution, settings) {
    return apiRequest('PUT', '/auth/profile', { name, email, role, institution, settings });
}

function apiDeleteAccount(password) {
    return apiRequest('DELETE', '/auth/delete-account', { password });
}

// Dashboard
function apiGetStats() {
    return apiRequest('GET', '/dashboard/stats');
}

function apiGetDemand() {
    return apiRequest('GET', '/dashboard/demand');
}

// Analytics
function apiGetAnalytics() {
    return apiRequest('GET', '/analytics');
}

// Predictions
function apiGetPredictions() {
    return apiRequest('GET', '/predictions');
}

// Orders
function apiGetOrders(params) {
    const qs = new URLSearchParams();
    if (params.page) qs.set('page', params.page);
    if (params.limit) qs.set('limit', params.limit);
    if (params.q) qs.set('q', params.q);
    if (params.status) qs.set('status', params.status);
    return apiRequest('GET', `/orders?${qs.toString()}`);
}

// Reports
function apiGetReports() {
    return apiRequest('GET', '/reports');
}

async function apiDownloadReport(id, format) {
    if (format === 'pdf') {
        const text = await apiRequest('GET', `/reports/download/${id}?format=csv`, null, 'text');
        
        // In case there are multiple tables in the CSV (like empty line separated), split them
        const tables = text.trim().split('\n\n');
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        const titleMap = {
            'monthly-demand': 'Monthly Demand Report',
            'delivery-efficiency': 'Delivery Efficiency Report',
            'customer-analytics': 'Customer Analytics Report',
            'ml-model-performance': 'ML Model Performance Report',
            'revenue-analysis': 'Revenue Analysis Report'
        };
        
        doc.setFontSize(18);
        doc.text(titleMap[id] || 'Analytics Report', 14, 22);
        
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
        
        let startY = 40;
        
        tables.forEach(tableData => {
            const rows = tableData.split('\n').map(row => row.split(','));
            const head = [rows.shift()];
            const body = rows;
            
            doc.autoTable({
                head: head,
                body: body,
                startY: startY,
                theme: 'grid',
                styles: { fontSize: 9 },
                headStyles: { fillColor: [10, 132, 255] },
                margin: { bottom: 20 }
            });
            
            startY = doc.lastAutoTable.finalY + 15;
        });
        
        doc.save(`${id}_${new Date().toISOString().slice(0, 10)}.pdf`);
    } else {
        const blob = await apiRequest('GET', `/reports/download/${id}?format=${format}`, null, 'blob');
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${id}_${new Date().toISOString().slice(0, 10)}.${format}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    }
}

// Search
function apiGlobalSearch(q) {
    return apiRequest('GET', `/search?q=${encodeURIComponent(q)}`);
}
