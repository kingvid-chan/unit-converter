# 单位换算器 当前架构

## 系统目标与边界

纯前端单页应用（SPA），提供长度、重量、温度三类单位的实时双向换算。无后端、无路由、无持久化存储，所有计算在浏览器端完成。

## 技术栈与选择理由

| 技术 | 版本 | 选择理由 |
|------|------|----------|
| React | 18.x | 函数组件 + Hooks 模式适合实时输入联动场景，生态成熟 |
| Vite | 5.x | 极速开发服务器，内置 base 路径和资源哈希支持 |
| TypeScript | 5.x | 类型安全，编译期捕获单位混淆错误 |
| Tailwind CSS | 3.x | utility-first 响应式设计，生产构建 tree-shake 极小 |
| Vitest | 1.x | 与 Vite 共享配置，零额外配置运行单元测试 |

## 模块职责与依赖

```
src/
├── main.tsx              # ReactDOM 入口
├── App.tsx               # 根组件，组合 Header/CategoryTabs/ConverterPanel/Footer
├── index.css             # Tailwind 指令 + 全局字体
├── vite-env.d.ts         # Vite 类型声明
├── components/
│   ├── Header.tsx        # 标题 "单位换算器" + 描述
│   ├── CategoryTabs.tsx  # 三个标签页：长度/重量/温度
│   ├── ConverterPanel.tsx # 根据当前类别渲染单位输入行网格
│   ├── UnitRow.tsx       # 单个单位输入行：符号 + 输入框 + 标签 + 错误提示
│   └── Footer.tsx        # 版本信息
├── hooks/
│   └── useConverter.ts   # 核心状态管理：类别切换、数值解析、单位换算、开尔文校验
└── utils/
    ├── conversions.ts    # 换算函数：convertLength / convertWeight / convertTemperature
    └── conversions.test.ts # 30 个单元测试
```

## 数据流、状态流与外部接口

### 状态管理

使用 React `useState` + `useCallback`，封装在 `useConverter` hook 中：

- **category**: 当前选中的换算类别 (`'length' | 'weight' | 'temperature'`)
- **values**: `Record<string, string>` — 每个单位当前的显示值
- **errors**: `Record<string, string | null>` — 每个单位的错误信息（目前仅开尔文 < 0 时设置）

### 实时换算流程

```
用户在单位X输入框键入数值
  → onChange 捕获原始字符串
  → parseFloat 解析
  → 若空：清空全部 values
  → 若非数字：忽略（保持上次有效值）
  → 若有效数字：
    1. convertToBase(value, from=X) → baseValue（基准单位值）
       - 长度基准：米 (m)
       - 重量基准：千克 (kg)
       - 温度基准：摄氏度 (°C)
    2. 对每个单位 Y: convertFromBase(baseValue, to=Y) → result
    3. 格式化 result（6位精度，去末尾零）
    4. 若 Y 为开尔文且 result < 0：设置 errors[K]
    5. 更新 values 和 errors
  → React 重新渲染，所有 UnitRow 显示新值
```

### 换算公式

**长度**（线性，通过米）：
- 1 m = 100 cm = 0.001 km = 3.28084 ft = 39.3701 in = 0.000621371 mi

**重量**（线性，通过千克）：
- 1 kg = 1000 g = 2.20462 lb = 35.274 oz
- 精确系数：1 lb = 0.45359237 kg, 1 oz = 0.028349523125 kg

**温度**（非线性，通过摄氏度）：
- °F = °C × 9/5 + 32
- K = °C + 273.15

## 测试策略

- **单元测试**: Vitest 运行 `src/utils/conversions.test.ts`，30 个测试覆盖所有换算类型、精度、边界值（0、负数、双向一致性、绝对零度）
- **构建验证**: `test/self-test.sh` 检查构建产物路径前缀、版本令牌、Cache-Control 响应头
- **视觉验收**: Hermes 浏览器公网验收 + Kimi 视觉审查

## 部署拓扑

- **构建**: `npm run build` → `dist/`
- **部署路径**: `/projects/unit-converter/`（Vite `base` 配置）
- **服务器**: 阿里云 Nginx，配置示例：
  ```nginx
  location /projects/unit-converter/ {
      alias /path/to/dist/;
      add_header Cache-Control "no-cache";
      try_files $uri $uri/ /projects/unit-converter/index.html;
  }
  ```
- **版本令牌**: 所有静态资源 URL 带 `?v=0.0.1` 查询参数
- **缓存策略**: HTML 文档 `Cache-Control: no-cache`，静态资源使用内容哈希文件名

## 安全边界

- 纯前端项目，无用户数据收集，无后端 API
- 输入校验：parseFloat + isNaN 防止注入
- 无第三方运行时依赖（仅 React + ReactDOM）

## 已知技术债

- 暂无

## 关联 ADR 与最近变更

- 迭代 0.0.1：初始完整交付，实现全部三类单位换算
- 后续迭代可能扩展：更多单位类别（面积、体积、速度等）、历史记录、收藏单位组合
