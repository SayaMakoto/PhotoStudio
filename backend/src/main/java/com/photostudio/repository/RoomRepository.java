package com.photostudio.repository;

import com.photostudio.model.rooms.Room;
import com.photostudio.model.rooms.RoomStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByNameContainingIgnoreCase(String name);
    List<Room> findByStatus(RoomStatus status);

    List<Room> findByDeletedAtIsNull();

    List<Room> findByDeletedAtIsNotNullOrderByDeletedAtDesc();

    Optional<Room> findByIdAndDeletedAtIsNull(Long id);

    Optional<Room> findByIdAndDeletedAtIsNotNull(Long id);

    List<Room> findByDeletedAtIsNullAndNameContainingIgnoreCase(String name);

    List<Room> findByDeletedAtIsNullAndStatus(RoomStatus status);
}
