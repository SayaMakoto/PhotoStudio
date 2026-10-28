-- Chạy một lần trên database photo_studio hiện có trước khi khởi động backend.
-- Database mới được tạo từ docs/photo_studio.sql đã có cột này.
ALTER TABLE `accessories`
    ADD COLUMN `deleted_at` DATETIME NULL COMMENT 'Thời điểm đưa phụ kiện vào thùng rác';
