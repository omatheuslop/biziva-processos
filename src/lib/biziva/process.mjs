import {parseJSON,cleanText} from './assistant.mjs';
export function parseProcess(text){
  const data=parseJSON(text);
  if(!Array.isArray(data.steps)||!data.steps.length||data.steps.length>24)throw Error('Use entre 1 e 24 etapas.');
  return data.steps.map(step=>({label:cleanText(step.label,100),owner:cleanText(step.owner,70),deadline:cleanText(step.deadline,70)}));
}
const quote=text=>text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/[\r\n]/g,' ');
export function appendProcess(code,steps,prefix){
  if(!/^\s*(flowchart|graph)\s+(TD|TB|BT|LR|RL)\b/i.test(code))throw Error('Abra um fluxograma (flowchart) para adicionar este plano sem substituir seu diagrama.');
  if(!/^bzv[a-f0-9]+$/.test(prefix))throw Error('Identificador inválido.');
  const lines=[code,'',`subgraph ${prefix}["Plano operacional Biziva"]`];
  steps.forEach((step,index)=>{
    lines.push(`${prefix}_${index}["${quote(step.label)}<br/>Responsável: ${quote(step.owner)}<br/>Prazo: ${quote(step.deadline)}"]`);
    if(index)lines.push(`${prefix}_${index-1} --> ${prefix}_${index}`);
  });
  lines.push('end');return lines.join('\n');
}
export function inspectProcess(code){
  const issues=[];
  if(!/\b(flowchart|graph)\b/.test(code))issues.push('A revisão operacional atende fluxogramas. Outros diagramas continuam disponíveis no editor.');
  if(!/Responsável:/.test(code))issues.push('Não há indicação de responsável no formato do plano operacional.');
  if(!/Prazo:/.test(code))issues.push('Não há indicação de prazo no formato do plano operacional.');
  if(/\{[^}]+\}/.test(code)&&!/(-->|---)\|[^|]+\|/.test(code))issues.push('Há decisões sem ramos rotulados no formato padrão; revise os caminhos de aprovação e recusa.');
  return issues;
}
