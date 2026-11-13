import * as THREE from 'three';
import {SVGRenderer} from 'three/addons/renderers/SVGRenderer.js';
export function createRenderer(){
 const canvas=document.createElement('canvas');
 let gpu:THREE.WebGLRenderer|undefined;
 try{
  const context=canvas.getContext('webgl2',{alpha:true,antialias:true,powerPreference:'low-power'});
  if(context)gpu=new THREE.WebGLRenderer({canvas,context,alpha:true,antialias:true});
 }catch{/* A composed Three.js SVG scene remains available without a GPU. */}
 if(gpu){
  gpu.setPixelRatio(Math.min(devicePixelRatio,1.5));gpu.setClearColor(0,0);
  gpu.outputColorSpace=THREE.SRGBColorSpace;gpu.toneMapping=THREE.ACESFilmicToneMapping;gpu.toneMappingExposure=1.2;
  gpu.domElement.dataset.renderer='webgl';
  return {software:false,domElement:gpu.domElement as HTMLElement|SVGSVGElement,setSize:(w:number,h:number)=>gpu!.setSize(w,h),render:(s:THREE.Scene,c:THREE.Camera)=>gpu!.render(s,c),dispose:()=>gpu!.dispose()};
 }
 const svg=new SVGRenderer();svg.setQuality('high');svg.setPrecision(2);svg.overdraw=.3;
 svg.domElement.dataset.renderer='svg';
 return {software:true,domElement:svg.domElement as HTMLElement|SVGSVGElement,setSize:(w:number,h:number)=>svg.setSize(w,h),render:(s:THREE.Scene,c:THREE.Camera)=>{svg.render(s,c);svg.domElement.style.background='transparent';},dispose:()=>{svg.domElement.replaceChildren();}};
}
