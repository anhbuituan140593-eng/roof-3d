import { Link, useLocation } from 'react-router-dom'
const nav=[
  {to:'/', label:'Trang chủ', icon:'⌂'},
  {to:'/projects', label:'Dự án', icon:'▦'},
  {to:'/create', label:'Tạo ảnh', icon:'◉'},
  {to:'/design', label:'3D', icon:'⬡'},
  {to:'/quote', label:'Báo giá', icon:'≡'},
]
export default function Layout({children}:{children:React.ReactNode}){
  const loc=useLocation()
  return <div className="min-h-screen flex flex-col">
    <header className="sticky top-0 z-30 bg-[#0f2a4d] text-white">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-extrabold tracking-tight"><span className="bg-white text-[#0f2a4d] rounded-lg px-2 py-1 text-sm">⌂</span> ROOF 3D</Link>
        <nav className="hidden md:flex gap-1">{nav.map(n=><Link key={n.to} to={n.to} className={`px-3 py-1.5 rounded-full text-sm ${loc.pathname===n.to?'bg-white text-[#0f2a4d]':'opacity-80 hover:opacity-100'}`}>{n.label}</Link>)}</nav>
        <Link to="/create" className="hidden md:inline-flex bg-sky-500 hover:bg-sky-400 text-white px-4 py-1.5 rounded-full text-sm font-semibold">Dùng thử ngay →</Link>
      </div>
    </header>
    <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 pb-20 md:pb-6">{children}</main>
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t flex">
      {nav.map(n=><Link key={n.to} to={n.to} className={`flex-1 py-2.5 text-center text-xs ${loc.pathname===n.to?'text-[#0f2a4d] font-bold':'text-slate-500'}`}><div className="text-base leading-none">{n.icon}</div>{n.label}</Link>)}
    </nav>
  </div>
}
