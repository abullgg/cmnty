package com.abul.cmnty.cmntybackend.service;

import com.abul.cmnty.cmntybackend.dto.RegistrationResponse;
import com.abul.cmnty.cmntybackend.entity.Event;
import com.abul.cmnty.cmntybackend.entity.Registration;
import com.abul.cmnty.cmntybackend.entity.User;
import com.abul.cmnty.cmntybackend.exception.AlreadyRegisteredException;
import com.abul.cmnty.cmntybackend.exception.EventFullException;
import com.abul.cmnty.cmntybackend.model.enums.EventStatus;
import com.abul.cmnty.cmntybackend.model.enums.RegistrationStatus;
import com.abul.cmnty.cmntybackend.repository.EventRepository;
import com.abul.cmnty.cmntybackend.repository.RegistrationRepository;
import com.abul.cmnty.cmntybackend.repository.UserRepository;
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
class RegistrationServiceTest {

    @Mock
    private RegistrationRepository registrationRepository;

    @Mock
    private EventRepository eventRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private RegistrationService registrationService;

    @Test
    void registerForEvent_Success() {
        Long eventId = 1L;
        Long userId = 2L;

        Event event = new Event();
        event.setId(eventId);
        event.setTitle("Marathon");
        event.setStatus(EventStatus.UPCOMING);
        event.setCapacity(10);

        User user = new User();
        user.setId(userId);

        Registration savedRegistration = new Registration();
        savedRegistration.setId(100L);
        savedRegistration.setEvent(event);
        savedRegistration.setRegisteredAt(LocalDateTime.now());
        savedRegistration.setStatus(RegistrationStatus.CONFIRMED);

        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(registrationRepository.existsByEventIdAndUserIdAndStatus(eventId, userId, RegistrationStatus.CONFIRMED)).thenReturn(false);
        when(registrationRepository.countByEventIdAndStatus(eventId, RegistrationStatus.CONFIRMED)).thenReturn(5L);
        when(registrationRepository.save(any(Registration.class))).thenReturn(savedRegistration);

        RegistrationResponse response = registrationService.registerForEvent(eventId, userId);

        assertNotNull(response);
        assertEquals(100L, response.getId());
        assertEquals(RegistrationStatus.CONFIRMED, response.getStatus());
        verify(registrationRepository, times(1)).save(any(Registration.class));
    }

    @Test
    void registerForEvent_EventFull_ThrowsException() {
        Long eventId = 1L;
        Long userId = 2L;

        Event event = new Event();
        event.setId(eventId);
        event.setStatus(EventStatus.UPCOMING);
        event.setCapacity(2);

        User user = new User();
        user.setId(userId);

        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(registrationRepository.existsByEventIdAndUserIdAndStatus(eventId, userId, RegistrationStatus.CONFIRMED)).thenReturn(false);
        when(registrationRepository.countByEventIdAndStatus(eventId, RegistrationStatus.CONFIRMED)).thenReturn(2L);

        assertThrows(EventFullException.class, () -> registrationService.registerForEvent(eventId, userId));
        verify(registrationRepository, never()).save(any(Registration.class));
    }

    @Test
    void registerForEvent_AlreadyRegistered_ThrowsException() {
        Long eventId = 1L;
        Long userId = 2L;

        Event event = new Event();
        event.setId(eventId);
        event.setStatus(EventStatus.UPCOMING);

        User user = new User();
        user.setId(userId);

        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(registrationRepository.existsByEventIdAndUserIdAndStatus(eventId, userId, RegistrationStatus.CONFIRMED)).thenReturn(true);

        assertThrows(AlreadyRegisteredException.class, () -> registrationService.registerForEvent(eventId, userId));
    }

    @Test
    void registerForEvent_NotUpcoming_ThrowsException() {
        Long eventId = 1L;
        Long userId = 2L;

        Event event = new Event();
        event.setId(eventId);
        event.setStatus(EventStatus.CANCELLED);

        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));

        assertThrows(IllegalStateException.class, () -> registrationService.registerForEvent(eventId, userId));
    }
}
