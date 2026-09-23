export type RoofType = 'nhat'|'thai'|'2doc'|'4doc'|'chuL'
export const ROOF_TYPES: {id:RoofType; label:string; desc:string}[] = [
  {id:'nhat', label:'Mái Nhật', desc:'Độ dốc vừa, đua mái'},
  {id:'thai', label:'Mái Thái', desc:'Độ dốc lớn'},
  {id:'2doc', label:'Mái 2 dốc', desc:'Hai mặt nghiêng'},
  {id:'4doc', label:'Mái 4 dốc', desc:'Bốn mặt nghiêng'},
  {id:'chuL', label:'Mái chữ L', desc:'Hai khối giao mái'},
]
export type RoofMaterialId = 'asa'|'ngoiMau'|'datNung'|'tonGiaNgoi'|'ton'
export const MATERIALS: {id:RoofMaterialId; label:string; pricePerM2:number; coverage:number}[] = [
  {id:'asa', label:'Ngói nhựa ASA/PVC', pricePerM2:185000, coverage:0.9},
  {id:'ngoiMau', label:'Ngói màu', pricePerM2:220000, coverage:0.88},
  {id:'datNung', label:'Ngói đất nung', pricePerM2:280000, coverage:0.86},
  {id:'tonGiaNgoi', label:'Tôn giả ngói', pricePerM2:145000, coverage:0.92},
  {id:'ton', label:'Tôn', pricePerM2:110000, coverage:0.95},
]
export type RoofColorId = 'do'|'doCam'|'nau'|'xam'|'xanh'|'xanhReu'|'den'
export const COLORS: {id:RoofColorId; label:string; hex:string}[] = [
  {id:'do', label:'Đỏ', hex:'#c62828'},
  {id:'doCam', label:'Đỏ cam', hex:'#e65100'},
  {id:'nau', label:'Nâu', hex:'#5d4037'},
  {id:'xam', label:'Xám', hex:'#78909c'},
  {id:'xanh', label:'Xanh', hex:'#1565c0'},
  {id:'xanhReu', label:'Xanh rêu', hex:'#2e7d32'},
  {id:'den', label:'Đen', hex:'#263238'},
]
export interface RoofConfig{
  roofType:RoofType; material:RoofMaterialId; color:RoofColorId
  length:number; width:number; wallHeight:number; overhang:number; pitch:number
}
export interface GeneratedImage{ id:string; url:string; roofType:RoofType; material:RoofMaterialId; color:RoofColorId; createdAt:string }
export interface Project{
  id:string; name:string; customer:string; phone:string; address:string
  originalImage?:string; generatedImages:GeneratedImage[]
  roofConfig:RoofConfig; createdAt:string; updatedAt:string
}
export interface TakeoffItem{ name:string; unit:string; qty:number; unitPrice:number; total:number }
export interface CalculationResult{ roofArea:number; takeoff:TakeoffItem[]; subtotal:number; vat:number; grandTotal:number }
