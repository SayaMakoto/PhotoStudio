package com.photostudio.repository;

import com.photostudio.model.employees.Employee;
import com.photostudio.model.employees.EmployeePosition;
import com.photostudio.model.employees.EmployeeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    @Query("SELECT e FROM Employee e WHERE e.user.id = :userId")
    Optional<Employee> findByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(e) > 0 FROM Employee e WHERE e.user.id = :userId")
    boolean existsByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(e) > 0 FROM Employee e WHERE e.user.id = :userId AND e.id <> :id")
    boolean existsByUserIdAndIdNot(@Param("userId") Long userId, @Param("id") Long id);

    List<Employee> findByPosition(EmployeePosition position);

    List<Employee> findByStatus(EmployeeStatus status);
}
