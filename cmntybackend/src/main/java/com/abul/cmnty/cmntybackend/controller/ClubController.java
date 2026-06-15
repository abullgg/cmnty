package com.abul.cmnty.cmntybackend.controller;

import com.abul.cmnty.cmntybackend.dto.ClubRequest;
import com.abul.cmnty.cmntybackend.dto.ClubResponse;
import com.abul.cmnty.cmntybackend.service.ClubService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clubs")
@Tag(name = "Clubs", description = "Create, browse, update, and delete clubs")
public class ClubController {

    private final ClubService clubService;

    public ClubController(ClubService clubService) {
        this.clubService = clubService;
    }

    private Long getCurrentUserId() {
        return (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    // GET /api/clubs?city=...
    @GetMapping
    @Operation(summary = "Browse all clubs with optional city filter")
    public ResponseEntity<List<ClubResponse>> getClubsByCity(
            @RequestParam(required = false) String city) {
        return ResponseEntity.ok(clubService.getClubsByCity(city));
    }

    // GET /api/clubs/{id}
    @GetMapping("/{id}")
    @Operation(summary = "Get a club by ID")
    public ResponseEntity<ClubResponse> getClubById(@PathVariable Long id) {
        return ResponseEntity.ok(clubService.getClubById(id));
    }

    // POST /api/clubs
    @PostMapping
    @Operation(summary = "Create a new club (authenticated)")
    public ResponseEntity<ClubResponse> createClub(
            @RequestBody ClubRequest request) {
        Long hostId = getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(clubService.createClub(request, hostId));
    }

    // PUT /api/clubs/{id}
    @PutMapping("/{id}")
    @Operation(summary = "Update a club — host only")
    public ResponseEntity<ClubResponse> updateClub(
            @PathVariable Long id,
            @RequestBody ClubRequest request) {
        Long hostId = getCurrentUserId();
        return ResponseEntity.ok(clubService.updateClub(id, request, hostId));
    }

    // DELETE /api/clubs/{id}
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a club — host only")
    public ResponseEntity<Void> deleteClub(@PathVariable Long id) {
        Long hostId = getCurrentUserId();
        clubService.deleteClub(id, hostId);
        return ResponseEntity.noContent().build();
    }
}
