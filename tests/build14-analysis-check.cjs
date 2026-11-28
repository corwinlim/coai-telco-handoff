'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {analyze,HEADERS}=require('../scripts/build14-analyze.cjs');
let checks=0;
function check(label,fn){fn();checks++;console.log('PASS '+label)}
const blank=fs.readFileSync('docs/BUILD14_OBSERVATIONS.csv','utf8');
check('empty repository observations yield no comparisons',()=>{
 const a=analyze(blank);assert.equal(a.records,0);assert.equal(a.paired_comparisons,0);assert.equal(a.status,'NO_VERIFIED_COMPARISON');assert.equal(a.commercial_pilot_gate,'NO_GO_REQUIRES_REAL_INTERVIEWS_AND_AUTHORIZATION');
});
function record(method,order,seconds,present,consent='YES',scenario='SIM-101'){
 return ['P01','frontline',consent,scenario,method,order,'2026-11-28',seconds,10,present,method==='baseline'?2:1,method==='baseline'?0:1,'observed','A','SYNTHETIC TEST FIXTURE'].join(',');
}
const csv=(...rows)=>HEADERS.join(',')+'\n'+rows.join('\n')+'\n';
check('one method is not a measured pair',()=>{const a=analyze(csv(record('coai',1,90,9)));assert.equal(a.paired_comparisons,0);assert.equal(a.incomplete_groups,1)});
check('matched synthetic fixtures compute signed changes only',()=>{
 const a=analyze(csv(record('baseline',1,120,6),record('coai',2,90,9)));
 assert.equal(a.paired_comparisons,1);
 assert.deepEqual(a.pairs[0],{key:'P01/SIM-101',seconds_delta:-30,completeness_pp_delta:30,clarification_delta:-1,duplicate_entry_delta:1});
 assert.equal(a.commercial_pilot_gate,'NO_GO_REQUIRES_REAL_INTERVIEWS_AND_AUTHORIZATION');
});
check('no consent is rejected',()=>assert.throws(()=>analyze(csv(record('coai',1,90,9,'NO'))),/consent/));
check('real-looking scenario is rejected',()=>assert.throws(()=>analyze(csv(record('coai',1,90,9,'YES','INC-999'))),/fictional/));
check('invalid metric is rejected',()=>assert.throws(()=>analyze(csv(record('coai',1,90,11))),/Out-of-range/));
check('duplicate methods rejected',()=>assert.throws(()=>analyze(csv(record('coai',1,90,9),record('coai',2,91,9))),/Duplicate method/));
check('matched method order must differ',()=>assert.throws(()=>analyze(csv(record('baseline',1,120,6),record('coai',1,90,9))),/same order/));
check('broken CSV header rejected',()=>assert.throws(()=>analyze('fake,columns\n'),/header/));
check('quoted comma in safe note parsed',()=>{
 const row=record('coai',1,90,9).replace('SYNTHETIC TEST FIXTURE','"Synthetic fixture, not external evidence"');
 assert.equal(analyze(csv(row)).records,1);
});
console.log('BUILD14_PROTOCOL_CHECKS='+checks+'/'+checks);
