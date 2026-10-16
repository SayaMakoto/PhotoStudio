package com.photostudio.model.bookings;

import com.photostudio.model.accessories.Accessory;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "booking_accessories")
@Getter
@Setter
@NoArgsConstructor
public class BookingAccessory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accessory_id", nullable = false)
    private Accessory accessory;

    @Column(name = "quantity", nullable = false)
    private Integer quantity = 1;

    public Long getBookingId() {
        return booking != null ? booking.getId() : null;
    }

    public Long getAccessoryId() {
        return accessory != null ? accessory.getId() : null;
    }
}
