import test from 'node:test';
import assert from 'node:assert/strict';
import { encryptHtml, decryptHtml } from '../share/encrypt.mjs';

test('private HTML round-trips without appearing in the public wrapper',async()=>{
  const html='<!doctype html><html><body><h1>private-family-fixture</h1><img src="data:image/png;base64,aGVsbG8="></body></html>';
  const wrapper=await encryptHtml(html,'fixture password',{title:'test <preview>'});
  assert(!wrapper.includes('private-family-fixture'));
  assert(!wrapper.includes('aGVsbG8='));
  assert(!wrapper.includes('fixture password'));
  assert(wrapper.includes('test &lt;preview&gt;'));
  assert(wrapper.includes('noindex, nofollow, noarchive'));
  assert.equal((await decryptHtml(wrapper,'fixture password')).html,html);
  await assert.rejects(()=>decryptHtml(wrapper,'wrong password'));
});

test('updates preserve a supplied salt while using a fresh IV, and tampering fails',async()=>{
  const first=await encryptHtml('private fixture','fixture password');
  const {salt}=await decryptHtml(first,'fixture password');
  const second=await encryptHtml('private fixture','fixture password',{salt});
  assert.notEqual(first,second);
  assert.deepEqual((await decryptHtml(second,'fixture password')).salt,salt);
  const tampered=second.replace(/(id="payload">)([^<]+)/,(_,prefix,blob)=>{
    const bytes=Buffer.from(blob,'base64');bytes[35]^=1;return prefix+bytes.toString('base64');
  });
  await assert.rejects(()=>decryptHtml(tampered,'fixture password'));
  await assert.rejects(()=>encryptHtml('private fixture','   '));
});
