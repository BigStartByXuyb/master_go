# MW 按钮组件事实清单

> 本清单只记录源码、AI 索引和真实页面能证明的内容。Style 名称本身不作为业务语义证据。

## 事实来源

- `D:/MW-Framework-Reference/refence/SDC/Style/IconButton.xaml`
- `D:/MW-Framework-Reference/refence/SDC/Style/StatusButton.xaml`
- `D:/MW-Framework-Reference/refence/SDC/Style/ButtonGroup.xaml`
- `D:/MW-Framework-Reference/refence/SDC/Style/ToggleButton.xaml`
- `D:/MW-Framework-Reference/refence/SDC/Style/IOToggleButton.xaml`
- `D:/MW-Framework-Reference/refence/ManualView.xaml`
- `D:/MW-Framework-Reference/docs/ai-index/semantic/manual-view-framework-calls.md`
- `D:/MW-Framework-Reference/docs/ai-index/files/refence_SDC_Style_IconButton.xaml.json`

## 1. `IconButton` 基础控件族

| 字段 | 结论 | 证据状态 |
|---|---|---|
| `controlType` | `controls:IconButton`，页面命名空间使用 `s:IconButton` | 已确认 |
| 固定模板内容 | 图标 Path、主文本 ContentPresenter、左上角标记区域、可选状态标记 | 已确认 |
| `Icon` | 绑定图标 Geometry；为空时模板隐藏图标 | 已确认 |
| `Content` | 主文本内容；为空时模板隐藏主文本区域 | 已确认 |
| `IconText` | `RightButtonStyle`/`RightUpDownButtonStyle` 模板使用的文本属性 | 已确认 |
| `TopLeftContent` | 左上角快捷标记或功能编号 | 已确认（页面使用 F1-F14） |
| `IconWidth` / `IconHeight` | 图标尺寸控制 | 已确认 |
| `Style` | 视觉和模板变体入口 | 已确认 |
| `IOEnable` | 设备条件表达式或 `true` | 页面使用已确认；解析语义待确认 |
| `PageName` | 页面跳转协议字符串 | 页面使用已确认；分段语义待确认 |
| `Click` | `{s:Action ActionName}` 动作标记 | 页面使用已确认；解析机制待确认 |
| 任意子控件 | 当前 `IconButton` 模板没有通用任意子控件 Slot | 阴性证据/禁止臆测 |

### 已确认的 Style 变体

| Style Key | 源码事实 | 设计库处理 | 业务用途 |
|---|---|---|---|
| `MainButtonStyle` | `IconButton`，160×150，图标上方、主文本区域下方 | `MW/IconButton` 的 Style Variant | 页面主功能含义来自 `ManualView` 主按钮区域 |
| `RightButtonStyle` | `IconButton`，右对齐，定制图标+`IconText` 模板 | `MW/IconButton` 的 Style Variant | 真实页面用于返回主页；可标记为已确认的导航示例 |
| `NormalRightButtonStyle` | `IconButton`，右对齐，继承基础模板并有右侧样式触发器 | `MW/IconButton` 的 Style Variant | 业务用途待确认 |
| `RightUpDownButtonStyle` | `IconButton`，右对齐，图标在上、`IconText` 在下 | `MW/IconButton` 的 Style Variant | 只确认布局，不确认“上下切换”业务含义 |
| `BottomButtonStyle` | `IconButton`，140×75，底部尺寸/图标尺寸设置 | `MW/IconButton` 的 Style Variant | 业务用途待确认，名称只来自 Style |
| `BottomButtonSmallStyle` | `IconButton`，80×75 | `MW/IconButton` 的 Style Variant | 业务用途待确认 |
| `GrayIconButtonStyle` | `IconButton`，右对齐、灰色/紧凑视觉设置 | `MW/IconButton` 的 Style Variant | 业务用途待确认 |
| `ButtonIconStyle` | 30×30、透明背景、只渲染图标的独立模板 | `MW/IconButton/IconOnly` 独立 Variant 或组件 | 图标按钮结构已确认 |

## 2. `StatusButton` 控件族

| 字段 | 结论 | 证据状态 |
|---|---|---|
| `controlType` | `controls:StatusButton` | 已确认 |
| 基础样式 | `StatusButtonBaseStyle` | 已确认 |
| 内容承载 | 第一层模板包含状态视觉和 `ContentPresenter` | 已确认 |
| 状态切换 | 模板对鼠标悬停、按下等状态有触发器；状态视觉受模板结构限制 | 已确认 |
| 设计组件 | 独立于 `MW/IconButton` | 已确认 |
| 业务含义 | 需要真实页面确认，不能仅按名称推断 | 待确认 |

## 3. `ButtonGroup` 容器族

| 字段 | 结论 | 证据状态 |
|---|---|---|
| `controlType` | `controls:ButtonGroup` | 已确认 |
| 子项模型 | Items 容器，不是固定数量按钮 | 源码已确认 |
| 横向布局 | `ButtonGroupHorizontalItemsPanelTemplate` | 已确认 |
| 纵向布局 | `ButtonGroupVerticalItemsPanelTemplate` | 已确认 |
| 子项样式 | `ButtonGroupItemStyleSelector` 选择子项 Style | 已确认 |
| 设计组件 | `MW/ButtonGroup` 容器；子项数量可变 | 已确认 |
| 允许子项 | 具体 Button/ToggleButton 类型需结合目标页面确认 | 待确认 |

## 4. `ToggleButton` / `IOToggleButton` 族

| 字段 | 结论 | 证据状态 |
|---|---|---|
| `ToggleButton` | 有 `IsChecked`、`HasContent`、启用/禁用状态模板触发器 | 已确认 |
| `IOToggleButton` | 自研 `controls:IOToggleButton`，有 IO 相关模板和选中状态视觉 | 已确认 |
| `ToggleIconButton` | `ToggleButton.xaml` 中存在独立自研图标切换模板 | 已确认 |
| Group Item Variants | `ToggleButtonGroupItemDefault`、First、Last、Single 等 | 已确认 |
| 设计库处理 | 与普通 `IconButton` 分开，建立 ToggleButton 组件族 | 已确认 |
| 业务用途 | 需要真实页面证据 | 待确认 |

## 5. 容器与嵌套规则

### `s:MainButtonGrid`

真实 `ManualView.xaml` 使用一个 `s:MainButtonGrid` 承载 14 个 `s:IconButton`。这证明它是框架容器，子项数量不是设计组件的固定 Variant 数量。

```text
MW/MainButtonGrid
allowedChildren: MW/IconButton
childCount: variable
layoutOwner: MW framework
arbitraryLayers: forbidden
```

### `MW/IconButton`

内部只允许框架模板已经支持的：

```text
Icon
Content / IconText
TopLeftContent
```

如果需要加入状态灯、输入框、下拉框或第二个按钮，必须建立新的组合组件或先扩展框架模板，不能把新增图层直接伪装成 `s:IconButton` 内部子控件。

## 6. MCP 映射字段

每个设计组件/Variant 需要记录：

```text
designName
controlType
styleKey
templateEvidence
supportedProps
allowedChildren
usageEvidence
evidenceStatus
engineeringMapping
```

`IOEnable`、`PageName`、`s:Action` 只进入 `engineeringMapping`，不作为设计师自由填写的视觉属性。
