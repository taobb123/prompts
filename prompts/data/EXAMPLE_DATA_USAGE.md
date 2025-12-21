# 示例数据使用说明

## 概述

项目使用静态JSON文件或JavaScript对象存储样式方案数据，无需后端接口。这确保了项目的纯前端特性，可以在任何环境下运行。

## 数据存储方式

### 方式1: 静态JSON文件（推荐）

**文件位置**: `data/styles.json`

**优点**:
- 数据与代码分离，便于维护
- 易于编辑和扩展
- 支持版本控制
- 可以被其他工具读取

**使用方式**:
```javascript
// 通过fetch API加载
const response = await fetch('data/styles.json');
const styles = await response.json();
```

**示例数据格式**:
```json
[
  {
    "id": "style-1",
    "name": "简约清新",
    "description": "采用浅色系配色，简洁清爽的设计风格",
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
]
```

### 方式2: JavaScript对象（备用方案）

**位置**: `js/style-manager.js` 中的 `getDefaultStyles()` 方法

**优点**:
- 不依赖网络请求
- 在file://协议下也能工作
- 可以作为JSON文件的备用方案

**使用场景**:
- 当fetch API无法加载JSON文件时（如file://协议）
- 作为离线备用数据
- 开发测试环境

**示例代码**:
```javascript
getDefaultStyles() {
    return [
        {
            id: "style-1",
            name: "简约清新",
            description: "采用浅色系配色，简洁清爽的设计风格",
            category: "简约",
            preview: {
                colors: {
                    primary: "#4CAF50",
                    secondary: "#81C784",
                    background: "#F5F5F5",
                    text: "#333333"
                },
                layout: "列表式",
                features: ["简洁界面", "浅色主题", "流畅动画"]
            },
            cssFile: "css/styles/style-1.css"
        }
    ];
}
```

## 当前示例数据

项目目前包含以下5个样式方案示例：

1. **简约清新** (style-1)
   - 分类: 简约
   - 主色调: 绿色 (#4CAF50)
   - 布局: 列表式

2. **商务专业** (style-2)
   - 分类: 商务
   - 主色调: 蓝色 (#2196F3)
   - 布局: 卡片式

3. **可爱温馨** (style-3)
   - 分类: 可爱
   - 主色调: 橙色 (#FF9800)
   - 布局: 网格式

4. **科技未来** (style-4)
   - 分类: 科技
   - 主色调: 紫色 (#9C27B0)
   - 布局: 卡片式

5. **自然绿色** (style-5)
   - 分类: 自然
   - 主色调: 深绿色 (#2E7D32)
   - 布局: 列表式

## 数据加载流程

```
1. 尝试从 data/styles.json 加载数据
   ↓ (成功)
   使用JSON数据
   ↓ (失败，如file://协议)
2. 使用内联JavaScript对象（getDefaultStyles）
   ↓
   使用备用数据
```

## 添加新示例数据

### 方法1: 添加到JSON文件

1. 打开 `data/styles.json`
2. 在数组中添加新的样式对象
3. 确保数据符合数据结构规范（参考 `STYLE_DATA_SCHEMA.md`）
4. 创建对应的CSS文件（如 `css/styles/style-N.css`）

**示例**:
```json
{
  "id": "style-6",
  "name": "新样式名称",
  "description": "样式描述",
  "category": "分类名称",
  "preview": {
    "colors": {
      "primary": "#颜色值",
      "secondary": "#颜色值",
      "background": "#颜色值",
      "text": "#颜色值"
    },
    "layout": "布局类型",
    "features": ["特色1", "特色2"]
  },
  "cssFile": "css/styles/style-6.css"
}
```

### 方法2: 添加到JavaScript对象

1. 打开 `js/style-manager.js`
2. 在 `getDefaultStyles()` 方法的返回数组中添加新对象
3. 确保格式与JSON文件中的格式一致

## 数据验证

使用 `StyleDataModel` 类进行数据验证：

```javascript
// 验证单个样式
const validation = StyleDataModel.validate(styleData);
if (validation.valid) {
    console.log('数据有效');
} else {
    console.error('验证错误:', validation.errors);
}

// 验证数组
const result = StyleDataModel.validateAndNormalize(stylesArray);
if (result.valid) {
    console.log('所有数据有效');
} else {
    console.error('验证错误:', result.errors);
}
```

## 最佳实践

1. **优先使用JSON文件**: JSON文件更易于维护和版本控制
2. **保持数据同步**: 确保JSON文件和JavaScript对象中的数据保持一致
3. **使用数据验证**: 添加新数据时使用数据模型进行验证
4. **遵循命名规范**: 样式ID使用 `style-{数字}` 格式
5. **完整的数据结构**: 确保所有必需字段都存在
6. **创建对应CSS文件**: 每个样式方案都需要对应的CSS文件

## 数据结构参考

详细的数据结构定义请参考：
- `data/STYLE_DATA_SCHEMA.md` - 完整的数据结构文档

## 注意事项

1. **CORS限制**: 使用file://协议打开HTML时，fetch无法加载本地JSON文件，会自动使用JavaScript对象备用方案
2. **数据格式**: 确保JSON格式正确，否则会导致解析失败
3. **CSS文件路径**: cssFile路径应相对于项目根目录
4. **颜色格式**: 颜色值支持hex、rgb和颜色名称格式
5. **分类一致性**: 保持分类名称的一致性，便于筛选功能正常工作

