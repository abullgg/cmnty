package com.abul.cmnty.cmntybackend.controller;

import com.abul.cmnty.cmntybackend.dto.ClubRequest;
import com.abul.cmnty.cmntybackend.dto.ClubResponse;
import com.abul.cmnty.cmntybackend.service.ClubService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clubs")
@Tag(name = "Clubs", description = "Create and browse clubs")
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
    public ResponseEntity<List<ClubResponse>> getClubsByCity(
            @RequestParam(required = false) String city) {
        return ResponseEntity.ok(clubService.getClubsByCity(city));
    }

    // POST /api/clubs
    @PostMapping
    public ResponseEntity<ClubResponse> createClub(
            @RequestBody ClubRequest request) {
        Long hostId = getCurrentUserId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(clubService.createClub(request, hostId));
    }
}
