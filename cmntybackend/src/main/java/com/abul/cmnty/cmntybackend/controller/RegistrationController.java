package com.abul.cmnty.cmntybackend.controller;

import com.abul.cmnty.cmntybackend.dto.RegistrationResponse;
import com.abul.cmnty.cmntybackend.service.RegistrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
@Tag(name = "Registrations", description = "Register and cancel event attendance")
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    private Long getCurrentUserId() {
        return (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    // POST /api/events/{eventId}/register
    @PostMapping("/{eventId}/register")
    @Operation(summary = "Register for an event (authenticated)")
    public ResponseEntity<RegistrationResponse> registerForEvent(
            @PathVariable Long eventId) {
        Long userId = getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(registrationService.registerForEvent(eventId, userId));
    }

    // DELETE /api/events/{eventId}/register
    @DeleteMapping("/{eventId}/register")
    @Operation(summary = "Cancel your registration")
    public ResponseEntity<Void> cancelRegistration(
            @PathVariable Long eventId) {
        Long userId = getCurrentUserId();
        registrationService.cancelRegistration(eventId, userId);
        return ResponseEntity.noContent().build();
    }
}
