package com.photostudio.model.reviews;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.photostudio.model.bookings.Booking;
import com.photostudio.model.users.User;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 1 booking chỉ có tối đa 1 bài đánh giá (booking_id UNIQUE)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @Column(name = "rating", nullable = false)
    private Double rating = 5.0;

    @Column(name = "comment", length = 255)
    private String comment;

    @Column(name = "admin_reply", columnDefinition = "TEXT")
    private String adminReply;

    @Column(name = "admin_replied_at")
    private LocalDateTime adminRepliedAt;

    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EmployeeReview> employeeReviews = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Long getBookingId() {
        return booking != null ? booking.getId() : null;
    }

    public void setBookingId(Long bookingId) {
        if (bookingId != null) {
            if (this.booking == null) {
                this.booking = new Booking();
            }
            this.booking.setId(bookingId);
        } else {
            this.booking = null;
        }
    }

    public Long getCustomerId() {
        return customer != null ? customer.getId() : null;
    }

    public void setCustomerId(Long customerId) {
        if (customerId != null) {
            if (this.customer == null) {
                this.customer = new User();
            }
            this.customer.setId(customerId);
        } else {
            this.customer = null;
        }
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
