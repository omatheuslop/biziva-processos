<script lang="ts">
  import {onMount} from 'svelte';
  import {mountAssistant} from './assistant.mjs';
  import {appendProcess,parseProcess,inspectProcess} from './process.mjs';
  import {inputState,updateCode} from '$lib/util/state.svelte';
  import {parse} from '$lib/util/mermaid';
  let host:HTMLDivElement;
  onMount(()=>mountAssistant(host,{
    title:'Biziva Processos',
    description:'Crie um plano operacional com responsáveis e prazos. O plano será adicionado ao fluxograma existente.',
    placeholder:'Organize o atendimento de novos clientes de uma agência…',
    sourceUrl:'https://github.com/omatheuslop/biziva-processos',
    instruction:'Retorne apenas JSON {"steps":[{"label":"Ação","owner":"Papel responsável","deadline":"Prazo sugerido"}]}. Entre 1 e 24 etapas em ordem de execução, sem HTML. Sugira papéis e prazos; não invente pessoas reais ou compromissos existentes. Label até 100 caracteres, owner e deadline até 70.',
    parse:parseProcess,
    inspect:()=>inspectProcess(inputState.code),
    apply:async(steps:{label:string;owner:string;deadline:string}[])=>{
      const prefix='bzv'+host.ownerDocument.defaultView!.crypto.randomUUID().replaceAll('-','');
      const next=appendProcess(inputState.code,steps,prefix);
      await parse(next);
      updateCode(next,{updateDiagram:true,resetPanZoom:true});
    },
  }));
</script>
<div bind:this={host}></div>
