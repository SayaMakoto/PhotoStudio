package com.photostudio.mapper;

import com.photostudio.dto.bookings.BookingPackageRequest;
import com.photostudio.dto.bookings.BookingPackageResponse;
import com.photostudio.model.bookings.Booking;
import com.photostudio.model.bookings.BookingPackage;
import com.photostudio.model.packages.Package;
import org.springframework.stereotype.Component;

@Component
public class BookingPackageMapper {

    public BookingPackage toEntity(BookingPackageRequest request, Booking booking, Package packageEntity) {
        if (request == null) return null;

        BookingPackage entity = new BookingPackage();
        entity.setBooking(booking);
        entity.setPackageEntity(packageEntity);
        entity.setQuantity(request.getQuantity() != null ? request.getQuantity() : 1);

        if (request.getUnitPrice() != null) {
            entity.setUnitPrice(request.getUnitPrice());
        } else if (packageEntity != null && packageEntity.getPrice() != null) {
            entity.setUnitPrice(packageEntity.getPrice());
        } else {
            entity.setUnitPrice(0.0);
        }

        return entity;
    }

    public BookingPackageResponse toResponse(BookingPackage entity) {
        if (entity == null) return null;

        BookingPackageResponse response = new BookingPackageResponse();
        response.setId(entity.getId());
        response.setBookingId(entity.getBookingId());

        if (entity.getPackageEntity() != null) {
            response.setPackageId(entity.getPackageEntity().getId());
            response.setPackageName(entity.getPackageEntity().getName());
            response.setDuration(entity.getPackageEntity().getDuration());
        }

        response.setQuantity(entity.getQuantity());
        response.setUnitPrice(entity.getUnitPrice());

        double unitPrice = entity.getUnitPrice() != null ? entity.getUnitPrice() : 0.0;
        int qty = entity.getQuantity() != null ? entity.getQuantity() : 0;
        response.setSubTotal(unitPrice * qty);

        return response;
    }
}
