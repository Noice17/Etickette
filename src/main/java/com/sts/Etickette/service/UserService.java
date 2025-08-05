package com.sts.Etickette.service;

import com.sts.Etickette.dto.UserDTO;

import java.util.List;
import java.util.Optional;

public interface UserService {
    UserDTO createUser(UserDTO userDTO);
    UserDTO updateUser(Long id, UserDTO userDTO);
    Optional<UserDTO> getUserById(Long id);
    Optional<UserDTO> getUserByEmail(String email);
    List<UserDTO> getAllUsers();
    void deleteUser(Long id);
    boolean emailExists(String email);
}