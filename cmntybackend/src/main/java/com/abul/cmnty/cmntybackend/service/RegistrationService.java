package com.abul.cmnty.cmntybackend.service;

import com.abul.cmnty.cmntybackend.dto.RegistrationResponse;
import com.abul.cmnty.cmntybackend.entity.Event;
import com.abul.cmnty.cmntybackend.entity.Registration;
import com.abul.cmnty.cmntybackend.entity.User;
import com.abul.cmnty.cmntybackend.exception.AlreadyRegisteredException;
import com.abul.cmnty.cmntybackend.exception.EventFullException;
import com.abul.cmnty.cmntybackend.exception.ResourceNotFoundException;
import com.abul.cmnty.cmntybackend.exception.UnauthorizedException;
import com.abul.cmnty.cmntybackend.model.enums.EventStatus;
import com.abul.cmnty.cmntybackend.model.enums.RegistrationStatus;
import com.abul.cmnty.cmntybackend.repository.EventRepository;
import com.abul.cmnty.cmntybackend.repository.RegistrationRepository;
import com.abul.cmnty.cmntybackend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public RegistrationService(RegistrationRepository registrationRepository, EventRepository eventRepository, UserRepository userRepository) {
        this.registrationRepository = registrationRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public RegistrationResponse registerForEvent(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id " + eventId));

        if (event.getStatus() != EventStatus.UPCOMING) {
            throw new IllegalStateException("Cannot register for an event that is not UPCOMING");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + userId));

        boolean alreadyRegistered = registrationRepository.existsByEventIdAndUserIdAndStatus(eventId, userId, RegistrationStatus.CONFIRMED);
        if (alreadyRegistered) {
            throw new AlreadyRegisteredException("User is already registered for this event");
        }

        long confirmedCount = registrationRepository.countByEventIdAndStatus(eventId, RegistrationStatus.CONFIRMED);
        if (event.getCapacity() != null && confirmedCount >= event.getCapacity()) {
            throw new EventFullException("Event has reached its maximum capacity");
        }

        Registration registration = Registration.builder()
                .event(event)
                .user(user)
                .registeredAt(LocalDateTime.now())
                .status(RegistrationStatus.CONFIRMED)
                .build();

        Registration savedRegistration = registrationRepository.save(registration);

        return RegistrationResponse.builder()
                .id(savedRegistration.getId())
                .eventTitle(savedRegistration.getEvent().getTitle())
                .registeredAt(savedRegistration.getRegisteredAt())
                .status(savedRegistration.getStatus())
                .build();
    }

    public void cancelRegistration(Long eventId, Long userId) {
        Registration registration = registrationRepository.findByEventIdAndUserId(eventId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found for event " + eventId + " and user " + userId));

        registration.setStatus(RegistrationStatus.CANCELLED);
        registrationRepository.save(registration);
    }

    public List<RegistrationResponse> getEventRegistrations(Long eventId, Long requestingUserId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id " + eventId));

        if (!event.getHost().getId().equals(requestingUserId)) {
            throw new UnauthorizedException("Only the host can view registrations for this event");
        }

        return registrationRepository.findByEvent(event)
                .stream()
                .map(r -> RegistrationResponse.builder()
                        .id(r.getId())
                        .eventTitle(r.getEvent().getTitle())
                        .registeredAt(r.getRegisteredAt())
                        .status(r.getStatus())
                        .userName(r.getUser() != null ? r.getUser().getName() : null)
                        .build())
                .collect(Collectors.toList());
    }
}
