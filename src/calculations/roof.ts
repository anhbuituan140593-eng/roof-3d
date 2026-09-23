import { type CalculationResult, type RoofConfig, COLORS, MATERIALS } from '../types'
export function calcRoofArea(c: RoofConfig): number {
  const pitchRad = c.pitch * Math.PI / 180
  const cos = Math.cos(pitchRad) || 1
  // geometry-based: each footprint expanded by overhang, divided by cos(pitch)
  const L = c.length + 2*c.overhang
  const W = c.width + 2*c.overhang
  if (c.roofType==='2doc') return (L*W)/cos
  if (c.roofType==='4doc') {
    // hip roof: 4 trapezoidal/triangular faces -> approx footprint/cos * hip factor 1.02
    return (L*W)/cos * 1.02
  }
  if (c.roofType==='chuL') {
    // L shape: two rectangles overlapping
    const a1 = (c.length*0.6+2*c.overhang)*(c.width+2*c.overhang)/cos
    const a2 = (c.length*0.5+2*c.overhang)*(c.width*0.6+2*c.overhang)/cos
    return (a1+a2)*0.92
  }
  // nhat/thai: footprint/cos * complexity factor
  return (L*W)/cos * (c.roofType==='thai'?1.06:1.04)
}
export function calcTakeoff(c: RoofConfig, wastePct=5, vatPct=10): CalculationResult {
  const area = calcRoofArea(c)
  const mat = MATERIALS.find(m=>m.id===c.material)!
  const effectiveArea = area/(mat.coverage)
  const tilesQty = Math.ceil(effectiveArea*1.05) // pcs approx per m2? simplified: 9 pcs/m2 for ngoi
  const pcsPerM2 = c.material==='ton'?1:9
  const pcs = c.material==='ton' ? Math.ceil(area*1.02) : Math.ceil(area*pcsPerM2*(1+wastePct/100))
  const ridgeM = c.length + c.width
  const tileCost = Math.round(area * mat.pricePerM2 * (1+wastePct/100))
  const ridgeCost = Math.round(ridgeM*85000)
  const purlinM = Math.round(area*1.2)
  const purlinCost = Math.round(purlinM*28000)
  const battenM = Math.round(area*1.8)
  const battenCost = Math.round(battenM*18000)
  const laborCost = Math.round(area*65000)
  const accCost = Math.round(area*15000)
  const colorLabel = COLORS.find(x=>x.id===c.color)?.label??c.color
  const takeoff = [
    {name:`${mat.label} (${colorLabel})`, unit:'m²', qty:Math.round(area*100)/100, unitPrice:mat.pricePerM2, total:tileCost},
    {name:'Ngói nóc / úp nóc', unit:'md', qty:Math.round(ridgeM*100)/100, unitPrice:85000, total:ridgeCost},
    {name:'Xà gồ (C, kẽm)', unit:'md', qty:purlinM, unitPrice:28000, total:purlinCost},
    {name:'Li tô / mè', unit:'md', qty:battenM, unitPrice:18000, total:battenCost},
    {name:'Vít + phụ kiện', unit:'m²', qty:Math.round(area), unitPrice:15000, total:accCost},
    {name:'Nhân công lợp mái', unit:'m²', qty:Math.round(area), unitPrice:65000, total:laborCost},
    // keep pcs info as note in first item qty is area; pcs displayed separately if needed
    ...(c.material!=='ton'?[]:[]),
  ]
  // store pcs in hidden field via closure not needed
  void pcs; void tilesQty
  const subtotal = takeoff.reduce((s,x)=>s+x.total,0)
  const vat = Math.round(subtotal*vatPct/100)
  return {roofArea:Math.round(area*100)/100, takeoff, subtotal, vat, grandTotal:subtotal+vat}
}
