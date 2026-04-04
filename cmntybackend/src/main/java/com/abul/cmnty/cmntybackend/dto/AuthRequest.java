package com.abul.cmnty.cmntybackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthRequest {
    private String name; // Only used for registration
    private String email;
    private String password;
}
