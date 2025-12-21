/**
 * 设计差异化算法模块
 * 确保新生成的原型与现有原型在结构和功能点上保持差异化
 */

class DesignDifferentiator {
    constructor() {
        // 结构布局类型
        this.structureTypes = ['单栏', '双栏', '三栏'];
        // 导航位置
        this.navigationPositions = ['顶部', '底部', '侧边栏'];
        // 功能模块
        this.functionModules = ['搜索', '筛选', '标签系统', '优先级管理', '时间管理', '日历视图', '时间轴', '排序'];
        // 交互方式
        this.interactionTypes = ['侧滑操作', '拖拽排序', '批量操作', '快速添加', '内联编辑'];
        // 数据展示方式
        this.displayTypes = ['列表', '卡片', '网格', '时间轴', '日历', '看板'];
        // 样式相关（保留用于兼容）
        this.layoutTypes = ['列表式', '卡片式', '网格式', '时间轴式', '瀑布流式'];
        this.borderRadiusOptions = ['小', '中', '大', '超大'];
        this.shadowIntensities = ['无', '轻微', '中等', '强烈'];
        this.spacingScales = ['紧凑', '标准', '宽松', '超宽松'];
        this.animationTypes = ['淡入', '滑入', '缩放', '旋转', '弹性'];
    }

    /**
     * 分析现有原型的结构和功能点特征
     * @param {Array} existingStyles - 现有样式数组
     * @returns {Object} 现有原型的特征分析
     */
    analyzeExistingStyles(existingStyles) {
        const analysis = {
            // 功能点分析
            usedStructures: [],        // 已使用的结构布局
            usedNavigations: [],       // 已使用的导航位置
            usedFunctions: [],         // 已使用的功能模块
            usedInteractions: [],      // 已使用的交互方式
            usedDisplays: [],          // 已使用的数据展示方式
            // 样式分析（保留用于兼容）
            usedColors: [],
            usedLayouts: [],
            usedBorderRadius: [],
            usedShadows: [],
            usedSpacing: [],
            usedAnimations: []
        };

        existingStyles.forEach(style => {
            // 分析结构布局（从功能配置中提取）
            if (style.functionConfig?.structure) {
                analysis.usedStructures.push(style.functionConfig.structure);
            }
            
            // 分析导航位置
            if (style.functionConfig?.navigation) {
                analysis.usedNavigations.push(style.functionConfig.navigation);
            }
            
            // 分析功能模块
            if (style.functionConfig?.functions && Array.isArray(style.functionConfig.functions)) {
                analysis.usedFunctions.push(...style.functionConfig.functions);
            }
            
            // 分析交互方式
            if (style.functionConfig?.interactions && Array.isArray(style.functionConfig.interactions)) {
                analysis.usedInteractions.push(...style.functionConfig.interactions);
            }
            
            // 分析数据展示方式
            if (style.functionConfig?.display) {
                analysis.usedDisplays.push(style.functionConfig.display);
            }

            // 分析颜色（保留用于样式生成）
            if (style.preview?.colors) {
                analysis.usedColors.push({
                    primary: style.preview.colors.primary,
                    secondary: style.preview.colors.secondary,
                    background: style.preview.colors.background
                });
            }

            // 分析布局（保留用于兼容）
            if (style.preview?.layout) {
                analysis.usedLayouts.push(style.preview.layout);
            }

            // 分析设计变化（如果存在）
            if (style.designVariations) {
                if (style.designVariations.borderRadius) {
                    analysis.usedBorderRadius.push(style.designVariations.borderRadius);
                }
                if (style.designVariations.shadowIntensity) {
                    analysis.usedShadows.push(style.designVariations.shadowIntensity);
                }
                if (style.designVariations.spacingScale) {
                    analysis.usedSpacing.push(style.designVariations.spacingScale);
                }
                if (style.designVariations.animationType) {
                    analysis.usedAnimations.push(style.designVariations.animationType);
                }
            }
        });

        return analysis;
    }

    /**
     * 计算颜色差异度
     * @param {string} color1 - 颜色1（hex格式）
     * @param {string} color2 - 颜色2（hex格式）
     * @returns {number} 差异度（0-100）
     */
    calculateColorDifference(color1, color2) {
        const rgb1 = this.hexToRgb(color1);
        const rgb2 = this.hexToRgb(color2);
        
        if (!rgb1 || !rgb2) return 0;

        const rDiff = Math.abs(rgb1.r - rgb2.r);
        const gDiff = Math.abs(rgb1.g - rgb2.g);
        const bDiff = Math.abs(rgb1.b - rgb2.b);
        
        const distance = Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
        return Math.min(100, (distance / Math.sqrt(255 * 255 * 3)) * 100);
    }

    /**
     * 将hex颜色转换为RGB
     */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    /**
     * 选择差异化的颜色方案
     */
    selectDifferentiatedColors(usedColors, theme = '浅色') {
        const colorPalettes = {
            '浅色': [
                { primary: '#4CAF50', secondary: '#81C784', background: '#F5F5F5', text: '#333333' },
                { primary: '#2196F3', secondary: '#64B5F6', background: '#E3F2FD', text: '#1976D2' },
                { primary: '#FF9800', secondary: '#FFB74D', background: '#FFF3E0', text: '#5D4037' },
                { primary: '#9C27B0', secondary: '#BA68C8', background: '#F3E5F5', text: '#4A148C' },
                { primary: '#E91E63', secondary: '#F48FB1', background: '#FCE4EC', text: '#880E4F' },
                { primary: '#00BCD4', secondary: '#4DD0E1', background: '#E0F7FA', text: '#006064' }
            ],
            '深色': [
                { primary: '#2196F3', secondary: '#64B5F6', background: '#263238', text: '#FFFFFF' },
                { primary: '#9C27B0', secondary: '#BA68C8', background: '#1A1A2E', text: '#E0E0E0' },
                { primary: '#4CAF50', secondary: '#66BB6A', background: '#1B5E20', text: '#C8E6C9' },
                { primary: '#FF5722', secondary: '#FF8A65', background: '#3E2723', text: '#FFCCBC' },
                { primary: '#00BCD4', secondary: '#4DD0E1', background: '#004D40', text: '#B2EBF2' }
            ],
            '彩色': [
                { primary: '#FF6B6B', secondary: '#FF8E8E', background: '#FFF5F5', text: '#C92A2A' },
                { primary: '#4ECDC4', secondary: '#7ED4CC', background: '#F0FDFC', text: '#0D9488' },
                { primary: '#FFE66D', secondary: '#FFF89C', background: '#FFFBEB', text: '#F59E0B' },
                { primary: '#A8E6CF', secondary: '#C5F4E0', background: '#F0FDF4', text: '#166534' },
                { primary: '#FFB6C1', secondary: '#FFC0CB', background: '#FFF1F2', text: '#BE185D' }
            ]
        };

        const palettes = colorPalettes[theme] || colorPalettes['浅色'];
        let bestColors = null;
        let maxMinDifference = 0;

        for (const palette of palettes) {
            let minDifference = Infinity;
            
            for (const usedColor of usedColors) {
                const primaryDiff = this.calculateColorDifference(palette.primary, usedColor.primary);
                const secondaryDiff = this.calculateColorDifference(palette.secondary, usedColor.secondary);
                const bgDiff = this.calculateColorDifference(palette.background, usedColor.background);
                
                const avgDiff = (primaryDiff + secondaryDiff + bgDiff) / 3;
                minDifference = Math.min(minDifference, avgDiff);
            }

            if (minDifference > maxMinDifference) {
                maxMinDifference = minDifference;
                bestColors = palette;
            }
        }

        return bestColors || palettes[0];
    }

    /**
     * 选择差异化的结构布局
     */
    selectDifferentiatedStructure(usedStructures) {
        return this.selectDifferentOption(this.structureTypes, usedStructures);
    }

    /**
     * 选择差异化的导航位置
     */
    selectDifferentiatedNavigation(usedNavigations) {
        return this.selectDifferentOption(this.navigationPositions, usedNavigations);
    }

    /**
     * 选择差异化的功能模块
     */
    selectDifferentiatedFunctions(usedFunctions, requestedFunctions = []) {
        const selectedFunctions = [];
        
        // 优先使用用户请求的功能
        requestedFunctions.forEach(func => {
            if (this.functionModules.includes(func) && !selectedFunctions.includes(func)) {
                selectedFunctions.push(func);
            }
        });

        // 添加差异化的功能
        const remainingFunctions = this.functionModules.filter(f => 
            !selectedFunctions.includes(f) && !usedFunctions.includes(f)
        );

        const additionalCount = Math.min(3 - selectedFunctions.length, remainingFunctions.length);
        for (let i = 0; i < additionalCount; i++) {
            const randomIndex = Math.floor(Math.random() * remainingFunctions.length);
            selectedFunctions.push(remainingFunctions[randomIndex]);
            remainingFunctions.splice(randomIndex, 1);
        }

        if (selectedFunctions.length === 0) {
            selectedFunctions.push('搜索'); // 至少包含搜索功能
        }

        return selectedFunctions;
    }

    /**
     * 选择差异化的交互方式
     */
    selectDifferentiatedInteractions(usedInteractions, requestedInteractions = []) {
        const selectedInteractions = [];
        
        requestedInteractions.forEach(interaction => {
            if (this.interactionTypes.includes(interaction) && !selectedInteractions.includes(interaction)) {
                selectedInteractions.push(interaction);
            }
        });

        const remainingInteractions = this.interactionTypes.filter(i => 
            !selectedInteractions.includes(i) && !usedInteractions.includes(i)
        );

        if (remainingInteractions.length > 0 && selectedInteractions.length < 2) {
            selectedInteractions.push(remainingInteractions[0]);
        }

        return selectedInteractions.length > 0 ? selectedInteractions : ['快速添加'];
    }

    /**
     * 选择差异化的数据展示方式
     */
    selectDifferentiatedDisplay(usedDisplays, requestedDisplay = null) {
        if (requestedDisplay && this.displayTypes.includes(requestedDisplay)) {
            return requestedDisplay;
        }
        return this.selectDifferentOption(this.displayTypes, usedDisplays);
    }

    /**
     * 选择差异化的布局类型（保留用于兼容）
     */
    selectDifferentiatedLayout(usedLayouts) {
        return this.selectDifferentOption(this.layoutTypes, usedLayouts);
    }

    /**
     * 选择差异化的视觉元素
     */
    selectDifferentiatedVisualElements(analysis) {
        return {
            borderRadius: this.selectDifferentOption(this.borderRadiusOptions, analysis.usedBorderRadius),
            shadowIntensity: this.selectDifferentOption(this.shadowIntensities, analysis.usedShadows),
            spacingScale: this.selectDifferentOption(this.spacingScales, analysis.usedSpacing),
            animationType: this.selectDifferentOption(this.animationTypes, analysis.usedAnimations)
        };
    }

    /**
     * 选择不同的选项
     */
    selectDifferentOption(options, usedOptions) {
        const unused = options.filter(opt => !usedOptions.includes(opt));
        if (unused.length > 0) {
            return unused[0];
        }
        return options[Math.floor(Math.random() * options.length)];
    }

    /**
     * 计算与现有原型的差异化说明（功能点差异化）
     */
    calculateDifferences(newStyle, analysis) {
        const functionConfig = newStyle.functionConfig || {};
        
        const structureDiff = !analysis.usedStructures.includes(functionConfig.structure);
        const navigationDiff = !analysis.usedNavigations.includes(functionConfig.navigation);
        
        const newFunctions = functionConfig.functions || [];
        const uniqueFunctions = newFunctions.filter(f => !analysis.usedFunctions.includes(f));
        
        const newInteractions = functionConfig.interactions || [];
        const uniqueInteractions = newInteractions.filter(i => !analysis.usedInteractions.includes(i));
        
        const displayDiff = !analysis.usedDisplays.includes(functionConfig.display);
        
        let minColorDiff = 100;
        if (newStyle.preview?.colors && analysis.usedColors.length > 0) {
            analysis.usedColors.forEach(usedColor => {
                const primaryDiff = this.calculateColorDifference(
                    newStyle.preview.colors.primary,
                    usedColor.primary
                );
                minColorDiff = Math.min(minColorDiff, primaryDiff);
            });
        }

        return {
            structureDifference: structureDiff ? '使用了全新的结构布局' : '结构布局与现有原型不同',
            navigationDifference: navigationDiff ? '使用了全新的导航位置' : '导航位置与现有原型不同',
            functionDifference: uniqueFunctions.length > 0 ? `包含${uniqueFunctions.length}个新功能模块：${uniqueFunctions.join('、')}` : '功能模块与现有原型相似',
            interactionDifference: uniqueInteractions.length > 0 ? `包含${uniqueInteractions.length}种新交互方式：${uniqueInteractions.join('、')}` : '交互方式与现有原型相似',
            displayDifference: displayDiff ? '使用了全新的数据展示方式' : '数据展示方式与现有原型不同',
            colorDifference: minColorDiff
        };
    }
}

// 导出单例
const designDifferentiator = new DesignDifferentiator();
