package com.abul.cmnty.cmntybackend.service;

import com.abul.cmnty.cmntybackend.dto.ClubRequest;
import com.abul.cmnty.cmntybackend.dto.ClubResponse;
import com.abul.cmnty.cmntybackend.entity.Club;
import com.abul.cmnty.cmntybackend.entity.User;
import com.abul.cmnty.cmntybackend.exception.ResourceNotFoundException;
import com.abul.cmnty.cmntybackend.repository.ClubRepository;
import com.abul.cmnty.cmntybackend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClubService {
    
    private final ClubRepository clubRepository;
    private final UserRepository userRepository;

    public ClubService(ClubRepository clubRepository, UserRepository userRepository) {
        this.clubRepository = clubRepository;
        this.userRepository = userRepository;
    }

    public ClubResponse createClub(ClubRequest request, Long hostId) {
        User host = userRepository.findById(hostId)
                .orElseThrow(() -> new ResourceNotFoundException("Host user not found with id " + hostId));

        Club club = Club.builder()
                .name(request.getName())
                .city(request.getCity())
                .host(host)
                .build();

        Club savedClub = clubRepository.save(club);
        return mapToResponse(savedClub);
    }

    public List<ClubResponse> getClubsByCity(String city) {
        List<Club> clubs;
        if (city != null && !city.trim().isEmpty()) {
            clubs = clubRepository.findByCity(city);
        } else {
            clubs = clubRepository.findAll();
        }
        return clubs.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private ClubResponse mapToResponse(Club club) {
        return ClubResponse.builder()
                .id(club.getId())
                .name(club.getName())
                .city(club.getCity())
                .hostName(club.getHost() != null ? club.getHost().getName() : null)
                .build();
    }
}
