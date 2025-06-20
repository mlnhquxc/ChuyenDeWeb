# VnPay Integration Guide

## Tổng quan
Dự án đã được tích hợp với VnPay để xử lý thanh toán trực tuyến. Tích hợp này bao gồm:

- Backend API để tạo payment URL và xử lý callback
- Frontend service để gọi API và redirect
- Database để lưu trữ thông tin thanh toán
- UI components để hiển thị kết quả thanh toán

## Cấu hình Backend

### 1. Application Properties
```properties
# VnPay Configuration
vnpay.pay-url=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
vnpay.return-url=${VNPAY_RETURN_URL:http://localhost:8080/payment/return}
vnpay.tmn-code=${VNPAY_TMN_CODE:CO15G38U}
vnpay.hash-secret=${VNPAY_HASH_SECRET:E8D8CZ8PITHCQQBZQGMR11GXLOUXSC5K}
vnpay.api-url=https://sandbox.vnpayment.vn/merchant_webapi/api/transaction
```

### 2. Environment Variables (Production)
```bash
VNPAY_RETURN_URL=https://yourdomain.com/payment/return
VNPAY_TMN_CODE=your_merchant_code
VNPAY_HASH_SECRET=your_hash_secret
```

## API Endpoints

### 1. Tạo Payment URL
```
POST /payment/create
Content-Type: application/json

{
  "orderId": 123,
  "amount": 100000,
  "orderInfo": "Thanh toán đơn hàng #123",
  "userId": 1
}
```

### 2. Legacy Payment URL (GET)
```
GET /payment/vnpay?amount=100000&orderId=123&userId=1
```

### 3. Payment Return (Callback từ VnPay)
```
GET /payment/return?vnp_Amount=...&vnp_TxnRef=...&vnp_ResponseCode=...
```

### 4. Kiểm tra trạng thái thanh toán
```
GET /payment/status/{txnRef}
```

### 5. Lấy danh sách thanh toán của user
```
GET /payment/user/{userId}
```

## Frontend Integration

### 1. Payment Service
```javascript
import paymentService from '../services/paymentService';

// Tạo payment
const paymentData = {
  orderId: 123,
  amount: 100000,
  orderInfo: "Thanh toán đơn hàng",
  userId: 1
};

const response = await paymentService.createPayment(paymentData);
if (response.result?.paymentUrl) {
  paymentService.redirectToVnPay(response.result.paymentUrl);
}
```

### 2. Payment Result Page
- URL: `/payment/result`
- Xử lý kết quả từ VnPay callback
- Hiển thị thông tin giao dịch
- Redirect về trang phù hợp

## Database Schema

### Bảng payments
```sql
CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    txn_ref VARCHAR(50) UNIQUE NOT NULL,
    order_id BIGINT,
    amount BIGINT NOT NULL,
    order_info TEXT,
    payment_method VARCHAR(50),
    bank_code VARCHAR(20),
    transaction_no VARCHAR(50),
    response_code VARCHAR(10),
    transaction_status VARCHAR(10),
    status ENUM('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED'),
    secure_hash VARCHAR(500),
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    payment_date DATETIME,
    user_id BIGINT
);
```

## Testing

### 1. Test Component
- URL: `/payment/test`
- Component: `PaymentTest.jsx`
- Cho phép test nhanh tích hợp VnPay

### 2. Thông tin test VnPay Sandbox
```
Thẻ test: 9704198526191432198
Tên: NGUYEN VAN A
Ngày hết hạn: 07/15
Mật khẩu OTP: 123456
```

### 3. Test Flow
1. Truy cập `/payment/test`
2. Nhập số tiền (tối thiểu 1,000 VND)
3. Click "Test Payment API"
4. Được redirect đến VnPay sandbox
5. Nhập thông tin thẻ test
6. Hoàn thành thanh toán
7. Được redirect về `/payment/result`

## Production Setup

### 1. Đăng ký VnPay Merchant
1. Truy cập https://vnpay.vn
2. Đăng ký tài khoản merchant
3. Lấy TMN Code và Hash Secret

### 2. Cập nhật Configuration
```properties
vnpay.pay-url=https://vnpayment.vn/paymentv2/vpcpay.html
vnpay.return-url=https://yourdomain.com/payment/return
vnpay.tmn-code=YOUR_PRODUCTION_TMN_CODE
vnpay.hash-secret=YOUR_PRODUCTION_HASH_SECRET
vnpay.api-url=https://vnpayment.vn/merchant_webapi/api/transaction
```

### 3. SSL Certificate
- Đảm bảo website có SSL certificate
- VnPay yêu cầu HTTPS cho production

## Security Notes

### 1. Hash Secret
- Không commit hash secret vào code
- Sử dụng environment variables
- Rotate secret định kỳ

### 2. Signature Validation
- Luôn validate signature từ VnPay
- Kiểm tra response code và transaction status
- Log tất cả giao dịch để audit

### 3. Amount Validation
- Validate amount trước khi tạo payment
- Kiểm tra amount trong callback
- Đảm bảo không có manipulation

## Troubleshooting

### 1. Payment URL không tạo được
- Kiểm tra TMN Code và Hash Secret
- Verify network connectivity
- Check application logs

### 2. Callback không hoạt động
- Kiểm tra return URL có accessible không
- Verify signature validation
- Check firewall settings

### 3. Payment status không cập nhật
- Kiểm tra database connection
- Verify transaction reference
- Check payment processing logic

## Monitoring

### 1. Logs cần theo dõi
- Payment creation requests
- VnPay callbacks
- Signature validation failures
- Database errors

### 2. Metrics quan trọng
- Payment success rate
- Average processing time
- Failed transaction reasons
- User conversion rate

## Support

### VnPay Support
- Email: support@vnpay.vn
- Hotline: 1900 55 55 77
- Documentation: https://sandbox.vnpayment.vn/apis/

### Internal Support
- Check application logs
- Review database records
- Validate configuration
- Test in sandbox environment# VnPay Integration Guide

## Tổng quan
Dự án đã được tích hợp với VnPay để xử lý thanh toán trực tuyến. Tích hợp này bao gồm:

- Backend API để tạo payment URL và xử lý callback
- Frontend service để gọi API và redirect
- Database để lưu trữ thông tin thanh toán
- UI components để hiển thị kết quả thanh toán

## Cấu hình Backend

### 1. Application Properties
```properties
# VnPay Configuration
vnpay.pay-url=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
vnpay.return-url=${VNPAY_RETURN_URL:http://localhost:8080/payment/return}
vnpay.tmn-code=${VNPAY_TMN_CODE:CO15G38U}
vnpay.hash-secret=${VNPAY_HASH_SECRET:E8D8CZ8PITHCQQBZQGMR11GXLOUXSC5K}
vnpay.api-url=https://sandbox.vnpayment.vn/merchant_webapi/api/transaction
```

### 2. Environment Variables (Production)
```bash
VNPAY_RETURN_URL=https://yourdomain.com/payment/return
VNPAY_TMN_CODE=your_merchant_code
VNPAY_HASH_SECRET=your_hash_secret
```

## API Endpoints

### 1. Tạo Payment URL
```
POST /payment/create
Content-Type: application/json

{
  "orderId": 123,
  "amount": 100000,
  "orderInfo": "Thanh toán đơn hàng #123",
  "userId": 1
}
```

### 2. Legacy Payment URL (GET)
```
GET /payment/vnpay?amount=100000&orderId=123&userId=1
```

### 3. Payment Return (Callback từ VnPay)
```
GET /payment/return?vnp_Amount=...&vnp_TxnRef=...&vnp_ResponseCode=...
```

### 4. Kiểm tra trạng thái thanh toán
```
GET /payment/status/{txnRef}
```

### 5. Lấy danh sách thanh toán của user
```
GET /payment/user/{userId}
```

## Frontend Integration

### 1. Payment Service
```javascript
import paymentService from '../services/paymentService';

// Tạo payment
const paymentData = {
  orderId: 123,
  amount: 100000,
  orderInfo: "Thanh toán đơn hàng",
  userId: 1
};

const response = await paymentService.createPayment(paymentData);
if (response.result?.paymentUrl) {
  paymentService.redirectToVnPay(response.result.paymentUrl);
}
```

### 2. Payment Result Page
- URL: `/payment/result`
- Xử lý kết quả từ VnPay callback
- Hiển thị thông tin giao dịch
- Redirect về trang phù hợp

## Database Schema

### Bảng payments
```sql
CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    txn_ref VARCHAR(50) UNIQUE NOT NULL,
    order_id BIGINT,
    amount BIGINT NOT NULL,
    order_info TEXT,
    payment_method VARCHAR(50),
    bank_code VARCHAR(20),
    transaction_no VARCHAR(50),
    response_code VARCHAR(10),
    transaction_status VARCHAR(10),
    status ENUM('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED'),
    secure_hash VARCHAR(500),
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    payment_date DATETIME,
    user_id BIGINT
);
```

## Testing

### 1. Test Component
- URL: `/payment/test`
- Component: `PaymentTest.jsx`
- Cho phép test nhanh tích hợp VnPay

### 2. Thông tin test VnPay Sandbox
```
Thẻ test: 9704198526191432198
Tên: NGUYEN VAN A
Ngày hết hạn: 07/15
Mật khẩu OTP: 123456
```

### 3. Test Flow
1. Truy cập `/payment/test`
2. Nhập số tiền (tối thiểu 1,000 VND)
3. Click "Test Payment API"
4. Được redirect đến VnPay sandbox
5. Nhập thông tin thẻ test
6. Hoàn thành thanh toán
7. Được redirect về `/payment/result`

## Production Setup

### 1. Đăng ký VnPay Merchant
1. Truy cập https://vnpay.vn
2. Đăng ký tài khoản merchant
3. Lấy TMN Code và Hash Secret

### 2. Cập nhật Configuration
```properties
vnpay.pay-url=https://vnpayment.vn/paymentv2/vpcpay.html
vnpay.return-url=https://yourdomain.com/payment/return
vnpay.tmn-code=YOUR_PRODUCTION_TMN_CODE
vnpay.hash-secret=YOUR_PRODUCTION_HASH_SECRET
vnpay.api-url=https://vnpayment.vn/merchant_webapi/api/transaction
```

### 3. SSL Certificate
- Đảm bảo website có SSL certificate
- VnPay yêu cầu HTTPS cho production

## Security Notes

### 1. Hash Secret
- Không commit hash secret vào code
- Sử dụng environment variables
- Rotate secret định kỳ

### 2. Signature Validation
- Luôn validate signature từ VnPay
- Kiểm tra response code và transaction status
- Log tất cả giao dịch để audit

### 3. Amount Validation
- Validate amount trước khi tạo payment
- Kiểm tra amount trong callback
- Đảm bảo không có manipulation

## Troubleshooting

### 1. Payment URL không tạo được
- Kiểm tra TMN Code và Hash Secret
- Verify network connectivity
- Check application logs

### 2. Callback không hoạt động
- Kiểm tra return URL có accessible không
- Verify signature validation
- Check firewall settings

### 3. Payment status không cập nhật
- Kiểm tra database connection
- Verify transaction reference
- Check payment processing logic

## Monitoring

### 1. Logs cần theo dõi
- Payment creation requests
- VnPay callbacks
- Signature validation failures
- Database errors

### 2. Metrics quan trọng
- Payment success rate
- Average processing time
- Failed transaction reasons
- User conversion rate

## Support

### VnPay Support
- Email: support@vnpay.vn
- Hotline: 1900 55 55 77
- Documentation: https://sandbox.vnpayment.vn/apis/

### Internal Support
- Check application logs
- Review database records
- Validate configuration
- Test in sandbox environment# VnPay Integration Guide

## Tổng quan
Dự án đã được tích hợp với VnPay để xử lý thanh toán trực tuyến. Tích hợp này bao gồm:

- Backend API để tạo payment URL và xử lý callback
- Frontend service để gọi API và redirect
- Database để lưu trữ thông tin thanh toán
- UI components để hiển thị kết quả thanh toán

## Cấu hình Backend

### 1. Application Properties
```properties
# VnPay Configuration
vnpay.pay-url=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
vnpay.return-url=${VNPAY_RETURN_URL:http://localhost:8080/payment/return}
vnpay.tmn-code=${VNPAY_TMN_CODE:CO15G38U}
vnpay.hash-secret=${VNPAY_HASH_SECRET:E8D8CZ8PITHCQQBZQGMR11GXLOUXSC5K}
vnpay.api-url=https://sandbox.vnpayment.vn/merchant_webapi/api/transaction
```

### 2. Environment Variables (Production)
```bash
VNPAY_RETURN_URL=https://yourdomain.com/payment/return
VNPAY_TMN_CODE=your_merchant_code
VNPAY_HASH_SECRET=your_hash_secret
```

## API Endpoints

### 1. Tạo Payment URL
```
POST /payment/create
Content-Type: application/json

{
  "orderId": 123,
  "amount": 100000,
  "orderInfo": "Thanh toán đơn hàng #123",
  "userId": 1
}
```

### 2. Legacy Payment URL (GET)
```
GET /payment/vnpay?amount=100000&orderId=123&userId=1
```

### 3. Payment Return (Callback từ VnPay)
```
GET /payment/return?vnp_Amount=...&vnp_TxnRef=...&vnp_ResponseCode=...
```

### 4. Kiểm tra trạng thái thanh toán
```
GET /payment/status/{txnRef}
```

### 5. Lấy danh sách thanh toán của user
```
GET /payment/user/{userId}
```

## Frontend Integration

### 1. Payment Service
```javascript
import paymentService from '../services/paymentService';

// Tạo payment
const paymentData = {
  orderId: 123,
  amount: 100000,
  orderInfo: "Thanh toán đơn hàng",
  userId: 1
};

const response = await paymentService.createPayment(paymentData);
if (response.result?.paymentUrl) {
  paymentService.redirectToVnPay(response.result.paymentUrl);
}
```

### 2. Payment Result Page
- URL: `/payment/result`
- Xử lý kết quả từ VnPay callback
- Hiển thị thông tin giao dịch
- Redirect về trang phù hợp

## Database Schema

### Bảng payments
```sql
CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    txn_ref VARCHAR(50) UNIQUE NOT NULL,
    order_id BIGINT,
    amount BIGINT NOT NULL,
    order_info TEXT,
    payment_method VARCHAR(50),
    bank_code VARCHAR(20),
    transaction_no VARCHAR(50),
    response_code VARCHAR(10),
    transaction_status VARCHAR(10),
    status ENUM('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED'),
    secure_hash VARCHAR(500),
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    payment_date DATETIME,
    user_id BIGINT
);
```

## Testing

### 1. Test Component
- URL: `/payment/test`
- Component: `PaymentTest.jsx`
- Cho phép test nhanh tích hợp VnPay

### 2. Thông tin test VnPay Sandbox
```
Thẻ test: 9704198526191432198
Tên: NGUYEN VAN A
Ngày hết hạn: 07/15
Mật khẩu OTP: 123456
```

### 3. Test Flow
1. Truy cập `/payment/test`
2. Nhập số tiền (tối thiểu 1,000 VND)
3. Click "Test Payment API"
4. Được redirect đến VnPay sandbox
5. Nhập thông tin thẻ test
6. Hoàn thành thanh toán
7. Được redirect về `/payment/result`

## Production Setup

### 1. Đăng ký VnPay Merchant
1. Truy cập https://vnpay.vn
2. Đăng ký tài khoản merchant
3. Lấy TMN Code và Hash Secret

### 2. Cập nhật Configuration
```properties
vnpay.pay-url=https://vnpayment.vn/paymentv2/vpcpay.html
vnpay.return-url=https://yourdomain.com/payment/return
vnpay.tmn-code=YOUR_PRODUCTION_TMN_CODE
vnpay.hash-secret=YOUR_PRODUCTION_HASH_SECRET
vnpay.api-url=https://vnpayment.vn/merchant_webapi/api/transaction
```

### 3. SSL Certificate
- Đảm bảo website có SSL certificate
- VnPay yêu cầu HTTPS cho production

## Security Notes

### 1. Hash Secret
- Không commit hash secret vào code
- Sử dụng environment variables
- Rotate secret định kỳ

### 2. Signature Validation
- Luôn validate signature từ VnPay
- Kiểm tra response code và transaction status
- Log tất cả giao dịch để audit

### 3. Amount Validation
- Validate amount trước khi tạo payment
- Kiểm tra amount trong callback
- Đảm bảo không có manipulation

## Troubleshooting

### 1. Payment URL không tạo được
- Kiểm tra TMN Code và Hash Secret
- Verify network connectivity
- Check application logs

### 2. Callback không hoạt động
- Kiểm tra return URL có accessible không
- Verify signature validation
- Check firewall settings

### 3. Payment status không cập nhật
- Kiểm tra database connection
- Verify transaction reference
- Check payment processing logic

## Monitoring

### 1. Logs cần theo dõi
- Payment creation requests
- VnPay callbacks
- Signature validation failures
- Database errors

### 2. Metrics quan trọng
- Payment success rate
- Average processing time
- Failed transaction reasons
- User conversion rate

## Support

### VnPay Support
- Email: support@vnpay.vn
- Hotline: 1900 55 55 77
- Documentation: https://sandbox.vnpayment.vn/apis/

### Internal Support
- Check application logs
- Review database records
- Validate configuration
- Test in sandbox environment