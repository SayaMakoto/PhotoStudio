package com.photostudio.service.impl;

import com.photostudio.dto.bookings.BookingEquipmentRequest;
import com.photostudio.dto.bookings.BookingEquipmentResponse;
import com.photostudio.mapper.BookingEquipmentMapper;
import com.photostudio.model.bookings.Booking;
import com.photostudio.model.bookings.BookingEquipment;
import com.photostudio.model.bookings.BookingEquipmentStatus;
import com.photostudio.model.equipment.Equipment;
import com.photostudio.model.equipment.EquipmentStatus;
import com.photostudio.repository.BookingEquipmentRepository;
import com.photostudio.repository.BookingRepository;
import com.photostudio.repository.EquipmentRepository;
import com.photostudio.service.BookingEquipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingEquipmentServiceImpl implements BookingEquipmentService {

    private final BookingEquipmentRepository bookingEquipmentRepository;
    private final BookingRepository bookingRepository;
    private final EquipmentRepository equipmentRepository;
    private final BookingEquipmentMapper bookingEquipmentMapper;

    @Override
    public List<BookingEquipmentResponse> getEquipmentsByBookingId(Long bookingId) {
        if (!bookingRepository.existsById(bookingId)) {
            throw new IllegalArgumentException("Không tìm thấy đơn đặt lịch với ID: " + bookingId);
        }
        return bookingEquipmentRepository.findByBookingId(bookingId).stream()
                .map(bookingEquipmentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BookingEquipmentResponse getById(Long id) {
        BookingEquipment entity = bookingEquipmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thông tin cấp phát thiết bị với ID: " + id));
        return bookingEquipmentMapper.toResponse(entity);
    }

    @Override
    @Transactional
    public BookingEquipmentResponse assignEquipmentToBooking(BookingEquipmentRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Dữ liệu yêu cầu không được để trống");
        }
        request.validate();

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn đặt lịch với ID: " + request.getBookingId()));

        Equipment equipment = equipmentRepository.findById(request.getEquipmentId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thiết bị với ID: " + request.getEquipmentId()));

        if (equipment.getStatus() == EquipmentStatus.broken || equipment.getStatus() == EquipmentStatus.retired) {
            throw new IllegalArgumentException("Thiết bị \"" + equipment.getName() + "\" đang bị hỏng hoặc ngừng sử dụng, không thể cấp phát");
        }

        if (equipment.getStatus() == EquipmentStatus.maintenance) {
            throw new IllegalArgumentException("Thiết bị \"" + equipment.getName() + "\" đang trong quá trình bảo trì, không thể cấp phát");
        }

    
        boolean isAlreadyAssigned = bookingEquipmentRepository.existsByEquipmentIdAndStatus(
                equipment.getId(), BookingEquipmentStatus.assigned);
        if (isAlreadyAssigned) {
            throw new IllegalArgumentException("Thiết bị \"" + equipment.getName() + "\" hiện đang được cấp phát cho một buổi chụp khác và chưa được hoàn trả");
        }

        BookingEquipment entity = bookingEquipmentMapper.toEntity(request, booking, equipment);

        equipment.setStatus(EquipmentStatus.in_use);
        equipmentRepository.save(equipment);

        BookingEquipment saved = bookingEquipmentRepository.save(entity);
        return bookingEquipmentMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public BookingEquipmentResponse returnEquipment(Long id, String note) {
        BookingEquipment entity = bookingEquipmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thông tin cấp phát thiết bị với ID: " + id));

        if (entity.getStatus() == BookingEquipmentStatus.returned) {
            throw new IllegalArgumentException("Thiết bị này đã được hoàn trả trước đó");
        }

        entity.setReturnedAt(LocalDateTime.now());
        entity.setStatus(BookingEquipmentStatus.returned);
        if (note != null && !note.isBlank()) {
            entity.setNote(note);
        }

        if (entity.getEquipment() != null) {
            Equipment eq = entity.getEquipment();
            eq.setStatus(EquipmentStatus.available);
            equipmentRepository.save(eq);
        }

        BookingEquipment saved = bookingEquipmentRepository.save(entity);
        return bookingEquipmentMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public BookingEquipmentResponse updateAssignmentStatus(Long id, String statusStr, String note) {
        BookingEquipment entity = bookingEquipmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thông tin cấp phát thiết bị với ID: " + id));

        if (statusStr == null || statusStr.isBlank()) {
            throw new IllegalArgumentException("Trạng thái không được để trống");
        }

        BookingEquipmentStatus newStatus;
        try {
            newStatus = BookingEquipmentStatus.valueOf(statusStr.trim().toLowerCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Trạng thái cấp phát không hợp lệ. Hợp lệ: assigned, returned, cancelled");
        }

        entity.setStatus(newStatus);
        if (note != null) {
            entity.setNote(note);
        }

        Equipment eq = entity.getEquipment();
        if (newStatus == BookingEquipmentStatus.returned) {
            entity.setReturnedAt(LocalDateTime.now());
            if (eq != null) {
                eq.setStatus(EquipmentStatus.available);
                equipmentRepository.save(eq);
            }
        } else if (newStatus == BookingEquipmentStatus.cancelled) {
            if (eq != null) {
                eq.setStatus(EquipmentStatus.available);
                equipmentRepository.save(eq);
            }
        } else if (newStatus == BookingEquipmentStatus.assigned) {
            entity.setReturnedAt(null);
            if (eq != null) {
                eq.setStatus(EquipmentStatus.in_use);
                equipmentRepository.save(eq);
            }
        }

        BookingEquipment saved = bookingEquipmentRepository.save(entity);
        return bookingEquipmentMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public void removeEquipmentFromBooking(Long id) {
        BookingEquipment entity = bookingEquipmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy thông tin cấp phát thiết bị với ID: " + id));

        if (entity.getStatus() == BookingEquipmentStatus.assigned && entity.getEquipment() != null) {
            Equipment eq = entity.getEquipment();
            eq.setStatus(EquipmentStatus.available);
            equipmentRepository.save(eq);
        }

        bookingEquipmentRepository.deleteById(id);
    }
}
