# MW MasterGo Component Library System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a maintainable MW-aligned MasterGo component library with synchronized framework mappings and designer usage documentation.

**Architecture:** Use semantic component families with separate layout/state dimensions, instance swaps for complete resources, and controlled slots for variable child content. Keep designer-facing Chinese properties separate from hidden MW code mappings.

**Tech Stack:** MasterGo Vibe MCP, MasterGo component HTML protocol, MW WPF reference source, Markdown mapping and usage documentation.

**Spec:** `docs/superpowers/specs/2026-08-20-mw-component-library-system-design.md`

## Global Constraints

- Never invent MW controls, style keys, resource keys, or protocol syntax.
- Designer-facing names and properties are Chinese semantic names.
- `IOEnable`, `PageName`, and `s:Action` are engineering mappings, not unrestricted designer properties.
- Every MasterGo component change updates both mapping and designer-guide documents.
- Every MCP-created component is refreshed and verified before being marked complete.

### Task 1: Finalize and validate the reusable Skill

**Files:**
- Modify: `C:/Users/xuyb/.codex/skills/mw-mastergo-design-to-code/SKILL.md`
- Create: `C:/Users/xuyb/.codex/skills/mw-mastergo-design-to-code/references/component-mapping-schema.md`

- [ ] Write the Skill workflow for framework evidence lookup, component creation, mapping-document updates, designer-guide updates, and MCP verification.
- [ ] Add the mapping schema reference with required fields and examples.
- [ ] Run the skill validator and confirm no scaffold placeholders remain.

### Task 2: Complete the canonical button family

**Files:**
- Modify: MasterGo current file through Vibe MCP.
- Modify: `docs/mw-component-library-mapping.md`
- Modify: `docs/mw-component-library-designer-guide.md`

- [ ] Verify each IconButton layout against `SDC/Style/IconButton.xaml`.
- [ ] Expose only semantic text, state, visibility, and icon instance properties.
- [ ] Verify the outer instance shows the state dropdown and icon instance swap.
- [ ] Record each layout-to-style mapping and designer scenario.

### Task 3: Create dropdown components

**Files:**
- Modify: MasterGo current file through Vibe MCP.
- Modify: mapping and designer-guide documents.

- [ ] Verify `SingleComboBox` and `MultiComboBox` in framework source/index.
- [ ] Create separate single and multi-select components with state variants.
- [ ] Model options as controlled option-list content, not arbitrary internal layers.
- [ ] Record selection, disabled, placeholder, and validation mapping.

### Task 4: Create input components

**Files:**
- Modify: MasterGo current file through Vibe MCP.
- Modify: mapping and designer-guide documents.

- [ ] Verify all input controls from the framework index before creating names.
- [ ] Create numeric, integer, and text input families only for confirmed controls.
- [ ] Keep keypad attachments as separate components or documented attachments.
- [ ] Record editable value, unit, validation, disabled, and keypad mappings.

### Task 5: Create table and pagination components

**Files:**
- Modify: MasterGo current file through Vibe MCP.
- Modify: mapping and designer-guide documents.

- [ ] Verify `DataGrid`, `IODataGrid`, `PagableDataGrid`, and `Pagination` source evidence.
- [ ] Use controlled column/row slots and document allowed child types.
- [ ] Separate visual table state from data-binding and IO protocol mappings.
- [ ] Verify pagination is a separate component that can be composed with paged tables.

### Task 6: Create layout components

**Files:**
- Modify: MasterGo current file through Vibe MCP.
- Modify: mapping and designer-guide documents.

- [ ] Verify `MainButtonGrid`, `ButtonGroup`, and other layout controls from source.
- [ ] Define allowed child component categories for each container.
- [ ] Document fixed shell versus variable content area.
- [ ] Verify nested component structure in a representative page composition.

### Task 7: End-to-end conversion verification

**Files:**
- Create: `docs/mw-component-library-verification.md`
- Modify: mapping and designer-guide documents as needed.

- [ ] Select one button, dropdown, input, table, and layout instance from MasterGo.
- [ ] Record the semantic properties and expected MW mapping.
- [ ] Generate or inspect the corresponding MW WPF usage.
- [ ] Confirm no unknown keys or invented protocols appear.
