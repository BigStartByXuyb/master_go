# MW 框架组件与资源完整清单

> 本文档是建立 MasterGo 组件库、设计语义映射、WPF/XAML 生成适配和 IOContorl 生成适配的共同基线。后续分析任何组件类型前，先以本文档确定分类和源码入口，再回到原始 XAML 复核；不得只凭名称或索引摘要生成组件。

## 1. 基线信息

| 项目 | 当前值 |
|---|---|
| 核验日期 | 2026-08-22 |
| 框架配置 | `D:\Test-Work-MW\framework.config.json` |
| 框架名称 | MW 自研 WPF 框架 |
| 参考版本 | `local-reference` |
| 框架参考源码 | `D:\MW-Framework-Reference\refence` |
| AI 索引 | `D:\MW-Framework-Reference\docs\ai-index` |
| 框架手册控件索引 | `C:\Users\xuyb\.codex\skills\mastergo-to-wpf\references\adapters\mw-wpf\framework-manual\02-controls\README.md` |
| 真实页面示例 | `D:\MW-Framework-Reference\refence\ManualView.xaml` |
| MTSLG 运行时页面参考 | `D:\Test-Work-MW\MT\MTSLG\Config\Common\Pages` |
| MTSLG ControlType 清单 | `D:\Test-Work-MW\MasterGo_WPF_Codex\docs\mtslg-runtime-controltype-inventory.md` |

当前参考目录只有 96 个 `.xaml` 文件，没有控件 `.cs` 实现源码。因此，本文可以确认控件名称、模板、Style、资源键和可观察调用形式，但不能仅凭当前参考库确认依赖属性的完整类型、默认值或内部运行机制。

## 2. 框架分层与生成出口

```text
MasterGo 设计组件
    ↓ 设计语义映射
MW 框架语义组件
    ├─ WPF/XAML 适配：直接使用 MaxwellControl 控件、Style 和资源
    └─ IOContorl 适配：转换为 ControlType 和 IOContorl 属性
```

MasterGo 组件库以 MW 框架源码能力为主模型。IOContorl 是后续代码生成出口之一，不是设计组件的唯一建模依据。

这里必须区分两个名称相近但层级不同的概念：

- `IOButton`、`IOTextBox`、`IODataGrid` 等是 `MaxwellControl.Controls` 中以 `IO` 为前缀的 WPF 控件类或 Style TargetType。
- `<IOContorl ControlType="Button" ...>` 是 MTSLG 运行时页面描述格式；其 `ControlType` 清单必须从真实 Pages XML 另行统计。

二者可能存在封装关系，但不能仅根据名称假定一一对应。完整运行时统计见 [MTSLG IOContorl 运行时 ControlType 清单](./mtslg-runtime-controltype-inventory.md)。

## 3. 核验统计

| 项目 | 数量 | 核验来源 |
|---|---:|---|
| `SDC/Style` 样式文件 | 72 | `D:\MW-Framework-Reference\refence\SDC\Style\*.xaml` |
| Style 声明 | 417 | 原始 XAML 的 `<Style>` 统计 |
| 具名 Style | 269 | 含 `x:Key` 的 Style |
| 隐式 Style | 148 | 不含 `x:Key` 的 Style |
| 语义颜色键 | 37 | `SDC\Colors.xaml` |
| 通用画刷键 | 83 | `SDC\Brushes.xaml` |
| 字体/配置 Token | 6 | `SDC\Fonts.xaml` |
| 尺寸 Token | 92 | `SDC\Sizes.xaml` |
| Geometry 键 | 588 | `SDC\Geometries.xaml` |
| 补充 IconGeometry 键 | 238 | `SDC\IconGeometry.xaml` |
| 控件状态画刷文件 | 12 | `SDC\Brushes\*.xaml` |
| 控件/能力条目文档 | 86 | 框架手册 `02-controls`，不含 README |

根目录 `refence\Geometries.xaml` 与 `refence\SDC\Geometries.xaml` 的 SHA-256 均为 `E4C0CFDD81B2F68ADBCF6FA564D8082CDB393134B1D6E584BC7FCA65437D5099`，属于同一份资源副本，不能重复计算。

框架手册声明覆盖 87 个控件，但当前为 86 份条目文件。原因是部分条目覆盖多个控件类，同时基础 `Button` 家族没有独立条目文件而登记在 `Button.xaml` 中。后续不得用“条目文件数”代替“控件类数量”。

## 4. 全部一级类别与成员

当前框架手册完整分为 7 个一级类别。前 6 类属于可视控件候选，第 7 类属于工程辅助能力。

### 4.1 导航、窗口与业务操作组件（13项）

| # | 条目 | 包含的控件/家族 |
|---:|---|---|
| 1 | 图标业务按钮 | `IconButton` |
| 2 | 状态按钮 | `StatusButton` |
| 3 | 按钮组 | `ButtonGroup` |
| 4 | 图标控件 | `IconControl` |
| 5 | 侧边菜单 | `SideMenu`、`SideMenuItem` |
| 6 | 步骤组件 | `StepFrame`、`StepFrameItem`、`StepPolygon` |
| 7 | 框架主窗口 | `CommonWindow` |
| 8 | 圆角阴影窗口 | `CornerRadiusWindow` |
| 9 | 消息框 | `MessageBox` |
| 10 | 菜单家族 | `Menu`、`MenuItem`、`NarrowMenuItem`、`ContextMenu` |
| 11 | 工具栏 | `ToolBar`、`ToolBarTray` |
| 12 | 标签 | `Label`，源码文件名为 `Lable.xaml` |
| 13 | 折叠面板 | `Expander` |

### 4.2 MW 框架中以 IO 为前缀的 WPF 控件类（15项）

本节列的是 SDC Style 源码中实际出现的控件代码名称，不是 IOContorl XML 的 `ControlType` 清单，也不是“业务条目”。这些控件表示 MW WPF 框架提供的 IO 数据/状态绑定型控件能力；是否被 IOContorl 暴露、暴露成什么 `ControlType`，必须以运行时页面和封装证据为准。

| # | 控件 |
|---:|---|
| 1 | `IOButton` |
| 2 | `IOCheckBox` |
| 3 | `IORadioButton` |
| 4 | `IOToggleButton` |
| 5 | `IOComboBox` |
| 6 | `IODataGrid` |
| 7 | `IOImage` |
| 8 | `IOStatusLight` |
| 9 | `IOTabControl` |
| 10 | `IOTextBlock` |
| 11 | `IOTextBox` |
| 12 | `IOGroupBox` |
| 13 | `IOListBox` |
| 14 | `IOProgressBar` |
| 15 | `IORangeProgressBar` |

### 4.3 输入框与软键盘（12项）

| # | 控件 |
|---:|---|
| 1 | `NumberBox` |
| 2 | `IntNumberBox` |
| 3 | `StringNumberBox` |
| 4 | `PasswordBox` |
| 5 | `SwitchPasswordBox` |
| 6 | `SwitchBox` |
| 7 | `SearchBox` |
| 8 | `NumericKeypad` |
| 9 | `StringNumericKeypad` |
| 10 | `SwitchKeypad` |
| 11 | `BigNumericKeypad` |
| 12 | `BigStringKeypad` |

### 4.4 表格、树、选择与日期（8个条目）

| # | 条目 | 包含的控件/家族 |
|---:|---|---|
| 1 | 框架表格 | `DataGrid` |
| 2 | 分页/冻结行表格 | `PagableDataGrid`、`RowFreezableDataGrid` |
| 3 | 分页条 | `Pagination` |
| 4 | 树形视图 | `TreeView`、`TreeViewEx` 及 TreeViewItem 样式族 |
| 5 | 多选/单值下拉 | `MultiComboBox`、`SingleComboBox` |
| 6 | 日历 | `Calendar`、`CalendarExtend` |
| 7 | 日期时间选择 | `DateTimePicker`、`DateTimeSelector` |
| 8 | 扩展日期选择 | `DatePickerExtend` |

### 4.5 图表与工业专用可视化（5项）

| # | 控件 |
|---:|---|
| 1 | `Dashboard` |
| 2 | `ScatterPlotControl` |
| 3 | `WaferLine` |
| 4 | `WaferMapping` |
| 5 | `WaferMappingCoat` |

### 4.6 原生 WPF 控件的 MW 框架样式（16个条目）

| # | 条目 | 包含的控件/家族 |
|---:|---|---|
| 1 | 复选框 | `CheckBox` |
| 2 | 分组框 | `GroupBox` |
| 3 | 列表框 | `ListBox`、`HeaderedListBox` |
| 4 | 加载指示 | `LoadingBase`、`LoadingLine`、`LoadingCircle` |
| 5 | 物料盒 | `MaterialBox` |
| 6 | 弹出提示 | `Poptip` |
| 7 | 进度条 | WPF `ProgressBar`、框架 `ProgressBar` |
| 8 | Progress 样式族 | `ProgressBarStyle1`、`ProgressBarStyle2` 等键式变体 |
| 9 | 单选按钮 | `RadioButton` |
| 10 | 滚动容器 | `ScrollViewer`，当前两套样式并存 |
| 11 | 简单项容器 | `SimpleItemsControl` |
| 12 | 滑块 | `Slider`、`RangeSlider` |
| 13 | 选项卡 | `TabControl`、`TabItem` |
| 14 | 文本 | `TextBlock` |
| 15 | 文本输入 | `TextBox`、`HitTextBox` |
| 16 | 切换按钮 | `ToggleButton`、`LazyToggleButton`、`ToggleIconButton` |

#### 基础 Button 家族补充

`D:\MW-Framework-Reference\refence\SDC\Style\Button.xaml` 有 27 个具名 Style，覆盖原生 `Button`、框架按钮、Crystal 按钮、前后翻页按钮、按钮组项、图标按钮、图片按钮、页面按钮及 `IOButton`。它属于可视组件范围，但当前没有独立的 `native/button.md` 条目，逐类分析按钮时必须单独纳入。

### 4.7 附加属性、命令与框架工具（17项）

| # | 能力 | 用途 |
|---:|---|---|
| 1 | `BorderElement` | 圆角等边框附加属性 |
| 2 | `IconElement` | 图标 Geometry、Source、宽高 |
| 3 | `TitleElement` | 标题、标题背景和前景 |
| 4 | `WatermarkElement` | 输入提示文字 |
| 5 | `DataGridAttach` | 表格列样式和编辑行为 |
| 6 | `TabControlAttach` | Tab 背景、头部尺寸和字号 |
| 7 | `NumericKeypadAttach` | 数字键盘启用状态 |
| 8 | `PasswordBoxAttach` | 密码监控和密码长度 |
| 9 | `TextBoxAttach` | 文本选择行为 |
| 10 | `DropDownElement` | 下拉弹层宽度 |
| 11 | `ButtonAttach` | 按钮图标附加属性，源码拼写含 `IconGeometory` |
| 12 | `CalendarItemAttach` | 日历项行为 |
| 13 | `ControlCommands` | `Prev`、`Next` 等框架命令 |
| 14 | 转换器族 | 状态、资源、可见性等转换 |
| 15 | `SimplePanel` | 框架模板基础面板 |
| 16 | `RangeTrack` | 双滑块轨道和相关附加属性 |
| 17 | `Poptip` 附加属性 | 错误提示弹层状态 |

附加属性、命令和转换器默认不创建为 MasterGo 可拖拽组件，只进入设计属性到工程属性的映射层。

## 5. 非控件资源完整分类

| # | 资源类别 | 源码入口 | 设计/生成职责 |
|---:|---|---|---|
| 1 | 语义颜色 | `SDC\Colors.xaml` | MasterGo Color Token 与 WPF Color 键映射 |
| 2 | 通用画刷/渐变 | `SDC\Brushes.xaml` | Brush 和渐变资源映射 |
| 3 | 控件状态画刷 | `SDC\Brushes\*.xaml` | 默认、Hover、Pressed、Selected、Disabled 状态视觉 |
| 4 | 字体和字号 | `SDC\Fonts.xaml` | Typography Token |
| 5 | 控件和布局尺寸 | `SDC\Sizes.xaml` | 尺寸、间距和框架外壳 Token |
| 6 | 图标 Geometry | `SDC\Geometries.xaml` | 业务图标资源映射 |
| 7 | 补充图标 Geometry | `SDC\IconGeometry.xaml` | 通用/补充图标资源映射 |
| 8 | 阴影效果 | `SDC\Effects.xaml` | Effect Token |
| 9 | 转换器资源 | `SDC\Converters.xaml` | 工程映射层使用，不向设计师开放 |
| 10 | 框架通用模板 | `SDC\FrameworkGeneric.xaml` | 默认模板、登录和通用样式 |
| 11 | 对齐资源 | `SDC\RightAlignment.xaml` | 工程布局辅助资源 |
| 12 | 控件 Style/Template | `SDC\Style\*.xaml` | 组件外观、状态和业务变体的事实源 |

## 6. 当前证据边界

### 已确认

- 72 个样式文件及其 Style/ControlTemplate。
- 资源键、模板引用关系和控件状态画刷。
- `MaxwellControl.Controls`、`MaxwellControl.Commands`、`MaxwellControl.Tools` 等命名空间在模板中的使用。
- `ManualView.xaml` 中 `MainButtonGrid` 和 15 个 `IconButton` 的真实调用。
- `Content`、`Icon`、`TopLeftContent`、`IconText`、`Style` 等可观察属性形式。

### 待补证据

- `MaxwellControl` 控件类的完整 C# 源码。
- 依赖属性的正式类型、默认值、校验和回调。
- `IOEnable`、`s:Action`、`PageName` 的完整解析和生命周期。
- 除 `ManualView` 外，各控件在真实业务页面中的使用组合。
- IOContorl `ControlType` 与 MW 底层控件之间的完整封装表。

### 新增运行时参考证据

`D:\Test-Work-MW\MT\MTSLG\Config\Common\Pages` 当前包含 93 个可解析 XML 页面、2281 个带 `ControlType` 的节点和 31 种实际出现的 `ControlType`。这批文件可证明“运行时实际使用形式”，但仍不能代替缺失的 C# 控件实现源码。

## 7. 后续逐类分析固定流程

每进入一个组件类型，必须按以下顺序更新本文档和 `mw-component-library-mapping.md`：

1. 找到全部相关 Style 文件和真实控件类名。
2. 列出全部具名 Style、隐式 Style 和 BasedOn 关系。
3. 读取完整 ControlTemplate，确认槽位、状态和模板属性。
4. 追踪 Colors、Brushes、Fonts、Sizes、Geometry 等资源。
5. 查真实页面实例，区分“模板支持”和“业务已经使用”。
6. 定义 MasterGo 组件、组件集、状态、文本、实例切换和受控插槽。
7. 建立 `MasterGo → MW WPF` 映射。
8. 建立可选的 `MasterGo → IOContorl → MW WPF` 映射。
9. 生成最小测试页面并执行对应运行验证。
10. 登记证据、验证结果、未决项和版本。

已完成的逐类分析：

- [基础 Button 类型完整分析](./component-analysis/button.md)：源码与运行时证据已盘点，MasterGo建模方案待确认。

## 8. 建议分析顺序

1. Button、IconButton、StatusButton、ToggleButton、ButtonGroup、IOButton。
2. TextBox、NumberBox、IntNumberBox、StringNumberBox、PasswordBox。
3. ComboBox、MultiComboBox、SingleComboBox、CheckBox、RadioButton。
4. GroupBox、TabControl、ListBox、Expander、ScrollViewer。
5. DataGrid、IODataGrid、PagableDataGrid、Pagination、TreeView。
6. IOStatusLight、ProgressBar、Loading、Poptip、MessageBox。
7. Calendar、DatePicker、DateTimePicker 和软键盘家族。
8. SideMenu、Menu、StepFrame、Window 等框架外壳。
9. Dashboard、ScatterPlot、WaferMapping 等工业可视化。

## 9. 维护规则

- 本文档记录完整框架目录和证据状态；`mw-component-library-mapping.md` 记录已经落地的 MasterGo 组件映射。
- 新发现控件、Style、资源键或封装关系时，先更新本文档，再更新具体组件映射。
- 不删除旧版本事实；有变更时记录新版本、来源和验证日期。
- 索引只用于导航，最终事实必须回到原始源码或真实运行页面确认。
- 查不到的属性或协议标记“待确认”，不得根据名称猜测。
