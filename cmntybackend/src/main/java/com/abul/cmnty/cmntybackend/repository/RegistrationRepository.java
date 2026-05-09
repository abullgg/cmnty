package com.abul.cmnty.cmntybackend.repository;

import com.abul.cmnty.cmntybackend.entity.Event;
import com.abul.cmnty.cmntybackend.entity.Registration;
import com.abul.cmnty.cmntybackend.model.enums.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    long countByEventIdAndStatus(Long eventId, RegistrationStatus status);
    boolean existsByEventIdAndUserIdAndStatus(Long eventId, Long userId, RegistrationStatus status);
    Optional<Registration> findByEventIdAndUserId(Long eventId, Long userId);
    List<Registration> findByEvent(Event event);
    List<Registration> findByEventAndStatus(Event event, RegistrationStatus status);
}

