package com.feedlytics.service.common.config

import com.fasterxml.jackson.databind.ObjectMapper
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class JacksonObjectMapperConfig {

    @Bean
    fun objectMapper(): ObjectMapper = ObjectMapper()
}
