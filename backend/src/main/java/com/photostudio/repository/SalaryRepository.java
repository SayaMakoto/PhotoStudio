package com.photostudio.repository;

import com.photostudio.model.salaries.Salary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SalaryRepository extends JpaRepository<Salary, Long> {

    @Query("SELECT s FROM Salary s WHERE s.employee.id = :employeeId AND s.month = :month AND s.year = :year")
    Optional<Salary> findByEmployeeIdAndMonthAndYear(
            @Param("employeeId") Long employeeId,
            @Param("month") Integer month,
            @Param("year") Integer year);

    @Query("SELECT s FROM Salary s WHERE s.month = :month AND s.year = :year ORDER BY s.id DESC")
    List<Salary> findByMonthAndYear(@Param("month") Integer month, @Param("year") Integer year);

    @Query("SELECT s FROM Salary s WHERE s.employee.id = :employeeId ORDER BY s.year DESC, s.month DESC")
    List<Salary> findByEmployeeId(@Param("employeeId") Long employeeId);

    @Query("SELECT s FROM Salary s WHERE s.employee.user.id = :userId ORDER BY s.year DESC, s.month DESC")
    List<Salary> findByUserId(@Param("userId") Long userId);
}
