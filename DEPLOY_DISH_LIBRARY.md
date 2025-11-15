# Hướng dẫn Deploy Edge Function với Dish Library Endpoints

## Vấn đề hiện tại
- Frontend đã có code Dish Library (DishLibrary.tsx, AddDishToMenu.tsx)
- Backend endpoints mới đã được thêm vào `src/supabase/functions/server/index.tsx`
- **NHƯNG** Edge Function trên Supabase chưa được cập nhật với code mới

## Cách Deploy (2 phương pháp)

### Phương pháp 1: Qua Supabase Dashboard (Dễ nhất)

1. Truy cập: https://supabase.com/dashboard/project/vwnmtqibjstylwnzkxha/functions
2. Click vào function **make-server-49570ec2**
3. Click nút **Edit**
4. Copy TOÀN BỘ code từ file `src/supabase/functions/server/index.tsx`
5. Paste vào editor
6. Click **Deploy** ở góc phải trên

### Phương pháp 2: Dùng Supabase CLI (Nếu đã cài)

```bash
# 1. Login (nếu chưa)
npx supabase login

# 2. Link project
npx supabase link --project-ref vwnmtqibjstylwnzkxha

# 3. Deploy function
npx supabase functions deploy make-server-49570ec2
```

## Các Endpoint Mới Đã Thêm

### Dish Library
- `GET /make-server-49570ec2/dishes` - Lấy tất cả món
- `GET /make-server-49570ec2/dishes/category/:category` - Lọc theo loại
- `POST /make-server-49570ec2/dishes` - Thêm món mới
- `PUT /make-server-49570ec2/dishes/:id` - Cập nhật món
- `DELETE /make-server-49570ec2/dishes/:id` - Xóa món

## Kiểm tra sau khi Deploy

1. Vào Admin Portal → Tab "Thư Viện Món"
2. Thử thêm 1 món mới
3. Nếu thành công → OK
4. Nếu lỗi → Mở Console (F12) và gửi lỗi cho tôi

## Code đã thêm (lines 260-360 trong index.tsx)

```typescript
// ============ DISH LIBRARY ENDPOINTS ============

// Get all dishes from library
app.get("/make-server-49570ec2/dishes", async (c) => {
  try {
    const dishes = await kv.getByPrefix("dish:");
    dishes.sort(
      (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return c.json({ success: true, data: dishes });
  } catch (error) {
    console.error("Error fetching dishes:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ... và 4 endpoints khác
```

## Lưu ý
- Sau khi deploy, có thể phải đợi 1-2 phút để function active
- Test bằng cách vào tab "Thư Viện Món" và thêm món mới
