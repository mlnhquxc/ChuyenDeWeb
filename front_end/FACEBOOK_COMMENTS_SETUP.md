# Hướng dẫn Khung Bình luận Facebook

## Tổng quan
Khung bình luận Facebook đã được tích hợp vào trang chi tiết sản phẩm và được cải tiến để hoạt động ổn định khi chuyển đổi giữa các sản phẩm khác nhau.

## Cách hoạt động

### 1. URL động
- Mỗi sản phẩm có một URL duy nhất: `https://yourdomain.com/product/{productId}`
- Facebook Comments plugin sử dụng URL này để hiển thị bình luận riêng biệt cho từng sản phẩm

### 2. Component FacebookComments
- Component được cải tiến để xử lý việc thay đổi URL
- Tự động xóa bình luận cũ và tạo bình luận mới khi chuyển sang sản phẩm khác
- Có loading state và error handling

### 3. Key prop
- Sử dụng `key={product.id}` để đảm bảo React re-render component khi chuyển sản phẩm

## Cấu hình

### Facebook SDK
Đã được tích hợp trong `index.html`:
```html
<div id="fb-root"></div>
<script async defer crossorigin="anonymous" src="https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v23.0&appId=1377812466674855"></script>
```

### Sử dụng trong ProductDetail
```jsx
<FacebookComments 
  key={product.id}
  url={`${window.location.origin}/product/${product.id}`}
  width="100%"
  numPosts={5}
/>
```

## Tính năng

- ✅ Hiển thị bình luận riêng biệt cho từng sản phẩm
- ✅ Tự động cập nhật khi chuyển sang sản phẩm khác
- ✅ Loading state khi đang tải
- ✅ Error handling khi có lỗi
- ✅ Responsive design
- ✅ Dark mode support

## Troubleshooting

### Khung bình luận không hiển thị
1. Kiểm tra kết nối internet
2. Đảm bảo Facebook SDK đã load thành công
3. Kiểm tra console để xem có lỗi JavaScript không

### Bình luận không cập nhật khi chuyển sản phẩm
1. Đảm bảo URL đã thay đổi đúng
2. Kiểm tra xem component có được re-render không
3. Thử refresh trang

## Lưu ý
- Facebook Comments yêu cầu domain được cấu hình trong Facebook App
- Cần có Facebook App ID hợp lệ
- Bình luận sẽ được lưu trữ trên Facebook, không phải trong database của ứng dụng 