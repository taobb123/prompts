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
        
        // 初始化原型生成器
        initPrototypeGenerator(styles);
        
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
        // 如果是生成的原型，尝试获取保存的HTML结构
        let customHTML = null;
        if (style.isGenerated) {
            const generatedPrototypes = prototypeGenerator.getGeneratedPrototypes();
            const generated = generatedPrototypes.find(p => p.prototype.id === style.id);
            if (generated && generated.htmlStructure) {
                customHTML = generated.htmlStructure;
            }
        }
        selectStyle(style.id, customHTML);
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
function selectStyle(styleId, customHTML = null) {
    // 如果是生成的原型，先确保CSS和HTML已保存
    const style = styleManager.styles.find(s => s.id === styleId);
    if (style && style.isGenerated) {
        const generatedPrototypes = prototypeGenerator.getGeneratedPrototypes();
        const generated = generatedPrototypes.find(p => p.prototype.id === styleId);
        
        if (generated) {
            // 确保CSS已应用
            prototypeGenerator.savePrototype(style, generated.cssCode, generated.htmlStructure);
            // 如果没有提供customHTML，使用保存的HTML结构
            if (!customHTML && generated.htmlStructure) {
                customHTML = generated.htmlStructure;
            }
        }
    }
    
    // 应用样式
    const appliedStyle = styleManager.applyStyle(styleId);
    if (!appliedStyle) return;

    // 更新卡片选中状态
    updateCardSelection(styleId);

    // 更新预览区域（支持自定义HTML）
    updatePreview(appliedStyle, customHTML);
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
function updatePreview(style, customHTML = null) {
    const previewContainer = document.getElementById('previewContainer');
    const previewControls = document.getElementById('previewControls');
    if (!previewContainer) return;

    // 显示预览控制按钮
    if (previewControls) {
        previewControls.style.display = 'flex';
    }

    // 如果是生成的原型，尝试获取保存的HTML结构
    if (style.isGenerated) {
        const generatedPrototypes = prototypeGenerator.getGeneratedPrototypes();
        const generated = generatedPrototypes.find(p => p.prototype.id === style.id);
        
        // 优先使用传入的customHTML，否则使用保存的HTML结构
        const htmlToUse = customHTML || (generated ? generated.htmlStructure : null);
        
        if (htmlToUse) {
            const currentMode = previewManager.getCurrentMode();
            const previewContent = document.createElement('div');
            previewContent.className = `preview-content active preview-mode-${currentMode}`;
            previewContent.setAttribute('data-style-id', style.id);
            previewContent.innerHTML = htmlToUse;
            previewContainer.innerHTML = '';
            previewContainer.appendChild(previewContent);
            
            // 确保CSS样式已应用
            if (generated) {
                prototypeGenerator.savePrototype(style, generated.cssCode, generated.htmlStructure);
            }
            return;
        }
    }
    
    // 使用默认预览生成
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

            // 如果是生成的原型，获取保存的HTML结构
            let customHTML = null;
            if (style.isGenerated) {
                const generatedPrototypes = prototypeGenerator.getGeneratedPrototypes();
                const generated = generatedPrototypes.find(p => p.prototype.id === style.id);
                if (generated && generated.htmlStructure) {
                    customHTML = generated.htmlStructure;
                }
            }
            
            // 切换预览模式并更新预览
            previewManager.switchMode(mode);
            updatePreview(style, customHTML);
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

/**
 * 初始化原型生成器
 * @param {Array} existingStyles - 现有样式数组
 */
function initPrototypeGenerator(existingStyles) {
    const generateBtn = document.getElementById('generatePrototypeBtn');
    const descriptionInput = document.getElementById('prototypeDescription');
    const resultContainer = document.getElementById('generatorResult');

    if (!generateBtn || !descriptionInput || !resultContainer) return;

    generateBtn.addEventListener('click', async () => {
        const description = descriptionInput.value.trim();
        
        if (!description) {
            showGeneratorError('请输入原型描述');
            return;
        }

        // 显示加载状态
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<span class="loading-spinner"></span> <span class="btn-text">生成中...</span>';
        resultContainer.style.display = 'none';

        try {
            // 获取偏好设置
            const preferences = {
                structure: document.getElementById('structurePref')?.value || '',
                navigation: document.getElementById('navigationPref')?.value || '',
                display: document.getElementById('displayPref')?.value || '',
                colorTheme: document.getElementById('colorThemePref')?.value || ''
            };

            // 生成原型
            const result = await prototypeGenerator.generatePrototype(
                description,
                preferences,
                existingStyles
            );

            if (result.success) {
                showGeneratorResult(result, existingStyles);
            } else {
                showGeneratorError(result.error || '生成失败，请重试');
            }
        } catch (error) {
            console.error('生成原型错误:', error);
            showGeneratorError('生成过程中出现错误，请重试');
        } finally {
            // 恢复按钮状态
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<span class="btn-icon">✨</span> <span class="btn-text">生成原型</span>';
        }
    });

    // 支持回车键生成
    descriptionInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            generateBtn.click();
        }
    });
}

/**
 * 显示生成结果
 * @param {Object} result - 生成结果
 * @param {Array} existingStyles - 现有样式数组
 */
function showGeneratorResult(result, existingStyles) {
    const resultContainer = document.getElementById('generatorResult');
    if (!resultContainer) return;

    const prototype = result.prototype;
    const differences = result.differences;

    resultContainer.className = 'generator-result result-success';
    resultContainer.style.display = 'block';

    resultContainer.innerHTML = `
        <div class="result-header">
            <h3 class="result-title">✨ 原型生成成功！</h3>
            <div class="result-actions">
                <button class="result-btn btn-preview" data-style-id="${prototype.id}">
                    预览
                </button>
                <button class="result-btn btn-save" data-style-id="${prototype.id}">
                    保存
                </button>
            </div>
        </div>
        
        <div class="result-info">
            <div class="result-info-item">
                <span class="info-label">样式名称：</span>
                <span class="info-value">${prototype.name}</span>
            </div>
            <div class="result-info-item">
                <span class="info-label">样式分类：</span>
                <span class="info-value">${prototype.category}</span>
            </div>
            <div class="result-info-item">
                <span class="info-label">结构布局：</span>
                <span class="info-value">${prototype.functionConfig?.structure || '单栏'}</span>
            </div>
            <div class="result-info-item">
                <span class="info-label">导航位置：</span>
                <span class="info-value">${prototype.functionConfig?.navigation || '顶部'}</span>
            </div>
            <div class="result-info-item">
                <span class="info-label">数据展示：</span>
                <span class="info-value">${prototype.functionConfig?.display || '列表'}</span>
            </div>
            <div class="result-info-item">
                <span class="info-label">功能模块：</span>
                <span class="info-value">${(prototype.functionConfig?.functions || []).join('、') || '基础功能'}</span>
            </div>
            <div class="result-info-item">
                <span class="info-label">交互方式：</span>
                <span class="info-value">${(prototype.functionConfig?.interactions || []).join('、') || '标准交互'}</span>
            </div>
            <div class="result-info-item">
                <span class="info-label">主色调：</span>
                <span class="info-value">
                    <span style="display: inline-block; width: 20px; height: 20px; background: ${prototype.preview.colors.primary}; border-radius: 4px; vertical-align: middle; margin-right: 4px;"></span>
                    ${prototype.preview.colors.primary}
                </span>
            </div>
        </div>

        <div class="differences-info">
            <div class="differences-title">🎯 功能点差异化分析</div>
            <div class="difference-item">
                <span class="difference-label">结构布局</span>
                <span class="difference-value">${differences.structureDifference || '未分析'}</span>
            </div>
            <div class="difference-item">
                <span class="difference-label">导航位置</span>
                <span class="difference-value">${differences.navigationDifference || '未分析'}</span>
            </div>
            <div class="difference-item">
                <span class="difference-label">功能模块</span>
                <span class="difference-value">${differences.functionDifference || '未分析'}</span>
            </div>
            <div class="difference-item">
                <span class="difference-label">交互方式</span>
                <span class="difference-value">${differences.interactionDifference || '未分析'}</span>
            </div>
            <div class="difference-item">
                <span class="difference-label">数据展示</span>
                <span class="difference-value">${differences.displayDifference || '未分析'}</span>
            </div>
        </div>
    `;

    // 绑定预览和保存按钮
    const previewBtn = resultContainer.querySelector('.btn-preview');
    const saveBtn = resultContainer.querySelector('.btn-save');

            if (previewBtn) {
        previewBtn.addEventListener('click', () => {
            // 保存CSS和HTML结构
            prototypeGenerator.savePrototype(prototype, result.cssCode, result.htmlStructure);
            // 选择并预览样式（使用生成的HTML结构）
            selectStyle(prototype.id, result.htmlStructure);
            // 滚动到预览区域
            document.getElementById('previewContainer')?.scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            // 保存原型（包括HTML结构）
            prototypeGenerator.savePrototype(prototype, result.cssCode, result.htmlStructure);
            // 添加到样式列表
            const allStyles = [...existingStyles, prototype];
            styleManager.styles = allStyles;
            renderStyleCards(allStyles);
            navigationManager.init(allStyles);
            
            // 显示成功消息
            showGeneratorSuccess('原型已保存并添加到样式列表！');
            
            // 选择新生成的样式（使用生成的HTML结构）
            selectStyle(prototype.id, result.htmlStructure);
        });
    }
}

/**
 * 显示生成错误
 * @param {string} message - 错误消息
 */
function showGeneratorError(message) {
    const resultContainer = document.getElementById('generatorResult');
    if (!resultContainer) return;

    resultContainer.className = 'generator-result result-error';
    resultContainer.style.display = 'block';
    resultContainer.innerHTML = `
        <div class="result-header">
            <h3 class="result-title">❌ 生成失败</h3>
        </div>
        <p style="color: #f44336; margin-top: 12px;">${message}</p>
    `;
}

/**
 * 显示成功消息
 * @param {string} message - 成功消息
 */
function showGeneratorSuccess(message) {
    const resultContainer = document.getElementById('generatorResult');
    if (!resultContainer) return;

    const originalContent = resultContainer.innerHTML;
    resultContainer.innerHTML = `
        <div style="background: #4CAF50; color: white; padding: 12px; border-radius: 8px; margin-bottom: 16px;">
            ✅ ${message}
        </div>
        ${originalContent}
    `;

    setTimeout(() => {
        const successMsg = resultContainer.querySelector('div[style*="background: #4CAF50"]');
        if (successMsg) {
            successMsg.style.transition = 'opacity 0.3s';
            successMsg.style.opacity = '0';
            setTimeout(() => successMsg.remove(), 300);
        }
    }, 3000);
}

