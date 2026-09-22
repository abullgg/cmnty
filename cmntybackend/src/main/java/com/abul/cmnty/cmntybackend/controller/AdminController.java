package com.abul.cmnty.cmntybackend.controller;

import com.abul.cmnty.cmntybackend.dto.UserProfileResponse;
import com.abul.cmnty.cmntybackend.model.enums.Role;
import com.abul.cmnty.cmntybackend.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Admin-only user and resource management")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // GET /api/admin/users?page=0&size=20
    @GetMapping("/users")
    @Operation(summary = "List all users (paginated) — admin only")
    public ResponseEntity<Page<UserProfileResponse>> listUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(adminService.listUsers(page, size));
    }

    // PATCH /api/admin/users/{id}/role?role=ADMIN
    @PatchMapping("/users/{id}/role")
    @Operation(summary = "Change a user's role — admin only. Cannot remove last admin.")
    public ResponseEntity<UserProfileResponse> changeUserRole(
            @PathVariable Long id,
            @RequestParam Role role) {
        return ResponseEntity.ok(adminService.changeUserRole(id, role));
    }

    // DELETE /api/admin/events/{id}
    @DeleteMapping("/events/{id}")
    @Operation(summary = "Force-delete any event regardless of host — admin only")
    public ResponseEntity<Void> forceDeleteEvent(@PathVariable Long id) {
        adminService.forceDeleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    // DELETE /api/admin/clubs/{id}
    @DeleteMapping("/clubs/{id}")
    @Operation(summary = "Force-delete any club regardless of host — admin only")
    public ResponseEntity<Void> forceDeleteClub(@PathVariable Long id) {
        adminService.forceDeleteClub(id);
        return ResponseEntity.noContent().build();
    }
}
