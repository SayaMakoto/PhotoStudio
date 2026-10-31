package com.photostudio.repository;

import com.photostudio.model.salaries.SalaryCommissionDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SalaryCommissionDetailRepository extends JpaRepository<SalaryCommissionDetail, Long> {

    @Query("SELECT d FROM SalaryCommissionDetail d WHERE d.salary.id = :salaryId ORDER BY d.shootDate ASC")
    List<SalaryCommissionDetail> findBySalaryId(@Param("salaryId") Long salaryId);
}
