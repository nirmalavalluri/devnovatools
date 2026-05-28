/* © 2026 DevNova Tools — devnovatools.com. All Rights Reserved. */
const DevNova = (() => {
const ALL_TOOLS = [
 {name:'JSON Formatter',desc:'Format & beautify JSON',path:'/json/formatter/',cat:'JSON & Data',catId:'json',icon:'🟦'},
 {name:'JSON Validator',desc:'Validate JSON syntax',path:'/json/validator/',cat:'JSON & Data',catId:'json',icon:'✅'},
 {name:'JSON Minifier',desc:'Minify & compress JSON',path:'/json/minifier/',cat:'JSON & Data',catId:'json',icon:'🗜️'},
 {name:'JSON Tree Viewer',desc:'Visualize JSON as a tree',path:'/json/tree-viewer/',cat:'JSON & Data',catId:'json',icon:'🌳'},
 {name:'JSON Diff',desc:'Compare two JSON objects',path:'/json/diff/',cat:'JSON & Data',catId:'json',icon:'🔀'},
 {name:'JSON Path Tester',desc:'Test JSONPath expressions',path:'/json/path-tester/',cat:'JSON & Data',catId:'json',icon:'🎯'},
 {name:'JSON Schema Generator',desc:'Generate schema from JSON',path:'/json/schema-generator/',cat:'JSON & Data',catId:'json',icon:'📐'},
 {name:'JSON Schema Validator',desc:'Validate against schema',path:'/json/schema-validator/',cat:'JSON & Data',catId:'json',icon:'🔍'},
 {name:'CSV to JSON',desc:'Convert CSV to JSON',path:'/json/csv-to-json/',cat:'JSON & Data',catId:'json',icon:'📊'},
 {name:'JSON to CSV',desc:'Convert JSON to CSV',path:'/json/json-to-csv/',cat:'JSON & Data',catId:'json',icon:'📋'},
 {name:'JSON to TypeScript',desc:'Generate TypeScript interfaces',path:'/json/json-to-typescript/',cat:'JSON & Data',catId:'json',icon:'🔷'},
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
 {name:'UUID Parser',desc:'Parse UUID into components',path:'/api/uuid-parser/',cat:'API & Security',catId:'api',icon:'🔎'},
 {name:'Password Generator',desc:'Generate secure passwords',path:'/api/password-generator/',cat:'API & Security',catId:'api',icon:'🔏'},
 {name:'IP Address Lookup',desc:'Lookup IP information',path:'/api/ip-lookup/',cat:'API & Security',catId:'api',icon:'🌍'},
 {name:'HTTP Header Analyzer',desc:'Analyze HTTP headers reference',path:'/api/http-headers/',cat:'API & Security',catId:'api',icon:'📡'},
 {name:'CORS Checker',desc:'Check & explain CORS',path:'/api/cors-checker/',cat:'API & Security',catId:'api',icon:'🔗'},
 {name:'SSL Certificate Decoder',desc:'Decode SSL/TLS certificates',path:'/api/ssl-decoder/',cat:'API & Security',catId:'api',icon:'🔓'},
 {name:'Regex Tester',desc:'Test regular expressions',path:'/text/regex-tester/',cat:'Text & Parsing',catId:'text',icon:'✍️'},
 {name:'Regex Generator',desc:'Generate regex from description',path:'/text/regex-generator/',cat:'Text & Parsing',catId:'text',icon:'🤖'},
 {name:'XPath Tester',desc:'Test XPath expressions',path:'/text/xpath-tester/',cat:'Text & Parsing',catId:'text',icon:'🎯'},
 {name:'Text Diff Checker',desc:'Compare two texts',path:'/text/diff-checker/',cat:'Text & Parsing',catId:'text',icon:'↔️'},
 {name:'Case Converter',desc:'Convert text case formats',path:'/text/case-converter/',cat:'Text & Parsing',catId:'text',icon:'Aa'},
 {name:'Word Counter',desc:'Count words & characters',path:'/text/word-counter/',cat:'Text & Parsing',catId:'text',icon:'🔢'},
 {name:'Markdown Preview',desc:'Preview Markdown live',path:'/text/markdown-preview/',cat:'Text & Parsing',catId:'text',icon:'📝'},
 {name:'HTML to Markdown',desc:'Convert HTML to Markdown',path:'/text/html-to-markdown/',cat:'Text & Parsing',catId:'text',icon:'🔄'},
 {name:'Markdown to HTML',desc:'Convert Markdown to HTML',path:'/text/markdown-to-html/',cat:'Text & Parsing',catId:'text',icon:'🔄'},
 {name:'HTML Entity Encoder',desc:'Encode/decode HTML entities',path:'/text/html-entities/',cat:'Text & Parsing',catId:'text',icon:'&'},
 {name:'Text Escape/Unescape',desc:'Escape special characters',path:'/text/text-escape/',cat:'Text & Parsing',catId:'text',icon:'\\'},
 {name:'Slug Generator',desc:'Generate URL-friendly slugs',path:'/text/slug-generator/',cat:'Text & Parsing',catId:'text',icon:'🔗'},
 {name:'Number Base Converter',desc:'Convert hex, binary, decimal',path:'/text/base-converter/',cat:'Text & Parsing',catId:'text',icon:'🔢'},
 {name:'Unicode Lookup',desc:'Look up Unicode characters',path:'/text/unicode-lookup/',cat:'Text & Parsing',catId:'text',icon:'Ω'},
 {name:'Lorem Ipsum Generator',desc:'Generate placeholder text',path:'/text/lorem-ipsum/',cat:'Text & Parsing',catId:'text',icon:'📄'},
 {name:'Cron Expression Builder',desc:'Build cron expressions visually',path:'/devops/cron-builder/',cat:'DevOps & Infra',catId:'devops',icon:'⏰'},
 {name:'Cron Expression Tester',desc:'Test & explain cron expressions',path:'/devops/cron-tester/',cat:'DevOps & Infra',catId:'devops',icon:'🧪'},
 {name:'Timestamp Converter',desc:'Convert Unix timestamps',path:'/devops/timestamp/',cat:'DevOps & Infra',catId:'devops',icon:'🕐'},
 {name:'YAML Formatter',desc:'Format & validate YAML',path:'/devops/yaml-formatter/',cat:'DevOps & Infra',catId:'devops',icon:'📄'},
 {name:'XML Formatter',desc:'Format & validate XML',path:'/devops/xml-formatter/',cat:'DevOps & Infra',catId:'devops',icon:'📋'},
 {name:'SQL Formatter',desc:'Format SQL queries',path:'/devops/sql-formatter/',cat:'DevOps & Infra',catId:'devops',icon:'🗄️'},
 {name:'Dockerfile Linter',desc:'Lint & check Dockerfiles',path:'/devops/dockerfile/',cat:'DevOps & Infra',catId:'devops',icon:'🐳'},
 {name:'GitIgnore Generator',desc:'Generate .gitignore files',path:'/devops/gitignore/',cat:'DevOps & Infra',catId:'devops',icon:'🚫'},
 {name:'Kubernetes YAML Validator',desc:'Validate K8s manifests',path:'/devops/k8s-validator/',cat:'DevOps & Infra',catId:'devops',icon:'☸️'},
 {name:'Environment Variable Editor',desc:'Edit & validate .env files',path:'/devops/env-editor/',cat:'DevOps & Infra',catId:'devops',icon:'🔧'},
 {name:'Nginx Config Generator',desc:'Generate Nginx server configs',path:'/devops/nginx-config/',cat:'DevOps & Infra',catId:'devops',icon:'🌐'},
 {name:'Log Parser',desc:'Parse & analyze log files',path:'/devops/log-parser/',cat:'DevOps & Infra',catId:'devops',icon:'📊'},
 {name:'HTTP Status Codes',desc:'HTTP status code reference',path:'/devops/http-status/',cat:'DevOps & Infra',catId:'devops',icon:'📡'},
 {name:'cURL Command Generator',desc:'Build cURL commands visually',path:'/devops/curl-generator/',cat:'DevOps & Infra',catId:'devops',icon:'💻'},
 {name:'.htaccess Generator',desc:'Generate .htaccess rules',path:'/devops/htaccess/',cat:'DevOps & Infra',catId:'devops',icon:'⚙️'},
 {name:'SSH Key Generator',desc:'SSH key info & generator guide',path:'/devops/ssh-key/',cat:'DevOps & Infra',catId:'devops',icon:'🗝️'},
 {name:'CSS Minifier',desc:'Minify CSS code',path:'/frontend/css-minifier/',cat:'Frontend Tools',catId:'frontend',icon:'🎨'},
 {name:'JS Minifier',desc:'Minify JavaScript code',path:'/frontend/js-minifier/',cat:'Frontend Tools',catId:'frontend',icon:'⚡'},
 {name:'HTML Beautifier',desc:'Beautify & format HTML',path:'/frontend/html-beautifier/',cat:'Frontend Tools',catId:'frontend',icon:'💅'},
 {name:'Color Converter',desc:'Convert HEX, RGB, HSL',path:'/frontend/color-converter/',cat:'Frontend Tools',catId:'frontend',icon:'🎨'},
 {name:'Gradient Generator',desc:'Create CSS gradients',path:'/frontend/gradient-generator/',cat:'Frontend Tools',catId:'frontend',icon:'🌈'},
 {name:'Box Shadow Generator',desc:'Generate CSS box shadows',path:'/frontend/box-shadow/',cat:'Frontend Tools',catId:'frontend',icon:'🪟'},
 {name:'CSS Grid Generator',desc:'Generate CSS Grid layouts',path:'/frontend/css-grid/',cat:'Frontend Tools',catId:'frontend',icon:'▦'},
 {name:'Flexbox Generator',desc:'Generate Flexbox CSS',path:'/frontend/flexbox/',cat:'Frontend Tools',catId:'frontend',icon:'↔️'},
 {name:'Border Radius Generator',desc:'Generate border-radius CSS',path:'/frontend/border-radius/',cat:'Frontend Tools',catId:'frontend',icon:'⬜'},
 {name:'Image to Base64',desc:'Convert image to Base64',path:'/frontend/image-to-base64/',cat:'Frontend Tools',catId:'frontend',icon:'🖼️'},
 {name:'SVG Minifier',desc:'Minify SVG files',path:'/frontend/svg-minifier/',cat:'Frontend Tools',catId:'frontend',icon:'✏️'},
 {name:'CSS Specificity Calculator',desc:'Calculate CSS specificity',path:'/frontend/css-specificity/',cat:'Frontend Tools',catId:'frontend',icon:'🎯'},
 {name:'Favicon Generator',desc:'Generate favicons from text',path:'/frontend/favicon-generator/',cat:'Frontend Tools',catId:'frontend',icon:'⭐'},
 {name:'Responsive Breakpoints',desc:'CSS breakpoints reference',path:'/frontend/breakpoints/',cat:'Frontend Tools',catId:'frontend',icon:'📱'},
 {name:'DNS Lookup',desc:'Query DNS records for any domain',path:'/network/dns-lookup/',cat:'Network & DNS',catId:'network',icon:'🌐'},
 {name:'IP Geolocation',desc:'Geolocate any IP address',path:'/network/ip-geolocation/',cat:'Network & DNS',catId:'network',icon:'📍'},
 {name:'WHOIS Lookup',desc:'WHOIS domain registration info',path:'/network/whois/',cat:'Network & DNS',catId:'network',icon:'🔍'},
 {name:'Port Reference',desc:'Common ports & services reference',path:'/network/port-reference/',cat:'Network & DNS',catId:'network',icon:'🔌'},
 {name:'SSL Expiry Checker',desc:'Check SSL certificate expiry',path:'/network/ssl-expiry/',cat:'Network & DNS',catId:'network',icon:'🔒'},
 {name:'HTTP Response Inspector',desc:'Inspect HTTP response headers',path:'/network/http-inspector/',cat:'Network & DNS',catId:'network',icon:'🔭'},
 {name:'CIDR Calculator',desc:'Calculate IP ranges from CIDR',path:'/network/cidr/',cat:'Network & DNS',catId:'network',icon:'📡'},
 {name:'Image to Base64',desc:'Convert images to Base64 strings',path:'/image/image-to-base64/',cat:'Image & Media',catId:'image',icon:'🖼️'},
 {name:'Image Resizer',desc:'Resize images in the browser',path:'/image/image-resizer/',cat:'Image & Media',catId:'image',icon:'📐'},
 {name:'Image Compressor',desc:'Compress images client-side',path:'/image/image-compressor/',cat:'Image & Media',catId:'image',icon:'🗜️'},
 {name:'Image Format Converter',desc:'Convert between PNG, JPEG, WebP',path:'/image/image-converter/',cat:'Image & Media',catId:'image',icon:'🔄'},
 {name:'SVG to PNG',desc:'Convert SVG to PNG image',path:'/image/svg-to-png/',cat:'Image & Media',catId:'image',icon:'✏️'},
 {name:'Color Palette Extractor',desc:'Extract colors from an image',path:'/image/color-palette/',cat:'Image & Media',catId:'image',icon:'🎨'},
 {name:'EXIF Viewer',desc:'View image EXIF metadata',path:'/image/exif-viewer/',cat:'Image & Media',catId:'image',icon:'📷'},
 {name:'AES Encrypt/Decrypt',desc:'AES-GCM encryption in browser',path:'/encoding/aes/',cat:'Encoding & Crypto',catId:'encoding',icon:'🔐'},
 {name:'ROT13 Encoder',desc:'ROT13 encode & decode text',path:'/encoding/rot13/',cat:'Encoding & Crypto',catId:'encoding',icon:'🔄'},
 {name:'Morse Code',desc:'Encode & decode Morse code',path:'/encoding/morse/',cat:'Encoding & Crypto',catId:'encoding',icon:'📡'},
 {name:'Binary Text Converter',desc:'Convert text to binary & back',path:'/encoding/binary-text/',cat:'Encoding & Crypto',catId:'encoding',icon:'01'},
 {name:'Bitwise Calculator',desc:'Perform bitwise operations',path:'/encoding/bitwise/',cat:'Encoding & Crypto',catId:'encoding',icon:'⚙️'},
 {name:'URL Safe Base64',desc:'URL-safe Base64 encoding',path:'/encoding/url-safe-base64/',cat:'Encoding & Crypto',catId:'encoding',icon:'🔒'},
 {name:'Hex Encoder/Decoder',desc:'Encode & decode hex strings',path:'/encoding/hex/',cat:'Encoding & Crypto',catId:'encoding',icon:'0x'},
 {name:'SQL to ORM Generator',desc:'Generate Prisma/Sequelize from SQL',path:'/database/sql-to-orm/',cat:'Database Tools',catId:'database',icon:'🗄️'},
 {name:'DB Schema Visualizer',desc:'Visualize CREATE TABLE statements',path:'/database/schema-visualizer/',cat:'Database Tools',catId:'database',icon:'📊'},
 {name:'Query Explainer',desc:'Explain SQL query clauses',path:'/database/query-explainer/',cat:'Database Tools',catId:'database',icon:'🔍'},
 {name:'JSON to SQL Insert',desc:'Generate SQL INSERT from JSON',path:'/database/json-to-sql/',cat:'Database Tools',catId:'database',icon:'🔄'},
 {name:'SQL to JSON',desc:'Convert SQL results to JSON',path:'/database/sql-to-json/',cat:'Database Tools',catId:'database',icon:'🔄'},
 {name:'Mermaid Live Editor',desc:'Create Mermaid diagrams live',path:'/diagramming/mermaid/',cat:'Diagramming',catId:'diagramming',icon:'📊'},
 {name:'Flowchart Builder',desc:'Build flowcharts with Mermaid',path:'/diagramming/flowchart/',cat:'Diagramming',catId:'diagramming',icon:'🔀'},
 {name:'Sequence Diagram',desc:'Create sequence diagrams',path:'/diagramming/sequence/',cat:'Diagramming',catId:'diagramming',icon:'📋'},
 {name:'ERD Generator',desc:'Generate entity-relationship diagrams',path:'/diagramming/erd/',cat:'Diagramming',catId:'diagramming',icon:'🔗'},
 {name:'Gantt Chart Builder',desc:'Build Gantt charts with Mermaid',path:'/diagramming/gantt/',cat:'Diagramming',catId:'diagramming',icon:'📅'},
 {name:'npm Package Search',desc:'Search npm packages',path:'/packages/npm-search/',cat:'Package & Version',catId:'packages',icon:'📦'},
 {name:'PyPI Package Search',desc:'Search Python packages',path:'/packages/pypi-search/',cat:'Package & Version',catId:'packages',icon:'🐍'},
 {name:'Semver Calculator',desc:'Calculate semantic versions',path:'/packages/semver/',cat:'Package & Version',catId:'packages',icon:'🔢'},
 {name:'License Checker',desc:'Look up open source licenses',path:'/packages/license-checker/',cat:'Package & Version',catId:'packages',icon:'📜'},
 {name:'Changelog Generator',desc:'Generate CHANGELOG templates',path:'/packages/changelog/',cat:'Package & Version',catId:'packages',icon:'📝'},
 {name:'HTML/CSS/JS Playground',desc:'Live HTML, CSS and JS sandbox',path:'/playground/html/',cat:'Code Playground',catId:'playground',icon:'🧪'},
 {name:'JSON/YAML Editor',desc:'Live JSON and YAML side by side',path:'/playground/json-yaml/',cat:'Code Playground',catId:'playground',icon:'📝'},
 {name:'Regex Playground',desc:'Advanced regex testing environment',path:'/playground/regex/',cat:'Code Playground',catId:'playground',icon:'🎯'},
 {name:'CSS Playground',desc:'Live CSS animation & effects',path:'/playground/css/',cat:'Code Playground',catId:'playground',icon:'🎨'},
 {name:'REST Client',desc:'Test REST API endpoints',path:'/apitesting/rest-client/',cat:'API Testing',catId:'apitesting',icon:'🔵'},
 {name:'GraphQL Explorer',desc:'Test GraphQL queries',path:'/apitesting/graphql/',cat:'API Testing',catId:'apitesting',icon:'🟣'},
 {name:'WebSocket Tester',desc:'Test WebSocket connections',path:'/apitesting/websocket/',cat:'API Testing',catId:'apitesting',icon:'🔌'},
 {name:'Webhook Sender',desc:'Send webhook requests',path:'/apitesting/webhook/',cat:'API Testing',catId:'apitesting',icon:'📤'},
 {name:'cURL Builder',desc:'Build cURL commands visually',path:'/apitesting/curl/',cat:'API Testing',catId:'apitesting',icon:'💻'},
 {name:'Mock API Server',desc:'Create local mock API endpoints',path:'/apitesting/mock-api/',cat:'API Testing',catId:'apitesting',icon:'🎭'},
 {name:'SSE Tester',desc:'Test Server-Sent Events',path:'/apitesting/sse/',cat:'API Testing',catId:'apitesting',icon:'📡'},
 {name:'QR Code Generator',desc:'Generate QR codes instantly',path:'/productivity/qr-generator/',cat:'Productivity',catId:'productivity',icon:'📱'},
 {name:'Barcode Generator',desc:'Generate barcodes',path:'/productivity/barcode/',cat:'Productivity',catId:'productivity',icon:'▊▊▊'},
 {name:'Time Zone Converter',desc:'Convert times across timezones',path:'/productivity/timezone/',cat:'Productivity',catId:'productivity',icon:'🌍'},
 {name:'Unit Converter',desc:'Convert bytes, units and more',path:'/productivity/unit-converter/',cat:'Productivity',catId:'productivity',icon:'⚖️'},
 {name:'Markdown Table Generator',desc:'Generate markdown tables',path:'/productivity/markdown-table/',cat:'Productivity',catId:'productivity',icon:'📊'},
 {name:'File Size Calculator',desc:'Calculate and convert file sizes',path:'/productivity/file-size/',cat:'Productivity',catId:'productivity',icon:'💾'},
 {name:'ASCII Art Generator',desc:'Convert text to ASCII art',path:'/productivity/ascii-art/',cat:'Productivity',catId:'productivity',icon:'🎨'},
 {name:'Color Picker',desc:'Pick and save colors',path:'/productivity/color-picker/',cat:'Productivity',catId:'productivity',icon:'🎨'},
 {name:'Number Formatter',desc:'Format numbers for any locale',path:'/productivity/number-formatter/',cat:'Productivity',catId:'productivity',icon:'🔢'},
 {name:'Explain This Code',desc:'Get plain-English code explanations',path:'/ai/explain-code/',cat:'AI-Assisted Tools',catId:'ai',icon:'🤖'},
 {name:'Regex from Description',desc:'Generate regex from plain English',path:'/ai/regex-generator/',cat:'AI-Assisted Tools',catId:'ai',icon:'✨'},
 {name:'Cron from Description',desc:'Generate cron from plain English',path:'/ai/cron-generator/',cat:'AI-Assisted Tools',catId:'ai',icon:'⏰'},
 {name:'Unit Test Generator',desc:'Generate unit tests from code',path:'/ai/unit-tests/',cat:'AI-Assisted Tools',catId:'ai',icon:'🧪'},
 {name:'SQL from English',desc:'Write SQL from plain English',path:'/ai/sql-generator/',cat:'AI-Assisted Tools',catId:'ai',icon:'🗄️'},
 {name:'Code Reviewer',desc:'AI code review & bug finder',path:'/ai/code-reviewer/',cat:'AI-Assisted Tools',catId:'ai',icon:'🔍'},
 {name:'Code Converter',desc:'Convert code between languages',path:'/ai/code-converter/',cat:'AI-Assisted Tools',catId:'ai',icon:'🔄'},
 {name:'Dockerfile Generator',desc:'Generate Dockerfile from description',path:'/ai/dockerfile-generator/',cat:'AI-Assisted Tools',catId:'ai',icon:'🐳'},
 {name:'Git Commit Generator',desc:'Generate git commit messages',path:'/ai/git-commit/',cat:'AI-Assisted Tools',catId:'ai',icon:'📝'},
 {name:'API Docs Generator',desc:'Generate API documentation',path:'/ai/api-docs/',cat:'AI-Assisted Tools',catId:'ai',icon:'📚'},
 {name:'README Generator',desc:'Generate README from description',path:'/ai/readme-generator/',cat:'AI-Assisted Tools',catId:'ai',icon:'📄'},
 {name:'Error Explainer',desc:'Explain error messages in plain English',path:'/ai/error-explainer/',cat:'AI-Assisted Tools',catId:'ai',icon:'🐛'},
 {name:'Mock Data Generator',desc:'Generate realistic mock data',path:'/ai/mock-data/',cat:'AI-Assisted Tools',catId:'ai',icon:'🎲'},
 {name:'OpenAPI Viewer',desc:'Visualize OpenAPI/Swagger specs',path:'/generators/openapi-viewer/',cat:'Code Generators',catId:'generators',icon:'📋'},
 {name:'Fake Data Generator',desc:'Generate realistic test data',path:'/generators/fake-data/',cat:'Code Generators',catId:'generators',icon:'🎲'},
 {name:'GraphQL to TypeScript',desc:'Generate TS types from GraphQL',path:'/generators/graphql-ts/',cat:'Code Generators',catId:'generators',icon:'🔷'},
 {name:'README Generator',desc:'Generate README templates',path:'/generators/readme/',cat:'Code Generators',catId:'generators',icon:'📄'},
 {name:'OpenAPI to Markdown',desc:'Convert OpenAPI spec to docs',path:'/generators/openapi-md/',cat:'Code Generators',catId:'generators',icon:'📝'},
 {name:'JSON to SQL Insert',desc:'Generate SQL INSERT statements',path:'/generators/json-to-sql/',cat:'Code Generators',catId:'generators',icon:'🗄️'},
 {name:'SQL to JSON',desc:'Convert SQL CREATE to JSON schema',path:'/generators/sql-to-json/',cat:'Code Generators',catId:'generators',icon:'🔄'},
 {name:'CSS Variable Generator',desc:'Generate CSS custom properties',path:'/generators/css-variables/',cat:'Code Generators',catId:'generators',icon:'🎨'},
 {name:'API Mock Generator',desc:'Generate mock API responses',path:'/generators/api-mock/',cat:'Code Generators',catId:'generators',icon:'🎭'},
 {name:'.env Template Generator',desc:'Generate .env template files',path:'/generators/env-template/',cat:'Code Generators',catId:'generators',icon:'🔧'},
];
const CATS = [
 {id:'json',name:'JSON & Data',icon:'🟦',color:'#00C896',desc:'Format, validate, convert and transform JSON and data formats'},
 {id:'api',name:'API & Security',icon:'🔐',color:'#0066FF',desc:'JWT, Base64, hashing, UUID and security utilities'},
 {id:'text',name:'Text & Parsing',icon:'✍️',color:'#7B61FF',desc:'Regex, diff, case conversion, markdown and text utilities'},
 {id:'devops',name:'DevOps & Infra',icon:'⚙️',color:'#FF6B35',desc:'Cron, timestamps, YAML, Docker and infra tools'},
 {id:'frontend',name:'Frontend Tools',icon:'🟢',color:'#00D4FF',desc:'CSS, colors, gradients, shadows and frontend utilities'},
 {id:'network',name:'Network & DNS',icon:'🌐',color:'#4DA6FF',desc:'DNS lookup, IP geolocation, WHOIS and network tools'},
 {id:'image',name:'Image & Media',icon:'🖼️',color:'#FFD75E',desc:'Compress, resize, convert and analyze images'},
 {id:'encoding',name:'Encoding & Crypto',icon:'🔢',color:'#A78BFA',desc:'AES, ROT13, Morse, binary and encoding utilities'},
 {id:'database',name:'Database Tools',icon:'🗄️',color:'#34D399',desc:'SQL formatting, ORM generation and schema tools'},
 {id:'diagramming',name:'Diagramming',icon:'📊',color:'#FB7185',desc:'Mermaid diagrams, flowcharts, ERDs and sequence diagrams'},
 {id:'packages',name:'Package & Version',icon:'📦',color:'#60A5FA',desc:'npm, PyPI search, semver and dependency tools'},
 {id:'playground',name:'Code Playground',icon:'🧪',color:'#FBBF24',desc:'Live HTML/CSS/JS, JSON/YAML and regex playgrounds'},
 {id:'apitesting',name:'API Testing',icon:'🔵',color:'#06B6D4',desc:'REST client, GraphQL, WebSocket and webhook testing'},
 {id:'productivity',name:'Productivity',icon:'⚡',color:'#C084FC',desc:'QR codes, timezone, unit converter and utility tools'},
 {id:'ai',name:'AI-Assisted Tools',icon:'🤖',color:'#FF3D71',desc:'AI-powered code explainer, generator and reviewer tools'},
 {id:'generators',name:'Code Generators',icon:'🟣',color:'#818CF8',desc:'OpenAPI viewer, fake data, README and code generators'},
];
function getTheme(){return localStorage.getItem('dnt-theme')||'dark'}
function setTheme(t){
 document.documentElement.setAttribute('data-theme',t);
 localStorage.setItem('dnt-theme',t);
 const btn=document.getElementById('theme-btn');
 if(btn)btn.textContent=t==='dark'?'☀️ Light':'🌙 Dark';
}
function copyToClipboard(text,btn){
 navigator.clipboard.writeText(text).then(()=>{
 if(btn){const orig=btn.textContent;btn.textContent='✓ Copied';btn.classList.add('copied');setTimeout(()=>{btn.textContent=orig;btn.classList.remove('copied')},2000)}
 });
}
function initSearch(inputId,resultsId){
 const input=document.getElementById(inputId);
 const results=document.getElementById(resultsId);
 if(!input||!results)return;
 input.addEventListener('input',()=>{
 const q=input.value.trim().toLowerCase();
 if(!q){results.classList.remove('show');results.innerHTML='';return}
 const BUILT_CATS=['json','api','text','devops','frontend'];const matches=ALL_TOOLS.filter(t=>BUILT_CATS.includes(t.catId)&&(t.name.toLowerCase().includes(q)||t.desc.toLowerCase().includes(q)||t.cat.toLowerCase().includes(q))).slice(0,8);
 if(!matches.length){results.classList.remove('show');return}
 results.innerHTML=matches.map(t=>`<a class="search-result-item" href="${t.path}"><span>${t.icon}</span><span>${t.name}</span><span class="search-result-cat">${t.cat}</span></a>`).join('');
 results.classList.add('show');
 });
 document.addEventListener('click',e=>{if(!input.contains(e.target)&&!results.contains(e.target)){results.classList.remove('show')}});
}
function injectNav(){
 const nav=document.createElement('nav');
 nav.id='dnt-nav';
 nav.innerHTML=`
 <a href="/" class="nav-brand">DevNova Tools</a>
 <div class="nav-search-wrap">
 <span class="nav-search-icon">🔍</span>
 <input id="nav-search" class="nav-search" type="text" placeholder="Search JSON formatter, JWT decoder, regex tester..." autocomplete="off"/>
 <div id="nav-search-results" class="nav-search-results"></div>
 </div>
 <div class="nav-right">
 <button id="theme-btn" class="theme-btn">☀️ Light</button>
 <button class="hamburger" id="hamburger" aria-label="Menu">☰</button>
 </div>`;
 document.body.insertBefore(nav,document.body.firstChild);
 const mob=document.createElement('div');
 mob.className='nav-mobile-menu';mob.id='mobile-menu';
 mob.innerHTML=CATS.filter(c=>['json','api','text','devops','frontend'].includes(c.id)).map(c=>`<a class="nav-mobile-link" href="/${c.id}/">${c.icon} ${c.name}</a>`).join('')+`<hr style="border-color:var(--border);margin:8px 0"><a class="nav-mobile-link" href="/">🏠 Home</a>`;
 document.body.insertBefore(mob,nav.nextSibling);
 document.getElementById('theme-btn').addEventListener('click',()=>{setTheme(getTheme()==='dark'?'light':'dark')});
 document.getElementById('hamburger').addEventListener('click',()=>{mob.classList.toggle('open')});
 setTheme(getTheme());
 initSearch('nav-search','nav-search-results');
}
function injectFooter(){
 const f=document.createElement('footer');f.id='dnt-footer';
 f.innerHTML=`<div class="footer-grid">
 <div><div class="footer-brand-name">DevNova Tools</div><div class="footer-tagline">Every developer tool you'll ever need.<br>Free, fast, no login required.</div></div>
 <div><div class="footer-col-title">Popular Tools</div><ul class="footer-links">
 <li><a href="/json/formatter/">JSON Formatter</a></li><li><a href="/api/jwt-decoder/">JWT Decoder</a></li>
 <li><a href="/text/regex-tester/">Regex Tester</a></li><li><a href="/devops/cron-builder/">Cron Builder</a></li>
 <li><a href="/frontend/color-converter/">Color Converter</a></li></ul></div>
 <div><div class="footer-col-title">Categories</div><ul class="footer-links">
 <li><a href="/json/">JSON & Data</a></li><li><a href="/api/">API & Security</a></li>
 <li><a href="/text/">Text & Parsing</a></li><li><a href="/devops/">DevOps & Infra</a></li>
 <li><a href="/ai/">AI Tools</a></li></ul></div>
 <div><div class="footer-col-title">More</div><ul class="footer-links">
 <li><a href="/network/">Network & DNS</a></li><li><a href="/encoding/">Encoding & Crypto</a></li>
 <li><a href="/playground/">Code Playground</a></li><li><a href="/apitesting/">API Testing</a></li>
 <li><a href="/generators/">Code Generators</a></li></ul></div>
 </div>
 <div class="footer-bottom"><div class="footer-copy">© 2026 DevNova Tools — devnovatools.com. All rights reserved. Unauthorized reproduction prohibited.</div><div class="footer-copy">Free forever · No login · No ads</div></div>`;
 document.body.appendChild(f);
}
function init(){injectNav();injectFooter()}
return{init,ALL_TOOLS,CATS,copyToClipboard,initSearch,getTheme,setTheme};
})();
document.addEventListener('DOMContentLoaded',()=>DevNova.init());