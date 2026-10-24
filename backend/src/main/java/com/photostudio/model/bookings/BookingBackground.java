package com.photostudio.model.bookings;

import com.photostudio.model.backgrounds.Background;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "booking_backgrounds")
@Getter
@Setter
@NoArgsConstructor
public class BookingBackground {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "background_id", nullable = false)
    private Background background;

    public Long getBookingId() {
        return booking != null ? booking.getId() : null;
    }

    public Long getBackgroundId() {
        return background != null ? background.getId() : null;
    }
}
