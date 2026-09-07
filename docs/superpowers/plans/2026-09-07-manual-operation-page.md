# 手动操作（2.0）页面转换 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 从 MasterGo 根图层 `357:204391` 创建完整、可追溯且静态验证通过的 MTSLG IOContorl 页面包。

**Architecture:** 先把 MasterGo 的 48 个 DSL 分段原样落盘为唯一设计来源，再由当前插件的正式 MTSLG 映射与白名单生成 emission manifest。发射器仅消费该 manifest，随后由独立 provenance、坐标、XML 和图标闭合检查生成验收证据；未能闭合来源或映射的节点绝不进入 XML。

**Tech Stack:** Node.js、MasterGo MCP、MTSLG IOContorl XML、XAML Geometry、插件自带生成器与校验器。

**Spec:** `docs/superpowers/specs/2026-09-07-manual-operation-page-design.md`

## Global Constraints

- Adapter 固定为 `mtslg-iocontrol`；不得输出 WPF 宿主、Layout 注册或运行时绑定。
- 设计数据只可来自 MasterGo 文件 `181586559903927` 的根图层 `357:204391`；不得读取其他项目的页面、资源、绑定或样例。
- 必须获取 sectionIndex `0` 至 `47` 的全部 DSL；缺任何一段即停止发射。
- 业务节点根级坐标固定为 `Left=pageAbsX-contentOriginX` 与 `Top=pageAbsY-192`，且 192 只扣除一次。
- 每个 XML `Value` 必须等于唯一来源 TEXT；不可推断文字、位置、Style、Icon、`IOName`、`IOCommand` 或 `LangName`。
- 未映射/无唯一来源节点写入 `unmapped` 审计文件，不得伪造普通控件。
- 仅在 provenance、坐标、XML 和图标键检查均通过时，才能声明静态转换完成。

---

### Task 1: 建立设计源快照与完整性测试

**Files:**
- Create: `Generated/source/overview.json`
- Create: `Generated/source/sections/00.json` through `Generated/source/sections/47.json`
- Create: `tools/fetch-mastergo-sections.mjs`
- Create: `tools/fetch-mastergo-sections.test.mjs`

**Interfaces:**
- Consumes: MasterGo MCP `getDesignSections({ fileId, layerId, sectionIndex? })` response.
- Produces: `fetchMastergoSections(fetchSection)` returning `{ overview, sections }`; each section preserves `sectionIndex`, raw DSL, root metadata and source IDs.

- [ ] **Step 1: Write the failing source-completeness test**

```js
import assert from 'node:assert/strict';
import { validateSnapshot } from './fetch-mastergo-sections.mjs';
assert.throws(() => validateSnapshot({ totalSections: 48, sections: [] }), /missing sectionIndex 0/);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tools/fetch-mastergo-sections.test.mjs`

Expected: FAIL because the fetch/validation module does not exist.

- [ ] **Step 3: Implement sequential, lossless section capture**

```js
export function validateSnapshot({ totalSections, sections }) {
  for (let sectionIndex = 0; sectionIndex < totalSections; sectionIndex += 1) {
    if (!sections.some((item) => item.sectionIndex === sectionIndex)) {
      throw new Error(`missing sectionIndex ${sectionIndex}`);
    }
  }
}
```

Use the MCP overview to fix `totalSections=48`; obtain each section in batches of no more than five, persist the raw response without changing text, PATH metadata, bounding boxes or parent links, then call `validateSnapshot` before proceeding.

- [ ] **Step 4: Run the test and capture source**

Run: `node tools/fetch-mastergo-sections.test.mjs`

Expected: PASS. Then write `overview.json` and exactly 48 numbered section files; the manifest must list no missing indices.

- [ ] **Step 5: Commit**

```bash
git add tools/fetch-mastergo-sections.mjs tools/fetch-mastergo-sections.test.mjs Generated/source
git commit -m "feat: snapshot manual operation design DSL"
```

### Task 2: Create the source-to-emission mapping with hard provenance gates

**Files:**
- Create: `tools/build-manual-operation-mapping.mjs`
- Create: `tools/build-manual-operation-mapping.test.mjs`
- Create: `Generated/ManualOperationPage.emission.json`
- Create: `Generated/ManualOperationPage.unmapped.json`
- Create: `Generated/ManualOperationPage.mapping.json`

**Interfaces:**
- Consumes: all 48 source section JSON files, `feishu-component-library-mapping.md`, `mtslg-iocontrol-map.json` and `Generated/source/overview.json`.
- Produces: `buildMapping(snapshot)` returning `{ emissionNodes, provenanceNodes, unmappedNodes, strippedNodes }`; each emitted node contains `ref`, `sourceParent`, `absX`, `absY`, `w`, `h`, `controlType`, `attrs` and a provenance record.

- [ ] **Step 1: Write failing provenance tests**

```js
import assert from 'node:assert/strict';
import { assertTextProvenance } from './build-manual-operation-mapping.mjs';
assert.throws(
  () => assertTextProvenance({ value: 'F2', sourceText: 'F3', sourceRef: 'x', sourceParent: ['root'] }),
  /Value must equal source text/
);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tools/build-manual-operation-mapping.test.mjs`

Expected: FAIL because the mapper does not exist.

- [ ] **Step 3: Implement mapping and isolation rules**

```js
export function assertTextProvenance(node) {
  if (!node.sourceRef || !node.sourceParent?.length) throw new Error('missing source chain');
  if (node.value !== node.sourceText) throw new Error('Value must equal source text');
}
```

Classify component instances only through the formal mapping. Preserve icon ancestry and create Geometry inputs only for PATH/SVG descendants of a mapped component. Strip only nodes proven to be framework shell or design-artifact title; record each stripped node and reason. For output nodes set root-level `Left=absX-contentOriginX` and `Top=absY-192`; use real parent-relative values only when the formal template preserves that parent. Omit all resource and runtime properties not proven by the current source or formal mapping.

- [ ] **Step 4: Run mapping tests and generate audit files**

Run: `node tools/build-manual-operation-mapping.test.mjs`

Expected: PASS. Then run `node tools/build-manual-operation-mapping.mjs` and confirm all emitted nodes have unique source refs, all visible values equal source text, and every excluded node appears in `unmapped` or `strippedNodes`.

- [ ] **Step 5: Commit**

```bash
git add tools/build-manual-operation-mapping.mjs tools/build-manual-operation-mapping.test.mjs Generated/ManualOperationPage.emission.json Generated/ManualOperationPage.mapping.json Generated/ManualOperationPage.unmapped.json
git commit -m "feat: map manual operation controls from DSL"
```

### Task 3: Emit XML and page-local Geometry resources

**Files:**
- Create: `Generated/ManualOperationPage.xml`
- Create: `Generated/ManualOperationPageIcon.xaml`
- Create: `Generated/ManualOperationPage.icon-input.json`
- Create: `tools/manual-operation-emission.test.mjs`

**Interfaces:**
- Consumes: `Generated/ManualOperationPage.emission.json` and the page-local PATH/SVG source list generated in Task 2.
- Produces: an `IOContorl` root with `Left/Top/Width/Height="NaN"`, plus XML nodes accepted by the MTSLG control/attribute whitelist; each referenced Icon key is defined in the page-local XAML file.

- [ ] **Step 1: Write failing emission assertions**

```js
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const xml = readFileSync('Generated/ManualOperationPage.xml', 'utf8');
assert.match(xml, /<IOContorl[^>]+Left="NaN"[^>]+Top="NaN"/);
assert.doesNotMatch(xml, /IOName=|IOCommand=|LangName=/);
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tools/manual-operation-emission.test.mjs`

Expected: FAIL because neither XML nor the test exists.

- [ ] **Step 3: Generate only from the emission manifest**

Run the plugin `gen-iocontrol-xml.js --fresh` against `ManualOperationPage.emission.json`. Build icon input with English keys and Chinese comments supported by exact DSL ancestry, then run `gen-mtslg-page-icons.js`; do not copy SVG path data or invent `MGIcon_*` keys. Do not create `Layout.xml`, resource dictionaries, a WPF View, or binding fields.

- [ ] **Step 4: Add and run emission assertions**

Run: `node --test tools/manual-operation-emission.test.mjs`

Expected: PASS. Confirm the root NaN skeleton, only whitelisted attributes, no unverified runtime fields, and that every XML Icon attribute resolves to `ManualOperationPageIcon.xaml`.

- [ ] **Step 5: Commit**

```bash
git add Generated/ManualOperationPage.xml Generated/ManualOperationPageIcon.xaml Generated/ManualOperationPage.icon-input.json tools/manual-operation-emission.test.mjs
git commit -m "feat: emit manual operation static page"
```

### Task 4: Perform independent static validation and publish evidence

**Files:**
- Create: `Generated/ManualOperationPage.validation.json`
- Create: `tools/validate-manual-operation-page.mjs`
- Create: `tools/validate-manual-operation-page.test.mjs`

**Interfaces:**
- Consumes: XML, mapping, source snapshot, icon XAML, whitelist mapping and plugin `validate-iocontrol-provenance.js`, `check-iocontrol-coords.js`, `scan-icon-coords.js`.
- Produces: a validation JSON containing exact command statuses, node counts, `missingSections`, `valueMismatches`, `coordinateMismatches`, `attributeViolations`, `unresolvedIconKeys` and `status`.

- [ ] **Step 1: Write failing validator test**

```js
import assert from 'node:assert/strict';
import { summarize } from './validate-manual-operation-page.mjs';
assert.equal(summarize({ missingSections: [13], valueMismatches: [], coordinateMismatches: [], attributeViolations: [], unresolvedIconKeys: [] }).status, 'FAIL');
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node tools/validate-manual-operation-page.test.mjs`

Expected: FAIL because the validator module does not exist.

- [ ] **Step 3: Implement evidence aggregation**

```js
export function summarize(result) {
  const failed = result.missingSections.length || result.valueMismatches.length ||
    result.coordinateMismatches.length || result.attributeViolations.length ||
    result.unresolvedIconKeys.length;
  return { ...result, status: failed ? 'FAIL' : 'PASS' };
}
```

Run the three independent plugin checks and XML parsing. Capture their raw outputs and never turn a non-zero result into PASS. Include the 48-section completeness result and source-derived expected positions in the validation JSON.

- [ ] **Step 4: Run all static validation**

Run: `node tools/validate-manual-operation-page.test.mjs; node tools/validate-manual-operation-page.mjs`

Expected: both commands PASS, `validation.json.status` is `PASS`, and all mismatch/violation arrays are empty. If any check fails, stop and correct the mapping rather than manually editing XML coordinates or values.

- [ ] **Step 5: Commit**

```bash
git add tools/validate-manual-operation-page.mjs tools/validate-manual-operation-page.test.mjs Generated/ManualOperationPage.validation.json
git commit -m "test: verify manual operation page provenance"
```

## Final Verification

- [ ] `git status --short` contains only expected conversion files or is clean after the task commits.
- [ ] `node tools/fetch-mastergo-sections.test.mjs` passes and source snapshot has exactly 48 section files.
- [ ] `node tools/build-manual-operation-mapping.test.mjs` passes.
- [ ] `node --test tools/manual-operation-emission.test.mjs` passes.
- [ ] `node tools/validate-manual-operation-page.test.mjs` and `node tools/validate-manual-operation-page.mjs` pass.
- [ ] Final report identifies output paths and says “静态转换完成”; it explicitly states runtime integration and visual runtime validation are not performed because this repository contains no host contract.

