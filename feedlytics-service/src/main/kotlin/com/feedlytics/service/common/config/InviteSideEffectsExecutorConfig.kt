package com.feedlytics.service.common.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.task.TaskExecutor
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor

@Configuration
class InviteSideEffectsExecutorConfig {

    /**
     * Runs invite email + in-app notification work **after** the invite transaction commits,
     * without blocking the HTTP response (good UX for the inviter).
     */
    @Bean(name = ["inviteSideEffectsExecutor"])
    fun inviteSideEffectsExecutor(): TaskExecutor {
        val ex = ThreadPoolTaskExecutor()
        ex.corePoolSize = 2
        ex.maxPoolSize = 8
        ex.queueCapacity = 200
        ex.setThreadNamePrefix("invite-sidefx-")
        ex.initialize()
        return ex
    }
}
