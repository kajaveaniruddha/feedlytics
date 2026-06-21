package com.feedlytics.service.notification.config

import com.feedlytics.service.notification.redis.NotificationRedisMessageListener
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.redis.connection.RedisConnectionFactory
import org.springframework.data.redis.listener.PatternTopic
import org.springframework.data.redis.listener.RedisMessageListenerContainer

@Configuration
@ConditionalOnBean(RedisConnectionFactory::class)
class NotificationRedisConfig {

    @Bean
    fun redisMessageListenerContainer(
        connectionFactory: RedisConnectionFactory,
        notificationRedisMessageListener: NotificationRedisMessageListener,
    ): RedisMessageListenerContainer {
        val container = RedisMessageListenerContainer()
        container.setConnectionFactory(connectionFactory)
        container.addMessageListener(
            notificationRedisMessageListener,
            PatternTopic("feedlytics:notify:user:*"),
        )
        return container
    }
}
