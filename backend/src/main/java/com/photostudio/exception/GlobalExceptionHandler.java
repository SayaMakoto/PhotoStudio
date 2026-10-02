
package com.photostudio.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleBadRequest(
            IllegalArgumentException ex) {

        String message = ex.getMessage();
        HttpStatus status = message != null
                && message.startsWith("Không tìm thấy thiết bị")
            ? HttpStatus.NOT_FOUND
            : HttpStatus.BAD_REQUEST;

        return ResponseEntity.status(status)
            .body(Map.of("message", message));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDatabaseError(
            DataIntegrityViolationException ex) {

        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(Map.of(
                "message",
                "Dữ liệu bị trùng hoặc vi phạm ràng buộc CSDL"
            ));
    }
}