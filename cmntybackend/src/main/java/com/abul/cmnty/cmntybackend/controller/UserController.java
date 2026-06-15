package com.abul.cmnty.cmntybackend.controller;

import com.abul.cmnty.cmntybackend.dto.UserProfileRequest;
import com.abul.cmnty.cmntybackend.dto.UserProfileResponse;
import com.abul.cmnty.cmntybackend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Users", description = "User profile management")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    private Long getCurrentUserId() {
        return (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    // GET /api/users/me
    @GetMapping("/me")
    @Operation(summary = "Get current user's profile")
    public ResponseEntity<UserProfileResponse> getMyProfile() {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(userService.getProfile(userId));
    }

    // PUT /api/users/me
    @PutMapping("/me")
    @Operation(summary = "Update current user's profile")
    public ResponseEntity<UserProfileResponse> updateMyProfile(
            @RequestBody UserProfileRequest request) {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(userService.updateProfile(userId, request));
    }
}
