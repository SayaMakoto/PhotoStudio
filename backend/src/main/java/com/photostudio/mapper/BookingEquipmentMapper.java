package com.photostudio.mapper;

import com.photostudio.dto.bookings.BookingEquipmentRequest;
import com.photostudio.dto.bookings.BookingEquipmentResponse;
import com.photostudio.model.bookings.Booking;
import com.photostudio.model.bookings.BookingEquipment;
import com.photostudio.model.bookings.BookingEquipmentStatus;
import com.photostudio.model.equipment.Equipment;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class BookingEquipmentMapper {

    public BookingEquipment toEntity(BookingEquipmentRequest request, Booking booking, Equipment equipment) {
        if (request == null) return null;

        BookingEquipment entity = new BookingEquipment();
        entity.setBooking(booking);
        entity.setEquipment(equipment);
        entity.setAssignedAt(request.getAssignedAt() != null ? request.getAssignedAt() : LocalDateTime.now());
        entity.setNote(request.getNote());

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            entity.setStatus(BookingEquipmentStatus.valueOf(request.getStatus().trim().toLowerCase()));
        } else {
            entity.setStatus(BookingEquipmentStatus.assigned);
        }

        return entity;
    }

    public BookingEquipmentResponse toResponse(BookingEquipment entity) {
        if (entity == null) return null;

        BookingEquipmentResponse response = new BookingEquipmentResponse();
        response.setId(entity.getId());
        response.setBookingId(entity.getBookingId());

        if (entity.getEquipment() != null) {
            response.setEquipmentId(entity.getEquipment().getId());
            response.setEquipmentName(entity.getEquipment().getName());
            if (entity.getEquipment().getType() != null) {
                response.setEquipmentType(entity.getEquipment().getType().name());
            }
            response.setEquipmentSerialNumber(entity.getEquipment().getSerialNumber());
        }

        response.setAssignedAt(entity.getAssignedAt());
        response.setReturnedAt(entity.getReturnedAt());
        response.setStatus(entity.getStatus() != null ? entity.getStatus().name() : null);
        response.setNote(entity.getNote());

        return response;
    }
}
