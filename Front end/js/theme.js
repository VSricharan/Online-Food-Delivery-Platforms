// ─── Theme / Dark Mode ──────────────────────────────────────────────────────
(function () {
    const root = document.documentElement;

    function getPreferred() {
        const saved = localStorage.getItem('theme');
        if (saved) return saved === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function applyTheme(isDark) {
        if (isDark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
        // Update all toggle button icons on page
        document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
            const sunIcon = btn.querySelector('.icon-sun');
            const moonIcon = btn.querySelector('.icon-moon');
            if (sunIcon && moonIcon) {
                sunIcon.style.display = isDark ? 'block' : 'none';
                moonIcon.style.display = isDark ? 'none' : 'block';
            }
        });
    }

    // Apply on load
    applyTheme(getPreferred());

    // Global toggle function
    window.toggleTheme = function () {
        const isDark = root.classList.contains('dark');
        applyTheme(!isDark);
    };
})();
