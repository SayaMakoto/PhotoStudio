package com.photostudio.service.impl;

import com.photostudio.model.rooms.Room;
import com.photostudio.model.rooms.RoomStatus;
import com.photostudio.repository.RoomRepository;
import com.photostudio.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private static final Set<String> VALID_STATUSES = Set.of("active", "inactive", "maintenance");

    @Override
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    @Override
    public Optional<Room> getRoomById(Long id) {
        return roomRepository.findById(id);
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
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng với ID: " + id));

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
        if (!roomRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy phòng với ID: " + id);
        }
        roomRepository.deleteById(id);
    }

    @Override
    public List<Room> searchRoomsByName(String name) {
        return roomRepository.findByNameContainingIgnoreCase(name);
    }

    @Override
    public List<Room> getRoomsByStatus(String statusStr) {
        if (statusStr == null || !VALID_STATUSES.contains(statusStr.trim().toLowerCase())) {
            throw new IllegalArgumentException("Trạng thái phòng không hợp lệ. Các trạng thái hợp lệ: active, inactive, maintenance");
        }
        RoomStatus status = RoomStatus.valueOf(statusStr.trim().toLowerCase());
        return roomRepository.findByStatus(status);
    }
}