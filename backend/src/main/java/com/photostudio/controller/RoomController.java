package com.photostudio.controller;


import com.photostudio.dto.rooms.RoomRequest;
import com.photostudio.dto.rooms.RoomResponse;
import com.photostudio.mapper.RoomMapper;
import com.photostudio.model.rooms.Room;
import com.photostudio.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;
    private final RoomMapper roomMapper;

    @GetMapping
    public ResponseEntity<List<RoomResponse>> getAllRooms() {
        List<RoomResponse> rooms = roomService.getAllRooms().stream()
                .map(roomMapper::toResponseDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(rooms);
    }

    @GetMapping("/trash")
    public ResponseEntity<List<RoomResponse>> getTrash() {
        return ResponseEntity.ok(roomService.getTrash());
    }

    @PutMapping("/trash/{id}/restore")
    public ResponseEntity<RoomResponse> restoreRoom(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.restoreRoom(id));
    }

    @DeleteMapping("/trash/{id}/permanent")
    public ResponseEntity<Void> permanentlyDeleteRoom(@PathVariable Long id) {
        roomService.permanentlyDeleteRoom(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomResponse> getRoomById(@PathVariable Long id) {
        return roomService.getRoomById(id)
                .map(room -> ResponseEntity.ok(roomMapper.toResponseDTO(room)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping
    public ResponseEntity<RoomResponse> createRoom(@RequestBody RoomRequest request) {
        // Việc validate được xử lý bên trong mapper/request, nếu lỗi sẽ quăng IllegalArgumentException
        Room room = roomMapper.toEntity(request);
        Room createdRoom = roomService.createRoom(room);
        return ResponseEntity.status(HttpStatus.CREATED).body(roomMapper.toResponseDTO(createdRoom));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoomResponse> updateRoom(@PathVariable Long id, @RequestBody RoomRequest request) {
        Room existingRoom = roomService.getRoomById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phòng với ID: " + id));

        roomMapper.updateEntityFromRequest(request, existingRoom);
        Room updatedRoom = roomService.updateRoom(id, existingRoom);
        return ResponseEntity.ok(roomMapper.toResponseDTO(updatedRoom));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<RoomResponse>> getRoomsByStatus(@PathVariable String status) {
        List<RoomResponse> rooms = roomService.getRoomsByStatus(status).stream()
                .map(roomMapper::toResponseDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(rooms);
    }
}
