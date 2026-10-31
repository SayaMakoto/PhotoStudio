package com.photostudio.model.salaries;

import com.photostudio.model.bookings.Booking;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "salary_commission_details")
@Getter
@Setter
@NoArgsConstructor
public class SalaryCommissionDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "salary_id", nullable = false)
    private Salary salary;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(name = "package_id", nullable = false)
    private Long packageId;

    @Column(name = "package_name", nullable = false)
    private String packageName;

    @Column(name = "package_price", nullable = false)
    @JdbcTypeCode(SqlTypes.DECIMAL)
    private Double packagePrice;

    @Column(name = "commission_rate", nullable = false)
    @JdbcTypeCode(SqlTypes.DECIMAL)
    private Double commissionRate = 0.10;

    @Column(name = "commission_amount", nullable = false)
    @JdbcTypeCode(SqlTypes.DECIMAL)
    private Double commissionAmount;

    @Column(name = "shoot_date", nullable = false)
    private LocalDate shootDate;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (commissionRate == null) commissionRate = 0.10;
        if (packagePrice != null && commissionAmount == null) {
            commissionAmount = packagePrice * commissionRate;
        }
    }
}
