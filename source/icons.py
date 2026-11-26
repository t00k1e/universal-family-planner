from PIL import Image, ImageDraw
import math
def make(size, pad_frac, path, rounded):
    S=size*4
    im=Image.new('RGBA',(S,S),(0,0,0,0)); d=ImageDraw.Draw(im)
    bg=(14,90,107,255)
    if rounded: d.rounded_rectangle([0,0,S-1,S-1],radius=int(S*.22),fill=bg)
    else: d.rectangle([0,0,S,S],fill=bg)
    c=S/2; u=S*(1-2*pad_frac)
    # sun
    r=u*.2; cy=c-u*.08
    d.ellipse([c-r,cy-r,c+r,cy+r],fill=(242,169,0,255))
    # rays
    for i in range(7):
        a=math.pi+i*math.pi/6
        x1,y1=c+math.cos(a)*r*1.35,cy+math.sin(a)*r*1.35
        x2,y2=c+math.cos(a)*r*1.75,cy+math.sin(a)*r*1.75
        d.line([x1,y1,x2,y2],fill=(242,169,0,255),width=int(u*.045))
    # cover lower half of sun with sea
    sea_top=cy+r*.15
    d.rectangle([c-u*.5,sea_top,c+u*.5,c+u*.5],fill=bg)
    # waves
    for k,col in enumerate([(255,255,255,255),(255,255,255,170)]):
        y=sea_top+u*.06+k*u*.14; pts=[]
        for i in range(0,101):
            x=c-u*.38+u*.76*i/100
            pts.append((x,y+math.sin(i/100*math.pi*4)*u*.025))
        d.line(pts,fill=col,width=int(u*.05),joint='curve')
    im=im.resize((size,size),Image.LANCZOS); im.save(path)
make(192,.12,'icons/icon-192.png',False)
make(512,.12,'icons/icon-512.png',False)
make(512,.22,'icons/icon-maskable-512.png',False)
make(180,.12,'icons/apple-touch-icon.png',False)
