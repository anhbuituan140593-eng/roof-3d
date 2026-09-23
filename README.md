# ROOF 3D — Chụp ảnh hôm nay, xem nhà hoàn thiện ngày mai

Ứng dụng mô phỏng mái nhà + vật liệu hoàn thiện bằng AI và 3D, PWA nhẹ, responsive.

## Tech
Vite + React + TypeScript + Tailwind + React Router + Zustand + Three.js/R3F + jsPDF + vite-plugin-pWA

## Chạy
```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

## Cấu hình AI
`src/ai/provider.ts` — abstraction `AIImageProvider`. Mặc định `MockProvider` (không cần API key, chạy local). Thay bằng OpenAI/Gemini/Replicate bằng cách implement `generate()` và đổi `getProvider()`.

Biến môi trường xem `.env.example`.

## Tính năng
- Tạo ảnh hoàn thiện (upload/camera → chọn mái/vật liệu/màu → AI mock → Before/After slider + phương án khác)
- Thiết kế mái 3D (5 kiểu: Nhật/Thái/2 dốc/4 dốc/chữ L, xoay/zoom/pan, đổi màu realtime)
- Tính diện tích hình học + bóc tách vật tư + dự toán (VAT) — client-side, offline
- Báo giá + xuất PDF + chia sẻ
- Dự án: lưu/nhân bản/xóa, persist localStorage, export/import JSON
- PWA: manifest + service worker (precache)

## Docker
```bash
docker compose up --build
```
