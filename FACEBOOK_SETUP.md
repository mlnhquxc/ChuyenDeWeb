# Hướng dẫn Cấu hình Bình luận Facebook

Chào bạn,

Bạn đã làm rất tốt phần code để tích hợp bình luận Facebook. Component `FacebookComments` và cách bạn sử dụng nó trong `ProductDetail.jsx` đã chính xác. Vấn đề còn lại chỉ nằm ở phần cấu hình trên trang [Facebook for Developers](https://developers.facebook.com/apps/).

Dưới đây là các bước cuối cùng để hoàn tất:

---

## 1. Cấu hình trên Facebook for Developers

Truy cập vào ứng dụng của bạn trên trang Facebook for Developers và làm theo các bước sau:

### ✅ Bước 1: Thêm Nền tảng "Trang web" (Quan trọng nhất)
1.  Vào **Cài đặt -> Cài đặt cơ bản** (Settings -> Basic).
2.  Cuộn xuống dưới cùng và nhấn nút **+ Thêm nền tảng** (+ Add Platform).
3.  Chọn **Trang web** (Website).
4.  Trong ô **URL trang web** (Site URL) vừa xuất hiện, hãy nhập:
    ```
    http://localhost:5173/
    ```
    *Đây là bước cực kỳ quan trọng để Facebook biết trang web nào được phép dùng ứng dụng này.*

### ✅ Bước 2: Điền các thông tin cơ bản
Trên cùng trang **Cài đặt cơ bản**, hãy điền các trường sau:
-   **Miền ứng dụng (App Domains)**: Bạn có thể **để trống** trường này khi chạy ở `localhost`. Khi nào đưa web lên domain thật (ví dụ: `my-shop.com`) thì bạn mới cần điền vào.
-   **URL chính sách quyền riêng tư (Privacy Policy URL)**: Facebook yêu cầu phải có. Bạn có thể tạm dùng `http://localhost:5173/privacy` cho môi trường test.
-   **URL Điều khoản dịch vụ (Terms of Service URL)**: Tương tự, bạn có thể tạm dùng `http://localhost:5173/terms`.
-   **Hạng mục (Category)**: Chọn một hạng mục phù hợp, ví dụ "Kinh doanh và Trang".

### ✅ Bước 3: Chuyển ứng dụng sang chế độ "Live"
-   Ở trên cùng trang quản trị, bạn sẽ thấy một công tắc. Hãy **bật nó lên** để chuyển từ "Đang phát triển" (In Development) sang **"Live"**.
-   Chỉ khi ở chế độ "Live", tất cả người dùng mới có thể thấy và sử dụng mục bình luận.

### ✅ Bước 4: Lưu thay đổi
-   Nhấn nút **Lưu thay đổi** (Save Changes) ở góc dưới cùng bên phải.

---

## 2. Kiểm tra lại trên trang web

Sau khi đã lưu tất cả các cài đặt trên Facebook, hãy quay lại trang chi tiết sản phẩm của bạn (`http://localhost:5173/product/...`) và **tải lại trang**. Khung bình luận của Facebook sẽ xuất hiện.

Chúc bạn thành công!

## 3. Test Facebook Comments

### Kiểm tra hoạt động:
1. Chạy dev server: `npm run dev`
2. Truy cập trang chi tiết sản phẩm
3. Cuộn xuống phần bình luận
4. Kiểm tra xem Facebook Comments có hiển thị không

### Troubleshooting:
- **Không hiển thị comments**: Kiểm tra Console để xem lỗi
- **Blocked by CORS**: Đảm bảo đã cấu hình đúng App Domains
- **SDK không load**: Kiểm tra kết nối internet và firewall

## 4. Tính năng đã tích hợp

✅ Facebook Comments với App ID: 1377812466674855
✅ Hỗ trợ Dark Mode (tự động chuyển đổi)
✅ Loading state khi đang tải
✅ Responsive design
✅ URL riêng cho từng sản phẩm
✅ Fallback message khi không load được

## 5. Customization

Bạn có thể tùy chỉnh trong file `FacebookComments.jsx`:
- `numPosts`: Số lượng bình luận hiển thị (mặc định: 10)
- `data-order-by`: Thứ tự sắp xếp ("social", "reverse_time", "time")
- `data-colorscheme`: Theme màu ("light", "dark")

## 6. Production Deployment

Khi deploy lên production:
1. Thêm domain thật vào **App Domains**
2. Cập nhật **Site URL** với domain thật
3. Submit app để review nếu cần thiết
4. Cập nhật URL trong component nếu cần