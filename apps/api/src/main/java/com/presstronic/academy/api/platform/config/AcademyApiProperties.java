package com.presstronic.academy.api.platform.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "academy.api")
public record AcademyApiProperties(String applicationName) {
}
