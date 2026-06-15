package com.abul.cmnty.cmntybackend.entity;

import com.abul.cmnty.cmntybackend.model.enums.EventStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Integer capacity;

    private String city;

    private String category;

    @ManyToOne
    @JoinColumn(name = "host_id", nullable = false)
    private User host;

    // A club is optional — an event can be standalone
    @ManyToOne
    @JoinColumn(name = "club_id", nullable = true)
    private Club club;

    @Enumerated(EnumType.STRING)
    private EventStatus status;
}
