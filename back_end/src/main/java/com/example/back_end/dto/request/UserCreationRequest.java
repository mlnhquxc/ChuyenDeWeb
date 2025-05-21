package com.example.back_end.dto.request;

import com.example.back_end.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.NonFinal;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@Data
public class UserCreationRequest {
    @NotBlank(message = "Username không được để trống")
    private String username;
    
    @NotBlank(message = "Password không được để trống")
    @Size(min = 8, message = "Password phải có ít nhất 8 ký tự")
    private String password;
    
    @NotBlank(message = "Họ tên không được để trống")
    private String fullname;
    
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;
    
    @NotBlank(message = "Số điện thoại không được để trống")
    private String phone;
    
    private Boolean active = false;
}
