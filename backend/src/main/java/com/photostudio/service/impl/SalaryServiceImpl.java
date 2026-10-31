package com.photostudio.service.impl;

import com.photostudio.dto.salaries.SalaryCommissionDetailResponse;
import com.photostudio.dto.salaries.SalaryResponse;
import com.photostudio.model.bookings.Booking;
import com.photostudio.model.bookings.BookingEmployeeAssignment;
import com.photostudio.model.bookings.BookingPackage;
import com.photostudio.model.bookings.BookingStatus;
import com.photostudio.model.employees.Employee;
import com.photostudio.model.employees.EmployeePosition;
import com.photostudio.model.salaries.Salary;
import com.photostudio.model.salaries.SalaryCommissionDetail;
import com.photostudio.model.salaries.SalaryStatus;
import com.photostudio.repository.*;
import com.photostudio.service.SalaryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class SalaryServiceImpl implements SalaryService {

    private final SalaryRepository salaryRepository;
    private final SalaryCommissionDetailRepository commissionDetailRepository;
    private final EmployeeRepository employeeRepository;
    private final BookingRepository bookingRepository;
    private final BookingEmployeeAssignmentRepository assignmentRepository;
    private final BookingPackageRepository bookingPackageRepository;

    public SalaryServiceImpl(
            SalaryRepository salaryRepository,
            SalaryCommissionDetailRepository commissionDetailRepository,
            EmployeeRepository employeeRepository,
            BookingRepository bookingRepository,
            BookingEmployeeAssignmentRepository assignmentRepository,
            BookingPackageRepository bookingPackageRepository) {
        this.salaryRepository = salaryRepository;
        this.commissionDetailRepository = commissionDetailRepository;
        this.employeeRepository = employeeRepository;
        this.bookingRepository = bookingRepository;
        this.assignmentRepository = assignmentRepository;
        this.bookingPackageRepository = bookingPackageRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SalaryResponse> findAll(Integer month, Integer year) {
        List<Salary> list;
        if (month != null && year != null) {
            list = salaryRepository.findByMonthAndYear(month, year);
        } else {
            list = salaryRepository.findAll();
        }
        return list.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public SalaryResponse findById(Long id) {
        Salary salary = salaryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phiếu lương #" + id));
        return mapToResponse(salary);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SalaryResponse> findByEmployeeId(Long employeeId) {
        return salaryRepository.findByEmployeeId(employeeId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SalaryResponse> findByUserId(Long userId) {
        return salaryRepository.findByUserId(userId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<SalaryResponse> calculateMonthlySalaries(Integer month, Integer year) {
        if (month == null || year == null) {
            LocalDate now = LocalDate.now();
            month = now.getMonthValue();
            year = now.getYear();
        }

        List<Employee> employees = employeeRepository.findAll();
        List<SalaryResponse> results = new ArrayList<>();

        for (Employee emp : employees) {
            // Đơn giá ngày công: 250.000 đ cho photographer, 200.000 đ cho các vị trí khác
            double dailyRate = (emp.getPosition() == EmployeePosition.photographer) ? 250000.0 : 200000.0;
            double commissionRate = 0.10; // 10% hoa hồng trên từng gói chụp

            Salary salary = salaryRepository.findByEmployeeIdAndMonthAndYear(emp.getId(), month, year)
                    .orElseGet(() -> {
                        Salary s = new Salary();
                        s.setEmployee(emp);
                        s.setMonth(emp.getId().intValue());
                        s.setYear(emp.getId().intValue());
                        s.setStatus(SalaryStatus.pending);
                        return s;
                    });

            salary.setEmployee(emp);
            salary.setMonth(month);
            salary.setYear(year);
            salary.setDailyRate(dailyRate);
            salary.setCommissionRate(commissionRate);

            // Tìm tất cả booking trong tháng mà nhân viên được phân công
            List<Booking> allBookings = bookingRepository.findAll();
            Set<LocalDate> workedDates = new HashSet<>();
            List<SalaryCommissionDetail> details = new ArrayList<>();
            int completedShoots = 0;
            double totalCommission = 0.0;

            final int targetMonth = month;
            final int targetYear = year;

            for (Booking b : allBookings) {
                if (b.getBookingDate() == null) continue;
                LocalDate bDate = b.getBookingDate().toLocalDate();
                if (bDate.getMonthValue() != targetMonth || bDate.getYear() != targetYear) continue;

                List<BookingEmployeeAssignment> assignments = assignmentRepository.findByBookingIdAndEmployeeId(b.getId(), emp.getId());
                boolean isAssigned = assignments.stream().anyMatch(a -> a.getStatus() != null && !a.getStatus().name().equalsIgnoreCase("cancelled"));

                if (isAssigned) {
                    workedDates.add(bDate);

                    // Nếu ca chụp đã hoàn thành, tính hoa hồng cho các gói
                    if (b.getStatus() == BookingStatus.completed) {
                        completedShoots++;
                        List<BookingPackage> packages = bookingPackageRepository.findByBookingId(b.getId());
                        for (BookingPackage bp : packages) {
                            double unitPrice = bp.getUnitPrice() != null ? bp.getUnitPrice() : 1000000.0;
                            int quantity = bp.getQuantity() != null ? bp.getQuantity() : 1;
                            double pkgPrice = unitPrice * quantity;
                            double commAmt = pkgPrice * commissionRate;
                            totalCommission += commAmt;

                            SalaryCommissionDetail scd = new SalaryCommissionDetail();
                            scd.setSalary(salary);
                            scd.setBooking(b);
                            scd.setPackageId(bp.getPackageEntity() != null ? bp.getPackageEntity().getId() : 1L);
                            scd.setPackageName(bp.getPackageEntity() != null && bp.getPackageEntity().getName() != null
                                    ? bp.getPackageEntity().getName()
                                    : "Gói chụp Studio");
                            scd.setPackagePrice(pkgPrice);
                            scd.setCommissionRate(commissionRate);
                            scd.setCommissionAmount(commAmt);
                            scd.setShootDate(bDate);
                            scd.setCustomerName(b.getCustomer() != null ? b.getCustomer().getFullname() : "Khách hàng");
                            details.add(scd);
                        }
                    }
                }
            }

            int workDays = workedDates.size();
            // Nếu là dữ liệu mẫu hoặc chưa có lịch chụp nhưng đã có trong DB
            if (workDays == 0 && salary.getWorkDays() != null && salary.getWorkDays() > 0) {
                workDays = salary.getWorkDays();
            }

            salary.setWorkDays(workDays);
            salary.setBaseSalary(workDays * dailyRate);
            salary.setTotalShoots(completedShoots);
            salary.setTotalCommission(totalCommission);
            salary.calculateNetSalary();

            Salary savedSalary = salaryRepository.save(salary);

            if (!details.isEmpty()) {
                // Xóa chi tiết cũ nếu có
                List<SalaryCommissionDetail> oldDetails = commissionDetailRepository.findBySalaryId(savedSalary.getId());
                commissionDetailRepository.deleteAll(oldDetails);
                for (SalaryCommissionDetail d : details) {
                    d.setSalary(savedSalary);
                    commissionDetailRepository.save(d);
                }
            }

            results.add(mapToResponse(savedSalary));
        }

        return results;
    }

    @Override
    public SalaryResponse updateStatus(Long id, Map<String, Object> payload) {
        Salary salary = salaryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy phiếu lương #" + id));

        if (payload.containsKey("status") && payload.get("status") != null) {
            String statusStr = String.valueOf(payload.get("status"));
            try {
                SalaryStatus newStatus = SalaryStatus.valueOf(statusStr.toLowerCase());
                salary.setStatus(newStatus);
                if (newStatus == SalaryStatus.paid && salary.getPaidAt() == null) {
                    salary.setPaidAt(LocalDateTime.now());
                }
            } catch (Exception ignored) {}
        }

        if (payload.containsKey("workDays") && payload.get("workDays") != null) {
            salary.setWorkDays(Integer.parseInt(String.valueOf(payload.get("workDays"))));
        }
        if (payload.containsKey("dailyRate") && payload.get("dailyRate") != null) {
            salary.setDailyRate(Double.parseDouble(String.valueOf(payload.get("dailyRate"))));
        }
        if (payload.containsKey("bonus") && payload.get("bonus") != null) {
            salary.setBonus(Double.parseDouble(String.valueOf(payload.get("bonus"))));
        }
        if (payload.containsKey("deduction") && payload.get("deduction") != null) {
            salary.setDeduction(Double.parseDouble(String.valueOf(payload.get("deduction"))));
        }
        if (payload.containsKey("note")) {
            salary.setNote((String) payload.get("note"));
        }

        salary.calculateNetSalary();
        Salary updated = salaryRepository.save(salary);
        return mapToResponse(updated);
    }

    @Override
    public void delete(Long id) {
        if (!salaryRepository.existsById(id)) {
            throw new IllegalArgumentException("Không tìm thấy phiếu lương #" + id);
        }
        salaryRepository.deleteById(id);
    }

    private SalaryResponse mapToResponse(Salary s) {
        SalaryResponse res = new SalaryResponse();
        res.setId(s.getId());
        if (s.getEmployee() != null) {
            res.setEmployeeId(s.getEmployee().getId());
            res.setPosition(s.getEmployee().getPosition() != null ? s.getEmployee().getPosition().name() : "photographer");
            if (s.getEmployee().getUser() != null) {
                res.setUserId(s.getEmployee().getUser().getId());
                res.setEmployeeName(s.getEmployee().getUser().getFullname());
                res.setEmployeePhone(s.getEmployee().getUser().getPhone());
                res.setEmployeeEmail(s.getEmployee().getUser().getEmail());
            }
        }
        res.setMonth(s.getMonth());
        res.setYear(s.getYear());
        res.setWorkDays(s.getWorkDays());
        res.setDailyRate(s.getDailyRate());
        res.setBaseSalary(s.getBaseSalary());
        res.setTotalShoots(s.getTotalShoots());
        res.setCommissionRate(s.getCommissionRate());
        res.setTotalCommission(s.getTotalCommission());
        res.setBonus(s.getBonus());
        res.setDeduction(s.getDeduction());
        res.setNetSalary(s.getNetSalary());
        res.setStatus(s.getStatus() != null ? s.getStatus().name() : "pending");
        res.setNote(s.getNote());
        res.setPaidAt(s.getPaidAt());
        res.setCreatedAt(s.getCreatedAt());
        res.setUpdatedAt(s.getUpdatedAt());

        List<SalaryCommissionDetail> details = commissionDetailRepository.findBySalaryId(s.getId());
        res.setCommissionDetails(details.stream().map(d -> new SalaryCommissionDetailResponse(
                d.getId(),
                s.getId(),
                d.getBooking() != null ? d.getBooking().getId() : null,
                d.getPackageId(),
                d.getPackageName(),
                d.getPackagePrice(),
                d.getCommissionRate(),
                d.getCommissionAmount(),
                d.getShootDate(),
                d.getCustomerName(),
                d.getCreatedAt()
        )).collect(Collectors.toList()));

        return res;
    }
}
