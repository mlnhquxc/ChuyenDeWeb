package com.example.back_end.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@AllArgsConstructor
@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(1000, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Uncategorized error", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002, "User existed", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1003, "Username must be at least {min} characters", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1004, "Password must be at least 8 characters", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1005, "User not existed", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "You do not have permission", HttpStatus.FORBIDDEN),
    INVALID_DOB(1008, "Your age must be at least {min}", HttpStatus.BAD_REQUEST),
    FILE_UPLOAD_FAILED(1009, "Failed to upload file", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_USERNAME(1010, "Username must not be empty", HttpStatus.BAD_REQUEST),
    INVALID_EMAIL(1011, "Email must not be empty", HttpStatus.BAD_REQUEST),
    PASSWORD_TOO_SHORT(1012, "Password must be at least 6 characters", HttpStatus.BAD_REQUEST),
    INVALID_FULLNAME(1013, "Fullname must not be empty", HttpStatus.BAD_REQUEST),
    
    // Product related errors
    PRODUCT_NOT_FOUND(2000, "Product not found", HttpStatus.NOT_FOUND),
    
    // Cart related errors
    CART_NOT_FOUND(3000, "Cart not found", HttpStatus.NOT_FOUND),
    ITEM_NOT_FOUND(3001, "Item not found", HttpStatus.NOT_FOUND),
    INVALID_QUANTITY(3002, "Quantity must be greater than zero", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED_ACCESS(3003, "You do not have permission to access this resource", HttpStatus.FORBIDDEN),
    
    // Wishlist related errors
    WISHLIST_NOT_FOUND(4000, "Wishlist not found", HttpStatus.NOT_FOUND),
    WISHLIST_ITEM_NOT_FOUND(4001, "Wishlist item not found", HttpStatus.NOT_FOUND),
    PRODUCT_ALREADY_IN_WISHLIST(4002, "Product is already in wishlist", HttpStatus.BAD_REQUEST),
    
    // Email verification related errors
    INVALID_TOKEN(5000, "Invalid or malformed token", HttpStatus.BAD_REQUEST),
    TOKEN_EXPIRED(5001, "Token has expired", HttpStatus.BAD_REQUEST),
    EMAIL_ALREADY_VERIFIED(5002, "Email is already verified", HttpStatus.BAD_REQUEST),
    EMAIL_NOT_VERIFIED(5003, "Email is not verified", HttpStatus.BAD_REQUEST),
    ;

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}
