package com.photostudio.service;

import com.photostudio.model.rooms.Room;
import com.photostudio.model.rooms.RoomStatus;

import java.util.List;
import java.util.Optional;

public interface RoomService {
    List<Room> getAllRooms();
    Optional<Room> getRoomById(Long id);
    Room createRoom(Room room);
    Room updateRoom(Long id, Room roomDetails);
    void deleteRoom(Long id);
    List<Room> searchRoomsByName(String name);
    List<Room> getRoomsByStatus(String status);
}