package com.abul.cmnty.cmntybackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventRequest {
    private String title;
    private LocalDateTime dateTime;
    private Integer capacity;
    private String city;
    private Long clubId;
}
