package com.abul.cmnty.cmntybackend.controller;

import com.abul.cmnty.cmntybackend.dto.EventRequest;
import com.abul.cmnty.cmntybackend.dto.EventResponse;
import com.abul.cmnty.cmntybackend.dto.RegistrationResponse;
import com.abul.cmnty.cmntybackend.service.EventService;
import com.abul.cmnty.cmntybackend.service.RegistrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@Tag(name = "Events", description = "Create, browse, and manage events")
public class EventController {

    private final EventService eventService;
    private final RegistrationService registrationService;

    public EventController(EventService eventService, RegistrationService registrationService) {
        this.eventService = eventService;
        this.registrationService = registrationService;
    }

    private Long getCurrentUserId() {
        return (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    // GET /api/events?city=...&page=0&size=10
    @GetMapping
    @Operation(summary = "Browse all events with optional city filter, paginated")
    public ResponseEntity<Page<EventResponse>> getAllEvents(
            @RequestParam(required = false) String city,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(eventService.getAllEvents(city, page, size));
    }

    // GET /api/events/{id}
    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    // GET /api/events/search?city=...&from=...&to=...&page=0&size=10
    @GetMapping("/search")
    public ResponseEntity<Page<EventResponse>> searchByDateRange(
            @RequestParam(required = false) String city,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(eventService.getEventsByDateRange(city, from, to, page, size));
    }

    // POST /api/events
    @PostMapping
    @Operation(summary = "Create a new event (authenticated)")
    public ResponseEntity<EventResponse> createEvent(
            @RequestBody EventRequest request) {
        Long hostId = getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(eventService.createEvent(request, hostId));
    }

    // PUT /api/events/{id}
    @PutMapping("/{id}")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable Long id,
            @RequestBody EventRequest request) {
        Long hostId = getCurrentUserId();
        return ResponseEntity.ok(eventService.updateEvent(id, request, hostId));
    }

    // PATCH /api/events/{id}/cancel
    @PatchMapping("/{id}/cancel")
    @Operation(summary = "Cancel an event — host only")
    public ResponseEntity<EventResponse> cancelEvent(
            @PathVariable Long id) {
        Long hostId = getCurrentUserId();
        return ResponseEntity.ok(eventService.cancelEvent(id, hostId));
    }

    // GET /api/events/{id}/registrations
    @GetMapping("/{id}/registrations")
    public ResponseEntity<List<RegistrationResponse>> getEventRegistrations(
            @PathVariable Long id) {
        Long hostId = getCurrentUserId();
        return ResponseEntity.ok(registrationService.getEventRegistrations(id, hostId));
    }
}
