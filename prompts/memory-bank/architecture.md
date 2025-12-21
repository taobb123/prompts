# 架构文档

本文档用于记录架构决策、文件职责、模块间的依赖关系，以及关键设计决策和理由。

## 项目结构

```
项目根目录/
├── index.html              # 主页面
├── css/
│   ├── main.css           # 主样式文件
│   └── styles/
│       ├── style-1.css    # 样式方案1
│       ├── style-2.css    # 样式方案2
│       └── style-3.css    # 样式方案3
├── js/
│   ├── main.js            # 主逻辑文件
│   ├── style-manager.js   # 样式管理模块
│   ├── style-data-model.js # 样式数据模型
│   ├── design-differentiator.js # 设计差异化算法
│   ├── prototype-generator.js # 原型生成器模块
│   ├── preview.js         # 预览功能模块
│   └── navigation.js      # 导航模块
├── data/
│   ├── styles.json        # 样式方案数据
│   ├── generated-prototypes.json # 生成的原型数据
│   └── STYLE_DATA_SCHEMA.md # 数据结构文档
├── assets/
│   ├── images/            # 图片资源
│   └── icons/             # 图标资源
└── memory-bank/           # 项目文档目录
```

## 文件职责

### HTML文件
- **index.html**: 
  - 主页面结构
  - 包含样式展示模块的容器
  - 样式卡片列表容器
  - 样式预览区域容器

### CSS文件
- **css/main.css**: 
  - 全局样式重置
  - 样式卡片列表样式
  - 预览区域样式
  - 响应式设计
  - CSS变量定义

- **css/styles/style-*.css**: 
  - 各个样式方案的CSS变量定义
  - 每个样式方案独立文件，便于维护和扩展

### JavaScript文件
- **js/style-manager.js**: 
  - StyleManager类：管理样式方案
  - 加载样式数据（loadStyles）
  - 获取默认样式数据（getDefaultStyles）- 备用方案
  - 应用样式方案（applyStyle）
  - 获取样式信息（getCurrentStyle, getAllStyles, getStyleById）

- **js/preview.js**: 
  - PreviewManager类：管理预览功能
  - 创建完整预览界面（createPreview）
  - 生成预览HTML（generatePreviewHTML）
  - 切换预览模式（switchMode）
  - 颜色工具方法（isDarkColor, lightenColor）

- **js/navigation.js**: 
  - NavigationManager类：管理导航功能
  - 初始化导航模块（init）
  - 提取分类（extractCategories）
  - 渲染分类筛选器（renderCategoryFilter）
  - 按分类筛选（filterByCategory）
  - 返回顶部功能（initScrollToTop, initScrollListener）
  - 滚动到元素（scrollToElement）

- **js/style-data-model.js**: 
  - StyleDataModel类：样式数据模型
  - 数据验证（validate, validateAndNormalize）
  - 数据规范化（normalize, createDefault）
  - 颜色验证（isValidColor）
  - 工具方法（getSummary, getSchema, equals）

- **js/design-differentiator.js**: 
  - DesignDifferentiator类：设计差异化算法
  - 分析现有原型（analyzeExistingStyles）
  - 计算颜色差异（calculateColorDifference）
  - 选择差异化颜色（selectDifferentiatedColors）
  - 选择差异化布局（selectDifferentiatedLayout）
  - 选择差异化视觉元素（selectDifferentiatedVisualElements）
  - 计算差异化说明（calculateDifferences）

- **js/prototype-generator.js**: 
  - PrototypeGenerator类：原型生成器
  - 解析描述（parseDescription）
  - 生成原型（generatePrototype）
  - 生成CSS代码（generateCSS）
  - 保存原型（savePrototype）
  - 获取生成的原型（getGeneratedPrototypes）

- **js/main.js**: 
  - 初始化逻辑
  - 渲染样式卡片列表（renderStyleCards）
  - 创建样式卡片元素（createStyleCard）
  - 选择和应用样式（selectStyle）
  - 更新预览区域（updatePreview）
  - 绑定预览模式切换（bindPreviewModeSwitcher）
  - 事件处理

### 数据文件
- **data/styles.json**: 
  - 存储所有样式方案的元数据
  - 包含样式ID、名称、描述、分类、颜色预览等信息
  - JSON格式，便于扩展

## 模块依赖关系

```
index.html
  ├── css/main.css (样式)
  ├── js/style-data-model.js (数据模型)
  ├── js/design-differentiator.js (差异化算法)
  ├── js/prototype-generator.js (原型生成器)
  │   └── 依赖 design-differentiator.js
  ├── js/style-manager.js (样式管理)
  │   └── 可选依赖 style-data-model.js (数据验证)
  ├── js/preview.js (预览模块)
  ├── js/navigation.js (导航模块)
  └── js/main.js (主逻辑)
      └── 依赖 style-manager.js
      └── 依赖 prototype-generator.js
      └── 依赖 preview.js
      └── 依赖 navigation.js
      └── 加载 data/styles.json (失败时使用内联数据)
      └── 动态加载 css/styles/*.css
      └── 动态注入生成的CSS样式
```

## 关键设计决策

### 1. 模块化设计
- **决策**: 将样式管理功能独立为StyleManager类
- **理由**: 便于代码复用和维护，职责分离清晰

### 2. 按需加载样式
- **决策**: 动态创建link标签加载样式文件，而非一次性加载所有样式
- **理由**: 性能优化，避免加载不必要的样式文件，提升页面加载速度

### 3. 使用CSS变量
- **决策**: 样式方案使用CSS变量定义颜色
- **理由**: 便于主题切换，统一管理颜色系统

### 4. 响应式设计
- **决策**: 使用CSS Grid和媒体查询实现响应式布局
- **理由**: 确保在不同设备上都有良好的显示效果

### 5. 数据驱动
- **决策**: 样式方案数据存储在JSON文件中
- **理由**: 易于扩展新的样式方案，无需修改代码逻辑

### 6. 数据加载容错
- **决策**: 在fetch失败时使用内联数据作为备用方案
- **理由**: 解决file://协议下的CORS限制，确保在任何环境下都能正常工作

### 7. 预览模块独立化
- **决策**: 将预览功能独立为PreviewManager类
- **理由**: 职责分离，便于维护和扩展预览功能

### 8. 响应式预览
- **决策**: 提供桌面端和移动端两种预览模式
- **理由**: 让用户能够看到样式在不同设备上的效果

### 9. 固定导航栏
- **决策**: 使用固定定位的顶部导航栏
- **理由**: 提供便捷的导航功能，随时可以访问不同区域

### 10. 动态分类筛选
- **决策**: 从样式数据中自动提取分类并生成筛选按钮
- **理由**: 无需手动维护分类列表，自动适应新增样式

### 11. 平滑滚动
- **决策**: 使用smooth滚动行为实现返回顶部和锚点跳转
- **理由**: 提供更好的用户体验，避免突兀的跳转

### 12. 数据模型验证
- **决策**: 创建独立的数据模型类进行数据验证和规范化
- **理由**: 确保数据质量，提供类型安全和错误提示

### 13. 可选数据验证
- **决策**: 数据模型验证作为可选功能，不影响现有功能
- **理由**: 向后兼容，即使数据模型不可用也能正常工作

### 14. 原型生成差异化
- **决策**: 实现设计差异化算法，确保生成的原型与现有原型保持差异
- **理由**: 避免生成重复或相似的原型，提供多样化的设计选择

### 15. 动态CSS注入
- **决策**: 使用style标签动态注入生成的CSS，而非创建物理文件
- **理由**: 纯前端环境无法写入文件系统，动态注入是最佳解决方案

### 17. 样式作用域限制
- **决策**: 使用CSS作用域选择器限制生成样式的应用范围
- **理由**: 确保生成的原型样式只作用于备忘录预览界面，不影响页面整体样式（导航栏、卡片列表等）
- **实现**: 使用`.preview-content[data-style-id]`选择器，所有样式规则都添加作用域前缀

### 18. 功能点差异化生成
- **决策**: 生成器侧重于生成不同的小程序结构和功能点，而非仅样式变化
- **理由**: 提供真正差异化的原型设计，每个原型在功能结构上都有独特性
- **实现**: 
  - 分析现有原型的结构和功能点
  - 生成不同的布局结构（单栏/双栏/三栏、导航位置等）
  - 生成不同的功能模块（搜索、标签、优先级、时间管理等）
  - 生成不同的交互方式（侧滑、拖拽、批量操作等）
  - 生成不同的数据展示方式（列表/卡片/网格/时间轴/日历/看板等）

### 16. 自然语言解析
- **决策**: 使用关键词匹配和规则解析，而非复杂的NLP库
- **理由**: 轻量级实现，无需外部依赖，满足基本需求

## 核心功能模块

### 样式展示模块
- **位置**: index.html中的`.style-showcase`部分
- **组成**: 
  - 样式卡片列表（`.style-cards`）
  - 预览区域（`.preview-section`）
- **交互**: 点击卡片或按钮切换样式，实时更新预览

### 预览模块
- **位置**: index.html中的`.preview-section`部分
- **组成**:
  - 预览控制按钮（`.preview-controls`）- 桌面/移动切换
  - 预览容器（`.preview-container`）
  - 模拟备忘录界面（`.memo-preview`）
- **功能**:
  - 实时预览选中的样式方案
  - 支持桌面端和移动端两种预览模式
  - 展示完整的备忘录界面（搜索、分类、列表）
  - 自动适配深色/浅色主题
- **交互**: 点击预览模式按钮切换桌面/移动预览

### 导航模块
- **位置**: 
  - 顶部导航栏：固定在页面顶部（`.top-navbar`）
  - 分类筛选：样式展示区域上方（`.category-filter-section`）
  - 返回顶部按钮：固定在页面右下角（`.scroll-to-top`）
- **组成**:
  - 顶部导航栏（品牌标识 + 导航链接）
  - 分类筛选器（动态生成的分类按钮）
  - 返回顶部按钮（滚动时显示）
- **功能**:
  - 网站导航：快速跳转到不同区域
  - 样式分类筛选：按分类过滤样式卡片
  - 返回顶部：平滑滚动到页面顶部
  - 空状态提示：筛选结果为空时显示提示
- **交互**: 
  - 点击导航链接跳转到对应区域
  - 点击分类按钮筛选样式
  - 滚动超过300px时显示返回顶部按钮

### 原型生成器模块
- **位置**: 样式展示区域顶部（`.prototype-generator-section`）
- **组成**:
  - 描述输入框（`.description-input`）
  - 偏好设置选择器（`.preference-select`）
  - 生成按钮（`.generate-btn`）
  - 结果展示区域（`.generator-result`）
- **核心功能**:
  - **生成不同的小程序结构和功能点**，侧重于功能点的差异化
  - 自然语言描述解析：提取结构、功能、交互方式等关键词
  - 结构布局生成：生成不同的界面结构（单栏/双栏/三栏、导航位置等）
  - 功能模块生成：生成不同的功能模块（搜索筛选、标签系统、优先级管理、时间视图等）
  - 交互方式生成：生成不同的交互模式（侧滑操作、拖拽排序、批量操作等）
  - 数据展示生成：生成不同的数据展示方式（列表/卡片/网格/时间轴/日历/看板等）
  - 功能点差异化：确保新原型与现有原型在功能结构上保持差异
  - 原型预览：实时预览生成的原型
  - 原型保存：保存生成的原型到样式列表
  - 功能点差异化分析：显示生成原型与现有原型在功能结构上的差异度
- **生成内容**:
  - **HTML结构**：根据描述生成不同的界面结构（导航位置、布局方式、功能模块等）
  - **功能模块**：根据描述添加不同的功能点（搜索、筛选、标签、优先级、时间管理等）
  - **交互方式**：根据描述实现不同的交互模式（侧滑、拖拽、批量操作等）
  - **CSS样式**：生成对应的样式代码，确保界面美观且符合描述
- **样式作用域**:
  - **重要**：生成的原型样式和结构**仅应用于预览区域内的备忘录小程序界面**
  - 使用CSS作用域选择器`.preview-content[data-style-id]`限制样式范围
  - 所有样式规则都添加作用域前缀，确保不影响页面其他部分
  - 通过`data-style-id`属性关联样式和预览元素
  - 使用`--preview-*`前缀的CSS变量，避免与全局变量冲突
  - 生成的HTML结构只插入到预览容器内，不影响页面其他部分
- **交互**: 
  - 输入描述并点击生成按钮
  - 可选择偏好设置（结构类型、功能模块）
  - 生成后可以预览和保存原型
  - 支持Ctrl+Enter快捷键生成

