import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useAppStore } from '../store/useAppStore'
import { COLORS } from '../types'
import { calcTakeoff } from '../calculations/roof'

function RoofMesh({type, color, pitch, overhang, length, width}:{type:string;color:string;pitch:number;overhang:number;length:number;width:number}){
  const hex = COLORS.find(c=>c.id===color)?.hex ?? '#1d4ed8'
  const geom = useMemo(()=>{
    const h = Math.tan(pitch*Math.PI/180)*(width/2)
    // simple gable/hip/pyramid geometry
    const L=length, W=width, o=overhang
    if(type==='2doc'){
      const g=new THREE.BufferGeometry()
      const verts=new Float32Array([
        -L/2-o,0,-W/2-o,  L/2+o,0,-W/2-o,  0,h,0,
        -L/2-o,0, W/2+o,  0,h,0,  L/2+o,0,W/2+o,
        -L/2-o,0,-W/2-o,  0,h,0,  -L/2-o,0,W/2+o,
         L/2+o,0,-W/2-o,  L/2+o,0,W/2+o, 0,h,0,
      ])
      g.setAttribute('position', new THREE.BufferAttribute(verts,3)); g.computeVertexNormals(); return g
    }
    if(type==='4doc'){
      const g=new THREE.BufferGeometry()
      const verts=new Float32Array([
        -L/2-o,0,-W/2-o,  L/2+o,0,-W/2-o,  0,h,0,
        L/2+o,0,-W/2-o,  L/2+o,0,W/2+o, 0,h,0,
        L/2+o,0,W/2+o, -L/2-o,0,W/2+o, 0,h,0,
        -L/2-o,0,W/2+o, -L/2-o,0,-W/2-o, 0,h,0,
      ])
      const idx=[0,1,2, 3,4,2, 5,6,2, 7,0,2]
      g.setAttribute('position', new THREE.BufferAttribute(verts,3)); g.setIndex(idx); g.computeVertexNormals(); return g
    }
    const top=new THREE.ConeGeometry(Math.max(L,W)/1.6, h, 4, 1)
    top.rotateY(Math.PI/4); top.translate(0, h/2+0.08, 0)
    return top
  },[type,pitch,overhang,length,width])
  // For nhat/thai/chuL render via cone; for others via custom
  if(type==='nhat'||type==='thai'||type==='chuL'){
    return <group>
      <mesh position={[0,-0.4,0]}><boxGeometry args={[length,width,0.15]}/><meshStandardMaterial color="#e2e8f0"/></mesh>
      <mesh geometry={geom as THREE.BufferGeometry}><meshStandardMaterial color={hex} roughness={0.7}/></mesh>
    </group>
  }
  return <mesh geometry={geom as THREE.BufferGeometry}><meshStandardMaterial color={hex} roughness={0.6} side={THREE.DoubleSide}/></mesh>
}

export default function Design(){
  const {roofConfig,setConfig}=useAppStore()
  const takeoff=calcTakeoff(roofConfig)
  return <div className="grid lg:grid-cols-[1fr_380px] gap-4">
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
      <div className="h-[420px] lg:h-[560px] bg-gradient-to-b from-sky-50 to-slate-100">
        <Canvas camera={{position:[18,10,18], fov:45}} dpr={[1,1.5]}>
          <ambientLight intensity={0.8}/><directionalLight position={[10,15,8]} intensity={1}/>
          <Suspense fallback={null}>
            <RoofMesh type={roofConfig.roofType} color={roofConfig.color} pitch={roofConfig.pitch} overhang={roofConfig.overhang} length={roofConfig.length} width={roofConfig.width}/>
          </Suspense>
          <OrbitControls enableDamping/><gridHelper args={[30,20,'#cbd5e1','#e2e8f0']}/>
        </Canvas>
      </div>
      <div className="p-3 flex gap-2 text-xs">
        <span className="bg-slate-100 rounded-full px-3 py-1">Kéo để xoay</span><span className="bg-slate-100 rounded-full px-3 py-1">Cuộn để zoom</span><span className="bg-slate-100 rounded-full px-3 py-1">Chuột phải để pan</span>
      </div>
    </div>
    <div className="bg-white rounded-2xl border shadow-sm p-4 space-y-4 h-fit">
      <div className="text-sm font-bold text-[#0f2a4d]">Cấu hình mái</div>
      <div className="grid grid-cols-2 gap-2">
        {[
          ['nhat','Mái Nhật'],['thai','Mái Thái'],['2doc','Mái 2 dốc'],['4doc','Mái 4 dốc'],['chuL','Mái chữ L'],
        ].map(([id,label])=><button key={id} onClick={()=>setConfig({roofType:id as any})} className={`border rounded-xl py-2 text-sm ${roofConfig.roofType===id?'bg-[#0f2a4d] text-white':'bg-white'}`}>{label}</button>)}
      </div>
      <label className="block text-xs">Độ dốc: {roofConfig.pitch}°<input type="range" min={10} max={45} value={roofConfig.pitch} onChange={e=>setConfig({pitch:parseInt(e.target.value)})} className="w-full"/></label>
      <label className="block text-xs">Đua mái: {roofConfig.overhang}m<input type="range" min={0} max={1.5} step={0.1} value={roofConfig.overhang} onChange={e=>setConfig({overhang:parseFloat(e.target.value)})} className="w-full"/></label>
      <div className="grid grid-cols-3 gap-2">
        <label className="text-xs">Dài<input type="number" value={roofConfig.length} onChange={e=>setConfig({length:parseFloat(e.target.value)||0})} className="w-full border rounded-lg px-2 py-1"/></label>
        <label className="text-xs">Rộng<input type="number" value={roofConfig.width} onChange={e=>setConfig({width:parseFloat(e.target.value)||0})} className="w-full border rounded-lg px-2 py-1"/></label>
        <label className="text-xs">Cao tường<input type="number" value={roofConfig.wallHeight} onChange={e=>setConfig({wallHeight:parseFloat(e.target.value)||0})} className="w-full border rounded-lg px-2 py-1"/></label>
      </div>
      <div className="flex flex-wrap gap-2">
        {COLORS.map(c=><button key={c.id} onClick={()=>setConfig({color:c.id})} className={`w-7 h-7 rounded-full border-2 ${roofConfig.color===c.id?'border-[#0f2a4d]':'border-white shadow'}`} style={{background:c.hex}}/>)}
      </div>
      <div className="bg-slate-50 rounded-xl p-3 text-sm">
        <div>Diện tích mái: <b>{takeoff.roofArea} m²</b></div>
        <div>Tổng dự toán: <b>{takeoff.grandTotal.toLocaleString('vi-VN')} ₫</b></div>
      </div>
    </div>
  </div>
}
