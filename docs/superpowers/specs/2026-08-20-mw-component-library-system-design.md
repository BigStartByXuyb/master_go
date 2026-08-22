# MW MasterGo 组件库与映射文档系统设计

## 目标

建立一套可以持续扩展的 MasterGo 组件库，并为每个组件同步维护 MW 框架映射文档和设计师使用手册，使设计师能按语义组装页面，AI 能按稳定映射生成 MW WPF 代码。

## 设计原则

1. 组件名称面向设计语义，框架 Style/Resource Key 保存在映射层。
2. 状态、布局、尺寸分别建模，避免把业务名称做成组件变体。
3. 完整图标、复杂资源和可变子组件使用实例切换或受控插槽。
4. 设计师属性与工程协议字段分离。
5. 组件库画布、框架映射文档、设计师手册必须同步更新。

## 组件范围

- 按钮：IconButton、StatusButton、ToggleButton、RadioButton 相关组件。
- 下拉框：SingleComboBox、MultiComboBox。
- 输入框：以框架索引和源码确认的数字、整数、文本输入控件及键盘控件。
- 表格：DataGrid、IODataGrid、PagableDataGrid、Pagination，以及明确存在的树形/列表控件。
- 布局：MainButtonGrid、ButtonGroup、分组容器、页面内容容器及其他已确认的布局控件。

## 每类组件的交付物

1. MasterGo 主组件/组件集及示例实例。
2. `docs/mw-component-library-mapping.md` 中的框架映射记录。
3. `docs/mw-component-library-designer-guide.md` 中的设计师使用说明。
4. MCP 快照验证记录：名称、属性、变体、实例切换、插槽。
5. 如存在不确定的 MW API，记录证据来源和待确认项，不得猜写。

## 验收标准

- 设计师不阅读私有框架源码也能选对组件和属性。
- AI 能从组件名称、变体、属性和图标实例识别唯一 MW 控件及样式。
- 同一个业务动作只改变实例文案、图标和工程绑定，不重复创建业务按钮组件。
- 组件结构可扩展，但任意新增子结构都有明确插槽或组件规范。
- 每次组件库变更都能在两份文档中追溯。
