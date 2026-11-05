package com.photostudio;

import com.photostudio.dto.rooms.RoomRequest;
import com.photostudio.dto.rooms.RoomResponse;
import com.photostudio.mapper.RoomMapper;
import com.photostudio.model.rooms.Room;
import com.photostudio.model.rooms.RoomStatus;
import com.photostudio.repository.RoomRepository;
import com.photostudio.service.impl.RoomServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RoomValidationTest {

    @Mock
    private RoomRepository roomRepository;

    @InjectMocks
    private RoomServiceImpl roomService;

    private RoomMapper roomMapper;
    private RoomRequest validRequest;
    private Room validRoom;

    @BeforeEach
    void setUp() {
        roomMapper = new RoomMapper();

        validRequest = new RoomRequest();
        validRequest.setName("Phòng Studio Vintage");
        validRequest.setDescription("Phòng phong cách cổ điển với đầy đủ ánh sáng tự nhiên");
        validRequest.setCapacity(5);
        validRequest.setStatus("active");

        validRoom = new Room();
        validRoom.setId(1L);
        validRoom.setName("Phòng Studio Vintage");
        validRoom.setDescription("Phòng phong cách cổ điển với đầy đủ ánh sáng tự nhiên");
        validRoom.setCapacity(5);
        validRoom.setStatus(RoomStatus.active);
    }

    // ==========================================
    // 1. KIỂM THỬ XÁC THỰC DỮ LIỆU ĐẦU VÀO (REQUEST VALIDATION & MAPPER)
    // ==========================================

    @Test
    @DisplayName("Ném ngoại lệ khi tên phòng bị để trống hoặc null")
    void testValidateRoom_BlankName_ThrowsException() {
        validRequest.setName("");
        IllegalArgumentException ex1 = assertThrows(IllegalArgumentException.class, () -> validRequest.validate());
        assertTrue(ex1.getMessage().contains("Tên phòng chụp không được để trống"));

        validRequest.setName(null);
        IllegalArgumentException ex2 = assertThrows(IllegalArgumentException.class, () -> validRequest.validate());
        assertTrue(ex2.getMessage().contains("Tên phòng chụp không được để trống"));
    }

    @Test
    @DisplayName("Ném ngoại lệ khi tên phòng vượt quá 255 ký tự")
    void testValidateRoom_NameExceedsLength_ThrowsException() {
        validRequest.setName("A".repeat(256));
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> validRequest.validate());
        assertTrue(ex.getMessage().contains("Tên phòng chụp tối đa 255 ký tự"));
    }

    @Test
    @DisplayName("Ném ngoại lệ khi mô tả phòng vượt quá 255 ký tự")
    void testValidateRoom_DescriptionExceedsLength_ThrowsException() {
        validRequest.setDescription("D".repeat(256));
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> validRequest.validate());
        assertTrue(ex.getMessage().contains("Mô tả phòng tối đa 255 ký tự"));
    }

    @Test
    @DisplayName("Ném ngoại lệ khi sức chứa phòng nhỏ hơn 1")
    void testValidateRoom_InvalidCapacity_ThrowsException() {
        validRequest.setCapacity(0);
        IllegalArgumentException ex1 = assertThrows(IllegalArgumentException.class, () -> validRequest.validate());
        assertTrue(ex1.getMessage().contains("Sức chứa tối thiểu phải là 1"));

        validRequest.setCapacity(-5);
        IllegalArgumentException ex2 = assertThrows(IllegalArgumentException.class, () -> validRequest.validate());
        assertTrue(ex2.getMessage().contains("Sức chứa tối thiểu phải là 1"));
    }

    @Test
    @DisplayName("Chấp nhận sức chứa 20 và từ chối sức chứa vượt quá 20")
    void capacityUpperBoundary_isEnforced() {
        validRequest.setCapacity(20);
        assertDoesNotThrow(() -> validRequest.validate());

        validRequest.setCapacity(21);
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, validRequest::validate);
        assertTrue(ex.getMessage().contains("Sức chứa tối đa là 20"));
    }

    @Test
    @DisplayName("Ném ngoại lệ khi trạng thái phòng không hợp lệ")
    void testValidateRoom_InvalidStatus_ThrowsException() {
        validRequest.setStatus("unknown_status");
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> validRequest.validate());
        assertTrue(ex.getMessage().contains("Trạng thái phòng không hợp lệ"));
    }

    @Test
    @DisplayName("Chuyển đổi RoomRequest sang Entity và Response DTO thành công")
    void testMapper_ToEntityAndToResponse_Success() {
        Room entity = roomMapper.toEntity(validRequest);
        assertNotNull(entity);
        assertEquals("Phòng Studio Vintage", entity.getName());
        assertEquals(5, entity.getCapacity());
        assertEquals(RoomStatus.active, entity.getStatus());

        entity.setId(10L);
        RoomResponse response = roomMapper.toResponseDTO(entity);
        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertEquals("Phòng Studio Vintage", response.getName());
        assertEquals("active", response.getStatus());
    }

    @Test
    @DisplayName("Tự động gán giá trị mặc định capacity = 1 và status = active khi không cung cấp")
    void testMapper_DefaultValues_Success() {
        RoomRequest requestWithDefaults = new RoomRequest();
        requestWithDefaults.setName("Phòng Mini Test");

        Room entity = roomMapper.toEntity(requestWithDefaults);
        assertEquals(1, entity.getCapacity());
        assertEquals(RoomStatus.active, entity.getStatus());
    }

    // ==========================================
    // 2. KIỂM THỬ LOGIC NGHIỆP VỤ TẦNG SERVICE (ROOM SERVICE)
    // ==========================================

    @Test
    @DisplayName("Tạo mới phòng chụp thành công qua Service")
    void testCreateRoom_ServiceSuccess() {
        when(roomRepository.save(any(Room.class))).thenAnswer(invocation -> {
            Room r = invocation.getArgument(0);
            r.setId(1L);
            return r;
        });

        Room created = roomService.createRoom(validRoom);

        assertNotNull(created);
        assertEquals(1L, created.getId());
        assertEquals("Phòng Studio Vintage", created.getName());
        verify(roomRepository, times(1)).save(validRoom);
    }

    @Test
    @DisplayName("Lấy danh sách tất cả phòng chụp")
    void testGetAllRooms_Success() {
        when(roomRepository.findByDeletedAtIsNull()).thenReturn(List.of(validRoom));

        List<Room> rooms = roomService.getAllRooms();

        assertEquals(1, rooms.size());
        assertEquals("Phòng Studio Vintage", rooms.get(0).getName());
        verify(roomRepository, times(1)).findByDeletedAtIsNull();
    }

    @Test
    @DisplayName("Lấy chi tiết phòng theo ID thành công")
    void testGetRoomById_Success() {
        when(roomRepository.findByIdAndDeletedAtIsNull(1L)).thenReturn(Optional.of(validRoom));

        Optional<Room> result = roomService.getRoomById(1L);

        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
        assertEquals("Phòng Studio Vintage", result.get().getName());
        verify(roomRepository, times(1)).findByIdAndDeletedAtIsNull(1L);
    }

    @Test
    @DisplayName("Trả về Optional rỗng khi không tìm thấy phòng theo ID")
    void testGetRoomById_NotFound() {
        when(roomRepository.findByIdAndDeletedAtIsNull(99L)).thenReturn(Optional.empty());

        Optional<Room> result = roomService.getRoomById(99L);

        assertTrue(result.isEmpty());
        verify(roomRepository, times(1)).findByIdAndDeletedAtIsNull(99L);
    }

    @Test
    @DisplayName("Cập nhật thông tin phòng chụp thành công")
    void testUpdateRoom_Success() {
        Room updateDetails = new Room();
        updateDetails.setName("Phòng Studio Hiện Đại");
        updateDetails.setDescription("Đã nâng cấp đèn LED và phông nền mới");
        updateDetails.setCapacity(8);
        updateDetails.setStatus(RoomStatus.maintenance);

        when(roomRepository.findByIdAndDeletedAtIsNull(1L)).thenReturn(Optional.of(validRoom));
        when(roomRepository.save(any(Room.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Room updated = roomService.updateRoom(1L, updateDetails);

        assertNotNull(updated);
        assertEquals("Phòng Studio Hiện Đại", updated.getName());
        assertEquals("Đã nâng cấp đèn LED và phông nền mới", updated.getDescription());
        assertEquals(8, updated.getCapacity());
        assertEquals(RoomStatus.maintenance, updated.getStatus());
        verify(roomRepository, times(1)).save(validRoom);
    }

    @Test
    @DisplayName("Ném ngoại lệ khi cập nhật phòng không tồn tại")
    void testUpdateRoom_NotFound_ThrowsException() {
        when(roomRepository.findByIdAndDeletedAtIsNull(99L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> roomService.updateRoom(99L, validRoom)
        );

        assertTrue(ex.getMessage().contains("Không tìm thấy phòng với ID: 99"));
        verify(roomRepository, never()).save(any());
    }

    @Test
    @DisplayName("Xóa phòng chụp thành công khi ID tồn tại")
    void testDeleteRoom_Success() {
        when(roomRepository.findByIdAndDeletedAtIsNull(1L)).thenReturn(Optional.of(validRoom));
        when(roomRepository.save(any(Room.class))).thenAnswer(invocation -> invocation.getArgument(0));

        assertDoesNotThrow(() -> roomService.deleteRoom(1L));

        verify(roomRepository, times(1)).findByIdAndDeletedAtIsNull(1L);
        verify(roomRepository, times(1)).save(validRoom);
    }

    @Test
    @DisplayName("Ném ngoại lệ khi xóa phòng không tồn tại")
    void testDeleteRoom_NotFound_ThrowsException() {
        when(roomRepository.findByIdAndDeletedAtIsNull(99L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> roomService.deleteRoom(99L)
        );

        assertTrue(ex.getMessage().contains("Không tìm thấy phòng với ID: 99"));
        verify(roomRepository, never()).save(any());
    }

    @Test
    @DisplayName("Tìm kiếm phòng theo tên không phân biệt hoa thường (search)")
    void testSearchRoomsByName_Success() {
        when(roomRepository.findByDeletedAtIsNullAndNameContainingIgnoreCase("vintage")).thenReturn(List.of(validRoom));

        List<Room> results = roomService.searchRoomsByName("vintage");

        assertFalse(results.isEmpty());
        assertEquals(1, results.size());
        assertEquals("Phòng Studio Vintage", results.get(0).getName());
        verify(roomRepository, times(1)).findByDeletedAtIsNullAndNameContainingIgnoreCase("vintage");
    }

    @Test
    @DisplayName("Lọc danh sách phòng theo trạng thái hợp lệ (active, maintenance)")
    void testGetRoomsByStatus_Success() {
        when(roomRepository.findByDeletedAtIsNullAndStatus(RoomStatus.active)).thenReturn(List.of(validRoom));

        List<Room> results = roomService.getRoomsByStatus("active");

        assertEquals(1, results.size());
        assertEquals(RoomStatus.active, results.get(0).getStatus());
        verify(roomRepository, times(1)).findByDeletedAtIsNullAndStatus(RoomStatus.active);
    }

    @Test
    @DisplayName("Ném ngoại lệ khi lọc danh sách phòng với trạng thái không hợp lệ")
    void testGetRoomsByStatus_InvalidStatus_ThrowsException() {
        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> roomService.getRoomsByStatus("invalid_status")
        );

        assertTrue(ex.getMessage().contains("Trạng thái phòng không hợp lệ"));
        verify(roomRepository, never()).findByStatus(any());
    }
}
