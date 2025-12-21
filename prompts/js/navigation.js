/**
 * 导航模块
 * 负责网站导航、样式分类筛选和返回顶部功能
 */

class NavigationManager {
    constructor() {
        this.currentCategory = 'all';
        this.categories = [];
        this.styles = [];
    }

    /**
     * 初始化导航模块
     * @param {Array} styles - 样式数组
     */
    init(styles) {
        this.styles = styles;
        this.extractCategories();
        this.renderCategoryFilter();
        this.initScrollToTop();
        this.initScrollListener();
    }

    /**
     * 提取所有分类
     */
    extractCategories() {
        const categorySet = new Set(['all']); // 默认包含"全部"
        this.styles.forEach(style => {
            if (style.category) {
                categorySet.add(style.category);
            }
        });
        this.categories = Array.from(categorySet);
    }

    /**
     * 渲染分类筛选器
     */
    renderCategoryFilter() {
        const filterContainer = document.getElementById('categoryFilter');
        if (!filterContainer) return;

        filterContainer.innerHTML = '';

        this.categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'category-filter-btn';
            button.dataset.category = category;
            button.textContent = category === 'all' ? '全部' : category;
            
            if (category === 'all') {
                button.classList.add('active');
            }

            button.addEventListener('click', () => {
                this.filterByCategory(category);
            });

            filterContainer.appendChild(button);
        });
    }

    /**
     * 按分类筛选样式
     * @param {string} category - 分类名称
     */
    filterByCategory(category) {
        this.currentCategory = category;

        // 更新按钮状态
        const buttons = document.querySelectorAll('.category-filter-btn');
        buttons.forEach(btn => {
            if (btn.dataset.category === category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // 筛选样式卡片
        const cards = document.querySelectorAll('.style-card');
        cards.forEach(card => {
            const styleId = card.dataset.styleId;
            const style = this.styles.find(s => s.id === styleId);
            
            if (category === 'all' || (style && style.category === category)) {
                card.style.display = '';
                // 添加淡入动画
                card.style.opacity = '0';
                setTimeout(() => {
                    card.style.transition = 'opacity 0.3s ease';
                    card.style.opacity = '1';
                }, 10);
            } else {
                card.style.display = 'none';
            }
        });

        // 如果没有匹配的卡片，显示提示
        this.showEmptyState();
    }

    /**
     * 显示空状态提示
     */
    showEmptyState() {
        const cardsContainer = document.getElementById('styleCards');
        if (!cardsContainer) return;

        const visibleCards = Array.from(cardsContainer.querySelectorAll('.style-card'))
            .filter(card => card.style.display !== 'none');

        let emptyState = cardsContainer.querySelector('.empty-state');
        
        if (visibleCards.length === 0) {
            if (!emptyState) {
                emptyState = document.createElement('div');
                emptyState.className = 'empty-state';
                emptyState.innerHTML = `
                    <div class="empty-state-icon">🔍</div>
                    <div class="empty-state-text">暂无此分类的样式方案</div>
                `;
                cardsContainer.appendChild(emptyState);
            }
            emptyState.style.display = 'flex';
        } else {
            if (emptyState) {
                emptyState.style.display = 'none';
            }
        }
    }

    /**
     * 初始化返回顶部功能
     */
    initScrollToTop() {
        const scrollTopBtn = document.getElementById('scrollToTop');
        if (!scrollTopBtn) return;

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /**
     * 初始化滚动监听
     */
    initScrollListener() {
        const scrollTopBtn = document.getElementById('scrollToTop');
        if (!scrollTopBtn) return;

        // 初始状态隐藏
        scrollTopBtn.style.display = 'none';

        window.addEventListener('scroll', () => {
            // 当滚动超过300px时显示按钮
            if (window.pageYOffset > 300) {
                scrollTopBtn.style.display = 'flex';
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.style.display = 'none';
                scrollTopBtn.classList.remove('show');
            }
        });
    }

    /**
     * 获取当前分类
     */
    getCurrentCategory() {
        return this.currentCategory;
    }

    /**
     * 滚动到指定元素
     * @param {string} elementId - 元素ID
     */
    scrollToElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// 导出单例
const navigationManager = new NavigationManager();

