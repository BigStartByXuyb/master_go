# 手动操作（2.0）MasterGo 转换设计

## 目标

将 MasterGo 文件 `181586559903927`、根图层 `357:204391` 的整个“手动操作（2.0）”页面转换到本仓库。交付的是可审计的静态 MTSLG IOContorl 页面包，不声明已被任一运行时宿主加载。

## 已确认范围

- 设计来源仅为用户提供的 MasterGo 链接；必须先获取概览，再逐个获取全部 48 个 DSL 分段。
- 页面根尺寸为 1280×1025；可见文本、节点层次、每个实例的尺寸和坐标均以 DSL 为唯一事实源。
- 页面包含“示教 / F2”按钮，但本次范围是整张“手动操作（2.0）”页面，不是单独 F2 详情页。
- 不读取、复制、合并或推断其他项目中的页面、Layout、运行时字段、资源键、绑定或样例。

## 适配器与边界

当前仓库只有目录骨架，未发现 `framework.config.json`、`.csproj`、现存页面、资源字典或宿主程序。依据转换规则选择 `Adapter: mtslg-iocontrol`，并只生成静态可追溯产物：

- `Generated/ManualOperationPage.xml`：仅由有正式组件映射且来源链完整的业务节点组成。
- `Generated/ManualOperationPageIcon.xaml`：仅收录当前页 DSL 的 PATH/SVG 生成的 Geometry 资源；资源名必须来自已确认的映射输入，不能由图层 ID 或外观拼接。
- `Generated/ManualOperationPage.mapping.json`：节点到 `sourceRef`、父链、原始文本、绝对 bbox、输出坐标与输出属性的审计清单。
- `Generated/ManualOperationPage.validation.json`：来源、Value、坐标、白名单和图标引用的校验结果。
- `Generated/ManualOperationPage.unmapped.json`：未命中正式映射或无法闭合来源链的 DSL 节点；这些节点不得伪造成 XML 控件。

因为没有真实宿主路径或 Layout 合同，本次不生成 `Layout.xml`、WPF 宿主、`IOName`、`IOCommand`、`LangName` 或猜测的 `Style`/`Icon` 键。顶部栏、底部栏和其他公共外壳会记录到审计清单，页面 XML 不重复实现它们。

## 来源与坐标规则

- 每个输出文本必须反查到一个唯一 DSL TEXT 节点，`Value` 与原始文本完全一致；不从图层名称、语义、截图或邻近组件补值。
- 每个输出节点必须保留唯一 `sourceRef`、完整 `sourceParent` 链、原始页面绝对 bbox 和自身尺寸。
- 根级/映射确认可展平节点的输出坐标为 `Left = pageAbsX - contentOriginX`、`Top = pageAbsY - 192`；`contentOriginX` 由根内容区 DSL 确认。保留父级的子节点使用自身绝对坐标减其实际父级绝对坐标。192 只在根级扣一次。
- 设计工件标题而非业务节点时必须剥离；不得因名称包含“标题”或视觉位置自行判定。
- PATH/SVG 只作为其实际业务组件的 Icon 子树生成 Geometry；不得将 Icon 容器、PATH 或 SVG 另行发射为业务控件。

## 失败处理与验收

- 必须读取全部 48 个 DSL 分段。任一分段失败、文本来源不唯一、父链缺失、映射缺失、坐标不一致或属性不在白名单内，受影响节点进入 `unmapped`，不得进入 XML。
- 生成前必须运行 provenance 校验；校验失败时不输出或覆盖最终 XML。
- 验收证据包含：全部分段获取清单、映射清单、校验 JSON、XML 结构检查、图标键闭合检查和坐标检查。
- 仅当所有生成节点通过上述静态检查时，才报告“静态转换完成”；没有宿主源码与运行时加载证据时，不报告“可运行”或“视觉已验证”。
