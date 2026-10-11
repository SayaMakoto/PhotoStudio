package com.photostudio.repository;

import com.photostudio.model.rooms.Room;
import com.photostudio.model.rooms.RoomStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByNameContainingIgnoreCase(String name);
    List<Room> findByStatus(RoomStatus status);
}