import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {parse} from '@astrojs/compiler';
import {parseCopyBlocks,formatCopy,escapeCopy} from '../src/lib/copy-document.mjs';
import {copy} from '../src/lib/site-copy.mjs';
import {valueAxes,valueLayout,odorSVG,odorLayout,restSVG,restLayout} from '../src/lib/paper-plots.mjs';
const root=new URL('../src/',import.meta.url);
const files=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(file=>file.isDirectory()?file.name==='generated'?[]:files(new URL(file.name+'/',dir)):[new URL(file.name,dir)]);
test('all literal interface copy references exist in the editing document',()=>{
 const blocks=parseCopyBlocks(readFileSync(new URL('../content/walkthrough-copy.md',import.meta.url),'utf8'));
 let checked=0;
 for(const file of files(root).filter(f=>/\.(astro|ts|mjs)$/.test(f.pathname))) {
  const source=readFileSync(file,'utf8');
  for(const match of source.matchAll(/copy(?:Html)?\(\s*['"]([^'"]+)['"]/g)) {assert.ok(blocks.has(match[1]),`${file.pathname}: ${match[1]}`);checked++;}
 }
 assert.ok(checked>500);
});
test('Astro pages and components have no hardcoded visible words or accessible labels',async()=>{
 for(const file of files(root).filter(f=>f.pathname.endsWith('.astro'))) {
  const {ast}=await parse(readFileSync(file,'utf8'));
  function walk(node,parent){
   if(node.type==='frontmatter'||['script','style'].includes(node.name))return;
   if(node.type==='text'&&parent?.type!=='expression')assert.ok(!/[A-Za-z]/.test(node.value),`${file.pathname}: ${node.value}`);
   for(const attr of node.attributes||[])if(['alt','title','aria-label','placeholder','description'].includes(attr.name)&&attr.kind==='quoted')assert.ok(!/[A-Za-z]/.test(attr.value),`${file.pathname}: ${attr.name}`);
   for(const child of node.children||[])walk(child,node);
  }
  walk(ast,null);
 }
});
test('edited copy preserves special characters and cannot become SVG markup',()=>{
 const text='you & your <favorite> "choice"';
 assert.equal(formatCopy('{{person}}: {{count}} choices',{person:text,count:5}),text+': 5 choices');
 assert.throws(()=>formatCopy('{{missing}}',{}),/Missing copy value/);
 assert.throws(()=>copy('does.not.exist'),/Missing copy block/);
 const markup=valueAxes(valueLayout(520,'subjective'),text);
 assert.ok(markup.includes(escapeCopy(text)));assert.ok(!markup.includes('<favorite>'));
 const odor=odorLayout();odor.points[0].label=text;assert.ok(odorSVG(odor).includes(escapeCopy(text)));
 const rest=restLayout();rest.points[0].name=text;assert.ok(restSVG(rest).includes(escapeCopy(text)));
});
