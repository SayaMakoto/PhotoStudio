package com.photostudio.model.reviews;

import com.photostudio.model.employees.Employee;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity(name = "ReviewEmployeeReview")
@Table(name = "employee_reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false)
    private Review review;

    // Chỉ lưu mã nhân viên (employee_id); sự tồn tại được kiểm tra ở Service
    @Column(name = "employee_id", nullable = false)
    private Long employeeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", insertable = false, updatable = false)
    private Employee employee;

    @Column(name = "rating", nullable = false)
    private Double rating = 5.0;

    @Column(name = "comment", length = 255)
    private String comment;

    @Column(name = "admin_reply", columnDefinition = "TEXT")
    private String adminReply;

    @Column(name = "admin_replied_at")
    private LocalDateTime adminRepliedAt;

    public EmployeeReview(Long id, Review review, Long employeeId, Double rating, String comment) {
        this.id = id;
        this.review = review;
        this.employeeId = employeeId;
        this.rating = rating;
        this.comment = comment;
    }
}
