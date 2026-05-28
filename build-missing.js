const fs = require('fs');
const path = require('path');

const CATS = [
  {id:'json',name:'JSON & Data',icon:'🟦',color:'#00C896',desc:'Format, validate, convert and transform JSON and data formats'},
  {id:'api',name:'API & Security',icon:'🔐',color:'#0066FF',desc:'JWT, Base64, hashing, UUID and security utilities'},
  {id:'text',name:'Text & Parsing',icon:'✍️',color:'#7B61FF',desc:'Regex, diff, case conversion, markdown and text utilities'},
  {id:'devops',name:'DevOps & Infra',icon:'⚙️',color:'#FF6B35',desc:'Cron, timestamps, YAML, Docker and infra tools'},
  {id:'frontend',name:'Frontend Tools',icon:'🟢',color:'#00D4FF',desc:'CSS, colors, gradients, shadows and frontend utilities'},
];

function makeToolPage(tool, cat) {
  const hasExtra = tool.extraPanel;
  const hasCustom = tool.customInput;
  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${tool.name} — DevNova Tools</title>
<meta name="description" content="${tool.desc} Free, fast, no login required."/>
<link rel="canonical" href="https://devnovatools.com/${tool.cat}/${tool.id}/"/>
<link rel="stylesheet" href="/assets/shared.css"/>
</head>
<body>
<main class="tool-page">
  <div class="tool-header">
    <div class="breadcrumb"><a href="/">Home</a> <span>›</span> <a href="/${tool.cat}/">${cat.name}</a> <span>›</span> <span>${tool.name}</span></div>
    <div class="tool-title-row">
      <div class="tool-icon-wrap" style="background:${tool.color}22;border:1px solid ${tool.color}44">${tool.icon}</div>
      <h1 class="tool-name">${tool.name}</h1>
    </div>
    <p class="tool-desc">${tool.desc}</p>
    <div class="tool-actions">
      <button class="btn btn-primary btn-sm" onclick="run()">▶ Run</button>
      <button class="btn btn-secondary btn-sm" onclick="document.getElementById('input')&&(document.getElementById('input').value='');document.getElementById('output')&&(document.getElementById('output').textContent='',document.getElementById('output').innerHTML='')">Clear</button>
      <button class="btn btn-ghost btn-sm" onclick="DevNova.copyToClipboard((document.getElementById('output').textContent||document.getElementById('output').innerText),this)">Copy Output</button>
    </div>
    ${tool.controls||''}
  </div>
  <div class="tool-body${hasExtra?' triple':''}">
    ${hasCustom ? tool.customInput : `<div class="panel">
      <div class="panel-header"><span class="panel-label">Input</span><div class="panel-actions"><button class="btn-icon" onclick="document.getElementById('input').value='';run()">✕</button></div></div>
      <div class="panel-body"><textarea id="input" class="panel-textarea" placeholder="${(tool.placeholder||'').replace(/`/g,'\\`')}" oninput="run()" spellcheck="false"></textarea></div>
    </div>`}
    ${tool.extraPanel||''}
    <div class="panel">
      <div class="panel-header"><span class="panel-label">${tool.outputLabel||'Output'}</span><div class="panel-actions"><button class="copy-btn" onclick="DevNova.copyToClipboard((document.getElementById('output').textContent||document.getElementById('output').innerText),this)">Copy</button></div></div>
      <div class="panel-body"><div id="output" class="panel-output"></div></div>
      <div class="status-bar"><span id="status" class="badge badge-info"></span></div>
    </div>
  </div>
</main>
<script src="/assets/layout.js"></script>
<script>${tool.engine}</script>
</body>
</html>`;
}

const MISSING_TOOLS = [
// ── JSON MISSING ──────────────────────────────────────────────────────────
{id:'tree-viewer',cat:'json',name:'JSON Tree Viewer',icon:'🌳',color:'#00C896',desc:'Visualize JSON as an interactive expandable tree.',
 controls:'',placeholder:'Paste JSON to visualize...',outputLabel:'Tree View',
 engine:`function run(){const i=document.getElementById('input').value.trim();const o=document.getElementById('output');if(!i){o.innerHTML='';return}try{const p=JSON.parse(i);o.innerHTML=renderTree(p,'root',0);document.getElementById('status').textContent='Tree rendered'}catch(e){o.textContent='✗ '+e.message}}
function renderTree(v,k,d){const ind='&nbsp;'.repeat(d*4);if(v===null)return'<div>'+ind+'<span style="color:var(--text-muted)">'+k+':</span> <span style="color:var(--text-secondary)">null</span></div>';if(typeof v==='string')return'<div>'+ind+'<span style="color:var(--text-muted)">'+k+':</span> <span style="color:var(--green)">"'+v+'"</span></div>';if(typeof v==='number'||typeof v==='boolean')return'<div>'+ind+'<span style="color:var(--text-muted)">'+k+':</span> <span style="color:var(--cyan)">'+v+'</span></div>';const isArr=Array.isArray(v);const id='n'+Math.random().toString(36).slice(2);const items=Object.entries(v).map(([k2,v2])=>renderTree(v2,isArr?'['+k2+']':k2,d+1)).join('');return'<div>'+ind+'<span style="cursor:pointer;color:var(--blue);font-weight:600" onclick="const el=document.getElementById(\''+id+'\');el.style.display=el.style.display===\'none\'?\'block\':\'none\'">▾ '+k+' <span style="color:var(--text-muted);font-size:.8em">'+(isArr?'['+v.length+']':'{'+Object.keys(v).length+'}')+'</span></span><div id="'+id+'" style="border-left:2px solid var(--border);margin-left:8px">'+items+'</div></div>'}`},

{id:'path-tester',cat:'json',name:'JSON Path Tester',icon:'🎯',color:'#00C896',desc:'Test JSONPath expressions against your JSON data.',
 controls:`<div class="form-row"><div class="form-group" style="flex:1"><label>JSONPath Expression</label><input id="path" type="text" value="$.name" oninput="run()" style="width:100%"/></div></div>`,
 placeholder:'Paste JSON data...\n{"name":"Alice","age":30,"hobbies":["reading","coding"]}',outputLabel:'Path Result',
 engine:`function run(){const i=document.getElementById('input').value.trim();const p=document.getElementById('path').value.trim();const o=document.getElementById('output');if(!i||!p){o.textContent='';return}try{const data=JSON.parse(i);const result=evalPath(data,p);o.textContent=JSON.stringify(result,null,2);document.getElementById('status').textContent='Match found'}catch(e){o.textContent='✗ '+e.message;document.getElementById('status').textContent='No match'}}
function evalPath(data,path){let cur=data;const parts=path.replace(/^\$\.?/,'').split(/\.(?![^\[]*\])/);for(const p of parts){if(!p)continue;const m=p.match(/^(.+?)\[(\d+)\]$/);if(m){cur=cur[m[1]];if(cur===undefined)return'undefined';cur=cur[parseInt(m[2])]}else cur=cur[p];if(cur===undefined)return'undefined'}return cur}`},

{id:'schema-validator',cat:'json',name:'JSON Schema Validator',icon:'🔍',color:'#00C896',desc:'Validate JSON data against a JSON Schema.',
 controls:'',placeholder:'Paste JSON data to validate...',outputLabel:'Validation Result',
 extraPanel:`<div class="panel"><div class="panel-header"><span class="panel-label">JSON Schema</span></div><div class="panel-body"><textarea id="input2" class="panel-textarea" placeholder='{"type":"object","required":["name"],"properties":{"name":{"type":"string"}}}' oninput="run()" spellcheck="false"></textarea></div></div>`,
 engine:`function run(){const d=document.getElementById('input').value.trim();const s=document.getElementById('input2').value.trim();const o=document.getElementById('output');if(!d||!s){o.textContent='Enter data and schema in both panels';return}try{const data=JSON.parse(d);const schema=JSON.parse(s);const errors=validate(data,schema,'root');o.textContent=errors.length?'✗ Validation failed:\n'+errors.join('\n'):'✓ Valid — data matches schema';document.getElementById('status').className='badge badge-'+(errors.length?'error':'success');document.getElementById('status').textContent=errors.length?errors.length+' error(s)':'✓ Valid'}catch(e){o.textContent='✗ '+e.message}}
function validate(d,s,p){const e=[];if(s.type){const t=s.type;if(t==='array'&&!Array.isArray(d))e.push(p+': expected array');else if(t==='object'&&(typeof d!=='object'||Array.isArray(d)||d===null))e.push(p+': expected object');else if(t!=='array'&&t!=='object'&&typeof d!==t)e.push(p+': expected '+t+' got '+typeof d)}if(s.required&&Array.isArray(s.required))s.required.forEach(k=>{if(d===null||d===undefined||!(k in d))e.push(p+'.'+k+': required field missing')});if(s.properties&&d&&typeof d==='object')Object.keys(s.properties).forEach(k=>{if(k in d)e.push(...validate(d[k],s.properties[k],p+'.'+k))});if(s.minimum!==undefined&&d<s.minimum)e.push(p+': value '+d+' < minimum '+s.minimum);if(s.maximum!==undefined&&d>s.maximum)e.push(p+': value '+d+' > maximum '+s.maximum);if(s.minLength!==undefined&&String(d).length<s.minLength)e.push(p+': too short (min '+s.minLength+')');if(s.maxLength!==undefined&&String(d).length>s.maxLength)e.push(p+': too long (max '+s.maxLength+')');return e}`},

{id:'json-to-typescript',cat:'json',name:'JSON to TypeScript',icon:'🔷',color:'#00C896',desc:'Generate TypeScript interfaces from any JSON object.',
 controls:'',placeholder:'Paste JSON to generate TypeScript interface...',outputLabel:'TypeScript Interface',
 engine:`function run(){const i=document.getElementById('input').value.trim();const o=document.getElementById('output');if(!i){o.textContent='';return}try{const parsed=JSON.parse(i);o.textContent=genTS(parsed,'Root');document.getElementById('status').textContent='Interface generated'}catch(e){o.textContent='✗ '+e.message}}
function tsType(v,k){if(v===null)return'null';if(typeof v==='string')return'string';if(typeof v==='number')return Number.isInteger(v)?'number':'number';if(typeof v==='boolean')return'boolean';if(Array.isArray(v)){if(!v.length)return'any[]';const inner=typeof v[0]==='object'?k.charAt(0).toUpperCase()+k.slice(1)+'Item':'any';return inner+'[]'}if(typeof v==='object')return k.charAt(0).toUpperCase()+k.slice(1);return'any'}
function genTS(obj,name){if(!obj||typeof obj!=='object'||Array.isArray(obj))return'';const nested=[];const fields=Object.entries(obj).map(([k,v])=>{if(v&&typeof v==='object'&&!Array.isArray(v)){nested.push(genTS(v,k.charAt(0).toUpperCase()+k.slice(1)))}if(Array.isArray(v)&&v.length&&typeof v[0]==='object'){nested.push(genTS(v[0],k.charAt(0).toUpperCase()+k.slice(1)+'Item'))}return'  '+k+': '+tsType(v,k)+';'});return(nested.length?nested.join('\n\n')+'\n\n':'')+'interface '+name+' {\n'+fields.join('\n')+'\n}'}`},

{id:'json-to-python',cat:'json',name:'JSON to Python',icon:'🐍',color:'#00C896',desc:'Generate Python dataclass from any JSON object.',
 controls:'',placeholder:'Paste JSON to generate Python dataclass...',outputLabel:'Python Dataclass',
 engine:`function run(){const i=document.getElementById('input').value.trim();const o=document.getElementById('output');if(!i){o.textContent='';return}try{const parsed=JSON.parse(i);o.textContent='from dataclasses import dataclass\nfrom typing import List, Optional, Any\n\n'+genPy(parsed,'Root');document.getElementById('status').textContent='Dataclass generated'}catch(e){o.textContent='✗ '+e.message}}
function pyType(v,k){if(v===null)return'Optional[Any]';if(typeof v==='string')return'str';if(Number.isInteger(v))return'int';if(typeof v==='number')return'float';if(typeof v==='boolean')return'bool';if(Array.isArray(v))return'List[Any]';if(typeof v==='object')return k.charAt(0).toUpperCase()+k.slice(1);return'Any'}
function genPy(obj,name){if(!obj||typeof obj!=='object'||Array.isArray(obj))return'';const fields=Object.entries(obj).map(([k,v])=>'    '+k+': '+pyType(v,k));return'@dataclass\nclass '+name+':\n'+fields.join('\n')}`},

{id:'json-to-go',cat:'json',name:'JSON to Go Struct',icon:'🐹',color:'#00C896',desc:'Generate Go structs with JSON tags from any JSON object.',
 controls:'',placeholder:'Paste JSON to generate Go struct...',outputLabel:'Go Struct',
 engine:`function run(){const i=document.getElementById('input').value.trim();const o=document.getElementById('output');if(!i){o.textContent='';return}try{const parsed=JSON.parse(i);o.textContent=genGo(parsed,'Root');document.getElementById('status').textContent='Struct generated'}catch(e){o.textContent='✗ '+e.message}}
function goType(v,k){if(v===null)return'interface{}';if(typeof v==='string')return'string';if(Number.isInteger(v))return'int';if(typeof v==='number')return'float64';if(typeof v==='boolean')return'bool';if(Array.isArray(v))return'[]interface{}';if(typeof v==='object')return k.charAt(0).toUpperCase()+k.slice(1);return'interface{}'}
function genGo(obj,name){if(!obj||typeof obj!=='object'||Array.isArray(obj))return'';const fields=Object.entries(obj).map(([k,v])=>{const pascal=k.charAt(0).toUpperCase()+k.slice(1);return'\t'+pascal+' '+goType(v,k)+' \`json:"'+k+'"\`'});return'type '+name+' struct {\n'+fields.join('\n')+'\n}'}`},

{id:'json-to-csharp',cat:'json',name:'JSON to C# Class',icon:'#️⃣',color:'#00C896',desc:'Generate C# classes with properties from any JSON object.',
 controls:'',placeholder:'Paste JSON to generate C# class...',outputLabel:'C# Class',
 engine:`function run(){const i=document.getElementById('input').value.trim();const o=document.getElementById('output');if(!i){o.textContent='';return}try{const parsed=JSON.parse(i);o.textContent='using System;\nusing System.Collections.Generic;\n\n'+genCS(parsed,'Root');document.getElementById('status').textContent='Class generated'}catch(e){o.textContent='✗ '+e.message}}
function csType(v,k){if(v===null)return'string?';if(typeof v==='string')return'string';if(Number.isInteger(v))return'int';if(typeof v==='number')return'double';if(typeof v==='boolean')return'bool';if(Array.isArray(v))return'List<object>';if(typeof v==='object')return k.charAt(0).toUpperCase()+k.slice(1);return'object'}
function genCS(obj,name){if(!obj||typeof obj!=='object'||Array.isArray(obj))return'';const props=Object.entries(obj).map(([k,v])=>{const pascal=k.charAt(0).toUpperCase()+k.slice(1);return'    public '+csType(v,k)+' '+pascal+' { get; set; }'});return'public class '+name+'\n{\n'+props.join('\n')+'\n}'}`},

{id:'xml-to-json',cat:'json',name:'XML to JSON',icon:'🔁',color:'#00C896',desc:'Convert XML to JSON format using the browser DOM parser.',
 controls:'',placeholder:'Paste XML here...\n<user><name>Alice</name><age>30</age></user>',outputLabel:'JSON Output',
 engine:`function run(){const i=document.getElementById('input').value.trim();const o=document.getElementById('output');if(!i){o.textContent='';return}try{const doc=(new DOMParser()).parseFromString(i,'text/xml');const err=doc.querySelector('parsererror');if(err){o.textContent='✗ Invalid XML';return}o.textContent=JSON.stringify(xmlToObj(doc.documentElement),null,2);document.getElementById('status').textContent='Converted'}catch(e){o.textContent='✗ '+e.message}}
function xmlToObj(node){if(node.nodeType===3)return node.textContent.trim();const obj={};if(node.attributes&&node.attributes.length)[...node.attributes].forEach(a=>obj['@'+a.name]=a.value);const children=[...node.childNodes].filter(n=>n.nodeType!==3||n.textContent.trim());if(!children.length){const t=node.textContent.trim();return t||null}children.forEach(c=>{if(c.nodeType===3){obj['#text']=c.textContent.trim()}else{const k=c.tagName;const v=xmlToObj(c);if(obj[k]){if(!Array.isArray(obj[k]))obj[k]=[obj[k]];obj[k].push(v)}else obj[k]=v}});return obj}`},

{id:'json-to-xml',cat:'json',name:'JSON to XML',icon:'🔁',color:'#00C896',desc:'Convert JSON to XML format.',
 controls:'',placeholder:'Paste JSON here...',outputLabel:'XML Output',
 engine:`function run(){const i=document.getElementById('input').value.trim();const o=document.getElementById('output');if(!i){o.textContent='';return}try{o.textContent='<?xml version="1.0" encoding="UTF-8"?>\n'+toXML(JSON.parse(i),'root',0);document.getElementById('status').textContent='Converted'}catch(e){o.textContent='✗ '+e.message}}
function toXML(v,tag,d){const ind='  '.repeat(d);if(v===null||typeof v!=='object')return ind+'<'+tag+'>'+v+'</'+tag+'>';if(Array.isArray(v))return v.map(item=>toXML(item,tag,d)).join('\n');const inner=Object.entries(v).map(([k,val])=>toXML(val,k,d+1)).join('\n');return ind+'<'+tag+'>\n'+inner+'\n'+ind+'</'+tag+'>'}`},

// ── API MISSING ───────────────────────────────────────────────────────────
{id:'jwt-generator',cat:'api',name:'JWT Generator',icon:'🔑',color:'#0066FF',desc:'Generate signed JWT tokens with custom payload for testing.',
 controls:`<div class="form-row"><div class="form-group" style="flex:1"><label>Secret Key</label><input id="secret" type="text" value="your-secret-key" style="width:100%"/></div><div class="form-group"><label>Algorithm</label><select id="alg"><option>HS256</option><option>HS384</option><option>HS512</option></select></div></div>
 <button class="btn btn-primary btn-sm" onclick="generate()">Generate JWT</button>`,
 placeholder:'{"sub":"1234567890","name":"John Doe","iat":1516239022}',outputLabel:'Generated JWT',
 engine:`async function run(){}
async function generate(){
  const payload=document.getElementById('input').value.trim();const secret=document.getElementById('secret').value;const alg=document.getElementById('alg').value;const o=document.getElementById('output');
  try{
    const header=btoa(JSON.stringify({alg,typ:'JWT'})).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
    const pl=btoa(JSON.stringify(JSON.parse(payload||'{}'))).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
    const sigInput=header+'.'+pl;
    const algoMap={'HS256':'SHA-256','HS384':'SHA-384','HS512':'SHA-512'};
    const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:algoMap[alg]},false,['sign']);
    const sig=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(sigInput));
    const sigB64=btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
    o.textContent=sigInput+'.'+sigB64;
    document.getElementById('status').textContent='JWT generated';
  }catch(e){o.textContent='✗ '+e.message}
}`},

{id:'hmac-generator',cat:'api',name:'HMAC Generator',icon:'🛡️',color:'#0066FF',desc:'Generate HMAC signatures for message authentication.',
 controls:`<div class="form-row"><div class="form-group" style="flex:1"><label>Secret Key</label><input id="secret" type="text" placeholder="Enter secret key..." style="width:100%"/></div><div class="form-group"><label>Algorithm</label><select id="algo"><option value="SHA-256">SHA-256</option><option value="SHA-512">SHA-512</option><option value="SHA-1">SHA-1</option></select></div></div>`,
 placeholder:'Enter message to sign...',outputLabel:'HMAC Signature',
 engine:`async function run(){const msg=document.getElementById('input').value;const key=document.getElementById('secret').value;const algo=document.getElementById('algo').value;const o=document.getElementById('output');if(!msg||!key){o.textContent='Enter message and key';return}try{const k=await crypto.subtle.importKey('raw',new TextEncoder().encode(key),{name:'HMAC',hash:algo},false,['sign']);const sig=await crypto.subtle.sign('HMAC',k,new TextEncoder().encode(msg));o.textContent=[...new Uint8Array(sig)].map(b=>b.toString(16).padStart(2,'0')).join('');document.getElementById('status').textContent='HMAC-'+algo+' generated'}catch(e){o.textContent='✗ '+e.message}}`},

{id:'uuid-parser',cat:'api',name:'UUID Parser',icon:'🔎',color:'#0066FF',desc:'Parse a UUID and extract its version, variant and components.',
 controls:'',placeholder:'Paste UUID here...\n550e8400-e29b-41d4-a716-446655440000',outputLabel:'UUID Details',
 engine:`function run(){const i=document.getElementById('input').value.trim();const o=document.getElementById('output');if(!i){o.textContent='';return}const re=/^[0-9a-f]{8}-[0-9a-f]{4}-([0-9a-f])[0-9a-f]{3}-([89ab])[0-9a-f]{3}-[0-9a-f]{12}$/i;const m=i.match(re);if(!m){o.textContent='✗ Not a valid UUID format';return}const ver=m[1];const parts=i.split('-');o.textContent='UUID: '+i+'\nVersion: '+ver+'\nVariant: RFC 4122\n\nParts:\n  time_low:            '+parts[0]+'\n  time_mid:            '+parts[1]+'\n  time_hi_and_version: '+parts[2]+'\n  clock_seq:           '+parts[3]+'\n  node:                '+parts[4];document.getElementById('status').textContent='v'+ver+' UUID'}`},

{id:'cors-checker',cat:'api',name:'CORS Checker',icon:'🔗',color:'#0066FF',desc:'Test CORS and understand cross-origin request errors.',
 controls:`<div class="form-row"><div class="form-group" style="flex:1"><label>URL to Test</label><input id="url" type="text" placeholder="https://api.example.com/endpoint" style="width:100%"/></div><button class="btn btn-primary btn-sm" onclick="testCORS()" style="margin-top:20px">Test CORS</button></div>`,
 placeholder:'Or paste a CORS error message to analyze...',outputLabel:'CORS Analysis',
 engine:`function run(){if(document.getElementById('input').value.trim())analyze()}
async function testCORS(){const url=document.getElementById('url').value.trim();const o=document.getElementById('output');if(!url){o.textContent='Enter a URL to test';return}o.textContent='Testing CORS...';try{const r=await fetch(url,{mode:'cors'});o.textContent='✓ CORS request succeeded!\n\nStatus: '+r.status+'\nURL: '+r.url;document.getElementById('status').className='badge badge-success';document.getElementById('status').textContent='✓ CORS OK'}catch(e){o.textContent='✗ CORS blocked\n\nError: '+e.message+'\n\nCommon fixes:\n1. Add Access-Control-Allow-Origin: * header on server\n2. Use a proxy in development\n3. Check preflight OPTIONS request\n4. Verify allowed methods and headers\n\nExpress.js fix:\n  npm install cors\n  app.use(require("cors")())';document.getElementById('status').className='badge badge-error';document.getElementById('status').textContent='✗ CORS blocked'}}
function analyze(){const i=document.getElementById('input').value.trim();if(!i)return;document.getElementById('output').textContent='Analyzing CORS error...\n\nLikely cause: Server missing Access-Control-Allow-Origin header\n\nFix by adding to your server response:\n  Access-Control-Allow-Origin: *\n  Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS\n  Access-Control-Allow-Headers: Content-Type, Authorization'}`},

{id:'ssl-decoder',cat:'api',name:'SSL Certificate Decoder',icon:'🔓',color:'#0066FF',desc:'Check SSL certificate information for any domain.',
 controls:`<div class="form-row"><div class="form-group" style="flex:1"><label>Domain</label><input id="domain" type="text" placeholder="e.g. google.com" style="width:100%"/></div><button class="btn btn-primary btn-sm" onclick="checkSSL()" style="margin-top:20px">Check SSL</button></div>`,
 placeholder:'',outputLabel:'SSL Certificate Info',
 engine:`function run(){}
async function checkSSL(){const d=document.getElementById('domain').value.trim().replace(/^https?:\/\//,'');const o=document.getElementById('output');if(!d){o.textContent='Enter a domain name';return}o.textContent='Checking SSL for '+d+'...';try{const r=await fetch('https://'+d,{mode:'no-cors'});o.textContent='Domain: '+d+'\nHTTPS: ✓ Accessible\n\nFor full certificate details use:\nhttps://www.ssllabs.com/ssltest/analyze.html?d='+d+'\n\nOr run in terminal:\nopenssl s_client -connect '+d+':443 -showcerts'}catch(e){o.textContent='Domain: '+d+'\n\nFull SSL inspection requires server-side access.\n\nQuick options:\n• https://www.ssllabs.com/ssltest/analyze.html?d='+d+'\n• https://crt.sh/?q='+d+'\n\nTerminal:\nopenssl s_client -connect '+d+':443'}}`},

{id:'http-headers',cat:'api',name:'HTTP Header Analyzer',icon:'📡',color:'#0066FF',desc:'Complete reference for common HTTP request and response headers.',
 controls:'',placeholder:'Search header name or description...',outputLabel:'Header Reference',
 engine:`const HEADERS={
  'Accept':'Tells server what content types the client can handle. e.g. application/json, text/html',
  'Authorization':'Authentication credentials for the request. e.g. Bearer <token> or Basic <base64>',
  'Content-Type':'Media type of the request/response body. e.g. application/json, multipart/form-data',
  'Cache-Control':'Directives for caching. e.g. no-cache, max-age=3600, public, private',
  'Access-Control-Allow-Origin':'CORS header — which origins can access the resource. e.g. * or https://example.com',
  'ETag':'Identifier for a specific version of a resource, used for cache validation',
  'X-Request-ID':'Unique identifier for tracing requests through distributed systems',
  'Strict-Transport-Security':'Force HTTPS connections (HSTS). e.g. max-age=31536000; includeSubDomains',
  'Content-Security-Policy':'Prevent XSS by controlling resources the browser can load',
  'X-Frame-Options':'Prevent clickjacking. Values: DENY, SAMEORIGIN, ALLOW-FROM uri',
  'Accept-Encoding':'Compression formats the client accepts. e.g. gzip, deflate, br',
  'User-Agent':'Client software making the request',
  'Cookie':'HTTP cookies sent by the client to the server',
  'Set-Cookie':'Server directive to store a cookie on the client',
  'Location':'Redirect URL used in 3xx responses',
  'Retry-After':'How long to wait before retrying a rate-limited or unavailable request',
  'X-Content-Type-Options':'Prevent MIME sniffing. Value: nosniff',
  'Referrer-Policy':'Controls how much referrer info is sent. e.g. strict-origin-when-cross-origin',
  'Permissions-Policy':'Control browser features. e.g. camera=(), microphone=()',
  'Last-Modified':'Date/time the resource was last modified',
  'If-Modified-Since':'Return resource only if modified since this date (conditional GET)',
  'Vary':'Tells caches which request headers affect the response',
  'Transfer-Encoding':'Encoding used to transfer the body. e.g. chunked',
  'Connection':'Options for the current connection. e.g. keep-alive, close',
  'WWW-Authenticate':'Authentication scheme required. e.g. Bearer realm="api"',
};
function run(){const q=document.getElementById('input').value.trim().toLowerCase();const o=document.getElementById('output');const matches=Object.entries(HEADERS).filter(([k,v])=>!q||k.toLowerCase().includes(q)||v.toLowerCase().includes(q));o.textContent=matches.map(([k,v])=>k+'\n  '+v).join('\n\n');document.getElementById('status').textContent=matches.length+' header(s)'}`},

// ── TEXT MISSING ──────────────────────────────────────────────────────────
{id:'regex-generator',cat:'text',name:'Regex Generator',icon:'🤖',color:'#7B61FF',desc:'Generate common regular expressions from plain English descriptions.',
 controls:'',placeholder:'Describe what you want to match...\ne.g. "email", "phone number", "URL", "IPv4", "hex color", "date", "UUID"',outputLabel:'Generated Regex',
 engine:`const P={
  email:{p:'/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/',d:'Matches email addresses'},
  phone:{p:'/^[+]?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4,6}$/',d:'Matches phone numbers'},
  url:{p:'/https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/',d:'Matches URLs'},
  ipv4:{p:'/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/',d:'Matches IPv4 addresses'},
  'hex color':{p:'/^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/',d:'Matches hex color codes'},
  date:{p:'/^(19|20)\\d\\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/',d:'Matches dates YYYY-MM-DD'},
  zip:{p:'/^\\d{5}(-\\d{4})?$/',d:'Matches US ZIP codes'},
  uuid:{p:'/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i',d:'Matches UUIDs'},
  password:{p:'/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$/',d:'Strong password: 8+ chars, upper, lower, number'},
  username:{p:'/^[a-zA-Z0-9_-]{3,16}$/',d:'Alphanumeric username 3-16 chars'},
  number:{p:'/^-?\\d+(\\.\\d+)?$/',d:'Matches integers and decimals'},
  slug:{p:'/^[a-z0-9]+(?:-[a-z0-9]+)*$/',d:'Matches URL slugs'},
  'credit card':{p:'/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})$/',d:'Matches major credit card numbers'},
  'ip address':{p:'/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/',d:'IPv4 address'},
};
function run(){const q=document.getElementById('input').value.trim().toLowerCase();const o=document.getElementById('output');if(!q){o.textContent='Available: '+Object.keys(P).join(', ');return}const match=Object.entries(P).find(([k])=>q.includes(k)||k.includes(q));if(match){o.textContent='Pattern: '+match[1].p+'\nDescription: '+match[1].d+'\n\nJavaScript usage:\nconst regex = '+match[1].p+';\nconst isValid = regex.test(input);\nconst matches = input.match(regex);';document.getElementById('status').textContent='✓ Pattern found'}else{o.textContent='No predefined pattern for "'+q+'"\n\nTry: '+Object.keys(P).join(', ')+'\n\nOr use the Regex Tester to build your own';document.getElementById('status').textContent='Not found'}}`},

{id:'xpath-tester',cat:'text',name:'XPath Tester',icon:'🎯',color:'#7B61FF',desc:'Test XPath expressions against XML documents.',
 controls:`<div class="form-row"><div class="form-group" style="flex:1"><label>XPath Expression</label><input id="xpath" type="text" value="//book/title" oninput="run()" style="width:100%"/></div></div>`,
 placeholder:'Paste XML here...\n<books>\n  <book><title>Alice in Wonderland</title></book>\n  <book><title>Moby Dick</title></book>\n</books>',outputLabel:'XPath Results',
 engine:`function run(){const xml=document.getElementById('input').value.trim();const xpath=document.getElementById('xpath').value.trim();const o=document.getElementById('output');if(!xml||!xpath){o.textContent='';return}try{const doc=(new DOMParser()).parseFromString(xml,'text/xml');const err=doc.querySelector('parsererror');if(err){o.textContent='✗ Invalid XML: '+err.textContent;return}const result=doc.evaluate(xpath,doc,null,XPathResult.ANY_TYPE,null);const nodes=[];let node=result.iterateNext();while(node){nodes.push(node.textContent||node.nodeValue||node.name);node=result.iterateNext()}if(!nodes.length){o.textContent='No matches found for: '+xpath}else{o.textContent=nodes.length+' result(s):\n\n'+nodes.join('\n')}document.getElementById('status').textContent=nodes.length+' result(s)'}catch(e){o.textContent='✗ '+e.message}}`},

{id:'html-to-markdown',cat:'text',name:'HTML to Markdown',icon:'🔄',color:'#7B61FF',desc:'Convert HTML markup to clean Markdown format.',
 controls:'',placeholder:'Paste HTML here...',outputLabel:'Markdown Output',
 engine:`function run(){const i=document.getElementById('input').value.trim();const o=document.getElementById('output');if(!i){o.textContent='';return}let m=i.replace(/<h1[^>]*>(.*?)<\/h1>/gi,'# $1\n').replace(/<h2[^>]*>(.*?)<\/h2>/gi,'## $1\n').replace(/<h3[^>]*>(.*?)<\/h3>/gi,'### $1\n').replace(/<h4[^>]*>(.*?)<\/h4>/gi,'#### $1\n').replace(/<strong[^>]*>(.*?)<\/strong>/gi,'**$1**').replace(/<b[^>]*>(.*?)<\/b>/gi,'**$1**').replace(/<em[^>]*>(.*?)<\/em>/gi,'*$1*').replace(/<i[^>]*>(.*?)<\/i>/gi,'*$1*').replace(/<code[^>]*>(.*?)<\/code>/gi,'`$1`').replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi,'[$2]($1)').replace(/<li[^>]*>(.*?)<\/li>/gi,'- $1\n').replace(/<br\s*\/?>/gi,'\n').replace(/<p[^>]*>(.*?)<\/p>/gi,'$1\n\n').replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&nbsp;/g,' ').replace(/\n{3,}/g,'\n\n').trim();o.textContent=m;document.getElementById('status').textContent='Converted to Markdown'}`},

{id:'markdown-to-html',cat:'text',name:'Markdown to HTML',icon:'🔄',color:'#7B61FF',desc:'Convert Markdown to clean HTML output.',
 controls:'',placeholder:'Paste Markdown here...',outputLabel:'HTML Output',
 engine:`function run(){const i=document.getElementById('input').value;const o=document.getElementById('output');if(!i){o.textContent='';return}let h=i.replace(/^### (.+)$/gm,'<h3>$1</h3>').replace(/^## (.+)$/gm,'<h2>$1</h2>').replace(/^# (.+)$/gm,'<h1>$1</h1>').replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*(.+?)\*/g,'<em>$1</em>').replace(/```([\s\S]*?)```/g,'<pre><code>$1</code></pre>').replace(/`(.+?)`/g,'<code>$1</code>').replace(/^> (.+)$/gm,'<blockquote>$1</blockquote>').replace(/^- (.+)$/gm,'<li>$1</li>').replace(/\[(.+?)\]\((.+?)\)/g,'<a href="$2">$1</a>').replace(/\n\n/g,'\n<br>\n');o.textContent=h;document.getElementById('status').textContent='Converted to HTML'}`},

{id:'html-entities',cat:'text',name:'HTML Entity Encoder',icon:'&',color:'#7B61FF',desc:'Encode text to HTML entities or decode HTML entities to plain text.',
 controls:`<div class="form-row"><button class="btn btn-primary btn-sm" onclick="encode()">Encode →</button><button class="btn btn-secondary btn-sm" onclick="decode()">← Decode</button></div>`,
 placeholder:'Enter text or HTML entities...',outputLabel:'Result',
 engine:`function run(){encode()}function encode(){const i=document.getElementById('input').value;document.getElementById('output').textContent=i.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');setS('success','Encoded')}function decode(){const d=document.createElement('div');d.innerHTML=document.getElementById('input').value;document.getElementById('output').textContent=d.textContent;setS('success','Decoded')}function setS(t,m){const s=document.getElementById('status');s.className='badge badge-'+t;s.textContent=m}`},

{id:'text-escape',cat:'text',name:'Text Escape/Unescape',icon:'\\\\',color:'#7B61FF',desc:'Escape or unescape special characters in strings.',
 controls:`<div class="form-row"><button class="btn btn-primary btn-sm" onclick="escapeText()">Escape →</button><button class="btn btn-secondary btn-sm" onclick="unescapeText()">← Unescape</button></div>`,
 placeholder:'Enter text to escape or unescape...',outputLabel:'Result',
 engine:`function run(){escapeText()}function escapeText(){const i=document.getElementById('input').value;document.getElementById('output').textContent=i.replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/\r/g,'\\r').replace(/\t/g,'\\t').replace(/"/g,'\\"');setS('success','Escaped')}function unescapeText(){try{document.getElementById('output').textContent=JSON.parse('"'+document.getElementById('input').value+'"');setS('success','Unescaped')}catch(e){setS('error','Invalid escape sequences')}}function setS(t,m){const s=document.getElementById('status');s.className='badge badge-'+t;s.textContent=m}`},

{id:'base-converter',cat:'text',name:'Number Base Converter',icon:'🔢',color:'#7B61FF',desc:'Convert numbers between decimal, binary, octal and hexadecimal.',
 controls:`<div class="form-row"><div class="form-group"><label>Input Base</label><select id="from" onchange="run()"><option value="10">Decimal (10)</option><option value="2">Binary (2)</option><option value="8">Octal (8)</option><option value="16">Hex (16)</option></select></div></div>`,
 placeholder:'Enter number to convert...\ne.g. 255',outputLabel:'All Bases',
 engine:`function run(){const i=document.getElementById('input').value.trim();const o=document.getElementById('output');if(!i){o.textContent='';return}try{const from=parseInt(document.getElementById('from').value);const dec=parseInt(i,from);if(isNaN(dec)){o.textContent='✗ Invalid number for base '+from;return}o.textContent=['Decimal  (10): '+dec,'Binary    (2): '+dec.toString(2),'Octal     (8): '+dec.toString(8),'Hex      (16): '+dec.toString(16).toUpperCase(),'Base 32      : '+dec.toString(32)].join('\n')}catch(e){o.textContent='✗ '+e.message}}`},

{id:'unicode-lookup',cat:'text',name:'Unicode Lookup',icon:'Ω',color:'#7B61FF',desc:'Look up Unicode code points and character info for any text.',
 controls:'',placeholder:'Enter characters to look up...\ne.g. Hello 🌍 or any Unicode text',outputLabel:'Unicode Details',
 engine:`function run(){const i=document.getElementById('input').value;const o=document.getElementById('output');if(!i){o.textContent='';return}const chars=[...i].slice(0,50).map(c=>{const cp=c.codePointAt(0);const hex='U+'+cp.toString(16).toUpperCase().padStart(4,'0');return hex.padEnd(10)+c.padEnd(5)+'HTML: &#'+cp+';  JS: \\u'+cp.toString(16).padStart(4,'0')});o.textContent='Point     Char  HTML       Escape\n'+'-'.repeat(44)+'\n'+chars.join('\n');document.getElementById('status').textContent=[...i].length+' characters'}`},

// ── DEVOPS MISSING ────────────────────────────────────────────────────────
{id:'cron-tester',cat:'devops',name:'Cron Expression Tester',icon:'🧪',color:'#FF6B35',desc:'Test a cron expression and get a human-readable description.',
 controls:'',placeholder:'Enter cron expression...\ne.g. 0 9 * * 1-5',outputLabel:'Cron Description',
 engine:`function run(){const i=document.getElementById('input').value.trim();const o=document.getElementById('output');if(!i){o.textContent='';return}const parts=i.split(/\s+/);if(parts.length!==5){o.textContent='✗ Cron expression needs exactly 5 parts:\nminute hour day-of-month month day-of-week';return}const[min,hour,dom,mon,dow]=parts;const valid=p=>/^[\d*/,\-]+$/.test(p);if(!parts.every(valid)){o.textContent='✗ Invalid characters in expression';return}const desc=describe(min,hour,dom,mon,dow);o.textContent='Expression: '+i+'\n\nDescription: '+desc+'\n\nPart breakdown:\n  Minute:       '+min+'\n  Hour:         '+hour+'\n  Day of month: '+dom+'\n  Month:        '+mon+'\n  Day of week:  '+dow+'\n\nSpecial chars:\n  * = any value\n  , = list (1,3,5)\n  - = range (1-5)\n  / = step (*/2)';document.getElementById('status').textContent='Valid'}
function describe(min,hour,dom,mon,dow){const presets={'* * * * *':'Every minute','0 * * * *':'Every hour','0 0 * * *':'Every day at midnight','0 0 * * 0':'Every Sunday','0 0 1 * *':'First day of month','0 9 * * 1-5':'Weekdays at 9 AM','*/5 * * * *':'Every 5 minutes','*/15 * * * *':'Every 15 minutes','0 12 * * *':'Every day at noon','0 0 * * 1':'Every Monday'};return presets[min+' '+hour+' '+dom+' '+mon+' '+dow]||'Custom schedule — at minute '+min+(hour!=='*'?' of hour '+hour:''+(dom!=='*'?' on day '+dom:''))}`},

{id:'xml-formatter',cat:'devops',name:'XML Formatter',icon:'📋',color:'#FF6B35',desc:'Format and prettify XML with proper indentation.',
 controls:`<div class="form-row"><div class="form-group"><label>Indent</label><select id="indent" onchange="run()"><option value="2">2 spaces</option><option value="4">4 spaces</option></select></div></div>`,
 placeholder:'Paste XML to format...',outputLabel:'Formatted XML',
 engine:`function run(){const i=document.getElementById('input').value.trim();const o=document.getElementById('output');if(!i){o.textContent='';return}try{const parser=new DOMParser();const doc=parser.parseFromString(i,'text/xml');const err=doc.querySelector('parsererror');if(err){o.textContent='✗ Invalid XML: '+err.textContent.substring(0,100);return}const indent=parseInt(document.getElementById('indent').value)||2;const PAD=' '.repeat(indent);let formatted='';let depth=0;const ser=new XMLSerializer().serializeToString(doc);ser.replace(/>\\s+</g,'><').split(/(<[^>]+>)/).filter(n=>n.trim()).forEach(node=>{if(node.match(/^<\//)){depth--;formatted+=PAD.repeat(depth)+node+'\\n'}else if(node.match(/^<[^!?/][^>]*[^/]>$/)){formatted+=PAD.repeat(depth)+node+'\\n';depth++}else if(node.match(/^<[^!?][^>]*\/>$/)){formatted+=PAD.repeat(depth)+node+'\\n'}else if(node.trim()){formatted+=PAD.repeat(depth)+node.trim()+'\\n'}});o.textContent=formatted.trim();document.getElementById('status').className='badge badge-success';document.getElementById('status').textContent='✓ Valid XML'}catch(e){o.textContent='✗ '+e.message}}`},

{id:'dockerfile',cat:'devops',name:'Dockerfile Linter',icon:'🐳',color:'#FF6B35',desc:'Lint Dockerfile for best practices and common issues.',
 controls:'',placeholder:'Paste Dockerfile here...\nFROM node:18\nWORKDIR /app\nCOPY . .\nRUN npm install\nCMD ["node","index.js"]',outputLabel:'Lint Results',
 engine:`const RULES=[
  {re:/^FROM.+:latest/i,msg:'Avoid :latest tag — pin to a specific version for reproducible builds',level:'warning'},
  {re:/^RUN apt-get install(?!.*-y)/i,msg:'Add -y flag to avoid interactive prompts: apt-get install -y',level:'error'},
  {re:/^RUN apt-get update[^&\n]/i,msg:'Combine apt-get update with install in one RUN to avoid cache issues',level:'warning'},
  {re:/^ADD /i,msg:'Use COPY instead of ADD unless you need tar extraction or URL support',level:'info'},
  {re:/^RUN npm install(?!.*--production|.*ci)/i,msg:'Consider npm ci for reproducible installs in CI/CD',level:'info'},
  {re:/EXPOSE 22/i,msg:'Exposing SSH port 22 is a security risk in containers',level:'warning'},
  {re:/^ENV .+ .+/i,msg:'Use ENV KEY=VALUE format (with =) for clarity',level:'info'},
];
function run(){const i=document.getElementById('input').value.trim();const o=document.getElementById('output');if(!i){o.textContent='';return}const lines=i.split('\\n');const issues=[];lines.forEach((line,idx)=>{RULES.forEach(r=>{if(r.re.test(line.trim()))issues.push('['+r.level.toUpperCase()+'] Line '+(idx+1)+': '+r.msg)})});if(!lines.some(l=>l.trim().startsWith('USER')))issues.push('[INFO] Consider adding USER instruction to avoid running as root');if(!lines.some(l=>l.trim().startsWith('HEALTHCHECK')))issues.push('[INFO] Consider adding HEALTHCHECK for container health monitoring');o.textContent=issues.length?issues.join('\\n'):'✓ No issues found — Dockerfile looks good!';document.getElementById('status').className='badge badge-'+(issues.some(i=>i.includes('ERROR'))?'error':issues.length?'warning':'success');document.getElementById('status').textContent=issues.length+' issue(s)'}`},

{id:'k8s-validator',cat:'devops',name:'Kubernetes YAML Validator',icon:'☸️',color:'#FF6B35',desc:'Validate Kubernetes manifests for required fields and best practices.',
 controls:'',placeholder:'Paste Kubernetes YAML here...',outputLabel:'Validation Result',
 engine:`function run(){const i=document.getElementById('input').value.trim();const o=document.getElementById('output');if(!i){o.textContent='';return}const issues=[];if(!i.includes('apiVersion:'))issues.push('✗ Missing required: apiVersion');if(!i.includes('kind:'))issues.push('✗ Missing required: kind');if(!i.includes('metadata:'))issues.push('✗ Missing required: metadata');if(!i.includes('name:'))issues.push('⚠️ Missing metadata.name');if(i.includes(':latest'))issues.push('⚠️ Avoid :latest image tag in production');if(i.includes('privileged: true'))issues.push('⚠️ Privileged container — security risk');if(!i.includes('limits:')&&!i.includes('requests:'))issues.push('ℹ️ No resource limits/requests defined');if(!i.includes('livenessProbe')&&!i.includes('readinessProbe'))issues.push('ℹ️ No health probes defined');const kind=(i.match(/kind:\s*(\S+)/)||[])[1]||'unknown';const namespace=(i.match(/namespace:\s*(\S+)/)||[])[1]||'default';o.textContent=(issues.length?issues.join('\\n'):'✓ No critical issues found')+'\n\nKind: '+kind+'\nNamespace: '+namespace;document.getElementById('status').className='badge badge-'+(issues.some(x=>x.startsWith('✗'))?'error':issues.length?'warning':'success');document.getElementById('status').textContent=issues.length+' issue(s)'}`},

{id:'env-editor',cat:'devops',name:'Environment Variable Editor',icon:'🔧',color:'#FF6B35',desc:'Parse, edit and validate .env files. Convert between .env and JSON.',
 controls:`<div class="form-row"><button class="btn btn-secondary btn-sm" onclick="toJSON()">→ JSON</button><button class="btn btn-ghost btn-sm" onclick="fromJSON()">JSON → .env</button></div>`,
 placeholder:'Paste .env contents here...\nDB_HOST=localhost\nDB_PORT=5432\nAPI_KEY=your-secret-key\n# This is a comment',outputLabel:'Parsed Output',
 engine:`function run(){}
function toJSON(){const i=document.getElementById('input').value.trim();const vars={};i.split('\\n').forEach(line=>{line=line.trim();if(!line||line.startsWith('#'))return;const idx=line.indexOf('=');if(idx<0)return;const key=line.slice(0,idx).trim();const val=line.slice(idx+1).trim().replace(/^['"]|['"]$/g,'');vars[key]=val});document.getElementById('output').textContent=JSON.stringify(vars,null,2);document.getElementById('status').textContent=Object.keys(vars).length+' variables'}
function fromJSON(){try{const obj=JSON.parse(document.getElementById('input').value);document.getElementById('output').textContent=Object.entries(obj).map(([k,v])=>k+'='+v).join('\\n');document.getElementById('status').textContent='Converted to .env'}catch(e){document.getElementById('output').textContent='✗ Invalid JSON input'}}`},

{id:'nginx-config',cat:'devops',name:'Nginx Config Generator',icon:'🌐',color:'#FF6B35',desc:'Generate Nginx server configurations for common setups.',
 controls:`<div class="form-row">
  <div class="form-group"><label>Type</label><select id="type" onchange="generate()"><option value="static">Static Site</option><option value="proxy">Reverse Proxy</option><option value="spa">SPA (React/Vue)</option></select></div>
  <div class="form-group" style="flex:1"><label>Domain</label><input id="domain" type="text" value="example.com" oninput="generate()" style="width:100%"/></div>
 </div>
 <div class="form-row"><div class="form-group" style="flex:1"><label>Root / Proxy Target</label><input id="root" type="text" value="/var/www/html" oninput="generate()" style="width:100%"/></div></div>`,
 placeholder:'',outputLabel:'Nginx Config',
 engine:`function run(){}
function generate(){const type=document.getElementById('type').value;const domain=document.getElementById('domain').value||'example.com';const root=document.getElementById('root').value||'/var/www/html';const configs={static:'server {\n    listen 80;\n    server_name '+domain+' www.'+domain+';\n    root '+root+';\n    index index.html;\n\n    location / {\n        try_files $uri $uri/ =404;\n    }\n\n    # Redirect to HTTPS\n    return 301 https://$host$request_uri;\n}',proxy:'server {\n    listen 80;\n    server_name '+domain+';\n\n    location / {\n        proxy_pass '+root+';\n        proxy_http_version 1.1;\n        proxy_set_header Upgrade $http_upgrade;\n        proxy_set_header Connection "upgrade";\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n        proxy_cache_bypass $http_upgrade;\n    }\n}',spa:'server {\n    listen 80;\n    server_name '+domain+';\n    root '+root+';\n    index index.html;\n\n    location / {\n        try_files $uri $uri/ /index.html;\n    }\n\n    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {\n        expires 1y;\n        add_header Cache-Control "public, immutable";\n    }\n}'};document.getElementById('output').textContent=configs[type];document.getElementById('status').textContent='Config generated'}
document.addEventListener('DOMContentLoaded',generate)`},

{id:'log-parser',cat:'devops',name:'Log Parser',icon:'📊',color:'#FF6B35',desc:'Parse and analyze log files to find errors and patterns.',
 controls:`<div class="form-row"><div class="form-group"><label>Log Format</label><select id="format" onchange="run()"><option value="auto">Auto Detect</option><option value="nginx">Nginx</option><option value="apache">Apache</option><option value="json">JSON Logs</option></select></div></div>`,
 placeholder:'Paste log content here...',outputLabel:'Log Analysis',
 engine:`function run(){const i=document.getElementById('input').value.trim();const o=document.getElementById('output');if(!i){o.textContent='';return}const lines=i.split('\\n').filter(l=>l.trim());const errors=lines.filter(l=>/error|ERROR|ERR|\\b500\\b|\\b502\\b|\\b503\\b/i.test(l));const warns=lines.filter(l=>/warn|WARN|\\b400\\b|\\b401\\b|\\b403\\b|\\b404\\b/i.test(l));const ips=[...new Set(lines.map(l=>{const m=l.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/);return m?m[0]:null}).filter(Boolean))];o.textContent=['Summary','───────','Total lines: '+lines.length,'Errors: '+errors.length,'Warnings: '+warns.length,'Unique IPs: '+ips.length,'','Top Errors (first 5):','───────────────────',...(errors.slice(0,5).length?errors.slice(0,5):['None found']),'','Top Warnings (first 5):','──────────────────────',...(warns.slice(0,5).length?warns.slice(0,5):['None found']),'','IP Addresses:','─────────────',...(ips.slice(0,10).length?ips.slice(0,10):['None found'])].join('\\n');document.getElementById('status').textContent=errors.length+' errors, '+warns.length+' warnings'}`},

{id:'curl-generator',cat:'devops',name:'cURL Command Generator',icon:'💻',color:'#FF6B35',desc:'Build cURL commands visually from method, URL, headers and body.',
 controls:`<div class="form-row">
  <div class="form-group"><label>Method</label><select id="method" onchange="generate()"><option>GET</option><option>POST</option><option>PUT</option><option>PATCH</option><option>DELETE</option></select></div>
  <div class="form-group" style="flex:1"><label>URL</label><input id="url" type="text" value="https://api.example.com/users" oninput="generate()" style="width:100%"/></div>
 </div>
 <div class="form-row"><div class="form-group" style="flex:1"><label>Headers (one per line: Name: Value)</label><textarea id="headers" style="height:60px;width:100%;background:var(--bg-input);border:1.5px solid var(--border);border-radius:var(--r-md);padding:8px;color:var(--text);font-family:var(--mono);font-size:.85rem;outline:none" placeholder="Content-Type: application/json&#10;Authorization: Bearer token123" oninput="generate()"></textarea></div></div>
 <div class="form-row"><div class="form-group" style="flex:1"><label>Body (JSON)</label><textarea id="body" style="height:60px;width:100%;background:var(--bg-input);border:1.5px solid var(--border);border-radius:var(--r-md);padding:8px;color:var(--text);font-family:var(--mono);font-size:.85rem;outline:none" placeholder='{"key": "value"}' oninput="generate()"></textarea></div></div>`,
 placeholder:'',outputLabel:'cURL Command',
 engine:`function run(){}
function generate(){const method=document.getElementById('method').value;const url=document.getElementById('url').value;const headerLines=document.getElementById('headers').value.trim().split('\\n').filter(l=>l.trim());const body=document.getElementById('body').value.trim();let cmd='curl -X '+method+' \\\\\\n  "'+url+'"';headerLines.forEach(h=>{if(h.trim())cmd+=' \\\\\\n  -H "'+h.trim()+'"'});if(body)cmd+=' \\\\\\n  -d \''+body+'\'';document.getElementById('output').textContent=cmd;document.getElementById('status').textContent='cURL generated'}
document.addEventListener('DOMContentLoaded',generate)`},

{id:'htaccess',cat:'devops',name:'.htaccess Generator',icon:'⚙️',color:'#FF6B35',desc:'Generate Apache .htaccess rules for redirects, security and caching.',
 controls:`<div class="form-row" style="flex-wrap:wrap;gap:12px">
  <label><input type="checkbox" id="https" onchange="generate()"/> Force HTTPS</label>
  <label><input type="checkbox" id="www" onchange="generate()"/> Remove www</label>
  <label><input type="checkbox" id="spa" onchange="generate()"/> SPA Routing</label>
  <label><input type="checkbox" id="cache" onchange="generate()"/> Browser Cache</label>
  <label><input type="checkbox" id="gzip" onchange="generate()"/> GZIP Compression</label>
  <label><input type="checkbox" id="hotlink" onchange="generate()"/> Block Hotlinking</label>
 </div>
 <button class="btn btn-primary btn-sm" onclick="generate()" style="margin-top:8px">Generate .htaccess</button>`,
 placeholder:'',outputLabel:'Generated .htaccess',
 engine:`function run(){}
function generate(){let out='# Generated by DevNova Tools — devnovatools.com\nOptions -Indexes\n';if(document.getElementById('https').checked)out+='\n# Force HTTPS\nRewriteEngine On\nRewriteCond %{HTTPS} off\nRewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]\n';if(document.getElementById('www').checked)out+='\n# Remove www\nRewriteEngine On\nRewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC]\nRewriteRule ^ https://%1%{REQUEST_URI} [R=301,L]\n';if(document.getElementById('spa').checked)out+='\n# SPA Routing\nRewriteEngine On\nRewriteBase /\nRewriteRule ^index\\.html$ - [L]\nRewriteCond %{REQUEST_FILENAME} !-f\nRewriteCond %{REQUEST_FILENAME} !-d\nRewriteRule . /index.html [L]\n';if(document.getElementById('cache').checked)out+='\n# Browser Caching\n<IfModule mod_expires.c>\nExpiresActive On\nExpiresByType image/jpeg "access plus 1 year"\nExpiresByType image/png "access plus 1 year"\nExpiresByType text/css "access plus 1 month"\nExpiresByType application/javascript "access plus 1 month"\n</IfModule>\n';if(document.getElementById('gzip').checked)out+='\n# GZIP Compression\n<IfModule mod_deflate.c>\nAddOutputFilterByType DEFLATE text/html text/css application/javascript application/json\n</IfModule>\n';if(document.getElementById('hotlink').checked)out+='\n# Block Image Hotlinking\nRewriteEngine on\nRewriteCond %{HTTP_REFERER} !^$\nRewriteCond %{HTTP_REFERER} !^https://(www\\.)?yourdomain.com [NC]\nRewriteRule \\.(jpg|jpeg|png|gif|svg|webp)$ - [F,NC]\n';document.getElementById('output').textContent=out||'# Select options above to generate .htaccess rules';document.getElementById('status').textContent='Generated'}`},

{id:'ssh-key',cat:'devops',name:'SSH Key Generator',icon:'🗝️',color:'#FF6B35',desc:'SSH key types reference and generation commands guide.',
 controls:'',placeholder:'',outputLabel:'SSH Key Guide',
 engine:`document.addEventListener('DOMContentLoaded',()=>{document.getElementById('output').textContent=\`SSH Key Generation Guide
========================

▶ Recommended: ED25519 (Most secure & fast)
  ssh-keygen -t ed25519 -C "your@email.com"

▶ RSA 4096-bit (Maximum compatibility)
  ssh-keygen -t rsa -b 4096 -C "your@email.com"

▶ ECDSA
  ssh-keygen -t ecdsa -b 521 -C "your@email.com"

── KEY TYPES ──────────────────
ed25519   ✓ Best: small, fast, secure (OpenSSH 6.5+)
rsa       ✓ Legacy: widely compatible, use 4096+ bits
ecdsa     ✓ Smaller than RSA, modern clients
dsa       ✗ Deprecated: avoid

── VIEW YOUR PUBLIC KEY ────────
cat ~/.ssh/id_ed25519.pub

── COPY TO SERVER ─────────────
ssh-copy-id user@hostname
# or manually:
cat ~/.ssh/id_ed25519.pub | ssh user@host "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"

── CORRECT PERMISSIONS ────────
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
chmod 600 ~/.ssh/authorized_keys

── SSH CONFIG (~/.ssh/config) ──
Host myserver
  HostName 192.168.1.100
  User ubuntu
  IdentityFile ~/.ssh/id_ed25519\`});
function run(){}`},

// ── FRONTEND MISSING ──────────────────────────────────────────────────────
{id:'js-minifier',cat:'frontend',name:'JS Minifier',icon:'⚡',color:'#00D4FF',desc:'Minify JavaScript by removing comments and whitespace.',
 controls:'',placeholder:'Paste JavaScript to minify...',outputLabel:'Minified JS',
 engine:`function run(){const i=document.getElementById('input').value;const o=document.getElementById('output');if(!i){o.textContent='';return}let m=i.replace(/\/\/[^\n]*/g,'').replace(/\/\*[\s\S]*?\*\//g,'').replace(/\n+/g,'\n').replace(/[ \t]+/g,' ').replace(/\s*([{}();:,=!<>+\-*\/|&?[\]])\s*/g,'$1').trim();const s=Math.round((1-m.length/i.length)*100);o.textContent=m;document.getElementById('status').textContent='Saved '+s+'% ('+i.length+' → '+m.length+' bytes)'}`},

{id:'html-beautifier',cat:'frontend',name:'HTML Beautifier',icon:'💅',color:'#00D4FF',desc:'Format and indent HTML code for better readability.',
 controls:'',placeholder:'Paste HTML to beautify...',outputLabel:'Formatted HTML',
 engine:`function run(){const i=document.getElementById('input').value.trim();const o=document.getElementById('output');if(!i){o.textContent='';return}const VOID=['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'];const INLINE=['a','abbr','b','em','i','img','input','label','span','strong','button','code'];let depth=0;let result='';i.replace(/>\s+</g,'><').split(/(<[^>]+>|[^<]+)/).filter(n=>n.trim()).forEach(node=>{if(!node.trim())return;if(node.startsWith('</')){depth=Math.max(0,depth-1);result+='  '.repeat(depth)+node+'\n'}else if(node.startsWith('<!')||node.startsWith('<?')){result+='  '.repeat(depth)+node+'\n'}else if(node.startsWith('<')){const tag=(node.match(/<([a-zA-Z]+)/)||[])[1]||'';const isVoid=VOID.includes(tag.toLowerCase());result+='  '.repeat(depth)+node+'\n';if(!isVoid&&!node.endsWith('/>'))depth++}else{result+='  '.repeat(depth)+node.trim()+'\n'}});o.textContent=result.trim();document.getElementById('status').textContent='Formatted'}`},

{id:'css-grid',cat:'frontend',name:'CSS Grid Generator',icon:'▦',color:'#00D4FF',desc:'Generate CSS Grid layouts visually with column and row controls.',
 controls:`<div class="form-row">
  <div class="form-group"><label>Columns</label><input type="number" id="cols" value="3" min="1" max="12" oninput="run()"/></div>
  <div class="form-group"><label>Rows</label><input type="number" id="rows" value="3" min="1" max="12" oninput="run()"/></div>
  <div class="form-group"><label>Gap</label><input type="text" id="gap" value="16px" oninput="run()" style="width:80px"/></div>
  <div class="form-group"><label>Column Sizes</label><select id="sizes" onchange="run()"><option value="1fr">Equal (1fr)</option><option value="auto">Auto</option><option value="minmax">Min/Max</option></select></div>
 </div>
 <div id="preview" style="border:1px solid var(--border);border-radius:8px;padding:8px;margin-bottom:8px;min-height:80px"></div>`,
 placeholder:'',outputLabel:'CSS Code',
 engine:`function run(){const cols=parseInt(document.getElementById('cols').value)||3;const rows=parseInt(document.getElementById('rows').value)||3;const gap=document.getElementById('gap').value||'16px';const sizes=document.getElementById('sizes').value;const colTemplate=sizes==='minmax'?'repeat('+cols+', minmax(0, 1fr))':'repeat('+cols+', '+sizes+')';const prev=document.getElementById('preview');prev.style.display='grid';prev.style.gridTemplateColumns=colTemplate;prev.style.gap=gap;prev.innerHTML=Array.from({length:cols*rows},(_,i)=>'<div style="background:var(--bg-hover);border-radius:4px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;height:40px;font-size:.75rem;color:var(--text-muted)">'+(i+1)+'</div>').join('');document.getElementById('output').textContent='.container {\n  display: grid;\n  grid-template-columns: '+colTemplate+';\n  grid-template-rows: repeat('+rows+', 1fr);\n  gap: '+gap+';\n}\n\n/* Individual item placement */\n.item-1 { grid-column: 1; grid-row: 1; }\n.span-2 { grid-column: span 2; }'}
document.addEventListener('DOMContentLoaded',run)`},

{id:'flexbox',cat:'frontend',name:'Flexbox Generator',icon:'↔️',color:'#00D4FF',desc:'Generate CSS Flexbox layouts with a live preview.',
 controls:`<div class="form-row">
  <div class="form-group"><label>Direction</label><select id="dir" onchange="run()"><option value="row">row</option><option value="column">column</option><option value="row-reverse">row-reverse</option><option value="column-reverse">column-reverse</option></select></div>
  <div class="form-group"><label>Justify Content</label><select id="jc" onchange="run()"><option value="flex-start">flex-start</option><option value="center">center</option><option value="flex-end">flex-end</option><option value="space-between">space-between</option><option value="space-around">space-around</option><option value="space-evenly">space-evenly</option></select></div>
  <div class="form-group"><label>Align Items</label><select id="ai" onchange="run()"><option value="flex-start">flex-start</option><option value="center">center</option><option value="flex-end">flex-end</option><option value="stretch">stretch</option></select></div>
  <div class="form-group"><label>Wrap</label><select id="wrap" onchange="run()"><option value="nowrap">nowrap</option><option value="wrap">wrap</option><option value="wrap-reverse">wrap-reverse</option></select></div>
 </div>
 <div id="preview" style="border:1px solid var(--border);border-radius:8px;padding:12px;min-height:80px;margin-bottom:8px;background:var(--bg-card)"></div>`,
 placeholder:'',outputLabel:'CSS Code',
 engine:`function run(){const dir=document.getElementById('dir').value;const jc=document.getElementById('jc').value;const ai=document.getElementById('ai').value;const wrap=document.getElementById('wrap').value;const prev=document.getElementById('preview');prev.style.display='flex';prev.style.flexDirection=dir;prev.style.justifyContent=jc;prev.style.alignItems=ai;prev.style.flexWrap=wrap;prev.innerHTML=['A','B','C','D','E'].map((l,i)=>'<div style="background:var(--bg-hover);border:1px solid var(--border);border-radius:6px;padding:8px '+(12+i*4)+'px;color:var(--text-muted);font-size:.85rem;font-weight:600;margin:4px">'+l+'</div>').join('');document.getElementById('output').textContent='.container {\n  display: flex;\n  flex-direction: '+dir+';\n  justify-content: '+jc+';\n  align-items: '+ai+';\n  flex-wrap: '+wrap+';\n  gap: 8px;\n}'}
document.addEventListener('DOMContentLoaded',run)`},

{id:'image-to-base64',cat:'frontend',name:'Image to Base64',icon:'🖼️',color:'#00D4FF',desc:'Convert any image file to a Base64 data URL string.',
 customInput:`<div class="panel"><div class="panel-header"><span class="panel-label">Upload Image</span></div><div class="panel-body" style="padding:24px;text-align:center"><input type="file" id="fileInput" accept="image/*" onchange="convert(event)" style="width:100%;margin-bottom:12px"/><div id="img-preview"></div></div></div>`,
 controls:'',placeholder:'',outputLabel:'Base64 Output',
 engine:`function run(){}function convert(e){const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{const b64=ev.target.result;document.getElementById('output').textContent=b64;document.getElementById('img-preview').innerHTML='<img src="'+b64+'" style="max-width:200px;max-height:200px;border-radius:8px;border:1px solid var(--border);margin-top:8px"/>';document.getElementById('status').textContent=f.name+' — '+Math.round(b64.length/1024)+' KB encoded'};r.readAsDataURL(f)}`},

{id:'svg-minifier',cat:'frontend',name:'SVG Minifier',icon:'✏️',color:'#00D4FF',desc:'Minify SVG files by removing comments, metadata and whitespace.',
 controls:'',placeholder:'Paste SVG code here...',outputLabel:'Minified SVG',
 engine:`function run(){const i=document.getElementById('input').value.trim();const o=document.getElementById('output');if(!i){o.textContent='';return}let m=i.replace(/<!--[\s\S]*?-->/g,'').replace(/<\?xml[^?]*\?>/g,'').replace(/<metadata>[\s\S]*?<\/metadata>/g,'').replace(/<title>[\s\S]*?<\/title>/g,'').replace(/<desc>[\s\S]*?<\/desc>/g,'').replace(/\s+/g,' ').replace(/>\s+</g,'><').replace(/\s*(=)\s*/g,'$1').trim();const s=Math.round((1-m.length/i.length)*100);o.textContent=m;document.getElementById('status').textContent='Saved '+s+'% ('+i.length+' → '+m.length+' bytes)'}`},

{id:'css-specificity',cat:'frontend',name:'CSS Specificity Calculator',icon:'🎯',color:'#00D4FF',desc:'Calculate the specificity score of any CSS selector.',
 controls:'',placeholder:'Enter CSS selectors (one per line)...\n#nav .menu > li:hover\n.btn.btn-primary\ndiv p span',outputLabel:'Specificity Scores',
 engine:`function run(){const i=document.getElementById('input').value.trim();const o=document.getElementById('output');if(!i){o.textContent='';return}const selectors=i.split('\n').map(s=>s.trim()).filter(Boolean);const results=selectors.map(sel=>{let a=0,b=0,c=0;let s=sel.replace(/::[a-z-]+/gi,'');const ids=s.match(/#[a-zA-Z0-9_-]+/g)||[];a=ids.length;s=s.replace(/#[a-zA-Z0-9_-]+/g,'');const classes=(s.match(/\.[a-zA-Z0-9_-]+|\[[^\]]+\]|:[a-zA-Z-]+/g)||[]);b=classes.length;s=s.replace(/\.[a-zA-Z0-9_-]+|\[[^\]]+\]|:[a-zA-Z-]+/g,'');const tags=(s.match(/[a-zA-Z][a-zA-Z0-9]*/g)||[]).filter(t=>!['not','is','where','has'].includes(t));c=tags.length;const score=a*100+b*10+c;const level=a>0?'ID level':b>0?'Class level':'Element level';return sel+'\n  ('+a+', '+b+', '+c+') = '+score+' — '+level});o.textContent=results.join('\n\n');document.getElementById('status').textContent=selectors.length+' selector(s)'}`},

{id:'favicon-generator',cat:'frontend',name:'Favicon Generator',icon:'⭐',color:'#00D4FF',desc:'Generate a simple text/emoji favicon using HTML Canvas.',
 controls:`<div class="form-row">
  <div class="form-group"><label>Text/Emoji</label><input id="txt" type="text" value="D" maxlength="2" style="width:70px" oninput="generate()"/></div>
  <div class="form-group"><label>Background</label><input type="color" id="bg" value="#141C2E" oninput="generate()"/></div>
  <div class="form-group"><label>Color</label><input type="color" id="tc" value="#00C896" oninput="generate()"/></div>
  <button class="btn btn-secondary btn-sm" onclick="download()" style="margin-top:20px">Download PNG</button>
 </div>
 <canvas id="canvas" width="64" height="64" style="border-radius:8px;border:1px solid var(--border);margin-bottom:8px;width:64px;height:64px"></canvas>`,
 placeholder:'',outputLabel:'HTML Code',
 engine:`function run(){}function generate(){const c=document.getElementById('canvas');const ctx=c.getContext('2d');const bg=document.getElementById('bg').value;const tc=document.getElementById('tc').value;const txt=document.getElementById('txt').value||'D';ctx.clearRect(0,0,64,64);ctx.fillStyle=bg;ctx.fillRect(0,0,64,64);ctx.fillStyle=tc;const fs=txt.length>1?26:38;ctx.font='bold '+fs+'px system-ui, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(txt,32,33);const dataUrl=c.toDataURL();document.getElementById('output').textContent='<!-- Paste in <head> -->\n<link rel="icon" type="image/png" href="favicon.png">\n\n<!-- Or inline SVG favicon (no file needed): -->\n<link rel="icon" href="data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><rect fill=\''+bg+'\' width=\'100\' height=\'100\' rx=\'15\'/><text y=\'.9em\' x=\'50%\' text-anchor=\'middle\' font-size=\'65\' font-family=\'system-ui\' fill=\''+tc+'\'>'+txt+'</text></svg>">'}
function download(){const c=document.getElementById('canvas');const a=document.createElement('a');a.download='favicon.png';a.href=c.toDataURL();a.click()}
document.addEventListener('DOMContentLoaded',generate)`},

{id:'breakpoints',cat:'frontend',name:'Responsive Breakpoints',icon:'📱',color:'#00D4FF',desc:'CSS breakpoint reference for Tailwind, Bootstrap and common frameworks.',
 controls:'',placeholder:'',outputLabel:'Breakpoints Reference',
 engine:`document.addEventListener('DOMContentLoaded',()=>{document.getElementById('output').textContent=\`── TAILWIND CSS ─────────────────
xs:    < 640px    (default — mobile first)
sm:   >= 640px    @media (min-width: 640px)
md:   >= 768px    @media (min-width: 768px)
lg:   >= 1024px   @media (min-width: 1024px)
xl:   >= 1280px   @media (min-width: 1280px)
2xl:  >= 1536px   @media (min-width: 1536px)

── BOOTSTRAP 5 ──────────────────
xs:    < 576px
sm:   >= 576px    @media (min-width: 576px)
md:   >= 768px    @media (min-width: 768px)
lg:   >= 992px    @media (min-width: 992px)
xl:   >= 1200px   @media (min-width: 1200px)
xxl:  >= 1400px   @media (min-width: 1400px)

── MATERIAL UI (MUI) ────────────
xs:    0px+
sm:    600px+
md:    900px+
lg:    1200px+
xl:    1536px+

── COMMON DEVICE SIZES ──────────
Mobile Portrait:   320–480px
Mobile Landscape:  481–767px
Tablet Portrait:   768–1024px
Laptop:            1025–1280px
Desktop:           1281–1920px
4K/Ultra-wide:     1921px+

── CSS MEDIA QUERY EXAMPLES ─────
/* Mobile first approach */
.container { padding: 16px; }

@media (min-width: 640px) {
  .container { padding: 24px; }
}
@media (min-width: 1024px) {
  .container { max-width: 1024px; margin: 0 auto; }
}
@media (min-width: 1280px) {
  .container { max-width: 1280px; }
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  body { background: #141C2E; }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; }
}\`});
function run(){}`},
];

// Write all missing tool pages
let count = 0;
MISSING_TOOLS.forEach(tool => {
  const cat = CATS.find(c => c.id === tool.cat);
  const dir = path.join(__dirname, tool.cat, tool.id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), makeToolPage(tool, cat));
  count++;
  console.log('✓ '+tool.cat+'/'+tool.id);
});

console.log('\n✅ Built '+count+' missing tool pages');
console.log('Total tools now: 34 + '+count+' = '+(34+count));
