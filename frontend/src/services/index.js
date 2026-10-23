/**
 * Index xuất toàn bộ các Service API của PhotoStudio.
 * Giúp các Component có thể import ngắn gọn:
 * import { authService, roomService, equipmentService } from '@/services';
 */

export { default as apiClient, http, tokenManager, request } from './apiClient';
export { default as authService } from './authService';
export { default as userService } from './userService';
export { default as equipmentService } from './equipmentService';
export { default as roomService } from './roomService';
export { default as accessoryService } from './accessoryService';
export { default as packageService } from './packageService';
export { default as bookingService } from './bookingService';
