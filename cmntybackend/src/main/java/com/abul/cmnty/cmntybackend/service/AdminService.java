package com.abul.cmnty.cmntybackend.service;

import com.abul.cmnty.cmntybackend.dto.UserProfileResponse;
import com.abul.cmnty.cmntybackend.entity.Club;
import com.abul.cmnty.cmntybackend.entity.Event;
import com.abul.cmnty.cmntybackend.entity.Registration;
import com.abul.cmnty.cmntybackend.entity.User;
import com.abul.cmnty.cmntybackend.exception.ResourceNotFoundException;
import com.abul.cmnty.cmntybackend.model.enums.Role;
import com.abul.cmnty.cmntybackend.repository.ClubRepository;
import com.abul.cmnty.cmntybackend.repository.EventRepository;
import com.abul.cmnty.cmntybackend.repository.RegistrationRepository;
import com.abul.cmnty.cmntybackend.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final ClubRepository clubRepository;
    private final RegistrationRepository registrationRepository;

    public AdminService(UserRepository userRepository, EventRepository eventRepository,
                        ClubRepository clubRepository, RegistrationRepository registrationRepository) {
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.clubRepository = clubRepository;
        this.registrationRepository = registrationRepository;
    }

    public Page<UserProfileResponse> listUsers(int page, int size) {
        var pageable = PageRequest.of(page, size, Sort.by("id").ascending());
        return userRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Transactional
    public UserProfileResponse changeUserRole(Long userId, Role newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));

        // Protect against removing the last admin
        if (user.getRole() == Role.ADMIN && newRole != Role.ADMIN) {
            long adminCount = userRepository.countByRole(Role.ADMIN);
            if (adminCount <= 1) {
                throw new IllegalStateException("Cannot remove the last admin. Promote another user first.");
            }
        }

        user.setRole(newRole);
        User saved = userRepository.save(user);
        return mapToResponse(saved);
    }

    @Transactional
    public void forceDeleteEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id " + eventId));

        // Delete all registrations for this event first
        List<Registration> registrations = registrationRepository.findByEvent(event);
        registrationRepository.deleteAll(registrations);

        eventRepository.delete(event);
    }

    @Transactional
    public void forceDeleteClub(Long clubId) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new ResourceNotFoundException("Club not found with id " + clubId));
        clubRepository.delete(club);
    }

    private UserProfileResponse mapToResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole() != null ? user.getRole().name() : Role.USER.name())
                .build();
    }
}
