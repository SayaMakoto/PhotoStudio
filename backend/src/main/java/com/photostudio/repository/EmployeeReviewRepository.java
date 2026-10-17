package com.photostudio.repository;

import com.photostudio.model.employeereviews.EmployeeReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeReviewRepository extends JpaRepository<EmployeeReview, Long> {

    // Tìm các đánh giá nhân viên thuộc một bài review
    List<EmployeeReview> findByReviewId(Long reviewId);

    // Tìm các đánh giá của một nhân viên
    @Query("SELECT er FROM EmployeeReview er WHERE er.employee.id = :employeeId")
    List<EmployeeReview> findByEmployeeId(@Param("employeeId") Long employeeId);

    // Một nhân viên chỉ được đánh giá một lần trong cùng một bài review
    @Query("SELECT COUNT(er) > 0 FROM EmployeeReview er "
            + "WHERE er.reviewId = :reviewId AND er.employee.id = :employeeId "
            + "AND (:id IS NULL OR er.id <> :id)")
    boolean existsDuplicate(
            @Param("reviewId") Long reviewId,
            @Param("employeeId") Long employeeId,
            @Param("id") Long id);

    // Điểm trung bình của một nhân viên (null nếu chưa có đánh giá)
    @Query("SELECT AVG(er.rating) FROM EmployeeReview er WHERE er.employee.id = :employeeId")
    Double findAverageRatingByEmployeeId(@Param("employeeId") Long employeeId);

    @Query("SELECT COUNT(er) FROM EmployeeReview er WHERE er.employee.id = :employeeId")
    long countByEmployeeId(@Param("employeeId") Long employeeId);
}
