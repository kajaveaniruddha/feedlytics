package com.feedlytics.service.notification.redis

import com.feedlytics.service.notification.ws.NotificationWebSocketRegistry
import org.slf4j.LoggerFactory
import org.springframework.data.redis.connection.Message
import org.springframework.data.redis.connection.MessageListener
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean
import org.springframework.data.redis.connection.RedisConnectionFactory
import org.springframework.stereotype.Component

@Component
@ConditionalOnBean(RedisConnectionFactory::class)
class NotificationRedisMessageListener(
    private val webSocketRegistry: NotificationWebSocketRegistry,
) : MessageListener {

    private val log = LoggerFactory.getLogger(javaClass)

    override fun onMessage(message: Message, pattern: ByteArray?) {
        try {
            val channel = String(message.channel)
            val userId = channel.substringAfterLast(':').toLong()
            val body = String(message.body)
            webSocketRegistry.broadcastText(userId, body)
        } catch (e: Exception) {
            log.warn("Failed to route redis notification: {}", e.message)
        }
    }
}
