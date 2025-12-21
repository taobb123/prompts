/**
 * 样式数据模型
 * 定义样式方案的数据结构、验证规则和管理方法
 */

/**
 * 样式方案数据模型类
 */
class StyleDataModel {
    /**
     * 验证样式方案数据是否符合规范
     * @param {Object} styleData - 样式数据对象
     * @returns {Object} 验证结果 { valid: boolean, errors: string[] }
     */
    static validate(styleData) {
        const errors = [];

        // 必需字段检查
        if (!styleData.id || typeof styleData.id !== 'string') {
            errors.push('样式ID必须是非空字符串');
        }

        if (!styleData.name || typeof styleData.name !== 'string') {
            errors.push('样式名称必须是非空字符串');
        }

        if (!styleData.description || typeof styleData.description !== 'string') {
            errors.push('样式描述必须是非空字符串');
        }

        if (!styleData.category || typeof styleData.category !== 'string') {
            errors.push('样式分类必须是非空字符串');
        }

        if (!styleData.cssFile || typeof styleData.cssFile !== 'string') {
            errors.push('CSS文件路径必须是非空字符串');
        }

        // preview对象检查
        if (!styleData.preview || typeof styleData.preview !== 'object') {
            errors.push('preview对象必须存在');
        } else {
            // colors检查
            if (!styleData.preview.colors || typeof styleData.preview.colors !== 'object') {
                errors.push('preview.colors对象必须存在');
            } else {
                const requiredColors = ['primary', 'secondary', 'background', 'text'];
                requiredColors.forEach(colorKey => {
                    if (!styleData.preview.colors[colorKey] || typeof styleData.preview.colors[colorKey] !== 'string') {
                        errors.push(`preview.colors.${colorKey}必须是非空字符串`);
                    } else if (!this.isValidColor(styleData.preview.colors[colorKey])) {
                        errors.push(`preview.colors.${colorKey}必须是有效的颜色值`);
                    }
                });
            }

            // layout检查
            if (!styleData.preview.layout || typeof styleData.preview.layout !== 'string') {
                errors.push('preview.layout必须是非空字符串');
            }

            // features检查
            if (!Array.isArray(styleData.preview.features)) {
                errors.push('preview.features必须是数组');
            } else {
                styleData.preview.features.forEach((feature, index) => {
                    if (typeof feature !== 'string') {
                        errors.push(`preview.features[${index}]必须是字符串`);
                    }
                });
            }
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * 验证颜色值格式
     * @param {string} color - 颜色值
     * @returns {boolean}
     */
    static isValidColor(color) {
        // 支持hex格式 (#RRGGBB 或 #RGB)
        const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        // 支持rgb/rgba格式
        const rgbPattern = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+\s*)?\)$/;
        // 支持颜色名称（基础颜色）
        const colorNames = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'black', 'white', 'gray', 'grey'];
        
        return hexPattern.test(color) || 
               rgbPattern.test(color) || 
               colorNames.includes(color.toLowerCase());
    }

    /**
     * 创建默认样式方案对象
     * @param {Object} overrides - 覆盖默认值的对象
     * @returns {Object} 样式方案对象
     */
    static createDefault(overrides = {}) {
        const defaultStyle = {
            id: `style-${Date.now()}`,
            name: '未命名样式',
            description: '这是一个样式方案',
            category: '其他',
            preview: {
                colors: {
                    primary: '#2196F3',
                    secondary: '#64B5F6',
                    background: '#FFFFFF',
                    text: '#333333'
                },
                layout: '列表式',
                features: []
            },
            cssFile: 'css/styles/style-default.css'
        };

        return { ...defaultStyle, ...overrides };
    }

    /**
     * 规范化样式数据（填充缺失字段）
     * @param {Object} styleData - 样式数据对象
     * @returns {Object} 规范化后的样式数据
     */
    static normalize(styleData) {
        const defaultStyle = this.createDefault();
        
        return {
            id: styleData.id || defaultStyle.id,
            name: styleData.name || defaultStyle.name,
            description: styleData.description || defaultStyle.description,
            category: styleData.category || defaultStyle.category,
            preview: {
                colors: {
                    primary: styleData.preview?.colors?.primary || defaultStyle.preview.colors.primary,
                    secondary: styleData.preview?.colors?.secondary || defaultStyle.preview.colors.secondary,
                    background: styleData.preview?.colors?.background || defaultStyle.preview.colors.background,
                    text: styleData.preview?.colors?.text || defaultStyle.preview.colors.text
                },
                layout: styleData.preview?.layout || defaultStyle.preview.layout,
                features: Array.isArray(styleData.preview?.features) 
                    ? styleData.preview.features 
                    : defaultStyle.preview.features
            },
            cssFile: styleData.cssFile || defaultStyle.cssFile
        };
    }

    /**
     * 验证并规范化样式数据数组
     * @param {Array} stylesArray - 样式数据数组
     * @returns {Object} { valid: boolean, styles: Array, errors: Array }
     */
    static validateAndNormalize(stylesArray) {
        if (!Array.isArray(stylesArray)) {
            return {
                valid: false,
                styles: [],
                errors: ['样式数据必须是数组']
            };
        }

        const normalizedStyles = [];
        const allErrors = [];

        stylesArray.forEach((style, index) => {
            const validation = this.validate(style);
            
            if (validation.valid) {
                normalizedStyles.push(style);
            } else {
                allErrors.push({
                    index: index,
                    id: style.id || 'unknown',
                    errors: validation.errors
                });
            }
        });

        return {
            valid: allErrors.length === 0,
            styles: normalizedStyles,
            errors: allErrors
        };
    }

    /**
     * 获取样式方案的摘要信息
     * @param {Object} styleData - 样式数据对象
     * @returns {Object} 摘要信息
     */
    static getSummary(styleData) {
        return {
            id: styleData.id,
            name: styleData.name,
            category: styleData.category,
            primaryColor: styleData.preview?.colors?.primary,
            layout: styleData.preview?.layout,
            featureCount: styleData.preview?.features?.length || 0
        };
    }

    /**
     * 比较两个样式方案
     * @param {Object} style1 - 样式方案1
     * @param {Object} style2 - 样式方案2
     * @returns {boolean} 是否相同
     */
    static equals(style1, style2) {
        return style1.id === style2.id && 
               style1.name === style2.name &&
               style1.cssFile === style2.cssFile;
    }

    /**
     * 获取样式方案的数据结构模板
     * @returns {Object} 数据结构模板
     */
    static getSchema() {
        return {
            id: 'string (必需) - 样式唯一标识',
            name: 'string (必需) - 样式名称',
            description: 'string (必需) - 样式描述',
            category: 'string (必需) - 样式分类',
            preview: {
                colors: {
                    primary: 'string (必需) - 主色调，格式：#RRGGBB 或 rgb()',
                    secondary: 'string (必需) - 次色调，格式：#RRGGBB 或 rgb()',
                    background: 'string (必需) - 背景色，格式：#RRGGBB 或 rgb()',
                    text: 'string (必需) - 文字颜色，格式：#RRGGBB 或 rgb()'
                },
                layout: 'string (必需) - 布局类型，如：列表式、卡片式、网格式',
                features: 'array (必需) - 特色功能列表，字符串数组'
            },
            cssFile: 'string (必需) - CSS文件路径，相对于项目根目录'
        };
    }
}

// 导出数据模型
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StyleDataModel;
}

