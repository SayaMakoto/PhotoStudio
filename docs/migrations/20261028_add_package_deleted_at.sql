-- Chạy một lần trên database photo_studio hiện có trước khi khởi động backend.
-- Database mới được tạo từ docs/photo_studio.sql đã có cột này.
ALTER TABLE `packages`
    ADD COLUMN `deleted_at` DATETIME NULL COMMENT 'Thời điểm đưa gói chụp vào thùng rác';
