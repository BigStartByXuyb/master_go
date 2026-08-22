# 迈为 SSD 项目组件库评估

## 结论

`D:\Test-Work-MW\MT\MTSemiCut` 当前没有发现可直接作为 MasterGo 设计组件库来源的独立 XAML/组件源码目录。该项目主要由运行时配置、业务模块 DLL/PDB 和算法/参数库组成。

因此不能把 SSD 项目目录中的所有内容直接抽成基础设计组件库。

## 已核验结构

| 路径 | 内容 | 是否适合作为基础设计组件库来源 |
|---|---|---|
| `MTSemiCut\Config` | 参数、报警、互锁、IO 配置 | 否；属于运行时/业务数据，不是视觉组件 |
| `MTSemiCut\Gui` | `MaxWell.*.dll/.pdb` 业务界面程序集 | 不能直接作为源码依据；需要反编译或对应源码 |
| `MTSemiCut\Library` | 算法、参数、数据查看器等库 | 否；主要是业务能力库 |
| `MW-Framework-Reference\refence\SDC\Style` | MW 公共 WPF 控件样式、资源和几何 | 是；应作为基础组件映射的主要源码依据 |
| `MTSLG\Config\Common\Pages` | 运行时页面 XML，含 `ControlType` | 可作为运行时实例和结构验证依据，不是视觉组件源码 |

## 适合建立的两层组件库

### 1. MW 基础组件库

从公共框架源码建立，例如：

- `Button`
- `IconButton`
- `TextBlock`
- `NumberBox`
- `ComboBox`
- `CheckBox`
- `TabControl`
- `DataGrid`
- `ProgressBar`
- `GroupBox`

每个 MasterGo 组件对应真实控件、Style、资源键和可验证的尺寸/状态规则。

### 2. SSD 业务组件库

只有当 SSD 中某种页面结构重复出现，并且能确认其运行时结构和业务边界时，才建立业务组件，例如：

- 刀片维护参数区
- 设备状态区
- 报警确认区
- 工艺参数编辑区
- 对准/校准操作区

这些属于业务复合组件，不能替代 `Button`、`NumberBox` 等基础组件，也不应直接把整页做成基础组件。

## 对 MasterGo 映射路线的影响

设计师在 MasterGo 中使用 MW 基础组件拼页面；AI 根据基础组件映射生成 MW 控件和样式。SSD 业务组件只在确认重复结构后作为上层复合组件使用，页面运行时的 `IOEnable`、`PageName`、`s:Action` 等协议字段仍放在工程映射层，不作为普通设计属性。

## 当前判断边界

仅凭 `MTSemiCut` 目录中的 DLL/PDB 和配置文件，不能判断其业务页面的完整视觉结构。若要评估某个 SSD 页面是否值得抽成业务组件，还需要对应页面截图、运行时 XML 或业务模块源码/反编译结果。
