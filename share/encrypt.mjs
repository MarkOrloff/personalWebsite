#!/usr/bin/env node
// Encrypt a self-contained HTML page for public/share/. Passwords are read from stdin, never flags.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { webcrypto, randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const subtle=webcrypto.subtle,enc=new TextEncoder();
const ITERATIONS=600000,AAD='collab_share v1';
const PAYLOAD=/<script type="application\/octet-stream" id="payload">([^<]*)<\/script>/;
const REPO=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const defaultTemplate=()=>fs.readFileSync(new URL('./unlock-template.html',import.meta.url),'utf8');
const normalize=password=>password.trim().normalize('NFC');
const escapeHtml=text=>text.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function derive(password,salt,iterations=ITERATIONS){
  const base=await subtle.importKey('raw',enc.encode(normalize(password)),'PBKDF2',false,['deriveKey']);
  return subtle.deriveKey({name:'PBKDF2',salt,iterations,hash:'SHA-256'},base,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
}
export async function encryptHtml(html,password,{title='private preview',salt=randomBytes(16),template=defaultTemplate()}={}){
  if(!normalize(password))throw new Error('A password is required.');
  if(template.split('__PAYLOAD__').length!==2)throw new Error('The unlock template must have one payload slot.');
  const iv=randomBytes(12),key=await derive(password,salt);
  const body=await subtle.encrypt({name:'AES-GCM',iv,additionalData:enc.encode(AAD),tagLength:128},key,zlib.gzipSync(Buffer.from(html),{level:9}));
  const payload=Buffer.concat([Buffer.from(salt),iv,Buffer.from(body)]).toString('base64');
  return template.replaceAll('__PAGE_TITLE__',escapeHtml(title)).replace('__PAYLOAD__',payload);
}
export async function decryptHtml(wrapper,password){
  const match=PAYLOAD.exec(wrapper),iterations=/var ITERATIONS = (\d+)/.exec(wrapper),aad=/AAD = '([^']*)'/.exec(wrapper);
  if(!match||!iterations||!aad)throw new Error('This is not an encrypted share page.');
  const raw=Buffer.from(match[1].replace(/\s+/g,''),'base64'),salt=raw.subarray(0,16),iv=raw.subarray(16,28);
  const key=await derive(password,salt,Number(iterations[1]));
  const data=await subtle.decrypt({name:'AES-GCM',iv,additionalData:enc.encode(aad[1]),tagLength:128},key,raw.subarray(28));
  return {html:zlib.gunzipSync(Buffer.from(data)).toString('utf8'),salt};
}
async function askPassword(){
  if(!process.stdin.isTTY){let input='';for await(const chunk of process.stdin)input+=chunk;return input.split(/\r?\n/)[0];}
  process.stdout.write('page password: ');process.stdin.setRawMode(true);process.stdin.resume();process.stdin.setEncoding('utf8');
  return new Promise(resolve=>{
    let password='';
    const onData=chunk=>{for(const c of chunk){
      if(c==='\u0003'){process.stdin.setRawMode(false);process.exit(130);}
      if(c==='\r'||c==='\n'){process.stdin.setRawMode(false);process.stdin.pause();process.stdin.removeListener('data',onData);process.stdout.write('\n');resolve(password);return;}
      if(c==='\u007f'||c==='\b')password=password.slice(0,-1);else password+=c;
    }};process.stdin.on('data',onData);
  });
}
async function main(){
  const args=process.argv.slice(2),options={};
  for(let i=0;i<args.length;i++){
    if(args[i]==='--replace')options.replace=true;
    else if(['--input','--slug','--title'].includes(args[i])){if(!args[i+1])throw new Error('Missing value for '+args[i]);options[args[i].slice(2)]=args[++i];}
    else throw new Error('Usage: node share/encrypt.mjs --input /absolute/page.html [--slug random-link-name] [--title "private preview"] [--replace]');
  }
  if(!options.input)throw new Error('--input is required; use a self-contained HTML file outside the repository.');
  const slug=options.slug||randomBytes(12).toString('hex');
  if(!/^[a-z0-9][a-z0-9-]{5,63}$/.test(slug))throw new Error('Use 6–64 lowercase letters, numbers or hyphens for the slug.');
  const output=path.join(REPO,'public/share',slug,'index.html');
  if(fs.existsSync(output)&&!options.replace)throw new Error('This page already exists; pass --replace to update it with the same password.');
  const html=fs.readFileSync(path.resolve(options.input),'utf8'),password=await askPassword();
  let salt;
  if(fs.existsSync(output)){
    try{salt=(await decryptHtml(fs.readFileSync(output,'utf8'),password)).salt;}
    catch{throw new Error('That password does not open the existing page. It was not changed.');}
  }
  const wrapper=await encryptHtml(html,password,{title:options.title,salt});
  const verified=await decryptHtml(wrapper,password);
  if(verified.html!==html)throw new Error('Round-trip verification failed.');
  fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,wrapper);
  console.log('Encrypted and verified: '+path.relative(REPO,output));
  console.log('URL after publishing: https://markorloff.com/share/'+slug+'/');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(error=>{console.error(error.message);process.exitCode=1;});
