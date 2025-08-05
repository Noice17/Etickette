package com.sts.Etickette.util;

import com.sts.Etickette.entity.User;
import com.sts.Etickette.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    public CommandLineRunner initData(){
        return args ->{
                //Create User
//                User admin = new User();
//                admin.setUsername("Admin");
//                admin.setEmail("admin@email.com");
//                admin.setPassword(passwordEncoder.encode("password"));
//                admin.setRole(User.UserRole.ADMIN);
//                admin.setCreatedAt(LocalDateTime.now());
//                admin.setUpdatedAt(LocalDateTime.now());
//                userRepository.save(admin);
//
//                User client = new User();
//                client.setUsername("Client");
//                client.setEmail("client@email.com");
//                client.setPassword(passwordEncoder.encode("password"));
//                client.setRole(User.UserRole.CLIENT);
//                client.setCreatedAt(LocalDateTime.now());
//                client.setUpdatedAt(LocalDateTime.now());
//                userRepository.save(client);

            };
        };
    }
