import { Link } from 'react-router-dom'
export default function Home(){
  return <div className="space-y-6">
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border">
      <div className="text-sky-600 text-xs font-bold tracking-widest">ROOF 3D</div>
      <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f2a4d] mt-1">Chụp ảnh hôm nay - Xem nhà hoàn thiện ngày mai</h1>
      <p className="text-slate-500 mt-2">Ứng dụng mô phỏng mái nhà và vật liệu hoàn thiện bằng AI + 3D — Nhanh chóng • Đơn giản • Chính xác</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link to="/create" className="bg-[#0f2a4d] text-white px-6 py-3 rounded-xl font-semibold">Chụp ảnh ngôi nhà →</Link>
        <Link to="/design" className="bg-white border px-6 py-3 rounded-xl font-semibold">Thiết kế mái 3D</Link>
      </div>
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="rounded-xl bg-slate-100 p-3">
          <div className="text-xs font-bold text-slate-600">Ảnh thực tế (hiện trạng)</div>
          <div className="mt-2 h-40 rounded-lg bg-gradient-to-br from-amber-100 to-stone-300 flex items-center justify-center text-stone-500">Nhà đang xây thô</div>
        </div>
        <div className="rounded-xl bg-slate-100 p-3">
          <div className="text-xs font-bold text-[#0f2a4d]">Ảnh mô phỏng hoàn thiện</div>
          <div className="mt-2 h-40 rounded-lg bg-gradient-to-br from-sky-100 to-indigo-200 flex items-center justify-center text-[#0f2a4d]">Nhà hoàn thiện AI</div>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[
        ['Tạo ảnh hoàn thiện','AI giữ nguyên kiến trúc, chỉ thêm mái & vật liệu'],
        ['Thiết kế mái 3D','Xoay/zoom, đo diện tích chính xác'],
        ['Bóc tách vật tư','Ngói, xà gồ, li tô, phụ kiện'],
        ['Báo giá PDF','Xuất PDF chuyên nghiệp, chia sẻ'],
      ].map(([t,d])=><div key={t} className="bg-white rounded-xl p-4 border shadow-sm"><div className="font-bold text-sm text-[#0f2a4d]">{t}</div><div className="text-xs text-slate-500 mt-1">{d}</div></div>)}
    </div>
    <div className="flex flex-wrap gap-2 text-xs text-slate-500">
      <span className="bg-white border rounded-full px-3 py-1">Không cần cấu hình phức tạp</span>
      <span className="bg-white border rounded-full px-3 py-1">Hoạt động online/offline</span>
      <span className="bg-white border rounded-full px-3 py-1">Dùng tốt trên mọi thiết bị</span>
    </div>
  </div>
}
