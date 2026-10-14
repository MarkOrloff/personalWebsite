import {test} from 'node:test';
import assert from 'node:assert/strict';
import {emphasize,emphasizeHtml} from '../src/lib/emphasis.mjs';

test('asterisks around a word become italics, author marks do not',()=>{
 assert.equal(emphasize('placing things *relative* to others'),'placing things <em>relative</em> to others');
 assert.equal(emphasize('see what *your* map looks like!'),'see what <em>your</em> map looks like!');
 assert.equal(emphasize('*replay* can turn'),'<em>replay</em> can turn');
 assert.equal(emphasize('the ‘*subjective* one’'),'the ‘<em>subjective</em> one’');
 for(const text of ['Chung D*, Orloff MA*, Lauharatanahirun N','· * equal contribution','* equal contribution','5 * 3 = 15'])assert.equal(emphasize(text),text);
});
test('rendered pages get italics in text, plain labels, and untouched scripts',()=>{
 const html='<p title="a *big* win">a *big* win</p><script>const x="*no*";</script><img alt="*shape* map"><p>Orloff MA*, Chung D*</p>';
 assert.equal(emphasizeHtml(html),'<p title="a big win">a <em>big</em> win</p><script>const x="*no*";</script><img alt="shape map"><p>Orloff MA*, Chung D*</p>');
});
