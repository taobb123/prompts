/**
 * 样式管理模块
 * 负责加载和管理样式方案
 */

// 引入数据模型（如果可用）
// const StyleDataModel = typeof StyleDataModel !== 'undefined' ? StyleDataModel : null;

class StyleManager {
    constructor() {
        this.styles = [];
        this.currentStyle = null;
        this.styleLink = null;
    }

    /**
     * 加载样式方案数据
     */
    async loadStyles() {
        try {
            const response = await fetch('data/styles.json');
            if (!response.ok) {
                throw new Error('无法加载样式数据');
            }
            const stylesData = await response.json();
            
            // 如果数据模型可用，进行验证和规范化
            if (typeof StyleDataModel !== 'undefined') {
                const validation = StyleDataModel.validateAndNormalize(stylesData);
                if (validation.valid) {
                    this.styles = validation.styles;
                } else {
                    console.warn('样式数据验证失败:', validation.errors);
                    // 即使验证失败，也使用原始数据（容错处理）
                    this.styles = stylesData;
                }
            } else {
                this.styles = stylesData;
            }
            
            return this.styles;
        } catch (error) {
            console.warn('Fetch加载失败，尝试使用内联数据:', error);
            // 如果fetch失败（可能是file://协议），使用内联数据作为备用方案
            return this.getDefaultStyles();
        }
    }

    /**
     * 获取默认样式数据（备用方案）
     */
    getDefaultStyles() {
        if (this.styles.length > 0) {
            return this.styles;
        }
        // 内联样式数据
        this.styles = [
            {
                "id": "style-1",
                "name": "简约清新",
                "description": "采用浅色系配色，简洁清爽的设计风格，适合日常使用",
                "category": "简约",
                "preview": {
                    "colors": {
                        "primary": "#4CAF50",
                        "secondary": "#81C784",
                        "background": "#F5F5F5",
                        "text": "#333333"
                    },
                    "layout": "列表式",
                    "features": ["简洁界面", "浅色主题", "流畅动画"]
                },
                "cssFile": "css/styles/style-1.css"
            },
            {
                "id": "style-2",
                "name": "商务专业",
                "description": "深色系配色，专业稳重的设计风格，适合商务场景",
                "category": "商务",
                "preview": {
                    "colors": {
                        "primary": "#2196F3",
                        "secondary": "#64B5F6",
                        "background": "#263238",
                        "text": "#FFFFFF"
                    },
                    "layout": "卡片式",
                    "features": ["深色主题", "专业配色", "卡片布局"]
                },
                "cssFile": "css/styles/style-2.css"
            },
            {
                "id": "style-3",
                "name": "可爱温馨",
                "description": "暖色调配色，温馨可爱的设计风格，适合个人记录",
                "category": "可爱",
                "preview": {
                    "colors": {
                        "primary": "#FF9800",
                        "secondary": "#FFB74D",
                        "background": "#FFF3E0",
                        "text": "#5D4037"
                    },
                    "layout": "网格式",
                    "features": ["暖色主题", "圆角设计", "温馨配色"]
                },
                "cssFile": "css/styles/style-3.css"
            },
            {
                "id": "style-4",
                "name": "科技未来",
                "description": "深蓝紫色调，充满科技感和未来感的设计风格",
                "category": "科技",
                "preview": {
                    "colors": {
                        "primary": "#9C27B0",
                        "secondary": "#BA68C8",
                        "background": "#1A1A2E",
                        "text": "#E0E0E0"
                    },
                    "layout": "卡片式",
                    "features": ["深色主题", "科技感", "渐变效果"]
                },
                "cssFile": "css/styles/style-4.css"
            },
            {
                "id": "style-5",
                "name": "自然绿色",
                "description": "绿色系配色，清新自然的设计风格，适合环保主题",
                "category": "自然",
                "preview": {
                    "colors": {
                        "primary": "#2E7D32",
                        "secondary": "#66BB6A",
                        "background": "#E8F5E9",
                        "text": "#1B5E20"
                    },
                    "layout": "列表式",
                    "features": ["自然配色", "清新风格", "环保主题"]
                },
                "cssFile": "css/styles/style-5.css"
            }
        ];
        return this.styles;
    }

    /**
     * 应用样式方案
     * 注意：对于生成的样式，使用动态style标签；对于文件样式，使用link标签
     * @param {string} styleId - 样式ID
     */
    applyStyle(styleId) {
        const style = this.styles.find(s => s.id === styleId);
        if (!style) {
            console.error('样式不存在:', styleId);
            return;
        }

        // 移除旧的样式链接或style标签
        if (this.styleLink) {
            this.styleLink.remove();
            this.styleLink = null;
        }

        // 检查是否为生成的样式（使用动态style标签）
        if (style.isGenerated) {
            // 从原型生成器获取CSS代码
            const generatedPrototypes = prototypeGenerator.getGeneratedPrototypes();
            const generated = generatedPrototypes.find(p => p.prototype.id === styleId);
            
            if (generated) {
                // 检查是否已存在style标签
                const existingStyle = document.getElementById(`style-${styleId}`);
                if (existingStyle) {
                    // 如果已存在，更新内容
                    existingStyle.textContent = generated.cssCode;
                    this.styleLink = existingStyle;
                } else {
                    // 创建新的style标签并注入CSS
                    this.styleLink = document.createElement('style');
                    this.styleLink.id = `style-${styleId}`;
                    this.styleLink.type = 'text/css';
                    this.styleLink.textContent = generated.cssCode;
                    document.head.appendChild(this.styleLink);
                }
            } else {
                console.warn('生成的样式未找到:', styleId);
            }
        } else {
            // 对于文件样式，使用link标签
            this.styleLink = document.createElement('link');
            this.styleLink.rel = 'stylesheet';
            this.styleLink.href = style.cssFile;
            this.styleLink.id = 'current-style';
            document.head.appendChild(this.styleLink);
        }

        this.currentStyle = style;
        return style;
    }

    /**
     * 获取当前样式
     */
    getCurrentStyle() {
        return this.currentStyle;
    }

    /**
     * 获取所有样式
     */
    getAllStyles() {
        return this.styles;
    }

    /**
     * 根据ID获取样式
     */
    getStyleById(styleId) {
        return this.styles.find(s => s.id === styleId);
    }
}

// 导出单例
const styleManager = new StyleManager();

