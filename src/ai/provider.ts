import type { RoofColorId, RoofMaterialId, RoofType } from '../types'
export interface HouseImageInput{ imageDataUrl:string; roofType:RoofType; material:RoofMaterialId; color:RoofColorId; instruction?:string }
export interface GeneratedHouseImage{ url:string; provider:string }
export interface AIImageProvider{ generate(input:HouseImageInput):Promise<GeneratedHouseImage> }
export function buildPrompt(i:HouseImageInput){
  return `Photorealistic completed house. Preserve original architecture, camera perspective, building proportions, windows, doors, floors, yard. Add ${i.roofType} roof with ${i.material} material color ${i.color}. Realistic shadows, lighting, roof geometry. Do NOT redesign building. ${i.instruction??''}`.trim()
}
const COLOR_MAP:Record<string,string>={do:'#B91C1C',doCam:'#E85D04',nau:'#5D4037',xam:'#64748B',xanh:'#1E40AF',xanhReu:'#1B5E20',den:'#1C1917'}
const LIGHT_MAP:Record<string,string>={do:'#EF4444',doCam:'#FB923C',nau:'#8D6E63',xam:'#94A3B8',xanh:'#3B82F6',xanhReu:'#43A047',den:'#44403C'}

function drawTilePattern(g:CanvasRenderingContext2D, color:string, light:string){
  // draw small tile rows inside clipped roof area after main fill - caller clips first
  g.fillStyle=color; g.fillRect(0,0,900,600)
  g.strokeStyle=light; g.lineWidth=1; g.globalAlpha=0.35
  for(let y=90;y<260;y+=14){
    g.beginPath(); g.moveTo(90,y); g.lineTo(810,y); g.stroke()
    // vertical joints staggered
    const off=(y/14)%2?0:18
    for(let x=110+off;x<800;x+=36){ g.beginPath(); g.moveTo(x,y); g.lineTo(x,y+14); g.stroke() }
  }
  g.globalAlpha=1
}

export class MockProvider implements AIImageProvider{
  async generate(input:HouseImageInput): Promise<GeneratedHouseImage>{
    await new Promise(r=>setTimeout(r,900))
    const W=900,H=600
    const c=document.createElement('canvas'); c.width=W; c.height=H
    const g=c.getContext('2d')!

    // load original
    const img=new Image()
    const loaded = new Promise<void>(res=>{
      const t=setTimeout(()=>res(),1200)
      img.onload=()=>{clearTimeout(t);res()}
      img.onerror=()=>{clearTimeout(t);res()}
    })
    try{ img.src=input.imageDataUrl }catch{ /* ignore */}
    await loaded

    // draw original covering full canvas (contain)
    try{
      if(img.width){
        // cover
        const s=Math.max(W/img.width, H/img.height)
        const w=img.width*s, h=img.height*s
        g.drawImage(img,(W-w)/2,(H-h)/2,w,h)
      } else {
        g.fillStyle='#E2E8F0'; g.fillRect(0,0,W,H)
      }
    }catch{
      // tainted canvas fallback: fill
      g.fillStyle='#E2E8F0'; g.fillRect(0,0,W,H)
    }

    // subtle wall finish: lighten lower walls area
    g.fillStyle='rgba(255,255,255,0.08)'; g.fillRect(0, H*0.38, W, H*0.62)

    const color=COLOR_MAP[input.color]??'#1E40AF'
    const light=LIGHT_MAP[input.color]??'#3B82F6'
    const type=input.roofType

    // roof polygon per type
    g.save()
    g.beginPath()
    if(type==='2doc'){
      g.moveTo(70,250); g.lineTo(450,70); g.lineTo(830,250); g.lineTo(810,265); g.lineTo(450,105); g.lineTo(90,265)
    } else if(type==='4doc'){
      g.moveTo(70,250); g.lineTo(450,65); g.lineTo(830,250); g.lineTo(780,270); g.lineTo(450,115); g.lineTo(120,270)
    } else if(type==='chuL'){
      g.moveTo(60,260); g.lineTo(340,105); g.lineTo(520,160); g.lineTo(820,110); g.lineTo(840,250); g.lineTo(540,285); g.lineTo(360,235); g.lineTo(80,275)
    } else if(type==='thai'){
      // steeper
      g.moveTo(70,255); g.lineTo(450,45); g.lineTo(830,255); g.lineTo(800,270); g.lineTo(450,85); g.lineTo(100,270)
    } else { // nhat
      g.moveTo(70,255); g.lineTo(450,75); g.lineTo(830,255); g.lineTo(800,270); g.lineTo(450,110); g.lineTo(100,270)
    }
    g.closePath()
    g.clip()

    // tile pattern inside clip
    drawTilePattern(g,color,light)

    // ridge highlight
    g.strokeStyle='rgba(255,255,255,0.55)'; g.lineWidth=3
    if(type==='chuL'){
      g.beginPath(); g.moveTo(340,105); g.lineTo(450,135); g.moveTo(450,135); g.lineTo(820,110); g.stroke()
    } else {
      g.beginPath(); g.moveTo(450,75); g.lineTo(450,105); g.stroke()
      // top ridge horizontal
      g.lineWidth=4; g.beginPath(); g.moveTo(180,120); g.lineTo(720,120); g.globalAlpha=0.5; g.stroke(); g.globalAlpha=1
    }

    // shadow under eaves
    g.fillStyle='rgba(0,0,0,0.18)'; g.fillRect(80,250,740,22)
    g.restore()

    // eaves line
    g.strokeStyle='rgba(255,255,255,0.9)'; g.lineWidth=2
    g.beginPath(); g.moveTo(75,255); g.lineTo(825,255); g.stroke()

    // label badge
    g.fillStyle='rgba(15,42,77,0.92)'; g.beginPath()
    const txt=`Mái ${type} • ${input.material} • ${input.color}`
    g.roundRect(14, H-34, 320, 22, 11); g.fill()
    g.fillStyle='white'; g.font='600 11px system-ui,sans-serif'; g.fillText(txt,24,H-19)

    // optional: add DEMO badge so user knows it's local mock
    g.fillStyle='rgba(255,255,255,0.88)'; g.roundRect(W-78,10,64,18,9); g.fill()
    g.fillStyle='#0F2A4D'; g.font='700 9px system-ui,sans-serif'; g.fillText('DEMO AI',W-62,22)

    return {url:c.toDataURL('image/jpeg',0.86), provider:'mock-v2'}
  }
}
export function getProvider():AIImageProvider{ return new MockProvider() }
