-- Chạy một lần trên database photo_studio hiện có trước khi dùng chức năng admin phản hồi đánh giá nhân viên.
-- Database mới được tạo từ docs/photo_studio.sql đã có sẵn hai cột này.
ALTER TABLE `employee_reviews`
    ADD COLUMN `admin_reply` TEXT NULL COMMENT 'Phản hồi của quản trị viên',
    ADD COLUMN `admin_replied_at` DATETIME NULL COMMENT 'Thời điểm quản trị viên phản hồi';
