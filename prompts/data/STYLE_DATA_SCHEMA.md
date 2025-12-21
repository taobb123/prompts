# 样式方案数据结构文档

## 数据结构定义

样式方案数据采用JSON格式存储，每个样式方案包含以下字段：

### 必需字段

```javascript
{
  "id": string,           // 样式唯一标识，格式：style-{数字}
  "name": string,         // 样式名称，用于显示
  "description": string,  // 样式描述，说明样式特点和适用场景
  "category": string,     // 样式分类，如：简约、商务、可爱、科技、自然等
  "preview": {
    "colors": {
      "primary": string,   // 主色调，格式：#RRGGBB 或 rgb(r,g,b)
      "secondary": string, // 次色调，格式：#RRGGBB 或 rgb(r,g,b)
      "background": string, // 背景色，格式：#RRGGBB 或 rgb(r,g,b)
      "text": string      // 文字颜色，格式：#RRGGBB 或 rgb(r,g,b)
    },
    "layout": string,     // 布局类型，如：列表式、卡片式、网格式
    "features": string[]   // 特色功能列表，字符串数组
  },
  "cssFile": string       // CSS文件路径，相对于项目根目录
}
```

## 字段说明

### id
- **类型**: string
- **必需**: 是
- **格式**: `style-{数字}`，如 `style-1`, `style-2`
- **说明**: 样式的唯一标识符，用于在代码中引用样式

### name
- **类型**: string
- **必需**: 是
- **说明**: 样式的显示名称，会显示在样式卡片上

### description
- **类型**: string
- **必需**: 是
- **说明**: 样式的详细描述，说明设计风格和适用场景

### category
- **类型**: string
- **必需**: 是
- **说明**: 样式分类，用于分类筛选。常见分类：简约、商务、可爱、科技、自然等

### preview.colors
- **类型**: object
- **必需**: 是
- **字段**:
  - `primary`: 主色调，用于按钮、链接等主要交互元素
  - `secondary`: 次色调，用于辅助元素
  - `background`: 背景色，用于页面背景
  - `text`: 文字颜色，用于主要文本内容
- **格式**: 支持以下格式
  - Hex格式：`#RRGGBB` 或 `#RGB`
  - RGB格式：`rgb(r, g, b)` 或 `rgba(r, g, b, a)`
  - 颜色名称：`red`, `blue`, `green` 等基础颜色

### preview.layout
- **类型**: string
- **必需**: 是
- **说明**: 布局类型，描述样式的布局风格
- **常见值**: 列表式、卡片式、网格式

### preview.features
- **类型**: array of string
- **必需**: 是
- **说明**: 特色功能列表，描述样式的特色和亮点
- **示例**: `["简洁界面", "浅色主题", "流畅动画"]`

### cssFile
- **类型**: string
- **必需**: 是
- **格式**: 相对路径，如 `css/styles/style-1.css`
- **说明**: 对应的CSS文件路径，该文件应包含样式的CSS变量定义

## 数据验证

使用 `StyleDataModel` 类进行数据验证：

```javascript
// 验证单个样式方案
const validation = StyleDataModel.validate(styleData);
if (validation.valid) {
    // 数据有效
} else {
    console.error('验证错误:', validation.errors);
}

// 验证并规范化样式数组
const result = StyleDataModel.validateAndNormalize(stylesArray);
if (result.valid) {
    const validStyles = result.styles;
} else {
    console.error('验证错误:', result.errors);
}
```

## 示例数据

```json
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
}
```

## 添加新样式方案

1. 在 `data/styles.json` 中添加新的样式对象
2. 创建对应的CSS文件（如 `css/styles/style-N.css`）
3. 在CSS文件中定义CSS变量：
   ```css
   :root {
       --primary-color: #颜色值;
       --secondary-color: #颜色值;
       --background-color: #颜色值;
       --text-color: #颜色值;
   }
   ```
4. 确保数据符合数据结构规范

## 数据模型API

### StyleDataModel.validate(styleData)
验证单个样式方案数据

### StyleDataModel.validateAndNormalize(stylesArray)
验证并规范化样式数组

### StyleDataModel.createDefault(overrides)
创建默认样式方案对象

### StyleDataModel.normalize(styleData)
规范化样式数据（填充缺失字段）

### StyleDataModel.getSummary(styleData)
获取样式方案的摘要信息

### StyleDataModel.getSchema()
获取数据结构模板

### StyleDataModel.isValidColor(color)
验证颜色值格式

### StyleDataModel.equals(style1, style2)
比较两个样式方案是否相同

