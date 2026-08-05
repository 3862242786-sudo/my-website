// ===== 青柠网盘 全局主题引擎 =====
// 提供主题预设、CSS变量注入、样式覆盖
// 通过 site-check.js 同步加载，影响所有页面

(function() {
    'use strict';

    var STORAGE_KEY = 'qn_theme_settings';

    // 预设主题
    var PRESETS = {
        'default': {
            name: '默认蓝',
            primary: '#3b82f6',
            primaryHover: '#2563eb',
            secondary: '#6366f1',
            gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            bg: '#f8fafc',
            surface: '#ffffff',
            text: '#1e293b',
            textSecondary: '#64748b',
            textMuted: '#94a3b8',
            border: '#e2e8f0',
            mutedBg: '#f1f5f9',
            dark: false,
            navOpacity: 0.85,
            fontSize: 16,
            radius: 12
        },
        'mint': {
            name: '薄荷绿',
            primary: '#22c55e',
            primaryHover: '#16a34a',
            secondary: '#10b981',
            gradient: 'linear-gradient(135deg, #22c55e, #10b981)',
            bg: '#f0fdf4',
            surface: '#ffffff',
            text: '#1a2e1a',
            textSecondary: '#4b6353',
            textMuted: '#86a394',
            border: '#d1fae5',
            mutedBg: '#ecfdf5',
            dark: false,
            navOpacity: 0.85,
            fontSize: 16,
            radius: 12
        },
        'sunset': {
            name: '暖阳橙',
            primary: '#f59e0b',
            primaryHover: '#d97706',
            secondary: '#ef4444',
            gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
            bg: '#fffbeb',
            surface: '#ffffff',
            text: '#451a03',
            textSecondary: '#7c5e3b',
            textMuted: '#a8957e',
            border: '#fef3c7',
            mutedBg: '#fffbeb',
            dark: false,
            navOpacity: 0.85,
            fontSize: 16,
            radius: 12
        },
        'dream': {
            name: '梦幻紫',
            primary: '#8b5cf6',
            primaryHover: '#7c3aed',
            secondary: '#ec4899',
            gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
            bg: '#faf5ff',
            surface: '#ffffff',
            text: '#2e1065',
            textSecondary: '#6b5589',
            textMuted: '#a394b8',
            border: '#ede9fe',
            mutedBg: '#f5f3ff',
            dark: false,
            navOpacity: 0.85,
            fontSize: 16,
            radius: 12
        },
        'ocean': {
            name: '海洋蓝',
            primary: '#0ea5e9',
            primaryHover: '#0284c7',
            secondary: '#06b6d4',
            gradient: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
            bg: '#f0f9ff',
            surface: '#ffffff',
            text: '#0c2d48',
            textSecondary: '#4b6f8a',
            textMuted: '#8aaac4',
            border: '#e0f2fe',
            mutedBg: '#f0f9ff',
            dark: false,
            navOpacity: 0.85,
            fontSize: 16,
            radius: 12
        },
        'dark': {
            name: '深邃黑',
            primary: '#6366f1',
            primaryHover: '#818cf8',
            secondary: '#8b5cf6',
            gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            bg: '#0f172a',
            surface: '#1e293b',
            text: '#f1f5f9',
            textSecondary: '#94a3b8',
            textMuted: '#64748b',
            border: '#334155',
            mutedBg: '#1e293b',
            dark: true,
            navOpacity: 0.85,
            fontSize: 16,
            radius: 12
        },
        'rose': {
            name: '蔷薇粉',
            primary: '#f43f5e',
            primaryHover: '#e11d48',
            secondary: '#fb7185',
            gradient: 'linear-gradient(135deg, #f43f5e, #fb7185)',
            bg: '#fff1f2',
            surface: '#ffffff',
            text: '#4c0519',
            textSecondary: '#7c4a55',
            textMuted: '#b0919a',
            border: '#ffe4e6',
            mutedBg: '#fff1f2',
            dark: false,
            navOpacity: 0.85,
            fontSize: 16,
            radius: 12
        }
    };

    // 默认设置
    function getDefaultSettings() {
        return JSON.parse(JSON.stringify(PRESETS['default']));
    }

    // 从 localStorage 读取设置
    function loadSettings() {
        try {
            var saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                var settings = JSON.parse(saved);
                // 合并默认值防止缺失字段
                var defaults = getDefaultSettings();
                for (var k in defaults) {
                    if (settings[k] === undefined) settings[k] = defaults[k];
                }
                return settings;
            }
        } catch(e) {}
        return getDefaultSettings();
    }

    // 保存设置到 localStorage
    function saveSettings(settings) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch(e) {}
    }

    // 重置为默认
    function resetSettings() {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch(e) {}
    }

    // 生成 CSS 覆盖样式
    function generateCSS(settings) {
        var isDark = settings.dark;
        var css = '';

        // CSS 变量
        css += '<style id="qn-theme-style" data-theme="' + (isDark ? 'dark' : 'light') + '">';
        css += ':root {';
        css += '--qn-primary:' + settings.primary + ';';
        css += '--qn-primary-hover:' + settings.primaryHover + ';';
        css += '--qn-secondary:' + settings.secondary + ';';
        css += '--qn-gradient:' + settings.gradient + ';';
        css += '--qn-bg:' + settings.bg + ';';
        css += '--qn-surface:' + settings.surface + ';';
        css += '--qn-text:' + settings.text + ';';
        css += '--qn-text-secondary:' + settings.textSecondary + ';';
        css += '--qn-text-muted:' + settings.textMuted + ';';
        css += '--qn-border:' + settings.border + ';';
        css += '--qn-muted-bg:' + settings.mutedBg + ';';
        css += '--qn-nav-opacity:' + settings.navOpacity + ';';
        css += '--qn-font-size:' + settings.fontSize + 'px;';
        css += '--qn-radius:' + settings.radius + 'px;';
        css += '}';

        // 覆盖现有硬编码样式
        css += 'body{';
        css += 'background:' + settings.bg + ' !important;';
        css += 'color:' + settings.text + ' !important;';
        css += 'font-size:' + settings.fontSize + 'px !important;';
        css += '}';

        // 导航栏
        css += '.navbar{';
        css += 'background:rgba(' + hexToRgb(settings.surface) + ',' + settings.navOpacity + ') !important;';
        if (isDark) {
            css += 'border-bottom:1px solid ' + settings.border + ' !important;';
        }
        css += '}';
        css += '.nav-links a{color:' + settings.textSecondary + ' !important;}';
        css += '.nav-links a:hover{color:' + settings.primary + ' !important;}';
        css += '.logo{color:' + settings.text + ' !important;}';

        // 主色调覆盖（覆盖所有常见按钮类和内联样式）
        css += '.btn-primary,.nav-login-btn,.download-btn,.submit-btn,.auth-submit-btn,.app-download-btn,.upload-select-btn,.file-download-btn,.back-btn,.admin-btn{';
        css += 'background:' + settings.primary + ' !important;';
        css += 'color:#fff !important;';
        css += '}';
        css += '.btn-primary:hover,.nav-login-btn:hover,.download-btn:hover,.submit-btn:hover,.auth-submit-btn:hover,.app-download-btn:hover,.upload-select-btn:hover,.file-download-btn:hover,.back-btn:hover,.admin-btn:hover{';
        css += 'background:' + settings.primaryHover + ' !important;';
        css += '}';

        // Hero 区内联样式按钮覆盖
        css += '.hero a[style*="background:#3b82f6"],.hero a[style*="background: #3b82f6"]{';
        css += 'background:' + settings.primary + ' !important;';
        css += 'box-shadow:0 4px 16px ' + hexToRgba(settings.primary, 0.3) + ' !important;';
        css += '}';
        css += '.hero a[style*="linear-gradient(135deg,#22c55e"],.hero a[style*="linear-gradient(135deg, #22c55e"]{';
        css += 'background:' + settings.gradient + ' !important;';
        css += 'box-shadow:0 4px 16px ' + hexToRgba(settings.primary, 0.3) + ' !important;';
        css += '}';

        // Hero 区 logo 图标和标题渐变覆盖（内联样式）
        css += '.hero div[style*="linear-gradient(135deg,#3b82f6"],.hero div[style*="linear-gradient(135deg, #3b82f6"]{';
        css += 'background:' + settings.gradient + ' !important;';
        css += 'box-shadow:0 12px 32px ' + hexToRgba(settings.primary, 0.3) + ' !important;';
        css += '}';
        css += '.hero h1[style*="linear-gradient(135deg,#3b82f6"],.hero h1[style*="linear-gradient(135deg, #3b82f6"]{';
        css += 'background:' + settings.gradient + ' !important;';
        css += '-webkit-background-clip:text !important;';
        css += '-webkit-text-fill-color:transparent !important;';
        css += 'background-clip:text !important;';
        css += '}';

        // 管理按钮保持橙色
        css += '.nav-admin-btn,.admin-btn-danger{';
        css += 'background:' + (isDark ? '#f59e0b' : '#f59e0b') + ' !important;';
        css += '}';

        // 链接和强调
        css += 'a{color:' + settings.primary + ';}';
        css += 'a:hover{color:' + settings.primaryHover + ';}';

        // APP下载链接内联颜色
        css += 'a[style*="color:#3b82f6"],a[style*="color: #3b82f6"]{';
        css += 'color:' + settings.primary + ' !important;';
        css += '}';

        // 渐变文字
        css += '.gradient-text{';
        css += 'background:' + settings.gradient + ' !important;';
        css += '-webkit-background-clip:text !important;';
        css += '-webkit-text-fill-color:transparent !important;';
        css += 'background-clip:text !important;';
        css += '}';

        // Logo 图标渐变
        css += '.logo-icon{';
        css += 'background:' + settings.gradient + ' !important;';
        css += '}';

        // Hero 区域
        css += '.hero{';
        if (isDark) {
            css += 'background:' + settings.surface + ' !important;';
        } else {
            css += 'background:#1e293b !important;';
        }
        css += '}';

        // 卡片和表面
        css += '.card,.file-card,.feature-card{';
        css += 'background:' + settings.surface + ' !important;';
        css += 'border-color:' + settings.border + ' !important;';
        css += 'border-radius:' + settings.radius + 'px !important;';
        css += '}';
        css += '.card:hover,.file-card:hover{';
        css += 'border-color:' + settings.primary + ' !important;';
        css += '}';

        // 输入框
        css += 'input,textarea,select{';
        css += 'background:' + settings.mutedBg + ' !important;';
        css += 'border-color:' + settings.border + ' !important;';
        css += 'color:' + settings.text + ' !important;';
        css += 'border-radius:' + settings.radius + 'px !important;';
        css += '}';
        css += 'input:focus,textarea:focus,select:focus{';
        css += 'border-color:' + settings.primary + ' !important;';
        css += '}';

        // 文字层级
        css += 'h1,h2,h3,h4,h5,h6{color:' + settings.text + ' !important;}';
        css += '.text-secondary,.description,.file-meta{color:' + settings.textSecondary + ' !important;}';
        css += '.text-muted,.placeholder{color:' + settings.textMuted + ' !important;}';

        // 模态框
        css += '.modal,.modal-content{';
        css += 'background:' + settings.surface + ' !important;';
        css += 'border-radius:' + settings.radius + 'px !important;';
        css += '}';

        // 下拉菜单
        css += '.dropdown-menu{';
        css += 'background:' + settings.surface + ' !important;';
        css += 'border-color:' + settings.border + ' !important;';
        css += '}';
        css += '.dropdown-item:hover{';
        css += 'background:' + settings.mutedBg + ' !important;';
        css += '}';

        // 页脚
        css += '.footer{';
        if (isDark) {
            css += 'background:#020617 !important;';
        } else {
            css += 'background:' + '#1e293b' + ' !important;';
        }
        css += '}';

        // Toast
        css += '.toast{';
        css += 'background:' + settings.surface + ' !important;';
        css += 'border-radius:' + settings.radius + 'px !important;';
        css += '}';

        // 搜索按钮和搜索框
        css += '.search-box button{';
        css += 'background:' + settings.primary + ' !important;';
        css += '}';
        css += '.search-box button:hover{';
        css += 'background:' + settings.primaryHover + ' !important;';
        css += '}';
        css += '.search-box input:focus{';
        css += 'border-color:' + settings.primary + ' !important;';
        css += 'box-shadow:0 0 0 3px ' + hexToRgba(settings.primary, 0.08) + ' !important;';
        css += '}';

        // 安全提示栏
        css += '.security-banner,.security-notice{';
        css += 'background:' + hexToRgba(settings.primary, 0.1) + ' !important;';
        css += '}';

        // 个性化页面导航
        css += '.nav-back,.nav-title{color:' + settings.text + ' !important;}';
        css += '.nav-back:hover{color:' + settings.primary + ' !important;}';

        // 个性化入口按钮
        css += '.nav-personalize-btn{background:' + hexToRgba(settings.primary, 0.12) + ' !important;color:' + settings.primary + ' !important;}';
        css += '.nav-personalize-btn:hover{background:' + hexToRgba(settings.primary, 0.2) + ' !important;}';

        // App弹窗
        css += '.app-modal-header{background:' + settings.gradient + ' !important;}';
        css += '.app-modal-content{background:' + settings.surface + ' !important;}';
        css += '.app-feature-icon{background:' + hexToRgba(settings.primary, 0.1) + ' !important;color:' + settings.primary + ' !important;}';
        css += '.app-feature-item{background:' + settings.mutedBg + ' !important;}';
        css += '.app-feature-item span{color:' + settings.text + ' !important;}';
        css += '.app-modal-body h3{color:' + settings.text + ' !important;}';
        css += '.app-modal-subtitle{color:' + settings.textSecondary + ' !important;}';
        css += '.app-download-btn{background:' + settings.gradient + ' !important;box-shadow:0 4px 15px ' + hexToRgba(settings.primary, 0.35) + ' !important;}';
        css += '.app-no-remind{color:' + settings.textMuted + ' !important;}';

        // 下拉菜单增强
        css += '.dropdown-primary{background:' + hexToRgba(settings.primary, 0.08) + ' !important;}';
        css += '.dropdown-primary:hover{background:' + hexToRgba(settings.primary, 0.15) + ' !important;}';
        css += '.dropdown-version{color:' + settings.primary + ' !important;}';
        css += '.dropdown-desc{color:' + settings.textSecondary + ' !important;}';
        css += '.dropdown-item{color:' + settings.text + ' !important;}';

        // 分类标签
        css += '.category-tabs .tab{background:' + settings.surface + ' !important;border-color:' + settings.border + ' !important;color:' + settings.textSecondary + ' !important;}';
        css += '.category-tabs .tab:hover{border-color:' + settings.primary + ' !important;color:' + settings.primary + ' !important;}';
        css += '.category-tabs .tab.active{background:' + settings.primary + ' !important;border-color:' + settings.primary + ' !important;color:#fff !important;}';

        // 进度条
        css += '.progress-fill{background:' + settings.primary + ' !important;}';

        // 上传区域
        css += '.upload-area{background:' + settings.surface + ' !important;border-color:' + settings.border + ' !important;}';
        css += '.upload-area:hover,.upload-area.drag-over{border-color:' + settings.primary + ' !important;background:' + hexToRgba(settings.primary, 0.05) + ' !important;}';

        // 认证页面
        css += '.auth-container{background:' + settings.surface + ' !important;}';
        css += '.auth-header h1{color:' + settings.text + ' !important;}';
        css += '.auth-header p{color:' + settings.textSecondary + ' !important;}';
        css += '.auth-tabs{background:' + settings.mutedBg + ' !important;}';
        css += '.auth-tab{color:' + settings.textSecondary + ' !important;}';
        css += '.auth-tab.active{background:' + settings.surface + ' !important;color:' + settings.primary + ' !important;}';
        css += '.auth-form label{color:' + settings.text + ' !important;}';
        css += '.forgot-link,.auth-links a,.back-to-login{color:' + settings.primary + ' !important;}';
        css += '.forgot-link:hover,.auth-links a:hover,.back-to-login:hover{color:' + settings.primaryHover + ' !important;}';

        // 头像
        css += '.avatar{background:' + settings.gradient + ' !important;box-shadow:0 4px 16px ' + hexToRgba(settings.primary, 0.2) + ' !important;}';

        // 关于页面
        css += '.about-section-card{background:' + settings.surface + ' !important;}';
        css += '.about-section-card h2{color:' + settings.text + ' !important;}';
        css += '.social-card{background:' + settings.mutedBg + ' !important;}';
        css += '.social-card:hover{background:' + settings.surface + ' !important;}';
        css += '.social-info h3{color:' + settings.text + ' !important;}';
        css += '.social-card:hover .social-arrow{color:' + settings.primary + ' !important;}';
        css += '.feature-icon{background:' + settings.mutedBg + ' !important;}';

        // 管理后台
        css += '.admin-stat-card{background:' + settings.surface + ' !important;}';
        css += '.admin-stat-card .stat-icon{background:' + hexToRgba(settings.primary, 0.1) + ' !important;}';
        css += '.admin-card{background:' + settings.surface + ' !important;}';
        css += '.sidebar-link{color:' + settings.textSecondary + ' !important;}';
        css += '.sidebar-link:hover{background:' + settings.mutedBg + ' !important;color:' + settings.text + ' !important;}';
        css += '.sidebar-link.active{background:' + settings.primary + ' !important;color:#fff !important;}';

        // 上传页面
        css += '.pending-files,.upload-progress,.upload-result{background:' + settings.surface + ' !important;}';
        css += '.pending-name,.upload-summary{color:' + settings.text + ' !important;}';

        // 下载链接
        css += '.download-link{color:' + settings.primary + ' !important;}';
        css += '.download-link:hover{color:' + settings.primaryHover + ' !important;}';

        // 公告横幅
        css += '.announcement-banner{background:linear-gradient(135deg,' + hexToRgba(settings.primary, 0.15) + ',' + hexToRgba(settings.primary, 0.08) + ') !important;border-bottom-color:' + hexToRgba(settings.primary, 0.3) + ' !important;}';
        css += '.announcement-content{color:' + settings.text + ' !important;}';

        // 搜索区
        css += '.search-section{background:' + settings.surface + ' !important;}';

        // focus 全局
        css += 'input:focus,textarea:focus,select:focus{';
        css += 'border-color:' + settings.primary + ' !important;';
        css += 'box-shadow:0 0 0 3px ' + hexToRgba(settings.primary, 0.08) + ' !important;';
        css += '}';

        // 移动端导航背景
        css += '@media(max-width:768px){';
        css += '.nav-links{background:rgba(' + hexToRgb(settings.surface) + ',0.95) !important;}';
        css += '.nav-links .dropdown-menu{background:transparent !important;}';
        css += '}';

        // 暗色模式额外调整
        if (isDark) {
            css += '.search-section{background:' + settings.surface + ' !important;}';
            css += '.security-banner{background:rgba(' + hexToRgb(settings.primary) + ',0.1) !important;}';
            css += '.container{color:' + settings.text + ' !important;}';
            css += 'table th{background:' + settings.mutedBg + ' !important;color:' + settings.text + ' !important;}';
            css += 'table tr{border-color:' + settings.border + ' !important;}';
            css += '.btn-secondary{background:' + settings.mutedBg + ' !important;color:' + settings.text + ' !important;border:1px solid ' + settings.border + ' !important;}';
        } else {
            css += '.btn-secondary{background:' + settings.mutedBg + ' !important;color:' + settings.textSecondary + ' !important;}';
        }

        css += '</style>';
        return css;
    }

    // hex 转 rgb 字符串
    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return '255,255,255';
        return parseInt(result[1], 16) + ',' + parseInt(result[2], 16) + ',' + parseInt(result[3], 16);
    }

    // hex 转 rgba 字符串
    function hexToRgba(hex, alpha) {
        return 'rgba(' + hexToRgb(hex) + ',' + alpha + ')';
    }

    // 应用主题（移除旧样式，注入新样式）
    function applyTheme(settings) {
        if (!settings) settings = loadSettings();

        // 移除旧的
        var old = document.getElementById('qn-theme-style');
        if (old) old.remove();

        // 注入新的
        var head = document.head || document.getElementsByTagName('head')[0];
        if (head) {
            var temp = document.createElement('div');
            temp.innerHTML = generateCSS(settings);
            var styleEl = temp.querySelector('style');
            if (styleEl) {
                head.appendChild(styleEl);
            }
        }

        // 设置 data-theme 属性
        document.documentElement.setAttribute('data-theme', settings.dark ? 'dark' : 'light');
    }

    // 立即应用（在 head 中同步执行）
    applyTheme();

    // 暴露 API
    window.QNTheme = {
        presets: PRESETS,
        load: loadSettings,
        save: saveSettings,
        reset: resetSettings,
        apply: applyTheme,
        hexToRgb: hexToRgb,
        getDefault: getDefaultSettings,
        applyPreset: function(presetKey) {
            var preset = PRESETS[presetKey];
            if (preset) {
                var settings = JSON.parse(JSON.stringify(preset));
                saveSettings(settings);
                applyTheme(settings);
                return settings;
            }
            return null;
        }
    };
})();
