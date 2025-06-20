# Hướng dẫn Setup Cloudinary

## 1. Tạo tài khoản Cloudinary

1. Truy cập [https://cloudinary.com](https://cloudinary.com)
2. Đăng ký tài khoản miễn phí
3. Xác thực email

## 2. Lấy thông tin cấu hình

Sau khi đăng nhập, vào Dashboard và copy các thông tin sau:

- **Cloud Name**: Tên cloud của bạn
- **API Key**: Khóa API
- **API Secret**: Khóa bí mật

## 3. Cấu hình Environment Variables

### Cách 1: Sử dụng Environment Variables (Khuyến nghị)

```bash
export CLOUDINARY_CLOUD_NAME=your-cloud-name
export CLOUDINARY_API_KEY=your-api-key
export CLOUDINARY_API_SECRET=your-api-secret
export FILE_UPLOAD_STRATEGY=hybrid
```

### Cách 2: Cập nhật application.properties

```properties
cloudinary.cloud-name=your-cloud-name
cloudinary.api-key=your-api-key
cloudinary.api-secret=your-api-secret
file.upload.strategy=hybrid
```

## 4. Các chiến lược upload

### `hybrid` (Mặc định - Khuyến nghị)
- Upload lên Cloudinary trước
- Tạo backup local
- Nếu Cloudinary fail thì fallback về local

### `cloudinary`
- Chỉ upload lên Cloudinary
- Nhanh nhất, tiết kiệm storage server

### `local`
- Chỉ lưu local
- Phù hợp cho development

## 5. Tính năng đã implement

### Avatar Upload
- ✅ Tự động resize 300x300px
- ✅ Tối ưu chất lượng
- ✅ Chuyển đổi sang WebP
- ✅ Crop theo khuôn mặt
- ✅ Xóa avatar cũ khi upload mới

### Product Images (Sẵn sàng sử dụng)
- ✅ Resize 800x600px
- ✅ Tối ưu chất lượng
- ✅ Chuyển đổi sang WebP
- ✅ Upload multiple images
- ✅ Xóa images

## 6. Cấu trúc thư mục trên Cloudinary

```
tech_shop/
├── avatars/
│   └── username_timestamp.webp
└── products/
    └── productId_timestamp.webp
```

## 7. Giới hạn Free Tier

- **Storage**: 25GB
- **Bandwidth**: 25GB/tháng
- **Transformations**: 25,000/tháng

## 8. Test Upload

1. Khởi động backend
2. Đăng nhập vào ứng dụng
3. Vào Profile và upload avatar
4. Kiểm tra:
   - Ảnh hiển thị đúng
   - URL là Cloudinary (https://res.cloudinary.com/...)
   - Có backup local trong thư mục uploads/

## 9. Troubleshooting

### Lỗi "Invalid API credentials"
- Kiểm tra lại CLOUD_NAME, API_KEY, API_SECRET
- Đảm bảo không có khoảng trắng thừa

### Upload chậm
- Kiểm tra kết nối internet
- Thử đổi strategy về "local" để test

### Ảnh không hiển thị
- Kiểm tra CORS settings trên Cloudinary
- Kiểm tra URL trong database

## 10. Bảo mật

- ⚠️ **KHÔNG** commit API credentials vào Git
- ✅ Sử dụng Environment Variables
- ✅ Restrict API permissions nếu cần
- ✅ Enable signed URLs cho production