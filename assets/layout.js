/* © 2026 DevNova Tools — devnovatools.com. All Rights Reserved. */
const DevNova=(()=>{
const ALL_TOOLS=[
{name:'JSON Formatter',desc:'Format & beautify JSON',path:'/json/formatter/',cat:'JSON & Data',catId:'json',icon:'🟦'},
{name:'JSON Validator',desc:'Validate JSON syntax',path:'/json/validator/',cat:'JSON & Data',catId:'json',icon:'✅'},
{name:'JSON Minifier',desc:'Minify & compress JSON',path:'/json/minifier/',cat:'JSON & Data',catId:'json',icon:'🗜️'},
{name:'JSON Tree Viewer',desc:'Visualize JSON as tree',path:'/json/tree-viewer/',cat:'JSON & Data',catId:'json',icon:'🌳'},
{name:'JSON Diff',desc:'Compare two JSON objects',path:'/json/diff/',cat:'JSON & Data',catId:'json',icon:'🔀'},
{name:'JSON Path Tester',desc:'Test JSONPath expressions',path:'/json/path-tester/',cat:'JSON & Data',catId:'json',icon:'🎯'},
{name:'JSON Schema Generator',desc:'Generate schema from JSON',path:'/json/schema-generator/',cat:'JSON & Data',catId:'json',icon:'📐'},
{name:'JSON Schema Validator',desc:'Validate against schema',path:'/json/schema-validator/',cat:'JSON & Data',catId:'json',icon:'🔍'},
{name:'CSV to JSON',desc:'Convert CSV to JSON',path:'/json/csv-to-json/',cat:'JSON & Data',catId:'json',icon:'📊'},
{name:'JSON to CSV',desc:'Convert JSON to CSV',path:'/json/json-to-csv/',cat:'JSON & Data',catId:'json',icon:'📋'},
{name:'JSON to TypeScript',desc:'Generate TypeScript types',path:'/json/json-to-typescript/',cat:'JSON & Data',catId:'json',icon:'🔷'},
{name:'JSON to Python',desc:'Generate Python dataclass',path:'/json/json-to-python/',cat:'JSON & Data',catId:'json',icon:'🐍'},
{name:'JSON to Go Struct',desc:'Generate Go structs',path:'/json/json-to-go/',cat:'JSON & Data',catId:'json',icon:'🐹'},
{name:'JSON to C# Class',desc:'Generate C# classes',path:'/json/json-to-csharp/',cat:'JSON & Data',catId:'json',icon:'#️⃣'},
{name:'YAML to JSON',desc:'Convert YAML to JSON',path:'/json/yaml-to-json/',cat:'JSON & Data',catId:'json',icon:'🔄'},
{name:'JSON to YAML',desc:'Convert JSON to YAML',path:'/json/json-to-yaml/',cat:'JSON & Data',catId:'json',icon:'🔄'},
{name:'XML to JSON',desc:'Convert XML to JSON',path:'/json/xml-to-json/',cat:'JSON & Data',catId:'json',icon:'🔁'},
{name:'JSON to XML',desc:'Convert JSON to XML',path:'/json/json-to-xml/',cat:'JSON & Data',catId:'json',icon:'🔁'},
{name:'JWT Decoder',desc:'Decode JWT tokens',path:'/api/jwt-decoder/',cat:'API & Security',catId:'api',icon:'🔐'},
{name:'JWT Generator',desc:'Generate JWT tokens',path:'/api/jwt-generator/',cat:'API & Security',catId:'api',icon:'🔑'},
{name:'Base64 Encoder/Decoder',desc:'Encode & decode Base64',path:'/api/base64/',cat:'API & Security',catId:'api',icon:'🔒'},
{name:'URL Encoder/Decoder',desc:'Encode & decode URLs',path:'/api/url-encoder/',cat:'API & Security',catId:'api',icon:'🌐'},
{name:'Hash Generator',desc:'MD5, SHA1, SHA256 hashes',path:'/api/hash-generator/',cat:'API & Security',catId:'api',icon:'#️⃣'},
{name:'HMAC Generator',desc:'Generate HMAC signatures',path:'/api/hmac-generator/',cat:'API & Security',catId:'api',icon:'🛡️'},
{name:'UUID Generator',desc:'Generate UUIDs/GUIDs',path:'/api/uuid-generator/',cat:'API & Security',catId:'api',icon:'🆔'},
{name:'UUID Parser',desc:'Parse UUID components',path:'/api/uuid-parser/',cat:'API & Security',catId:'api',icon:'🔎'},
{name:'Password Generator',desc:'Generate secure passwords',path:'/api/password-generator/',cat:'API & Security',catId:'api',icon:'🔏'},
{name:'IP Address Lookup',desc:'Lookup IP information',path:'/api/ip-lookup/',cat:'API & Security',catId:'api',icon:'🌍'},
{name:'HTTP Header Analyzer',desc:'Analyze HTTP headers',path:'/api/http-headers/',cat:'API & Security',catId:'api',icon:'📡'},
{name:'CORS Checker',desc:'Check CORS headers',path:'/api/cors-checker/',cat:'API & Security',catId:'api',icon:'🔗'},
{name:'SSL Certificate Decoder',desc:'Decode SSL certificates',path:'/api/ssl-decoder/',cat:'API & Security',catId:'api',icon:'🔓'},
{name:'Regex Tester',desc:'Test regular expressions',path:'/text/regex-tester/',cat:'Text & Parsing',catId:'text',icon:'✍️'},
{name:'Regex Generator',desc:'Generate regex patterns',path:'/text/regex-generator/',cat:'Text & Parsing',catId:'text',icon:'🤖'},
{name:'XPath Tester',desc:'Test XPath expressions',path:'/text/xpath-tester/',cat:'Text & Parsing',catId:'text',icon:'🎯'},
{name:'Text Diff Checker',desc:'Compare two texts',path:'/text/diff-checker/',cat:'Text & Parsing',catId:'text',icon:'↔️'},
{name:'Case Converter',desc:'Convert text case',path:'/text/case-converter/',cat:'Text & Parsing',catId:'text',icon:'Aa'},
{name:'Word Counter',desc:'Count words & characters',path:'/text/word-counter/',cat:'Text & Parsing',catId:'text',icon:'🔢'},
{name:'Markdown Preview',desc:'Preview Markdown live',path:'/text/markdown-preview/',cat:'Text & Parsing',catId:'text',icon:'📝'},
{name:'HTML to Markdown',desc:'Convert HTML to Markdown',path:'/text/html-to-markdown/',cat:'Text & Parsing',catId:'text',icon:'🔄'},
{name:'Markdown to HTML',desc:'Convert Markdown to HTML',path:'/text/markdown-to-html/',cat:'Text & Parsing',catId:'text',icon:'🔄'},
{name:'HTML Entity Encoder',desc:'Encode/decode entities',path:'/text/html-entities/',cat:'Text & Parsing',catId:'text',icon:'&'},
{name:'Text Escape/Unescape',desc:'Escape special chars',path:'/text/text-escape/',cat:'Text & Parsing',catId:'text',icon:'\\'},
{name:'Slug Generator',desc:'Generate URL slugs',path:'/text/slug-generator/',cat:'Text & Parsing',catId:'text',icon:'🔗'},
{name:'Number Base Converter',desc:'Convert hex, binary, decimal',path:'/text/base-converter/',cat:'Text & Parsing',catId:'text',icon:'🔢'},
{name:'Unicode Lookup',desc:'Look up Unicode chars',path:'/text/unicode-lookup/',cat:'Text & Parsing',catId:'text',icon:'Ω'},
{name:'Lorem Ipsum Generator',desc:'Generate placeholder text',path:'/text/lorem-ipsum/',cat:'Text & Parsing',catId:'text',icon:'📄'},
{name:'Cron Expression Builder',desc:'Build cron expressions',path:'/devops/cron-builder/',cat:'DevOps & Infra',catId:'devops',icon:'⏰'},
{name:'Cron Expression Tester',desc:'Test cron expressions',path:'/devops/cron-tester/',cat:'DevOps & Infra',catId:'devops',icon:'🧪'},
{name:'Timestamp Converter',desc:'Convert Unix timestamps',path:'/devops/timestamp/',cat:'DevOps & Infra',catId:'devops',icon:'🕐'},
{name:'YAML Formatter',desc:'Format & validate YAML',path:'/devops/yaml-formatter/',cat:'DevOps & Infra',catId:'devops',icon:'📄'},
{name:'XML Formatter',desc:'Format & validate XML',path:'/devops/xml-formatter/',cat:'DevOps & Infra',catId:'devops',icon:'📋'},
{name:'SQL Formatter',desc:'Format SQL queries',path:'/devops/sql-formatter/',cat:'DevOps & Infra',catId:'devops',icon:'🗄️'},
{name:'Dockerfile Linter',desc:'Lint Dockerfiles',path:'/devops/dockerfile/',cat:'DevOps & Infra',catId:'devops',icon:'🐳'},
{name:'GitIgnore Generator',desc:'Generate .gitignore',path:'/devops/gitignore/',cat:'DevOps & Infra',catId:'devops',icon:'🚫'},
{name:'Kubernetes YAML Validator',desc:'Validate K8s manifests',path:'/devops/k8s-validator/',cat:'DevOps & Infra',catId:'devops',icon:'☸️'},
{name:'Environment Variable Editor',desc:'Edit .env files',path:'/devops/env-editor/',cat:'DevOps & Infra',catId:'devops',icon:'🔧'},
{name:'Nginx Config Generator',desc:'Generate Nginx configs',path:'/devops/nginx-config/',cat:'DevOps & Infra',catId:'devops',icon:'🌐'},
{name:'Log Parser',desc:'Parse log files',path:'/devops/log-parser/',cat:'DevOps & Infra',catId:'devops',icon:'📊'},
{name:'HTTP Status Codes',desc:'HTTP status reference',path:'/devops/http-status/',cat:'DevOps & Infra',catId:'devops',icon:'📡'},
{name:'cURL Command Generator',desc:'Build cURL commands',path:'/devops/curl-generator/',cat:'DevOps & Infra',catId:'devops',icon:'💻'},
{name:'.htaccess Generator',desc:'Generate .htaccess rules',path:'/devops/htaccess/',cat:'DevOps & Infra',catId:'devops',icon:'⚙️'},
{name:'SSH Key Generator',desc:'SSH key guide',path:'/devops/ssh-key/',cat:'DevOps & Infra',catId:'devops',icon:'🗝️'},
{name:'CSS Minifier',desc:'Minify CSS code',path:'/frontend/css-minifier/',cat:'Frontend Tools',catId:'frontend',icon:'🎨'},
{name:'JS Minifier',desc:'Minify JavaScript',path:'/frontend/js-minifier/',cat:'Frontend Tools',catId:'frontend',icon:'⚡'},
{name:'HTML Beautifier',desc:'Beautify HTML code',path:'/frontend/html-beautifier/',cat:'Frontend Tools',catId:'frontend',icon:'💅'},
{name:'Color Converter',desc:'Convert HEX, RGB, HSL',path:'/frontend/color-converter/',cat:'Frontend Tools',catId:'frontend',icon:'🎨'},
{name:'Gradient Generator',desc:'Create CSS gradients',path:'/frontend/gradient-generator/',cat:'Frontend Tools',catId:'frontend',icon:'🌈'},
{name:'Box Shadow Generator',desc:'Generate box shadows',path:'/frontend/box-shadow/',cat:'Frontend Tools',catId:'frontend',icon:'🪟'},
{name:'CSS Grid Generator',desc:'Generate grid layouts',path:'/frontend/css-grid/',cat:'Frontend Tools',catId:'frontend',icon:'▦'},
{name:'Flexbox Generator',desc:'Generate flexbox CSS',path:'/frontend/flexbox/',cat:'Frontend Tools',catId:'frontend',icon:'↔️'},
{name:'Border Radius Generator',desc:'Generate border-radius',path:'/frontend/border-radius/',cat:'Frontend Tools',catId:'frontend',icon:'⬜'},
{name:'Image to Base64',desc:'Convert image to Base64',path:'/frontend/image-to-base64/',cat:'Frontend Tools',catId:'frontend',icon:'🖼️'},
{name:'SVG Minifier',desc:'Minify SVG files',path:'/frontend/svg-minifier/',cat:'Frontend Tools',catId:'frontend',icon:'✏️'},
{name:'CSS Specificity Calculator',desc:'Calculate CSS specificity',path:'/frontend/css-specificity/',cat:'Frontend Tools',catId:'frontend',icon:'🎯'},
{name:'Favicon Generator',desc:'Generate favicons',path:'/frontend/favicon-generator/',cat:'Frontend Tools',catId:'frontend',icon:'⭐'},
{name:'Responsive Breakpoints',desc:'CSS breakpoints reference',path:'/frontend/breakpoints/',cat:'Frontend Tools',catId:'frontend',icon:'📱'},
];

const CATS=[
{id:'json',name:'JSON & Data',icon:'🟦',color:'#00C896',desc:'Format, validate and convert JSON'},
{id:'api',name:'API & Security',icon:'🔐',color:'#0066FF',desc:'JWT, Base64, hashing and security'},
{id:'text',name:'Text & Parsing',icon:'✍️',color:'#7B61FF',desc:'Regex, diff, markdown and text tools'},
{id:'devops',name:'DevOps & Infra',icon:'⚙️',color:'#FF6B35',desc:'Cron, timestamps, YAML and Docker'},
{id:'frontend',name:'Frontend Tools',icon:'🟢',color:'#00D4FF',desc:'CSS, colors, gradients and UI tools'},
];

const LOGO_SVG=`<svg width="168" height="36" viewBox="0 0 168 36" xmlns="http://www.w3.org/2000/svg">
<defs><linearGradient id="lg" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="#00C896"/><stop offset="100%" stop-color="#0066FF"/></linearGradient></defs>
<rect x="0" y="0" width="40" height="36" rx="8" fill="url(#lg)"/>
<text x="5" y="22" font-family="monospace" font-weight="700" font-size="11" fill="white">$ DN</text>
<rect x="29" y="14" width="5" height="10" rx="1" fill="rgba(255,255,255,0.75)"/>
<text x="50" y="18" font-family="system-ui,-apple-system,sans-serif" font-weight="700" font-size="16" fill="#00C896">Dev</text>
<text x="80" y="18" font-family="system-ui,-apple-system,sans-serif" font-weight="700" font-size="16" fill="#F5F7FA">Nova</text>
<text x="50" y="32" font-family="system-ui,-apple-system,sans-serif" font-weight="400" font-size="11" fill="#6B7E99" letter-spacing="2">TOOLS</text>
</svg>`;

function getTheme(){return localStorage.getItem('dnt-theme')||'dark'}
function setTheme(t){document.documentElement.setAttribute('data-theme',t);localStorage.setItem('dnt-theme',t);const btn=document.getElementById('theme-btn');if(btn)btn.textContent=t==='dark'?'☀️ Light':'🌙 Dark'}
function copyToClipboard(text,btn){navigator.clipboard.writeText(text).then(()=>{if(btn){const orig=btn.textContent;btn.textContent='✓ Copied';btn.classList.add('copied');setTimeout(()=>{btn.textContent=orig;btn.classList.remove('copied')},2000)}})}
function initSearch(inputId,resultsId){
  const input=document.getElementById(inputId);const results=document.getElementById(resultsId);if(!input||!results)return;
  input.addEventListener('input',()=>{
    const q=input.value.trim().toLowerCase();
    if(!q){results.classList.remove('show');results.innerHTML='';return}
    const BUILT=['json','api','text','devops','frontend'];
    const matches=ALL_TOOLS.filter(t=>BUILT.includes(t.catId)&&(t.name.toLowerCase().includes(q)||t.desc.toLowerCase().includes(q)||t.cat.toLowerCase().includes(q))).slice(0,8);
    if(!matches.length){results.classList.remove('show');return}
    results.innerHTML=matches.map(t=>`<a class="search-result-item" href="${t.path}"><span>${t.icon}</span><span>${t.name}</span><span class="search-result-cat">${t.cat}</span></a>`).join('');
    results.classList.add('show');
  });
  document.addEventListener('click',e=>{if(!input.contains(e.target)&&!results.contains(e.target)){results.classList.remove('show')}});
}

function injectNav(){
  const nav=document.createElement('nav');nav.id='dnt-nav';
  nav.innerHTML=`
    <button class="hamburger" id="hamburger" aria-label="Menu" style="display:none">☰</button>
    <a href="/" class="nav-logo-svg">${LOGO_SVG}</a>
    <div class="nav-search-wrap">
      <span class="nav-search-icon">🔍</span>
      <input id="nav-search" class="nav-search" type="text" placeholder="Search JSON formatter, JWT decoder, regex tester..." autocomplete="off"/>
      <div id="nav-search-results" class="nav-search-results"></div>
    </div>
    <div class="nav-right">
      <button id="theme-btn" class="theme-btn">☀️ Light</button>
    </div>`;
  document.body.insertBefore(nav,document.body.firstChild);
  document.getElementById('theme-btn').addEventListener('click',()=>{setTheme(getTheme()==='dark'?'light':'dark')});
  document.getElementById('hamburger').addEventListener('click',()=>{
    const sidebar=document.getElementById('dnt-sidebar');
    const overlay=document.getElementById('sidebar-overlay');
    if(sidebar){sidebar.classList.toggle('open')}
    if(overlay){overlay.classList.toggle('show')}
  });
  setTheme(getTheme());
  initSearch('nav-search','nav-search-results');
}

function injectSidebar(){
  const curPath=window.location.pathname;
  const curCat=CATS.find(c=>curPath.startsWith('/'+c.id+'/'));

  const overlay=document.createElement('div');
  overlay.className='sidebar-overlay';overlay.id='sidebar-overlay';
  overlay.addEventListener('click',()=>{
    document.getElementById('dnt-sidebar')?.classList.remove('open');
    overlay.classList.remove('show');
  });
  document.body.appendChild(overlay);

  const sidebar=document.createElement('aside');
  sidebar.className='dnt-sidebar';sidebar.id='dnt-sidebar';

  let sidebarHTML=`
    <div class="sidebar-search">
      <div class="sidebar-search-wrap">
        <span class="sidebar-search-icon">🔍</span>
        <input class="sidebar-search-input" id="sidebar-search" type="text" placeholder="Filter tools..." autocomplete="off"/>
      </div>
    </div>
    <div class="sidebar-inner">
      <a href="/" class="sidebar-home-link">🏠 <span>Home — All Tools</span></a>`;

  CATS.forEach(cat=>{
    const tools=ALL_TOOLS.filter(t=>t.catId===cat.id);
    const isActiveCat=curPath.startsWith('/'+cat.id+'/');
    sidebarHTML+=`
      <div class="sidebar-section">
        <button class="sidebar-cat-btn${isActiveCat?' active':''}" style="--cat-color:${cat.color}" onclick="toggleCat('${cat.id}')">
          <span class="sidebar-cat-icon">${cat.icon}</span>
          <span class="sidebar-cat-name">${cat.name}</span>
          <span class="sidebar-cat-count">${tools.length}</span>
          <span class="sidebar-chevron" id="chevron-${cat.id}">${isActiveCat?'▾':'▸'}</span>
        </button>
        <div class="sidebar-tools${isActiveCat?' open':''}" id="tools-${cat.id}">
          ${tools.map(t=>`<a href="${t.path}" class="sidebar-tool-link${curPath===t.path?' active':''}" style="${curPath===t.path?'--cat-color:'+cat.color:''}">${t.icon} ${t.name}</a>`).join('')}
        </div>
      </div>`;
  });

  sidebarHTML+=`</div>`;
  sidebar.innerHTML=sidebarHTML;

  // Insert sidebar after nav
  const nav=document.getElementById('dnt-nav');
  if(nav&&nav.nextSibling){
    document.body.insertBefore(sidebar,nav.nextSibling);
  }else{
    document.body.appendChild(sidebar);
  }

  // Wrap remaining body content in app-layout
  const appLayout=document.createElement('div');
  appLayout.className='app-layout';
  const main=document.createElement('div');
  main.className='dnt-main';

  // Move all body children after sidebar into main
  const children=[];
  let el=sidebar.nextSibling;
  while(el){
    const next=el.nextSibling;
    if(el.id!=='dnt-footer'&&el.className!=='sidebar-overlay'){
      children.push(el);
    }
    el=next;
  }
  children.forEach(c=>main.appendChild(c));

  appLayout.appendChild(sidebar.cloneNode(false));
  sidebar.replaceWith(appLayout);
  appLayout.insertBefore(sidebar,appLayout.firstChild);
  appLayout.appendChild(main);

  // Sidebar search filter
  const sSearch=document.getElementById('sidebar-search');
  if(sSearch){
    sSearch.addEventListener('input',()=>{
      const q=sSearch.value.toLowerCase();
      document.querySelectorAll('.sidebar-tool-link').forEach(link=>{
        link.style.display=!q||link.textContent.toLowerCase().includes(q)?'':'none';
      });
      if(q){document.querySelectorAll('.sidebar-tools').forEach(t=>t.classList.add('open'))}
    });
  }
}

function toggleCat(catId){
  const tools=document.getElementById('tools-'+catId);
  const chevron=document.getElementById('chevron-'+catId);
  if(tools){tools.classList.toggle('open')}
  if(chevron){chevron.textContent=tools?.classList.contains('open')?'▾':'▸'}
}

function injectFooter(){
  const f=document.createElement('footer');f.id='dnt-footer';
  f.innerHTML=`<div class="footer-grid">
    <div>
      <div class="footer-brand-name">DevNova Tools</div>
      <div class="footer-tagline">Free developer tools for JSON, APIs,<br>AI, DevOps and Frontend. No signup required.</div>
    </div>
    <div><div class="footer-col-title">JSON & Data</div><ul class="footer-links">
      <li><a href="/json/formatter/">JSON Formatter</a></li><li><a href="/json/validator/">JSON Validator</a></li>
      <li><a href="/json/diff/">JSON Diff</a></li><li><a href="/json/csv-to-json/">CSV to JSON</a></li>
      <li><a href="/json/">All JSON Tools →</a></li></ul></div>
    <div><div class="footer-col-title">API & Security</div><ul class="footer-links">
      <li><a href="/api/jwt-decoder/">JWT Decoder</a></li><li><a href="/api/base64/">Base64</a></li>
      <li><a href="/api/hash-generator/">Hash Generator</a></li><li><a href="/api/uuid-generator/">UUID Generator</a></li>
      <li><a href="/api/">All API Tools →</a></li></ul></div>
    <div><div class="footer-col-title">More Tools</div><ul class="footer-links">
      <li><a href="/text/regex-tester/">Regex Tester</a></li><li><a href="/devops/cron-builder/">Cron Builder</a></li>
      <li><a href="/devops/timestamp/">Timestamp</a></li><li><a href="/frontend/color-converter/">Color Converter</a></li>
      <li><a href="/blog/">Developer Blog</a></li></ul></div>
  </div>
  <div class="footer-bottom">
    <div class="footer-copy">© 2026 DevNova Tools — devnovatools.com. All rights reserved.</div>
    <div class="footer-copy">No signup · No ads · Privacy-friendly</div>
  </div>`;
  document.body.appendChild(f);
}

function init(){injectNav();injectSidebar();injectFooter()}
return{init,ALL_TOOLS,CATS,copyToClipboard,initSearch,getTheme,setTheme};
})();
document.addEventListener('DOMContentLoaded',()=>DevNova.init());
