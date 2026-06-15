package com.abul.cmnty.cmntybackend.service;

import com.abul.cmnty.cmntybackend.dto.ClubRequest;
import com.abul.cmnty.cmntybackend.dto.ClubResponse;
import com.abul.cmnty.cmntybackend.entity.Club;
import com.abul.cmnty.cmntybackend.entity.User;
import com.abul.cmnty.cmntybackend.exception.ResourceNotFoundException;
import com.abul.cmnty.cmntybackend.exception.UnauthorizedException;
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
                .description(request.getDescription())
                .city(request.getCity())
                .category(request.getCategory())
                .host(host)
                .build();

        Club savedClub = clubRepository.save(club);
        return mapToResponse(savedClub);
    }

    public ClubResponse getClubById(Long id) {
        Club club = clubRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found with id " + id));
        return mapToResponse(club);
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

    public ClubResponse updateClub(Long clubId, ClubRequest request, Long requestingUserId) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found with id " + clubId));

        if (!club.getHost().getId().equals(requestingUserId)) {
            throw new UnauthorizedException("Only the host can update this club");
        }

        if (request.getName() != null) {
            club.setName(request.getName());
        }
        if (request.getDescription() != null) {
            club.setDescription(request.getDescription());
        }
        if (request.getCity() != null) {
            club.setCity(request.getCity());
        }
        if (request.getCategory() != null) {
            club.setCategory(request.getCategory());
        }

        return mapToResponse(clubRepository.save(club));
    }

    public void deleteClub(Long clubId, Long requestingUserId) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found with id " + clubId));

        if (!club.getHost().getId().equals(requestingUserId)) {
            throw new UnauthorizedException("Only the host can delete this club");
        }

        clubRepository.delete(club);
    }

    private ClubResponse mapToResponse(Club club) {
        return ClubResponse.builder()
                .id(club.getId())
                .name(club.getName())
                .description(club.getDescription())
                .city(club.getCity())
                .category(club.getCategory())
                .hostName(club.getHost() != null ? club.getHost().getName() : null)
                .build();
    }
}
