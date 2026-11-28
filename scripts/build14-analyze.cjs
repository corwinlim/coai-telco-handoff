'use strict';
const fs = require('node:fs');
const HEADERS = 'participant_alias,role_category,consent_confirmed,scenario_id,method,task_order,task_date,task_seconds,checklist_applicable,checklist_present,clarification_queries,duplicate_entry_actions,observed_or_self_reported,evidence_grade,notes_nonconfidential'.split(',');

// Strict CSV parser: supports escaped quotes, commas and line endings; rejects malformed quoting.
function csvRows(source) {
  const rows = [];
  let row = [], cell = '', quoted = false, afterQuote = false;
  const s = source.replace(/^\uFEFF/, '');
  for(let i=0;i<s.length;i++) {
    const ch=s[i];
    if(quoted) {
      if(ch === '"') {
        if(s[i+1]==='"'){cell+='"';i++} else {quoted=false;afterQuote=true}
      } else cell+=ch;
    } else if(afterQuote) {
      if(ch===','){row.push(cell);cell='';afterQuote=false}
      else if(ch==='\n'||ch==='\r'){row.push(cell);rows.push(row);row=[];cell='';afterQuote=false;if(ch==='\r'&&s[i+1]==='\n')i++}
      else if(ch!==' '&&ch!=='\t') throw Error('Invalid text after quoted CSV field');
    } else if(ch==='"') {
      if(cell!=='') throw Error('Quote in unquoted field');
      quoted=true;
    } else if(ch===','){row.push(cell);cell=''}
    else if(ch==='\n'||ch==='\r'){row.push(cell);rows.push(row);row=[];cell='';if(ch==='\r'&&s[i+1]==='\n')i++}
    else cell+=ch;
  }
  if(quoted)throw Error('Unclosed CSV quote');
  if(cell!==''||row.length){row.push(cell);rows.push(row)}
  return rows;
}
function analyze(source) {
  const all=csvRows(source);
  if(!all.length || all[0].join(',')!==HEADERS.join(','))throw Error('Observation CSV header mismatch');
  const data=[];
  for(let i=1;i<all.length;i++){
    const row=all[i];
    if(row.length!==HEADERS.length)throw Error('CSV row '+(i+1)+' has wrong number of columns');
    if(row.every(x=>!x.trim()))continue;
    const o=Object.fromEntries(HEADERS.map((key,j)=>[key,row[j].trim()]));
    if(!/^P\d{2,3}$/.test(o.participant_alias))throw Error('Invalid anonymous participant alias on row '+(i+1));
    if(!['SIM-101','SIM-110'].includes(o.scenario_id))throw Error('Only approved fictional scenarios allowed');
    if(!['baseline','coai'].includes(o.method.toLowerCase()))throw Error('Method must be baseline or coai');
    o.method=o.method.toLowerCase();
    if(o.consent_confirmed!=='YES')throw Error('Recorded task has no explicit YES consent');
    if(!['observed','self-reported'].includes(o.observed_or_self_reported))throw Error('Unsupported evidence observation kind');
    if(!['A','B','C','D'].includes(o.evidence_grade))throw Error('Missing evidence grade');
    for(const k of ['task_seconds','checklist_applicable','checklist_present','clarification_queries','duplicate_entry_actions','task_order']){
      if(!/^\d+$/.test(o[k]))throw Error('Invalid nonnegative integer '+k+' on row '+(i+1));
      o[k]=Number(o[k]);
    }
    if(o.task_seconds===0||o.checklist_applicable<1||o.checklist_applicable>10||o.checklist_present>o.checklist_applicable||![1,2].includes(o.task_order))throw Error('Out-of-range task measure on row '+(i+1));
    if(!/^\d{4}-\d{2}-\d{2}$/.test(o.task_date)||Number.isNaN(Date.parse(o.task_date+'T00:00:00Z')))throw Error('Invalid task date');
    data.push(o);
  }
  const groups=new Map();
  for(const o of data){
    const k=o.participant_alias+'/'+o.scenario_id;
    const g=groups.get(k)||{};
    if(g[o.method])throw Error('Duplicate method in pair '+k);
    g[o.method]=o;groups.set(k,g);
  }
  const pairs=[];
  for(const [key,g] of groups){
    if(!g.coai||!g.baseline)continue;
    if(g.coai.task_order===g.baseline.task_order)throw Error('Both tasks claim same order in '+key);
    if(g.coai.role_category!==g.baseline.role_category)throw Error('Role mismatch in '+key);
    if(g.coai.task_date!==g.baseline.task_date)throw Error('Dates differ in '+key);
    pairs.push({key,seconds_delta:g.coai.task_seconds-g.baseline.task_seconds,completeness_pp_delta:+(100*g.coai.checklist_present/g.coai.checklist_applicable-100*g.baseline.checklist_present/g.baseline.checklist_applicable).toFixed(2),clarification_delta:g.coai.clarification_queries-g.baseline.clarification_queries,duplicate_entry_delta:g.coai.duplicate_entry_actions-g.baseline.duplicate_entry_actions});
  }
  return {status:pairs.length?'EXPLORATORY_PAIRS_ONLY':'NO_VERIFIED_COMPARISON',records:data.length,paired_comparisons:pairs.length,incomplete_groups:groups.size-pairs.length,pairs,commercial_pilot_gate:'NO_GO_REQUIRES_REAL_INTERVIEWS_AND_AUTHORIZATION'};
}
if(require.main===module){
  try{
    const file=process.argv[2]||'docs/BUILD14_OBSERVATIONS.csv';
    console.log(JSON.stringify(analyze(fs.readFileSync(file,'utf8')),null,2));
  }catch(e){console.error('BUILD14_ANALYSIS=FAIL: '+e.message);process.exitCode=1}
}
module.exports={csvRows,analyze,HEADERS};
