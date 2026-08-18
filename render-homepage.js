// Renders the homepage's popular/category/tool grids as static <a> markup
// directly into index.html, so crawlers that don't execute JavaScript still
// see every category and tool link. Re-run this after adding tools or
// categories to assets/layout.js so index.html stays in sync.
//
// Usage: node render-homepage.js
const fs = require('fs');
const path = require('path');

const layoutPath = path.join(__dirname, 'assets/layout.js');
const indexPath = path.join(__dirname, 'index.html');

const layoutSrc = fs.readFileSync(layoutPath, 'utf8');

function extractArray(varName) {
  const marker = `const ${varName}=[`;
  const start = layoutSrc.indexOf(marker);
  if (start === -1) throw new Error(`Could not find ${varName} in layout.js`);
  const arrayStart = start + marker.length - 1; // position of the opening [
  let depth = 0;
  let end = -1;
  for (let i = arrayStart; i < layoutSrc.length; i++) {
    if (layoutSrc[i] === '[') depth++;
    else if (layoutSrc[i] === ']') {
      depth--;
      if (depth === 0) { end = i + 1; break; }
    }
  }
  if (end === -1) throw new Error(`Could not find end of ${varName} array`);
  const literal = layoutSrc.slice(arrayStart, end);
  // eslint-disable-next-line no-new-func
  return new Function(`return ${literal};`)();
}

const ALL_TOOLS = extractArray('ALL_TOOLS');
const CATS = extractArray('CATS');

let indexHtml = fs.readFileSync(indexPath, 'utf8');

const popularMatch = indexHtml.match(/const POPULAR = \[([\s\S]*?)\];/);
if (!popularMatch) throw new Error('Could not find POPULAR array in index.html');
const POPULAR = new Function(`return [${popularMatch[1]}];`)();

const builtCatsMatch = indexHtml.match(/const BUILT_CATS = \[([\s\S]*?)\];/);
if (!builtCatsMatch) throw new Error('Could not find BUILT_CATS array in index.html');
const BUILT_CATS = new Function(`return [${builtCatsMatch[1]}];`)();

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function toolCard(tool, catColor) {
  return `<a href="${tool.path}" class="tool-card" style="--cat-color:${catColor}">
      <span class="tool-card-icon">${tool.icon}</span>
      <div>
        <div class="tool-card-name">${escapeHtml(tool.name)}</div>
        <div class="tool-card-desc">${escapeHtml(tool.desc)}</div>
      </div>
    </a>`;
}

function catCard(cat, count) {
  return `<a href="/${cat.id}/" class="cat-card" style="--cat-color:${cat.color}">
      <span class="cat-icon">${cat.icon}</span>
      <div class="cat-name">${escapeHtml(cat.name)}</div>
      <div class="cat-count">${count} tools</div>
      <div class="cat-bar"></div>
    </a>`;
}

const popularHtml = POPULAR
  .map((p) => ALL_TOOLS.find((t) => t.path === p))
  .filter(Boolean)
  .map((t) => {
    const cat = CATS.find((c) => c.id === t.catId);
    return toolCard(t, cat ? cat.color : 'var(--green)');
  })
  .join('\n    ');

const catsHtml = CATS
  .filter((c) => BUILT_CATS.includes(c.id))
  .map((c) => catCard(c, ALL_TOOLS.filter((t) => t.catId === c.id).length))
  .join('\n    ');

const builtTools = ALL_TOOLS.filter((t) => BUILT_CATS.includes(t.catId));
const toolsHtml = builtTools
  .map((t) => {
    const cat = CATS.find((c) => c.id === t.catId);
    return toolCard(t, cat ? cat.color : 'var(--green)');
  })
  .join('\n    ');

indexHtml = indexHtml.replace(
  /<div class="tool-grid" id="popular-grid">[\s\S]*?<\/div>/,
  `<div class="tool-grid" id="popular-grid">\n    ${popularHtml}\n  </div>`
);
indexHtml = indexHtml.replace(
  /<div class="cat-grid" id="cat-grid">[\s\S]*?<\/div>/,
  `<div class="cat-grid" id="cat-grid">\n    ${catsHtml}\n  </div>`
);
indexHtml = indexHtml.replace(
  /<div class="tool-grid" id="tool-grid">[\s\S]*?<\/div>\s*<\/div>/,
  `<div class="tool-grid" id="tool-grid">\n    ${toolsHtml}\n  </div>\n  </div>`
);
indexHtml = indexHtml.replace(
  /<span id="tool-count"><\/span>/,
  `<span id="tool-count">${builtTools.length} tools</span>`
);

fs.writeFileSync(indexPath, indexHtml);
console.log(`Rendered ${POPULAR.length} popular, ${CATS.filter((c) => BUILT_CATS.includes(c.id)).length} categories, ${builtTools.length} tools into index.html`);
