/**
 * 主逻辑文件
 * 实现样式展示和切换功能
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 加载样式数据
        const styles = await styleManager.loadStyles();
        
        // 初始化导航模块
        navigationManager.init(styles);
        
        // 渲染样式卡片列表
        renderStyleCards(styles);
        
        // 默认选择第一个样式
        if (styles.length > 0) {
            selectStyle(styles[0].id);
        }
    } catch (error) {
        console.error('初始化失败:', error);
        showError('无法加载样式数据，请刷新页面重试');
    }
});

/**
 * 渲染样式卡片列表
 * @param {Array} styles - 样式数组
 */
function renderStyleCards(styles) {
    const cardsContainer = document.getElementById('styleCards');
    if (!cardsContainer) return;

    cardsContainer.innerHTML = '';

    styles.forEach(style => {
        const card = createStyleCard(style);
        cardsContainer.appendChild(card);
    });
}

/**
 * 创建样式卡片元素
 * @param {Object} style - 样式对象
 * @returns {HTMLElement} 卡片元素
 */
function createStyleCard(style) {
    const card = document.createElement('div');
    card.className = 'style-card';
    card.dataset.styleId = style.id;

    // 颜色预览
    const colorsHtml = Object.entries(style.preview.colors)
        .map(([key, value]) => 
            `<div class="color-swatch" style="background-color: ${value}" title="${key}: ${value}"></div>`
        ).join('');

    // 特色标签
    const featuresHtml = style.preview.features
        .map(feature => `<span class="feature-tag">${feature}</span>`)
        .join('');

    card.innerHTML = `
        <div class="style-card-header">
            <h3 class="style-card-title">${style.name}</h3>
            <span class="style-card-category">${style.category}</span>
        </div>
        <p class="style-card-description">${style.description}</p>
        <div class="style-card-colors">
            ${colorsHtml}
        </div>
        <div class="style-card-features">
            ${featuresHtml}
        </div>
        <button class="style-card-button" data-style-id="${style.id}">
            预览此样式
        </button>
    `;

    // 添加点击事件
    const button = card.querySelector('.style-card-button');
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        selectStyle(style.id);
    });

    card.addEventListener('click', () => {
        selectStyle(style.id);
    });

    return card;
}

/**
 * 选择并应用样式
 * @param {string} styleId - 样式ID
 */
function selectStyle(styleId) {
    // 应用样式
    const style = styleManager.applyStyle(styleId);
    if (!style) return;

    // 更新卡片选中状态
    updateCardSelection(styleId);

    // 更新预览区域
    updatePreview(style);
}

/**
 * 更新卡片选中状态
 * @param {string} styleId - 选中的样式ID
 */
function updateCardSelection(styleId) {
    const cards = document.querySelectorAll('.style-card');
    cards.forEach(card => {
        if (card.dataset.styleId === styleId) {
            card.classList.add('active');
            const button = card.querySelector('.style-card-button');
            if (button) {
                button.classList.add('active');
                button.textContent = '当前预览';
            }
        } else {
            card.classList.remove('active');
            const button = card.querySelector('.style-card-button');
            if (button) {
                button.classList.remove('active');
                button.textContent = '预览此样式';
            }
        }
    });
}

/**
 * 更新预览区域
 * @param {Object} style - 样式对象
 */
function updatePreview(style) {
    const previewContainer = document.getElementById('previewContainer');
    const previewControls = document.getElementById('previewControls');
    if (!previewContainer) return;

    // 显示预览控制按钮
    if (previewControls) {
        previewControls.style.display = 'flex';
    }

    // 使用预览管理器创建预览
    const currentMode = previewManager.getCurrentMode();
    const previewContent = previewManager.createPreview(style, currentMode);
    
    previewContainer.innerHTML = '';
    previewContainer.appendChild(previewContent);

    // 绑定预览模式切换事件
    bindPreviewModeSwitcher(style);
}

/**
 * 绑定预览模式切换事件
 * @param {Object} style - 样式对象
 */
function bindPreviewModeSwitcher(style) {
    const modeButtons = document.querySelectorAll('.preview-mode-btn');
    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            
            // 更新按钮状态
            modeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 切换预览模式
            const previewContent = previewManager.switchMode(mode);
            if (previewContent) {
                const previewContainer = document.getElementById('previewContainer');
                if (previewContainer) {
                    previewContainer.innerHTML = '';
                    previewContainer.appendChild(previewContent);
                }
            }
        });
    });
}

/**
 * 显示错误信息
 * @param {string} message - 错误消息
 */
function showError(message) {
    const container = document.querySelector('.container');
    if (container) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'background: #ffebee; color: #c62828; padding: 16px; border-radius: 8px; margin: 20px 0;';
        errorDiv.textContent = message;
        container.insertBefore(errorDiv, container.firstChild);
    }
}

