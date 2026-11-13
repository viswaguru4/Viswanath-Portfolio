import {useEffect,useRef} from 'react';
import * as THREE from 'three';
import {createRenderer} from './renderer';
export default function PointerObject(){
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const host=ref.current;if(!host)return;
  const renderer=createRenderer();renderer.setSize(84,84);
  host.appendChild(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(40,1,.1,20);camera.position.z=4;
  scene.add(new THREE.HemisphereLight(0xffffff,0x171717,3));if(renderer.software)scene.add(new THREE.AmbientLight(0xffffff,.5));
  const light=new THREE.DirectionalLight(0xffffff,renderer.software?.7:5);light.position.set(2,3,4);scene.add(light);
  const geometry=new THREE.OctahedronGeometry(.65,0),material=new THREE.MeshStandardMaterial({color:0xd0d0d0,metalness:.55,roughness:.22});
  const object=new THREE.Mesh(geometry,material);scene.add(object);
  const ringGeo=new THREE.TorusGeometry(.85,.022,6,24),ringMat=new THREE.MeshBasicMaterial({color:0x999999});
  const ring=new THREE.Mesh(ringGeo,ringMat);ring.rotation.x=.9;object.add(ring);
  let x=-100,y=-100,cx=-100,cy=-100,raf=0,last=0,active=false,touch=false,release=0,rotation=0,scale=1;
  const hide=()=>{active=false;host.style.opacity='0';cancelAnimationFrame(raf);raf=0;};
  const draw=(now:number)=>{raf=0;if(document.hidden||!active)return;const dt=Math.min((now-last)/1000,.04)||0;last=now;rotation+=dt*.75;
   cx+=(x-cx)*.25;cy+=(y-cy)*.25;host.style.transform=`translate3d(${cx}px,${cy}px,0)`;
   object.rotation.set(rotation*.65,rotation,.3);object.scale.setScalar(scale);renderer.render(scene,camera);raf=requestAnimationFrame(draw);
  };
  const start=(e:PointerEvent)=>{
   if(e.pointerType==='touch'&&e.type==='pointermove'&&!active)return;
   touch=e.pointerType==='touch';x=e.clientX+(touch?-42:8);y=e.clientY+(touch?-42:8);
   const interactive=(e.target as Element)?.closest('a,button,input');scale=interactive ? .75 : 1;
   if(!active){cx=x;cy=y;}active=true;host.style.opacity=touch?'.75':'.9';
   if(!raf)raf=requestAnimationFrame(draw);
  };
  const down=(e:PointerEvent)=>{clearTimeout(release);start(e);scale=1.15;};
  const up=()=>{if(touch)release=window.setTimeout(hide,550);else scale=1;};
  const out=(e:PointerEvent)=>{if(!e.relatedTarget)hide();};
  const visibility=()=>{if(document.hidden)hide();};
  window.addEventListener('pointermove',start,{passive:true});window.addEventListener('pointerdown',down,{passive:true});window.addEventListener('pointerup',up,{passive:true});window.addEventListener('pointercancel',hide,{passive:true});window.addEventListener('pointerout',out);
  window.addEventListener('blur',hide);document.addEventListener('visibilitychange',visibility);
  return()=>{hide();clearTimeout(release);window.removeEventListener('pointermove',start);window.removeEventListener('pointerdown',down);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',hide);window.removeEventListener('pointerout',out);window.removeEventListener('blur',hide);document.removeEventListener('visibilitychange',visibility);geometry.dispose();material.dispose();ringGeo.dispose();ringMat.dispose();renderer.dispose();renderer.domElement.remove();};
 },[]);
 return <div ref={ref} className="pointer-object" aria-hidden="true"/>;
}
