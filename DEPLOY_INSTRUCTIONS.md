# Hướng dẫn Deploy Server Code (CẬP NHẬT MỚI NHẤT)

## ⚡ Thay đổi quan trọng - Đồng bộ hoàn toàn

### ✅ Đã loại bỏ hardcode "Phần nhỏ / Phần lớn"

- Trước: Khách hàng chỉ thấy 2 lựa chọn cố định
- Sau: Hiển thị **chính xác** những gì admin tạo trong "Quản lý món ăn"

### 🔄 Đồng bộ 100% giữa 3 trang

1. **Quản lý món ăn (Admin)**
   - Tạo món: "Phở Cuốn"
   - Thêm size:
     - Phần 1 người - 42,000đ
     - Phần 2 người - 60,000đ

2. **Menu Tuần (Admin)**
   - Thêm "Phở Cuốn" vào Thứ Hai
   - → Hiển thị cả 2 size đúng như lúc tạo

3. **Trang khách hàng**
   - Chọn món "Phở Cuốn"
   - → Dialog hiện đúng 2 lựa chọn:
     - Phần 1 người - 42,000đ
     - Phần 2 người - 60,000đ
   - Khách chọn → Giỏ hàng hiện đúng tên + giá

## Các thay đổi vừa thực hiện

### 1. Thêm hỗ trợ Size Options (Phần ăn)

- Món ăn giờ có thể có nhiều phần (1 người, 2 người, 3 người, v.v.)
- Mỗi phần có giá riêng
- Khi thêm món vào menu, có thể chọn phần cụ thể

### 2. Cập nhật cấu trúc dữ liệu

**DishLibrary (Quản lý món ăn):**

```typescript
{
  id: string,
  name: string,
  description: string,
  basePrice: number,
  category: string,
  imageUrl: string,
  sizeOptions: [
    {
      name: "Phần 1 người",
      servings: 1,
      price: 45000
    },
    {
      name: "Phần 2 người",
      servings: 2,
      price: 85000
    }
  ]
}
```

**MenuItem (Menu theo tuần):**

```typescript
{
  id: string,
  name: string,
  description: string,
  price: number, // giá gốc (fallback)
  category: string,
  imageUrl: string,
  day: string,
  isSpecial: boolean,
  available: boolean,
  dishId: string, // ID món gốc từ dish library
  sizeOptions: [...], // copy từ dish
  selectedSize: { // phần được chọn
    name: "Phần 2 người",
    servings: 2,
    price: 85000
  }
}
```

## Cách Deploy

### Option 1: Deploy qua Supabase Dashboard (Khuyến nghị)

1. Mở Supabase Dashboard: https://supabase.com/dashboard/project/vwnmtqibjstylwnzkxha
2. Vào **Edge Functions** → Chọn function `make-server-49570ec2`
3. Click nút **Edit**
4. Copy toàn bộ nội dung file `src/supabase/functions/server/index.tsx`
5. Paste vào editor và click **Save**
6. Click **Deploy** để deploy version mới

### Option 2: Deploy qua CLI

```bash
# Cài đặt Supabase CLI (nếu chưa có)
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref vwnmtqibjstylwnzkxha

# Deploy function
supabase functions deploy make-server-49570ec2 --project-ref vwnmtqibjstylwnzkxha
```

## Test sau khi deploy

1. Vào **Quản lý món ăn**
2. Tạo món mới với nhiều size option
3. Vào **Menu Tuần**
4. Click **+ Thêm món mới**
5. Chọn món vừa tạo
6. Kiểm tra có hiện phần chọn size không
7. Chọn size và thêm vào menu
8. Kiểm tra xem món trong menu có hiển thị đúng size và giá không

## Lưu ý

- Sau khi deploy, có thể mất vài giây để function update
- Nếu gặp lỗi, kiểm tra logs tại Edge Functions → Logs
- Các món đã tạo trước đó sẽ không có sizeOptions (null/undefined), nhưng vẫn hoạt động bình thường
- UI sẽ tự động detect và chỉ hiển thị chọn size nếu món có sizeOptions

## Files đã thay đổi

1. `src/supabase/functions/server/index.tsx` - Backend API
2. `src/components/AddDishToMenu.tsx` - Dialog thêm món (có chọn size)
3. `src/components/WeeklyMenu.tsx` - Hiển thị menu (show size info)
4. `src/components/DishLibrary.tsx` - Quản lý món (thêm size options)

## Troubleshooting

**Không thấy option chọn size:**

- Đảm bảo món ăn có sizeOptions
- Check console xem có lỗi API không

**Size hiển thị sai giá:**

- Kiểm tra server code đã deploy đúng version
- Clear cache browser (Ctrl + Shift + R)

**Lỗi khi thêm món:**

- Check API logs trong Supabase dashboard
- Đảm bảo selectedSize được gửi đúng format
