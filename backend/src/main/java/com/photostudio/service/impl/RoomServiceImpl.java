package com.photostudio.service.impl;

import com.photostudio.model.rooms.Room;
import com.photostudio.model.rooms.RoomStatus;
import com.photostudio.mapper.RoomMapper;
import com.photostudio.repository.BookingRepository;
import com.photostudio.repository.RoomRepository;
import com.photostudio.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.time.LocalDateTime;
import com.photostudio.dto.rooms.RoomResponse;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;
    private final RoomMapper roomMapper;
    private static final Set<String> VALID_STATUSES = Set.of("active", "inactive", "maintenance");

    @Override
    public List<Room> getAllRooms() {
        return roomRepository.findByDeletedAtIsNull();
    }

    @Override
    public Optional<Room> getRoomById(Long id) {
        return roomRepository.findByIdAndDeletedAtIsNull(id);
    }

    @Override
    @Transactional
    public Room createRoom(Room room) {
        if (room.getStatus() == null) {
            room.setStatus(RoomStatus.active);
        }
        if (room.getCapacity() == null) {
            room.setCapacity(1);
        }
        return roomRepository.save(room);
    }

    @Override
    @Transactional
    public Room updateRoom(Long id, Room roomDetails) {
        Room room = roomRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phòng với ID: " + id));

        room.setName(roomDetails.getName());
        room.setDescription(roomDetails.getDescription());
        room.setCapacity(roomDetails.getCapacity());
        if (roomDetails.getStatus() != null) {
            room.setStatus(roomDetails.getStatus());
        }

        return roomRepository.save(room);
    }

    @Override
    @Transactional
    public void deleteRoom(Long id) {
        Room room = roomRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phòng với ID: " + id));
        room.setDeletedAt(LocalDateTime.now());
        roomRepository.save(room);
    }

    @Override
    public List<Room> searchRoomsByName(String name) {
        return roomRepository.findByDeletedAtIsNullAndNameContainingIgnoreCase(name);
    }

    @Override
    public List<Room> getRoomsByStatus(String statusStr) {
        if (statusStr == null || !VALID_STATUSES.contains(statusStr.trim().toLowerCase())) {
            throw new IllegalArgumentException("Trạng thái phòng không hợp lệ. Các trạng thái hợp lệ: active, inactive, maintenance");
        }
        RoomStatus status = RoomStatus.valueOf(statusStr.trim().toLowerCase());
        return roomRepository.findByDeletedAtIsNullAndStatus(status);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomResponse> getTrash() {
        return roomRepository.findByDeletedAtIsNotNullOrderByDeletedAtDesc().stream()
                .map(roomMapper::toResponseDTO).toList();
    }

    @Override
    @Transactional
    public RoomResponse restoreRoom(Long id) {
        Room room = roomRepository.findByIdAndDeletedAtIsNotNull(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phòng trong thùng rác với ID: " + id));
        room.setDeletedAt(null);
        return roomMapper.toResponseDTO(roomRepository.save(room));
    }

    @Override
    @Transactional
    public void permanentlyDeleteRoom(Long id) {
        Room room = roomRepository.findByIdAndDeletedAtIsNotNull(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phòng trong thùng rác với ID: " + id));
        if (bookingRepository.existsByRoomId(id)) {
            throw new IllegalArgumentException("Không thể xóa vĩnh viễn phòng đã được sử dụng trong lịch đặt.");
        }
        roomRepository.delete(room);
    }
}
