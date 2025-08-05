package com.sts.Etickette.controller;

import com.sts.Etickette.dto.UserDTO;
import com.sts.Etickette.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    private static final String UPLOAD_DIR = "uploads/avatars/";

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    //Create
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> createUser(
            @Valid @RequestPart("user") UserDTO userDTO,
            @RequestPart(value="image", required = false)MultipartFile image) throws IOException {

        if(image != null && !image.isEmpty()){
            userDTO.setAvatarUrl(saveImage(image));
        }

        UserDTO created = userService.createUser(userDTO);
        return ResponseEntity.ok(created);
    }

    //Read
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
    //Update
    @PutMapping(path = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Long id,
            @Valid @RequestPart("user")  UserDTO userDTO,
            @RequestPart(value = "image", required = false) MultipartFile image) throws  IOException{
        if (image != null && !image.isEmpty()){
            userDTO.setAvatarUrl(saveImage(image));
        }

        try {
            UserDTO updated = userService.updateUser(id, userDTO);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    //Delete
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    //Authentication
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(Authentication authentication){
        String email = authentication.getName();
        return userService.getUserByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    //Helper
    private String saveImage(MultipartFile file) throws  IOException{
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path uploadPath = Paths.get(UPLOAD_DIR);
        Files.createDirectories(uploadPath);
        Files.copy(file.getInputStream(),
                uploadPath.resolve(filename),
                StandardCopyOption.REPLACE_EXISTING);
        return "/uploads/avatars/"  + filename;
    }
}
