package com.example.back_end.mapper;

import com.example.back_end.dto.request.UserCreationRequest;
import com.example.back_end.dto.response.UserResponse;
import com.example.back_end.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "avatar", ignore = true)
    User toUser(UserCreationRequest request);

    UserResponse toUserResponse(User user);
}
