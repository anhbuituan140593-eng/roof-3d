import { useEffect, useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { calcTakeoff } from '../calculations/roof'
import type { TakeoffItem } from '../types'
import jsPDF from 'jspdf'

export default function Quote(){
  const {roofConfig, projects, currentId, originalImage, generated} = useAppStore()
  const base=calcTakeoff(roofConfig)
  const [items,setItems]=useState<TakeoffItem[]>(base.takeoff)
  const [vatPct,setVatPct]=useState(10)
  const [customer,setCustomer]=useState('')
  const [phone,setPhone]=useState('')
  const project = projects.find(p=>p.id===currentId)

  useEffect(()=>{ setItems(base.takeoff) }, [roofConfig.roofType, roofConfig.material, roofConfig.color, roofConfig.length, roofConfig.width, roofConfig.pitch, roofConfig.overhang])

  function update(i:number, patch:Partial<TakeoffItem>){
    setItems(s=>s.map((it,idx)=> idx===i ? {...it, ...patch, total: (patch.qty??it.qty)*(patch.unitPrice??it.unitPrice)} : it))
  }
  function remove(i:number){ setItems(s=>s.filter((_,idx)=>idx!==i)) }
  function add(){
    setItems(s=>[...s, {name:'Vật liệu mới', unit:'m²', qty:1, unitPrice:100000, total:100000}])
  }
  const subtotal = items.reduce((a,b)=>a+b.total,0)
  const vat = Math.round(subtotal*vatPct/100)
  const grand = subtotal+vat

  function exportPDF(){
    const doc=new jsPDF()
    doc.setFontSize(16); doc.text('ROOF 3D - BAO GIA MAI NHA',14,18)
    doc.setFontSize(10); doc.text(`Khach hang: ${customer||project?.customer||''}  |  SDT: ${phone}`,14,26)
    doc.text(`Loai mai: ${roofConfig.roofType}  |  Vat lieu: ${roofConfig.material}  |  Mau: ${roofConfig.color}  |  Dien tich: ${base.roofArea} m2`,14,32)
    let y=40
    doc.text('Boc tach vat tu:',14,y); y+=6
    items.forEach(it=>{ doc.text(`${it.name} - ${it.qty} ${it.unit} x ${it.unitPrice.toLocaleString('vi-VN')} = ${it.total.toLocaleString('vi-VN')} VND`,14,y); y+=6; if(y>270){doc.addPage(); y=20}})
    doc.text(`Tam tinh: ${subtotal.toLocaleString('vi-VN')}  VAT ${vatPct}%: ${vat.toLocaleString('vi-VN')}  TONG: ${grand.toLocaleString('vi-VN')} VND`,14,y+4)
    doc.text('Ghi chu: Chi phi mang tinh tham khao.',14,y+12)
    doc.save(`bao-gia-roof3d-${Date.now()}.pdf`)
  }

  return <div className="max-w-3xl mx-auto space-y-4">
    <div className="bg-white rounded-2xl border p-4">
      <div className="font-bold text-[#0f2a4d]">Báo giá</div>
      <div className="mt-3 grid md:grid-cols-2 gap-3">
        <input placeholder="Khách hàng" value={customer} onChange={e=>setCustomer(e.target.value)} className="border rounded-lg px-3 py-2"/>
        <input placeholder="Số điện thoại" value={phone} onChange={e=>setPhone(e.target.value)} className="border rounded-lg px-3 py-2"/>
      </div>
      <div className="mt-3 text-sm">Diện tích mái: <b>{base.roofArea} m²</b> • Loại: <b>{roofConfig.roofType}</b> • Vật liệu: <b>{roofConfig.material}</b></div>
      {originalImage && <img src={originalImage} className="mt-3 w-full max-h-48 object-cover rounded-xl"/>}
      {generated[0] && <img src={generated[0].url} className="mt-2 w-full max-h-48 object-cover rounded-xl"/>}
    </div>

    <div className="bg-white rounded-2xl border overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b bg-slate-50">
        <span className="text-sm font-bold">Vật tư & đơn giá (có thể sửa)</span>
        <div className="flex gap-2">
          <button onClick={add} className="bg-[#0f2a4d] text-white px-3 py-1.5 rounded-full text-xs font-semibold">+ Thêm vật liệu</button>
          <button onClick={()=>setItems(base.takeoff)} className="border bg-white px-3 py-1.5 rounded-full text-xs">Tính lại</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-slate-50 text-xs"><tr><th className="text-left p-2">Hạng mục</th><th className="p-2">Đơn vị</th><th className="p-2">SL</th><th className="p-2">Đơn giá</th><th className="text-right p-2">Thành tiền</th><th className="p-2"></th></tr></thead>
          <tbody>{items.map((r,i)=><tr key={i} className="border-t">
            <td className="p-1"><input value={r.name} onChange={e=>update(i,{name:e.target.value})} className="w-full border rounded px-2 py-1"/></td>
            <td className="p-1"><input value={r.unit} onChange={e=>update(i,{unit:e.target.value})} className="w-16 border rounded px-2 py-1 text-center"/></td>
            <td className="p-1"><input type="number" value={r.qty} onChange={e=>update(i,{qty:parseFloat(e.target.value)||0})} className="w-20 border rounded px-2 py-1 text-center"/></td>
            <td className="p-1"><input type="number" value={r.unitPrice} onChange={e=>update(i,{unitPrice:parseFloat(e.target.value)||0})} className="w-28 border rounded px-2 py-1 text-right"/></td>
            <td className="p-2 text-right font-medium">{r.total.toLocaleString('vi-VN')}</td>
            <td className="p-1"><button onClick={()=>remove(i)} className="text-red-600 border rounded px-2 py-1 text-xs">Xóa</button></td>
          </tr>)}</tbody>
          <tfoot className="bg-slate-50 font-bold">
            <tr><td colSpan={4} className="p-2 text-right">Tạm tính</td><td className="p-2 text-right">{subtotal.toLocaleString('vi-VN')} ₫</td><td/></tr>
            <tr><td colSpan={4} className="p-2 text-right flex items-center justify-end gap-2">VAT <input type="number" value={vatPct} onChange={e=>setVatPct(parseFloat(e.target.value)||0)} className="w-14 border rounded px-1 py-0.5 text-center"/>%</td><td className="p-2 text-right">{vat.toLocaleString('vi-VN')} ₫</td><td/></tr>
            <tr className="text-[#0f2a4d]"><td colSpan={4} className="p-2 text-right">Tổng cộng</td><td className="p-2 text-right">{grand.toLocaleString('vi-VN')} ₫</td><td/></tr>
          </tfoot>
        </table>
      </div>
    </div>

    <div className="flex flex-wrap gap-2">
      <button onClick={exportPDF} className="bg-[#0f2a4d] text-white px-6 py-2.5 rounded-xl font-semibold">Xuất PDF</button>
      <button onClick={()=>navigator.clipboard.writeText(window.location.href)} className="border bg-white px-6 py-2.5 rounded-xl">Copy link</button>
      {(navigator as any).share && <button onClick={()=>(navigator as any).share({title:'Báo giá ROOF 3D', url:location.href})} className="border bg-white px-6 py-2.5 rounded-xl">Chia sẻ</button>}
    </div>
  </div>
}
