package com.example.back_end.exception;

import com.example.back_end.dto.response.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.el.util.ExceptionUtils;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.HashMap;
import java.util.Map;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiResponse<Object>> handleAppException(AppException ex) {
        ApiResponse<Object> response = new ApiResponse<>();
        response.setCode(ex.getErrorCode().getCode());
        response.setMessage(ex.getErrorCode().getMessage());
        return new ResponseEntity<>(response, ex.getErrorCode().getStatusCode());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        ApiResponse<Map<String, String>> response = new ApiResponse<>();
        response.setCode(1007);
        response.setMessage("Validation failed");
        response.setResult(errors);
        
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Object>> handleConstraintViolationException(ConstraintViolationException ex) {
        ApiResponse<Object> response = new ApiResponse<>();
        response.setCode(1007);
        response.setMessage("Validation failed: " + ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGenericException(Exception ex) {
        ApiResponse<Object> response = new ApiResponse<>();
        response.setCode(1000);
        response.setMessage("An unexpected error occurred: " + ex.getMessage());
        ex.printStackTrace(); // Log the full stack trace
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        Throwable rootCause = getRootCause(ex);
        String message = "Dữ liệu không hợp lệ";
        if (rootCause instanceof SQLIntegrityConstraintViolationException sqlEx) {
            String detailedMessage = sqlEx.getMessage();
            System.out.println("🔥 Chi tiết lỗi SQL: " + detailedMessage);
            if (detailedMessage.contains("users.email_UNIQUE")) {
                message = "Email đã tồn tại";
            }
        }
        ApiResponse apiResponse = new ApiResponse();
        ErrorCode invalidPassword = ErrorCode.UNAUTHORIZED;
        apiResponse.setCode(invalidPassword.getCode());
        apiResponse.setMessage(message);
        return ResponseEntity.badRequest().body(apiResponse);
    }

    public static Throwable getRootCause(Throwable throwable) {
        Throwable cause;
        while ((cause = throwable.getCause()) != null && throwable != cause) {
            throwable = cause;
        }
        return throwable;
    }
}
