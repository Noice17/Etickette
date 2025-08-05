package com.sts.Etickette.service.implementation;

import com.sts.Etickette.dto.UserDTO;
import com.sts.Etickette.entity.User;
import com.sts.Etickette.exception.EmailAlreadyExistsException;
import com.sts.Etickette.mapper.UserMapper;
import com.sts.Etickette.repository.UserRepository;
import com.sts.Etickette.service.UserService;
import com.sts.Etickette.repository.AgentRepository;
import com.sts.Etickette.entity.Agent;

import com.sts.Etickette.util.MessageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MessageUtil messageUtil;
    private final AgentRepository agentRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, MessageUtil messageUtil, AgentRepository agentRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.messageUtil = messageUtil;
        this.agentRepository = agentRepository;
    }


    @Override
    public UserDTO createUser(UserDTO userDTO) {
        if(userRepository.existsByEmail(userDTO.getEmail())){
            throw new EmailAlreadyExistsException(messageUtil.getMessage("error.email.exists", userDTO.getEmail()));
        }

        User user = UserMapper.toEntity(userDTO);
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));

        User saved = userRepository.save(user);

        if (userDTO.getRole() == User.UserRole.AGENT) {
            Agent agent = new Agent();
            agent.setUser(saved);
            agent.setMaxWorkload(25);
            agent.setCurrentWorkload(0);
            agentRepository.save(agent);
        }

        return UserMapper.toDTO(saved);
    }

    @Override
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("error.user.not_found")
//                        new UserNotFoundException(messageUtil.getMessage("error.user.not_found", id))
                );
        if(userDTO.getUsername() != null) user.setUsername(userDTO.getUsername());
        if(userDTO.getEmail() != null) user.setEmail(userDTO.getEmail());
        if(userDTO.getPassword() != null && !userDTO.getPassword().isBlank()){
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }

        if(userDTO.getRole() != null) user.setRole(userDTO.getRole());
        if(userDTO.getAvatarUrl() != null) user.setAvatarUrl(userDTO.getAvatarUrl());

        User updated = userRepository.save(user);
        return UserMapper.toDTO(updated);
    }

    @Override
    public Optional<UserDTO> getUserById(Long id) {
        return userRepository.findById(id)
                .map(UserMapper::toDTO);
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteUser(Long id) {
        if(!userRepository.existsById(id)){
            throw new RuntimeException("error.user.not_found");
//            throw new UserNotFoundException(messageUtil.getMessage("error.user.not_found",id));
        }
    }

    @Override
    public Optional<UserDTO> getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(UserMapper::toDTO);
    }

    @Override
    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }
}
