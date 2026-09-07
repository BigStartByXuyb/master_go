# MW 基础 Button 类型完整分析

> 状态：源码与运行时证据已盘点，MasterGo 组件模型待确认，尚未创建或登记正式设计组件。

## 1. 分析范围

本文件只分析基础 `Button` 类型及 `Button.xaml` 中的样式家族，不包含独立的 `IconButton`、`StatusButton`、`ToggleButton` 和 `ButtonGroup` 控件；ButtonGroup 的“按钮项样式”因定义在 `Button.xaml` 中，本文件保留其源码事实，但正式组件模型将在 ButtonGroup 类型中确认。

| 证据 | 路径 |
|---|---|
| Button Style/Template | `D:\MW-Framework-Reference\refence\SDC\Style\Button.xaml` |
| Button 状态画刷 | `D:\MW-Framework-Reference\refence\SDC\Brushes\ButtonBrushes.xaml` |
| 尺寸 Token | `D:\MW-Framework-Reference\refence\SDC\Sizes.xaml` |
| 字体 Token | `D:\MW-Framework-Reference\refence\SDC\Fonts.xaml` |
| 运行时页面 | `D:\Test-Work-MW\MT\MTSLG\Config\Common\Pages\*.xml` |
| 当前 IOContorl 映射预设 | `C:\Users\xuyb\.codex\skills\mastergo-to-wpf\references\adapters\mtslg-iocontrol\mtslg-iocontrol-map.json` |

## 2. 源码总览

`Button.xaml` 共 567 行，包含 29 条真正的 `<Style>` 声明：

- 27 条具名 Style；
- 1 条 WPF `Button` 隐式 Style；
- 1 条 `controls:IOButton` 隐式 Style；
- 70 个 StaticResource/DynamicResource 引用，当前都能在 SDC 源码中找到定义。

### 2.1 基础 Style 链（内部实现，不直接暴露给设计师）

| Style | TargetType | BasedOn | 职责 |
|---|---|---|---|
| `ControlButtonBaseBaseStyle` | `ButtonBase` | `BaseStyle` | 控制按钮的字体、65×65尺寸、边框和对齐基线 |
| `ControlButtonBaseStyle` | `Button` | `ControlButtonBaseBaseStyle` | 上图标下文字模板、圆角和Disabled模板状态 |
| `ButtonBaseBaseStyle` | `ButtonBase` | `BaseStyle` | 标准按钮的字体、100×35尺寸、默认画刷和对齐基线 |
| `ButtonBaseStyle` | `Button` | `ButtonBaseBaseStyle` | 左图标右文字模板、圆角和Disabled模板状态 |
| `CrystalButtonBaseStyle` | `Button` | `ButtonBaseStyle` | 120×55、18号字体的水晶按钮基线 |
| `ButtonGroupItemBaseStyle` | `Button` | `BaseStyle` | 按钮组项模板、40高、相邻边框和状态基线 |

这些是实现层 Style，不应作为设计师在资源面板中直接选择的业务组件。

## 3. 可使用视觉形态

扣除6个内部基础 Style 后，源码提供21个具名可使用形态；再加标准 `Button`/`IOButton` 共用的隐式默认视觉，可归纳为22种视觉形态。

### 3.1 标准操作按钮家族

| 视觉形态 | Style/TargetType | 默认尺寸 | 结构与状态 |
|---|---|---:|---|
| 标准默认按钮 | WPF `Button` 隐式 Style | 100×35 | 左图标20×20 + 右文字；Hover、Pressed、Disabled |
| IO默认按钮 | `controls:IOButton` 隐式 Style | 100×35 | 与标准默认按钮的模板和状态逐行同构；控件类不同 |
| Primary | `ButtonPrimaryStyle` | 100×35 | 继承标准模板，Hover/Pressed覆盖边框和背景 |
| Secondary | `ButtonSecondaryStyle` | 100×35 | 明确设置 `PrimaryDefaultBrush` 背景 |
| 高度50按钮 | `Height50ButtonStyle` | 100×50 | 标准模板和默认状态画刷，仅高度变为50 |
| 页面按钮 | `PageButtonStyle` | 180×50 | 基于Primary，使用页面专用渐变和边框色 |

注意：源码对 `ButtonPrimaryStyle` 的注释写“无默认背景”，但它继承 `ButtonBaseStyle` 的 `DefaultButton_DefaultBackBrush`，并未显式清空背景。设计命名不能只依据注释把它解释成透明按钮。

### 3.2 控制按钮家族

| 视觉形态 | Style | 默认尺寸 | 结构与状态 |
|---|---|---:|---|
| 控制按钮 | `ControlButton` | 65×65 | 上图标18×18 + 下文字；Hover边框2、Pressed边框1 |
| 警告控制按钮 | `WarningControlButton` | 65×65 | 红色警告背景；Hover/Pressed使用Warning画刷 |

### 3.3 水晶按钮家族

| 视觉形态 | Style | 默认尺寸 | 语义颜色 |
|---|---|---:|---|
| 亮水晶 | `LightCrystalButtonStyle` | 120×55 | LightCrystal渐变 |
| 暗水晶 | `DarkCrystalButtonStyle` | 120×55 | DarkCrystal渐变 |
| 绿水晶 | `GreenCrystalButtonStyle` | 120×55 | Normal/Green状态 |
| 红水晶 | `RedCrystalButtonStyle` | 120×55 | Warning/Red状态 |

四种水晶按钮共用同一模板结构，差异主要是语义画刷和状态色。

### 3.4 方向按钮家族

| 视觉形态 | Style | 默认尺寸 | 模板 |
|---|---|---:|---|
| 上一步 | `PreviousButtonStyle` | 28×28 | 内置向左三角Path，Content固定隐藏 |
| 下一步 | `NextButtonStyle` | 28×28 | 内置向右三角Path，Content固定隐藏 |

这两个按钮的箭头 Path 直接写在模板中，不使用外部Geometry实例切换。

### 3.5 ButtonGroup项家族

| 视觉形态 | Style | 结构用途 |
|---|---|---|
| 默认中间项 | `ButtonGroupItemDefault` | 无圆角或继承基础位置规则 |
| 横向首项 | `ButtonGroupItemHorizontalFirst` | 左侧圆角 |
| 横向末项 | `ButtonGroupItemHorizontalLast` | 右侧圆角 |
| 单独项 | `ButtonGroupItemSingle` | 四角圆角 |
| 纵向首项 | `ButtonGroupItemVerticalFirst` | 上侧圆角 |
| 纵向末项 | `ButtonGroupItemVerticalLast` | 下侧圆角 |

这些位置Style由按钮组结构决定，不建议作为普通设计师手动选择的“按钮外观”。

### 3.6 特殊按钮家族

| 视觉形态 | Style | 默认尺寸 | 内容协议 |
|---|---|---:|---|
| 透明文字按钮 | `ButtonCustom` | 由布局决定 | 普通Content；Hover/Pressed背景反馈 |
| Geometry纯图标按钮 | `ButtonIcon` | 25×25 | `IconElement.Geometry/Width/Height` |
| 图片按钮 | `ButtonImage` | 30×30 | `IconElement.Source/Width/Height` |

标准/控制按钮还支持 `ButtonAttach.IconGeometory`。该属性的源码拼写就是 `Geometory`，不能擅自改成 `Geometry`；纯图标按钮则使用另一套正确拼写的 `IconElement.Geometry` 协议。

## 4. 模板结构

### 4.1 标准Button模板

```text
ButtonBaseStyle
└─ SimplePanel
   ├─ Background Border
   └─ Border
      └─ Horizontal StackPanel
         ├─ Path（ButtonAttach.IconGeometory，20×20）
         └─ ContentPresenter（左间距10）
```

- 图标为空：Path隐藏，文字左间距归零。
- Content为空：ContentPresenter隐藏。
- Disabled：按钮和文字Opacity降为0.5。
- 隐式 `Button`/`IOButton` Style追加Hover和Pressed状态画刷。

### 4.2 ControlButton模板

```text
ControlButtonBaseStyle
└─ SimplePanel
   ├─ Background Border
   └─ Border
      └─ Vertical StackPanel
         ├─ Path（ButtonAttach.IconGeometory，18×18）
         └─ ContentPresenter（上间距10）
```

- Disabled时Opacity为0.5，并切换 `ControlButton_DisabledBackBrush`。
- `ControlButton`与`WarningControlButton`在此基线上覆盖状态画刷。

## 5. Token与资源依赖

### 5.1 Button尺寸Token

| Token | 值 |
|---|---:|
| `ButtonWidth` | 100 |
| `ButtonHeight` | 35 |
| `Button_ArrowButtonWidth/Height` | 28 / 28 |
| `Button_PreviousButtonWidth/Height` | 28 / 28 |
| `Button_CrystalButtonWidth/Height` | 120 / 55 |
| `Button_ControlButtonWidth/Height` | 65 / 65 |
| `ButtonGroupHeight` | 40 |
| `Button_IconWidth/Height` | 20 / 20 |

### 5.2 Button状态画刷

`ButtonBrushes.xaml`共有44个键，其中本类型直接相关：

- `DefaultButton_*`：10个，覆盖Default/Hover/Select/Disabled背景、边框和文字。
- `ControlButton_*`：11个，覆盖Default/Hover/Select/Disabled背景、边框、文字和图标。

另外13个 `IconButton_*` 和10个 `ToggleButton_*` 属于后续独立类型，不应混入基础Button设计组件。

## 6. IOContorl运行时证据

对 `D:\Test-Work-MW\MT\MTSLG\Config\Common\Pages` 的93个正式XML页面扫描得到：

| 项目 | 结果 |
|---|---:|
| `ControlType="Button"` 节点 | 101 |
| 出现页面 | 25 |
| 非空 `Style` | 0 |
| 非空 `IOCommand` | 90 |
| 非空 `IOName` | 0 |
| 非空 `IOEnable` | 7 |
| 非空 `IOVisible` | 6 |
| 非空 `LangName` | 91 |
| 含子节点的Button | 0 |

### 6.1 运行时尺寸分布

| 宽×高 | 数量 |
|---|---:|
| 100×35 | 38 |
| 140×35 | 29 |
| 130×35 | 12 |
| 80×35 | 6 |
| 150×70 | 3 |
| 50×35 | 3 |
| 119×35 | 2 |
| 150×35 | 2 |
| 其余单例 | 70×35、120×35、140×75、180×35、300×35、440×35 |

运行时高度绝大多数为35，但宽度随业务文案和布局变化。宽度应当作为页面布局尺寸，不宜把每个宽度做成独立组件变体。

### 6.2 运行时实际语义

运行时Button主要用于增加、删除、修改、重置、排序、开始、结束、保存、连接等普通动作；90/101通过 `IOCommand` 触发工程命令。也存在 `IsShowDialog`/`DialogMessage` 确认弹窗、`IOEnable`联锁和`IOVisible`条件显示。

101个实例都没有非空Style，因此当前Pages只证明IOContorl默认Button形态被实际使用，不能证明 `ButtonPrimaryStyle`、Crystal、ControlButton等具名WPF Style已经通过IOContorl使用。

### 6.3 当前生成映射表差异

现有 `mtslg-iocontrol-map.json` 的Button预设描述 `IOName/IOStyle/PageName` 等属性，但真实页面最常见的是 `IOCommand`，且还出现 `IOEnable`、`IOVisible`。当前预设不能视为完整属性白名单，后续需要基于运行时证据修订。

## 7. 已确认结论与边界

### 已确认

- Button源码包含29条Style声明、27个具名Style和2个隐式Style。
- 标准Button与IOButton在当前XAML中共享同一个模板和状态视觉；控件代码类型不同。
- 21个具名可使用Style加一个隐式默认视觉，共22种可使用视觉形态。
- 所有70个Button.xaml资源引用当前都可解析到SDC中的真实键。
- IOContorl Pages实际使用101个默认Button，并广泛使用IOCommand。

### 未确认

- IOContorl `ControlType="Button"` 内部最终实例化WPF `Button`、`IOButton`还是其他适配器。
- 具名WPF Button Style是否全部允许通过IOContorl的`Style`属性使用。
- `IOButton`相对WPF `Button`新增的依赖属性和运行行为，因为控件C#源码缺失。
- 当前Pages中 `Style=""` 的空属性是否与缺省Style完全等价。

## 8. MasterGo建模候选（待用户确认）

### 方案A：一个巨型Button组件集

把21个具名Style全部放进一个“样式”变体。映射直接，但设计师会同时看到基础操作、控制按钮、水晶按钮、组内位置、方向按钮和图片按钮，语义混乱。

### 方案B：按模板/语义家族拆分（推荐）

建立以下设计组件集：

1. 标准操作按钮：默认、Primary、Secondary、高度50、页面按钮。
2. 控制按钮：普通、警告。
3. 水晶按钮：亮、暗、绿、红。
4. 方向按钮：上一步、下一步。
5. 按钮组项：由ButtonGroup容器控制位置，不单独暴露首/中/末Style。
6. 透明文字按钮。
7. 纯图标按钮：Geometry和Image分为明确资源类型。

所有源码Style仍被覆盖，但设计师按用途选择组件，不需要理解WPF Style键。

### 方案C：只建运行时默认Button

先只做101个运行时实例已经证明的默认按钮。最省时间，但会遗漏源码中已经存在的完整Button能力，不符合当前“完整盘点后逐类建设”的目标。

## 9. 下一步门禁

用户确认MasterGo建模方案后，才执行：

1. 定义设计师可见属性、状态、图标实例切换和尺寸规则。
2. 在MasterGo创建Button组件集。
3. 更新 `mw-component-library-mapping.md` 和设计师手册。
4. 建立WPF与IOContorl两条映射。
5. 用最小页面验证生成结果和运行效果。
