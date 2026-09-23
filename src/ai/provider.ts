import type { RoofColorId, RoofMaterialId, RoofType } from '../types'
export interface HouseImageInput{ imageDataUrl:string; roofType:RoofType; material:RoofMaterialId; color:RoofColorId; instruction?:string }
export interface GeneratedHouseImage{ url:string; provider:string }
export interface AIImageProvider{ generate(input:HouseImageInput):Promise<GeneratedHouseImage> }
function buildPrompt(i:HouseImageInput){
  return `Photorealistic completed house. Preserve original architecture, camera perspective, building proportions, windows, doors, floors, yard. Add ${i.roofType} roof with ${i.material} material color ${i.color}. Realistic shadows, lighting, roof geometry. Do NOT redesign building, do NOT change floors/windows/doors/camera angle. ${i.instruction??''}`.trim()
}
// Mock provider: returns a placeholder completed house by compositing via canvas (no external API key needed). Replace with real provider in production.
export class MockProvider implements AIImageProvider{
  async generate(input:HouseImageInput): Promise<GeneratedHouseImage>{
    await new Promise(r=>setTimeout(r,1800))
    // generate a canvas image that looks like a completed house (lightweight mock)
    const c=document.createElement('canvas'); c.width=900; c.height=600
    const g=c.getContext('2d')!
    // try to draw original as background if possible
    const img=new Image(); img.src=input.imageDataUrl
    await new Promise<void>(res=>{ img.onload=()=>res(); img.onerror=()=>res(); setTimeout(()=>res(),800)})
    try{ g.drawImage(img,0,0,900,600)}catch{ g.fillStyle='#e2e8f0'; g.fillRect(0,0,900,600)}
    // overlay a roof colored rectangle to simulate completion
    const colorMap:Record<string,string>={do:'#b91c1c',doCam:'#ea580c',nau:'#5d4037',xam:'#64748b',xanh:'#1d4ed8',xanhReu:'#15803d',den:'#1e293b'}
    g.fillStyle=colorMap[input.color]??'#1d4ed8'; g.globalAlpha=0.92
    g.beginPath(); g.moveTo(120,220); g.lineTo(450,80); g.lineTo(780,220); g.lineTo(730,240); g.lineTo(450,120); g.lineTo(170,240); g.closePath(); g.fill()
    g.globalAlpha=1; g.fillStyle='white'; g.font='bold 18px sans-serif'; g.fillText(`Mái ${input.roofType} • ${input.material} • ${input.color}`,24,560)
    // vignette
    g.fillStyle='rgba(255,255,255,0.08)'; g.fillRect(0,0,900,40)
    return {url:c.toDataURL('image/jpeg',0.82), provider:'mock'}
  }
}
export function getProvider():AIImageProvider{ return new MockProvider() }
export { buildPrompt }
