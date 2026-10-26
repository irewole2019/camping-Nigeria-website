const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const assert = require('assert/strict');
const dir = __dirname;
const check = process.argv.includes('--check');
const watch = process.argv.includes('--watch');
if (check && watch) throw new Error('Use --check or --watch, not both.');
const names = ['2026-10-25-sourcing-brief', '2026-10-25-rental-kits-yiwu-buy-list'];
const css = `
img{display:block;max-width:100%;height:auto;border-radius:4px}video{display:block;width:100%;height:auto;background:#173d30;border-radius:4px;margin:18px 0}figure{margin:24px 0}figcaption{font-size:14px;color:#52645a;margin-top:9px}.kit-concepts{margin:24px 0}.kit-concepts summary{cursor:pointer;font-weight:700;color:#173d30;padding:14px 18px;background:#f0f4ed;border:1px solid #d9dfd5}.kit-concepts[open] summary{margin-bottom:20px}@media print{video{display:none}img{break-inside:avoid}figure{break-inside:avoid}}
:root{color-scheme:light;--ink:#173d30;--muted:#52645a;--paper:#fffefb;--line:#d9dfd5;--wash:#f0f4ed;--gold:#dcae42}
*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:24px}body{margin:0;background:#f3f0e8;color:#25382f;font:16px/1.75 "Segoe UI","PingFang SC","Microsoft YaHei",Arial,sans-serif;-webkit-text-size-adjust:100%}a{color:#175d42;text-underline-offset:3px;overflow-wrap:anywhere}a:hover{color:#8b6015}a:focus-visible,button:focus-visible,summary:focus-visible,[tabindex]:focus-visible{outline:3px solid #b47b16;outline-offset:4px}.shell{width:min(1080px,100%);margin:0 auto;padding:32px 24px 56px}.masthead{display:flex;justify-content:space-between;align-items:center;gap:20px;margin:0 0 22px}.brand{font-size:14px;font-weight:750;letter-spacing:.12em;text-transform:uppercase;color:var(--ink)}.edition{font-size:13px;color:var(--muted);margin-top:3px}.print{border:1px solid var(--ink);background:transparent;color:var(--ink);padding:10px 16px;border-radius:6px;font:inherit;font-size:14px;cursor:pointer;white-space:nowrap}.print:hover{background:var(--wash)}main{background:var(--paper);padding:42px 48px 48px;border:1px solid var(--line);border-top:5px solid var(--gold);border-radius:3px;box-shadow:0 8px 30px #173d3006}h1,h2,h3{color:var(--ink);line-height:1.3;overflow-wrap:anywhere}h1{font-size:clamp(27px,4vw,42px);letter-spacing:-.035em;margin:0 0 18px;font-weight:750}h1+h1{font-size:clamp(22px,3vw,30px);font-weight:600;letter-spacing:0;margin-top:-3px}h2{font-size:25px;letter-spacing:-.02em;margin:46px 0 16px;padding-top:24px;border-top:1px solid var(--line)}h3{font-size:20px;margin:30px 0 12px}p{margin:14px 0}strong{font-weight:700}li{margin:7px 0}ul,ol{padding-left:26px}blockquote{margin:24px 0;padding:16px 22px;border-left:4px solid var(--gold);background:#faf5e6}blockquote p:first-child{margin-top:0}blockquote p:last-child{margin-bottom:0}hr{border:0;border-top:1px solid var(--line);margin:32px 0}hr+h2{border-top:0;padding-top:0;margin-top:30px}.table-scroll{width:100%;overflow-x:auto;margin:24px 0;border:1px solid var(--line);border-radius:4px}table{width:100%;border-collapse:collapse;font-size:14px;line-height:1.6}th,td{padding:12px 14px;text-align:left;vertical-align:top;border-bottom:1px solid var(--line);min-width:90px;overflow-wrap:anywhere}th{background:var(--ink);color:#fff;font-weight:600}tbody tr:nth-child(even){background:#f5f7f1}tbody tr:last-child td{border-bottom:0}td:first-child{font-weight:500}code{font-family:Consolas,monospace;font-size:.9em;overflow-wrap:anywhere}.contents{margin:0 0 26px;border:1px solid var(--line);background:#fafbf7;border-radius:4px;padding:15px 20px}.contents summary{font-size:15px;color:var(--ink);font-weight:650;cursor:pointer}.contents ul{columns:2;column-gap:36px;list-style:none;padding:0;margin:14px 0 0}.contents li{break-inside:avoid;margin:0 0 9px;line-height:1.5;font-size:14px}.contents a{text-decoration:none}.contents a:hover{text-decoration:underline}.footer{font-size:12px;color:var(--muted);margin:20px 0 0}.reference{color:var(--muted);text-decoration:underline dotted}.skip{position:absolute;left:12px;top:-100px;background:#fff;padding:10px;z-index:2}.skip:focus{top:12px}
@media(max-width:640px){body{font-size:15px}.shell{padding:20px 12px 32px}.masthead{gap:10px}.brand{font-size:12px;letter-spacing:.08em}.edition{font-size:12px}.print{padding:8px 10px;font-size:12px}main{padding:26px 20px}h2{font-size:22px;margin-top:34px}h3{font-size:19px}.contents{padding:12px 14px}.contents ul{columns:1}blockquote{padding:14px 16px}th,td{min-width:110px;padding:10px}table{font-size:13px}.table-scroll{overscroll-behavior-x:contain}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
@page{size:A4;margin:15mm}
@media print{body{background:#fff;font-size:10pt;line-height:1.5;color:#111}.shell{width:100%;padding:0}.masthead{margin-bottom:15px}.print,.contents,.skip{display:none}main{padding:0;border:0;box-shadow:none}h1{font-size:25pt}h1+h1{font-size:19pt}h2{font-size:16pt;margin-top:22px;padding-top:12px}h3{font-size:12pt}h1,h2,h3{break-after:avoid}p,li{orphans:3;widows:3}.table-scroll{overflow:visible;border:0;margin:12px 0}table{font-size:8.5pt;table-layout:fixed}th,td{min-width:0;padding:6px;border:1px solid #bbb}th{background:#edf1e9;color:#111}thead{display:table-header-group}tr{break-inside:avoid}blockquote{background:#faf7ed;break-inside:avoid}a{color:inherit}hr{margin:18px 0}.footer{font-size:8pt}}
`;
function generate() {
for (const [index,name] of names.entries()) {
 const source=path.join(dir,name+'.md');
 const original=fs.readFileSync(source,'utf8');
 const raw=cp.execFileSync('pandoc',['-f','gfm+hard_line_breaks','-t','html5','--wrap=none',source],{encoding:'utf8'});
 let body=raw.replace(/<table>/g,'<div class="table-scroll" role="region" aria-label="Scrollable data table" tabindex="0"><table>').replace(/<\/table>/g,'</table></div>');
 body=body.replace(/href="2026-10-25-sourcing-brief.md"/g,'href="2026-10-25-sourcing-brief.html"');
 // Embed local media so each HTML remains a single shareable offline attachment.
 body=body.replace(/\b(src|poster)="(media\/[^"?#]+)"/g,(_match,attribute,relative)=>{
  const asset=path.resolve(dir,relative);
  assert(asset.startsWith(path.join(dir,'media')+path.sep),'Media must stay in the media directory');
  const mime={'.webp':'image/webp','.webm':'video/webm'}[path.extname(asset)];
  assert(mime,'Unsupported embedded media: '+relative);
  return attribute+'="data:'+mime+';base64,'+fs.readFileSync(asset).toString('base64')+'"';
 });
 // Keep an unbundled repository reference readable without creating a broken attachment link.
 body=body.replace(/<a href="\.\.\/camp-night\/debrief-2026-09-26.md">([\s\S]*?)<\/a>/g,'<span class="reference" title="Repository reference; not included in this HTML attachment">$1</span>');
 const sections=[...body.matchAll(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g)];
 const toc=sections.map(([,id,label])=>`<li><a href="#${id}">${label}</a></li>`).join('\n');
 const title=index===0?'Sourcing brief · Camping Nigeria Limited':'Rental kits and the Yiwu buy list · Camping Nigeria';
 const subtitle=index===0?'Sourcing brief · 25 October 2026 · English / 简体中文':'Rental kits & Yiwu buy list · 25 October 2026';
 const foot=index===0?'English and Simplified Chinese · Source: '+name+'.md':'Source: '+name+'.md · Camp Night debrief is a repository reference and is not included in this file.';
 const html=`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="generator" content="Pandoc">
<title>${title}</title>
<style>${css}</style>
</head>
<body>
<a class="skip" href="#document">Skip to document</a>
<div class="shell">
<header class="masthead"><div><div class="brand">Camping Nigeria</div><div class="edition">${subtitle}</div></div><button class="print" type="button" onclick="window.print()">Print / Save PDF</button></header>
<nav aria-label="Document sections"><details class="contents"><summary>Jump to a section${index===0?' · 目录':''}</summary><ul>${toc}</ul></details></nav>
<main id="document">
${body}</main>
<footer class="footer">${foot}</footer>
</div>
</body>
</html>
`.replace(/\r\n/g,'\n');
 const output=path.join(dir,name+'.html');

 const plain=s=>cp.execFileSync('pandoc',['-f','html','-t','plain','--wrap=none'],{input:s,encoding:'utf8'}).replace(/\s+/g,' ').trim();
 assert.equal(plain(body),plain(raw),'Document text must remain unchanged');
 assert.equal(fs.readFileSync(source,'utf8'),original,'Source markdown must remain unchanged');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(new Set(ids).size,ids.length,'IDs must be unique');
 for(const [,id] of html.matchAll(/href="#([^"]+)"/g)) assert(ids.includes(id),'Missing anchor '+id);
 assert(!/<(?:script|link)\b[^>]*(?:src|href)=/i.test(html),'No external script or style dependencies');
 for(const [,asset] of html.matchAll(/\b(?:src|poster)="([^"]+)"/g)) assert(asset.startsWith('data:'),'Media must be embedded');
 for(const [,href] of html.matchAll(/href="([^"#][^"]*)"/g)) {
  if(!/^(https?:|mailto:)/.test(href)) assert(names.some(n => href === n + '.html') || fs.existsSync(path.resolve(dir,href)),'Missing local target '+href);
 }
 if (check) {
  if (!fs.existsSync(output) || fs.readFileSync(output,'utf8') !== html) {
   console.error('Out of date: ' + name + '.html');
   process.exitCode = 1;
  } else console.log('In sync: ' + name + '.html');
 } else {
  if (!fs.existsSync(output) || fs.readFileSync(output,'utf8') !== html) fs.writeFileSync(output,html,'utf8');
  console.log('Generated and verified: ' + name + '.html');
 }
}
}
generate();
if (watch) {
 let timer;
 for (const name of names) fs.watchFile(path.join(dir,name+'.md'), {interval:500}, (current,previous) => {
  if (current.mtimeMs === previous.mtimeMs && current.size === previous.size) return;
  clearTimeout(timer);
  timer=setTimeout(() => {
   try { generate(); }
   catch (error) { console.error('Generation failed: ' + error.message); }
  },150);
 });
 // Media edits also change the bytes embedded in the shareable HTML files.
 if (fs.existsSync(path.join(dir,'media'))) fs.watch(path.join(dir,'media'),()=>{
  clearTimeout(timer);
  timer=setTimeout(()=>{try{generate();}catch(error){console.error('Generation failed: '+error.message);}},500);
 });
 console.log('Watching both Markdown files. Press Ctrl+C to stop.');
}
