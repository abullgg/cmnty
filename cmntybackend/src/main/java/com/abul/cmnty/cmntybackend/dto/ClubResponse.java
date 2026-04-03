package com.abul.cmnty.cmntybackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClubResponse {
    private Long id;
    private String name;
    private String city;
    private String hostName;
}
