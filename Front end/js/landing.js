// ─── Landing Page JS ────────────────────────────────────────────────────────

// ─── Data ───────────────────────────────────────────────────────────────────
const features = [
    { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>', title: 'Demand Prediction', description: 'AI models trained on historical data predict food order trends with up to 80% accuracy, helping restaurants prepare optimally.', color: '#3B82F6', bg: 'bg-blue-50 dark:bg-blue-900/10', glow: 'hover:shadow-glow-blue' },
    { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>', title: 'Delivery Optimization', description: 'Reduce delivery time using intelligent routing algorithms that adapt to real-time traffic conditions.', color: '#A855F7', bg: 'bg-purple-50 dark:bg-purple-900/10', glow: 'hover:shadow-glow-purple' },
    { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>', title: 'Real-Time Analytics', description: 'Monitor platform performance instantly with live dashboards and automated alerts for anomalies.', color: '#22C55E', bg: 'bg-green-50 dark:bg-green-900/10', glow: 'hover:shadow-glow-green' },
    { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>', title: 'Cloud Integration', description: 'Scalable cloud architecture that grows with your platform — from hundreds to millions of orders.', color: '#0EA5E9', bg: 'bg-sky-50 dark:bg-sky-900/10', glow: 'hover:shadow-glow-sky' },
    { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>', title: 'Customer Behavior Analysis', description: 'Understand ordering patterns, preferences, and churn risk to deliver personalized experiences.', color: '#F97316', bg: 'bg-orange-50 dark:bg-orange-900/10', glow: 'hover:shadow-glow-orange' },
    { icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>', title: 'Predictive Reporting', description: 'Generate AI-powered reports with business insights and recommended actions automatically.', color: '#EC4899', bg: 'bg-pink-50 dark:bg-pink-900/10', glow: 'hover:shadow-glow-pink' },
];

const steps = [
    { number: '01', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>', title: 'Data Collection', description: 'Collect comprehensive order, user behavior, and delivery data from multiple sources including mobile apps, POS systems, and IoT sensors.', items: ['Order histories & patterns', 'User demographics & preferences', 'Delivery GPS & timing data'] },
    { number: '02', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>', title: 'Machine Learning Processing', description: 'Advanced ML models predict demand patterns, identify peak hours, and optimize logistics using trained neural networks and ensemble methods.', items: ['Time-series forecasting', 'Route optimization algorithms', 'Anomaly detection & alerts'] },
    { number: '03', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>', title: 'Smart Recommendations', description: 'Actionable insights delivered to restaurant operators, delivery managers, and business stakeholders to improve efficiency and user experience.', items: ['Inventory pre-stocking alerts', 'Dynamic driver dispatch', 'Personalized customer offers'] },
];

const techs = [
    { label: 'R Programming', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>', desc: 'Statistical Computing', color: '#3B82F6', usedIn: 'Backend & ML Pipeline', usage: 'R powers our entire statistical analysis and machine learning pipeline — from data wrangling with dplyr and tidyverse to model training with caret and randomForest. It processes and transforms 2,000+ food delivery orders into actionable predictions displayed on the Dashboard.' },
    { label: 'Machine Learning', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>', desc: 'Scikit-learn, TensorFlow', color: '#F59E0B', usedIn: 'Predictions Section', usage: 'XGBoost, Random Forest, Decision Tree, and Linear Regression models are trained and compared in the Predictions section. The ML Model Comparison table shows real accuracy, precision, recall, and F1 scores for each model.' },
    { label: 'Cloud Computing', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>', desc: 'AWS / GCP / Azure', color: '#06B6D4', usedIn: 'Settings → Cloud Integration', usage: 'Cloud provider, region, and sync frequency are all configurable in the Settings page under Cloud Integration. The backend uses cloud-ready Node.js APIs with auto-scaling and encrypted backup toggles for production readiness.' },
    { label: 'Data Analytics', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>', desc: 'Pandas, NumPy', color: '#8B5CF6', usedIn: 'Analytics Section', usage: 'The Analytics dashboard visualizes city-wise performance, platform distribution, customer satisfaction trends, and high-demand areas — all powered by Pandas/NumPy data processing from Power BI CSV exports.' },
    { label: 'REST APIs', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>', desc: 'Node.js, Express', color: '#10B981', usedIn: 'Backend Server', usage: 'The Express.js REST API server hosts endpoints like /api/analytics, /api/predictions, /api/orders, and /api/auth — serving real-time data to every section of the frontend dashboard via secure JWT-authenticated requests.' },
    { label: 'Database', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>', desc: 'CSV Data Warehouse', color: '#EC4899', usedIn: 'Data Layer', usage: 'Our in-memory data warehouse loads multiple Power BI CSV files on startup — including order data, regression results, classification outputs, city stats, and restaurant analytics — forming the backbone of all dashboard metrics.' },
    { label: 'Real-time', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>', desc: 'Live Dashboard', color: '#F97316', usedIn: 'Dashboard & Orders', usage: 'The main Dashboard shows live KPI cards (total orders, high demand %, avg cost, satisfaction) that update in real-time. The Orders section provides a searchable, filterable table with pagination across 2,000+ records.' },
    { label: 'Visualization', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>', desc: 'Chart.js, SVG Charts', color: '#0EA5E9', usedIn: 'Charts & Reports', usage: 'Interactive Chart.js visualizations render order trends, peak hours, city comparisons, and volume forecasts throughout the Analytics and Predictions sections. The Reports page generates downloadable PDF summaries with embedded charts.' },
];

// ─── Render lists ───────────────────────────────────────────────────────────
function renderFeatures() {
    const grid = document.getElementById('features-grid');
    features.forEach((f, i) => {
        const div = document.createElement('div');
        div.className = `card dark:bg-dark-card dark:border-dark-border dark:shadow-none group cursor-default transition-all duration-300 ${f.glow} stagger-enter`;
        div.style.transitionDelay = `${i * 0.08}s`;
        div.innerHTML = `
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md ${f.bg}" style="color:${f.color}">
                ${f.icon}
            </div>
            <h3 class="text-lg font-bold text-text-primary dark:text-dark-text mb-2">${f.title}</h3>
            <p class="text-sm text-text-secondary dark:text-dark-text-muted leading-relaxed">${f.description}</p>
        `;
        grid.appendChild(div);
    });
}

function renderSteps() {
    const grid = document.getElementById('steps-grid');
    steps.forEach((step, i) => {
        const div = document.createElement('div');
        div.className = 'relative stagger-enter';
        div.style.transitionDelay = `${i * 0.12}s`;
        div.innerHTML = `
            <div class="bg-white dark:bg-dark-card rounded-3xl p-8 shadow-soft dark:shadow-none border border-gray-100 dark:border-dark-border h-full hover:shadow-medium dark:hover:border-primary/30 transition-all duration-300 hover:-translate-y-1.5">
                <div class="flex items-center gap-4 mb-6">
                    <div class="text-5xl font-black text-gradient opacity-25 dark:opacity-40">${step.number}</div>
                    <div class="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary dark:text-blue-400">
                        ${step.icon}
                    </div>
                </div>
                <h3 class="text-xl font-bold text-text-primary dark:text-dark-text mb-3">${step.title}</h3>
                <p class="text-sm text-text-secondary dark:text-dark-text-muted leading-relaxed mb-5">${step.description}</p>
                <ul class="space-y-2">
                    ${step.items.map(item => `
                        <li class="flex items-center gap-2 text-sm text-text-secondary dark:text-dark-text-muted">
                            <div class="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></div>
                            ${item}
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
        grid.appendChild(div);
    });
}

function renderTechs() {
    const grid = document.getElementById('tech-grid');

    // ── Create shared overlay (once) ──
    const overlay = document.createElement('div');
    overlay.className = 'tech-overlay';
    overlay.innerHTML = `<div class="tech-modal-card" id="tech-modal"><div class="tech-modal-inner"><div class="tech-modal-front"></div><div class="tech-modal-back"></div></div></div>`;
    document.body.appendChild(overlay);

    const modal = overlay.querySelector('#tech-modal');
    const backFace = overlay.querySelector('.tech-modal-back');

    function closeModal() {
        modal.classList.remove('flipped');
        setTimeout(() => {
            overlay.classList.remove('visible');
        }, 350);
    }

    // Click ANYWHERE on the overlay (including the card) → close
    overlay.addEventListener('click', () => {
        if (overlay.classList.contains('visible')) closeModal();
    });

    // Escape key → close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('visible')) closeModal();
    });

    // ── Render grid cards ──
    techs.forEach((tech, i) => {
        const card = document.createElement('div');
        card.className = 'tech-grid-card group bg-bg-secondary dark:bg-dark-surface rounded-2xl p-6 flex flex-col items-center text-center gap-3 border border-gray-200/80 dark:border-transparent hover:border-gray-300 dark:hover:border-dark-border shadow-sm stagger-enter';
        card.style.transitionDelay = `${i * 0.06}s`;
        card.onmouseenter = function () { this.style.boxShadow = `0 0 28px ${tech.color}35, 0 10px 36px rgba(0,0,0,0.08)`; };
        card.onmouseleave = function () { this.style.boxShadow = ''; };

        card.innerHTML = `
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110" style="background-color:${tech.color}28; color:${tech.color}">
                ${tech.icon}
            </div>
            <div>
                <div class="font-bold dark:text-dark-text text-base" style="color:#1D1D1F">${tech.label}</div>
                <div class="text-xs dark:text-dark-text-muted mt-0.5" style="color:#515154">${tech.desc}</div>
            </div>
        `;

        card.addEventListener('click', () => {
            // Populate the back face with usage info
            backFace.style.background = `linear-gradient(145deg, ${tech.color}12 0%, ${tech.color}22 100%)`;
            backFace.style.borderColor = `${tech.color}40`;
            backFace.innerHTML = `
                <div class="flex items-center gap-4 mb-5 w-full">
                    <div class="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style="background-color:${tech.color}28; color:${tech.color}">
                        ${tech.icon}
                    </div>
                    <div class="text-left">
                        <div class="text-xl font-bold dark:text-dark-text" style="color:#1D1D1F">${tech.label}</div>
                        <div class="text-sm dark:text-dark-text-muted" style="color:#515154">${tech.desc}</div>
                    </div>
                </div>
                <div class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest mb-5 self-start" style="background:${tech.color}22; color:${tech.color}; border: 1px solid ${tech.color}45;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    Used in: ${tech.usedIn}
                </div>
                <p class="text-[15px] dark:text-dark-text-muted leading-relaxed text-left" style="color:#3a3a3c">${tech.usage}</p>
                <div class="tech-modal-close-hint" style="color:#6E6E73">Click anywhere or press Esc to close</div>
            `;

            // Show overlay → then flip to reveal the back face
            modal.classList.remove('flipped');
            overlay.classList.add('visible');
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    modal.classList.add('flipped');
                });
            });
        });

        grid.appendChild(card);
    });
}

// ─── Scroll Reveal via IntersectionObserver ──────────────────────────────────
function setupScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal, .stagger-enter').forEach(el => observer.observe(el));

    // Also observe progress bars
    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const value = bar.dataset.value;
                setTimeout(() => { bar.style.width = value + '%'; }, 200);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.progress-bar-fill').forEach(el => barObserver.observe(el));
}

// ─── Count-Up Animation ─────────────────────────────────────────────────────
function setupCountUp() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const to = parseFloat(el.dataset.to);
                const suffix = el.dataset.suffix || '';
                const decimal = el.dataset.decimal ? parseInt(el.dataset.decimal) : 0;
                const duration = 1800;
                const start = performance.now();

                function update(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = to * eased;
                    if (decimal > 0) {
                        el.textContent = current.toFixed(decimal) + suffix;
                    } else {
                        el.textContent = Math.round(current) + suffix;
                    }
                    if (progress < 1) requestAnimationFrame(update);
                }
                requestAnimationFrame(update);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.count-up').forEach(el => observer.observe(el));
}

// ─── Navbar scroll effect ───────────────────────────────────────────────────
function setupNavbar() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('glass-nav', 'shadow-soft', 'dark:bg-dark-surface/80', 'dark:backdrop-blur-md', 'dark:shadow-none', 'dark:border-b', 'dark:border-dark-border');
            navbar.classList.remove('bg-transparent');
        } else {
            navbar.classList.remove('glass-nav', 'shadow-soft', 'dark:bg-dark-surface/80', 'dark:backdrop-blur-md', 'dark:shadow-none', 'dark:border-b', 'dark:border-dark-border');
            navbar.classList.add('bg-transparent');
        }
    });
}

// ─── Navigation helpers ─────────────────────────────────────────────────────
function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    // Close mobile menu
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) mobileMenu.classList.add('hidden');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    if (menuIcon) menuIcon.style.display = 'block';
    if (closeIcon) closeIcon.style.display = 'none';
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    const isHidden = menu.classList.contains('hidden');
    menu.classList.toggle('hidden');
    menuIcon.style.display = isHidden ? 'none' : 'block';
    closeIcon.style.display = isHidden ? 'block' : 'none';
}

// ─── #9: Parallax Scroll on Hero Orbs ────────────────────────────────────────
function setupParallax() {
    const heroSection = document.getElementById('home');
    if (!heroSection) return;
    const orbs = heroSection.querySelectorAll('.animate-drift-1, .animate-drift-2, .animate-drift-3');
    if (orbs.length === 0) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const sy = window.scrollY;
                if (sy < window.innerHeight * 1.5) {
                    orbs.forEach((orb, i) => {
                        const rate = 0.03 + i * 0.02;
                        orb.style.transform = `translateY(${sy * rate}px)`;
                    });
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// ─── Init ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    renderFeatures();
    renderSteps();
    renderTechs();
    setupScrollReveal();
    setupCountUp();
    setupNavbar();
    setupParallax();
});
