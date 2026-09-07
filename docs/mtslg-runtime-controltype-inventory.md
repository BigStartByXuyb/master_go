# MTSLG IOContorl 运行时 ControlType 完整清单

> 本文档记录 MTSLG 部署目录中真实页面 XML 已经使用的 `ControlType` 和属性组合。它是 `MasterGo → IOContorl` 适配的运行时证据，不替代 MW WPF 框架源码清单。

## 1. 基线信息

| 项目 | 当前值 |
|---|---|
| 核验日期 | 2026-08-22 |
| 页面目录 | `D:\Test-Work-MW\MT\MTSLG\Config\Common\Pages` |
| 正式 `.xml` 页面数 | 93 |
| 可解析页面数 | 93 |
| 解析失败页面数 | 0 |
| 带 `ControlType` 的节点数 | 2281 |
| 无 `ControlType` 的 `IOContorl` 节点数 | 82 |
| 实际出现的 `ControlType` 数 | 31 |
| 页面 XML 总大小 | 835734 bytes |

统计只包含文件名以 `.xml` 结尾的正式页面，不包含 `.bak-*`、`.orig.bak` 等备份文件。

## 2. 与 MW WPF 框架源码的关系

```text
MasterGo 设计组件
    ↓
IOContorl ControlType + XML 属性
    ↓ MTSLG 封装/解析层（当前缺少完整 C# 源码）
MW WPF 控件 + Style + Geometry + Resource
```

- `ControlType="Button"` 不等同于源码中的 `IOButton` 名称。
- `ControlType="TextBox"` 是否封装 `TextBox`、`IOTextBox` 或其他适配器，需要封装源码或运行验证确认。
- `Style`、`Icon` 可以与 SDC 资源键发生关联，但仍需逐键验证。
- 当前页面只能证明“实际使用过”，不能证明某个 `ControlType` 的全部允许属性。

## 3. 全部31种运行时 ControlType

### 3.1 页面、容器和布局（8种）

| ControlType | 节点数 | 使用页面数 | 已观察到的业务属性 |
|---|---:|---:|---|
| `Page` | 12 | 12 | `DataType`、`IOEnable`、`IOName`、`IsWriteIO`、`MaxValue`、`MinValue`、`Value` |
| `View` | 1 | 1 | `LangName`、`Value` |
| `Border` | 26 | 10 | `IOEnable`、`IOName`、`IOVisible`、`IsAutoRefresh`、`Value` |
| `GroupBox` | 84 | 41 | `Header`、`IOEnable`、`IOName`、`IOVisible`、`IsAutoRefresh`、`LangName`、`Style` 等 |
| `ButtonGroup` | 2 | 2 | `IOName`、`Value` |
| `TabControl` | 2 | 2 | `IOCommand`、`IOEnable`、`IOName`、`IsAutoRefresh`、`LangName`、`Value` |
| `TabItem` | 16 | 2 | `IOName`、`IOVisible`、`LangName`、`Value` |
| `ScrollViewer` | 1 | 1 | `IOName` |

### 3.2 文本、图形和状态显示（5种）

| ControlType | 节点数 | 使用页面数 | 已观察到的业务属性 |
|---|---:|---:|---|
| `TextBlock` | 951 | 64 | `Text`、`Value`、`LangName`、`Style`、`FontSize`、`Foreground`、`IOName`、`IOState`、`IOVisible` 等 |
| `Icon` | 6 | 1 | `Value` |
| `Rectangle` | 3 | 3 | `Background`、`IOEnable`、`Value` |
| `StatusLight` | 1 | 1 | `IOName`、`LangName`、`Value` |
| `ProgressBar` | 1 | 1 | `IOName`、`IsAutoRefresh`、`MinValue`、`MaxValue`、`Value` |

### 3.3 操作和选择按钮（6种）

| ControlType | 节点数 | 使用页面数 | 已观察到的业务属性 |
|---|---:|---:|---|
| `Button` | 101 | 25 | `IOCommand`、`IOEnable`、`IOName`、`IOVisible`、`LangName`、`Style`、`Value`、对话框属性等 |
| `IconButton` | 365 | 92 | `Icon`、`IconWidth`、`IconHeight`、`TopLeftContent`、`PageName`、`Style`、`IOCommand`、`IOEnable`、`IOName`、`IOStyle`、`LangName`、`Value` 等 |
| `ToggleButton` | 45 | 6 | `IOName`、`IOVisible`、`Style`、`TagName`、`MinValue`、`MaxValue`、`Value` |
| `ToggleIconButton` | 9 | 1 | `Icon`、`IconWidth`、`IconHeight`、`Style`、`IOCommand`、`IOEnable`、`IOName`、`IOStyle`、`LangName`、`Value` |
| `RadioButton` | 9 | 2 | `Icon`、`TopLeftContent`、`Style`、`IOCommand`、`IOVisible`、`LangName`、`Value` |
| `CheckBox` | 22 | 5 | `IOName`、`LangName`、`TagName`、`Value` |

### 3.4 输入和选择（5种）

| ControlType | 节点数 | 使用页面数 | 已观察到的业务属性 |
|---|---:|---:|---|
| `TextBox` | 36 | 14 | `IOEnable`、`IOName`、`IOVisible`、`IsReadOnly`、`MaxLength`、`TagName`、`Value` 等 |
| `NumberBox` | 344 | 42 | `DecimalPlaces`、`DefaultValue`、`IOEnable`、`IOName`、`IOVisible`、`MinValue`、`MaxValue`、`TagName`、`Value` 等 |
| `IntNumberBox` | 75 | 31 | `DefaultValue`、`IOEnable`、`IOName`、`IOVisible`、`MinValue`、`MaxValue`、`TagName`、`Value` 等 |
| `ComboBox` | 57 | 24 | `ItemsSource`、`DisplayMemberPath`、`SelectedValuePath`、`DefaultValue`、`IOCommand`、`IOName`、`IOVisible`、`LangName`、`Value` 等 |
| `DatePicker` | 1 | 1 | `IOName`、`IsAutoRefresh`、`MinValue`、`MaxValue`、`TagName`、`Value` |

### 3.5 数据和业务集合（3种）

| ControlType | 节点数 | 使用页面数 | 已观察到的业务属性 |
|---|---:|---:|---|
| `DataGrid` | 83 | 33 | `Value`、`IOCommand`、`IOEnable`、`IOName`、`IsAutoRefresh`、`IsAutoWrite`、`Style` 等 |
| `RecipeList` | 1 | 1 | `IOName` |
| `PowerControl` | 4 | 4 | `IOName`、`IOStart`、`IsAutoRefresh`、`Value` |

### 3.6 相机和视觉面板（2种）

| ControlType | 节点数 | 使用页面数 | 已观察到的业务属性 |
|---|---:|---:|---|
| `Camera` | 1 | 1 | `IOName`、`Value` |
| `DesignPanelEx` | 20 | 20 | `CameraID`、`DesignPanelID`、`IsBaseLineHeight`、`IsCenterRec`、`IsCrossingLineVertical`、`IOEnable`、`IOName`、`LangName`、`Value` 等 |

### 3.7 工业图形和曲线（2种）

| ControlType | 节点数 | 使用页面数 | 已观察到的业务属性 |
|---|---:|---:|---|
| `WaferMappingCoat` | 1 | 1 | `IOCircleRadius`、`IOIsReload`、`IOName`、`IOValue`、`IOWaferDiameter` |
| `XYLineChart` | 1 | 1 | `IOName` |

## 4. 与现有27种映射表的差异

现有 `mtslg-iocontrol-map.json` 登记27种 ControlType；运行时页面实际出现31种。

### 4.1 运行时已使用、映射表尚未登记（11种）

- `DatePicker`
- `DesignPanelEx`
- `Icon`
- `Page`
- `RecipeList`
- `Rectangle`
- `ScrollViewer`
- `StatusLight`
- `ToggleIconButton`
- `WaferMappingCoat`
- `XYLineChart`

这些类型后续不能因为映射表缺失而降级成普通图层；应先补充其源码/运行时映射证据。

### 4.2 映射表已登记、当前93个页面未使用（7种）

- `AutoCutCamera`
- `EMTCamera`
- `HighAngleCamera`
- `Image`
- `LowAngleCamera`
- `RangeProgressBar`
- `StatusButton`

“未在当前页面出现”不等于控件不存在，只表示这批运行时样例没有提供使用证据。

### 4.3 大小写不一致（1种）

- 运行时页面：`ToggleButton`
- 当前映射表：`Togglebutton`

在确认解析器是否大小写敏感前，生成代码应优先复用运行时页面已经出现的精确拼写 `ToggleButton`，并把映射表拼写作为待修正项处理。

## 5. 证据等级与使用规则

| 证据 | 能证明什么 | 不能证明什么 |
|---|---|---|
| MW SDC Style 源码 | 底层控件 TargetType、模板、Style、资源键 | IOContorl 是否开放该控件 |
| 运行时 Pages XML | `ControlType` 实际出现、真实属性组合和嵌套先例 | C# 实现、所有允许属性 |
| `mtslg-iocontrol-map.json` | 当前生成器预设白名单和语义映射 | 运行时一定支持、清单一定完整 |
| 运行中的 MaxWell.Client | 页面是否加载、属性是否生效、视觉和交互结果 | 未测试控件的完整能力 |

后续逐类建立 MasterGo 组件时，先以 MW 框架源码确定组件语义和视觉，再为 WPF/XAML 与 IOContorl 分别建立适配。只有运行时页面出现过的属性可以直接标记为“存在使用先例”；其他属性必须继续查源码、文档或运行验证。
