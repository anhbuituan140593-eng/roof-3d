import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { calcTakeoff } from '../calculations/roof'
import jsPDF from 'jspdf'

export default function Quote(){
  const {roofConfig, projects, currentId, originalImage, generated} = useAppStore()
  const t=calcTakeoff(roofConfig)
  const [customer,setCustomer]=useState('')
  const [phone,setPhone]=useState('')
  const project = projects.find(p=>p.id===currentId)

  function exportPDF(){
    const doc=new jsPDF()
    doc.setFontSize(16); doc.text('ROOF 3D - BAO GIA MAI NHA',14,18)
    doc.setFontSize(10); doc.text(`Khach hang: ${customer||project?.customer||''}  |  SDT: ${phone}`,14,26)
    doc.text(`Loai mai: ${roofConfig.roofType}  |  Vat lieu: ${roofConfig.material}  |  Mau: ${roofConfig.color}`,14,32)
    doc.text(`Dien tich mai: ${t.roofArea} m2`,14,38)
    let y=46
    doc.text('Boc tach vat tu:',14,y); y+=6
    t.takeoff.forEach(it=>{ doc.text(`${it.name} - ${it.qty} ${it.unit} x ${it.unitPrice} = ${it.total.toLocaleString('vi-VN')} VND`,14,y); y+=6 })
    doc.text(`Tam tinh: ${t.subtotal.toLocaleString('vi-VN')}  VAT: ${t.vat.toLocaleString('vi-VN')}  TONG: ${t.grandTotal.toLocaleString('vi-VN')} VND`,14,y+4)
    doc.text('Ghi chu: Chi phi mang tinh tham khao.',14,y+12)
    doc.text('Anh mo phong mang tinh truc quan, khong thay the ban ve ky thuat.',14,y+18)
    doc.save(`bao-gia-roof3d-${Date.now()}.pdf`)
  }

  return <div className="max-w-3xl mx-auto space-y-4">
    <div className="bg-white rounded-2xl border p-4">
      <div className="font-bold text-[#0f2a4d]">Báo giá</div>
      <div className="mt-3 grid md:grid-cols-2 gap-3">
        <input placeholder="Khách hàng" value={customer} onChange={e=>setCustomer(e.target.value)} className="border rounded-lg px-3 py-2"/>
        <input placeholder="Số điện thoại" value={phone} onChange={e=>setPhone(e.target.value)} className="border rounded-lg px-3 py-2"/>
      </div>
      <div className="mt-3 text-sm">Diện tích mái: <b>{t.roofArea} m²</b> • Loại: <b>{roofConfig.roofType}</b> • Vật liệu: <b>{roofConfig.material}</b></div>
      {originalImage && <img src={originalImage} className="mt-3 w-full max-h-56 object-cover rounded-xl"/>}
      {generated[0] && <img src={generated[0].url} className="mt-2 w-full max-h-56 object-cover rounded-xl"/>}
    </div>
    <div className="bg-white rounded-2xl border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-xs"><tr><th className="text-left p-2">Hạng mục</th><th className="p-2">SL</th><th className="p-2">Đơn giá</th><th className="text-right p-2">Thành tiền</th></tr></thead>
        <tbody>{t.takeoff.map((r,i)=><tr key={i} className="border-t"><td className="p-2">{r.name}</td><td className="p-2 text-center">{r.qty} {r.unit}</td><td className="p-2 text-right">{r.unitPrice.toLocaleString('vi-VN')}</td><td className="p-2 text-right">{r.total.toLocaleString('vi-VN')}</td></tr>)}</tbody>
        <tfoot className="bg-slate-50 font-bold"><tr><td colSpan={3} className="p-2 text-right">Tổng (VAT {Math.round(t.vat/t.subtotal*100)||10}%)</td><td className="p-2 text-right">{t.grandTotal.toLocaleString('vi-VN')} ₫</td></tr></tfoot>
      </table>
    </div>
    <div className="flex gap-2">
      <button onClick={exportPDF} className="bg-[#0f2a4d] text-white px-6 py-2.5 rounded-xl font-semibold">Xuất PDF</button>
      <button onClick={()=>navigator.clipboard.writeText(window.location.href)} className="border bg-white px-6 py-2.5 rounded-xl">Copy link</button>
      {navigator.share && <button onClick={()=>navigator.share({title:'Báo giá ROOF 3D', url:location.href})} className="border bg-white px-6 py-2.5 rounded-xl">Chia sẻ</button>}
    </div>
  </div>
}
