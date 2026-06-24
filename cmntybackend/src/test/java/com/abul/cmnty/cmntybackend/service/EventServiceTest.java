package com.abul.cmnty.cmntybackend.service;

import com.abul.cmnty.cmntybackend.dto.EventRequest;
import com.abul.cmnty.cmntybackend.dto.EventResponse;
import com.abul.cmnty.cmntybackend.entity.Club;
import com.abul.cmnty.cmntybackend.entity.Event;
import com.abul.cmnty.cmntybackend.entity.User;
import com.abul.cmnty.cmntybackend.exception.UnauthorizedException;
import com.abul.cmnty.cmntybackend.model.enums.EventStatus;
import com.abul.cmnty.cmntybackend.repository.ClubRepository;
import com.abul.cmnty.cmntybackend.repository.EventRepository;
import com.abul.cmnty.cmntybackend.repository.UserRepository;
import com.abul.cmnty.cmntybackend.repository.RegistrationRepository;
import com.abul.cmnty.cmntybackend.model.enums.RegistrationStatus;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private UserRepository userRepository;
    
    @Mock
    private ClubRepository clubRepository;

    @Mock
    private RegistrationRepository registrationRepository;

    @InjectMocks
    private EventService eventService;

    @Test
    void createEvent_Success() {
        Long hostId = 1L;
        EventRequest request = EventRequest.builder()
                .title("Event Title")
                .description("A test event")
                .startTime(LocalDateTime.now())
                .endTime(LocalDateTime.now().plusHours(2))
                .capacity(50)
                .city("City")
                .category("Tech")
                .clubId(null)
                .build();
        
        User host = new User();
        host.setId(hostId);
        host.setName("HostName");

        Event savedEvent = new Event();
        savedEvent.setId(10L);
        savedEvent.setTitle("Event Title");
        savedEvent.setStatus(EventStatus.UPCOMING);
        savedEvent.setHost(host);

        when(userRepository.findById(hostId)).thenReturn(Optional.of(host));
        when(eventRepository.save(any(Event.class))).thenReturn(savedEvent);

        EventResponse response = eventService.createEvent(request, hostId);

        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertEquals("HostName", response.getHostName());
        assertEquals(EventStatus.UPCOMING, response.getStatus());
        verify(eventRepository, times(1)).save(any());
    }

    @Test
    void createEvent_WithClub_Success() {
        Long hostId = 1L;
        Long clubId = 2L;
        EventRequest request = EventRequest.builder()
                .title("Event Title")
                .description("A club event")
                .startTime(LocalDateTime.now())
                .endTime(LocalDateTime.now().plusHours(2))
                .capacity(50)
                .city("City")
                .category("Tech")
                .clubId(clubId)
                .build();
        
        User host = new User();
        host.setId(hostId);

        Club club = new Club();
        club.setId(clubId);
        club.setName("Tech Club");

        Event savedEvent = new Event();
        savedEvent.setId(10L);
        savedEvent.setHost(host);
        savedEvent.setClub(club);

        when(userRepository.findById(hostId)).thenReturn(Optional.of(host));
        when(clubRepository.findById(clubId)).thenReturn(Optional.of(club));
        when(eventRepository.save(any(Event.class))).thenReturn(savedEvent);

        EventResponse response = eventService.createEvent(request, hostId);

        assertNotNull(response);
        assertEquals("Tech Club", response.getClubName());
    }

    @Test
    void cancelEvent_Success() {
        Long eventId = 1L;
        Long requestingUserId = 2L;

        User host = new User();
        host.setId(requestingUserId);

        Event event = new Event();
        event.setId(eventId);
        event.setHost(host);
        event.setStatus(EventStatus.UPCOMING);

        when(eventRepository.findByIdWithLock(eventId)).thenReturn(Optional.of(event));
        when(eventRepository.save(any(Event.class))).thenReturn(event);
        when(registrationRepository.findByEventAndStatus(any(Event.class), any(RegistrationStatus.class)))
                .thenReturn(java.util.Collections.emptyList());

        EventResponse response = eventService.cancelEvent(eventId, requestingUserId);

        assertEquals(EventStatus.CANCELLED, response.getStatus());
        assertEquals(EventStatus.CANCELLED, event.getStatus());
    }

    @Test
    void cancelEvent_Unauthorized_ThrowsException() {
        Long eventId = 1L;
        
        User host = new User();
        host.setId(2L); // Actual host is 2L

        Event event = new Event();
        event.setId(eventId);
        event.setHost(host);

        when(eventRepository.findByIdWithLock(eventId)).thenReturn(Optional.of(event));

        assertThrows(UnauthorizedException.class, () -> eventService.cancelEvent(eventId, 99L)); // Requesting user is 99L
    }
}
