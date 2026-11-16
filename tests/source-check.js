const fs=require('fs'),assert=require('assert');
const s=fs.readFileSync(__dirname+'/../index.html','utf8');
const checks=[
['doctype',()=>assert(s.includes('<!doctype html>'))],
['no external script',()=>assert(!/<script[^>]+src=/i.test(s))],
['no external stylesheet',()=>assert(!/<link[^>]+stylesheet/i.test(s))],
['no tracking',()=>assert(!/google-analytics|gtag\(|fbq\(/i.test(s))],
['no fetch',()=>assert(!/\bfetch\s*\(/.test(s))],
['no local storage',()=>assert(!/localStorage|sessionStorage/.test(s))],
['synthetic label',()=>assert(/SYNTHETIC DATA DEMO/.test(s))],
['at least ten cases',()=>assert((s.match(/\{id:'SIM-/g)||[]).length===10)],
['input fields',()=>['symptom','impact','checks','observations'].forEach(x=>assert(s.includes(`id="${x}"`)))],
['review gate',()=>assert(/!approved\|\|!brief/.test(s))],
['output escape',()=>assert(s.includes('${esc(value)}'))],
['missing data',()=>assert(s.includes('unknowns(d)'))],
['invalidate on edit',()=>assert(s.includes("addEventListener('input',invalidate)"))],
['text export',()=>assert(s.includes('new Blob([textBrief(brief)]'))],
['mobile responsive',()=>assert(s.includes('@media(max-width:550px)'))],
['print output',()=>assert(s.includes('@media print'))],
['no telecom impersonation',()=>assert(s.includes('Not affiliated with a telecom provider'))],
['clear limits',()=>assert(s.includes('Not a network diagnosis'))],
];for(const [name,f] of checks){f();console.log('PASS',name)}console.log(`SOURCE_CHECKS=${checks.length}/${checks.length}`);
