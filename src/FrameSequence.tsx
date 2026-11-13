import {useEffect,useRef} from 'react';
export default function FrameSequence({progress,hidden}:{progress:number;hidden:boolean}){
 const canvas=useRef<HTMLCanvasElement>(null),paint=useRef<(p:number)=>void>(()=>{}),current=useRef(progress);current.current=progress;
 useEffect(()=>{const c=canvas.current!,ctx=c.getContext('2d')!,images=new Map<number,HTMLImageElement>();let desired=0,w=1,h=1,disposed=false;
 const render=(img:HTMLImageElement,i:number)=>{if(disposed||i!==desired)return;const scale=Math.max(w/img.naturalWidth,h/img.naturalHeight);ctx.fillStyle='#030303';ctx.fillRect(0,0,w,h);ctx.drawImage(img,(w-img.naturalWidth*scale)/2,(h-img.naturalHeight*scale)/2,img.naturalWidth*scale,img.naturalHeight*scale);c.dataset.frame=String(i);};
 const load=(i:number)=>{if(i<0||i>119)return;const old=images.get(i);if(old){if(old.complete&&old.naturalWidth)render(old,i);return;}const img=new Image();images.set(i,img);img.onload=()=>render(img,i);img.src=`/media/orbit-frames/frame-${String(i+1).padStart(3,'0')}.webp`;};
 paint.current=(p)=>{desired=Math.round(p/100*119);load(desired);for(let d=1;d<=4;d++){load(desired+d);load(desired-d);}};
 const resize=()=>{w=c.clientWidth;h=c.clientHeight;const d=Math.min(devicePixelRatio,1.5);c.width=w*d;c.height=h*d;ctx.setTransform(d,0,0,d,0,0);paint.current(current.current);};const ro=new ResizeObserver(resize);ro.observe(c);const io=new IntersectionObserver(([e])=>{if(e.isIntersecting)for(let i=0;i<120;i++)load(i);},{rootMargin:'400px'});io.observe(c);resize();return()=>{disposed=true;ro.disconnect();io.disconnect();images.forEach(i=>i.onload=null);};},[]);
 useEffect(()=>{paint.current(progress);},[progress]);return <canvas className="film-frames" ref={canvas} style={{visibility:hidden?'hidden':'visible'}} aria-label="Scroll-controlled orbital film frames"/>;
}
