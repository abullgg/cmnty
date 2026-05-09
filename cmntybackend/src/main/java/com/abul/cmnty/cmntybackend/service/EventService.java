package com.abul.cmnty.cmntybackend.service;

import com.abul.cmnty.cmntybackend.dto.EventRequest;
import com.abul.cmnty.cmntybackend.dto.EventResponse;
import com.abul.cmnty.cmntybackend.entity.Club;
import com.abul.cmnty.cmntybackend.entity.Event;
import com.abul.cmnty.cmntybackend.entity.Registration;
import com.abul.cmnty.cmntybackend.entity.User;
import com.abul.cmnty.cmntybackend.exception.EventFullException;
import com.abul.cmnty.cmntybackend.exception.ResourceNotFoundException;
import com.abul.cmnty.cmntybackend.exception.UnauthorizedException;
import com.abul.cmnty.cmntybackend.model.enums.EventStatus;
import com.abul.cmnty.cmntybackend.model.enums.RegistrationStatus;
import com.abul.cmnty.cmntybackend.repository.ClubRepository;
import com.abul.cmnty.cmntybackend.repository.EventRepository;
import com.abul.cmnty.cmntybackend.repository.RegistrationRepository;
import com.abul.cmnty.cmntybackend.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final ClubRepository clubRepository;
    private final RegistrationRepository registrationRepository;

    public EventService(EventRepository eventRepository, UserRepository userRepository,
                        ClubRepository clubRepository, RegistrationRepository registrationRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.clubRepository = clubRepository;
        this.registrationRepository = registrationRepository;
    }

    // -------------------------------------------------------
    // CREATE
    // -------------------------------------------------------
    public EventResponse createEvent(EventRequest request, Long hostId) {
        User host = userRepository.findById(hostId)
                .orElseThrow(() -> new ResourceNotFoundException("Host not found with id " + hostId));

        Club club = null;
        if (request.getClubId() != null) {
            club = clubRepository.findById(request.getClubId())
                    .orElseThrow(() -> new ResourceNotFoundException("Club not found with id " + request.getClubId()));
        }

        Event event = Event.builder()
                .title(request.getTitle())
                .dateTime(request.getDateTime())
                .capacity(request.getCapacity())
                .city(request.getCity())
                .host(host)
                .club(club)
                .status(EventStatus.UPCOMING)
                .build();

        return mapToResponse(eventRepository.save(event));
    }

    // -------------------------------------------------------
    // UPDATE (partial — only non-null fields)
    // -------------------------------------------------------
    @Transactional
    public EventResponse updateEvent(Long eventId, EventRequest request, Long requestingUserId) {
        Event event = eventRepository.findByIdWithLock(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id " + eventId));

        if (!event.getHost().getId().equals(requestingUserId)) {
            throw new UnauthorizedException("Only the host can update this event");
        }

        if (request.getTitle() != null) {
            event.setTitle(request.getTitle());
        }
        if (request.getDateTime() != null) {
            event.setDateTime(request.getDateTime());
        }
        if (request.getCity() != null) {
            event.setCity(request.getCity());
        }
        if (request.getCapacity() != null) {
            long confirmedCount = registrationRepository.countByEventIdAndStatus(eventId, RegistrationStatus.CONFIRMED);
            if (request.getCapacity() < confirmedCount) {
                throw new EventFullException("Cannot reduce capacity below current registration count");
            }
            event.setCapacity(request.getCapacity());
        }

        return mapToResponse(eventRepository.save(event));
    }

    // -------------------------------------------------------
    // GET ALL (paginated, optional city filter)
    // -------------------------------------------------------
    public Page<EventResponse> getAllEvents(String city, int page, int size) {
        var pageable = PageRequest.of(page, size, Sort.by("dateTime").ascending());

        Page<Event> events;
        if (city != null && !city.trim().isEmpty()) {
            events = eventRepository.findByCity(city, pageable);
        } else {
            events = eventRepository.findAll(pageable);
        }
        return events.map(this::mapToResponse);
    }

    // -------------------------------------------------------
    // GET BY ID
    // -------------------------------------------------------
    public EventResponse getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id " + id));
        return mapToResponse(event);
    }

    // -------------------------------------------------------
    // GET BY DATE RANGE (paginated, optional city filter)
    // -------------------------------------------------------
    public Page<EventResponse> getEventsByDateRange(String city, LocalDateTime from,
                                                     LocalDateTime to, int page, int size) {
        var pageable = PageRequest.of(page, size, Sort.by("dateTime").ascending());

        Page<Event> events;
        if (city != null && !city.trim().isEmpty()) {
            events = eventRepository.findByCityAndDateTimeBetween(city, from, to, pageable);
        } else {
            events = eventRepository.findByDateTimeBetween(from, to, pageable);
        }
        return events.map(this::mapToResponse);
    }

    // -------------------------------------------------------
    // CANCEL
    // -------------------------------------------------------
    @Transactional // BUG 2 FIX
    public EventResponse cancelEvent(Long eventId, Long requestingUserId) {
        Event event = eventRepository.findByIdWithLock(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id " + eventId));

        if (!event.getHost().getId().equals(requestingUserId)) {
            throw new UnauthorizedException("Only the host can cancel the event");
        }

        event.setStatus(EventStatus.CANCELLED);
        Event savedEvent = eventRepository.save(event);

        // Fetch all confirmed registrations for this event and update them to CANCELLED
        List<Registration> registrations = registrationRepository.findByEventAndStatus(event, RegistrationStatus.CONFIRMED);
        for (Registration reg : registrations) {
            reg.setStatus(RegistrationStatus.CANCELLED);
        }
        registrationRepository.saveAll(registrations);

        return mapToResponse(savedEvent);
    }

    // -------------------------------------------------------
    // MAPPING
    // -------------------------------------------------------
    private EventResponse mapToResponse(Event event) {
        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .dateTime(event.getDateTime())
                .capacity(event.getCapacity())
                .city(event.getCity())
                .status(event.getStatus())
                .hostName(event.getHost() != null ? event.getHost().getName() : null)
                .clubName(event.getClub() != null ? event.getClub().getName() : null)
                .build();
    }
}
