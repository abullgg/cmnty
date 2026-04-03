package com.abul.cmnty.cmntybackend.dto;

import com.abul.cmnty.cmntybackend.model.enums.RegistrationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationResponse {
    private Long id;
    private String eventTitle;
    private LocalDateTime registeredAt;
    private RegistrationStatus status;
    private String userName; // name of the user who registered
}
