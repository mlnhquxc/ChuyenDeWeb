# VnPay Integration Testing Guide

## Tổng quan tích hợp đã hoàn thành

Dự án đã được tích hợp thành công với VnPay bao gồm:

### Backend (Spring Boot)
✅ **VnpayConfig** - Configuration class với @ConfigurationProperties
✅ **Payment Entity** - Lưu trữ thông tin giao dịch
✅ **PaymentRepository** - JPA Repository
✅ **PaymentService & PaymentServiceImpl** - Business logic
✅ **VnPayController** - REST API endpoints
✅ **Database Schema** - Bảng payments đã được thêm

### Frontend (React)
✅ **paymentService.js** - Service gọi API
✅ **Payment.jsx** - Tích hợp VnPay vào checkout
✅ **PaymentResult.jsx** - Xử lý kết quả thanh toán
✅ **PaymentTest.jsx** - Component test tích hợp
✅ **Routes** - Đã thêm routes cho payment

## API Endpoints đã tạo

### 1. Tạo Payment URL
```
POST /payment/create
GET /payment/vnpay (legacy)
```

### 2. Xử lý callback từ VnPay
```
GET /payment/return
```

### 3. Kiểm tra trạng thái
```
GET /payment/status/{txnRef}
GET /payment/user/{userId}
```

## Cách test tích hợp

### 1. Test Backend API
```bash
# Start backend server
cd back_end
./mvnw spring-boot:run

# Test create payment
curl -X POST http://localhost:8080/payment/create \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": null,
    "amount": 10000,
    "orderInfo": "Test payment",
    "userId": 1
  }'
```

### 2. Test Frontend
```bash
# Start frontend
cd front_end
npm run dev

# Truy cập test page
http://localhost:5173/payment/test
```

### 3. Test Flow hoàn chỉnh
1. Truy cập `/payment/test`
2. Nhập số tiền (tối thiểu 1,000 VND)
3. Click "Test Payment API"
4. Được redirect đến VnPay sandbox
5. Sử dụng thông tin test:
   - Thẻ: 9704198526191432198
   - Tên: NGUYEN VAN A
   - Ngày hết hạn: 07/15
   - OTP: 123456
6. Hoàn thành thanh toán
7. Được redirect về `/payment/result`

### 4. Test trong Checkout thực tế
1. Thêm sản phẩm vào giỏ hàng
2. Đi đến trang checkout `/payment`
3. Chọn "Thanh toán qua VNPay"
4. Hoàn thành form thông tin
5. Submit để được redirect đến VnPay

## Configuration hiện tại

### Backend (application.properties)
```properties
vnpay.pay-url=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
vnpay.return-url=http://localhost:8080/payment/return
vnpay.tmn-code=CO15G38U
vnpay.hash-secret=E8D8CZ8PITHCQQBZQGMR11GXLOUXSC5K
vnpay.api-url=https://sandbox.vnpayment.vn/merchant_webapi/api/transaction
```

### Frontend URLs
- Test page: `http://localhost:5173/payment/test`
- Checkout: `http://localhost:5173/payment`
- Result: `http://localhost:5173/payment/result`

## Database Schema

Bảng `payments` đã được tạo với các trường:
- `id` - Primary key
- `txn_ref` - Mã giao dịch VnPay (unique)
- `order_id` - Liên kết với đơn hàng
- `amount` - Số tiền (VND)
- `status` - Trạng thái (PENDING, SUCCESS, FAILED, CANCELLED)
- `user_id` - ID người dùng
- Các trường khác để lưu thông tin từ VnPay

## Troubleshooting

### Lỗi thường gặp:

1. **Backend không start được**
   - Kiểm tra MySQL đã chạy chưa
   - Kiểm tra connection string trong application.properties

2. **Frontend không gọi được API**
   - Kiểm tra CORS configuration
   - Kiểm tra backend đã chạy trên port 8080

3. **VnPay redirect không hoạt động**
   - Kiểm tra return URL trong configuration
   - Đảm bảo backend accessible từ internet (nếu test production)

4. **Payment không được lưu**
   - Kiểm tra database schema đã được tạo
   - Kiểm tra logs backend

## Next Steps

### Để chuyển sang Production:

1. **Đăng ký VnPay Merchant**
   - Truy cập https://vnpay.vn
   - Đăng ký tài khoản doanh nghiệp
   - Lấy TMN Code và Hash Secret thật

2. **Cập nhật Configuration**
   ```properties
   vnpay.pay-url=https://vnpayment.vn/paymentv2/vpcpay.html
   vnpay.return-url=https://yourdomain.com/payment/return
   vnpay.tmn-code=YOUR_PRODUCTION_TMN_CODE
   vnpay.hash-secret=YOUR_PRODUCTION_HASH_SECRET
   ```

3. **Security**
   - Sử dụng HTTPS
   - Không commit credentials vào code
   - Sử dụng environment variables

4. **Monitoring**
   - Log tất cả giao dịch
   - Monitor success rate
   - Set up alerts cho failed payments

## Support

Nếu gặp vấn đề:
1. Kiểm tra logs backend
2. Kiểm tra network requests trong browser
3. Verify configuration
4. Test với VnPay sandbox trước

VnPay Support:
- Email: support@vnpay.vn
- Hotline: 1900 55 55 77