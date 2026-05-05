package com.feedlytics.service

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.ConfigurationPropertiesScan
import org.springframework.boot.runApplication

@SpringBootApplication
@ConfigurationPropertiesScan
class FeedlyticsServiceApplication

fun main(args: Array<String>) {
	runApplication<FeedlyticsServiceApplication>(*args)
}
