package com.photostudio.service.impl;

import com.photostudio.dto.employeereviews.EmployeeReviewRequest;
import com.photostudio.dto.employeereviews.EmployeeReviewResponse;
import com.photostudio.mapper.EmployeeReviewMapper;
import com.photostudio.model.employeereviews.EmployeeReview;
import com.photostudio.model.employees.Employee;
import com.photostudio.repository.EmployeeRepository;
import com.photostudio.repository.EmployeeReviewRepository;
import com.photostudio.service.EmployeeReviewService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class EmployeeReviewServiceImpl implements EmployeeReviewService {

    private final EmployeeReviewRepository repository;
    private final EmployeeRepository employeeRepository;

    // Khi có ReviewRepository (bảng reviews), inject thêm vào đây để kiểm tra reviewId tồn tại:
    // private final ReviewRepository reviewRepository;

    public EmployeeReviewServiceImpl(
            EmployeeReviewRepository repository,
            EmployeeRepository employeeRepository
            // ReviewRepository reviewRepository
    ) {
        this.repository = repository;
        this.employeeRepository = employeeRepository;
        // this.reviewRepository = reviewRepository;
    }

    private EmployeeReview findEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy đánh giá nhân viên có id: " + id));
    }

    private Employee findEmployee(Long employeeId) {
        return employeeRepository.findById(employeeId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy nhân viên có id: " + employeeId));
    }

    private void checkDuplicate(Long reviewId, Long employeeId, Long excludeId) {
        if (repository.existsDuplicate(reviewId, employeeId, excludeId)) {
            throw new IllegalArgumentException(
                    "Nhân viên (id: " + employeeId + ") đã được đánh giá trong bài review (id: " + reviewId + ")");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeReviewResponse> findAll() {
        return repository.findAll().stream().map(EmployeeReviewMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeReviewResponse findById(Long id) {
        return EmployeeReviewMapper.toResponse(findEntity(id));
    }

    @Override
    public EmployeeReviewResponse create(EmployeeReviewRequest request) {
        request.validate();

        Employee employee = findEmployee(request.getEmployeeId());

        // Ràng buộc khi có entity Review (bảng reviews):
        // if (!reviewRepository.existsById(request.getReviewId())) {
        //     throw new IllegalArgumentException("Không tìm thấy bài đánh giá có id: " + request.getReviewId());
        // }

        checkDuplicate(request.getReviewId(), request.getEmployeeId(), null);

        EmployeeReview saved = repository.save(EmployeeReviewMapper.toEntity(request, employee));
        return EmployeeReviewMapper.toResponse(saved);
    }

    @Override
    public EmployeeReviewResponse update(Long id, EmployeeReviewRequest request) {
        request.validate();

        EmployeeReview review = findEntity(id);
        Employee employee = findEmployee(request.getEmployeeId());

        checkDuplicate(request.getReviewId(), request.getEmployeeId(), id);

        EmployeeReviewMapper.updateEntity(request, review, employee);
        return EmployeeReviewMapper.toResponse(repository.save(review));
    }

    @Override
    public void delete(Long id) {
        repository.delete(findEntity(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeReviewResponse> findByReviewId(Long reviewId) {
        if (reviewId == null || reviewId <= 0) {
            throw new IllegalArgumentException("Mã bài đánh giá không hợp lệ");
        }
        return repository.findByReviewId(reviewId).stream()
                .map(EmployeeReviewMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeReviewResponse> findByEmployeeId(Long employeeId) {
        if (employeeId == null || employeeId <= 0) {
            throw new IllegalArgumentException("Mã nhân viên không hợp lệ");
        }
        return repository.findByEmployeeId(employeeId).stream()
                .map(EmployeeReviewMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getEmployeeRatingSummary(Long employeeId) {
        if (employeeId == null || employeeId <= 0) {
            throw new IllegalArgumentException("Mã nhân viên không hợp lệ");
        }
        findEmployee(employeeId);

        Double average = repository.findAverageRatingByEmployeeId(employeeId);

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("employeeId", employeeId);
        summary.put("totalReviews", repository.countByEmployeeId(employeeId));
        summary.put("averageRating", average != null ? Math.round(average * 100.0) / 100.0 : null);
        return summary;
    }
}
