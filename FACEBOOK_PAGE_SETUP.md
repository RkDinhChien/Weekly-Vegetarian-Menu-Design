# Hướng dẫn cấu hình Facebook Page ID cho Messenger

## Cách lấy Facebook Page ID

### Cách 1: Từ About của Page

1. Vào trang Facebook Page của Bếp Chay Dì Muộn
2. Click vào **About** (Giới thiệu)
3. Kéo xuống phần **More Info**, tìm **Page ID**
4. Copy ID (dạng số)

### Cách 2: Từ URL của Page

1. Vào trang Facebook Page
2. Nhìn vào URL trên thanh địa chỉ:
   - Nếu URL dạng: `facebook.com/YourPageName` → Page ID là `YourPageName`
   - Nếu URL dạng: `facebook.com/profile.php?id=123456789` → Page ID là `123456789`

### Cách 3: Dùng Graph API Explorer

1. Vào https://developers.facebook.com/tools/explorer/
2. Nhập: `?id=https://facebook.com/YourPageName&fields=id`
3. Nhấn Submit → lấy ID trả về

## Cấu hình trong code

Mở file `src/components/CustomerView.tsx` và tìm dòng:

```typescript
const facebookPageId = "YOUR_FACEBOOK_PAGE_ID"; // Cập nhật Page ID của Bếp Chay Dì Muộn
```

Thay `YOUR_FACEBOOK_PAGE_ID` bằng Page ID thực của fanpage.

### Ví dụ:

```typescript
// Nếu Page ID là số
const facebookPageId = "123456789012345";

// Hoặc nếu là username
const facebookPageId = "bepchaydimuon";
```

## Test Messenger Link

Sau khi cập nhật, link Messenger sẽ có dạng:

- `https://m.me/123456789012345` (nếu dùng ID số)
- `https://m.me/bepchaydimuon` (nếu dùng username)

Copy link vào trình duyệt để test xem có mở đúng chat với fanpage không.

## Lưu ý

1. **Page phải công khai**: Đảm bảo fanpage ở chế độ công khai (Published)
2. **Messenger phải bật**: Vào Page Settings → Messaging → bật "People can contact my Page privately"
3. **Mobile friendly**: Link `m.me` hoạt động tốt nhất trên điện thoại
4. **Desktop**: Trên máy tính sẽ mở Messenger web hoặc app Messenger

## Khắc phục sự cố

- **Link không mở**: Kiểm tra lại Page ID
- **Không gửi được tin nhắn**: Kiểm tra cài đặt Messenger của Page
- **Tin nhắn không tự động điền**: Người dùng cần dán (Ctrl+V) thủ công

## Tùy chọn bổ sung: Zalo Official Account

Nếu muốn dùng Zalo OA thay vì số điện thoại cá nhân:

1. Đăng ký Zalo Official Account tại https://oa.zalo.me/
2. Lấy OA ID (dạng số hoặc username)
3. Thay trong code:

```typescript
const zaloOAId = "YOUR_ZALO_OA_ID";
window.open(`https://zalo.me/${zaloOAId}`, "_blank");
```
