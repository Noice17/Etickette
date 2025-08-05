package com.sts.Etickette.mapper;

import com.sts.Etickette.dto.UserDTO;
import com.sts.Etickette.entity.User;

public class UserMapper {

    public static User toEntity(UserDTO dto){
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setRole(dto.getRole());
        user.setAvatarUrl(dto.getAvatarUrl());
        return  user;
    }

    public static UserDTO toDTO(User user){
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        dto.setAvatarUrl(user.getAvatarUrl());
        return dto;
    }
}
