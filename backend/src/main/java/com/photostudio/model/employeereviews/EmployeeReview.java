package com.photostudio.model.employeereviews;

import java.time.LocalDateTime;

import com.photostudio.model.employees.Employee;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "employee_reviews")
@Getter
@Setter
@NoArgsConstructor
public class EmployeeReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "review_id", nullable = false)
    private Long reviewId;
    // Quan hệ khi có entity Review (bảng reviews):
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "review_id", nullable = false)
    // private Review review;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "rating", nullable = false)
    private Double rating = 5.0;

    @Column(name = "comment", length = 255)
    private String comment;

    @Column(name = "admin_reply", columnDefinition = "TEXT")
    private String adminReply;

    @Column(name = "admin_replied_at")
    private LocalDateTime adminRepliedAt;
}
