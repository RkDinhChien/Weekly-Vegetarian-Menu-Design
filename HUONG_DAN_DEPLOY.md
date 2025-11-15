# HƯỚNG DẪN DEPLOY EDGE FUNCTION

## Bước 1: Tìm đúng Edge Function

Bạn đang ở function SAI: **quick-endpoint**  
Cần vào function ĐÚNG: **make-server-49570ec2**

### Cách tìm:

1. Vào: https://supabase.com/dashboard/project/vwnmtqibjstylwnzkxha/functions
2. Tìm function tên **make-server-49570ec2** (KHÔNG phải quick-endpoint)
3. Click vào function đó

## Bước 2: Mở Editor

1. Trong trang function **make-server-49570ec2**
2. Click tab **"Code"** (ở giữa Overview, Invocations, Logs, Code, Details)
3. Hoặc click nút **"Edit"** nếu có

## Bước 3: Copy Code Mới

1. Mở file: `src/supabase/functions/server/index.tsx` trong VS Code
2. Bấm Ctrl+A để chọn TẤT CẢ code
3. Bấm Ctrl+C để copy

## Bước 4: Paste và Deploy

1. Quay lại Supabase Dashboard
2. **XÓA HẾT** code cũ trong editor
3. Bấm Ctrl+V để paste code mới vào
4. Click nút **"Deploy"** (góc phải trên, màu xanh)
5. Đợi deploy xong (khoảng 30 giây - 1 phút)

## Bước 5: Kiểm Tra

Sau khi deploy xong:

1. Mở app tại http://localhost:3000
2. Vào Admin Portal
3. Tab **"Nhóm Món"** (tab đầu tiên, màu tím) → Thêm nhóm món mới
4. Tab **"Thư Viện Món"** (tab thứ 2, màu xanh lá) → Thêm món mới

## Nếu Không Tìm Thấy Function make-server-49570ec2

Có thể function có tên khác. Check trong code:

### Trong file `src/utils/supabase/info.tsx`:

Xem projectId là gì:
```typescript
export const projectId = "vwnmtqibjstylwnzkxha";
```

### Trong các component, URL thường là:

```
https://vwnmtqibjstylwnzkxha.supabase.co/functions/v1/make-server-49570ec2/...
```

Phần `make-server-49570ec2` là tên function cần tìm.

## Hoặc Deploy Bằng CLI (Nếu Có Supabase CLI)

```bash
# 1. Login
npx supabase login

# 2. Link project
npx supabase link --project-ref vwnmtqibjstylwnzkxha

# 3. Deploy
npx supabase functions deploy make-server-49570ec2 --project-ref vwnmtqibjstylwnzkxha
```

## Screenshot Hướng Dẫn

### 1. Trang Functions - Tìm make-server-49570ec2
- Danh sách functions nằm bên trái
- Tìm function có tên **make-server-49570ec2**

### 2. Tab Code
- Click vào function
- Click tab "Code"
- Sẽ thấy editor với code hiện tại

### 3. Edit & Deploy
- Xóa code cũ
- Paste code mới từ `src/supabase/functions/server/index.tsx`
- Click "Deploy" button

## Lưu Ý Quan Trọng

⚠️ **PHẢI deploy function thì mới có các endpoint mới:**
- `/categories` - Quản lý nhóm món
- `/dishes` - Quản lý thư viện món

⚠️ **Không deploy = các tính năng mới KHÔNG hoạt động!**

## Nếu Vẫn Không Deploy Được

Chụp màn hình và gửi cho tôi:
1. Trang Functions (danh sách tất cả functions)
2. Console trong browser (F12) khi thử thêm món
3. Báo lỗi cụ thể nếu có
