import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fillValueCopy} from '../src/lib/value-copy.mjs';
import {scenes} from '../src/lib/value-walkthrough.mjs';
import {parseCopyDocument} from '../src/lib/copy-document.mjs';
test('the editing document supplies every reference and rejects silent copy loss',()=>{
  const source=readFileSync(new URL('../content/walkthrough-copy.md',import.meta.url),'utf8');
  const copy=parseCopyDocument(source);
  for(const file of ['data/paper-stories.ts','data/social-conformity-story.ts','data/brain-evidence.ts','pages/publications/social-conformity.astro']){
    const code=readFileSync(new URL('../src/'+file,import.meta.url),'utf8');
    for(const match of code.matchAll(/copy\(['"]([^'"]+)['"]\)/g))assert.ok(copy(match[1]).length>0);
  }
  for (const [i] of scenes.entries()) for (const field of ['label','title','text','hint']) assert.ok(fillValueCopy(copy(`subjective-value.steps.${i}.${field}`)).length > 0);
  assert.throws(()=>fillValueCopy('{{misspelled.amount}}'),/Unknown value-story token/);
  const sample='<!-- copy: test.gistTitle -->\na fresh paragraph\n<!-- /copy -->';
  assert.equal(parseCopyDocument(sample)('test.gistTitle'),'a fresh paragraph');
  assert.throws(()=>parseCopyDocument(sample+sample),/Duplicate/);
  assert.throws(()=>parseCopyDocument(sample.replace('<!-- /copy -->','')),/Unclosed/);
  assert.throws(()=>copy('missing.key'),/Missing/);
});
