package com.photostudio.model.salaries;

import com.photostudio.model.employees.Employee;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "salaries")
@Getter
@Setter
@NoArgsConstructor
public class Salary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "month", nullable = false)
    private Integer month;

    @Column(name = "year", nullable = false)
    private Integer year;

    @Column(name = "work_days", nullable = false)
    private Integer workDays = 0;

    @Column(name = "daily_rate", nullable = false)
    @JdbcTypeCode(SqlTypes.DECIMAL)
    private Double dailyRate = 250000.0;

    @Column(name = "base_salary", nullable = false)
    @JdbcTypeCode(SqlTypes.DECIMAL)
    private Double baseSalary = 0.0;

    @Column(name = "total_shoots", nullable = false)
    private Integer totalShoots = 0;

    @Column(name = "commission_rate", nullable = false)
    @JdbcTypeCode(SqlTypes.DECIMAL)
    private Double commissionRate = 0.10;

    @Column(name = "total_commission", nullable = false)
    @JdbcTypeCode(SqlTypes.DECIMAL)
    private Double totalCommission = 0.0;

    @Column(name = "bonus", nullable = false)
    @JdbcTypeCode(SqlTypes.DECIMAL)
    private Double bonus = 0.0;

    @Column(name = "deduction", nullable = false)
    @JdbcTypeCode(SqlTypes.DECIMAL)
    private Double deduction = 0.0;

    @Column(name = "net_salary", nullable = false)
    @JdbcTypeCode(SqlTypes.DECIMAL)
    private Double netSalary = 0.0;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private SalaryStatus status = SalaryStatus.pending;

    @Column(name = "note")
    private String note;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "salary", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SalaryCommissionDetail> commissionDetails = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (updatedAt == null) updatedAt = LocalDateTime.now();
        if (status == null) status = SalaryStatus.pending;
        calculateNetSalary();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        calculateNetSalary();
    }

    public void calculateNetSalary() {
        if (workDays == null) workDays = 0;
        if (dailyRate == null) dailyRate = 250000.0;
        this.baseSalary = workDays * dailyRate;
        if (totalCommission == null) totalCommission = 0.0;
        if (bonus == null) bonus = 0.0;
        if (deduction == null) deduction = 0.0;
        this.netSalary = baseSalary + totalCommission + bonus - deduction;
    }
}
