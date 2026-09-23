import { useRef, useState } from 'react'
import { COLORS, MATERIALS, ROOF_TYPES } from '../types'
import { compressImage } from '../lib/image'
import { getProvider } from '../ai/provider'
import { useAppStore } from '../store/useAppStore'
import { calcTakeoff } from '../calculations/roof'

export default function Create(){
  const {roofConfig, setConfig, originalImage, setOriginal, addGenerated, generated} = useAppStore()
  const [busy,setBusy]=useState(false)
  const [beforeAfter,setBeforeAfter]=useState(50)
  const inputRef=useRef<HTMLInputElement>(null)
  const last = generated[generated.length-1]

  async function onFile(f:File){
    const dataUrl = await compressImage(f)
    setOriginal(dataUrl)
  }
  async function generate(){
    if(!originalImage) return alert('Vui lòng chọn ảnh ngôi nhà')
    setBusy(true)
    try{
      const p=getProvider()
      const r=await p.generate({imageDataUrl:originalImage, roofType:roofConfig.roofType, material:roofConfig.material, color:roofConfig.color})
      addGenerated({id:Math.random().toString(36).slice(2,8), url:r.url, roofType:roofConfig.roofType, material:roofConfig.material, color:roofConfig.color, createdAt:new Date().toISOString()})
    } finally{ setBusy(false)}
  }
  const takeoff = calcTakeoff(roofConfig)

  return <div className="grid lg:grid-cols-[380px_1fr] gap-6">
    <div className="bg-white rounded-2xl border shadow-sm p-4 space-y-5 h-fit">
      <div>
        <div className="text-xs font-bold text-[#0f2a4d]">1. Chụp ảnh ngôi nhà</div>
        <div className="mt-2 border-2 border-dashed rounded-xl p-3 bg-slate-50">
          {originalImage ? <img src={originalImage} className="w-full rounded-lg max-h-52 object-cover"/> : <div className="h-32 flex items-center justify-center text-slate-400 text-sm">Chưa có ảnh</div>}
          <div className="mt-2 flex gap-2">
            <button onClick={()=>inputRef.current?.click()} className="flex-1 bg-[#0f2a4d] text-white rounded-lg py-2 text-sm font-semibold">Chọn ảnh</button>
            {originalImage && <button onClick={()=>setOriginal(null)} className="px-3 border rounded-lg text-sm">Xóa</button>}
          </div>
          <input ref={inputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e=>e.target.files?.[0] && onFile(e.target.files[0])}/>
          <p className="text-[11px] text-slate-500 mt-2">Mẹo: chụp chính diện hoặc góc 3/4, toàn bộ ngôi nhà trong khung.</p>
        </div>
      </div>

      <div>
        <div className="text-xs font-bold text-[#0f2a4d]">2. Chọn kiểu mái</div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {ROOF_TYPES.map(r=><button key={r.id} onClick={()=>setConfig({roofType:r.id})} className={`text-left border rounded-xl p-3 ${roofConfig.roofType===r.id?'border-[#0f2a4d] bg-sky-50':'bg-white'}`}>
            <div className="text-sm font-semibold">{r.label}</div><div className="text-xs text-slate-500">{r.desc}</div>
          </button>)}
        </div>
      </div>

      <div>
        <div className="text-xs font-bold text-[#0f2a4d]">3. Chọn vật liệu & màu sắc</div>
        <div className="mt-2 space-y-2">
          <div className="grid grid-cols-1 gap-1">
            {MATERIALS.map(m=><button key={m.id} onClick={()=>setConfig({material:m.id})} className={`text-left border rounded-lg px-3 py-2 text-sm ${roofConfig.material===m.id?'border-[#0f2a4d] bg-sky-50':'bg-white'}`}>{m.label}</button>)}
          </div>
          <div className="flex flex-wrap gap-2">
            {COLORS.map(c=><button key={c.id} title={c.label} onClick={()=>setConfig({color:c.id})} className={`w-8 h-8 rounded-full border-2 ${roofConfig.color===c.id?'border-[#0f2a4d] scale-110':'border-white shadow'}`} style={{background:c.hex}}/>)}
          </div>
        </div>
      </div>

      <button onClick={generate} disabled={busy} className="w-full bg-sky-600 hover:bg-sky-500 disabled:opacity-60 text-white rounded-xl py-3 font-bold">{busy?'Đang tạo...':'Tạo ảnh bằng AI'}</button>
      {busy && <div className="text-xs text-slate-500">Analyzing house... Designing roof... Rendering...</div>}

      <div className="pt-2 border-t space-y-2">
        <div className="text-xs font-bold">Thông số mái (dùng cho 3D & dự toán)</div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[['Dài (m)','length'],['Rộng (m)','width'],['Cao tường (m)','wallHeight'],['Đua mái (m)','overhang'],['Độ dốc (°)','pitch']].map(([label,key])=><label key={key} className="flex flex-col gap-1"><span className="text-xs text-slate-500">{label}</span><input type="number" step="0.1" value={(roofConfig as any)[key]} onChange={e=>setConfig({[key]:parseFloat(e.target.value)||0} as any)} className="border rounded-lg px-2 py-1.5"/></label>)}
        </div>
        <div className="text-xs text-slate-600">Diện tích mái: <b>{takeoff.roofArea} m²</b> • Tổng dự toán: <b>{takeoff.grandTotal.toLocaleString('vi-VN')} ₫</b></div>
      </div>
    </div>

    <div className="space-y-4">
      <div className="bg-white rounded-2xl border shadow-sm p-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold text-[#0f2a4d]">Kết quả Before / After</div>
          <div className="flex gap-2">
            <button onClick={async()=>{ if(!last) return; const a=document.createElement('a'); a.href=last.url; a.download='roof3d.jpg'; a.click()}} className="border rounded-full px-3 py-1 text-xs">Lưu ảnh</button>
            <button onClick={async()=>{ if(!last) return; if(navigator.share) await navigator.share({title:'ROOF 3D', url:last.url}); else await navigator.clipboard.writeText(last.url)}} className="border rounded-full px-3 py-1 text-xs">Chia sẻ</button>
            <button onClick={generate} className="bg-[#0f2a4d] text-white rounded-full px-3 py-1 text-xs">Tạo phương án khác</button>
          </div>
        </div>
        {!originalImage && !last ? <div className="h-64 flex items-center justify-center text-slate-400 text-sm">Chọn ảnh và bấm Tạo ảnh bằng AI</div> :
        <div className="mt-3">
          <div className="relative overflow-hidden rounded-xl bg-slate-100 h-[360px]">
            {originalImage && <img src={originalImage} className="absolute inset-0 w-full h-full object-cover"/>}
            {last && <img src={last.url} className="absolute inset-0 w-full h-full object-cover" style={{clipPath:`inset(0 ${100-beforeAfter}% 0 0)`}}/>}
            <div className="absolute inset-y-0 w-0.5 bg-white" style={{left:`${beforeAfter}%`}}/>
            <input type="range" min={0} max={100} value={beforeAfter} onChange={e=>setBeforeAfter(parseInt(e.target.value))} className="absolute bottom-3 left-3 right-3"/>
            <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">Trước</div>
            <div className="absolute top-2 right-2 bg-[#0f2a4d] text-white text-xs px-2 py-1 rounded-full">Sau</div>
          </div>
        </div>}
      </div>

      {generated.length>0 && <div>
        <div className="text-sm font-bold">Phương án khác ({generated.length})</div>
        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
          {generated.map(g=><div key={g.id} className="bg-white border rounded-xl overflow-hidden"><img src={g.url} className="h-28 w-full object-cover"/><div className="p-2 text-xs"><div className="font-semibold">{g.roofType} • {g.material}</div><div className="text-slate-500">{g.color}</div></div></div>)}
        </div>
      </div>}

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">Ảnh mô phỏng mang tính trực quan, không thay thế bản vẽ kiến trúc. Chi phí mang tính tham khảo.</div>
    </div>
  </div>
}
