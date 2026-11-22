import {mkdirSync,readdirSync,readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
function run(p:Uint8Array,q:Uint8Array):[Uint8Array,number]{
 const n=p.length,D=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256),o=new Uint8Array(65536);
 let s=0,c=0,sp=0,cs=0,l=0,ip=0,x=0,y=0;let g='';
 const end=(e:number):[Uint8Array,number]=>[o.slice(0,l),e];
 for(;;){
  if(s===1e6)return end(10);
  if(c<0||c>=n)return end(9);
  const op=p[c];
  if(!((op<=7)||(op>=16&&op<=30)||(op>=32&&op<=34)||(op>=48&&op<=52)||(op>=64&&op<=65)||(op>=80&&op<=83)))return end(5);
  const im=op===1?1:op===2?4:op>=48&&op<=51?2:0;
  if(c+im>=n)return end(9);
  s++;const nx=c+1+im;c=nx;
  if(op>=16&&op<=34){
   if(op===23){if(sp<1)return end(2);D[sp-1]=-D[sp-1]|0;continue;}
   if(op===27){if(sp<1)return end(2);D[sp-1]=~D[sp-1];continue;}
   if(sp<2)return end(2);
   y=D[sp-1];x=D[sp-2];let r=0;
   if(op===16)r=x+y|0;else if(op===17)r=x-y|0;else if(op===18)r=Math.imul(x,y);
   else if(op===19){if(y===0)return end(4);r=x/y|0;}
   else if(op===20){if(y===0)return end(4);r=x%y|0;}
   else if(op===21){if(y===0)return end(4);r=Math.floor((x>>>0)/(y>>>0))|0;}
   else if(op===22){if(y===0)return end(4);r=(x>>>0)%(y>>>0)|0;}
   else if(op===24)r=x&y;else if(op===25)r=x|y;else if(op===26)r=x^y;
   else if(op===28)r=x<<(y&31);else if(op===29)r=x>>(y&31);else if(op===30)r=x>>>(y&31)|0;
   else if(op===32)r=x===y?1:0;else if(op===33)r=x<y?1:0;else r=(x>>>0)<(y>>>0)?1:0;
   sp-=2;D[sp++]=r;continue;
  }
  switch(op){
   case 0:return end(0);
   case 1:if(sp>=256)return end(3);D[sp++]=(p[nx-1]<<24)>>24;break;
   case 2:if(sp>=256)return end(3);D[sp++]=p[nx-4]|p[nx-3]<<8|p[nx-2]<<16|p[nx-1]<<24;break;
   case 3:if(sp<1)return end(2);sp--;break;
   case 4:if(sp<1)return end(2);if(sp>=256)return end(3);D[sp]=D[sp-1];sp++;break;
   case 5:if(sp<2)return end(2);x=D[sp-1];D[sp-1]=D[sp-2];D[sp-2]=x;break;
   case 6:if(sp<2)return end(2);if(sp>=256)return end(3);D[sp]=D[sp-2];sp++;break;
   case 7:if(sp<3)return end(2);x=D[sp-3];D[sp-3]=D[sp-2];D[sp-2]=D[sp-1];D[sp-1]=x;break;
   case 48:c=nx+(((p[nx-2]|p[nx-1]<<8)<<16)>>16);break;
   case 49:case 50:if(sp<1)return end(2);y=D[--sp];if((op===49)===(y===0))c=nx+(((p[nx-2]|p[nx-1]<<8)<<16)>>16);break;
   case 51:if(cs>=64)return end(7);C[cs++]=nx;c=p[nx-2]|p[nx-1]<<8;break;
   case 52:if(cs===0)return end(8);c=C[--cs];break;
   case 64:if(sp<1)return end(2);x=D[sp-1];if(x<0||x>255)return end(6);D[sp-1]=M[x];break;
   case 65:if(sp<2)return end(2);x=D[sp-1];if(x<0||x>255)return end(6);M[x]=D[sp-2];sp-=2;break;
   case 80:if(sp<1)return end(2);g=String(D[sp-1]);if(l+g.length>65536)return end(11);sp--;for(let i=0;i<g.length;i++)o[l++]=g.charCodeAt(i);break;
   case 81:if(sp<1)return end(2);if(l>=65536)return end(11);o[l++]=D[--sp]&255;break;
   case 82:if(sp>=256)return end(3);D[sp++]=ip<q.length?q[ip++]:-1;break;
   case 83:if(sp<1)return end(2);return end(D[--sp]&255);
  }
 }
}
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
for(const id of readdirSync(I).sort()){
 const r=run(readFileSync(join(I,id,'program.bin')),readFileSync(join(I,id,'input.bin')));
 mkdirSync(join(O,id),{recursive:true});
 writeFileSync(join(O,id,'stdout.bin'),r[0]);
 writeFileSync(join(O,id,'exit.txt'),r[1]+'\n');
}
