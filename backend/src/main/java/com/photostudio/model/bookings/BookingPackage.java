package com.photostudio.model.bookings;

import com.photostudio.model.packages.Package;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "booking_packages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "package_id", nullable = false)
    private Package packageEntity;

    @Column(name = "quantity", nullable = false)
    private Integer quantity = 1;

    @Column(name = "unit_price", nullable = false)
    private Double unitPrice = 0.0;

    public Long getBookingId() {
        return booking != null ? booking.getId() : null;
    }

    public Long getPackageId() {
        return packageEntity != null ? packageEntity.getId() : null;
    }
}
