package com.abul.cmnty.cmntybackend.controller;

import com.abul.cmnty.cmntybackend.dto.EventRequest;
import com.abul.cmnty.cmntybackend.dto.EventResponse;
import com.abul.cmnty.cmntybackend.dto.RegistrationResponse;
import com.abul.cmnty.cmntybackend.service.EventService;
import com.abul.cmnty.cmntybackend.service.RegistrationService;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;
    private final RegistrationService registrationService;

    public EventController(EventService eventService, RegistrationService registrationService) {
        this.eventService = eventService;
        this.registrationService = registrationService;
    }

    // GET /api/events?city=...&page=0&size=10
    @GetMapping
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

    // POST /api/events?hostId=...
    @PostMapping
    public ResponseEntity<EventResponse> createEvent(
            @RequestBody EventRequest request,
            @RequestParam Long hostId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(eventService.createEvent(request, hostId));
    }

    // PUT /api/events/{id}?hostId=...
    @PutMapping("/{id}")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable Long id,
            @RequestBody EventRequest request,
            @RequestParam Long hostId) {
        return ResponseEntity.ok(eventService.updateEvent(id, request, hostId));
    }

    // PATCH /api/events/{id}/cancel?hostId=...
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<EventResponse> cancelEvent(
            @PathVariable Long id,
            @RequestParam Long hostId) {
        return ResponseEntity.ok(eventService.cancelEvent(id, hostId));
    }

    // GET /api/events/{id}/registrations?hostId=...
    @GetMapping("/{id}/registrations")
    public ResponseEntity<List<RegistrationResponse>> getEventRegistrations(
            @PathVariable Long id,
            @RequestParam Long hostId) {
        return ResponseEntity.ok(registrationService.getEventRegistrations(id, hostId));
    }
}
