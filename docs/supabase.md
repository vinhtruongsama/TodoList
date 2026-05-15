# Hướng dẫn thiết lập Supabase

Tài liệu này hướng dẫn cách tạo project và lấy các thông số cần thiết để kết nối ứng dụng với Supabase.

## 1. Tạo Project mới
1. Truy cập [Supabase Dashboard](https://supabase.com/dashboard).
2. Nhấn **New Project**.
3. Chọn Organization và điền tên dự án (ví dụ: `edu-tracker`).
4. Thiết lập **Database Password** (Hãy lưu lại mật khẩu này).
5. Chọn Region gần bạn nhất (ví dụ: `Singapore` hoặc `Tokyo`).
6. Nhấn **Create new project**.

## 2. Lấy API Keys
Sau khi project được tạo xong:
1. Vào mục **Project Settings** (biểu tượng bánh răng ở dưới cùng bên trái).
2. Chọn mục **API**.
3. Tại phần **Project API keys**, bạn sẽ thấy 2 thông số:
    - **Project URL**: Ví dụ `https://abcxyz.supabase.co`
    - **anon (public)**: Một dãy ký tự dài.

## 3. Cấu hình ứng dụng
1. Tạo file `.env.local` tại thư mục gốc của dự án (nếu chưa có).
2. Copy các giá trị vào file như sau:
    ```bash
    NEXT_PUBLIC_SUPABASE_URL=Dán_Project_URL_vào_đây
    NEXT_PUBLIC_SUPABASE_ANON_KEY=Dán_anon_public_key_vào_đây
    ```

## 4. Lưu ý quan trọng
- **KHÔNG** bao giờ chia sẻ mã `service_role` key cho bất kỳ ai hoặc đẩy lên GitHub.
- Các file `.env.local` đã được cấu hình trong `.gitignore` để không bị lộ lên mạng.
