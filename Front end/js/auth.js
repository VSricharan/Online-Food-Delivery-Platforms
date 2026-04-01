// ─── Auth Page JS ───────────────────────────────────────────────────────────

let currentTab = 'signin';

// ─── Tab switching ──────────────────────────────────────────────────────────
function switchTab(tab) {
    currentTab = tab;
    const tabSignin = document.getElementById('tab-signin');
    const tabSignup = document.getElementById('tab-signup');
    const hintText = document.getElementById('switch-hint-text');
    const hintBtn = document.getElementById('switch-hint-btn');

    const fieldName = document.getElementById('field-name');
    const fieldConfirm = document.getElementById('field-confirm');
    const forgotLink = document.getElementById('forgot-password-link');

    const authTitle = document.getElementById('auth-title');
    const authSubtitle = document.getElementById('auth-subtitle');
    const authBtnText = document.getElementById('auth-btn-text');

    document.getElementById('auth-error').classList.add('hidden');
    document.getElementById('auth-success').classList.add('hidden');

    if (tab === 'signin') {
        tabSignin.className = 'flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 bg-white dark:bg-dark-card shadow-soft text-text-primary dark:text-dark-text';
        tabSignup.className = 'flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 text-text-secondary dark:text-dark-text-muted hover:text-text-primary dark:hover:text-dark-text';

        fieldName.classList.add('hidden-state');
        fieldConfirm.classList.add('hidden-state');
        forgotLink.classList.remove('hidden-state');

        authTitle.textContent = 'Welcome back';
        authSubtitle.textContent = 'Sign in to access your analytics dashboard';
        authBtnText.textContent = 'Sign In';

        hintText.textContent = "Don't have an account?";
        hintBtn.textContent = 'Sign Up';

        document.getElementById('auth-name').removeAttribute('required');
        document.getElementById('auth-confirm').removeAttribute('required');
    } else {
        tabSignup.className = 'flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 bg-white dark:bg-dark-card shadow-soft text-text-primary dark:text-dark-text';
        tabSignin.className = 'flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 text-text-secondary dark:text-dark-text-muted hover:text-text-primary dark:hover:text-dark-text';

        fieldName.classList.remove('hidden-state');
        fieldConfirm.classList.remove('hidden-state');
        forgotLink.classList.add('hidden-state');

        authTitle.textContent = 'Create account';
        authSubtitle.textContent = 'Get started with CloudPredict analytics';
        authBtnText.textContent = 'Create Account';

        hintText.textContent = 'Already have an account?';
        hintBtn.textContent = 'Sign In';

        document.getElementById('auth-name').setAttribute('required', 'true');
        document.getElementById('auth-confirm').setAttribute('required', 'true');
    }

    // Adjust button spacing based on tab
    const authBtn = document.getElementById('auth-btn');
    if (authBtn) {
        if (tab === 'signin') {
            authBtn.classList.remove('mt-4');
            authBtn.classList.add('mt-6');
        } else {
            authBtn.classList.remove('mt-6');
            authBtn.classList.add('mt-4');
        }
    }
}

// ─── Password visibility toggle ─────────────────────────────────────────────
function togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    const eyeIcon = btn.querySelector('.eye-icon');
    const eyeOffIcon = btn.querySelector('.eye-off-icon');
    if (input.type === 'password') {
        input.type = 'text';
        eyeIcon.classList.add('hidden');
        eyeOffIcon.classList.remove('hidden');
    } else {
        input.type = 'password';
        eyeIcon.classList.remove('hidden');
        eyeOffIcon.classList.add('hidden');
    }
}

function updateCheck(id, ok) {
    const el = document.getElementById(id);
    if (!el) return;

    // Check if it's the new style (no icon-container, or specific id prefix)
    const iconContainer = el.querySelector('.icon-container');

    if (iconContainer) {
        // OLD STYLE (Registration)
        if (ok) {
            el.className = 'flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 transition-colors duration-200';
            iconContainer.className = 'w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 bg-green-100 dark:bg-green-900/30 transition-all duration-200 icon-container';
            iconContainer.innerHTML = '<svg width="8" height="8" viewBox="0 0 8 8"><path d="M1 4l2 2 4-4" stroke="#16a34a" class="dark:stroke-[#4ade80]" stroke-width="1.5" fill="none" stroke-linecap="round" /></svg>';
        } else {
            el.className = 'flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 transition-colors duration-200';
            iconContainer.className = 'w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100 dark:bg-gray-800 transition-all duration-200 icon-container';
            iconContainer.innerHTML = '<div class="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></div>';
        }
    } else {
        // NEW STYLE (Reset/High-Fidelity)
        if (ok) {
            el.className = 'text-[10px] text-green-500 font-bold uppercase tracking-tighter transition-colors flex items-center gap-1';
            const text = el.textContent.split(' ').slice(1).join(' '); // Remove old bullet/text if any
            el.textContent = '● ' + (text || el.textContent.replace('● ', ''));
        } else {
            el.className = 'text-[10px] text-gray-500 font-bold uppercase tracking-tighter transition-colors flex items-center gap-1';
            const text = el.textContent.split(' ').slice(1).join(' ');
            el.textContent = '● ' + (text || el.textContent.replace('● ', ''));
        }
    }
}

// ─── Password matching tick ───────────────────────────────────────────────────
function checkMatch(mainId, confirmId, tickContainerId) {
    const main = document.getElementById(mainId);
    const confirm = document.getElementById(confirmId);
    const tickContainer = document.getElementById(tickContainerId);

    if (!main || !confirm || !tickContainer) return;

    // SVG definitions for validation
    const checkIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    const crossIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';

    if (confirm.value.length === 0) {
        tickContainer.classList.add('scale-0');
        confirm.classList.remove('border-red-500', 'border-green-500');
        return;
    }

    if (main.value === confirm.value) {
        tickContainer.innerHTML = checkIcon;
        tickContainer.classList.remove('scale-0');
        tickContainer.classList.add('scale-100');
    } else {
        tickContainer.innerHTML = crossIcon;
        tickContainer.classList.remove('scale-0');
        tickContainer.classList.add('scale-100');
    }
}

// ─── Registration Password strength meter ──────────────────────────────────────────
function updatePasswordStrength(pw) {
    const container = document.getElementById('pw-strength-container');
    if (!container) return;
    const bars = [document.getElementById('pw-bar-1'), document.getElementById('pw-bar-2'), document.getElementById('pw-bar-3'), document.getElementById('pw-bar-4')];
    const textEl = document.getElementById('pw-text');

    if (pw.length === 0) {
        container.style.opacity = '1';
        updateCheck('check-length', false); updateCheck('check-upper', false);
        updateCheck('check-number', false); updateCheck('check-special', false);
        
        bars.forEach(bar => {
            bar.className = 'h-1.5 flex-1 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300';
        });
        textEl.textContent = 'WEAK';
        textEl.className = 'text-xs font-semibold w-12 text-right text-gray-400';
        return;
    }
    container.style.opacity = '1';

    let score = 0;
    const hasLen = pw.length >= 8;
    const hasUpp = /[A-Z]/.test(pw);
    const hasNum = /[0-9]/.test(pw);
    const hasSpc = /[^A-Za-z0-9]/.test(pw);

    if (hasLen) score++;
    if (hasUpp) score++;
    if (hasNum) score++;
    if (hasSpc) score++;

    updateCheck('check-length', hasLen);
    updateCheck('check-upper', hasUpp);
    updateCheck('check-number', hasNum);
    updateCheck('check-special', hasSpc);

    const configs = [
        { color: 'bg-red-500', text: 'Weak', textColor: 'text-red-500' },
        { color: 'bg-orange-500', text: 'Fair', textColor: 'text-orange-500' },
        { color: 'bg-yellow-500', text: 'Good', textColor: 'text-yellow-500' },
        { color: 'bg-green-500', text: 'Strong', textColor: 'text-green-500' },
    ];

    const config = configs[Math.max(0, score - 1)] || configs[0];

    bars.forEach((bar, i) => {
        if (i < score) {
            bar.className = `h-1.5 flex-1 rounded-full transition-colors duration-300 ${config.color}`;
        } else {
            bar.className = 'h-1.5 flex-1 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300';
        }
    });

    textEl.textContent = config.text;
    textEl.className = `text-xs font-semibold w-12 text-right ${config.textColor}`;
}

// ─── Reset Password strength meter ──────────────────────────────────────────
function updateResetPasswordStrength(pw) {
    const wrapper = document.getElementById('reset-pw-strength-wrapper');
    if (!wrapper) return;
    const bars = [
        document.getElementById('reset-pw-bar-1'),
        document.getElementById('reset-pw-bar-2'),
        document.getElementById('reset-pw-bar-3'),
        document.getElementById('reset-pw-bar-4')
    ];

    if (pw.length === 0) {
        wrapper.classList.add('hidden');
        updateCheck('reset-check-length', false);
        updateCheck('reset-check-upper', false);
        updateCheck('reset-check-number', false);
        updateCheck('reset-check-special', false);
        return;
    }
    wrapper.classList.remove('hidden');

    let score = 0;
    const hasLen = pw.length >= 8;
    const hasUpp = /[A-Z]/.test(pw);
    const hasNum = /[0-9]/.test(pw);
    const hasSpc = /[^A-Za-z0-9]/.test(pw);

    if (hasLen) score++;
    if (hasUpp) score++;
    if (hasNum) score++;
    if (hasSpc) score++;

    updateCheck('reset-check-length', hasLen);
    updateCheck('reset-check-upper', hasUpp);
    updateCheck('reset-check-number', hasNum);
    updateCheck('reset-check-special', hasSpc);

    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
    const activeColor = colors[Math.max(0, score - 1)] || 'bg-red-500';

    bars.forEach((bar, i) => {
        if (!bar) return;
        if (i < score) {
            bar.className = `h-1.5 flex-1 rounded-full transition-colors duration-300 ${activeColor}`;
        } else {
            bar.className = `h-1.5 flex-1 rounded-full bg-white/10 transition-colors duration-300`;
        }
    });

    const textEl = document.getElementById('reset-pw-text');
    if (textEl) {
        const textConfigs = [
            { text: 'Weak', textColor: 'text-red-500' },
            { text: 'Fair', textColor: 'text-orange-500' },
            { text: 'Good', textColor: 'text-yellow-500' },
            { text: 'Strong', textColor: 'text-green-500' }
        ];
        const config = textConfigs[Math.max(0, score - 1)] || textConfigs[0];
        textEl.textContent = config.text;
        textEl.className = `text-xs font-semibold w-12 text-right ${config.textColor}`;
    }
}

// ─── Unified Auth handler ───────────────────────────────────────────────────
async function handleAuthSubmit(e) {
    e.preventDefault();
    if (currentTab === 'signin') {
        await handleSignIn();
    } else {
        await handleSignUp();
    }
}

async function handleSignIn() {
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    const errorDiv = document.getElementById('auth-error');
    const btn = document.getElementById('auth-btn');
    const btnText = document.getElementById('auth-btn-text');
    const spinner = document.getElementById('auth-spinner');

    errorDiv.classList.add('hidden');
    btn.disabled = true;
    btnText.textContent = 'Signing in...';
    spinner.classList.remove('hidden');

    try {
        const res = await apiLogin(email, password);
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        pushSystemLog('AUTH', `User ${res.user.name} (${res.user.role}) authenticated successfully.`, 'text-blue-400');
        window.location.href = 'dashboard.html';
    } catch (err) {
        const msg = err?.response?.data?.error || err?.response?.data?.message || 'Login failed. Please try again.';
        errorDiv.textContent = msg;
        errorDiv.classList.remove('hidden');
    } finally {
        btn.disabled = false;
        btnText.textContent = 'Sign In';
        spinner.classList.add('hidden');
    }
}

async function handleSignUp() {
    const name = document.getElementById('auth-name').value.trim();
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    const confirm = document.getElementById('auth-confirm').value;
    const errorDiv = document.getElementById('auth-error');
    const successDiv = document.getElementById('auth-success');
    const btn = document.getElementById('auth-btn');
    const btnText = document.getElementById('auth-btn-text');
    const spinner = document.getElementById('auth-spinner');

    errorDiv.classList.add('hidden');
    successDiv.classList.add('hidden');

    if (password !== confirm) {
        errorDiv.textContent = 'Passwords do not match.';
        errorDiv.classList.remove('hidden');
        return;
    }

    const hasLen = password.length >= 8;
    const hasUpp = /[A-Z]/.test(password);
    const hasNum = /[0-9]/.test(password);
    const hasSpc = /[^A-Za-z0-9]/.test(password);

    if (!hasLen || !hasUpp || !hasNum || !hasSpc) {
        errorDiv.textContent = 'Password must meet all 4 strength criteria.';
        errorDiv.classList.remove('hidden');
        return;
    }

    btn.disabled = true;
    btnText.textContent = 'Creating account...';
    spinner.classList.remove('hidden');

    try {
        await apiRegister(name, email, password);
        successDiv.textContent = '🎉 Account created! Please sign in to continue.';
        successDiv.classList.remove('hidden');
        setTimeout(() => switchTab('signin'), 2000);
    } catch (err) {
        const msg = err?.response?.data?.error || err?.response?.data?.message || 'Registration failed. Please try again.';
        errorDiv.textContent = msg;
        errorDiv.classList.remove('hidden');
    } finally {
        btn.disabled = false;
        btnText.textContent = 'Create Account';
        spinner.classList.add('hidden');
    }
}

// ─── Reset password ─────────────────────────────────────────────────────────
function showResetModal() {
    const modal = document.getElementById('reset-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.getElementById('changepw-form-wrapper').classList.remove('hidden');
    document.getElementById('changepw-success-container').classList.add('hidden');
    document.getElementById('changepw-error').classList.add('hidden');

    // Auto-fill and hide email if logged in
    const userStr = localStorage.getItem('user');
    const emailInput = document.getElementById('changepw-email');
    const emailContainer = document.getElementById('changepw-email-container');

    if (userStr && emailInput && emailContainer) {
        try {
            const user = JSON.parse(userStr);
            if (user.email) {
                emailInput.value = user.email;
                emailContainer.style.display = 'none';
            }
        } catch (e) { }
    }
}

function hideResetModal() {
    const modal = document.getElementById('reset-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

async function handleChangePassword() {
    const errorDiv = document.getElementById('changepw-error');
    const btn = document.getElementById('changepw-submit-btn');
    const btnText = document.getElementById('changepw-submit-text');
    const spinner = document.getElementById('changepw-spinner');

    const email = document.getElementById('changepw-email').value.trim();
    const password = document.getElementById('changepw-new').value;
    const confirm = document.getElementById('changepw-confirm').value;

    errorDiv.classList.add('hidden');

    if (password !== confirm) {
        errorDiv.textContent = 'Passwords do not match.';
        errorDiv.classList.remove('hidden');
        return;
    }

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
    if (btnText) btnText.textContent = 'Updating...';
    if (spinner) spinner.classList.remove('hidden');

    try {
        await apiResetPassword(email, password);
        document.getElementById('changepw-form-wrapper').classList.add('hidden');
        document.getElementById('changepw-success-container').classList.remove('hidden');
        document.getElementById('changepw-success-container').classList.add('flex');
        setTimeout(() => hideResetModal(), 2500);
    } catch (err) {
        console.error(err);
        errorDiv.textContent = err.response?.data?.error || 'Failed to reset password. Check your email.';
        errorDiv.classList.remove('hidden');
    } finally {
        btn.disabled = false;
        if (btnText) btnText.textContent = 'Reset Password';
        if (spinner) spinner.classList.add('hidden');
    }
}

// ─── Check if already logged in ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        if (window.location.pathname.endsWith('auth.html') || window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
            window.location.href = 'dashboard.html';
        }
    }
});
