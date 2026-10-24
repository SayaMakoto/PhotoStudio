package com.photostudio.repository;

import com.photostudio.model.reviews.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Tìm đánh giá theo đơn đặt lịch (mỗi đơn tối đa 1 đánh giá)
    @Query("SELECT r FROM Review r WHERE r.booking.id = :bookingId")
    Optional<Review> findByBookingId(@Param("bookingId") Long bookingId);

    // Kiểm tra đơn đặt lịch đã có đánh giá chưa
    @Query("SELECT COUNT(r) > 0 FROM Review r WHERE r.booking.id = :bookingId")
    boolean existsByBookingId(@Param("bookingId") Long bookingId);

    // Tìm kiếm các đánh giá theo khách hàng (mới nhất trước)
    @Query("SELECT r FROM Review r WHERE r.customer.id = :customerId ORDER BY r.createdAt DESC, r.id DESC")
    List<Review> findByCustomerId(@Param("customerId") Long customerId);

    // Tìm kiếm các đánh giá có nhắc tới một nhân viên
    @Query("SELECT DISTINCT r FROM Review r JOIN r.employeeReviews er WHERE er.employeeId = :employeeId " +
           "ORDER BY r.createdAt DESC, r.id DESC")
    List<Review> findByEmployeeId(@Param("employeeId") Long employeeId);

    // Điểm trung bình của một nhân viên (null nếu chưa có đánh giá)
    @Query("SELECT AVG(er.rating) FROM EmployeeReview er WHERE er.employeeId = :employeeId")
    Double findAverageRatingByEmployeeId(@Param("employeeId") Long employeeId);

    // Tổng số lượt đánh giá của một nhân viên
    @Query("SELECT COUNT(er) FROM EmployeeReview er WHERE er.employeeId = :employeeId")
    long countByEmployeeId(@Param("employeeId") Long employeeId);
}
