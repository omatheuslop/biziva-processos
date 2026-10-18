export type ProcessStep={label:string;owner:string;deadline:string};
export function parseProcess(text:string):ProcessStep[];
export function appendProcess(code:string,steps:ProcessStep[],prefix:string):string;
export function inspectProcess(code:string):string[];
