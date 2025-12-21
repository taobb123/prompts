/**
 * 预览模块
 * 负责创建和更新样式预览
 */

class PreviewManager {
    constructor() {
        this.currentPreviewMode = 'desktop'; // 'desktop' 或 'mobile'
        this.currentStyle = null;
    }

    /**
     * 创建完整的备忘录预览界面
     * @param {Object} style - 样式对象
     * @param {string} mode - 预览模式 ('desktop' 或 'mobile')
     * @returns {HTMLElement} 预览元素
     */
    createPreview(style, mode = 'desktop') {
        this.currentStyle = style;
        this.currentPreviewMode = mode;

        const preview = document.createElement('div');
        preview.className = `preview-content active preview-mode-${mode}`;
        
        // 设置CSS变量用于预览
        const colors = style.preview.colors;
        preview.style.setProperty('--preview-primary', colors.primary);
        preview.style.setProperty('--preview-secondary', colors.secondary);
        preview.style.setProperty('--preview-bg', colors.background);
        preview.style.setProperty('--preview-text', colors.text);
        
        // 根据背景色判断是否为深色主题
        const isDark = this.isDarkColor(colors.background);
        preview.style.setProperty('--preview-item-bg', isDark ? this.lightenColor(colors.background, 10) : '#F5F5F5');
        preview.style.setProperty('--preview-border', isDark ? 'rgba(255,255,255,0.1)' : '#E0E0E0');

        // 创建预览内容
        preview.innerHTML = this.generatePreviewHTML(style, mode);

        return preview;
    }

    /**
     * 生成预览HTML
     * @param {Object} style - 样式对象
     * @param {string} mode - 预览模式
     * @returns {string} HTML字符串
     */
    generatePreviewHTML(style, mode) {
        const colors = style.preview.colors;
        
        // 示例备忘录数据
        const memos = [
            {
                title: '重要会议',
                content: '明天下午2点与客户讨论项目进度，准备演示材料',
                time: '今天 10:30',
                category: '工作',
                priority: 'high'
            },
            {
                title: '购物清单',
                content: '牛奶、面包、鸡蛋、水果、蔬菜',
                time: '今天 09:15',
                category: '生活',
                priority: 'normal'
            },
            {
                title: '学习计划',
                content: '完成JavaScript课程第5章，复习ES6语法',
                time: '昨天 20:00',
                category: '学习',
                priority: 'normal'
            },
            {
                title: '运动打卡',
                content: '跑步30分钟，完成今日运动目标',
                time: '昨天 18:30',
                category: '健康',
                priority: 'low'
            }
        ];

        const memosHtml = memos.map(memo => `
            <li class="memo-item memo-priority-${memo.priority}">
                <div class="memo-item-header">
                    <div class="memo-item-title">${memo.title}</div>
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

        return `
            <div class="memo-preview-wrapper preview-${mode}">
                <div class="memo-preview">
                    <!-- 顶部导航栏 -->
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

                    <!-- 搜索框 -->
                    <div class="memo-search">
                        <input type="text" class="memo-search-input" placeholder="搜索备忘录..." />
                        <span class="memo-search-icon">🔍</span>
                    </div>

                    <!-- 分类标签 -->
                    <div class="memo-categories">
                        <button class="memo-category-btn active">全部</button>
                        <button class="memo-category-btn">工作</button>
                        <button class="memo-category-btn">生活</button>
                        <button class="memo-category-btn">学习</button>
                    </div>

                    <!-- 备忘录列表 -->
                    <ul class="memo-preview-list">
                        ${memosHtml}
                    </ul>

                    <!-- 空状态提示（隐藏） -->
                    <div class="memo-empty-state" style="display: none;">
                        <div class="empty-icon">📝</div>
                        <div class="empty-text">暂无备忘录</div>
                        <button class="empty-action-btn">创建第一条</button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 切换预览模式
     * @param {string} mode - 'desktop' 或 'mobile'
     */
    switchMode(mode) {
        this.currentPreviewMode = mode;
        if (this.currentStyle) {
            return this.createPreview(this.currentStyle, mode);
        }
        return null;
    }

    /**
     * 判断颜色是否为深色
     * @param {string} color - 颜色值（hex格式）
     * @returns {boolean}
     */
    isDarkColor(color) {
        // 移除#号
        const hex = color.replace('#', '');
        // 转换为RGB
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        // 计算亮度
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness < 128;
    }

    /**
     * 加亮颜色
     * @param {string} color - 颜色值（hex格式）
     * @param {number} percent - 加亮百分比
     * @returns {string} 新颜色值
     */
    lightenColor(color, percent) {
        const hex = color.replace('#', '');
        const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + percent * 2.55);
        const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + percent * 2.55);
        const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + percent * 2.55);
        return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    }

    /**
     * 获取当前预览模式
     */
    getCurrentMode() {
        return this.currentPreviewMode;
    }
}

// 导出单例
const previewManager = new PreviewManager();

