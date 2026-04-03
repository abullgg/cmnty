package com.abul.cmnty.cmntybackend.controller;

import com.abul.cmnty.cmntybackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/test")
    public String test() {
        return "Backend working! Total users: " + userRepository.count();
    }
}