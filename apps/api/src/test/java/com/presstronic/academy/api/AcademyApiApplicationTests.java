package com.presstronic.academy.api;

import com.presstronic.academy.api.platform.config.AcademyApiProperties;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class AcademyApiApplicationTests {

    @Autowired
    private AcademyApiProperties properties;

    @Test
    void contextLoadsWithTypedConfiguration() {
        assertThat(properties.applicationName()).isEqualTo("Presstronic Academy API");
    }
}
