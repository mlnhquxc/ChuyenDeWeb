# Hướng dẫn cập nhật code

## Cập nhật code từ nhánh khác

### Cách 1: Sử dụng merge
```bash
# 1. Chuyển về nhánh chính và cập nhật
git checkout main
git pull origin main

# 2. Chuyển sang nhánh của bạn
git checkout thanh

# 3. Merge code từ nhánh quoc
git merge quoc

# 4. Nếu có conflict, giải quyết conflict và commit
git add .
git commit -m "Resolve merge conflicts"

# 5. Push code lên GitHub
git push origin thanh
```

### Cách 2: Sử dụng pull trực tiếp
```bash
# 1. Chuyển sang nhánh của bạn
git checkout thanh

# 2. Pull code từ nhánh quoc
git pull origin quoc

# 3. Nếu có conflict, giải quyết conflict và commit
git add .
git commit -m "Resolve merge conflicts"

# 4. Push code lên GitHub
git push origin thanh
```

## Giải quyết conflict

Khi có conflict, Git sẽ đánh dấu các phần code bị conflict trong file. Bạn cần:

1. Mở các file có conflict
2. Tìm các phần được đánh dấu (<<<<<<< HEAD, =======, >>>>>>> quoc)
3. Chọn phiên bản code phù hợp hoặc kết hợp cả hai
4. Xóa các dấu đánh dấu conflict
5. Lưu file
6. Thêm file vào staging area (git add)
7. Commit các thay đổi

## Lưu ý
- Luôn backup code trước khi merge
- Kiểm tra kỹ các thay đổi sau khi merge
- Test lại các chức năng sau khi merge
- Nếu không chắc chắn, có thể tạo nhánh mới để test merge trước 