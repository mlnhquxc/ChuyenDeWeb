# Luồng Trạng Thái Đơn Hàng (Order Status Flow)

## Tổng Quan
Hệ thống quản lý trạng thái đơn hàng đã được cải tiến để tích hợp chặt chẽ với hệ thống thanh toán VNPay và tự động hóa các quy trình xử lý đơn hàng.

## Các Trạng Thái Đơn Hàng

### 1. PENDING ("Chờ thanh toán")
- **Mô tả**: Đơn hàng vừa được tạo, chờ thanh toán
- **Khi nào**: Khi khách hàng tạo đơn hàng nhưng chưa thanh toán
- **Có thể chuyển sang**: PAID, CANCELLED

### 2. PAID ("Đã thanh toán") 
- **Mô tả**: Đơn hàng đã được thanh toán thành công qua VNPay
- **Khi nào**: Khi VNPay callback thành công (responseCode = "00")
- **Tự động**: Hệ thống tự động cập nhật khi thanh toán thành công
- **Có thể chuyển sang**: CONFIRMED, CANCELLED

### 3. CONFIRMED ("Đã xác nhận")
- **Mô tả**: Đơn hàng đã được xác nhận bởi admin hoặc tự động
- **Khi nào**: Admin xác nhận hoặc tự động sau 10 phút từ khi PAID
- **Có thể chuyển sang**: PROCESSING, CANCELLED

### 4. PROCESSING ("Đang xử lý")
- **Mô tả**: Đơn hàng đang được chuẩn bị, đóng gói
- **Khi nào**: Admin bắt đầu xử lý hoặc tự động sau 30 phút từ khi CONFIRMED
- **Có thể chuyển sang**: SHIPPED, CANCELLED

### 5. SHIPPED ("Đang giao hàng")
- **Mô tả**: Đơn hàng đã được gửi đi, đang trên đường giao
- **Khi nào**: Admin cập nhật khi hàng được gửi đi
- **Có thể chuyển sang**: DELIVERED, RETURNED

### 6. DELIVERED ("Đã giao hàng")
- **Mô tả**: Đơn hàng đã được giao thành công
- **Khi nào**: Admin xác nhận hoặc khách hàng xác nhận nhận hàng
- **Có thể chuyển sang**: RETURNED

### 7. CANCELLED ("Đã hủy")
- **Mô tả**: Đơn hàng đã bị hủy
- **Khi nào**: Khách hàng hoặc admin hủy đơn
- **Có thể chuyển sang**: REFUNDED

### 8. RETURNED ("Đã trả hàng")
- **Mô tả**: Khách hàng đã trả lại hàng
- **Có thể chuyển sang**: REFUNDED

### 9. REFUNDED ("Đã hoàn tiền")
- **Mô tả**: Đã hoàn tiền cho khách hàng
- **Trạng thái cuối**: Không thể chuyển sang trạng thái khác

## Luồng Tự Động

### 1. Thanh Toán VNPay Thành Công
```
PENDING → PAID (tự động khi VNPay callback success)
```

### 2. Tự Động Xác Nhận
```
PAID → CONFIRMED (tự động sau 10 phút)
```

### 3. Tự Động Xử Lý
```
CONFIRMED → PROCESSING (tự động sau 30 phút)
```

## API Endpoints

### Quản Lý Trạng Thái
- `PUT /api/orders/{id}/status?status={status}` - Cập nhật trạng thái tổng quát
- `PUT /api/orders/{id}/confirm` - Xác nhận đơn hàng đã thanh toán
- `PUT /api/orders/{id}/process` - Bắt đầu xử lý đơn hàng
- `PUT /api/orders/{id}/ship?trackingNumber={number}` - Gửi hàng
- `PUT /api/orders/{id}/deliver` - Xác nhận giao hàng thành công

### Thông Tin Trạng Thái
- `GET /api/orders/{id}/status-detail` - Chi tiết trạng thái đơn hàng
- `GET /api/orders/{id}/available-transitions` - Các trạng thái có thể chuyển

## Tính Năng Đặc Biệt

### 1. Validation Chuyển Đổi Trạng Thái
- Hệ thống kiểm tra tính hợp lệ của việc chuyển đổi trạng thái
- Không cho phép chuyển đổi không hợp lệ (ví dụ: PENDING → DELIVERED)

### 2. Tự Động Hóa
- Scheduled tasks chạy định kỳ để tự động chuyển đổi trạng thái
- Auto-confirm: Mỗi 5 phút kiểm tra đơn hàng PAID để chuyển sang CONFIRMED
- Auto-process: Mỗi 10 phút kiểm tra đơn hàng CONFIRMED để chuyển sang PROCESSING

### 3. Tracking Timeline
- Lưu trữ thời gian của từng trạng thái
- Cung cấp timeline đầy đủ cho khách hàng

### 4. Business Logic
- Tự động cập nhật inventory khi đơn hàng được tạo
- Hoàn trả inventory khi đơn hàng bị hủy
- Tích hợp với hệ thống email notification (có thể mở rộng)

## Cấu Hình

### Thời Gian Tự Động
- Auto-confirm: 10 phút sau khi PAID
- Auto-process: 30 phút sau khi CONFIRMED
- Scheduled check: Mỗi 5-10 phút

### Quyền Hạn
- Khách hàng: Có thể hủy đơn hàng ở trạng thái PENDING, PAID, CONFIRMED
- Admin: Có thể chuyển đổi tất cả trạng thái hợp lệ

## Lợi Ích

1. **Tự Động Hóa**: Giảm thiểu can thiệp thủ công
2. **Minh Bạch**: Khách hàng theo dõi được trạng thái đơn hàng
3. **Tích Hợp**: Liên kết chặt chẽ với hệ thống thanh toán
4. **Kiểm Soát**: Validation chặt chẽ các chuyển đổi trạng thái
5. **Mở Rộng**: Dễ dàng thêm trạng thái mới hoặc logic mới

## Ví Dụ Luồng Hoàn Chỉnh

### Trường Hợp Thành Công
```
1. Khách hàng tạo đơn hàng → PENDING
2. Thanh toán VNPay thành công → PAID (tự động)
3. Sau 10 phút → CONFIRMED (tự động)
4. Sau 30 phút → PROCESSING (tự động)
5. Admin gửi hàng → SHIPPED (thủ công)
6. Khách hàng nhận hàng → DELIVERED (thủ công)
```

### Trường Hợp Hủy Đơn
```
1. Khách hàng tạo đơn hàng → PENDING
2. Thanh toán VNPay thành công → PAID (tự động)
3. Khách hàng hủy đơn → CANCELLED (thủ công)
4. Admin hoàn tiền → REFUNDED (thủ công)
```