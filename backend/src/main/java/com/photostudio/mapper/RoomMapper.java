package com.photostudio.mapper;

import com.photostudio.dto.rooms.RoomRequest;
import com.photostudio.dto.rooms.RoomResponse;
import com.photostudio.model.rooms.Room;
import com.photostudio.model.rooms.RoomStatus;
import org.springframework.stereotype.Component;

@Component
public class RoomMapper {

    public RoomResponse toResponseDTO(Room room) {
        if (room == null) return null;
        RoomResponse dto = new RoomResponse();
        dto.setId(room.getId());
        dto.setName(room.getName());
        dto.setDescription(room.getDescription());
        dto.setCapacity(room.getCapacity());
        if (room.getStatus() != null) {
            dto.setStatus(room.getStatus().name());
        }
        dto.setDeletedAt(room.getDeletedAt());
        return dto;
    }

    public Room toEntity(RoomRequest request) {
        if (request == null) return null;

        request.validate();

        Room room = new Room();
        room.setName(request.getName().trim());
        room.setDescription(request.getDescription());
        room.setCapacity(request.getCapacity() != null ? request.getCapacity() : 1);

        if (request.getStatus() != null) {
            room.setStatus(RoomStatus.valueOf(request.getStatus().trim().toLowerCase()));
        } else {
            room.setStatus(RoomStatus.active);
        }

        return room;
    }

    public void updateEntityFromRequest(RoomRequest request, Room room) {
        if (request == null || room == null) return;

        request.validate();

        room.setName(request.getName().trim());
        room.setDescription(request.getDescription());
        if (request.getCapacity() != null) {
            room.setCapacity(request.getCapacity());
        }
        if (request.getStatus() != null) {
            room.setStatus(RoomStatus.valueOf(request.getStatus().trim().toLowerCase()));
        }
    }
}
