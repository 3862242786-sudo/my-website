// ===== 个性化设置页面交互逻辑 =====

(function() {
    'use strict';

    // 当前设置（工作副本）
    var work = null;
    var gradientDir = '135deg';
    var activePreset = null;

    // DOM 引用
    var presetGrid = document.getElementById('presetGrid');
    var colorPrimary = document.getElementById('colorPrimary');
    var hexPrimary = document.getElementById('hexPrimary');
    var colorPrimaryHover = document.getElementById('colorPrimaryHover');
    var hexPrimaryHover = document.getElementById('hexPrimaryHover');
    var colorSecondary = document.getElementById('colorSecondary');
    var hexSecondary = document.getElementById('hexSecondary');
    var darkModeToggle = document.getElementById('darkModeToggle');
    var fontSizeSlider = document.getElementById('fontSizeSlider');
    var fontSizeVal = document.getElementById('fontSizeVal');
    var navOpacitySlider = document.getElementById('navOpacitySlider');
    var navOpacityVal = document.getElementById('navOpacityVal');
    var radiusSlider = document.getElementById('radiusSlider');
    var radiusVal = document.getElementById('radiusVal');
    var primaryVal = document.getElementById('primaryVal');
    var gradDirVal = document.getElementById('gradDirVal');
    var gradientPreview = document.getElementById('gradientPreview');
    var gradientDirBtns = document.querySelectorAll('.gradient-dir-btn');

    // 预览区元素
    var pvLogo = document.getElementById('pvLogo');
    var pvGradient = document.getElementById('pvGradient');
    var pvBtn = document.getElementById('pvBtn');
    var pvNavText = document.getElementById('pvNavText');

    // ===== 初始化 =====
    function init() {
        // 确保 QNTheme 已加载
        if (!window.QNTheme) {
            setTimeout(init, 50);
            return;
        }

        // 加载当前设置
        work = window.QNTheme.load();

        // 从设置中提取渐变方向
        var gradMatch = work.gradient && work.gradient.match(/^linear-gradient\(([^,]+),/);
        if (gradMatch) {
            gradientDir = gradMatch[1].trim();
        }

        // 检测匹配的预设
        for (var key in window.QNTheme.presets) {
            if (!window.QNTheme.presets.hasOwnProperty(key)) continue;
            var p = window.QNTheme.presets[key];
            if (p.primary === work.primary && p.secondary === work.secondary && p.dark === work.dark) {
                activePreset = key;
                break;
            }
        }

        renderPresets();
        loadValuesToUI();
        bindEvents();
        updatePreview();
    }

    // ===== 渲染预设卡片 =====
    function renderPresets() {
        var presets = window.QNTheme.presets;
        var html = '';
        for (var key in presets) {
            if (!presets.hasOwnProperty(key)) continue;
            var p = presets[key];
            var isActive = (activePreset === key);
            var gradDir = '135deg';
            var gradColors = p.gradient.replace(/^linear-gradient\([^,]+,\s*/, '').replace(/\)$/, '');
            html += '<div class="preset-card' + (isActive ? ' active' : '') + '" data-preset="' + key + '">';
            html += '  <div class="preset-preview">';
            html += '    <div class="pp-bg" style="background:' + p.bg + '"></div>';
            html += '    <div class="pp-surface" style="background:' + p.surface + '">';
            html += '      <div class="pp-dot" style="background:' + p.gradient + '"></div>';
            html += '    </div>';
            html += '  </div>';
            html += '  <div class="preset-name">' + p.name + '</div>';
            html += '  <div class="preset-tag">' + (p.dark ? '暗色模式' : '亮色模式') + '</div>';
            html += '</div>';
        }
        presetGrid.innerHTML = html;

        // 绑定点击事件
        var cards = presetGrid.querySelectorAll('.preset-card');
        cards.forEach(function(card) {
            card.addEventListener('click', function() {
                var key = card.getAttribute('data-preset');
                applyPreset(key);
            });
        });
    }

    // ===== 应用预设 =====
    function applyPreset(key) {
        var preset = window.QNTheme.presets[key];
        if (!preset) return;

        activePreset = key;
        work = JSON.parse(JSON.stringify(preset));

        // 提取渐变方向
        var gradMatch = work.gradient && work.gradient.match(/^linear-gradient\(([^,]+),/);
        if (gradMatch) gradientDir = gradMatch[1].trim();

        loadValuesToUI();
        renderPresets();
        applyToPage();
        updatePreview();
        showToast('已应用「' + preset.name + '」预设，可继续自定义调整', 'info');
    }

    // ===== 将设置值同步到 UI 控件 =====
    function loadValuesToUI() {
        // 颜色
        setColorUI('primary', work.primary);
        setColorUI('primaryHover', work.primaryHover);
        setColorUI('secondary', work.secondary);

        // 暗色模式
        darkModeToggle.checked = !!work.dark;

        // 滑块
        fontSizeSlider.value = work.fontSize;
        fontSizeVal.textContent = work.fontSize + 'px';
        navOpacitySlider.value = Math.round(work.navOpacity * 100);
        navOpacityVal.textContent = Math.round(work.navOpacity * 100) + '%';
        radiusSlider.value = work.radius;
        radiusVal.textContent = work.radius + 'px';

        // 渐变方向按钮
        gradientDirBtns.forEach(function(btn) {
            btn.classList.toggle('active', btn.getAttribute('data-dir') === gradientDir);
        });
        gradDirVal.textContent = gradientDir;
    }

    function setColorUI(field, hex) {
        var safeHex = /^#[0-9a-fA-F]{6}$/.test(hex) ? hex : '#3b82f6';
        switch(field) {
            case 'primary':
                colorPrimary.value = safeHex;
                hexPrimary.value = safeHex.toUpperCase();
                primaryVal.textContent = safeHex.toUpperCase();
                break;
            case 'primaryHover':
                colorPrimaryHover.value = safeHex;
                hexPrimaryHover.value = safeHex.toUpperCase();
                break;
            case 'secondary':
                colorSecondary.value = safeHex;
                hexSecondary.value = safeHex.toUpperCase();
                break;
        }
    }

    // ===== 绑定事件 =====
    function bindEvents() {
        // 颜色选择器联动
        bindColorPair(colorPrimary, hexPrimary, function(val) {
            work.primary = val;
            primaryVal.textContent = val.toUpperCase();
            autoAdjustHover(val);
            activePreset = null;
            renderPresets();
            applyToPage();
            updatePreview();
        });
        bindColorPair(colorPrimaryHover, hexPrimaryHover, function(val) {
            work.primaryHover = val;
            activePreset = null;
            renderPresets();
            applyToPage();
            updatePreview();
        });
        bindColorPair(colorSecondary, hexSecondary, function(val) {
            work.secondary = val;
            activePreset = null;
            renderPresets();
            applyToPage();
            updatePreview();
        });

        // 暗色模式
        darkModeToggle.addEventListener('change', function() {
            work.dark = this.checked;
            if (this.checked) {
                // 切到暗色模式：切换背景相关颜色，保留主色调
                work.bg = '#0f172a';
                work.surface = '#1e293b';
                work.text = '#f1f5f9';
                work.textSecondary = '#94a3b8';
                work.textMuted = '#64748b';
                work.border = '#334155';
                work.mutedBg = '#1e293b';
            } else {
                // 切回亮色：恢复默认背景颜色，保留主色调
                var defaults = window.QNTheme.getDefault();
                work.bg = defaults.bg;
                work.surface = defaults.surface;
                work.text = defaults.text;
                work.textSecondary = defaults.textSecondary;
                work.textMuted = defaults.textMuted;
                work.border = defaults.border;
                work.mutedBg = defaults.mutedBg;
            }
            activePreset = null;
            renderPresets();
            applyToPage();
            updatePreview();
        });

        // 字体大小滑块
        fontSizeSlider.addEventListener('input', function() {
            work.fontSize = parseInt(this.value);
            fontSizeVal.textContent = work.fontSize + 'px';
            activePreset = null;
            renderPresets();
            applyToPage();
            updatePreview();
        });

        // 导航透明度滑块
        navOpacitySlider.addEventListener('input', function() {
            work.navOpacity = parseInt(this.value) / 100;
            navOpacityVal.textContent = this.value + '%';
            activePreset = null;
            renderPresets();
            applyToPage();
            updatePreview();
        });

        // 圆角滑块
        radiusSlider.addEventListener('input', function() {
            work.radius = parseInt(this.value);
            radiusVal.textContent = work.radius + 'px';
            activePreset = null;
            renderPresets();
            applyToPage();
            updatePreview();
        });

        // 渐变方向按钮
        gradientDirBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                gradientDir = btn.getAttribute('data-dir');
                gradientDirBtns.forEach(function(b) { b.classList.remove('active'); });
                btn.classList.add('active');
                gradDirVal.textContent = gradientDir;
                work.gradient = 'linear-gradient(' + gradientDir + ', ' + work.primary + ', ' + work.secondary + ')';
                activePreset = null;
                renderPresets();
                applyToPage();
                updatePreview();
            });
        });
    }

    // 绑定颜色选择器和文本输入联动
    function bindColorPair(colorEl, hexEl, callback) {
        colorEl.addEventListener('input', function() {
            var val = this.value;
            hexEl.value = val.toUpperCase();
            callback(val);
        });
        hexEl.addEventListener('input', function() {
            var val = this.value.trim();
            if (/^#[0-9a-fA-F]{6}$/.test(val)) {
                colorEl.value = val;
                callback(val);
            }
        });
        hexEl.addEventListener('blur', function() {
            var val = this.value.trim();
            if (!/^#[0-9a-fA-F]{6}$/.test(val)) {
                // 恢复为当前值
                var currentVal = colorEl.value;
                this.value = currentVal.toUpperCase();
            }
        });
    }

    // 根据主色自动调整 hover 色（变暗20%）
    function autoAdjustHover(primary) {
        var darker = darkenColor(primary, 0.15);
        work.primaryHover = darker;
        setColorUI('primaryHover', darker);
    }

    // 颜色变暗
    function darkenColor(hex, amount) {
        var r = parseInt(hex.substr(1, 2), 16);
        var g = parseInt(hex.substr(3, 2), 16);
        var b = parseInt(hex.substr(5, 2), 16);
        r = Math.max(0, Math.floor(r * (1 - amount)));
        g = Math.max(0, Math.floor(g * (1 - amount)));
        b = Math.max(0, Math.floor(b * (1 - amount)));
        return '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
    }

    // ===== 更新渐变 =====
    function updateGradient() {
        work.gradient = 'linear-gradient(' + gradientDir + ', ' + work.primary + ', ' + work.secondary + ')';
    }

    // ===== 应用到页面（实时预览）=====
    function applyToPage() {
        updateGradient();
        window.QNTheme.apply(work);
    }

    // ===== 更新预览区 =====
    function updatePreview() {
        updateGradient();
        var grad = work.gradient;

        // Logo 图标
        pvLogo.style.background = grad;

        // 渐变文字
        pvGradient.style.background = grad;
        pvGradient.style.webkitBackgroundClip = 'text';
        pvGradient.style.webkitTextFillColor = 'transparent';
        pvGradient.style.backgroundClip = 'text';

        // 按钮
        pvBtn.style.background = work.primary;

        // 渐变预览条
        gradientPreview.style.background = grad;
    }

    // ===== 保存 =====
    window.saveAll = function() {
        updateGradient();
        window.QNTheme.save(work);
        showToast('设置已保存，将应用到所有页面', 'success');
    };

    // ===== 重置 =====
    window.resetAll = function() {
        window.QNTheme.reset();
        work = window.QNTheme.getDefault();
        gradientDir = '135deg';
        activePreset = 'default';
        loadValuesToUI();
        renderPresets();
        applyToPage();
        updatePreview();
        showToast('已恢复默认设置', 'info');
    };

    // ===== Toast =====
    var toastTimer = null;
    function showToast(msg, type) {
        var toast = document.getElementById('toast');
        toast.textContent = msg;
        toast.className = 'toast toast-' + (type || 'info') + ' show';
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(function() {
            toast.classList.remove('show');
        }, 2500);
    }

    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
