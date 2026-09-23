import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
export default function Projects(){
  const {projects, loadProject, deleteProject, duplicateProject, saveProject}=useAppStore()
  const [name,setName]=useState('Nhà mẫu 10x15m')
  return <div className="space-y-4">
    <div className="bg-white rounded-2xl border p-4 flex flex-wrap gap-2">
      <input value={name} onChange={e=>setName(e.target.value)} className="border rounded-lg px-3 py-2 flex-1 min-w-[180px]"/>
      <button onClick={()=>saveProject(name)} className="bg-[#0f2a4d] text-white px-4 py-2 rounded-xl text-sm font-semibold">Lưu dự án hiện tại</button>
      <button onClick={()=>{const j=JSON.stringify({projects},null,2); const b=new Blob([j],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download='roof3d-projects.json'; a.click()}} className="border bg-white px-4 py-2 rounded-xl text-sm">Export JSON</button>
      <label className="border bg-white px-4 py-2 rounded-xl text-sm cursor-pointer">Import JSON<input type="file" accept=".json" className="hidden" onChange={async e=>{const f=e.target.files?.[0]; if(!f) return; try{const j=JSON.parse(await f.text()); if(j.projects) location.reload()}catch{alert('File không hợp lệ')}}}/></label>
    </div>
    {projects.length===0? <div className="bg-white rounded-2xl border p-10 text-center text-slate-400">Chưa có dự án — hãy tạo ở mục Tạo ảnh</div> :
    <div className="grid md:grid-cols-2 gap-3">
      {projects.map(p=><div key={p.id} className="bg-white rounded-2xl border overflow-hidden">
        {p.originalImage && <img src={p.originalImage} className="h-36 w-full object-cover"/>}
        <div className="p-3">
          <div className="font-bold text-sm">{p.name}</div>
          <div className="text-xs text-slate-500">{p.roofConfig.roofType} • {p.roofConfig.material} • {p.customer}</div>
          <div className="mt-2 flex gap-2">
            <button onClick={()=>loadProject(p.id)} className="text-xs bg-sky-600 text-white px-3 py-1 rounded-full">Mở</button>
            <button onClick={()=>duplicateProject(p.id)} className="text-xs border px-3 py-1 rounded-full">Nhân bản</button>
            <button onClick={()=>deleteProject(p.id)} className="text-xs border px-3 py-1 rounded-full">Xóa</button>
            <button onClick={()=>navigator.clipboard.writeText(location.href)} className="text-xs border px-3 py-1 rounded-full">Copy link</button>
          </div>
        </div>
      </div>)}
    </div>}
  </div>
}
