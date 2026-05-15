# Dự án Quản lý Học tập & Công việc (Student-Mentor)

Tài liệu này chứa các hướng dẫn và quy định về phát triển dự án.

## Cấu trúc thư mục (Folder Structure)

- `src/app`: Định nghĩa các trang và router.
- `src/components`: Các thành phần giao diện.
    - `ui`: Thành phần cơ bản từ shadcn/ui.
    - `shared`: Thành phần dùng chung giữa các trang.
    - `layout`: Bố cục chung (Header, Footer, Nav).
- `src/hooks`: Các logic React Hook tùy chỉnh.
- `src/lib`: Cấu hình thư viện bên thứ 3 (Supabase, Utils).
- `src/services`: Các hàm xử lý dữ liệu với Database.
- `src/types`: Định nghĩa kiểu dữ liệu TypeScript.
- `src/locales`: File ngôn ngữ đa quốc gia.
- `docs`: Tài liệu hướng dẫn.

## Công nghệ sử dụng
- Next.js 15+
- Tailwind CSS v4
- shadcn/ui
- Supabase
- TypeScript
