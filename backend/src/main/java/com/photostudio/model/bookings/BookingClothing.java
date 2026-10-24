package com.photostudio.model.bookings;

import com.photostudio.model.clothes.Cloth;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "booking_clothing")
@Getter
@Setter
@NoArgsConstructor
public class BookingClothing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cloth_id", nullable = false)
    private Cloth cloth;

    @Column(name = "quantity", nullable = false)
    private Integer quantity = 1;

    public Long getBookingId() {
        return booking != null ? booking.getId() : null;
    }

    public Long getClothId() {
        return cloth != null ? cloth.getId() : null;
    }
}
