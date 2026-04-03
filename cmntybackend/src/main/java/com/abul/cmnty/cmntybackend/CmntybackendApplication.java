package com.abul.cmnty.cmntybackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan("com.abul.cmnty.cmntybackend.entity")
public class CmntybackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(CmntybackendApplication.class, args);
	}

}
