package com.photostudio.model.bookings;

import com.photostudio.model.employees.Employee;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "booking_employee_assignments")
@Getter
@Setter
@NoArgsConstructor
public class BookingEmployeeAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "assigned_at", nullable = false)
    private LocalDateTime assignedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private BookingEmployeeAssignmentStatus status = BookingEmployeeAssignmentStatus.assigned;

    @Column(name = "note", length = 255)
    private String note;

    @PrePersist
    protected void onCreate() {
        if (assignedAt == null) {
            assignedAt = LocalDateTime.now();
        }
        if (status == null) {
            status = BookingEmployeeAssignmentStatus.assigned;
        }
    }

    public Long getBookingId() {
        return booking != null ? booking.getId() : null;
    }

    public Long getEmployeeId() {
        return employee != null ? employee.getId() : null;
    }
}
