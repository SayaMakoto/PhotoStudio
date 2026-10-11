package com.photostudio.service.impl;

import com.photostudio.dto.bookings.BookingPackageRequest;
import com.photostudio.dto.bookings.BookingPackageResponse;
import com.photostudio.mapper.BookingPackageMapper;
import com.photostudio.model.bookings.Booking;
import com.photostudio.model.bookings.BookingPackage;
import com.photostudio.model.packages.Package;
import com.photostudio.model.packages.PackageStatus;
import com.photostudio.repository.BookingPackageRepository;
import com.photostudio.repository.BookingRepository;
import com.photostudio.repository.PackageRepository;
import com.photostudio.service.BookingPackageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingPackageServiceImpl implements BookingPackageService {

    private final BookingPackageRepository bookingPackageRepository;
    private final BookingRepository bookingRepository;
    private final PackageRepository packageRepository;
    private final BookingPackageMapper bookingPackageMapper;

    @Override
    public List<BookingPackageResponse> getPackagesByBookingId(Long bookingId) {
        if (!bookingRepository.existsById(bookingId)) {
            throw new IllegalArgumentException("Không tìm thấy đơn đặt lịch với ID: " + bookingId);
        }
        return bookingPackageRepository.findByBookingId(bookingId).stream()
                .map(bookingPackageMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BookingPackageResponse getById(Long id) {
        BookingPackage entity = bookingPackageRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy gói chụp trong booking với ID: " + id));
        return bookingPackageMapper.toResponse(entity);
    }

    @Override
    @Transactional
    public BookingPackageResponse addPackageToBooking(BookingPackageRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Dữ liệu yêu cầu không được để trống");
        }
        request.validate();

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn đặt lịch với ID: " + request.getBookingId()));

        Package packageEntity = packageRepository.findById(request.getPackageId())
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy gói chụp với ID: " + request.getPackageId()));

        if (packageEntity.getStatus() == PackageStatus.inactive) {
            throw new IllegalArgumentException("Gói chụp \"" + packageEntity.getName() + "\" hiện đang ngưng hoạt động");
        }

        Optional<BookingPackage> existingOpt = bookingPackageRepository.findByBookingIdAndPackageEntityId(
                booking.getId(), packageEntity.getId());

        BookingPackage entityToSave;
        if (existingOpt.isPresent()) {
            entityToSave = existingOpt.get();
            int addQty = request.getQuantity() != null ? request.getQuantity() : 1;
            entityToSave.setQuantity(entityToSave.getQuantity() + addQty);
            if (request.getUnitPrice() != null) {
                entityToSave.setUnitPrice(request.getUnitPrice());
            }
        } else {
            entityToSave = bookingPackageMapper.toEntity(request, booking, packageEntity);
        }

        BookingPackage saved = bookingPackageRepository.save(entityToSave);
        return bookingPackageMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public BookingPackageResponse updateBookingPackage(Long id, Integer quantity, Double unitPrice) {
        BookingPackage entity = bookingPackageRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy gói chụp trong booking với ID: " + id));

        if (quantity != null) {
            if (quantity <= 0) {
                throw new IllegalArgumentException("Số lượng gói chụp phải lớn hơn 0");
            }
            entity.setQuantity(quantity);
        }

        if (unitPrice != null) {
            if (unitPrice < 0) {
                throw new IllegalArgumentException("Đơn giá gói chụp không được âm");
            }
            entity.setUnitPrice(unitPrice);
        }

        BookingPackage updated = bookingPackageRepository.save(entity);
        return bookingPackageMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void removePackageFromBooking(Long id) {
        if (!bookingPackageRepository.existsById(id)) {
            throw new IllegalArgumentException("Không tìm thấy gói chụp trong booking với ID: " + id);
        }
        bookingPackageRepository.deleteById(id);
    }

    @Override
    public Double calculateTotalPackagePrice(Long bookingId) {
        if (!bookingRepository.existsById(bookingId)) {
            throw new IllegalArgumentException("Không tìm thấy đơn đặt lịch với ID: " + bookingId);
        }
        return bookingPackageRepository.findByBookingId(bookingId).stream()
                .mapToDouble(bp -> (bp.getUnitPrice() != null ? bp.getUnitPrice() : 0.0) * (bp.getQuantity() != null ? bp.getQuantity() : 0))
                .sum();
    }
}
