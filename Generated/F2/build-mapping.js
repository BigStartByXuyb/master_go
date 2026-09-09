const fs = require("fs");
const path = require("path");

const runDir = path.resolve(__dirname, "dsl-run");
const projectRoot = path.resolve(__dirname, "../..");
const overview = JSON.parse(fs.readFileSync(path.join(runDir, "overview-input.json"), "utf8"));
const extract = JSON.parse(fs.readFileSync(path.join(runDir, "extractSvg.json"), "utf8"));

const sectionByIndex = new Map(overview.sections.map((s, i) => [i, s]));
const rawNodes = [];
const rawCounts = new Map();
const fontStyles = new Map();

function textOf(node) {
  if (!node || !Array.isArray(node.text)) return undefined;
  return node.text.map(x => typeof x === "string" ? x : (x && x.text) || "").join("");
}
function fontInfoOf(node) {
  const runs = Array.isArray(node && node.text)
    ? node.text.filter(x => x && typeof x === "object" && typeof x.font === "string")
    : [];
  const fontRefs = [...new Set(runs.map(x => x.font))];
  const values = fontRefs.map(ref => {
    const entry = fontStyles.get(ref);
    return entry && entry.value ? entry.value : entry;
  }).filter(Boolean);
  const first = values[0] || {};
  const size = Number(first.size);
  return {
    fontRefs,
    fontRef: fontRefs[0] || null,
    fontSize: Number.isFinite(size) ? size : null,
    fontFamily: typeof first.family === "string" ? first.family : null,
    lineHeight: first.lineHeight === undefined ? null : first.lineHeight,
    mixed: fontRefs.length > 1
  };
}
function walk(node, sectionIndex, parentRaw, parentPage) {
  if (!node || !node.id) return;
  const rawId = String(node.id);
  rawCounts.set(rawId, (rawCounts.get(rawId) || 0) + 1);
  const ls = node.layoutStyle || {};
  const relX = Number.isFinite(Number(ls.relativeX)) ? Number(ls.relativeX) : 0;
  const relY = Number.isFinite(Number(ls.relativeY)) ? Number(ls.relativeY) : 0;
  const base = parentPage || { x: Number(sectionByIndex.get(sectionIndex).x || 0), y: Number(sectionByIndex.get(sectionIndex).y || 0) };
  const current = { x: base.x + relX, y: base.y + relY };
  const font = node.type === "TEXT" ? fontInfoOf(node) : {};
  rawNodes.push({
    sectionIndex, originalRef: rawId, originalParentRef: parentRaw || null,
    type: node.type, name: node.name || null, node, relX, relY,
    pageAbsX: current.x, pageAbsY: current.y,
    width: Number.isFinite(Number(ls.width)) ? Number(ls.width) : null,
    height: Number.isFinite(Number(ls.height)) ? Number(ls.height) : null,
    text: textOf(node), svgShortKey: node.svgShortKey || null, svgName: node.svgName || null,
    ...font
  });
  for (const child of Array.isArray(node.children) ? node.children : []) walk(child, sectionIndex, rawId, current);
}
for (let i = 0; i < 35; i++) {
  const payload = JSON.parse(fs.readFileSync(path.join(runDir, "input-" + i + ".json"), "utf8"));
  for (const [ref, entry] of Object.entries((payload.dsl && payload.dsl.styles) || {})) fontStyles.set(ref, entry);
  for (const n of Array.isArray(payload.dsl.nodes) ? payload.dsl.nodes : []) walk(n, i, null, null);
}
const sourceKey = e => rawCounts.get(e.originalRef) === 1 ? e.originalRef : ("S" + e.sectionIndex + "::" + e.originalRef);
for (const e of rawNodes) e.ref = sourceKey(e);
for (const e of rawNodes) e.parentRef = e.originalParentRef ? sourceKey({sectionIndex:e.sectionIndex, originalRef:e.originalParentRef}) : null;
const byRef = new Map(rawNodes.map(n => [n.ref, n]));
const bySection = new Map();
for (const n of rawNodes) {
  if (!bySection.has(n.sectionIndex)) bySection.set(n.sectionIndex, []);
  bySection.get(n.sectionIndex).push(n);
}
const rawNodesOf = i => bySection.get(i) || [];
const rootNode = i => rawNodesOf(i).find(n => n.originalParentRef === null);
const textNodes = i => rawNodesOf(i).filter(n => n.type === "TEXT" && typeof n.text === "string");
const pathIn = (i, ownerRef) => rawNodesOf(i).find(n => n.type === "PATH" && (!ownerRef || n.originalRef.startsWith(ownerRef + "/")));
const source = r => {
  const s = byRef.get(r);
  if (!s) throw new Error("missing source " + r);
  return s;
};
const sourceNodes = rawNodes.map(n => ({
  ref:n.ref, originalRef:n.originalRef, sectionIndex:n.sectionIndex, type:n.type, name:n.name,
  parentRef:n.parentRef, pageAbsX:n.pageAbsX, pageAbsY:n.pageAbsY,
  relativeX:n.parentRef ? n.relX : n.pageAbsX, relativeY:n.parentRef ? n.relY : n.pageAbsY,
  width:n.width, height:n.height, ...(n.text === undefined ? {} : {text:n.text}),
  ...(n.fontRef ? {fontRef:n.fontRef} : {}),
  ...(n.fontRefs && n.fontRefs.length ? {fontRefs:n.fontRefs} : {}),
  ...(n.fontSize === null || n.fontSize === undefined ? {} : {fontSize:n.fontSize}),
  ...(n.fontFamily ? {fontFamily:n.fontFamily} : {}),
  ...(n.lineHeight === null || n.lineHeight === undefined ? {} : {lineHeight:n.lineHeight}),
  ...(n.mixed ? {fontMixed:true} : {}),
  ...(n.svgShortKey ? {svgShortKey:n.svgShortKey, svgName:n.svgName} : {})
}));

const outputNodes = [];
const componentSlots = new Set();
const emittedTextRefs = new Map();
const iconPathRefs = new Set();
const unmapped = [];
function markSlot(r) { if (r) componentSlots.add(r); }
function outputId(label) { return "F2_" + String(outputNodes.length + 1).padStart(3,"0") + "_" + label; }
function iconAttrs(pathRef) {
  if (!pathRef) return {};
  const p = source(pathRef);
  return {Icon: iconNameForPath(p), IconHeight:String(p.height || ""), IconWidth:String(p.width || "")};
}
function addOutput(o) {
  const s = source(o.sourceRef);
  const id = outputId(o.label);
  const valueSource = o.valueSourceRef ? source(o.valueSourceRef) : null;
  const attrs = {...(o.attrs || {})};
  if (valueSource) attrs.Value = valueSource.text || "";
  const isTextBlock = o.controlType === "TextBlock";
  if (isTextBlock) attrs.FontSize = Number.isFinite(Number(s.fontSize)) ? String(s.fontSize) : "";
  const outputHeight = isTextBlock ? 40 : (s.height || 0);
  const out = {
    ref:id, xmlId:id, id, sourceRef:o.sourceRef, parent:null,
    absX:s.pageAbsX, absY:s.pageAbsY, w:s.width || 0, h:outputHeight,
    expectedLeft:s.pageAbsX, expectedTop:s.pageAbsY - 192,
    expectedWidth:s.width || 0, expectedHeight:outputHeight,
    ...(isTextBlock ? {dslHeight:s.height, heightSource:"mtslg.textblock.fixed-40"} : {}),
    controlType:o.controlType, attrs,
    ...(valueSource ? {sourceText:valueSource.text || "", valueSource:"dsl.text", valueSourceRef:o.valueSourceRef} : {}),
    ...(o.comment ? {comment:o.comment} : {})
  };
  outputNodes.push(out);
  if (o.valueSourceRef) markSlot(o.valueSourceRef);
  if (o.iconSourceRef) { iconPathRefs.add(o.iconSourceRef); out.iconSourceRef = o.iconSourceRef; }
  return out;
}
function addText(t) {
  if (!t) return null;
  const out = addOutput({
    label:"Text", sourceRef:t.ref, controlType:"TextBlock",
    attrs:{Value:t.text, IOName:"", IOState:"", IOEnable:"", LangName:""},
    valueSourceRef:t.ref, comment:t.name || undefined
  });
  emittedTextRefs.set(t.ref, out.ref);
  return out;
}

const shellSections = new Set([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]);
for (const i of [21,22,23,24]) {
  const r = rootNode(i), t = textNodes(i)[0];
  if (!r) continue;
  if (i === 21) addOutput({label:"ComboBox", sourceRef:r.ref, controlType:"ComboBox",
    attrs:{IOName:"",IOState:"",IOEnable:"",IOCommand:"",LangName:""},
    valueSourceRef:t && t.ref, comment:"选择框-40"});
  else addText(t);
}

const buttonGroups = i => rawNodesOf(i).filter(n => n.type === "GROUP" && n.name === "按钮" && n.width >= 50 && n.height >= 50).sort((a,b)=>a.pageAbsX-b.pageAbsX);
for (const i of [25]) {
  const labels = ["+5","-5","+1","-1"], groups = buttonGroups(i);
  for (let k=0;k<Math.min(4,groups.length);k++) {
    const t = textNodes(i).find(x=>x.text===labels[k] && x.originalParentRef===groups[k].originalRef) || textNodes(i).find(x=>x.text===labels[k]);
    addOutput({label:"Small"+k,sourceRef:groups[k].ref,controlType:"IconButton",
      attrs:{Style:"SmallButton",IOName:"",IOCommand:"",IOEnable:"",IOState:"",LangName:""},
      valueSourceRef:t && t.ref,comment:"加减快捷键-无标题"});
  }
  addText(textNodes(i).find(x=>x.text==="64"));
  addText(textNodes(i).find(x=>x.text==="Y-size"));
}

{
  const i=26, names=["按钮-指向上","按钮-指向左","按钮-指向右","按钮-指向下"];
  for (const name of names) {
    const g=rawNodesOf(i).find(n=>n.type==="GROUP" && n.name===name), p=g && pathIn(i,g.originalRef);
    if (g) addOutput({label:name.replace(/[^A-Za-z0-9]+/g,""),sourceRef:g.ref,controlType:"IconButton",
      attrs:{IOName:"",IOCommand:"",IOEnable:"",IOState:""},iconSourceRef:p && p.ref,comment:"轴操作"});
  }
  addText(textNodes(i).find(x=>x.text==="SCAN"));
}

for (const item of [[27,"stop","RightButtonStyle"],[28,"文案 大button",null],[29,"enter","RightButtonStyle"],[30,"exit","RightButtonStyle"]]) {
  const i=item[0], r=rootNode(i), t=textNodes(i)[0], p=r && pathIn(i,r.originalRef);
  const attrs={IOName:"",IOCommand:"",IOEnable:"",IOState:"",LangName:"",TopLeftContent:""};
  if (item[2]) attrs.Style=item[2];
  addOutput({label:item[1].replace(/[^A-Za-z0-9]+/g,""),sourceRef:r.ref,controlType:"IconButton",attrs,
    valueSourceRef:t && t.ref,iconSourceRef:p && p.ref,comment:"右侧栏-"+item[1]});
}
unmapped.push({sectionIndex:31,sourceRef:rootNode(31) && rootNode(31).ref,name:"集成图像-低倍率",reason:"正式相机组件映射未在当前 MTSLG 映射表中唯一命中"});

for (const i of [33,34]) {
  const ts=textNodes(i), inner=rawNodesOf(i).find(n=>n.type==="INSTANCE" && n.name==="加减快捷操作-有标题");
  const gs=inner ? rawNodesOf(i).filter(n=>n.type==="GROUP" && /^组 15(42|45|43|44)$/.test(n.name)).sort((a,b)=>a.pageAbsX-b.pageAbsX) : [];
  const wanted=["+5","-5","+1","-1"];
  for (let k=0;k<Math.min(4,gs.length);k++) {
    const t=ts.find(x=>x.text===wanted[k] && x.originalParentRef===gs[k].originalRef) || ts.find(x=>x.text===wanted[k]);
    addOutput({label:"Light"+i+"_"+k,sourceRef:gs[k].ref,controlType:"IconButton",
      attrs:{Style:"SmallButton",IOName:"",IOCommand:"",IOEnable:"",IOState:"",LangName:""},
      valueSourceRef:t && t.ref,comment:"加减快捷操作-有标题"});
  }
  addText(ts.find(x=>x.text==="光源调整"));
  addText(ts.find(x=>x.text==="9.0%"));
  addText(ts.find(x=>x.text==="Dir"));
}

const handledText=new Set([...componentSlots,...emittedTextRefs.keys()]);
for (const t of rawNodes.filter(n=>n.type==="TEXT" && typeof n.text==="string")) {
  if (handledText.has(t.ref) || shellSections.has(t.sectionIndex) || t.sectionIndex===32) continue;
  addText(t);
}

const svgEntries=extract.svgs || [];
function matchingSvg(entry) {
  return svgEntries.filter(x=>x && typeof x.id==="string" && typeof x.svg==="string" &&
    (entry.originalRef===x.id || entry.originalRef.startsWith(x.id+"/"))).sort((a,b)=>b.id.length-a.id.length)[0];
}
const iconNameMap=new Map(), iconEntries=[]; let iconIndex=1;
function iconNameForPath(entry) { return iconNameMap.get(entry && entry.ref) || ""; }
for (const entry of [...iconPathRefs].map(r=>source(r))) {
  const svg=matchingSvg(entry);
  if (!svg) { unmapped.push({sourceRef:entry.ref,name:entry.svgName||entry.name,reason:"extractSvg 未找到精确祖先条目"}); continue; }
  const name="F2Icon"+String(iconIndex++).padStart(2,"0")+"Geometry";
  iconNameMap.set(entry.ref,name);
  iconEntries.push({sourceId:svg.id,name,comment:entry.svgName||entry.name||"页面图标",sourceRef:entry.ref,status:"provisional"});
}
for (const out of outputNodes) if (out.iconSourceRef) {
  const name=iconNameMap.get(out.iconSourceRef);
  if (name) out.attrs.Icon=name;
  delete out.iconSourceRef;
}
const pathCandidates=sourceNodes.filter(n=>n.type==="PATH").map(n=>{
  const raw=rawNodes.find(x=>x.ref===n.ref), svg=raw && matchingSvg(raw);
  return {sourceId:svg ? svg.id : null,sourceRef:n.ref,svgName:n.svgName||null,nodeName:n.name||null,
    status:iconNameMap.has(n.ref)?"provisional":"unmapped",...(iconNameMap.has(n.ref)?{name:iconNameMap.get(n.ref)}:{})};
});
const iconMap={icons:iconEntries,candidates:pathCandidates,unmapped:pathCandidates.filter(x=>x.status==="unmapped")};

const textAudit=[];
for (const t of sourceNodes.filter(n=>n.type==="TEXT" && typeof n.text==="string")) {
  if (t.sectionIndex===32) textAudit.push({sourceRef:t.ref,sourceText:t.text,visibility:true,role:"page-title",decision:"omit",omitReason:"page-title",outputRefs:[]});
  else if (shellSections.has(t.sectionIndex)) textAudit.push({sourceRef:t.ref,sourceText:t.text,visibility:true,role:"host-shell",decision:"omit",omitReason:"host-shell",outputRefs:[],reason:"宿主公共栏"});
  else if (componentSlots.has(t.ref)) textAudit.push({sourceRef:t.ref,sourceText:t.text,visibility:true,role:"host-shell",decision:"omit",omitReason:"host-shell",outputRefs:[],reason:"组件内部文本槽位由所属 IOContorl.Value 承载"});
  else if (emittedTextRefs.has(t.ref)) textAudit.push({sourceRef:t.ref,sourceText:t.text,visibility:true,role:"content",decision:"emit",outputRefs:[emittedTextRefs.get(t.ref)]});
  else textAudit.push({sourceRef:t.ref,sourceText:t.text,visibility:true,role:"content",decision:"emit",outputRefs:[]});
}
for (const audit of textAudit.filter(x=>x.decision==="emit" && x.outputRefs.length===0)) {
  const t=byRef.get(audit.sourceRef);
  if (t) { const out=addText(t); audit.outputRefs=[out.ref]; }
}

const mapping={
  adapter:"mtslg-iocontrol",contentOriginX:0,contentOriginY:192,rootRef:"357:211220",page:"F2Teach",
  source:{fileId:"181586559903927",layerId:"357:211220",url:"https://mastergo.com/goto/VWcjiZO2?page_id=4:0&layer_id=357:211220&file=181586559903927&devMode=true"},
  sourceNodes,nodes:outputNodes,textAudit,unmapped,
  audit:{overviewNodeCount:360,capturedNodeCount:333,normalizedSection4:{sourceNodeCount:34,capturedNodeCount:7},shellSections:[...shellSections],runtimeBindings:"pending"}
};
fs.mkdirSync(path.join(projectRoot,"Generated/F2"),{recursive:true});
fs.writeFileSync(path.join(projectRoot,"Generated/F2/F2Teach.mapping.input.json"),JSON.stringify(mapping,null,2)+"\n");
fs.writeFileSync(path.join(projectRoot,"Generated/F2/F2Teach.icon-confirmed.json"),JSON.stringify(iconMap,null,2)+"\n");
console.log(JSON.stringify({sourceNodes:sourceNodes.length,outputNodes:outputNodes.length,textAudit:textAudit.length,icons:iconEntries.length,unmapped:unmapped.length}));
