# MW MasterGo 组件库—框架映射总表

> 这份文档是组件库与 MW 自研 WPF 框架之间的唯一映射登记表。每新增或修改一个 MasterGo 组件，必须同步增加或更新一行，不允许只改画布不改文档。
>
> 框架全部控件类别、资源体系、源码入口和证据边界见 [MW 框架组件与资源完整清单](./mw-framework-component-inventory.md)。本表只登记已经形成 MasterGo 设计组件映射的条目，不能替代全量框架盘点。
>
> MTSLG 部署页面中真实使用的 `ControlType`、属性组合及其与当前生成映射表的差异见 [MTSLG IOContorl 运行时 ControlType 完整清单](./mtslg-runtime-controltype-inventory.md)。`IOButton` 等 WPF 控件类与 IOContorl 的 `ControlType="Button"` 不得按名称直接视为同一层。

## 0. 已确认的组件库架构决策（2026-08-22）

采用“组件库作为映射唯一来源”的方案：

1. 组件在进入 MasterGo 组件库时完成一次工程映射，不在每个页面重复建立映射。
2. 设计师只使用组件库中的语义组件和变体，不需要在页面中重命名为 WPF 控件名、Style 名或 IOContorl 名。
3. 每个组件必须拥有稳定的内部 `componentId`；显示名称可以调整，但 `componentId` 不得因改名而变化。
4. 一个设计组件可以登记多个技术目标，例如 `mw-wpf` 和 `mtslg-iocontrol`；具体输出由当前项目配置或用户明确指定的目标适配器决定。
5. 页面数据（如果需要导出 JSON）只保存组件实例、层次、变体和设计属性，例如 `componentRef`、`variant`、`properties`；不重复保存控件类、Style、资源键或协议字段映射。
6. 组件库映射表由工程人员维护并版本化；MasterGo 组件、映射 manifest 和框架源码/运行时证据必须使用可追踪版本。
7. 找不到目标适配器、组件映射或证据时，AI 必须报告未解析项并停止猜测，不能退化成未经登记的原生控件。

因此，映射表仍然存在，但它属于组件库的工程定义，不是设计师每做一个页面就重新填写的页面级配置。

## 1. 映射分层

| 层 | 面向对象 | 内容 |
|---|---|---|
| 设计层 | 设计师 | 中文组件名、使用场景、可见属性、可替换资源、允许的子控件 |
| 语义层 | AI | 组件类型、布局、状态、属性到框架属性的映射 |
| 框架层 | 工程代码 | MW 控件、Style 资源键、图标资源键、协议字段 |

设计师属性不能直接暴露私有框架实现名；AI 必须通过本表把设计语义转换为 MW 实际 API。

## 2. 已登记组件

### 2.1 图标按钮

当前正式组件入口为 `MW/按钮/图标按钮`，其机器可读映射见 [图标按钮映射草案](./mw-iconbutton-manifest.json)。旧的 `MW/按钮组件库/图标按钮/*` 条目是早期入口记录，不应继续作为新的设计师入口扩展。

| MasterGo 组件 | 设计属性 | AI 控件类型 | MW 样式键 | MW 属性映射 |
|---|---|---|---|---|
| `MW/按钮组件库/图标按钮/主图标布局`（当前可用入口） | 状态、按钮文本、图标资源、快捷标记、显示快捷标记 | `IconButton` | `MainButtonStyle` | 按钮文本→`Content`；图标资源→`Icon`；快捷标记→`TopLeftContent` |
| `右侧横向布局` | 状态、右侧文本、显示图标 | `IconButton` | `RightButtonStyle` | 右侧文本→`IconText`；图标容器→`Icon` |
| `右侧上下布局` | 状态、右侧文本、显示图标 | `IconButton` | `RightUpDownButtonStyle` | 右侧文本→`IconText`；图标容器→`Icon` |
| `底部标准布局` | 状态、按钮文本、显示图标 | `IconButton` | `BottomButtonStyle` | 按钮文本→`Content`；图标容器→`Icon` |
| `底部小布局` | 状态、按钮文本、显示图标 | `IconButton` | `BottomButtonSmallStyle` | 按钮文本→`Content`；图标容器→`Icon` |
| `灰色紧凑布局` | 状态、按钮文本、显示图标 | `IconButton` | `GrayIconButtonStyle` | 按钮文本→`Content`；图标容器→`Icon` |
| `纯图标布局` | 状态、显示快捷标记、快捷标记 | `IconButton` | `ButtonIconStyle` | 快捷标记→`TopLeftContent`；图标容器→`Icon` |

状态值统一为：`默认`、`悬停`、`按下`、`选中`、`禁用`。状态是变体属性，不是业务按钮名称。

> 当前 MCP 已创建上述 6 个中文布局入口，但它们的 `instance_swap` 目前为空；这是本轮明确保留给设计师后续手动绑定的部分。带有真实 `图标资源` 实例切换能力的主图标按钮入口仍是 `MW/按钮组件库/图标按钮/主图标布局`。旧的 `MW/IconButton` 等条目仍保留，但不应作为设计师入口继续扩展。

### 2.2 状态、切换和单选按钮

| MasterGo 组件 | 设计属性 | AI 控件类型 | MW 样式键 | MW 属性映射 |
|---|---|---|---|---|
| `MW/按钮/状态按钮` | 状态、按钮文本 | `StatusButton` | `StatusButtonBaseStyle` | 按钮文本→`Content`；`ON/OFF`→框架状态 |
| `MW/按钮/切换按钮` | 状态、按钮文本 | `IOToggleButton` | 默认 `IOToggleButton` 样式 | 按钮文本→`Content`；未选中/选中→`IsChecked`；禁用→`IsEnabled=false` |
| `MW/按钮/单选按钮` | 状态、按钮文本 | `IORadioButton` | `IORadioButtonBaseStyle` | 按钮文本→`Content`；未选中/选中→`IsChecked`；禁用→`IsEnabled=false` |

### 2.3 按钮容器

| MasterGo 组件 | 设计属性 | AI 控件类型 | MW 样式/控件映射 | 子项规则 |
|---|---|---|---|---|
| `MW/按钮/按钮组` | 方向、按钮项说明 | `ButtonGroup` | `ButtonGroupBaseStyle`；方向→`Orientation` | 只允许登记过的按钮组件作为按钮项 |
| `MW/按钮/主按钮网格` | 网格说明、按钮项 | `MainButtonGrid` | MW `MainButtonGrid` 控件 | 只允许 `IconButton` 主功能按钮作为子项 |

### 2.4 基础标准按钮（第一步草案）

| MasterGo 组件 | 稳定 componentId | 当前状态 | 目标适配器 | 证据 |
|---|---|---|---|---|
| `MW/按钮/标准操作按钮` | `mw.button.standard` | 设计师模板已确认；已创建 16 变体组件集；待人工视觉复核和团队库发布 | `mw-wpf`、`mtslg-iocontrol` | [按钮类型分析](./component-analysis/button.md)、[机器可读草案](./mw-button-standard-manifest.json) |

该组件的工程映射已先登记，MasterGo 当前文件中已创建组件集。设计师后续只使用该组件的变体和可见属性，不需要在页面中重新填写控件或 Style 映射；团队库发布前仍需进行一次人工视觉复核。

### 2.5 框架协议字段

以下字段默认属于 AI/工程映射层，不作为普通设计师属性开放：

| 设计语义 | MW 写法 | 使用规则 |
|---|---|---|
| 可用条件 | `IOEnable` | 只有需求明确包含设备联锁时生成 |
| 页面跳转 | `PageName` | 只有需求明确包含页面跳转时生成 |
| 点击动作 | `s:Action` | 只有需求明确包含工程动作时生成 |
| 文本资源 | `DynamicResource` | 工程页面使用资源键，不把业务中文硬编码进 XAML |
| 图标资源 | `StaticResource` | 设计稿中的完整图标组件映射为框架 Geometry/资源键 |

## 3. 待登记组件族

| 组件族 | MW 框架候选 | 设计稿状态 |
|---|---|---|
| 下拉框 | `SingleComboBox`、`MultiComboBox` | 待创建并登记 |
| 输入框 | 以框架索引和源码确认后的 NumberBox、IntNumberBox、文本输入控件 | 待逐项核实 |
| 表格 | `DataGrid`、`IODataGrid`、`PagableDataGrid`、`Pagination` | 待创建并登记 |
| 树形/列表 | `TreeView` 家族、列表容器 | 待逐项核实 |
| 布局 | `MainButtonGrid`、`ButtonGroup`、分组容器、页面内容容器 | 按钮容器已登记，其余待创建 |

## 4. 新增组件登记模板

每个新组件必须填写：

```text
MasterGo 组件名：
稳定 componentId：
设计师用途：
适用场景：
不适用场景：
设计师可见属性：
变体与状态：
可替换实例资源：
允许新增的子控件/插槽：
禁止修改的结构：
目标适配器：mw-wpf / mtslg-iocontrol / 其他
每个目标的控件或 ControlType：
每个目标的 Style/Resource Key：
每个目标的属性映射：
每个目标的 IOEnable/PageName/s:Action 规则：
证据来源：
映射版本：
验证方式：
```

## 5. 验证要求

每个组件完成后必须同时验证：

1. MasterGo 组件快照包含正确的组件名、变体和实例切换属性。
2. 设计师可见属性与本表一致。
3. MW 控件和资源键在 `D:/MW-Framework-Reference/refence` 中真实存在。
4. 设计稿实例能够映射到唯一的控件和样式键。
5. 对应设计师使用说明已经更新。
