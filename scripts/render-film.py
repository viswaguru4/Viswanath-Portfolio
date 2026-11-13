from PIL import Image,ImageDraw,ImageFilter
import numpy as np, math, subprocess
W,H=1920,1080
out='public/media/orbit-film.mp4'
pipe=subprocess.Popen(['ffmpeg','-y','-f','rawvideo','-vcodec','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r','30','-i','-','-an','-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-g','6','-movflags','+faststart',out],stdin=subprocess.PIPE,stderr=subprocess.DEVNULL)
rng=np.random.default_rng(8);stars=rng.random((80,3));angles=np.linspace(0,math.tau,181)
for f in range(180):
 t=f/179;phase=t*math.tau
 im=Image.new('RGB',(W,H),(3,3,3));d=ImageDraw.Draw(im)
 for sx,sy,sz in stars:
  x=(sx*W+math.sin(phase+sy*5)*15)%W;y=(sy*H+math.cos(phase+sx*5)*10)%H;v=int(30+sz*50);d.ellipse((x,y,x+1.3,y+1.3),fill=(v,v,v))
 # tilted concentric rings revolve through a continuous spatial choreography
 rings=[]
 for j in range(12):
  r=(100+j*9)*2;ax=phase*.4+j*.045;ay=phase+j*.13
  pts=[]
  for a in angles:
   x=r*math.cos(a);y=r*math.sin(a);z=y*math.sin(ax);y*=math.cos(ax)
   xx=x*math.cos(ay)+z*math.sin(ay);zz=-x*math.sin(ay)+z*math.cos(ay)
   sc=1300/(1300+zz);pts.append((W/2+xx*sc,H/2+y*sc,zz))
  for k in range(len(pts)-1):rings.append((sum([pts[k][2],pts[k+1][2]])/2,pts[k],pts[k+1],j))
 for z,a,b,j in sorted(rings,reverse=True):
  v=int(max(30,min(245,135-z*.2+50*math.sin(j*.6+phase))));d.line((a[0],a[1],b[0],b[1]),fill=(v,v,v),width=3)
 # polished orbiting spheres with directional metallic shading
 for j in range(3):
  a=phase+j*math.tau/3;cx=W/2+490*math.cos(a);cy=H/2+210*math.sin(a);r=24+14*(math.sin(a)+1)
  for rr in range(int(r),0,-1):
   v=int(45+180*(1-rr/r));d.ellipse((cx-rr-((r-rr)*.25),cy-rr-((r-rr)*.3),cx+rr-((r-rr)*.25),cy+rr-((r-rr)*.3)),fill=(v,v,v))
 if f==0:im.save('public/media/orbit-poster.jpg',quality=90)
 pipe.stdin.write(im.tobytes())
pipe.stdin.close();pipe.wait();print(out)
