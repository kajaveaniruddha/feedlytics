package com.feedlytics.service.notification.redis

import com.fasterxml.jackson.databind.ObjectMapper
import org.slf4j.LoggerFactory
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean
import org.springframework.data.redis.connection.RedisConnectionFactory
import org.springframework.data.redis.core.StringRedisTemplate
import org.springframework.stereotype.Component

@Component
@ConditionalOnBean(RedisConnectionFactory::class)
class NotificationRedisPublisher(
    private val redisTemplate: StringRedisTemplate,
    private val objectMapper: ObjectMapper,
) {
    private val log = LoggerFactory.getLogger(javaClass)

    fun channelForUser(recipientUserId: Long): String = "feedlytics:notify:user:$recipientUserId"

    fun publish(recipientUserId: Long, payload: Map<String, Any?>) {
        val channel = channelForUser(recipientUserId)
        val json = objectMapper.writeValueAsString(payload)
        redisTemplate.convertAndSend(channel, json)
        log.debug("Published notification message to channel={}", channel)
    }
}
