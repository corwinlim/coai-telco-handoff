const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../index.html','utf8');
const code=src.match(/<script>([\s\S]*?)<\/script>/)[1];
const upto=code.slice(0,code.indexOf("const sel=$('scenario')"));
const ctx={document:{getElementById:()=>({value:''})}};
vm.runInNewContext(upto+'\nthis.api={CASES,makeBrief,unknowns,suggested,textBrief,esc};',ctx);
const a=ctx.api;
let passes=0;function test(name,fun){fun();passes++;console.log('PASS',name)}
test('ten fictional samples',()=>assert.strictEqual(a.CASES.length,10));
test('each sample has required issue and impact',()=>a.CASES.forEach(c=>assert(c.symptom&&c.impact)));
test('brief preserves reported facts',()=>{let b=a.makeBrief({...a.CASES[0],channel:'Customer-submitted report'});assert(b.issue.includes('intermittent'));assert(b.impact.includes('Video calls'))});
test('no invented diagnosis',()=>{let b=a.makeBrief({...a.CASES[6],channel:'Customer-submitted report'});assert(b.unknowns.join(' ').includes('root cause'));assert(!b.next.join(' ').includes('rainfall caused'))});
test('missing checks become explicit',()=>{let b=a.makeBrief({...a.CASES[3],checks:'',channel:'Customer-submitted report'});assert(b.unknowns.some(v=>v.includes('troubleshooting')))});
test('missing observations become explicit',()=>{let b=a.makeBrief({...a.CASES[0],observations:'',channel:'Customer-submitted report'});assert(b.unknowns.some(v=>v.includes('Supporting')))});
test('html escaping',()=>assert.strictEqual(a.esc('<img src=x onerror="test">'),'&lt;img src=x onerror=&quot;test&quot;&gt;'));
test('export labels fiction clearly',()=>{let b=a.makeBrief({...a.CASES[1],channel:'Customer-submitted report'});assert(a.textBrief(b).includes('SYNTHETIC / UNVERIFIED'))});
test('export contains explicit missing and next actions',()=>{let b=a.makeBrief({...a.CASES[1],channel:'Customer-submitted report'}),s=a.textBrief(b);assert(s.includes('MISSING / UNVERIFIED')&&s.includes('SUGGESTED NEXT STEPS'))});
test('all synthetic cases produce export text',()=>a.CASES.forEach(c=>assert(a.textBrief(a.makeBrief({...c,channel:'Customer-submitted report'})).length>400)));
console.log(`LOGIC_CHECKS=${passes}/${passes}`);
