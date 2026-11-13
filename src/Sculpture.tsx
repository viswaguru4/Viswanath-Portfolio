import {useEffect,useRef} from 'react';
import * as THREE from 'three';
import {createRenderer} from './renderer';
export default function Sculpture({paused,reduced,shape}:{paused:boolean;reduced:boolean;shape:number}){
 const host=useRef<HTMLDivElement>(null), state=useRef({paused,reduced,shape});state.current={paused,reduced,shape};
 const wake=useRef<()=>void>(()=>{});useEffect(()=>{wake.current();},[paused,reduced,shape]);
 useEffect(()=>{
  const el=host.current!;const r=createRenderer();el.appendChild(r.domElement);r.domElement.setAttribute('aria-hidden','true');
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,1,.1,30);camera.position.z=7;
  const group=new THREE.Group();scene.add(group);scene.add(new THREE.HemisphereLight(0xffffff,0x101010,r.software?1:3));const light=new THREE.DirectionalLight(0xffffff,r.software?1:5);light.position.set(2,4,5);scene.add(light);
  const material=new THREE.MeshStandardMaterial({color:0xb4b4b4,metalness:.4,roughness:.27,flatShading:r.software});
  const geos=[new THREE.TorusKnotGeometry(1.12,.32,r.software?64:180,r.software?7:24,2,3),new THREE.IcosahedronGeometry(1.48,0),new THREE.TorusGeometry(1.15,.43,r.software?10:32,r.software?36:100)];
  const meshes=geos.map(g=>{const m=new THREE.Mesh(g,material);group.add(m);return m;});
  const ringGeo=new THREE.TorusGeometry(2,.018,6,80),ringMat=new THREE.MeshBasicMaterial({color:0x999999});const orbit=new THREE.Mesh(ringGeo,ringMat);orbit.rotation.x=1.15;group.add(orbit);
  let raf=0,last=0,t=0,visible=true,drag=false,px=0,py=0,tx=0,ty=0,lastShape=-1,dirty=true;
  const draw=(now:number)=>{raf=0;if(!visible||document.hidden)return;const s=state.current;const move=!s.paused&&!s.reduced;if(now-last<33&&move){raf=requestAnimationFrame(draw);return;}const dt=Math.min((now-last)/1000,.05);last=now;
   if(move)t+=dt*.35;if(move||dirty||s.shape!==lastShape){lastShape=s.shape;dirty=false;meshes.forEach((m,i)=>m.visible=i===s.shape);group.rotation.set(.25+ty,t+tx,.15);group.position.y=move?Math.sin(t)*.12:0;orbit.rotation.z=t*.4;r.render(scene,camera);}if(move||drag)raf=requestAnimationFrame(draw);
  };
  wake.current=()=>{dirty=true;if(!raf&&visible&&!document.hidden)raf=requestAnimationFrame(draw);};
  const size=()=>{const w=el.clientWidth,h=el.clientHeight;r.setSize(w,h);camera.aspect=w/h;camera.position.z=w/h<.9?10.5:7;camera.updateProjectionMatrix();dirty=true;wake.current();};const ro=new ResizeObserver(size);ro.observe(el);
  const down=(e:PointerEvent)=>{if(state.current.reduced)return;drag=true;px=e.clientX;py=e.clientY;el.setPointerCapture(e.pointerId);};
  const move=(e:PointerEvent)=>{if(!drag)return;tx+=(e.clientX-px)*.009;ty+=(e.clientY-py)*.009;px=e.clientX;py=e.clientY;dirty=true;wake.current();};const up=()=>drag=false;
  el.addEventListener('pointerdown',down);el.addEventListener('pointermove',move);el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);
  const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;cancelAnimationFrame(raf);if(visible)raf=requestAnimationFrame(draw);});io.observe(el);
  const vis=()=>{cancelAnimationFrame(raf);if(!document.hidden&&visible)raf=requestAnimationFrame(draw);};document.addEventListener('visibilitychange',vis);size();
  return()=>{cancelAnimationFrame(raf);io.disconnect();ro.disconnect();document.removeEventListener('visibilitychange',vis);el.removeEventListener('pointerdown',down);el.removeEventListener('pointermove',move);el.removeEventListener('pointerup',up);el.removeEventListener('pointercancel',up);geos.forEach(g=>g.dispose());material.dispose();ringGeo.dispose();ringMat.dispose();r.dispose();r.domElement.remove();};
 },[]);
 return <div className="sculpture" ref={host} aria-label="Interactive 3D sculpture. Drag to rotate, or use the shape controls below." role="img"/>;
}
