# MW WPF 按钮组件库实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 根据真实 MW WPF 框架源码建立完整的 MasterGo 按钮组件库，包括基础按钮、属性、状态、容器嵌套规则、使用说明和 MCP 映射验证。

**Architecture:** 以 `D:/MW-Framework-Reference/refence` 和 `docs/ai-index` 为事实源，先按真实 `ControlType`、Template 和 Style 归类，再生成 MasterGo 基础组件、Variant 和容器组件。设计稿节点递归映射到 MW WPF/XAML 或 MTSLG IOContorl；设计坐标只作为输入，不强行决定最终布局实现。

**Tech Stack:** MasterGo Vibe MCP、MasterGo 组件属性协议、MW WPF/XAML、MTSLG IOContorl、PowerShell、框架 AI 索引。

**Spec:** `docs/superpowers/specs/2026-08-19-button-component-library-design.md`

## Global Constraints

- 所有公开设计属性必须对应真实代码属性或明确的工程映射。
- 未被真实页面或框架文档确认的 Style 业务含义必须标记为“待确认”。
- `MW/IconButton` 内部只允许图标、文本和框架已支持的标记；任意新控件必须进入组合组件或框架扩展流程。
- 容器只有在定义允许子组件类型、数量和布局规则后才允许可变子控件。
- MW WPF/XAML 优先复用 Style、Template 和框架布局；MTSLG IOContorl 使用已确认的绝对坐标协议。
- 不把 `IOEnable`、`PageName`、`s:Action` 当作设计师自由填写的视觉属性。

---

### Task 1: 建立按钮框架事实清单

**Files:**
- Read: `D:/Test-Work-MW/framework.config.json`
- Read: `D:/MW-Framework-Reference/docs/ai-index/framework-index.json`
- Read: `D:/MW-Framework-Reference/refence/SDC/Style/IconButton.xaml`
- Read: `D:/MW-Framework-Reference/refence/SDC/Style/StatusButton.xaml`
- Read: `D:/MW-Framework-Reference/refence/SDC/Style/ButtonGroup.xaml`
- Read: `D:/MW-Framework-Reference/refence/ManualView.xaml`
- Create: `D:/Test-Work-MW/MasterGo_WPF_Codex/docs/button-component-catalog.md`

**Interfaces:**
- Produces a catalog containing `controlType`, `templateEvidence`, `styleKey`, `supportedProperties`, `stateEvidence`, `allowedChildren`, `usageEvidence`, and `evidenceStatus`.

- [ ] **Step 1: Enumerate button-related source files and symbols**

Run:

```powershell
rg -n -i 'IconButton|StatusButton|ButtonGroup|ToggleButton|ButtonStyle|TargetType|ControlTemplate' D:/MW-Framework-Reference/refence D:/MW-Framework-Reference/docs/ai-index
```

- [ ] **Step 2: Extract each confirmed property from templates and real page examples**

Record only properties with source evidence, including `Icon`, `Content`, `IconText`, `TopLeftContent`, `IconWidth`, `IconHeight`, `Style`, `IOEnable`, `PageName`, and `Click` where observed.

- [ ] **Step 3: Classify each item as component family, Variant, container, or internal keypad family**

Use `TargetType`, template structure, state triggers, and child contract as the classification criteria.

- [ ] **Step 4: Write the catalog and mark unsupported business meanings as pending**

The catalog must explicitly state that `RightUpDownButtonStyle` proves a right-aligned icon-above-text layout but does not prove a business action.

- [ ] **Step 5: Verify the catalog has no guessed usage claims**

Run:

```powershell
rg -n '待确认|evidenceStatus|RightUpDown|IconButton|StatusButton|ButtonGroup' D:/Test-Work-MW/MasterGo_WPF_Codex/docs/button-component-catalog.md
```

---

### Task 2: 创建基础按钮组件集和真实属性

**Files:**
- Read: `D:/Test-Work-MW/MasterGo_WPF_Codex/docs/button-component-catalog.md`
- Modify through MCP: current MasterGo local library `local-201158828675869`
- Verify through MCP: `get_component_info` and component catalog snapshot

**Interfaces:**
- Produces `MW/IconButton` with controlled Style Variants, text properties, icon instance replacement, shortcut visibility/text properties, and state Variants only where confirmed.

- [ ] **Step 1: Load MasterGo component-generation guidelines**

Call `get_guidelines` with `scope=["component-generate","page-generate"]` before any component creation call.

- [ ] **Step 2: Define the `MW/IconButton` property contract**

Use only the catalog-backed properties:

```text
Content or IconText
Icon instance swap
TopLeftContent
显示快捷标记
IconWidth
IconHeight
Style Variant
```

Keep `IOEnable`, `PageName`, and `s:Action` in code-mapping metadata rather than free visual properties.

- [ ] **Step 3: Create Style Variants with raw Style names as hidden mapping metadata**

Create one component set for the same `s:IconButton` family. Each Variant must contain the real Style key and evidence status; do not name an unconfirmed business action from a Style name.

- [ ] **Step 4: Create state Variants only for states confirmed by the template**

Use default, hover, pressed, selected, and disabled only where the source template has a corresponding trigger.

- [ ] **Step 5: Refresh the local component snapshot**

Call `get_component_info` for `local-201158828675869` with refresh and overwrite enabled after creation, then record the revision returned by the server.

- [ ] **Step 6: Verify the component definition**

Confirm that the component metadata contains real property bindings rather than only display names, and that each Variant has a `data-code-control` and `data-code-style` mapping.

---

### Task 3: 创建按钮容器和嵌套规则

**Files:**
- Read: `D:/MW-Framework-Reference/refence/ManualView.xaml`
- Read: `D:/MW-Framework-Reference/docs/ai-index/semantic/manual-view-framework-calls.md`
- Modify through MCP: current MasterGo local library `local-201158828675869`
- Verify through MCP: local component snapshot

**Interfaces:**
- Produces `MW/MainButtonGrid` and confirmed ButtonGroup components with explicit allowed child families, variable child count rules, insertion region, and prohibited child types.

- [ ] **Step 1: Confirm container evidence from real pages and source**

Record the actual parent-child relationship for `s:MainButtonGrid` and its `s:IconButton` children; do not infer a fixed button count from one page.

- [ ] **Step 2: Define the container contract**

Use this contract shape:

```text
container: MW/MainButtonGrid
allowedChildren: MW/IconButton
childCount: variable
layoutOwner: MW framework
arbitraryLayers: forbidden
```

- [ ] **Step 3: Create the container component or component set**

The visual shell is fixed, while the child count is variable only inside the named button region. Do not flatten child instances into decorative layers.

- [ ] **Step 4: Create separate composite components for unsupported child combinations**

For example, a button plus status light must not be inserted into `MW/IconButton` unless a real framework template supports it; create a separate composite component or mark it as a framework extension.

- [ ] **Step 5: Refresh and verify the component snapshot**

Confirm the new container entries and their child contracts are discoverable in the local library snapshot.

---

### Task 4: 创建中文使用规范和设计到代码验证页

**Files:**
- Read: `D:/Test-Work-MW/MasterGo_WPF_Codex/docs/button-component-catalog.md`
- Read: `D:/Test-Work-MW/MasterGo_WPF_Codex/docs/superpowers/specs/2026-08-19-button-component-library-design.md`
- Create through MCP: button component usage guide page in the current MasterGo file
- Verify through MCP: page screenshot/QA and component snapshot

**Interfaces:**
- Produces a Chinese designer-facing guide containing component purpose, allowed properties, valid page regions, invalid usage examples, nested-container rules, and code mappings.

- [ ] **Step 1: Start the page-generation flow with `design_page`**

Use the current file and request a Chinese “MW 按钮组件库使用规范” page. Follow the server-required design-source and component-library confirmation flow instead of selecting a source implicitly.

- [ ] **Step 2: Include a component usage matrix**

Show designer-facing names, confirmed usage, raw Style mapping, evidence status, and prohibited uses. Do not label `RightUpDownButtonStyle` as a business action without evidence.

- [ ] **Step 3: Include nested-container examples**

Show `MW/MainButtonGrid` containing a variable number of `MW/IconButton` instances and show that arbitrary controls are not allowed inside `MW/IconButton`.

- [ ] **Step 4: Include code-mapping examples**

Show a design instance mapping to `s:IconButton`, its Style, resource-backed icon/text, and separately marked engineering metadata.

- [ ] **Step 5: Run the required MCP review**

After submission, ask for user QA confirmation before calling `review_generated_page`; do not silently self-approve the generated page.

- [ ] **Step 6: Record remaining evidence gaps**

Any unconfirmed Style meaning, private property, or unsupported nested structure must be recorded as pending rather than hidden in the library.

---

## Verification checklist

- [ ] Catalog exists and is source-backed.
- [ ] `MW/IconButton` exposes real properties and controlled Variants.
- [ ] Icon replacement is a controlled nested instance, not a free-form layer.
- [ ] Optional icon/shortcut content uses properties rather than duplicate components.
- [ ] `MW/MainButtonGrid` allows variable `MW/IconButton` children with an explicit contract.
- [ ] Arbitrary child controls are rejected or routed to composite components.
- [ ] Designer guide is Chinese and separates confirmed usage from pending evidence.
- [ ] At least one real page instance is converted and checked against the target framework.
