# MW 按钮组件库 v2 设计规格

## 1. 设计目标

组件库必须同时服务两类使用者：

1. 设计师：只看到少量、可理解、能安全修改的设计属性。
2. MCP/AI：通过稳定的组件名、变体名、图层名和映射元数据还原 MW WPF 代码。

设计师不需要填写 `IOEnable` 表达式、`PageName` 路由字符串或 `s:Action` 动作名。这些属于页面工程绑定，由 AI 根据真实页面和框架索引读取或由工程师补充。

## 2. 已确认的 MW 框架事实

事实来源：

- `D:/MW-Framework-Reference/refence/SDC/Style/IconButton.xaml`
- `D:/MW-Framework-Reference/refence/SDC/Style/StatusButton.xaml`
- `D:/MW-Framework-Reference/refence/SDC/Style/ButtonGroup.xaml`
- `D:/MW-Framework-Reference/refence/SDC/Style/ToggleButton.xaml`
- `D:/MW-Framework-Reference/refence/SDC/Style/IOToggleButton.xaml`
- `D:/MW-Framework-Reference/refence/SDC/Style/IORadioButton.xaml`
- `D:/MW-Framework-Reference/refence/ManualView.xaml`
- `D:/MW-Framework-Reference/docs/ai-index/semantic/manual-view-framework-calls.md`

### 2.1 IconButton

真实控件为 `s:IconButton`，模板内部固定处理：

- `Icon`：图标 Geometry；
- `Content`：主文本；
- `IconText`：右侧/上下排列模板使用的文本；
- `TopLeftContent`：左上角快捷键/功能编号；
- `IconWidth`、`IconHeight`：图标尺寸；
- `IsShowStatus`、`StatusBrush`、`IsNeedRedMark`：模板已有的状态标记能力；
- `Style`：模板/布局样式入口。

当前模板没有“任意子控件 Slot”。设计师不能在 IconButton 内自由插入第二个按钮、输入框或状态灯。

### 2.2 已确认的 IconButton Style

| 设计组件 | 框架 Style | 结构事实 | 业务语义 |
|---|---|---|---|
| 主图标按钮 | `MainButtonStyle` | 160×150，图标上、文字下 | 结构已确认，具体业务由页面决定 |
| 右侧横向按钮 | `RightButtonStyle` | 图标左、`IconText` 右 | 页面返回主页示例已确认 |
| 右侧上下按钮 | `RightUpDownButtonStyle` | 图标上、`IconText` 下 | 仅结构确认，不能命名为“上下切换” |
| 底部按钮 | `BottomButtonStyle` | 140×75 | 结构确认，业务待页面确认 |
| 底部小按钮 | `BottomButtonSmallStyle` | 80×75 | 结构确认，业务待页面确认 |
| 灰色图标按钮 | `GrayIconButtonStyle` | 右对齐、紧凑、灰色视觉 | 结构确认，业务待页面确认 |
| 纯图标按钮 | `ButtonIconStyle` | 只渲染图标，30×30 级别 | 纯图标操作 |

这些是同一个 `IconButton` 控件族的布局/视觉变体，不是不同的业务动作。

### 2.3 其他控件族

以下控件必须与 IconButton 分开建库：

- `s:StatusButton`：状态显示/状态交互控件；
- `controls:ButtonGroup`：Items 容器，子项数量可变；
- `ToggleButton` / `controls:IOToggleButton`：选中/未选中切换控件；
- `controls:IORadioButton`：互斥选择控件；
- 普通 `Button`：仅在源码和页面实际使用时单独建立，不能冒充 IconButton。

## 3. MasterGo 组件库层级

```text
MW 组件库
├── 01-图标按钮
│   └── 图标按钮                  ← 一个通用 IconButton 组件集
│       ├── 布局=主图标，状态=默认/悬停/按下/选中/禁用
│       ├── 布局=右侧横向，状态=默认/悬停/按下/选中/禁用
│       ├── 布局=右侧上下，状态=默认/悬停/按下/选中/禁用
│       ├── 布局=底部标准，状态=默认/悬停/按下/选中/禁用
│       ├── 布局=底部小，状态=默认/悬停/按下/选中/禁用
│       ├── 布局=灰色紧凑，状态=默认/悬停/按下/选中/禁用
│       └── 布局=纯图标，状态=默认/悬停/按下/选中/禁用
├── 02-状态按钮
│   └── 状态按钮                  ← StatusButton
├── 03-切换按钮
│   ├── 切换按钮                  ← ToggleButton
│   └── IO切换按钮                ← IOToggleButton
├── 04-单选按钮
│   └── IO单选按钮                ← IORadioButton
└── 05-按钮容器
    ├── 主按钮网格                ← MainButtonGrid，允许多个 IconButton
    └── 按钮组                    ← ButtonGroup，Items 容器
```

这里的目录名可以用 Frame/Section 组织，但真正给设计师拖拽的是一个通用 `IconButton` 组件集。所有布局变体使用同一个“示例图标”作为默认图标，设计师通过「图标资源」替换成“返回”“继续运行”或业务图标。

“主操作按钮”“返回按钮”“执行批量处理文件”只放在「使用示例」Frame 中，它们是通用组件的实例覆盖结果，不是组件集变体。

## 4. 组件集与变体规则

### 4.1 一个组件集只描述一个控件族，布局用变体维度

例如 `图标按钮`：

```text
组件集：MW/01-图标按钮/图标按钮
控件类型：IconButton
变体属性：布局=主图标/右侧横向/右侧上下/底部标准/底部小/灰色紧凑/纯图标
变体属性：状态=默认/悬停/按下/选中/禁用
```

同一组件集的状态变体使用同一个图标槽位和同一个属性名。设计师拖出实例后，可以：

- 切换状态；
- 修改主文本；
- 修改快捷标记；
- 切换图标资源；
- 显示或隐藏快捷标记/状态标记。

### 4.2 不把业务动作做成变体

“继续运行”“返回”“执行批量处理文件”是图标资源或页面业务内容，不是 `Style` 变体。

组件库只提供“图标按钮”的布局和状态结构；设计师通过图标资源实例切换选择具体图标。代码生成时，AI 将图标实例映射成 `Icon="{StaticResource XxxGeometry}"`。

例如“返回按钮”是一个实例配置：

```text
图标按钮实例
布局=右侧横向
图标资源=MW/图标库/返回
右侧文本=返回
```

它不是一个叫“返回按钮”的新变体。

### 4.3 为什么现在可以放在同一个组件集

不同 Style 的模板结构不同，尤其是 `RightButtonStyle` 使用 `IconText`，而 `MainButtonStyle` 使用 `Content`。因此它们虽然属于同一个 IconButton 组件集，但必须用“布局”变体明确区分，并按布局决定可见属性：

- 属性对所有变体都出现；
- 不同模板的属性互相污染；
- 设计师不会使用不适用的文本属性；
- AI 可以从“布局”变体稳定判断 `Content` 还是 `IconText`；
- 所有变体共用一个示例图标默认值，业务图标通过实例覆盖完成。

## 5. 设计师可见属性

只暴露下表中的属性，且名称全部使用中文。

### 5.1 通用图标按钮可见属性

| 中文属性 | 类型 | 默认值 | 设计师用途 | 代码映射 |
|---|---|---|---|---|
| 布局 | Variant | 主图标 | 切换框架布局 | `Style` |
| 状态 | Variant | 默认 | 预览默认/悬停/按下/选中/禁用视觉 | 仅决定设计状态，不直接写运行时状态 |
| 图标资源 | Instance swap | 示例图标 | 替换完整图标组件 | `Icon` Geometry 资源 |
| 主文本 | Text | 操作 | 仅主图标/底部等布局使用 | `Content` |
| 右侧文本 | Text | 返回 | 仅右侧横向/上下布局使用 | `IconText` |
| 快捷标记 | Text | F1 | 修改左上角编号 | `TopLeftContent` |
| 显示快捷标记 | Boolean | 开 | 显示/隐藏左上角编号 | 关联 `TopLeftContent` 可见性语义 |
| 显示状态标记 | Boolean | 关 | 显示/隐藏框架状态标记 | `IsShowStatus` |
| 图标宽度 | AI 映射字段 | 由布局决定 | 设计师默认不可见 | `IconWidth` |
| 图标高度 | AI 映射字段 | 由布局决定 | 设计师默认不可见 | `IconHeight` |

### 5.2 布局相关属性裁剪

| 中文属性 | 类型 | 默认值 | 代码映射 |
|---|---|---|---|
当 `布局=右侧横向` 或 `布局=右侧上下` 时，设计师使用「右侧文本」，不使用「主文本」。

当 `布局=主图标`、`底部标准`、`底部小` 或 `灰色紧凑` 时，设计师使用「主文本」，不使用「右侧文本」。

当 `布局=纯图标` 时，只保留「图标资源」和「状态」，隐藏文本、快捷标记和状态标记。

不暴露“主文本”和“右侧文本”两个同时可用的字段。一个布局只暴露它真实使用的文本属性。

### 5.3 纯图标布局可见属性

只暴露：

- 状态；
- 图标资源；
- 图标宽度；
- 图标高度。

不暴露主文本、右侧文本、快捷标记，因为 `ButtonIconStyle` 的模板不承载这些内容。

## 6. AI/代码映射字段

以下字段不显示给普通设计师，不作为自由填写属性，但必须写入组件说明、命名规则或 MCP 映射元数据：

```json
{
  "mwControlType": "IconButton",
  "mwStyleKey": "MainButtonStyle",
  "contentProperty": "Content",
  "iconProperty": "Icon",
  "shortcutProperty": "TopLeftContent",
  "iconWidthProperty": "IconWidth",
  "iconHeightProperty": "IconHeight",
  "engineeringBindings": {
    "ioEnable": "from page instance or engineer mapping",
    "pageName": "from page instance or engineer mapping",
    "action": "from page instance or engineer mapping"
  },
  "evidence": {
    "control": "D:/MW-Framework-Reference/refence/SDC/Style/IconButton.xaml",
    "usage": "D:/MW-Framework-Reference/refence/ManualView.xaml"
  }
}
```

### 6.1 不让设计师填写的字段

- `IOEnable`：设备联锁表达式；
- `PageName`：页面跳转协议；
- `Click={s:Action ...}`：动作协议；
- `Style` 原始键；
- `Icon` Geometry 原始键；
- `Content`/`IconText` 的 WPF 属性名；
- 资源字典路径、程序集命名空间、ControlType 原始拼写。

这些字段由 MCP 根据组件映射和页面上下文生成，查不到时必须标记待工程师绑定，不能让设计师随意输入。

## 7. 图标资源规则

图标资源必须是独立的完整组件实例，例如：

```text
MW/图标库/继续运行
MW/图标库/返回
MW/图标库/执行批量处理文件
```

按钮中的图标位置只放一个“图标资源实例”槽位。设计师可以通过「图标资源」属性切换整个图标组件，但不能把多个路径、文字和装饰图层直接添加进 IconButton 内部。

如果某个图标需要很多图层，这些图层应该封装在 `MW/图标库/...` 组件内部；AI 最终读取该组件的真实 SVG/Geometry，而不是把它当成普通图片。

## 8. 容器组件规则

### 8.1 主按钮网格

```text
MW/05-按钮容器/主按钮网格
控件：s:MainButtonGrid
允许子组件：MW/01-图标按钮/*
数量：可变
布局拥有者：MW 框架
禁止：任意普通 Frame、Text、图片替代按钮
```

真实页面 `ManualView.xaml` 用它承载多个 `s:IconButton`。因此设计师可以在“按钮内容区域”中增加/删除合法的图标按钮实例，但不能在 IconButton 内部随意增加子控件。

### 8.2 ButtonGroup

```text
MW/05-按钮容器/按钮组
控件：controls:ButtonGroup
子项：Items，可变
布局：横向或纵向由框架样式负责
子项样式：ButtonGroupItemStyleSelector
```

它不能和 `MainButtonGrid` 混为同一个组件。二者都是容器，但布局协议和子项样式机制不同。

## 9. 设计师使用规则

1. 从组件库拖出具体布局组件，不进入父级源组件修改。
2. 需要换图标：在右侧属性面板修改「图标资源」。
3. 需要改文字：修改当前布局支持的「主文本」或「右侧文本」。
4. 需要改状态：修改「状态」。
5. 需要加第二个按钮：把按钮放入「主按钮网格」或「按钮组」，不能放入 IconButton 内部。
6. 需要完全不同的布局：新建组合组件或先扩展框架模板，不通过复制图层伪装成 IconButton。
7. 不填写跳转、动作、联锁和资源键；这些由页面工程绑定处理。

## 10. 当前重建范围

第一阶段只重建以下真实、可验证组件：

1. `MW/01-图标按钮/图标按钮`（布局 × 状态组件集）
2. `MW/01-图标按钮/使用示例`（返回、继续运行、执行批量处理文件等实例）
3. `MW/05-按钮容器/主按钮网格`
4. `MW/05-按钮容器/按钮组`

`StatusButton`、`ToggleButton/IOToggleButton`、`IORadioButton` 作为独立控件族建立，不塞入 IconButton 集合。

## 11. 验收标准

- 每个设计师可见属性都能在当前模板或组件实例中找到真实对应；
- 同一组件集的状态变体不会因图标替换而互相污染；
- 不同布局不会出现不适用的属性；
- 设计师无需进入图层树寻找图标容器；
- AI 可以从组件名、变体名和映射字段稳定得到 `ControlType`、`Style`、`Icon`、文本属性；
- `IOEnable`、`PageName`、`s:Action` 不出现在普通设计师属性面板；
- `MainButtonGrid` 和 `ButtonGroup` 的可变子项契约明确；
- 每个未确认的业务语义标记为“待确认”，不从 Style 名称臆测。

## 12. 当前 MasterGo Vibe MCP 能力边界

本轮已通过 MCP 实测创建 `MW/按钮组件库/图标按钮/主图标布局`，并刷新本地组件快照验证：

- `data-variant-*` 可以生成组件状态变体；
- `data-prop` 中的 TEXT/BOOLEAN 可以生成组件属性；
- HTML 中声明的 `instance_swap` 不会自动生成真实的 MasterGo 实例切换属性；
- 没有真实嵌套组件实例时，快照中的 `instance_swap` 仍为空。

因此“图标资源”不能用普通占位图层或自定义字段伪造。最终绑定必须满足：

```text
图标按钮变体
└── 图标资源实例（真实的 MW/图标库/... 实例）
    └── 父级实例切换属性：图标资源
```

MCP 可以负责创建组件集、变体、文本/显示属性和刷新验证；真实嵌套图标实例的绑定需要 MasterGo 原生实例切换操作，或者 Vibe MCP 后续提供专门的组件属性绑定接口。
