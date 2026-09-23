import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GeneratedImage, Project, RoofConfig } from '../types'
const defaultConfig: RoofConfig = {roofType:'nhat', material:'asa', color:'xanh', length:15, width:10, wallHeight:3.6, overhang:0.8, pitch:30}
type S={
  projects: Project[]
  currentId: string|null
  roofConfig: RoofConfig
  originalImage: string|null
  generated: GeneratedImage[]
  setConfig:(p:Partial<RoofConfig>)=>void
  setOriginal:(s:string|null)=>void
  addGenerated:(g:GeneratedImage)=>void
  saveProject:(name:string, customer?:string)=>void
  loadProject:(id:string)=>void
  deleteProject:(id:string)=>void
  duplicateProject:(id:string)=>void
}
export const useAppStore = create<S>()(persist((set,get)=>({
  projects:[], currentId:null, roofConfig:{...defaultConfig}, originalImage:null, generated:[],
  setConfig:(p)=>set(s=>({roofConfig:{...s.roofConfig,...p}})),
  setOriginal:(s)=>set({originalImage:s}),
  addGenerated:(g)=>set(s=>({generated:[...s.generated,g]})),
  saveProject:(name,customer='')=>{
    const {roofConfig, originalImage, generated, projects, currentId} = get()
    const now=new Date().toISOString()
    if(currentId){
      set({projects:projects.map(p=>p.id===currentId?{...p,name,customer,originalImage:originalImage??p.originalImage,generatedImages:generated,roofConfig,updatedAt:now}:p)})
    } else {
      const id=Math.random().toString(36).slice(2,9)
      const pr:Project={id,name,customer,phone:'',address:'',originalImage:originalImage??undefined,generatedImages:generated,roofConfig,createdAt:now,updatedAt:now}
      set({projects:[pr,...projects], currentId:id})
    }
  },
  loadProject:(id)=>{
    const p=get().projects.find(x=>x.id===id); if(!p) return
    set({currentId:id, roofConfig:p.roofConfig, originalImage:p.originalImage??null, generated:p.generatedImages})
  },
  deleteProject:(id)=>set(s=>({projects:s.projects.filter(p=>p.id!==id), currentId:s.currentId===id?null:s.currentId})),
  duplicateProject:(id)=>{
    const p=get().projects.find(x=>x.id===id); if(!p) return
    const nid=Math.random().toString(36).slice(2,9)
    set(s=>({projects:[{...p,id:nid,name:p.name+' (copy)',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()},...s.projects]}))
  },
}),{name:'roof3d-store'}))
