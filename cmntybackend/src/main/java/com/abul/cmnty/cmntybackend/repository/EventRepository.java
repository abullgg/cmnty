package com.abul.cmnty.cmntybackend.repository;

import com.abul.cmnty.cmntybackend.entity.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    // --- Non-paginated (kept for internal use, e.g. capacity checks) ---
    List<Event> findByCity(String city);

    // --- Paginated queries ---
    Page<Event> findByCity(String city, Pageable pageable);

    // --- Date range queries ---
    Page<Event> findByDateTimeBetween(LocalDateTime from, LocalDateTime to, Pageable pageable);

    Page<Event> findByCityAndDateTimeBetween(String city, LocalDateTime from,
                                              LocalDateTime to, Pageable pageable);
}
