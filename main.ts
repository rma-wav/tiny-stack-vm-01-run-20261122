// Tiny stack VM for make.fun's tiny-stack-vm-01-run-20261122 bounty.
// One program, one run: executes every /input/<id>/program.bin on its
// /input/<id>/input.bin and writes /output/<id>/stdout.bin + exit.txt.
// Semantics follow the kit's ISA.md exactly: wrapping 32-bit ints, the ten
// traps with their own exit codes, the 1,000,000-step and 65,536-byte limits,
// and the per-step check order (step limit, pc, unknown opcode, truncated
// immediate, stack bounds, then the instruction's own traps).
import {mkdirSync,readdirSync,readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';

function run(p:Uint8Array,inp:Uint8Array):[Uint8Array,number]{
 const D=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256),O=new Uint8Array(65536);
 let sp=0,cp=0,pc=0,st=0,ol=0,ip=0;
 const n=p.length;
 const end=(c:number):[Uint8Array,number]=>[O.subarray(0,ol),c];
 for(;;){
  if(st===1000000)return end(10);
  if(pc<0||pc>=n)return end(9);
  const op=p[pc];
  if(!(op<8||(op>=16&&op<31)||(op>=32&&op<35)||(op>=48&&op<53)||(op>=64&&op<66)||(op>=80&&op<84)))return end(5);
  const im=op===1?1:op===2?4:op>=48&&op<=51?2:0;
  if(pc+im>=n)return end(9);
  st++;
  const nx=pc+1+im;
  pc=nx;
  switch(op){
   case 0:return end(0);
   case 1:
    if(sp===256)return end(3);
    D[sp++]=(p[nx-1]<<24)>>24;
    break;
   case 2:
    if(sp===256)return end(3);
    D[sp++]=p[nx-4]|p[nx-3]<<8|p[nx-2]<<16|p[nx-1]<<24;
    break;
   case 3:
    if(sp<1)return end(2);
    sp--;
    break;
   case 4:
    if(sp<1)return end(2);
    if(sp===256)return end(3);
    D[sp]=D[sp-1];sp++;
    break;
   case 5:
    if(sp<2)return end(2);
    {const t=D[sp-1];D[sp-1]=D[sp-2];D[sp-2]=t;}
    break;
   case 6:
    if(sp<2)return end(2);
    if(sp===256)return end(3);
    D[sp]=D[sp-2];sp++;
    break;
   case 7:
    if(sp<3)return end(2);
    {const a=D[sp-3];D[sp-3]=D[sp-2];D[sp-2]=D[sp-1];D[sp-1]=a;}
    break;
   case 0x17:
    if(sp<1)return end(2);
    D[sp-1]=-D[sp-1]|0;
    break;
   case 0x1b:
    if(sp<1)return end(2);
    D[sp-1]=~D[sp-1];
    break;
   case 0x10:case 0x11:case 0x12:case 0x13:case 0x14:case 0x15:case 0x16:
   case 0x18:case 0x19:case 0x1a:case 0x1c:case 0x1d:case 0x1e:
   case 0x20:case 0x21:case 0x22:{
    if(sp<2)return end(2);
    const b=D[sp-1],a=D[sp-2];
    let r=0;
    if(op===0x10)r=a+b|0;
    else if(op===0x11)r=a-b|0;
    else if(op===0x12)r=Math.imul(a,b);
    else if(op===0x13){if(b===0)return end(4);r=a===-2147483648&&b===-1?a:(a/b)|0;}
    else if(op===0x14){if(b===0)return end(4);r=b===-1?0:a%b|0;}
    else if(op===0x15){if(b===0)return end(4);r=Math.floor((a>>>0)/(b>>>0))|0;}
    else if(op===0x16){if(b===0)return end(4);r=(a>>>0)%(b>>>0)|0;}
    else if(op===0x18)r=a&b;
    else if(op===0x19)r=a|b;
    else if(op===0x1a)r=a^b;
    else if(op===0x1c)r=a<<(b&31);
    else if(op===0x1d)r=a>>(b&31);
    else if(op===0x1e)r=(a>>>(b&31))|0;
    else if(op===0x20)r=a===b?1:0;
    else if(op===0x21)r=a<b?1:0;
    else r=(a>>>0)<(b>>>0)?1:0;
    sp-=2;D[sp++]=r;
    break;
   }
   case 0x30:case 0x31:case 0x32:{
    const rel=((p[nx-2]|p[nx-1]<<8)<<16)>>16;
    if(op!==0x30){
     if(sp<1)return end(2);
     const v=D[--sp];
     if(op===0x31?v!==0:v===0)break;
    }
    pc=nx+rel;
    break;
   }
   case 0x33:
    if(cp===64)return end(7);
    C[cp++]=nx;
    pc=p[nx-2]|p[nx-1]<<8;
    break;
   case 0x34:
    if(cp===0)return end(8);
    pc=C[--cp];
    break;
   case 0x40:
    if(sp<1)return end(2);
    {const a=D[sp-1];if(a<0||a>255)return end(6);D[sp-1]=M[a];}
    break;
   case 0x41:
    if(sp<2)return end(2);
    {const a=D[sp-1];if(a<0||a>255)return end(6);const v=D[sp-2];sp-=2;M[a]=v;}
    break;
   case 0x50:
    if(sp<1)return end(2);
    {const s=String(D[sp-1]);if(ol+s.length>65536)return end(11);sp--;for(let i=0;i<s.length;i++)O[ol++]=s.charCodeAt(i);}
    break;
   case 0x51:
    if(sp<1)return end(2);
    if(ol+1>65536)return end(11);
    O[ol++]=D[--sp]&255;
    break;
   case 0x52:
    if(sp===256)return end(3);
    D[sp++]=ip<inp.length?inp[ip++]:-1;
    break;
   case 0x53:
    if(sp<1)return end(2);
    return end(D[--sp]&255);
   default:return end(5);
  }
 }
}

const I=process.env.MAKEFUN_INPUT_DIR??'/input';
const O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
for(const e of readdirSync(I,{withFileTypes:true}).sort((a,b)=>a.name<b.name?-1:1)){
 if(!e.isDirectory())continue;
 const id=e.name;
 const r=run(new Uint8Array(readFileSync(join(I,id,'program.bin'))),new Uint8Array(readFileSync(join(I,id,'input.bin'))));
 mkdirSync(join(O,id),{recursive:true});
 writeFileSync(join(O,id,'stdout.bin'),r[0]);
 writeFileSync(join(O,id,'exit.txt'),r[1]+'\n');
}
