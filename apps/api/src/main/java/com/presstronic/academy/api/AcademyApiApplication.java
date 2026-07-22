package com.presstronic.academy.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class AcademyApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(AcademyApiApplication.class, args);
    }
}
