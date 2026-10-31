USE `photo_studio`;

-- Mở rộng ENUM trước để có thể chuyển dữ liệu sang các trạng thái mới.
ALTER TABLE `payments`
    MODIFY COLUMN `status` ENUM('pending', 'paid', 'failed', 'refunded', 'deposit_30', 'deposit_50')
    NOT NULL DEFAULT 'pending' COMMENT 'Tiến độ thanh toán';

-- Các giao dịch cọc cũ nhận diện theo ghi chú; giao dịch trả đủ/phần còn lại giữ trạng thái paid.
-- failed/refunded được đưa về pending vì bộ trạng thái mới không còn phân loại kết quả giao dịch.
UPDATE `payments`
SET `status` = CASE
    WHEN `status` = 'paid' AND LOWER(COALESCE(`note`, '')) LIKE '%cọc 50%%' THEN 'deposit_50'
    WHEN `status` = 'paid' AND LOWER(COALESCE(`note`, '')) LIKE '%coc 50%%' THEN 'deposit_50'
    WHEN `status` = 'paid' AND LOWER(COALESCE(`note`, '')) LIKE '%cọc 30%%' THEN 'deposit_30'
    WHEN `status` = 'paid' AND LOWER(COALESCE(`note`, '')) LIKE '%coc 30%%' THEN 'deposit_30'
    WHEN `status` IN ('failed', 'refunded') THEN 'pending'
    ELSE `status`
END;

-- Giới hạn cột về đúng bốn trạng thái thanh toán mới.
ALTER TABLE `payments`
    MODIFY COLUMN `status` ENUM('pending', 'deposit_30', 'deposit_50', 'paid')
    NOT NULL DEFAULT 'pending' COMMENT 'Tiến độ thanh toán';
