package com.abul.cmnty.cmntybackend.dto;

import com.abul.cmnty.cmntybackend.model.enums.EventStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventResponse {
    private Long id;
    private String title;
    private LocalDateTime dateTime;
    private Integer capacity;
    private String city;
    private EventStatus status;
    private String hostName;
    private String clubName; // nullable
}
