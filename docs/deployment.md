# Hướng dẫn Deploy EduTrack lên Vercel & Supabase

Tài liệu này hướng dẫn chi tiết các bước để đưa ứng dụng EduTrack từ môi trường phát triển (Local) lên môi trường thực tế (Production).

## 1. Chuẩn bị trên Supabase

### A. Cấu hình Authentication Redirects
Vercel sẽ cung cấp cho bạn một tên miền (URL), bạn cần khai báo URL này với Supabase để tính năng Đăng nhập/Đăng ký hoạt động.

1.  Truy cập **Supabase Dashboard** > **Authentication** > **URL Configuration**.
2.  **Site URL**: Thay `http://localhost:3000` thành URL của app trên Vercel (ví dụ: `https://edutrack-app.vercel.app`).
3.  **Redirect URLs**: Thêm các URL sau:
    -   `https://edutrack-app.vercel.app/**`
    -   `https://edutrack-app.vercel.app/auth/callback`

### B. Cập nhật Database (Migrations)
Đảm bảo bạn đã chạy tất cả các file SQL trong thư mục `supabase/migrations` lên Production Database thông qua **SQL Editor**.

---

## 2. Deploy lên Vercel

### Bước 1: Push code lên GitHub
1.  Tạo một Repository mới trên GitHub (nên để Private).
2.  Push toàn bộ code của bạn lên GitHub:
    ```bash
    git add .
    git commit -m "chore: ready for deployment"
    git push origin main
    ```

### Bước 2: Import Project vào Vercel
1.  Truy cập [Vercel](https://vercel.com) và đăng nhập.
2.  Chọn **Add New** > **Project**.
3.  Import repository GitHub bạn vừa tạo.

### Bước 3: Cấu hình Biến môi trường (Environment Variables)
Tại mục **Environment Variables**, hãy thêm các biến sau (lấy từ Supabase Dashboard > Settings > API):

-   `NEXT_PUBLIC_SUPABASE_URL`: URL của dự án Supabase.
-   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Anon key của dự án Supabase.
-   `NEXT_PUBLIC_APP_URL`: URL chính thức của app trên Vercel (ví dụ: `https://edutrack-app.vercel.app`).

### Bước 4: Deploy
Nhấn **Deploy**. Vercel sẽ tự động build và cấp phát URL cho bạn.

---

## 3. Checklist sau khi Deploy (Post-Deployment)

- [ ] **Auth**: Thử đăng ký tài khoản mới và đăng nhập lại.
- [ ] **Data**: Thử tạo một Task và F5 trang xem dữ liệu có được lưu không.
- [ ] **Mentor Connection**: Thử gửi lời mời giữa 2 tài khoản trên môi trường web.
- [ ] **Notifications**: Kiểm tra xem thông báo có xuất hiện khi có hoạt động mới không.
- [ ] **Mobile Layout**: Mở app bằng điện thoại thật để kiểm tra độ mượt của thanh điều hướng dưới cùng.

---

## 4. Các lỗi thường gặp (Troubleshooting)

| Lỗi | Nguyên nhân | Cách xử lý |
| :--- | :--- | :--- |
| **Login không chuyển hướng** | Site URL trong Supabase chưa đúng | Kiểm tra lại URL Configuration trong Supabase |
| **Lỗi 500 khi fetch data** | Thiếu biến môi trường hoặc RLS chặn | Kiểm tra Environment Variables trên Vercel và chạy lại SQL migrations |
| **Lỗi Hydration** | Sai lệch thời gian giữa Server và Client | Đảm bảo các hàm định dạng ngày tháng dùng `Locale` cố định |

---
*EduTrack Deployment Guide - Phase 9 Edition*
