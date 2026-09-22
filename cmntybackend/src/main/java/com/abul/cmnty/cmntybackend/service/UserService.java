package com.abul.cmnty.cmntybackend.service;

import com.abul.cmnty.cmntybackend.dto.AuthRequest;
import com.abul.cmnty.cmntybackend.dto.AuthResponse;
import com.abul.cmnty.cmntybackend.dto.UserProfileRequest;
import com.abul.cmnty.cmntybackend.dto.UserProfileResponse;
import com.abul.cmnty.cmntybackend.entity.User;
import com.abul.cmnty.cmntybackend.exception.AlreadyRegisteredException;
import com.abul.cmnty.cmntybackend.exception.ResourceNotFoundException;
import com.abul.cmnty.cmntybackend.model.enums.Role;
import com.abul.cmnty.cmntybackend.repository.UserRepository;
import com.abul.cmnty.cmntybackend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Value("${cmnty.admin.email:}")
    private String bootstrapAdminEmail;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse register(AuthRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new AlreadyRegisteredException("Email is already taken");
        }

        // Bootstrap: auto-promote to ADMIN if email matches config property
        Role role = Role.USER;
        if (bootstrapAdminEmail != null && !bootstrapAdminEmail.isBlank()
                && bootstrapAdminEmail.equalsIgnoreCase(request.getEmail())) {
            role = Role.ADMIN;
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        User savedUser = userRepository.save(user);
        String token = jwtUtil.generateToken(savedUser.getId(), savedUser.getEmail(), savedUser.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .userId(savedUser.getId())
                .name(savedUser.getName())
                .role(savedUser.getRole().name())
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .role(user.getRole().name())
                .build();
    }

    public UserProfileResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));

        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole() != null ? user.getRole().name() : Role.USER.name())
                .build();
    }

    public UserProfileResponse updateProfile(Long userId, UserProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));

        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            // Check if the new email is already taken by another user
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new AlreadyRegisteredException("Email is already taken");
            }
            user.setEmail(request.getEmail());
        }

        User savedUser = userRepository.save(user);
        return UserProfileResponse.builder()
                .id(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole() != null ? savedUser.getRole().name() : Role.USER.name())
                .build();
    }
}
