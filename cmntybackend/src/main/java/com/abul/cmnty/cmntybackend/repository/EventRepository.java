package com.abul.cmnty.cmntybackend.repository;

import com.abul.cmnty.cmntybackend.entity.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT e FROM Event e WHERE e.id = :id")
    Optional<Event> findByIdWithLock(@Param("id") Long id);

    // --- Non-paginated (kept for internal use, e.g. capacity checks) ---
    List<Event> findByCity(String city);

    // --- Paginated queries ---
    Page<Event> findByCity(String city, Pageable pageable);

    // --- Date range queries ---
    Page<Event> findByDateTimeBetween(LocalDateTime from, LocalDateTime to, Pageable pageable);

    Page<Event> findByCityAndDateTimeBetween(String city, LocalDateTime from,
                                              LocalDateTime to, Pageable pageable);
}
