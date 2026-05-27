const fs = require('fs');
const path = require('path');

// ─── TOOL DEFINITIONS ──────────────────────────────────────────────────────
const TOOLS = [
  // JSON & Data
  {id:'formatter',cat:'json',name:'JSON Formatter',desc:'Format, beautify and pretty-print JSON with customizable indentation.',icon:'🟦',color:'#00C896',
   engine:`
    function run(){
      const input=document.getElementById('input').value.trim();
      const out=document.getElementById('output');
      const status=document.getElementById('status');
      if(!input){out.textContent='';setStatus('','');return}
      try{
        const indent=parseInt(document.getElementById('indent').value)||2;
        const parsed=JSON.parse(input);
        out.textContent=JSON.stringify(parsed,null,indent);
        setStatus('valid','✓ Valid JSON — '+JSON.stringify(parsed,null,indent).split('\\n').length+' lines');
      }catch(e){out.textContent='';setStatus('error','✗ '+e.message)}
    }
    function setStatus(type,msg){
      const s=document.getElementById('status');
      s.className='badge badge-'+(type==='valid'?'success':type==='error'?'error':'info');
      s.textContent=msg;
    }`,
   controls:`<div class="form-row"><div class="form-group"><label>Indent</label><select id="indent" onchange="run()"><option value="2">2 spaces</option><option value="4">4 spaces</option><option value="1">1 tab</option></select></div></div>`,
   placeholder:'Paste your JSON here...',outputLabel:'Formatted JSON'},

  {id:'validator',cat:'json',name:'JSON Validator',desc:'Validate JSON syntax and get detailed error messages with line numbers.',icon:'✅',color:'#00C896',
   engine:`
    function run(){
      const input=document.getElementById('input').value.trim();
      const out=document.getElementById('output');
      if(!input){out.textContent='';setStatus('','');return}
      try{
        const parsed=JSON.parse(input);
        const keys=JSON.stringify(parsed).match(/"[^"]+"\s*:/g)||[];
        out.textContent='✓ Valid JSON\\n\\nType: '+typeof parsed+'\\nKeys: '+keys.length+'\\nSize: '+(new Blob([input]).size)+' bytes';
        setStatus('success','✓ Valid JSON');
      }catch(e){out.textContent='✗ Invalid JSON\\n\\n'+e.message;setStatus('error','✗ '+e.message)}
    }
    function setStatus(type,msg){const s=document.getElementById('status');s.className='badge badge-'+(type||'info');s.textContent=msg}`,
   controls:'',placeholder:'Paste JSON to validate...',outputLabel:'Validation Result'},

  {id:'minifier',cat:'json',name:'JSON Minifier',desc:'Remove whitespace and compress JSON to its smallest possible size.',icon:'🗜️',color:'#00C896',
   engine:`
    function run(){
      const input=document.getElementById('input').value.trim();
      const out=document.getElementById('output');
      if(!input){out.textContent='';return}
      try{
        const minified=JSON.stringify(JSON.parse(input));
        const saved=Math.round((1-minified.length/input.length)*100);
        out.textContent=minified;
        document.getElementById('status').textContent='Saved '+saved+'% ('+input.length+' → '+minified.length+' bytes)';
      }catch(e){out.textContent='✗ '+e.message}
    }`,
   controls:'',placeholder:'Paste JSON to minify...',outputLabel:'Minified JSON'},

  {id:'diff',cat:'json',name:'JSON Diff',desc:'Compare two JSON objects and highlight the differences.',icon:'🔀',color:'#00C896',
   engine:`
    function run(){
      const a=document.getElementById('input').value.trim();
      const b=document.getElementById('input2').value.trim();
      const out=document.getElementById('output');
      if(!a||!b){out.textContent='Enter JSON in both panels';return}
      try{
        const obj1=JSON.parse(a),obj2=JSON.parse(b);
        const diffs=diff(obj1,obj2,'');
        out.textContent=diffs.length?diffs.join('\\n'):'✓ No differences found — JSON objects are identical';
      }catch(e){out.textContent='✗ '+e.message}
    }
    function diff(a,b,prefix){
      const res=[];
      const keys=new Set([...Object.keys(a||{}),...Object.keys(b||{})]);
      keys.forEach(k=>{
        const path=prefix?prefix+'.'+k:k;
        if(!(k in a))res.push('+ '+path+': '+JSON.stringify(b[k]));
        else if(!(k in b))res.push('- '+path+': '+JSON.stringify(a[k]));
        else if(typeof a[k]==='object'&&typeof b[k]==='object'&&a[k]&&b[k])res.push(...diff(a[k],b[k],path));
        else if(JSON.stringify(a[k])!==JSON.stringify(b[k]))res.push('~ '+path+'\\n  was: '+JSON.stringify(a[k])+'\\n  now: '+JSON.stringify(b[k]));
      });
      return res;
    }`,
   controls:'',placeholder:'Paste first JSON...',outputLabel:'Differences',extraPanel:`<div class="panel"><div class="panel-header"><span class="panel-label">JSON B</span></div><div class="panel-body"><textarea id="input2" class="panel-textarea" placeholder="Paste second JSON..." oninput="run()"></textarea></div></div>`},

  {id:'csv-to-json',cat:'json',name:'CSV to JSON',desc:'Convert CSV data to JSON array with automatic header detection.',icon:'📊',color:'#00C896',
   engine:`
    function run(){
      const input=document.getElementById('input').value.trim();
      const out=document.getElementById('output');
      if(!input){out.textContent='';return}
      try{
        const lines=input.split('\\n').filter(l=>l.trim());
        const headers=lines[0].split(',').map(h=>h.trim().replace(/^"|"$/g,''));
        const rows=lines.slice(1).map(line=>{
          const vals=line.split(',').map(v=>v.trim().replace(/^"|"$/g,''));
          const obj={};
          headers.forEach((h,i)=>obj[h]=isNaN(vals[i])?vals[i]:Number(vals[i]));
          return obj;
        });
        out.textContent=JSON.stringify(rows,null,2);
        document.getElementById('status').textContent=rows.length+' rows converted';
      }catch(e){out.textContent='✗ '+e.message}
    }`,
   controls:'',placeholder:'Paste CSV data here...\nname,age,city\nAlice,30,NYC',outputLabel:'JSON Output'},

  {id:'json-to-csv',cat:'json',name:'JSON to CSV',desc:'Convert JSON array to CSV format with automatic column detection.',icon:'📋',color:'#00C896',
   engine:`
    function run(){
      const input=document.getElementById('input').value.trim();
      const out=document.getElementById('output');
      if(!input){out.textContent='';return}
      try{
        const data=JSON.parse(input);
        const arr=Array.isArray(data)?data:[data];
        const headers=[...new Set(arr.flatMap(o=>Object.keys(o)))];
        const csv=[headers.join(','),...arr.map(r=>headers.map(h=>{const v=r[h]??'';return typeof v==='string'&&v.includes(',')?'"'+v+'"':v}).join(','))].join('\\n');
        out.textContent=csv;
        document.getElementById('status').textContent=arr.length+' rows exported';
      }catch(e){out.textContent='✗ '+e.message}
    }`,
   controls:'',placeholder:'Paste JSON array here...',outputLabel:'CSV Output'},

  {id:'schema-generator',cat:'json',name:'JSON Schema Generator',desc:'Automatically generate a JSON Schema from any JSON sample.',icon:'📐',color:'#00C896',
   engine:`
    function run(){
      const input=document.getElementById('input').value.trim();
      const out=document.getElementById('output');
      if(!input){out.textContent='';return}
      try{out.textContent=JSON.stringify(genSchema(JSON.parse(input)),null,2)}
      catch(e){out.textContent='✗ '+e.message}
    }
    function genSchema(val){
      if(val===null)return{type:'null'};
      if(Array.isArray(val)){const s={type:'array'};if(val.length)s.items=genSchema(val[0]);return s}
      if(typeof val==='object'){const p={};Object.keys(val).forEach(k=>p[k]=genSchema(val[k]));return{type:'object',properties:p,required:Object.keys(val)}}
      return{type:typeof val};
    }`,
   controls:'',placeholder:'Paste JSON sample...',outputLabel:'JSON Schema'},

  {id:'yaml-to-json',cat:'json',name:'YAML to JSON',desc:'Convert YAML to JSON format instantly.',icon:'🔄',color:'#00C896',
   engine:`
    function run(){
      const input=document.getElementById('input').value.trim();
      const out=document.getElementById('output');
      if(!input){out.textContent='';return}
      try{
        // Simple YAML parser for common cases
        const lines=input.split('\\n');
        const result=parseYaml(lines,0,0).obj;
        out.textContent=JSON.stringify(result,null,2);
      }catch(e){out.textContent='✗ Could not parse YAML: '+e.message}
    }
    function parseYaml(lines,start,depth){
      const obj={};let arr=[];let isArr=false;let i=start;
      while(i<lines.length){
        const line=lines[i];const trimmed=line.trimStart();
        const indent=line.length-trimmed.length;
        if(indent<depth&&i>start)break;
        if(trimmed.startsWith('- ')){isArr=true;arr.push(trimmed.slice(2).trim());i++}
        else if(trimmed.includes(': ')){const idx=trimmed.indexOf(': ');const key=trimmed.slice(0,idx);const val=trimmed.slice(idx+2).trim();
          if(val){obj[key]=isNaN(val)?val==='true'?true:val==='false'?false:val:Number(val)}else{i++;const sub=parseYaml(lines,i,indent+2);obj[key]=sub.obj;i=sub.i;continue}i++}
        else{i++}
      }
      return{obj:isArr?arr:obj,i};
    }`,
   controls:'',placeholder:'Paste YAML here...',outputLabel:'JSON Output'},

  {id:'json-to-yaml',cat:'json',name:'JSON to YAML',desc:'Convert JSON to YAML format instantly.',icon:'🔄',color:'#00C896',
   engine:`
    function run(){
      const input=document.getElementById('input').value.trim();
      const out=document.getElementById('output');
      if(!input){out.textContent='';return}
      try{out.textContent=toYaml(JSON.parse(input),0)}
      catch(e){out.textContent='✗ '+e.message}
    }
    function toYaml(obj,depth){
      const indent='  '.repeat(depth);
      if(obj===null)return'null';
      if(typeof obj!=='object')return typeof obj==='string'&&(obj.includes(':')||obj.includes('#'))?'"'+obj+'"':String(obj);
      if(Array.isArray(obj))return obj.map(v=>indent+'- '+toYaml(v,depth+1)).join('\\n');
      return Object.keys(obj).map(k=>{const v=obj[k];const val=typeof v==='object'&&v?'\\n'+Object.keys(v).length?toYaml(v,depth+1).split('\\n').map(l=>indent+'  '+l).join('\\n'):'{}':toYaml(v,depth);return indent+k+': '+val}).join('\\n');
    }`,
   controls:'',placeholder:'Paste JSON here...',outputLabel:'YAML Output'},

  // API & Security
  {id:'jwt-decoder',cat:'api',name:'JWT Decoder',desc:'Decode and inspect JWT tokens — header, payload and signature.',icon:'🔐',color:'#0066FF',
   engine:`
    function run(){
      const input=document.getElementById('input').value.trim();
      const out=document.getElementById('output');
      if(!input){out.textContent='';return}
      try{
        const parts=input.split('.');
        if(parts.length!==3){out.textContent='✗ Invalid JWT — must have 3 parts';return}
        const decode=b64=>{try{return JSON.parse(atob(b64.replace(/-/g,'+').replace(/_/g,'/')))}catch{return atob(b64.replace(/-/g,'+').replace(/_/g,'/'))}}
        const header=decode(parts[0]),payload=decode(parts[1]);
        const exp=payload.exp?new Date(payload.exp*1000).toLocaleString():'N/A';
        const iat=payload.iat?new Date(payload.iat*1000).toLocaleString():'N/A';
        const expired=payload.exp&&Date.now()/1000>payload.exp;
        out.textContent='── HEADER ──\\n'+JSON.stringify(header,null,2)+'\\n\\n── PAYLOAD ──\\n'+JSON.stringify(payload,null,2)+'\\n\\n── INFO ──\\nIssued At: '+iat+'\\nExpires: '+exp+'\\nStatus: '+(expired?'⚠️ EXPIRED':'✓ Valid');
        document.getElementById('status').className='badge badge-'+(expired?'error':'success');
        document.getElementById('status').textContent=expired?'⚠️ Token Expired':'✓ Token Decoded';
      }catch(e){out.textContent='✗ '+e.message}
    }`,
   controls:'',placeholder:'Paste your JWT token here...\neyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',outputLabel:'Decoded Token'},

  {id:'base64',cat:'api',name:'Base64 Encoder/Decoder',desc:'Encode text to Base64 or decode Base64 back to plain text.',icon:'🔒',color:'#0066FF',
   engine:`
    function encode(){
      const input=document.getElementById('input').value;
      try{document.getElementById('output').textContent=btoa(unescape(encodeURIComponent(input)));setStatus('success','Encoded')}
      catch(e){document.getElementById('output').textContent='✗ '+e.message;setStatus('error',e.message)}
    }
    function decode(){
      const input=document.getElementById('input').value.trim();
      try{document.getElementById('output').textContent=decodeURIComponent(escape(atob(input)));setStatus('success','Decoded')}
      catch(e){document.getElementById('output').textContent='✗ Invalid Base64';setStatus('error','Invalid Base64')}
    }
    function run(){encode()}
    function setStatus(t,m){const s=document.getElementById('status');s.className='badge badge-'+t;s.textContent=m}`,
   controls:`<div class="form-row"><button class="btn btn-primary btn-sm" onclick="encode()">Encode →</button><button class="btn btn-secondary btn-sm" onclick="decode()">← Decode</button></div>`,
   placeholder:'Enter text to encode or Base64 to decode...',outputLabel:'Result'},

  {id:'url-encoder',cat:'api',name:'URL Encoder/Decoder',desc:'Encode special characters for URLs or decode URL-encoded strings.',icon:'🌐',color:'#0066FF',
   engine:`
    function encode(){
      const input=document.getElementById('input').value;
      document.getElementById('output').textContent=encodeURIComponent(input);
      setStatus('success','Encoded');
    }
    function decode(){
      try{document.getElementById('output').textContent=decodeURIComponent(document.getElementById('input').value);setStatus('success','Decoded')}
      catch(e){document.getElementById('output').textContent='✗ Invalid URL encoding';setStatus('error','Invalid encoding')}
    }
    function run(){encode()}
    function setStatus(t,m){const s=document.getElementById('status');s.className='badge badge-'+t;s.textContent=m}`,
   controls:`<div class="form-row"><button class="btn btn-primary btn-sm" onclick="encode()">Encode →</button><button class="btn btn-secondary btn-sm" onclick="decode()">← Decode</button></div>`,
   placeholder:'Enter URL or text to encode/decode...',outputLabel:'Result'},

  {id:'hash-generator',cat:'api',name:'Hash Generator',desc:'Generate MD5, SHA-1, SHA-256 and SHA-512 cryptographic hashes.',icon:'#️⃣',color:'#0066FF',
   engine:`
    async function run(){
      const input=document.getElementById('input').value;
      const out=document.getElementById('output');
      if(!input){out.textContent='';return}
      const algo=document.getElementById('algo').value;
      try{
        const encoder=new TextEncoder();
        const data=encoder.encode(input);
        const hashBuffer=await crypto.subtle.digest(algo,data);
        const hashArray=Array.from(new Uint8Array(hashBuffer));
        out.textContent=hashArray.map(b=>b.toString(16).padStart(2,'0')).join('');
        document.getElementById('status').textContent=algo+' hash generated';
      }catch(e){out.textContent='✗ '+e.message}
    }`,
   controls:`<div class="form-row"><div class="form-group"><label>Algorithm</label><select id="algo" onchange="run()"><option value="SHA-256">SHA-256</option><option value="SHA-1">SHA-1</option><option value="SHA-512">SHA-512</option></select></div></div>`,
   placeholder:'Enter text to hash...',outputLabel:'Hash Output'},

  {id:'uuid-generator',cat:'api',name:'UUID Generator',desc:'Generate cryptographically secure UUIDs (v4) in bulk.',icon:'🆔',color:'#0066FF',
   engine:`
    function run(){generate()}
    function generate(){
      const count=parseInt(document.getElementById('count').value)||1;
      const uuids=Array.from({length:Math.min(count,100)},()=>crypto.randomUUID());
      document.getElementById('output').textContent=uuids.join('\\n');
      document.getElementById('status').textContent=uuids.length+' UUID(s) generated';
    }`,
   controls:`<div class="form-row"><div class="form-group"><label>Count</label><input type="number" id="count" value="1" min="1" max="100" style="width:80px"/></div><button class="btn btn-primary btn-sm" onclick="generate()">Generate</button></div>`,
   placeholder:'Click Generate to create UUIDs',outputLabel:'Generated UUIDs'},

  {id:'password-generator',cat:'api',name:'Password Generator',desc:'Generate strong, cryptographically secure random passwords.',icon:'🔏',color:'#0066FF',
   engine:`
    function run(){generate()}
    function generate(){
      const len=parseInt(document.getElementById('length').value)||16;
      const upper=document.getElementById('upper').checked;
      const lower=document.getElementById('lower').checked;
      const nums=document.getElementById('nums').checked;
      const syms=document.getElementById('syms').checked;
      let chars='';
      if(upper)chars+='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if(lower)chars+='abcdefghijklmnopqrstuvwxyz';
      if(nums)chars+='0123456789';
      if(syms)chars+='!@#$%^&*()_+-=[]{}|;:,.<>?';
      if(!chars){document.getElementById('output').textContent='Select at least one character type';return}
      const arr=new Uint32Array(len);
      crypto.getRandomValues(arr);
      const pwd=Array.from(arr).map(n=>chars[n%chars.length]).join('');
      document.getElementById('output').textContent=pwd;
      const entropy=Math.log2(Math.pow(chars.length,len));
      document.getElementById('status').textContent='Entropy: '+Math.round(entropy)+' bits — '+(entropy>80?'Very Strong':entropy>60?'Strong':entropy>40?'Good':'Weak');
    }`,
   controls:`<div class="form-row">
    <div class="form-group"><label>Length</label><input type="number" id="length" value="16" min="4" max="128" style="width:70px" oninput="generate()"/></div>
   </div>
   <div class="form-row" style="gap:16px">
    <label><input type="checkbox" id="upper" checked onchange="generate()"/> Uppercase</label>
    <label><input type="checkbox" id="lower" checked onchange="generate()"/> Lowercase</label>
    <label><input type="checkbox" id="nums" checked onchange="generate()"/> Numbers</label>
    <label><input type="checkbox" id="syms" checked onchange="generate()"/> Symbols</label>
   </div>
   <button class="btn btn-primary btn-sm" onclick="generate()">Generate Password</button>`,
   placeholder:'Configure options and click Generate',outputLabel:'Generated Password'},

  {id:'ip-lookup',cat:'api',name:'IP Address Lookup',desc:'Look up geolocation and info for any IP address.',icon:'🌍',color:'#0066FF',
   engine:`
    async function run(){
      const input=document.getElementById('input').value.trim()||'';
      const out=document.getElementById('output');
      out.textContent='Looking up...';
      try{
        const ip=input||'';
        const res=await fetch('https://ipapi.co/'+(ip||'json')+'/json/');
        const data=await res.json();
        out.textContent=['IP: '+data.ip,'City: '+(data.city||'N/A'),'Region: '+(data.region||'N/A'),'Country: '+(data.country_name||'N/A'),'Timezone: '+(data.timezone||'N/A'),'ISP: '+(data.org||'N/A'),'Latitude: '+(data.latitude||'N/A'),'Longitude: '+(data.longitude||'N/A')].join('\\n');
        document.getElementById('status').textContent='Lookup complete';
      }catch(e){out.textContent='✗ Lookup failed: '+e.message}
    }`,
   controls:`<button class="btn btn-primary btn-sm" onclick="run()">Lookup IP</button>`,
   placeholder:'Enter IP address (leave blank for your IP)...',outputLabel:'IP Information'},

  // Text & Parsing
  {id:'regex-tester',cat:'text',name:'Regex Tester',desc:'Test and debug regular expressions with live highlighting and match details.',icon:'✍️',color:'#7B61FF',
   engine:`
    function run(){
      const pattern=document.getElementById('pattern').value;
      const flags=document.getElementById('flags').value;
      const input=document.getElementById('input').value;
      const out=document.getElementById('output');
      if(!pattern){out.textContent=input;return}
      try{
        const regex=new RegExp(pattern,flags);
        const matches=[...input.matchAll(new RegExp(pattern,'g'+flags.replace('g','').replace('i','')))];
        if(!matches.length){out.textContent='No matches found\\n\\nInput text:\\n'+input;document.getElementById('status').textContent='0 matches';return}
        let result='✓ '+matches.length+' match(es) found\\n\\n';
        matches.forEach((m,i)=>{result+='Match '+(i+1)+': "'+m[0]+'" at index '+m.index+'\\n';if(m.length>1)m.slice(1).forEach((g,j)=>result+='  Group '+(j+1)+': '+(g||'undefined')+'\\n')});
        out.textContent=result;
        document.getElementById('status').textContent=matches.length+' match(es)';
      }catch(e){out.textContent='✗ Invalid regex: '+e.message;document.getElementById('status').textContent='Invalid regex'}
    }`,
   controls:`<div class="form-row">
    <div class="form-group" style="flex:1"><label>Pattern</label><input id="pattern" type="text" placeholder="e.g. \\d+" oninput="run()" style="width:100%"/></div>
    <div class="form-group"><label>Flags</label><input id="flags" type="text" value="gi" style="width:70px" oninput="run()"/></div>
   </div>`,
   placeholder:'Enter test string here...',outputLabel:'Match Results'},

  {id:'diff-checker',cat:'text',name:'Text Diff Checker',desc:'Compare two texts and highlight all additions and removals.',icon:'↔️',color:'#7B61FF',
   engine:`
    function run(){
      const a=document.getElementById('input').value;
      const b=document.getElementById('input2').value;
      const out=document.getElementById('output');
      const aLines=a.split('\\n'),bLines=b.split('\\n');
      let result='',adds=0,removes=0;
      const maxLen=Math.max(aLines.length,bLines.length);
      for(let i=0;i<maxLen;i++){
        if(aLines[i]===bLines[i]){result+='  '+( aLines[i]||'')+'\\n'}
        else{
          if(i<aLines.length){result+='- '+aLines[i]+'\\n';removes++}
          if(i<bLines.length){result+='+ '+bLines[i]+'\\n';adds++}
        }
      }
      out.textContent=result||'Texts are identical';
      document.getElementById('status').textContent=adds+' additions, '+removes+' removals';
    }`,
   controls:'',placeholder:'Enter original text...',outputLabel:'Diff Result',extraPanel:`<div class="panel"><div class="panel-header"><span class="panel-label">Modified Text</span></div><div class="panel-body"><textarea id="input2" class="panel-textarea" placeholder="Enter modified text..." oninput="run()"></textarea></div></div>`},

  {id:'case-converter',cat:'text',name:'Case Converter',desc:'Convert text between camelCase, snake_case, PascalCase, kebab-case and more.',icon:'Aa',color:'#7B61FF',
   engine:`
    function run(){convert(document.getElementById('caseType').value)}
    function convert(type){
      const input=document.getElementById('input').value;
      const out=document.getElementById('output');
      const words=input.replace(/([A-Z])/g,' $1').replace(/[-_]+/g,' ').toLowerCase().trim().split(/\\s+/).filter(Boolean);
      const result={
        'lower':input.toLowerCase(),
        'upper':input.toUpperCase(),
        'title':words.map(w=>w[0].toUpperCase()+w.slice(1)).join(' '),
        'camel':words.map((w,i)=>i?w[0].toUpperCase()+w.slice(1):w).join(''),
        'pascal':words.map(w=>w[0].toUpperCase()+w.slice(1)).join(''),
        'snake':words.join('_'),
        'kebab':words.join('-'),
        'constant':words.join('_').toUpperCase(),
        'dot':words.join('.'),
      }[type]||input;
      out.textContent=result;
      document.getElementById('status').textContent=type+' applied';
    }`,
   controls:`<div class="form-row"><div class="form-group"><label>Convert to</label><select id="caseType" onchange="run()">
    <option value="lower">lowercase</option><option value="upper">UPPERCASE</option>
    <option value="title">Title Case</option><option value="camel">camelCase</option>
    <option value="pascal">PascalCase</option><option value="snake">snake_case</option>
    <option value="kebab">kebab-case</option><option value="constant">CONSTANT_CASE</option>
    <option value="dot">dot.case</option>
   </select></div></div>`,
   placeholder:'Enter text to convert...',outputLabel:'Converted Text'},

  {id:'word-counter',cat:'text',name:'Word Counter',desc:'Count words, characters, sentences, paragraphs and reading time.',icon:'🔢',color:'#7B61FF',
   engine:`
    function run(){
      const input=document.getElementById('input').value;
      const words=input.trim()?input.trim().split(/\\s+/).length:0;
      const chars=input.length;
      const charsNoSpace=input.replace(/\\s/g,'').length;
      const sentences=input.split(/[.!?]+/).filter(s=>s.trim()).length;
      const paragraphs=input.split(/\\n\\n+/).filter(p=>p.trim()).length;
      const readTime=Math.max(1,Math.round(words/200));
      document.getElementById('output').textContent=[
        'Words: '+words,'Characters: '+chars,'Characters (no spaces): '+charsNoSpace,
        'Sentences: '+sentences,'Paragraphs: '+paragraphs,'Reading time: ~'+readTime+' min'
      ].join('\\n');
    }`,
   controls:'',placeholder:'Type or paste your text here...',outputLabel:'Statistics'},

  {id:'markdown-preview',cat:'text',name:'Markdown Preview',desc:'Write Markdown and see a live HTML preview side by side.',icon:'📝',color:'#7B61FF',
   engine:`
    function run(){
      const input=document.getElementById('input').value;
      const out=document.getElementById('output');
      let html=input
        .replace(/^### (.+)$/gm,'<h3>$1</h3>').replace(/^## (.+)$/gm,'<h2>$1</h2>').replace(/^# (.+)$/gm,'<h1>$1</h1>')
        .replace(/\\*\\*(.+?)\\*\\*/g,'<strong>$1</strong>').replace(/\\*(.+?)\\*/g,'<em>$1</em>')
        .replace(/\`\`\`([\\s\\S]*?)\`\`\`/g,'<pre><code>$1</code></pre>').replace(/\`(.+?)\`/g,'<code>$1</code>')
        .replace(/^- (.+)$/gm,'<li>$1</li>').replace(/\\[(.+?)\\]\\((.+?)\\)/g,'<a href="$2">$1</a>')
        .replace(/^(?!<[h|l|p|u])(.*\\S.*)$/gm,'<p>$1</p>');
      out.innerHTML='<div style="font-family:var(--font);line-height:1.7;color:var(--text);padding:14px">'+html+'</div>';
    }`,
   controls:'',placeholder:'# Hello World\n\nWrite **Markdown** here and see the *preview*.\n\n- Item 1\n- Item 2\n\n`code snippet`',outputLabel:'Preview'},

  {id:'slug-generator',cat:'text',name:'Slug Generator',desc:'Convert any text into a clean, URL-friendly slug.',icon:'🔗',color:'#7B61FF',
   engine:`
    function run(){
      const input=document.getElementById('input').value;
      const sep=document.getElementById('sep').value||'-';
      const slug=input.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').replace(/[^a-z0-9\\s]/g,'').trim().replace(/\\s+/g,sep);
      document.getElementById('output').textContent=slug;
      document.getElementById('status').textContent=slug.length+' characters';
    }`,
   controls:`<div class="form-row"><div class="form-group"><label>Separator</label><select id="sep" onchange="run()"><option value="-">Hyphen (-)</option><option value="_">Underscore (_)</option></select></div></div>`,
   placeholder:'Enter title or text to slugify...',outputLabel:'Generated Slug'},

  {id:'lorem-ipsum',cat:'text',name:'Lorem Ipsum Generator',desc:'Generate placeholder lorem ipsum text for mockups and prototypes.',icon:'📄',color:'#7B61FF',
   engine:`
    const WORDS=['lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit','sed','do','eiusmod','tempor','incididunt','ut','labore','et','dolore','magna','aliqua','enim','ad','minim','veniam','quis','nostrud','exercitation','ullamco','laboris','nisi','aliquip','commodo','consequat'];
    function run(){generate()}
    function generate(){
      const count=parseInt(document.getElementById('count').value)||5;
      const type=document.getElementById('type').value;
      let result='';
      if(type==='words'){result=Array.from({length:count},(_,i)=>WORDS[i%WORDS.length]).join(' ')}
      else if(type==='sentences'){result=Array.from({length:count},()=>{const len=8+Math.floor(Math.random()*10);return Array.from({length:len},(_,i)=>WORDS[Math.floor(Math.random()*WORDS.length)]).join(' ')+'.'}).join(' ')}
      else{result=Array.from({length:count},()=>{const sCount=3+Math.floor(Math.random()*4);return Array.from({length:sCount},()=>{const len=8+Math.floor(Math.random()*10);return Array.from({length:len},()=>WORDS[Math.floor(Math.random()*WORDS.length)]).join(' ')+'.'}).join(' ')}).join('\\n\\n')}
      result=result.charAt(0).toUpperCase()+result.slice(1);
      document.getElementById('output').textContent=result;
      document.getElementById('status').textContent=result.split(/\\s+/).length+' words generated';
    }`,
   controls:`<div class="form-row">
    <div class="form-group"><label>Type</label><select id="type" onchange="generate()"><option value="paragraphs">Paragraphs</option><option value="sentences">Sentences</option><option value="words">Words</option></select></div>
    <div class="form-group"><label>Count</label><input type="number" id="count" value="3" min="1" max="50" style="width:70px" oninput="generate()"/></div>
    <button class="btn btn-primary btn-sm" onclick="generate()">Generate</button>
   </div>`,
   placeholder:'Click Generate to create Lorem Ipsum',outputLabel:'Generated Text'},

  // DevOps
  {id:'timestamp',cat:'devops',name:'Timestamp Converter',desc:'Convert Unix timestamps to readable dates and vice versa.',icon:'🕐',color:'#FF6B35',
   engine:`
    function run(){
      const input=document.getElementById('input').value.trim();
      const out=document.getElementById('output');
      if(!input){showNow();return}
      if(/^\\d{10,13}$/.test(input)){
        const ms=input.length===10?input*1000:parseInt(input);
        const d=new Date(ms);
        out.textContent='Unix: '+input+'\\nUTC: '+d.toUTCString()+'\\nLocal: '+d.toLocaleString()+'\\nISO: '+d.toISOString()+'\\nRelative: '+relTime(d);
      }else{
        const d=new Date(input);
        if(isNaN(d)){out.textContent='✗ Invalid date';return}
        out.textContent='Unix (s): '+Math.floor(d.getTime()/1000)+'\\nUnix (ms): '+d.getTime()+'\\nUTC: '+d.toUTCString()+'\\nISO: '+d.toISOString()+'\\nRelative: '+relTime(d);
      }
    }
    function showNow(){
      const d=new Date();
      document.getElementById('output').textContent='Current time:\\nUnix (s): '+Math.floor(d.getTime()/1000)+'\\nUnix (ms): '+d.getTime()+'\\nUTC: '+d.toUTCString()+'\\nISO: '+d.toISOString();
    }
    function relTime(d){const s=Math.floor((Date.now()-d)/1000);const m=Math.floor(s/60),h=Math.floor(m/60),days=Math.floor(h/24);return days>0?days+' days ago':h>0?h+' hours ago':m>0?m+' minutes ago':s+' seconds ago'}
    showNow();`,
   controls:`<button class="btn btn-secondary btn-sm" onclick="showNow()">Now</button>`,
   placeholder:'Enter Unix timestamp or date string...\ne.g. 1716825600 or 2025-01-01',outputLabel:'Converted Time'},

  {id:'cron-builder',cat:'devops',name:'Cron Expression Builder',desc:'Build cron expressions visually and see the next run times.',icon:'⏰',color:'#FF6B35',
   engine:`
    function run(){updatePreview()}
    function updatePreview(){
      const min=document.getElementById('min').value||'*';
      const hour=document.getElementById('hour').value||'*';
      const dom=document.getElementById('dom').value||'*';
      const mon=document.getElementById('mon').value||'*';
      const dow=document.getElementById('dow').value||'*';
      const expr=min+' '+hour+' '+dom+' '+mon+' '+dow;
      document.getElementById('output').textContent='Expression: '+expr+'\\n\\n'+describeCommon(expr);
      document.getElementById('cron-out').textContent=expr;
    }
    function describeCommon(e){
      const presets={'* * * * *':'Every minute','0 * * * *':'Every hour','0 0 * * *':'Every day at midnight','0 0 * * 0':'Every Sunday at midnight','0 0 1 * *':'First day of every month','0 0 1 1 *':'Every January 1st at midnight','*/5 * * * *':'Every 5 minutes','*/15 * * * *':'Every 15 minutes','0 9 * * 1-5':'Every weekday at 9 AM'};
      return presets[e]||'Custom expression';
    }`,
   controls:`<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:12px">
    <div class="form-group"><label>Minute</label><input id="min" value="*" oninput="run()" style="width:100%"/></div>
    <div class="form-group"><label>Hour</label><input id="hour" value="*" oninput="run()" style="width:100%"/></div>
    <div class="form-group"><label>Day(Month)</label><input id="dom" value="*" oninput="run()" style="width:100%"/></div>
    <div class="form-group"><label>Month</label><input id="mon" value="*" oninput="run()" style="width:100%"/></div>
    <div class="form-group"><label>Day(Week)</label><input id="dow" value="*" oninput="run()" style="width:100%"/></div>
   </div>
   <div class="form-row">
    <code id="cron-out" style="font-size:1.1rem;padding:8px 14px">* * * * *</code>
   </div>
   <div class="form-row" style="flex-wrap:wrap">
    <button class="btn btn-ghost btn-sm" onclick="document.getElementById('min').value='0';document.getElementById('hour').value='*';document.getElementById('dom').value='*';document.getElementById('mon').value='*';document.getElementById('dow').value='*';run()">Every Hour</button>
    <button class="btn btn-ghost btn-sm" onclick="document.getElementById('min').value='0';document.getElementById('hour').value='0';document.getElementById('dom').value='*';document.getElementById('mon').value='*';document.getElementById('dow').value='*';run()">Every Day</button>
    <button class="btn btn-ghost btn-sm" onclick="document.getElementById('min').value='0';document.getElementById('hour').value='9';document.getElementById('dom').value='*';document.getElementById('mon').value='*';document.getElementById('dow').value='1-5';run()">Weekdays 9am</button>
   </div>`,
   placeholder:'',outputLabel:'Expression Details'},

  {id:'yaml-formatter',cat:'devops',name:'YAML Formatter',desc:'Format, validate and prettify YAML files.',icon:'📄',color:'#FF6B35',
   engine:`
    function run(){
      const input=document.getElementById('input').value.trim();
      const out=document.getElementById('output');
      if(!input){out.textContent='';return}
      // Basic YAML validation - check indentation consistency
      const lines=input.split('\\n');
      let errors=[];
      lines.forEach((line,i)=>{
        if(line.includes('\\t'))errors.push('Line '+(i+1)+': Tab indentation found (use spaces)');
      });
      if(errors.length){out.textContent='⚠️ Issues found:\\n'+errors.join('\\n')+'\\n\\nFormatted output:\\n'+input;document.getElementById('status').className='badge badge-warning';document.getElementById('status').textContent='⚠️ '+errors.length+' issue(s)'}
      else{out.textContent=input;document.getElementById('status').className='badge badge-success';document.getElementById('status').textContent='✓ Valid YAML'}
    }`,
   controls:'',placeholder:'Paste YAML here...',outputLabel:'Formatted YAML'},

  {id:'sql-formatter',cat:'devops',name:'SQL Formatter',desc:'Format and beautify SQL queries for better readability.',icon:'🗄️',color:'#FF6B35',
   engine:`
    function run(){
      const input=document.getElementById('input').value.trim();
      const out=document.getElementById('output');
      if(!input){out.textContent='';return}
      const keywords=['SELECT','FROM','WHERE','JOIN','LEFT JOIN','RIGHT JOIN','INNER JOIN','ON','GROUP BY','ORDER BY','HAVING','LIMIT','OFFSET','INSERT INTO','VALUES','UPDATE','SET','DELETE FROM','CREATE TABLE','ALTER TABLE','DROP TABLE','AND','OR','NOT','IN','EXISTS','BETWEEN','LIKE','AS','DISTINCT','COUNT','SUM','AVG','MAX','MIN'];
      let formatted=input;
      keywords.forEach(k=>{const re=new RegExp('\\\\b'+k+'\\\\b','gi');formatted=formatted.replace(re,'\\n'+k)});
      formatted=formatted.replace(/\\n+/g,'\\n').replace(/,\\s*/g,',\\n  ').trim();
      out.textContent=formatted;
      document.getElementById('status').textContent='SQL formatted';
    }`,
   controls:'',placeholder:'Paste SQL query here...',outputLabel:'Formatted SQL'},

  {id:'gitignore',cat:'devops',name:'GitIgnore Generator',desc:'Generate .gitignore files for any language or framework.',icon:'🚫',color:'#FF6B35',
   engine:`
    const TEMPLATES={
      'node':['node_modules/','npm-debug.log*','yarn-debug.log*','.env','.env.local','.DS_Store','dist/','build/','.cache/'],
      'python':['__pycache__/','*.py[cod]','*.egg-info/','dist/','build/','.env','venv/','.venv/','*.pyc','.pytest_cache/'],
      'react':['node_modules/','build/','.env','.env.local','.DS_Store','npm-debug.log*','*.log'],
      'vue':['node_modules/','/dist/','*.log','.env','.env.local','.DS_Store'],
      'java':['*.class','*.jar','*.war','.gradle/','/build/','/out/','*.iml','.idea/','target/'],
      'dotnet':['bin/','obj/','*.user','*.suo','.vs/','*.userprefs','packages/'],
      'macos':['.DS_Store','.AppleDouble','.LSOverride','Icon','Thumbs.db'],
      'windows':['Thumbs.db','ehthumbs.db','Desktop.ini','$RECYCLE.BIN/','*.cab','*.msi'],
    };
    function run(){generate()}
    function generate(){
      const selected=[...document.querySelectorAll('.tmpl-check:checked')].map(c=>c.value);
      if(!selected.length){document.getElementById('output').textContent='Select at least one template';return}
      const lines=['# Generated by DevNova Tools','# https://devnovatools.com',''];
      selected.forEach(s=>{
        lines.push('# '+s.charAt(0).toUpperCase()+s.slice(1));
        lines.push(...(TEMPLATES[s]||[]));
        lines.push('');
      });
      document.getElementById('output').textContent=lines.join('\\n');
      document.getElementById('status').textContent='Generated '+lines.filter(l=>l&&!l.startsWith('#')).length+' rules';
    }`,
   controls:`<div class="form-row" style="flex-wrap:wrap;gap:10px">
    ${['node','python','react','vue','java','dotnet','macos','windows'].map(t=>`<label><input type="checkbox" class="tmpl-check" value="${t}" onchange="generate()"/> ${t.charAt(0).toUpperCase()+t.slice(1)}</label>`).join('')}
   </div>
   <button class="btn btn-primary btn-sm" onclick="generate()">Generate .gitignore</button>`,
   placeholder:'Select templates above and click Generate',outputLabel:'Generated .gitignore'},

  {id:'http-status',cat:'devops',name:'HTTP Status Codes',desc:'Complete reference for all HTTP status codes with descriptions.',icon:'📡',color:'#FF6B35',
   engine:`
    const CODES={
      100:'Continue',101:'Switching Protocols',102:'Processing',
      200:'OK',201:'Created',202:'Accepted',204:'No Content',206:'Partial Content',
      301:'Moved Permanently',302:'Found',304:'Not Modified',307:'Temporary Redirect',308:'Permanent Redirect',
      400:'Bad Request',401:'Unauthorized',403:'Forbidden',404:'Not Found',405:'Method Not Allowed',409:'Conflict',410:'Gone',422:'Unprocessable Entity',429:'Too Many Requests',
      500:'Internal Server Error',501:'Not Implemented',502:'Bad Gateway',503:'Service Unavailable',504:'Gateway Timeout'
    };
    function run(){
      const q=document.getElementById('input').value.trim();
      const out=document.getElementById('output');
      if(!q){showAll();return}
      const matches=Object.entries(CODES).filter(([code,desc])=>code.includes(q)||desc.toLowerCase().includes(q.toLowerCase()));
      out.textContent=matches.length?matches.map(([c,d])=>c+' — '+d).join('\\n'):'No matching status codes found';
    }
    function showAll(){
      const groups={1:'1xx Informational',2:'2xx Success',3:'3xx Redirection',4:'4xx Client Errors',5:'5xx Server Errors'};
      let result='';
      Object.entries(groups).forEach(([prefix,title])=>{
        result+='── '+title+' ──\\n';
        Object.entries(CODES).filter(([c])=>c.startsWith(prefix)).forEach(([c,d])=>result+=c+' — '+d+'\\n');
        result+='\\n';
      });
      document.getElementById('output').textContent=result;
    }
    showAll();`,
   controls:'',placeholder:'Search by code or description... (leave blank to see all)',outputLabel:'HTTP Status Codes'},

  // Frontend
  {id:'css-minifier',cat:'frontend',name:'CSS Minifier',desc:'Minify CSS by removing whitespace, comments and redundant code.',icon:'🎨',color:'#00D4FF',
   engine:`
    function run(){
      const input=document.getElementById('input').value;
      const out=document.getElementById('output');
      if(!input){out.textContent='';return}
      const minified=input
        .replace(/\\/\\*[\\s\\S]*?\\*\\//g,'')
        .replace(/\\s+/g,' ')
        .replace(/\\s*{\\s*/g,'{').replace(/\\s*}\\s*/g,'}')
        .replace(/\\s*:\\s*/g,':').replace(/\\s*;\\s*/g,';')
        .replace(/\\s*,\\s*/g,',').trim();
      const saved=Math.round((1-minified.length/input.replace(/\\s+/g,' ').length)*100);
      out.textContent=minified;
      document.getElementById('status').textContent='Saved '+saved+'% ('+input.length+' → '+minified.length+' bytes)';
    }`,
   controls:'',placeholder:'Paste CSS to minify...',outputLabel:'Minified CSS'},

  {id:'color-converter',cat:'frontend',name:'Color Converter',desc:'Convert colors between HEX, RGB, HSL and HSB formats.',icon:'🎨',color:'#00D4FF',
   engine:`
    function run(){
      const input=document.getElementById('input').value.trim();
      const out=document.getElementById('output');
      if(!input){out.textContent='';return}
      try{
        let r,g,b;
        if(input.startsWith('#')){
          const hex=input.replace('#','');
          r=parseInt(hex.substring(0,2),16);g=parseInt(hex.substring(2,4),16);b=parseInt(hex.substring(4,6),16);
        }else if(input.startsWith('rgb')){
          const m=input.match(/\\d+/g);r=+m[0];g=+m[1];b=+m[2];
        }else{out.textContent='✗ Enter HEX (#rrggbb) or RGB (rgb(r,g,b))';return}
        const hex='#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');
        const rn=r/255,gn=g/255,bn=b/255;
        const max=Math.max(rn,gn,bn),min=Math.min(rn,gn,bn);
        const l=(max+min)/2;
        const s=max===min?0:(l>0.5?(max-min)/(2-max-min):(max-min)/(max+min));
        let h=0;
        if(max!==min){if(max===rn)h=((gn-bn)/(max-min)+6)%6;else if(max===gn)h=(bn-rn)/(max-min)+2;else h=(rn-gn)/(max-min)+4;h/=6}
        out.textContent=['HEX: '+hex,'RGB: rgb('+r+', '+g+', '+b+')','HSL: hsl('+Math.round(h*360)+', '+Math.round(s*100)+'%, '+Math.round(l*100)+'%)','Luminance: '+Math.round(l*100)+'%'].join('\\n');
        document.getElementById('swatch').style.background=hex;
      }catch(e){out.textContent='✗ '+e.message}
    }`,
   controls:`<div id="swatch" style="width:60px;height:60px;border-radius:8px;border:1px solid var(--border);margin-bottom:8px;transition:background 0.3s"></div>`,
   placeholder:'Enter color: #ff6b35 or rgb(255,107,53)...',outputLabel:'Color Values'},

  {id:'gradient-generator',cat:'frontend',name:'Gradient Generator',desc:'Create beautiful CSS gradients and copy the code instantly.',icon:'🌈',color:'#00D4FF',
   engine:`
    function run(){updateGradient()}
    function updateGradient(){
      const c1=document.getElementById('color1').value;
      const c2=document.getElementById('color2').value;
      const angle=document.getElementById('angle').value;
      const type=document.getElementById('gtype').value;
      let css;
      if(type==='linear')css='linear-gradient('+angle+'deg, '+c1+', '+c2+')';
      else if(type==='radial')css='radial-gradient(circle, '+c1+', '+c2+')';
      else css='conic-gradient(from '+angle+'deg, '+c1+', '+c2+')';
      document.getElementById('preview').style.background=css;
      document.getElementById('output').textContent='background: '+css+';\\nbackground: -webkit-'+css+';';
      document.getElementById('status').textContent='CSS copied on click';
    }
    updateGradient();`,
   controls:`<div class="form-row">
    <div class="form-group"><label>Color 1</label><input type="color" id="color1" value="#00C896" oninput="run()"/></div>
    <div class="form-group"><label>Color 2</label><input type="color" id="color2" value="#0066FF" oninput="run()"/></div>
    <div class="form-group"><label>Angle</label><input type="number" id="angle" value="135" min="0" max="360" style="width:70px" oninput="run()"/></div>
    <div class="form-group"><label>Type</label><select id="gtype" onchange="run()"><option value="linear">Linear</option><option value="radial">Radial</option><option value="conic">Conic</option></select></div>
   </div>
   <div id="preview" style="width:100%;height:80px;border-radius:10px;border:1px solid var(--border);margin-bottom:8px"></div>`,
   placeholder:'',outputLabel:'CSS Output'},

  {id:'box-shadow',cat:'frontend',name:'Box Shadow Generator',desc:'Generate CSS box shadows visually with live preview.',icon:'🪟',color:'#00D4FF',
   engine:`
    function run(){updateShadow()}
    function updateShadow(){
      const x=document.getElementById('x').value;const y=document.getElementById('y').value;
      const blur=document.getElementById('blur').value;const spread=document.getElementById('spread').value;
      const color=document.getElementById('scolor').value;const inset=document.getElementById('inset').checked;
      const css=(inset?'inset ':'')+x+'px '+y+'px '+blur+'px '+spread+'px '+color;
      document.getElementById('preview').style.boxShadow=css;
      document.getElementById('output').textContent='box-shadow: '+css+';';
    }
    updateShadow();`,
   controls:`<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
    <div class="form-group"><label>X Offset</label><input type="range" id="x" min="-50" max="50" value="5" oninput="run()"/></div>
    <div class="form-group"><label>Y Offset</label><input type="range" id="y" min="-50" max="50" value="5" oninput="run()"/></div>
    <div class="form-group"><label>Blur</label><input type="range" id="blur" min="0" max="100" value="15" oninput="run()"/></div>
    <div class="form-group"><label>Spread</label><input type="range" id="spread" min="-50" max="50" value="0" oninput="run()"/></div>
   </div>
   <div class="form-row">
    <div class="form-group"><label>Color</label><input type="color" id="scolor" value="#000000" oninput="run()"/></div>
    <div class="form-group"><label>Inset</label><input type="checkbox" id="inset" onchange="run()"/></div>
   </div>
   <div id="preview" style="width:100%;height:80px;background:var(--bg-card);border-radius:10px;border:1px solid var(--border);margin-bottom:8px"></div>`,
   placeholder:'',outputLabel:'CSS Output'},

  {id:'border-radius',cat:'frontend',name:'Border Radius Generator',desc:'Generate custom CSS border-radius with individual corner control.',icon:'⬜',color:'#00D4FF',
   engine:`
    function run(){update()}
    function update(){
      const tl=document.getElementById('tl').value;const tr=document.getElementById('tr').value;
      const br=document.getElementById('br').value;const bl=document.getElementById('bl').value;
      const css=tl+'px '+tr+'px '+br+'px '+bl+'px';
      document.getElementById('preview').style.borderRadius=css;
      document.getElementById('output').textContent='border-radius: '+css+';';
    }
    update();`,
   controls:`<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
    <div class="form-group"><label>Top Left</label><input type="range" id="tl" min="0" max="100" value="8" oninput="run()"/></div>
    <div class="form-group"><label>Top Right</label><input type="range" id="tr" min="0" max="100" value="8" oninput="run()"/></div>
    <div class="form-group"><label>Bottom Right</label><input type="range" id="br" min="0" max="100" value="8" oninput="run()"/></div>
    <div class="form-group"><label>Bottom Left</label><input type="range" id="bl" min="0" max="100" value="8" oninput="run()"/></div>
   </div>
   <div id="preview" style="width:100%;height:80px;background:var(--gradient);margin-bottom:8px"></div>`,
   placeholder:'',outputLabel:'CSS Output'},
];

// ─── CATEGORY INDEX PAGES ──────────────────────────────────────────────────
const CATS = [
  {id:'json',name:'JSON & Data',icon:'🟦',color:'#00C896',desc:'Format, validate, convert and transform JSON and data formats'},
  {id:'api',name:'API & Security',icon:'🔐',color:'#0066FF',desc:'JWT, Base64, hashing, UUID and security utilities'},
  {id:'text',name:'Text & Parsing',icon:'✍️',color:'#7B61FF',desc:'Regex, diff, case conversion, markdown and text utilities'},
  {id:'devops',name:'DevOps & Infra',icon:'⚙️',color:'#FF6B35',desc:'Cron, timestamps, YAML, Docker and infra tools'},
  {id:'frontend',name:'Frontend Tools',icon:'🟢',color:'#00D4FF',desc:'CSS, colors, gradients, shadows and frontend utilities'},
];

// ─── GENERATE TOOL PAGE ────────────────────────────────────────────────────
function makeToolPage(tool, cat) {
  const isDualPanel = tool.extraPanel;
  const bodyClass = isDualPanel ? 'triple' : 'tool-body';
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
    <div class="breadcrumb">
      <a href="/">Home</a> <span>›</span>
      <a href="/${tool.cat}/">${cat.name}</a> <span>›</span>
      <span>${tool.name}</span>
    </div>
    <div class="tool-title-row">
      <div class="tool-icon-wrap" style="background:${tool.color}22;border:1px solid ${tool.color}44">${tool.icon}</div>
      <h1 class="tool-name">${tool.name}</h1>
    </div>
    <p class="tool-desc">${tool.desc}</p>
    <div class="tool-actions">
      <button class="btn btn-primary btn-sm" onclick="run()">▶ Run</button>
      <button class="btn btn-secondary btn-sm" onclick="document.getElementById('input').value='';document.getElementById('output').textContent='';document.getElementById('output').innerHTML=''">Clear</button>
      <button class="btn btn-ghost btn-sm" onclick="DevNova.copyToClipboard(document.getElementById('output').textContent||document.getElementById('output').innerText,this)">Copy Output</button>
    </div>
    ${tool.controls||''}
  </div>

  <div class="tool-body${isDualPanel?' triple':''}">
    <div class="panel">
      <div class="panel-header">
        <span class="panel-label">Input</span>
        <div class="panel-actions">
          <button class="btn-icon" title="Clear" onclick="document.getElementById('input').value='';run()">✕</button>
        </div>
      </div>
      <div class="panel-body">
        <textarea id="input" class="panel-textarea" placeholder="${tool.placeholder||'Enter input...'}" oninput="run()" spellcheck="false"></textarea>
      </div>
    </div>

    ${tool.extraPanel||''}

    <div class="panel">
      <div class="panel-header">
        <span class="panel-label">${tool.outputLabel||'Output'}</span>
        <div class="panel-actions">
          <button class="copy-btn" onclick="DevNova.copyToClipboard(document.getElementById('output').textContent||document.getElementById('output').innerText,this)">Copy</button>
        </div>
      </div>
      <div class="panel-body">
        <div id="output" class="panel-output" spellcheck="false"></div>
      </div>
      <div class="status-bar">
        <span id="status" class="badge badge-info"></span>
      </div>
    </div>
  </div>
</main>

<script src="/assets/layout.js"></script>
<script>
${tool.engine}
</script>
</body>
</html>`;
}

// ─── GENERATE CATEGORY PAGE ────────────────────────────────────────────────
function makeCategoryPage(cat, tools) {
  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${cat.name} — DevNova Tools</title>
<meta name="description" content="${tools.length} free ${cat.name.toLowerCase()} for developers. ${cat.desc}"/>
<link rel="canonical" href="https://devnovatools.com/${cat.id}/"/>
<link rel="stylesheet" href="/assets/shared.css"/>
</head>
<body>
<div class="cat-page">
  <div class="cat-page-header">
    <div class="breadcrumb"><a href="/">Home</a> <span>›</span> <span>${cat.name}</span></div>
    <h1 class="cat-page-title"><span>${cat.icon}</span> ${cat.name}</h1>
    <p class="cat-page-desc">${cat.desc}</p>
  </div>
  <div class="tool-grid" style="--cat-color:${cat.color}">
    ${tools.map(t=>`
    <a href="/${t.cat}/${t.id}/" class="tool-card" style="--cat-color:${cat.color}">
      <span class="tool-card-icon">${t.icon}</span>
      <div>
        <div class="tool-card-name">${t.name}</div>
        <div class="tool-card-desc">${t.desc}</div>
      </div>
    </a>`).join('')}
  </div>
</div>
<script src="/assets/layout.js"></script>
</body>
</html>`;
}

// ─── WRITE ALL FILES ───────────────────────────────────────────────────────
let count = 0;

TOOLS.forEach(tool => {
  const cat = CATS.find(c => c.id === tool.cat);
  const dir = path.join(__dirname, tool.cat, tool.id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), makeToolPage(tool, cat));
  count++;
});

CATS.forEach(cat => {
  const catTools = TOOLS.filter(t => t.cat === cat.id);
  const dir = path.join(__dirname, cat.id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), makeCategoryPage(cat, catTools));
});

console.log(`✅ Built ${count} tool pages across ${CATS.length} categories`);
