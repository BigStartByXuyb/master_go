# MW 组件库飞书迁移目录

> 这是一份飞书知识库的迁移总目录。源文件仍保留在 Git 仓库；飞书文档用于设计师查阅、评审和日常协作。

## 一、建议的飞书目录结构

1. **MW 设计系统总览**
   - 设计到代码的四层模型
   - 组件登记、版本、验收和变更规则
2. **组件总清单**
   - MW 框架组件完整清单
   - MTSLG IOContorl 运行时 ControlType 完整清单
   - 迈为 SSD 项目组件库评估
3. **基础组件规范**
   - 按钮
   - 图标
   - 输入框与软键盘
   - 表格、树、选择与日期
   - 图表与工业专用可视化
   - 布局、导航和窗口
4. **设计师使用手册**
   - 组件选择、属性修改、状态和实例替换
   - 组合页面时的边界
   - 交付前检查
5. **工程映射与 AI 规则**
   - MasterGo/Figma 组件到 MW 框架的映射
   - Token、图标、资源和插槽规则
   - AI 转代码规则与禁止推断项
6. **版本与验证记录**
   - 组件登记模板
   - 运行时验证结果
   - MasterGo 画布和代码回归记录

## 二、当前已确认的组件类别

### 1. MW 框架组件与资源

完整类别以 `mw-framework-component-inventory.md` 为准，共登记 7 个一级类别：

- 导航、窗口与业务操作组件（13 项）
- MW 框架中以 IO 为前缀的 WPF 控件类（15 项）
- 输入框与软键盘（12 项）
- 表格、树、选择与日期（8 个条目）
- 图表与工业专用可视化（5 项）
- 原生 WPF 控件的 MW 框架样式（16 个条目）
- 附加属性、命令与框架工具（17 项）

### 2. MTSLG 运行时类别

`mtslg-runtime-controltype-inventory.md` 记录了运行时完整 31 种 `ControlType`：

- 页面、容器和布局（8 种）
- 文本、图形和状态显示（5 种）
- 操作和选择按钮（6 种）
- 输入和选择（5 种）
- 数据和业务集合（3 种）
- 相机和视觉面板（2 种）
- 工业图形和曲线（2 种）

### 3. 当前已建立的 MasterGo 基础组件

- `MW/按钮/图标按钮`
- `MW/按钮/标准操作按钮`
- `MW/图标/图标资源`

按钮族的完整事实、Style、状态、容器和代码映射，以 `button-component-catalog.md`、`component-analysis/button.md` 和 `mw-button-component-library-v2.md` 为准。

## 三、每个组件在飞书中必须记录的字段

每个组件页面统一使用以下结构：

- 组件名称与语义
- 所属类别和适用场景
- 外观结构：容器、文本、图标、插槽和层级
- 设计属性：设计师可以修改的属性
- 状态与变体：默认、悬停、按下、禁用、选中等
- 尺寸规则：默认值、可调范围、布局约束；尺寸不是代码映射的唯一标识
- 资源规则：图标、图片、字体、颜色和 Token
- MasterGo 组件/变体名称
- MW 框架控件、Style、资源键和协议字段
- MTSLG `ControlType` 或页面 XML 映射（如适用）
- IOContorl 与框架源码的关系
- AI 生成代码时必须使用和禁止推断的字段
- 验证状态、证据来源、版本和更新时间

## 四、设计到代码的固定映射原则

设计师只使用语义组件和公开属性，不填写私有 Style 名称、内部路径或协议细节。映射由组件登记表维护：

`设计组件名 → 语义组件 → MW 框架控件/Style → MTSLG 或页面代码出口`

图标资源、Token、组件名称和层级结构是稳定映射字段；实例尺寸、文本、图标替换和允许的局部偏移属于设计参数，不能被误当作组件身份。

## 五、源文档索引

| 飞书文档 | Git 源文件 |
|---|---|
| MW 框架组件完整清单 | `docs/mw-framework-component-inventory.md` |
| MTSLG 运行时 ControlType 清单 | `docs/mtslg-runtime-controltype-inventory.md` |
| MW 按钮事实清单 | `docs/button-component-catalog.md` |
| Button 源码与运行时分析 | `docs/component-analysis/button.md` |
| 按钮组件库 v2 规格 | `docs/mw-button-component-library-v2.md` |
| 组件库设计师使用手册 | `docs/mw-component-library-designer-guide.md` |
| 组件库—框架映射总表 | `docs/mw-component-library-mapping.md` |
| 设计到代码对齐规范 | `docs/mw-design-to-code-component-alignment.md` |
| SSD 项目组件库评估 | `docs/mw-ssd-component-library-assessment.md` |
| 按钮组件 JSON 登记表 | `docs/mw-button-standard-manifest.json`、`docs/mw-iconbutton-manifest.json` |
| 组件登记模板 | `docs/mw-component-library-manifest.template.json` |

## 六、迁移状态

- [x] Git 中已有源文档、JSON 登记表和组件映射记录
- [x] 已确认飞书官方 CLI：`@larksuite/cli`
- [x] 已确认飞书官方 OpenAPI MCP：`@larksuiteoapi/lark-mcp`
- [x] 本机已安装 CLI 和 MCP npm 包
- [x] 完成飞书应用授权
- [x] 创建飞书总文档及内嵌布局画布
- [x] 上传组件类别、样式规范、布局选择和代码映射说明
- [x] 回查文档结构并导出画布预览验证

飞书文档：<https://kcn9dbvfch4c.feishu.cn/docx/LzgzdMmcJoHXMBxbZTzcTtoknph>

画布内容：文档中的“页面布局总览”章节，包含顶部、左侧、中间、右侧、底部区域，以及右侧横向布局、右侧上下布局和右侧标准布局的选择说明。

## 七、版本约定

- Git 是事实源；飞书是协作发布副本。
- 每次组件或映射变更先提交 Git，再同步飞书。
- 飞书页面顶部记录 Git 提交号、组件库版本和更新时间。
- 不能只修改飞书而不回写 Git，避免 AI 和设计师读取到不一致规则。
