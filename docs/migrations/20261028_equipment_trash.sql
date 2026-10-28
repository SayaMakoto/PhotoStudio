-- Run once against an existing photo_studio database before starting the backend.
-- New databases built from docs/photo_studio.sql already include this column.
ALTER TABLE `equipments`
    ADD COLUMN IF NOT EXISTS `deleted_at` DATETIME NULL COMMENT 'Thời điểm đưa thiết bị vào thùng rác';
