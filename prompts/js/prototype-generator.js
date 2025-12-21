/**
 * 原型生成器模块
 * 根据用户描述生成不同结构和功能点的备忘录小程序原型
 */

class PrototypeGenerator {
    constructor() {
        this.generatedPrototypes = [];
        // 可用的结构布局类型
        this.structureTypes = ['单栏', '双栏', '三栏'];
        // 可用的导航位置
        this.navigationPositions = ['顶部', '底部', '侧边栏'];
        // 可用的功能模块
        this.functionModules = ['搜索', '筛选', '标签系统', '优先级管理', '时间管理', '日历视图', '时间轴', '排序'];
        // 可用的交互方式
        this.interactionTypes = ['侧滑操作', '拖拽排序', '批量操作', '快速添加', '内联编辑'];
        // 可用的数据展示方式
        this.displayTypes = ['列表', '卡片', '网格', '时间轴', '日历', '看板'];
    }

    /**
     * 解析用户描述，提取结构、功能、交互方式等关键词
     * @param {string} description - 用户描述
     * @returns {Object} 解析结果
     */
    parseDescription(description) {
        const keywords = {
            // 结构布局
            structure: null,        // 单栏/双栏/三栏
            navigation: null,       // 顶部/底部/侧边栏
            // 功能模块
            functions: [],         // 搜索、标签、优先级等
            // 交互方式
            interactions: [],      // 侧滑、拖拽、批量等
            // 数据展示
            display: null,          // 列表/卡片/网格/时间轴/日历/看板
            // 样式相关（保留用于兼容）
            colorTheme: null,
            style: null
        };

        const lowerDesc = description.toLowerCase();

        // 提取结构布局
        this.structureTypes.forEach(structure => {
            if (lowerDesc.includes(structure)) {
                keywords.structure = structure;
            }
        });

        // 提取导航位置
        this.navigationPositions.forEach(nav => {
            if (lowerDesc.includes(nav)) {
                keywords.navigation = nav;
            }
        });

        // 提取功能模块
        if (lowerDesc.includes('搜索') || lowerDesc.includes('search')) {
            keywords.functions.push('搜索');
        }
        if (lowerDesc.includes('筛选') || lowerDesc.includes('filter')) {
            keywords.functions.push('筛选');
        }
        if (lowerDesc.includes('标签') || lowerDesc.includes('tag')) {
            keywords.functions.push('标签系统');
        }
        if (lowerDesc.includes('优先级') || lowerDesc.includes('priority')) {
            keywords.functions.push('优先级管理');
        }
        if (lowerDesc.includes('时间管理') || lowerDesc.includes('time management')) {
            keywords.functions.push('时间管理');
        }
        if (lowerDesc.includes('日历') || lowerDesc.includes('calendar')) {
            keywords.functions.push('日历视图');
        }
        if (lowerDesc.includes('时间轴') || lowerDesc.includes('timeline')) {
            keywords.functions.push('时间轴');
        }
        if (lowerDesc.includes('排序') || lowerDesc.includes('sort')) {
            keywords.functions.push('排序');
        }

        // 提取交互方式
        if (lowerDesc.includes('侧滑') || lowerDesc.includes('swipe')) {
            keywords.interactions.push('侧滑操作');
        }
        if (lowerDesc.includes('拖拽') || lowerDesc.includes('drag')) {
            keywords.interactions.push('拖拽排序');
        }
        if (lowerDesc.includes('批量') || lowerDesc.includes('batch')) {
            keywords.interactions.push('批量操作');
        }
        if (lowerDesc.includes('快速添加') || lowerDesc.includes('quick add')) {
            keywords.interactions.push('快速添加');
        }
        if (lowerDesc.includes('内联编辑') || lowerDesc.includes('inline edit')) {
            keywords.interactions.push('内联编辑');
        }

        // 提取数据展示方式
        this.displayTypes.forEach(display => {
            if (lowerDesc.includes(display)) {
                keywords.display = display;
            }
        });

        // 提取颜色主题（保留用于样式生成）
        if (lowerDesc.includes('深色') || lowerDesc.includes('dark')) {
            keywords.colorTheme = '深色';
        } else if (lowerDesc.includes('浅色') || lowerDesc.includes('light')) {
            keywords.colorTheme = '浅色';
        } else if (lowerDesc.includes('彩色') || lowerDesc.includes('colorful')) {
            keywords.colorTheme = '彩色';
        }

        // 提取风格
        const styles = ['简约', '极简', '商务', '专业', '可爱', '温馨', '科技', '未来', '复古', '现代'];
        styles.forEach(style => {
            if (lowerDesc.includes(style)) {
                keywords.style = style;
            }
        });

        return keywords;
    }

    /**
     * 生成原型设计（侧重于结构和功能点）
     * @param {string} description - 用户描述
     * @param {Object} preferences - 偏好设置
     * @param {Array} existingStyles - 现有样式数组
     * @returns {Object} 生成结果
     */
    async generatePrototype(description, preferences = {}, existingStyles = []) {
        try {
            // 解析描述
            const keywords = this.parseDescription(description);
            
            // 分析现有原型的结构和功能点
            const analysis = designDifferentiator.analyzeExistingStyles(existingStyles);

            // 生成结构布局
            const structure = preferences.structure || 
                             keywords.structure || 
                             designDifferentiator.selectDifferentiatedStructure(analysis.usedStructures);

            // 生成导航位置
            const navigation = preferences.navigation || 
                             keywords.navigation || 
                             designDifferentiator.selectDifferentiatedNavigation(analysis.usedNavigations);

            // 生成功能模块
            const functions = designDifferentiator.selectDifferentiatedFunctions(
                analysis.usedFunctions,
                keywords.functions
            );

            // 生成交互方式
            const interactions = designDifferentiator.selectDifferentiatedInteractions(
                analysis.usedInteractions,
                keywords.interactions
            );

            // 生成数据展示方式
            const display = preferences.display || 
                           keywords.display || 
                           designDifferentiator.selectDifferentiatedDisplay(analysis.usedDisplays);

            // 确定颜色主题（用于样式）
            const colorTheme = preferences.colorTheme || keywords.colorTheme || '浅色';

            // 生成颜色方案
            const colors = designDifferentiator.selectDifferentiatedColors(
                analysis.usedColors,
                colorTheme
            );

            // 生成视觉元素（用于样式）
            const visualElements = designDifferentiator.selectDifferentiatedVisualElements(analysis);

            // 生成样式名称
            const name = this.generateStyleName(keywords, structure, functions, display);

            // 生成样式描述
            const styleDescription = this.generateStyleDescription(keywords, structure, functions, interactions, display);

            // 生成特色功能列表
            const features = this.generateFeatures(functions, interactions, display);

            // 创建样式ID
            const styleId = `style-generated-${Date.now()}`;

            // 创建CSS文件路径
            const cssFile = `css/styles/${styleId}.css`;

            // 构建功能配置
            const functionConfig = {
                structure: structure,
                navigation: navigation,
                functions: functions,
                interactions: interactions,
                display: display
            };

            // 构建样式对象
            const newStyle = {
                id: styleId,
                name: name,
                description: styleDescription,
                category: keywords.style || '其他',
                preview: {
                    colors: colors,
                    layout: display + '式', // 使用展示方式作为布局类型
                    features: features
                },
                cssFile: cssFile,
                prototypeDescription: description,
                generatedAt: new Date().toISOString(),
                isGenerated: true,
                designVariations: visualElements,
                functionConfig: functionConfig // 新增：功能配置
            };

            // 计算差异化
            const differences = designDifferentiator.calculateDifferences(newStyle, analysis);

            // 生成HTML结构
            const htmlStructure = this.generateHTMLStructure(newStyle, functionConfig);

            // 生成CSS代码
            const cssCode = this.generateCSS(newStyle, visualElements, functionConfig);

            return {
                success: true,
                prototype: newStyle,
                htmlStructure: htmlStructure,
                cssCode: cssCode,
                differences: differences
            };
        } catch (error) {
            console.error('生成原型失败:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * 生成样式名称（基于结构和功能）
     */
    generateStyleName(keywords, structure, functions, display) {
        const parts = [];
        
        if (keywords.style) {
            parts.push(keywords.style);
        }
        
        if (structure) {
            parts.push(structure + '布局');
        }
        
        if (functions.length > 0) {
            parts.push(functions[0]); // 使用第一个主要功能
        }
        
        if (display) {
            parts.push(display + '展示');
        }

        return parts.length > 0 ? parts.join(' ') : '自定义原型';
    }

    /**
     * 生成样式描述（基于功能点）
     */
    generateStyleDescription(keywords, structure, functions, interactions, display) {
        const parts = [];
        
        if (structure) {
            parts.push(`${structure}布局`);
        }
        
        if (keywords.navigation) {
            parts.push(`${keywords.navigation}导航`);
        }
        
        if (functions.length > 0) {
            parts.push(`包含${functions.join('、')}`);
        }
        
        if (interactions.length > 0) {
            parts.push(`支持${interactions.join('、')}`);
        }
        
        if (display) {
            parts.push(`${display}展示`);
        }

        return parts.length > 0 ? parts.join('，') + '的备忘录小程序' : '自定义备忘录小程序';
    }

    /**
     * 生成特色功能列表（基于功能点）
     */
    generateFeatures(functions, interactions, display) {
        const features = [];

        // 添加功能模块
        features.push(...functions);

        // 添加交互方式
        features.push(...interactions);

        // 添加展示方式
        if (display) {
            features.push(`${display}展示`);
        }

        if (features.length === 0) {
            features.push('基础功能', '简洁界面');
        }

        return features;
    }

    /**
     * 生成HTML结构（根据功能配置生成不同的界面结构）
     * @param {Object} style - 样式对象
     * @param {Object} functionConfig - 功能配置
     * @returns {string} HTML结构字符串
     */
    generateHTMLStructure(style, functionConfig) {
        const colors = style.preview.colors;
        const structure = functionConfig.structure || '单栏';
        const navigation = functionConfig.navigation || '顶部';
        const functions = functionConfig.functions || [];
        const interactions = functionConfig.interactions || [];
        const display = functionConfig.display || '列表';

        // 示例备忘录数据
        const memos = [
            { title: '重要会议', content: '明天下午2点与客户讨论项目进度', time: '今天 10:30', category: '工作', priority: 'high' },
            { title: '购物清单', content: '牛奶、面包、鸡蛋、水果', time: '今天 09:15', category: '生活', priority: 'normal' },
            { title: '学习计划', content: '完成JavaScript课程第5章', time: '昨天 20:00', category: '学习', priority: 'normal' },
            { title: '运动打卡', content: '跑步30分钟', time: '昨天 18:30', category: '健康', priority: 'low' }
        ];

        // 根据结构类型生成不同的HTML
        if (structure === '双栏') {
            return this.generateTwoColumnHTML(colors, navigation, functions, interactions, display, memos);
        } else if (structure === '三栏') {
            return this.generateThreeColumnHTML(colors, navigation, functions, interactions, display, memos);
        } else {
            return this.generateSingleColumnHTML(colors, navigation, functions, interactions, display, memos);
        }
    }

    /**
     * 生成单栏布局HTML
     */
    generateSingleColumnHTML(colors, navigation, functions, interactions, display, memos) {
        const hasSearch = functions.includes('搜索');
        const hasFilter = functions.includes('筛选');
        const hasTags = functions.includes('标签系统');
        const hasPriority = functions.includes('优先级管理');
        const hasCalendar = functions.includes('日历视图');
        const hasTimeline = functions.includes('时间轴');

        let headerHTML = '';
        if (navigation === '顶部') {
            headerHTML = `
                <div class="memo-preview-header">
                    <div class="memo-header-left">
                        <h3 class="memo-preview-title">我的备忘录</h3>
                        <span class="memo-count">${memos.length} 条</span>
                    </div>
                    <button class="memo-add-btn" style="background-color: ${colors.primary};">
                        <span class="add-icon">+</span>
                        <span class="add-text">新建</span>
                    </button>
                </div>
            `;
        }

        let searchHTML = '';
        if (hasSearch) {
            searchHTML = `
                <div class="memo-search">
                    <input type="text" class="memo-search-input" placeholder="搜索备忘录..." />
                    <span class="memo-search-icon">🔍</span>
                </div>
            `;
        }

        let filterHTML = '';
        if (hasFilter || hasTags) {
            const categories = hasTags ? ['全部', '工作', '生活', '学习', '健康'] : ['全部', '工作', '生活', '学习'];
            filterHTML = `
                <div class="memo-categories">
                    ${categories.map(cat => `<button class="memo-category-btn ${cat === '全部' ? 'active' : ''}">${cat}</button>`).join('')}
                </div>
            `;
        }

        let memosHTML = '';
        if (display === '卡片') {
            memosHTML = this.generateCardDisplay(memos, colors, hasPriority);
        } else if (display === '网格') {
            memosHTML = this.generateGridDisplay(memos, colors, hasPriority);
        } else if (display === '时间轴') {
            memosHTML = this.generateTimelineDisplay(memos, colors, hasPriority);
        } else {
            memosHTML = this.generateListDisplay(memos, colors, hasPriority);
        }

        let bottomNavHTML = '';
        if (navigation === '底部') {
            bottomNavHTML = `
                <div class="memo-bottom-nav">
                    <button class="nav-btn active">📝</button>
                    <button class="nav-btn">🔍</button>
                    <button class="nav-btn">📊</button>
                    <button class="nav-btn">⚙️</button>
                </div>
            `;
        }

        return `
            <div class="memo-preview-wrapper">
                <div class="memo-preview memo-structure-single">
                    ${headerHTML}
                    ${searchHTML}
                    ${filterHTML}
                    <ul class="memo-preview-list memo-display-${display}">
                        ${memosHTML}
                    </ul>
                    ${bottomNavHTML}
                </div>
            </div>
        `;
    }

    /**
     * 生成双栏布局HTML
     */
    generateTwoColumnHTML(colors, navigation, functions, interactions, display, memos) {
        const hasSearch = functions.includes('搜索');
        const hasFilter = functions.includes('筛选');
        const hasTags = functions.includes('标签系统');
        const hasPriority = functions.includes('优先级管理');

        let headerHTML = '';
        if (navigation === '顶部') {
            headerHTML = `
                <div class="memo-preview-header">
                    <h3 class="memo-preview-title">我的备忘录</h3>
                    <button class="memo-add-btn" style="background-color: ${colors.primary};">
                        <span class="add-icon">+</span>
                        <span class="add-text">新建</span>
                    </button>
                </div>
            `;
        }

        let searchHTML = '';
        if (hasSearch) {
            searchHTML = `
                <div class="memo-search">
                    <input type="text" class="memo-search-input" placeholder="搜索..." />
                    <span class="memo-search-icon">🔍</span>
                </div>
            `;
        }

        const memosHTML = this.generateListDisplay(memos, colors, hasPriority);

        return `
            <div class="memo-preview-wrapper">
                <div class="memo-preview memo-structure-two">
                    ${headerHTML}
                    <div class="memo-two-column">
                        <div class="memo-sidebar">
                            ${searchHTML}
                            <div class="memo-categories">
                                <button class="memo-category-btn active">全部</button>
                                <button class="memo-category-btn">工作</button>
                                <button class="memo-category-btn">生活</button>
                                <button class="memo-category-btn">学习</button>
                            </div>
                        </div>
                        <div class="memo-content">
                            <ul class="memo-preview-list memo-display-${display}">
                                ${memosHTML}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 生成三栏布局HTML
     */
    generateThreeColumnHTML(colors, navigation, functions, interactions, display, memos) {
        const hasSearch = functions.includes('搜索');
        const hasPriority = functions.includes('优先级管理');

        let headerHTML = '';
        if (navigation === '顶部') {
            headerHTML = `
                <div class="memo-preview-header">
                    <h3 class="memo-preview-title">我的备忘录</h3>
                    <button class="memo-add-btn" style="background-color: ${colors.primary};">
                        <span class="add-icon">+</span>
                    </button>
                </div>
            `;
        }

        const memosHTML = this.generateListDisplay(memos, colors, hasPriority);

        return `
            <div class="memo-preview-wrapper">
                <div class="memo-preview memo-structure-three">
                    ${headerHTML}
                    <div class="memo-three-column">
                        <div class="memo-sidebar-left">
                            <div class="memo-categories">
                                <button class="memo-category-btn active">全部</button>
                                <button class="memo-category-btn">工作</button>
                                <button class="memo-category-btn">生活</button>
                            </div>
                        </div>
                        <div class="memo-content-main">
                            <ul class="memo-preview-list memo-display-${display}">
                                ${memosHTML}
                            </ul>
                        </div>
                        <div class="memo-sidebar-right">
                            <div class="memo-detail-placeholder">
                                <p>选择备忘录查看详情</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 生成列表展示
     */
    generateListDisplay(memos, colors, hasPriority) {
        return memos.map(memo => `
            <li class="memo-item memo-priority-${memo.priority}">
                <div class="memo-item-header">
                    <div class="memo-item-title">${memo.title}</div>
                    ${hasPriority ? `<span class="memo-priority-badge priority-${memo.priority}">${memo.priority === 'high' ? '高' : memo.priority === 'normal' ? '中' : '低'}</span>` : ''}
                    <span class="memo-item-category">${memo.category}</span>
                </div>
                <div class="memo-item-content">${memo.content}</div>
                <div class="memo-item-footer">
                    <span class="memo-item-time">${memo.time}</span>
                    <div class="memo-item-actions">
                        <button class="memo-action-btn" title="编辑">✏️</button>
                        <button class="memo-action-btn" title="删除">🗑️</button>
                    </div>
                </div>
            </li>
        `).join('');
    }

    /**
     * 生成卡片展示
     */
    generateCardDisplay(memos, colors, hasPriority) {
        return memos.map(memo => `
            <li class="memo-item memo-card memo-priority-${memo.priority}">
                <div class="memo-card-header">
                    <div class="memo-item-title">${memo.title}</div>
                    ${hasPriority ? `<span class="memo-priority-badge priority-${memo.priority}">${memo.priority === 'high' ? '高' : memo.priority === 'normal' ? '中' : '低'}</span>` : ''}
                </div>
                <div class="memo-item-content">${memo.content}</div>
                <div class="memo-card-footer">
                    <span class="memo-item-category">${memo.category}</span>
                    <span class="memo-item-time">${memo.time}</span>
                </div>
            </li>
        `).join('');
    }

    /**
     * 生成网格展示
     */
    generateGridDisplay(memos, colors, hasPriority) {
        return memos.map(memo => `
            <li class="memo-item memo-grid memo-priority-${memo.priority}">
                <div class="memo-item-title">${memo.title}</div>
                <div class="memo-item-content">${memo.content}</div>
                ${hasPriority ? `<span class="memo-priority-badge priority-${memo.priority}">${memo.priority === 'high' ? '高' : memo.priority === 'normal' ? '中' : '低'}</span>` : ''}
            </li>
        `).join('');
    }

    /**
     * 生成时间轴展示
     */
    generateTimelineDisplay(memos, colors, hasPriority) {
        return memos.map((memo, index) => `
            <li class="memo-item memo-timeline memo-priority-${memo.priority}">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                    <div class="memo-item-time">${memo.time}</div>
                    <div class="memo-item-title">${memo.title}</div>
                    <div class="memo-item-content">${memo.content}</div>
                    ${hasPriority ? `<span class="memo-priority-badge priority-${memo.priority}">${memo.priority === 'high' ? '高' : memo.priority === 'normal' ? '中' : '低'}</span>` : ''}
                </div>
            </li>
        `).join('');
    }

    /**
     * 生成CSS代码
     * 注意：样式只应用于预览区域内的备忘录小程序界面，不影响页面整体样式
     * @param {Object} style - 样式对象
     * @param {Object} visualElements - 视觉元素配置
     * @param {Object} functionConfig - 功能配置
     */
    generateCSS(style, visualElements, functionConfig = {}) {
        const colors = style.preview.colors;
        
        // 计算圆角大小
        const borderRadiusMap = {
            '小': '4px',
            '中': '8px',
            '大': '12px',
            '超大': '16px'
        };
        const borderRadius = borderRadiusMap[visualElements.borderRadius] || '8px';

        // 计算阴影
        const shadowMap = {
            '无': 'none',
            '轻微': '0 1px 3px rgba(0, 0, 0, 0.1)',
            '中等': '0 2px 8px rgba(0, 0, 0, 0.15)',
            '强烈': '0 4px 16px rgba(0, 0, 0, 0.2)'
        };
        const shadow = shadowMap[visualElements.shadowIntensity] || '0 2px 8px rgba(0, 0, 0, 0.15)';

        // 计算间距比例
        const spacingMap = {
            '紧凑': '0.8',
            '标准': '1',
            '宽松': '1.2',
            '超宽松': '1.5'
        };
        const spacingScale = spacingMap[visualElements.spacingScale] || '1';

        // 计算间距值（基于标准间距）
        const baseSpacing = 16;
        const spacing = baseSpacing * parseFloat(spacingScale);

        return `/* 样式方案: ${style.name} */
/* 生成时间: ${style.generatedAt} */
/* 描述: ${style.prototypeDescription} */
/* 注意：此样式仅应用于预览区域内的备忘录小程序界面 */

/* 作用域限制：只影响预览区域内的备忘录小程序 */
.preview-content[data-style-id="${style.id}"] {
    /* 设置预览区域的CSS变量，只作用于该预览区域 */
    --preview-primary: ${colors.primary};
    --preview-secondary: ${colors.secondary};
    --preview-bg: ${colors.background};
    --preview-text: ${colors.text};
    --preview-border-radius: ${borderRadius};
    --preview-shadow: ${shadow};
    --preview-spacing: ${spacing}px;
}

/* 备忘录预览容器样式 */
.preview-content[data-style-id="${style.id}"] .memo-preview {
    background: var(--preview-bg, ${colors.background});
    border-radius: var(--preview-border-radius, ${borderRadius});
    padding: var(--preview-spacing, ${spacing}px);
}

/* 备忘录项样式 */
.preview-content[data-style-id="${style.id}"] .memo-item {
    border-radius: var(--preview-border-radius, ${borderRadius});
    box-shadow: var(--preview-shadow, ${shadow});
    transition: all 0.3s ease;
    margin-bottom: var(--preview-spacing, ${spacing}px);
    border-left-color: var(--preview-primary, ${colors.primary});
}

.preview-content[data-style-id="${style.id}"] .memo-item:hover {
    transform: translateY(-2px);
    box-shadow: ${visualElements.shadowIntensity === '强烈' ? '0 6px 20px rgba(0, 0, 0, 0.25)' : '0 4px 12px rgba(0, 0, 0, 0.15)'};
}

/* 按钮样式 */
.preview-content[data-style-id="${style.id}"] .memo-add-btn {
    background: var(--preview-primary, ${colors.primary}) !important;
    border-radius: var(--preview-border-radius, ${borderRadius});
}

.preview-content[data-style-id="${style.id}"] .memo-category-btn.active {
    background: var(--preview-primary, ${colors.primary}) !important;
    border-color: var(--preview-primary, ${colors.primary}) !important;
}

/* 搜索框样式 */
.preview-content[data-style-id="${style.id}"] .memo-search-input {
    border-radius: var(--preview-border-radius, ${borderRadius});
    padding: calc(var(--preview-spacing, ${spacing}px) * 0.75) calc(var(--preview-spacing, ${spacing}px) * 1.5);
}

.preview-content[data-style-id="${style.id}"] .memo-search-input:focus {
    border-color: var(--preview-primary, ${colors.primary});
}

/* 动画效果 */
@keyframes ${visualElements.animationType}-${style.id.replace(/[^a-zA-Z0-9]/g, '-')} {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.preview-content[data-style-id="${style.id}"] .memo-item {
    animation: ${visualElements.animationType}-${style.id.replace(/[^a-zA-Z0-9]/g, '-')} 0.5s ease-out;
}
`;
    }

    /**
     * 保存生成的原型
     * @param {Object} prototype - 原型对象
     * @param {string} cssCode - CSS代码
     * @param {string} htmlStructure - HTML结构（可选）
     */
    savePrototype(prototype, cssCode, htmlStructure = null) {
        // 保存到内存
        this.generatedPrototypes.push({
            prototype: prototype,
            cssCode: cssCode,
            htmlStructure: htmlStructure,
            savedAt: new Date().toISOString()
        });

        // 动态创建并应用CSS样式
        const styleId = `style-${prototype.id}`;
        let styleElement = document.getElementById(styleId);
        
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            styleElement.type = 'text/css';
            document.head.appendChild(styleElement);
        }
        
        styleElement.textContent = cssCode;

        return true;
    }

    /**
     * 获取所有生成的原型
     */
    getGeneratedPrototypes() {
        return this.generatedPrototypes;
    }
}

// 导出单例
const prototypeGenerator = new PrototypeGenerator();

